"use client";

// Road: a drawn road with weekly stops, the marker at the current stop, the
// next stop highlighted, level flags, and the fog of memory (opacity tied to
// predicted recall). Scrolls along the road only. Mirrored for RTL.

import { useEffect, useRef, useState } from "react";
import { Flag } from "lucide-react";
import { CHECKPOINT_ITEMS, OUTCOMES } from "@/lib/learning-path/content";
import { checkpointAvailable, fogOpacity, outcomeAchieved, outcomeProgress } from "@/lib/learning-path/engine";
import { CEFR_LABEL, loc } from "@/lib/learning-path/i18n";
import { useNow, useStore } from "@/lib/learning-path/store";
import type { SubLevel } from "@/lib/learning-path/types";
import { ItemRenderer, type ItemResult } from "./items";
import { GlowButton, LocText, Pill, Say, useLp } from "./ui";

const STOP_GAP = 120;

export function Road({ onCheckpoint }: { onCheckpoint: () => void }) {
  const { state, dispatch } = useStore();
  const { t, lang, rtl } = useLp();
  const now = useNow();
  const scroller = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(state.week_can_do);
  const stops = OUTCOMES;
  const currentIdx = Math.max(0, stops.findIndex((o) => o.outcome_id === state.week_can_do));
  const width = 80 + stops.length * STOP_GAP + 120;
  const ckp = checkpointAvailable(state, now);
  const x = (i: number) => (rtl ? width - (60 + i * STOP_GAP) : 60 + i * STOP_GAP);
  const y = (i: number) => 150 + Math.sin(i * 1.1) * 48;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const target = x(currentIdx) - el.clientWidth / 2;
    el.scrollLeft = rtl ? target - (width - el.clientWidth) : target;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, rtl]);

  const path = stops.map((_, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(i)}`).join(" ");
  const sel = selected ? stops.find((o) => o.outcome_id === selected) : null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div><div className="lp-eyebrow">{t("road")}</div><div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>{CEFR_LABEL[state.learner.confirmed_sublevel ?? "A2.1"]}</div></div>
        <button type="button" onClick={() => ckp && onCheckpoint()} className={`lp-pill ${ckp ? "lp-pill-glow" : ""}`} style={ckp ? { animation: state.learner.reduce_motion ? undefined : "lp-breathe 2s ease-in-out infinite" } : { opacity: 0.6 }}>
          <Flag size={12} /> {ckp ? t("checkpoint_ready") : t("checkpoint")}
        </button>
      </div>
      <div ref={scroller} className="mt-2 flex-1 overflow-x-auto overflow-y-hidden" style={{ direction: rtl ? "rtl" : "ltr" }}>
        <svg width={width} height={300} viewBox={`0 0 ${width} 300`} style={{ display: "block" }}>
          <defs>
            <filter id="lp-fog-blur"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>
          <path d={path} fill="none" stroke="var(--lp-track)" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
          <path d={path} fill="none" stroke="var(--lp-line-strong)" strokeWidth={2} strokeDasharray="8 10" strokeLinejoin="round" />
          {/* Level flags */}
          <g>
            <text x={x(0)} y={30} fill="var(--lp-paper-soft)" fontSize="12" textAnchor="middle">A1 · A2</text>
            <text x={x(stops.length - 1) + (rtl ? -70 : 70)} y={30} fill="var(--lp-paper-soft)" fontSize="12" textAnchor="middle">B1</text>
            <circle cx={x(stops.length - 1) + (rtl ? -70 : 70)} cy={y(stops.length - 1)} r={10} fill="none" stroke="var(--lp-line-strong)" strokeWidth={2} />
          </g>
          {stops.map((o, i) => {
            const achieved = outcomeAchieved(state, o.outcome_id);
            const fog = fogOpacity(state, o.outcome_id, now);
            const isNext = i === currentIdx;
            const prog = outcomeProgress(state, o.outcome_id);
            return (
              <g key={o.outcome_id} className="lp-road-stop" onClick={() => setSelected(o.outcome_id)} style={{ cursor: "pointer" }}>
                <circle cx={x(i)} cy={y(i)} r={24} fill={achieved ? "var(--lp-sea-tint)" : "var(--lp-well)"} stroke={isNext ? "var(--lp-glow-2)" : achieved ? "var(--lp-sea)" : "var(--lp-line-strong)"} strokeWidth={isNext ? 3 : 2} style={isNext ? { filter: "drop-shadow(0 0 10px rgba(21,154,139,0.6))" } : undefined} />
                {/* progress arc */}
                <circle cx={x(i)} cy={y(i)} r={24} fill="none" stroke="var(--lp-sea)" strokeWidth={3} strokeDasharray={`${2 * Math.PI * 24 * prog} ${2 * Math.PI * 24}`} transform={`rotate(-90 ${x(i)} ${y(i)})`} opacity={prog > 0 && !achieved ? 0.9 : 0} />
                <text x={x(i)} y={y(i) + 7} fontSize="20" textAnchor="middle">{o.icon}</text>
                {/* fog layer: unmastered stretches sit in soft fog; forgetting re-fogs a stop */}
                <circle cx={x(i)} cy={y(i)} r={34} fill="var(--lp-fog)" opacity={isNext ? fog * 0.25 : fog * 0.75} filter="url(#lp-fog-blur)" style={{ pointerEvents: "none", transition: "opacity 0.6s" }} />
                <text x={x(i)} y={y(i) + 48} fill="var(--lp-paper-soft)" fontSize="11" textAnchor="middle">{o.sublevel} {t(`strand_${o.strand}`).slice(0, 10)}</text>
                {isNext ? <g><circle cx={x(i)} cy={y(i) - 40} r={9} fill="var(--lp-glow-2)" style={{ filter: "drop-shadow(0 0 8px rgba(21,154,139,0.7))" }} /><circle cx={x(i)} cy={y(i) - 40} r={3.5} fill="var(--lp-on-glow)" /></g> : null}
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
            <div className="lp-small mt-2" style={{ color: "var(--lp-paper-faint)" }}>Fog {Math.round(fogOpacity(state, sel.outcome_id, now) * 100)}% · {sel.criteria.length} criteria</div>
          </div>
        ) : null}
        {ckp ? <div className="mt-2"><GlowButton size="normal" onClick={onCheckpoint}>{t("checkpoint")} · {t("checkpoint_sub")}</GlowButton></div> : null}
      </div>
      {/* keep dispatch referenced for lint */}
      <span hidden>{typeof dispatch}{lang}</span>
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
        <div className="lp-lesson mt-2" style={{ color: "var(--lp-glow-2)" }}>{CEFR_LABEL[after]}</div>
        <div className="lp-body mt-3" style={{ color: "var(--lp-paper-soft)" }}>{after === before ? t("checkpoint_same") : `${CEFR_LABEL[before]} → ${CEFR_LABEL[after]}`}</div>
        <div className="lp-small mt-2" style={{ color: "var(--lp-paper-faint)" }}>AZE result {CEFR_LABEL[result]} · {correct} / {CHECKPOINT_ITEMS.length}</div>
        <div className="mt-10 w-full"><GlowButton onClick={onDone}>{t("done")}</GlowButton></div>
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
      <div className="lp-eyebrow mb-1">{t("checkpoint")}</div>
      <div className="lp-small mb-4" style={{ color: "var(--lp-paper-faint)" }}><Say text={t("checkpoint_sub")} size="small" /> · {idx + 1} / {CHECKPOINT_ITEMS.length}</div>
      <div className="min-h-0 flex-1"><ItemRenderer key={item.id} item={item.item} onAnswer={onAnswer} onNext={onNext} mode="placement" /></div>
      <span hidden>{String(last)}{loc(item.item.stem, "en")}</span>
    </div>
  );
}
