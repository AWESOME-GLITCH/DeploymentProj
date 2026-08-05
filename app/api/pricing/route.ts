import { NextRequest, NextResponse } from "next/server";
import { hasLiveAgents, runJsonAgent } from "@/lib/agent";
import { memoryBlock } from "@/lib/memory";

export type PricingAnalysis = {
  positioning: string;
  recommendation: string;
  recommendedPrice: string;
  rationale: string[];
  competitors: { name: string; price: string; confidence: "high" | "medium" | "low"; note: string }[];
  trends: { note: string; confidence: "high" | "medium" | "low" }[];
  risks: string[];
};

const SYSTEM = `You are the Pricing Analyst for ES World (Dubai & London language education).
You research the live market and recommend pricing HONESTLY. Rules:
- Use web search to find real competitor prices (Dubai/London language schools, IELTS/CELTA providers, study-abroad). Cite what you found.
- Enterprise/"on request" pricing is often unpublished — mark such items low confidence and NEVER invent a number.
- Respect the provided unit economics: never recommend a price below the cost floor / target margin.
- Give the full rationale chain: value → cost floor → competitive band → margin check.
- The final decision is the PM's; you inform.

Return a JSON object with exactly these keys:
- positioning: string (where this sits vs. the market)
- recommendation: string (what to do)
- recommendedPrice: string
- rationale: string[] (3-5, the reasoning chain)
- competitors: array of { name: string, price: string, confidence: "high"|"medium"|"low", note: string } (3-5 real comparables)
- trends: array of { note: string, confidence: "high"|"medium"|"low" } (2-3 market trends)
- risks: string[] (2-3)`;

function demo(name: string, price: string): PricingAnalysis {
  return {
    positioning: `[Demo] Add an ANTHROPIC_API_KEY for live market research. ${name} currently at ${price}.`,
    recommendation: "Hold the current list price; introduce an early-bird bundle to lift perceived value without discounting the headline.",
    recommendedPrice: price || "From USD 225 / week",
    rationale: [
      "Cost floor: keep contribution positive at your entered teacher/room costs.",
      "Competitive band: sits mid-market for Dubai group English.",
      "Value: VAT-inclusive pricing and test-centre status justify a small premium.",
      "Margin: recommended price clears your target margin at typical class size.",
    ],
    competitors: [
      { name: "Competitor A (Dubai group English)", price: "~USD 250 / week", confidence: "medium", note: "Public site price; excludes registration." },
      { name: "Competitor B", price: "on request", confidence: "low", note: "Enterprise pricing unpublished — not verifiable." },
      { name: "Competitor C (IELTS prep)", price: "~USD 300 / week", confidence: "medium", note: "Similar intensity." },
    ],
    trends: [
      { note: "Bundled tuition + accommodation increasingly expected by study-abroad students.", confidence: "medium" },
      { note: "Usage/short-course flexibility is a growing differentiator.", confidence: "medium" },
    ],
    risks: ["Competitor prices move and vary by promo — re-verify before publishing.", "Enterprise/custom prices can't be confirmed from public sources."],
  };
}

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const { name, campus, currentPrice, market, economics } = b;
  if (!name) return NextResponse.json({ error: "Pick or name a programme." }, { status: 400 });

  if (!hasLiveAgents()) {
    return NextResponse.json({ analysis: demo(name, currentPrice), demo: true });
  }
  const memory = memoryBlock(null, b.corrections);
  try {
    const analysis = await runJsonAgent<PricingAnalysis>({
      system: SYSTEM,
      user: `Programme: ${name} (${campus || "—"})
Current price: ${currentPrice || "—"}
Target market / region: ${market || "general"}
Unit economics entered by the PM: ${economics || "not provided"}${memory}

Research the live market and recommend pricing now.`,
      maxTokens: 2500,
      webSearch: true,
    });
    return NextResponse.json({ analysis, demo: false });
  } catch {
    return NextResponse.json({ analysis: demo(name, currentPrice), demo: true, note: "Live agent errored; showing demo output." });
  }
}
