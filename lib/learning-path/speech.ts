// Browser speech helpers: tap-to-hear (speechSynthesis) and a recorder built on
// the Web Speech API with a typed fallback. Chrome and Edge give voice; anywhere
// else the learner types and the flow still completes.

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function canListen(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
  return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
}

let voice: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (!canSpeak()) return null;
  if (voice) return voice;
  const voices = window.speechSynthesis.getVoices();
  voice =
    voices.find((v) => /en-GB/i.test(v.lang) && /female|Google UK English Female|Kate|Serena/i.test(v.name)) ||
    voices.find((v) => /en-GB/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    null;
  return voice;
}

// ElevenLabs voice through the app's own API route; the browser voice is the
// fallback when the route is unavailable (no key, offline, or a static bundle).
let ttsEnabled: boolean | null = null;
let probing: Promise<boolean> | null = null;
const audioCache = new Map<string, string>();
let current: HTMLAudioElement | null = null;

export function ttsEndpoint(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/api/learning-path/tts`;
}

export function probeTts(): Promise<boolean> {
  if (ttsEnabled !== null) return Promise.resolve(ttsEnabled);
  if (probing) return probing;
  probing = fetch(`${ttsEndpoint()}?probe=1`, { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : { enabled: false }))
    .then((j: { enabled?: boolean }) => { ttsEnabled = !!j.enabled; return ttsEnabled; })
    .catch(() => { ttsEnabled = false; return false; });
  return probing;
}

export function voiceName(): "elevenlabs" | "browser" | "unknown" {
  return ttsEnabled === null ? "unknown" : ttsEnabled ? "elevenlabs" : "browser";
}

async function sayWithElevenLabs(text: string, rate: number, onEnd?: () => void): Promise<boolean> {
  try {
    let url = audioCache.get(text);
    if (!url) {
      const res = await fetch(`${ttsEndpoint()}?text=${encodeURIComponent(text)}`);
      if (!res.ok) { if (res.status === 503) ttsEnabled = false; return false; }
      url = URL.createObjectURL(await res.blob());
      audioCache.set(text, url);
    }
    stopSpeaking();
    const a = new Audio(url);
    a.playbackRate = rate;
    current = a;
    a.onended = () => { if (current === a) current = null; onEnd?.(); };
    a.onerror = () => { if (current === a) current = null; onEnd?.(); };
    await a.play();
    return true;
  } catch {
    return false;
  }
}

export function say(text: string, rate = 1, onEnd?: () => void): void {
  if (!text) { onEnd?.(); return; }
  if (ttsEnabled !== false) {
    void probeTts().then((ok) => {
      if (!ok) { sayWithBrowser(text, rate, onEnd); return; }
      void sayWithElevenLabs(text, rate, onEnd).then((played) => { if (!played) sayWithBrowser(text, rate, onEnd); });
    });
    return;
  }
  sayWithBrowser(text, rate, onEnd);
}

function sayWithBrowser(text: string, rate: number, onEnd?: () => void): void {
  if (!canSpeak()) { onEnd?.(); return; }
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-GB";
  u.rate = rate;
  u.pitch = 1;
  const v = pickVoice();
  if (v) u.voice = v;
  if (onEnd) u.onend = () => onEnd();
  synth.speak(u);
}

export function stopSpeaking(): void {
  if (current) { try { current.pause(); } catch { /* ignore */ } current = null; }
  if (canSpeak()) window.speechSynthesis.cancel();
}

export type RecognitionHandle = { stop: () => void };

export function listen(opts: {
  onResult: (transcript: string, final: boolean) => void;
  onEnd: () => void;
  onError: (err: string) => void;
  maxMs?: number;
}): RecognitionHandle | null {
  if (!canListen()) return null;
  const w = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = "en-GB";
  rec.continuous = true;
  rec.interimResults = true;
  let finalText = "";
  let stopped = false;
  rec.onresult = (e: SpeechRecognitionEventLike) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalText += (finalText ? " " : "") + r[0].transcript;
      else interim += r[0].transcript;
    }
    opts.onResult((finalText + " " + interim).trim(), false);
  };
  rec.onerror = (e: { error?: string }) => { if (!stopped) opts.onError(e.error ?? "error"); };
  rec.onend = () => { opts.onResult(finalText.trim(), true); opts.onEnd(); };
  try { rec.start(); } catch (e) { opts.onError(String(e)); return null; }
  const timer = window.setTimeout(() => { try { rec.stop(); } catch { /* ignore */ } }, opts.maxMs ?? 45_000);
  return {
    stop: () => { stopped = true; window.clearTimeout(timer); try { rec.stop(); } catch { /* ignore */ } },
  };
}

type SpeechRecognitionLike = {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void; stop: () => void;
};
type SpeechRecognitionEventLike = { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> };
