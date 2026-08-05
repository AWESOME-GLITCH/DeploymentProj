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
