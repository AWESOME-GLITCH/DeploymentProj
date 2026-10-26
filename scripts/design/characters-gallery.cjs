// Builds docs/design/characters.html from the real components, so the gallery
// can never drift from components/learning-path/art/characters.tsx.
//
//   node_modules/.bin/sucrase-node scripts/design/characters-gallery.cjs
//
// Run it with sucrase-node so the TSX import compiles in place.

const { writeFileSync } = require("node:fs");
const path = require("node:path");
const { renderToStaticMarkup } = require("react-dom/server");
const React = require("react");
const { createElement: h } = React;
// Sucrase compiles JSX to the classic React.createElement runtime, while the
// app relies on Next's automatic runtime, so give the module a global React.
global.React = React;
const {
  ART,
  CAST,
  POSES,
  HOLD_ITEMS,
  STICKER_KINDS,
  Character,
  Sticker,
} = require("../../components/learning-path/art/characters.tsx");

const BLOCKS = [
  ["sun", ART.sun],
  ["lilac", ART.lilac],
  ["tangerine", ART.tangerine],
  ["mint", ART.mint],
  ["sky", ART.sky],
];

const POSE_ITEM = { phone: "phone", cup: "cup", suitcase: "suitcase", star: "star", book: "book", mic: "mic" };
const ITEM_FOR = { maya: "phone", leo: "cup", fatima: "book", sami: "suitcase", you: "star" };

function svg(name, pose, opts = {}) {
  return renderToStaticMarkup(
    h(Character, {
      name,
      pose,
      size: opts.size ?? 190,
      item: opts.item,
      stickers: opts.stickers ?? false,
      idle: true,
      popIn: true,
      seed: opts.seed ?? 3,
      title: opts.title,
    }),
  );
}

const poseRow = (name) =>
  POSES.map((pose) => {
    const shot = svg(name, pose, {
      item: ITEM_FOR[name],
      stickers: pose === "celebrate",
      title: `${name} ${pose}`,
    });
    const label = pose === "hold" ? `hold("${ITEM_FOR[name]}")` : pose;
    return `<figure class="cell"><div class="art">${shot}</div><figcaption>${label}</figcaption></figure>`;
  }).join("");

// A character is never shown on their own accent colour: the accent would sink
// into the card. Each cast card uses the recommended partner colour instead.
const PARTNER = { maya: "lilac", leo: "sun", fatima: "mint", sami: "sun", you: "sky" };

const castBlocks = CAST.map((c) => {
  const own = BLOCKS.find(([, v]) => v === c.block)?.[0] ?? "sun";
  const partner = PARTNER[c.name];
  const bg = BLOCKS.find(([n]) => n === partner)[1];
  return `
  <section class="card" style="--block:${bg}">
    <header>
      <h2>${c.label}</h2>
      <p>${c.role} &middot; own colour <code>${own}</code> &middot; shown on <code>${partner}</code></p>
    </header>
    <div class="row">${poseRow(c.name)}</div>
  </section>`;
}).join("");

const onEveryBlock = BLOCKS.map(
  ([bname, bval]) => `
  <div class="strip" style="--block:${bval}">
    <span class="tag">${bname}</span>
    <div class="row tight">${CAST.map((c) => `<div class="art">${svg(c.name, "idle", { size: 150, seed: 5, title: `${c.label} on ${bname}` })}</div>`).join("")}</div>
  </div>`,
).join("");

const stickerRow = STICKER_KINDS.map(
  (k) => `<figure class="cell"><div class="art">${renderToStaticMarkup(h(Sticker, { kind: k, size: 56, seed: 4, twinkle: true, title: k }))}</div><figcaption>${k}</figcaption></figure>`,
).join("");

const itemRow = HOLD_ITEMS.map(
  (it) => `<figure class="cell"><div class="art">${svg("maya", "hold", { item: it, size: 170, seed: 9, title: `Maya holding a ${it}` })}</div><figcaption>hold("${it}")</figcaption></figure>`,
).join("");

