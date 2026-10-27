"use client";

// "The gas bill" (ATM-A2-MED-0008): a 2D flat-vector motion-graphics explainer
// built as a Remotion composition (3:4, 1080x1440, 30 fps, 57 s).
//
// Ten beats from docs/explainers/storyboards.md section 3, re-cut to the
// board's attention rule of 26 October the way ATM-A2-INT-0009 was: hook, four
// notices, two explain beats, two say-asks, recap. Every scene note, beat id,
// narration line and target from the storyboard is kept; only the frame ranges
// moved, so nothing passive runs longer than eight seconds and every beat that
// teaches something ends on an ask.
//
// Single target: "Pay by [date]" (on or before), carried into the three-point
// relay: when, how, the number. Cast: sami (has the letter) and you (reads it
// and tells him). Set: a London flat-share kitchen in grey window light.
//
// Built on the shared kit in ./lib. sami is not in the kit's `Character`
// cast, so he is drawn here on the kit's rig (origin at the feet, head at
// -400, shoulders at -300) and stands beside `you` at the same scale. Every
// value is a pure function of the frame, so the same component plays in the
// Player and renders deterministically to MP4.

import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { CSSProperties, ReactNode } from "react";
import {
  ACCENT, BeatProgress, blink, CaptionBar, Character, Confetti, CREAM, Cup, EASE, Eyebrow, FAINT, FOG,
  FONT, hash, Highlight, INK, karaoke, KineticText, PAPER, SAFFRON, SEA, SpeechBubble, springIn,
  Stage, TapCue, Transition, tween, WOOD, WOOD_DARK, WOOD_LIGHT,
} from "./lib";
import type { Beat } from "./Cafe";

export const MED8_FPS = 30;
export const MED8_W = 1080;
export const MED8_H = 1440;

// Re-cut to the board's attention rule of 26 October, as ATM-A2-INT-0009 was.
// The storyboard's own cut (eight beats, an eleven-second explain beat, one
// stop in the whole video) predates that ruling: it is kept here beat for beat
// in ids, lines, targets and scene notes, but the ranges are re-timed so no
// beat runs longer than eight seconds and every teaching beat ends on an ask.
// The explain beat splits in two (the three things, then what "pay by" means)
// and the say-ask grows: the relay line first, then the reference number on
// top of it, which is the third point item ITM-MED-0804 asks for.
//
// The player derives the stops from this table (`asksFor` in ExplainerPlayer),
// so the pauseAt frames are the contract: each one is a settled frame with
// nothing mid-move and the whole caption lit. The first say-ask sits at 78% of
// the duration, inside the 80%-watched window.
export const MED8_BEATS: Beat[] = [
  { id: "hook", kind: "hook", from: 0, to: 132, line: "Sami has a letter. He cannot read it." },
  { id: "n1", kind: "notice", from: 132, to: 282, line: "This is your gas bill.", target: ["gas bill"], pauseAt: 258 },
  { id: "n2", kind: "notice", from: 282, to: 456, line: "Please pay by thirty May.", target: ["pay by"], pauseAt: 432 },
  { id: "n3", kind: "notice", from: 456, to: 630, line: "You can pay online or at the shop.", target: ["online", "at the shop"], pauseAt: 606 },
  { id: "n4", kind: "notice", from: 630, to: 804, line: "Use reference number four four seven one.", target: ["reference number"], pauseAt: 780 },
  { id: "explain", kind: "explain", from: 804, to: 972, line: "Three things: when, how, and the number.", target: ["when", "how", "the number"], pauseAt: 948 },
  { id: "explain2", kind: "explain", from: 972, to: 1140, line: "Pay by means on or before.", target: ["on or before"], pauseAt: 1116 },
  { id: "practise", kind: "practise", from: 1140, to: 1374, line: "Say it with me. Pay by thirty May, online or at the shop.", target: ["Pay by", "online", "at the shop"], pauseAt: 1338 },
  { id: "again", kind: "practise", from: 1374, to: 1572, line: "Use reference number four four seven one.", target: ["reference number"], pauseAt: 1536 },
  { id: "recap", kind: "recap", from: 1572, to: 1716, line: "You can read the letter and tell him. Again tomorrow.", target: ["tell him"] },
];
export const MED8_DURATION = 1716;

function beatAt(frame: number): Beat {
  return MED8_BEATS.find((b) => frame >= b.from && frame < b.to) ?? MED8_BEATS[MED8_BEATS.length - 1];
}

// ---------------------------------------------------------------- palette
// A London flat share on a grey morning: cool walls, warm wood, no purple.
const WALL = "#e7e4dc";
const WALL_DARK = "#d8d4ca";
const TILE = "#dde5e6";
const TILE_LINE = "#c6d1d3";
const FLOOR = "#cbc3b7";
const FLOOR_DARK = "#b7aea1";
const GLASS = "#cdd8dd";
const GLASS_DARK = "#b9c6cc";
const FRIDGE = "#dbe0e3";
const FRIDGE_DARK = "#c3cacf";
const KETTLE = "#aeb6bd";
const ENVELOPE = "#d9b98c";
const ENVELOPE_DARK = "#c4a376";
const PALE_BLUE = "#eaf1fb";
// sami: late twenties, short curly hair, mustard hoodie.
const S_SKIN = "#c98f62";
const S_HAIR = "#241a14";
// The hoodie sits a shade deeper and redder than the learner's saffron top,
// and sami keeps a short beard, so the two men never read as the same person.
const HOODIE = "#cf8526";
const HOODIE_DARK = "#a66715";

// The kitchen set, shared by the hook and the four notice beats.
const FLOOR_Y = 1150;
const FEET_Y = 1400;
const LETTER_X = 310;
const LETTER_Y = 470;
const LETTER_W = 460;
const LETTER_H = 690;
// held at 0.86 in the kitchen, so the bill is the subject without burying both
// faces behind it
const LETTER_S = 0.86;

// The kit's character rig, mirrored here so sami stands at the same scale.
const SHOULDER = { x: 46, y: -300 };
const UPPER = 78;
const FORE = 72;

// ---------------------------------------------------------------- sami

type SamiArm = "idle" | "hold" | "open" | "thumbs" | "point";
type SamiProps = {
  x: number;
  y: number;
  frame: number;
  scale?: number;
  facing?: 1 | -1;
  enter?: number;
  slideFrom?: number;
  talking?: boolean;
  arm?: SamiArm;
  armAt?: number;
  nodAt?: number;
  leanAt?: number;
  smile?: boolean;
  seed?: number;
};

const S_POSE: Record<Exclude<SamiArm, "idle">, { s: number; e: number }> = {
  hold: { s: 52, e: 72 },
  open: { s: 70, e: 46 },
  thumbs: { s: 100, e: 55 },
  point: { s: 78, e: 6 },
};

/**
 * sami: late twenties, London flat share, short curly hair, mustard hoodie.
 * Friendly and a little lost with paperwork. Same proportions as the kit's
 * `Character`, so he and `you` share a floor line and a scale.
 */
