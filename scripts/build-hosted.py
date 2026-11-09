"""Package the HTML/CSS pages for Sites without changing their portable source."""
from pathlib import Path
import base64
import json
import mimetypes
import shutil

root = Path(__file__).resolve().parents[1]
out = root / 'dist'
if out.exists():
    shutil.rmtree(out)
(out / 'server').mkdir(parents=True)
(out / '.openai').mkdir()
shutil.copy(root / '.openai/hosting.json', out / '.openai/hosting.json')
assets = {}
for folder in ['pages', 'assets']:
    for path in (root / folder).rglob('*'):
        if path.is_file():
            mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
            if path.suffix in ['.html', '.css', '.js']:
                mime += '; charset=utf-8'
            assets['/' + path.relative_to(root).as_posix()] = [mime, base64.b64encode(path.read_bytes()).decode()]
home = (root / 'pages/home/index.html').read_text().replace('../../assets/', '/assets/')
assets['/index.html'] = ['text/html; charset=utf-8', base64.b64encode(home.encode()).decode()]
worker = 'const assets = ' + json.dumps(assets) + ';\n' + '''
export default {
  fetch(request) {
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    let path = new URL(request.url).pathname;
    if (path.endsWith('/')) path += 'index.html';
    const asset = assets[path];
    if (!asset) return new Response('Not found', { status: 404 });
    const body = Uint8Array.from(atob(asset[1]), char => char.charCodeAt(0));
    return new Response(request.method === 'HEAD' ? null : body, {
      headers: { 'Content-Type': asset[0], 'Cache-Control': 'no-cache', 'X-Appstore-Version': 'fa-black-surfaces-10' }
    });
  }
};
'''
(out / 'server/index.js').write_text(worker)
print('Built hosted worker with', len(assets), 'routes')
