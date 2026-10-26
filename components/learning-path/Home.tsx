"use client";

// Home. The journey fills the screen: a drawn road running from under the
// learner's feet at the bottom up to the next CEFR level at the horizon, with
// a landmark for every stop. Past stops are ticked and filled, today's stop is
// the one lit thing on the road, the stops ahead sit in fog. Under the road,
// three short lines say what today is, and one button starts it.
// Tapping the road opens the whole road.

import { useEffect, useRef, useState } from "react";
import { OUTCOMES, OUTCOME_BY_ID } from "@/lib/learning-path/content";
import { ATOM_LOOKUP, dayIndex, fogOpacity, outcomeAchieved, outcomeProgress, scoreNewAtoms } from "@/lib/learning-path/engine";
import { useNow, useStore } from "@/lib/learning-path/store";
import { loc } from "@/lib/learning-path/i18n";
import type { L1, Localised } from "@/lib/learning-path/types";
import { GlowButton, IsoStop, StopTick, useLp } from "./ui";

// Five stops are visible at a time, placed at fixed points up the road so the
// drawing keeps the same shape for every learner. t runs 0 at the road's near
// end (below the frame) to 1 at the horizon.
const SLOT_T = [0.17, 0.35, 0.53, 0.72, 0.9];
const VISIBLE = SLOT_T.length;
const LABEL_MAX = 18; // characters per label line
const LABEL_LINES = 3;

type Box = { w: number; h: number };

/** The road's geometry, in real pixels, for a box of w x h. */
function geo(box: Box) {
  const top = box.h * 0.1;
  const bottom = box.h + 60; // the road runs off the bottom of the frame
  const span = bottom - top;
  return {
    top,
    bottom,
    y: (t: number) => bottom - t * span,
    // A gentle double bend up the left of the frame, so the labels always have
    // the same column on the right.
    cx: (t: number) => box.w * 0.36 + Math.sin(t * 4.4) * box.w * 0.15 * (1 - t * 0.5),
    // Perspective: wide and near at the bottom, a few pixels at the horizon.
    half: (t: number) => box.w * 0.195 * Math.pow(1 - t, 1.4) + box.w * 0.012,
  };
}

/** "Can order food and drink in a cafe" becomes "Order food and drink in a cafe". */
function canDoShort(text: Localised, lang: L1): string {
  const s = loc(text, lang).replace(/^Can\s+/i, "");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Wrap a label to at most three short lines. */
function wrapLabel(s: string): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const word of s.split(/\s+/)) {
    if (!cur) cur = word;
    else if (`${cur} ${word}`.length <= LABEL_MAX) cur = `${cur} ${word}`;
    else { lines.push(cur); cur = word; if (lines.length === LABEL_LINES) break; }
  }
  if (cur && lines.length < LABEL_LINES) lines.push(cur);
  return lines.slice(0, LABEL_LINES);
}

/** The learner's own setting is honoured by lp.css; the OS setting is honoured
 *  here, because the marker's slide is an inline transition. */
function useSystemReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduce;
}