function Sami(p: SamiProps) {
  const { x, y, frame } = p;
  const scale = p.scale ?? 1;
  const facing = p.facing ?? 1;
  const enter = p.enter ?? 0;
  const seed = p.seed ?? 23;
  if (frame < enter) return null;
  const s = springIn(frame, enter, { damping: 10, stiffness: 150 });
  const slide = (p.slideFrom ?? 0) * (1 - tween(frame, enter, enter + 22, 0, 1, EASE.out));
  const br = Math.sin((frame + seed * 5) / 16);
  const bl = blink(frame, seed);
  const nod = p.nodAt !== undefined && frame >= p.nodAt && frame < p.nodAt + 30
    ? Math.sin((frame - p.nodAt) / 2.6) * 9 * (1 - (frame - p.nodAt) / 30)
    : 0;
  // leaning in over the letter: the whole figure tips towards what it faces
  const lean = p.leanAt !== undefined ? tween(frame, p.leanAt, p.leanAt + 26, 0, 1, EASE.out) : 0;
  const armA = p.arm && p.arm !== "idle" ? springIn(frame, p.armAt ?? enter, { damping: 11, stiffness: 110 }) : 0;
  const idle = { s: 7 + br * 1.5, e: 10 };
  const target = p.arm && p.arm !== "idle" ? S_POSE[p.arm] : idle;
  const lead = { s: idle.s + (target.s - idle.s) * armA, e: idle.e + (target.e - idle.e) * armA };

  const Arm = ({ pose, mirror }: { pose: { s: number; e: number }; mirror: boolean }) => (
    <g transform={`translate(${mirror ? -SHOULDER.x : SHOULDER.x} ${SHOULDER.y}) scale(${mirror ? -1 : 1} 1) rotate(${-pose.s})`}>
      <line x1="0" y1="0" x2="0" y2={UPPER} stroke={HOODIE} strokeWidth="28" strokeLinecap="round" />
      <g transform={`translate(0 ${UPPER}) rotate(${-pose.e})`}>
        <line x1="0" y1="0" x2="0" y2={FORE} stroke={HOODIE} strokeWidth="26" strokeLinecap="round" />
        <line x1="0" y1={FORE - 26} x2="0" y2={FORE - 4} stroke={HOODIE_DARK} strokeWidth="26" strokeLinecap="round" />
        <circle cx="0" cy={FORE} r="15" fill={S_SKIN} />
        {p.arm === "open" ? [-12, 0, 12].map((a) => <line key={a} x1={a * 0.5} y1={FORE + 2} x2={a * 1.2} y2={FORE + 21} stroke={S_SKIN} strokeWidth="8" strokeLinecap="round" />) : null}
        {p.arm === "thumbs" ? <line x1="2" y1={FORE + 2} x2="24" y2={FORE - 18} stroke={S_SKIN} strokeWidth="11" strokeLinecap="round" /> : null}
        {p.arm === "point" ? <line x1="0" y1={FORE} x2="0" y2={FORE + 21} stroke={S_SKIN} strokeWidth="9" strokeLinecap="round" /> : null}
      </g>
    </g>
  );

  return (
    <g transform={`translate(${x + slide * facing} ${y}) scale(${scale * facing} ${scale * s})`}>
      <ellipse cx="0" cy="2" rx="76" ry="12" fill={INK} opacity="0.13" />
      <g transform={`rotate(${lean * 6} 0 0) translate(0 ${-br * 1.6})`}>
        {/* legs */}
        {[-1, 1].map((k) => (
          <g key={k}>
            <rect x={k * 20 - 16} y="-156" width="32" height="156" rx="14" fill="#44506b" />
            <ellipse cx={k * 20 + 6} cy="0" rx="26" ry="10" fill={INK} />
          </g>
        ))}
        <Arm pose={{ s: idle.s, e: idle.e }} mirror />
        {/* hoodie */}
        <g transform={`translate(0 -150) scale(1 ${1 + br * 0.012}) translate(0 150)`}>
          <rect x="-14" y="-352" width="28" height="46" fill={S_SKIN} />
          <path d="M-64 -294 Q-64 -324 -34 -324 L34 -324 Q64 -324 64 -294 L56 -140 L-56 -140 Z" fill={HOODIE} />
          {/* hood behind the neck */}
          <path d="M-40 -330 Q0 -300 40 -330 Q44 -300 0 -288 Q-44 -300 -40 -330 Z" fill={HOODIE_DARK} />
          {/* kangaroo pocket and drawstrings */}
          <path d="M-40 -210 L40 -210 L36 -162 L-36 -162 Z" fill={HOODIE_DARK} opacity="0.55" />
          <line x1="-12" y1="-300" x2="-16" y2="-250" stroke={PAPER} strokeWidth="6" strokeLinecap="round" />
          <line x1="12" y1="-300" x2="18" y2="-252" stroke={PAPER} strokeWidth="6" strokeLinecap="round" />
        </g>
        {/* head */}
        <g transform={`translate(0 -400) rotate(${nod + lean * 4})`}>
          <circle cx="-50" cy="2" r="11" fill={S_SKIN} />
          <circle cx="50" cy="2" r="11" fill={S_SKIN} />
          <path d="M-50 -10 C-50 -62 -28 -70 0 -70 C28 -70 50 -62 50 -10 C50 30 30 58 0 58 C-30 58 -50 30 -50 -10 Z" fill={S_SKIN} />
          {/* short tight curls, kept close to the skull */}
          <g fill={S_HAIR}>
            <path d="M-50 -22 C-50 -58 -28 -70 0 -70 C28 -70 50 -58 50 -22 Z" />
            {[[-42, -32, 15], [-22, -50, 17], [4, -56, 17], [26, -48, 16], [44, -28, 13]].map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} />
            ))}
          </g>
          {/* a short beard along the jaw, and sideburns */}
          <path d="M-50 -2 C-48 32 -28 58 0 58 C28 58 48 32 50 -2 C44 28 28 40 0 40 C-28 40 -44 28 -50 -2 Z" fill={S_HAIR} />
          {[-1, 1].map((k) => <rect key={k} x={k * 46 - 6} y="-24" width="12" height="34" rx="5" fill={S_HAIR} />)}
          <circle cx="-32" cy="16" r="8" fill="#e08f78" opacity="0.24" />
          <circle cx="32" cy="16" r="8" fill="#e08f78" opacity="0.24" />
          <path d="M-31 -26 Q-21 -33 -10 -27" fill="none" stroke={S_HAIR} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M10 -27 Q21 -33 31 -26" fill="none" stroke={S_HAIR} strokeWidth="4.5" strokeLinecap="round" />
          {[-20, 20].map((ex) => (
            <g key={ex} transform={`translate(${ex} -4)`}>
              <ellipse cx="0" cy="0" rx="10" ry={12 * Math.max(0.08, bl)} fill="#fff" />
              <circle cx="2" cy="1" r={5.4 * Math.max(0.08, bl)} fill={INK} />
              <circle cx="0" cy="-2" r={1.9 * Math.max(0, bl)} fill="#fff" />
            </g>
          ))}
          <path d="M4 6 Q11 15 2 18" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" opacity="0.55" />
          <SamiMouth talking={!!p.talking} smile={!!p.smile} frame={frame} seed={seed} />
        </g>
        <Arm pose={lead} mirror={false} />
      </g>
    </g>
  );
}

function SamiMouth({ talking, smile, frame, seed }: { talking: boolean; smile: boolean; frame: number; seed: number }) {
  if (!talking) {
    if (smile) return <path d="M-17 24 Q0 43 17 24 Q0 31 -17 24 Z" fill={INK} />;
    return <path d="M-13 27 Q0 36 13 27" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />;
  }
  const idx = Math.floor(hash(Math.floor(frame / 3), seed) * 4);
  if (idx === 0) return <ellipse cx="0" cy="31" rx="11" ry="11" fill={INK} />;
  if (idx === 1) return <ellipse cx="0" cy="30" rx="8" ry="5" fill={INK} />;
  if (idx === 2) return <rect x="-14" y="25" width="28" height="9" rx="4" fill={INK} />;
  return <path d="M-12 27 Q0 35 12 27" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />;
}

// ---------------------------------------------------------------- small parts

/** A grey squiggle standing in for words sami cannot read. */
function Squiggle({ x, y, w, h = 12, seed = 0, color = FOG, opacity = 1 }: { x: number; y: number; w: number; h?: number; seed?: number; color?: string; opacity?: number }) {
  const step = 26;
  const n = Math.max(2, Math.round(w / step));
  let d = `M${x} ${y}`;
  for (let i = 0; i < n; i++) {
    const up = i % 2 === 0 ? -1 : 1;
    const wob = 0.7 + hash(i, seed) * 0.6;
    d += ` q ${step / 2} ${up * h * wob} ${step} 0`;
  }
  return <path d={d} fill="none" stroke={color} strokeWidth={h * 0.9} strokeLinecap="round" opacity={opacity} />;
}

