// The official ES World Product Proposal Form (ESD-PRD-FRM-001-PMS-V2.1),
// modelled 1:1 so proposals and new Flow/Think Lab products come out in the
// exact format that goes into the process at Step 1 (Propose).

export type ProposalForm = {
  // Basic information
  title: string;
  proposedBy: string; // Academics / Sales / Management (+ name/department)
  campus: string; // ES World Dubai / London / Both / Online
  campusDifferences: string; // pricing/schedule/delivery differences, or "None"
  proposedLaunchDate: string;
  targetLearners: string;
  // 1. Overview
  description: string;
  missionAlignment: string; // how it fits mission + which strategic pillar
  pedagogicalInnovation: string;
  productType: string; // Certificate / Diploma / Short course / Workshop / Other
  access: string; // Open enrolment / Cohort-based (+ admission criteria)
  schedule: string; // Year-round (rolling) / Specific start dates (+ frequency)
  // 2. Pathway
  pathway: string; // Access to English / Access to Education / Access to Work
  learnerOutcome: string;
  furtherPathways: string; // progression routes / university credit / employment
  // 3. Curriculum and content
  curriculumOutline: string;
  learningOutcomes: string[];
  assessmentMethods: string;
  accreditation: string; // accreditation / standards / compliance need, or "None"
  // 4. Development, resources and materials
  developmentResources: string; // team, faculty, timeline, materials, providers
  // 5. Student entry requirements and experience
  entryRequirements: string; // prerequisites, English level, age, background, extra costs
  deliveryFormat: string; // In-person / Online / Hybrid (+ class size, support)
  // 6. Commercial sizing
  expectedEnrolments: string; // first year
  proposedFee: string; // USD for Dubai, GBP for London
  viabilityNote: string;
  // 7. Quality assurance and evaluation
  qualityAssurance: string;
  // 8. Risk and mitigation
  risks: { risk: string; mitigation: string }[];
  // 9/10. Approval & next steps (PM assessment / recommended decision)
  recommendation: string;
};

/** The section map used to render and export the form in the official order. */
export const PROPOSAL_FORM_LAYOUT: { section: string; fields: { key: keyof ProposalForm; label: string }[] }[] = [
  {
    section: "Basic information",
    fields: [
      { key: "title", label: "Course / product title" },
      { key: "proposedBy", label: "Proposed by" },
      { key: "campus", label: "Campus" },
      { key: "campusDifferences", label: "Differences by campus" },
      { key: "proposedLaunchDate", label: "Proposed launch date" },
      { key: "targetLearners", label: "Target learners" },
    ],
  },
  {
    section: "1. Overview",
    fields: [
      { key: "description", label: "Product description" },
      { key: "missionAlignment", label: "Alignment with mission & strategic pillar" },
      { key: "pedagogicalInnovation", label: "Pedagogical innovation" },
      { key: "productType", label: "Product type" },
      { key: "access", label: "Access" },
      { key: "schedule", label: "Schedule" },
    ],
  },
  {
    section: "2. Pathway",
    fields: [
      { key: "pathway", label: "Primary pathway" },
      { key: "learnerOutcome", label: "Learner outcome" },
      { key: "furtherPathways", label: "Leads to further pathways" },
    ],
  },
  {
    section: "3. Curriculum & content",
    fields: [
      { key: "curriculumOutline", label: "Curriculum outline" },
      { key: "assessmentMethods", label: "Assessment methods" },
      { key: "accreditation", label: "Accreditation / compliance" },
    ],
  },
  {
    section: "4. Development, resources & materials",
    fields: [{ key: "developmentResources", label: "Development, faculty, timeline & materials" }],
  },
  {
    section: "5. Student entry requirements & experience",
    fields: [
      { key: "entryRequirements", label: "Entry requirements & costs" },
      { key: "deliveryFormat", label: "Delivery format, class size & support" },
    ],
  },
  {
    section: "6. Commercial sizing",
    fields: [
      { key: "expectedEnrolments", label: "Expected enrolments (first year)" },
      { key: "proposedFee", label: "Proposed fee (USD Dubai / GBP London)" },
      { key: "viabilityNote", label: "Basic viability note" },
    ],
  },
  {
    section: "7. Quality assurance & evaluation",
    fields: [{ key: "qualityAssurance", label: "Quality standards, feedback & improvement" }],
  },
];

