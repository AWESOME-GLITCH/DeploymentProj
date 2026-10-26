"use client";

// Home (Today): start today's ten minutes. The week's can-do up top, the
// three-slice ring, one coach line, one primary Start, the study scene with a
// live count, and the 7-day dot row. Fits one screen.

import { useMemo } from "react";
import { Users } from "lucide-react";
import { OUTCOME_BY_ID } from "@/lib/learning-path/content";
import { dayIndex, outcomeProgress, phaseMinutes, ringSlice, weekDay } from "@/lib/learning-path/engine";
import { useNow, useStore } from "@/lib/learning-path/store";
import { DotRow, GlowButton, LocText, Ring, Say, useLp } from "./ui";

export function Home({ onStart, onSecond }: { onStart: () => void; onSecond: () => void }) {
  const { state } = useStore();
  const { t, lang } = useLp();
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
  const coach = doneToday ? t("coach_done") : cur ? t("coach_mid") : missed >= 2 ? t("coach_welcome_back") : t("coach_fresh");
  const weekCanDo = state.week_can_do ? OUTCOME_BY_ID[state.week_can_do] : null;
  const weekProgress = weekCanDo ? outcomeProgress(state, weekCanDo.outcome_id) : 0;
  const live = 120 + Math.round(40 * Math.sin(now / 600_000)) + (day % 7) * 3;
  const minutesDone = Math.round(((fills[0] + fills[1] + fills[2]) / 3) * state.learner.daily_minutes);
  const hour = new Date(now).getHours();
  const dateLabel = new Date(now).toLocaleDateString(lang === "en" ? "en-GB" : lang, { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="relative flex h-full flex-col overflow-hidden px-5 pb-3 pt-4">
      <div className="lp-blob" style={{ width: 260, height: 260, right: -90, top: 120, background: "var(--lp-glow-tint)" }} />
      <div className="lp-blob" style={{ width: 200, height: 200, left: -80, top: 250, background: "var(--lp-accent-tint)" }} />

      <div className="relative flex items-center justify-between">
        <div>
          <div className="lp-eyebrow">{t("today")} · {hour < 12 ? "AM" : "PM"}</div>
          <div className="lp-body" style={{ fontWeight: 700 }}>{dateLabel}</div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: "var(--lp-accent)", color: "#fff", fontWeight: 800, fontSize: 15 }}>D{day + 1}</div>
      </div>

      {weekCanDo ? (
        <div className="lp-week-card relative mt-4">
          <div className="flex items-center justify-between">
            <div className="lp-eyebrow">{t("this_week")}</div>
            <div className="lp-small" style={{ fontWeight: 800 }}>{Math.round(weekProgress * 100)}%</div>
          </div>
          <div className="mt-1 flex items-start gap-2">
            <span style={{ fontSize: 26, lineHeight: 1 }}>{weekCanDo.icon}</span>
            <LocText text={weekCanDo.can_do} size="body" className="flex-1" />
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full" style={{ background: "rgba(27,29,58,0.14)" }}><div className="h-full rounded-full" style={{ width: `${Math.round(weekProgress * 100)}%`, background: "#1b1d3a" }} /></div>
        </div>
      ) : null}

      <div className="relative mt-4 flex flex-1 flex-col items-center justify-center">
        <Ring fills={fills} size={196} label={<><div className="lp-head" style={{ fontSize: 44, lineHeight: 1 }}>{minutesDone}</div><div className="lp-small" style={{ color: "var(--lp-paper-faint)", fontWeight: 700 }}>/ {state.learner.daily_minutes} {t("minutes")}</div></>} />
        <div className="lp-body mt-4 max-w-[300px] text-center" style={{ color: "var(--lp-paper-soft)", fontWeight: 600 }}><Say text={coach} /></div>
        {missed >= 2 && !doneToday && !cur ? <div className="lp-small mt-1" style={{ color: "var(--lp-sea-deep)", fontWeight: 700 }}>{missed} {t("days_missed")}</div> : null}
      </div>

      <div className="relative">
        {!doneToday ? (
          <GlowButton onClick={onStart}>{cur ? t("continue") : t("start")}</GlowButton>
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
    </div>
  );
}
