"use client";

// "Two coffees, some water" (ATM-A2-GRM-0002): a word tutorial built as a
// Remotion composition (3:4, 1080x1440, 30 fps, 40 s). Seven beats from
// docs/explainers/storyboards.md: hook, four word beats, practise aloud, recap.
// Single target: count it (a number and s) against cannot count it (some).
// Built on the shared kit in ./lib, on the cafe counter close-up, so the grey
// outlines waiting in the hook are the same two cups and glass that fill in at
// the end. Every value is a pure function of the frame, so the same component
// plays in the Player and renders deterministically to MP4.

import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  ACCENT, Badge, BeatProgress, CaptionBar, Character, Cup, EASE, Eyebrow, FAINT, FOG, FONT, INK, karaoke,
  PAPER, Pulse, SAFFRON, SEA, SpeechBubble, Stage, Transition, springIn, tween, WOOD, WOOD_DARK, WOOD_LIGHT,
} from "./lib";

export const GRM2_FPS = 30;
export const GRM2_W = 1080;
export const GRM2_H = 1440;

// A word tutorial has its own beat kinds, so the contract is declared here
// rather than borrowed from Cafe.tsx (the video-atom reference).
export type Beat = {
  id: string;
  from: number;
  to: number;
  line: string;
  target?: string[];
  kind: "hook" | "word" | "practise" | "recap";
  pauseAt?: number;
};

export const GRM2_BEATS: Beat[] = [
  { id: "hook", kind: "hook", from: 0, to: 120, line: "Two coffees and some water, please." },
  { id: "w1", kind: "word", from: 120, to: 330, line: "A coffee, two coffees. You can count coffees.", target: ["a coffee", "two coffees"] },
  { id: "w2", kind: "word", from: 330, to: 540, line: "Some water. You cannot count water.", target: ["some water"] },
  { id: "w3", kind: "word", from: 540, to: 720, line: "Some sugar. Sugar is not counted either.", target: ["some sugar"] },
  { id: "w4", kind: "word", from: 720, to: 880, line: "A sandwich, two sandwiches. Add es after ch.", target: ["two sandwiches"] },
  { id: "practise", kind: "practise", from: 880, to: 1120, line: "Say it with me. Two coffees and some water, please.", target: ["two coffees", "some water"], pauseAt: 1060 },
  { id: "recap", kind: "recap", from: 1120, to: 1200, line: "Count it: two coffees. Cannot count it: some water.", target: ["two coffees", "some water"] },
];
export const GRM2_DURATION = 1200;

export function grm2BeatAt(frame: number): Beat {
  return GRM2_BEATS.find((b) => frame >= b.from && frame < b.to) ?? GRM2_BEATS[GRM2_BEATS.length - 1];
}

// Cafe tones, kept inside the kit family: warm paper walls, wood counter, a
// quiet grey for the outlines that are waiting to be filled.
const WALL = "#f2e8da";
const WALL_LOW = "#e9d9c0";
const GREY = "#bdb8ae";
const WATER = "#86c9de";
const WATER_TOP = "#b7e2ef";
const GLASS_TINT = "#e9f1f4";
const SUGAR = "#f7f1e4";
const SUGAR_SHADE = "#ded0b6";
const BREAD = "#e8b765";
const BREAD_DARK = "#d49a46";
const FILLING = "#8fb87a";
const PALE = "#eaf1fb";

// The set. Both people stand behind the counter, so the slab crosses their
// chest and every prop stands on the same line.
const TOP_Y = 1006; // top of the counter slab
const PROP_Y = 1026; // where props stand on it
const FEET_Y = 1301;
const BODY = 1.3;
const LEO_X = 250;
const YOU_X = 895;
const CUP1_X = 470;
const CUP2_X = 610;
const GLASS_X = 745;
const JUG_HOME = 105;
const JAR_HOME = 1000;
const PLATE_X = 700;
const PILE_X = 710;
const BADGE_Y = 1110; // the counting numbers sit on the counter front

// The word card at the top.
const CARD = { x: 70, y: 150, w: 940, h: 170 };
const CARD_BASE = CARD.y + CARD.h / 2 + 24;

// ---------------------------------------------------------------- text metrics
// Plus Jakarta Sans at weight 800, in ems. Every card line is drawn with
// `textLength`, so a tile that clips on lands exactly where the slot is.
const CHAR_W: Record<string, number> = {
  " ": 0.26, ",": 0.28, ".": 0.28, "?": 0.5, "'": 0.2,
  a: 0.55, b: 0.58, c: 0.5, d: 0.58, e: 0.54, f: 0.34, g: 0.56, h: 0.58, i: 0.27, j: 0.27, k: 0.55,
  l: 0.27, m: 0.88, n: 0.58, o: 0.58, p: 0.58, q: 0.58, r: 0.38, s: 0.49, t: 0.36, u: 0.58, v: 0.53,
  w: 0.78, x: 0.53, y: 0.53, z: 0.48,
};
function estW(text: string, size: number): number {
  let em = 0;
  for (const ch of text) em += CHAR_W[ch] ?? CHAR_W[ch.toLowerCase()] ?? 0.66;
  return em * size;
}

type Seg = { t: string; color?: string; size?: number; gap?: number; w?: number };
type Laid = { t: string; color: string; size: number; x: number; w: number };

/** Lay segments left to right, centred on `cx`. `gap` is the space before a segment. */
function layoutSegs(segs: Seg[], size: number, cx: number): Laid[] {
  const sized = segs.map((s) => {
    const sz = s.size ?? size;
    return { t: s.t, color: s.color ?? INK, size: sz, w: s.w ?? estW(s.t, sz), gap: s.gap ?? 0 };
  });
  const total = sized.reduce((a, s) => a + s.w + s.gap, 0);
  let x = cx - total / 2;
  return sized.map((s) => {
    const at = x + s.gap;
    x = at + s.w;
    return { t: s.t, color: s.color, size: s.size, x: at, w: s.w };
  });
}

/** One laid-out segment as locked-width SVG text. */
function SegText({ s, y, opacity = 1 }: { s: Laid; y: number; opacity?: number }) {
  return (
    <text
      x={s.x} y={y} textLength={s.w} lengthAdjust="spacingAndGlyphs"
      fontFamily={FONT} fontWeight="800" fontSize={s.size} fill={s.color} opacity={opacity}
    >
      {s.t}
    </text>
  );
}

