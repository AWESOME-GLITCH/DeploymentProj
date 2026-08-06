// ES World team directory, powers the "who does what" action board in Launch Flow.

export type Person = {
  name: string;
  role: string;
  dept: string;
  area?: string; // sales regions
  rarelyNeeded?: boolean;
};

export const TEAM: Person[] = [
  // Product (the user)
  { name: "You", role: "Head of Product", dept: "Product" },

  // Executive
  { name: "Daniel", role: "CEO", dept: "Executive" },
  { name: "Montse", role: "CEO", dept: "Executive" },

  // Sales leadership
  { name: "Magda", role: "Sales Director", dept: "Sales Leadership" },

  // Sales, by region
  { name: "Nook", role: "Sales", dept: "Sales", area: "Thailand" },
  { name: "Miew", role: "Sales", dept: "Sales", area: "Thailand" },
  { name: "Anna", role: "Sales", dept: "Sales", area: "Russia / CIS" },
  { name: "Olga", role: "Sales", dept: "Sales", area: "Russia / CIS" },
  { name: "Chisato", role: "Sales", dept: "Sales", area: "Japan" },
  { name: "Amy", role: "Sales", dept: "Sales", area: "China" },
  { name: "Ramtin", role: "Sales", dept: "Sales", area: "MENA" },
  { name: "Safa", role: "Sales", dept: "Sales", area: "MENA" },
  { name: "Alejandra", role: "Sales", dept: "Sales", area: "LATAM" },
  { name: "Daiana", role: "Sales", dept: "Sales", area: "Brazil & Italy" },
  { name: "Lilya", role: "Sales", dept: "Sales", area: "North Africa & Europe" },
  { name: "Hakan", role: "Sales", dept: "Sales", area: "Turkey" },
  { name: "Rabia", role: "Sales", dept: "Sales", area: "Turkey" },

  // Academic
  { name: "Ryan", role: "Academic Director", dept: "Academic" },
  { name: "Nicky", role: "Academic (Dubai)", dept: "Academic", area: "Dubai" },
  { name: "Majid", role: "Academic (Dubai)", dept: "Academic", area: "Dubai" },
  { name: "Ben", role: "Academic (London)", dept: "Academic", area: "London" },
  { name: "Tagird", role: "Academic (London)", dept: "Academic", area: "London" },

  // Campus
  { name: "Niel", role: "London Campus Director", dept: "Campus", area: "London" },

  // Functions
  { name: "Kavita", role: "Operations", dept: "Operations" },
  { name: "Ivana", role: "Admissions", dept: "Admissions" },
  { name: "Josef", role: "Admissions", dept: "Admissions" },
  { name: "Esteban", role: "Systems", dept: "Systems" },
  { name: "Natalia", role: "Branding", dept: "Branding" },
  { name: "Adam", role: "Digital Marketing", dept: "Digital Marketing" },
  { name: "Jessica", role: "Accommodation", dept: "Accommodation" },
  { name: "Christian", role: "Finance", dept: "Finance" },
  { name: "Reham", role: "Quality Assurance", dept: "QA" },
  { name: "Diego", role: "Procurement", dept: "Procurement" },
  { name: "Shoib", role: "HR", dept: "HR" },
  { name: "Anthony", role: "Camps", dept: "Camps", rarelyNeeded: true },
];

export const SALES_REGIONS = Array.from(new Set(TEAM.filter((p) => p.dept === "Sales").map((p) => p.area!)));

export function salesFor(region?: string): Person[] {
  if (!region || region === "All regions") return [];
  return TEAM.filter((p) => p.dept === "Sales" && p.area === region);
}

// Every flow action, its artifact shape (if any), and who owns it.
export type FlowActionKey =
  | "brief"
  | "pricing"
  | "flyer"
  | "presentation"
  | "website"
  | "proposal"
  | "sales"
  | "admissions"
  | "accommodation"
  | "operations"
  | "qa";

export type FlowAction = {
  key: FlowActionKey;
  label: string;
  produces: boolean; // does the agent generate an artifact for this?
  owners: { name: string; task: string }[];
};

export const FLOW_ACTIONS: FlowAction[] = [
  {
    key: "brief",
    label: "Product Brief",
    produces: true,
    owners: [
      { name: "You", task: "Own the brief and lock the scope" },
      { name: "Ryan", task: "Review academic accuracy & feasibility" },
    ],
  },
  {
    key: "pricing",
    label: "Pricing research",
    produces: true,
    owners: [
      { name: "Christian", task: "Confirm costs, margin & break-even" },
      { name: "Magda", task: "Sanity-check market price & discount policy" },
    ],
  },
  {
    key: "flyer",
    label: "Marketing flyer",
    produces: true,
    owners: [
      { name: "Adam", task: "Produce & publish the flyer" },
      { name: "Natalia", task: "Brand-compliance check" },
    ],
  },
  {
    key: "presentation",
    label: "Presentation content",
    produces: true,
    owners: [
      { name: "Natalia", task: "Design the deck" },
      { name: "Ryan", task: "Verify course content" },
    ],
  },
  {
    key: "website",
    label: "Website course page",
    produces: true,
    owners: [
      { name: "Adam", task: "Load the course-page content" },
      { name: "Esteban", task: "Publish on the site / CMS" },
    ],
  },
  {
    key: "proposal",
    label: "Proposal document",
    produces: true,
    owners: [
      { name: "You", task: "Draft the proposal" },
      { name: "Daniel", task: "Approve / sign off" },
      { name: "Montse", task: "Approve / sign off" },
    ],
  },
  {
    key: "sales",
    label: "Sales enablement",
    produces: false,
    owners: [{ name: "Magda", task: "Brief the sales team & set targets" }],
  },
  {
    key: "admissions",
    label: "Admissions readiness",
    produces: false,
    owners: [
      { name: "Ivana", task: "Prepare enrolment & documentation" },
      { name: "Josef", task: "Prepare enrolment & documentation" },
    ],
  },
  {
    key: "accommodation",
    label: "Accommodation",
    produces: false,
    owners: [{ name: "Jessica", task: "Confirm housing options & prices" }],
  },
  {
    key: "operations",
    label: "Operations & scheduling",
    produces: false,
    owners: [{ name: "Kavita", task: "Schedule rooms, teachers & logistics" }],
  },
  {
    key: "qa",
    label: "Quality check",
    produces: false,
    owners: [{ name: "Reham", task: "QA the materials & process" }],
  },
];

export type PlanItem = { name: string; role: string; task: string; action: string };

export function buildPlan(actionKeys: FlowActionKey[], region?: string): PlanItem[] {
  const items: PlanItem[] = [];
  for (const a of FLOW_ACTIONS.filter((x) => actionKeys.includes(x.key))) {
    for (const o of a.owners) {
      const person = TEAM.find((p) => p.name === o.name);
      items.push({ name: o.name, role: person?.role ?? "", task: o.task, action: a.label });
    }
    // regional sales get pulled in when sales enablement is selected
    if (a.key === "sales") {
      for (const s of salesFor(region)) {
        items.push({ name: s.name, role: `Sales · ${s.area}`, task: `Pitch to ${s.area} prospects`, action: a.label });
      }
    }
  }
  return items;
}
