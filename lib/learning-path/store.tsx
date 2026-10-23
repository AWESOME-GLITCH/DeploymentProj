"use client";

// Learner state store: a reducer with localStorage persistence and a simulated
// clock so the tester can move days forward and watch the scheduler react.

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { Attempt, ComposedSession, L1, Learner, LearnerState, Modality, SessionProgress, Strand, SubLevel } from "./types";
import { STRANDS, SUBLEVELS } from "./types";
import { ATOM_BY_ID, CRITERION_BY_ID, ITEM_BY_ID, ITEMS } from "./content";
import { DAY_MS, applyAttempt, composeSession, dayIndex, freshMastery, now as engineNow, pickWeekCanDo, provisionalMastery, recallProbability, updateCriterion } from "./engine";

export const STORAGE_KEY = "learning-path.v1";

export function defaultLearner(): Learner {
  return {
    onboarded: false, l1: "en", l1_override: "auto", why: null, daily_minutes: 10, plan: null, text_scale: 1, audio_speed: 1,
    reduce_motion: false, theme: "auto", notifications: false, teen_mode: false, report_sharing: false, confirmed_sublevel: null,
    provisional_sublevel: null, strand_levels: null, placement_done: false, account: "deferred", name: "",
  };
}

export function initialState(): LearnerState {
  return {
    version: 1, learner: defaultLearner(), clock_offset: 0, install_day: Math.floor(Date.now() / DAY_MS), items: {}, criteria: {},
    attempts: [], events: [], sessions: [], week_can_do: null, week_start_day: 0, current: null, welcome_back_pending: null,
    story_unlocks: 0, checkpoints: [], reflections: [], challenges: [],
  };
}

export type Action =
  | { type: "hydrate"; state: LearnerState }
  | { type: "reset" }
  | { type: "learner"; patch: Partial<Learner> }
  | { type: "event"; name: string; data?: Record<string, unknown> }
  | { type: "placement_done"; sublevel: SubLevel }
  | { type: "start_session"; session: ComposedSession }
  | { type: "progress"; patch: Partial<SessionProgress> }
  | { type: "attempt"; item_id: string; atom_id?: string; correct: boolean; modality: Modality; response_ms: number; hint_used?: boolean; attempt_n: number; score?: number; sub_scores?: Record<string, number>; ai_confidence?: number; scorer_version: string; transcript?: string; task_id?: string; ai?: boolean }
  | { type: "complete_session" }
  | { type: "exit_session" }
  | { type: "reflection"; can: boolean }
  | { type: "story_done"; story_id: string; mode: string }
  | { type: "advance_days"; days: number }
  | { type: "checkpoint"; after: SubLevel }
  | { type: "challenge"; with: string; mine: number; theirs: number }
  | { type: "ensure_week" };

function withEvent(s: LearnerState, name: string, data?: Record<string, unknown>): LearnerState {
  const at = engineNow(s);
  return { ...s, events: [...s.events.slice(-299), { name, at, day: dayIndex(s, at), data }] };
}