const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Learning Path character kit</title>
<style>
  :root {
    --ink:${ART.ink}; --cream:${ART.cream}; --paper:${ART.paper};
    --sun:${ART.sun}; --lilac:${ART.lilac}; --tangerine:${ART.tangerine};
    --mint:${ART.mint}; --sky:${ART.sky};
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 32px 20px 72px; background: var(--cream); color: var(--ink);
    font: 600 16px/1.4 "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  }
  .wrap { max-width: 1200px; margin: 0 auto; }
  h1 { font-size: 40px; font-weight: 800; line-height: 1.05; margin: 0 0 8px; }
  .lede { margin: 0 0 32px; max-width: 60ch; }
  h2 { font-size: 26px; font-weight: 800; margin: 0; }
  h3 { font-size: 20px; font-weight: 800; margin: 40px 0 12px; }
  code { font: 600 14px/1 ui-monospace, monospace; background: rgba(18,18,18,.08); padding: 2px 6px; border-radius: 6px; }
  .card {
    background: var(--block); border: 3px solid var(--ink); border-radius: 28px;
    padding: 20px 20px 8px; margin: 0 0 24px;
  }
  .card header p { margin: 2px 0 14px; font-size: 14px; }
  .row { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; justify-content: space-around; }
  .row.tight { gap: 4px; justify-content: space-around; }
  .cell { margin: 0; text-align: center; }
  .cell figcaption { font-size: 13px; font-weight: 700; padding: 6px 0 12px; }
  .art { display: flex; align-items: flex-end; justify-content: center; }
  .strip {
    background: var(--block); border: 3px solid var(--ink); border-radius: 28px;
    padding: 12px 16px 4px; margin: 0 0 14px; position: relative;
  }
  .tag { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; }
  .sheet { background: var(--paper); border: 3px solid var(--ink); border-radius: 28px; padding: 18px 22px; }
  .sheet ul { margin: 0; padding-left: 20px; }
  .sheet li { margin: 4px 0; }
  @media (max-width: 420px) { h1 { font-size: 32px; } }
</style>
</head>
<body>
<div class="wrap">
  <h1>Character kit</h1>
  <p class="lede">Hand-drawn ink cast for the Learning Path app and its videos. Rendered from
  <code>components/learning-path/art/characters.tsx</code>. Written rules:
  <code>docs/design/characters.md</code>.</p>

  <h3>Every character, every pose</h3>
  ${castBlocks}

  <h3>Pairing check: the cast on all five block colours</h3>
  <p class="lede">Order is Maya, Leo, Fatima, Sami, You. A character on their own accent colour
  loses that accent, so pair across: Maya on lilac, Leo on sun, Fatima on mint, Sami on sun,
  You on sky.</p>
  ${onEveryBlock}

  <h3>Stickers</h3>
  <section class="card" style="--block:var(--sun)"><div class="row">${stickerRow}</div></section>

  <h3>Things they hold</h3>
  <section class="card" style="--block:var(--sky)"><div class="row">${itemRow}</div></section>

  <h3>Using it</h3>
  <div class="sheet">
    <ul>
      <li><code>&lt;Maya pose="talk" size={240} /&gt;</code> on the coach screens.</li>
      <li><code>&lt;Leo pose="hold" item="cup" /&gt;</code> in the cafe lesson.</li>
      <li><code>&lt;Character name="you" pose="celebrate" stickers idle /&gt;</code> on the reward card.</li>
      <li><code>&lt;Sticker kind="star" size={28} twinkle /&gt;</code> for the good-answer pop.</li>
      <li>One block colour per screen. Keep <code>seed</code> fixed so videos stay frame stable.</li>
    </ul>
  </div>
</div>
</body>
</html>
`;

writeFileSync(path.join(__dirname, "../../docs/design/characters.html"), html);
console.log("wrote docs/design/characters.html");
void POSE_ITEM;
