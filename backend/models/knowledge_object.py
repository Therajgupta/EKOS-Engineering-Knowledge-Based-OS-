from pydantic import BaseModel


class KnowledgeObject(BaseModel):

    repository: str

    file_path: str

    chunk_type: str

    symbol_name: str

    content: str

    language: str

    start_line: int

    end_line: int