/** A leaf-green tick that springs in over whatever it is anchored to. */
function Tick({ frame, from, x, y, size = 1 }: { frame: number; from: number; x: number; y: number; size?: number }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 8, stiffness: 220 });
  return (
    <g transform={`translate(${x} ${y}) scale(${s * size})`}>
      <circle cx="0" cy="0" r="38" fill={SEA} />
      <path d="M-17 2 L-5 15 L18 -13" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** A small flame, the gas company's mark on the letterhead. */
function Flame({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 -26 C14 -10 22 -2 22 10 C22 24 11 32 0 32 C-11 32 -22 24 -22 10 C-22 -2 -14 -10 0 -26 Z" fill={ACCENT} />
      <path d="M0 -6 C7 2 11 7 11 13 C11 20 6 24 0 24 C-6 24 -11 20 -11 13 C-11 7 -7 2 0 -6 Z" fill={SAFFRON} />
    </g>
  );
}

/**
 * sami's thought mark: the "?" that grows in the hook, shrinks as each line is
 * read, turns into a "!" when the number lands and into a tick in the explain
 * beat. One glyph, so the learner tracks one thing.
 */
function ThoughtMark({ frame, from, x, y, size, glyph }: { frame: number; from: number; x: number; y: number; size: number; glyph: "?" | "!" }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 9, stiffness: 150 });
  const wob = Math.sin(frame / 9) * 4;
  return (
    <g transform={`translate(${x} ${y}) rotate(${wob}) scale(${s * size})`}>
      <circle cx="6" cy="8" r="60" fill={INK} />
      <circle cx="0" cy="0" r="60" fill="#fff" stroke={INK} strokeWidth="6" />
      <circle cx="-46" cy="58" r="17" fill="#fff" stroke={INK} strokeWidth="6" />
      <circle cx="-66" cy="88" r="9" fill="#fff" stroke={INK} strokeWidth="5" />
      <text x="0" y="30" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="86" fill={glyph === "?" ? ACCENT : SEA}>{glyph}</text>
    </g>
  );
}

/** A coin that hops along an arc from one point to another. */
function Coin({ frame, from, x0, y0, x1, y1, lift = 150 }: { frame: number; from: number; x0: number; y0: number; x1: number; y1: number; lift?: number }) {
  const p = tween(frame, from, from + 34, 0, 1, EASE.inOut);
  if (p <= 0 || p >= 1) return null;
  const x = x0 + (x1 - x0) * p;
  const y = y0 + (y1 - y0) * p - Math.sin(p * Math.PI) * lift;
  return (
    <g transform={`translate(${x} ${y}) scale(${1 - p * 0.25})`}>
      <circle cx="3" cy="4" r="25" fill={INK} opacity="0.2" />
      <circle cx="0" cy="0" r="25" fill={SAFFRON} stroke={INK} strokeWidth="5" />
      <text x="0" y="12" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="32" fill={INK}>£</text>
    </g>
  );
}

/** A phone with a tick on the screen: paying online. */
function PhoneIcon({ frame, from, x, y, w = 104 }: { frame: number; from: number; x: number; y: number; w?: number }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 9, stiffness: 180 });
  const h = w * 1.78;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2 + 5} y={5} width={w} height={h} rx="18" fill={INK} opacity="0.22" />
      <rect x={-w / 2} y="0" width={w} height={h} rx="18" fill={INK} />
      <rect x={-w / 2 + 8} y="12" width={w - 16} height={h - 30} rx="11" fill="#fff" />
      <rect x={-w / 2 + 28} y={h - 14} width={w - 56} height="6" rx="3" fill="#fff" opacity="0.7" />
      <g transform={`translate(0 ${h * 0.42})`}>
        <circle cx="0" cy="0" r={w * 0.26} fill={SEA} />
        <path d={`M${-w * 0.12} 0 L${-w * 0.035} ${w * 0.09} L${w * 0.13} ${-w * 0.09}`} fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** The corner shop: the other way to pay. */
function ShopIcon({ frame, from, x, y, w = 150 }: { frame: number; from: number; x: number; y: number; w?: number }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 9, stiffness: 180 });
  const h = w * 1.14;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2 + 5} y={5} width={w} height={h} rx="10" fill={INK} opacity="0.2" />
      <rect x={-w / 2} y="0" width={w} height={h} rx="10" fill={WALL} stroke={INK} strokeWidth="5" />
      <rect x={-w / 2 + 6} y="6" width={w - 12} height={h * 0.2} rx="6" fill={ACCENT} />
      <text x="0" y={h * 0.18} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize={w * 0.14} letterSpacing="3" fill="#fff">SHOP</text>
      {/* striped awning */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={-w / 2 + 6 + i * ((w - 12) / 5)} y={h * 0.22} width={(w - 12) / 5} height={h * 0.13} fill={i % 2 ? SAFFRON : PAPER} />
      ))}
      <rect x={-w / 2 + 10} y={h * 0.44} width={w * 0.34} height={h * 0.38} rx="4" fill={GLASS} stroke={INK} strokeWidth="4" />
      <rect x={w * 0.06} y={h * 0.42} width={w * 0.28} height={h * 0.58} rx="4" fill={WOOD_LIGHT} stroke={INK} strokeWidth="4" />
      <circle cx={w * 0.12} cy={h * 0.7} r="5" fill={INK} />
    </g>
  );
}

/**
 * The reference number, drawn as a luggage label with four digit boxes. The
 * digits stamp in one at a time, each with a soft thump.
 */
