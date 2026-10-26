"use client";

// "Meet Fatima" (ATM-A1-SPK-0005): a Remotion composition (1080x1440, 30 fps,
// 45 s, 1350 frames) built from docs/explainers/storyboards.md. Seven beats:
// hook, three notices, explain, say it with me, recap.
// One target: three connected "I" sentences, I'm ... / I live in ... / I work in ...
// Everything is a pure function of useCurrentFrame(), so the same component plays
// in the Remotion Player and renders deterministically to MP4.
//
// Built on the shared kit in ./lib. Fatima, her shop (awning, window, counter,
// shelves), the Dubai skyline, the map pin, the ID badge and the recap icons are
// not in the kit, so they live here as local flat-vector parts drawn to the same
// rig and palette (lib.tsx and Cafe.tsx are owned elsewhere).

import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { CSSProperties, ReactNode } from "react";
import {
  ACCENT, BeatProgress, Birds, blink, CaptionBar, Character, CREAM, Cup, EASE, Eyebrow, FAINT, FOG, FONT, hash,
  INK, karaoke, PAPER, Pulse, SAFFRON, SEA, SpeechBubble, springIn, Stage, Transition, tween, WOOD, WOOD_DARK,
  WOOD_LIGHT,
} from "./lib";

// ---------------------------------------------------------------- beats
export type Beat = {
  id: string;
  from: number;
  to: number;
  line: string;
  target?: string[];
  kind: "hook" | "notice" | "explain" | "practise" | "recap";
  pauseAt?: number;
};

export const SPK_BEATS: Beat[] = [
  { id: "hook", kind: "hook", from: 0, to: 135, line: "Hello. I'm Fatima.", target: ["I'm"] },
  { id: "n1", kind: "notice", from: 135, to: 285, line: "I live in Dubai.", target: ["I live in"] },
  { id: "n2", kind: "notice", from: 285, to: 435, line: "I work in a shop.", target: ["I work in"] },
  { id: "n3", kind: "notice", from: 435, to: 585, line: "I like tea and I don't like coffee.", target: ["I like", "I don't like"] },
  { id: "explain", kind: "explain", from: 585, to: 930, line: "I'm, I live, I work. Three sentences. That is you.", target: ["I'm", "I live", "I work"] },
  { id: "practise", kind: "practise", from: 930, to: 1230, line: "Say it with me. I live in Dubai and I work in a shop.", target: ["I live in", "I work in"], pauseAt: 1140 },
  { id: "recap", kind: "recap", from: 1230, to: 1350, line: "I'm ... I live in ... I work in ...", target: ["I'm", "I live in", "I work in"] },
];
export const SPK_DURATION = 1350;

export function spkBeatAt(frame: number): Beat {
  return SPK_BEATS.find((b) => frame >= b.from && frame < b.to) ?? SPK_BEATS[SPK_BEATS.length - 1];
}

const stripPunctuation = (w: string) => w.replace(/[.,?!…]/g, "");

/** Match the target phrases to the words as the caption spells them, so they light up. */
function captionTargets(beat: Beat): string[] | undefined {
  if (!beat.target) return undefined;
  const lineWords = beat.line.split(" ").map(stripPunctuation);
  return beat.target.map((t) =>
    t
      .split(" ")
      .map((part) => lineWords.find((w) => w.toLowerCase() === part.toLowerCase()) ?? part)
      .join(" "),
  );
}

// ---------------------------------------------------------------- palette
// Fatima's shop in Dubai, warm morning light. Blues and teals only; no purple.
const SKY_HIGH = "#f6ead8";
const SKY_LOW = "#e3eef6";
const WALL = "#e7d9c3";
const WALL_DARK = "#d5c3a9";
const WALL_IN = "#eee3d2";
const AWNING = "#2f7f8a";
const AWNING_DARK = "#266a73";
const GLASS = "#cfe3ef";
const GLASS_DARK = "#b6d3e3";
const PAVE = "#cfc8bd";
const PAVE_DARK = "#b8b1a6";
const CITY = "#7fa0bb";
const CITY_DARK = "#6b8da9";
const CITY_SKY = "#dceaf4";
const GREY_FIG = "#9b9eb0";
const CORAL = "#e07a5f";
const PALE_BLUE = "#e9f1fb";
// Fatima: leaf-green headscarf, warm grey abaya, round glasses.
const SCARF = SEA;
const SCARF_DARK = "#17997a";
const ABAYA = "#9a938c";
const ABAYA_DARK = "#857e78";
const F_SKIN = "#c98f62";

// The shop set, shared by every beat that plays in it.
const FLOOR_Y = 1150;
const COUNTER_Y = 960;
const WIN = { x: 470, y: 600, w: 540, h: 350 };

// The kit's character rig, mirrored here so a held prop sits in the hand.
const SHOULDER = { x: 46, y: -300 };
const UPPER = 78;
const FORE = 72;

// ---------------------------------------------------------------- fatima
type FatimaArm = "idle" | "wave" | "point" | "hold";
type FatimaProps = {
  x: number;
  y: number;
  frame: number;
  scale?: number;
  facing?: 1 | -1;
  enter?: number;
  slideFrom?: number;
  talking?: boolean;
  walking?: boolean;
  arm?: FatimaArm;
  armAt?: number;
  nodAt?: number;
  shakeAt?: number;
  smile?: boolean;
  seed?: number;
};

const F_POSE: Record<Exclude<FatimaArm, "idle">, { s: number; e: number }> = {
  wave: { s: 150, e: 40 },
  point: { s: 78, e: 6 },
  hold: { s: 52, e: 72 },
};

/**
 * Fatima: 52, Dubai shop owner, leaf-green headscarf, warm grey abaya, round
 * glasses. Same proportions as the kit's `Character` (origin at the feet, head
 * at -400, shoulders at -300) so she stands beside `you` at the same scale.
 */
