"use client";

// The coach: a talk-like speaking turn with an animated 2D tutor. She is the
// heart of every spoken item, so every item whose modality is spoken comes
// through here when it is used in a free-use phase: a model line to repeat, an
// open answer, a three-turn conversation, or retelling a notice to a friend.
//
// She opens by speaking, then listens, then answers what was actually said. A
// weak attempt is never a mark: the word she did not hear comes back slowly and
// big, then she asks once more. After the third try she still says "good try"
// and there is always a way to try again. No red, no crosses, no score on a
// turn that did not land.
//
// The figure is the explainer kit character, so the tutor in a lesson and the
// tutor in practice are the same person. Every pose is a pure function of the
// frame and the turn state, so it is deterministic and stops dead when the
// learner has asked for less motion.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Character, type Gesture, type Mood } from "../explainer/lib";
import { Instruction, Recorder, ResultBars, type ItemProps } from "../items";
import { loc } from "@/lib/learning-path/i18n";
import { classifyTurn, scoreOpenResponse, scoreReadAloud, scoreRelay, type SceneIntent, type SpeechScore } from "@/lib/learning-path/scoring";
import { say as sayAtRate, stopSpeaking } from "@/lib/learning-path/speech";
import type { Item } from "@/lib/learning-path/types";
import { GlowButton, useLp } from "../ui";

/** Every spoken item is a turn with the coach, not a mic under a prompt. */
export function isCoachItem(item: Item): boolean {
  return item.modality === "spoken";
}

const FPS = 30;
const SEED = 23;
/** The coach never finishes a line before this, so her mouth is seen moving. */
const MIN_TALK_MS = 900;
/** One try and two retries before she offers the choice to carry on. */
const MAX_TRIES = 3;

/** What she says when the third try is spent: no blame, no fail state. */
const GOOD_TRY = "Good try.";
/** A target word shorter than this teaches nothing on its own (a suffix). */
const MIN_TEACH_LEN = 3;

/** A typed stand-in rich enough to pass any open task, for the tester hook. */
const OPEN_AUTO = "I'm Fatima. I live in Dubai and I work in a shop. Yesterday I worked and tomorrow I will visit a friend. I'd like a coffee please, could I have the bill instead.";
/** The same typed stand-in the recorder-only relay item used. */
const RELAY_AUTO = "You must pay by thirty May. You can pay online or at the shop. Use the reference number 4471. You can't eat on the train but water is OK, and stand on the right.";
/** Typed stand-ins for a three-turn cafe conversation, by turn. */
const CONVO_AUTO = ["I'd like a latte with oat milk please", "Do you have soy milk instead?", "No, that's fine, thank you"];

type OpenCfg = { targets?: string[]; min_sentences?: number; need?: number; seconds?: number; variants?: string[]; teach_back?: boolean };
type ConvoCfg = { character?: string; turns?: { say: string; keywords: string[] }[]; need?: number };
type RelayCfg = { source?: string; questions?: { q: string; keywords: string[] }[]; need?: number; character?: string };

/** How the attempt is judged, and so how she answers it. */
type Kind = "model" | "open" | "convo" | "relay";

type Turn = {
  /** What she says, and the one line of text on screen. */
  line: string;
  /** The words the learner says back, when the turn has a model line. */
  model?: string;
  /** On-task words for one turn of a conversation. */
  keywords?: string[];
  auto: string;
  seconds: number;
};

type Plan = {
  kind: Kind;
  /** The small line above the stage: what this turn is for. */
  instruction: string;
  turns: Turn[];
  /** Conversation: turns that must land. Relay: questions that must be answered. */
  need: number;
  /** Relay: what the friend still needs to know. */
  questions: { q: string; keywords: string[] }[];
  /** Relay: the notice she reads out first. */
  source?: string;
  /** Open answer: the scoring config. */
  open?: OpenCfg;
  /** Say it, see it: the one short English sentence the scene answers with. */
  sceneReply?: string;
  /** What she says once the whole task has landed. */
  endReply: string;
};

