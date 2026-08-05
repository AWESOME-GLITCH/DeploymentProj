import type { Product } from "./knowledge";

/** The one ES World flyer format. Every flyer — from Flow or the Marketing
 *  module — is produced to this shape, so they all look and read the same. */
export type Flyer = {
  courseName: string;
  headline: string; // punchy hook
  subheadline: string; // one-line promise
  keyFacts: { label: string; value: string }[]; // scannable facts box
  included: string[]; // what's included
  benefits: string[]; // why choose
  audience: string; // who it's for
  accreditations: string[]; // trust marks that genuinely apply
  offer: string; // current promo, or ""
  cta: string; // call to action
  contact: string; // esworld.com + phone/campus
  motif: string; // Experience · Grow · Enjoy
};

/** The template marketing fills for every flyer — shown in the UI so the PM
 *  always knows exactly what a flyer needs. Order matches the layout. */
export const FLYER_TEMPLATE: { key: keyof Flyer; label: string; hint: string }[] = [
  { key: "courseName", label: "Course name", hint: "The exact programme name" },
  { key: "headline", label: "Headline", hint: "One punchy hook — the reason to stop and read" },
  { key: "subheadline", label: "Subheadline", hint: "One line that says the promise / outcome" },
  { key: "keyFacts", label: "Key facts", hint: "Levels · Format/Duration · Schedule · Campus · Intake · Price" },
  { key: "included", label: "What's included", hint: "2–4 concrete things the learner gets" },
  { key: "benefits", label: "Why choose", hint: "3–4 benefit points, not features" },
  { key: "audience", label: "Who it's for", hint: "The target learner in one line" },
  { key: "accreditations", label: "Accreditation & trust marks", hint: "IELTS / Pearson / ATHE / Dubai Knowledge — only those that apply" },
  { key: "offer", label: "Offer (optional)", hint: "A current promo, if any" },
  { key: "cta", label: "Call to action", hint: "What to do next — include esworld.com" },
  { key: "contact", label: "Contact", hint: "esworld.com, phone, campus" },
  { key: "motif", label: "Brand motif", hint: "Experience · Grow · Enjoy" },
];

/** The JSON spec handed to the agent so it fills the template exactly. */
export const FLYER_SPEC = `"flyer": {
  "courseName": string,
  "headline": string (one punchy hook, on-brand),
  "subheadline": string (one line — the promise / outcome),
  "keyFacts": [ { "label": string, "value": string } ] (4-6 scannable facts in this order where known: Levels, Format/Duration, Schedule, Campus, Intake/Start, Price — copy the price exactly from knowledge or "[TBC]", never invent),
  "included": string[] (2-4 concrete things the learner gets),
  "benefits": string[] (3-4 benefit-led "why choose" points),
  "audience": string (who it's for, one line),
  "accreditations": string[] (only trust marks that genuinely apply — e.g. "IELTS Official Test Centre", "Pearson", "ATHE Level 4/5", "Dubai Knowledge"; omit any that don't),
  "offer": string (a current promo if there is one, else ""),
  "cta": string (a clear call to action, include esworld.com),
  "contact": string (esworld.com + phone/campus),
  "motif": "Experience · Grow · Enjoy"
}`;

/** Build a flyer straight from a programme record (demo / auto-populate). */
export function flyerFromProduct(p?: Product | null): Flyer {
  const name = p?.name || "New offering";
  const facts: { label: string; value: string }[] = [];
  if (p?.levels) facts.push({ label: "Levels", value: p.levels });
  if (p?.format) facts.push({ label: "Format", value: p.format });
  if (p?.schedule) facts.push({ label: "Schedule", value: p.schedule });
  if (p?.campus) facts.push({ label: "Campus", value: p.campus });
  if (p?.intakes) facts.push({ label: "Intake", value: p.intakes });
  if (p?.price) facts.push({ label: "Price", value: p.price });
  return {
    courseName: name,
    headline: `${name} — Experience · Grow · Enjoy`,
    subheadline: p?.oneLiner || p?.overview?.split(".")[0] || "",
    keyFacts: facts.length ? facts : [{ label: "Details", value: "[TBC]" }],
    included: (p?.materials ? [p.materials] : []).concat((p?.outcomes || []).slice(0, 3)),
    benefits: (p?.whyChoose || p?.focus || p?.outcomes || []).slice(0, 4),
    audience: p?.audience || "[TBC]",
    accreditations: (p?.accreditation ? [p.accreditation] : []).filter(Boolean),
    offer: "",
    cta: "Book a free consultation at esworld.com",
    contact: "esworld.com · +971 (0) 4 398 2815 · JLT, Dubai",
    motif: "Experience · Grow · Enjoy",
  };
}

/** Render a flyer to export HTML in the canonical order. */
export function flyerToHtml(f: Flyer): string {
  const kv = (label: string, value: string) => `<tr><td style="font-weight:600;padding-right:12px">${label}</td><td>${value}</td></tr>`;
  return (
    `<h1 style="color:#FF8300">${f.courseName}</h1>` +
    `<h2>${f.headline}</h2>` +
    `<p><em>${f.subheadline}</em></p>` +
    (f.keyFacts?.length ? `<h3>Key facts</h3><table>${f.keyFacts.map((k) => kv(k.label, k.value)).join("")}</table>` : "") +
    (f.included?.length ? `<h3>What's included</h3><ul>${f.included.map((x) => `<li>${x}</li>`).join("")}</ul>` : "") +
    (f.benefits?.length ? `<h3>Why choose</h3><ul>${f.benefits.map((x) => `<li>${x}</li>`).join("")}</ul>` : "") +
    (f.audience ? `<p><b>Who it's for:</b> ${f.audience}</p>` : "") +
    (f.accreditations?.length ? `<p><b>Accreditation:</b> ${f.accreditations.join(" · ")}</p>` : "") +
    (f.offer ? `<p><b>Offer:</b> ${f.offer}</p>` : "") +
    `<p><b>${f.cta}</b></p>` +
    `<p style="color:#666">${f.contact}</p>` +
    `<p style="color:#FF8300;font-weight:600">${f.motif}</p>`
  );
}