function Fatima(p: FatimaProps) {
  const { x, y, frame } = p;
  const scale = p.scale ?? 1;
  const facing = p.facing ?? 1;
  const enter = p.enter ?? 0;
  const seed = p.seed ?? 31;
  if (frame < enter) return null;
  const s = springIn(frame, enter, { damping: 10, stiffness: 150 });
  const slide = (p.slideFrom ?? 0) * (1 - tween(frame, enter, enter + 22, 0, 1, EASE.out));
  const br = Math.sin((frame + seed * 5) / 16);
  const walkT = frame / 4.5;
  const bob = p.walking ? Math.abs(Math.sin(walkT)) * 7 : br * 1.6;
  const bl = blink(frame, seed);
  const nod = p.nodAt !== undefined && frame >= p.nodAt && frame < p.nodAt + 30
    ? Math.sin((frame - p.nodAt) / 2.6) * 9 * (1 - (frame - p.nodAt) / 30)
    : 0;
  // a kind "no": the head turns side to side and settles
  const shake = p.shakeAt !== undefined && frame >= p.shakeAt && frame < p.shakeAt + 44
    ? Math.sin((frame - p.shakeAt) / 3.4) * 11 * (1 - (frame - p.shakeAt) / 44)
    : 0;
  const armA = p.arm && p.arm !== "idle" ? springIn(frame, p.armAt ?? enter, { damping: 11, stiffness: 110 }) : 0;
  const idle = { s: 7 + br * 1.5, e: 10 };
  const target = p.arm && p.arm !== "idle"
    ? p.arm === "wave"
      ? { s: F_POSE.wave.s, e: F_POSE.wave.e + Math.sin(frame / 2.6) * 28 }
      : F_POSE[p.arm]
    : idle;
  const lead = { s: idle.s + (target.s - idle.s) * armA, e: idle.e + (target.e - idle.e) * armA };

  const Arm = ({ pose, mirror }: { pose: { s: number; e: number }; mirror: boolean }) => (
    <g transform={`translate(${mirror ? -SHOULDER.x : SHOULDER.x} ${SHOULDER.y}) scale(${mirror ? -1 : 1} 1) rotate(${-pose.s})`}>
      <line x1="0" y1="0" x2="0" y2={UPPER} stroke={ABAYA} strokeWidth="26" strokeLinecap="round" />
      <g transform={`translate(0 ${UPPER}) rotate(${-pose.e})`}>
        <line x1="0" y1="0" x2="0" y2={FORE} stroke={ABAYA} strokeWidth="24" strokeLinecap="round" />
        <line x1="0" y1={FORE - 22} x2="0" y2={FORE - 6} stroke={F_SKIN} strokeWidth="22" strokeLinecap="round" />
        <circle cx="0" cy={FORE} r="14" fill={F_SKIN} />
        {p.arm === "wave" ? [-10, 0, 10].map((a) => <line key={a} x1={a * 0.6} y1={FORE} x2={a * 1.3} y2={FORE + 19} stroke={F_SKIN} strokeWidth="8" strokeLinecap="round" />) : null}
      </g>
    </g>
  );

  return (
    <g transform={`translate(${x + slide * facing} ${y}) scale(${scale * facing} ${scale * s})`}>
      <ellipse cx="0" cy="2" rx="74" ry="12" fill={INK} opacity="0.13" />
      <g transform={`translate(0 ${-bob})`}>
        <Arm pose={{ s: idle.s, e: idle.e }} mirror />
        {/* abaya */}
        <g transform={`translate(0 -150) scale(1 ${1 + br * 0.012}) translate(0 150)`}>
          <rect x="-14" y="-352" width="28" height="46" fill={F_SKIN} />
          <path d="M-60 -296 Q-60 -324 -32 -324 L32 -324 Q60 -324 60 -296 L80 -18 L-80 -18 Z" fill={ABAYA} />
          <path d="M-80 -40 Q0 -24 80 -40 L80 -18 L-80 -18 Z" fill={ABAYA_DARK} />
          {[-26, 26].map((k, i) => (
            <ellipse key={k} cx={k + (p.walking ? Math.sin(walkT + i * Math.PI) * 14 : 0)} cy="-4" rx="24" ry="10" fill={INK} />
          ))}
          <path d="M-6 -306 L6 -306 L4 -180 L-4 -180 Z" fill={ABAYA_DARK} opacity="0.5" />
          {/* scarf drape over the shoulders */}
          <path d="M-54 -332 L54 -332 L64 -246 Q0 -226 -64 -246 Z" fill={SCARF} />
          <path d="M-64 -246 Q0 -226 64 -246 L62 -232 Q0 -212 -62 -232 Z" fill={SCARF_DARK} />
        </g>
        {/* head */}
        <g transform={`translate(${shake} -400) rotate(${nod + shake * 0.3})`}>
          <path d="M-66 16 C-66 -80 -34 -100 0 -100 C34 -100 66 -80 66 16 C66 64 40 92 0 92 C-40 92 -66 64 -66 16 Z" fill={SCARF} />
          <path d="M-44 -10 C-44 -60 -24 -72 0 -72 C24 -72 44 -60 44 -10 C44 28 26 56 0 56 C-26 56 -44 28 -44 -10 Z" fill={F_SKIN} />
          <path d="M-46 -14 C-44 -58 -24 -74 0 -74 C24 -74 44 -58 46 -14 C36 -44 -36 -44 -46 -14 Z" fill={SCARF_DARK} />
          <circle cx="-30" cy="18" r="8" fill="#e08f78" opacity="0.26" />
          <circle cx="30" cy="18" r="8" fill="#e08f78" opacity="0.26" />
          <path d="M-30 -28 Q-20 -34 -9 -29" fill="none" stroke="#5a4636" strokeWidth="4" strokeLinecap="round" />
          <path d="M9 -29 Q20 -34 30 -28" fill="none" stroke="#5a4636" strokeWidth="4" strokeLinecap="round" />
          {[-19, 19].map((ex) => (
            <g key={ex} transform={`translate(${ex} -4)`}>
              <ellipse cx="0" cy="0" rx="9.5" ry={11 * Math.max(0.08, bl)} fill="#fff" />
              <circle cx={2} cy={1} r={5.2 * Math.max(0.08, bl)} fill={INK} />
              <circle cx={0} cy={-2} r={1.8 * Math.max(0, bl)} fill="#fff" />
            </g>
          ))}
          {/* round glasses */}
          <g fill="none" stroke={INK} strokeWidth="3.6">
            <circle cx="-19" cy="-4" r="17" />
            <circle cx="19" cy="-4" r="17" />
            <path d="M-2 -5 L2 -5" />
            <path d="M-36 -8 L-46 -14" strokeLinecap="round" />
            <path d="M36 -8 L46 -14" strokeLinecap="round" />
          </g>
          <path d="M4 6 Q10 14 2 17" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" opacity="0.55" />
          <FatimaMouth talking={!!p.talking} smile={!!p.smile} frame={frame} seed={seed} />
        </g>
        <Arm pose={lead} mirror={false} />
      </g>
    </g>
  );
}

function FatimaMouth({ talking, smile, frame, seed }: { talking: boolean; smile: boolean; frame: number; seed: number }) {
  if (!talking) {
    if (smile) return <path d="M-16 24 Q0 42 16 24 Q0 30 -16 24 Z" fill={INK} />;
    return <path d="M-13 26 Q0 36 13 26" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />;
  }
  const idx = Math.floor(hash(Math.floor(frame / 3), seed) * 4);
  if (idx === 0) return <ellipse cx="0" cy="30" rx="11" ry="11" fill={INK} />;
  if (idx === 1) return <ellipse cx="0" cy="29" rx="8" ry="5" fill={INK} />;
  if (idx === 2) return <rect x="-14" y="24" width="28" height="9" rx="4" fill={INK} />;
  return <path d="M-12 26 Q0 35 12 26" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />;
}

