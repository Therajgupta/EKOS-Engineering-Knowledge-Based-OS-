from pathlib import Path
from backend.extractors.javascript_extractor import JavaScriptExtractor
from backend.parsers.treesitter_parser import TreeSitterParser
from backend.parsers.language_detector import detect_language

from tree_sitter import Parser
from tree_sitter_language_pack import get_language

# Project Root
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Repository Path
repo_path = PROJECT_ROOT / "repos" / "mern-app"

# Create Parser
repo_parser = TreeSitterParser()

# Find Files
files = repo_parser.get_source_files(repo_path)

print("Files Found:", len(files))

# Pick First File
first_file = files[0]

print("\nFirst File:")
print(first_file)

# Read File Content
content = first_file.read_text(
    encoding="utf-8",
    errors="ignore"
)

# Detect Language
language = detect_language(first_file)

print("\nLanguage:")
print(language)

# Create Tree-sitter Parser
parser = Parser()

parser.language = get_language(language)

# Generate AST
tree = parser.parse(
    content.encode("utf-8")
)

root = tree.root_node



extractor = JavaScriptExtractor()

objects = extractor.extract(
    root=root,
    content=content,
    file_path=first_file
)

for obj in objects:
    print(obj.model_dump())