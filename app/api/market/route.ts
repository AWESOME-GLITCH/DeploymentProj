import { NextRequest, NextResponse } from "next/server";
import { hasLiveAgents, runJsonAgent, type Source } from "@/lib/agent";
import { COMPANY_MEMORY } from "@/lib/company";

export type MarketResearch = {
  summary: string;
  trends: { note: string; kind: "opportunity" | "risk" | "compliance"; confidence: "high" | "medium" | "low" }[];
  opportunities: { title: string; rationale: string }[];
  risks: string[];
};

const SYSTEM = `You are ES World's market-research analyst (Dubai & London language education, higher-ed pathways, assessment).
${COMPANY_MEMORY}

Research the market HONESTLY. Use web search for current facts (demand, regulation, sector trends). Rules:
- Separate opportunities, risks and compliance items. Tag each trend and give a confidence level.
- Tie findings back to ES World's strategic pillars where relevant.
- Never invent statistics; if a figure isn't verifiable, describe the direction and mark it low confidence.

Return JSON exactly:
- summary: string (3-4 sentences)
- trends: array of { note, kind: "opportunity"|"risk"|"compliance", confidence: "high"|"medium"|"low" }
- opportunities: array of { title, rationale }
- risks: string[]`;

function demo(topic: string): MarketResearch {
  return {
    summary: `[Demo] Add an ANTHROPIC_API_KEY for live market research on “${topic || "ES World's markets"}”. This returns tagged trends, opportunities and risks tied to your strategy, with sources.`,
    trends: [
      { note: "Demand for flexible, on-demand English learning keeps rising across the Gulf.", kind: "opportunity", confidence: "medium" },
      { note: "UAE tightening of education-provider compliance (data + accreditation).", kind: "compliance", confidence: "medium" },
      { note: "Low-cost digital assessment (Duolingo ET) pressuring test pricing.", kind: "risk", confidence: "medium" },
    ],
    opportunities: [
      { title: "Bundle ATHE pathway with English intensives", rationale: "Turns language learners into higher-ed enrolments, your core strategy." },
      { title: "Position AZE as an admissions placement for partners", rationale: "Monetises a capability competitors lack." },
    ],
    risks: ["Regional demand volatility, keep recovery plans live.", "Price competition on commodity English/testing."],
  };
}

export async function POST(req: NextRequest) {
  const { topic } = await req.json().catch(() => ({ topic: "" }));
  if (!hasLiveAgents()) return NextResponse.json({ research: demo(topic), demo: true, sources: [], searched: false });
  const sink: { sources?: Source[]; searched?: boolean } = {};
  try {
    const research = await runJsonAgent<MarketResearch>(
      { system: SYSTEM, user: `Research the market now${topic ? ` with a focus on: ${topic}` : " for ES World's portfolio"}.`, maxTokens: 4096, webSearch: true },
      sink
    );
    return NextResponse.json({ research, demo: false, sources: sink.sources || [], searched: Boolean(sink.searched) });
  } catch {
    return NextResponse.json({ research: demo(topic), demo: true, sources: [], searched: false });
  }
}