/** Screen position of Fatima's leading hand, for a prop she holds. */
function handAt(x: number, y: number, scale: number, facing: 1 | -1, pose: Exclude<FatimaArm, "idle">) {
  const p = F_POSE[pose];
  const d = (deg: number) => ({ x: Math.sin((deg * Math.PI) / 180), y: Math.cos((deg * Math.PI) / 180) });
  const el = { x: SHOULDER.x + UPPER * d(p.s).x, y: SHOULDER.y + UPPER * d(p.s).y };
  const hd = { x: el.x + FORE * d(p.s + p.e).x, y: el.y + FORE * d(p.s + p.e).y };
  return { x: x + hd.x * scale * facing, y: y + hd.y * scale };
}

// ---------------------------------------------------------------- shop props
/** A grey silhouette customer. No face, never speaks. */
function Customer({ frame, x, y, enter, leaveAt, scale = 1 }: { frame: number; x: number; y: number; enter: number; leaveAt: number; scale?: number }) {
  if (frame < enter) return null;
  const inS = springIn(frame, enter, { damping: 12, stiffness: 140 });
  const out = tween(frame, leaveAt, leaveAt + 34, 0, 1, EASE.in);
  if (out >= 1) return null;
  const px = x + (1 - inS) * 300 + out * 420;
  const walking = frame < enter + 40 || frame > leaveAt;
  const bob = walking ? Math.abs(Math.sin(frame / 4.5)) * 7 : Math.sin(frame / 18) * 1.6;
  return (
    <g transform={`translate(${px} ${y}) scale(${-scale} ${scale})`} opacity={1 - out}>
      <ellipse cx="0" cy="2" rx="62" ry="10" fill={INK} opacity="0.1" />
      <g transform={`translate(0 ${-bob})`} fill={GREY_FIG}>
        <rect x="-28" y="-170" width="24" height="170" rx="12" />
        <rect x="6" y="-170" width="24" height="170" rx="12" />
        <path d="M-52 -290 Q-52 -320 -24 -320 L24 -320 Q52 -320 52 -290 L58 -150 L-58 -150 Z" />
        <circle cx="0" cy="-392" r="56" />
        <rect x="-16" y="-352" width="32" height="40" />
        <line x1="-46" y1="-300" x2="-62" y2="-176" stroke={GREY_FIG} strokeWidth="24" strokeLinecap="round" />
        <line x1="46" y1="-300" x2="66" y2="-186" stroke={GREY_FIG} strokeWidth="24" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** A tin of tea: a lid band and a single leaf motif, nothing else. */
function TeaTin({ x, y, scale = 1, colour = AWNING, rotate = 0 }: { x: number; y: number; scale?: number; colour?: string; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${rotate})`}>
      <rect x="-38" y="-96" width="76" height="96" rx="10" fill={colour} />
      <rect x="-38" y="-96" width="76" height="20" rx="8" fill={INK} opacity="0.22" />
      <rect x="-42" y="-104" width="84" height="16" rx="7" fill={CREAM} />
      <path d="M0 -62 Q22 -54 0 -26 Q-22 -54 0 -62 Z" fill={CREAM} opacity="0.92" />
      <line x1="0" y1="-58" x2="0" y2="-30" stroke={colour} strokeWidth="3" />
    </g>
  );
}

/** A folded scarf, three bands of colour. */
function FoldedScarf({ x, y, scale = 1, colours }: { x: number; y: number; scale?: number; colours: [string, string, string] }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {colours.map((c, i) => (
        <rect key={c + i} x="-56" y={-28 - i * 26} width="112" height="24" rx="9" fill={c} />
      ))}
    </g>
  );
}

/** A shelf plank with tins and scarves on it. */
function Shelf({ x, y, w, items }: { x: number; y: number; w: number; items: ReactNode }) {
  return (
    <g>
      {items}
      <rect x={x} y={y} width={w} height="18" rx="6" fill={WOOD_LIGHT} />
      <rect x={x} y={y + 14} width={w} height="10" rx="4" fill={WOOD_DARK} opacity="0.5" />
    </g>
  );
}

/** The striped awning over the shop front, swaying two degrees. */
function Awning({ frame }: { frame: number }) {
  const sway = Math.sin(frame / 34) * 2;
  const stripes = Array.from({ length: 10 }, (_, i) => 80 + i * 92);
  return (
    <g transform={`rotate(${sway} 540 430)`}>
      <rect x="70" y="420" width="940" height="22" rx="10" fill={AWNING_DARK} />
      <path d="M80 440 L1000 440 L1000 548 L80 548 Z" fill={AWNING} />
      {stripes.map((sx, i) => (i % 2 === 0 ? <rect key={sx} x={sx} y="440" width="46" height="108" fill={CREAM} /> : null))}
      {/* scalloped bottom edge */}
      <g>
        {Array.from({ length: 10 }, (_, i) => {
          const sx = 80 + i * 92;
          return <path key={sx} d={`M${sx} 548 Q${sx + 46} 596 ${sx + 92} 548 Z`} fill={i % 2 === 0 ? CREAM : AWNING} />;
        })}
      </g>
      <path d="M80 440 L1000 440 L1000 452 L80 452 Z" fill={INK} opacity="0.12" />
    </g>
  );
}

/** A flat Dubai skyline: a tall tower, a sail-shaped hotel, simple blocks. */
function Skyline({ frame }: { frame: number }) {
  const base = WIN.y + WIN.h;
  return (
    <g>
      <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} fill={CITY_SKY} />
      <circle cx={WIN.x + 96} cy={WIN.y + 86} r="40" fill={SAFFRON} opacity="0.5" />
      <Birds frame={frame} y={WIN.y + 60} count={2} seed={9} color={CITY_DARK} speed={0.4} w={WIN.w} />
      <g fill={CITY}>
        {/* the tall tower */}
        <path d={`M${WIN.x + 262} ${base} L${WIN.x + 262} ${WIN.y + 112} L${WIN.x + 286} ${WIN.y + 40} L${WIN.x + 310} ${WIN.y + 112} L${WIN.x + 310} ${base} Z`} />
        {/* the sail-shaped hotel */}
        <path d={`M${WIN.x + 360} ${base} L${WIN.x + 360} ${WIN.y + 108} Q${WIN.x + 432} ${WIN.y + 150} ${WIN.x + 452} ${base} Z`} />
        <rect x={WIN.x + 60} y={WIN.y + 186} width="76" height={base - WIN.y - 186} />
        <rect x={WIN.x + 150} y={WIN.y + 232} width="58" height={base - WIN.y - 232} />
        <path d={`M${WIN.x + 214} ${base} L${WIN.x + 214} ${WIN.y + 168} L${WIN.x + 248} ${WIN.y + 196} L${WIN.x + 248} ${base} Z`} />
      </g>
      <g fill={CITY_DARK}>
        <rect x={WIN.x} y={base - 26} width={WIN.w} height="26" />
      </g>
    </g>
  );
}

/** The map pin: drops in, bounces once, then a house icon appears inside it. */
function MapPin({ frame, from, x, yTop, yLand }: { frame: number; from: number; x: number; yTop: number; yLand: number }) {
  if (frame < from) return null;
  const fall = tween(frame, from, from + 24, 0, 1, EASE.in);
  const t = frame - from - 24;
  const bounce = t > 0 ? Math.max(0, Math.sin(t / 7)) * 46 * Math.exp(-t / 16) : 0;
  const y = yTop + (yLand - yTop) * fall - bounce;
  const squash = t > 0 && t < 8 ? 1 + (8 - t) * 0.02 : 1;
  const house = springIn(frame, from + 30, { damping: 9, stiffness: 190 });
  return (
    <g transform={`translate(${x} ${y}) scale(${squash} ${2 - squash})`}>
      <ellipse cx="0" cy="8" rx={26 * (1 - bounce / 90)} ry="7" fill={INK} opacity="0.18" />
      <path d="M0 0 C-44 -56 -56 -74 -56 -98 A56 56 0 0 1 56 -98 C56 -74 44 -56 0 0 Z" fill={ACCENT} />
      <circle cx="0" cy="-100" r="36" fill={PAPER} />
      <g transform={`translate(0 -100) scale(${house})`} fill={ACCENT}>
        <path d="M-22 -2 L0 -22 L22 -2 L22 20 L-22 20 Z" />
        <rect x="-6" y="4" width="12" height="16" fill={PAPER} />
      </g>
    </g>
  );
}

/** The hanging SHOP sign: drops in on two strings and swings to a stop. */
function ShopSign({ frame, from, x, topY }: { frame: number; from: number; x: number; topY: number }) {
  if (frame < from) return null;
  const drop = springIn(frame, from, { damping: 13, stiffness: 90 });
  const t = frame - from;
  const swing = Math.sin(t / 7.5) * 7 * Math.exp(-t / 46);
  const y = topY - (1 - drop) * 320;
  return (
    <g transform={`translate(${x} ${y}) rotate(${swing})`}>
      <line x1="-70" y1="0" x2="-54" y2="64" stroke={INK} strokeWidth="6" />
      <line x1="70" y1="0" x2="54" y2="64" stroke={INK} strokeWidth="6" />
      <rect x="-104" y="62" width="208" height="104" rx="18" fill={INK} />
      <rect x="-98" y="56" width="196" height="100" rx="16" fill={CREAM} />
      <text x="0" y="126" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="62" letterSpacing="6" fill={INK}>SHOP</text>
    </g>
  );
}

/** A small heart that pops above the tea. Saffron, no outline. */
function Heart({ frame, from, x, y, scale = 1 }: { frame: number; from: number; x: number; y: number; scale?: number }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 8, stiffness: 200 });
  const rise = tween(frame, from, from + 60, 0, 30, EASE.out);
  return (
    <g transform={`translate(${x} ${y - rise}) scale(${s * scale})`}>
      <path d="M0 26 C-34 2 -44 -12 -44 -28 A24 24 0 0 1 0 -38 A24 24 0 0 1 44 -28 C44 -12 34 2 0 26 Z" fill={SAFFRON} />
    </g>
  );
}

// ---------------------------------------------------------------- hook: the shop front
function HookScene({ frame }: { frame: number }) {
  // A slow push in. The set is already composed at frame 0 so the poster frame
  // the player shows before play is never empty.
  const z = tween(frame, 0, 135, 1, 1.07, EASE.inOut);
  const door = tween(frame, 6, 30, 0, 1, EASE.out);
  return (
    <AbsoluteFill style={{ background: SKY_LOW }}>
      <Stage style={{ transform: `scale(${z})`, transformOrigin: "400px 980px" }}>
        <defs>
          <linearGradient id="spk-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SKY_HIGH} />
            <stop offset="1" stopColor={SKY_LOW} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1080" height="470" fill="url(#spk-sky)" />
        <circle cx="920" cy="150" r="76" fill={SAFFRON} opacity="0.42" />
        <Birds frame={frame} y={150} count={3} seed={5} color={CITY_DARK} speed={0.5} />
        <ShopFront frame={frame} doorOpen={door} />
      </Stage>
    </AbsoluteFill>
  );
}

/** The facade: door on the left, a big shop window on the right. */
function ShopFront({ frame, doorOpen, windowOpen = 0 }: { frame: number; doorOpen: number; windowOpen?: number }) {
  const clipW = Math.max(0, WIN.w * Math.min(1, windowOpen * 1.5));
  const clipH = Math.max(0, WIN.h * windowOpen);
  return (
    <g>
      <defs>
        <clipPath id="spk-win-open">
          <rect x={WIN.x + (WIN.w - clipW) / 2} y={WIN.y + (WIN.h - clipH) / 2} width={clipW} height={clipH} />
        </clipPath>
      </defs>
      {/* facade */}
      <rect x="40" y="300" width="1000" height={FLOOR_Y - 300} fill={WALL} />
      <rect x="40" y="300" width="1000" height="44" fill={WALL_DARK} />
      <rect x="40" y="300" width="22" height={FLOOR_Y - 300} fill={WALL_DARK} opacity="0.5" />
      {/* the shop window, with tins and scarves on show */}
      <rect x={WIN.x - 16} y={WIN.y - 16} width={WIN.w + 32} height={WIN.h + 32} rx="12" fill={INK} />
      <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} fill={GLASS} />
      <g opacity={1 - Math.min(1, windowOpen * 1.6)}>
        <Shelf
          x={WIN.x + 24}
          y={WIN.y + 150}
          w={WIN.w - 48}
          items={
            <g>
              <TeaTin x={WIN.x + 110} y={WIN.y + 150} scale={0.78} colour={AWNING} />
              <TeaTin x={WIN.x + 210} y={WIN.y + 150} scale={0.78} colour={SEA} />
              <TeaTin x={WIN.x + 310} y={WIN.y + 150} scale={0.78} colour={SAFFRON} />
            </g>
          }
        />
        <FoldedScarf x={WIN.x + 420} y={WIN.y + 296} scale={0.86} colours={[CORAL, AWNING, SAFFRON]} />
        <Shelf x={WIN.x + 24} y={WIN.y + 296} w={WIN.w - 48} items={null} />
      </g>
      {/* the wall opens onto Dubai */}
      {windowOpen > 0 ? (
        <g clipPath="url(#spk-win-open)">
          <Skyline frame={frame} />
        </g>
      ) : null}
      <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} fill="none" stroke={INK} strokeWidth="8" />
      <rect x={WIN.x + 10} y={WIN.y + 10} width={WIN.w - 20} height="60" fill="#fff" opacity="0.14" />
      <rect x={WIN.x - 26} y={WIN.y + WIN.h} width={WIN.w + 52} height="26" rx="8" fill={WALL_DARK} />
      {/* the door she steps out of */}
      <rect x="140" y="600" width="270" height={FLOOR_Y - 600} rx="10" fill={WOOD_DARK} />
      <rect x="154" y="612" width="242" height={FLOOR_Y - 616} rx="8" fill={WOOD} />
      <g opacity={doorOpen}>
        <rect x="154" y="612" width={110 + doorOpen * 60} height={FLOOR_Y - 616} rx="8" fill={INK} opacity="0.55" />
      </g>
      <rect x={250 + doorOpen * 90} y="620" width="140" height={FLOOR_Y - 630} rx="8" fill={WOOD_LIGHT} />
      <circle cx={268 + doorOpen * 90} cy="880" r="11" fill={SAFFRON} />
      <Awning frame={frame} />
      {/* pavement */}
      <rect x="0" y={FLOOR_Y} width="1080" height="110" fill={PAVE} />
      <rect x="0" y={FLOOR_Y} width="1080" height="12" fill={PAVE_DARK} />
      <Fatima x={330} y={FLOOR_Y + 30} frame={frame} scale={1.12} facing={1} enter={10} slideFrom={-60} arm="wave" armAt={22} talking={frame > 26 && frame < 112} smile={frame > 112} />
      <NameBadge frame={frame} from={74} x={372} y={884} scale={0.58} />
    </g>
  );
}

/** The name badge that pins itself to her top. */
function NameBadge({ frame, from, x, y, scale = 1 }: { frame: number; from: number; x: number; y: number; scale?: number }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 8, stiffness: 210 });
  const ring = tween(frame, from, from + 24, 0, 1, EASE.out);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * scale}) rotate(${(1 - s) * -14})`}>
      <circle r={120 * (1 + ring)} fill="none" stroke={SAFFRON} strokeWidth={8 * (1 - ring)} opacity={1 - ring} />
      <rect x="-110" y="-38" width="226" height="82" rx="16" fill={INK} />
      <rect x="-116" y="-44" width="226" height="82" rx="16" fill={PAPER} />
      <rect x="-116" y="-44" width="14" height="82" rx="7" fill={SEA} />
      <text x="-10" y="16" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="46" fill={INK}>Fatima</text>
      <circle cx="-116" cy="-44" r="10" fill={SAFFRON} />
    </g>
  );
}

