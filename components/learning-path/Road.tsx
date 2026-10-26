"use client";

// Road: the whole drawn journey. A road with a stop per outcome, the walked
// part filled, the learner's own stop lit, the stops ahead in fog (opacity tied
// to predicted recall). Scrolls along the road only. Mirrored for RTL.

import { useEffect, useRef, useState } from "react";
import { Flag } from "lucide-react";
import { CHECKPOINT_ITEMS, OUTCOMES } from "@/lib/learning-path/content";
import { checkpointAvailable, fogOpacity, outcomeAchieved, outcomeProgress } from "@/lib/learning-path/engine";
import { CEFR_LABEL, loc } from "@/lib/learning-path/i18n";
import { useNow, useStore } from "@/lib/learning-path/store";
import type { SubLevel } from "@/lib/learning-path/types";
import { ItemRenderer, type ItemResult } from "./items";
import { GlowButton, IsoStop, LocText, Pill, ProgressLine, STRAND_COLOR, StopTick, useLp } from "./ui";

const STOP_GAP = 150;
const H = 380;

export function Road({ onCheckpoint }: { onCheckpoint: () => void }) {
  const { state } = useStore();
  const { t, rtl } = useLp();
  const now = useNow();
  const scroller = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(state.week_can_do);
  const stops = OUTCOMES;
  const currentIdx = Math.max(0, stops.findIndex((o) => o.outcome_id === state.week_can_do));
  const width = 80 + stops.length * STOP_GAP + 120;
  const ckp = checkpointAvailable(state, now);
  const x = (i: number) => (rtl ? width - (60 + i * STOP_GAP) : 60 + i * STOP_GAP);
  const y = (i: number) => 190 + Math.sin(i * 1.1) * 92;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const target = x(currentIdx) - el.clientWidth / 2;
    el.scrollLeft = rtl ? target - (width - el.clientWidth) : target;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, rtl]);

  // One smooth road through every stop, then on to the next level.
  const end = { x: x(stops.length - 1) + (rtl ? -80 : 80), y: y(stops.length - 1) - 40 };
  const pts = stops.map((_, i) => ({ x: x(i), y: y(i) })).concat(end);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const walked = ((currentIdx + Math.min(0.92, state.week_can_do ? outcomeProgress(state, state.week_can_do) : 0)) / (pts.length - 1)) * 100;
  const sel = selected ? stops.find((o) => o.outcome_id === selected) : null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="lp-eyebrow">{t("road")} · {CEFR_LABEL[state.learner.confirmed_sublevel ?? "A2.1"]}</div>
        <button type="button" onClick={() => ckp && onCheckpoint()} className={`lp-pill ${ckp ? "lp-pill-glow" : ""}`} style={ckp ? { animation: state.learner.reduce_motion ? undefined : "lp-breathe var(--lp-t-ambient) ease-in-out infinite" } : { opacity: 0.6 }}>
          <Flag size={12} /> {ckp ? t("checkpoint_ready") : t("checkpoint")}
        </button>
      </div>
      <div ref={scroller} className="mt-2 flex min-h-0 flex-1 items-center overflow-x-auto overflow-y-hidden" style={{ direction: rtl ? "rtl" : "ltr" }}>
        <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} style={{ display: "block", flex: "none" }}>
          <path d={path} fill="none" stroke="var(--lp-road)" strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
          <path d={path} fill="none" stroke="var(--lp-sea)" strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" pathLength={100} className="lp-road-trail" strokeDasharray={`${walked} 100`} opacity={0.9} />
          <path d={path} fill="none" stroke="var(--lp-line-strong)" strokeWidth={2} strokeDasharray="5 11" strokeLinecap="round" strokeLinejoin="round" />

          {/* Where the road starts and where it is going */}
          <text x={x(0)} y={y(0) - 34} fill="var(--lp-paper-faint)" fontSize="13" fontWeight="700" textAnchor="middle" letterSpacing="0.08em">A2</text>
          <g>
            <IsoStop x={end.x} y={end.y} w={13} h={9} colour="var(--lp-glow)" />
            <line x1={end.x} y1={end.y - 8} x2={end.x} y2={end.y - 40} stroke="var(--lp-glow)" strokeWidth={2} strokeLinecap="round" />
            <polygon points={`${end.x},${end.y - 40} ${end.x + (rtl ? -24 : 24)},${end.y - 33} ${end.x},${end.y - 26}`} fill="var(--lp-glow)" />
            <text x={end.x} y={end.y + 34} fill="var(--lp-paper-faint)" fontSize="13" fontWeight="700" textAnchor="middle" letterSpacing="0.08em">B1</text>
          </g>

          {stops.map((o, i) => {
            const achieved = outcomeAchieved(state, o.outcome_id);
            const fog = fogOpacity(state, o.outcome_id, now);
            const isHere = i === currentIdx;
            const prog = outcomeProgress(state, o.outcome_id);
            const colour = achieved ? "var(--lp-sea)" : isHere ? "var(--lp-marker)" : STRAND_COLOR[o.strand];
            return (
              <g key={o.outcome_id} className="lp-road-stop" onClick={() => setSelected(o.outcome_id)} style={{ cursor: "pointer" }} opacity={isHere ? 1 : 1 - fog * 0.5}>
                {isHere ? <circle cx={x(i)} cy={y(i)} r={26} fill="var(--lp-marker)" opacity={0.18} className={state.learner.reduce_motion ? undefined : "lp-marker-breathe"} /> : null}
                {selected === o.outcome_id ? <circle cx={x(i)} cy={y(i)} r={30} fill="none" stroke="var(--lp-accent-line)" strokeWidth={2} /> : null}
                <g className={isHere ? "lp-marker-glow" : undefined}><IsoStop x={x(i)} y={y(i)} w={isHere ? 20 : 16} h={isHere ? 13 : 10} colour={colour} /></g>
                {achieved ? <StopTick x={x(i)} y={y(i) - 5} size={6} /> : null}
                <text x={x(i)} y={y(i) + 44} fill="var(--lp-paper)" fontSize="12.5" fontWeight="600" textAnchor="middle">{t(`strand_${o.strand}`)}</text>
                {!achieved ? (
                  <g>
                    <rect x={x(i) - 22} y={y(i) + 54} width={44} height={5} rx={2.5} fill="var(--lp-track)" />
                    <rect x={x(i) - 22} y={y(i) + 54} width={Math.max(0, 44 * prog)} height={5} rx={2.5} fill="var(--lp-sea)" className="lp-road-trail" />
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="px-5 pb-4">
        {sel ? (
          <div className="lp-glass p-4">
            <div className="flex items-center justify-between">
              <div className="lp-eyebrow">{sel.outcome_id === state.week_can_do ? t("next_stop") : sel.sublevel}</div>
              <Pill tone={outcomeAchieved(state, sel.outcome_id) ? "good" : "neutral"}>{outcomeAchieved(state, sel.outcome_id) ? "✓" : `${Math.round(outcomeProgress(state, sel.outcome_id) * 100)}%`}</Pill>
            </div>
            <div className="mt-1"><LocText text={sel.can_do} size="body" /></div>
          </div>
        ) : null}
        {ckp ? <div className="mt-3"><GlowButton size="normal" onClick={onCheckpoint}>{t("checkpoint")}</GlowButton></div> : null}
      </div>
    </div>
  );
}

/** AZE checkpoint (mock): adaptive, confirms the level, never demotes. */
export function Checkpoint({ onDone }: { onDone: () => void }) {
  const { t } = useLp();
  const { state, dispatch } = useStore();
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [last, setLast] = useState<boolean | null>(null);
  const [result, setResult] = useState<SubLevel | null>(null);
  const item = CHECKPOINT_ITEMS[idx];
  const before = state.learner.confirmed_sublevel ?? "A2.1";
  useEffect(() => { dispatch({ type: "event", name: "checkpoint_started" }); }, [dispatch]);
  if (result) {
    const after = state.learner.confirmed_sublevel ?? before;
    return (
      <div className="flex h-full flex-col items-center justify-center px-5 text-center">
        <Flag size={40} style={{ color: "var(--lp-sea)" }} />
        <div className="lp-head mt-4">{t("checkpoint_done")}</div>
        <div className="lp-display mt-2" style={{ color: "var(--lp-glow)" }}>{CEFR_LABEL[after]}</div>
        <div className="mt-5 w-full">
          <div className="lp-bar"><div style={{ width: `${Math.round((correct / CHECKPOINT_ITEMS.length) * 100)}%` }} /></div>
          <div className="lp-small mt-2" style={{ color: "var(--lp-paper-faint)" }}>{correct} / {CHECKPOINT_ITEMS.length}</div>
        </div>
        <div className="lp-body mt-4" style={{ color: "var(--lp-paper-soft)" }}>{after === before ? t("checkpoint_same") : `${CEFR_LABEL[before]} → ${CEFR_LABEL[after]}`}</div>
        <div className="mt-8 w-full"><GlowButton onClick={onDone}>{t("done")}</GlowButton></div>
      </div>
    );
  }
  const onAnswer = (r: ItemResult) => { setLast(r.correct); if (r.correct) setCorrect((c) => c + 1); };
  const onNext = () => {
    if (idx + 1 >= CHECKPOINT_ITEMS.length) {
      const total = correct;
      const aze: SubLevel = total >= 5 ? "A2.2" : total >= 3 ? "A2.1" : "A1.2";
      setResult(aze);
      dispatch({ type: "checkpoint", after: aze });
      return;
    }
    setIdx((i) => i + 1); setLast(null);
  };
  return (
    <div className="flex h-full flex-col px-5 pb-5 pt-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="lp-eyebrow">{t("checkpoint")}</div>
        <div className="flex-1"><ProgressLine value={(idx + 1) / CHECKPOINT_ITEMS.length} /></div>
        <div className="lp-small tabular-nums" style={{ color: "var(--lp-paper-faint)" }}>{idx + 1} / {CHECKPOINT_ITEMS.length}</div>
      </div>
      <div className="min-h-0 flex-1"><ItemRenderer key={item.id} item={item.item} onAnswer={onAnswer} onNext={onNext} mode="placement" /></div>
      <span hidden>{String(last)}{loc(item.item.stem, "en")}</span>
    </div>
  );
}
