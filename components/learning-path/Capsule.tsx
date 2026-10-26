"use client";

// The capsule: during a session the navigation hides, content flows as a
// vertical story with a thin progress line at the top, exit is a single icon
// that pauses and keeps the exact phase, and the session ends itself.

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Pause, Play, X } from "lucide-react";
import { ATOM_BY_ID, ITEM_BY_ID } from "@/lib/learning-path/content";
import { dayIndex, phaseMinutes, tryToUse } from "@/lib/learning-path/engine";
import { CEFR_LABEL, loc } from "@/lib/learning-path/i18n";
import { useNow, useStore } from "@/lib/learning-path/store";
import type { Atom, AtomPhase, Item, Localised, SessionPhase } from "@/lib/learning-path/types";
import { ItemRenderer, type ItemResult } from "./items";
import { GlowButton, LocText, ProgressLine, Say, useLp } from "./ui";
import { Scene, sceneFor } from "./scenes";
import { ExplainerPlayer, hasExplainer } from "./explainer/ExplainerPlayer";
import { Coach, isCoachItem } from "./coach/Coach";

export function Capsule({ onExit, onComplete }: { onExit: () => void; onComplete: () => void }) {
  const { state, dispatch } = useStore();
  const { t } = useLp();
  const cur = state.current;
  const [paused, setPaused] = useState(false);
  if (!cur) return null;
  const { session } = cur;
  const phase = session.phases[cur.phase_index];
  const total = session.phases.reduce((a, p) => a + phaseMinutes(p), 0);
  const done = session.phases.slice(0, cur.phase_index).reduce((a, p) => a + phaseMinutes(p), 0);
  const progress = Math.min(1, (done + phaseMinutes(phase) * Math.min(1, cur.step / 5)) / total);

  const nextPhase = () => {
    if (cur.phase_index + 1 >= session.phases.length) { dispatch({ type: "complete_session" }); onComplete(); return; }
    dispatch({ type: "progress", patch: { phase_index: cur.phase_index + 1, step: 0, retry_queue: [] } });
    dispatch({ type: "event", name: "phase_entered", data: { phase_kind: session.phases[cur.phase_index + 1].kind } });
  };

  const exit = () => { dispatch({ type: "exit_session" }); onExit(); };

  // The level in plain words, in the one small line at the top of the lesson and
  // nowhere else inside it (board, 26 Oct).
  const sub = state.learner.confirmed_sublevel ?? state.learner.provisional_sublevel;

  return (
    <div className="flex h-full flex-col">
      {/* The chrome is three things: a thin progress line, one way out, and the
          level in plain words. */}
      <div className="flex items-center gap-3 px-4 pt-3">
        <button type="button" className="lp-icon-btn" style={{ width: 44, height: 44 }} aria-label={t("exit")} onClick={() => setPaused(true)}><X size={18} /></button>
        <div className="flex-1"><ProgressLine value={progress} /></div>
        <span className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>{sub ? CEFR_LABEL[sub] : ""}</span>
      </div>
      <div className="flex-1 overflow-hidden px-5 pb-5 pt-3">
        {paused ? (
          <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
            <div className="lp-lesson">{t("paused")}</div>
            <div className="w-full"><GlowButton onClick={() => setPaused(false)}>{t("resume")}</GlowButton></div>
            <button type="button" onClick={exit} className="lp-body" style={{ background: "none", border: "none", color: "var(--lp-paper-soft)", minHeight: 44, textDecoration: "underline", textUnderlineOffset: 4 }}>{t("exit")}</button>
          </div>
        ) : (
          <PhaseView key={`${session.id}-${cur.phase_index}`} phase={phase} onDone={nextPhase} />
        )}
      </div>
    </div>
  );
}

