from pathlib import Path

EXTENTION_MAP = {
    '.py': 'python',  
    '.js': 'javascript',
    '.ts': 'typescript',
    '.java': 'java',
    '.cpp': 'cpp',
    '.c': 'c',
    '.cs': 'csharp',
    '.rb': 'ruby',
    '.go': 'go',
    '.php': 'php',
    '.rs': 'rust',
    '.swift': 'swift',
    '.kt': 'kotlin',
    'dockerfile': 'dockerfile',
}

def detect_language(file_path: Path) :
    return EXTENTION_MAP.get(
        Path(file_path).suffix.lower()
    )