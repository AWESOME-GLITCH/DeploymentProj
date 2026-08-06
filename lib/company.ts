// ES World company memory, distilled from the official documents:
//   • Product Strategy            ESD-PRD-STR-PLN-001-PMS-V1
//   • Product Management SOP       ESD-PRD-PRC-001-SOP-V1.0
//   • Product Proposal Form        ESD-PRD-FRM-001-PMS-V2.1
// This is the single strategic source of truth every module is grounded in.

export const MISSION = "Empowering individuals through high-quality education and cultural immersion experiences.";
export const VISION =
  "To grow beyond English-language teaching into higher education, opening recognised academic pathways for learners and, in time, developing ES World's own national qualifications in the UAE. ATHE is the first step on that journey.";

export const BELIEFS = [
  "High-quality education is the foundation, accredited, CEFR-aligned teaching is what learners and institutions trust and pay for.",
  "Our future is higher education and our own qualifications, recognised credentials (starting with ATHE) take learners further than language classes alone.",
  "Cultural immersion is part of the product, a presence in both Dubai and London lets learners study and live the culture.",
  "AZE sets us apart, our own placement test is a capability teaching-only competitors don't have, and our entry into assessment as a product.",
];

export const SEGMENTS = [
  { who: "Learners (B2C)", values: "Outcomes, recognised results, flexible formats, fair price" },
  { who: "Agents", values: "Reliable products, clear commission, easy enrolment, fast support" },
  { who: "Institutions & universities (B2B)", values: "Validated assessment, pathway recognition, smooth partnership delivery" },
  { who: "Government (B2G)", values: "Compliance, accuracy thresholds, security, documented rigour" },
];

export const COMPETITORS = [
  "Course providers: British Council, EC English, Kaplan, Headway",
  "Assessment incumbents: IELTS, TOEFL",
  "Digital challengers: Duolingo English Test (convenience + price)",
];

export const PORTFOLIO = [
  { family: "Programmes", role: "Build the learner relationship + core revenue, and open the pathway from English into higher education", examples: "English courses, ATHE diplomas, evening & intensive formats, ES Readers" },
  { family: "Assessment", role: "Build credibility through CEFR-aligned validity institutions and governments trust", examples: "CEFR-aligned testing, level placement, reporting" },
  { family: "AZE (new frontier)", role: "Entry into a new product space, internal placement test today, differentiated assessment offering in time", examples: "AZE placement test" },
];

export const PILLARS = [
  "From English into higher education & national qualifications (ATHE first, then university partnerships, then own UAE qualifications).",
  "AZE: a new assessment capability (CEFR-aligned placement today; assessment product in time).",
  "Flexible learning & immersion (intensive, evening, on-demand across Dubai & London).",
  "Institutional & government channels (rigorous, compliant, well-documented B2B/B2G).",
];

export const WHY_WE_WIN = [
  "A pathway into higher education, accredited qualifications that take learners beyond English.",
  "Cultural immersion across two cities, Dubai and London.",
  "A new assessment capability (AZE) teaching-only competitors don't have.",
  "One company, two markets, Dubai and London serving connected study & migration routes.",
];

export const ROADMAP = [
  { horizon: "Now", themes: "Stabilise & rebuild after regional disruption; strengthen core English; establish ATHE L4/L5 as the first HE step; standardise the product process; confirm pricing across both locations." },
  { horizon: "Next", themes: "Build out the HE pathway (further levels + university partnerships); groundwork for national qualifications; grow flexible & immersion formats; keep developing AZE." },
  { horizon: "Later", themes: "Develop UAE-recognised national qualifications; broaden HE towards degree-level partnerships; assess new markets and wider AZE use." },
];

