"""Re-index mern-app with the improved pipeline."""
import sys
sys.path.insert(0, '.')
from backend.main import index_repository
index_repository('https://github.com/doananhtingithub40102/mern-app.git', 'mern-app')
