// LEA-38 (LP-46) scratch check: every registered atom's EXPLAINER export has the
// shape ExplainerPlayer needs, its beats are contiguous, every pauseAt sits
// strictly inside its own beat, and the L1 map covers every beat id in all six
// languages. Deleted after the run; not part of the app.
require("sucrase/register");
const React = require("react");
globalThis.React = React;
global.React = React;

const FILES = {
  "ATM-A1-SPK-0005": "../../components/learning-path/explainer/ATM_A1_SPK_0005.tsx",
  "ATM-A2-GRM-0002": "../../components/learning-path/explainer/ATM_A2_GRM_0002.tsx",
  "ATM-A2-GRM-0003": "../../components/learning-path/explainer/ATM_A2_GRM_0003.tsx",
  "ATM-A2-LST-0004": "../../components/learning-path/explainer/ATM_A2_LST_0004.tsx",
  "ATM-A2-RDG-0006": "../../components/learning-path/explainer/ATM_A2_RDG_0006.tsx",
  "ATM-A2-WRT-0007": "../../components/learning-path/explainer/ATM_A2_WRT_0007.tsx",
  "ATM-A2-MED-0008": "../../components/learning-path/explainer/ATM_A2_MED_0008.tsx",
  "ATM-A2-INT-0009": "../../components/learning-path/explainer/ATM_A2_INT_0009.tsx",
  "ATM-A2-INT-0010": "../../components/learning-path/explainer/ATM_A2_INT_0010.tsx",
};
const LANGS = ["ar", "es", "hi", "ru", "tr", "zh"];

// The player's own ask derivation, copied so the check does not import the
// client component (lucide and @remotion/player are browser-only).
function asksFor(beats) {
  const out = [];
  let n = 0;
  for (const b of beats) {
    if (b.kind === "recap" || b.kind === "hook") continue;
    if (!b.target || !b.target.length) continue;
    const at = b.pauseAt != null ? b.pauseAt : Math.max(b.from + 30, b.to - 12);
    const kind = b.kind === "practise" ? "say" : b.kind === "explain" ? "tap" : n === 0 ? "tap" : "say";
    out.push({ id: b.id, at, kind });
    n += 1;
  }
  return out;
}

const cafe = require("../../components/learning-path/explainer/Cafe.tsx");
const defs = { "ATM-A2-INT-0001": { component: cafe.CafeExplainer, beats: cafe.CAFE_BEATS, duration: cafe.CAFE_DURATION, l1: cafe.CAFE_L1 } };
for (const [id, rel] of Object.entries(FILES)) defs[id] = require(rel).EXPLAINER;

let bad = 0;
const fail = (id, msg) => { bad += 1; console.log(`FAIL ${id}: ${msg}`); };

for (const [id, d] of Object.entries(defs)) {
  if (typeof d.component !== "function") fail(id, "component is not a function");
  if (!Array.isArray(d.beats) || !d.beats.length) fail(id, "no beats");
  if (typeof d.duration !== "number" || d.duration <= 0) fail(id, "bad duration");
  if (!d.l1 || typeof d.l1 !== "object") fail(id, "no l1 map");

  const ids = d.beats.map((b) => b.id);
  if (new Set(ids).size !== ids.length) fail(id, "duplicate beat ids");
  d.beats.forEach((b, i) => {
    if (b.to <= b.from) fail(id, `${b.id}: to <= from`);
    if (i && b.from !== d.beats[i - 1].to) fail(id, `${b.id}: gap or overlap at ${b.from}`);
    if (b.pauseAt != null && !(b.pauseAt > b.from && b.pauseAt < b.to)) fail(id, `${b.id}: pauseAt ${b.pauseAt} outside [${b.from}, ${b.to})`);
    if (!b.line || !b.line.trim()) fail(id, `${b.id}: empty line`);
  });
  if (d.beats[0].from !== 0) fail(id, "first beat does not start at 0");
  if (d.beats[d.beats.length - 1].to !== d.duration) fail(id, `last beat ends ${d.beats[d.beats.length - 1].to}, duration ${d.duration}`);

  for (const lang of LANGS) {
    const m = d.l1[lang];
    if (!m) { fail(id, `l1 missing ${lang}`); continue; }
    const missing = ids.filter((b) => !m[b]);
    if (missing.length) fail(id, `l1.${lang} missing beats ${missing.join(", ")}`);
    const extra = Object.keys(m).filter((k) => !ids.includes(k));
    if (extra.length) fail(id, `l1.${lang} has unknown beats ${extra.join(", ")}`);
  }

  const asks = asksFor(d.beats);
  const practise = d.beats.filter((b) => b.kind === "practise");
  for (const p of practise) {
    const a = asks.find((x) => x.id === p.id);
    if (!a) fail(id, `practise beat ${p.id} drives no ask, so the mic never opens`);
    else if (a.kind !== "say") fail(id, `practise beat ${p.id} asks for ${a.kind}, not say`);
  }
  if (!practise.length) fail(id, "no practise beat, so no mic");
  console.log(`ok   ${id}  beats=${d.beats.length} duration=${d.duration} kinds=${[...new Set(d.beats.map((b) => b.kind))].join("/")} asks=${asks.map((a) => `${a.id}:${a.kind}@${a.at}`).join(" ")}`);
}
console.log(bad ? `\n${bad} problem(s)` : `\nall ${Object.keys(defs).length} registered atoms pass`);
process.exit(bad ? 1 : 0);
