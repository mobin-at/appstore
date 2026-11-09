"""Build the standalone site from its source pages; no third-party dependencies."""
from pathlib import Path
import shutil

root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
if dist.exists():
    shutil.rmtree(dist)
dist.mkdir()
for name in ['pages', 'assets']:
    shutil.copytree(root / name, dist / name)
# Serve the actual home page at / as well, rather than relying on a redirect.
home = (root / 'pages/home/index.html').read_text()
(dist / 'index.html').write_text(home.replace('../../assets/', 'assets/'))
(dist / '_headers').write_text('/*\n  Cache-Control: no-cache\n')
print('Built Persian home page and assets in dist/')
