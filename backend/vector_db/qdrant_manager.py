import hashlib
import os
import threading
from pathlib import Path

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PointStruct,
    VectorParams,
)

# Always resolve to the project root regardless of cwd
QDRANT_PATH = str(Path(__file__).resolve().parent.parent.parent / "qdrant_data")

COLLECTION = "knowledge_objects"

_client: QdrantClient | None = None
_client_lock = threading.Lock()


def get_qdrant_client() -> QdrantClient:
    """Single Qdrant client per process. Use QDRANT_URL for a remote/server instance."""
    global _client
    if _client is None:
        with _client_lock:
            if _client is None:
                url = os.getenv("QDRANT_URL", "").strip()
                try:
                    if url:
                        _client = QdrantClient(url=url)
                    else:
                        _client = QdrantClient(path=QDRANT_PATH)
                except Exception as e:
                    msg = str(e)
                    if "already accessed" in msg.lower() or "alreadylocked" in msg.lower():
                        raise RuntimeError(
                            "Qdrant database is locked by another running API process. "
                            "Run scripts\\stop-backend.bat (or close the other terminal), "
                            "wait 2 seconds, then start again. "
                            "Only one backend instance can use local qdrant_data at a time."
                        ) from e
                    raise
    return _client


def close_qdrant_client() -> None:
    """Release the on-disk Qdrant lock so another process (or reload) can start."""
    global _client
    with _client_lock:
        if _client is not None:
            try:
                _client.close()
            except Exception:
                pass
            _client = None


def make_point_id(repository: str, object_id: int) -> int:
    """Stable, repo-scoped point IDs so multiple repositories do not overwrite each other."""
    digest = hashlib.sha256(f"{repository}:{object_id}".encode()).hexdigest()
    # Qdrant point IDs must be unsigned integers; keep within a safe range.
    return int(digest[:15], 16)


def _repo_filter(repo_name: str) -> Filter:
    return Filter(
        must=[
            FieldCondition(
                key="repository",
                match=MatchValue(value=repo_name),
            )
        ]
    )


class QdrantManager:

    def __init__(self):
        self.client = get_qdrant_client()

    def collection_exists(self) -> bool:
        try:
            self.client.get_collection(COLLECTION)
            return True
        except Exception:
            return False

    def create_collection(self, force: bool = False):
        vectors = VectorParams(size=384, distance=Distance.COSINE)
        if force and self.collection_exists():
            self.client.delete_collection(COLLECTION)
        if not self.collection_exists():
            self.client.create_collection(
                collection_name=COLLECTION,
                vectors_config=vectors,
            )
            print(f"[Qdrant] Collection '{COLLECTION}' created.")
        else:
            print(f"[Qdrant] Collection '{COLLECTION}' already exists, skipping creation.")

    def count(self) -> int:
        try:
            info = self.client.get_collection(COLLECTION)
            return info.points_count or 0
        except Exception:
            return 0

    def insert_knowledge_object(
        self,
        object_id: int,
        vector: list,
        knowledge_object,
        *,
        repository: str | None = None,
    ):
        repo = repository or getattr(knowledge_object, "repository", None) or "default"
        point_id = make_point_id(repo, object_id)
        self.client.upsert(
            collection_name=COLLECTION,
            points=[
                PointStruct(
                    id=point_id,
                    vector=vector,
                    payload=knowledge_object.model_dump(),
                )
            ],
        )

    def search(
        self,
        query_vector: list,
        limit: int = 8,
        repository: str | None = None,
    ):
        kwargs: dict = {
            "collection_name": COLLECTION,
            "query": query_vector,
            "limit": limit,
            "with_payload": True,
        }
        if repository:
            kwargs["query_filter"] = _repo_filter(repository)
        return self.client.query_points(**kwargs)

    def get_repository_stats(self, repo_name: str) -> dict:
        """Return basic stats for a repository by scrolling all its points."""
        try:
            all_points = []
            offset = None
            while True:
                results, offset = self.client.scroll(
                    collection_name=COLLECTION,
                    scroll_filter=_repo_filter(repo_name),
                    limit=1000,
                    offset=offset,
                    with_payload=True,
                )
                all_points.extend(results)
                if offset is None:
                    break

            files = set()
            chunk_types: dict[str, int] = {}
            for p in all_points:
                files.add(p.payload.get("file_path", ""))
                ct = p.payload.get("chunk_type", "unknown")
                chunk_types[ct] = chunk_types.get(ct, 0) + 1

            return {
                "total_objects": len(all_points),
                "total_files": len(files),
                "chunk_types": chunk_types,
            }
        except Exception as e:
            return {"error": str(e)}

    def list_repositories(self) -> list[str]:
        """Return distinct repository names from the collection."""
        try:
            repos: set[str] = set()
            offset = None
            while True:
                results, offset = self.client.scroll(
                    collection_name=COLLECTION,
                    limit=1000,
                    offset=offset,
                    with_payload=True,
                )
                for p in results:
                    repo = p.payload.get("repository")
                    if repo:
                        repos.add(repo)
                if offset is None:
                    break
            return sorted(repos)
        except Exception:
            return []
