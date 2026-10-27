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
  Blobert,
  BLOBERT_GAGS,
  BLOBERT_GAG_MS,
  BLOBERT_SEQUENCE,
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

// ------------------------------------------------------------- Blobert
const blob = (props) => renderToStaticMarkup(h(Blobert, props));

const GAG_WORD = { sweep: "has", eat: "goed", mop: "am", bin: "hase", vacuum: "do", crane: "is" };
const GAG_FILL = { sweep: ART.sun, eat: ART.tangerine, mop: ART.sky, bin: ART.mint, vacuum: ART.lilac, crane: ART.sun };
const GAG_SAYS = {
  sweep: "Sweeps it off the screen.",
  eat: "Eats it and burps a star.",
  mop: "Mops it into a puddle that dries.",
  bin: "Flicks it in and the lid claps.",
  vacuum: "Vacuums it up, then sneezes.",
  crane: "Lifts it away with the tiny crane.",
};

// He stands in the left half of a 300 x 200 box, so a pose cell is cropped
// to that half: the caption then sits under the drawing, not under the empty
// gag area. `out` is sampled early, before he is half off the box and the
// viewBox cuts him in two.
const BLOB_POSE_PX = 128;
const half = (svg, size) =>
  `<div class="art half" style="width:${Math.round((size * 150) / 200)}px">${svg}</div>`;

const blobPoses = ["in", "look", "wave", "out"]
  .map((pose, i) => {
    const fill = [ART.sun, ART.tangerine, ART.sky, ART.mint][i];
    const art = blob({
      pose,
      fill,
      size: BLOB_POSE_PX,
      seed: 3,
      progress: pose === "out" ? 0.12 : undefined,
      title: `Blobert ${pose}`,
    });
    return `<figure class="cell">${half(art, BLOB_POSE_PX)}<figcaption>${pose}</figcaption></figure>`;
  })
  .join("");

const blobGags = BLOBERT_GAGS.map((gag) => {
  const common = { pose: "gag", gag, word: GAG_WORD[gag], fill: GAG_FILL[gag], size: 150, seed: 3 };
  const still = blob({ ...common, title: `Blobert ${gag}` });
  const playing = blob({ ...common, play: true, idle: true, title: `Blobert ${gag}` });
  return `
  <figure class="gag" data-gag="${gag}">
    <div class="stage">${still}</div>
    <template>${playing}</template>
    <figcaption><b>${gag}</b> ${GAG_SAYS[gag]}</figcaption>
    <button type="button" class="pill">Play ${gag} &nbsp;&#9654;</button>
  </figure>`;
}).join("");

// Sampled inside the on-stage window. Before about 140 ms and after about
// 770 ms he is travelling through the edge of his own box, so the viewBox
// clips him and a still of that frame reads as a drawing error, not a move.
const FRAMES = [0.16, 0.3, 0.44, 0.58, 0.72, 0.86];
const blobStrips = BLOBERT_GAGS.map(
  (gag) => `
  <div class="strip" style="--block:var(--cream)">
    <span class="tag">${gag}</span>
    <div class="row tight">${FRAMES.map(
      (p) =>
        `<figure class="cell"><div class="art">${blob({
          pose: "gag",
          gag,
          progress: p,
          word: GAG_WORD[gag],
          fill: GAG_FILL[gag],
          size: 116,
          seed: 3,
          title: `Blobert ${gag} at ${Math.round(p * BLOBERT_GAG_MS)} ms`,
        })}</div><figcaption>${Math.round(p * BLOBERT_GAG_MS)} ms</figcaption></figure>`,
    ).join("")}</div>
  </div>`,
).join("");

const blobOnBlocks = BLOCKS.map(
  ([bname, bval]) => `
  <div class="strip" style="--block:${bval}">
    <span class="tag">${bname}</span>
    <div class="row tight pair">
      ${half(blob({ pose: "look", fill: ART.cream, size: 112, seed: 4, title: `Blobert in cream on ${bname}` }), 112)}
      ${half(blob({ pose: "wave", fill: ART.paper, size: 112, seed: 6, title: `Blobert in white on ${bname}` }), 112)}
    </div>
  </div>`,
).join("");