function PhaseView({ phase, onDone }: { phase: SessionPhase; onDone: () => void }) {
  switch (phase.kind) {
    case "plan": return <PlanPhase canDo={phase.can_do} onDone={onDone} />;
    case "recall": return <ItemRun items={phase.items} mode="recall" onDone={onDone} />;
    case "atom": return <AtomRun atomId={phase.atom_id} role={phase.role} onDone={onDone} />;
    case "vote": return <ItemRun items={[phase.item_id]} mode="controlled" onDone={onDone} />;
    case "story": return <StoryPhase atomId={phase.atom_id} onDone={onDone} />;
    case "close": return <ClosePhase checkItems={phase.check_items} canDo={phase.can_do} onDone={onDone} />;
  }
}

/** What the learner will be able to do after today, in plain words, with the
 *  minutes under it. One headline, one line, one button. */
function PlanPhase({ canDo, onDone }: { canDo: Localised; onDone: () => void }) {
  const { t } = useLp();
  const { state } = useStore();
  const { session } = state.current!;
  const steps = session.phases.filter((p) => p.kind !== "plan");
  const total = steps.reduce((a, p) => a + phaseMinutes(p), 0);
  useEffect(() => { const id = window.setTimeout(onDone, 20_000); return () => window.clearTimeout(id); }, [onDone]);
  return (
    <div className="flex h-full flex-col">
      <div className="lp-small mt-6" style={{ color: "var(--lp-paper-faint)" }}>{t("plan_phase")}</div>
      <div className="mt-2"><LocText text={canDo} size="head" auto /></div>
      <div className="lp-body mt-3" style={{ color: "var(--lp-paper-soft)" }}>{Math.round(total)} {t("minutes")}</div>
      <div className="mt-auto"><GlowButton onClick={onDone}>{t("start")}</GlowButton></div>
    </div>
  );
}

/** Runs a list of items one per screen. Missed items return once at the end. */
function ItemRun({ items, mode, onDone, atomId, tryItems, variant }: { items: string[]; mode: "recall" | "controlled" | "check" | "use"; onDone: () => void; atomId?: string; tryItems?: string[]; variant?: Atom["variant"] }) {
  const { state, dispatch } = useStore();
  const now = useNow();
  const [queue, setQueue] = useState<{ id: string; attempt: number }[]>(items.map((id) => ({ id, attempt: 1 })));
  const [idx, setIdx] = useState(0);
  const current = queue[idx];
  const item: Item | undefined = current ? ITEM_BY_ID[current.id] : undefined;
  const day = dayIndex(state, now);

  useEffect(() => { if (!current) onDone(); }, [current, onDone]);
  if (!item || !current) return null;

  const onAnswer = (r: ItemResult) => {
    dispatch({ type: "attempt", item_id: item.item_id, atom_id: atomId, correct: r.correct, modality: r.modality, response_ms: r.response_ms, attempt_n: current.attempt, score: r.score, sub_scores: r.sub_scores, ai_confidence: r.ai_confidence, scorer_version: "proto-heuristic-0.3", transcript: r.transcript, task_id: r.task_id, ai: r.ai });
    // A first miss comes back once at the end of the run; a second miss is left
    // to the memory engine to schedule again.
    if (!r.correct && mode !== "use" && current.attempt === 1) setQueue((q) => [...q, { id: current.id, attempt: 2 }]);
  };
  const onNext = () => setIdx((i) => i + 1);

  // No phase title, no "3 / 5" counter and no "this comes back" notice above the
  // item: the thin line at the top is the one progress signal, and the item owns
  // its single instruction line (board element budget, 26 Oct).
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        {/* Speaking practice in a use phase is a turn with the coach, not a mic under a prompt. */}
        {mode === "use" && isCoachItem(item) ? (
          <Coach key={`${current.id}-${current.attempt}`} item={item} onAnswer={onAnswer} onNext={onNext} mode="use" tryItems={tryItems} variant={variant} dayParity={day} />
        ) : (
          <ItemRenderer key={`${current.id}-${current.attempt}`} item={item} onAnswer={onAnswer} onNext={onNext} mode={mode === "use" ? "use" : mode} tryItems={tryItems} variant={variant} dayParity={day} />
        )}
      </div>
    </div>
  );
}

