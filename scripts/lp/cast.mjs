// Pre-render the cast (Open Peeps, CC0) and hero doodles (Open Doodles, CC0) in the brief's palette.
// Usage: node scripts/lp/cast.mjs  -> docs/design/cast/*.svg and docs/design/cast/index.html
import React from "react"; import { renderToStaticMarkup } from "react-dom/server";
import * as Doodles from "react-open-doodles";
import { createAvatar } from "@dicebear/core"; import * as openPeeps from "@dicebear/open-peeps";
import fs from "node:fs";
const out = "docs/design/cast"; fs.mkdirSync(out, { recursive: true });
const INK = "#121212", SUN = "#FFD93D", LILAC = "#CDB8FF", TANG = "#FF5A2D", MINT = "#A8F0C6", SKY = "#BFE3FF";
const cast = {
  maya:   { head: "bun",        skin: "d08b5b", cloth: "ffd93d", acc: [],           beard: [] },
  leo:    { head: "short3",     skin: "ffdbb4", cloth: "ff5a2d", acc: [],           beard: ["chin"] },
  fatima: { head: "hijab",      skin: "edb98a", cloth: "cdb8ff", acc: [],           beard: [] },
  sami:   { head: "dreads1",    skin: "694d3d", cloth: "a8f0c6", acc: ["glasses"],  beard: [] },
  you:    { head: "mediumBangs",skin: "ae5d29", cloth: "bfe3ff", acc: [],           beard: [] },
};
// Expression names map to Open Peeps faces so every screen uses the same vocabulary.
const faces = { idle: "smile", talk: "explaining", listen: "calm", happy: "smileBig", wow: "awe", think: "eyesClosed", oops: "concerned", laugh: "smileLOL", cheeky: "cheeky" };
let html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Learning Path Cast</title><style>body{font-family:"Plus Jakarta Sans",system-ui,sans-serif;background:#FFF7E8;color:#121212;margin:16px}h1{font-size:28px}h2{font-size:18px;margin:24px 0 8px}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}.c{border-radius:20px;padding:8px;display:flex;flex-direction:column;align-items:center;border:3px solid #121212}.c svg{width:100%;height:auto}.c b{font-size:11px;margin-top:4px}</style></head><body><h1>Cast and hero doodles</h1><p>Open Peeps and Open Doodles (both CC0), recoloured to the brief. Files in docs/design/cast/.</p>`;
for (const [name, c] of Object.entries(cast)) {
  html += `<h2>${name}</h2><div class="g">`;
  for (const [expr, face] of Object.entries(faces)) {
    const svg = createAvatar(openPeeps, { seed: name, size: 256, head: [c.head], face: [face], skinColor: [c.skin], clothingColor: [c.cloth], accessories: c.acc, accessoriesProbability: c.acc.length ? 100 : 0, facialHair: c.beard, facialHairProbability: c.beard.length ? 100 : 0, maskProbability: 0, backgroundColor: ["transparent"] }).toString();
    fs.writeFileSync(`${out}/${name}-${expr}.svg`, svg);
    html += `<div class="c" style="background:${[SUN, LILAC, TANG, MINT, SKY][Object.keys(cast).indexOf(name)]}">${svg}<b>${name} · ${expr}</b></div>`;
  }
  html += `</div>`;
}
html += `<h2>Hero doodles (full body)</h2><div class="g">`;
for (const n of Object.keys(Doodles).filter((k) => /^[A-Z]/.test(k))) {
  const svg = renderToStaticMarkup(React.createElement(Doodles[n], { ink: INK, accent: TANG }));
  fs.writeFileSync(`${out}/doodle-${n.replace(/Doodle$/, "").toLowerCase()}.svg`, svg);
  html += `<div class="c" style="background:${SUN}">${svg}<b>${n.replace(/Doodle$/, "")}</b></div>`;
}
html += `</div></body></html>`;
fs.writeFileSync(`${out}/index.html`, html);
console.log("cast files:", fs.readdirSync(out).length);
