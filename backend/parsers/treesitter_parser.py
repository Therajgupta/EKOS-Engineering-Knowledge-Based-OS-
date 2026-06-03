from pathlib import Path

# Try importing tree-sitter grammars (Python 3.13 compatible packages)
try:
    import tree_sitter_javascript as tsjs
    import tree_sitter_typescript as tsts
    from tree_sitter import Language, Parser as TSParser
    JS_LANG  = Language(tsjs.language())
    TSX_LANG = Language(tsts.language_tsx())
    TS_LANG  = Language(tsts.language_typescript())
    HAS_TREE_SITTER = True
except Exception:
    HAS_TREE_SITTER = False


def get_ts_parser(language: str):
    """Return a tree-sitter Parser for the given language string, or None."""
    if not HAS_TREE_SITTER:
        return None
    try:
        p = TSParser()
        if language == "javascript":
            p.language = JS_LANG
        elif language == "typescript":
            p.language = TS_LANG
        elif language in ("tsx", "jsx"):
            p.language = TSX_LANG
        else:
            return None
        return p
    except Exception:
        return None


class TreeSitterParser:

    def get_source_files(self, repo_path) -> list[Path]:
        extensions = {".py", ".js", ".ts", ".tsx", ".jsx"}
        skip_dirs  = {"node_modules", ".git", "dist", "build", "__pycache__", ".next"}
        files = []
        for f in Path(repo_path).rglob("*"):
            if f.suffix in extensions and not any(p in skip_dirs for p in f.parts):
                files.append(f)
        return files
