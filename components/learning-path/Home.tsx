"use client";

// Home is the journey. One drawn road winds up the screen from where the
// learner stands to the next level. Every stop is a landmark with its can-do
// in plain words; past stops are ticked, today's stop is the one lit thing,
// the stops ahead are quiet. Under the road: what today is, the level, one
// line from the coach, one button. Nothing moves except the walked road
// filling in once.

import { useEffect, useRef, useState } from "react";
import { OUTCOMES, OUTCOME_BY_ID } from "@/lib/learning-path/content";
import { ATOM_LOOKUP, checkpointAvailable, dayIndex, outcomeAchieved, outcomeProgress, scoreNewAtoms } from "@/lib/learning-path/engine";
import { useNow, useStore } from "@/lib/learning-path/store";
import { CEFR_LABEL, loc } from "@/lib/learning-path/i18n";
import type { L1, Localised, Strand } from "@/lib/learning-path/types";
import { Face } from "./art/cast";
import { GlowButton, useLp } from "./ui";

const LEVEL_WORD: Record<string, string> = { "Pre-A1": "Starter", A1: "Beginner", A2: "Elementary", B1: "Intermediate", B2: "Upper intermediate", C1: "Advanced", C2: "Proficient" };

/** "A2.1" becomes "A2 · Elementary". */
export function levelInWords(sub: string | null | undefined): string {
  const label = CEFR_LABEL[(sub ?? "A2.1") as keyof typeof CEFR_LABEL] ?? "A2.1";
  const band = label.replace(/\.\d$/, "");
  return LEVEL_WORD[band] ? `${band} · ${LEVEL_WORD[band]}` : label;
}

