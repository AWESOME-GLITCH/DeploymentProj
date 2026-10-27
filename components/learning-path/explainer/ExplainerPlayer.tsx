"use client";

// The interactive layer around a Remotion explainer: narration per beat,
// tap-any-word to hear it, a pause with the mic at "Say it with me", beat dots
// to replay a part, speed and L1 captions. Reports progress so the atom can
// count as watched at 80%.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { Captions, MoreHorizontal, Pause, Play, RotateCcw } from "lucide-react";
import { CAFE_BEATS, CAFE_DURATION, CAFE_FPS, CAFE_H, CAFE_L1, CAFE_W, CafeExplainer } from "./Cafe";
import { EXPLAINER as SPK_0005 } from "./ATM_A1_SPK_0005";
import { EXPLAINER as GRM_0002 } from "./ATM_A2_GRM_0002";
import { EXPLAINER as GRM_0003 } from "./ATM_A2_GRM_0003";
import { EXPLAINER as LST_0004 } from "./ATM_A2_LST_0004";
import { EXPLAINER as RDG_0006 } from "./ATM_A2_RDG_0006";
import { EXPLAINER as WRT_0007 } from "./ATM_A2_WRT_0007";
// ATM_A2_MED_0008 is on disk but does not typecheck yet (LP-46 registers only
// atoms that compile); add its import and its "ATM-A2-MED-0008" entry below
// once its owner has fixed it.
import { EXPLAINER as INT_0009 } from "./ATM_A2_INT_0009";
import { EXPLAINER as INT_0010 } from "./ATM_A2_INT_0010";

/** The beat contract every lesson explainer exports. */
export type Beat = { id: string; from: number; to: number; line: string; target?: string[]; kind: string; pauseAt?: number };
export type ExplainerDef = { component: React.FC<{ l1?: Record<string, string> }>; beats: Beat[]; duration: number; fps?: number; width?: number; height?: number; l1: Record<string, Record<string, string>> };

/** What the learner does at a stop in the video.
 *  tap: find the key words (a tiny first ask, recognition before production);
 *  say: repeat the line (production, the generation effect); the storyboard's
 *  own practise pause is always a say. Nothing passive runs longer than one beat. */
export type Ask = { beat: Beat; at: number; kind: "tap" | "say" };
export function asksFor(beats: Beat[]): Ask[] {
  const out: Ask[] = [];
  let n = 0;
  for (const b of beats) {
    if (b.kind === "recap" || b.kind === "hook") continue;
    if (!b.target?.length) continue;
    const at = b.pauseAt ?? Math.max(b.from + 30, b.to - 12);
    const kind: Ask["kind"] = b.kind === "practise" ? "say" : b.kind === "explain" ? "tap" : n === 0 ? "tap" : "say";
    out.push({ beat: b, at, kind });
    n += 1;
  }
  return out;
}