function RefTag({ frame, from, x, y, w = 400, digits = "4471", stampFrom = 0, stampEvery = 18, label = "REF" }: { frame: number; from: number; x: number; y: number; w?: number; digits?: string; stampFrom?: number; stampEvery?: number; label?: string }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 10, stiffness: 170 });
  const h = w * 0.3;
  const notch = h * 0.42;
  const boxW = w * 0.155;
  const boxGap = w * 0.035;
  const boxesW = boxW * 4 + boxGap * 3;
  const boxX = w - boxesW - h * 0.3;
  const body = `M${notch} 0 L${w} 0 L${w} ${h} L${notch} ${h} L0 ${h / 2} Z`;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} style={{ transformOrigin: "0 0" }}>
      <path d={body} transform="translate(5 6)" fill={INK} opacity="0.2" />
      <path d={body} fill={PAPER} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <circle cx={notch * 0.95} cy={h / 2} r={h * 0.1} fill="none" stroke={INK} strokeWidth="4" />
      <text x={notch + h * 0.34} y={h * 0.63} fontFamily={FONT} fontWeight="800" fontSize={h * 0.3} letterSpacing="2" fill={FAINT}>{label}</text>
      {digits.split("").map((d, i) => {
        const at = stampFrom + i * stampEvery;
        const pop = springIn(frame, at, { damping: 7, stiffness: 260 });
        const bx = boxX + i * (boxW + boxGap);
        return (
          <g key={i}>
            <rect x={bx} y={h * 0.16} width={boxW} height={h * 0.68} rx="7" fill="#fff" stroke={frame >= at ? ACCENT : FOG} strokeWidth="4" />
            {frame >= at ? (
              <g transform={`translate(${bx + boxW / 2} ${h / 2}) scale(${0.6 + pop * 0.4})`}>
                <text x="0" y={h * 0.21} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize={h * 0.52} fill={ACCENT}>{d}</text>
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

/**
 * The gas bill. Drawn in its own 460 x 690 space from (0, 0), so the same
 * letter can be held in the kitchen and shrunk into the corner of the explain
 * beat. Each line resolves out of its squiggle at the frame it is read.
 */
function Letter({ frame, resolve, tagStamp }: { frame: number; resolve: { header: number; when: number; how: number; ref: number }; tagStamp: number }) {
  const W = LETTER_W;
  const H = LETTER_H;
  const row = (at: number) => tween(frame, at, at + 16, 0, 1, EASE.out);
  const rHeader = row(resolve.header);
  const rWhen = row(resolve.when);
  const rHow = row(resolve.how);
  const rRef = frame >= resolve.ref ? 1 : 0;
  return (
    <g>
      {/* the brown envelope it came in */}
      <g transform={`rotate(-3 ${W / 2} ${H / 2})`}>
        <rect x="-18" y="30" width={W + 30} height={H - 20} rx="10" fill={ENVELOPE} stroke={ENVELOPE_DARK} strokeWidth="5" />
        <path d={`M-18 30 L${W / 2 - 3} ${H * 0.34} L${W + 12} 30`} fill="none" stroke={ENVELOPE_DARK} strokeWidth="5" />
      </g>
      <rect x="6" y="8" width={W} height={H} rx="10" fill={INK} opacity="0.16" />
      <rect x="0" y="0" width={W} height={H} rx="10" fill="#fff" stroke={INK} strokeWidth="5" />

      {/* line 1: the letterhead */}
      {rHeader < 1 ? <Squiggle x={34} y={74} w={300} seed={1} opacity={1 - rHeader} /> : null}
      <g opacity={rHeader}>
        <Flame x={58} y={66} scale={0.9} />
        <text x={96} y={88} fontFamily={FONT} fontWeight="800" fontSize="46" letterSpacing="2" fill={INK}>GAS BILL</text>
      </g>
      <line x1="30" y1="124" x2={W - 30} y2="124" stroke={FOG} strokeWidth="4" />

      {/* line 2: pay by 30 May */}
      {rWhen < 1 ? <Squiggle x={34} y={186} w={340} seed={2} opacity={1 - rWhen} /> : null}
      <g opacity={rWhen}>
        <rect x="28" y="162" width={158 * rWhen} height="46" rx="8" fill={SAFFRON} opacity="0.45" />
        <text x={34} y={198} fontFamily={FONT} fontWeight="800" fontSize="42">
          <tspan fill={ACCENT}>Pay by</tspan>
          <tspan fill={INK}> 30 May</tspan>
        </text>
      </g>

      {/* line 3: how to pay */}
      {rHow < 1 ? (
        <g opacity={1 - rHow}>
          <Squiggle x={34} y={282} w={370} seed={3} />
          <Squiggle x={34} y={330} w={250} seed={4} />
        </g>
      ) : null}
      <g opacity={rHow}>
        <text x={34} y={292} fontFamily={FONT} fontWeight="700" fontSize="38">
          <tspan fill={INK}>Pay </tspan>
          <tspan fill={ACCENT} fontWeight="800">online</tspan>
          <tspan fill={INK}> or</tspan>
        </text>
        <text x={34} y={340} fontFamily={FONT} fontWeight="800" fontSize="38" fill={ACCENT}>at the shop</text>
      </g>

      {/* line 4: the reference number, on its luggage label */}
      {rRef < 1 ? <Squiggle x={34} y={424} w={390} seed={5} /> : null}
      {rRef > 0 ? <RefTag frame={frame} from={resolve.ref} x={30} y={382} w={400} stampFrom={tagStamp} /> : null}

      {/* the rest stays squiggly: this is a real letter, not a poster */}
      <Squiggle x={34} y={560} w={380} seed={6} opacity={0.85} />
      <Squiggle x={34} y={606} w={330} seed={7} opacity={0.85} />
      <Squiggle x={34} y={652} w={220} seed={8} opacity={0.85} />
    </g>
  );
}

/**
 * The May calendar on the kitchen wall. The 30 is ringed first, then every day
 * up to it fills leaf green from left to right: that is the whole meaning of
 * "pay by", shown rather than explained. The 31 stays grey.
 */
function Calendar({ frame, x, y, w = 240, flipAt, ringAt, fillFrom, fillTo }: { frame: number; x: number; y: number; w?: number; flipAt: number; ringAt: number; fillFrom: number; fillTo: number }) {
  const cell = (w - 16) / 7;
  const head = 62;
  const rows = 5;
  const h = head + rows * (cell + 4) + 14;
  const flip = tween(frame, flipAt, flipAt + 18, 0, 1, EASE.out);
  const ring = springIn(frame, ringAt, { damping: 8, stiffness: 200 });
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="6" y="8" width={w} height={h} rx="12" fill={INK} opacity="0.18" />
      <rect x="0" y="0" width={w} height={h} rx="12" fill="#fff" stroke={INK} strokeWidth="5" />
      {/* the nail it hangs on */}
      <circle cx={w / 2} cy="-14" r="7" fill={FAINT} />
      <rect x="0" y="0" width={w} height={head} rx="12" fill={ACCENT} />
      <g clipPath="none">
        <text x={w / 2} y={44 - flip * 70} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="34" letterSpacing="5" fill="#fff" opacity={1 - flip}>APRIL</text>
        <text x={w / 2} y={114 - flip * 70} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="34" letterSpacing="5" fill="#fff" opacity={flip}>MAY</text>
      </g>
      <rect x="0" y={head} width={w} height={h - head} fill="#fff" />
      {Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        const col = i % 7;
        const rowI = Math.floor(i / 7);
        const cx = 8 + col * cell + cell / 2;
        const cy = head + 8 + rowI * (cell + 4) + cell / 2;
        const at = fillFrom + (i / 30) * (fillTo - fillFrom);
        const filled = day <= 30 && frame >= at;
        const pop = filled ? springIn(frame, at, { damping: 9, stiffness: 240 }) : 0;
        return (
          <g key={day}>
            <rect
              x={cx - cell / 2 + 2} y={cy - cell / 2 + 2} width={cell - 4} height={cell - 4} rx="6"
              fill={filled ? SEA : "#eef0f4"} opacity={filled ? 0.35 + pop * 0.65 : 1}
            />
            <text x={cx} y={cy + cell * 0.17} textAnchor="middle" fontFamily={FONT} fontWeight={day === 30 ? 800 : 600} fontSize={cell * 0.46} fill={filled ? INK : day === 31 ? FOG : FAINT}>{day}</text>
          </g>
        );
      })}
      {/* the saffron ring on the 30 */}
      {ring > 0 ? (
        <circle
          cx={8 + ((29 % 7) * cell) + cell / 2}
          cy={head + 8 + Math.floor(29 / 7) * (cell + 4) + cell / 2}
          r={cell * 0.56 * ring} fill="none" stroke={SAFFRON} strokeWidth="6"
        />
      ) : null}
    </g>
  );
}

/** One of the three stickers the letter is boiled down to. */
function Sticker({
  frame, from, icon, label, value, x, y, w = 600, fromX, fromY, scaleFrom = 0.42,
}: {
  frame: number; from: number; icon: "calendar" | "payways" | "tag"; label: string; value: string;
  x: number; y: number; w?: number; fromX?: number; fromY?: number; scaleFrom?: number;
}) {
  if (frame < from) return null;
  // the value sets the type size: "online or at the shop" is the longest line
  // the three facts ever carry, and it has to sit inside the card
  const p = springIn(frame, from, { damping: 12, stiffness: 120 });
  const h = 150;
  const sx = fromX ?? x;
  const sy = fromY ?? y;
  const cx = sx + (x - sx) * p;
  const cy = sy + (y - sy) * p;
  const sc = scaleFrom + (1 - scaleFrom) * p;
  const rot = (1 - p) * -14;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${sc})`}>
      <rect x="6" y="8" width={w} height={h} rx="26" fill={INK} opacity="0.18" />
      <rect x="0" y="0" width={w} height={h} rx="26" fill="#fff" stroke={INK} strokeWidth="5" />
      <g transform="translate(70 75)">
        {icon === "calendar" ? (
          <g>
            <rect x="-42" y="-44" width="84" height="88" rx="10" fill="#fff" stroke={INK} strokeWidth="5" />
            <rect x="-42" y="-44" width="84" height="24" rx="10" fill={ACCENT} />
            <rect x="-30" y="-8" width="60" height="38" rx="6" fill={SEA} opacity="0.5" />
            <text x="0" y="24" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="30" fill={INK}>30</text>
          </g>
        ) : icon === "payways" ? (
          <g transform="scale(0.88)">
            <rect x="-46" y="-42" width="46" height="84" rx="10" fill={INK} />
            <rect x="-40" y="-34" width="34" height="62" rx="6" fill="#fff" />
            <circle cx="-23" cy="-2" r="12" fill={SEA} />
            <rect x="6" y="-20" width="46" height="62" rx="7" fill={WALL} stroke={INK} strokeWidth="5" />
            <rect x="10" y="-16" width="38" height="14" rx="4" fill={SAFFRON} />
            <rect x="24" y="8" width="16" height="34" rx="3" fill={WOOD_LIGHT} stroke={INK} strokeWidth="4" />
          </g>
        ) : (
          <g>
            <path d="M-16 -34 L44 -34 L44 34 L-16 34 L-42 0 Z" fill={PAPER} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <circle cx="-14" cy="0" r="7" fill="none" stroke={INK} strokeWidth="4" />
            {[-12, 2, 16].map((y) => <rect key={y} x="2" y={y - 4} width="32" height="8" rx="4" fill={ACCENT} opacity="0.7" />)}
          </g>
        )}
      </g>
      <text x="152" y="58" fontFamily={FONT} fontWeight="800" fontSize="28" letterSpacing="2" fill={FAINT}>{label}</text>
      <text x="152" y="110" fontFamily={FONT} fontWeight="800" fontSize="36" fill={INK}>{value}</text>
    </g>
  );
}

/** The presenter's corner circle: `you` keeps a face on screen over a diagram. */
function CornerYou({ frame, from, x = 140, y = 1020, r = 88, talking }: { frame: number; from: number; x?: number; y?: number; r?: number; talking?: boolean }) {
  const s = springIn(frame, from, { damping: 11, stiffness: 130 });
  if (s <= 0) return null;
  const id = `med8-corner-${x}-${y}`;
  // the head sits at -400 in character units, so this scale and offset put it
  // in the middle of the circle rather than sliding off the bottom of it
  const sc = r / 100;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
      <defs><clipPath id={id}><circle cx={x} cy={y} r={r} /></clipPath></defs>
      <circle cx={x + 7} cy={y + 9} r={r} fill={INK} />
      <circle cx={x} cy={y} r={r} fill="#fff" />
      <circle cx={x} cy={y} r={r} fill="none" stroke={SAFFRON} strokeWidth="9" />
      <g clipPath={`url(#${id})`}>
        <Character who="you" x={x} y={y + 400 * sc} scale={sc} facing={1} frame={frame} enter={from} talking={talking} mood="happy" gesture="idle" />
      </g>
    </g>
  );
}

// ---------------------------------------------------------------- the kitchen

function KitchenWall({ frame }: { frame: number }) {
  return (
    <Stage>
      <rect x="-240" y="-60" width="1560" height={FLOOR_Y + 60} fill={WALL} />
      <rect x="-240" y={FLOOR_Y} width="1560" height={1440 - FLOOR_Y} fill={FLOOR} />
      <rect x="-240" y={FLOOR_Y} width="1560" height="14" fill={FLOOR_DARK} />
      {/* tiled splashback over the worktop */}
      <rect x="-240" y="860" width="1560" height="140" fill={TILE} />
      {[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <rect key={i} x={-200 + i * 140} y="870" width="120" height="56" rx="4" fill="none" stroke={TILE_LINE} strokeWidth="4" />
      ))}
      {/* the worktop and the units under it */}
      <rect x="-240" y="996" width="1560" height="26" rx="6" fill={WOOD_LIGHT} />
      <rect x="-240" y="1022" width="1560" height={FLOOR_Y - 1022} fill={WALL_DARK} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={-120 + i * 250} y="1040" width="220" height="96" rx="8" fill="none" stroke="#c8c3b8" strokeWidth="5" />
      ))}
      {/* grey window light on the right, falling across the table */}
      <g>
        <rect x="774" y="296" width="250" height="330" rx="8" fill={WOOD_LIGHT} />
        <rect x="788" y="310" width="222" height="302" fill={GLASS} />
        <rect x="788" y="310" width="222" height="120" fill={GLASS_DARK} opacity="0.5" />
        <rect x="890" y="310" width="14" height="302" fill={WOOD_LIGHT} />
        <rect x="788" y="454" width="222" height="12" fill={WOOD_LIGHT} />
        <rect x="760" y="616" width="278" height="22" rx="6" fill={WOOD} />
        <path d="M774 336 L774 600 L380 1150 L380 760 Z" fill="#fff" opacity="0.16" />
      </g>
      {/* the kettle on the worktop */}
      <g transform="translate(600 996)">
        <ellipse cx="0" cy="-2" rx="52" ry="9" fill={INK} opacity="0.12" />
        <path d="M-44 0 L-38 -86 Q0 -104 38 -86 L44 0 Z" fill={KETTLE} />
        <path d="M-30 -74 Q0 -86 30 -74 L28 -56 Q0 -66 -28 -56 Z" fill="#fff" opacity="0.35" />
        <path d="M-38 -84 Q-72 -60 -58 -14" fill="none" stroke={KETTLE} strokeWidth="11" strokeLinecap="round" />
        <rect x="-16" y="-116" width="32" height="16" rx="6" fill={INK} />
        <circle cx="26" cy="-28" r="7" fill={SEA} />
      </g>
      {/* the fridge, with magnets and a note */}
      <g transform="translate(16 686)">
        <rect x="0" y="0" width="200" height={FLOOR_Y - 686} rx="14" fill={FRIDGE} stroke={FRIDGE_DARK} strokeWidth="5" />
        <rect x="0" y="176" width="200" height="8" fill={FRIDGE_DARK} />
        <rect x="166" y="60" width="14" height="92" rx="7" fill={FRIDGE_DARK} />
        <rect x="166" y="212" width="14" height="92" rx="7" fill={FRIDGE_DARK} />
        <rect x="26" y="232" width="92" height="110" rx="6" fill={PAPER} transform="rotate(-4 72 287)" />
        {[0, 1, 2].map((i) => <Squiggle key={i} x={36} y={266 + i * 28} w={70} h={7} seed={20 + i} color={FOG} />)}
        <circle cx="46" cy="60" r="16" fill={SAFFRON} />
        <rect x="90" y="46" width="30" height="30" rx="6" fill={SEA} transform="rotate(12 105 61)" />
        <circle cx="146" cy="372" r="14" fill={ACCENT} opacity="0.8" />
        <ellipse cx={100 + Math.sin(frame / 40) * 2} cy="418" rx="26" ry="18" fill={SAFFRON} opacity="0.35" />
      </g>
    </Stage>
  );
}

