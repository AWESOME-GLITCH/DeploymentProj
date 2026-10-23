// Learning Path prototype: shared types.
// Contracts follow the PRD technical build specification (atom and item JSON,
// scheduler states, session phases, analytics events).

export type Strand = "GRM" | "RDG" | "WRT" | "LST" | "SPK" | "MED" | "INT";

export const STRANDS: Strand[] = ["GRM", "RDG", "WRT", "LST", "SPK", "MED", "INT"];

export type SubLevel =
  | "PreA1.1" | "PreA1.2"
  | "A1.1" | "A1.2"
  | "A2.1" | "A2.2"
  | "B1.1" | "B1.2"
  | "B2.1" | "B2.2"
  | "C1.1" | "C1.2"
  | "C2";

export const SUBLEVELS: SubLevel[] = [
  "PreA1.1", "PreA1.2", "A1.1", "A1.2", "A2.1", "A2.2", "B1.1", "B1.2", "B2.1", "B2.2", "C1.1", "C1.2", "C2",
];

export type L1 = "en" | "ar" | "hi" | "ru" | "es" | "tr" | "zh";

export type Modality = "recognition" | "cued" | "typed" | "spoken";

export type ItemType =
  | "tap_order" | "gap_fill" | "error_spot" | "transform"
  | "picture_match" | "tfng" | "heading_match" | "inference_mcq"
  | "sentence_build" | "short_production" | "correct_message"
  | "pick_picture" | "dictation" | "gist_mcq" | "detail_gap"
  | "shadow" | "read_aloud" | "picture_describe" | "open_response"
  | "relay" | "explain_chart" | "translate_gist"
  | "dialogue_turn" | "roleplay" | "say_it_see_it" | "time_slider" | "magnet_tiles"
  | "vote_see_revote" | "story";

export type Localised = Partial<Record<L1, string>> & { en: string };

export type Item = {
  item_id: string;
  criterion_id: string;
  strand: Strand;
  item_type: ItemType;
  /** The prompt the learner sees. Always short. */
  stem: Localised;
  /** Audio text to play before the stem is read (hear first, read second). */
  audio?: string;
  /** Options for choice and ordering items. */
  options?: string[];
  /** Keyed answer: index, string, or ordered tokens joined by a space. */
  key?: string | number;
  /** Emoji or short label pictures for picture items. */
  pictures?: { emoji: string; label: string }[];
  /** One-line why, shown after a wrong answer. */
  why: Localised;
  /** Which modality a correct answer counts as for the Known rule. */
  modality: Modality;
  /** Items that this item retrieves (chunks, patterns). Defaults to [item_id]. */
  retrieves?: string[];
  /** Activity-specific config. */
  config?: Record<string, unknown>;
};

export type PhaseKind = "input" | "noticing" | "controlled" | "free_use" | "check";

export type AtomPhase =
  | { kind: "input"; media: { kind: "video"; title: string; presenter: string; lines: { text: string; at: number; target?: boolean }[]; duration_sec: number; l1_card?: Localised } | { kind: "word_tutorial"; cards: { word: string; emoji: string; meaning: Localised; examples: string[] }[] } }
  | { kind: "noticing"; highlight: string; why: Localised }
  | { kind: "controlled"; items: string[] }
  | { kind: "free_use"; items: string[] }
  | { kind: "check"; items: string[]; delayed: true };

export type Atom = {
  atom_id: string;
  version: number;
  criterion_id: string;
  strand: Strand;
  sublevel: SubLevel;
  type: "video" | "word_tutorial" | "model" | "practice" | "story";
  variant: "dense" | "standard" | "light";
  language_use: boolean;
  title: Localised;
  target_items: string[];
  prerequisites: string[];
  phases: AtomPhase[];
  status: "published";
  /** Story atoms only: the text, in known words. */
  story?: { text: string; coverage: number };
};

export type Criterion = {
  criterion_id: string;
  outcome_id: string;
  strand: Strand;
  descriptor: Localised;
  type: "communicative" | "grammar" | "vocab" | "pronunciation";
  mastery_rule: "keyed" | "ai";
  prerequisites: string[];
};