export function Home({ onStart, onSecond }: { onStart: () => void; onSecond: () => void }) {
  const { state } = useStore();
  const { t, rtl, lang, reduceMotion: settingReduce, go } = useLp();
  const systemReduce = useSystemReduceMotion();
  const reduceMotion = settingReduce || systemReduce;
  const now = useNow();
  const day = dayIndex(state, now);
  const todays = state.sessions.filter((s) => s.day === day);
  const doneToday = todays.some((s) => s.completed && !s.second);
  const secondDone = todays.some((s) => s.second);
  const cur = state.current && state.current.session.day === day ? state.current : null;
  const lastDay = state.sessions.filter((s) => s.completed).map((s) => s.day).sort((a, b) => b - a)[0];
  const missed = lastDay === undefined ? 0 : day - lastDay - 1;

  // The window of stops: today's stop with up to two behind it and the rest ahead.
  const curIdx = Math.max(0, OUTCOMES.findIndex((o) => o.outcome_id === state.week_can_do));
  const start = Math.min(Math.max(0, curIdx - 2), Math.max(0, OUTCOMES.length - VISIBLE));
  const stops = OUTCOMES.slice(start, start + VISIBLE);
  const todaySlot = Math.min(VISIBLE - 1, Math.max(0, curIdx - start));
  const weekCanDo = state.week_can_do ? OUTCOME_BY_ID[state.week_can_do] : OUTCOMES[curIdx];

  // Today's lesson: the new atom of the session in hand, or the one the engine
  // would pick next.
  const planned = cur?.session.phases.find((p) => p.kind === "atom" && p.role === "new");
  const lessonAtom = (planned && planned.kind === "atom" ? ATOM_LOOKUP[planned.atom_id] : null)
    ?? scoreNewAtoms(state, now, day)[0]?.atom
    ?? null;
  const lessonName = lessonAtom ? loc(lessonAtom.title, lang) : null;

  // The road is drawn in real pixels, so the labels keep their type size and
  // the markers keep their shape whatever the screen height is.
  const roadRef = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  useEffect(() => {
    const el = roadRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) setBox({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Motion: the marker walks onto the road and up to today's stop, once.
  const [arrived, setArrived] = useState(false);
  useEffect(() => {
    if (!box || arrived) return;
    if (reduceMotion) { setArrived(true); return; }
    const id = window.setTimeout(() => setArrived(true), 90);
    return () => window.clearTimeout(id);
  }, [box, arrived, reduceMotion]);

  // The one line from the coach.
  const coach = doneToday ? t("coach_done") : missed >= 2 ? t("coach_welcome_back") : cur ? t("coach_mid") : t("coach_fresh");
  const minutes = state.learner.daily_minutes;
  const canDo = weekCanDo ? canDoShort(weekCanDo.can_do, lang) : null;

  const g = box ? geo(box) : null;
  const mx = (x: number) => (box && rtl ? box.w - x : x);
  const labelX = box && g ? (rtl ? box.w - (box.w * 0.64) : box.w * 0.64) : 0;

  // How far the road is filled in: up to today's stop, plus the part of today's
  // stop already done, so the learner can see they moved.
  const hereProg = state.week_can_do ? Math.min(0.92, outcomeProgress(state, state.week_can_do)) : 0;
  const tHere = SLOT_T[todaySlot] + ((SLOT_T[todaySlot + 1] ?? 1) - SLOT_T[todaySlot]) * hereProg;

  let ribbon = "";
  if (g) {
    const left: string[] = [];
    const right: string[] = [];
    for (let i = 0; i <= 48; i += 1) {
      const tt = i / 48;
      const c = mx(g.cx(tt));
      const yy = g.y(tt).toFixed(1);
      const hw = g.half(tt);
      left.push(`${(c - hw).toFixed(1)},${yy}`);
      right.push(`${(c + hw).toFixed(1)},${yy}`);
    }
    ribbon = `${left.join(" ")} ${right.reverse().join(" ")}`;
  }

  const markerT = arrived ? SLOT_T[todaySlot] : 0;
  const markerX = g ? mx(g.cx(markerT)) : 0;
  const markerY = g ? g.y(markerT) : 0;

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* The journey. Tap it to see the whole road. */}
      <button
        ref={roadRef}
        type="button"
        onClick={() => go("road")}
        aria-label={`${t("road")}. ${canDo ?? ""}`}
        className="relative min-h-0 flex-1 bg-transparent"
        style={{ border: "none", padding: 0, cursor: "pointer", display: "block", width: "100%" }}
      >
        {box && g ? (
          <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} style={{ display: "block" }} aria-hidden="true">
            <defs>
              <radialGradient id="lp-home-horizon" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--lp-glow)" stopOpacity="0.26" />
                <stop offset="100%" stopColor="var(--lp-glow)" stopOpacity="0" />
              </radialGradient>
              {/* Light falling down the road from the horizon. */}
              <linearGradient id="lp-home-light" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              {/* Fog over the far road, the page colour fading downwards. */}
              <linearGradient id="lp-home-fog" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--lp-bg-0)" stopOpacity="0.82" />
                <stop offset="100%" stopColor="var(--lp-bg-0)" stopOpacity="0" />
              </linearGradient>
              {/* The near end of the road dissolves into the page instead of
                  stopping at a hard edge. */}
              <linearGradient id="lp-home-near" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--lp-bg-0)" stopOpacity="0" />
                <stop offset="100%" stopColor="var(--lp-bg-0)" stopOpacity="0.92" />
              </linearGradient>
              <linearGradient id="lp-home-walked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--lp-sea)" stopOpacity="0.15" />
                <stop offset="22%" stopColor="var(--lp-sea)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--lp-sea)" stopOpacity="0.55" />
              </linearGradient>
              <filter id="lp-home-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
              <clipPath id="lp-home-clip">
                <rect x="0" y={g.y(tHere)} width={box.w} height={Math.max(0, box.h - g.y(tHere))} />
              </clipPath>
            </defs>

            {/* Horizon light behind the destination */}
            <ellipse cx={mx(g.cx(1))} cy={g.top} rx={box.w * 0.55} ry={box.h * 0.16} fill="url(#lp-home-horizon)" />
            <line x1={box.w * 0.08} y1={g.top} x2={box.w * 0.92} y2={g.top} stroke="var(--lp-line)" strokeWidth={1} />

            {/* The road: a soft shadow under it, the surface, light from the
                horizon, the walked part filled, then a kerb line. */}
            <g transform="translate(0 10)" opacity={0.5}>
              <polygon points={ribbon} fill="var(--lp-shade)" opacity={0.3} filter="url(#lp-home-shadow)" />
            </g>
            <polygon points={ribbon} fill="var(--lp-road)" />
            <polygon points={ribbon} fill="url(#lp-home-light)" />
            <g clipPath="url(#lp-home-clip)">
              <polygon points={ribbon} fill="url(#lp-home-walked)" />
            </g>
            <polygon points={ribbon} fill="none" stroke="var(--lp-line-strong)" strokeWidth={1.25} strokeLinejoin="round" />

            {/* Fog over the distance */}
            <rect x="0" y={g.top - 10} width={box.w} height={box.h * 0.42} fill="url(#lp-home-fog)" />

            {/* The destination: the next level, with a flag */}
            <g opacity={0.9}>
              <IsoStop x={mx(g.cx(1))} y={g.top} w={11} h={7} colour="var(--lp-glow)" />
              <line x1={mx(g.cx(1))} y1={g.top - 7} x2={mx(g.cx(1))} y2={g.top - 34} stroke="var(--lp-glow)" strokeWidth={2} strokeLinecap="round" />
              <polygon points={`${mx(g.cx(1))},${g.top - 34} ${mx(g.cx(1)) + (rtl ? -22 : 22)},${g.top - 28} ${mx(g.cx(1))},${g.top - 22}`} fill="var(--lp-glow)" />
              <text x={mx(g.cx(1)) + (rtl ? -30 : 30)} y={g.top - 20} textAnchor={rtl ? "end" : "start"} fill="var(--lp-paper-faint)" fontSize="12.5" fontWeight="700" letterSpacing="0.1em">B1</text>
            </g>

            {/* The stops */}
            {stops.map((o, i) => {
              const tt = SLOT_T[i];
              const px = mx(g.cx(tt));
              const py = g.y(tt);
              const depth = 1 - tt * 0.42;
              const achieved = outcomeAchieved(state, o.outcome_id) || i < todaySlot;
              const isToday = i === todaySlot;
              const fog = isToday ? 0 : fogOpacity(state, o.outcome_id, now);
              const lines = isToday ? [] : wrapLabel(canDoShort(o.can_do, lang));
              return (
                <g key={o.outcome_id}>
                  <g opacity={achieved ? 1 : isToday ? 1 : 0.55 + (1 - fog) * 0.3}>
                    <IsoStop
                      x={px}
                      y={py}
                      w={(isToday ? 19 : 15) * depth}
                      h={(isToday ? 13 : 10) * depth}
                      colour={achieved ? "var(--lp-sea)" : isToday ? "var(--lp-marker)" : "var(--lp-fog)"}
                    />
                    {achieved ? <StopTick x={px} y={py - 4 * depth} size={5.5 * depth} /> : null}
                  </g>
                  {lines.length ? (
                    <text
                      x={labelX}
                      y={py - (lines.length - 1) * 7.5}
                      textAnchor={rtl ? "end" : "start"}
                      fill="var(--lp-paper-soft)"
                      opacity={achieved ? 0.85 : 0.78 + (1 - fog) * 0.12}
                      fontSize="12.5"
                      fontWeight="600"
                    >
                      {lines.map((l, li) => (
                        <tspan key={li} x={labelX} dy={li === 0 ? 0 : 15}>{l}</tspan>
                      ))}
                    </text>
                  ) : null}
                </g>
              );
            })}

            {/* The near end dissolves into the page */}
            <rect x="0" y={box.h - 64} width={box.w} height={64} fill="url(#lp-home-near)" />

            {/* You are here: the one lit thing on the road. It walks onto the
                road and up to today's stop on load, then breathes. */}
            <g
              style={{
                transform: `translate(${markerX}px, ${markerY}px)`,
                transition: reduceMotion ? "none" : "transform var(--lp-t-move) var(--lp-ease-emph)",
              }}
            >
              <circle cx={0} cy={0} r={26} fill="var(--lp-marker)" opacity={0.2} className={reduceMotion ? undefined : "lp-marker-breathe"} />
              <g className="lp-marker-glow">
                <circle cx={0} cy={-26} r={11} fill="var(--lp-marker)" />
                <circle cx={0} cy={-26} r={4} fill="var(--lp-bg-0)" />
                <line x1={0} y1={-15} x2={0} y2={-2} stroke="var(--lp-marker)" strokeWidth={2.5} strokeLinecap="round" />
              </g>
            </g>
          </svg>
        ) : null}
      </button>

      {/* Today, in three short lines, then one action. */}
      <div className="relative px-5 pb-3">
        <div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>
          {[t("today"), lessonName, `${minutes} min`].filter(Boolean).join(" · ")}
        </div>
        {canDo ? <div className="lp-lesson mt-1">{canDo}</div> : null}
        <div className="lp-small mt-1" style={{ color: "var(--lp-paper-faint)" }}>{coach}</div>
        <div className="mt-3">
          {!doneToday ? (
            <GlowButton onClick={onStart}>{cur ? t("continue") : t("start")}</GlowButton>
          ) : !secondDone ? (
            <button type="button" onClick={onSecond} className="lp-small w-full text-center" style={{ minHeight: 56, color: "var(--lp-glow)", fontWeight: 600, background: "none", border: "none" }}>{t("more_today")}</button>
          ) : (
            <div className="lp-small text-center" style={{ minHeight: 56, lineHeight: "56px", color: "var(--lp-paper-faint)" }}>{t("coach_second")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