/** The JSON spec handed to the agent so it fills the form exactly. */
export const PROPOSAL_FORM_SPEC = `{
  "title": string,
  "proposedBy": string (Academics / Sales / Management, + name or department),
  "campus": string (ES World Dubai / ES World London / Both / Online),
  "campusDifferences": string (pricing/schedule/delivery differences, or "None"),
  "proposedLaunchDate": string,
  "targetLearners": string,
  "description": string (educational goals, objectives, pedagogical approach, structure),
  "missionAlignment": string (how it fits high-quality education + cultural immersion, and WHICH strategic pillar),
  "pedagogicalInnovation": string (or "None"),
  "productType": string (Certificate / Diploma / Short course / Workshop / Other),
  "access": string (Open enrolment / Cohort-based + admission criteria),
  "schedule": string (Year-round rolling / Specific start dates + frequency),
  "pathway": string (Access to English / Access to Education / Access to Work),
  "learnerOutcome": string (the outcome this gives the learner),
  "furtherPathways": string (advanced courses / progression / university credit / employment, or "None"),
  "curriculumOutline": string (content, modules, progression),
  "learningOutcomes": string[] (measurable outcomes),
  "assessmentMethods": string,
  "accreditation": string (accreditation/standards/compliance need, or "None"),
  "developmentResources": string (academic team, faculty requirements, development timeline, in-house/external materials, providers & costs),
  "entryRequirements": string (prerequisites, min English level, age, background, extra costs beyond tuition),
  "deliveryFormat": string (In-person / Online / Hybrid, expected class size, support services),
  "expectedEnrolments": string (first-year estimate),
  "proposedFee": string (USD for Dubai, GBP for London — copy real prices from knowledge or "[TBC]", never invent),
  "viabilityNote": string (short view on whether the numbers work),
  "qualityAssurance": string (quality standards, feedback collection, continuous improvement),
  "risks": [ { "risk": string, "mitigation": string } ] (2-4),
  "recommendation": string (PM assessment + recommended decision for the CCO at Gate 1)
}`;

const TBC = "[TBC]";

/** A blank-but-structured form (used in demo mode so the layout is always visible). */
export function demoProposalForm(title: string): ProposalForm {
  return {
    title: title || "New product proposal",
    proposedBy: "Product Management",
    campus: "ES World Dubai",
    campusDifferences: "None",
    proposedLaunchDate: TBC,
    targetLearners: TBC,
    description: "[Demo] Add an ANTHROPIC_API_KEY to fill this from your input and Knowledge. This is the official Product Proposal Form structure.",
    missionAlignment: TBC,
    pedagogicalInnovation: "None",
    productType: TBC,
    access: TBC,
    schedule: TBC,
    pathway: TBC,
    learnerOutcome: TBC,
    furtherPathways: "None",
    curriculumOutline: TBC,
    learningOutcomes: [TBC],
    assessmentMethods: TBC,
    accreditation: "None",
    developmentResources: TBC,
    entryRequirements: TBC,
    deliveryFormat: TBC,
    expectedEnrolments: TBC,
    proposedFee: TBC,
    viabilityNote: TBC,
    qualityAssurance: TBC,
    risks: [{ risk: TBC, mitigation: TBC }],
    recommendation: "Approve a small pilot to validate demand before full launch.",
  };
}

/** Render the form to export HTML in the official order. */
export function proposalFormToHtml(f: ProposalForm): string {
  const row = (label: string, value: string) => `<h3>${label}</h3><p>${(value || TBC).replace(/\n/g, "<br/>")}</p>`;
  let s = `<h1 style="color:#FF8300">${f.title}</h1><p><em>ES World · Product Proposal Form</em></p>`;
  for (const grp of PROPOSAL_FORM_LAYOUT) {
    s += `<h2>${grp.section}</h2>`;
    for (const fl of grp.fields) {
      const v = f[fl.key];
      s += row(fl.label, Array.isArray(v) ? v.join("; ") : String(v ?? TBC));
    }
    if (grp.section.startsWith("3.")) s += `<h3>Learning outcomes</h3><ul>${f.learningOutcomes.map((o) => `<li>${o}</li>`).join("")}</ul>`;
  }
  s += `<h2>8. Risk & mitigation</h2><table><tr><th>Risk</th><th>Mitigation</th></tr>${f.risks
    .map((r) => `<tr><td>${r.risk}</td><td>${r.mitigation}</td></tr>`)
    .join("")}</table>`;
  s += `<h2>9–10. Approval & next steps</h2><p>${f.recommendation}</p>`;
  return s;
}
