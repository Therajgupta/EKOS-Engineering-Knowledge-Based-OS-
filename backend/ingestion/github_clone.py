from git import Repo
from pathlib import Path

def clone_repository(repo_url: str):

    repo_name = repo_url.split('/')[-1]
    PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
    clone_path = (
    PROJECT_ROOT
    / "repos"
    / repo_name.replace(".git", "")
)

    if clone_path.exists():
        print(f"{repo_name} already exists")
        return clone_path
    
    Repo.clone_from(repo_url, clone_path)
    print(f"Cloned {repo_name}")
    return clone_path