function buildPlan(item: Item, dayParity: number, t: (k: string) => string): Plan {
  const base = { need: 1, questions: [] as { q: string; keywords: string[] }[], endReply: "Thank you. That was clear." };
  switch (item.item_type) {
    case "say_it_see_it": {
      const cfg = (item.config ?? {}) as { intent?: SceneIntent; model?: string };
      const model = cfg.model ?? String(item.key ?? "");
      const reply = cfg.intent?.action === "bill" ? "Of course. Here you are." : "Coming right up.";
      return { ...base, kind: "model", instruction: loc(item.stem, "en"), turns: [{ line: model, model, auto: model, seconds: 12 }], sceneReply: reply, endReply: reply };
    }
    case "open_response": {
      const cfg = (item.config ?? {}) as OpenCfg;
      const prompt = cfg.variants?.[dayParity % (cfg.variants?.length || 1)] ?? loc(item.stem, "en");
      return { ...base, kind: "open", instruction: cfg.teach_back ? t("teach_back_title") : t("your_turn"), turns: [{ line: prompt, auto: OPEN_AUTO, seconds: cfg.seconds ?? 30 }], open: cfg };
    }
    case "roleplay":
    case "dialogue_turn": {
      const cfg = (item.config ?? {}) as ConvoCfg;
      const turns = (cfg.turns ?? []).map((x, i) => ({ line: x.say, keywords: x.keywords, auto: CONVO_AUTO[i] ?? x.keywords.slice(0, 3).join(" "), seconds: 20 }));
      if (turns.length) {
        return { ...base, kind: "convo", instruction: loc(item.stem, "en"), turns, need: cfg.need ?? turns.length, endReply: "Thank you. See you soon." };
      }
      break;
    }
    case "relay":
    case "explain_chart":
    case "translate_gist": {
      const cfg = (item.config ?? {}) as RelayCfg;
      if (cfg.source && cfg.questions?.length) {
        return {
          ...base,
          kind: "relay",
          instruction: loc(item.stem, "en"),
          turns: [{ line: cfg.source, auto: RELAY_AUTO, seconds: 30 }],
          need: cfg.need ?? 1,
          questions: cfg.questions,
          source: cfg.source,
          endReply: "Thank you. Now I know what to do.",
        };
      }
      break;
    }
    default:
      break;
  }
  // Shadow, read aloud, describe the picture, and any other spoken item: one
  // model line she says first and the learner says back.
  const cfg = (item.config ?? {}) as OpenCfg;
  const model = String(item.key ?? "") || loc(item.stem, "en");
  return { ...base, kind: "model", instruction: loc(item.stem, "en"), turns: [{ line: model, model, auto: model, seconds: cfg.seconds ?? 12 }] };
}