/** The table in the foreground, with the two mugs `you` brings in. */
function KitchenTable({ frame, mugsAt }: { frame: number; mugsAt: number }) {
  return (
    <Stage>
      <rect x="150" y="1246" width="46" height="194" fill={WOOD_DARK} />
      <rect x="884" y="1246" width="46" height="194" fill={WOOD_DARK} />
      <rect x="60" y="1176" width="960" height="70" rx="14" fill={WOOD_LIGHT} />
      <rect x="60" y="1232" width="960" height="18" rx="8" fill={WOOD_DARK} opacity="0.5" />
      <Cup kind="mug" x={320} y={1182} frame={frame} appear={mugsAt} scale={0.46} slideFrom={-60} steam seed={2} />
      <Cup kind="mug" x={742} y={1182} frame={frame} appear={mugsAt + 8} scale={0.46} slideFrom={60} steam seed={5} />
    </Stage>
  );
}

/** One camera layer. depth 0 is the far wall, 1 the foreground. */
function Layer({ zoom, depth, children }: { zoom: number; depth: number; children: ReactNode }) {
  const z = 1 + (zoom - 1) * (0.55 + depth * 0.9);
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "540px 780px" }}>{children}</AbsoluteFill>
  );
}

/**
 * One continuous kitchen take for the hook and the four notice beats: sami at
 * the table with a letter he cannot read, `you` walking in with two mugs and
 * reading it to him line by line. The camera pushes in on the letter for the
 * cut into n1 and then creeps slowly, so the four notices read as one scene.
 */
