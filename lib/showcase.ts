// Tailored preview content per module (ES World scenarios + research-backed guardrails).

export type Insight = {
  claim: string;
  confidence: "high" | "medium" | "low";
  meta: string;
  label?: string; // e.g. "correlation — not causation"
};

export type Showcase = {
  steps: { title: string; detail: string }[];
  capabilities: string[];
  guardrail: string;
  sample:
    | { kind: "insights"; title: string; items: Insight[] }
    | { kind: "pricing"; title: string; note: string }
    | { kind: "feedback"; title: string }
    | { kind: "roadmap"; title: string; items: { name: string; detail: string }[] };
};

export const SHOWCASE: Record<string, Showcase> = {
  analytics: {
    steps: [
      { title: "Feed data", detail: "Upload enrolments, attendance, enquiry logs, or a spreadsheet export." },
      { title: "Agent analyses", detail: "Cohorts, funnels, retention, trend & anomaly detection — decomposed properly." },
      { title: "Honest insights", detail: "Every card carries sample size, confidence, and a correlation-vs-causation label." },
    ],
    capabilities: [
      "Cohort analysis (by campus, course, level, intake)",
      "Enquiry → consult → enrolment funnels with drop-off detection",
      "Retention / re-enrolment curves (spot the leaky bucket)",
      "Seasonally-aware trend & anomaly detection",
    ],
    guardrail:
      "The agent refuses to state causation from correlation, flags small samples, and never presents one 'significant' slice out of many as the finding.",
    sample: {
      kind: "insights",
      title: "Sample insights · Dubai courses",
      items: [
        {
          claim: "Speaking Class enrolments dip ~22% in Jun–Aug vs. term-time.",
          confidence: "high",
          meta: "n = 3 years of intake data · seasonally decomposed",
          label: "seasonal pattern",
        },
        {
          claim: "Flex Lessons students who attend a free first session enrol at a higher rate.",
          confidence: "medium",
          meta: "n = 48 · observational",
          label: "correlation — not causation",
        },
        {
          claim: "CELTA enquiries spike 2–3 weeks after each intake opens.",
          confidence: "medium",
          meta: "n = 9 course runs",
          label: "trend candidate — verify",
        },
      ],
    },
  },
  pricing: {
    steps: [
      { title: "Record costs", detail: "Teacher cost/hour, room, materials, ATHE registration — your true unit economics." },
      { title: "Research the market", detail: "Agent scans public competitor pricing (Dubai & London language schools) with confidence flags." },
      { title: "Recommend", detail: "A price with the full rationale chain: value → cost floor → competitive band → margin check." },
    ],
    capabilities: [
      "Cost & margin model per course (contribution, break-even class size)",
      "Competitor price bands with source + confidence (opaque pricing flagged, not faked)",
      "Value & willingness-to-pay framing per segment",
      "Bundle economics (e.g. ATHE Diploma = tuition + Careers + AI Module)",
    ],
    guardrail:
      "Competitor 'custom / on-request' pricing is genuinely unscrapeable — the agent labels it low-confidence and never invents a number. The final price is always your call.",
    sample: {
      kind: "pricing",
      title: "Sample · ATHE Business & Management Diploma",
      note: "$17,000 bundle · up to $3,000 discount. Agent checks it against Dubai study-abroad + UK pathway comparables.",
    },
  },
  feedback: {
    steps: [
      { title: "Ingest feedback", detail: "Surveys, course reviews, focus-group transcripts, enquiry notes — any text stream." },
      { title: "Theme + sentiment", detail: "Auto-clustered themes, each tied to real student quotes; sentiment bound to themes." },
      { title: "Decide", detail: "NPS/CSAT/CES together, opportunity scoring, and bias flags — you decide, evidence in hand." },
    ],
    capabilities: [
      "Thematic coding tied to verbatim student quotes (evidence-preserving)",
      "Aspect-level sentiment (e.g. 'positive on teachers, negative on scheduling')",
      "NPS / CSAT / CES tracked together, with open-text 'why'",
      "Focus-group bias flags (dominant voice, leading questions)",
    ],
    guardrail:
      "Sentiment is never a floating number — it's attached to a theme and drillable to quotes. Small or skewed samples get flagged for a follow-up, not a conclusion.",
    sample: { kind: "feedback", title: "Sample · CELTA cohort feedback" },
  },
  roadmap: {
    steps: [
      { title: "Pull priorities", detail: "Take the ranked opportunities from Prioritization + Feedback." },
      { title: "Sequence", detail: "Lay them on a timeline by campus, term, and capacity." },
      { title: "Communicate", detail: "A shareable roadmap leadership and teachers can actually read." },
    ],
    capabilities: [
      "Timeline / term-based course & campaign roadmap",
      "Intake and launch planning per campus",
      "Dependencies (teacher hiring, accreditation, visa windows)",
      "Shareable views for stakeholders",
    ],
    guardrail: "The canonical PM artifact — turns signal into a sequenced plan. Queued after the core six.",
    sample: {
      kind: "roadmap",
      title: "Illustrative roadmap",
      items: [
        { name: "This term", detail: "Flex Lessons London launch · Speaking Class summer promo" },
        { name: "Next term", detail: "ATHE January intake pilot · Spanish group classes" },
        { name: "Later", detail: "AI English coach companion (from Think Lab)" },
      ],
    },
  },
  prioritization: {
    steps: [
      { title: "Gather ideas", detail: "Course ideas, campaigns, and requests from Feedback & Think Lab." },
      { title: "Score", detail: "RICE, opportunity scoring (importance vs. satisfaction), or weighted criteria." },
      { title: "Rank", detail: "A defensible order — the connective logic between signal and roadmap." },
    ],
    capabilities: [
      "RICE / weighted scoring / MoSCoW",
      "Opportunity scoring (important but underserved needs)",
      "Re-scores continuously as new feedback arrives",
      "Feeds directly into the Roadmap",
    ],
    guardrail: "Scores inform, you decide. Especially when re-ranking, the agent surfaces the trade-off, not just a number.",
    sample: {
      kind: "roadmap",
      title: "Sample scored ideas",
      items: [
        { name: "High", detail: "Flex → ATHE Diploma conversion pathway (high reach, high fit)" },
        { name: "Medium", detail: "Spanish group classes (new segment, unproven demand)" },
        { name: "Low", detail: "Weekend intensive IELTS (small addressable cohort)" },
      ],
    },
  },
  strategy: {
    steps: [
      { title: "Set the vision", detail: "Company objectives and OKRs for the year." },
      { title: "Link", detail: "Every brief, price, and roadmap item ties back to an objective." },
      { title: "Track", detail: "Progress on key results, with the evidence behind each." },
    ],
    capabilities: [
      "Vision & OKR authoring",
      "Goal alignment across all modules",
      "Progress tracking with linked evidence",
      "Executive-ready strategy views",
    ],
    guardrail: "Essential at your altitude — it's how portfolio decisions get justified to the board. Queued.",
    sample: {
      kind: "roadmap",
      title: "Illustrative OKRs",
      items: [
        { name: "Objective", detail: "Become Dubai's clearest path from English → accredited business qualification" },
        { name: "KR1", detail: "Grow ATHE Diploma enrolments 30% by Sep 2026 intake" },
        { name: "KR2", detail: "Convert 15% of Flex/Speaking students into a next-step programme" },
      ],
    },
  },
};
