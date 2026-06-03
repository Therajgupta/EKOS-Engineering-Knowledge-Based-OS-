"""
EKOS Backend API
================
Endpoints:
  POST /ask                    — ask a question about a repository
  POST /index                  — index a GitHub repository (background task)
  GET  /repositories           — list all indexed repositories
  GET  /repositories/{repo_name}    — stats for a specific repository
  GET  /health                 — health check
"""

import os
import threading
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.embeddings.embedder import Embedder
from backend.vector_db.qdrant_manager import QdrantManager, close_qdrant_client
from backend.router.question_router import QuestionRouter
from backend.retrieval.context_builder import ContextBuilder
from backend.llm.llm_manager import LLMManager

# Set during app lifespan (not at import) so uvicorn --reload does not lock Qdrant twice.
embedder: Embedder | None = None
db: QdrantManager | None = None
router: QuestionRouter | None = None
builder: ContextBuilder | None = None
llm: LLMManager | None = None

_indexing_jobs: dict[str, dict] = {}
_jobs_lock = threading.Lock()


def _require_services():
    if embedder is None or db is None or router is None or builder is None or llm is None:
        raise HTTPException(
            status_code=503,
            detail="Backend is still starting. Wait a few seconds and try again.",
        )


@asynccontextmanager
async def lifespan(app: FastAPI):
    global embedder, db, router, builder, llm
    embedder = Embedder()
    db = QdrantManager()
    router = QuestionRouter()
    builder = ContextBuilder()
    llm = LLMManager()
    yield
    close_qdrant_client()
    embedder = db = router = builder = llm = None


app = FastAPI(title="EKOS API", version="0.1.0", lifespan=lifespan)

_cors_origins = [
    o.strip()
    for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_origin_regex=r"https://.*\.(vercel\.app|netlify\.app)",
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    question: str
    repository: str | None = None


class IndexRequest(BaseModel):
    github_url: str
    repo_name: str | None = None


@app.get("/health")
def health():
    ready = db is not None
    return {"status": "ok" if ready else "starting", "version": "0.1.0"}


@app.post("/ask")
def ask(req: AskRequest):
    _require_services()
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    query_vector = embedder.embed(req.question)
    results = db.search(query_vector, limit=8, repository=req.repository)
    context = builder.build(results)
    route = router.route(req.question)

    prompt = (
        f"Question: {req.question}\n\n"
        f"Repository Context:\n{context}\n\n"
        "Answer the question using ONLY the provided context. "
        "Cite specific file paths when relevant. "
        "If the context is insufficient, say so."
    )

    if route == "small":
        answer = llm.ask_small(prompt)
    else:
        answer = llm.ask_large(prompt)

    citations = []
    for point in results.points:
        fp = point.payload.get("file_path", "")
        if fp:
            try:
                rel = Path(fp).name
            except Exception:
                rel = fp
            citations.append({
                "file": rel,
                "full_path": fp,
                "chunk_type": point.payload.get("chunk_type"),
                "symbol_name": point.payload.get("symbol_name"),
                "start_line": point.payload.get("start_line"),
            })

    return {
        "answer": answer,
        "route": route,
        "model": "llama-3.1-8b-instant" if route == "small" else "llama-3.3-70b-versatile",
        "citations": citations,
        "context_chunks": len(results.points),
    }


@app.post("/index")
def index_repository(req: IndexRequest, background_tasks: BackgroundTasks):
    _require_services()
    from urllib.parse import urlparse

    url = req.github_url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="github_url is required.")

    repo_name = req.repo_name
    if not repo_name:
        path_part = urlparse(url).path.rstrip("/")
        repo_name = Path(path_part).stem.replace(".git", "")

    with _jobs_lock:
        if repo_name in _indexing_jobs and _indexing_jobs[repo_name]["status"] == "running":
            return {"message": f"Already indexing '{repo_name}'", "repo_name": repo_name}

        _indexing_jobs[repo_name] = {
            "status": "running",
            "step": "starting",
            "objects_indexed": 0,
            "error": None,
        }

    background_tasks.add_task(_run_indexing, url, repo_name)
    return {"message": f"Indexing started for '{repo_name}'", "repo_name": repo_name}


