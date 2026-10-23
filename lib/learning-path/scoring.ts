// Scoring stand-ins for the prototype. In production these route to the AZE
// speech and writing engines (mastery decisions) or a self-hosted ASR plus
// alignment for practice feedback. Here they are deterministic heuristics over
// a transcript, so the learner flow, the confidence gate and the data captured
// can be tested end to end. Every result carries scorer_version and confidence.

export const SCORER_VERSION = "proto-heuristic-0.3";

export type SpeechScore = {
  sounds: number; // 0..1 pronunciation stand-in (word match)
  rhythm: number; // 0..1 fluency stand-in (length and pauses)
  words: number; // 0..1 target words used
  overall: number;
  confidence: number;
  pass: boolean;
  missed: string[];
  matched: string[];
};

export function normalise(s: string): string {
  return s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' .,?]/g, " ").replace(/\s+/g, " ").trim();
}

function tokens(s: string): string[] {
  return normalise(s).replace(/[.,?]/g, "").split(" ").filter(Boolean);
}

const CONTRACTIONS: Record<string, string> = { "i'd": "i would", "i'm": "i am", "that's": "that is", "we're": "we are", "don't": "do not", "can't": "can not", "cannot": "can not", "i'll": "i will" };

function expand(t: string[]): string[] {
  return t.flatMap((w) => (CONTRACTIONS[w] ? CONTRACTIONS[w].split(" ") : [w]));
}

/** Read-aloud and shadow: word-level match against a model sentence. */
export function scoreReadAloud(model: string, transcript: string, durationMs: number): SpeechScore {
  const target = expand(tokens(model));
  const said = expand(tokens(transcript));
  if (!said.length) return { sounds: 0, rhythm: 0, words: 0, overall: 0, confidence: 0.2, pass: false, missed: target, matched: [] };
  const matched: string[] = [];
  const missed: string[] = [];
  const pool = [...said];
  for (const w of target) {
    const i = pool.findIndex((x) => x === w || (w.length > 3 && (x.startsWith(w.slice(0, 4)) || w.startsWith(x.slice(0, 4)))));
    if (i >= 0) { matched.push(w); pool.splice(i, 1); } else missed.push(w);
  }
  const sounds = matched.length / Math.max(1, target.length);
  const wps = said.length / Math.max(0.5, durationMs / 1000);
  // Natural speech is about 2 to 3 words per second; very slow or very fast lowers rhythm.
  const rhythm = Math.max(0, Math.min(1, 1 - Math.abs(wps - 2.2) / 2.2));
  const words = Math.min(1, said.length / Math.max(1, target.length));
  const overall = 0.5 * sounds + 0.25 * rhythm + 0.25 * words;
  const confidence = Math.min(1, 0.5 + 0.5 * sounds) * (said.length >= 2 ? 1 : 0.5);
  return { sounds, rhythm, words, overall, confidence, pass: sounds >= 0.7 && overall >= 0.65, missed, matched };
}

/** Open response: target items used, sentence count, length. */
export function scoreOpenResponse(
  transcript: string,
  cfg: { targets?: string[]; min_sentences?: number; need?: number; seconds?: number },
  durationMs: number,
): SpeechScore & { used: string[]; sentences: number } {
  const text = normalise(transcript);
  const said = tokens(transcript);
  const targets = (cfg.targets ?? []).map(normalise);
  const used = targets.filter((t) => (t === "ed" ? /\b\w+ed\b/.test(text) : text.includes(t)));
  const sentences = Math.max(said.length >= 4 ? 1 : 0, text.split(/[.?!]+|\band\b|\bbut\b/).filter((s) => s.trim().split(" ").length >= 2).length);
  const need = cfg.need ?? Math.ceil(targets.length / 2);
  const words = targets.length ? Math.min(1, used.length / need) : Math.min(1, said.length / 12);
  const minS = cfg.min_sentences ?? 2;
  const rhythm = Math.min(1, sentences / minS) * (said.length >= 6 ? 1 : 0.5);
  const sounds = said.length ? Math.min(1, 0.6 + said.length / 40) : 0;
  const overall = 0.45 * words + 0.35 * rhythm + 0.2 * sounds;
  const confidence = said.length < 3 ? 0.3 : Math.min(1, 0.6 + said.length / 50);
  return { sounds, rhythm, words, overall, confidence, pass: used.length >= need && sentences >= minS, missed: targets.filter((t) => !used.includes(t)), matched: used, used, sentences };
}

export type SceneIntent = { action?: string; item?: string; quantity?: number; size?: string };