function AtomRun({ atomId, role, onDone }: { atomId: string; role: "new" | "use" | "fluency" | "warm_restart"; onDone: () => void }) {
  const { state, dispatch } = useStore();
  const { t } = useLp();
  const now = useNow();
  const [phaseIdx, setPhaseIdx] = useState(state.current?.step ?? 0);

  // A use atom built around a single free-use item plus items due for free-use retrieval.
  if (atomId.startsWith("USE:")) {
    const itemId = atomId.slice(4);
    const extra = tryToUse(state, now, [itemId]);
    // The coach owns her screen: no header above her while she is talking.
    const coachOnly = !!ITEM_BY_ID[itemId] && isCoachItem(ITEM_BY_ID[itemId]);
    return (
      <div className="flex h-full flex-col">
        {coachOnly ? null : <div className="lp-small mb-3" style={{ color: "var(--lp-paper-faint)" }}>{t("your_turn")}</div>}
        <div className="min-h-0 flex-1"><ItemRun items={[itemId]} mode="use" onDone={onDone} tryItems={extra} /></div>
      </div>
    );
  }

  const atom = ATOM_BY_ID[atomId];
  if (!atom) { onDone(); return null; }
  // Delayed checks are served in the close phase, not inside the atom.
  const phases = atom.phases.filter((p) => p.kind !== "check");
  const phase: AtomPhase | undefined = phases[phaseIdx];
  const variant = role === "new" ? (state.attempts.length ? pickVariantLocal(state.attempts) : "standard") : atom.variant;

  const advance = () => {
    const n = phaseIdx + 1;
    if (n >= phases.length) {
      if (role === "new" && !atom.phases.some((p) => p.kind === "check")) dispatch({ type: "event", name: "atom_completed", data: { atom_id: atomId } });
      onDone(); return;
    }
    setPhaseIdx(n);
    dispatch({ type: "progress", patch: { step: n } });
    dispatch({ type: "event", name: "phase_entered", data: { phase_kind: phases[n].kind, atom_id: atomId } });
  };

  if (!phase) { onDone(); return null; }
  switch (phase.kind) {
    case "input": return phase.media.kind === "video"
      ? (hasExplainer(atom.atom_id)
        ? <ExplainerPhase atom={atom} variant={variant} onDone={advance} />
        : <VideoPhase atom={atom} media={phase.media} variant={variant} onDone={advance} />)
      : <WordCards atom={atom} cards={phase.media.cards} onDone={advance} />;
    case "noticing": return <NoticingPhase atom={atom} highlight={phase.highlight} why={phase.why} onDone={advance} />;
    case "controlled": return <ItemRun items={phase.items} mode="controlled" onDone={advance} atomId={atomId} variant={variant} />;
    case "free_use": {
      // The coach owns her screen: no header above her while she is talking.
      const coachOnly = phase.items.every((id) => ITEM_BY_ID[id] && isCoachItem(ITEM_BY_ID[id]));
      return (
        <div className="flex h-full flex-col">
          {coachOnly ? null : <div className="lp-small mb-3" style={{ color: "var(--lp-paper-faint)" }}>{t("your_turn")}</div>}
          <div className="min-h-0 flex-1"><ItemRun items={phase.items} mode="use" onDone={advance} atomId={atomId} /></div>
        </div>
      );
    }
    default: advance(); return null;
  }
}

function pickVariantLocal(attempts: { attempt_n: number; modality: string; correct: boolean }[]): Atom["variant"] {
  const recent = attempts.filter((a) => a.attempt_n === 1 && a.modality !== "spoken").slice(-20);
  if (recent.length < 5) return "standard";
  const acc = recent.filter((a) => a.correct).length / recent.length;
  return acc < 0.7 ? "light" : acc > 0.9 ? "dense" : "standard";
}

