# tests/test_qdrant_query_signature.py

from qdrant_client import QdrantClient

client = QdrantClient(":memory:")

help(client.query_points)