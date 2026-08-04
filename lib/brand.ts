// ES World Brand Standards 2026 V1.0 — encoded so the Marketing agent produces
// brand-compliant output and the app reflects the real visual identity.

export const BRAND_STANDARDS = {
  colors: {
    orange: "#FF8300", // headings, key titles, accent lines, highlighted labels
    black: "#000000", // all body text, captions, sub-headings, emphasis
    white: "#FFFFFF", // page background, text on dark/colored backgrounds
    grey: "#F5F5F5", // alternating table rows
    border: "#DDDDDD", // table borders
  },
  typography: {
    family: "Calibri Light",
    docTitle: "Calibri Light Bold · 18pt · Orange",
    h1: "Calibri Light Bold · 16pt · Orange",
    h2: "Calibri Light Bold · 12pt · Black",
    body: "Calibri Light · 11pt · Black",
    caption: "Calibri Light · 10pt · Black",
  },
  rules: [
    "Stick to the palette: Brand Orange (#FF8300), Text Black (#000000), White. No exceptions.",
    "Follow the hierarchy: Calibri Light styling and sizes exactly as defined.",
    "Pick the right tool: match the objective to the correct document type in the 3-tier ecosystem.",
    "Honor the layout: respect margins, headers, tables and coding anatomy.",
  ],
  donts: [
    "No other fonts (Times New Roman, Arial, etc.).",
    "No alternative colours or text grey for brand elements.",
    "No manual bullet characters (-, *, •) — use built-in list styles.",
    "Never resize or crop the official letterhead image.",
  ],
  // Document code: e.g. ESL-MKT-FLY-001-XX-V1.0
  docCode: {
    company: "ESL",
    pattern: "ESL-[DEPT]-[TYPE]-[###]-[INITIALS]-V[X.Y]",
    departments: {
      ACA: "Academics",
      CUS: "Customer Service",
      FIN: "Finance",
      CL: "C-Level",
      HRD: "Human Resources",
      IST: "Information Systems",
      MKT: "Marketing",
      OPF: "Operations & Facilities",
      PRM: "Procurement",
      QAS: "Quality Assurance",
      RND: "Research & Development",
      SAL: "Sales",
      TLA: "Legal",
    } as Record<string, string>,
  },
  tiers: [
    { name: "Strategic & Governance", detail: "Direction, principles, critical decisions (Strategic Plan, Policy, Board Minutes)." },
    { name: "Operational Execution", detail: "Guides, procedures, instructions that power daily operations." },
    { name: "Administrative & Communication", detail: "Data capture, org clarity, formal correspondence (Forms, Letters)." },
  ],
};

// Prompt fragment injected into the Marketing agent so drafts respect the brand.
export const BRAND_SYSTEM_FRAGMENT = `You must follow ES World Brand Standards 2026:
- Voice: warm, encouraging, professional. Motif "Experience · Grow · Enjoy".
- Palette (for any styling notes): Brand Orange #FF8300 for headings, Text Black #000000 for body, White backgrounds. Never substitute colours.
- Typography (for any styling notes): Calibri Light; headings bold orange, body 11pt black.
- Never invent facts about a course; use only the provided product knowledge. If a fact is missing, insert a clearly marked [PLACEHOLDER].`;
