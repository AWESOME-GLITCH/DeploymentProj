import { NextRequest, NextResponse } from "next/server";
import { hasLiveAgents, runJsonAgent } from "@/lib/agent";

// NOTE: This mirrors a standard ES World Product/Service Proposal. Once the exact
// JotForm field labels are provided, swap the keys/labels below to match 1:1.
export type Proposal = {
  title: string;
  productName: string;
  category: string;
  campus: string;
  proposedBy: string;
  summary: string;
  problemOpportunity: string;
  proposedSolution: string;
  targetAudience: string;
  differentiators: string[];
  pricing: { model: string; price: string; notes: string };
  costsResources: string[];
  marketCompetitors: string;
  successMetrics: string[];
  risks: string[];
  timeline: string;
  recommendation: string;
};

const SYSTEM = `You are the Brief Synthesizer working in PROPOSAL mode for ES World (Dubai & London language education).
You turn messy input into a complete, shareable Product/Service Proposal. Use only facts present in the input or clearly reasonable for ES World; where a fact is missing, write "[TBC]" rather than inventing specifics.

Return a JSON object with exactly these keys:
- title: string (proposal title)
- productName: string
- category: string (e.g. English, Spanish, Teacher Training, Higher Education, Professional, Careers, Pathways)
- campus: string (Dubai, London, Online, or Both)
- proposedBy: string (role/department if inferable, else "[TBC]")
- summary: string (2-3 sentence executive summary)
- problemOpportunity: string (the problem or market opportunity)
- proposedSolution: string (what the product/service is and how it works)
- targetAudience: string
- differentiators: string[] (2-4 reasons it wins)
- pricing: { model: string, price: string, notes: string }
- costsResources: string[] (2-4 costs/resources needed to deliver it)
- marketCompetitors: string (market context / competitors, honest about unknowns)
- successMetrics: string[] (2-4 measurable KPIs)
- risks: string[] (2-4 risks or dependencies)
- timeline: string (proposed timeline / intake)
- recommendation: string (a clear recommended next step / decision requested)`;

function demoProposal(input: string): Proposal {
  const title = (input.split("\n").find((l) => l.trim()) || "New proposal").trim().slice(0, 60);
  return {
    title: title || "New Product/Service Proposal",
    productName: "[Demo] " + (title || "New offering"),
    category: "English",
    campus: "Dubai",
    proposedBy: "[TBC]",
    summary:
      "[Demo mode] Add an ANTHROPIC_API_KEY to fill this proposal from your real input. The structure below is what the live agent returns; once you paste your JotForm fields I'll match them exactly.",
    problemOpportunity: "The gap or opportunity this addresses, drawn from your input.",
    proposedSolution: "A concise description of the proposed product/service and how it's delivered.",
    targetAudience: "Who it's for.",
    differentiators: ["Grounded in the Knowledge hub", "On-brand by construction", "Fast to share"],
    pricing: { model: "[TBC]", price: "[TBC]", notes: "Pull cost inputs from the Pricing module." },
    costsResources: ["Teacher/tutor time", "Materials & platform", "Marketing assets"],
    marketCompetitors: "Honest market context; unknowns flagged rather than invented.",
    successMetrics: ["Enrolments in first intake", "Conversion from enquiry to enrolment"],
    risks: ["Demand unproven until piloted", "Delivery capacity / staffing"],
    timeline: "[TBC] — e.g. pilot next intake",
    recommendation: "Approve a small pilot to validate demand before full launch.",
  };
}

export async function POST(req: NextRequest) {
  const { input } = await req.json().catch(() => ({ input: "" }));
  if (!input || typeof input !== "string" || input.trim().length < 4) {
    return NextResponse.json({ error: "Provide some input to build a proposal from." }, { status: 400 });
  }
  if (!hasLiveAgents()) {
    return NextResponse.json({ proposal: demoProposal(input), demo: true });
  }
  try {
    const proposal = await runJsonAgent<Proposal>({
      system: SYSTEM,
      user: `Turn this into a complete ES World Product/Service Proposal:\n\n${input}`,
      maxTokens: 2500,
      webSearch: true,
    });
    return NextResponse.json({ proposal, demo: false });
  } catch {
    return NextResponse.json({ proposal: demoProposal(input), demo: true, note: "Live agent errored; showing demo output." });
  }
}
