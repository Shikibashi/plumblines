"""Serve Expo's static export with its configured /static prefix and SPA routes."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

class PreviewHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = urlsplit(self.path).path
        if path.startswith('/static/'):
            self.path = path[len('/static'):]
        elif not (Path(self.directory) / path.lstrip('/')).is_file():
            self.path = '/index.html'
        super().do_GET()

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8137)
    parser.add_argument('--bind', default='127.0.0.1')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[2] / 'dist'
    ThreadingHTTPServer((args.bind, args.port), partial(PreviewHandler, directory=str(root))).serve_forever()
