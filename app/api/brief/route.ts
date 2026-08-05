import { NextRequest, NextResponse } from "next/server";
import { hasLiveAgents, runJsonAgent } from "@/lib/agent";
import { memoryBlock } from "@/lib/memory";

export type Brief = {
  title: string;
  summary: string;
  problem: string;
  targetAudience: string;
  goals: string[];
  nonGoals: string[];
  keyFeatures: string[];
  risks: string[];
  successMetrics: string[];
  openQuestions: string[];
};

const SYSTEM = `You are the Brief Synthesizer, an expert product-management agent.
You take messy, unstructured input — meeting notes, transcripts, Slack dumps, half-formed thoughts — and produce a crisp, structured product brief.
Be concrete and specific to the input. Do NOT invent facts that contradict the input; where the input is silent, infer reasonable defaults but keep them plausible.
Return a JSON object with exactly these keys:
- title: string (a clear product/initiative name)
- summary: string (2-3 sentence executive summary)
- problem: string (the core problem being solved)
- targetAudience: string (who it's for)
- goals: string[] (3-5 concrete goals)
- nonGoals: string[] (2-3 explicit non-goals / out of scope)
- keyFeatures: string[] (3-6 key capabilities)
- risks: string[] (2-4 risks or open assumptions to validate)
- successMetrics: string[] (2-4 measurable success metrics)
- openQuestions: string[] (2-4 questions a PM should resolve)`;

function demoBrief(input: string): Brief {
  const firstLine = (input.split("\n").find((l) => l.trim().length > 0) || "New initiative")
    .trim()
    .slice(0, 60);
  return {
    title: firstLine || "Untitled Initiative",
    summary:
      "[Demo mode] This is a crafted sample brief. Add an ANTHROPIC_API_KEY to generate a real brief from your input. The structure below is exactly what the live Brief Synthesizer returns.",
    problem:
      "Teams receive scattered, unstructured context (notes, transcripts, threads) and waste hours turning it into a shareable brief before any real work starts.",
    targetAudience: "Product managers and cross-functional leads who need decisions documented fast.",
    goals: [
      "Convert unstructured input into a structured brief in under a minute",
      "Preserve the key facts from the source material",
      "Produce something shareable with engineering and marketing",
    ],
    nonGoals: [
      "Replacing the PM's judgment on scope and tradeoffs",
      "Inventing facts not present in the source",
    ],
    keyFeatures: [
      "Freeform input of any messy source",
      "Structured output: problem, audience, goals, risks, metrics",
      "One-click handoff into the Knowledge hub",
    ],
    risks: [
      "Source material may be incomplete — flagged assumptions need PM validation",
      "Ambiguous input can produce a generic brief",
    ],
    successMetrics: [
      "Time-to-first-brief reduced from ~1 hour to <5 minutes",
      "80%+ of generated briefs accepted with minor edits",
    ],
    openQuestions: [
      "Which stakeholders must approve before this becomes 'truth'?",
      "Does this brief supersede an existing product's positioning?",
    ],
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const input: string = body.input || "";
  const memory = memoryBlock(body.product, body.corrections);

  if (!input || typeof input !== "string" || input.trim().length < 4) {
    return NextResponse.json(
      { error: "Please provide some input to synthesize into a brief." },
      { status: 400 }
    );
  }

  if (!hasLiveAgents()) {
    return NextResponse.json({ brief: demoBrief(input), demo: true });
  }

  try {
    const brief = await runJsonAgent<Brief>({
      system: SYSTEM,
      user: `Here is the messy input. Synthesize it into a structured product brief.${memory}\n\nThe PM's input:\n${input}`,
      maxTokens: 2000,
      webSearch: true,
    });
    return NextResponse.json({ brief, demo: false });
  } catch (err) {
    // Fall back to demo output rather than failing the demo.
    return NextResponse.json({
      brief: demoBrief(input),
      demo: true,
      note: "Live agent errored; showing demo output.",
    });
  }
}
