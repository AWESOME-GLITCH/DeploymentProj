// Speaking Assessment: the shared brain behind the voice portal.
// Question bank, guardrails and the transcript signal pass all live here so the
// exact same rules run in the browser (instant, before anything is spoken back)
// and again on the server (so a hand-crafted API call can't skip them).

import { PRODUCTS } from "./knowledge";

export type Level = "A2" | "B1" | "B2" | "C1";
export type Confidence = "high" | "medium" | "low";

/* ------------------------------------------------------------------ *
 * Question bank
 * ------------------------------------------------------------------ */

export type Part = {
  id: string;
  label: string;
  focus: string;
  /** What the examiner says out loud. */
  prompt: string;
  /** Shown on screen so a nervous student can read along. */
  hint: string;
  /** Answers shorter than this are treated as under-length, not scored down. */
  minWords: number;
};

export const PARTS: Part[] = [
  {
    id: "intro",
    label: "Part 1",
    focus: "Introduction and everyday fluency",
    prompt:
      "Welcome to your speaking assessment. There are four parts and it takes about ten minutes. Let us start. Please introduce yourself, and tell me what you want to achieve with your English this year.",
    hint: "Say who you are, what you do, and one clear goal for your English.",
    minWords: 25,
  },
  {
    id: "describe",
    label: "Part 2",
    focus: "Description and comparison",
    prompt:
      "Thank you. For the second part, describe a place where you like to spend time. Say what it looks like, why you go there, and how it compares to other places you know.",
    hint: "Describe it, give a reason, then compare it with somewhere else.",
    minWords: 40,
  },
  {
    id: "problem",
    label: "Part 3",
    focus: "Handling problems and past events",
    prompt:
      "Good. Now think about a time when a plan changed at the last minute, at work, at school, or in your own life. Tell me what happened, what you did, and what you would do differently now.",
    hint: "Use past tenses. Then say what you would do differently.",
    minWords: 45,
  },
  {
    id: "opinion",
    label: "Part 4",
    focus: "Opinion and abstract language",
    prompt:
      "Last question. Some people say that in ten years most people will learn languages from an app instead of a teacher. Do you agree? Give your opinion and explain your reasons.",
    hint: "Give a clear opinion, two reasons, and one counter-argument.",
    minWords: 45,
  },
];

/* ------------------------------------------------------------------ *
 * Guardrails
 * ------------------------------------------------------------------ */

export type GuardrailCategory =
  | "injection"
  | "cheating"
  | "abuse"
  | "personal_data"
  | "safeguarding";

export type GuardrailRule = {
  id: string;
  category: GuardrailCategory;
  pattern: RegExp;
  /** Shown to the student as the reason the turn was held back. */
  reason: string;
};

/**
 * Patterns are deliberately narrow. This runs on speech-to-text from language
 * learners, so a broad keyword list would fire on ordinary exam answers
 * ("I hate my commute", "my old job killed my weekends"). A false block costs a
 * student their exam turn, so each rule needs the intent in the wording, not
 * just the topic.
 */