export function reducer(s: LearnerState, a: Action): LearnerState {
  switch (a.type) {
    case "hydrate": return a.state;
    case "reset": return initialState();
    case "learner": return { ...s, learner: { ...s.learner, ...a.patch } };
    case "event": return withEvent(s, a.name, a.data);
    case "ensure_week": {
      const day = dayIndex(s);
      if (s.week_can_do && day - s.week_start_day < 7) return s;
      const next = { ...s, week_start_day: s.week_can_do ? s.week_start_day + Math.floor((day - s.week_start_day) / 7) * 7 : day };
      next.week_can_do = pickWeekCanDo(next);
      return withEvent(next, "week_plan_set", { outcome: next.week_can_do });
    }
    case "placement_done": {
      const at = engineNow(s);
      const idx = SUBLEVELS.indexOf(a.sublevel);
      const items = { ...s.items };
      // Items from criteria below the placed level are provisionally Known with a short half-life.
      for (const it of ITEMS) {
        const crit = CRITERION_BY_ID[it.criterion_id];
        if (!crit) continue;
        const lvl = SUBLEVELS.indexOf(crit.criterion_id.split("-")[1] as SubLevel);
        if (lvl >= 0 && lvl < idx && !items[it.item_id]) items[it.item_id] = provisionalMastery(it.item_id, at);
      }
      const strand_levels = Object.fromEntries(STRANDS.map((x) => [x, a.sublevel])) as Record<Strand, SubLevel>;
      const next: LearnerState = { ...s, items, learner: { ...s.learner, placement_done: true, provisional_sublevel: a.sublevel, confirmed_sublevel: a.sublevel, strand_levels }, week_start_day: dayIndex(s, at) };
      next.week_can_do = pickWeekCanDo(next);
      return withEvent(withEvent(next, "placement_completed", { sublevel: a.sublevel }), "path_regenerated", { source: "placement" });
    }
    case "start_session": {
      const at = engineNow(s);
      const current: SessionProgress = { session: a.session, phase_index: 0, step: 0, minutes: 0, spoken: false, started_at: at, retry_queue: [], completed: false };
      return withEvent({ ...s, current }, "session_started", { session_id: a.session.id, warm_restart: a.session.warm_restart, second: a.session.second });
    }
    case "progress": {
      if (!s.current) return s;
      return { ...s, current: { ...s.current, ...a.patch } };
    }
    case "attempt": {
      const at = engineNow(s);
      const day = dayIndex(s, at);
      const item = ITEM_BY_ID[a.item_id];
      const prev = s.items[a.item_id] ?? freshMastery(a.item_id, at - 1000);
      const predicted = s.items[a.item_id] ? recallProbability(prev, at) : 0.8;
      // Slow correct: response time above the learner's 80th percentile for this item type.
      const sameType = s.attempts.filter((x) => x.item_type === item?.item_type).map((x) => x.response_ms).sort((x, y) => x - y);
      const p80 = sameType.length >= 5 ? sameType[Math.floor(sameType.length * 0.8)] : Infinity;
      const slow = a.correct && a.response_ms > p80;
      const out = applyAttempt(prev, a.correct, a.modality, at, day, slow);
      const attempt: Attempt = {
        id: `ATT-${s.attempts.length + 1}`, item_id: a.item_id, atom_id: a.atom_id, item_type: item?.item_type ?? "gap_fill", modality: a.modality,
        correct: a.correct, score: a.score, sub_scores: a.sub_scores, ai_confidence: a.ai_confidence, scorer_version: a.scorer_version,
        response_ms: a.response_ms, hint_used: !!a.hint_used, attempt_n: a.attempt_n, transcript: a.transcript,
        half_life_before: prev.half_life_days, half_life_after: out.mastery.half_life_days, predicted_success: predicted, at, day,
      };
      let next: LearnerState = { ...s, items: { ...s.items, [a.item_id]: out.mastery }, attempts: [...s.attempts, attempt] };
      next = withEvent(next, "item_answered", { item_id: a.item_id, correct: a.correct, response_ms: a.response_ms, attempt_n: a.attempt_n, modality: a.modality });
      if (out.from !== out.to || attempt.half_life_before !== attempt.half_life_after) {
        next = withEvent(next, "item_state_changed", { item_id: a.item_id, from: out.from, to: out.to, half_life_before: +attempt.half_life_before.toFixed(2), half_life_after: +attempt.half_life_after.toFixed(2), predicted: +predicted.toFixed(2), actual: a.correct });
      }
      // Criterion mastery. AI-scored items record a sitting per attempt; keyed
      // criteria record a sitting from first attempts at the end of the session.
      if (item && a.ai && a.attempt_n === 1 && (a.ai_confidence ?? 1) >= 0.6) {
        const prevC = s.criteria[item.criterion_id];
        const c = updateCriterion(prevC, item.criterion_id, { day, correct: a.correct ? 1 : 0, total: 1, task_id: a.task_id ?? a.item_id, ai: true, score: a.score });
        next = { ...next, criteria: { ...next.criteria, [item.criterion_id]: c } };
        if (prevC?.state !== c.state) next = withEvent(next, "mastery_changed", { criterion_id: item.criterion_id, from: prevC?.state ?? "unseen", to: c.state });
      }
      if (next.current && a.modality === "spoken") next = { ...next, current: { ...next.current, spoken: true } };
      return next;
    }
    case "complete_session": {
      if (!s.current) return s;
      const at = engineNow(s);
      const day = dayIndex(s, at);
      const minutes = Math.max(1, Math.round((at - s.current.started_at) / 60000));
      let next: LearnerState = { ...s };
      // Keyed sittings from today's first attempts in this session.
      const todays = s.attempts.filter((x) => x.day === day && x.at >= s.current!.started_at && x.attempt_n === 1);
      const byCrit = new Map<string, { correct: number; total: number }>();
      for (const x of todays) {
        const item = ITEM_BY_ID[x.item_id];
        if (!item || CRITERION_BY_ID[item.criterion_id]?.mastery_rule !== "keyed") continue;
        if (["spoken"].includes(x.modality)) continue;
        const e = byCrit.get(item.criterion_id) ?? { correct: 0, total: 0 };
        e.total += 1; if (x.correct) e.correct += 1;
        byCrit.set(item.criterion_id, e);
      }
      const criteria = { ...s.criteria };
      byCrit.forEach((v, k) => {
        const prevC = criteria[k];
        const c = updateCriterion(prevC, k, { day, correct: v.correct, total: v.total });
        criteria[k] = c;
        if (prevC?.state !== c.state) next = withEvent(next, "mastery_changed", { criterion_id: k, from: prevC?.state ?? "unseen", to: c.state });
      });
      next = {
        ...next, criteria,
        sessions: [...s.sessions, { day, minutes, spoken: s.current.spoken, second: s.current.session.second, completed: true }],
        current: null,
        story_unlocks: s.current.session.warm_restart ? s.story_unlocks + 1 : s.story_unlocks,
      };
      return withEvent(next, "session_completed", { minutes, session_id: s.current.session.id });
    }
    case "exit_session": {
      if (!s.current) return s;
      const phase = s.current.session.phases[s.current.phase_index];
      return withEvent(s, "session_exited", { phase_kind: phase?.kind });
    }
    case "reflection": {
      const day = dayIndex(s);
      return withEvent({ ...s, reflections: [...s.reflections, { day, can: a.can }] }, "reflection_recorded", { can: a.can });
    }
    case "story_done": return withEvent(s, "story_completed", { story_id: a.story_id, mode: a.mode, coverage: 0.98 });
    case "advance_days": {
      const next = { ...s, clock_offset: s.clock_offset + a.days * DAY_MS, current: null };
      return withEvent(next, "clock_advanced", { days: a.days });
    }
    case "checkpoint": {
      const day = dayIndex(s);
      const before = s.learner.confirmed_sublevel ?? "A2.1";
      // The app never demotes on a lower checkpoint; it reweights instead.
      const after = SUBLEVELS.indexOf(a.after) > SUBLEVELS.indexOf(before) ? a.after : before;
      let next: LearnerState = { ...s, checkpoints: [...s.checkpoints, { day, before, after }], learner: { ...s.learner, confirmed_sublevel: after, provisional_sublevel: after } };
      next = withEvent(next, "checkpoint_completed", { sublevel_before: before, sublevel_after: after, aze_result: a.after });
      next.week_can_do = pickWeekCanDo(next);
      return withEvent(next, "path_regenerated", { source: "checkpoint" });
    }
    case "challenge": {
      const day = dayIndex(s);
      return withEvent({ ...s, challenges: [...s.challenges, { day, with: a.with, mine: a.mine, theirs: a.theirs }] }, "challenge_completed", { with: a.with, mine: a.mine, theirs: a.theirs });
    }
  }
}

type Ctx = { state: LearnerState; dispatch: (a: Action) => void; hydrated: boolean };
const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [hydrated, setHydrated] = useReducer(() => true, false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LearnerState;
        if (parsed && parsed.version === 1) dispatch({ type: "hydrate", state: { ...initialState(), ...parsed, learner: { ...defaultLearner(), ...parsed.learner } } });
      }
    } catch { /* storage unavailable: run in memory */ }
    setHydrated();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state, hydrated]);

  const value = useMemo(() => ({ state, dispatch, hydrated }), [state, hydrated]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore outside StoreProvider");
  return ctx;
}

export function useNow(): number {
  const { state } = useStore();
  return engineNow(state);
}

export { composeSession, ATOM_BY_ID };
export type { L1 };
