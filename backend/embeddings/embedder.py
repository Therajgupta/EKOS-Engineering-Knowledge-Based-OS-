from sentence_transformers import SentenceTransformer


class Embedder:

    def __init__(self):
        self.model = SentenceTransformer("BAAI/bge-small-en-v1.5")

    def embed(self, text: str) -> list[float]:
        """
        Embed a string into a 384-dim normalized vector.
        Always embed the full semantic text, not just a label.
        """
        return self.model.encode(
            text,
            normalize_embeddings=True
        ).tolist()
