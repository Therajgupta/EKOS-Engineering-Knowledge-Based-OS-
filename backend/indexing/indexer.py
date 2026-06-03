from backend.embeddings.embedder import Embedder
from backend.vector_db.qdrant_manager import QdrantManager


class Indexer:

    def __init__(
        self,
        repo_name: str,
        *,
        embedder: Embedder | None = None,
        db: QdrantManager | None = None,
    ):
        self.repo_name = repo_name
        self.embedder = embedder or Embedder()
        self.db = db or QdrantManager()
        self.db.create_collection(force=False)  # only creates if missing

    def index_object(self, knowledge_object, object_id: int):
        """
        Embed the FULL semantic content of the knowledge object,
        not just the type label. This is the key fix for retrieval quality.

        The embedding text is built as:
            <chunk_type> <symbol_name>\n<content>

        This ensures the vector captures what the code actually does.
        """
        embedding_text = (
            f"{knowledge_object.chunk_type} {knowledge_object.symbol_name}\n"
            f"{knowledge_object.content}"
        )

        vector = self.embedder.embed(embedding_text)

        self.db.insert_knowledge_object(
            object_id=object_id,
            vector=vector,
            knowledge_object=knowledge_object,
        )
