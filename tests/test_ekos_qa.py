from backend.embeddings.embedder import Embedder
from backend.vector_db.qdrant_manager import QdrantManager

from backend.router.question_router import QuestionRouter
from backend.retrieval.context_builder import ContextBuilder

from backend.llm.llm_manager import LLMManager


question = "Which React components exist?"


embedder = Embedder()

db = QdrantManager()

router = QuestionRouter()

builder = ContextBuilder()

llm = LLMManager()


query_vector = embedder.embed(
    question
)

results = db.search(
    query_vector
)

context = builder.build(
    results
)

route = router.route(
    question
)

prompt = f"""
You are an expert software engineer.

Answer the question using ONLY
the provided repository context.

Question:
{question}

Repository Context:
{context}
"""


if route == "small":

    answer = llm.ask_small(
        prompt
    )

else:

    answer = llm.ask_large(
        prompt
    )

print("\nQUESTION:")
print(question)

print("\nROUTE:")
print(route)

print("\nANSWER:")
print(answer)