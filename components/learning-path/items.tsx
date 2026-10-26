"use client";

// ItemRenderer: one component per item_type, all sharing the same contract.
// Feedback is meaning-first: the wrong option dims to grey, the correct one
// glows and plays audio, then a one-line why (in L1 below A2). Red is never used.

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Keyboard, Mic, Play, Square, Volume2 } from "lucide-react";
import type { Item, Modality } from "@/lib/learning-path/types";
import { loc } from "@/lib/learning-path/i18n";
import { canListen, listen, stopSpeaking, type RecognitionHandle } from "@/lib/learning-path/speech";
import { SCORER_VERSION, acceptTyped, classifyTurn, matchIntent, parseSlots, scoreOpenResponse, scoreReadAloud, scoreRelay, scoreWriting, type SceneIntent, type SpeechScore } from "@/lib/learning-path/scoring";
import { GlowButton, LocText, Say, useLp } from "./ui";

export type ItemResult = {
  correct: boolean;
  modality: Modality;
  response_ms: number;
  attempt_n: number;
  score?: number;
  sub_scores?: Record<string, number>;
  ai_confidence?: number;
  transcript?: string;
  ai?: boolean;
  task_id?: string;
  practise_again?: boolean;
};

export type ItemProps = {
  item: Item;
  /** Called once per attempt, as soon as it is judged. */
  onAnswer: (r: ItemResult) => void;
  /** Called when the learner taps continue after feedback. */
  onNext: () => void;
  mode?: "controlled" | "recall" | "check" | "placement" | "challenge" | "use";
  /** Items the learner should try to use in a free-use task. */
  tryItems?: string[];
  variant?: "dense" | "standard" | "light";
  dayParity?: number;
};

/** Tester hook: fills the current item with a correct or wrong answer. */
export function useAutoAnswer(handler: (correct: boolean) => void) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    const fn = (e: Event) => ref.current(!!(e as CustomEvent<{ correct: boolean }>).detail?.correct);
    window.addEventListener("lp:auto", fn);
    return () => window.removeEventListener("lp:auto", fn);
  }, []);
}

export function fireAuto(correct: boolean) {
  window.dispatchEvent(new CustomEvent("lp:auto", { detail: { correct } }));
}

function useTimer() {
  const start = useRef(Date.now());
  useEffect(() => { start.current = Date.now(); }, []);
  return () => Date.now() - start.current;
}

export function Instruction({ k, children }: { k?: string; children?: ReactNode }) {
  const { t } = useLp();
  return <div className="lp-eyebrow mb-2">{children ?? (k ? t(k) : "")}</div>;
}

/** Feedback is movement. Right: a tick scales in and that is all. Wrong: the
 *  model answer and one line of why, because that is the only time words help. */
export function Feedback({ correct, item, onNext, extra, label, modelText }: { correct: boolean | null; item: Item; onNext: () => void; extra?: ReactNode; label?: string; modelText?: string }) {
  const { t, lang, say } = useLp();
  useEffect(() => {
    if (correct === false && modelText) { const id = window.setTimeout(() => say(modelText), 400); return () => window.clearTimeout(id); }
  }, [correct, modelText, say]);
  if (correct === null) return null;
  const why = loc(item.why, lang);
  return (
    <div className="lp-fade-in mt-auto">
      {correct ? (
        <div className="flex items-center gap-3">
          <span className="lp-tick"><Check size={22} strokeWidth={3} /></span>
          <span className="lp-lesson" style={{ color: "var(--lp-sea)" }}>{t("correct_fb")}</span>
          {extra}
        </div>
      ) : (
        <div className="lp-glass p-4">
          <div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>{t("wrong_fb")}</div>
          {modelText ? <div className="lp-lesson mt-1"><Say text={modelText} size="lesson" /></div> : null}
          {why ? <div className="lp-body mt-1" style={{ color: "var(--lp-paper-soft)" }}>{why}</div> : null}
          {extra}
        </div>
      )}
      <div className="mt-3"><GlowButton onClick={onNext}>{label ?? t("continue")}</GlowButton></div>
    </div>
  );
}

// Choice-type items: gap_fill, detail_gap, gist_mcq, inference_mcq, heading_match, tfng, pick_picture, error_spot

