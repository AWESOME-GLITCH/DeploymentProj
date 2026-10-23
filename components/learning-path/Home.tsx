"use client";

// Home (Today): start today's ten minutes. Three-slice ring, one coach line,
// one glowing Start, a small study scene with a live count, a 7-day dot row.

import { useMemo } from "react";
import { OUTCOME_BY_ID } from "@/lib/learning-path/content";
import { dayIndex, ringSlice, phaseMinutes, weekDay } from "@/lib/learning-path/engine";
import { useNow, useStore } from "@/lib/learning-path/store";
import { DotRow, GlowButton, LocText, Ring, Say, useLp } from "./ui";

export function Home({ onStart, onSecond }: { onStart: () => void; onSecond: () => void }) {
  const { state } = useStore();
  const { t } = useLp();
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
    cur.session.phases.forEach((p, i) => {
      const s = ringSlice(p);
      totals[s] += phaseMinutes(p);
      if (i < cur.phase_index) slices[s] += phaseMinutes(p);
    });
    return slices.map((v, i) => (totals[i] ? v / totals[i] : 0)) as [number, number, number];
  }, [cur, doneToday]);

  const week = Array.from({ length: 7 }, (_, i) => state.sessions.some((s) => s.completed && weekDay(state, s.day) === i + 1 && s.day >= state.week_start_day));
  const todayIdx = weekDay(state, day) - 1;
  const onTrack = week.filter(Boolean).length;
  const coach = doneToday ? (secondDone ? t("coach_done") : t("coach_done")) : cur ? t("coach_mid") : missed >= 2 ? t("coach_welcome_back") : t("coach_fresh");
  const weekCanDo = state.week_can_do ? OUTCOME_BY_ID[state.week_can_do] : null;
  const live = 120 + Math.round(40 * Math.sin(now / 600_000)) + (day % 7) * 3;

  return (
    <div className="flex h-full flex-col px-5 pb-4 pt-4">
      <div className="flex items-center justify-between">
        <div><div className="lp-eyebrow">{t("today")}</div><div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>Day {day + 1}{state.learner.plan ? ` · ${state.learner.plan.time}` : ""}</div></div>
        {weekCanDo ? <div className="lp-pill lp-pill-glow" style={{ maxWidth: 190 }}><span>{weekCanDo.icon}</span><span className="truncate">{t("this_week")}</span></div> : null}
      </div>
      <div className="mt-2 flex flex-col items-center">
        <Ring fills={fills} size={212} label={<><div className="lp-head" style={{ fontSize: 40 }}>{Math.round((fills[0] + fills[1] + fills[2]) / 3 * state.learner.daily_minutes)}</div><div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>/ {state.learner.daily_minutes} {t("minutes")}</div></>} />
        <div className="lp-body mt-4 text-center" style={{ color: "var(--lp-paper-soft)", minHeight: 48 }}><Say text={coach} /></div>
        {missed >= 2 && !doneToday && !cur ? <div className="lp-small mt-1" style={{ color: "var(--lp-sea)" }}>{missed} {t("days_missed")}</div> : null}
      </div>
      {weekCanDo ? <div className="mt-3 text-center"><LocText text={weekCanDo.can_do} size="small" className="text-center" /></div> : null}
      <div className="mt-auto">
        {!doneToday ? (
          <GlowButton onClick={onStart}>{cur ? t("continue") : t("start")}</GlowButton>
        ) : !secondDone ? (
          <button type="button" onClick={onSecond} className="lp-small w-full py-3 text-center" style={{ color: "var(--lp-sea)", background: "none", border: "none" }}>{t("more_today")}</button>
        ) : (
          <div className="lp-small py-3 text-center" style={{ color: "var(--lp-paper-faint)" }}>{t("coach_second")}</div>
        )}
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <div className="lp-glass flex items-center gap-1 px-2 py-1" style={{ borderRadius: 14 }}><span style={{ fontSize: 22 }}>🧕</span><span style={{ fontSize: 22 }}>🧑🏽‍💻</span></div>
          <div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}><span className="lp-dot lp-dot-on me-1" style={{ width: 8, height: 8 }} />{live} {t("learners_now")}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <DotRow days={week} today={todayIdx} />
          <div className="lp-small" style={{ color: onTrack >= 4 ? "var(--lp-sea)" : "var(--lp-paper-faint)", fontSize: 11 }}>{onTrack >= 4 ? t("on_track") : `${onTrack} / 4 ${t("sessions_this_week")}`}</div>
        </div>
      </div>
    </div>
  );
}
