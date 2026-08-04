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

// ES World website Course Template (from the digital-marketing team's .docx).
const COURSE_PAGE_FIELDS = [
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
] as const;

export type CourseField = { field: string; value: string };

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

const COURSE_SYSTEM = `You are the Marketing Writer, ES World's brand-compliant copywriter, filling out the official ES World website Course Template.
${BRAND_SYSTEM_FRAGMENT}
Fill EVERY field below using ONLY the provided product knowledge. Where a fact is genuinely missing, write "[TBC]" — never invent specifics (prices, dates, guarantees).
Field guidance:
- "Overview of the Course": 3-5 sentences, warm and benefit-led.
- "How the Intensity Works": a short flow describing pace/frequency.
- "Why should you choose": a short paragraph followed by 3-4 bullet points (use "• " to start each bullet).
- "The Enrolment Process": a numbered or bulleted flow of steps.
- "Study Materials": only if applicable, else "[TBC]".

Return a JSON object with exactly this key:
- fields: array of { field: string, value: string } — one entry per template field, in this exact order: ${COURSE_PAGE_FIELDS.join(", ")}.`;

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

function demoCoursePage(product: any): CourseField[] {
  return COURSE_PAGE_FIELDS.map((f) => {
    const v: Record<string, string> = {
      "Course Name": product.name,
      "Course Availability": `${product.campus} campus`,
      "Course Duration": product.format,
      "Course Levels": product.levels || "[TBC]",
      Timetables: product.format?.includes("evening") ? "Evening" : "Day / Midday — see schedule",
      "Overview of the Course": `[Demo] ${product.oneLiner} Add an ANTHROPIC_API_KEY to auto-fill this template from your Knowledge hub in ES World's voice.`,
      "How the Intensity Works": product.format,
      "Why should you choose": `A short paragraph, then:\n• Grounded in your real course facts\n• On-brand by construction\n• Ready to paste into the website`,
      "Learning Locations": `${product.campus}`,
      "The Enrolment Process": "• Enquire → • Free consultation / level check → • Confirm & pay → • Start",
      "Study Materials": "[TBC]",
    };
    return { field: f, value: v[f] ?? "[TBC]" };
  });
}

export async function POST(req: NextRequest) {
  const { contentType, productId, brief } = await req.json().catch(() => ({}));
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!contentType || !product) {
    return NextResponse.json({ error: "Pick a content type and a course." }, { status: 400 });
  }

  const isCoursePage = contentType === "Course page";
  const knowledge = JSON.stringify(product, null, 2);

  if (!hasLiveAgents()) {
    return isCoursePage
      ? NextResponse.json({ coursePage: demoCoursePage(product), demo: true })
      : NextResponse.json({ draft: demoDraft(contentType, product.name), demo: true });
  }

  try {
    if (isCoursePage) {
      const out = await runJsonAgent<{ fields: CourseField[] }>({
        system: COURSE_SYSTEM,
        user: `Emphasis from the PM: ${brief || "(none)"}\n\nProduct knowledge (single source of truth):\n${knowledge}\n\nFill the Course Template now.`,
        maxTokens: 2200,
      });
      return NextResponse.json({ coursePage: out.fields, demo: false });
    }
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
    return isCoursePage
      ? NextResponse.json({ coursePage: demoCoursePage(product), demo: true, note: "Live agent errored; showing demo output." })
      : NextResponse.json({ draft: demoDraft(contentType, product.name), demo: true, note: "Live agent errored; showing demo output." });
  }
}
