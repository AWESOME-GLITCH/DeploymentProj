"use client";

// The coach: a talk-like pronunciation turn with an animated 2D tutor.
// She says the line, shows it as tappable words, listens, scores the attempt
// and answers in one short English sentence. While she talks only the figure,
// the one line and the mic are on screen; the sounds, rhythm and words detail
// arrives after the attempt. A weak attempt gets the hardest word said slowly
// and shown big, then one more ask. Two retries at most, then she moves on.
//
// The figure is the explainer kit character, so the tutor in a lesson and the
// tutor in practice are the same person. Every pose is a pure function of the
// frame and the turn state, so it is deterministic and stops dead when the
// learner has asked for less motion.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Character, type Gesture, type Mood } from "../explainer/lib";
import { Instruction, Recorder, ResultBars, type ItemProps } from "../items";
import { loc } from "@/lib/learning-path/i18n";
import { scoreOpenResponse, scoreReadAloud, type SpeechScore } from "@/lib/learning-path/scoring";
import { say as sayAtRate, stopSpeaking } from "@/lib/learning-path/speech";
import type { Item } from "@/lib/learning-path/types";
import { GlowButton, useLp } from "../ui";

/** The use items the coach takes over from the recorder-only layout. */
export function isCoachItem(item: Item): boolean {
  return item.item_type === "say_it_see_it" || item.item_type === "open_response";
}

const FPS = 30;
const SEED = 23;
/** The coach never finishes a line before this, so her mouth is seen moving. */
const MIN_TALK_MS = 900;
/** One try and two retries. */
const MAX_TRIES = 3;

/** A typed stand-in rich enough to pass any open task, for the tester hook. */
const OPEN_AUTO = "I'm Fatima. I live in Dubai and I work in a shop. Yesterday I worked and tomorrow I will visit a friend. I'd like a coffee please, could I have the bill instead.";

type OpenCfg = { targets?: string[]; min_sentences?: number; need?: number; seconds?: number; variants?: string[]; teach_back?: boolean };

type Stage = "say" | "listen" | "word" | "reply" | "end";

type Turn = {
  /** The small line above the stage: what this turn is for. */
  instruction: string;
  /** What the coach says, and the one line of text on screen. */
  line: string;
  /** The words the learner says back, when the turn is a model line. */
  model?: string;
  /** One short sentence when the attempt is strong. */
  reply: string;
  auto: string;
  seconds: number;
};

function buildTurn(item: Item, dayParity: number, t: (k: string) => string): Turn {
  if (item.item_type === "say_it_see_it") {
    const cfg = (item.config ?? {}) as { intent?: { action?: string }; model?: string };
    const model = cfg.model ?? String(item.key ?? "");
    return {
      instruction: loc(item.stem, "en"),
      line: model,
      model,
      reply: cfg.intent?.action === "bill" ? "Of course. Here you are." : "Coming right up.",
      auto: model,
      seconds: 12,
    };
  }
  const cfg = (item.config ?? {}) as OpenCfg;
  const prompt = cfg.variants?.[dayParity % (cfg.variants?.length || 1)] ?? loc(item.stem, "en");
  return {
    instruction: cfg.teach_back ? t("teach_back_title") : t("your_turn"),
    line: prompt,
    reply: "Thank you. That was clear.",
    auto: OPEN_AUTO,
    seconds: cfg.seconds ?? 30,
  };
}

