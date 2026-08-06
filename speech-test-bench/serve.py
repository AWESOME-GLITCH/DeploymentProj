#!/usr/bin/env python3
"""
SpeechAce test bench - local runner.

Why this exists:
  * Browsers only grant microphone access on a secure origin. https:// and
    http://localhost count; file:// and sandboxed iframes do not. Serving the
    page here makes Record work.
  * Browser -> vendor API is a cross-origin request. This process forwards it
    instead, so CORS never enters the picture.

Run:
    python3 serve.py
    (then open http://localhost:8000 - it opens automatically)

The page auto-detects this proxy: if serve.py is running it routes through
/proxy?url=..., otherwise it calls the API straight from the browser (which
CORS usually blocks). The SpeechAce API key travels inside that target URL as
the ?key= query parameter and is never printed by this server.

Nothing to install. Python 3.7+ standard library only.
"""

import http.server
import socketserver
import urllib.request
import urllib.error
import urllib.parse
import webbrowser
import threading
import os
import re
import sys

PORT = int(os.environ.get("PORT", 8000))
PAGE = "speech-test-bench.html"
HERE = os.path.dirname(os.path.abspath(__file__))

# Only these hosts may be forwarded to. An open proxy on your laptop is not
# something you want, even briefly.
ALLOWED = re.compile(r"^(api\d*\.speechace\.(com|co)|api\d*\.speechsuper\.com)$")


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=HERE, **kwargs)

    def log_message(self, fmt, *args):
        sys.stdout.write("  %s\n" % (fmt % args))

    def do_GET(self):
        if self.path.startswith("/proxy/ping"):
            return self._send(200, b"speech-proxy", "text/plain")
        if self.path in ("/", "/index.html"):
            self.path = "/" + PAGE
        return super().do_GET()

    def do_POST(self):
        if not self.path.startswith("/proxy"):
            return self._send(404, b"not found", "text/plain")

        target = self._target()
        if not target:
            return self._send(400, b'{"error":"missing or disallowed url"}',
                              "application/json")

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)

        headers = {"Content-Type": self.headers.get("Content-Type", "")}
        if self.headers.get("Request-Index"):
            headers["Request-Index"] = self.headers["Request-Index"]

        # never print the key: strip the query string from the logged URL
        print("  -> POST %s  (%.0f KB)" % (target.split("?")[0], len(body) / 1024))
        req = urllib.request.Request(target, data=body, method="POST", headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=180) as res:
                data = res.read()
                print("  <- %s  (%d bytes)" % (res.status, len(data)))
                return self._send(res.status, data, "application/json")
        except urllib.error.HTTPError as e:
            data = e.read()
            print("  <- HTTP %s" % e.code)
            return self._send(e.code, data, "application/json")
        except Exception as e:
            msg = ('{"error":"proxy could not reach the API: %s"}'
                   % str(e).replace('"', "'")).encode()
            print("  <- FAILED: %s" % e)
            return self._send(502, msg, "application/json")

    def _target(self):
        """Absolute target URL from ?url=, host-checked against ALLOWED."""
        parts = urllib.parse.urlsplit(self.path)
        raw = urllib.parse.parse_qs(parts.query).get("url", [None])[0]
        if not raw:
            return None
        u = urllib.parse.urlsplit(raw)
        if u.scheme != "https" or not ALLOWED.match(u.hostname or ""):
            print("  !! blocked host: %s" % (u.hostname,))
            return None
        return raw

    def _send(self, status, body, ctype):
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    if not os.path.exists(os.path.join(HERE, PAGE)):
        sys.exit("Put serve.py in the same folder as %s" % PAGE)

    url = "http://localhost:%d" % PORT
    print("\n  SpeechAce test bench")
    print("  %s" % url)
    print("  microphone enabled (localhost is a secure origin)")
    print("  forwarding to api.speechace.co - no CORS")
    print("  ctrl-c to stop\n")
    threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        Server(("127.0.0.1", PORT), Handler).serve_forever()
    except KeyboardInterrupt:
        print("\n  stopped\n")