function KitchenScene({ frame }: { frame: number }) {
  // the push-in belongs to the hook; the notices sit at a steady, gentle crawl
  // so nothing on the right of the frame (the calendar, the shop) is cropped
  const zoom = 1 + tween(frame, 0, 130, 0, 0.1, EASE.inOut) - tween(frame, 130, 132, 0, 0.055) + tween(frame, 140, 804, 0, 0.03, EASE.inOut);

  const hook = frame < 132;
  const n1 = frame >= 132 && frame < 282;
  const n2 = frame >= 282 && frame < 456;
  const n3 = frame >= 456 && frame < 630;
  const n4 = frame >= 630;

  // `you` walks in from the right with the mugs, puts them down, and takes the
  // letter. sami is at the far side of the table, so the path never crosses
  // him. All of it lands before the cut at 132.
  const youX = tween(frame, 14, 86, 1240, 884, EASE.inOut);
  const youFacing: 1 | -1 = -1;
  const youWalking = frame >= 14 && frame < 84;
  const youArm = hook
    ? { g: "cup" as const, at: 10 }
    : n1
      ? { g: "raise" as const, at: 142 }
      : { g: "point" as const, at: n2 ? 292 : n3 ? 466 : 640 };
  const youTalks =
    (frame > 142 && frame < 230) || (frame > 292 && frame < 400) ||
    (frame > 466 && frame < 578) || (frame > 640 && frame < 752);

  // the letter is in sami's hands in the hook, tilted; `you` straightens it on
  // the cut into n1
  const tilt = hook ? -5 : 0;
  const lift = hook ? 36 : 0;

  // sami's thought mark: big "?" in the hook, smaller as each line is read,
  // then a "!" once the number lands
  const markSize = frame >= 724 ? 0.9 : frame >= 466 ? 0.62 : frame >= 196 ? 0.74 : 0.9;
  const markGlyph: "?" | "!" = frame >= 724 ? "!" : "?";

  return (
    <AbsoluteFill style={{ background: WALL }}>
      <Layer zoom={zoom} depth={0}>
        <KitchenWall frame={frame} />
      </Layer>

      {/* the wall calendar beside the fridge: n2 only, one new thing at a time */}
      {n2 ? (
        <Layer zoom={zoom} depth={0.15}>
          <Stage>
            <g transform={`translate(26 342) scale(${springIn(frame, 292, { damping: 11, stiffness: 150 })}) translate(-26 -342)`}>
              <Calendar frame={frame} x={26} y={342} w={228} flipAt={316} ringAt={346} fillFrom={360} fillTo={414} />
            </g>
          </Stage>
        </Layer>
      ) : null}

      {/* n3: the two ways to pay pop above the table and take a coin each */}
      {n3 ? (
        <Layer zoom={zoom} depth={0.15}>
          <Stage>
            {/* stacked, because the only clear band left of the letter is
                narrower than the two icons side by side */}
            <PhoneIcon frame={frame} from={486} x={152} y={316} />
            <ShopIcon frame={frame} from={504} x={152} y={512} />
            <Coin frame={frame} from={510} x0={330} y0={800} x1={152} y1={408} />
            <Coin frame={frame} from={544} x0={330} y0={820} x1={152} y1={598} />
          </Stage>
        </Layer>
      ) : null}

      <Layer zoom={zoom} depth={0.45}>
        <Stage>
          <Sami
            x={172} y={FEET_Y} scale={1.2} facing={1} frame={frame} enter={0} seed={23}
            arm={hook ? "hold" : n4 ? "point" : "idle"} armAt={hook ? 0 : 646}
            leanAt={n4 ? 700 : undefined} smile={frame >= 724}
            nodAt={n1 ? 212 : n2 ? 400 : undefined}
          />
          <Character
            who="you" x={youX} y={FEET_Y} scale={1.2} facing={youFacing} frame={frame} enter={6}
            walking={youWalking} talking={youTalks} mood={hook ? "neutral" : "happy"}
            gesture={youArm.g} gestureAt={youArm.at} holding={frame < 90 ? "mug" : undefined}
          />
        </Stage>
      </Layer>

      <Layer zoom={zoom} depth={0.7}>
        <KitchenTable frame={frame} mugsAt={92} />
      </Layer>

      {/* the letter, held between them */}
      <Layer zoom={zoom} depth={0.8}>
        <Stage>
          <g transform={`translate(${LETTER_X} ${LETTER_Y + lift}) rotate(${tilt} ${LETTER_W / 2} ${LETTER_H / 2}) scale(${LETTER_S})`}>
            <Letter frame={frame} resolve={{ header: 160, when: 320, how: 480, ref: 650 }} tagStamp={666} />
          </g>
          {/* the mark drops a little once the props take the top-left corner */}
          <ThoughtMark frame={frame} from={24} x={214} y={hook ? 686 : 722} size={markSize} glyph={markGlyph} />
        </Stage>
      </Layer>

      {/* the hook carries no bubble: sami's "?" says it, and the beat has one
          thing to read in five seconds */}
      {n1 ? <SpeechBubble text="This is your gas bill." targets={["gas bill"]} x={354} y={182} w={640} from={142} frame={frame} tail="right" tailX={486} size={50} /> : null}
      {n2 ? <SpeechBubble text="Please pay by 30 May." targets={["pay by"]} x={354} y={182} w={640} from={292} frame={frame} tail="right" tailX={486} size={50} /> : null}
      {n3 ? <SpeechBubble text="You can pay online or at the shop." targets={["online", "at the shop"]} x={344} y={158} w={660} from={466} frame={frame} tail="right" tailX={496} size={46} /> : null}
      {n4 ? <SpeechBubble text="Use reference number 4471." targets={["reference number"]} x={348} y={170} w={650} from={640} frame={frame} tail="right" tailX={492} size={48} /> : null}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- explain

/**
 * The three things. The letter shrinks into the corner and three stickers peel
 * off it, one at a time, into sami's open hand: when, how, the number. The
 * relay item that follows asks for exactly these three, so they are the whole
 * beat and nothing else is on the page.
 */
function ExplainScene({ frame }: { frame: number }) {
  const letterS = springIn(frame, 810, { damping: 12, stiffness: 130 });
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Stage>
        {/* the letter, small, on the left */}
        <g transform={`translate(56 286) scale(${0.44 * letterS})`}>
          <Letter frame={frame} resolve={{ header: 160, when: 320, how: 480, ref: 650 }} tagStamp={666} />
        </g>

        {/* sami, receiving the three facts, clear of the caption bar */}
        <Sami x={960} y={1170} scale={0.62} facing={-1} frame={frame} enter={812} arm="open" armAt={830} smile={frame >= 930} nodAt={936} seed={23} />
        <Tick frame={frame} from={930} x={1034} y={876} size={0.5} />

        <Sticker frame={frame} from={840} icon="calendar" label="WHEN" value="by 30 May" x={300} y={330} fromX={110} fromY={400} />
        <Sticker frame={frame} from={876} icon="payways" label="HOW" value="online or at the shop" x={300} y={512} fromX={110} fromY={470} />
        <Sticker frame={frame} from={912} icon="tag" label="THE NUMBER" value="4471" x={300} y={694} fromX={110} fromY={540} />

        <CornerYou frame={frame} from={818} talking={frame > 824 && frame < 924} />
      </Stage>
      <Eyebrow text="THREE THINGS" x={0} y={214} align="center" frame={frame} from={818} />
    </AbsoluteFill>
  );
}

const STRIP_DAYS = [24, 25, 26, 27, 28, 29, 30, 31];

/**
 * What "pay by" means, as one picture: a strip of days filling leaf green up to
 * the 30, with the 31 left grey. On or before, never after.
 */
function Explain2Scene({ frame }: { frame: number }) {
  const cellW = 96;
  const gap = 12;
  const total = STRIP_DAYS.length * cellW + (STRIP_DAYS.length - 1) * gap;
  const x0 = (1080 - total) / 2;
  const stripY = 620;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Stage>
        <g transform={`translate(540 ${stripY + 60}) scale(${springIn(frame, 982, { damping: 12, stiffness: 130 })}) translate(-540 ${-stripY - 60})`}>
          {STRIP_DAYS.map((d, i) => {
            const at = 1004 + i * 7;
            const on = d <= 30 && frame >= at;
            const pop = on ? springIn(frame, at, { damping: 9, stiffness: 240 }) : 0;
            const x = x0 + i * (cellW + gap);
            return (
              <g key={d}>
                <rect x={x} y={stripY} width={cellW} height="120" rx="14" fill={on ? SEA : "#eceef2"} opacity={on ? 0.35 + pop * 0.65 : 1} stroke={INK} strokeWidth="4" />
                <text x={x + cellW / 2} y={stripY + 78} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="46" fill={d === 31 ? FOG : INK}>{d}</text>
              </g>
            );
          })}
          {/* the ring on the last day you can pay */}
          {frame >= 1068 ? (
            <circle
              cx={x0 + 6 * (cellW + gap) + cellW / 2} cy={stripY + 60}
              r={70 * springIn(frame, 1068, { damping: 8, stiffness: 200 })}
              fill="none" stroke={SAFFRON} strokeWidth="8"
            />
          ) : null}
          {/* the brace under the days that count */}
          <g opacity={tween(frame, 1046, 1064, 0, 1, EASE.out)}>
            <path d={`M${x0} ${stripY + 160} L${x0} ${stripY + 176} L${x0 + 6 * (cellW + gap) + cellW} ${stripY + 176} L${x0 + 6 * (cellW + gap) + cellW} ${stripY + 160}`} fill="none" stroke={SEA} strokeWidth="7" strokeLinejoin="round" />
            <text x={x0 + (6 * (cellW + gap) + cellW) / 2} y={stripY + 240} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="44" fill={SEA}>any day up to the 30th</text>
          </g>
          {frame >= 1086 ? (
            <text x={x0 + 7 * (cellW + gap) + cellW / 2} y={stripY + 212} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="34" fill={FOG}>too late</text>
          ) : null}
        </g>
        <CornerYou frame={frame} from={984} talking={frame > 990 && frame < 1072} />
      </Stage>
      <Eyebrow text="PAY BY" x={0} y={268} align="center" frame={frame} from={984} />
      <KineticText
        frame={frame} from={996} text="pay by = on or before" x={80} y={330} width={920}
        size={86} align="center" targets={["on", "or", "before"]} marker={SAFFRON} markerDelay={12}
      />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- practise

// Two say-asks, so the ask grows: the relay line first, then the reference
// number on top of it. ITM-MED-0804 asks for all three points, so the second
// ask is the one that completes the set.
const PRACTISE_STEPS = [
  {
    line: "Pay by thirty May, online or at the shop.",
    targets: [0, 1, 4, 5, 6, 7],
    from: 1140, pauseAt: 1338, eyebrow: "SAY IT WITH ME", size: 70, stickers: 2,
  },
  {
    line: "Use reference number four four seven one.",
    targets: [1, 2],
    from: 1374, pauseAt: 1536, eyebrow: "NOW THE NUMBER", size: 70, stickers: 3,
  },
];

function PractiseScene({ frame }: { frame: number }) {
  const step = frame >= PRACTISE_STEPS[1].from ? PRACTISE_STEPS[1] : PRACTISE_STEPS[0];
  const words = step.line.split(" ");
  const totalChars = step.line.length;
  // the line is complete 36 frames before the stop, so the held frame has the
  // whole sentence up and the mic already pulsing
  const start = step.from + 44;
  const span = step.pauseAt - 36 - start;
  let acc = 0;
  const reach = words.map((w) => {
    acc += w.length + 1;
    return start + (acc / totalChars) * span;
  });
  const circle = springIn(frame, 1146, { damping: 11, stiffness: 120 });
  // the cue springs in 24 frames early, so it is fully up and pulsing on the
  // pauseAt frame itself, which is the frame the player holds
  const cueAt = step.pauseAt - 24;
  const asking = frame >= cueAt && frame < step.pauseAt + 8;
  const resumeAt = step.pauseAt + 10;
  const samiArm = frame >= resumeAt ? ("thumbs" as const) : ("idle" as const);

  return (
    <AbsoluteFill style={{ background: PALE_BLUE }}>
      <Stage>
        <defs><clipPath id="med8-you"><circle cx="470" cy="420" r="290" /></clipPath></defs>
        <g transform={`translate(470 420) scale(${circle}) translate(-470 -420)`}>
          <circle cx="482" cy="434" r="290" fill={INK} />
          <circle cx="470" cy="420" r="290" fill="#fff" />
          <circle cx="470" cy="420" r="290" fill="none" stroke={SAFFRON} strokeWidth="14" />
          <g clipPath="url(#med8-you)">
            <Character
              who="you" x={470} y={1150} scale={1.82} facing={1} frame={frame} enter={1144}
              talking={frame > step.from + 20 && frame < step.pauseAt - 26} mood="happy"
              gesture="point" gestureAt={step.from + 24}
            />
          </g>
        </g>

        {/* sami, listening, small on the right and clear of the karaoke line */}
        <Sami x={952} y={1066} scale={0.62} facing={-1} frame={frame} enter={1152} arm={samiArm} armAt={resumeAt} smile={frame >= resumeAt} nodAt={resumeAt + 6} seed={23} />
        {frame >= resumeAt ? <Tick frame={frame} from={resumeAt + 8} x={1024} y={786} size={0.5} /> : null}

        {asking ? <TapCue frame={frame} x={148} y={252} kind="say" from={cueAt} label="Your turn" /> : null}

        {/* on resume the facts they have now said line up with ticks */}
        {frame >= resumeAt ? (
          <g>
            {["by 30 May", "online or shop", "4471"].slice(0, step.stickers).map((t, i) => {
              const s = springIn(frame, resumeAt + 6 + i * 8, { damping: 9, stiffness: 190 });
              const w = 300;
              const x = 60 + i * 320;
              return (
                <g key={t} transform={`translate(${x + w / 2} 1126) scale(${s}) translate(${-x - w / 2} -1126)`}>
                  <rect x={x} y="1078" width={w} height="96" rx="24" fill="#fff" stroke={INK} strokeWidth="5" />
                  <circle cx={x + 48} cy="1126" r="26" fill={SEA} />
                  <path d={`M${x + 36} 1126 L${x + 45} 1136 L${x + 61} 1114`} fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  <text x={x + 86} y="1140" fontFamily={FONT} fontWeight="800" fontSize="34" fill={INK}>{t}</text>
                </g>
              );
            })}
          </g>
        ) : null}
      </Stage>

      {/* the eyebrow shares the line's box, so the two stay on one centre */}
      <div
        style={{
          position: "absolute", left: 60, right: 236, top: 756, textAlign: "center",
          fontSize: 38, fontWeight: 800, letterSpacing: 6, color: FAINT,
          opacity: tween(frame, step.from + 10, step.from + 24, 0, 1, EASE.out),
        }}
      >
        {step.eyebrow}
      </div>
      {/* the right margin keeps the line out of sami's listening corner */}
      <div
        style={{
          position: "absolute", left: 60, right: 236, top: 810, display: "flex", flexWrap: "wrap",
          justifyContent: "center", columnGap: 22, fontSize: step.size, fontWeight: 800, lineHeight: 1.18, zIndex: 0,
        }}
      >
        {words.map((w, i) => {
          const s = springIn(frame, reach[i], { damping: 8, stiffness: 220 });
          const on = frame >= reach[i];
          const target = step.targets.includes(i);
          const last = i === words.length - 1;
          return (
            <span
              key={i}
              style={{
                position: "relative", display: "inline-block",
                color: on ? (target ? ACCENT : INK) : FOG,
                transform: `translateY(${on ? (1 - s) * -14 - (target ? 8 : 0) : 0}px) scale(${on ? 1 + (1 - s) * 0.18 : 1})`,
                zIndex: 0,
              }}
            >
              {w}
              {last ? <Highlight frame={frame} from={reach[i]} color={SAFFRON} /> : null}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- recap

// The card holds the three check stems the items use ("Pay by ___ May.", "How
// can they pay?", "Use the ___ number."). The self-efficacy close is the beat's
// narration, so it is spoken and captioned in the learner's own language.
function RecapScene({ frame }: { frame: number }) {
  const card = springIn(frame, 1580, { damping: 11, stiffness: 110 });
  const chips: { icon: "calendar" | "payways" | "tag"; at: number }[] = [
    { icon: "calendar", at: 1622 },
    { icon: "payways", at: 1634 },
    { icon: "tag", at: 1646 },
  ];
  return (
    <AbsoluteFill style={{ background: ACCENT }}>
      <Stage>
        <defs>
          <pattern id="med8-stripes" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="30" height="60" fill={PAPER} opacity="0.06" />
          </pattern>
        </defs>
        <rect width="1080" height="1440" fill="url(#med8-stripes)" />
        {chips.map((c, i) => {
          const s = springIn(frame, c.at, { damping: 9, stiffness: 180 });
          const x = 76 + i * 320;
          const y = 864;
          return (
            <g key={c.icon} transform={`translate(${x + 142} ${y + 90}) scale(${s}) translate(${-x - 142} ${-y - 90})`}>
              <rect x={x} y={y} width="284" height="180" rx="28" fill="#fff" stroke={INK} strokeWidth="5" />
              <g transform={`translate(${x + 142} ${y + 74}) scale(0.92)`}>
                {c.icon === "calendar" ? (
                  <g>
                    <rect x="-42" y="-44" width="84" height="88" rx="10" fill="#fff" stroke={INK} strokeWidth="5" />
                    <rect x="-42" y="-44" width="84" height="24" rx="10" fill={ACCENT} />
                    <text x="0" y="28" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="40" fill={INK}>30</text>
                  </g>
                ) : c.icon === "payways" ? (
                  <g>
                    <rect x="-46" y="-42" width="46" height="84" rx="10" fill={INK} />
                    <rect x="-40" y="-34" width="34" height="62" rx="6" fill="#fff" />
                    <circle cx="-23" cy="-2" r="12" fill={SEA} />
                    <rect x="6" y="-20" width="48" height="62" rx="7" fill={WALL} stroke={INK} strokeWidth="5" />
                    <rect x="10" y="-16" width="40" height="14" rx="4" fill={SAFFRON} />
                    <rect x="24" y="8" width="16" height="34" rx="3" fill={WOOD_LIGHT} stroke={INK} strokeWidth="4" />
                  </g>
                ) : (
                  <g>
                    <path d="M-28 -34 L62 -34 L62 34 L-28 34 L-58 0 Z" fill={PAPER} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
                    <circle cx="-24" cy="0" r="7" fill="none" stroke={INK} strokeWidth="4" />
                    <text x="20" y="13" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="32" fill={ACCENT}>4471</text>
                  </g>
                )}
              </g>
              <text x={x + 142} y={y + 156} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="28" letterSpacing="2" fill={FAINT}>
                {c.icon === "calendar" ? "WHEN" : c.icon === "payways" ? "HOW" : "THE NUMBER"}
              </text>
            </g>
          );
        })}
        <Confetti frame={frame} from={1578} count={76} seed={11} />
      </Stage>
      <div
        style={{
          position: "absolute", left: 72, right: 72, top: 208,
          transform: `scale(${card}) rotate(${(1 - card) * -5}deg)`, transformOrigin: "50% 50%",
        }}
      >
        <div style={{ position: "absolute", inset: 0, transform: "translate(10px, 14px)", background: INK, borderRadius: 56 }} />
        <div style={{ position: "relative", background: "#fff", borderRadius: 56, padding: "44px 48px 48px", textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 6, color: FAINT }}>REMEMBER</div>
          <div style={{ fontSize: 64, fontWeight: 800, color: INK, lineHeight: 1.2, marginTop: 14 }}>
            <span style={{ position: "relative", display: "inline-block", color: ACCENT, zIndex: 0 }}>
              Pay by
              <Highlight frame={frame} from={1606} color={SAFFRON} />
            </span>
            <span style={{ color: SAFFRON, letterSpacing: 4 }}> … </span>
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, color: ACCENT, lineHeight: 1.2, marginTop: 6 }}>
            Pay online or<span style={{ color: SAFFRON, letterSpacing: 4 }}> … </span>
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, color: ACCENT, lineHeight: 1.2, marginTop: 6 }}>
            Use the<span style={{ color: SAFFRON, letterSpacing: 4 }}> … </span>
            <span style={{ color: INK }}>number.</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- composition

export function GasBillExplainer({ l1 }: { l1?: Record<string, string> }) {
  const frame = useCurrentFrame();
  const beat = beatAt(frame);
  // the caption finishes three quarters of the way through its beat, so every
  // frame the player stops on holds a line that has been fully said. karaoke()
  // compares acc/total where acc overshoots total by one trailing space, so the
  // last word never lights at progress 1; lib.tsx is not mine to change, so the
  // full line is forced here instead.
  const span = Math.max(30, Math.min(120, (beat.to - beat.from) * 0.75));
  const progress = (frame - beat.from) / span;
  const k = progress >= 1 ? beat.line.split(" ").length : karaoke(beat.line, Math.max(0, progress));
  const font: CSSProperties = { fontFamily: FONT };
  return (
    <AbsoluteFill style={{ ...font, background: PAPER, overflow: "hidden" }}>
      {beat.kind === "hook" || beat.kind === "notice" ? <KitchenScene frame={frame} /> : null}
      {beat.id === "explain" ? <ExplainScene frame={frame} /> : null}
      {beat.id === "explain2" ? <Explain2Scene frame={frame} /> : null}
      {beat.kind === "practise" ? <PractiseScene frame={frame} /> : null}
      {beat.kind === "recap" ? <RecapScene frame={frame} /> : null}
      {/* the five cuts. None of them lands on a pauseAt frame: a transition is
          fully opaque on its own frame, and a held ask on an opaque frame shows
          the learner nothing to answer */}
      <Transition frame={frame} at={132} kind="iris" color={PAPER} color2={ACCENT} cx={540} cy={780} duration={20} />
      <Transition frame={frame} at={804} kind="iris" color={PAPER} color2={SAFFRON} cx={540} cy={700} />
      <Transition frame={frame} at={972} kind="wipe" color={PAPER} color2={SAFFRON} />
      <Transition frame={frame} at={1140} kind="slide" color={ACCENT} color2={SAFFRON} />
      <Transition frame={frame} at={1572} kind="wipe" color={SAFFRON} color2={INK} />
      <CaptionBar line={beat.line} k={k} targets={beat.target} l1={l1?.[beat.id]} />
      {/* the recap sits on an ACCENT background, where the bar's default ACCENT
          fill disappears, so it turns cream for that beat */}
      <BeatProgress frame={frame} beats={MED8_BEATS} color={beat.kind === "recap" ? CREAM : ACCENT} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- L1 captions
// One short line per beat, ten of them. The storyboard's six languages, with
// explain2 taking the wording of the noticing card in content.ts and the recap
// line carrying the self-efficacy close rather than the stem, so a learner
// reading captions hears what they can now do in their own language.
export const MED8_L1: Record<string, Record<string, string>> = {
  ar: {
    hook: "لدى سامي رسالة. لا يستطيع قراءتها.",
    n1: "هذه فاتورة الغاز الخاصة بك.",
    n2: "يرجى الدفع بحلول 30 مايو.",
    n3: "يمكنك الدفع عبر الإنترنت أو في المتجر.",
    n4: "استخدم الرقم المرجعي 4471.",
    explain: "ثلاثة أشياء: متى، كيف، والرقم.",
    explain2: "Pay by تعني في ذلك اليوم أو قبله.",
    practise: "قلها معي.",
    again: "والآن الرقم المرجعي: 4471.",
    recap: "يمكنك قراءة الرسالة وإخباره. غدًا مرة أخرى.",
  },
  es: {
    hook: "Sami tiene una carta. No puede leerla.",
    n1: "Esta es tu factura del gas.",
    n2: "Pague antes del 30 de mayo.",
    n3: "Puedes pagar en línea o en la tienda.",
    n4: "Usa el número de referencia 4471.",
    explain: "Tres cosas: cuándo, cómo y el número.",
    explain2: "Pay by significa ese día o antes.",
    practise: "Dilo conmigo.",
    again: "Ahora el número de referencia: 4471.",
    recap: "Ya puedes leer la carta y contárselo. Mañana otra vez.",
  },
  hi: {
    hook: "सामी के पास एक चिट्ठी है। वह पढ़ नहीं पाता।",
    n1: "यह आपका गैस बिल है।",
    n2: "कृपया 30 मई तक भुगतान करें।",
    n3: "आप ऑनलाइन या दुकान पर भुगतान कर सकते हैं।",
    n4: "रेफ़रेंस नंबर 4471 इस्तेमाल करें।",
    explain: "तीन बातें: कब, कैसे, और नंबर।",
    explain2: "Pay by का मतलब उस दिन या उससे पहले।",
    practise: "मेरे साथ बोलो।",
    again: "अब रेफ़रेंस नंबर: 4471।",
    recap: "अब आप चिट्ठी पढ़कर उसे बता सकते हैं। कल फिर।",
  },
  ru: {
    hook: "У Сами письмо. Он не может его прочитать.",
    n1: "Это ваш счёт за газ.",
    n2: "Оплатите до 30 мая.",
    n3: "Можно оплатить онлайн или в магазине.",
    n4: "Укажите номер ссылки 4471.",
    explain: "Три вещи: когда, как и номер.",
    explain2: "Pay by значит в этот день или раньше.",
    practise: "Скажи со мной.",
    again: "Теперь номер ссылки: 4471.",
    recap: "Теперь вы можете прочитать письмо и рассказать ему. Завтра снова.",
  },
  tr: {
    hook: "Sami'nin bir mektubu var. Okuyamıyor.",
    n1: "Bu sizin gaz faturanız.",
    n2: "Lütfen 30 Mayıs'a kadar ödeyin.",
    n3: "İnternetten veya dükkandan ödeyebilirsiniz.",
    n4: "4471 referans numarasını kullanın.",
    explain: "Üç şey: ne zaman, nasıl ve numara.",
    explain2: "Pay by: o gün ya da öncesi.",
    practise: "Benimle söyle.",
    again: "Şimdi referans numarası: 4471.",
    recap: "Artık mektubu okuyup ona anlatabilirsin. Yarın tekrar.",
  },
  zh: {
    hook: "Sami 有一封信。他看不懂。",
    n1: "这是你的燃气账单。",
    n2: "请在 5 月 30 日前付款。",
    n3: "可以在线支付或在店里支付。",
    n4: "使用参考号 4471。",
    explain: "三件事：什么时候、怎么付、号码。",
    explain2: "Pay by 表示当天或之前。",
    practise: "跟我一起说。",
    again: "现在说参考号：4471。",
    recap: "你现在可以读信并告诉他。明天再来。",
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
  component: GasBillExplainer,
  beats: MED8_BEATS,
  duration: MED8_DURATION,
  fps: 30,
  width: 1080,
  height: 1440,
  l1: MED8_L1,
};
