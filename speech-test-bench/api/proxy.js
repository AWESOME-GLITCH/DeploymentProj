// Vercel serverless proxy for the SpeechAce test bench.
//
// Why it exists: a browser calling api.speechace.co directly is a cross-origin
// request and is blocked by CORS. This function forwards the request instead,
// exactly like serve.py does for local runs. The page routes through it at
// POST /api/proxy?url=<absolute target>. A GET is the availability ping.
//
// The SpeechAce API key rides inside the target URL's ?key= query parameter.
// It is never logged here (only the host + path is printed).

const ALLOWED = /^(api\d*\.speechace\.(com|co)|api\d*\.speechsuper\.com)$/;

function readRaw(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  // Availability ping — the page checks this to decide whether a proxy exists.
  if (req.method === "GET") {
    res.setHeader("Content-Type", "text/plain");
    return res.status(200).send("speech-proxy");
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  // Pull the absolute target from ?url= and host-check it.
  let target;
  try {
    target = new URL(req.url, "http://localhost").searchParams.get("url");
  } catch (_) {
    target = null;
  }
  if (!target) {
    return res.status(400).json({ error: "missing url" });
  }
  let parsed;
  try {
    parsed = new URL(target);
  } catch (_) {
    return res.status(400).json({ error: "bad url" });
  }
  if (parsed.protocol !== "https:" || !ALLOWED.test(parsed.hostname)) {
    console.log("blocked host:", parsed.hostname);
    return res.status(400).json({ error: "disallowed host" });
  }

  // Forward the raw multipart body with its original content type.
  const body = await readRaw(req);
  const headers = {};
  if (req.headers["content-type"]) headers["Content-Type"] = req.headers["content-type"];
  if (req.headers["request-index"]) headers["Request-Index"] = req.headers["request-index"];

  console.log("-> POST", parsed.origin + parsed.pathname, `(${Math.round(body.length / 1024)} KB)`);
  try {
    const r = await fetch(target, { method: "POST", headers, body });
    const buf = Buffer.from(await r.arrayBuffer());
    console.log("<-", r.status, `(${buf.length} bytes)`);
    res.status(r.status);
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    return res.send(buf);
  } catch (e) {
    const msg = String((e && e.message) || e);
    console.log("<- FAILED:", msg);
    return res.status(502).json({ error: "proxy could not reach the API: " + msg });
  }
};
