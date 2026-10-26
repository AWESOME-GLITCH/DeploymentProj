"use client";

// Home (Today). Three things a learner needs at a glance: where they are on
// the path (a strip of stops with the current one highlighted), what today's
// ten minutes contain (the composed session, step by step, with minutes), and
// one Start. Then the ring, the live study scene and the 7-day dot row.

import { useMemo } from "react";
import { BookOpen, Check, ChevronRight, Film, Mic, RefreshCw, Users } from "lucide-react";
import { ATOM_BY_ID, OUTCOMES, OUTCOME_BY_ID } from "@/lib/learning-path/content";
import { composeSession, dayIndex, outcomeAchieved, outcomeProgress, phaseMinutes, ringSlice, weekDay } from "@/lib/learning-path/engine";
import { useNow, useStore } from "@/lib/learning-path/store";
import type { SessionPhase } from "@/lib/learning-path/types";
import { loc } from "@/lib/learning-path/i18n";
import { DotRow, GlowButton, LocText, Ring, STRAND_COLOR, Say, useLp } from "./ui";

function phaseLabel(p: SessionPhase, t: (k: string) => string, lang: "en" | string): { icon: React.ReactNode; label: string; sub?: string } {
  switch (p.kind) {
    case "plan": return { icon: <BookOpen size={16} />, label: t("plan_phase") };
    case "recall": return { icon: <RefreshCw size={16} />, label: t("recall_title"), sub: `${p.items.length} items` };
    case "atom": {
      const a = ATOM_BY_ID[p.atom_id];
      if (p.role === "new") return { icon: <Film size={16} />, label: a ? loc(a.title, lang as "en") : "New lesson", sub: a?.type === "video" ? "video" : "word cards" };
      if (p.role === "fluency") return { icon: <Mic size={16} />, label: "Fluency", sub: "known words, faster" };
      return { icon: <Mic size={16} />, label: t("your_turn"), sub: "speak" };
    }
    case "vote": return { icon: <Users size={16} />, label: t("vote_q") };
    case "story": return { icon: <BookOpen size={16} />, label: t("story_title"), sub: t("story_sub") };
    case "close": return { icon: <Check size={16} />, label: t("check_title") };
  }
}

