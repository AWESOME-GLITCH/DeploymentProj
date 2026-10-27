// Build an inline SVG sprite from the pre-rendered cast in docs/design/cast/.
// The cast files all share internal ids (viewboxMask), so every id is prefixed
// per face before the file becomes a <symbol>. Output goes to stdout; splice it
// into a standalone prototype once and leave it inline.
//
//   node scripts/design/cast-sprite.cjs maya-idle maya-talk ... > /tmp/sprite.html

const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "..", "docs", "design", "cast");
const names = process.argv.slice(2);
if (!names.length) {
  console.error("usage: cast-sprite.cjs <name> [name...]");
  process.exit(1);
}

const symbols = names.map((name) => {
  const raw = fs.readFileSync(path.join(dir, `${name}.svg`), "utf8");
  const open = raw.match(/<svg\b[^>]*>/);
  if (!open) throw new Error(`no <svg> in ${name}`);
  const viewBox = (open[0].match(/viewBox="([^"]+)"/) || [])[1] || "0 0 704 704";

  let body = raw.slice(open.index + open[0].length, raw.lastIndexOf("</svg>"));
  body = body.replace(/<metadata[\s\S]*?<\/metadata>/g, "");

  const prefix = `${name}-`;
  const ids = new Set();
  body.replace(/\bid="([^"]+)"/g, (_, id) => ids.add(id));
  for (const id of ids) {
    const safe = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body
      .replace(new RegExp(`\\bid="${safe}"`, "g"), `id="${prefix}${id}"`)
      .replace(new RegExp(`url\\(#${safe}\\)`, "g"), `url(#${prefix}${id})`)
      .replace(new RegExp(`href="#${safe}"`, "g"), `href="#${prefix}${id}"`);
  }

  return `<symbol id="c-${name}" viewBox="${viewBox}">${body.trim()}</symbol>`;
});

process.stdout.write(symbols.join("\n"));