const seqRow = Object.entries(BLOBERT_SEQUENCE)
  .map(([step, { from, to }]) => `<li><code>${step}</code> ${from} to ${to} ms</li>`)
  .join("");

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
  .art.half { justify-content: flex-start; overflow: hidden; }
  .art.half > svg { flex: 0 0 auto; }
  .row.pair { justify-content: center; gap: 48px; padding: 6px 0 10px; }
  .strip {
    background: var(--block); border: 3px solid var(--ink); border-radius: 28px;
    padding: 12px 16px 4px; margin: 0 0 14px; position: relative;
  }
  .tag { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; }
  .sheet { background: var(--paper); border: 3px solid var(--ink); border-radius: 28px; padding: 18px 22px; }
  .sheet ul { margin: 0; padding-left: 20px; }
  .sheet li { margin: 4px 0; }
  .gags { display: flex; flex-wrap: wrap; gap: 14px; }
  .gag {
    margin: 0; flex: 1 1 300px; background: var(--paper); border: 3px solid var(--ink);
    border-radius: 28px; padding: 10px 14px 14px; text-align: center;
  }
  .gag .stage { height: 150px; display: flex; align-items: center; justify-content: center; }
  .gag figcaption { font-size: 14px; padding: 8px 0 10px; min-height: 42px; }
  .gag figcaption b { text-transform: capitalize; }
  .pill {
    display: block; width: 100%; height: 48px; border: 0; border-radius: 999px;
    background: var(--ink); color: var(--cream); font: 700 15px "Plus Jakarta Sans", ui-sans-serif, sans-serif;
    cursor: pointer;
  }
  .pill:focus-visible { outline: 3px solid var(--tangerine); outline-offset: 3px; }
  .pill.wide { width: auto; padding: 0 26px; margin: 0 0 14px; }
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

  <h3>Blobert, the blob who clears mistakes</h3>
  <p class="lede">He is the only thing that ever handles an error, so a mistake is never red, never a
  loss, always a small laugh. One gag per miss, never the same twice in a row. Pass him the screen's
  one block colour; on a block-colour card pass <code>cream</code> instead.</p>
  <section class="card" style="--block:var(--paper)">
    <header><h2>Poses</h2><p>in, look, wave, out &middot; plus <code>gag</code>, below</p></header>
    <div class="row">${blobPoses}</div>
  </section>

  <h3>The six gags, ${BLOBERT_GAG_MS} ms each</h3>
  <p class="lede">Every card plays the whole scripted miss: pop in, look at the wrong word, the gag,
  a wave, slide out. Press a button to play one, or play them all in turn.</p>
  <button type="button" class="pill wide" id="playall">Play all six &nbsp;&#9654;</button>
  <div class="gags">${blobGags}</div>

  <h3>Every gag, frame by frame</h3>
  <p class="lede">Rendered from the same timeline with the <code>progress</code> prop, so what the
  videos draw and what the browser animates cannot drift apart.</p>
  ${blobStrips}

  <h3>Blobert on the five block colours</h3>
  <p class="lede">On a block-colour card he is filled cream or white, never the card's own colour.</p>
  ${blobOnBlocks}

  <h3>His timing</h3>
  <div class="sheet"><ul>${seqRow}<li>The wave overlaps the tail of the gag by 120 ms, which is what
  brings the whole miss under 900 ms.</li></ul></div>

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
<script>
// Replay without a framework: each gag card ships the resting frame in the
// stage and the animated copy in a <template>. Playing swaps the template in,
// which starts the generated CSS from zero, then puts the resting frame back.
(function () {
  var MS = ${BLOBERT_GAG_MS};
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Reduced motion replaces every timeline with one 360 ms fade, so hold the
  // animated copy for that long instead of the full gag.
  var hold = reduced ? 420 : MS + 80;

  var plays = [].slice.call(document.querySelectorAll(".gag")).map(function (fig) {
    var stage = fig.querySelector(".stage");
    var tpl = fig.querySelector("template");
    var still = stage.innerHTML;
    var button = fig.querySelector("button");
    var timer = null;

    function play(then) {
      if (timer) window.clearTimeout(timer);
      stage.innerHTML = tpl.innerHTML;
      button.disabled = true;
      timer = window.setTimeout(function () {
        stage.innerHTML = still;
        button.disabled = false;
        timer = null;
        if (then) then();
      }, hold);
    }

    button.addEventListener("click", function () { play(); });
    return play;
  });

  var all = document.getElementById("playall");
  all.addEventListener("click", function () {
    all.disabled = true;
    var i = 0;
    (function step() {
      if (i >= plays.length) { all.disabled = false; return; }
      plays[i++](function () { window.setTimeout(step, 160); });
    })();
  });
})();
</script>
</body>
</html>
`;

writeFileSync(path.join(__dirname, "../../docs/design/characters.html"), html);
console.log("wrote docs/design/characters.html");
void POSE_ITEM;
