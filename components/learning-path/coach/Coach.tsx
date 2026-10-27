"use client";

// The coach: a talk-like speaking turn with an animated 2D tutor. She is the
// heart of every spoken item, so every item whose modality is spoken comes
// through here when it is used in a free-use phase: a model line to repeat, an
// open answer, a three-turn conversation, or retelling a notice to a friend.
//
// She opens by speaking, then listens, then answers what was actually said.
// Every turn ends in exactly one of three named responses and there is no
// fourth: Clear, Nearly, or Hard word (LP-80, voice ruled on LP-70). A weak
// attempt is never a mark: the word she did not hear comes back slowly and big,
// behind a spoken lead-in that says what is coming, then she asks once more.
// When the tries are spent the difficulty sits in the item, not in the learner,
// and there is always a way to try again. No red, no crosses, no score.
//
// Four things are on the screen and nothing else, to the board's element
// budget: her, the line she just said, one line of feedback in words, the mic.
// No meters, no "you said", no dots, no chips, no second instruction line.
//
// The figure is Maya from the pre-rendered cast, the same face the prototypes
// and the explainers use, so the tutor in a lesson and the tutor in practice
// are the same person. Which expression shows is a pure function of the frame
// and the turn state, so it is deterministic and stops dead when the learner
// has asked for less motion.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type Gesture, type Mood } from "../explainer/lib";
import { Face, type CastFace } from "../art/cast";
import { Recorder, type ItemProps } from "../items";
import { loc, makeT } from "@/lib/learning-path/i18n";
import { classifyTurn, scoreOpenResponse, scoreReadAloud, scoreRelay, type SceneIntent, type SpeechScore } from "@/lib/learning-path/scoring";
import { say as sayAtRate, stopSpeaking } from "@/lib/learning-path/speech";
import type { Item } from "@/lib/learning-path/types";
import { GlowButton, useLp } from "../ui";

/** Every spoken item is a turn with the coach, not a mic under a prompt. */
export function isCoachItem(item: Item): boolean {
  return item.modality === "spoken";
}

const FPS = 30;
/** The coach never finishes a line before this, so her mouth is seen moving. */
const MIN_TALK_MS = 900;
/** One try and two retries before she offers the choice to carry on. */
const MAX_TRIES = 3;

/** A target word shorter than this teaches nothing on its own (a suffix). */
const MIN_TEACH_LEN = 3;

// The three named responses and the tries-spent line are interface strings, so
// the text on screen is translated. Her voice is always the English value:
// CLAUDE.md keeps the lesson audio in English, and a learner who has just
// missed a line should not be handed the retry as a second listening task.
const tEn = makeT("en");

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

/** One of the two near responses. Hard word: a word she did not hear, said
 *  slowly and shown big. Nearly: the whole line again slowly, when every word
 *  was there and it was the shape of it that slipped. Each one opens with a
 *  spoken lead-in, because a bare word with no frame teaches nothing. */
type Near = { lead: string; say: string; show: string; big: boolean };

/** Nearly: the whole line once more, slowly. */
function nearly(turn: Turn): Near {
  const line = turn.model ?? turn.line;
  return { lead: tEn("coach_nearly"), say: line, show: line, big: false };
}

/** Which of the two near responses this attempt earns. */
function reactTo(score: SpeechScore, turn: Turn): Near {
  const line = turn.model ?? turn.line;
  const teachable = score.missed.filter((m) => m.length >= MIN_TEACH_LEN);
  if (teachable.length) {
    const word = hardestWord(teachable, line);
    return { lead: tEn("coach_hard_word"), say: word, show: word, big: true };
  }
  return nearly(turn);
}

/** Clear: what she says to a landed attempt. The scene's own reply where there
 *  is one, otherwise the single ruled Clear line, which is never sorted by how
 *  clean the attempt was. `show` left out means the sentence stays on screen,
 *  settled, and the feedback slot alone names the Clear in the learner's
 *  language, so the same sentence never appears twice. */
