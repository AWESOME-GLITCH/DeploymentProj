// Inline the pre-rendered cast into a standalone prototype.
// Usage: node docs/prototypes/src/build.mjs 01-talk-with-maya
// Replaces every <!--cast:NAME--> in docs/prototypes/src/<file>.html with the SVG
// from docs/design/cast/NAME.svg, stripped of metadata and given unique ids, and
// writes the one-file result to docs/prototypes/<file>.html.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../../..");
const name = process.argv[2];
if (!name) { console.error("usage: node docs/prototypes/src/build.mjs <file-stem>"); process.exit(1); }

const src = fs.readFileSync(path.join(root, "docs/prototypes/src", `${name}.html`), "utf8");

const inline = (cast, n) => {
  let svg = fs.readFileSync(path.join(root, "docs/design/cast", `${cast}.svg`), "utf8");
  svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/g, "");
  svg = svg.replace(/\s(?:width|height)="\d+"/g, "");
  // Every pre-rendered file reuses the same ids, so scope them to this copy.
  for (const id of new Set([...svg.matchAll(/id="([^"]+)"/g)].map((m) => m[1]))) {
    svg = svg.split(`id="${id}"`).join(`id="${id}-${n}"`).split(`url(#${id})`).join(`url(#${id}-${n})`);
  }
  return svg.replace("<svg ", `<svg class="art" aria-hidden="true" focusable="false" `).trim();
};

let n = 0;
const out = src.replace(/<!--cast:([a-z0-9-]+)-->/g, (_, cast) => inline(cast, ++n));

const dest = path.join(root, "docs/prototypes", `${name}.html`);
fs.writeFileSync(dest, out);
console.log(`${dest}  ${(out.length / 1024).toFixed(0)} kB, ${n} cast files inlined`);