export function Home({ onStart, onSecond }: { onStart: () => void; onSecond: () => void }) {
  const { state } = useStore();
  const { t, lang, go } = useLp();
  const now = useNow();
  const day = dayIndex(state, now);
  const todays = state.sessions.filter((s) => s.day === day);
  const doneToday = todays.some((s) => s.completed && !s.second);
  const secondDone = todays.some((s) => s.second);
  const cur = state.current && state.current.session.day === day ? state.current : null;
  const lastDay = state.sessions.filter((s) => s.completed).map((s) => s.day).sort((a, b) => b - a)[0];
  const missed = lastDay === undefined ? 0 : day - lastDay - 1;

  const session = useMemo(() => cur?.session ?? (state.learner.placement_done ? composeSession(state, now) : null), [cur, state, now]);
  const steps = (session?.phases ?? []).filter((p) => p.kind !== "plan");
  const stepIndex = cur ? cur.phase_index - 1 : -1;

  const fills = useMemo<[number, number, number]>(() => {
    if (doneToday) return [1, 1, 1];
    if (!cur) return [0, 0, 0];
    const slices: [number, number, number] = [0, 0, 0];
    const totals: [number, number, number] = [0, 0, 0];
    cur.session.phases.forEach((p, i) => { const s = ringSlice(p); totals[s] += phaseMinutes(p); if (i < cur.phase_index) slices[s] += phaseMinutes(p); });
    return slices.map((v, i) => (totals[i] ? v / totals[i] : 0)) as [number, number, number];
  }, [cur, doneToday]);

  const week = Array.from({ length: 7 }, (_, i) => state.sessions.some((s) => s.completed && weekDay(state, s.day) === i + 1 && s.day >= state.week_start_day));
  const todayIdx = weekDay(state, day) - 1;
  const onTrack = week.filter(Boolean).length;
  const coach = doneToday ? t("coach_done") : cur ? t("coach_mid") : missed >= 2 ? t("coach_welcome_back") : t("coach_fresh");
  const weekCanDo = state.week_can_do ? OUTCOME_BY_ID[state.week_can_do] : null;
  const currentIdx = Math.max(0, OUTCOMES.findIndex((o) => o.outcome_id === state.week_can_do));
  const live = 120 + Math.round(40 * Math.sin(now / 600_000)) + (day % 7) * 3;
  const minutesDone = Math.round(((fills[0] + fills[1] + fills[2]) / 3) * state.learner.daily_minutes);
  const totalMinutes = Math.round(steps.reduce((a, p) => a + phaseMinutes(p), 0));
  const dateLabel = new Date(now).toLocaleDateString(lang === "en" ? "en-GB" : lang, { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="relative flex h-full flex-col overflow-hidden px-5 pb-3 pt-4">
      <div className="lp-blob" style={{ width: 260, height: 260, right: -110, top: -60, background: "var(--lp-glow-tint)" }} />

      <div className="relative flex items-center justify-between">
        <div>
          <div className="lp-eyebrow">{t("today")}</div>
          <div className="lp-body" style={{ fontWeight: 800 }}>{dateLabel}</div>
        </div>
        <div className="flex h-11 items-center justify-center rounded-full px-3" style={{ background: "var(--lp-accent)", color: "#fff", fontWeight: 800, fontSize: 14 }}>Day {day + 1}</div>
      </div>

      {/* Your path: a strip of stops, tap to open the Road */}
      <button type="button" onClick={() => go("road")} className="lp-glass relative mt-3 w-full p-3 text-start" style={{ cursor: "pointer" }}>
        <div className="flex items-center justify-between">
          <div className="lp-eyebrow">{t("road")} · {state.learner.confirmed_sublevel ?? "A2.1"}</div>
          <div className="lp-small flex items-center gap-1" style={{ color: "var(--lp-accent)", fontWeight: 800 }}>{currentIdx + 1} / {OUTCOMES.length} <ChevronRight size={14} /></div>
        </div>
        <div className="relative mt-2 h-10">
          <div className="absolute inset-x-1 top-1/2 h-1 -translate-y-1/2 rounded-full" style={{ background: "var(--lp-track)" }} />
          <div className="absolute left-1 top-1/2 h-1 -translate-y-1/2 rounded-full" style={{ width: `${(currentIdx / Math.max(1, OUTCOMES.length - 1)) * 100}%`, background: "var(--lp-sea)" }} />
          {OUTCOMES.map((o, i) => {
            const achieved = outcomeAchieved(state, o.outcome_id);
            const isCur = i === currentIdx;
            const left = `${(i / Math.max(1, OUTCOMES.length - 1)) * 100}%`;
            return (
              <div key={o.outcome_id} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left }}>
                <div className="flex items-center justify-center rounded-full" style={{ width: isCur ? 34 : 18, height: isCur ? 34 : 18, background: isCur ? "var(--lp-glow)" : achieved ? "var(--lp-sea)" : "var(--lp-surface)", border: `2px solid ${isCur ? "var(--lp-glow)" : achieved ? "var(--lp-sea)" : STRAND_COLOR[o.strand]}`, fontSize: isCur ? 17 : 9, boxShadow: isCur ? "0 6px 14px -6px var(--lp-glow-shadow)" : undefined }}>
                  {isCur ? o.icon : achieved ? <Check size={10} color="#fff" /> : ""}
                </div>
              </div>
            );
          })}
        </div>
        {weekCanDo ? (
          <div className="mt-1 flex items-center gap-2">
            <span className="lp-small" style={{ color: "var(--lp-paper-faint)", fontWeight: 700 }}>{t("this_week")}:</span>
            <span className="lp-small flex-1 truncate" style={{ fontWeight: 700 }}>{loc(weekCanDo.can_do, lang)}</span>
            <span className="lp-small" style={{ color: "var(--lp-sea-deep)", fontWeight: 800 }}>{Math.round(outcomeProgress(state, weekCanDo.outcome_id) * 100)}%</span>
          </div>
        ) : null}
      </button>

      {/* Today's session, step by step */}
      <div className="lp-glass relative mt-3 flex flex-1 flex-col overflow-hidden p-3">
        <div className="flex items-center justify-between">
          <div className="lp-eyebrow">{t("plan_phase")}</div>
          <div className="lp-small" style={{ color: "var(--lp-paper-faint)", fontWeight: 700 }}>{totalMinutes} {t("minutes")}</div>
        </div>
        <div className="mt-2 flex flex-col gap-1.5">
          {steps.slice(0, 5).map((p, i) => {
            const info = phaseLabel(p, t, lang);
            const done = doneToday || i < stepIndex;
            const active = !doneToday && i === stepIndex;
            return (
              <div key={i} className="flex items-center gap-3 rounded-xl px-2 py-1.5" style={{ background: active ? "var(--lp-glow-tint)" : "transparent", opacity: done ? 0.55 : 1 }}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: done ? "var(--lp-sea)" : active ? "var(--lp-glow)" : "var(--lp-well)", color: done ? "#fff" : active ? "var(--lp-on-glow)" : "var(--lp-paper-soft)" }}>{done ? <Check size={16} /> : info.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="lp-small truncate" style={{ fontWeight: 800 }}>{info.label}</div>
                  {info.sub ? <div className="truncate" style={{ fontSize: 11.5, color: "var(--lp-paper-faint)" }}>{info.sub}</div> : null}
                </div>
                <span className="lp-small tabular-nums" style={{ color: "var(--lp-paper-faint)", fontWeight: 700 }}>{Math.round(phaseMinutes(p) * 10) / 10}′</span>
              </div>
            );
          })}
          {!steps.length ? <div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>{t("coach_fresh")}</div> : null}
        </div>
        <div className="mt-auto flex items-center gap-3 pt-2">
          <Ring fills={fills} size={84} label={<div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{minutesDone}<div style={{ fontSize: 10, color: "var(--lp-paper-faint)", fontWeight: 700 }}>/ {state.learner.daily_minutes}</div></div>} />
          <div className="min-w-0 flex-1">
            <div className="lp-body" style={{ fontWeight: 700, lineHeight: 1.25 }}><Say text={coach} /></div>
            {missed >= 2 && !doneToday && !cur ? <div className="lp-small mt-1" style={{ color: "var(--lp-sea-deep)", fontWeight: 700 }}>{missed} {t("days_missed")}</div> : null}
          </div>
        </div>
      </div>

      <div className="relative mt-3">
        {!doneToday ? (
          <GlowButton onClick={onStart}>{cur ? t("continue") : t("start")} · {totalMinutes} {t("minutes")}</GlowButton>
        ) : !secondDone ? (
          <button type="button" onClick={onSecond} className="lp-small w-full py-3 text-center" style={{ color: "var(--lp-accent)", fontWeight: 800, background: "none", border: "none" }}>{t("more_today")}</button>
        ) : (
          <div className="lp-small py-3 text-center" style={{ color: "var(--lp-paper-faint)" }}>{t("coach_second")}</div>
        )}
      </div>

      <div className="relative mt-3 flex items-end justify-between gap-3">
        <div className="lp-scene-card">
          <div className="lp-people">
            <span style={{ background: "var(--lp-s-INT)" }}>🧕</span>
            <span style={{ background: "var(--lp-s-LST)" }}>🧑🏽‍💻</span>
            <span style={{ background: "var(--lp-s-MED)", color: "#fff" }}><Users size={15} /></span>
          </div>
          <div className="lp-small" style={{ fontWeight: 700 }}>{live} <span style={{ color: "var(--lp-paper-faint)", fontWeight: 600 }}>{t("learners_now")}</span></div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <DotRow days={week} today={todayIdx} />
          <div className="lp-small" style={{ color: onTrack >= 4 ? "var(--lp-sea-deep)" : "var(--lp-paper-faint)", fontSize: 11, fontWeight: 700 }}>{onTrack >= 4 ? t("on_track") : `${onTrack} / 4 ${t("sessions_this_week")}`}</div>
        </div>
      </div>
      <span hidden><LocText text={{ en: "" }} /></span>
    </div>
  );
}