/** A real 2D motion-graphics explainer (Remotion) with the interactive layer; Continue unlocks at 80%. */
function ExplainerPhase({ atom, variant, onDone }: { atom: Atom; variant: Atom["variant"]; onDone: () => void }) {
  const { t, lang } = useLp();
  const { state, dispatch } = useStore();
  const [pct, setPct] = useState(0);
  const logged = useRef(false);
  useEffect(() => {
    if (pct >= 0.8 && !logged.current) {
      logged.current = true;
      if (!state.events.some((e) => e.name === "video_progress" && e.data?.atom_id === atom.atom_id && e.data?.pct === 80))
        dispatch({ type: "event", name: "video_progress", data: { atom_id: atom.atom_id, pct: 80, explainer: true } });
    }
  }, [pct, atom.atom_id, dispatch, state.events]);
  return (
    <div className="flex h-full flex-col">
      <div className="lp-body mb-2" style={{ fontWeight: 500 }}>{loc(atom.title, lang)}</div>
      <div className="min-h-0 flex-1">
        <ExplainerPlayer atomId={atom.atom_id} onProgress={setPct} onSpoken={() => dispatch({ type: "event", name: "explainer_spoken", data: { atom_id: atom.atom_id } })} />
      </div>
      {/* Locked until the video has been watched. The wait is shown by the
          button filling up, never by a percentage the learner has to read. */}
      <div className="mt-3">
        <GlowButton size="normal" disabled={pct < 0.8} onClick={onDone}
          className={pct < 0.8 ? "lp-btn-gated" : ""}
          style={pct < 0.8 ? { ["--lp-fill" as string]: Math.min(1, pct / 0.8) } : undefined}>{t("continue")}</GlowButton>
      </div>
    </div>
  );
}

/** Video stand-in: a presenter card with word-synced captions, spoken line by line. */
function VideoPhase({ atom, media, variant, onDone }: { atom: Atom; media: Extract<AtomPhase, { kind: "input" }>["media"] & { kind: "video" }; variant: Atom["variant"]; onDone: () => void }) {
  const { t, lang, l1, say, speed } = useLp();
  const { state, dispatch } = useStore();
  const [playing, setPlaying] = useState(false);
  const [sec, setSec] = useState(0);
  const l1Sub = lang !== "en" || variant === "light";
  const rate = variant === "light" ? 0.75 : speed;
  const spokenIdx = useRef(-1);
  const duration = media.duration_sec;
  const lineIdx = media.lines.reduce((acc, l, i) => (l.at <= sec ? i : acc), -1);
  const line = media.lines[lineIdx];

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setSec((s) => Math.min(duration, s + 0.5 * rate)), 500);
    return () => window.clearInterval(id);
  }, [playing, duration, rate]);
  useEffect(() => {
    if (playing && lineIdx >= 0 && lineIdx !== spokenIdx.current) { spokenIdx.current = lineIdx; say(media.lines[lineIdx].text); }
  }, [lineIdx, playing, say, media.lines]);
  useEffect(() => { if (sec >= duration) setPlaying(false); }, [sec, duration]);
  const pct = sec / duration;
  useEffect(() => {
    if (pct >= 0.8 && !state.events.some((e) => e.name === "video_progress" && e.data?.atom_id === atom.atom_id && e.data?.pct === 80))
      dispatch({ type: "event", name: "video_progress", data: { atom_id: atom.atom_id, pct: 80, speed: rate, captions_on: true, l1_subtitles_on: l1Sub } });
  }, [pct, atom.atom_id, dispatch, rate, l1Sub, state.events]);

  const scene = sceneFor(atom.atom_id, lineIdx);
  return (
    <div className="flex h-full flex-col">
      <div className="lp-body mb-2" style={{ fontWeight: 500 }}>{loc(atom.title, lang)}</div>
      <div className="lp-video flex-1" style={{ minHeight: 300 }}>
        {sec === 0 && !playing && media.l1_card && (lang !== "en" || variant === "light") ? (
          <div className="absolute inset-x-4 top-4 z-10 lp-glass p-3 text-center lp-small">{loc(media.l1_card, l1)}</div>
        ) : null}
        {lineIdx >= 0 ? <Scene key={lineIdx} spec={scene} /> : (
          <div className="lp-scene-wrap lp-scene-center"><div style={{ fontSize: 64 }}>🎬</div><div className="lp-small mt-2" style={{ color: "var(--lp-paper-soft)" }}>{media.presenter}</div></div>
        )}
        {!playing ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: sec === 0 ? "transparent" : "var(--lp-dim)" }}>
            <button type="button" aria-label={t("listen")} onClick={() => setPlaying(true)} className="lp-mic" style={{ width: 64, height: 64 }}><Play size={28} /></button>
          </div>
        ) : null}
        <div className="lp-caption">
          {line ? <span className={line.target ? "lp-target" : ""}>{line.text}</span> : <span style={{ opacity: 0.5 }}>{media.title}</span>}
          {l1Sub && media.l1_card && lang !== "en" ? <div className="lp-small mt-1" style={{ opacity: 0.7 }}>{loc(media.l1_card, l1)}</div> : null}
        </div>
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: "var(--lp-track)" }}><div className="h-full" style={{ width: `${pct * 100}%`, background: "var(--lp-glow)", transition: "width 0.5s linear" }} /></div>
      </div>
      <div className="mt-3 flex items-center">
        <button type="button" className="lp-icon-btn lp-icon-btn-lead" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}>{playing ? <Pause size={20} /> : <Play size={20} />}</button>
      </div>
      {/* Same gate as the explainer: the button fills as the video is watched. */}
      <div className="mt-3">
        <GlowButton size="normal" disabled={pct < 0.8} onClick={onDone}
          className={pct < 0.8 ? "lp-btn-gated" : ""}
          style={pct < 0.8 ? { ["--lp-fill" as string]: Math.min(1, pct / 0.8) } : undefined}>{t("continue")}</GlowButton>
      </div>
    </div>
  );
}