function ChoiceItem({ item, onAnswer, onNext, mode }: ItemProps) {
  const { t, lang, say } = useLp();
  const elapsed = useTimer();
  const [picked, setPicked] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(1);
  const key = Number(item.key);
  const options = item.item_type === "pick_picture" ? (item.pictures ?? []).map((p) => p.emoji) : (item.options ?? []);
  const labels = item.item_type === "tfng" ? [t("true_"), t("false_"), t("not_given")] : options;
  const correctText = item.audio ?? (item.item_type === "pick_picture" ? item.pictures?.[key]?.label : item.stem.en.replace("___", String(item.options?.[key] ?? "")));
  const isListening = !!item.audio && ["pick_picture", "detail_gap", "gist_mcq", "inference_mcq"].includes(item.item_type) && mode !== "placement" ? true : !!item.audio && item.item_type === "pick_picture";

  const answer = useCallback((i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === key;
    onAnswer({ correct, modality: item.modality, response_ms: elapsed(), attempt_n: attempt });
    if (correct && correctText) say(correctText);
  }, [picked, key, onAnswer, item.modality, elapsed, attempt, correctText, say]);

  useAutoAnswer((correct) => answer(correct ? key : (key + 1) % Math.max(2, options.length)));

  const instruction = item.item_type === "error_spot" ? "tap_wrong" : item.item_type === "tfng" ? "choose" : item.item_type === "pick_picture" ? "listen_first" : item.item_type === "heading_match" ? "choose" : "tap_gap";
  const text = item.config?.text as string | undefined;

  return (
    <div className="flex h-full flex-col">
      <Instruction k={instruction} />
      {text ? (
        <div className="lp-glass mb-3 p-3"><Say text={text} size="body" /></div>
      ) : null}
      {item.audio && isListening ? (
        <button type="button" onClick={() => say(item.audio!)} className="lp-glass mb-3 flex items-center justify-center gap-3 p-4" aria-label={t("listen")}>
          <span className="lp-speaker" style={{ width: 44, height: 44, minWidth: 44 }}><Volume2 size={22} /></span>
          <span className="lp-body">{t("listen")}</span>
        </button>
      ) : null}
      {item.item_type !== "error_spot" ? (
        <div className="lp-lesson mb-4"><Say text={loc(item.stem, "en")} size="lesson" auto={!item.audio} speakText={item.audio && isListening ? "" : loc(item.stem, "en")} /></div>
      ) : (
        <div className="mb-4 flex flex-wrap gap-2">
          {options.map((o, i) => (
            <button key={i} type="button" onClick={() => answer(i)} className={`lp-tile ${picked !== null && i === key ? "lp-choice-correct" : ""} ${picked !== null && picked === i && i !== key ? "lp-choice-dim" : ""}`}>{o}</button>
          ))}
        </div>
      )}
      {item.item_type !== "error_spot" ? (
        <div className={item.item_type === "pick_picture" ? "grid grid-cols-3 gap-2" : "flex flex-col gap-2"}>
          {labels.map((label, i) => {
            const state = picked === null ? "" : i === key ? "lp-choice-correct" : picked === i ? "lp-choice-dim" : "lp-choice-dim";
            return (
              <button key={i} type="button" onClick={() => answer(i)} className={`lp-choice ${state} ${item.item_type === "pick_picture" ? "justify-center text-center" : ""}`} style={item.item_type === "pick_picture" ? { fontSize: /\d/.test(label) ? 30 : 34, minHeight: 84, flexDirection: "column", gap: 4 } : undefined}>
                <span>{label}</span>
                {item.item_type === "pick_picture" && item.pictures?.[i] ? <span className="lp-small" style={{ opacity: 0.7, fontSize: 12 }}>{item.pictures[i].label}</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
      {mode === "placement" || mode === "challenge" ? (
        picked !== null ? <div className="mt-auto pt-3"><GlowButton onClick={() => { setAttempt((a) => a + 1); onNext(); }}>{t("next")}</GlowButton></div> : null
      ) : (
        <Feedback correct={picked === null ? null : picked === key} item={item} onNext={onNext} />
      )}
    </div>
  );
}

// Ordering: tap_order, sentence_build

function OrderItem({ item, onAnswer, onNext }: ItemProps) {
  const { t, say } = useLp();
  const elapsed = useTimer();
  const [placed, setPlaced] = useState<number[]>([]);
  const [result, setResult] = useState<boolean | null>(null);
  const tiles = item.options ?? [];
  const key = String(item.key);
  const clean = (s: string) => s.toLowerCase().replace(/[.,?!]/g, "").replace(/\s+/g, " ").trim();
  const check = () => {
    const joined = placed.map((i) => tiles[i]).join(" ");
    const correct = clean(joined) === clean(key);
    setResult(correct);
    onAnswer({ correct, modality: item.modality, response_ms: elapsed(), attempt_n: 1 });
    say(key);
  };
  useAutoAnswer((correct) => {
    if (result !== null) return;
    const order = correct ? key.split(" ").map((w) => tiles.findIndex((tt, i) => clean(tt) === clean(w) && !placed.includes(i))) : tiles.map((_, i) => i).reverse();
    setPlaced(order.filter((i) => i >= 0));
    window.setTimeout(check, 50);
  });
  return (
    <div className="flex h-full flex-col">
      <Instruction k="put_in_order" />
      <div className="mb-3"><Say text="" size="small" speakText={item.audio ?? key}><span className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>{t("listen")}</span></Say></div>
      <div className="lp-slot mb-4" onClick={() => result === null && setPlaced((p) => p.slice(0, -1))}>
        {placed.map((i, n) => <span key={n} className="lp-tile lp-tile-placed">{tiles[i]}</span>)}
      </div>
      <div className="flex flex-wrap gap-2">
        {tiles.map((tile, i) => (
          <button key={i} type="button" disabled={placed.includes(i) || result !== null} onClick={() => setPlaced((p) => [...p, i])} className={`lp-tile ${placed.includes(i) ? "lp-tile-ghost" : ""}`}>{tile}</button>
        ))}
      </div>
      {result === null ? (
        <div className="mt-auto pt-3"><GlowButton disabled={placed.length !== tiles.length} onClick={check}>{t("check")}</GlowButton></div>
      ) : (
        <Feedback correct={result} item={item} onNext={onNext} modelText={result ? undefined : key} />
      )}
    </div>
  );
}

// Magnet tiles: tiles snap only into grammatical sequences

function MagnetTiles({ item, onAnswer, onNext }: ItemProps) {
  const { t, say } = useLp();
  const elapsed = useTimer();
  const tiles = item.options ?? [];
  const target = String(item.key).split(" ");
  const [placed, setPlaced] = useState<number[]>([]);
  const [bounce, setBounce] = useState<{ i: number; reason: string } | null>(null);
  const [bounces, setBounces] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);
  const [assembling, setAssembling] = useState(false);
  const clean = (s: string) => s.toLowerCase().replace(/[.,?!]/g, "");
  const nextWord = target[placed.length];

  const finish = useCallback((correct: boolean, attempts: number) => {
    setResult(correct);
    onAnswer({ correct, modality: item.modality, response_ms: elapsed(), attempt_n: 1, sub_scores: { bounces: attempts } });
    say(String(item.key));
  }, [onAnswer, item.modality, item.key, elapsed, say]);

  const drop = (i: number) => {
    if (result !== null || assembling) return;
    if (clean(tiles[i]) === clean(nextWord ?? "")) {
      const np = [...placed, i];
      setPlaced(np);
      if (np.length === target.length) finish(bounces < 3, bounces);
    } else {
      const reason = /s$/.test(tiles[i]) !== /s$/.test(nextWord ?? "") && clean(tiles[i]).slice(0, 4) === clean(nextWord ?? "").slice(0, 4) ? t("order_bounce_agreement") : t("order_bounce_order");
      setBounce({ i, reason });
      window.setTimeout(() => setBounce(null), 450);
      const b = bounces + 1;
      setBounces(b);
      if (b >= 3) {
        // After 3 attempts the sentence self-assembles, one tile at a time.
        setAssembling(true);
        const order = target.map((w) => tiles.findIndex((tt) => clean(tt) === clean(w)));
        order.forEach((idx, n) => window.setTimeout(() => {
          setPlaced(order.slice(0, n + 1));
          if (n === order.length - 1) finish(false, b);
        }, 350 * (n + 1)));
      }
    }
  };
  useAutoAnswer((correct) => {
    if (result !== null) return;
    if (correct) { const order = target.map((w) => tiles.findIndex((tt) => clean(tt) === clean(w))); setPlaced(order); finish(true, bounces); }
    else { setBounces(3); setAssembling(true); const order = target.map((w) => tiles.findIndex((tt) => clean(tt) === clean(w))); setPlaced(order); finish(false, 3); }
  });
  return (
    <div className="flex h-full flex-col">
      <Instruction k="build" />
      <div className="lp-slot mb-4">
        {placed.map((i, n) => <span key={n} className="lp-tile lp-tile-placed">{tiles[i]}</span>)}
      </div>
      <div className="flex flex-wrap gap-2">
        {tiles.map((tile, i) => (
          <button key={i} type="button" disabled={placed.includes(i) || result !== null} onClick={() => drop(i)} className={`lp-tile ${placed.includes(i) ? "lp-tile-ghost" : ""} ${bounce?.i === i ? "lp-tile-bounce" : ""}`}>
            {tile}
            {bounce?.i === i ? <span className="lp-small ms-2" style={{ color: "var(--lp-sand)" }}>{bounce.reason}</span> : null}
          </button>
        ))}
      </div>
      <Feedback correct={result} item={item} onNext={onNext} />
    </div>
  );
}

// Time slider: a sentence morphs live as the learner drags past, now, future

function TimeSlider({ item, onAnswer, onNext }: ItemProps) {
  const { t, say } = useLp();
  const elapsed = useTimer();
  const cfg = item.config as { frame: string; forms: Record<"past" | "present" | "future", string>; cues: { label: string; emoji: string; target: "past" | "present" | "future" }[]; need: number };
  const [round, setRound] = useState(0);
  const [pos, setPos] = useState(1);
  const [hits, setHits] = useState<boolean[]>([]);
  const [result, setResult] = useState<boolean | null>(null);
  const tense = (["past", "present", "future"] as const)[pos];
  const sentence = cfg.frame.replace("___", cfg.forms[tense]);
  const cue = cfg.cues[round];
  const check = (forced?: boolean) => {
    const ok = forced ?? tense === cue.target;
    const nh = [...hits, ok];
    setHits(nh);
    say(cfg.frame.replace("___", cfg.forms[cue.target]));
    if (nh.length >= cfg.cues.length) {
      const correct = nh.filter(Boolean).length >= cfg.need;
      setResult(correct);
      onAnswer({ correct, modality: item.modality, response_ms: elapsed(), attempt_n: 1, sub_scores: { hits: nh.filter(Boolean).length, rounds: nh.length } });
    } else { setRound((r) => r + 1); setPos(1); }
  };
  useAutoAnswer((correct) => {
    if (result !== null) return;
    const n = cfg.cues.length - hits.length;
    const nh = [...hits, ...Array.from({ length: n }, () => correct)];
    setHits(nh);
    const ok = nh.filter(Boolean).length >= cfg.need;
    setResult(ok);
    onAnswer({ correct: ok, modality: item.modality, response_ms: elapsed(), attempt_n: 1, sub_scores: { hits: nh.filter(Boolean).length, rounds: nh.length } });
  });
  const parts = cfg.frame.split("___");
  return (
    <div className="flex h-full flex-col">
      <Instruction>{t("slider_hint")}</Instruction>
      <div className="mb-2 flex items-center justify-between">
        <div className="lp-glass flex items-center gap-2 px-3 py-2"><span style={{ fontSize: 22 }}>{cue?.emoji}</span><span className="lp-lesson">{cue?.label}</span></div>
        <div className="flex gap-1">{cfg.cues.map((_, i) => <span key={i} className={`lp-dot ${hits[i] === true ? "lp-dot-on" : ""}`} style={hits[i] === false ? { background: "var(--lp-sand)", opacity: 0.6 } : undefined} />)}</div>
      </div>
      <div className="lp-glass my-4 p-5 text-center">
        <div className="lp-head" style={{ fontWeight: 500 }}>{parts[0]}<span className="lp-target">{cfg.forms[tense]}</span>{parts[1]}</div>
      </div>
      <div className="px-2">
        <input type="range" min={0} max={2} step={1} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="w-full" style={{ accentColor: "var(--lp-glow-2)", height: 48 }} aria-label="time" />
        <div className="flex justify-between lp-small" style={{ color: "var(--lp-paper-faint)" }}><span>⏮️</span><span>📍</span><span>⏭️</span></div>
      </div>
      {result === null ? (
        <div className="mt-auto pt-3"><GlowButton onClick={() => check()}>{t("check")}</GlowButton></div>
      ) : (
        <Feedback correct={result} item={item} onNext={onNext} modelText={result ? undefined : sentence} />
      )}
    </div>
  );
}

// Typed: transform, correct_message, dictation

function TypedItem({ item, onAnswer, onNext }: ItemProps) {
  const { t, say } = useLp();
  const elapsed = useTimer();
  const [value, setValue] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const accept = (item.config?.accept as string[] | undefined) ?? [];
  const key = String(item.key);
  const check = (v = value) => {
    if (result !== null) return;
    const correct = acceptTyped(v, key, accept);
    setResult(correct);
    onAnswer({ correct, modality: "typed", response_ms: elapsed(), attempt_n: 1 });
    if (correct) say(item.audio ?? key);
  };
  useAutoAnswer((correct) => { const v = correct ? key : "xx"; setValue(v); check(v); });
  const model = item.item_type === "dictation" ? item.audio ?? key : key;
  return (
    <div className="flex h-full flex-col">
      <Instruction k={item.item_type === "dictation" ? "listen_first" : "type_answer"} />
      {item.audio && item.item_type === "dictation" ? (
        <button type="button" onClick={() => say(item.audio!)} className="lp-glass mb-3 flex items-center justify-center gap-3 p-4"><span className="lp-speaker" style={{ width: 44, height: 44, minWidth: 44 }}><Volume2 size={22} /></span><span className="lp-body">{t("listen")}</span></button>
      ) : null}
      <div className="lp-lesson mb-4"><Say text={loc(item.stem, "en")} size="lesson" auto={!item.audio} /></div>
      <input className="lp-input" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()} disabled={result !== null} placeholder="..." inputMode="text" autoCapitalize="sentences" />
      {result === null ? (
        <div className="mt-auto pt-3"><GlowButton disabled={!value.trim()} onClick={() => check()}>{t("check")}</GlowButton></div>
      ) : (
        <Feedback correct={result} item={item} onNext={onNext} modelText={result ? undefined : model} />
      )}
    </div>
  );
}

// Writing: short_production

function WritingItem({ item, onAnswer, onNext, dayParity = 0 }: ItemProps) {
  const { t } = useLp();
  const elapsed = useTimer();
  const cfg = item.config as { targets?: string[]; min_words?: number; max_words?: number; variants?: string[] };
  const prompt = cfg.variants?.[dayParity % (cfg.variants?.length || 1)] ?? loc(item.stem, "en");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<ReturnType<typeof scoreWriting> | null>(null);
  const check = (v = value) => {
    if (result) return;
    const r = scoreWriting(v, cfg);
    setResult(r);
    onAnswer({ correct: r.pass, modality: "typed", response_ms: elapsed(), attempt_n: 1, score: r.score, ai_confidence: r.confidence, ai: true, task_id: `${item.item_id}:${dayParity % 2}`, sub_scores: { rubric: r.score } });
  };
  useAutoAnswer((correct) => { const v = correct ? "Hi Amira. Where are you? Are you OK?" : "ok"; setValue(v); check(v); });
  return (
    <div className="flex h-full flex-col">
      <Instruction k="type_answer" />
      <div className="lp-lesson mb-3"><Say text={prompt} size="lesson" auto /></div>
      {cfg.targets ? <div className="mb-3 flex flex-wrap gap-2">{cfg.targets.filter((x) => x !== "?").map((x) => <span key={x} className="lp-pill lp-pill-glow">{x}</span>)}</div> : null}
      <textarea className="lp-input" rows={3} value={value} onChange={(e) => setValue(e.target.value)} disabled={!!result} placeholder="Hi ..." />
      <div className="lp-small mt-1 text-end" style={{ color: "var(--lp-paper-faint)" }}>{value.trim().split(/\s+/).filter(Boolean).length} words</div>
      {!result ? (
        <div className="mt-auto pt-3"><GlowButton disabled={value.trim().split(/\s+/).filter(Boolean).length < 2} onClick={() => check()}>{t("check")}</GlowButton></div>
      ) : (
        <Feedback correct={result.pass} item={item} onNext={onNext} extra={result.notes.length ? <ul className="lp-small mt-2" style={{ color: "var(--lp-paper-soft)" }}>{result.notes.map((n) => <li key={n}>· {n}</li>)}</ul> : null} />
      )}
    </div>
  );
}

// Recorder: mic with waveform, noise-gate stand-in, typed fallback

export function Recorder({ onDone, maxSeconds = 30, disabled, hint, autoText }: { onDone: (transcript: string, durationMs: number, typed: boolean) => void; maxSeconds?: number; disabled?: boolean; hint?: string; autoText?: string }) {
  const { t } = useLp();
  const [state, setState] = useState<"idle" | "rec" | "typing">("idle");
  const [interim, setInterim] = useState("");
  const [typed, setTyped] = useState("");
  const [secs, setSecs] = useState(0);
  const handle = useRef<RecognitionHandle | null>(null);
  const startedAt = useRef(0);
  const finalRef = useRef<string>("");
  const supported = typeof window !== "undefined" && canListen();

  const stop = useCallback(() => { handle.current?.stop(); handle.current = null; }, []);
  useEffect(() => () => stop(), [stop]);
  useEffect(() => {
    if (state !== "rec") return;
    const id = window.setInterval(() => setSecs(Math.floor((Date.now() - startedAt.current) / 1000)), 250);
    return () => window.clearInterval(id);
  }, [state]);

  const start = () => {
    stopSpeaking();
    setInterim(""); finalRef.current = ""; setSecs(0);
    startedAt.current = Date.now();
    const h = listen({
      onResult: (text, final) => { if (final) finalRef.current = text; else setInterim(text); },
      onEnd: () => { setState("idle"); onDone(finalRef.current || interimRef.current, Date.now() - startedAt.current, false); },
      onError: () => { setState("idle"); onDone("", Date.now() - startedAt.current, false); },
      maxMs: maxSeconds * 1000,
    });
    if (!h) { setState("typing"); return; }
    handle.current = h;
    setState("rec");
  };
  const interimRef = useRef("");
  interimRef.current = interim;

  useAutoAnswer(() => { if (autoText && !disabled) onDone(autoText, 2500, true); });

  if (state === "typing" || !supported) {
    return (
      <div className="w-full">
        {!supported ? <div className="lp-small mb-2" style={{ color: "var(--lp-paper-faint)" }}>Voice needs Chrome or Edge. Type instead.</div> : null}
        <textarea className="lp-input" rows={2} value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="..." disabled={disabled} />
        <div className="mt-2 flex gap-2">
          <GlowButton size="normal" disabled={disabled || !typed.trim()} onClick={() => { onDone(typed, 3000, true); setTyped(""); }}>{t("check")}</GlowButton>
          {supported ? <button type="button" className="lp-icon-btn" aria-label={t("say_it")} onClick={() => setState("idle")}><Mic size={20} /></button> : null}
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col items-center gap-3">
      {state === "rec" ? (
        <div className="lp-wave">{Array.from({ length: 14 }).map((_, i) => <i key={i} style={{ animationDelay: `${(i % 7) * 0.09}s` }} />)}</div>
      ) : <div style={{ height: 40 }} className="lp-small flex items-center" >{hint ?? t("mic_hint")}</div>}
      {interim ? <div className="lp-small text-center" style={{ color: "var(--lp-paper-soft)", minHeight: 20 }}>{interim}</div> : null}
      <div className="flex items-center gap-5">
        <button type="button" className="lp-icon-btn" aria-label={t("type_instead")} onClick={() => setState("typing")} disabled={disabled}><Keyboard size={20} /></button>
        <button type="button" className={`lp-mic ${state === "rec" ? "lp-mic-live" : ""}`} aria-label={state === "rec" ? t("done") : t("say_it")} onClick={state === "rec" ? stop : start} disabled={disabled}>
          {state === "rec" ? <Square size={30} /> : <Mic size={34} />}
        </button>
        <div className="lp-small tabular-nums" style={{ width: 48, textAlign: "center", color: "var(--lp-paper-faint)" }}>{state === "rec" ? `${secs}s` : `${maxSeconds}s`}</div>
      </div>
    </div>
  );
}

export function ResultBars({ score }: { score: SpeechScore }) {
  const { t } = useLp();
  const rows: [string, number][] = [[t("speak_sounds"), score.sounds], [t("speak_rhythm"), score.rhythm], [t("speak_words"), score.words]];
  return (
    <div className="w-full">
      {rows.map(([label, v]) => (
        <div key={label} className="mb-2 flex items-center gap-3">
          <div className="lp-small w-16 shrink-0">{label}</div>
          <div className="lp-bar relative flex-1">
            <div style={{ width: `${Math.round(v * 100)}%`, background: v >= 0.7 ? undefined : "linear-gradient(90deg,#b3a07a,var(--lp-sand))" }} />
            <span className="absolute top-[-3px] h-[18px] w-[2px]" style={{ left: "70%", background: "var(--lp-paper-faint)" }} title={t("pass_line")} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Speech items: shadow, read_aloud, open_response (also teach-it-back and fluency)

function SpeechItem({ item, onAnswer, onNext, dayParity = 0 }: ItemProps) {
  const { t, say } = useLp();
  const cfg = (item.config ?? {}) as { targets?: string[]; min_sentences?: number; need?: number; seconds?: number; variants?: string[]; fluency?: boolean; teach_back?: boolean };
  const isOpen = item.item_type === "open_response";
  const model = String(item.key ?? "");
  const prompt = isOpen ? cfg.variants?.[dayParity % (cfg.variants?.length || 1)] ?? loc(item.stem, "en") : loc(item.stem, "en");
  const [attempt, setAttempt] = useState(1);
  const [score, setScore] = useState<(SpeechScore & { used?: string[]; sentences?: number }) | null>(null);
  const [said, setSaid] = useState("");
  const [unclear, setUnclear] = useState(false);
  const [done, setDone] = useState(false);
  const [timerOn, setTimerOn] = useState<boolean | null>(cfg.fluency ? null : false);
  const [round, setRound] = useState(1);

  const judge = (transcript: string, durationMs: number) => {
    if (!transcript.trim()) { setUnclear(true); return; }
    setUnclear(false);
    setSaid(transcript);
    const s = isOpen ? scoreOpenResponse(transcript, cfg, durationMs) : scoreReadAloud(model, transcript, durationMs);
    setScore(s);
    // Confidence below 0.6 returns practise again and writes no mastery evidence.
    if (s.confidence < 0.6) { setUnclear(true); return; }
    onAnswer({ correct: s.pass, modality: "spoken", response_ms: durationMs, attempt_n: attempt, score: s.overall, sub_scores: { sounds: s.sounds, rhythm: s.rhythm, words: s.words }, ai_confidence: s.confidence, transcript, ai: isOpen || item.item_type === "shadow" ? true : false, task_id: `${item.item_id}:${dayParity % 2}` });
    if (s.pass || attempt >= 3) setDone(true); else setAttempt((a) => a + 1);
  };

  if (cfg.fluency && timerOn === null) {
    return (
      <div className="flex h-full flex-col">
        <Instruction>{t("fluency_optin")}</Instruction>
        <div className="lp-lesson mb-4"><Say text={model} size="lesson" auto /></div>
        <div className="mt-auto flex flex-col gap-2"><GlowButton onClick={() => setTimerOn(true)}>{t("fluency_yes")}</GlowButton><GlowButton secondary size="normal" onClick={() => setTimerOn(false)}>{t("fluency_no")}</GlowButton></div>
      </div>
    );
  }

  // A conversation, not a form: the line, the mic, the response. The coach from
  // LP-06 mounts in this column when components/learning-path/coach/ lands.
  return (
    <div className="flex h-full flex-col">
      <Instruction>{cfg.teach_back ? t("teach_back_title") : item.item_type === "shadow" ? "Shadow duet" : t("say_it")}</Instruction>
      <div className="flex flex-col gap-3">
        <div className="lp-turn">
          {isOpen ? (
            <Say text={prompt} size="lesson" auto />
          ) : (
            <button type="button" onClick={() => say(model)} aria-label={t("listen")} className="flex w-full items-start gap-3 text-start" style={{ background: "none", border: "none", padding: 0 }}>
              <span className="lp-speaker" style={{ width: 40, height: 40, minWidth: 40, marginTop: 0 }}><Play size={18} /></span>
              <span className="lp-lesson">{model.split(" ").map((w, i) => {
                const clean = w.toLowerCase().replace(/[^a-z']/g, "");
                const missed = score?.missed.some((m) => clean.startsWith(m.slice(0, 4)) || m.startsWith(clean.slice(0, 4)));
                return <span key={i} className={missed ? "lp-target" : ""}>{w} </span>;
              })}</span>
            </button>
          )}
        </div>
        {isOpen && cfg.targets?.length ? (
          <div className="flex flex-wrap gap-2">
            {cfg.targets.filter((x) => x !== "ed").map((x) => <span key={x} className={`lp-pill ${score?.used?.includes(x) ? "lp-pill-good" : "lp-pill-glow"}`}>{x}</span>)}
          </div>
        ) : null}
        {said ? (
          <div className={`lp-turn lp-turn-me lp-fade-in ${score && !score.pass ? "lp-turn-miss" : ""}`}>
            <div className="lp-body">{said}</div>
            {score ? <div className="mt-2"><ResultBars score={score} /></div> : null}
          </div>
        ) : null}
        {unclear ? <div className="lp-small" style={{ color: "var(--lp-sand)" }}>{t("practise_again")}</div> : null}
        {cfg.fluency && timerOn ? <div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>Round {round} of 3 · {cfg.seconds}s</div> : null}
      </div>
      {!done ? (
        <div className="mt-auto">
          <Recorder maxSeconds={cfg.seconds ?? (isOpen ? 30 : 12)} onDone={(tr, ms) => { judge(tr, ms); if (cfg.fluency && timerOn && round < 3) setRound((r) => r + 1); }} autoText={isOpen ? "I'm Fatima. I live in Dubai and I work in a shop. Yesterday I worked and tomorrow I will visit a friend. I'd like a coffee please, could I have the bill instead." : model} />
          {score && attempt > 1 && !score.pass ? <div className="lp-small mt-2 text-center" style={{ color: "var(--lp-paper-faint)" }}>{attempt} / 3</div> : null}
        </div>
      ) : (
        <Feedback correct={!!score?.pass} item={item} onNext={onNext} label={score?.pass ? t("continue") : t("keep_going")} />
      )}
    </div>
  );
}

// Say it, see it: scene re-renders to show what was said

function CafeScene({ intent, mood }: { intent: SceneIntent | null; mood: "idle" | "happy" | "confused" }) {
  const qty = intent?.quantity ?? 0;
  const item = intent?.item;
  const emoji = item === "coffee" ? "☕" : item === "tea" ? "🍵" : item === "water" ? "💧" : item === "juice" ? "🧃" : item === "sandwich" ? "🥪" : item === "bill" ? "🧾" : "";
  const face = mood === "happy" ? "😊" : mood === "confused" ? "🤔" : "🙂";
  return (
    <div className="lp-video flex h-[150px] items-end justify-between p-4">
      <div className="flex flex-col items-center"><div style={{ fontSize: 44 }}>{face}</div><div className="lp-small" style={{ opacity: 0.7 }}>Leo</div></div>
      <div className="flex min-h-[60px] flex-1 flex-wrap items-center justify-center gap-1 px-2">
        {emoji ? Array.from({ length: Math.min(5, Math.max(1, qty)) }).map((_, i) => <span key={i} style={{ fontSize: intent?.size === "large" ? 40 : 30, transition: "font-size 0.3s" }}>{emoji}</span>) : <span className="lp-small" style={{ opacity: 0.5 }}>counter</span>}
      </div>
      <div className="flex flex-col items-center"><div style={{ fontSize: 44 }}>🧑</div><div className="lp-small" style={{ opacity: 0.7 }}>You</div></div>
    </div>
  );
}

function SayItSeeIt({ item, onAnswer, onNext }: ItemProps) {
  const { t, say } = useLp();
  const cfg = item.config as { intent: SceneIntent; model: string };
  const [attempt, setAttempt] = useState(1);
  const [shown, setShown] = useState<SceneIntent | null>(null);
  const [mood, setMood] = useState<"idle" | "happy" | "confused">("idle");
  const [line, setLine] = useState<string>("");
  const [transcript, setTranscript] = useState("");
  const [done, setDone] = useState<boolean | null>(null);
  const judge = (tr: string, ms: number) => {
    if (!tr.trim()) { setLine(t("not_caught")); return; }
    const { slots, polite, wellFormed } = parseSlots(tr);
    setTranscript(tr);
    setShown(slots);
    const m = matchIntent(cfg.intent, slots);
    const form = polite ? 1 : 0.5;
    const correct = m.match && wellFormed;
    onAnswer({ correct, modality: "spoken", response_ms: ms, attempt_n: attempt, score: (m.match ? 0.6 : 0) + form * 0.4, sub_scores: { intent: m.match ? 1 : 0, form }, ai_confidence: slots.item ? 0.9 : 0.5, transcript: tr, ai: true, task_id: item.item_id });
    if (correct) { setMood("happy"); setLine(cfg.intent.action === "bill" ? "Of course. Here you are." : "Coming right up."); say(cfg.intent.action === "bill" ? "Of course. Here you are." : "Coming right up."); setDone(true); return; }
    setMood("confused");
    const q = m.ambiguous === "quantity" ? t("scene_unclear") : m.ambiguous === "size" ? "Sorry, large or small?" : !slots.item ? "Sorry, what would you like?" : !polite ? "Sorry, could you say that politely?" : "Sorry, which one?";
    setLine(q); say(q);
    if (attempt >= 2) { setDone(false); window.setTimeout(() => { setShown(cfg.intent); setMood("happy"); say(cfg.model); }, 900); }
    else setAttempt((a) => a + 1);
  };
  return (
    <div className="flex h-full flex-col">
      <Instruction>Say it, see it</Instruction>
      <div className="lp-lesson mb-3"><Say text={loc(item.stem, "en")} size="lesson" auto /></div>
      <CafeScene intent={shown} mood={mood} />
      <div className="mt-3 flex flex-col gap-2">
        {transcript ? <div className="lp-turn lp-turn-me lp-fade-in"><div className="lp-body">{transcript}</div></div> : null}
        {line ? <div className="lp-turn lp-fade-in"><Say text={line} size="body" speakText="" /></div> : null}
      </div>
      {done === null ? (
        <div className="mt-auto"><Recorder maxSeconds={12} onDone={judge} autoText={cfg.model} /></div>
      ) : (
        <Feedback correct={done} item={item} onNext={onNext} label={done ? t("continue") : t("keep_going")} modelText={done ? undefined : cfg.model} />
      )}
    </div>
  );
}

// Roleplay with an AI character: three turns, intent branches, repair

function Roleplay({ item, onAnswer, onNext }: ItemProps) {
  const { t, say } = useLp();
  const cfg = item.config as { character: string; turns: { say: string; keywords: string[] }[]; need: number };
  const [turn, setTurn] = useState(0);
  const [log, setLog] = useState<{ who: "ai" | "me"; text: string; ok?: boolean }[]>([{ who: "ai", text: cfg.turns[0].say }]);
  const [misses, setMisses] = useState(0);
  const [onTask, setOnTask] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);
  const [repairUsed, setRepairUsed] = useState(false);
  const spoke = useRef(false);
  useEffect(() => { if (!spoke.current) { spoke.current = true; say(cfg.turns[0].say); } }, [cfg.turns, say]);
  const reply = (tr: string, ms: number) => {
    const ok = classifyTurn(tr, cfg.turns[turn].keywords);
    if (!ok && !repairUsed && tr.trim()) {
      // Gentle follow-up once, then the story moves on with a neutral branch.
      setRepairUsed(true);
      setLog((l) => [...l, { who: "me", text: tr || "…", ok: false }, { who: "ai", text: t("not_caught") }]);
      say(t("not_caught"));
      return;
    }
    const nOk = onTask + (ok ? 1 : 0);
    const nMiss = misses + (ok ? 0 : 1);
    setOnTask(nOk); setMisses(nMiss);
    const next = turn + 1;
    const entries: typeof log = [{ who: "me", text: tr || "…", ok }];
    if (next < cfg.turns.length) { entries.push({ who: "ai", text: cfg.turns[next].say }); say(cfg.turns[next].say); setTurn(next); setRepairUsed(false); }
    setLog((l) => [...l, ...entries]);
    if (next >= cfg.turns.length) {
      const pass = nOk >= cfg.need;
      setResult(pass);
      onAnswer({ correct: pass, modality: "spoken", response_ms: ms, attempt_n: 1, score: nOk / cfg.turns.length, sub_scores: { on_task: nOk, turns: cfg.turns.length }, ai_confidence: 0.85, transcript: log.filter((x) => x.who === "me").map((x) => x.text).concat(tr).join(" / "), ai: true, task_id: item.item_id });
    }
  };
  return (
    <div className="flex h-full flex-col">
      <Instruction>{t("turn_of")} {Math.min(turn + 1, cfg.turns.length)} / {cfg.turns.length}</Instruction>
      <div className="lp-small mb-2" style={{ color: "var(--lp-paper-faint)" }}>{loc(item.stem, "en")}</div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {log.map((m, i) => (
          <div key={i} className={`lp-turn ${m.who === "me" ? `lp-turn-me ${m.ok === false ? "lp-turn-miss" : ""}` : ""}`}>
            {m.who === "ai" ? <div className="lp-small mb-1" style={{ color: "var(--lp-paper-faint)" }}>{cfg.character}</div> : null}
            <Say text={m.text} size="body" speakText={m.who === "ai" ? m.text : ""} />
          </div>
        ))}
      </div>
      {result === null ? (
        <div className="mt-3"><Recorder maxSeconds={20} onDone={reply} autoText={turn === 0 ? "I'd like a latte with oat milk please" : turn === 1 ? "Do you have soy milk instead?" : "No, that's fine, thank you"} /></div>
      ) : (
        <Feedback correct={result} item={item} onNext={onNext} />
      )}
    </div>
  );
}

// Relay / explain it to Sami

function RelayItem({ item, onAnswer, onNext }: ItemProps) {
  const { t, say } = useLp();
  const cfg = item.config as { source: string; questions: { q: string; keywords: string[] }[]; need: number; character?: string };
  const who = cfg.character ?? "Sami";
  const [stage, setStage] = useState<"read" | "say" | "done">("read");
  const [transcript, setTranscript] = useState("");
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [additions, setAdditions] = useState(0);
  const [pass, setPass] = useState<boolean | null>(null);
  const [ms, setMs] = useState(0);
  const judge = (tr: string, dur: number) => {
    const all = (transcript + " " + tr).trim();
    setTranscript(all); setMs(ms + dur);
    const r = scoreRelay(all, cfg.questions, cfg.source);
    setAnswered(r.answered);
    const ok = r.answered.filter(Boolean).length >= cfg.need;
    if (ok || additions >= 2 || !tr.trim()) {
      setPass(ok); setStage("done");
      onAnswer({ correct: ok, modality: "spoken", response_ms: ms + dur, attempt_n: 1, score: r.answered.filter(Boolean).length / cfg.questions.length, sub_scores: { answered: r.answered.filter(Boolean).length, paraphrase: r.paraphrase }, ai_confidence: all.split(" ").length >= 3 ? 0.85 : 0.5, transcript: all, ai: true, task_id: item.item_id });
    } else {
      const missing = cfg.questions.find((_, i) => !r.answered[i]);
      setAdditions((a) => a + 1);
      if (missing) say(missing.q);
    }
  };
  return (
    <div className="flex h-full flex-col">
      <Instruction>Explain it to {who}</Instruction>
      {stage === "read" ? (
        <>
          <div className="lp-glass mb-3 p-4"><div className="lp-eyebrow mb-1">Source</div><Say text={cfg.source} size="lesson" auto /></div>
          <div className="lp-body mb-3" style={{ color: "var(--lp-paper-soft)" }}>{loc(item.stem, "en")}</div>
          <div className="mt-auto"><GlowButton onClick={() => setStage("say")}>{t("say_it")}</GlowButton></div>
        </>
      ) : (
        <>
          <div className="lp-lesson mb-2"><Say text={loc(item.stem, "en")} size="body" /></div>
          <div className="mb-3 flex flex-col gap-1">
            {cfg.questions.map((q, i) => (
              <div key={q.q} className="flex items-center gap-2 lp-small"><span className={`lp-dot ${answered[i] ? "lp-dot-on" : ""}`} /><span style={{ opacity: answered.length && !answered[i] ? 1 : 0.7 }}>{who} {answered.length && !answered[i] ? t("sami_more") : "asks:"} {q.q}</span></div>
            ))}
          </div>
          {stage === "say" ? (
            <div className="mt-auto">
              {additions > 0 ? <div className="lp-small mb-1 text-center" style={{ color: "var(--lp-sand)" }}>{t("add_sentence")} ({additions}/2)</div> : null}
              <Recorder maxSeconds={30} onDone={judge} autoText="You must pay by thirty May. You can pay online or at the shop. Use the reference number 4471. You can't eat on the train but water is OK, and stand on the right." />
            </div>
          ) : (
            <Feedback correct={!!pass} item={item} onNext={onNext} />
          )}
        </>
      )}
    </div>
  );
}

// Vote, see, revote

function VoteItem({ item, onAnswer, onNext }: ItemProps) {
  const { t, say } = useLp();
  const elapsed = useTimer();
  const peers = (item.config?.peers as number[]) ?? [];
  const key = Number(item.key);
  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);
  const pick = (i: number) => {
    if (first === null) { setFirst(i); return; }
    if (second === null) {
      setSecond(i);
      onAnswer({ correct: i === key, modality: "recognition", response_ms: elapsed(), attempt_n: 1, sub_scores: { first, second: i, changed: first !== i ? 1 : 0 } });
      say(item.options?.[key] ?? "");
    }
  };
  useAutoAnswer((c) => { if (first === null) setFirst(c ? key : 0); else if (second === null) pick(c ? key : 0); });
  return (
    <div className="flex h-full flex-col">
      <Instruction>{first === null ? t("vote_q") : t("vote_again")}</Instruction>
      <div className="lp-lesson mb-4"><Say text={loc(item.stem, "en")} size="lesson" auto /></div>
      <div className="flex flex-col gap-2">
        {(item.options ?? []).map((o, i) => (
          <button key={i} type="button" onClick={() => pick(i)} className={`lp-choice ${second !== null ? (i === key ? "lp-choice-correct" : "lp-choice-dim") : first === i ? "lp-choice-selected" : ""}`}>
            <span className="flex-1">{o}</span>
            {first !== null ? <span className="lp-small tabular-nums" style={{ color: "var(--lp-paper-faint)" }}>{peers[i]}%</span> : null}
          </button>
        ))}
      </div>
      {first !== null && second === null ? <div className="lp-small mt-3" style={{ color: "var(--lp-paper-soft)" }}>{t("vote_peers")}. {t("model_answer")}: <span className="lp-target">{item.options?.[key]}</span></div> : null}
      <Feedback correct={second === null ? null : second === key} item={item} onNext={onNext} />
    </div>
  );
}

export function ItemRenderer(props: ItemProps) {
  const { item } = props;
  switch (item.item_type) {
    case "tap_order": case "sentence_build": return <OrderItem key={item.item_id} {...props} />;
    case "magnet_tiles": return <MagnetTiles key={item.item_id} {...props} />;
    case "time_slider": return <TimeSlider key={item.item_id} {...props} />;
    case "transform": case "correct_message": case "dictation": return <TypedItem key={item.item_id} {...props} />;
    case "short_production": return <WritingItem key={item.item_id} {...props} />;
    case "shadow": case "read_aloud": case "open_response": case "picture_describe": return <SpeechItem key={item.item_id} {...props} />;
    case "say_it_see_it": return <SayItSeeIt key={item.item_id} {...props} />;
    case "roleplay": case "dialogue_turn": return <Roleplay key={item.item_id} {...props} />;
    case "relay": case "explain_chart": case "translate_gist": return <RelayItem key={item.item_id} {...props} />;
    case "vote_see_revote": return <VoteItem key={item.item_id} {...props} />;
    default: return <ChoiceItem key={item.item_id} {...props} />;
  }
}

export const SCORER = SCORER_VERSION;
export { LocText };