export const GUARDRAIL_RULES: GuardrailRule[] = [
  {
    id: "inj-override",
    category: "injection",
    pattern: /\bignore\s+(?:all\s+|any\s+|your\s+|the\s+)?(?:previous|prior|above|earlier)\s+(?:instructions?|prompts?|rules?)\b/i,
    reason: "Prompt injection blocked, an attempt to override the exam instructions",
  },
  {
    id: "inj-system",
    category: "injection",
    pattern: /\b(?:system|developer)\s+(?:override|prompt|instructions?|mode)\b/i,
    reason: "Prompt injection blocked, an attempt to address the system layer",
  },
  {
    id: "inj-persona",
    category: "injection",
    pattern: /\b(?:you\s+are\s+now|act\s+as|pretend\s+to\s+be)\s+(?:a\s+|an\s+)?(?:dan\b|unrestricted|jailbroken|different\s+(?:ai|assistant|examiner))/i,
    reason: "Prompt injection blocked, an attempt to change the examiner's role",
  },
  {
    id: "inj-reveal",
    category: "injection",
    pattern: /\b(?:reveal|show|repeat|print)\s+(?:me\s+)?(?:your|the)\s+(?:system\s+)?(?:prompt|instructions?|rules?)\b/i,
    reason: "Prompt injection blocked, a request for the examiner's instructions",
  },
  {
    id: "cheat-answer",
    category: "cheating",
    pattern: /\b(?:give|tell|write)\s+me\s+(?:the\s+)?(?:answers?|the\s+model\s+answer|what\s+to\s+say)\b/i,
    reason: "Assessment integrity, the examiner cannot answer for the candidate",
  },
  {
    id: "cheat-score",
    category: "cheating",
    pattern: /\b(?:give|mark|score)\s+me\s+(?:a\s+|an\s+)?(?:nine|9|eight|8|full\s+marks|top\s+score|c2|the\s+highest)\b/i,
    reason: "Assessment integrity, the band is earned, not requested",
  },
  {
    id: "abuse-directed",
    category: "abuse",
    pattern: /\b(?:fuck\s+you|shut\s+up|you(?:'re|\s+are)\s+(?:stupid|an\s+idiot|useless|worthless))\b/i,
    reason: "Respectful conduct, abuse directed at the examiner",
  },
  {
    id: "abuse-hate",
    category: "abuse",
    pattern: /\b(?:all|those)\s+(?:\w+\s+){0,2}(?:people|immigrants|foreigners)\s+(?:are|should)\s+(?:be\s+)?(?:banned|deported|killed|inferior)\b/i,
    reason: "Content policy, speech targeting a group",
  },
  {
    id: "pii-card",
    category: "personal_data",
    pattern: /\b(?:\d[ -]?){13,19}\b|\b(?:credit\s+card|passport|emirates\s+id|national\s+insurance)\s+number\b/i,
    reason: "Personal data filtered, this is not stored with your answer",
  },
  {
    id: "safeguard-self-harm",
    category: "safeguarding",
    pattern: /\b(?:kill\s+myself|end\s+my\s+life|want\s+to\s+die|hurt\s+myself)\b/i,
    reason: "Safeguarding, the assessment was paused",
  },
];

const REPLIES: Record<GuardrailCategory, string> = {
  injection:
    "That is a security check, not a language one. I cannot change how this exam is marked. Let us go back to the question.",
  cheating:
    "I cannot answer for you, and the band comes from what you say. Take a moment, then answer in your own words.",
  abuse:
    "Let us keep this respectful and professional. I will ask the question again, and only your answer is marked.",
  personal_data:
    "Please do not read out card, passport or ID numbers. I have removed that from your transcript. Now, back to the question.",
  safeguarding:
    "Thank you for telling me. I am stopping the assessment here, because a person should hear this, not a computer. Please talk to someone you trust, or to your ES World student support team, who can help you find local support today.",
};

export type GuardrailVerdict = {
  safe: boolean;
  ruleId?: string;
  category?: GuardrailCategory;
  reason?: string;
  /** What the examiner says out loud instead of marking the turn. */
  reply?: string;
  /** Safeguarding ends the exam rather than re-asking the question. */
  halt?: boolean;
  /** The turn with any matched personal data masked, safe to store and show. */
  redacted?: string;
};

/** Masks long digit runs so a spoken card or ID number never reaches storage. */
export function redact(text: string): string {
  return text.replace(/\b(?:\d[ -]?){13,19}\b/g, "[number removed]");
}

export function checkGuardrails(text: string): GuardrailVerdict {
  const input = (text || "").trim();
  if (!input) return { safe: true, redacted: "" };
  for (const rule of GUARDRAIL_RULES) {
    if (!rule.pattern.test(input)) continue;
    return {
      safe: false,
      ruleId: rule.id,
      category: rule.category,
      reason: rule.reason,
      reply: REPLIES[rule.category],
      halt: rule.category === "safeguarding",
      redacted: redact(input),
    };
  }
  return { safe: true, redacted: redact(input) };
}

/** A blocked turn, kept for the report so the school can audit what happened. */
export type GuardrailEvent = {
  partId: string;
  category: GuardrailCategory;
  reason: string;
  at: string;
};

/* ------------------------------------------------------------------ *
 * Transcript signals (measured, not guessed)
 * ------------------------------------------------------------------ */

export type Turn = {
  partId: string;
  text: string;
  /** Seconds of speech. 0 for a typed answer, which has no pace to measure. */
  seconds: number;
  /** Typed on the keyboard instead of spoken (no mic, or an unsupported browser). */
  typed?: boolean;
};

export type Signals = {
  answers: number;
  totalWords: number;
  avgWordsPerAnswer: number;
  /**
   * Moving-average type-token ratio over 50-word windows. Plain type-token
   * ratio falls as a sample grows, so it would quietly reward the candidate
   * who said least. MATTR is comparable across answer lengths.
   */
  lexicalVariety: number;
  /** Words per minute across the whole exam, a fluency proxy. */
  wordsPerMinute: number;
  fillerRate: number;
  linkerCount: number;
  shortAnswers: number;
  typedAnswers: number;
};

const FILLERS = ["um", "uh", "erm", "ah", "eh", "like", "yeah", "hmm", "mmm", "er"];
const LINKERS = [
  "because", "however", "although", "therefore", "whereas", "moreover",
  "furthermore", "for example", "for instance", "on the other hand",
  "in addition", "as a result", "even though", "in my opinion", "that is why",
];

function words(text: string): string[] {
  return (text.toLowerCase().match(/[a-z']+/g) || []).filter(Boolean);
}

/** Moving-average type-token ratio. Falls back to plain TTR under one window. */
function mattr(all: string[], window = 50): number {
  if (all.length === 0) return 0;
  if (all.length <= window) return new Set(all).size / all.length;
  let total = 0;
  let windows = 0;
  for (let i = 0; i + window <= all.length; i++) {
    total += new Set(all.slice(i, i + window)).size / window;
    windows++;
  }
  return total / windows;
}

export function analyseTranscript(turns: Turn[]): Signals {
  const scored = turns.filter((t) => t.text.trim().length > 0);
  const all = scored.flatMap((t) => words(t.text));
  const joined = scored.map((t) => t.text.toLowerCase()).join(" ");
  // Pace is measured from spoken turns only. A typed answer has no pace, and
  // guessing one would put an invented number in front of the criterion.
  const spoken = scored.filter((t) => !t.typed);
  const spokenWords = spoken.flatMap((t) => words(t.text)).length;
  const seconds = spoken.reduce((s, t) => s + (t.seconds || 0), 0);
  const fillers = all.filter((w) => FILLERS.includes(w)).length;
  const linkers = LINKERS.reduce(
    (n, l) => n + (joined.match(new RegExp(`\\b${l}\\b`, "g")) || []).length,
    0
  );
  const byPart = new Map(PARTS.map((p) => [p.id, p.minWords]));
  const short = scored.filter((t) => words(t.text).length < (byPart.get(t.partId) ?? 25)).length;

  return {
    answers: scored.length,
    totalWords: all.length,
    avgWordsPerAnswer: scored.length ? Math.round(all.length / scored.length) : 0,
    lexicalVariety: Number(mattr(all).toFixed(2)),
    wordsPerMinute: seconds > 5 ? Math.round((spokenWords / seconds) * 60) : 0,
    fillerRate: all.length ? Number((fillers / all.length).toFixed(3)) : 0,
    linkerCount: linkers,
    shortAnswers: short,
    typedAnswers: scored.filter((t) => t.typed).length,
  };
}

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */

export type CriterionScore = {
  name: string;
  score: number; // 0-10
  evidence: string;
  nextStep: string;
  confidence: Confidence;
};

export type Report = {
  overallBand: Level;
  overallScore: number; // 0-10
  ieltsEstimate: string;
  confidence: Confidence;
  summary: string;
  criteria: CriterionScore[];
  strengths: string[];
  improvements: string[];
  vocabularyUpgrades: { said: string; better: string }[];
  recommendedCourse: { name: string; why: string };
  caveats: string[];
};

export const CRITERIA = [
  "Fluency and coherence",
  "Vocabulary range",
  "Grammar range and accuracy",
  "Task response",
] as const;

/**
 * Pronunciation is deliberately absent. The portal marks a speech-to-text
 * transcript, and a transcript carries no accent, stress or intonation. Scoring
 * it would be inventing evidence, so the report says so in `caveats` instead.
 */
export const HONESTY_CAVEATS = [
  "Marked from a speech-to-text transcript, so pronunciation, stress and intonation are not scored.",
  "Speech recognition can mishear accented or fast speech, which can look like a grammar error.",
  "An indicative band for placement and practice. It is not an official IELTS or CEFR certificate.",
];

const COURSE_BY_BAND: Record<Level, { id: string; why: string }> = {
  A2: {
    id: "dxb-general",
    why: "Build the core grammar and everyday vocabulary first, then move to a speaking-only class.",
  },
  B1: {
    id: "dxb-speaking",
    why: "You have the words. This small-group class is the practice hours that turn them into fluency.",
  },
  B2: {
    id: "dxb-flex",
    why: "Discussion-led evening lessons stretch you into debate, pitching and longer turns.",
  },
  C1: {
    id: "dxb-ielts",
    why: "Your level is strong. The next win is exam technique and a certified score.",
  },
};

function courseFor(band: Level) {
  const pick = COURSE_BY_BAND[band];
  const product = PRODUCTS.find((p) => p.id === pick.id);
  return { name: product?.name || "Speaking Class (English for All)", why: pick.why };
}

const IELTS_BY_BAND: Record<Level, string> = {
  A2: "Around IELTS 3.5–4.5",
  B1: "Around IELTS 4.5–5.5",
  B2: "Around IELTS 5.5–6.5",
  C1: "Around IELTS 7.0+",
};

export function bandFromScore(score: number): Level {
  if (score >= 8) return "C1";
  if (score >= 6.5) return "B2";
  if (score >= 5) return "B1";
  return "A2";
}

/**
 * The offline examiner. Used in demo mode (no API key) and as the fallback when
 * the live agent errors, so the portal always returns a defensible report built
 * from measured signals rather than a blank screen.
 */
export function heuristicReport(turns: Turn[], s: Signals): Report {
  const clamp = (n: number) => Math.max(1, Math.min(10, Number(n.toFixed(1))));

  // Each sub-score is a transparent function of a measured signal.
  // With no timed speech (all answers typed) there is no pace to score, so
  // fluency leans on answer length instead and says so in its evidence line.
  const paceScore = s.wordsPerMinute ? Math.min(4, s.wordsPerMinute / 35) : Math.min(4, s.avgWordsPerAnswer / 18);
  const fluency = clamp(3 + paceScore + Math.min(2, s.linkerCount / 4) - s.fillerRate * 20);
  // Calibrated against MATTR bands seen in learner speech: about 0.65 in a 50
  // word window at A2, about 0.80 at C1. Below 120 words there is not enough
  // speech to judge range, so the score is pulled back towards the middle.
  // Capped at 9 for the same reason as task response: variety says the words
  // were different, not that they were the right words, used correctly.
  const vocabRaw = Math.min(9, 2 + ((s.lexicalVariety - 0.55) / 0.3) * 8);
  const vocab = clamp(s.totalWords < 120 ? Math.min(vocabRaw, 6.5) : vocabRaw);
  const grammar = clamp(3 + Math.min(3.5, s.avgWordsPerAnswer / 20) + Math.min(1.5, s.linkerCount / 6));
  // Capped at 9: an offline pass can see that an answer was given at length,
  // not that it actually answered the question. Top marks need a real examiner.
  const task = clamp(Math.min(9, 9.5 - s.shortAnswers * 2 - (PARTS.length - s.answers) * 2.5));

  const overall = Number(((fluency + vocab + grammar + task) / 4).toFixed(1));
  const band = bandFromScore(overall);
  const thin = s.totalWords < 120;

  return {
    overallBand: band,
    overallScore: overall,
    ieltsEstimate: IELTS_BY_BAND[band],
    confidence: thin ? "low" : s.answers < PARTS.length ? "medium" : "high",
    summary: thin
      ? `There is not much speech to mark, ${s.totalWords} words in total. Retake the assessment and speak for longer on each question so the band means something.`
      : `You answered ${s.answers} of ${PARTS.length} parts, ${s.totalWords} words${s.wordsPerMinute ? ` at about ${s.wordsPerMinute} words per minute` : ""}. That puts you around ${band} for speaking.`,
    criteria: [
      {
        name: "Fluency and coherence",
        score: fluency,
        evidence: s.wordsPerMinute
          ? `About ${s.wordsPerMinute} words per minute, ${s.linkerCount} linking phrases, fillers at ${(s.fillerRate * 100).toFixed(1)}% of words.`
          : `No spoken timing to measure, so this reads answer length and ${s.linkerCount} linking phrases instead.`,
        nextStep: "Record a two minute answer each day and cut one filler word at a time.",
        confidence: s.wordsPerMinute ? "medium" : "low",
      },
      {
        name: "Vocabulary range",
        score: vocab,
        evidence: `In every 50 words you spoke, about ${Math.round(s.lexicalVariety * 100)}% were different words, across ${s.totalWords} words in total.`,
        nextStep: "Learn five topic phrases a week and use each one in a spoken answer.",
        confidence: thin ? "low" : "medium",
      },
      {
        name: "Grammar range and accuracy",
        score: grammar,
        evidence: `Answers averaged ${s.avgWordsPerAnswer} words, which is the room you gave yourself for longer structures.`,
        nextStep: "Practise one past tense and one conditional in every answer.",
        confidence: "low",
      },
      {
        name: "Task response",
        score: task,
        evidence: `${s.answers} of ${PARTS.length} parts answered, ${s.shortAnswers} under the suggested length.`,
        nextStep: "Answer in three moves: point, reason, example.",
        // Length is measurable offline. Whether the answer was on topic is not.
        confidence: "medium",
      },
    ],
    strengths: thin
      ? ["You started the assessment and the recording worked."]
      : [
          s.linkerCount >= 4
            ? "You linked ideas with phrases like because, however and for example."
            : "You kept going without long pauses.",
          s.answers === PARTS.length ? "You completed every part of the exam." : "You gave a real answer to each question you reached.",
        ],
    improvements: [
      s.shortAnswers > 0 ? "Extend your short answers, aim for 40 to 60 words." : "Push into longer, more detailed turns.",
      s.fillerRate > 0.04 ? "Reduce filler words, pause silently instead." : "Add one counter-argument to opinion answers.",
      s.linkerCount < 4 ? "Use more linking phrases to signpost your ideas." : "Vary your linking phrases so they do not repeat.",
    ],
    vocabularyUpgrades: [
      { said: "good", better: "worthwhile, effective, rewarding" },
      { said: "a lot of", better: "a great deal of, a significant number of" },
      { said: "I think", better: "In my view, I would argue that" },
    ],
    recommendedCourse: courseFor(band),
    caveats: [
      ...HONESTY_CAVEATS,
      "Scored offline from measured transcript signals, so it reads structure, not meaning.",
      ...(s.typedAnswers ? [`${s.typedAnswers} answer(s) were typed, not spoken, so no speaking pace was measured for them.`] : []),
    ],
  };
}
