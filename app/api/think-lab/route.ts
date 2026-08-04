import { NextRequest, NextResponse } from "next/server";
import { hasLiveAgents, runJsonAgent } from "@/lib/agent";

export type Concept = {
  concept: string;
  problemStatement: string;
  hypothesis: string;
  jobsToBeDone: string[];
  opportunity: { fit: string; rationale: string };
  assumptions: { text: string; risk: "high" | "medium" | "low" }[];
  mvp: { build: string[]; measure: string[]; learn: string[] };
  successMetrics: string[];
  firstExperiment: string;
  knownFromKnowledge: string[];
  researchNotes: { claim: string; confidence: "high" | "medium" | "low"; source: string }[];
};

const SYSTEM = `You are the Strategy Partner, an expert product-strategy agent that runs a "Think Lab".
A senior PM dumps a raw, company-level idea or concept. You structure it into a testable MVP using rigorous product-discovery thinking (Marty Cagan / opportunity-solution-tree style) and honest evidence handling.

Rules:
- Separate FACTS from ASSUMPTIONS. Every assumption must be labeled with a risk level and framed as something to VALIDATE, not a truth.
- The MVP must be the smallest thing that tests the riskiest assumption (Build / Measure / Learn).
- researchNotes should reflect what an evidence pass would surface; each carries a confidence level and a source type (e.g. "market report", "competitor page", "internal analytics"). Never present low-confidence items as fact.
- knownFromKnowledge = what the company's existing product knowledge likely already tells us (infer plausibly from the idea's domain).

Return a JSON object with exactly these keys:
- concept: string (a crisp name for the idea)
- problemStatement: string
- hypothesis: string (a falsifiable "we believe that…" statement)
- jobsToBeDone: string[] (2-4)
- opportunity: { fit: string (one of "Strong fit" | "Adjacent" | "Stretch"), rationale: string }
- assumptions: array of { text: string, risk: "high"|"medium"|"low" } (3-5, riskiest first)
- mvp: { build: string[] (2-4), measure: string[] (2-3), learn: string[] (2-3) }
- successMetrics: string[] (2-3)
- firstExperiment: string (the single next experiment to run this week)
- knownFromKnowledge: string[] (2-3 things the existing knowledge base likely already covers)
- researchNotes: array of { claim: string, confidence: "high"|"medium"|"low", source: string } (2-4)`;

function demoConcept(input: string): Concept {
  const name = (input.split("\n").find((l) => l.trim()) || "New concept").trim().slice(0, 50);
  return {
    concept: name || "New Concept",
    problemStatement:
      "[Demo mode] Add an ANTHROPIC_API_KEY to structure your real idea. This sample shows exactly what the Strategy Partner returns.",
    hypothesis:
      "We believe that giving PMs a structured Think Lab will help them move from raw idea to a testable MVP faster, measured by concepts reaching a first experiment within a day.",
    jobsToBeDone: [
      "When I have a raw idea, help me pressure-test it before I commit resources",
      "When I pitch to leadership, give me an evidence-backed structure, not vibes",
    ],
    opportunity: {
      fit: "Strong fit",
      rationale:
        "Directly leverages the tool's existing Knowledge hub and research agents; low incremental cost, high strategic value for a multi-product PM.",
    },
    assumptions: [
      { text: "PMs will trust an AI-structured concept enough to act on it", risk: "high" },
      { text: "The Knowledge hub has enough context to ground concepts usefully", risk: "medium" },
      { text: "A single first-experiment recommendation is actionable, not generic", risk: "medium" },
      { text: "Research citations will be fresh enough to matter", risk: "low" },
    ],
    mvp: {
      build: [
        "Freeform idea input + one-click structuring",
        "Assumptions surfaced with risk levels and validate/kill checkboxes",
        "A single recommended first experiment",
      ],
      measure: [
        "% of concepts that reach a defined first experiment",
        "PM-rated usefulness of the structured output (1-5)",
      ],
      learn: [
        "Whether structure alone changes PM behavior",
        "Which assumption types the agent gets wrong",
      ],
    },
    successMetrics: [
      "≥60% of concepts reach a first experiment within a day",
      "Average usefulness rating ≥4/5",
    ],
    firstExperiment:
      "Run 5 of your own real ideas through Think Lab this week; for each, note whether the recommended first experiment is one you'd actually run.",
    knownFromKnowledge: [
      "ES World runs 11 programmes across Dubai & London (English, Spanish, CELTA, Careers, ATHE Diploma)",
      "Flex Lessons already teaches real-world speaking tasks — debates, pitches, storytelling",
      "The ATHE Diploma already bundles an 'AI Module', so AI-assisted learning is on-brand",
    ],
    researchNotes: [
      {
        claim: "AI language-practice apps are a fast-growing category, strongest as a supplement to human teaching",
        confidence: "medium",
        source: "market report (2026)",
      },
      {
        claim: "Between-lesson practice is a known retention lever for language schools",
        confidence: "medium",
        source: "sector best-practice",
      },
    ],
  };
}

export async function POST(req: NextRequest) {
  const { input } = await req.json().catch(() => ({ input: "" }));
  if (!input || typeof input !== "string" || input.trim().length < 4) {
    return NextResponse.json({ error: "Describe an idea to structure." }, { status: 400 });
  }
  if (!hasLiveAgents()) {
    return NextResponse.json({ concept: demoConcept(input), demo: true });
  }
  try {
    const concept = await runJsonAgent<Concept>({
      system: SYSTEM,
      user: `Structure this raw company-level idea into a testable MVP:\n\n${input}`,
      maxTokens: 2500,
      webSearch: true,
    });
    return NextResponse.json({ concept, demo: false });
  } catch {
    return NextResponse.json({ concept: demoConcept(input), demo: true, note: "Live agent errored; showing demo output." });
  }
}