// ---------------------------------------------------------------- small helpers
const bez = (t: number, a: number, b: number, c: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;

/** A marker swipe under a word, wiped in left to right. */
function Swipe({ frame, from, x, y, w, h = 18, color = SAFFRON }: { frame: number; from: number; x: number; y: number; w: number; h?: number; color?: string }) {
  const p = tween(frame, from, from + 14, 0, 1, EASE.out);
  if (p <= 0) return null;
  return <rect x={x} y={y} width={w * p} height={h} rx={h / 2} fill={color} opacity="0.55" />;
}

/** Two motion lines, the clack when a tile snaps on. */
function Clack({ frame, at, x, y }: { frame: number; at: number; x: number; y: number }) {
  const p = tween(frame, at, at + 14, 0, 1, EASE.out);
  if (p <= 0 || p >= 1) return null;
  return (
    <g opacity={1 - p} stroke={INK} strokeWidth="6" strokeLinecap="round">
      <line x1={x - 12 - p * 20} y1={y - 18} x2={x - 30 - p * 24} y2={y - 26} />
      <line x1={x - 12 - p * 20} y1={y + 18} x2={x - 30 - p * 24} y2={y + 26} />
    </g>
  );
}

const tileW = (t: string, size: number) => Math.max(72, estW(t, size) + 48);

/** A magnet tile: a rounded chip with a thick ink outline and one word on it. */
function MagnetTile({
  cx, cy, t, size = 56, frame, from = 0, rot = 0, scale = 1, color = ACCENT, opacity = 1,
}: { cx: number; cy: number; t: string; size?: number; frame: number; from?: number; rot?: number; scale?: number; color?: string; opacity?: number }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 9, stiffness: 200 }) * scale;
  const w = tileW(t, size);
  const h = size + 38;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${s})`} opacity={opacity}>
      <rect x={-w / 2 + 5} y={-h / 2 + 7} width={w} height={h} rx="20" fill={INK} opacity="0.2" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="20" fill={PAPER} stroke={INK} strokeWidth="6" />
      <text x="0" y={size * 0.35} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize={size} fill={color}>{t}</text>
    </g>
  );
}

/** The dashed slot a tile is about to fill. */
function Slot({ cx, cy, w, h, frame, from }: { cx: number; cy: number; w: number; h: number; frame: number; from: number }) {
  const o = tween(frame, from, from + 14, 0, 1, EASE.out);
  return (
    <rect
      x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="20"
      fill="none" stroke={FOG} strokeWidth="5" strokeDasharray="14 12" opacity={o * 0.9}
    />
  );
}

// ---------------------------------------------------------------- the set

/** The wall behind. The two people are drawn on top of this, then the counter. */
function WallSet() {
  return (
    <g>
      <rect width="1080" height={TOP_Y} fill={WALL} />
      <rect y={TOP_Y - 210} width="1080" height="210" fill={WALL_LOW} />
      {/* a few tile lines so the wall has a surface without becoming busy */}
      <line x1="0" y1={TOP_Y - 210} x2="1080" y2={TOP_Y - 210} stroke="#dcc9ab" strokeWidth="5" />
      <line x1="0" y1={TOP_Y - 105} x2="1080" y2={TOP_Y - 105} stroke="#dcc9ab" strokeWidth="4" opacity="0.7" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line key={i} x1={68 + i * 148} y1={TOP_Y - 210} x2={68 + i * 148} y2={TOP_Y} stroke="#dcc9ab" strokeWidth="4" opacity="0.7" />
      ))}
    </g>
  );
}

/** The counter itself: slab, lip, front. Drawn over the people. */
function CounterTop() {
  return (
    <g>
      <rect y={TOP_Y} width="1080" height="40" fill={WOOD_LIGHT} />
      <rect y={TOP_Y} width="1080" height="8" fill="#dcbb97" />
      <rect y={TOP_Y + 40} width="1080" height="12" fill={WOOD_DARK} opacity="0.5" />
      <rect y={TOP_Y + 52} width="1080" height={1440 - TOP_Y - 52} fill={WOOD} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={40 + i * 262} y={TOP_Y + 86} width="200" height="300" rx="12" fill={WOOD_DARK} opacity="0.22" />
      ))}
      <ellipse cx="540" cy={TOP_Y + 54} rx="560" ry="14" fill={INK} opacity="0.1" />
    </g>
  );
}

/** A mug drawn as a grey outline: waiting to be filled. */
function MugOutline({ x, y, frame, appear, fade, scale = 0.95 }: { x: number; y: number; frame: number; appear: number; fade?: number; scale?: number }) {
  if (frame < appear) return null;
  const s = springIn(frame, appear, { damping: 10, stiffness: 150 });
  const out = fade !== undefined ? tween(frame, fade, fade + 14, 0, 1, EASE.in) : 0;
  if (out >= 1) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * s})`} opacity={(1 - out) * 0.95} fill="none" stroke={GREY} strokeWidth="6" strokeDasharray="15 11" strokeLinejoin="round">
      <path d="M44 -64 C76 -64 76 -24 42 -20" />
      <path d="M-44 -84 L44 -84 L35 -6 Q35 0 28 0 L-28 0 Q-35 0 -35 -6 Z" />
      <ellipse cx="0" cy="-84" rx="44" ry="9" />
    </g>
  );
}

const GLASS_PATH = "M-48 -142 L48 -142 L40 -4 Q40 2 34 2 L-34 2 Q-40 2 -40 -4 Z";

