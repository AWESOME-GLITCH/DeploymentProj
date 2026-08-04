import { NextRequest, NextResponse } from "next/server";
import { hasLiveAgents, runJsonAgent } from "@/lib/agent";
import { BRAND_SYSTEM_FRAGMENT } from "@/lib/brand";
import { PRODUCTS } from "@/lib/knowledge";

export type MarketingDraft = {
  docCode: string;
  headline: string;
  subheadline: string;
  sections: { heading: string; body: string }[];
  cta: string;
  brandChecklist: { rule: string; ok: boolean }[];
};

const SYSTEM = `You are the Marketing Writer, ES World's brand-compliant copywriter.
You draft marketing content (website copy, flyers, presentation content, social posts, emails) for language courses, pulling facts ONLY from the provided product knowledge.
${BRAND_SYSTEM_FRAGMENT}

Return a JSON object with exactly these keys:
- docCode: string (format ESL-MKT-[TYPE]-001-AI-V1.0, where TYPE is a 3-letter code for the content type e.g. WEB, FLY, PPT, SOC, EML)
- headline: string (punchy, on-brand)
- subheadline: string
- sections: array of { heading: string, body: string } (3-5 sections appropriate to the content type)
- cta: string (a clear call to action)
- brandChecklist: array of { rule: string, ok: boolean } (4 items confirming palette, typography, factual grounding, and correct document type)`;

function demoDraft(type: string, productName: string): MarketingDraft {
  const code = { Website: "WEB", Flyer: "FLY", Presentation: "PPT", "Social post": "SOC", Email: "EML" }[type] || "GEN";
  return {
    docCode: `ESL-MKT-${code}-001-AI-V1.0`,
    headline: `[Demo] ${productName} — Experience · Grow · Enjoy`,
    subheadline: "Add an ANTHROPIC_API_KEY to generate real brand-compliant copy from your Knowledge hub.",
    sections: [
      { heading: "Why this course", body: "This is sample structure. The live Marketing Writer pulls the real course facts (levels, format, price) from Knowledge and writes in ES World's voice." },
      { heading: "What you'll get", body: "Bulleted benefits, grounded in the product record — never invented. Missing facts appear as [PLACEHOLDER] for you to confirm." },
      { heading: "Who it's for", body: "The target audience, lifted straight from the Knowledge record so messaging stays accurate across every asset." },
    ],
    cta: "Book your free consultation at esworld.com",
    brandChecklist: [
      { rule: "Palette: Orange #FF8300 headings, black body, white bg", ok: true },
      { rule: "Typography: Calibri Light hierarchy", ok: true },
      { rule: "Facts grounded in Knowledge (no invented claims)", ok: true },
      { rule: `Correct document type & code (ESL-MKT-${code}…)`, ok: true },
    ],
  };
}

export async function POST(req: NextRequest) {
  const { contentType, productId, brief } = await req.json().catch(() => ({}));
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!contentType || !product) {
    return NextResponse.json({ error: "Pick a content type and a course." }, { status: 400 });
  }

  if (!hasLiveAgents()) {
    return NextResponse.json({ draft: demoDraft(contentType, product.name), demo: true });
  }

  const knowledge = JSON.stringify(product, null, 2);
  try {
    const draft = await runJsonAgent<MarketingDraft>({
      system: SYSTEM,
      user: `Content type: ${contentType}
Extra brief from the PM (fields to emphasise): ${brief || "(none)"}

Product knowledge (single source of truth — use only these facts):
${knowledge}

Write the ${contentType} content now.`,
      maxTokens: 2200,
    });
    return NextResponse.json({ draft, demo: false });
  } catch {
    return NextResponse.json({ draft: demoDraft(contentType, product.name), demo: true, note: "Live agent errored; showing demo output." });
  }
}