const clean = (w: string) => w.toLowerCase().replace(/[^a-z']/g, "");

/** Scoring works on lower-case words; the learner sees a readable one. */
function tidy(w: string): string {
  const s = w.replace(/[.,?!]/g, "").replace(/\bi\b/g, "I");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** The word to practise: the longest one the coach did not hear. */
function hardestWord(missed: string[], line: string): string {
  const pick = [...missed].sort((a, b) => b.length - a.length)[0];
  const words = line.split(/\s+/);
  if (pick) {
    const shown = words.find((w) => clean(w) === pick || clean(w).startsWith(pick.slice(0, 4)));
    return shown ? shown.replace(/[.,?!]/g, "") : tidy(pick);
  }
  return (words.sort((a, b) => clean(b).length - clean(a).length)[0] ?? line).replace(/[.,?!]/g, "");
}

/** What she does about this attempt: a word she did not hear, said slowly and
 *  shown big, or the whole line again slowly when every word was there and it
 *  was the shape of it that slipped. Never a generic retry line. */
function reactTo(score: SpeechScore, turn: Turn): { say: string; show: string; big: boolean } {
  const line = turn.model ?? turn.line;
  const teachable = score.missed.filter((m) => m.length >= MIN_TEACH_LEN);
  if (teachable.length) {
    const word = hardestWord(teachable, line);
    return { say: word, show: word, big: true };
  }
  return { say: line, show: line, big: false };
}

/** The one short sentence she answers a landed attempt with: the scene's own
 *  reply where there is one, otherwise a line about what she actually heard. */
function replyTo(score: SpeechScore, plan: Plan): string {
  if (plan.sceneReply) return plan.sceneReply;
  if (plan.kind === "model") return score.missed.length ? "Good. Almost every word." : "Every word. Well done.";
  const heard = score.matched.find((m) => m.length >= MIN_TEACH_LEN);
  return heard ? `Thank you. I heard “${tidy(heard)}”.` : plan.endReply;
}

/** A 30 fps clock. Still at a settled frame when the learner reduces motion. */
function useFrame(still: boolean): number {
  const [frame, setFrame] = useState(still ? 40 : 0);
  useEffect(() => {
    if (still) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      setFrame(Math.round(((now - t0) / 1000) * FPS));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [still]);
  return frame;
}

type Stage = "say" | "listen" | "word" | "reply" | "end";

export function Coach({ item, onAnswer, onNext, dayParity = 0 }: ItemProps) {
  const { t, say, speed, reduceMotion } = useLp();
  const plan = useMemo(() => buildPlan(item, dayParity, t), [item, dayParity, t]);
  const frame = useFrame(reduceMotion);
  const frameRef = useRef(frame);
  frameRef.current = frame;

  const [stage, setStage] = useState<Stage>("say");
  const [talking, setTalking] = useState(true);
  const [turnIdx, setTurnIdx] = useState(0);
  const [score, setScore] = useState<SpeechScore | null>(null);
  // The one line on screen is always the last thing the coach said.
  const [lineText, setLineText] = useState(plan.turns[0]?.line ?? "");
  const [note, setNote] = useState("");
  const [heard, setHeard] = useState("");
  const [bigWord, setBigWord] = useState("");
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [bowFrom, setBowFrom] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  const opened = useRef(false);
  const turnRef = useRef(0);
  const triesRef = useRef(1);
  // Extra goes after the task has been judged: practice, never fresh evidence.
  const practice = useRef(false);
  const said = useRef<string[]>([]);
  const onTask = useRef(0);
  const repaired = useRef(false);
  const asked = useRef(0);
  const spentMs = useRef(0);

  const turn = plan.turns[Math.min(turnIdx, plan.turns.length - 1)];

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  /** Say one line, then carry on. The browser voice does not always report the
   *  end (a device with no voices installed), so a length estimate always moves
   *  the turn on. */
  const speak = useCallback((text: string, then: () => void, slow = false) => {
    setTalking(true);
    const words = text.split(/\s+/).filter(Boolean).length;
    const estimate = (slow ? 760 : 430) * words + 800;
    const startedAt = Date.now();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      setTalking(false);
      then();
    };
    const atEnd = () => {
      const left = MIN_TALK_MS - (Date.now() - startedAt);
      if (left > 0) later(finish, left);
      else finish();
    };
    later(finish, estimate);
    if (slow) sayAtRate(text, Math.min(0.6, speed), atEnd);
    else say(text, atEnd);
  }, [later, say, speed]);

  /** She takes the turn: says this line, then listens. */
  const open = useCallback((i: number) => {
    const next = plan.turns[Math.min(i, plan.turns.length - 1)];
    turnRef.current = i;
    setTurnIdx(i);
    setBigWord("");
    setLineText(next.line);
    setStage("say");
    speak(next.line, () => setStage("listen"));
  }, [plan, speak]);

  const ask = useCallback(() => open(turnRef.current), [open]);

  // The coach opens the turn herself: she speaks first, like a person would.
  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    ask();
  }, [ask]);

  useEffect(() => () => { clearTimers(); stopSpeaking(); }, [clearTimers]);

  /** The attempt landed: she answers it and the turn rests. */
  const land = (line: string) => {
    setStage("reply");
    setBowFrom(frameRef.current);
    setLineText(line);
    speak(line, () => undefined);
  };

  /** The tries are spent. She says good try; the word stays on screen and
   *  there is still a way to have another go. Never a mark, never a fail. */
  const rest = () => {
    setStage("end");
    speak(GOOD_TRY, () => undefined);
  };

  /** One word or the line again, slowly, then she asks once more. */
  const teach = (r: { say: string; show: string; big: boolean }) => {
    setBigWord(r.big ? r.show : "");
    setLineText(r.show);
    setStage("word");
    const last = triesRef.current >= MAX_TRIES || practice.current;
    if (!last) triesRef.current += 1;
    speak(r.say, () => later(() => (last ? rest() : ask()), 300), true);
  };

  const judgeSaid = (transcript: string, ms: number) => {
    const s = turn.model
      ? scoreReadAloud(turn.model, transcript, ms)
      : scoreOpenResponse(transcript, plan.open ?? {}, ms);
    // Below the confidence gate nothing is written as evidence and nothing is
    // scored on screen: she says the line again, slowly, and asks once more.
    if (s.confidence < 0.6) {
      setScore(null);
      setNote(t("practise_again"));
      teach({ say: turn.model ?? turn.line, show: turn.model ?? turn.line, big: false });
      return;
    }
    setNote("");
    setScore(s);
    if (!practice.current) {
      onAnswer({
        correct: s.pass,
        modality: "spoken",
        response_ms: ms,
        attempt_n: triesRef.current,
        score: s.overall,
        sub_scores: { sounds: s.sounds, rhythm: s.rhythm, words: s.words },
        ai_confidence: s.confidence,
        transcript,
        ai: true,
        task_id: turn.model ? item.item_id : `${item.item_id}:${dayParity % 2}`,
      });
    }
    if (s.pass) { land(replyTo(s, plan)); return; }
    teach(reactTo(s, turn));
  };

  const judgeConvo = (transcript: string, ms: number) => {
    const i = turnRef.current;
    const ok = classifyTurn(transcript, turn.keywords ?? []);
    said.current.push(transcript);
    spentMs.current += ms;
    // Off task once: she asks again in her own words, then takes what comes.
    if (!ok && !repaired.current) {
      repaired.current = true;
      setLineText(t("not_caught"));
      setStage("say");
      speak(t("not_caught"), () => setStage("listen"));
      return;
    }
    onTask.current += ok ? 1 : 0;
    const next = i + 1;
    if (next < plan.turns.length) {
      repaired.current = false;
      open(next);
      return;
    }
    const correct = onTask.current >= plan.need;
    if (!practice.current) {
      onAnswer({
        correct,
        modality: "spoken",
        response_ms: spentMs.current,
        attempt_n: triesRef.current,
        score: onTask.current / plan.turns.length,
        sub_scores: { on_task: onTask.current, turns: plan.turns.length },
        ai_confidence: 0.85,
        transcript: said.current.join(" / "),
        ai: true,
        task_id: item.item_id,
      });
    }
    if (correct) land(plan.endReply);
    else { setLineText(turn.line); rest(); }
  };

  const judgeRelay = (transcript: string, ms: number) => {
    said.current.push(transcript);
    spentMs.current += ms;
    const all = said.current.join(" ").trim();
    const r = scoreRelay(all, plan.questions, plan.source ?? "");
    setAnswered(r.answered);
    const landed = r.answered.filter(Boolean).length;
    const ok = landed >= plan.need;
    // She is still missing something: she asks for that one thing, not for
    // the whole notice again.
    if (!ok && asked.current < 2) {
      asked.current += 1;
      const missing = plan.questions.find((_, i) => !r.answered[i]);
      const q = missing?.q ?? turn.line;
      setLineText(q);
      setStage("say");
      speak(q, () => setStage("listen"));
      return;
    }
    if (!practice.current) {
      onAnswer({
        correct: ok,
        modality: "spoken",
        response_ms: spentMs.current,
        attempt_n: triesRef.current,
        score: landed / Math.max(1, plan.questions.length),
        sub_scores: { answered: landed, paraphrase: r.paraphrase },
        ai_confidence: all.split(" ").length >= 3 ? 0.85 : 0.5,
        transcript: all,
        ai: true,
        task_id: item.item_id,
      });
    }
    if (ok) land(plan.endReply);
    else rest();
  };

  const judge = (transcript: string, ms: number) => {
    if (stage === "reply" || stage === "end") return;
    clearTimers();
    stopSpeaking();
    setTalking(false);
    setBigWord("");
    if (!transcript.trim()) {
      setStage("say");
      setLineText(t("not_caught"));
      speak(t("not_caught"), () => ask());
      return;
    }
    setHeard(transcript);
    if (plan.kind === "convo") { judgeConvo(transcript, ms); return; }
    if (plan.kind === "relay") { judgeRelay(transcript, ms); return; }
    judgeSaid(transcript, ms);
  };

  /** Another go, whenever the learner wants one. The task has already been
   *  judged, so these goes are practice and write nothing. */
  const again = () => {
    clearTimers();
    stopSpeaking();
    practice.current = true;
    said.current = [];
    onTask.current = 0;
    repaired.current = false;
    asked.current = 0;
    spentMs.current = 0;
    setScore(null);
    setHeard("");
    setNote("");
    setAnswered([]);
    setBowFrom(null);
    open(0);
  };

  const ended = stage === "reply" || stage === "end";
  const gesture: Gesture = stage === "listen" ? "listen" : stage === "word" ? "point" : stage === "reply" ? "thumbs" : "idle";
  const mood: Mood = stage === "reply" ? "happy" : "neutral";
  const bow = bowFrom === null || reduceMotion ? 0 : (() => {
    const d = frame - bowFrom;
    if (d < 0 || d > 34) return 0;
    return Math.sin(d / 3.2) * 9 * (1 - d / 34);
  })();

  // A hard word stays whole; a long prompt reads as chips, not as big tiles.
  const words = bigWord ? [bigWord] : lineText.split(/\s+/).filter(Boolean);
  const compact = !bigWord && words.length > 8;
  // Only the model line itself has words to mark as missed.
  const missedNow = turn.model && lineText === turn.model ? score?.missed ?? [] : [];
  // A turn that did not land carries no score: the word she teaches is the
  // only thing she gives back.
  const showScore = !!score?.pass && !!heard && stage !== "word";
  const dots = plan.kind === "relay" ? plan.questions.map((_, i) => !!answered[i])
    : plan.kind === "convo" ? plan.turns.map((_, i) => i < turnIdx || ended) : [];

  return (
    <div className="flex h-full flex-col">
      <Instruction>{plan.instruction}</Instruction>
      <CoachStage
        frame={frame}
        talking={talking}
        gesture={gesture}
        mood={mood}
        bow={bow}
        label="Your coach"
        onTap={() => {
          clearTimers();
          stopSpeaking();
          // Tap her to hear it again: the word she is teaching, then the line
          // again; her last line when the turn is at rest.
          if (ended) speak(lineText, () => undefined);
          else if (stage === "word") speak(lineText, () => later(ask, 250), true);
          else ask();
        }}
        tapLabel={t("listen")}
      />
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5" dir="ltr">
        {words.map((w, i) => {
          const c = clean(w);
          const missed = missedNow.some((m) => c === m || (c.length > 3 && (c.startsWith(m.slice(0, 4)) || m.startsWith(c.slice(0, 4)))));
          return (
            <button
              key={`${lineText}-${i}`}
              type="button"
              onClick={() => say(w.replace(/[.,?!]/g, ""))}
              className="lp-tile"
              style={bigWord
                ? { fontSize: "calc(40px * var(--lp-scale))", fontWeight: 700, padding: "10px 22px", color: "var(--lp-accent)" }
                : {
                  minHeight: 44,
                  fontSize: `calc(${compact ? 16 : 20}px * var(--lp-scale))`,
                  padding: compact ? "8px 12px" : undefined,
                  ...(missed ? { color: "var(--lp-accent)", borderColor: "var(--lp-accent-line)" } : {}),
                }}
            >
              {w}
            </button>
          );
        })}
      </div>
      {/* One dot per thing still to do: the only progress signal on screen. */}
      {dots.length > 0 && stage !== "word" ? (
        <div className="mt-3 flex items-center justify-center gap-2">
          {dots.map((on, i) => <span key={i} className={`lp-dot ${on ? "lp-dot-on" : ""}`} />)}
        </div>
      ) : null}
      {/* While she says the hard word that word is the only thing on screen. */}
      {note && stage !== "word" ? <div className="lp-small mt-2 text-center" style={{ color: "var(--lp-sand)" }}>{note}</div> : null}
      {showScore && score ? (
        <div className="lp-fade-in mt-3">
          <ResultBars score={score} />
          <div className="lp-small text-center" style={{ color: "var(--lp-paper-faint)" }}>{t("scene_said")}: “{heard}”</div>
        </div>
      ) : null}
      <div className="mt-auto pt-3">
        {ended ? (
          <div className="flex gap-2">
            <GlowButton secondary size="normal" className="!w-32 shrink-0" onClick={again}>{t("retry")}</GlowButton>
            <GlowButton size="normal" onClick={() => { clearTimers(); stopSpeaking(); onNext(); }}>{stage === "reply" ? t("continue") : t("keep_going")}</GlowButton>
          </div>
        ) : (
          <Recorder
            maxSeconds={turn.seconds}
            hint={t("mic_hint")}
            autoText={turn.auto}
            onDone={(tr, ms) => judge(tr, ms)}
          />
        )}
      </div>
    </div>
  );
}

/** The tutor on a lit stage: a 2D flat-vector figure framed from the waist. */
function CoachStage({ frame, talking, gesture, mood, bow, label, onTap, tapLabel }: {
  frame: number; talking: boolean; gesture: Gesture; mood: Mood; bow: number; label: string; onTap: () => void; tapLabel: string;
}) {
  const poseRef = useRef<{ g: Gesture; from: Gesture; at: number }>({ g: gesture, from: gesture, at: 0 });
  if (poseRef.current.g !== gesture) poseRef.current = { g: gesture, from: poseRef.current.g, at: frame };
  const pose = poseRef.current;
  return (
    <div className="lp-video flex min-h-0 flex-1 items-end justify-center" style={{ maxHeight: 330 }}>
      <button type="button" onClick={onTap} aria-label={tapLabel} className="flex h-full w-full items-end justify-center" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
        <svg viewBox="0 54 420 308" role="img" aria-label={label} style={{ width: "100%", height: "100%", display: "block" }}>
          <defs>
            <radialGradient id="lp-coach-lamp" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{ stopColor: "var(--lp-glow-2)", stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: "var(--lp-glow)", stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <circle cx="210" cy="200" r="165" fill="url(#lp-coach-lamp)" />
          <g transform={`translate(0 ${bow})`}>
            <Character
              who="maya"
              x={210}
              y={500}
              frame={frame}
              scale={0.92}
              legs={false}
              seed={SEED}
              talking={talking}
              gesture={pose.g}
              from={pose.from}
              gestureAt={pose.at}
              mood={mood}
            />
          </g>
        </svg>
      </button>
    </div>
  );
}
