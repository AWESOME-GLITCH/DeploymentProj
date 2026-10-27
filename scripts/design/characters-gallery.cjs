// Builds docs/design/characters.html from the real components, so the gallery
// can never drift from components/learning-path/art/characters.tsx.
//
//   node scripts/design/build-cast-module.cjs          # refresh the art first
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
  EXPRESSIONS,
  DOODLE_NAMES,
  STICKER_KINDS,
  TALK_BEAT_MS,
  Character,
  Doodle,
  Sticker,
  Blobert,
  BLOBERT_GAGS,
  BLOBERT_GAG_MS,
} = require("../../components/learning-path/art/characters.tsx");

const BLOCKS = [
  ["sun", ART.sun],
  ["lilac", ART.lilac],
  ["tangerine", ART.tangerine],
  ["mint", ART.mint],
  ["sky", ART.sky],
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const r = (el) => renderToStaticMarkup(el);

/* ----------------------------------------------------------- the cast */
// Every expression of every character, on that character's block colour.
const castSection = CAST.map((c) => {
  const tiles = EXPRESSIONS.map(
    (e) =>
      `<figure class="tile" style="background:${c.block}">` +
      r(h(Character, { name: c.name, expression: e, size: 190 })) +
      `<figcaption>${esc(e)}</figcaption></figure>`,
  ).join("");
  return (
    `<h3>${esc(c.label)} <span class="role">${esc(c.role)}</span></h3>` +
    `<p class="note">Block colour <code>${c.block}</code>, jumper <code>${c.jumper}</code>. ` +
    `Talking swaps <b>talk</b> and <b>idle</b> every ${TALK_BEAT_MS} ms; listening is <b>listen</b> with the lean-in.</p>` +
    `<div class="grid">${tiles}</div>`
  );
}).join("");

/* ------------------------------------------------- talk, listen, react */
const maya = (expression, extra) => r(h(Character, { name: "maya", expression, size: 200, ...extra }));
const behaviour =
  `<div class="grid">` +
  [
    ["talking, beat 1", maya("talk"), ART.sun],
    ["talking, beat 2", maya("idle"), ART.sun],
    ["listening, lean-in", maya("listen", { lean: true }), ART.sky],
    ["reaction: happy", maya("happy"), ART.mint],
    ["reaction: wow", maya("wow"), ART.mint],
    ["reaction: laugh", maya("laugh"), ART.mint],
    ["reaction: oops", maya("oops"), ART.tangerine],
  ]
    .map(([label, svg, bg]) => `<figure class="tile" style="background:${bg}">${svg}<figcaption>${esc(label)}</figcaption></figure>`)
    .join("") +
  `</div>`;

/* --------------------------------------------------------- the doodles */
// The hero figures, big and cropped, next to the faces they belong with.
const doodleSection =
  `<div class="grid wide">` +
  DOODLE_NAMES.map((name, i) => {
    const bg = BLOCKS[i % BLOCKS.length][1];
    return (
      `<figure class="tile crop" style="background:${bg}">` +
      r(h(Doodle, { name, size: 300 })) +
      `<figcaption>${esc(name)}</figcaption></figure>`
    );
  }).join("") +
  `</div>`;

// One exemplar card, so the gate is on the page and not only in words: one
// block colour, one oversized figure cropped by the card edge, one sticker,
// a two-word headline, one black pill, nothing else.
const pairing =
  `<div class="pair" style="background:${ART.sun}">` +
  `<h4 class="pair-head">Coffee time</h4>` +
  `<span class="pair-stick">${r(h(Sticker, { kind: "star", size: 40 }))}</span>` +
  `<div class="pair-art">${r(h(Doodle, { name: "coffee", size: 420 }))}</div>` +
  `<span class="pair-pill">Start &#187;</span>` +
  `</div>`;

/* --------------------------------------------------------- Blobert */
const blobert =
  `<div class="grid wide">` +
  BLOBERT_GAGS.map((gag, i) => {
    const bg = BLOCKS[i % BLOCKS.length][1];
    // He takes the cream, never the block colour he is standing on, or he
    // disappears into the card.
    return (
      `<figure class="tile" style="background:${bg}">` +
      r(h(Blobert, { pose: "gag", gag, word: "goed", fill: ART.cream, size: 230, seed: 3 + i, scripted: false, progress: 0.45 })) +
      `<figcaption>${esc(gag)}</figcaption></figure>`
    );
  }).join("") +
  `</div>` +
  `<div class="grid wide">` +
  ["in", "look", "wave", "out"]
    .map(
      (pose, i) =>
        `<figure class="tile left" style="background:${BLOCKS[i % BLOCKS.length][1]}">` +
        r(h(Blobert, { pose, fill: ART.cream, size: 230, seed: 9 + i })) +
        `<figcaption>${esc(pose)}</figcaption></figure>`,
    )
    .join("") +
  `</div>`;

/* --------------------------------------------------------- stickers */
const stickers =
  `<div class="grid small">` +
  STICKER_KINDS.map(
    (kind, i) =>
      `<figure class="tile" style="background:${BLOCKS[i % BLOCKS.length][1]}">` +
      r(h(Sticker, { kind, size: 76, seed: 4 + i })) +
      `<figcaption>${esc(kind)}</figcaption></figure>`,
  ).join("") +
  `</div>`;

/* ------------------------------------------------------------ page */
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Learning Path character kit</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
<style>
:root{--ink:#121212; --cream:#FFF7E8}
*{box-sizing:border-box}
figure{margin:0}
body{margin:0; padding:28px 22px 60px; background:var(--cream); color:var(--ink);
  font-family:"Plus Jakarta Sans",system-ui,-apple-system,sans-serif; font-weight:600}
h1{font-size:38px; font-weight:800; letter-spacing:-.02em; margin:0 0 8px; line-height:1.05}
h2{font-size:26px; font-weight:800; letter-spacing:-.02em; margin:44px 0 6px;
  padding-top:18px; border-top:3px solid var(--ink)}
h3{font-size:19px; font-weight:800; margin:26px 0 4px}
h3 .role{font-weight:600; opacity:.6}
p{margin:0 0 12px; max-width:62ch; line-height:1.45; font-size:15px}
.note{font-size:13.5px; opacity:.85}
code{font:700 12.5px ui-monospace,SFMono-Regular,Menlo,monospace; background:#fff;
  border:2px solid var(--ink); border-radius:6px; padding:1px 5px}
.grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(148px,1fr)); gap:10px; margin:10px 0 4px}
.grid.wide{grid-template-columns:repeat(auto-fill,minmax(232px,1fr))}
.grid.small{grid-template-columns:repeat(auto-fill,minmax(120px,1fr))}
.tile{border:3px solid var(--ink); border-radius:22px; overflow:hidden;
  display:flex; flex-direction:column; align-items:center; justify-content:flex-end; padding-top:6px}
