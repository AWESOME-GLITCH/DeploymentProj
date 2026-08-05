// Tiny, dependency-free cache over Vercel KV's REST API (Upstash-compatible).
// No-ops gracefully when KV isn't provisioned, so the app works with or without it.
// To enable: add a Vercel KV store to the project → it injects KV_REST_API_URL
// and KV_REST_API_TOKEN automatically.

const URL = process.env.KV_REST_API_URL;
const TOKEN = process.env.KV_REST_API_TOKEN;
export const kvEnabled = Boolean(URL && TOKEN);

async function cmd(args: (string | number)[]): Promise<any> {
  if (!kvEnabled) return null;
  const res = await fetch(URL as string, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  return json?.result ?? null;
}

export async function kvGetJSON<T>(key: string): Promise<T | null> {
  const raw = await cmd(["GET", key]);
  if (!raw || typeof raw !== "string") return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function kvSetJSON(key: string, value: unknown): Promise<void> {
  await cmd(["SET", key, JSON.stringify(value)]);
}