// ---------------------------------------------------------------- notices
function NoticeScene({ frame }: { frame: number }) {
  // n1 plays outside, n2 slides the interior in, n3 stays inside.
  const slide = tween(frame, 285, 318, 0, 1, EASE.inOut);
  const outX = -1120 * slide;
  const inX = 1120 * (1 - slide);
  return (
    <AbsoluteFill style={{ background: SKY_LOW }}>
      <Stage>
        <defs>
          <linearGradient id="spk-sky2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SKY_HIGH} />
            <stop offset="1" stopColor={SKY_LOW} />
          </linearGradient>
        </defs>
        {slide < 1 ? (
          <g transform={`translate(${outX} 0)`}>
            <rect x="0" y="0" width="1080" height="470" fill="url(#spk-sky2)" />
            <circle cx="920" cy="150" r="76" fill={SAFFRON} opacity="0.42" />
            <Outside frame={frame} />
          </g>
        ) : null}
        {slide > 0 ? (
          <g transform={`translate(${inX} 0)`}>
            <Inside frame={frame} />
          </g>
        ) : null}
      </Stage>
      {frame < 285 ? (
        <SpeechBubble frame={frame} from={146} text="I live in Dubai." targets={["I", "live", "in"]} x={330} y={200} w={660} tail="left" tailX={110} size={56} />
      ) : null}
      {frame >= 318 && frame < 435 ? (
        <SpeechBubble frame={frame} from={326} text="I work in a shop." targets={["I", "work", "in"]} x={70} y={190} w={660} tail="left" tailX={250} size={56} />
      ) : null}
      {frame >= 435 ? (
        <SpeechBubble frame={frame} from={446} text="I like tea and I don't like coffee." targets={["I", "like", "don't"]} x={60} y={170} w={690} tail="left" tailX={250} size={50} />
      ) : null}
    </AbsoluteFill>
  );
}