// The 5-step gated product process (SOP). Flow orchestrates these steps.
export const PROCESS = [
  { step: 1, name: "Propose", what: "Submit the Product Proposal Form; assess fit vs mission/strategy, market need, feasibility.", gate: "Gate 1 · CCO approval to develop" },
  { step: 2, name: "Develop", what: "Set a short Development Brief (outcomes, scope, timeline, resources, accreditation need); build the product.", gate: "No gate" },
  { step: 3, name: "Validate", what: "Pilot with a small group, address feedback, confirm scope; academic sign-off for accredited/CEFR products.", gate: "Gate 2 · CCO approval to launch" },
  { step: 4, name: "Launch", what: "Readiness plan: final materials, pricing & admissions, sales/staff training, systems hand-off; go live and monitor.", gate: "No gate" },
  { step: 5, name: "Review & improve", what: "Post-launch survey within one term, track performance, log changes.", gate: "Gate 3 · continue, improve, or retire" },
];

export const ROLES = [
  "Product Manager, owns the product end to end, runs every step, single point of accountability.",
  "Chief Commercial Officer (CCO), the single approver, signs off at each gate.",
  "Academics, owns content, pedagogy, accreditation; can propose products; briefs systems directly.",
  "Sales, sells products, meets targets, proposes from market demand, feeds back what customers want.",
];

// The official Product Proposal Form (Step 1), the exact structure proposals must follow.
export const PROPOSAL_FORM_SECTIONS = [
  "Basic information (title, campus: Dubai/London/Both/Online, differences by campus, proposed launch date, target learners, proposed by: Academics/Sales/Management)",
  "1. Overview (product description, alignment with mission & which strategic pillar, pedagogical innovation, product type: Certificate/Diploma/Short course/Workshop, access: open/cohort, schedule)",
  "2. Pathway (primary pathway: Access to English / Access to Education / Access to Work; the learner outcome; does it lead to further pathways)",
  "3. Curriculum & content (curriculum outline, learning outcomes, assessment methods, accreditation/compliance need)",
  "4. Development, resources & materials (academic team, faculty requirements, development timeline, facilities/tech, in-house vs external materials, distribution, external providers + costs)",
  "5. Student entry requirements & experience (prerequisites, min English level, age, background, extra costs, class size, delivery: In-person/Online/Hybrid, support services, engagement)",
  "6. Commercial sizing (expected first-year enrolments, proposed fee/price, USD for Dubai, GBP for London, basic viability note)",
  "7. Quality assurance & evaluation (quality standards, feedback collection, continuous improvement)",
  "8. Risk & mitigation (identified risks, mitigation strategies)",
  "9. Approval (PM assessment, C-suite approval at Gate 1)",
  "10. Next steps after approval (academics: detailed curriculum + timetable; PM: demand review, marketing support, launch date)",
];

/** Compact strategic memory sent to every agent so all output is on-strategy,
 *  on-process, and true to ES World. Kept token-bounded on purpose. */
export const COMPANY_MEMORY = `ES WORLD, COMPANY MEMORY (strategic source of truth; keep all output true to this).
Campuses: Dubai (JLT, JBR) and London. Pricing is per location, USD for Dubai, GBP for London.
MISSION: ${MISSION}
VISION: ${VISION}
BELIEFS: ${BELIEFS.map((b) => "• " + b).join(" ")}
MARKET: English learning + assessment, driven by migration, study abroad, employment and government skills agendas. UAE (Dubai): strong demand incl. government procurement; price and quality both matter. UK (London): mature market, differentiate on accredited pathways + assessment credibility, not price. Near-term priority: recover from recent regional disruption.
COMPETITORS: ${COMPETITORS.join("; ")}. We win on the COMBINATION: accredited learning + assessment credibility + cultural immersion across two cities.
SEGMENTS: ${SEGMENTS.map((s) => `${s.who}, ${s.values}`).join("; ")}.
PORTFOLIO: ${PORTFOLIO.map((p) => `${p.family} (${p.role})`).join("; ")}.
STRATEGIC PILLARS: ${PILLARS.map((p, i) => `${i + 1}) ${p}`).join(" ")}
WHY WE WIN: ${WHY_WE_WIN.join("; ")}.
PRODUCT PROCESS (5 gated steps): ${PROCESS.map((s) => `${s.step}. ${s.name}, ${s.what} [${s.gate}]`).join("  ")}
ROLES: ${ROLES.join(" ")}
Every new product should fit a strategic pillar and a segment, name its pathway (Access to English / Education / Work), and respect accreditation/compliance where relevant.`;
