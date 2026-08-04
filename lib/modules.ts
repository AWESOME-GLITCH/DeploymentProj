// Single source of truth for the module registry.
// The sidebar, hub dashboard, and routing all read from here.

export type ModuleStatus = "live" | "beta" | "next";

export type ModuleDef = {
  slug: string;
  name: string;
  short: string;
  icon: string; // lucide-react icon name
  accent: string; // tailwind text color class for the accent
  glow: string; // rgba for glow
  tagline: string;
  description: string;
  status: ModuleStatus;
  group: "core" | "planned";
  agent: string; // the agent that powers it
};

export const MODULES: ModuleDef[] = [
  {
    slug: "brief",
    name: "Product Brief",
    short: "Brief",
    icon: "FileText",
    accent: "text-accent-blue",
    glow: "91,157,255",
    tagline: "Messy input → structured brief",
    description:
      "Feed it unstructured notes, transcripts, or a data dump. It returns a clean, structured product brief — problem, audience, goals, scope, risks.",
    status: "live",
    group: "core",
    agent: "Brief Synthesizer",
  },
  {
    slug: "knowledge",
    name: "Product Knowledge",
    short: "Knowledge",
    icon: "Library",
    accent: "text-brand-soft",
    glow: "255,131,0",
    tagline: "One source of truth for 20+ products",
    description:
      "The hub. Every product's context, specs, decisions, and positioning in one searchable place that every other module reads from and writes to.",
    status: "live",
    group: "core",
    agent: "Knowledge Librarian",
  },
  {
    slug: "marketing",
    name: "Marketing Studio",
    short: "Marketing",
    icon: "Megaphone",
    accent: "text-accent-rose",
    glow: "255,107,139",
    tagline: "Templates + knowledge → ready content",
    description:
      "Fill in the fields; it drafts website copy, flyers, and presentation content using your templates and pulling facts from Knowledge & Briefs.",
    status: "beta",
    group: "core",
    agent: "Marketing Writer",
  },
  {
    slug: "analytics",
    name: "Trends & Analytics",
    short: "Analytics",
    icon: "LineChart",
    accent: "text-accent-teal",
    glow: "51,214,192",
    tagline: "Data in → patterns, honestly",
    description:
      "Cohorts, funnels, retention, trend & anomaly detection. Every insight ships with sample size, confidence, and a correlation-vs-causation label.",
    status: "beta",
    group: "core",
    agent: "Analytics Scientist",
  },
  {
    slug: "pricing",
    name: "Pricing Intelligence",
    short: "Pricing",
    icon: "Tags",
    accent: "text-accent-amber",
    glow: "255,181,71",
    tagline: "Cost + market → informed price",
    description:
      "Records your costs & unit economics, runs competitor research (with confidence flags), and recommends pricing with the full rationale chain.",
    status: "beta",
    group: "core",
    agent: "Pricing Analyst",
  },
  {
    slug: "feedback",
    name: "Feedback Analysis",
    short: "Feedback",
    icon: "MessagesSquare",
    accent: "text-accent-blue",
    glow: "91,157,255",
    tagline: "Surveys & focus groups → decisions",
    description:
      "Themes tied to real quotes, sentiment bound to themes, NPS/CSAT/CES together, and focus-group bias flags. Evidence-preserving by design.",
    status: "beta",
    group: "core",
    agent: "Insight Synthesizer",
  },
  {
    slug: "think-lab",
    name: "Think Lab",
    short: "Think Lab",
    icon: "FlaskConical",
    accent: "text-brand-soft",
    glow: "255,131,0",
    tagline: "Raw idea → MVP you can test",
    description:
      "Dump a company-level concept. It structures it using the whole tool's knowledge + live research into a problem, hypothesis, risks, and a defined MVP.",
    status: "beta",
    group: "core",
    agent: "Strategy Partner",
  },
  // ---- Planned (from the gap analysis) — visible so the full vision shows ----
  {
    slug: "portfolio",
    name: "Portfolio Manager",
    short: "Portfolio",
    icon: "LayoutGrid",
    accent: "text-ink-soft",
    glow: "255,131,0",
    tagline: "Invest · scale · kill, across 20+ products",
    description:
      "The cross-product cockpit: lifecycle stage, investment, capacity, and dependencies for your whole portfolio in one view.",
    status: "next",
    group: "planned",
    agent: "Portfolio Strategist",
  },
  {
    slug: "roadmap",
    name: "Roadmap & Planning",
    short: "Roadmap",
    icon: "Map",
    accent: "text-ink-soft",
    glow: "255,131,0",
    tagline: "From signal to a sequenced plan",
    description:
      "Turn prioritized opportunities into visual roadmaps and release plans — the canonical PM artifact.",
    status: "next",
    group: "planned",
    agent: "Roadmap Planner",
  },
  {
    slug: "prioritization",
    name: "Prioritization Engine",
    short: "Prioritize",
    icon: "ListChecks",
    accent: "text-ink-soft",
    glow: "255,131,0",
    tagline: "RICE · Kano · opportunity scoring",
    description:
      "The connective logic between Feedback, Analytics, and the Roadmap — score and rank what to build next.",
    status: "next",
    group: "planned",
    agent: "Prioritization Assistant",
  },
  {
    slug: "strategy",
    name: "Strategy & OKRs",
    short: "Strategy",
    icon: "Target",
    accent: "text-ink-soft",
    glow: "255,131,0",
    tagline: "Link every module to outcomes",
    description:
      "Vision, OKRs, and goal alignment so every brief, price, and roadmap ties back to a business outcome.",
    status: "next",
    group: "planned",
    agent: "Strategy Partner",
  },
];

export const CORE_MODULES = MODULES.filter((m) => m.group === "core");
export const PLANNED_MODULES = MODULES.filter((m) => m.group === "planned");

export function getModule(slug: string): ModuleDef | undefined {
  return MODULES.find((m) => m.slug === slug);
}
