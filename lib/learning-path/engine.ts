// Learning engine: scheduler (half-life model), mastery updater and session
// composer, as pure functions over LearnerState. Follows the PRD rules:
// p = 2^(-elapsed/half_life), due at p <= 0.8, the New to Mastered ladder,
// error rules, two-modality Known rule, 25-item review cap, 3+ strands per
// session, no two consecutive items from one strand.

import {
  ATOM_BY_ID, CRITERION_BY_ID, ITEM_BY_ID, ITEMS, LEARNING_ATOMS, OUTCOMES, OUTCOME_BY_ID, STORIES, isRecallable,
} from "./content";
import type {
  Atom, ComposedSession, CriterionMastery, Item, ItemMastery, ItemState, LearnerState, Modality, SessionPhase, Strand, SubLevel,
} from "./types";
import { STRANDS, SUBLEVELS } from "./types";

export const DAY_MS = 86_400_000;

export const DEFAULT_HALF_LIFE: Record<ItemState, number[]> = {
  new: [0.1],
  learning: [1],
  consolidating: [3, 7],
  known: [14, 30],
  mastered: [60, 120],
};

export const STATE_ORDER: ItemState[] = ["new", "learning", "consolidating", "known", "mastered"];

export function now(state: LearnerState): number {
  return Date.now() + state.clock_offset;
}

export function dayIndex(state: LearnerState, at?: number): number {
  const t = at ?? now(state);
  return Math.floor(t / DAY_MS) - state.install_day;
}

export function recallProbability(m: ItemMastery, at: number): number {
  const elapsedDays = Math.max(0, at - m.last_seen) / DAY_MS;
  return Math.pow(2, -elapsedDays / Math.max(0.01, m.half_life_days));
}

export function isDue(m: ItemMastery, at: number): boolean {
  return recallProbability(m, at) <= 0.8;
}

export function nextReviewAt(m: ItemMastery): number {
  // p = 0.8 when elapsed = h * log2(1/0.8)
  return m.last_seen + m.half_life_days * Math.log2(1 / 0.8) * DAY_MS;
}

export function freshMastery(item_id: string, at: number): ItemMastery {
  return {
    item_id, state: "new", half_life_days: 0.1, last_seen: at, correct: 0, incorrect: 0, consecutive_errors: 0,
    reteach: false, correct_days: [], modality_mask: [], provisional: false, rung: 0,
  };
}

export function provisionalMastery(item_id: string, at: number): ItemMastery {
  // Placement marks items below the start level as provisionally Known with a
  // short half-life so the first weeks verify rather than teach.
  return { ...freshMastery(item_id, at), state: "known", half_life_days: 3, provisional: true, modality_mask: ["recognition"], rung: 0 };
}

const PRODUCTIVE: Modality[] = ["typed", "spoken"];

export type AttemptOutcome = {
  mastery: ItemMastery;
  requeue: boolean;
  from: ItemState;
  to: ItemState;
};