.tile svg{display:block; width:100%; height:auto}
.tile.crop svg{width:118%; max-width:none; margin-bottom:-6%}
/* the short poses have no gag to the right, so crop his own box */
.tile.left{align-items:flex-start}
.tile.left svg{width:205%; max-width:none; margin-left:-6%}
figcaption{align-self:stretch; background:var(--ink); color:var(--cream);
  font-size:11.5px; font-weight:800; letter-spacing:.06em; text-transform:uppercase;
  text-align:center; padding:6px 4px}
.pair{position:relative; height:420px; border:3px solid var(--ink); border-radius:28px;
  overflow:hidden; margin:12px 0 4px; max-width:420px}
.pair-art{position:absolute; left:-4%; bottom:-20%; width:120%}
.pair-art svg{width:100%; height:auto; display:block}
.pair-head{position:absolute; left:22px; top:18px; margin:0; z-index:2;
  font-size:34px; font-weight:800; letter-spacing:-.02em; line-height:1.04; max-width:7ch}
.pair-stick{position:absolute; right:20px; top:22px; z-index:2}
.pair-pill{position:absolute; left:22px; right:22px; bottom:20px; z-index:2; height:56px;
  border-radius:99px; background:var(--ink); color:var(--cream); display:flex;
  align-items:center; justify-content:center; font-size:18px; font-weight:800}
.rules{display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px; margin-top:12px}
.rules div{border:3px solid var(--ink); border-radius:22px; padding:14px 16px; background:#fff}
.rules h4{margin:0 0 6px; font-size:15px; font-weight:800; text-transform:uppercase; letter-spacing:.06em}
.rules ul{margin:0; padding-left:18px; font-size:14px; line-height:1.5}
</style>
</head>
<body>

<h1>Character kit</h1>
<p>The cast is the pre-rendered art in <code>docs/design/cast/</code>: Open Peeps faces and Open
Doodles figures, both CC0 by Pablo Stanley, recoloured to the palette by
<code>scripts/lp/cast.mjs</code>. It is inlined, never redrawn. Blobert and the stickers are the only
drawings in the kit, inked to match the doodle line. Written style sheet:
<code>docs/design/characters.md</code>. This page is generated from the real components by
<code>scripts/design/characters-gallery.cjs</code>.</p>

<h2>The cast</h2>
<p>Five characters, nine expressions each, on the block colour that character is placed on.</p>
${castSection}

<h2>Talking, listening, reacting</h2>
<p>No mouth rig. Talking is a swap between <b>talk</b> and <b>idle</b> on the syllable beat
(${TALK_BEAT_MS} ms). Listening is <b>listen</b> plus the lean-in. Reactions use <b>happy</b>,
<b>wow</b>, <b>laugh</b> and <b>oops</b>.</p>
${behaviour}

<h2>The hero doodles</h2>
<p>Full-body figures for the big moments. Use them large and cropped by the card edge, as below.
A doodle floating small in an empty block is a fail.</p>
${pairing}
${doodleSection}

<h2>Blobert, and his six gags</h2>
<p>Blobert is custom, drawn in the sketchy ink of the doodles. He is the only thing that handles a
mistake, so a miss is never red and never a loss. One gag per miss, never the same twice in a row,
each under ${BLOBERT_GAG_MS} ms. The frames below are held at the middle of each gag.</p>
${blobert}

<h2>Stickers</h2>
<p>Black, placed with intent: one or two per card, in the clear block colour, never over the
character's face or hair.</p>
${stickers}

<h2>Do and do not</h2>
<div class="rules">
  <div><h4>Do</h4><ul>
    <li>One block colour per screen, plus ink and cream.</li>
    <li>One character, oversized, filling at least half the card.</li>
    <li>Crop the figure with confidence at the card edge.</li>
    <li>Swap talk and idle on the beat; lean in to listen.</li>
    <li>Place stickers where the block colour is clear.</li>
  </ul></div>
  <div><h4>Do not</h4><ul>
    <li>Redraw the cast. Inline the files; never trace them.</li>
    <li>Float a small figure in an empty block.</li>
    <li>Put a sticker over hair or a face: black on black is a smudge.</li>
    <li>Use three block colours on one screen.</li>
    <li>Give Blobert a sentence. Tiny sounds only.</li>
  </ul></div>
</div>

</body>
</html>
`;

const out = path.join(__dirname, "..", "..", "docs", "design", "characters.html");
writeFileSync(out, html);
console.log(`characters.html  ${(Buffer.byteLength(html) / 1024).toFixed(0)} kB`);
