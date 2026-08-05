// Module registry. Copy is deliberately short and plain — no jargon.

export type ModuleStatus = "live" | "beta" | "next";

export type ModuleDef = {
  slug: string;
  name: string;
  short: string;
  icon: string;
  accent: string;
  glow: string;
  tagline: string;
  description: string;
  status: ModuleStatus;
  group: "core" | "planned";
  agent: string;
};

export const MODULES: ModuleDef[] = [
  {
    slug: "flow",
    name: "Launch Flow",
    short: "Flow",
    icon: "Workflow",
    accent: "text-brand-soft",
    glow: "255,131,0",
    tagline: "One brief, every step",
    description: "Run the brief, pricing, flyer, website and more in one go — with owners assigned.",
    status: "live",
    group: "core",
    agent: "Flow",
  },
  {
    slug: "brief",
    name: "Brief",
    short: "Brief",
    icon: "FileText",
    accent: "text-brand-soft",
    glow: "255,131,0",
    tagline: "Notes → clean brief",
    description: "Paste messy notes. Get a structured brief or a shareable proposal.",
    status: "live",
    group: "core",
    agent: "Brief",
  },
  {
    slug: "library",
    name: "Library",
    short: "Library",
    icon: "Boxes",
    accent: "text-brand-soft",
    glow: "255,131,0",
    tagline: "Everything you've created",
    description: "Every brief, quote, flyer and idea you've saved — grouped by programme, in one place.",
    status: "live",
    group: "core",
    agent: "Library",
  },
  {
    slug: "knowledge",
    name: "Knowledge",
    short: "Knowledge",
    icon: "Library",
    accent: "text-brand-soft",
    glow: "255,131,0",
    tagline: "All courses, one place",
    description: "Your full Dubai & London catalogue — searchable, editable, always in sync.",
    status: "live",
    group: "core",
    agent: "Knowledge",
  },
  {
    slug: "marketing",
    name: "Marketing",
    short: "Marketing",
    icon: "Megaphone",
    accent: "text-brand-soft",
    glow: "255,131,0",
    tagline: "On-brand copy, fast",
    description: "Flyers, web pages and decks in your brand, built from the catalogue.",
    status: "live",
    group: "core",
    agent: "Marketing",
  },
  {
    slug: "pricing",
    name: "Pricing",
    short: "Pricing",
    icon: "Tags",
    accent: "text-brand-soft",
    glow: "255,131,0",
    tagline: "Price with real data",
    description: "Live unit economics plus researched competitor prices.",
    status: "live",
    group: "core",
    agent: "Pricing",
  },
  {
    slug: "quotation",
    name: "Quotation",
    short: "Quotation",
    icon: "ReceiptText",
    accent: "text-brand-soft",
    glow: "255,131,0",
    tagline: "Quotes in seconds",
    description: "Bundle courses, housing and fees into a branded quote.",
    status: "live",
    group: "core",
    agent: "Quote",
  },
  {
    slug: "portfolio",
    name: "Portfolio",
    short: "Portfolio",
    icon: "LayoutGrid",
    accent: "text-brand-soft",
    glow: "255,131,0",
    tagline: "Every course at a glance",
    description: "Health and a clear next action for each programme.",
    status: "live",
    group: "core",
    agent: "Portfolio",
  },
  {
    slug: "think-lab",
    name: "Think Lab",
    short: "Think Lab",
    icon: "FlaskConical",
    accent: "text-brand-soft",
    glow: "255,131,0",
    tagline: "Idea → MVP",
    description: "Turn a rough idea into a testable plan.",
    status: "live",
    group: "core",
    agent: "Strategy",
  },
  {
    slug: "analytics",
    name: "Analytics",
    short: "Analytics",
    icon: "LineChart",
    accent: "text-brand-soft",
    glow: "255,131,0",
    tagline: "Patterns in your data",
    description: "Cohorts, funnels and trends — with confidence, not guesses.",
    status: "beta",
    group: "core",
    agent: "Analytics",
  },
  {
    slug: "feedback",
    name: "Feedback",
    short: "Feedback",
    icon: "MessagesSquare",
    accent: "text-brand-soft",
    glow: "255,131,0",
    tagline: "Feedback → decisions",
    description: "Themes, sentiment and NPS/CSAT/CES from your surveys.",
    status: "beta",
    group: "core",
    agent: "Feedback",
  },
  // Soon
  {
    slug: "roadmap",
    name: "Roadmap",
    short: "Roadmap",
    icon: "Map",
    accent: "text-ink-soft",
    glow: "255,131,0",
    tagline: "Plan releases",
    description: "Turn priorities into a sequenced plan.",
    status: "next",
    group: "planned",
    agent: "Roadmap",
  },
  {
    slug: "prioritization",
    name: "Prioritize",
    short: "Prioritize",
    icon: "ListChecks",
    accent: "text-ink-soft",
    glow: "255,131,0",
    tagline: "Rank what's next",
    description: "Score ideas so the roadmap writes itself.",
    status: "next",
    group: "planned",
    agent: "Prioritization",
  },
  {
    slug: "strategy",
    name: "Strategy",
    short: "Strategy",
    icon: "Target",
    accent: "text-ink-soft",
    glow: "255,131,0",
    tagline: "Goals & OKRs",
    description: "Tie every decision to an outcome.",
    status: "next",
    group: "planned",
    agent: "Strategy",
  },
];

export const CORE_MODULES = MODULES.filter((m) => m.group === "core");
export const PLANNED_MODULES = MODULES.filter((m) => m.group === "planned");

export function getModule(slug: string): ModuleDef | undefined {
  return MODULES.find((m) => m.slug === slug);
}
