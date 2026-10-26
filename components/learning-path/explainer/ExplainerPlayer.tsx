"use client";

// The interactive layer around a Remotion explainer: narration per beat,
// tap-any-word to hear it, a pause with the mic at "Say it with me", beat dots
// to replay a part, speed and L1 captions. Reports progress so the atom can
// count as watched at 80%.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { Captions, Mic, Pause, Play, RotateCcw } from "lucide-react";
import { CAFE_BEATS, CAFE_DURATION, CAFE_FPS, CAFE_H, CAFE_W, CafeExplainer, beatAt, type Beat } from "./Cafe";
import { Recorder, ResultBars } from "../items";
import { scoreReadAloud, type SpeechScore } from "@/lib/learning-path/scoring";
import { useLp } from "../ui";

export const EXPLAINERS: Record<string, { component: React.FC<{ l1?: Record<string, string> }>; beats: Beat[]; duration: number; l1: Record<string, Record<string, string>> }> = {
  "ATM-A2-INT-0001": {
    component: CafeExplainer, beats: CAFE_BEATS, duration: CAFE_DURATION,
    l1: {
      ar: { hook: "صباح الاثنين. شورديتش. القهوة أولًا.", n1: "أريد قهوة، من فضلك.", n2: "أريد قهوتين، من فضلك.", n3: "هل يمكنني الحصول على شاي؟", explain: "I'd like تعني أريد، لكن بأدب.", practise: "قلها معي.", recap: "I'd like ... please." },
      es: { hook: "Lunes por la mañana. Shoreditch. Primero, café.", n1: "Quisiera un café, por favor.", n2: "Quisiera dos cafés, por favor.", n3: "¿Podría tomar un té?", explain: "I'd like significa quiero, pero con cortesía.", practise: "Dilo conmigo.", recap: "I'd like ... please." },
      hi: { hook: "सोमवार की सुबह। शोरडिच। पहले कॉफ़ी।", n1: "मुझे एक कॉफ़ी चाहिए, कृपया।", n2: "मुझे दो कॉफ़ी चाहिए, कृपया।", n3: "क्या मुझे एक चाय मिल सकती है?", explain: "I'd like का मतलब I want है, पर विनम्रता से।", practise: "मेरे साथ बोलो।", recap: "I'd like ... please." },
      ru: { hook: "Утро понедельника. Шордич. Сначала кофе.", n1: "Я бы хотел кофе, пожалуйста.", n2: "Я бы хотел два кофе, пожалуйста.", n3: "Можно мне чай?", explain: "I'd like значит «я хочу», но вежливо.", practise: "Скажи со мной.", recap: "I'd like ... please." },
      tr: { hook: "Pazartesi sabahı. Shoreditch. Önce kahve.", n1: "Bir kahve istiyorum, lütfen.", n2: "İki kahve istiyorum, lütfen.", n3: "Bir çay alabilir miyim?", explain: "I'd like, istiyorum demektir ama nazikçe.", practise: "Benimle söyle.", recap: "I'd like ... please." },
      zh: { hook: "星期一早晨。肖尔迪奇。先来杯咖啡。", n1: "我想要一杯咖啡，谢谢。", n2: "我想要两杯咖啡，谢谢。", n3: "可以给我一杯茶吗？", explain: "I'd like 的意思是我想要，但更礼貌。", practise: "跟我一起说。", recap: "I'd like ... please." },
    },
  },
};

export function hasExplainer(atomId: string): boolean {
  return !!EXPLAINERS[atomId];
}

