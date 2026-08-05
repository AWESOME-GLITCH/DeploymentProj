import { NextRequest, NextResponse } from "next/server";
import { hasLiveAgents, runJsonAgent, type Source } from "@/lib/agent";
import { BRAND_SYSTEM_FRAGMENT } from "@/lib/brand";
import { COMPANY_MEMORY } from "@/lib/company";
import { FLYER_SPEC, flyerFromProduct } from "@/lib/flyer";
import { PROPOSAL_FORM_SPEC, demoProposalForm } from "@/lib/proposalForm";
import { PRODUCTS, type Product } from "@/lib/knowledge";
import { buildPlan, FlowActionKey } from "@/lib/team";

// The real ES World website Course Template (from the digital-marketing .docx).
const COURSE_FIELDS = [
  "Course Name",
  "Course Availability",
  "Course Duration",
  "Course Levels",
  "Timetables",
  "Overview of the Course",
  "How the Intensity Works",
  "Why should you choose",
  "Learning Locations",
  "The Enrolment Process",
  "Study Materials",
];

const ARTIFACT_SPEC: Record<string, string> = {
  brief: `"brief": { "summary": string, "problem": string, "audience": string, "goals": string[] (3) }`,
  pricing: `"pricing": { "recommendation": string, "pricePoint": string, "rationale": string, "marketNote": string }`,
  flyer: FLYER_SPEC,
  presentation: `"presentation": { "title": string, "slides": [ { "title": string, "points": string[] (2-3) } ] (3-4 slides) }`,
  website: `"website": { "fields": [ { "field": string, "value": string } ] } — fill ES World's website Course Template, ONE entry per field in THIS EXACT ORDER: ${COURSE_FIELDS.map((f) => `"${f}"`).join(", ")}. "Overview of the Course" = 3-5 sentences. "Why should you choose" = a short paragraph then 3-4 bullet lines each starting with "• ". "The Enrolment Process" = numbered steps. Use the product knowledge; write "[TBC]" if a fact is missing.`,
  proposal: `"proposal": ${PROPOSAL_FORM_SPEC}`,
};

function courseVal(field: string, p?: Product): string {
  if (!p) return "[TBC]";
  const map: Record<string, string | undefined> = {
    "Course Name": p.name,
    "Course Availability": `${p.campus} campus`,
    "Course Duration": p.format,
    "Course Levels": p.levels,
    Timetables: p.schedule,
    "Overview of the Course": p.overview || p.oneLiner,
    "How the Intensity Works": p.format,
    "Why should you choose": (p.whyChoose || []).map((w) => `• ${w}`).join("\n"),
    "Learning Locations": p.campus,
    "The Enrolment Process": (p.enrolment || []).map((s, i) => `${i + 1}. ${s}`).join("\n"),
    "Study Materials": p.materials,
  };
  return map[field] || "[TBC]";
}

function demoArtifacts(keys: string[], p?: Product) {
  const name = p?.name || "New offering";
  const all: Record<string, any> = {
    brief: { summary: p?.overview || p?.oneLiner || `Brief for ${name}.`, problem: `Give prospects a clear reason to choose ${name}.`, audience: p?.audience || "[TBC]", goals: (p?.outcomes || ["[TBC]"]).slice(0, 3) },
    pricing: { recommendation: "Hold the list price; add an early-bird offer.", pricePoint: p?.price || "[TBC]", rationale: "Aligned to the 2026 price list.", marketNote: "Set ENABLE_WEB_SEARCH=1 for live competitor data." },
    flyer: flyerFromProduct(p),
    presentation: { title: `${name} — Overview`, slides: [{ title: "Why this course", points: (p?.whyChoose || p?.outcomes || []).slice(0, 3) }, { title: "What's included", points: [p?.levels, p?.format].filter(Boolean) }, { title: "Next steps", points: ["Enrol", "Contact esworld.com"] }] },
    website: { fields: COURSE_FIELDS.map((f) => ({ field: f, value: courseVal(f, p) })) },
    proposal: demoProposalForm(name),
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
  const corrections: { kind: string; note: string }[] = Array.isArray(body.corrections) ? body.corrections : [];

  if (!input || input.trim().length < 4 || actions.length === 0) {
    return NextResponse.json({ error: "Add some input and choose at least one step." }, { status: 400 });
  }

  const plan = buildPlan(actions, region);
  const producing = actions.filter((a) => ARTIFACT_SPEC[a]);
  const productName = product?.name || (typeof body.newName === "string" && body.newName.trim()) || "New offering";

  if (producing.length === 0) return NextResponse.json({ artifacts: {}, plan, demo: !hasLiveAgents() });
  if (!hasLiveAgents()) return NextResponse.json({ artifacts: demoArtifacts(producing, product), plan, demo: true });

  const specs = producing.map((k) => ARTIFACT_SPEC[k]).join(",\n");
  const correctionBlock = corrections.length
    ? `\n\nPM CORRECTIONS — GROUND TRUTH. The product manager reviewed earlier output and gave these corrections. They OVERRIDE everything else, including the product knowledge, whenever they conflict. Obey every one exactly; do not repeat the mistakes they describe:\n${corrections
        .map((c, i) => `${i + 1}. [${c.kind}] ${c.note}`)
        .join("\n")}`
    : "";
  const system = `You are the Flow Orchestrator for ES World (Dubai & London language education).
You produce several coordinated ES World artifacts at once, using ES World's OWN formats.
GROUND EVERYTHING IN THE PROVIDED PRODUCT KNOWLEDGE — reflect its real facts faithfully (name, campus, price, levels, format, schedule, intakes, audience, learning outcomes, course outline, personas). Do NOT invent facts that contradict it, and never invent prices — copy the price from the knowledge or write "[TBC]".

${COMPANY_MEMORY}
${BRAND_SYSTEM_FRAGMENT}${correctionBlock}

Return ONE JSON object containing exactly these keys:
{
${specs}
}`;

  const knowledge = product
    ? JSON.stringify(product, null, 2)
    : `(new programme not yet in the catalogue — "${productName}". Base it on the PM's input and ES World's model; use [TBC] for unknowns.)`;
  const sink: { sources?: Source[]; searched?: boolean } = {};
  try {
    const artifacts = await runJsonAgent<Record<string, any>>(
      {
        system,
        user: `Programme: ${productName}\n\nProduct knowledge (single source of truth — use these real facts):\n${knowledge}\n\nWhat the PM is launching / doing:\n${input}\n\nProduce all requested artifacts now, using ES World's formats and the real facts above.`,
        maxTokens: 8000,
        webSearch: true,
      },
      sink
    );
    return NextResponse.json({ artifacts, plan, demo: false, sources: sink.sources || [], searched: Boolean(sink.searched) });
  } catch {
    return NextResponse.json({ artifacts: demoArtifacts(producing, product), plan, demo: true, note: "Live agent errored; showing demo output." });
  }
}
