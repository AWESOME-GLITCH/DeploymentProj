// Renders the kit Blobert's six gags to static SVG for the prototype
// docs/prototypes/09-yesterday-today-tomorrow.html, so the prototype uses
// the real component and not a redraw of it.
//   node_modules/.bin/sucrase-node scripts/design/lp9-blobert.cjs
const { writeFileSync } = require("node:fs");
const { renderToStaticMarkup } = require("react-dom/server");
const React = require("react");
global.React = React;
const { Blobert, BLOBERT_GAGS, ART } = require("../../components/learning-path/art/characters.tsx");

const out = {};
BLOBERT_GAGS.forEach((gag, i) => {
  out[gag] = renderToStaticMarkup(
    React.createElement(Blobert, {
      pose: "gag", gag, play: true, word: "will work",
      fill: ART.cream, size: 180, seed: 3 + i, idle: true,
    }),
  );
});
writeFileSync("/tmp/lp9/blobert.json", JSON.stringify(out));
Object.keys(out).forEach((k) => console.log(k, out[k].length));