/** A tumbler, as an outline or filled, with a water level from 0 to 1. */
function Glass({ x, y, frame, appear, outline = false, level = 0, fade, scale = 1 }: { x: number; y: number; frame: number; appear: number; outline?: boolean; level?: number; fade?: number; scale?: number }) {
  if (frame < appear) return null;
  const s = springIn(frame, appear, { damping: 10, stiffness: 150 });
  const out = fade !== undefined ? tween(frame, fade, fade + 18, 0, 1, EASE.in) : 0;
  if (out >= 1) return null;
  const top = -8 - 118 * level;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * s})`} opacity={1 - out}>
      {outline ? (
        <g fill="none" stroke={GREY} strokeWidth="6" strokeDasharray="15 11" strokeLinejoin="round">
          <path d={GLASS_PATH} />
          <ellipse cx="0" cy="-142" rx="48" ry="9" />
        </g>
      ) : (
        <g>
          <ellipse cx="4" cy="4" rx="46" ry="8" fill={INK} opacity="0.12" />
          <path d={GLASS_PATH} fill={GLASS_TINT} stroke="#c3d3d8" strokeWidth="4" />
          {level > 0 ? (
            <g clipPath="url(#grm2-glass)">
              <rect x="-50" y={top} width="100" height="200" fill={WATER} />
              <rect x="-50" y={top} width="100" height="9" fill={WATER_TOP} />
            </g>
          ) : null}
          <line x1="-26" y1="-124" x2="-22" y2="-18" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
          <ellipse cx="0" cy="-142" rx="48" ry="9" fill="#f4f8fa" stroke="#c3d3d8" strokeWidth="4" />
        </g>
      )}
    </g>
  );
}

/** A water jug. `rot` tips it clockwise to pour from the lip at the top right. */
function Jug({ x, y, rot = 0, level = 0.62, scale = 1 }: { x: number; y: number; rot?: number; level?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${rot})`}>
      <defs>
        <clipPath id="grm2-jug">
          <path d="M-62 0 Q-66 -6 -64 -16 L-56 -140 Q-55 -152 -44 -152 L44 -152 Q55 -152 56 -140 L64 -16 Q66 -6 62 0 Z" />
        </clipPath>
      </defs>
      <path d="M46 -146 L98 -168 L94 -146 L54 -128 Z" fill="#dfe8ec" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-56 -36 C-104 -42 -104 -116 -58 -122" fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" />
      <path d="M-62 0 Q-66 -6 -64 -16 L-56 -140 Q-55 -152 -44 -152 L44 -152 Q55 -152 56 -140 L64 -16 Q66 -6 62 0 Z" fill="#eef4f7" stroke={INK} strokeWidth="6" />
      <g clipPath="url(#grm2-jug)">
        <g transform={`rotate(${-rot})`}>
          <rect x="-150" y={-150 * level} width="300" height="300" fill={WATER} />
          <rect x="-150" y={-150 * level} width="300" height="9" fill={WATER_TOP} />
        </g>
      </g>
      <line x1="-34" y1="-136" x2="-28" y2="-26" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
    </g>
  );
}

