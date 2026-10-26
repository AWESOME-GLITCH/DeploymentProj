import { NextRequest, NextResponse } from "next/server";

// ElevenLabs text to speech for the Learning Path prototype. GET so the CDN
// can cache each phrase by URL. Without ELEVENLABS_API_KEY the route answers
// 503 and the client falls back to the browser voice.

export const runtime = "nodejs";

const DEFAULT_VOICE = "pFZP5JQG7iQjIQuC4Bku"; // Lily, British English
const MODEL = process.env.ELEVENLABS_MODEL_ID || "eleven_turbo_v2_5";
const cache = new Map<string, ArrayBuffer>();

export async function GET(req: NextRequest) {
  const key = process.env.ELEVENLABS_API_KEY;
  const url = new URL(req.url);
  if (url.searchParams.get("probe")) {
    return NextResponse.json({ enabled: !!key, voice: key ? (process.env.ELEVENLABS_VOICE_ID ? "custom" : "Lily") : null }, { headers: { "Cache-Control": "no-store" } });
  }
  if (!key) return NextResponse.json({ fallback: true }, { status: 503 });
  const text = (url.searchParams.get("text") || "").slice(0, 600).trim();
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });
  const voice = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE;
  const cacheKey = `${voice}|${text}`;
  let audio = cache.get(cacheKey);
  if (!audio) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_64`, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({ text, model_id: MODEL, voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true } }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json({ error: "elevenlabs", status: res.status, detail: detail.slice(0, 300) }, { status: 502 });
    }
    audio = await res.arrayBuffer();
    if (cache.size > 400) cache.delete(cache.keys().next().value as string);
    cache.set(cacheKey, audio);
  }
  return new NextResponse(audio, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=604800, s-maxage=604800, immutable" } });
}
