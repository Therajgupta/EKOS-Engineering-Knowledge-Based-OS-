from backend.indexing.indexer import Indexer
from backend.models.knowledge_object import KnowledgeObject


indexer = Indexer()

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

indexer.index_object(
    knowledge_object=obj,
    object_id=1
)