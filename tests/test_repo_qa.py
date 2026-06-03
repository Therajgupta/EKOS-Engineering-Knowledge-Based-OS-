from backend.embeddings.embedder import Embedder
from backend.vector_db.qdrant_manager import QdrantManager


embedder = Embedder()

db = QdrantManager()


question = "Which React components exist?"

query_vector = embedder.embed(
    question
)

results = db.search(
    query_vector
)

print("\nQUESTION:")
print(question)

print("\nRESULTS:\n")

for point in results.points:

    print("Score:", point.score)

    print("Payload:")

    print(point.payload)

    print("\n-------------------\n")