function replyTo(score: SpeechScore, plan: Plan): { say: string; show?: string } {
  if (plan.sceneReply) return { say: plan.sceneReply, show: plan.sceneReply };
  if (plan.kind === "model") return { say: tEn("coach_clear") };
  const heard = score.matched.find((m) => m.length >= MIN_TEACH_LEN);
  const line = heard ? `Thank you. I heard “${tidy(heard)}”.` : plan.endReply;
  return { say: line, show: line };
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
  // The one line on screen is always the last thing the coach said. The
  // sub-scores are never state: they go to onAnswer() as evidence and the
  // learner is shown words, never a number and never a marked-up sentence.
  const [lineText, setLineText] = useState(plan.turns[0]?.line ?? "");
  const [bigWord, setBigWord] = useState("");
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
  const land = (r: { say: string; show?: string }) => {
    setStage("reply");
    setBowFrom(frameRef.current);
    if (r.show !== undefined) setLineText(r.show);
    speak(r.say, () => undefined);
  };

  /** The tries are spent. The difficulty goes in the item, not the learner: no
   *  praise for effort and no fail. The word stays on screen and there is still
   *  a way to have another go, by choice and never by instruction. */
  const rest = () => {
    setStage("end");
    speak(tEn("coach_tries_spent"), () => undefined);
  };

  /** A near response: the lead-in that says what is coming, then the word or
   *  the line itself slowly, then she asks once more. A hard word is said twice,
   *  because one pass of a single unfamiliar word is not a model to copy. */
  const teach = (r: Near) => {
    setBigWord(r.big ? r.show : "");
    setLineText(r.show);
    setStage("word");
    const last = triesRef.current >= MAX_TRIES || practice.current;
    if (!last) triesRef.current += 1;
    const onward = () => later(() => (last ? rest() : ask()), 300);
    const target = (then: () => void) => speak(r.say, then, true);
    speak(r.lead, () => target(r.big ? () => later(() => target(onward), 250) : onward));
  };

  const judgeSaid = (transcript: string, ms: number) => {
    const s = turn.model
      ? scoreReadAloud(turn.model, transcript, ms)
      : scoreOpenResponse(transcript, plan.open ?? {}, ms);
    // Below the confidence gate nothing is written as evidence: this is the
    // Nearly response, so it is the Nearly lead-in and the line again slowly.
    // No second on-screen instruction, which the lead-in already carries.
    if (s.confidence < 0.6) {
      teach(nearly(turn));
      return;
    }
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
    if (correct) land({ say: plan.endReply, show: plan.endReply });
    else { setLineText(turn.line); rest(); }
  };

  const judgeRelay = (transcript: string, ms: number) => {
    said.current.push(transcript);
    spentMs.current += ms;
    const all = said.current.join(" ").trim();
    const r = scoreRelay(all, plan.questions, plan.source ?? "");
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
    if (ok) land({ say: plan.endReply, show: plan.endReply });
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

  // A hard word stays whole. A long line (a notice she reads out) is a
  // paragraph, not a row of word buttons: nothing there is big enough to tap.
  const words = bigWord ? [bigWord] : lineText.split(/\s+/).filter(Boolean);
  const long = !bigWord && words.length > 8;
  // One line in words, never a score and never two lines at once: what to do
  // before the learner speaks, which of the three responses after. This slot is
  // the only place the judgement is written, and it is written in words.
  const feedback = stage === "word" ? (bigWord ? t("coach_hard_word") : t("coach_nearly"))
    : stage === "end" ? t("coach_tries_spent")
    : stage === "reply" && plan.kind === "model" ? t("coach_clear")
    : plan.instruction;

  return (
    <div className="flex h-full flex-col">
      <CoachStage
        frame={frame}
        talking={talking}
        gesture={gesture}
        mood={mood}
        bow={bow}
        label={t("coach_label")}
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
      {/* The line she just said. Tap a word to hear that word on its own: the
          words are the line, not a second row of chips under it. Every word
          reads the same, landed or missed: the sentence is a sentence, not a
          marked-up answer. */}
      <div className="mt-4 text-center" style={{ color: "var(--lp-paper)" }} dir="ltr">
        {long ? (
          <p className="lp-lesson">{lineText}</p>
        ) : (
          <span className="flex flex-wrap items-center justify-center">
            {words.map((w, i) => (
              <button
                key={`${lineText}-${i}`}
                type="button"
                onClick={() => say(w.replace(/[.,?!]/g, ""))}
                className="inline-flex items-center justify-center"
                style={bigWord
                  ? { minHeight: 64, padding: "0 10px", fontSize: "calc(40px * var(--lp-scale))", fontWeight: 700, color: "var(--lp-accent)" }
                  // The 44px tap box comes from the padding, not from a
                  // minimum width: a min-width pushed "I" and "a" out to 44px
                  // and blew gaps through the middle of her line.
                  : { minHeight: 44, padding: "0 5px", fontSize: "calc(22px * var(--lp-scale))", fontWeight: 600 }}
              >
                {w}
              </button>
            ))}
          </span>
        )}
      </div>
      {/* One line of feedback, in words. The slot is always there, so nothing
          on the screen moves when she answers. */}
      <div className="lp-small mt-2 text-center" style={{ color: "var(--lp-paper-faint)", minHeight: 19 }}>{feedback}</div>
      <div className="mt-auto pt-3">
        {ended ? (
          <div className="flex gap-2">
            <GlowButton secondary size="normal" className="!w-32 shrink-0" onClick={again}>{t("retry")}</GlowButton>
            <GlowButton size="normal" onClick={() => { clearTimers(); stopSpeaking(); onNext(); }}>{stage === "reply" ? t("continue") : t("keep_going")}</GlowButton>
          </div>
        ) : (
          <Recorder
            maxSeconds={turn.seconds}
            // The one line above the mic already says what to do, so the
            // recorder's own hint would be a second instruction line.
            hint=""
            autoText={turn.auto}
            onDone={(tr, ms) => judge(tr, ms)}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Maya on a sun block, oversized and cropped by the card.
 *
 * The art is the pre-rendered cast (docs/design/brief.md, "Illustration
 * source"), never redrawn: talking is a swap between the talk and idle faces on
 * the syllable beat, listening is the listen face with a lean-in, and a
 * response is one of the named reaction faces. Which face shows is a pure
 * function of the frame and the turn, so it is deterministic and stops dead
 * when the learner has asked for less motion.
 */
function CoachStage({ frame, talking, gesture, mood, bow, label, onTap, tapLabel }: {
  frame: number; talking: boolean; gesture: Gesture; mood: Mood; bow: number; label: string; onTap: () => void; tapLabel: string;
}) {
  // 30 fps, so four frames is about the 125 ms beat the prototype speaks on.
  const beat = Math.floor(frame / 4) % 2 === 0;
  const face: CastFace = gesture === "listen" ? "listen"
    : talking ? (beat ? "talk" : "idle")
    : mood === "happy" ? "happy"
    : gesture === "thumbs" ? "wow"
    : gesture === "point" ? "oops"
    : "idle";
  const listening = gesture === "listen";
  return (
    <div className="lp-video flex min-h-0 flex-1 items-end justify-center" style={{ minHeight: 300 }}>
      <button type="button" onClick={onTap} aria-label={tapLabel} className="relative flex h-full w-full items-end justify-center overflow-hidden" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
        <Face
          face={face}
          title={label}
          fit="xMidYMin slice"
          style={{
            position: "absolute",
            insetInlineStart: "50%",
            bottom: listening ? -14 : 0,
            width: "118%",
            height: "128%",
            transform: `translateX(-50%) translateY(${bow}px)${listening ? " scale(1.06) rotate(-2deg)" : ""}`,
            transformOrigin: "50% 100%",
            transition: "transform var(--lp-t-move) var(--lp-ease-emph), bottom var(--lp-t-move) var(--lp-ease-emph)",
          }}
        />
      </button>
    </div>
  );
}
