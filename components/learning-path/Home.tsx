"use client";

// Home. Three things and nothing else: the journey drawn as a road the learner
// is standing on, one line saying what today is, one big button. Past stops are
// ticked, today is the lit stop with the three slices of today's ten minutes
// around it, the next stops sit ahead in fog, and the road ends at the next
// CEFR level. Tapping the road opens the whole road.

import { useMemo } from "react";
import { OUTCOMES, OUTCOME_BY_ID } from "@/lib/learning-path/content";
import { dayIndex, outcomeAchieved, outcomeProgress, phaseMinutes, ringSlice } from "@/lib/learning-path/engine";
import { useNow, useStore } from "@/lib/learning-path/store";
import { CEFR_LABEL } from "@/lib/learning-path/i18n";
import { GlowButton, IsoStop, LocText, RingArcs, Say, StopTick, useLp } from "./ui";

// The drawn road: five stops bottom to top, then the destination. Fixed slots
// keep the curve the same shape for every learner.
const W = 320;
const H = 430;
const SLOTS: { x: number; y: number }[] = [
  { x: 64, y: 404 },
  { x: 240, y: 332 },
  { x: 92, y: 254 },
  { x: 246, y: 180 },
  { x: 88, y: 112 },
];
const DEST = { x: 206, y: 48 };
const VISIBLE = SLOTS.length;

