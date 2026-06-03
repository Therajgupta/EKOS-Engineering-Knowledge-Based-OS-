from pathlib import Path

from tree_sitter import Parser
from tree_sitter_language_pack import get_language

from backend.parsers.treesitter_parser import TreeSitterParser
from backend.parsers.language_detector import detect_language

from backend.extractors.javascript_extractor import JavaScriptExtractor
from backend.indexing.indexer import Indexer


repo_path = Path("repos/mern-app")

file_parser = TreeSitterParser()

files = file_parser.get_source_files(repo_path)

print("Files Found:", len(files))

indexer = Indexer()

object_id = 1

for file in files:

    language = detect_language(file)

    if language != "javascript":
        continue

    print("\nProcessing:", file)

    content = file.read_text(
        encoding="utf-8",
        errors="ignore"
    )

    parser = Parser()

    parser.language = get_language(language)

    tree = parser.parse(
        content.encode("utf-8")
    )

    extractor = JavaScriptExtractor()

    objects = extractor.extract(
        root=tree.root_node,
        content=content,
        file_path=file
    )

    print(
        "Knowledge Objects:",
        len(objects)
    )

    for obj in objects:

        indexer.index_object(
            knowledge_object=obj,
            object_id=object_id
        )

        object_id += 1