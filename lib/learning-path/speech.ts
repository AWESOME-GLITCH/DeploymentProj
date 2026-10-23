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

export function say(text: string, rate = 1, onEnd?: () => void): void {
  if (!canSpeak() || !text) { onEnd?.(); return; }
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