/** Catmull-Rom through the stops, so the road bends instead of kinking. */
function roadPath(pts: { x: number; y: number }[]): string {
  const d = [`M ${pts[0].x} ${pts[0].y}`];
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x} ${p2.y}`);
  }
  return d.join(" ");
}

export function Home({ onStart, onSecond }: { onStart: () => void; onSecond: () => void }) {
  const { state } = useStore();
  const { t, rtl, go } = useLp();
  const now = useNow();
  const day = dayIndex(state, now);
  const todays = state.sessions.filter((s) => s.day === day);
  const doneToday = todays.some((s) => s.completed && !s.second);
  const secondDone = todays.some((s) => s.second);
  const cur = state.current && state.current.session.day === day ? state.current : null;
  const lastDay = state.sessions.filter((s) => s.completed).map((s) => s.day).sort((a, b) => b - a)[0];
  const missed = lastDay === undefined ? 0 : day - lastDay - 1;

  const fills = useMemo<[number, number, number]>(() => {
    if (doneToday) return [1, 1, 1];
    if (!cur) return [0, 0, 0];
    const slices: [number, number, number] = [0, 0, 0];
    const totals: [number, number, number] = [0, 0, 0];
    cur.session.phases.forEach((p, i) => { const s = ringSlice(p); totals[s] += phaseMinutes(p); if (i < cur.phase_index) slices[s] += phaseMinutes(p); });
    return slices.map((v, i) => (totals[i] ? v / totals[i] : 0)) as [number, number, number];
  }, [cur, doneToday]);

  const curIdx = Math.max(0, OUTCOMES.findIndex((o) => o.outcome_id === state.week_can_do));
  const start = Math.min(Math.max(0, curIdx - 2), Math.max(0, OUTCOMES.length - VISIBLE));
  const stops = OUTCOMES.slice(start, start + VISIBLE);
  const todaySlot = Math.min(VISIBLE - 1, curIdx - start);
  const weekCanDo = state.week_can_do ? OUTCOME_BY_ID[state.week_can_do] : null;
  const level = state.learner.confirmed_sublevel ?? state.learner.provisional_sublevel ?? "A2.1";

  // Mirror the road for right-to-left languages; the labels stay upright.
  const mx = (x: number) => (rtl ? W - x : x);
  const points = [...SLOTS.slice(0, stops.length), DEST].map((p) => ({ x: mx(p.x), y: p.y }));
  const path = roadPath(points);
  // The road fills past the stops already ticked and part way into today's, so
  // the learner can see they moved even before the stop is finished.
  const here = state.week_can_do ? outcomeProgress(state, state.week_can_do) : 0;
  const walked = ((todaySlot + Math.min(0.92, here)) / (points.length - 1)) * 100;

  // The one line: where the learner is in their week, or why today is short.
  const line = doneToday ? t("coach_done") : missed >= 2 ? t("coach_welcome_back") : null;

  return (
    <div className="relative flex h-full flex-col overflow-hidden px-5 pb-3 pt-4">
      <div className="lp-blob" style={{ width: 300, height: 300, right: -130, top: -110, background: "var(--lp-glow-tint)" }} />

      <div className="relative flex items-baseline justify-between">
        <div className="lp-eyebrow">{t("today")}</div>
        <div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>{CEFR_LABEL[level]} → B1</div>
      </div>

      {/* The journey. Tap it to see the whole road. */}
      <button type="button" onClick={() => go("road")} aria-label={t("road")} className="relative min-h-0 flex-1 bg-transparent" style={{ border: "none", padding: 0, cursor: "pointer" }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={t("road")}>
          <defs>
            <radialGradient id="lp-horizon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--lp-glow)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--lp-glow)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Horizon behind the destination */}
          <circle cx={mx(DEST.x)} cy={DEST.y} r={96} fill="url(#lp-horizon)" />

          {/* Road surface, the walked part filled, centre dashes on top */}
          <path d={path} fill="none" stroke="var(--lp-road)" strokeWidth={20} strokeLinecap="round" />
          <path d={path} fill="none" stroke="var(--lp-sea)" strokeWidth={20} strokeLinecap="round" pathLength={100}
            className="lp-road-trail" strokeDasharray={`${walked} 100`} opacity={0.9} />
          <path d={path} fill="none" stroke="var(--lp-line-strong)" strokeWidth={2} strokeDasharray="5 11" strokeLinecap="round" />

          {/* The stops */}
          {stops.map((o, i) => {
            const achieved = outcomeAchieved(state, o.outcome_id);
            const p = { x: mx(SLOTS[i].x), y: SLOTS[i].y };
            if (i === todaySlot) {
              return (
                <g key={o.outcome_id}>
                  <circle cx={p.x} cy={p.y} r={30} fill="var(--lp-marker)" opacity={0.18} className="lp-marker-breathe" />
                  <RingArcs cx={p.x} cy={p.y} r={30} width={6} fills={fills} />
                  <g className="lp-marker-glow"><IsoStop x={p.x} y={p.y} w={17} h={11} colour="var(--lp-marker)" /></g>
                </g>
              );
            }
            if (achieved || i < todaySlot) {
              return (
                <g key={o.outcome_id}>
                  <IsoStop x={p.x} y={p.y} w={14} h={9} colour="var(--lp-sea)" />
                  <StopTick x={p.x} y={p.y - 4} />
                </g>
              );
            }
            return <g key={o.outcome_id} opacity={0.62}><IsoStop x={p.x} y={p.y} w={12} h={8} colour="var(--lp-fog)" /></g>;
          })}

          {/* Destination: a flag at the next CEFR level */}
          <g>
            <IsoStop x={mx(DEST.x)} y={DEST.y} w={13} h={9} colour="var(--lp-glow)" />
            <line x1={mx(DEST.x)} y1={DEST.y - 8} x2={mx(DEST.x)} y2={DEST.y - 40} stroke="var(--lp-glow)" strokeWidth={2} strokeLinecap="round" />
            <polygon points={`${mx(DEST.x)},${DEST.y - 40} ${mx(DEST.x) + (rtl ? -26 : 26)},${DEST.y - 33} ${mx(DEST.x)},${DEST.y - 26}`} fill="var(--lp-glow)" />
            <text x={mx(DEST.x) + (rtl ? -34 : 34)} y={DEST.y - 28} textAnchor={rtl ? "end" : "start"} fill="var(--lp-paper-faint)" fontSize="13" fontWeight="700" letterSpacing="0.08em">B1</text>
          </g>
        </svg>
      </button>

      {/* One line: what today is */}
      <div className="relative mt-2 min-h-[52px]">
        {line ? (
          <div className="lp-lesson"><Say text={line} size="lesson" /></div>
        ) : weekCanDo ? (
          <LocText text={weekCanDo.can_do} size="lesson" />
        ) : (
          <div className="lp-lesson"><Say text={t("coach_fresh")} size="lesson" /></div>
        )}
      </div>

      {/* One action */}
      <div className="relative mt-3">
        {!doneToday ? (
          <GlowButton onClick={onStart}>{cur ? t("continue") : t("start")}</GlowButton>
        ) : !secondDone ? (
          <button type="button" onClick={onSecond} className="lp-small w-full py-4 text-center" style={{ color: "var(--lp-glow)", fontWeight: 600, background: "none", border: "none" }}>{t("more_today")}</button>
        ) : (
          <div className="lp-small py-4 text-center" style={{ color: "var(--lp-paper-faint)" }}>{t("coach_second")}</div>
        )}
      </div>
    </div>
  );
}