/** A sugar jar. `rot` tips it clockwise; the lid can be lifted off. */
function SugarJar({ x, y, rot = 0, lid = true, scale = 1 }: { x: number; y: number; rot?: number; lid?: boolean; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${rot})`}>
      <path d="M-48 0 Q-52 -6 -50 -16 L-46 -108 L46 -108 L50 -16 Q52 -6 48 0 Z" fill="#f3f6f8" stroke={INK} strokeWidth="6" />
      <path d="M-44 -24 L-41 -92 L41 -92 L44 -24 Z" fill={SUGAR} />
      {[[-24, -44], [0, -62], [22, -40], [-6, -32]].map(([gx, gy], i) => <circle key={i} cx={gx} cy={gy} r="4" fill={SUGAR_SHADE} />)}
      <rect x="-52" y="-120" width="104" height="16" rx="7" fill="#f3f6f8" stroke={INK} strokeWidth="5" />
      {lid ? (
        <g>
          <rect x="-46" y="-140" width="92" height="22" rx="9" fill={WOOD_LIGHT} stroke={INK} strokeWidth="5" />
          <rect x="-14" y="-154" width="28" height="16" rx="7" fill={WOOD_LIGHT} stroke={INK} strokeWidth="5" />
        </g>
      ) : null}
    </g>
  );
}

/** A mound of sugar on the counter. */
function Pile({ x, y, w, h, frame }: { x: number; y: number; w: number; h: number; frame: number }) {
  if (w <= 1) return null;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="4" cy="2" rx={w * 1.05} ry="9" fill={INK} opacity="0.1" />
      <path d={`M${-w} 0 C${-w * 0.56} ${-h * 1.05} ${-w * 0.2} ${-h} 0 ${-h} C${w * 0.2} ${-h} ${w * 0.56} ${-h * 1.05} ${w} 0 Z`} fill={SUGAR} stroke={SUGAR_SHADE} strokeWidth="4" />
      {[[-0.5, 0.42], [0.3, 0.55], [-0.14, 0.72], [0.56, 0.3]].map(([gx, gy], i) => (
        <circle key={i} cx={w * gx} cy={-h * gy} r="4" fill={SUGAR_SHADE} opacity={w > 60 ? 1 : 0} />
      ))}
    </g>
  );
}

/** A teaspoon with a small scoop on it. */
function Spoon({ x, y, frame, from, scoop }: { x: number; y: number; frame: number; from: number; scoop: boolean }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 11, stiffness: 150 });
  return (
    <g transform={`translate(${x} ${y}) rotate(-8) scale(${s})`}>
      <rect x="18" y="-9" width="150" height="17" rx="8" fill="#cfd6dc" stroke={INK} strokeWidth="5" />
      <ellipse cx="-14" cy="0" rx="46" ry="30" fill="#e3e9ee" stroke={INK} strokeWidth="5" />
      {scoop ? <path d="M-54 -8 C-42 -40 14 -40 26 -8 Z" fill={SUGAR} stroke={SUGAR_SHADE} strokeWidth="4" /> : null}
    </g>
  );
}

function Plate({ x, y, frame, from }: { x: number; y: number; frame: number; from: number }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 10, stiffness: 160 });
  const slide = (1 - s) * -180;
  return (
    <g transform={`translate(${x + slide} ${y})`} opacity={Math.min(1, s * 2)}>
      <ellipse cx="4" cy="4" rx="112" ry="18" fill={INK} opacity="0.12" />
      <ellipse cx="0" cy="-6" rx="112" ry="22" fill="#fff" stroke="#d8cfc4" strokeWidth="4" />
      <ellipse cx="0" cy="-10" rx="86" ry="14" fill="#f7f3ec" stroke="#e2dad0" strokeWidth="3" />
    </g>
  );
}

/** A sandwich half, standing on its crust. */
function Sandwich({ x, y, frame, from, lean = 0 }: { x: number; y: number; frame: number; from: number; lean?: number }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 9, stiffness: 190 });
  const slide = (1 - s) * 220;
  return (
    <g transform={`translate(${x + slide} ${y}) rotate(${lean}) scale(${Math.min(1, s)})`} opacity={Math.min(1, s * 2)}>
      <path d="M-58 0 L0 -86 L58 0 Z" fill={BREAD} stroke={BREAD_DARK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-40 -26 L0 -70 L40 -26 Z" fill={FILLING} opacity="0.9" />
      <path d="M-58 0 L58 0" stroke={BREAD_DARK} strokeWidth="9" strokeLinecap="round" />
      <path d="M-26 -18 L0 -48 L26 -18" fill="none" stroke="#fff" strokeWidth="4" opacity="0.5" />
    </g>
  );
}

/** A pointing hand with a cuff: the tap pointer, not a character's arm. */
function Pointer({ x, y, frame, from, until }: { x: number; y: number; frame: number; from: number; until: number }) {
  if (frame < from || frame > until) return null;
  const s = springIn(frame, from, { damping: 11, stiffness: 150 }) * (1 - tween(frame, until - 14, until, 0, 1, EASE.in));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-40" y="-168" width="80" height="54" rx="16" fill={PAPER} stroke={INK} strokeWidth="6" />
      <path d="M-38 -124 Q-44 -46 -16 -16 Q0 0 16 -16 Q40 -44 38 -124 Z" fill="#f1c9a5" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <path d="M-6 -20 L-6 14" stroke="#f1c9a5" strokeWidth="26" strokeLinecap="round" />
      <path d="M-6 -20 L-6 14" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" opacity="0.18" />
      <circle cx="-6" cy="16" r="13" fill="#f1c9a5" stroke={INK} strokeWidth="6" />
    </g>
  );
}

/** A pour: a ribbon drawn in from the lip, detaching at the tail when it stops. */
function Pour({ frame, from, to, x1, y1, x2, y2, color = WATER, width = 17, seed = 0 }: { frame: number; from: number; to: number; x1: number; y1: number; x2: number; y2: number; color?: string; width?: number; seed?: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1) * 1.12;
  const head = tween(frame, from, from + 10, 0, 1, EASE.out);
  const tail = tween(frame, to, to + 14, 0, 1, EASE.in);
  if (head <= 0 || tail >= 1) return null;
  const wob = Math.sin(frame / 3.2 + seed) * 11;
  const d = `M${x1} ${y1} Q${(x1 + x2) / 2 + wob} ${(y1 + y2) / 2} ${x2} ${y2}`;
  return (
    <path
      d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round"
      strokeDasharray={`${len} ${len}`} strokeDashoffset={len * (1 - head) - len * tail}
    />
  );
}

/** Bubbles rising to a surface. */
function Bubbles({ frame, from, x, y, surface }: { frame: number; from: number; x: number; y: number; surface: number }) {
  if (frame < from) return null;
  return (
    <g>
      {[0, 1, 2, 3].map((i) => {
        const t = ((frame - from + i * 9) % 40) / 40;
        const yy = y - (y - surface) * t;
        return <circle key={i} cx={x + Math.sin(t * 5 + i) * 11} cy={yy} r={4 + i * 1.6} fill="#fff" opacity={(1 - t) * 0.8} />;
      })}
    </g>
  );
}

/** A puff of dust when something sinks into the pile. */
function Puff({ frame, from, x, y }: { frame: number; from: number; x: number; y: number }) {
  const p = tween(frame, from, from + 26, 0, 1, EASE.out);
  if (p <= 0 || p >= 1) return null;
  return (
    <g opacity={1 - p}>
      {[-1, -0.45, 0.45, 1].map((k, i) => (
        <circle key={i} cx={x + k * 78 * p} cy={y - 26 * p - Math.abs(k) * 10} r={13 + i * 2 + p * 16} fill={SUGAR} opacity="0.85" />
      ))}
    </g>
  );
}

// ---------------------------------------------------------------- the counter beats
// Timings for the four word beats, so the rhythm is visible in one place.
const W1 = { card: 126, cup1: 140, cup2: 190, tap1: 164, tap2: 214, badge1: 168, badge2: 218, steam: 228, fly: 248, land: 282 };
const W2 = { card: 336, glass: 336, lift: 340, tipped: 380, pourOn: 384, pourOff: 446, back: 450, drop: 440, hit: 464, sink: 482, boat: 494 };
const W3 = { card: 546, lift: 548, tipped: 604, pourOn: 606, pourOff: 642, back: 648, drop: 644, hit: 664, puff: 670, spoon: 680, boat: 696 };
const W4 = { card: 726, plate: 726, s1: 740, s2: 762, split: 784, swipe: 792, fly: 804, land: 828, reach: 838 };

const JUG_POUR = { x: 553, y: 858 };
const JAR_POUR = { x: 600, y: 858 };
const WATER_LEVEL = 0.78;
const SURFACE_Y = PROP_Y - 8 - 118 * WATER_LEVEL; // the water line in the full glass

/** The white card at the top of every word beat. */
function CardShell({ frame, from, until, children }: { frame: number; from: number; until: number; children: React.ReactNode }) {
  const s = springIn(frame, from, { damping: 11, stiffness: 130 });
  const out = tween(frame, until - 10, until, 0, 1, EASE.in);
  if (s <= 0) return null;
  return (
    <g transform={`translate(540 ${CARD.y + CARD.h / 2}) scale(${s}) translate(-540 ${-(CARD.y + CARD.h / 2)})`} opacity={1 - out}>
      <rect x={CARD.x + 8} y={CARD.y + 12} width={CARD.w} height={CARD.h} rx="44" fill={INK} opacity="0.18" />
      <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx="44" fill="#fff" stroke={INK} strokeWidth="5" />
      {children}
    </g>
  );
}

// w1: "a coffee, two coffee" with the s clipping on at the end
const W1_SEGS = layoutSegs([{ t: "a coffee, two coffee", size: 64 }, { t: "s", size: 64, w: tileW("s", 64), gap: 12 }], 64, 540);
const W1_SLOT = { cx: W1_SEGS[1].x + W1_SEGS[1].w / 2, cy: CARD_BASE - 18, w: W1_SEGS[1].w, h: 102 };

// w2 and w3: two plain cards, the uncountable word in the accent
const W2_SEGS = layoutSegs([{ t: "some", size: 78, color: ACCENT }, { t: "water", size: 78, gap: 22 }], 78, 540);
const W3_SEGS = layoutSegs([{ t: "some", size: 78, color: ACCENT }, { t: "sugar", size: 78, gap: 22 }], 78, 540);

// w4: the word splits so "ch" shows, then "es" clips on after it
const W4_SEGS = layoutSegs(
  [{ t: "a sandwich, two sandwi", size: 54 }, { t: "ch", size: 54, gap: 15 }, { t: "es", size: 54, w: tileW("es", 54), gap: 12 }],
  54, 540,
);
const W4_SLOT = { cx: W4_SEGS[2].x + W4_SEGS[2].w / 2, cy: CARD_BASE - 14, w: W4_SEGS[2].w, h: 92 };

function CounterScene({ frame, beat }: { frame: number; beat: Beat }) {
  // The camera cuts in on the counter through the hook, then settles back as
  // the first word card arrives.
  const z = frame < 120
    ? 1 + 0.045 * tween(frame, 0, 118, 0, 1, EASE.inOut)
    : 1 + 0.045 * (1 - tween(frame, 120, 152, 0, 1, EASE.inOut));

  const id = beat.id;
  const hook = id === "hook";
  const nod = frame >= 62 && frame < 100 ? Math.sin((frame - 62) / 3.4) * 9 * Math.exp(-(frame - 62) / 22) : 0;

  // w2: the jug lifts from its place, tips, pours, goes back
  const jugT = tween(frame, W2.lift, W2.lift + 36, 0, 1, EASE.inOut) - tween(frame, W2.back, W2.back + 36, 0, 1, EASE.inOut);
  const jugX = JUG_HOME + (JUG_POUR.x - JUG_HOME) * jugT;
  const jugY = PROP_Y + (JUG_POUR.y - PROP_Y) * jugT;
  const jugRot = tween(frame, W2.tipped - 24, W2.tipped, 0, 30, EASE.inOut) - tween(frame, W2.pourOff + 2, W2.pourOff + 18, 0, 30, EASE.inOut);
  const level = tween(frame, W2.pourOn + 2, W2.pourOn + 66, 0, WATER_LEVEL, EASE.out);

  // w3: the sugar jar does the same move, mirrored in rhythm
  const jarT = tween(frame, W3.lift, W3.lift + 36, 0, 1, EASE.inOut) - tween(frame, W3.back, W3.back + 36, 0, 1, EASE.inOut);
  const jarX = JAR_HOME + (JAR_POUR.x - JAR_HOME) * jarT;
  const jarY = PROP_Y + (JAR_POUR.y - PROP_Y) * jarT;
  const jarRot = tween(frame, W3.tipped - 22, W3.tipped, 0, 35, EASE.inOut) - tween(frame, W3.pourOff + 2, W3.pourOff + 18, 0, 35, EASE.inOut);
  const pileW = tween(frame, W3.pourOn + 4, W3.pourOn + 40, 0, 88, EASE.out);
  const pileH = tween(frame, W3.pourOn + 4, W3.pourOn + 40, 0, 48, EASE.out);

  // the pointer that taps each cup
  const tapT = frame < 190 ? CUP1_X : tween(frame, 180, 204, CUP1_X, CUP2_X, EASE.inOut);
  const tapDown = (at: number) => tween(frame, at - 12, at, 0, 1, EASE.out) - tween(frame, at, at + 14, 0, 1, EASE.inOut);
  const tapY = 760 + 172 * (tapDown(W1.tap1) + tapDown(W1.tap2));

  // the s and es tiles, each flying from the thing that made them plural
  const sT = tween(frame, W1.fly, W1.land, 0, 1, EASE.inOut);
  const esT = tween(frame, W4.fly, W4.land, 0, 1, EASE.inOut);

  return (
    <AbsoluteFill style={{ background: WALL, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "540px 1000px" }}>
        <Stage>
          <defs>
            <clipPath id="grm2-glass"><path d={GLASS_PATH} /></clipPath>
          </defs>
          <WallSet />

          {/* leo keeps the counter; you order from the other side of it */}
          <g transform={`translate(0 ${nod})`}>
            <Character
              who="leo" x={LEO_X} y={FEET_Y} scale={BODY} facing={1} frame={frame} enter={0} legs={false} seed={2}
              gaze={0.8} mood={frame >= W2.boat ? "happy" : "neutral"}
              gesture={frame >= W2.boat ? "raise" : frame >= 70 && frame < 120 ? "serve" : "idle"}
              gestureAt={frame >= W2.boat ? W2.boat : 70}
              talking={frame >= 96 && frame < 116}
            />
          </g>
          <Character
            who="you" x={YOU_X} y={FEET_Y} scale={BODY} facing={-1} frame={frame} enter={0} legs={false} seed={6}
            gaze={0.7} mood={hook || frame >= W4.reach ? "happy" : "neutral"}
            talking={frame >= 8 && frame < 92}
            gesture={frame >= W4.reach ? "point" : hook ? "two" : "idle"}
            gestureAt={frame >= W4.reach ? W4.reach : 24}
          />

          <CounterTop />

          {/* set dressing: the jug and the sugar jar live on the counter */}
          {id !== "w2" ? <Jug x={JUG_HOME} y={PROP_Y} scale={0.78} /> : null}
          {id !== "w3" ? <SugarJar x={JAR_HOME} y={PROP_Y} scale={0.82} lid={id === "hook" || id === "w1" || id === "w2"} /> : null}

          {/* hook: two cups and a glass wait as grey outlines */}
          {hook ? (
            <g>
              <MugOutline x={CUP1_X} y={PROP_Y} frame={frame} appear={78} />
              <MugOutline x={CUP2_X} y={PROP_Y} frame={frame} appear={88} />
              <Glass x={GLASS_X} y={PROP_Y} frame={frame} appear={98} outline />
            </g>
          ) : null}

          {/* w1: one cup, then two, each counted */}
          {id === "w1" ? (
            <g>
              <MugOutline x={CUP1_X} y={PROP_Y} frame={frame} appear={120} fade={W1.cup1 - 4} />
              <MugOutline x={CUP2_X} y={PROP_Y} frame={frame} appear={120} fade={W1.cup2 - 4} />
              <Glass x={GLASS_X} y={PROP_Y} frame={frame} appear={120} outline />
              <Cup kind="mug" x={CUP1_X} y={PROP_Y} frame={frame} appear={W1.cup1} scale={0.95} steam={frame >= W1.steam} seed={1} />
              <Cup kind="mug" x={CUP2_X} y={PROP_Y} frame={frame} appear={W1.cup2} scale={0.95} steam={frame >= W1.steam} seed={5} />
              <Pointer x={tapT} y={tapY} frame={frame} from={W1.tap1 - 14} until={W1.tap2 + 26} />
              <Badge frame={frame} from={W1.badge1} text="1" x={CUP1_X} y={BADGE_Y} size={104} />
              <Badge frame={frame} from={W1.badge2} text="2" x={CUP2_X} y={BADGE_Y} size={104} />
            </g>
          ) : null}

          {/* w2: the glass fills, the 2 slides off the water, some floats */}
          {id === "w2" ? (
            <g>
              <Glass x={GLASS_X} y={PROP_Y} frame={frame} appear={330} outline fade={330} />
              <Glass x={GLASS_X} y={PROP_Y} frame={frame} appear={W2.glass} level={level} />
              <Pour frame={frame} from={W2.pourOn} to={W2.pourOff} x1={720} y1={766} x2={GLASS_X} y2={880} />
              <Jug x={jugX} y={jugY} rot={jugRot} scale={0.78} level={0.62 - 0.18 * (level / WATER_LEVEL)} />
              <Bubbles frame={frame} from={W2.sink} x={790} y={968} surface={SURFACE_Y} />
              {frame < W2.sink + 12 ? (
                <MagnetTile
                  frame={frame} from={W2.drop} t="2" size={56}
                  cx={tween(frame, W2.drop, W2.hit, GLASS_X, GLASS_X, EASE.out) + tween(frame, W2.hit, W2.sink, 0, 46, EASE.in)}
                  cy={tween(frame, W2.drop, W2.hit, 540, 880, EASE.bounce) + tween(frame, W2.hit, W2.sink, 0, 74, EASE.in)}
                  rot={tween(frame, W2.hit, W2.sink, 0, 74, EASE.inOut)}
                  opacity={1 - tween(frame, W2.sink - 10, W2.sink + 12, 0, 1, EASE.in)}
                />
              ) : null}
              {frame >= W2.boat ? (
                <g>
                  <path
                    d={`M${GLASS_X - 54} ${SURFACE_Y + 2} q 18 -8 27 0 q 9 8 27 0`}
                    fill="none" stroke={WATER_TOP} strokeWidth="5" strokeLinecap="round"
                  />
                  <MagnetTile frame={frame} from={W2.boat} t="some" size={44} cx={GLASS_X} cy={SURFACE_Y - 34 + Math.sin((frame - W2.boat) / 9) * 6} />
                </g>
              ) : null}
            </g>
          ) : null}

          {/* w3: sugar pours in a pile, the 2 sinks, some comes up on a spoon */}
          {id === "w3" ? (
            <g>
              <SugarJar x={jarX} y={jarY} rot={jarRot} scale={0.82} lid={false} />
              {frame >= W3.lift + 6 ? (
                <g transform={`translate(${JAR_HOME} ${PROP_Y})`} opacity={tween(frame, W3.lift + 6, W3.lift + 20, 0, 1, EASE.out)}>
                  <rect x="-38" y="-18" width="76" height="18" rx="8" fill={WOOD_LIGHT} stroke={INK} strokeWidth="5" />
                  <rect x="-11" y="-30" width="23" height="14" rx="6" fill={WOOD_LIGHT} stroke={INK} strokeWidth="5" />
                </g>
              ) : null}
              <Pour frame={frame} from={W3.pourOn} to={W3.pourOff} x1={710} y1={792} x2={PILE_X} y2={PROP_Y - 6} color={SUGAR} width={15} seed={3} />
              <Pile x={PILE_X} y={PROP_Y} w={pileW} h={pileH} frame={frame} />
              <Puff frame={frame} from={W3.puff} x={PILE_X} y={PROP_Y - 20} />
              {frame < W3.hit + 14 ? (
                <MagnetTile
                  frame={frame} from={W3.drop} t="2" size={56} cx={PILE_X}
                  cy={tween(frame, W3.drop, W3.hit, 540, 946, EASE.out) + tween(frame, W3.hit, W3.hit + 14, 0, 46, EASE.in)}
                  opacity={1 - tween(frame, W3.hit, W3.hit + 14, 0, 1, EASE.in)}
                />
              ) : null}
              <Spoon
                x={PILE_X} y={tween(frame, W3.spoon + 4, W3.spoon + 24, 966, 876, EASE.out)}
                frame={frame} from={W3.spoon} scoop={frame >= W3.spoon + 8}
              />
              <MagnetTile frame={frame} from={W3.boat} t="some" size={44} cx={PILE_X - 14} cy={800} />
            </g>
          ) : null}

          {/* w4: two sandwiches, and you reach for one */}
          {id === "w4" ? (
            <g>
              <Plate x={PLATE_X} y={PROP_Y} frame={frame} from={W4.plate} />
              <Sandwich x={655} y={PROP_Y - 12} frame={frame} from={W4.s1} lean={-5} />
              <Sandwich x={748} y={PROP_Y - 12} frame={frame} from={W4.s2} lean={6} />
            </g>
          ) : null}

          {/* the word card, and the tiles that clip on to it */}
          {id === "w1" ? (
            <g>
              <CardShell frame={frame} from={W1.card} until={330}>
                <SegText s={W1_SEGS[0]} y={CARD_BASE} />
                {frame < W1.land ? <Slot cx={W1_SLOT.cx} cy={W1_SLOT.cy} w={W1_SLOT.w} h={W1_SLOT.h} frame={frame} from={W1.card + 10} /> : null}
                {frame >= W1.land ? (
                  <g>
                    <MagnetTile frame={frame} from={W1.land} t="s" size={64} cx={W1_SLOT.cx} cy={W1_SLOT.cy} />
                    <Clack frame={frame} at={W1.land + 2} x={W1_SLOT.cx - W1_SLOT.w / 2} y={W1_SLOT.cy} />
                  </g>
                ) : null}
              </CardShell>
              {frame >= W1.fly && frame < W1.land ? (
                <MagnetTile
                  frame={frame} from={W1.fly} t="s" size={64}
                  cx={bez(sT, CUP2_X, 560, W1_SLOT.cx)} cy={bez(sT, BADGE_Y, 520, W1_SLOT.cy)}
                  rot={-18 + 18 * sT}
                />
              ) : null}
            </g>
          ) : null}

          {id === "w2" ? (
            <CardShell frame={frame} from={W2.card} until={540}>
              {W2_SEGS.map((s) => <SegText key={s.t} s={s} y={CARD_BASE + 6} />)}
              <Swipe frame={frame} from={W2.card + 16} x={W2_SEGS[0].x - 6} y={CARD_BASE + 16} w={W2_SEGS[0].w + 12} />
            </CardShell>
          ) : null}

          {id === "w3" ? (
            <CardShell frame={frame} from={W3.card} until={720}>
              {W3_SEGS.map((s) => <SegText key={s.t} s={s} y={CARD_BASE + 6} />)}
              <Swipe frame={frame} from={W3.card + 16} x={W3_SEGS[0].x - 6} y={CARD_BASE + 16} w={W3_SEGS[0].w + 12} />
            </CardShell>
          ) : null}

          {id === "w4" ? (
            <g>
              <CardShell frame={frame} from={W4.card} until={880}>
                <SegText s={W4_SEGS[0]} y={CARD_BASE} />
                <g transform={`translate(${-15 * (1 - tween(frame, W4.split, W4.split + 16, 0, 1, EASE.out))} 0)`}>
                  <SegText s={W4_SEGS[1]} y={CARD_BASE} />
                  <Swipe frame={frame} from={W4.swipe} x={W4_SEGS[1].x - 5} y={CARD_BASE + 12} w={W4_SEGS[1].w + 10} h={14} />
                </g>
                {frame < W4.land ? <Slot cx={W4_SLOT.cx} cy={W4_SLOT.cy} w={W4_SLOT.w} h={W4_SLOT.h} frame={frame} from={W4.split} /> : null}
                {frame >= W4.land ? (
                  <g>
                    <MagnetTile frame={frame} from={W4.land} t="es" size={54} cx={W4_SLOT.cx} cy={W4_SLOT.cy} />
                    <Clack frame={frame} at={W4.land + 2} x={W4_SLOT.cx - W4_SLOT.w / 2} y={W4_SLOT.cy} />
                  </g>
                ) : null}
              </CardShell>
              {frame >= W4.fly && frame < W4.land ? (
                <MagnetTile
                  frame={frame} from={W4.fly} t="es" size={54}
                  cx={bez(esT, 748, 860, W4_SLOT.cx)} cy={bez(esT, 930, 560, W4_SLOT.cy)}
                  rot={14 - 14 * esT}
                />
              ) : null}
            </g>
          ) : null}
        </Stage>
      </AbsoluteFill>

      {/* the order that starts the lesson */}
      {hook ? (
        <SpeechBubble
          text="Two coffees and some water, please." targets={["Two coffees", "some water"]}
          x={140} y={348} w={790} from={10} until={104} frame={frame} tail="right" tailX={680} size={52}
        />
      ) : null}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- practise
const KAR_FROM = 920;
const KAR_TO = 1040;
const P_WORDS: { t: string; tail?: string; accent?: boolean }[] = [
  { t: "Two" },
  { t: "coffee", tail: "s" },
  { t: "and" },
  { t: "some", accent: true },
  { t: "water," },
  { t: "please." },
];
const P_REACH = (() => {
  const chars = P_WORDS.reduce((a, w) => a + w.t.length + (w.tail?.length ?? 0) + 1, 0);
  let acc = 0;
  return P_WORDS.map((w) => {
    acc += w.t.length + (w.tail?.length ?? 0) + 1;
    return KAR_FROM + (acc / chars) * (KAR_TO - KAR_FROM);
  });
})();

/** A green tick, for the order that came out right. */
function Tick({ x, y, frame, from, r = 46 }: { x: number; y: number; frame: number; from: number; r?: number }) {
  const s = springIn(frame, from, { damping: 8, stiffness: 210 });
  if (s <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={r + 5} fill={INK} />
      <circle r={r} fill={SEA} />
      <path d={`M${-r * 0.44} 0 L${-r * 0.1} ${r * 0.34} L${r * 0.46} ${-r * 0.36}`} fill="none" stroke="#fff" strokeWidth={r * 0.2} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function PractiseScene({ frame }: { frame: number }) {
  const circle = springIn(frame, 884, { damping: 11, stiffness: 120 });
  const yourTurn = frame >= 1060;
  const turn = springIn(frame, 1060, { damping: 9, stiffness: 160 });
  const resumed = frame >= 1066;

  return (
    <AbsoluteFill style={{ background: PALE }}>
      <Stage>
        <defs><clipPath id="grm2-leo"><circle cx="540" cy="420" r="290" /></clipPath></defs>
        <g transform={`translate(540 420) scale(${circle}) translate(-540 -420)`}>
          <circle cx="552" cy="434" r="290" fill={INK} />
          <circle cx="540" cy="420" r="290" fill="#fff" />
          <circle cx="540" cy="420" r="290" fill="none" stroke={SAFFRON} strokeWidth="14" />
          <g clipPath="url(#grm2-leo)">
            <Character
              who="leo" x={540} y={1170} scale={2} facing={1} frame={frame} enter={888} seed={2}
              mood={resumed ? "happy" : "neutral"} talking={frame >= 896 && frame < KAR_TO}
              gesture="two" gestureAt={900} legs={false}
            />
          </g>
        </g>

        {/* the outlines from the hook, filled in at last */}
        {resumed ? (
          <g>
            <line x1="300" y1="1134" x2="800" y2="1134" stroke={FOG} strokeWidth="6" strokeLinecap="round" />
            <Cup kind="mug" x={430} y={1130} frame={frame} appear={1068} scale={0.78} steam={false} seed={1} />
            <Cup kind="mug" x={540} y={1130} frame={frame} appear={1076} scale={0.78} steam={false} seed={5} />
            <Glass x={660} y={1130} frame={frame} appear={1084} level={WATER_LEVEL} scale={0.72} />
            <Tick x={772} y={1072} frame={frame} from={1092} r={42} />
          </g>
        ) : null}

        {yourTurn && !resumed ? (
          <g transform={`translate(152 254) scale(${turn}) translate(-152 -254)`}>
            <Pulse frame={frame} x={152} y={254} size={120}>
              <g transform="translate(-30 -30) scale(2.5)" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" />
              </g>
            </Pulse>
            <text x="152" y="362" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="36" fill={INK}>Your turn</text>
          </g>
        ) : null}
      </Stage>

      <Eyebrow text="SAY IT WITH ME" x={0} y={726} align="center" frame={frame} from={898} />
      <div
        style={{
          position: "absolute", left: 60, right: 60, top: 800, display: "flex", flexWrap: "wrap",
          justifyContent: "center", columnGap: 26, rowGap: 0, fontSize: 80, fontWeight: 800, lineHeight: 1.14,
        }}
      >
        {P_WORDS.map((w, i) => {
          const on = frame >= P_REACH[i];
          const s = springIn(frame, P_REACH[i], { damping: 8, stiffness: 220 });
          return (
            <span
              key={w.t}
              style={{
                display: "inline-block", color: on ? (w.accent ? ACCENT : INK) : FOG,
                transform: `translateY(${on ? (1 - s) * -14 : 0}px) scale(${on ? 1 + (1 - s) * 0.16 : 1})`,
              }}
            >
              {w.t}
              {w.tail ? <span style={{ color: on ? ACCENT : FOG }}>{w.tail}</span> : null}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- recap
const R_LEFT = layoutSegs([{ t: "two coffee", size: 52 }, { t: "s", size: 52, color: ACCENT }], 52, 300);
const R_RIGHT = layoutSegs([{ t: "some", size: 52, color: ACCENT }, { t: "water", size: 52, gap: 16 }], 52, 780);

function RecapScene({ frame }: { frame: number }) {
  const card = springIn(frame, 1126, { damping: 11, stiffness: 110 });
  return (
    <AbsoluteFill style={{ background: ACCENT }}>
      <Stage>
        <defs>
          <pattern id="grm2-stripes" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="30" height="60" fill={PAPER} opacity="0.06" />
          </pattern>
        </defs>
        <rect width="1080" height="1440" fill="url(#grm2-stripes)" />

        <g transform={`translate(540 670) scale(${card}) translate(-540 -670)`}>
          <rect x="80" y="354" width="940" height="660" rx="52" fill={INK} opacity="0.25" />
          <rect x="70" y="340" width="940" height="660" rx="52" fill="#fff" />
          <line x1="540" y1="396" x2="540" y2="944" stroke={FOG} strokeWidth="5" strokeDasharray="16 14" />

          <text x="300" y="440" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="34" letterSpacing="4" fill={FAINT}>count it</text>
          <text x="780" y="440" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="34" letterSpacing="4" fill={FAINT}>cannot count it</text>

          <Cup kind="mug" x={248} y={762} frame={frame} appear={1140} scale={0.78} steam={false} seed={1} />
          <Cup kind="mug" x={356} y={762} frame={frame} appear={1150} scale={0.78} steam={false} seed={5} />
          <Glass x={780} y={762} frame={frame} appear={1144} level={WATER_LEVEL} scale={0.86} />

          {R_LEFT.map((s) => <SegText key={s.t} s={s} y={898} />)}
          {R_RIGHT.map((s) => <SegText key={s.t} s={s} y={898} />)}
          <Swipe frame={frame} from={1160} x={R_LEFT[1].x - 4} y={908} w={R_LEFT[1].w + 8} h={14} />
          <Swipe frame={frame} from={1168} x={R_RIGHT[0].x - 5} y={908} w={R_RIGHT[0].w + 10} h={14} />
        </g>
      </Stage>
      <Eyebrow text="REMEMBER" x={0} y={246} align="center" color={PAPER} frame={frame} from={1132} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- composition

export function TwoCoffeesExplainer({ l1 }: { l1?: Record<string, string> }) {
  const frame = useCurrentFrame();
  const beat = grm2BeatAt(frame);
  const progress = (frame - beat.from) / Math.max(1, Math.min(120, beat.to - beat.from));
  const k = karaoke(beat.line, Math.min(1, progress));
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: PAPER, overflow: "hidden" }}>
      {beat.kind === "hook" || beat.kind === "word" ? <CounterScene frame={frame} beat={beat} /> : null}
      {beat.kind === "practise" ? <PractiseScene frame={frame} /> : null}
      {beat.kind === "recap" ? <RecapScene frame={frame} /> : null}
      <Transition frame={frame} at={880} kind="slide" color={ACCENT} color2={SAFFRON} />
      <Transition frame={frame} at={1120} kind="wipe" color={SAFFRON} color2={INK} />
      <CaptionBar line={beat.line} k={k} targets={beat.target} l1={l1?.[beat.id]} />
      <BeatProgress frame={frame} beats={GRM2_BEATS} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- L1 captions
export const GRM2_L1: Record<string, Record<string, string>> = {
  ar: {
    hook: "قهوتان وبعض الماء، من فضلك.",
    w1: "يمكن عدّ القهوة: قهوة، قهوتان.",
    w2: "لا يمكن عدّ الماء. قل some.",
    w3: "السكر أيضًا لا يُعد.",
    w4: "أضف es بعد ch.",
    practise: "قلها معي.",
    recap: "معدود: رقم و s. غير معدود: some.",
  },
  es: {
    hook: "Dos cafés y algo de agua, por favor.",
    w1: "Los cafés se cuentan: uno, dos.",
    w2: "El agua no se cuenta. Di some.",
    w3: "El azúcar tampoco se cuenta.",
    w4: "Añade es después de ch.",
    practise: "Dilo conmigo.",
    recap: "Se cuenta: número y s. No se cuenta: some.",
  },
  hi: {
    hook: "दो कॉफ़ी और थोड़ा पानी, कृपया।",
    w1: "कॉफ़ी गिनी जा सकती है: एक, दो।",
    w2: "पानी गिना नहीं जाता। some कहें।",
    w3: "चीनी भी नहीं गिनी जाती।",
    w4: "ch के बाद es जोड़ें।",
    practise: "मेरे साथ बोलो।",
    recap: "गिन सकते हैं: संख्या और s। नहीं: some।",
  },
  ru: {
    hook: "Два кофе и немного воды, пожалуйста.",
    w1: "Кофе можно сосчитать: один, два.",
    w2: "Воду не сосчитать. Говори some.",
    w3: "Сахар тоже не считают.",
    w4: "После ch добавь es.",
    practise: "Скажи со мной.",
    recap: "Считаем: число и s. Не считаем: some.",
  },
  tr: {
    hook: "İki kahve ve biraz su, lütfen.",
    w1: "Kahve sayılır: bir, iki.",
    w2: "Su sayılmaz. Some de.",
    w3: "Şeker de sayılmaz.",
    w4: "ch'den sonra es ekle.",
    practise: "Benimle söyle.",
    recap: "Sayılıyorsa: sayı ve s. Sayılmıyorsa: some.",
  },
  zh: {
    hook: "两杯咖啡和一些水，谢谢。",
    w1: "咖啡可以数：一杯，两杯。",
    w2: "水不可数。用 some。",
    w3: "糖也不可数。",
    w4: "ch 后面加 es。",
    practise: "跟我一起说。",
    recap: "可数：数字加 s。不可数：some。",
  },
};

export const EXPLAINER: {
  component: React.FC<{ l1?: Record<string, string> }>;
  beats: Beat[];
  duration: number;
  fps: number;
  width: number;
  height: number;
  l1: Record<string, Record<string, string>>;
} = {
  component: TwoCoffeesExplainer,
  beats: GRM2_BEATS,
  duration: GRM2_DURATION,
  fps: GRM2_FPS,
  width: GRM2_W,
  height: GRM2_H,
  l1: GRM2_L1,
};