/** n1: the wall opens onto Dubai and a map pin drops on the skyline. */
function Outside({ frame }: { frame: number }) {
  const open = tween(frame, 146, 196, 0, 1, EASE.out);
  return (
    <g>
      <ShopFront frame={frame} doorOpen={1} windowOpen={open} />
      {open > 0.6 ? <MapPin frame={frame} from={196} x={WIN.x + 286} yTop={WIN.y + 20} yLand={WIN.y + WIN.h - 26} /> : null}
      <Fatima x={330} y={FLOOR_Y + 30} frame={frame} scale={1.12} facing={1} arm="point" armAt={176} talking={frame > 150 && frame < 240} smile={frame >= 240} />
      <NameBadge frame={frame} from={0} x={372} y={884} scale={0.58} />
    </g>
  );
}

/** n2 and n3: behind the counter, with the shelves, the SHOP sign and the cups. */
function Inside({ frame }: { frame: number }) {
  const hand = handAt(430, FLOOR_Y, 1.12, 1, "hold");
  return (
    <g>
      <rect x="0" y="0" width="1080" height={FLOOR_Y} fill={WALL_IN} />
      <rect x="0" y="0" width="1080" height="60" fill={WALL_DARK} opacity="0.5" />
      {/* shelves of tea tins and scarves */}
      <Shelf
        x={80}
        y={470}
        w={920}
        items={
          <g>
            <TeaTin x={160} y={470} scale={0.9} colour={AWNING} />
            <TeaTin x={270} y={470} scale={0.9} colour={SEA} />
            <TeaTin x={380} y={470} scale={0.9} colour={SAFFRON} />
            <FoldedScarf x={560} y={470} colours={[CORAL, AWNING, SEA]} />
            <FoldedScarf x={800} y={470} colours={[SAFFRON, CORAL, AWNING]} />
          </g>
        }
      />
      <Shelf
        x={80}
        y={700}
        w={920}
        items={
          <g>
            <TeaTin x={170} y={700} scale={0.86} colour={SEA} />
            <TeaTin x={300} y={700} scale={0.86} colour={CORAL} />
            <FoldedScarf x={500} y={700} scale={0.9} colours={[AWNING, SAFFRON, CORAL]} />
            <TeaTin x={700} y={700} scale={0.86} colour={AWNING} />
            <TeaTin x={830} y={700} scale={0.86} colour={SAFFRON} />
          </g>
        }
      />
      <ShopSign frame={frame} from={300} x={920} topY={180} />
      {/* Fatima behind the counter, a tin in her hand */}
      <Fatima
        x={430}
        y={FLOOR_Y}
        frame={frame}
        scale={1.12}
        facing={1}
        arm={frame < 435 ? "hold" : "idle"}
        armAt={306}
        talking={(frame > 292 && frame < 380) || (frame > 448 && frame < 540)}
        smile={frame >= 540 || (frame >= 380 && frame < 435)}
        shakeAt={520}
      />
      {frame < 435 ? <TeaTin x={hand.x} y={hand.y + 54} scale={0.56} colour={SEA} rotate={-6} /> : null}
      {/* counter */}
      <rect x="0" y={COUNTER_Y} width="1080" height="34" rx="10" fill={WOOD_LIGHT} />
      <rect x="0" y={COUNTER_Y + 28} width="1080" height={FLOOR_Y - COUNTER_Y - 28} fill={WOOD} />
      <rect x="0" y={COUNTER_Y + 28} width="1080" height="14" fill={WOOD_DARK} opacity="0.6" />
      {[150, 450, 750].map((px) => <rect key={px} x={px} y={COUNTER_Y + 70} width="180" height="96" rx="8" fill={WOOD_DARK} opacity="0.35" />)}
      <rect x="0" y={FLOOR_Y} width="1080" height="110" fill={PAVE} />
      {/* n2: a customer buys a tin and leaves */}
      {frame < 435 ? (
        <g>
          <Customer frame={frame} x={820} y={FLOOR_Y + 40} enter={326} leaveAt={396} scale={1.04} />
          <TinToss frame={frame} from={352} x0={700} y0={COUNTER_Y - 10} x1={884} y1={COUNTER_Y - 60} />
        </g>
      ) : null}
      {/* n3: tea stays, coffee goes */}
      {frame >= 435 ? (
        <g>
          <Cup kind="tea" x={700} y={COUNTER_Y + 4} frame={frame} appear={452} slideFrom={-260} scale={1.05} steam />
          <Heart frame={frame} from={500} x={700} y={COUNTER_Y - 150} scale={0.95} />
          <Cup kind="mug" x={930} y={COUNTER_Y + 4} frame={frame} appear={470} slideFrom={240} leave={534} scale={1.05} steam={false} />
        </g>
      ) : null}
    </g>
  );
}