export type Outcome = {
  outcome_id: string;
  strand: Strand;
  sublevel: SubLevel;
  can_do: Localised;
  icon: string;
  criteria: string[];
};

// Learner side

export type ItemState = "new" | "learning" | "consolidating" | "known" | "mastered";

export type ItemMastery = {
  item_id: string;
  state: ItemState;
  half_life_days: number;
  last_seen: number; // epoch ms, simulated clock
  correct: number;
  incorrect: number;
  consecutive_errors: number;
  reteach: boolean;
  /** Days of the correct retrievals (for "3 correct across 2 days"). */
  correct_days: number[];
  modality_mask: Modality[];
  provisional: boolean;
  /** Interval ladder position inside a state (consolidating 3 then 7 and so on). */
  rung: number;
};

export type CriterionMastery = {
  criterion_id: string;
  state: "unseen" | "learning" | "shaky" | "mastered" | "decayed";
  sittings: { day: number; correct: number; total: number; pass: boolean; task_id?: string }[];
  mastered_day?: number;
};

export type Attempt = {
  id: string;
  item_id: string;
  atom_id?: string;
  item_type: ItemType;
  modality: Modality;
  correct: boolean;
  score?: number;
  sub_scores?: Record<string, number>;
  ai_confidence?: number;
  scorer_version: string;
  response_ms: number;
  hint_used: boolean;
  attempt_n: number;
  transcript?: string;
  half_life_before: number;
  half_life_after: number;
  predicted_success: number;
  at: number;
  day: number;
};

export type AnalyticsEvent = { name: string; at: number; day: number; data?: Record<string, unknown> };

export type SessionPhase =
  | { kind: "plan"; can_do: Localised }
  | { kind: "recall"; items: string[] }
  | { kind: "atom"; atom_id: string; role: "new" | "use" | "fluency" | "warm_restart" }
  | { kind: "vote"; item_id: string }
  | { kind: "story"; atom_id: string }
  | { kind: "close"; check_items: string[]; can_do: Localised };

export type ComposedSession = {
  id: string;
  day: number;
  second: boolean;
  warm_restart: boolean;
  new_allowed: boolean;
  due_count: number;
  phases: SessionPhase[];
  reasons: string[];
};

export type SessionProgress = {
  session: ComposedSession;
  phase_index: number;
  /** Position inside the current phase (item index or atom phase index). */
  step: number;
  minutes: number;
  spoken: boolean;
  started_at: number;
  /** Items missed inside the current atom, returned once at the end. */
  retry_queue: string[];
  completed: boolean;
};

export type Learner = {
  onboarded: boolean;
  l1: L1;
  l1_override: "auto" | "full" | "english";
  why: "work" | "study" | "travel" | "family" | null;
  daily_minutes: 5 | 10 | 15;
  plan: { cue: string; time: string } | null;
  text_scale: 1 | 1.15 | 1.3;
  audio_speed: 0.75 | 1;
  reduce_motion: boolean;
  theme: "auto" | "light" | "dark";
  notifications: boolean;
  teen_mode: boolean;
  report_sharing: boolean;
  confirmed_sublevel: SubLevel | null;
  provisional_sublevel: SubLevel | null;
  strand_levels: Record<Strand, SubLevel> | null;
  placement_done: boolean;
  account: "deferred" | "created";
  name: string;
};

export type LearnerState = {
  version: 1;
  learner: Learner;
  /** Simulated clock: ms offset added to Date.now(). */
  clock_offset: number;
  install_day: number;
  items: Record<string, ItemMastery>;
  criteria: Record<string, CriterionMastery>;
  attempts: Attempt[];
  events: AnalyticsEvent[];
  sessions: { day: number; minutes: number; spoken: boolean; second: boolean; completed: boolean }[];
  week_can_do: string | null;
  week_start_day: number;
  current: SessionProgress | null;
  welcome_back_pending: number | null;
  story_unlocks: number;
  checkpoints: { day: number; before: SubLevel; after: SubLevel }[];
  reflections: { day: number; can: boolean }[];
  challenges: { day: number; with: string; mine: number; theirs: number }[];
};
