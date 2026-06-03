"""
EKOS — Full indexing pipeline.

Usage:
    python -m backend.main                          # index default mern-app
    python -m backend.main <github_url>             # index any GitHub repo
    python -m backend.main <github_url> <repo_name> # index with custom name
"""

import sys
from pathlib import Path

from backend.ingestion.github_clone import clone_repository
from backend.parsers.treesitter_parser import TreeSitterParser
from backend.parsers.language_detector import detect_language
from backend.extractors.javascript_extractor import JavaScriptExtractor
from backend.indexing.indexer import Indexer

from backend.parsers.treesitter_parser import get_ts_parser, HAS_TREE_SITTER as HAS_TS
if not HAS_TS:
    print("[Warning] tree-sitter grammars not available — falling back to raw content extraction.")


def index_repository(repo_url: str, repo_name: str | None = None):
    """Clone (if needed) and index a repository into Qdrant."""

    print(f"\n{'='*60}")
    print(f"  EKOS — Indexing Pipeline")
    print(f"  Repository : {repo_url}")
    print(f"{'='*60}\n")

    # ── Step 1: Clone ──────────────────────────────────────────────
    print("[1/5] Cloning repository...")
    repo_path = clone_repository(repo_url)

    if repo_name is None:
        repo_name = Path(repo_path).name
    print(f"      Repo path  : {repo_path}")
    print(f"      Repo name  : {repo_name}")

    # ── Step 2: Discover files ────────────────────────────────────
    print("\n[2/5] Discovering source files...")
    parser = TreeSitterParser()
    files = parser.get_source_files(repo_path)
    # Filter out node_modules, .git, dist, build
    skip_dirs = {"node_modules", ".git", "dist", "build", "__pycache__", ".next"}
    files = [
        f for f in files
        if not any(part in skip_dirs for part in f.parts)
    ]
    print(f"      Found {len(files)} source files")

    # ── Step 3: Parse & Extract ───────────────────────────────────
    print("\n[3/5] Parsing AST and extracting knowledge objects...")
    js_extractor = JavaScriptExtractor()
    all_objects = []
    skipped = 0

    for file in files:
        lang = detect_language(file)
        if lang is None:
            continue

        try:
            source = file.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            skipped += 1
            continue

        if lang in ("javascript", "typescript", "tsx", "jsx") and HAS_TS:
            try:
                ts_parser = get_ts_parser(lang)
                if ts_parser is None:
                    raise ValueError(f"No parser for {lang}")
                tree = ts_parser.parse(bytes(source, "utf8"))
                objects = js_extractor.extract(
                    tree.root_node, source, file, repo_name
                )
                all_objects.extend(objects)
            except Exception as e:
                print(f"      [!] Parse error {file.name}: {e}")
                # fallback: store raw file content as a single chunk
                from backend.models.knowledge_object import KnowledgeObject
                all_objects.append(KnowledgeObject(
                    repository=repo_name,
                    file_path=str(file),
                    chunk_type="file",
                    symbol_name=file.name,
                    content=source[:800],
                    language=lang,
                    start_line=0,
                    end_line=source.count("\n"),
                ))
        else:
            # Fallback: store the whole file as a knowledge object
            from backend.models.knowledge_object import KnowledgeObject
            all_objects.append(KnowledgeObject(
                repository=repo_name,
                file_path=str(file),
                chunk_type="file",
                symbol_name=file.name,
                content=source[:800],
                language=lang or "unknown",
                start_line=0,
                end_line=source.count("\n"),
            ))

    print(f"      Extracted {len(all_objects)} knowledge objects "
          f"({skipped} files skipped)")

    if not all_objects:
        print("\n[!] No knowledge objects extracted. Check the repo structure.")
        return

    # ── Step 4: Embed & Index ─────────────────────────────────────
    print("\n[4/5] Embedding and indexing into Qdrant...")
    indexer = Indexer(repo_name=repo_name)

    for i, obj in enumerate(all_objects):
        indexer.index_object(obj, object_id=i)
        if (i + 1) % 50 == 0:
            print(f"      Indexed {i + 1}/{len(all_objects)}...")

    print(f"      ✓ Indexed {len(all_objects)} objects")

    # ── Step 5: Verify ─────────────────────────────────────────────
    print("\n[5/5] Verifying...")
    count = indexer.db.count()
    print(f"      Total points in Qdrant: {count}")
    print(f"\n{'='*60}")
    print(f"  ✓  Done! Repository '{repo_name}' is ready to query.")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    if len(sys.argv) >= 2:
        url = sys.argv[1]
        name = sys.argv[2] if len(sys.argv) >= 3 else None
    else:
        url = "https://github.com/doananhtingithub40102/mern-app.git"
        name = "mern-app"

    index_repository(url, name)
