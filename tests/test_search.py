from backend.vector_db.qdrant_manager import QdrantManager
from backend.embeddings.embedder import Embedder
from backend.models.knowledge_object import KnowledgeObject

db = QdrantManager()

db.create_collection()

embedder = Embedder()

obj = KnowledgeObject(
    repository="mern-app",
    file_path="server.js",
    chunk_type="import",
    symbol_name="express",
    content="const express = require('express')",
    language="javascript",
    start_line=0,
    end_line=0
)

vector = embedder.embed(
    "Import express library"
)

db.insert_knowledge_object( 
    object_id=1,
    vector=vector,
    knowledge_object=obj
)

query_vector = embedder.embed(
    "How to import express library?"
)

results = db.search(query_vector)
for point in results.points:

    print("\nScore:")
    print(point.score)

    print("\nPayload:")
    print(point.payload)