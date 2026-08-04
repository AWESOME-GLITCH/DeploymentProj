import { NextRequest, NextResponse } from "next/server";
import { hasLiveAgents, runJsonAgent } from "@/lib/agent";
import { BRAND_SYSTEM_FRAGMENT } from "@/lib/brand";
import { PRODUCTS } from "@/lib/knowledge";
import { buildPlan, FlowActionKey } from "@/lib/team";

// JSON shape requested from the agent for each artifact-producing action.
const ARTIFACT_SPEC: Record<string, string> = {
  brief: `"brief": { "summary": string, "problem": string, "audience": string, "goals": string[] (3) }`,
  pricing: `"pricing": { "recommendation": string, "pricePoint": string, "rationale": string, "marketNote": string (competitor/market context from web research, with a confidence word) }`,
  flyer: `"flyer": { "headline": string, "subhead": string, "bullets": string[] (3-4), "cta": string }`,
  presentation: `"presentation": { "title": string, "slides": [ { "title": string, "points": string[] (2-3) } ] (3-4 slides) }`,
  website: `"website": { "fields": [ { "field": string, "value": string } ] } filling: Course Name, Overview of the Course, Why should you choose, The Enrolment Process`,
  proposal: `"proposal": { "summary": string, "problemOpportunity": string, "pricing": string, "recommendation": string }`,
};

function demoArtifacts(keys: string[], productName: string) {
  const all: Record<string, any> = {
    brief: { summary: `[Demo] Structured brief for “${productName}”. Add an ANTHROPIC_API_KEY for live output.`, problem: "The core problem this addresses.", audience: "Who it's for.", goals: ["Goal one", "Goal two", "Goal three"] },
    pricing: { recommendation: "Hold current price; add an early-bird bundle.", pricePoint: "From USD 225 / week (VAT-incl.)", rationale: "Aligned to the 2026 list; bundle lifts value perception.", marketNote: "Dubai group English clusters USD 200–300/wk (medium confidence)." },
    flyer: { headline: `${productName} — Experience · Grow · Enjoy`, subhead: "A short benefit-led subhead.", bullets: ["Key benefit one", "Key benefit two", "Key benefit three"], cta: "Book a free consultation at esworld.com" },
    presentation: { title: `${productName} — Overview`, slides: [{ title: "Why this course", points: ["Benefit", "Proof"] }, { title: "What's included", points: ["Format", "Levels"] }, { title: "Next steps", points: ["Enrol", "Contact"] }] },
    website: { fields: [{ field: "Course Name", value: productName }, { field: "Overview of the Course", value: "[Demo] 3–5 sentence overview, filled from Knowledge in live mode." }, { field: "Why should you choose", value: "A short paragraph + bullets." }, { field: "The Enrolment Process", value: "Enquire → consult → confirm → start" }] },
    proposal: { summary: "[Demo] Executive summary.", problemOpportunity: "The opportunity.", pricing: "Proposed pricing model.", recommendation: "Approve a pilot." },
  };
  const out: Record<string, any> = {};
  for (const k of keys) if (all[k]) out[k] = all[k];
  return out;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const input: string = body.input || "";
  const actions: FlowActionKey[] = Array.isArray(body.actions) ? body.actions : [];
  const region: string | undefined = body.region;
  const product = PRODUCTS.find((p) => p.id === body.productId);

  if (!input || input.trim().length < 4 || actions.length === 0) {
    return NextResponse.json({ error: "Add some input and choose at least one step." }, { status: 400 });
  }

  const plan = buildPlan(actions, region);
  const producing = actions.filter((a) => ARTIFACT_SPEC[a]);
  const productName = product?.name || "New offering";

  if (producing.length === 0) {
    return NextResponse.json({ artifacts: {}, plan, demo: !hasLiveAgents() });
  }

  if (!hasLiveAgents()) {
    return NextResponse.json({ artifacts: demoArtifacts(producing, productName), plan, demo: true });
  }

  const specs = producing.map((k) => ARTIFACT_SPEC[k]).join(",\n");
  const system = `You are the Flow Orchestrator for ES World (Dubai & London language education).
From one input you produce several coordinated marketing/product artifacts at once. Use web research where it improves accuracy (competitor prices, market facts) and flag confidence. Keep every artifact grounded in the provided product knowledge; never invent prices or guarantees — use "[TBC]" if unknown.
${BRAND_SYSTEM_FRAGMENT}

Return ONE JSON object containing exactly these keys:
{
${specs}
}`;

  const knowledge = product ? JSON.stringify(product, null, 2) : "(no specific programme selected)";
  try {
    const artifacts = await runJsonAgent<Record<string, any>>({
      system,
      user: `Programme: ${productName}\nProduct knowledge:\n${knowledge}\n\nInput from the PM:\n${input}\n\nProduce all requested artifacts now.`,
      maxTokens: 3000,
      webSearch: true,
    });
    return NextResponse.json({ artifacts, plan, demo: false });
  } catch {
    return NextResponse.json({ artifacts: demoArtifacts(producing, productName), plan, demo: true, note: "Live agent errored; showing demo output." });
  }
}
