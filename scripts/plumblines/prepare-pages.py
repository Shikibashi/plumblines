"""Package an existing verified Expo export for Cloudflare Pages, without rebuilding."""
import base64
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import shutil
import tempfile

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'dist'


class InlineScripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.active = False
        self.buffer = ''
        self.hashes = []

    def handle_starttag(self, tag, attrs):
        if tag == 'script':
            self.active = 'src' not in dict(attrs)
            self.buffer = ''

    def handle_data(self, data):
        if self.active:
            self.buffer += data

    def handle_endtag(self, tag):
        if tag == 'script' and self.active:
            digest = base64.b64encode(hashlib.sha256(self.buffer.encode()).digest()).decode()
            self.hashes.append("'sha256-" + digest + "'")
            self.active = False


def main():
    html = (SOURCE / 'index.html').read_text()
    parser = InlineScripts()
    parser.feed(html)
    parent = ROOT / '.cloudflare'
    parent.mkdir(exist_ok=True)
    output = Path(tempfile.mkdtemp(prefix='pages-', dir=parent))
    shutil.copytree(SOURCE, output / 'static', ignore=shutil.ignore_patterns('*.map', 'index.html'))
    (output / 'index.html').write_text(html)
    shutil.copyfile(SOURCE / 'favicon.ico', output / 'favicon.ico')
    # Install metadata must remain at the root rather than below /static.
    # Copy from the verified export, preserving the exact deployed icon bytes.
    shutil.copyfile(SOURCE / 'manifest.webmanifest', output / 'manifest.webmanifest')
    shutil.copytree(SOURCE / 'pwa', output / 'pwa')
    # Preserve the previously published OAuth client identity for existing grants.
    # This client uses the upstream account login; this file adds no OAuth flow.
    shutil.copyfile(ROOT / 'deployment/cloudflare/legacy-client-metadata.json', output / 'client-metadata.json')
    csp = "; ".join([
        "default-src 'self'", "base-uri 'none'", "object-src 'none'", "frame-ancestors 'none'",
        "script-src 'self' blob: 'wasm-unsafe-eval' " + ' '.join(parser.hashes),
        "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob: https:",
        "font-src 'self' data: https:", "media-src 'self' data: blob: https:",
        "connect-src 'self' https: wss:", "worker-src 'self' blob:",
        "frame-src https:", "form-action 'self' https:",
    ])
    (output / '_headers').write_text(
        '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n'
        '  X-Frame-Options: DENY\n  Content-Security-Policy: ' + csp + '\n'
        '/\n  Cache-Control: no-cache\n/index.html\n  Cache-Control: no-cache\n'
        '/client-metadata.json\n  Cache-Control: no-cache\n  Access-Control-Allow-Origin: *\n'
        '/manifest.webmanifest\n  Content-Type: application/manifest+json\n  Cache-Control: no-cache\n'
    )
    manifest = {str(p.relative_to(output)): hashlib.sha256(p.read_bytes()).hexdigest()
                for p in sorted(output.rglob('*')) if p.is_file()}
    for p in output.rglob('*'):
        if p.is_file() and p.stat().st_size > 25 * 1024 * 1024:
            raise ValueError(f'Asset exceeds Pages upload limit: {p}')
    (parent / (output.name + '-sha256.json')).write_text(json.dumps(manifest, indent=2) + '\n')
    print(output)


if __name__ == '__main__':
    main()