export function applyAttempt(
  prev: ItemMastery,
  correct: boolean,
  modality: Modality,
  at: number,
  day: number,
  slow: boolean,
): AttemptOutcome {
  const m: ItemMastery = { ...prev, correct_days: [...prev.correct_days], modality_mask: [...prev.modality_mask] };
  const from = m.state;
  const elapsedDays = (at - m.last_seen) / DAY_MS;
  let requeue = false;

  if (correct) {
    m.correct += 1;
    m.consecutive_errors = 0;
    if (!m.correct_days.includes(day)) m.correct_days.push(day);
    if (!m.modality_mask.includes(modality)) m.modality_mask.push(modality);
    const mult = slow ? 0.8 : modality === "spoken" ? 2.8 : modality === "typed" ? 2.4 : 2.0;
    m.half_life_days = Math.max(0.1, m.half_life_days * mult);

    if (!slow) {
      const twoModalities = m.modality_mask.length >= 2 && m.modality_mask.some((x) => PRODUCTIVE.includes(x));
      if (m.state === "new") {
        m.state = "learning"; m.rung = 0;
        m.half_life_days = Math.max(m.half_life_days, 1);
      } else if (m.state === "learning") {
        if (m.correct >= 3 && m.correct_days.length >= 2) {
          m.state = "consolidating"; m.rung = 0; m.half_life_days = Math.max(m.half_life_days, 3);
        }
      } else if (m.state === "consolidating") {
        if (elapsedDays >= 7 && twoModalities) {
          m.state = "known"; m.rung = 0; m.half_life_days = Math.max(m.half_life_days, 14);
        } else if (m.rung === 0 && elapsedDays >= 2.5) {
          m.rung = 1; m.half_life_days = Math.max(m.half_life_days, 7);
        }
      } else if (m.state === "known") {
        if (elapsedDays >= 30 && PRODUCTIVE.includes(modality)) {
          m.state = "mastered"; m.rung = 0; m.half_life_days = Math.max(m.half_life_days, 60);
        } else if (m.rung === 0 && elapsedDays >= 12) {
          m.rung = 1; m.half_life_days = Math.max(m.half_life_days, 30);
        }
      } else if (m.state === "mastered") {
        if (m.rung === 0 && elapsedDays >= 50) { m.rung = 1; m.half_life_days = Math.max(m.half_life_days, 120); }
      }
    }
  } else {
    m.incorrect += 1;
    m.consecutive_errors += 1;
    if (m.state === "new") {
      m.half_life_days = 0.1; requeue = true;
    } else if (m.state === "learning" || m.state === "consolidating") {
      m.half_life_days = Math.max(0.1, m.half_life_days * 0.5); requeue = true;
    } else {
      // Known or Mastered: drop to Consolidating, interval reset to 3 days, never to zero.
      m.state = "consolidating"; m.rung = 0; m.half_life_days = 3; requeue = true;
    }
    if (m.consecutive_errors >= 2) m.reteach = true;
  }
  m.last_seen = at;
  m.provisional = false;
  return { mastery: m, requeue, from, to: m.state };
}

/** Criterion-level mastery, from the keyed sittings or AI passes. */
export function updateCriterion(
  prev: CriterionMastery | undefined,
  criterion_id: string,
  sitting: { day: number; correct: number; total: number; task_id?: string; ai?: boolean; score?: number },
): CriterionMastery {
  const c: CriterionMastery = prev ? { ...prev, sittings: [...prev.sittings] } : { criterion_id, state: "unseen", sittings: [] };
  const rule = CRITERION_BY_ID[criterion_id]?.mastery_rule ?? "keyed";
  const pass = sitting.ai ? (sitting.score ?? 0) >= 0.7 : sitting.total >= 3 && sitting.correct / sitting.total >= 0.75;
  c.sittings.push({ day: sitting.day, correct: sitting.correct, total: sitting.total, pass, task_id: sitting.task_id });
  if (c.state === "unseen") c.state = "learning";
  const passes = c.sittings.filter((s) => s.pass);
  const days = new Set(passes.map((s) => s.day));
  if (rule === "keyed") {
    if (days.size >= 2 && c.state !== "mastered") { c.state = "mastered"; c.mastered_day = sitting.day; }
  } else {
    const tasks = new Set(passes.map((s) => s.task_id ?? "x"));
    if (days.size >= 2 && tasks.size >= 2 && c.state !== "mastered") { c.state = "mastered"; c.mastered_day = sitting.day; }
  }
  // Decay rule: two consecutive misses on a mastered criterion set it to shaky.
  if (c.state === "mastered" && c.sittings.length >= 2) {
    const last = c.sittings.slice(-2);
    if (last.every((s) => !s.pass) && last[0].day > (c.mastered_day ?? -1)) c.state = "shaky";
  }
  return c;
}

export function criterionItems(criterion_id: string): Item[] {
  return ITEMS.filter((i) => i.criterion_id === criterion_id && !["story", "vote_see_revote"].includes(i.item_type));
}