const NUMBERS: Record<string, number> = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, some: 1, bottle: 1 };
const ITEMS_MAP: Record<string, string> = { coffee: "coffee", coffees: "coffee", latte: "coffee", lattes: "coffee", tea: "tea", teas: "tea", water: "water", waters: "water", juice: "juice", juices: "juice", sandwich: "sandwich", sandwiches: "sandwich", bill: "bill", check: "bill" };
const POLITE = ["i'd like", "i would like", "could i have", "can i have", "may i have", "please"];

/** Say it, see it: a fixed-schema slot parser over the transcript. */
export function parseSlots(transcript: string): { slots: SceneIntent; polite: boolean; wellFormed: boolean } {
  const text = normalise(transcript);
  const t = tokens(transcript);
  const slots: SceneIntent = {};
  for (let i = 0; i < t.length; i++) {
    const w = t[i];
    if (ITEMS_MAP[w] && !slots.item) {
      slots.item = ITEMS_MAP[w];
      slots.action = slots.item === "bill" ? "bill" : "order";
      // look back for a quantity
      for (let j = Math.max(0, i - 3); j < i; j++) if (NUMBERS[t[j]] !== undefined && slots.quantity === undefined) slots.quantity = NUMBERS[t[j]];
      if (slots.quantity === undefined && /s$/.test(w) && w !== "coffees") slots.quantity = 2;
    }
    if (w === "large" || w === "big") slots.size = "large";
    if (w === "small") slots.size = "small";
  }
  const polite = POLITE.some((p) => text.includes(p));
  const wellFormed = polite && !!slots.item;
  return { slots, polite, wellFormed };
}

export function matchIntent(target: SceneIntent, parsed: SceneIntent): { match: boolean; ambiguous: string | null } {
  if (target.action === "bill") return { match: parsed.action === "bill", ambiguous: parsed.action ? null : "bill" };
  if (parsed.item !== target.item) return { match: false, ambiguous: parsed.item ? "item" : null };
  if (target.quantity !== undefined && (parsed.quantity ?? 1) !== target.quantity) return { match: false, ambiguous: "quantity" };
  if (target.size && parsed.size !== target.size) return { match: false, ambiguous: "size" };
  return { match: true, ambiguous: null };
}

/** Roleplay: an on-task turn contains at least one expected keyword. */
export function classifyTurn(transcript: string, keywords: string[]): boolean {
  const text = normalise(transcript);
  return keywords.some((k) => text.includes(normalise(k)));
}

/** Explain it to Sami / relay: can the character answer the content questions from the transcript alone? */
export function scoreRelay(transcript: string, questions: { q: string; keywords: string[] }[], source: string): { answered: boolean[]; paraphrase: number } {
  const text = normalise(transcript);
  const answered = questions.map((q) => q.keywords.some((k) => text.includes(normalise(k))));
  const src = new Set(tokens(source));
  const said = tokens(transcript);
  const overlap = said.length ? said.filter((w) => src.has(w)).length / said.length : 0;
  return { answered, paraphrase: 1 - overlap };
}

/** Short production (writing): length, question mark, target words. */
export function scoreWriting(text: string, cfg: { targets?: string[]; min_words?: number; max_words?: number }): { score: number; pass: boolean; notes: string[]; confidence: number } {
  const t = tokens(text);
  const notes: string[] = [];
  const min = cfg.min_words ?? 6;
  const max = cfg.max_words ?? 60;
  let score = 0;
  if (t.length >= min && t.length <= max) score += 0.4; else notes.push(t.length < min ? "Write a little more." : "Keep it shorter.");
  const targets = cfg.targets ?? [];
  const hit = targets.filter((x) => (x === "?" ? text.includes("?") : normalise(text).includes(normalise(x))));
  score += targets.length ? 0.4 * (hit.length / targets.length) : 0.4;
  if (hit.length < targets.length) notes.push(targets.includes("?") && !text.includes("?") ? "Ask a question with a question mark." : "Use the words from today.");
  if (/\bhi\b|\bhello\b|\bdear\b/i.test(text)) score += 0.2; else notes.push("Start with Hi and the name.");
  return { score, pass: score >= 0.7, notes, confidence: t.length >= 3 ? 0.9 : 0.4 };
}

export function acceptTyped(answer: string, key: string, accept?: string[]): boolean {
  const a = normalise(answer).replace(/[.?!]+$/, "");
  const list = [key, ...(accept ?? [])].map((k) => normalise(k).replace(/[.?!]+$/, ""));
  return list.includes(a);
}