export function ExplainerPlayer({ atomId, onProgress, onSpoken }: { atomId: string; onProgress: (pct: number) => void; onSpoken?: () => void }) {
  const { t, lang, l1, say, speed, reduceMotion } = useLp();
  const def = EXPLAINERS[atomId];
  const ref = useRef<PlayerRef>(null);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [started, setStarted] = useState(false);
  const [showL1, setShowL1] = useState(lang !== "en");
  const [rate, setRate] = useState(speed);
  const [paused, setPaused] = useState<Beat | null>(null);
  const [score, setScore] = useState<SpeechScore | null>(null);
  const spokenBeat = useRef<string>("");
  const pausedFor = useRef<string>("");
  const maxPct = useRef(0);
  const [ended, setEnded] = useState(false);
  // Progress only ever grows: replaying a beat never takes credit away.
  const report = useCallback((p: number) => { if (p > maxPct.current) { maxPct.current = p; onProgress(p); } }, [onProgress]);
  const beats = def.beats;
  const beat = beatAt(frame);
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

  // Pause for the learner's turn.
  useEffect(() => {
    if (!playing) return;
    if (beat.pauseAt && frame >= beat.pauseAt && pausedFor.current !== beat.id) {
      pausedFor.current = beat.id;
      ref.current?.pause();
      setPaused(beat);
    }
  }, [frame, beat, playing]);

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
  const seekBeat = useCallback((b: Beat) => { spokenBeat.current = ""; pausedFor.current = b.id === beat.id ? pausedFor.current : ""; ref.current?.seekTo(b.from); ref.current?.play(); }, [beat.id]);
  const resume = useCallback(() => { setPaused(null); setScore(null); ref.current?.play(); }, []);

  const words = beat.line.split(" ");

  return (
    <div className="flex h-full flex-col">
      <div className="lp-video relative w-full" style={{ aspectRatio: "3 / 4" }}>
        <Player ref={ref} component={def.component} inputProps={inputProps} durationInFrames={def.duration} fps={CAFE_FPS} compositionWidth={CAFE_W} compositionHeight={CAFE_H} style={{ width: "100%", height: "100%" }} controls={false} playbackRate={rate} clickToPlay={false} loop={false} moveToBeginningWhenEnded={false} />
        {!started ? (
          <button type="button" aria-label={t("listen")} onClick={start} className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: "rgba(27,29,58,0.18)" }}>
            <span className="lp-mic" style={{ width: 76, height: 76 }}><Play size={34} /></span>
          </button>
        ) : null}
        {ended && !paused ? (
          <button type="button" aria-label={t("retry")} onClick={replay} className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: "rgba(27,29,58,0.18)" }}>
            <span className="lp-mic" style={{ width: 64, height: 64 }}><RotateCcw size={28} /></span>
          </button>
        ) : null}
        {paused ? (
          <div className="absolute inset-x-0 bottom-0 z-20 p-3">
            <div className="lp-glass p-3">
              <div className="lp-eyebrow mb-1">{t("your_turn")}</div>
              <div className="lp-lesson mb-2">I'd like a coffee, please.</div>
              {score ? <div className="mb-2"><ResultBars score={score} /></div> : null}
              {!score ? (
                <Recorder maxSeconds={8} autoText="I'd like a coffee, please." onDone={(tr, ms) => { const s = scoreReadAloud("I'd like a coffee, please.", tr, ms); setScore(s); onSpoken?.(); }} />
              ) : (
                <div className="flex gap-2"><button type="button" className="lp-btn-primary lp-btn-48" onClick={resume}>{t("continue")}</button><button type="button" className="lp-icon-btn" aria-label={t("retry")} onClick={() => setScore(null)}><RotateCcw size={18} /></button></div>
              )}
              <button type="button" className="lp-small mt-2 w-full text-center" style={{ background: "none", border: "none", color: "var(--lp-paper-faint)" }} onClick={resume}>{t("skip")}</button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Tap any word to hear it */}
      <div className="mt-2 flex flex-wrap gap-1.5" aria-label="caption words">
        {words.map((w, i) => (
          <button key={`${beat.id}-${i}`} type="button" onClick={() => say(w.replace(/[.,?]/g, ""))} className="lp-pill" style={{ minHeight: 34, fontSize: 14, ...(beat.target?.some((tg) => tg.split(" ").includes(w.replace(/[.,?]/g, ""))) ? { color: "var(--lp-accent)", borderColor: "var(--lp-accent-line)" } : {}) }}>{w}</button>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <button type="button" className="lp-icon-btn" aria-label={playing ? "Pause" : "Play"} onClick={started ? toggle : start}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
        <button type="button" className="lp-icon-btn" aria-label="Captions" style={{ color: showL1 ? "var(--lp-accent)" : undefined }} onClick={() => setShowL1((v) => !v)}><Captions size={18} /></button>
        <button type="button" className="lp-icon-btn lp-small" style={{ width: 56 }} onClick={() => setRate((r) => (r === 1 ? 0.75 : 1))}>{rate === 1 ? "1.0×" : "0.75×"}</button>
        <div className="ms-auto flex items-center gap-1.5">
          {beats.map((b) => (
            <button key={b.id} type="button" aria-label={b.id} onClick={() => seekBeat(b)} className="lp-dot" style={{ width: b.id === beat.id ? 18 : 10, height: 10, borderRadius: 6, background: frame >= b.to ? "var(--lp-accent)" : b.id === beat.id ? "var(--lp-glow)" : undefined, transition: reduceMotion ? "none" : "width 0.2s" }} />
          ))}
        </div>
        {beat.kind === "practise" && !paused ? <span className="lp-small" style={{ color: "var(--lp-paper-faint)" }}><Mic size={14} /></span> : null}
      </div>
    </div>
  );
}