/** Mean item state of a criterion on a 0..4 scale (new..mastered). */
export function criterionLevel(state: LearnerState, criterion_id: string): number {
  const items = criterionItems(criterion_id);
  if (!items.length) return 0;
  const vals = items.map((i) => {
    const m = state.items[i.item_id];
    return m ? STATE_ORDER.indexOf(m.state) : 0;
  });
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function prerequisitesMet(state: LearnerState, prereqs: string[]): boolean {
  return prereqs.every((p) => state.criteria[p]?.state === "mastered" || criterionLevel(state, p) >= 2);
}

export function strandStrength(state: LearnerState, strand: Strand, at: number): number {
  const items = ITEMS.filter((i) => i.strand === strand && isRecallable(i));
  if (!items.length) return 0;
  const weights: Record<ItemState, number> = { new: 0.1, learning: 0.3, consolidating: 0.55, known: 0.8, mastered: 1 };
  const total = items.reduce((acc, i) => {
    const m = state.items[i.item_id];
    if (!m) return acc;
    return acc + weights[m.state] * (0.5 + 0.5 * recallProbability(m, at));
  }, 0);
  return total / items.length;
}

export function outcomeAchieved(state: LearnerState, outcome_id: string): boolean {
  const o = OUTCOME_BY_ID[outcome_id];
  return !!o && o.criteria.every((c) => state.criteria[c]?.state === "mastered");
}

export function outcomeProgress(state: LearnerState, outcome_id: string): number {
  const o = OUTCOME_BY_ID[outcome_id];
  if (!o) return 0;
  return o.criteria.reduce((a, c) => a + criterionLevel(state, c) / 4, 0) / o.criteria.length;
}

/** Fog of memory: 1 minus mean predicted recall of the stop's items. */
export function fogOpacity(state: LearnerState, outcome_id: string, at: number): number {
  const o = OUTCOME_BY_ID[outcome_id];
  if (!o) return 1;
  const items = o.criteria.flatMap(criterionItems);
  if (!items.length) return 1;
  const mean = items.reduce((a, i) => {
    const m = state.items[i.item_id];
    return a + (m ? recallProbability(m, at) * (m.state === "new" ? 0.3 : 1) : 0);
  }, 0) / items.length;
  return Math.min(1, Math.max(0, 1 - mean));
}

export function levelEstimate(state: LearnerState, at: number): SubLevel | null {
  const base = state.learner.confirmed_sublevel ?? state.learner.provisional_sublevel;
  if (!base) return null;
  const idx = SUBLEVELS.indexOf(base);
  const achieved = OUTCOMES.filter((o) => outcomeAchieved(state, o.outcome_id)).length;
  const strands = STRANDS.map((s) => strandStrength(state, s, at));
  // Sub-level provisional at 80% of outcomes achieved with no strand under 60%.
  if (achieved / OUTCOMES.length >= 0.8 && strands.every((s) => s >= 0.6)) return SUBLEVELS[Math.min(idx + 1, SUBLEVELS.length - 1)];
  return base;
}

export function provisionalCriteriaMet(state: LearnerState, at: number): boolean {
  const achieved = OUTCOMES.filter((o) => outcomeAchieved(state, o.outcome_id)).length;
  return achieved / OUTCOMES.length >= 0.8 && STRANDS.every((s) => strandStrength(state, s, at) >= 0.6);
}

export function checkpointAvailable(state: LearnerState, at: number): boolean {
  const day = dayIndex(state, at);
  const last = state.checkpoints[state.checkpoints.length - 1]?.day ?? -100;
  if (day - last < 7) return false;
  return day >= 28 || provisionalCriteriaMet(state, at);
}

// Session composer

function interleave<T>(items: T[], key: (t: T) => string): T[] {
  const out: T[] = [];
  const pool = [...items];
  while (pool.length) {
    const last = out[out.length - 1];
    let idx = pool.findIndex((p) => !last || key(p) !== key(last));
    if (idx < 0) idx = 0;
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

export function dueItems(state: LearnerState, at: number): ItemMastery[] {
  return Object.values(state.items)
    .filter((m) => ITEM_BY_ID[m.item_id] && isDue(m, at))
    .sort((a, b) => recallProbability(a, at) - recallProbability(b, at));
}

function pickRecall(state: LearnerState, at: number, count: number): string[] {
  const due = dueItems(state, at).filter((m) => isRecallable(ITEM_BY_ID[m.item_id]));
  // Prioritise last seen between 1 and 6 days ago.
  const score = (m: ItemMastery) => {
    const d = (at - m.last_seen) / DAY_MS;
    return (d >= 1 && d <= 6 ? 0 : 1) + recallProbability(m, at);
  };
  const sorted = [...due].sort((a, b) => score(a) - score(b));
  // Spread across at least three strands where possible.
  const byStrand = new Map<Strand, ItemMastery[]>();
  for (const m of sorted) {
    const s = ITEM_BY_ID[m.item_id].strand;
    byStrand.set(s, [...(byStrand.get(s) ?? []), m]);
  }
  const picked: ItemMastery[] = [];
  const strandsSorted = [...byStrand.keys()];
  let round = 0;
  while (picked.length < count && round < 10) {
    let added = false;
    for (const s of strandsSorted) {
      const list = byStrand.get(s)!;
      if (list[round]) { picked.push(list[round]); added = true; }
      if (picked.length >= count) break;
    }
    if (!added) break;
    round += 1;
  }
  return interleave(picked, (m) => ITEM_BY_ID[m.item_id].strand).map((m) => m.item_id);
}

export function weekDay(state: LearnerState, day: number): number {
  return ((day - state.week_start_day) % 7 + 7) % 7 + 1;
}

export function pickWeekCanDo(state: LearnerState): string {
  const level = state.learner.confirmed_sublevel ?? state.learner.provisional_sublevel ?? "A2.1";
  const candidates = OUTCOMES.filter((o) => !outcomeAchieved(state, o.outcome_id))
    .filter((o) => o.criteria.every((c) => prerequisitesMet(state, CRITERION_BY_ID[c]?.prerequisites ?? [])))
    .sort((a, b) => {
      const la = a.sublevel === level ? 0 : 1;
      const lb = b.sublevel === level ? 0 : 1;
      if (la !== lb) return la - lb;
      return outcomeProgress(state, a.outcome_id) - outcomeProgress(state, b.outcome_id);
    });
  return candidates[0]?.outcome_id ?? OUTCOMES[0].outcome_id;
}

export function rollingCheckAccuracy(state: LearnerState): number | null {
  const recent = state.attempts.filter((a) => a.attempt_n === 1 && a.modality !== "spoken").slice(-20);
  if (recent.length < 5) return null;
  return recent.filter((a) => a.correct).length / recent.length;
}

export function pickVariant(state: LearnerState): Atom["variant"] {
  const acc = rollingCheckAccuracy(state);
  if (acc === null) return "standard";
  if (acc < 0.7) return "light";
  if (acc > 0.9) return "dense";
  return "standard";
}

type Scored = { atom: Atom; score: number; why: string };

export function scoreNewAtoms(state: LearnerState, at: number, day: number): Scored[] {
  const week = state.week_can_do ? OUTCOME_BY_ID[state.week_can_do] : null;
  const wd = weekDay(state, day);
  const weekMinutes = state.sessions.filter((s) => s.day >= state.week_start_day).reduce((a, s) => a + s.minutes, 0) || 1;
  const strandMinutes = (s: Strand) =>
    state.attempts.filter((a) => a.day >= state.week_start_day && ITEM_BY_ID[a.item_id]?.strand === s).length * 0.5;
  const quota = Math.max(1, weekMinutes / 7);
  return LEARNING_ATOMS
    .filter((a) => state.criteria[a.criterion_id]?.state !== "mastered")
    .filter((a) => prerequisitesMet(state, a.prerequisites))
    .map((a) => {
      const prereqReady = a.prerequisites.length
        ? a.prerequisites.filter((p) => criterionLevel(state, p) >= 3 || state.criteria[p]?.state === "mastered").length / a.prerequisites.length
        : 1;
      const deficit = Math.min(1, Math.max(0, (quota - strandMinutes(a.strand)) / quota));
      const targets = a.target_items.map((id) => state.items[id]).filter(Boolean) as ItemMastery[];
      const predicted = targets.length ? targets.reduce((x, m) => x + recallProbability(m, at), 0) / targets.length : 0.8;
      let score = 0.4 * prereqReady + 0.3 * deficit + 0.3 * (1 - Math.abs(predicted - 0.8));
      const parts = [`readiness ${prereqReady.toFixed(2)}`, `strand deficit ${deficit.toFixed(2)}`, `predicted success ${predicted.toFixed(2)}`];
      if (week && week.criteria.includes(a.criterion_id) && wd <= 3) { score += 0.25; parts.push("week can-do bonus"); }
      const done = state.attempts.some((x) => x.atom_id === a.atom_id);
      if (done && !targets.some((m) => m.reteach)) { score -= 0.5; parts.push("already served"); }
      if (targets.some((m) => m.reteach)) { score += 0.3; parts.push("re-teach flagged"); }
      // Ties go to the weaker strand.
      score += (1 - strandStrength(state, a.strand, at)) * 0.01;
      return { atom: a, score, why: parts.join(", ") };
    })
    .sort((a, b) => b.score - a.score);
}

const USE_TYPES = new Set(["say_it_see_it", "roleplay", "open_response", "relay"]);

export function composeSession(state: LearnerState, at: number, opts: { second?: boolean; first_run?: boolean } = {}): ComposedSession {
  const day = dayIndex(state, at);
  const reasons: string[] = [];
  const due = dueItems(state, at);
  // Provisional items from placement are verification, not backlog: they do not count towards the 25-review cap.
  const overdue = due.filter((m) => !m.provisional).length;
  const new_allowed = overdue <= 25;
  if (!new_allowed) reasons.push(`${overdue} reviews overdue (over 25), so new content pauses`);
  const weekOutcome = state.week_can_do ? OUTCOME_BY_ID[state.week_can_do] : OUTCOMES[0];
  const can_do = weekOutcome.can_do;
  const phases: SessionPhase[] = [];
  const lastSessionDay = state.sessions.filter((s) => s.completed).map((s) => s.day).sort((a, b) => b - a)[0];
  const missed = lastSessionDay === undefined ? 0 : day - lastSessionDay - 1;
  const warm_restart = !opts.first_run && !opts.second && missed >= 2;

  if (opts.first_run) {
    // Install to first atom: a light input plus three checks, then the reward.
    const first = scoreNewAtoms(state, at, day)[0]?.atom ?? LEARNING_ATOMS[0];
    reasons.push(`first atom ${first.atom_id}: ${scoreNewAtoms(state, at, day)[0]?.why ?? "default"}`);
    phases.push({ kind: "atom", atom_id: first.atom_id, role: "new" });
    const check = first.phases.find((p) => p.kind === "check");
    phases.push({ kind: "close", check_items: check && check.kind === "check" ? check.items : [], can_do });
    return { id: `S-${day}-first`, day, second: false, warm_restart: false, new_allowed, due_count: due.length, phases, reasons };
  }

  // The lesson opens on the scene, never on a plan screen: Home already carries
  // the can-do and the Continue that got the learner here (docs/lesson-flow.md).
  const recall = pickRecall(state, at, warm_restart ? 10 : 8);
  const recallPhase: SessionPhase | null = recall.length ? { kind: "recall", items: recall } : null;
  if (recallPhase) reasons.push(`recall echo: ${recall.length} due items across ${new Set(recall.map((i) => ITEM_BY_ID[i].strand)).size} strands`);
  else reasons.push("recall echo: nothing due yet");

  if (warm_restart) {
    // Welcome back opens on the story, which is the scene here, so the way back
    // in is something to read and enjoy, never a quiz on what was forgotten.
    reasons.push(`${missed} days missed: warm restart (a story, then the review), welcome-back story unlock`);
    const story = pickStory(state);
    if (story) phases.push({ kind: "story", atom_id: story.atom_id });
    if (recallPhase) phases.push(recallPhase);
    phases.push({ kind: "close", check_items: [], can_do });
    return { id: `S-${day}-warm`, day, second: false, warm_restart: true, new_allowed, due_count: due.length, phases, reasons };
  }

  if (opts.second) {
    // The second session has no new atom, so its scene is the use task: the
    // learner speaks first, then the older material comes back.
    reasons.push("second session: a use task first, then review and fluency, no new atom");
    const useItem = pickUseItem(state, at, null);
    if (useItem) phases.push({ kind: "atom", atom_id: `USE:${useItem}`, role: "use" });
    if (recallPhase) phases.push(recallPhase);
    phases.push({ kind: "atom", atom_id: "ATM-A2-FLU-0001", role: "fluency" });
    phases.push({ kind: "close", check_items: [], can_do });
    return { id: `S-${day}-second`, day, second: true, warm_restart: false, new_allowed, due_count: due.length, phases, reasons };
  }

  const wd = weekDay(state, day);
  let newAtom: Atom | null = null;
  const alreadyNewToday = state.sessions.some((s) => s.day === day && !s.second && s.completed);
  if (new_allowed && !alreadyNewToday) {
    const scored = scoreNewAtoms(state, at, day);
    if (scored[0]) { newAtom = scored[0].atom; reasons.push(`new atom ${newAtom.atom_id} (score ${scored[0].score.toFixed(2)}: ${scored[0].why}); variant ${pickVariant(state)}`); }
  }
  if (newAtom) phases.push({ kind: "atom", atom_id: newAtom.atom_id, role: "new" });

  // Use atom: speaking or interaction with today's targets plus due free-use items.
  if (wd === 5) {
    phases.push({ kind: "atom", atom_id: "ATM-A2-INT-0011", role: "use" });
    reasons.push("day 5: teach it back as the week's free-use performance");
  } else {
    const useItem = pickUseItem(state, at, newAtom);
    if (useItem) { phases.push({ kind: "atom", atom_id: `USE:${useItem}`, role: "use" }); reasons.push(`use atom: ${useItem}`); }
  }
  // Come back later: older material is retrieved once today's sentence has
  // landed, so the two do not compete for attention (spacing).
  if (recallPhase) phases.push(recallPhase);
  if (wd === 4) { phases.push({ kind: "vote", item_id: "ITM-VOTE-0001" }); reasons.push("day 4: vote, see, revote"); }

  const story = pickStory(state);
  if (story) { phases.push({ kind: "story", atom_id: story.atom_id }); reasons.push(`story ${story.atom_id} at ${(story.story?.coverage ?? 0.98) * 100}% known words`); }

  const check = newAtom?.phases.find((p) => p.kind === "check");
  phases.push({ kind: "close", check_items: check && check.kind === "check" ? check.items : [], can_do });
  return { id: `S-${day}`, day, second: false, warm_restart: false, new_allowed, due_count: due.length, phases, reasons };
}

function pickUseItem(state: LearnerState, at: number, newAtom: Atom | null): string | null {
  // A speaking or interaction task from an atom already seen (not today's new
  // atom), the least-recalled first. If nothing has been seen yet, any eligible
  // free-use task whose criterion prerequisites are met, so the session always
  // has a production phase.
  const seenAtoms = new Set(state.attempts.map((a) => a.atom_id));
  const eligible = ITEMS.filter((i) => USE_TYPES.has(i.item_type) && i.item_id !== "ITM-TEACH-0001")
    .map((i) => ({ item: i, atom: LEARNING_ATOMS.find((a) => a.target_items.includes(i.item_id)) }))
    .filter((x) => x.atom && x.atom.atom_id !== newAtom?.atom_id && prerequisitesMet(state, x.atom.prerequisites));
  const byRecall = (a: { item: Item }, b: { item: Item }) => {
    const pa = state.items[a.item.item_id] ? recallProbability(state.items[a.item.item_id], at) : 0.5;
    const pb = state.items[b.item.item_id] ? recallProbability(state.items[b.item.item_id], at) : 0.5;
    return pa - pb;
  };
  const seen = eligible.filter((x) => seenAtoms.has(x.atom!.atom_id)).sort(byRecall);
  if (seen[0]) return seen[0].item.item_id;
  const unseen = eligible.filter((x) => x.item.item_type === "say_it_see_it" || x.item.item_type === "open_response").sort(byRecall);
  return unseen[0]?.item.item_id ?? null;
}

export function pickStory(state: LearnerState): Atom | null {
  const read = new Set(state.events.filter((e) => e.name === "story_completed").map((e) => String(e.data?.story_id)));
  const unread = STORIES.filter((s) => !read.has(s.atom_id));
  return (unread[0] ?? STORIES[state.sessions.length % STORIES.length]) ?? null;
}

/** Items the learner should "try to use" in a free-use task: due items eligible for free-use retrieval. */
export function tryToUse(state: LearnerState, at: number, exclude: string[]): string[] {
  return dueItems(state, at)
    .filter((m) => !exclude.includes(m.item_id) && ["consolidating", "known", "mastered"].includes(m.state))
    .slice(0, 3)
    .map((m) => m.item_id);
}

export function sessionMinutes(session: ComposedSession): number {
  return session.phases.reduce((a, p) => a + phaseMinutes(p), 0);
}

export function phaseMinutes(p: SessionPhase): number {
  switch (p.kind) {
    case "plan": return 0.33;
    case "recall": return Math.min(2, p.items.length * 0.25);
    case "atom": return p.role === "new" ? 4 : p.role === "fluency" ? 1.5 : 3;
    case "vote": return 1;
    case "story": return 1.5;
    case "close": return 0.5;
  }
}

/** Slot of the daily ring (0, 1, 2) a phase fills. */
export function ringSlice(p: SessionPhase): 0 | 1 | 2 {
  if (p.kind === "plan" || (p.kind === "atom" && p.role === "new")) return 0;
  if (p.kind === "atom" || p.kind === "recall" || p.kind === "vote") return 1;
  return 2;
}

export const ATOM_LOOKUP = ATOM_BY_ID;