function WordCards({ atom, cards, onDone }: { atom: Atom; cards: { word: string; emoji: string; meaning: { en: string } & Partial<Record<string, string>>; examples: string[] }[]; onDone: () => void }) {
  const { t, lang, say } = useLp();
  const [i, setI] = useState(0);
  const card = cards[i];
  useEffect(() => { const id = window.setTimeout(() => say(card.word), 300); return () => window.clearTimeout(id); }, [card, say]);
  return (
    <div className="flex h-full flex-col">
      <div className="lp-small mb-3" style={{ color: "var(--lp-paper-faint)" }}>{loc(atom.title, lang)} · {i + 1}/{cards.length}</div>
      <div className="lp-glass flex flex-1 flex-col p-5 lp-fade-in" key={i}>
        <div className="text-center" style={{ fontSize: 64 }}>{card.emoji}</div>
        <div className="mt-2 text-center"><Say text={card.word} size="head" /></div>
        <div className="lp-body mt-2 text-center" style={{ color: "var(--lp-paper-soft)" }}>{(card.meaning as Record<string, string>)[lang] ?? card.meaning.en}</div>
        <div className="mt-4 flex flex-col gap-2">
          {card.examples.map((ex) => (
            <div key={ex} className="rounded-xl px-3 py-2" style={{ background: "var(--lp-well)" }}><Say text={ex} size="body" /></div>
          ))}
        </div>
      </div>
      <div className="mt-3">
        <GlowButton onClick={() => (i + 1 < cards.length ? setI((x) => x + 1) : onDone())}>{i + 1 < cards.length ? t("next") : t("your_turn")}</GlowButton>
      </div>
    </div>
  );
}

