# SpeechAce test bench

A single-page tool for testing speaking samples against the
[SpeechAce](https://www.speechace.com/) scoring API. Record from the mic or
load an audio file, and the page converts it to 16 kHz mono WAV, builds the
request, sends it, and renders the scores.

**Live:** https://speechace-test-bench.vercel.app  (hosted on Vercel, project
`speechace-test-bench`). Open it, paste your SpeechAce key, and test — no
install. Redeploy after changes with `vercel --prod` from this folder, or via
the Vercel dashboard.

Self-contained. Nothing to install beyond Python 3.7+ (standard library only)
for the local runner.

## Files

- `index.html` — the tool (all HTML/CSS/JS in one file)
- `serve.py` — local runner: serves the page over `http://localhost` (so the
  mic works) and forwards API calls (so CORS never applies)
- `api/proxy.js` — the same forwarding proxy as a Vercel serverless function,
  for the hosted build

## Two ways to run it

**Hosted (no install):** deploy this folder to Vercel as its own project. The
static `index.html` is served at `/` and `api/proxy.js` handles `/api/proxy`.
Open the URL, paste your key, and test — the mic works because the page is on
`https://`, and CORS is handled by the function.

**Local:** run `serve.py` (below). Same `/api/proxy` contract, so the page is
identical in both places.

## Run it

```bash
cd speech-test-bench
python3 serve.py          # opens http://localhost:8000 automatically
```

Then in the page:

1. Paste your **SpeechAce API key** into the *key* field.
2. Pick a **dialect** (default `en-us`) and optionally set `user_id`.
3. Choose a **scoring mode**:
   - **Spontaneous** — open-ended speech. Optionally give a
     `relevance_context` (the question/topic) to score relevance.
   - **Scripted** — read-aloud. Enter the reference `text`; pronunciation is
     scored word by word against it.
4. **Record** or **Choose file**, then **Run assessment**.

The response panel shows the overall scores, a scale-by-scale matrix
(Speechace 0–100 / IELTS / PTE / TOEIC / CEFR), relevance, transcript,
per-word pronunciation, and fluency metrics — plus the full raw JSON.

## Why serve.py

- **Microphone:** browsers only grant mic access on a secure origin.
  `http://localhost` counts; `file://` does not. Serving the page makes
  *Record* work.
- **CORS:** a browser calling `api.speechace.co` directly is a cross-origin
  request and is usually blocked. `serve.py` forwards the request instead, so
  CORS never enters the picture. The page auto-detects the proxy — if
  `serve.py` is running it routes through `/proxy?url=...`; otherwise it calls
  the API straight from the browser (which CORS will likely block).

You can still open `index.html` directly as a file, but the mic and (usually)
live API calls will not work without `serve.py` or the hosted proxy.

## Request shape

```
POST https://api.speechace.co/api/scoring/speech/v9/json?key=<KEY>&dialect=en-us&user_id=guest
multipart/form-data:
  user_audio_file = <16 kHz mono wav>
  relevance_context = "<question/topic>"   # spontaneous mode
  text              = "<reference text>"   # scripted mode
  include_fluency   = 1
```

The **Request preview** card in the page shows the exact request and an
equivalent Python (`requests`) snippet for running it server-side.

## Notes

- The API key is entered in the browser and travels inside the request URL as
  the `?key=` query parameter. It is **not** stored in this repo. `serve.py`
  strips the query string before logging, so the key is never printed.
- Never ship a page containing a real key to a place students or the public
  can open it. A browser cannot hide it.
- Endpoint host is `api.speechace.co`. Some accounts use `api.speechace.com`;
  `serve.py` and `api/proxy.js` allow both, and you can change the host in
  `index.html` (`speechAceUrl()`) if your plan requires it.
- Audio limits in the meter (3:00 spontaneous / 1:00 scripted) are UI
  guidelines, not hard API limits.