const clean = (w: string) => w.toLowerCase().replace(/[^a-z']/g, "");

/** The word to practise: the longest one the coach did not hear. */
function hardestWord(score: SpeechScore, line: string): string {
  const missed = [...score.missed].sort((a, b) => b.length - a.length)[0];
  const words = line.split(/\s+/);
  if (missed) {
    const shown = words.find((w) => clean(w) === missed || clean(w).startsWith(missed.slice(0, 4)));
    return (shown ?? missed).replace(/[.,?!]/g, "");
  }
  return (words.sort((a, b) => clean(b).length - clean(a).length)[0] ?? line).replace(/[.,?!]/g, "");
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

export function Coach({ item, onAnswer, onNext, dayParity = 0 }: ItemProps) {
  const { t, say, speed, reduceMotion } = useLp();
  const turn = useMemo(() => buildTurn(item, dayParity, t), [item, dayParity, t]);
  const frame = useFrame(reduceMotion);
  const frameRef = useRef(frame);
  frameRef.current = frame;

  const [stage, setStage] = useState<Stage>("say");
  const [talking, setTalking] = useState(true);
  const [tries, setTries] = useState(1);
  const [score, setScore] = useState<SpeechScore | null>(null);
  const [note, setNote] = useState("");
  const [heard, setHeard] = useState("");
  const [bigWord, setBigWord] = useState("");
  const [bowFrom, setBowFrom] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  const opened = useRef(false);

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

  const ask = useCallback(() => {
    setBigWord("");
    speak(turn.line, () => setStage("listen"));
    setStage("say");
  }, [speak, turn.line]);

  // The coach opens the turn herself: she speaks first, like a person would.
  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    ask();
  }, [ask]);

  useEffect(() => () => { clearTimers(); stopSpeaking(); }, [clearTimers]);

  const judge = (transcript: string, ms: number) => {
    if (stage === "reply" || stage === "end") return;
    clearTimers();
    stopSpeaking();
    setTalking(false);
    setBigWord("");
    if (!transcript.trim()) {
      setNote(t("not_caught"));
      setStage("say");
      speak(t("not_caught"), () => setStage("listen"));
      return;
    }
    const s = turn.model
      ? scoreReadAloud(turn.model, transcript, ms)
      : scoreOpenResponse(transcript, (item.config ?? {}) as OpenCfg, ms);
    setScore(s);
    setHeard(transcript);
    // Below the confidence gate nothing is written as evidence: just ask again.
    if (s.confidence < 0.6) {
      setNote(t("practise_again"));
      setStage("listen");
      return;
    }
    setNote("");
    onAnswer({
      correct: s.pass,
      modality: "spoken",
      response_ms: ms,
      attempt_n: tries,
      score: s.overall,
      sub_scores: { sounds: s.sounds, rhythm: s.rhythm, words: s.words },
      ai_confidence: s.confidence,
      transcript,
      ai: true,
      task_id: turn.model ? item.item_id : `${item.item_id}:${dayParity % 2}`,
    });
    if (s.pass) {
      setStage("reply");
      setBowFrom(frameRef.current);
      speak(turn.reply, () => undefined);
      return;
    }
    if (tries >= MAX_TRIES) {
      setStage("end");
      speak("Good try. Let us keep going.", () => undefined);
      return;
    }
    setTries((n) => n + 1);
    const word = hardestWord(s, turn.model ?? turn.line);
    setBigWord(word);
    setStage("word");
    speak(word, () => later(() => ask(), 250), true);
  };

  const ended = stage === "reply" || stage === "end";
  const gesture: Gesture = stage === "listen" ? "listen" : stage === "word" ? "point" : stage === "reply" ? "thumbs" : "idle";
  const mood: Mood = stage === "reply" ? "happy" : "neutral";
  const bow = bowFrom === null || reduceMotion ? 0 : (() => {
    const d = frame - bowFrom;
    if (d < 0 || d > 34) return 0;
    return Math.sin(d / 3.2) * 9 * (1 - d / 34);
  })();

  const words = (bigWord ? [bigWord] : turn.line.split(/\s+/)).filter(Boolean);
  // Only a model line has words to mark: open answers miss target phrases.
  const missedNow = turn.model ? score?.missed ?? [] : [];

  return (
    <div className="flex h-full flex-col">
      <Instruction>{turn.instruction}</Instruction>
      <CoachStage
        frame={frame}
        talking={talking}
        gesture={gesture}
        mood={mood}
        bow={bow}
        label="Your coach"
        onTap={() => { clearTimers(); stopSpeaking(); ask(); }}
        tapLabel={t("listen")}
      />
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5" dir="ltr">
        {words.map((w, i) => {
          const c = clean(w);
          const missed = missedNow.some((m) => c === m || (c.length > 3 && (c.startsWith(m.slice(0, 4)) || m.startsWith(c.slice(0, 4)))));
          return (
            <button
              key={`${stage === "word" ? "big" : "line"}-${i}`}
              type="button"
              onClick={() => say(w.replace(/[.,?!]/g, ""))}
              className="lp-tile"
              style={bigWord
                ? { fontSize: "calc(40px * var(--lp-scale))", fontWeight: 700, padding: "10px 22px", color: "var(--lp-accent)" }
                : { minHeight: 44, fontSize: "calc(20px * var(--lp-scale))", ...(missed ? { color: "var(--lp-accent)", borderColor: "var(--lp-accent-line)" } : {}) }}
            >
              {w}
            </button>
          );
        })}
      </div>
      {!talking && note ? <div className="lp-small mt-2 text-center" style={{ color: "var(--lp-sand)" }}>{note}</div> : null}
      {!talking && score && heard ? (
        <div className="lp-fade-in mt-3">
          <ResultBars score={score} />
          <div className="lp-small text-center" style={{ color: "var(--lp-paper-faint)" }}>{t("scene_said")}: “{heard}”</div>
        </div>
      ) : null}
      <div className="mt-auto pt-3">
        {ended ? (
          <GlowButton onClick={() => { clearTimers(); stopSpeaking(); onNext(); }}>{stage === "reply" ? t("continue") : t("keep_going")}</GlowButton>
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