function NoticingPhase({ atom, highlight, why, onDone }: { atom: Atom; highlight: string; why: { en: string } & Partial<Record<string, string>>; onDone: () => void }) {
  const { t, lang, say } = useLp();
  useEffect(() => { const id = window.setTimeout(() => say(highlight), 300); return () => window.clearTimeout(id); }, [highlight, say]);
  return (
    <div className="flex h-full flex-col">
      <div className="lp-small mb-4" style={{ color: "var(--lp-paper-faint)" }}>{t("notice_title")}</div>
      <div className="lp-glass flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="lp-display lp-target">{highlight}</div>
        <button type="button" onClick={() => say(highlight)} className="lp-speaker mt-5" style={{ width: 48, height: 48, minWidth: 48 }} aria-label={t("listen")}><Play size={20} /></button>
        <div className="lp-body mt-6" style={{ color: "var(--lp-paper-soft)" }}>{(why as Record<string, string>)[lang] ?? why.en}</div>
      </div>
      <div className="mt-3"><GlowButton onClick={onDone}>{t("continue")}</GlowButton></div>
    </div>
  );
}

function StoryPhase({ atomId, onDone }: { atomId: string; onDone: () => void }) {
  const { t, lang, say } = useLp();
  const { dispatch } = useStore();
  const story = ATOM_BY_ID[atomId];
  const [mode, setMode] = useState<"read" | "listen">("read");
  const [done, setDone] = useState(false);
  if (!story?.story) { onDone(); return null; }
  const finish = () => { dispatch({ type: "story_done", story_id: atomId, mode }); onDone(); };
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="lp-head">{loc(story.title, lang)}</div>
        <button type="button" className="lp-speaker" aria-label={t("listen")}
          onClick={() => { setMode("listen"); say(story.story!.text, () => setDone(true)); }}><Play size={16} /></button>
      </div>
      <div className="lp-glass flex-1 overflow-y-auto p-5">
        <div className="lp-lesson" style={{ lineHeight: 1.5, fontWeight: 400 }}>{story.story.text.split(/(?<=[.?!"])\s+/).map((s, i) => <span key={i} className="inline"><Say text={s} size="lesson" /> </span>)}</div>
      </div>
      <div className="mt-3"><GlowButton onClick={finish}>{done || mode === "read" ? t("done") : t("skip")}</GlowButton></div>
    </div>
  );
}

function ClosePhase({ checkItems, canDo, onDone }: { checkItems: string[]; canDo: { en: string } & Partial<Record<string, string>>; onDone: () => void }) {
  const { t, lang } = useLp();
  const { state, dispatch } = useStore();
  const [stage, setStage] = useState<"check" | "reflect" | "cando">(checkItems.length ? "check" : "reflect");
  const atomId = useMemo(() => state.current?.session.phases.find((p) => p.kind === "atom" && p.role === "new"), [state.current]);
  if (stage === "check") {
    return (
      <div className="flex h-full flex-col">
        <ItemRun items={checkItems} mode="check" onDone={() => { if (atomId && atomId.kind === "atom") dispatch({ type: "event", name: "atom_completed", data: { atom_id: atomId.atom_id } }); setStage("reflect"); }} atomId={atomId && atomId.kind === "atom" ? atomId.atom_id : undefined} />
      </div>
    );
  }
  if (stage === "reflect") {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="lp-body mb-3" style={{ color: "var(--lp-paper-soft)" }}>{loc(canDo, lang)}</div>
        <div className="lp-head mb-8">{t("reflection_q")}</div>
        <div className="flex w-full flex-col gap-3">
          <GlowButton onClick={() => { dispatch({ type: "reflection", can: true }); setStage("cando"); }}>{t("i_can")}</GlowButton>
          <GlowButton secondary onClick={() => { dispatch({ type: "reflection", can: false }); setStage("cando"); }}>{t("not_yet")}</GlowButton>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <span className="lp-tick mb-5" aria-hidden><Check size={22} strokeWidth={3} /></span>
      <div className="lp-small mb-2" style={{ color: "var(--lp-paper-faint)" }}>{t("what_you_can_do")}</div>
      <LocText text={canDo} size="head" auto />
      <div className="mt-8 w-full"><GlowButton onClick={onDone}>{t("done")}</GlowButton></div>
    </div>
  );
}