/** The coach's face in the ask sheet. She talks while a line is being said, listens otherwise. */
function CoachFace({ talking, mood, gesture }: { talking: boolean; mood: "neutral" | "happy" | "surprised" | "think"; gesture: "idle" | "listen" | "thumbs" | "point" | "think" }) {
  const [f, setF] = useState(0);
  useEffect(() => {
    let raf = 0; let start = performance.now();
    const tick = (t: number) => { setF(Math.floor(((t - start) / 1000) * 30)); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <svg viewBox="-115 -505 230 230" width={84} height={84} aria-hidden="true" style={{ flex: "none", overflow: "hidden", borderRadius: 999, background: "var(--lp-glow-tint)" }}>
      <Character who="maya" x={0} y={0} frame={f} scale={1} talking={talking} mood={mood} gesture={gesture} gestureAt={0} />
    </svg>
  );
}

function beatIn(beats: Beat[], frame: number): Beat {
  return beats.find((b) => frame >= b.from && frame < b.to) ?? beats[beats.length - 1];
}
/** The line the learner repeats at the pause: the practise line without the "Say it with me." lead-in. */
export function practiseLine(beat: Beat): string {
  return beat.line.replace(/^say it with me[.,!:]?\s*/i, "").trim() || beat.line;
}
import { Recorder } from "../items";
import { Character, karaoke, wordIsTarget } from "./lib";
import { scoreReadAloud, type SpeechScore } from "@/lib/learning-path/scoring";
import { useLp } from "../ui";

// Every delivered atom, keyed by its atom id in lib/learning-path/content.ts.
// The cafe's L1 captions come from CAFE_L1 in ./Cafe, next to its beat list, so
// the two cannot drift apart when a beat is added.
export const EXPLAINERS: Record<string, ExplainerDef> = {
  "ATM-A1-SPK-0005": SPK_0005,
  "ATM-A2-GRM-0002": GRM_0002,
  "ATM-A2-GRM-0003": GRM_0003,
  "ATM-A2-LST-0004": LST_0004,
  "ATM-A2-RDG-0006": RDG_0006,
  "ATM-A2-WRT-0007": WRT_0007,
  "ATM-A2-INT-0009": INT_0009,
  "ATM-A2-INT-0010": INT_0010,
  "ATM-A2-INT-0001": {
    component: CafeExplainer, beats: CAFE_BEATS, duration: CAFE_DURATION, fps: CAFE_FPS, width: CAFE_W, height: CAFE_H,
    l1: CAFE_L1,
  },
};

export function hasExplainer(atomId: string): boolean {
  return !!EXPLAINERS[atomId];
}

export function ExplainerPlayer({ atomId, onProgress, onSpoken }: { atomId: string; onProgress: (pct: number) => void; onSpoken?: () => void }) {
  const { t, lang, l1, say, speed } = useLp();
  const def = EXPLAINERS[atomId];
  const ref = useRef<PlayerRef>(null);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [started, setStarted] = useState(false);
  const [showL1, setShowL1] = useState(lang !== "en");
  const [rate, setRate] = useState(speed);
  const [paused, setPaused] = useState<Ask | null>(null);
  const [score, setScore] = useState<SpeechScore | null>(null);
  const [tapped, setTapped] = useState<string[]>([]);
  const [tapWrong, setTapWrong] = useState(0);
  const [tries, setTries] = useState(0);
  const [saidCount, setSaidCount] = useState(0);
  const [coachTalking, setCoachTalking] = useState(false);
  const speak = useCallback((text: string) => { setCoachTalking(true); say(text, () => setCoachTalking(false)); window.setTimeout(() => setCoachTalking(false), Math.min(6000, 400 + text.length * 70)); }, [say]);
  const spokenBeat = useRef<string>("");
  const pausedFor = useRef<string>("");
  const maxPct = useRef(0);
  const [ended, setEnded] = useState(false);
  const [more, setMore] = useState(false);
  // Progress only ever grows: replaying a beat never takes credit away.
  const report = useCallback((p: number) => { if (p > maxPct.current) { maxPct.current = p; onProgress(p); } }, [onProgress]);
  const beats = def.beats;
  const beat = beatIn(beats, frame);
  const asks = useMemo(() => asksFor(beats), [beats]);
  const model = paused ? practiseLine(paused.beat) : "";
  const targetWords = useMemo(() => (paused ? (paused.beat.target ?? []).flatMap((tg) => tg.split(" ")).map((w) => w.replace(/[.,?]/g, "")) : []), [paused]);
  const l1Map = showL1 && l1 !== "en" ? def.l1[l1] : undefined;
  const inputProps = useMemo(() => ({ l1: l1Map }), [l1Map]);

  // Narration: speak each beat's line once as it starts.
  useEffect(() => {
    if (!playing) return;
    if (spokenBeat.current !== beat.id) {
      spokenBeat.current = beat.id;
      say(beat.line);
    }
  }, [beat, playing, say]);

  // Stop for the learner's turn at every ask: a tap first, then saying the line.
  useEffect(() => {
    if (!playing) return;
    const ask = asks.find((a) => a.beat.id === beat.id);
    if (ask && frame >= ask.at && pausedFor.current !== beat.id) {
      pausedFor.current = beat.id;
      ref.current?.pause();
      setTapped([]); setTapWrong(0); setTries(0); setScore(null);
      setPaused(ask);
    }
  }, [frame, beat, playing, asks]);

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const onFrame = (e: { detail: { frame: number } }) => { setFrame(e.detail.frame); report(e.detail.frame / def.duration); };
    const onPlay = () => { setPlaying(true); setEnded(false); };
    const onPause = () => setPlaying(false);
    const onEnded = () => { setPlaying(false); setEnded(true); report(1); };
    p.addEventListener("frameupdate", onFrame);
    p.addEventListener("play", onPlay);
    p.addEventListener("pause", onPause);
    p.addEventListener("ended", onEnded);
    return () => { p.removeEventListener("frameupdate", onFrame); p.removeEventListener("play", onPlay); p.removeEventListener("pause", onPause); p.removeEventListener("ended", onEnded); };
  }, [def.duration, report]);

  const start = useCallback(() => { setStarted(true); ref.current?.play(); }, []);
  const replay = useCallback(() => { spokenBeat.current = ""; pausedFor.current = ""; setEnded(false); ref.current?.seekTo(0); ref.current?.play(); }, []);
  const toggle = useCallback(() => { if (playing) ref.current?.pause(); else if (ended) replay(); else ref.current?.play(); }, [playing, ended, replay]);
  const resume = useCallback(() => { setPaused(null); setScore(null); ref.current?.play(); }, []);
  const onTap = useCallback((w: string) => {
    if (!paused) return;
    const bare = w.replace(/[.,?]/g, "");
    if (targetWords.includes(bare)) {
      speak(bare);
      setTapped((prev) => (prev.includes(bare) ? prev : [...prev, bare]));
    } else {
      setTapWrong((n) => n + 1);
      speak(paused.beat.line);
    }
  }, [paused, targetWords, speak]);
  // The coach speaks her prompt when an ask opens.
  useEffect(() => {
    if (!paused) return;
    speak(paused.kind === "tap" ? "Tap the key words." : "Your turn. Say it.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused?.beat.id]);
  const tapDone = paused?.kind === "tap" && targetWords.length > 0 && targetWords.every((w) => tapped.includes(w));
  const saidWell = !!score && score.overall >= 0.6;
  const feedback = !score ? "" : saidWell ? (score.overall >= 0.85 ? "Clear." : "Good. That works.") : tries >= 2 ? "That will do for now. It comes back tomorrow." : score.missed.length ? `Nearly. Once more, slower: ${score.missed[0]}.` : "Nearly. Once more, slower.";

  // The caption is drawn over the one inside the composition, in the same place,
  // so the learner has a single caption and it is tappable. The karaoke count is
  // the composition's own, so the words still fill in with the narration.
  const words = beat.line.split(" ");
  const said = karaoke(beat.line, Math.min(1, (frame - beat.from) / Math.max(1, Math.min(120, beat.to - beat.from))));
  const l1Line = l1Map?.[beat.id];

  return (
    <div className="flex h-full flex-col">
      {/* Full bleed: the scene is the thing the learner must understand, so it
          takes the width of the phone and the space that was dead below it. */}
      <div className="lp-video relative -mx-5 w-auto" style={{ aspectRatio: "3 / 4", borderRadius: 0, borderInline: "none" }}>
        <Player ref={ref} component={def.component} inputProps={inputProps} durationInFrames={def.duration} fps={def.fps ?? CAFE_FPS} compositionWidth={def.width ?? CAFE_W} compositionHeight={def.height ?? CAFE_H} style={{ width: "100%", height: "100%" }} controls={false} playbackRate={rate} clickToPlay={false} loop={false} moveToBeginningWhenEnded={false} />
        {started && !paused ? (
          <div className="lp-vcaption" data-l1={l1Line ? "true" : "false"} aria-label="Tap a word in the caption to hear it">
            <div className="lp-wordline">
              {words.map((w, i) => {
                const target = wordIsTarget(w, beat.target);
                return (
                  <button key={`${beat.id}-${i}`} type="button" onClick={() => say(w.replace(/[.,?!]/g, ""))}
                    className={`lp-word ${target && i < said ? "lp-word-target" : ""}`}
                    style={i < said ? undefined : { color: "var(--lp-paper-faint)", fontWeight: 400 }}>{w}</button>
                );
              })}
            </div>
            {l1Line ? <div className="lp-vcaption-l1">{l1Line}</div> : null}
          </div>
        ) : null}
        {!started ? (
          <button type="button" aria-label={t("listen")} onClick={start} className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: "var(--lp-dim)" }}>
            <span className="lp-mic" style={{ width: 76, height: 76 }}><Play size={34} /></span>
          </button>
        ) : null}
        {ended && !paused ? (
          <button type="button" aria-label={t("retry")} onClick={replay} className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: "var(--lp-dim)" }}>
            <span className="lp-mic" style={{ width: 64, height: 64 }}><RotateCcw size={28} /></span>
          </button>
        ) : null}
        {paused ? (
          <div className="absolute inset-x-0 bottom-0 z-20 p-3">
            <div className="lp-glass p-3" style={{ borderRadius: 22 }}>
              {/* The coach leads: her face, her line as a bubble. */}
              <div className="flex items-start gap-3">
                <CoachFace talking={coachTalking} mood={score ? (saidWell ? "happy" : "think") : tapDone ? "happy" : tapWrong ? "think" : "neutral"} gesture={score ? (saidWell ? "thumbs" : "think") : tapDone ? "thumbs" : paused.kind === "say" ? "listen" : "point"} />
                <div style={{ flex: 1, minWidth: 0, fontSize: 17, lineHeight: 1.4, padding: "10px 14px", borderRadius: "18px 18px 18px 4px", background: "var(--lp-well)", color: "var(--lp-paper)" }}>
                  {paused.kind === "tap"
                    ? (tapDone ? "Yes. Those are the words." : tapWrong >= 2 ? "These ones. Listen." : tapWrong > 0 ? "Not that one. Listen again." : "Tap the key words.")
                    : (score ? feedback : saidCount === 0 ? "Your turn. Say it." : "Say it again.")}
                </div>
              </div>
              {paused.kind === "tap" ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {paused.beat.line.split(" ").map((w, i) => {
                    const bare = w.replace(/[.,?]/g, "");
                    const hit = tapped.includes(bare);
                    const reveal = tapWrong >= 2 && targetWords.includes(bare) && !hit;
                    return <button key={i} type="button" onClick={() => onTap(w)} style={{ minHeight: 44, padding: "0 14px", borderRadius: 14, font: "inherit", fontSize: 18, fontWeight: hit ? 700 : 500, background: hit ? "var(--lp-glow)" : "var(--lp-surface)", color: hit ? "var(--lp-on-glow)" : "var(--lp-paper)", border: `1.5px solid ${hit ? "var(--lp-glow)" : reveal ? "var(--lp-accent)" : "var(--lp-line-strong)"}` }}>{w}</button>;
                  })}
                </div>
              ) : (
                <div className="mt-3">
                  <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.3 }}>{model}</div>
                  {!score ? (
                    <div className="mt-2"><Recorder maxSeconds={8} autoText={model} onDone={(tr, ms) => { const sc = scoreReadAloud(model, tr, ms); setScore(sc); setTries((n) => n + 1); setSaidCount((n) => n + 1); onSpoken?.(); }} /></div>
                  ) : null}
                </div>
              )}
              <div className="mt-3 flex items-center gap-2">
                {paused.kind === "tap" ? (
                  <button type="button" className="lp-btn-primary lp-btn-48" style={{ flex: 1, opacity: tapDone || tapWrong >= 2 ? 1 : 0.35 }} disabled={!(tapDone || tapWrong >= 2)} onClick={resume}>{t("continue")}</button>
                ) : score ? (
                  saidWell || tries >= 2
                    ? <button type="button" className="lp-btn-primary lp-btn-48" style={{ flex: 1 }} onClick={resume}>{t("continue")}</button>
                    : <button type="button" className="lp-btn-primary lp-btn-48" style={{ flex: 1 }} onClick={() => { speak(model); setScore(null); }}>Once more</button>
                ) : null}
                <button type="button" className="lp-small" style={{ background: "none", border: "none", color: "var(--lp-paper-faint)", minHeight: 44, padding: "0 10px" }} onClick={resume}>{t("skip")}</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* One lead control and one quiet "more". Speed and captions in my own
          language live behind it, so the screen at rest is the scene with its
          caption, one play control and Continue. */}
      <div className="mt-auto flex items-center justify-between pt-2">
        <button type="button" className="lp-icon-btn lp-icon-btn-lead" aria-label={playing ? "Pause" : "Play"} onClick={started ? toggle : start}>{playing ? <Pause size={20} /> : <Play size={20} />}</button>
        <button type="button" className="lp-icon-btn lp-icon-btn-quiet" aria-label="More options" aria-expanded={more} onClick={() => setMore((v) => !v)}><MoreHorizontal size={18} /></button>
      </div>
      {more ? (
        <div className="mt-2 flex items-center gap-2">
          <button type="button" className="lp-icon-btn lp-icon-btn-quiet" aria-label="Captions in my language" aria-pressed={showL1} data-on={showL1} onClick={() => setShowL1((v) => !v)}><Captions size={18} /></button>
          <button type="button" className="lp-icon-btn lp-icon-btn-quiet lp-small" aria-label="Playback speed" style={{ width: 56 }} onClick={() => setRate((r) => (r === 1 ? 0.75 : 1))}>{rate === 1 ? "1.0×" : "0.75×"}</button>
          <button type="button" className="lp-icon-btn lp-icon-btn-quiet ms-auto" aria-label="Watch from the start" onClick={replay}><RotateCcw size={18} /></button>
        </div>
      ) : null}
    </div>
  );
}