@app.get("/index/{repo_name}/status")
def indexing_status(repo_name: str):
    with _jobs_lock:
        job = _indexing_jobs.get(repo_name)
    if not job:
        return {"status": "not_found"}
    return {"repo_name": repo_name, **job}


@app.get("/repositories")
def list_repositories():
    _require_services()
    repos = db.list_repositories()
    result = []
    for name in repos:
        stats = db.get_repository_stats(name)
        result.append({"name": name, "status": "indexed", **stats})
    return {"repositories": result}


@app.get("/repositories/{repo_name}")
def get_repository(repo_name: str):
    _require_services()
    repos = db.list_repositories()
    if repo_name not in repos:
        raise HTTPException(status_code=404, detail=f"Repository '{repo_name}' not found.")
    stats = db.get_repository_stats(repo_name)
    return {"name": repo_name, "status": "indexed", **stats}


def _run_indexing(repo_url: str, repo_name: str):
    try:
        _set_job(repo_name, step="cloning")
        from backend.ingestion.github_clone import clone_repository
        repo_path = clone_repository(repo_url)

        _set_job(repo_name, step="parsing")
        from backend.parsers.treesitter_parser import TreeSitterParser
        from backend.parsers.language_detector import detect_language
        from backend.extractors.javascript_extractor import JavaScriptExtractor
        from backend.indexing.indexer import Indexer
        from backend.models.knowledge_object import KnowledgeObject
        from backend.parsers.treesitter_parser import get_ts_parser, HAS_TREE_SITTER as has_ts

        parser = TreeSitterParser()
        files = parser.get_source_files(repo_path)
        skip_dirs = {"node_modules", ".git", "dist", "build", "__pycache__", ".next"}
        files = [f for f in files if not any(p in skip_dirs for p in f.parts)]

        js_extractor = JavaScriptExtractor()
        all_objects: list[KnowledgeObject] = []

        _set_job(repo_name, step="extracting")
        for file in files:
            lang = detect_language(file)
            if lang is None:
                continue
            try:
                source = file.read_text(encoding="utf-8", errors="ignore")
            except Exception:
                continue

            if lang in ("javascript", "typescript", "tsx", "jsx") and has_ts:
                try:
                    ts_parser = get_ts_parser(lang)
                    if ts_parser is None:
                        raise ValueError(f"No parser for {lang}")
                    tree = ts_parser.parse(bytes(source, "utf8"))
                    objects = js_extractor.extract(tree.root_node, source, file, repo_name)
                    all_objects.extend(objects)
                except Exception:
                    all_objects.append(KnowledgeObject(
                        repository=repo_name, file_path=str(file),
                        chunk_type="file", symbol_name=file.name,
                        content=source[:800], language=lang,
                        start_line=0, end_line=source.count("\n"),
                    ))
            else:
                all_objects.append(KnowledgeObject(
                    repository=repo_name, file_path=str(file),
                    chunk_type="file", symbol_name=file.name,
                    content=source[:800], language=lang or "unknown",
                    start_line=0, end_line=source.count("\n"),
                ))

        _set_job(repo_name, step="embedding", objects_indexed=0)
        indexer = Indexer(repo_name=repo_name, embedder=embedder, db=db)

        for i, obj in enumerate(all_objects):
            indexer.index_object(obj, object_id=i)
            if (i + 1) % 20 == 0:
                _set_job(repo_name, step="embedding", objects_indexed=i + 1)

        _set_job(repo_name, status="completed", step="done",
                 objects_indexed=len(all_objects))

    except Exception as e:
        _set_job(repo_name, status="failed", step="error", error=str(e))


def _set_job(repo_name: str, status: str = "running", **kwargs):
    with _jobs_lock:
        if repo_name not in _indexing_jobs:
            _indexing_jobs[repo_name] = {}
        _indexing_jobs[repo_name]["status"] = status
        _indexing_jobs[repo_name].update(kwargs)
