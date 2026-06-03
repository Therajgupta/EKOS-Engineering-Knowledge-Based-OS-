from backend.embeddings.embedder import Embedder

embedder = Embedder()

vector = embedder.embed(
    "Import express library"
)

print("Dimensions:", len(vector))

print(vector[:10])