/** A tin hopping from the counter into the customer's hand. */
function TinToss({ frame, from, x0, y0, x1, y1 }: { frame: number; from: number; x0: number; y0: number; x1: number; y1: number }) {
  if (frame < from || frame > from + 34) return null;
  const t = tween(frame, from, from + 26, 0, 1, EASE.inOut);
  const x = x0 + (x1 - x0) * t;
  const y = y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * 120;
  return <TeaTin x={x} y={y} scale={0.52} colour={SAFFRON} rotate={t * 24} />;
}

// ---------------------------------------------------------------- explain: the badge
const FRONT_LINES: [string, string][] = [
  ["I'm", "Fatima"],
  ["I live in", "Dubai"],
  ["I work in", "a shop"],
];
const BACK_LINES = ["I'm", "I live in", "I work in"];

function ExplainScene({ frame }: { frame: number }) {
  const card = springIn(frame, 590, { damping: 11, stiffness: 110 });
  // the badge turns over on its vertical axis: front until the edge, then the back
  const turn = tween(frame, 810, 876, 0, Math.PI, EASE.inOut);
  const c = Math.cos(turn);
  const front = c >= 0;
  const flip = `scaleX(${Math.max(0.02, Math.abs(c))})`;
  const guide = tween(frame, 768, 800, 0, 1, EASE.out);
  const cardStyle: CSSProperties = {
    position: "absolute",
    left: 120,
    top: 180,
    width: 840,
    height: 750,
    transform: `scale(${card}) ${flip}`,
    transformOrigin: "50% 50%",
  };
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Stage>
        <defs>
          <pattern id="spk-dots" width="54" height="54" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="4" fill={INK} opacity="0.07" />
          </pattern>
        </defs>
        <rect width="1080" height="1440" fill="url(#spk-dots)" />
      </Stage>
      <div style={cardStyle}>
        <div style={{ position: "absolute", inset: 0, transform: "translate(12px, 16px)", background: INK, borderRadius: 48 }} />
        <div style={{ position: "absolute", inset: 0, background: "#fff", border: `6px solid ${INK}`, borderRadius: 48 }} />
        <div style={{ position: "absolute", left: 300, top: 108, fontSize: 68, fontWeight: 800, color: INK }}>
          {front ? "Fatima" : "You"}
        </div>
        <div style={{ position: "absolute", left: 302, top: 60, fontSize: 30, fontWeight: 800, letterSpacing: 6, color: FAINT }}>
          {front ? "DUBAI" : "YOUR TURN"}
        </div>
        {/* the three I lines, left aligned so the I's stack */}
        {front
          ? FRONT_LINES.map(([head, rest], i) => {
              const s = springIn(frame, 600 + i * 60, { damping: 10, stiffness: 150 });
              return (
                <div
                  key={head}
                  style={{
                    position: "absolute", left: 80, top: 330 + i * 124, fontSize: 62, fontWeight: 800, color: INK,
                    opacity: Math.min(1, s * 2), transform: `translateX(${(1 - s) * -40}px)`, whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ color: ACCENT }}>{head}</span> {rest}
                </div>
              );
            })
          : BACK_LINES.map((head, i) => {
              const s = springIn(frame, 872 + i * 14, { damping: 10, stiffness: 160 });
              return (
                <div
                  key={head}
                  style={{
                    position: "absolute", left: 80, top: 330 + i * 124, fontSize: 62, fontWeight: 800, color: ACCENT,
                    opacity: Math.min(1, s * 2), transform: `translateX(${(1 - s) * -30}px)`, whiteSpace: "nowrap",
                  }}
                >
                  {head}{" "}
                  <span style={{ display: "inline-block", width: 250, borderBottom: `10px dotted ${SAFFRON}`, verticalAlign: "middle" }} />
                </div>
              );
            })}
        {/* the same shape every time: a rule down the three I's */}
        {front ? (
          <div
            style={{
              position: "absolute", left: 66, top: 344, width: 8, height: 310 * guide, borderRadius: 4,
              background: ACCENT, opacity: 0.5,
            }}
          />
        ) : null}
      </div>
      {/* the photo in the badge: Fatima on the front, the learner on the back */}
      <Stage style={{ transform: `scale(${card}) ${flip}`, transformOrigin: "540px 555px" }}>
        <defs><clipPath id="spk-photo"><circle cx="280" cy="350" r="118" /></clipPath></defs>
        <circle cx="280" cy="350" r="130" fill={INK} />
        <circle cx="280" cy="350" r="122" fill={PALE_BLUE} />
        <g clipPath="url(#spk-photo)">
          {front
            ? <Fatima x={280} y={930} frame={frame} scale={1.45} facing={1} smile enter={592} />
            : <Character who="you" x={280} y={930} frame={frame} scale={1.45} facing={1} mood="happy" enter={876} />}
        </g>
        <circle cx="280" cy="350" r="122" fill="none" stroke={SAFFRON} strokeWidth="9" />
      </Stage>
      {/* Fatima presents from the corner */}
      <Stage>
        <defs><clipPath id="spk-corner"><circle cx="170" cy="1060" r="104" /></clipPath></defs>
        <circle cx="178" cy="1068" r="112" fill={INK} />
        <circle cx="170" cy="1060" r="112" fill="#fff" />
        <g clipPath="url(#spk-corner)">
          <Fatima x={170} y={1600} frame={frame} scale={1.35} facing={1} talking={frame > 600 && frame < 800} smile={frame >= 800} nodAt={882} />
        </g>
        <circle cx="170" cy="1060" r="112" fill="none" stroke={ACCENT} strokeWidth="8" />
      </Stage>
      <Eyebrow text="THREE SENTENCES. THAT IS YOU." x={330} y={1040} frame={frame} from={760} size={28} color={INK} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- practise
type Part = { t: string; strong?: boolean };
const LINE_A: Part[] = [{ t: "I" }, { t: "live" }, { t: "in", strong: true }, { t: "Dubai" }];
const LINE_B: Part[] = [{ t: "and" }, { t: "I" }, { t: "work" }, { t: "in", strong: true }, { t: "a" }, { t: "shop." }];

/** One karaoke line. Words pop in turn; the target word carries an accent rule. */
function KaraokeLine({ frame, from, y, size, parts, step = 13, glowFrom }: { frame: number; from: number; y: number; size: number; parts: Part[]; step?: number; glowFrom?: number }) {
  const glow = glowFrom !== undefined ? tween(frame, glowFrom, glowFrom + 16, 0, 1, EASE.out) : 0;
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: y, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: size * 0.22 }}>
      {parts.map((p, i) => {
        const s = springIn(frame, from + i * step, { damping: 9, stiffness: 190 });
        const lit = glow > 0 && p.strong;
        return (
          <span
            key={p.t + i}
            style={{
              position: "relative", display: "inline-block", fontSize: size, fontWeight: 800, lineHeight: 1.05,
              color: p.strong ? ACCENT : lit ? SEA : INK,
              opacity: Math.min(1, s * 2.4),
              transform: `translateY(${(1 - s) * 34}px) scale(${0.72 + 0.28 * s})`,
              transformOrigin: "50% 100%",
            }}
          >
            {p.t}
            {p.strong ? (
              <span
                style={{
                  position: "absolute", left: 0, bottom: -14, height: 10, borderRadius: 5,
                  width: `${Math.min(1, Math.max(0, (frame - (from + i * step + 6)) / 14)) * 100}%`,
                  background: glow > 0 ? SEA : ACCENT,
                }}
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

function PractiseScene({ frame }: { frame: number }) {
  const circle = springIn(frame, 934, { damping: 11, stiffness: 120 });
  const mic = springIn(frame, 1116, { damping: 9, stiffness: 160 });
  const back = springIn(frame, 1180, { damping: 11, stiffness: 130 });
  return (
    <AbsoluteFill style={{ background: PALE_BLUE }}>
      <Stage>
        <defs><clipPath id="spk-prac"><circle cx="540" cy="420" r="264" /></clipPath></defs>
        <g transform={`translate(540 420) scale(${circle}) translate(-540 -420)`}>
          <circle cx="552" cy="434" r="280" fill={INK} />
          <circle cx="540" cy="420" r="280" fill="#fff" />
          <circle cx="540" cy="420" r="280" fill="none" stroke={SAFFRON} strokeWidth="14" />
          <g clipPath="url(#spk-prac)">
            <Fatima
              x={540}
              y={1170}
              frame={frame}
              scale={2}
              facing={1}
              enter={936}
              talking={frame > 960 && frame < 1130}
              smile={frame >= 1130}
              nodAt={1186}
            />
          </g>
        </g>
        {/* the mic marks the learner's turn and clears when the words light up */}
        {frame >= 1116 && frame < 1178 ? (
          <g transform={`translate(150 270) scale(${mic}) translate(-150 -270)`}>
            <Pulse frame={frame} x={150} y={270} size={118}>
              <g transform="translate(-29 -29) scale(2.4)" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" />
              </g>
            </Pulse>
            <text x="150" y="376" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="36" fill={INK}>Your turn</text>
          </g>
        ) : null}
      </Stage>
      <Eyebrow text="SAY IT WITH ME" x={0} y={726} align="center" frame={frame} from={940} />
      <KaraokeLine frame={frame} from={960} y={782} size={86} parts={LINE_A} glowFrom={1186} />
      <KaraokeLine frame={frame} from={1022} y={898} size={86} parts={LINE_B} glowFrom={1186} />
      {/* the badge comes back with a tick */}
      {frame >= 1180 ? (
        <div
          style={{
            position: "absolute", left: 130, top: 1030, width: 820, height: 128,
            transform: `scale(${back})`, transformOrigin: "50% 50%",
          }}
        >
          <div style={{ position: "absolute", inset: 0, transform: "translate(7px, 9px)", background: INK, borderRadius: 34 }} />
          <div style={{ position: "absolute", inset: 0, background: "#fff", border: `5px solid ${INK}`, borderRadius: 34, display: "flex", alignItems: "center", gap: 20, padding: "0 28px" }}>
            {BACK_LINES.map((head) => (
              <span key={head} style={{ fontSize: 34, fontWeight: 800, color: ACCENT, whiteSpace: "nowrap" }}>
                {head}{" "}
                <span style={{ display: "inline-block", width: 54, borderBottom: `6px dotted ${SAFFRON}`, verticalAlign: "middle" }} />
              </span>
            ))}
            <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: 36, background: SEA }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 13l5 5L20 6" /></svg>
            </span>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- recap
function RecapScene({ frame }: { frame: number }) {
  const card = springIn(frame, 1246, { damping: 11, stiffness: 110 });
  return (
    <AbsoluteFill style={{ background: ACCENT }}>
      <Stage>
        <defs>
          <pattern id="spk-stripes" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="30" height="60" fill={PAPER} opacity="0.06" />
          </pattern>
        </defs>
        <rect width="1080" height="1440" fill="url(#spk-stripes)" />
        {/* name badge, map pin, shop sign */}
        <RecapIcon frame={frame} from={1282} cx={270} cy={962}>
          <g transform="translate(-80 -26)">
            <rect x="0" y="0" width="160" height="56" rx="12" fill={INK} />
            <rect x="-4" y="-5" width="160" height="56" rx="12" fill={PAPER} />
            <rect x="-4" y="-5" width="12" height="56" rx="6" fill={SEA} />
            <rect x="24" y="12" width="104" height="12" rx="6" fill={INK} opacity="0.55" />
          </g>
        </RecapIcon>
        <RecapIcon frame={frame} from={1294} cx={540} cy={962}>
          <g transform="translate(0 44) scale(0.62)">
            <path d="M0 0 C-44 -56 -56 -74 -56 -98 A56 56 0 0 1 56 -98 C56 -74 44 -56 0 0 Z" fill={ACCENT} />
            <circle cx="0" cy="-100" r="30" fill={PAPER} />
            <path d="M-18 -98 L0 -116 L18 -98 L18 -80 L-18 -80 Z" fill={ACCENT} />
          </g>
        </RecapIcon>
        <RecapIcon frame={frame} from={1306} cx={810} cy={962}>
          <g transform="translate(0 -30)">
            <line x1="-56" y1="-26" x2="-44" y2="14" stroke={INK} strokeWidth="5" />
            <line x1="56" y1="-26" x2="44" y2="14" stroke={INK} strokeWidth="5" />
            <rect x="-82" y="12" width="164" height="78" rx="14" fill={INK} />
            <rect x="-78" y="8" width="156" height="74" rx="12" fill={CREAM} />
            <text x="0" y="60" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="46" letterSpacing="4" fill={INK}>SHOP</text>
          </g>
        </RecapIcon>
      </Stage>
      <div style={{ position: "absolute", left: 70, right: 70, top: 220, transform: `scale(${card}) rotate(${(1 - card) * -3}deg)`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", inset: 0, transform: "translate(10px, 14px)", background: INK, borderRadius: 54 }} />
        <div style={{ position: "relative", background: "#fff", borderRadius: 54, padding: "42px 54px 50px" }}>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 6, color: FAINT, textAlign: "center" }}>REMEMBER</div>
          {BACK_LINES.map((head, i) => {
            const s = springIn(frame, 1264 + i * 16, { damping: 10, stiffness: 160 });
            return (
              <div key={head} style={{ display: "flex", alignItems: "center", gap: 28, marginTop: i === 0 ? 30 : 22, opacity: Math.min(1, s * 2), transform: `translateX(${(1 - s) * -26}px)` }}>
                <span style={{ fontSize: 72, fontWeight: 800, color: ACCENT, minWidth: 330, whiteSpace: "nowrap" }}>{head}</span>
                <span style={{ flex: 1, height: 0, borderBottom: `12px dotted ${SAFFRON}` }} />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function RecapIcon({ frame, from, cx, cy, children }: { frame: number; from: number; cx: number; cy: number; children: ReactNode }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 9, stiffness: 190 });
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <circle cx="6" cy="8" r="102" fill={INK} opacity="0.35" />
      <circle r="102" fill="#fff" />
      {children}
    </g>
  );
}

// ---------------------------------------------------------------- composition
export function FatimaExplainer({ l1 }: { l1?: Record<string, string> }) {
  const frame = useCurrentFrame();
  const beat = spkBeatAt(frame);
  const progress = (frame - beat.from) / Math.max(1, Math.min(120, beat.to - beat.from));
  const k = karaoke(beat.line, Math.min(1, progress));
  const font: CSSProperties = { fontFamily: FONT };
  return (
    <AbsoluteFill style={{ ...font, background: PAPER, overflow: "hidden" }}>
      {beat.kind === "hook" ? <HookScene frame={frame} /> : null}
      {beat.kind === "notice" ? <NoticeScene frame={frame} /> : null}
      {beat.kind === "explain" ? <ExplainScene frame={frame} /> : null}
      {beat.kind === "practise" ? <PractiseScene frame={frame} /> : null}
      {beat.kind === "recap" ? <RecapScene frame={frame} /> : null}
      {/* the hook bubble sits above the scene so the awning never crosses it */}
      {beat.kind === "hook" ? (
        <SpeechBubble frame={frame} from={26} text="Hello. I'm Fatima." targets={["I'm"]} x={360} y={190} w={640} tail="left" tailX={110} size={58} />
      ) : null}
      <Transition frame={frame} at={135} kind="wipe" color={SAFFRON} color2={INK} />
      <Transition frame={frame} at={585} kind="iris" color={PAPER} color2={ACCENT} cx={540} cy={560} />
      <Transition frame={frame} at={930} kind="slide" color={ACCENT} color2={SAFFRON} />
      <Transition frame={frame} at={1230} kind="wipe" color={SAFFRON} color2={INK} />
      <CaptionBar line={beat.line} k={k} targets={captionTargets(beat)} l1={l1?.[beat.id]} />
      {/* saffron in the recap: accent on an accent background would disappear */}
      <BeatProgress frame={frame} beats={SPK_BEATS} color={beat.kind === "recap" ? SAFFRON : ACCENT} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- L1 captions
// Per beat, in the learner's own language. The English caption stays above it.
export const SPK_L1: Record<string, Record<string, string>> = {
  ar: {
    hook: "مرحبًا. أنا فاطمة.",
    n1: "أعيش في دبي.",
    n2: "أعمل في متجر.",
    n3: "أحب الشاي ولا أحب القهوة.",
    explain: "ثلاث جمل: I'm، I live، I work. هذا أنت.",
    practise: "قلها معي.",
    recap: "أنا ... أعيش في ... أعمل في ...",
  },
  es: {
    hook: "Hola. Soy Fatima.",
    n1: "Vivo en Dubái.",
    n2: "Trabajo en una tienda.",
    n3: "Me gusta el té y no el café.",
    explain: "Tres frases: I'm, I live, I work. Eso eres tú.",
    practise: "Dilo conmigo.",
    recap: "Soy ... Vivo en ... Trabajo en ...",
  },
  hi: {
    hook: "नमस्ते। मैं फ़ातिमा हूँ।",
    n1: "मैं दुबई में रहती हूँ।",
    n2: "मैं एक दुकान में काम करती हूँ।",
    n3: "मुझे चाय पसंद है, कॉफ़ी नहीं।",
    explain: "तीन वाक्य: I'm, I live, I work। यही आप हैं।",
    practise: "मेरे साथ बोलो।",
    recap: "मैं ... हूँ। ... में रहता हूँ। ... में काम करता हूँ।",
  },
  ru: {
    hook: "Здравствуйте. Я Фатима.",
    n1: "Я живу в Дубае.",
    n2: "Я работаю в магазине.",
    n3: "Я люблю чай и не люблю кофе.",
    explain: "Три фразы: I'm, I live, I work. Это ты.",
    practise: "Скажи со мной.",
    recap: "Я ... Живу в ... Работаю в ...",
  },
  tr: {
    hook: "Merhaba. Ben Fatima.",
    n1: "Dubai'de yaşıyorum.",
    n2: "Bir dükkanda çalışıyorum.",
    n3: "Çayı severim, kahveyi sevmem.",
    explain: "Üç cümle: I'm, I live, I work. Bu sensin.",
    practise: "Benimle söyle.",
    recap: "Ben ... ...'de yaşıyorum. ...'de çalışıyorum.",
  },
  zh: {
    hook: "你好。我是 Fatima。",
    n1: "我住在迪拜。",
    n2: "我在一家商店工作。",
    n3: "我喜欢茶，不喜欢咖啡。",
    explain: "三句话：I'm、I live、I work。这就是你。",
    practise: "跟我一起说。",
    recap: "我是…… 我住在…… 我在……工作。",
  },
};

export const EXPLAINER = {
  component: FatimaExplainer,
  beats: SPK_BEATS,
  duration: SPK_DURATION,
  fps: 30,
  width: 1080,
  height: 1440,
  l1: SPK_L1,
};