/** "Can order food and drink in a cafe" becomes "Order food and drink in a cafe". */
function canDoShort(text: Localised, lang: L1): string {
  const s = loc(text, lang).replace(/^Can\s+/i, "");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function wrap(s: string, max: number, lines: number): string[] {
  const out: string[] = [];
  let cur = "";
  for (const w of s.split(/\s+/)) {
    if (!cur) cur = w;
    else if (`${cur} ${w}`.length <= max) cur = `${cur} ${w}`;
    else { out.push(cur); cur = w; if (out.length === lines) break; }
  }
  if (cur && out.length < lines) out.push(cur);
  return out.slice(0, lines);
}

/** A small flat landmark for each strand, drawn in the same vector language as the lesson videos. */
function Landmark({ strand, x, y, s, colour }: { strand: Strand; x: number; y: number; s: number; colour: string }) {
  const g = `translate(${x} ${y}) scale(${s})`;
  switch (strand) {
    case "INT": // a cup
      return <g transform={g} fill="none" stroke={colour} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M-6 -4 H6 L5 6 H-5 Z" /><path d="M6 -2 Q10 -2 10 1 Q10 4 6 4" /><path d="M-2 -8 q1 -2 0 -4 M2 -8 q1 -2 0 -4" opacity={0.6} /></g>;
    case "GRM": // two blocks that fit
      return <g transform={g} fill="none" stroke={colour} strokeWidth={1.8} strokeLinejoin="round"><rect x={-9} y={-2} width={8} height={8} rx={1.5} /><rect x={1} y={-8} width={8} height={8} rx={1.5} /></g>;
    case "LST": // sound
      return <g transform={g} fill="none" stroke={colour} strokeWidth={1.8} strokeLinecap="round"><path d="M-7 -3 V3 H-3 L2 7 V-7 L-3 -3 Z" strokeLinejoin="round" /><path d="M5 -3 Q8 0 5 3" /><path d="M8 -6 Q13 0 8 6" opacity={0.6} /></g>;
    case "SPK": // a speech bubble
      return <g transform={g} fill="none" stroke={colour} strokeWidth={1.8} strokeLinejoin="round"><path d="M-9 -7 H9 V3 H-2 L-6 7 V3 H-9 Z" /></g>;
    case "RDG": // an open book
      return <g transform={g} fill="none" stroke={colour} strokeWidth={1.8} strokeLinejoin="round"><path d="M0 -6 Q-5 -9 -10 -7 V6 Q-5 4 0 7 Q5 4 10 6 V-7 Q5 -9 0 -6 V7" /></g>;
    case "WRT": // a pencil
      return <g transform={g} fill="none" stroke={colour} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M-8 8 L-6 2 L5 -9 L9 -5 L-2 6 Z" /><path d="M3 -7 L7 -3" /></g>;
    default: // MED: an envelope passed on
      return <g transform={g} fill="none" stroke={colour} strokeWidth={1.8} strokeLinejoin="round"><rect x={-9} y={-6} width={18} height={12} rx={1.5} /><path d="M-9 -6 L0 1 L9 -6" /></g>;
  }
}

type Box = { w: number; h: number };

export function Home({ onStart, onSecond, onCheckpoint }: { onStart: () => void; onSecond: () => void; onCheckpoint?: () => void }) {
  const { state } = useStore();
  const { t, rtl, lang } = useLp();
  const now = useNow();
  const day = dayIndex(state, now);
  const todays = state.sessions.filter((s) => s.day === day);
  const doneToday = todays.some((s) => s.completed && !s.second);
  const secondDone = todays.some((s) => s.second);
  const cur = state.current && state.current.session.day === day ? state.current : null;
  const lastDay = state.sessions.filter((s) => s.completed).map((s) => s.day).sort((a, b) => b - a)[0];
  const missed = lastDay === undefined ? 0 : day - lastDay - 1;
  const ckp = checkpointAvailable(state, now);

  const curIdx = Math.max(0, OUTCOMES.findIndex((o) => o.outcome_id === state.week_can_do));
  const weekCanDo = state.week_can_do ? OUTCOME_BY_ID[state.week_can_do] : OUTCOMES[curIdx];
  const planned = cur?.session.phases.find((p) => p.kind === "atom" && p.role === "new");
  const lessonAtom = (planned && planned.kind === "atom" ? ATOM_LOOKUP[planned.atom_id] : null) ?? scoreNewAtoms(state, now, day)[0]?.atom ?? null;
  const lessonName = lessonAtom ? loc(lessonAtom.title, lang) : null;
  const coach = doneToday ? t("coach_done") : missed >= 2 ? t("coach_welcome_back") : cur ? t("coach_mid") : t("coach_fresh");
  const minutes = state.learner.daily_minutes;
  const canDo = weekCanDo ? canDoShort(weekCanDo.can_do, lang) : null;
  const level = levelInWords(state.learner.confirmed_sublevel);
  const nextLevel = (CEFR_LABEL[(state.learner.confirmed_sublevel ?? "A2.1") as keyof typeof CEFR_LABEL] ?? "A2.1").startsWith("A2") ? "B1" : "B2";

  // The road is drawn in real pixels so type and landmarks keep their size.
  const roadRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  useEffect(() => {
    const el = roadRef.current;
    if (!el) return;
    const measure = () => { const r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0) setBox({ w: Math.round(r.width), h: Math.round(r.height) }); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Which stops are on screen: today's with two behind and the rest ahead, five in all.
  const VISIBLE = 5;
  const start = Math.min(Math.max(0, curIdx - 2), Math.max(0, OUTCOMES.length - VISIBLE));
  const stops = OUTCOMES.slice(start, start + VISIBLE);
  const todaySlot = Math.min(VISIBLE - 1, Math.max(0, curIdx - start));
  const hereProg = state.week_can_do ? Math.min(0.9, outcomeProgress(state, state.week_can_do)) : 0;

  // Geometry: t runs 0 at the bottom of the frame to 1 at the top.
  const w = box?.w ?? 375;
  const h = box?.h ?? 480;
  const topY = 52;
  const botY = h + 40;
  const yOf = (tt: number) => botY - tt * (botY - topY);
  const amp = Math.min(84, w * 0.22);
  const xOf = (tt: number) => (rtl ? w - 1 : 1) * 0 + w / 2 + Math.sin(tt * Math.PI * 1.6 + 0.4) * amp * (rtl ? -1 : 1);
  const slotT = [0.14, 0.33, 0.52, 0.71, 0.9];
  const tHere = slotT[todaySlot] + ((slotT[todaySlot + 1] ?? 1) - slotT[todaySlot]) * hereProg;
  const samples = 60;
  const pts = Array.from({ length: samples + 1 }, (_, i) => { const tt = i / samples; return `${xOf(tt).toFixed(1)},${yOf(tt).toFixed(1)}`; });
  const walked = Array.from({ length: samples + 1 }, (_, i) => { const tt = (i / samples) * tHere; return `${xOf(tt).toFixed(1)},${yOf(tt).toFixed(1)}`; });

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div ref={roadRef} className="relative min-h-0 flex-1" aria-label={`${t("road")}. ${canDo ?? ""}`}>
        {box ? (
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
            <defs>
              <linearGradient id="lp-home-near" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--lp-bg-0)" stopOpacity="0" />
                <stop offset="100%" stopColor="var(--lp-bg-0)" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* The next level, at the top of the road */}
            <g>
              <circle cx={xOf(1)} cy={topY} r={13} fill="var(--lp-bg-0)" stroke="var(--lp-line-strong)" strokeWidth={1.5} strokeDasharray="3 3" />
              <text x={xOf(1) + (xOf(1) < w / 2 ? 22 : -22)} y={topY + 4.5} textAnchor={xOf(1) < w / 2 ? "start" : "end"} fill="var(--lp-paper-faint)" fontSize="13" fontWeight="600">{nextLevel}</text>
            </g>

            {/* The road: a soft wide ribbon, the walked part filled in */}
            <polyline points={pts.join(" ")} fill="none" stroke="var(--lp-road)" strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={pts.join(" ")} fill="none" stroke="var(--lp-line-strong)" strokeWidth={1.5} strokeDasharray="2 9" strokeLinecap="round" opacity={0.7} />
            {walked.length > 1 ? <polyline points={walked.join(" ")} fill="none" stroke="var(--lp-sea)" strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" opacity={0.92} /> : null}

            {/* The stops */}
            {stops.map((o, i) => {
              const tt = slotT[i];
              const px = xOf(tt);
              const py = yOf(tt);
              const achieved = outcomeAchieved(state, o.outcome_id) || i < todaySlot;
              const isToday = i === todaySlot;
              const ahead = !achieved && !isToday;
              const left = px < w / 2; // label goes on the outer side
              const lx = left ? px + 34 : px - 34;
              const anchor = left ? "start" : "end";
              const lines = wrap(canDoShort(o.can_do, lang), 22, 2);
              const r = isToday ? 22 : 17;
              const colour = achieved ? "var(--lp-on-glow)" : isToday ? "var(--lp-glow)" : "var(--lp-paper-faint)";
              return (
                <g key={o.outcome_id} opacity={ahead ? 0.7 : 1}>
                  {isToday ? <circle cx={px} cy={py} r={r + 9} fill="var(--lp-glow-tint)" /> : null}
                  <circle cx={px} cy={py} r={r} fill={achieved ? "var(--lp-sea)" : "var(--lp-surface)"} stroke={isToday ? "var(--lp-glow)" : achieved ? "var(--lp-sea)" : "var(--lp-line-strong)"} strokeWidth={isToday ? 2.5 : 1.5} />
                  {achieved ? (
                    <path d={`M${px - 6} ${py} l4 4 l8 -8`} fill="none" stroke="var(--lp-on-glow)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <Landmark strand={o.strand} x={px} y={py} s={isToday ? 1.15 : 0.95} colour={colour} />
                  )}
                  <text x={lx} y={py - (lines.length - 1) * 8 + 4.5} textAnchor={anchor} fill={isToday ? "var(--lp-paper)" : "var(--lp-paper-soft)"} fontSize={isToday ? "14.5" : "13"} fontWeight={isToday ? 600 : 500}>
                    {lines.map((l, li) => <tspan key={li} x={lx} dy={li === 0 ? 0 : 17}>{l}</tspan>)}
                  </text>
                  {isToday ? <text x={lx} y={py + (lines.length - 1) * 8 + 22} textAnchor={anchor} fill="var(--lp-paper-faint)" fontSize="12" fontWeight="500">{t("today")}</text> : null}
                </g>
              );
            })}

            {/* The near end of the road fades into the page */}
            <rect x="0" y={h - 48} width={w} height={48} fill="url(#lp-home-near)" />
          </svg>
        ) : null}
      </div>

      {/* Today: one sun block, Maya in it at size, the lesson, one button. She
          is cropped by the card rather than floating in it, so Today reads as
          the coach asking rather than as a panel of facts. */}
      <div className="relative mx-4 mb-3 overflow-hidden px-5 pb-4 pt-4" style={{ background: "var(--lp-marker)", border: "var(--lp-border-w) solid #121212", borderRadius: "var(--lp-r-xl)", boxShadow: "var(--lp-card-shadow)", color: "#121212" }}>
        <Face
          face={doneToday ? "happy" : missed >= 2 ? "wow" : "idle"}
          title={t("coach_label")}
          fit="xMidYMin slice"
          style={{ position: "absolute", insetInlineEnd: -26, bottom: -14, width: 168, height: 168, pointerEvents: "none" }}
        />
        <div className="relative" style={{ maxWidth: "62%" }}>
          <div className="lp-small" style={{ color: "#121212", opacity: 0.72 }}>{[level, `${minutes} min`].filter(Boolean).join(" · ")}</div>
          {lessonName ? <div className="lp-lesson mt-1">{lessonName}</div> : null}
          <div className="lp-small mt-1">{coach}</div>
        </div>
        <div className="relative mt-4">
          {!doneToday ? (
            <GlowButton onClick={onStart}>{cur ? t("continue") : t("start")}</GlowButton>
          ) : !secondDone ? (
            <button type="button" onClick={onSecond} className="lp-small w-full text-center" style={{ minHeight: 56, color: "#121212", fontWeight: 700, background: "none", border: "none", textDecoration: "underline" }}>{t("more_today")}</button>
          ) : (
            <div className="lp-small text-center" style={{ minHeight: 56, lineHeight: "56px", color: "#121212", opacity: 0.72 }}>{t("coach_second")}</div>
          )}
          {ckp && onCheckpoint ? <button type="button" onClick={onCheckpoint} className="lp-small mt-2 w-full text-center" style={{ minHeight: 40, color: "#121212", fontWeight: 700, background: "none", border: "none", textDecoration: "underline" }}>{t("checkpoint_ready")}</button> : null}
        </div>
      </div>
    </div>
  );
}
