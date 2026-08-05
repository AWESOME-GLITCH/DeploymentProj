import { NextRequest, NextResponse } from "next/server";
import { hasLiveAgents, runJsonAgent } from "@/lib/agent";
import { COMPANY_MEMORY } from "@/lib/company";

export type Theme = {
  theme: string;
  sentiment: "positive" | "neutral" | "negative" | "mixed";
  mentions: number;
  aspect: string; // what it's about (teachers, scheduling, price, materials…)
  quotes: string[]; // VERBATIM, from the input only
};
export type FeedbackAnalysis = {
  summary: string;
  sampleSize: number;
  sentiment: { positive: number; neutral: number; negative: number };
  metrics: { nps: number | null; csat: number | null; ces: number | null };
  themes: Theme[];
  opportunities: { title: string; impact: "high" | "medium" | "low"; effort: "high" | "medium" | "low"; rationale: string }[];
  biasFlags: string[];
};

const SYSTEM = `You are a rigorous data scientist analysing customer / student feedback for ES World (Dubai & London language education).
${COMPANY_MEMORY}

Method — be honest and evidence-preserving:
- Detect how many distinct feedback items are present → sampleSize (best estimate).
- Cluster comments into THEMES. Each theme names its aspect (teachers, scheduling, price, materials, admin, outcomes, facilities…), a sentiment, a mention count, and 1-3 VERBATIM quotes taken ONLY from the input. NEVER invent or paraphrase a quote — if there is no quotable line, return an empty quotes array.
- Overall sentiment split (positive/neutral/negative) as integer percentages that sum to 100.
- Compute NPS / CSAT / CES ONLY if numeric ratings or recommend-scores are present in the data; otherwise return null. Never fabricate a score.
- Opportunities: concrete actions, each scored impact (high/med/low) and effort (high/med/low), with a one-line rationale tied to the evidence.
- biasFlags: call out small samples, self-selection, leading questions, one dominant voice, or channel skew. If the sample is small, say so — don't over-conclude.

Return a JSON object with exactly these keys:
- summary: string (3-4 sentences, what the data says)
- sampleSize: number
- sentiment: { positive: number, neutral: number, negative: number }
- metrics: { nps: number|null, csat: number|null, ces: number|null }
- themes: array of { theme: string, sentiment: "positive"|"neutral"|"negative"|"mixed", mentions: number, aspect: string, quotes: string[] }
- opportunities: array of { title: string, impact: "high"|"medium"|"low", effort: "high"|"medium"|"low", rationale: string }
- biasFlags: string[]`;

function demo(): FeedbackAnalysis {
  return {
    summary:
      "[Demo] Add an ANTHROPIC_API_KEY to analyse your real feedback. Drop a CSV, survey export, review dump or focus-group transcript and this returns themes tied to verbatim quotes, an honest sentiment split, NPS/CSAT where present, scored opportunities and bias flags.",
    sampleSize: 24,
    sentiment: { positive: 58, neutral: 21, negative: 21 },
    metrics: { nps: 34, csat: 82, ces: null },
    themes: [
      { theme: "Teaching quality praised", aspect: "teachers", sentiment: "positive", mentions: 14, quotes: ["My teacher explained everything so clearly.", "Best tutor I've had — patient and encouraging."] },
      { theme: "Scheduling friction", aspect: "scheduling", sentiment: "negative", mentions: 7, quotes: ["Hard to rebook when I missed a class.", "Evening slots fill up too fast."] },
      { theme: "Value vs price mixed", aspect: "price", sentiment: "mixed", mentions: 5, quotes: ["Worth it for the results.", "A bit pricey compared to others nearby."] },
    ],
    opportunities: [
      { title: "Self-serve rebooking for missed classes", impact: "high", effort: "medium", rationale: "Top negative theme; removes the main friction without new content." },
      { title: "Add more evening capacity in Dubai", impact: "medium", effort: "high", rationale: "Repeated demand signal; capacity-constrained." },
    ],
    biasFlags: ["Small sample (n≈24) — treat as directional, not conclusive.", "Survey responders skew toward completers (self-selection)."],
  };
}

export async function POST(req: NextRequest) {
  const { input } = await req.json().catch(() => ({ input: "" }));
  if (!input || typeof input !== "string" || input.trim().length < 8) {
    return NextResponse.json({ error: "Drop a file or paste some feedback to analyse." }, { status: 400 });
  }
  if (!hasLiveAgents()) return NextResponse.json({ analysis: demo(), demo: true });
  try {
    const analysis = await runJsonAgent<FeedbackAnalysis>({
      system: SYSTEM,
      user: `Analyse this feedback. Preserve verbatim quotes; do not invent anything.\n\n${input.slice(0, 24000)}`,
      maxTokens: 3000,
    });
    return NextResponse.json({ analysis, demo: false });
  } catch {
    return NextResponse.json({ analysis: demo(), demo: true, note: "Live agent errored; showing demo output." });
  }
}
