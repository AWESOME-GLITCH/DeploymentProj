import * as React from "react";
(globalThis as any).React = React;
import { renderToStaticMarkup } from "react-dom/server";
import { Maya, Sticker } from "./components/learning-path/art/characters";

const poses = ["idle", "talk", "listen", "celebrate"] as const;
const kinds = ["heart", "star", "sparkle", "squiggle", "cloud"] as const;
const out: any = { poses: {}, stickers: {} };
for (const p of poses) out.poses[p] = renderToStaticMarkup(<Maya pose={p} item="phone" size={280} seed={3} />);
kinds.forEach((k, i) => { out.stickers[k] = renderToStaticMarkup(<Sticker kind={k} size={24} seed={3 + i * 5} />); });
console.log(JSON.stringify(out));
