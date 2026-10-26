"use client";

// The explainer kit: a small 2D flat-vector toolbox shared by every lesson
// composition. Characters, cafe props, scene helpers (parallax camera, beat
// transitions, kinetic typography, highlights, pulses, confetti) and easing.
// Everything is a pure function of the frame, so the same code plays in the
// Remotion Player and renders deterministically to MP4.

import { AbsoluteFill, Easing, interpolate, spring } from "remotion";
import type { CSSProperties, ReactNode } from "react";

// ---------------------------------------------------------------- palette
export const INK = "#1b1d3a";
export const ACCENT = "#3a3fc7";
export const SAFFRON = "#f5b733";
export const PAPER = "#fbf7f0";
export const PINK = "#e75c94";
export const SEA = "#1fb48a";
export const FOG = "#b9bcd6";
export const FAINT = "#8386a6";
export const WOOD = "#8b6b4e";
export const WOOD_LIGHT = "#c9a27a";
export const WOOD_DARK = "#6a4e36";
export const CREAM = "#f3e6d3";
export const COFFEE = "#5a3420";
export const FONT = 'var(--lp-font, "Plus Jakarta Sans"), "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
export const STAGE_W = 1080;
export const STAGE_H = 1440;

// ---------------------------------------------------------------- easing + springs
export const EASE = {
  out: Easing.out(Easing.cubic),
  in: Easing.in(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
  back: Easing.out(Easing.back(1.7)),
  expo: Easing.out(Easing.exp),
  bounce: Easing.bounce,
};

/** Clamped interpolation between two frames with an easing preset. */
export function tween(frame: number, from: number, to: number, a = 0, b = 1, easing: (t: number) => number = EASE.inOut): number {
  if (to <= from) return frame >= to ? b : a;
  return interpolate(frame, [from, to], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
}

export type SpringCfg = { damping?: number; stiffness?: number; mass?: number; fps?: number; clamp?: boolean };

/** Spring from 0 to 1 starting at `from`; 0 before it. Overshoots unless `clamp`. */
export function springIn(frame: number, from: number, cfg: SpringCfg = {}): number {
  if (frame < from) return 0;
  return spring({ frame: frame - from, fps: cfg.fps ?? 30, config: { damping: cfg.damping ?? 12, stiffness: cfg.stiffness ?? 120, mass: cfg.mass ?? 1, overshootClamping: cfg.clamp } });
}

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Deterministic hash of two integers to [0, 1). */
export function hash(a: number, b = 0): number {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Seeded PRNG (mulberry32) for particle systems. */
export function rng(seed: number): () => number {
  let s = (seed | 0) || 1;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Word-level karaoke progress for a line, by character weight. */
export function karaoke(line: string, progress: number): number {
  const words = line.split(" ");
  const total = line.length;
  let acc = 0;
  for (let i = 0; i < words.length; i++) {
    acc += words[i].length + 1;
    if (acc / total > progress) return i;
  }
  return words.length;
}

const clean = (w: string) => w.replace(/[.,?!…]/g, "");

/** True when a word belongs to one of the target phrases. */
export function wordIsTarget(word: string, targets: string[] = []): boolean {
  const w = clean(word);
  return targets.some((t) => t.split(" ").some((p) => clean(p) === w));
}

// ---------------------------------------------------------------- stage
/** A 1080x1440 SVG layer that fills the composition. */
export function Stage({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} width={STAGE_W} height={STAGE_H} style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>
      {children}
    </svg>
  );
}

// ---------------------------------------------------------------- characters
export type Who = "leo" | "you" | "maya";
export type Gesture = "idle" | "wave" | "raise" | "point" | "cup" | "serve" | "two" | "think" | "thumbs" | "listen";
export type Mood = "neutral" | "happy" | "surprised" | "think";

type Look = { skin: string; hair: string; top: string; top2: string; trousers: string };
const LOOKS: Record<Who, Look> = {
  leo: { skin: "#f1c9a5", hair: "#2b2118", top: "#2f7f8a", top2: "#8b6b4e", trousers: "#2b3a55" },
  you: { skin: "#d9a071", hair: "#3b2a20", top: "#f5b733", top2: "#fbf7f0", trousers: "#3a3fc7" },
  maya: { skin: "#8d5524", hair: "#1e1a17", top: "#e07a5f", top2: "#fbf7f0", trousers: "#1b1d3a" },
};

const UPPER = 78;
const FORE = 72;
const SHOULDER = { x: 46, y: -300 };
type Pose = { s: number; e: number };
const IDLE: Pose = { s: 6, e: 10 };
function poseFor(g: Gesture, frame: number): Pose {
  switch (g) {
    case "wave": return { s: 150, e: 12 + Math.sin(frame / 2.6) * 26 };
    case "raise": return { s: 118, e: 62 };
    case "point": return { s: 78, e: 4 };
    case "cup": return { s: 52, e: 72 };
    case "serve": return { s: 48, e: 0 };
    case "two": return { s: 128, e: 72 };
    case "think": return { s: 25, e: 165 };
    case "thumbs": return { s: 100, e: 55 };
    case "listen": return { s: 40, e: 150 };
    default: return IDLE;
  }
}
const dir = (deg: number) => { const r = (deg * Math.PI) / 180; return { x: Math.sin(r), y: Math.cos(r) }; };

/** 1 = eyes open, 0 = closed, on a seeded schedule. */
export function blink(frame: number, seed: number): number {
  const period = 84;
  const slot = Math.floor(frame / period);
  const off = Math.floor(hash(slot, seed) * (period - 12));
  const t = (frame % period) - off;
  if (t < 0 || t > 7) return 1;
  return t <= 3 ? 1 - t / 3 : (t - 3) / 4;
}

export type CharacterProps = {
  who: Who; x: number; y: number; frame: number;
  scale?: number; facing?: 1 | -1; enter?: number; slideFrom?: number;
  talking?: boolean; gesture?: Gesture; gestureAt?: number; from?: Gesture; mood?: Mood;
  walking?: boolean; walkSpeed?: number; legs?: boolean; seed?: number; holding?: "mug" | "takeaway" | "tea";
  /** Where the eyes look, -1 (behind) to 1 (the way the body faces). */
  gaze?: number;
};

/** A flat-vector character. Origin at the feet; +x is the side it faces. */
export function Character(p: CharacterProps) {
  const { who, x, y, frame } = p;
  const scale = p.scale ?? 1;
  const facing = p.facing ?? 1;
  const enter = p.enter ?? 0;
  const seed = p.seed ?? who.length * 17 + who.charCodeAt(0);
  if (frame < enter) return null;
  const L = LOOKS[who];
  const s = springIn(frame, enter, { damping: 9, stiffness: 150 });
  const squashX = 1 + (1 - s) * 0.35;
  const slide = (p.slideFrom ?? 0) * (1 - tween(frame, enter, enter + 22, 0, 1, EASE.out));
  const br = Math.sin((frame + seed * 7) / 16);
  const walkT = frame / (p.walkSpeed ?? 4.5);
  const bob = p.walking ? Math.abs(Math.sin(walkT)) * 7 : br * 1.6;
  const bl = blink(frame, seed);
  const talking = !!p.talking;
  const mood = p.mood ?? "neutral";
  const g = p.gesture ?? "idle";
  const gA = g === "idle" ? 1 : springIn(frame, p.gestureAt ?? enter, { damping: 11, stiffness: 110 });
  const pose = poseFor(g, frame);
  const prev = poseFor(p.from ?? "idle", frame);
  const lead: Pose = { s: lerp(prev.s, pose.s, gA), e: lerp(prev.e, pose.e, gA) };
  const trail: Pose = { s: IDLE.s + br * 1.5, e: IDLE.e };
  const tilt = (mood === "think" ? 7 : 0) + (talking ? Math.sin(frame / 4) * 1.5 : 0);
  const legs = p.legs ?? true;
  const gaze = p.gaze ?? 0;

  const Arm = ({ pose: ap, mirror, hand }: { pose: Pose; mirror: boolean; hand?: Gesture }) => (
    <g transform={`translate(${mirror ? -SHOULDER.x : SHOULDER.x} ${SHOULDER.y}) scale(${mirror ? -1 : 1} 1) rotate(${-ap.s})`}>
      <line x1="0" y1="0" x2="0" y2={UPPER} stroke={L.top} strokeWidth="26" strokeLinecap="round" />
      <g transform={`translate(0 ${UPPER}) rotate(${-ap.e})`}>
        <line x1="0" y1="0" x2="0" y2={FORE} stroke={L.top} strokeWidth="24" strokeLinecap="round" />
        <line x1="0" y1={FORE - 24} x2="0" y2={FORE - 6} stroke={L.skin} strokeWidth="22" strokeLinecap="round" />
        <circle cx="0" cy={FORE} r="14" fill={L.skin} />
        {hand === "point" ? <line x1="0" y1={FORE} x2="0" y2={FORE + 20} stroke={L.skin} strokeWidth="9" strokeLinecap="round" /> : null}
        {hand === "two" ? <><line x1="-5" y1={FORE} x2="-8" y2={FORE + 22} stroke={L.skin} strokeWidth="8" strokeLinecap="round" /><line x1="5" y1={FORE} x2="8" y2={FORE + 22} stroke={L.skin} strokeWidth="8" strokeLinecap="round" /></> : null}
        {hand === "wave" || hand === "raise" || hand === "listen" || hand === "serve" ? [-10, 0, 10].map((a) => <line key={a} x1={a * 0.6} y1={FORE} x2={a * 1.3} y2={FORE + 19} stroke={L.skin} strokeWidth="8" strokeLinecap="round" />) : null}
        {hand === "thumbs" ? <line x1="2" y1={FORE + 2} x2="24" y2={FORE - 18} stroke={L.skin} strokeWidth="11" strokeLinecap="round" /> : null}
      </g>
    </g>
  );

  // forward kinematics for a held prop
  const el = { x: SHOULDER.x + UPPER * dir(lead.s).x, y: SHOULDER.y + UPPER * dir(lead.s).y };
  const hd = { x: el.x + FORE * dir(lead.s + lead.e).x, y: el.y + FORE * dir(lead.s + lead.e).y };

  return (
    <g transform={`translate(${x + slide * facing} ${y}) scale(${scale * facing * squashX} ${scale * s})`}>
      <ellipse cx="0" cy="2" rx="78" ry="13" fill={INK} opacity="0.13" />
      <g transform={`translate(0 ${-bob})`}>
        {legs ? (
          <g>
            {[-1, 1].map((k) => {
              const sw = p.walking ? Math.sin(walkT + (k > 0 ? 0 : Math.PI)) * 20 : 0;
              return (
                <g key={k} transform={`rotate(${sw} ${k * 20} -150)`}>
                  <rect x={k * 20 - 16} y="-156" width="32" height="156" rx="14" fill={L.trousers} />
                  <ellipse cx={k * 20 + 6} cy="0" rx="26" ry="10" fill={INK} />
                </g>
              );
            })}
          </g>
        ) : null}
        <Arm pose={trail} mirror />
        {/* torso (breathing scales from the waist) */}
        <g transform={`translate(0 -150) scale(1 ${1 + br * 0.012}) translate(0 150)`}>
          <rect x="-14" y="-352" width="28" height="46" fill={L.skin} />
          <path d="M-62 -296 Q-62 -324 -34 -324 L34 -324 Q62 -324 62 -296 L54 -150 L-54 -150 Z" fill={L.top} />
          {who === "leo" ? (
            <g>
              <path d="M-36 -290 L36 -290 L50 -150 L-50 -150 Z" fill={L.top2} />
              <path d="M-26 -292 Q0 -340 26 -292" fill="none" stroke={L.top2} strokeWidth="7" />
              <rect x="-22" y="-215" width="44" height="34" rx="6" fill={WOOD_DARK} opacity="0.5" />
              <rect x="-58" y="-262" width="30" height="18" rx="4" fill={PAPER} />
              <circle cx="-50" cy="-253" r="4" fill={ACCENT} />
            </g>
          ) : who === "you" ? (
            <g>
              <path d="M-20 -324 L20 -324 L18 -150 L-18 -150 Z" fill={L.top2} />
              <path d="M-20 -324 L-2 -298 L-34 -284 Z" fill={L.top2} opacity="0.9" />
              <path d="M20 -324 L2 -298 L34 -284 Z" fill={L.top2} opacity="0.9" />
              <path d="M-44 -324 L-26 -324 L-6 -150 L-22 -150 Z" fill={ACCENT} opacity="0.85" />
            </g>
          ) : (
            <g>
              <path d="M-26 -324 Q0 -292 26 -324 L30 -316 Q0 -280 -30 -316 Z" fill={L.top2} />
              <circle cx="0" cy="-270" r="7" fill={SAFFRON} />
              <path d="M-16 -316 Q0 -266 16 -316" fill="none" stroke={SAFFRON} strokeWidth="3" />
            </g>
          )}
        </g>
        {/* head */}
        <g transform={`translate(0 -400) rotate(${tilt * (facing === 1 ? 1 : 1)})`}>
          {who === "maya" ? <path d="M-58 34 L-58 -18 C-58 -72 -30 -88 0 -88 C30 -88 58 -72 58 -18 L58 34 C58 44 48 44 48 34 L48 -4 L-48 -4 L-48 34 C-48 44 -58 44 -58 34 Z" fill={L.hair} /> : null}
          <circle cx="-50" cy="2" r="11" fill={L.skin} />
          <circle cx="50" cy="2" r="11" fill={L.skin} />
          <path d="M-50 -10 C-50 -62 -28 -70 0 -70 C28 -70 50 -62 50 -10 C50 30 30 58 0 58 C-30 58 -50 30 -50 -10 Z" fill={L.skin} />
          {who === "leo" ? <path d="M-52 -12 C-52 -60 -30 -80 0 -80 C34 -80 54 -56 52 -20 C44 -40 30 -50 10 -46 C-2 -44 -10 -36 -22 -30 C-36 -22 -46 -16 -52 -12 Z" fill={L.hair} /> : null}
          {who === "you" ? (
            <g fill={L.hair}>
              <path d="M-50 -20 C-50 -60 -28 -72 0 -72 C28 -72 50 -60 50 -20 Z" />
              {[[-40, -40, 22], [-18, -62, 24], [12, -66, 24], [36, -50, 22], [50, -26, 16], [-50, -18, 16], [0, -78, 18]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} />)}
            </g>
          ) : null}
          {who === "maya" ? <path d="M-50 -22 C-46 -62 -20 -76 10 -74 C34 -72 48 -58 52 -36 C36 -48 20 -48 0 -42 C-20 -36 -36 -26 -50 -22 Z" fill={L.hair} /> : null}
          {/* cheeks, brows, eyes, nose, mouth */}
          <circle cx="-32" cy="16" r="8" fill={PINK} opacity="0.22" />
          <circle cx="32" cy="16" r="8" fill={PINK} opacity="0.22" />
          <g transform={`translate(0 ${mood === "surprised" ? -6 : mood === "happy" ? -2 : 0})`}>
            <path d="M-32 -28 Q-22 -34 -10 -29" fill="none" stroke={L.hair} strokeWidth="4.5" strokeLinecap="round" transform={mood === "think" ? "translate(0 2)" : ""} />
            <path d="M10 -29 Q22 -34 32 -28" fill="none" stroke={L.hair} strokeWidth="4.5" strokeLinecap="round" transform={mood === "think" ? "translate(0 -6) rotate(-6 20 -30)" : ""} />
          </g>
          {[-20, 20].map((ex) => (
            <g key={ex} transform={`translate(${ex} -4)`}>
              <ellipse cx="0" cy="0" rx={10 * Math.max(0.2, bl)} ry={12 * bl} fill="#fff" />
              <circle cx={2 + gaze * 3.4} cy={1} r={5.5 * bl} fill={INK} />
              <circle cx={gaze * 3.4} cy={-2} r={1.9 * bl} fill="#fff" />
              {bl < 0.45 ? <path d="M-10 0 Q0 4 10 0" fill="none" stroke={L.hair} strokeWidth="3.4" strokeLinecap="round" opacity={1 - bl / 0.45} /> : null}
            </g>
          ))}
          {who === "maya" ? (
            <g fill="none" stroke={ACCENT} strokeWidth="3.5">
              <circle cx="-20" cy="-4" r="18" /><circle cx="20" cy="-4" r="18" /><path d="M-2 -6 L2 -6" />
              <circle cx="-54" cy="16" r="5" fill={SAFFRON} stroke="none" /><circle cx="54" cy="16" r="5" fill={SAFFRON} stroke="none" />
            </g>
          ) : null}
          <path d="M4 6 Q11 15 2 18" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" opacity="0.6" />
          <Mouth talking={talking} mood={mood} frame={frame} seed={seed} />
        </g>
        <Arm pose={lead} mirror={false} hand={g} />
        {p.holding ? <Cup kind={p.holding} x={hd.x + 4} y={hd.y + 8} scale={0.42} frame={frame} appear={0} steam={false} /> : null}
      </g>
    </g>
  );
}

function Mouth({ talking, mood, frame, seed }: { talking: boolean; mood: Mood; frame: number; seed: number }) {
  if (!talking) {
    if (mood === "surprised") return <ellipse cx="0" cy="32" rx="8" ry="10" fill={INK} />;
    if (mood === "think") return <path d="M-9 31 Q0 27 10 32" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />;
    if (mood === "happy") return <path d="M-17 24 Q0 44 17 24 Q0 31 -17 24 Z" fill={INK} />;
    return <path d="M-14 26 Q0 38 14 26" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />;
  }
  const idx = Math.floor(hash(Math.floor(frame / 3), seed) * 5);
  switch (idx) {
    case 0: return <g><ellipse cx="0" cy="31" rx="12" ry="12" fill={INK} /><rect x="-8" y="20" width="16" height="4" rx="2" fill="#fff" /><ellipse cx="0" cy="39" rx="7" ry="4" fill={PINK} /></g>;
    case 1: return <ellipse cx="0" cy="30" rx="8" ry="5" fill={INK} />;
    case 2: return <circle cx="0" cy="31" r="7" fill={INK} />;
    case 3: return <g><rect x="-15" y="24" width="30" height="9" rx="4" fill={INK} /><rect x="-10" y="24" width="20" height="3.5" rx="1.5" fill="#fff" /></g>;
    default: return <path d="M-13 26 Q0 36 13 26" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />;
  }
}

// ---------------------------------------------------------------- props
export function Steam({ x, y, frame, seed = 0, color = "#cdbfb1", size = 1 }: { x: number; y: number; frame: number; seed?: number; color?: string; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      {[0, 1, 2].map((i) => {
        const t = ((frame + seed * 13 + i * 21) % 64) / 64;
        const yy = -t * 110;
        const op = Math.sin(t * Math.PI) * 0.75;
        const xx = Math.sin(t * Math.PI * 2 + i * 1.7) * 9 + (i - 1) * 22;
        return <path key={i} d={`M${xx} ${yy} c 14 -14 -14 -28 0 -44`} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" opacity={op} />;
      })}
    </g>
  );
}

export type CupKind = "mug" | "takeaway" | "tea";
export type CupProps = { kind: CupKind; x: number; y: number; frame: number; appear?: number; scale?: number; slideFrom?: number; leave?: number; dunkAt?: number; steam?: boolean; seed?: number };

/** A cup standing on its base at (x, y). Slides in with a bounce from `slideFrom` px away. */
export function Cup({ kind, x, y, frame, appear = 0, scale = 1, slideFrom = 0, leave, dunkAt, steam = true, seed = 0 }: CupProps) {
  if (frame < appear) return null;
  if (leave !== undefined && frame > leave + 16) return null;
  const s = springIn(frame, appear, { damping: 10, stiffness: 150 });
  const land = springIn(frame, appear, { damping: 7, stiffness: 260 });
  const slide = slideFrom * (1 - s);
  const out = leave !== undefined ? tween(frame, leave, leave + 16, 0, 1, EASE.in) : 0;
  const sx = 1 + (1 - land) * 0.25;
  const sy = 1 + (land - 1) * 0.6;
  const dunk = dunkAt !== undefined && frame >= dunkAt ? Math.sin((frame - dunkAt) / 4.5) * 16 * Math.exp(-(frame - dunkAt) / 70) : 0;
  const steep = dunkAt !== undefined ? tween(frame, dunkAt, dunkAt + 60, 0.35, 0.9, EASE.out) : 0.85;
  return (
    <g transform={`translate(${x + slide + out * 160} ${y - out * 40}) scale(${scale * sx} ${scale * sy})`} opacity={1 - out}>
      <ellipse cx="4" cy="4" rx="56" ry="9" fill={INK} opacity="0.12" />
      {kind === "mug" ? (
        <g>
          <ellipse cx="0" cy="0" rx="64" ry="13" fill="#fff" stroke="#d8cfc4" strokeWidth="3" />
          <path d="M44 -64 C76 -64 76 -24 42 -20" fill="none" stroke="#d8cfc4" strokeWidth="11" strokeLinecap="round" />
          <path d="M44 -64 C76 -64 76 -24 42 -20" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <path d="M-44 -84 L44 -84 L35 -6 Q35 0 28 0 L-28 0 Q-35 0 -35 -6 Z" fill="#fff" stroke="#d8cfc4" strokeWidth="3" />
          <path d="M-41 -58 L41 -58 L39 -42 L-39 -42 Z" fill={ACCENT} />
          <ellipse cx="0" cy="-84" rx="44" ry="9" fill="#fff" stroke="#d8cfc4" strokeWidth="3" />
          <ellipse cx="0" cy="-84" rx="36" ry="6" fill={COFFEE} />
          <path d="M-6 -86 C-6 -90 0 -90 0 -86 C0 -90 6 -90 6 -86 C6 -82 0 -79 0 -79 C0 -79 -6 -82 -6 -86 Z" fill="#f1dfc8" />
          {steam ? <Steam x={0} y={-96} frame={frame} seed={seed} /> : null}
        </g>
      ) : kind === "takeaway" ? (
        <g>
          <path d="M-40 -122 L40 -122 L31 -4 Q31 0 26 0 L-26 0 Q-31 0 -31 -4 Z" fill="#fff" stroke="#d8cfc4" strokeWidth="3" />
          <path d="M-37 -84 L37 -84 L33 -34 L-33 -34 Z" fill={WOOD_LIGHT} />
          <circle cx="0" cy="-59" r="12" fill={PAPER} /><circle cx="0" cy="-59" r="6" fill={ACCENT} />
          <rect x="-46" y="-138" width="92" height="18" rx="7" fill={INK} />
          <rect x="-34" y="-146" width="68" height="10" rx="5" fill={INK} />
          <rect x="12" y="-142" width="14" height="4" rx="2" fill={PAPER} opacity="0.7" />
          {steam ? <Steam x={0} y={-150} frame={frame} seed={seed} /> : null}
        </g>
      ) : (
        <g>
          <path d="M-38 -96 L38 -96 L31 -4 Q31 0 26 0 L-26 0 Q-31 0 -31 -4 Z" fill="#e9f1f4" stroke="#c3d3d8" strokeWidth="3" />
          <path d="M-34 -62 L34 -62 L30 -5 Q30 -1 26 -1 L-26 -1 Q-30 -1 -30 -5 Z" fill="#c98a3a" opacity={steep} />
          <line x1="-26" y1="-82" x2="-22" y2="-16" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
          <ellipse cx="0" cy="-96" rx="38" ry="7" fill="#f4f8fa" stroke="#c3d3d8" strokeWidth="3" />
          <g transform={`translate(0 ${dunk})`}>
            <rect x="2" y="-58" width="24" height="30" rx="5" fill={PAPER} stroke="#d8cfc4" strokeWidth="2" />
            <line x1="14" y1="-58" x2="14" y2="-100" stroke={INK} strokeWidth="2" />
          </g>
          <path d={`M14 ${-100 + dunk * 0.4} Q30 -118 52 -104`} fill="none" stroke={INK} strokeWidth="2" />
          <rect x="44" y="-110" width="24" height="18" rx="4" fill={SAFFRON} />
          {steam ? <Steam x={-6} y={-106} frame={frame} seed={seed + 3} size={0.8} /> : null}
        </g>
      )}
    </g>
  );
}

/** A chalkboard menu. Rows are laid out in proportion to `h`, so it reads at any size. */
export function MenuBoard({ x, y, w = 360, h = 330, title = "MENU", items = [["Flat white", "2.80"], ["Coffee", "2.50"], ["Tea", "2.00"], ["Croissant", "1.80"]] }: { x: number; y: number; w?: number; h?: number; title?: string; items?: [string, string][] }) {
  const chalk = "#f3ead9";
  const top = h * 0.4;
  const gap = (h * 0.92 - top) / Math.max(1, items.length);
  const size = Math.min(gap * 0.68, w * 0.085);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width={w} height={h} rx="14" fill={WOOD_LIGHT} />
      <rect x="14" y="14" width={w - 28} height={h - 28} rx="8" fill="#2f3b37" />
      <text x={w / 2} y={h * 0.23} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize={h * 0.121} letterSpacing="6" fill={chalk}>{title}</text>
      <line x1={w * 0.17} y1={h * 0.28} x2={w * 0.83} y2={h * 0.28} stroke={chalk} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      {items.map(([name, price], i) => (
        <g key={name} transform={`translate(0 ${top + gap * (i + 0.5)})`}>
          <text x={w * 0.12} y="0" fontFamily={FONT} fontWeight="600" fontSize={size} fill={chalk}>{name}</text>
          <text x={w - w * 0.12} y="0" textAnchor="end" fontFamily={FONT} fontWeight="700" fontSize={size} fill={SAFFRON}>{price}</text>
        </g>
      ))}
    </g>
  );
}

/** A wall shelf with a few jars on it. (The storyboards keep `Shelf` for the explain-beat diagram.) */
export function WallShelf({ x, y, w = 400, frame, seed = 0, plant = true }: { x: number; y: number; w?: number; frame: number; seed?: number; plant?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`translate(${w * 0.12} 0)`}><rect x="-18" y="-50" width="36" height="50" rx="6" fill="#d9a441" /><rect x="-14" y="-60" width="28" height="12" rx="3" fill={INK} /></g>
      <g transform={`translate(${w * 0.28} 0)`}><rect x="-18" y="-40" width="36" height="40" rx="6" fill="#e07a5f" /><rect x="-14" y="-50" width="28" height="12" rx="3" fill={INK} /></g>
      <g transform={`translate(${w * 0.44} 0)`}><rect x="-16" y="-56" width="32" height="56" rx="6" fill="#8fb8a8" /><rect x="-12" y="-64" width="24" height="10" rx="3" fill={INK} /></g>
      {plant ? <Plant x={w * 0.84} y={0} scale={0.5} frame={frame} seed={seed} /> : null}
      <rect x="0" y="0" width={w} height="14" rx="4" fill={WOOD_LIGHT} />
      <rect x="0" y="14" width={w} height="6" rx="3" fill={WOOD_DARK} opacity="0.4" />
    </g>
  );
}

export function Till({ x, y, frame, total = "2.50" }: { x: number; y: number; frame: number; total?: string }) {
  const paperUp = 20 + Math.sin(frame / 30) * 2;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-70" y={-120 - paperUp} width="54" height={60 + paperUp} rx="4" fill={PAPER} />
      {[0, 1, 2].map((i) => <line key={i} x1="-60" y1={-104 - paperUp + i * 12} x2="-26" y2={-104 - paperUp + i * 12} stroke={FOG} strokeWidth="3" />)}
      <path d="M-100 -20 L-92 -100 Q-90 -108 -82 -108 L82 -108 Q90 -108 92 -100 L100 -20 Z" fill="#3b3f5c" />
      <rect x="-104" y="-22" width="208" height="22" rx="6" fill={INK} />
      <rect x="-74" y="-100" width="148" height="34" rx="6" fill="#d9ead6" />
      <text x="68" y="-75" textAnchor="end" fontFamily={FONT} fontWeight="800" fontSize="24" fill={INK}>£{total}</text>
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={-66 + c * 34} y={-56 + r * 12} width="24" height="8" rx="3" fill={PAPER} opacity="0.75" />))}
    </g>
  );
}

export function Pastry({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="0" rx="90" ry="12" fill="#fff" stroke="#d8cfc4" strokeWidth="3" />
      <g transform="translate(-28 -8)">
        {[[-30, 0, 20, 14, -20], [-10, -8, 24, 16, 0], [12, -8, 24, 16, 0], [32, 0, 20, 14, 20]].map(([cx, cy, rx, ry, rot], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={i === 0 || i === 3 ? "#d4933a" : "#e8a84a"} transform={`rotate(${rot} ${cx} ${cy})`} />)}
      </g>
      <g transform="translate(44 -6)">
        <path d="M-20 0 L20 0 L16 -30 L-16 -30 Z" fill={WOOD_LIGHT} />
        <ellipse cx="0" cy="-34" rx="22" ry="14" fill="#d9a441" />
        <circle cx="4" cy="-44" r="5" fill={PINK} />
      </g>
      <path d="M-78 -2 C-78 -80 -40 -112 0 -112 C40 -112 78 -80 78 -2" fill="#dbe9ef" fillOpacity="0.35" stroke="#c3d3d8" strokeWidth="4" />
      <circle cx="0" cy="-118" r="8" fill="#c3d3d8" />
    </g>
  );
}

export function PendantLamp({ x, y = 0, length = 110, frame, seed = 0, cone = true }: { x: number; y?: number; length?: number; frame: number; seed?: number; cone?: boolean }) {
  const sway = Math.sin(frame / 27 + seed) * 2.2;
  return (
    <g transform={`rotate(${sway} ${x} ${y})`}>
      {cone ? <path d={`M${x - 52} ${y + length + 62} L${x + 52} ${y + length + 62} L${x + 240} ${y + length + 620} L${x - 240} ${y + length + 620} Z`} fill={SAFFRON} opacity="0.08" /> : null}
      <line x1={x} y1={y} x2={x} y2={y + length} stroke={INK} strokeWidth="5" />
      <circle cx={x} cy={y + length + 78} r="15" fill={SAFFRON} opacity="0.9" />
      <path d={`M${x - 70} ${y + length + 62} L${x - 26} ${y + length} L${x + 26} ${y + length} L${x + 70} ${y + length + 62} Z`} fill={INK} />
      <ellipse cx={x} cy={y + length + 62} rx="70" ry="11" fill={SAFFRON} />
      <ellipse cx={x} cy={y + length + 62} rx="56" ry="7" fill="#ffd97a" />
    </g>
  );
}

export function Window({ x, y, w = 300, h = 360, shaft = true, shaftDir = 1 }: { x: number; y: number; w?: number; h?: number; shaft?: boolean; shaftDir?: 1 | -1 }) {
  const id = `win-${x}-${y}`;
  const e = shaftDir === 1 ? x + w : x;
  const far = e + shaftDir * 560;
  return (
    <g>
      {shaft ? <path d={`M${e} ${y + 40} L${e} ${y + h - 40} L${far} ${y + h + 520} L${far} ${y + h + 180} Z`} fill="#fff1c4" opacity="0.32" /> : null}
      <defs><clipPath id={id}><rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} /></clipPath></defs>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={WOOD_LIGHT} />
      <rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} fill="#d9e9f1" />
      <g clipPath={`url(#${id})`}>
        <circle cx={x + w * 0.72} cy={y + h * 0.3} r="38" fill={SAFFRON} opacity="0.85" />
        <path d={`M${x + 10} ${y + h * 0.42} q 30 -22 60 0 q 30 -26 64 0 q 24 -18 48 0 v 30 h -172 Z`} fill="#fff" opacity="0.9" />
        {[[0, 0.55, 70], [60, 0.45, 56], [112, 0.6, 50], [160, 0.5, 80], [236, 0.62, 50]].map(([ox, ty, ww], i) => <rect key={i} x={x + ox} y={y + h * ty} width={ww} height={h} fill="#b7cbd8" />)}
        {[[0, 0.55, 70], [60, 0.45, 56], [160, 0.5, 80]].map(([ox, ty, ww], i) => [0, 1, 2].map((r) => <rect key={`${i}${r}`} x={x + ox + 12} y={y + h * ty + 18 + r * 34} width={ww - 24} height="14" fill="#d9e9f1" opacity="0.8" />))}
      </g>
      <rect x={x + w / 2 - 7} y={y} width="14" height={h} fill={WOOD_LIGHT} />
      <rect x={x} y={y + h / 2 - 7} width={w} height="14" fill={WOOD_LIGHT} />
      <rect x={x - 14} y={y + h - 4} width={w + 28} height="22" rx="6" fill={WOOD} />
    </g>
  );
}

export function Plant({ x, y, scale = 1, frame, seed = 0 }: { x: number; y: number; scale?: number; frame: number; seed?: number }) {
  const sway = Math.sin(frame / 22 + seed) * 2.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g transform={`rotate(${sway} 0 -40)`}>
        {[-64, -32, 0, 32, 64].map((a, i) => <ellipse key={a} cx="0" cy="-86" rx="13" ry="46" fill={i % 2 ? "#6fae7a" : "#4f8f5e"} transform={`rotate(${a} 0 -40)`} />)}
        <line x1="0" y1="-40" x2="0" y2="-110" stroke="#3e7a4b" strokeWidth="4" />
      </g>
      <path d="M-34 -40 L34 -40 L26 0 L-26 0 Z" fill="#c9704c" />
      <rect x="-40" y="-50" width="80" height="16" rx="5" fill="#d98a66" />
    </g>
  );
}

export function Badge({ frame, from, text, x, y, size = 110, color = SAFFRON }: { frame: number; from: number; text: string; x: number; y: number; size?: number; color?: string }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 8, stiffness: 220 });
  const ring = tween(frame, from, from + 26, 0, 1, EASE.out);
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={(size / 2) * (1 + ring * 1.2)} fill="none" stroke={color} strokeWidth={6 * (1 - ring)} opacity={1 - ring} />
      <g transform={`scale(${s})`}>
        <circle r={size / 2 + 6} fill={INK} />
        <circle r={size / 2} fill={color} />
        <text y={size * 0.22} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize={size * 0.62} fill={INK}>{text}</text>
      </g>
    </g>
  );
}

/** An animated voice waveform: symmetric bars that settle flat before `from`. */
export function Waveform({ x, y, frame, from = 0, width = 600, bars = 23, color = ACCENT, height = 90, seed = 3, live = true }: { x: number; y: number; frame: number; from?: number; width?: number; bars?: number; color?: string; height?: number; seed?: number; live?: boolean }) {
  const on = tween(frame, from, from + 12, 0, 1, EASE.out);
  const gap = width / bars;
  return (
    <g transform={`translate(${x - width / 2} ${y})`}>
      {Array.from({ length: bars }, (_, i) => {
        const env = Math.sin((i / (bars - 1)) * Math.PI);
        const wob = live ? 0.35 + 0.65 * Math.abs(Math.sin(frame / (5 + hash(i, seed) * 7) + i * 0.9)) : 0.12;
        const h = Math.max(6, height * env * wob * on);
        return <rect key={i} x={i * gap} y={-h / 2} width={gap * 0.46} height={h} rx={gap * 0.23} fill={color} opacity={0.35 + 0.65 * env} />;
      })}
    </g>
  );
}

/** A few birds drifting across the sky. */
export function Birds({ frame, y = 240, count = 3, seed = 5, color = INK, speed = 0.6, w = STAGE_W }: { frame: number; y?: number; count?: number; seed?: number; color?: string; speed?: number; w?: number }) {
  return (
    <g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.45">
      {Array.from({ length: count }, (_, i) => {
        const r0 = hash(i, seed), r1 = hash(i, seed + 1);
        const x = ((r0 * w + frame * speed * (0.7 + r1 * 0.6)) % (w + 240)) - 120;
        const yy = y + r1 * 150 + Math.sin(frame / 34 + i) * 10;
        const f = 10 + Math.sin(frame / 5 + i * 2) * 7;
        const s = 0.7 + r0 * 0.5;
        return <path key={i} transform={`translate(${x} ${yy}) scale(${s})`} d={`M-22 0 Q-11 ${-f} 0 0 Q11 ${-f} 22 0`} />;
      })}
    </g>
  );
}

/** A round face chip: a quick way to label a tone (direct, polite, unsure). */
export function FaceChip({ x, y, r = 54, mood = "neutral", frame, from = 0, skin = "#f1c9a5", ring = INK }: { x: number; y: number; r?: number; mood?: Mood; frame?: number; from?: number; skin?: string; ring?: string }) {
  const s = frame !== undefined ? springIn(frame, from, { damping: 9, stiffness: 180 }) : 1;
  if (s <= 0) return null;
  const eye = r * 0.17;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={r + 5} fill={ring} />
      <circle r={r} fill={skin} />
      {[-1, 1].map((k) => <circle key={k} cx={k * r * 0.34} cy={-r * 0.12} r={eye} fill={INK} />)}
      {mood === "happy" ? <path d={`M${-r * 0.42} ${r * 0.26} Q0 ${r * 0.72} ${r * 0.42} ${r * 0.26} Q0 ${r * 0.46} ${-r * 0.42} ${r * 0.26} Z`} fill={INK} />
        : mood === "surprised" ? <ellipse cy={r * 0.36} rx={r * 0.17} ry={r * 0.22} fill={INK} />
        : mood === "think" ? <path d={`M${-r * 0.34} ${r * 0.42} Q0 ${r * 0.24} ${r * 0.34} ${r * 0.44}`} fill="none" stroke={INK} strokeWidth={r * 0.1} strokeLinecap="round" />
        : <path d={`M${-r * 0.34} ${r * 0.38} L${r * 0.34} ${r * 0.38}`} fill="none" stroke={INK} strokeWidth={r * 0.1} strokeLinecap="round" />}
      {[-1, 1].map((k) => <path key={k} d={`M${k * r * 0.52} ${-r * 0.42} Q${k * r * 0.34} ${-r * (mood === "surprised" ? 0.62 : 0.52)} ${k * r * 0.16} ${-r * 0.42}`} fill="none" stroke={INK} strokeWidth={r * 0.08} strokeLinecap="round" />)}
    </g>
  );
}

// ---------------------------------------------------------------- scene helpers
export type ParallaxLayer = { depth: number; children: ReactNode };

/** Layers with a slow camera push. depth 0 = far wall (moves least), 1 = foreground. */
export function Parallax({ frame, from, to, zoom = 1.08, originX = 540, originY = 760, panX = 0, layers }: { frame: number; from: number; to: number; zoom?: number; originX?: number; originY?: number; panX?: number; layers: ParallaxLayer[] }) {
  const p = tween(frame, from, to, 0, 1, EASE.inOut);
  return (
    <AbsoluteFill>
      {layers.map((l, i) => {
        const z = 1 + (zoom - 1) * p * (0.55 + l.depth * 0.9);
        const tx = panX * p * (0.3 + l.depth);
        return <AbsoluteFill key={i} style={{ transform: `translateX(${tx}px) scale(${z})`, transformOrigin: `${originX}px ${originY}px` }}>{l.children}</AbsoluteFill>;
      })}
    </AbsoluteFill>
  );
}

export type TransitionKind = "wipe" | "slide" | "iris";

/** Covers the cut at `at`: fully opaque exactly on that frame, clear on both sides. */
export function Transition({ frame, at, duration = 26, kind = "wipe", color = SAFFRON, color2 = INK, cx = 540, cy = 720 }: { frame: number; at: number; duration?: number; kind?: TransitionKind; color?: string; color2?: string; cx?: number; cy?: number }) {
  const t = (frame - (at - duration / 2)) / duration;
  if (t <= 0 || t >= 1) return null;
  const p = EASE.inOut(t < 0.5 ? t * 2 : (t - 0.5) * 2);
  const W = STAGE_W, H = STAGE_H;
  if (kind === "iris") {
    const r = t < 0.5 ? lerp(1500, 0, p) : lerp(0, 1500, p);
    const id = `iris-${at}`;
    return (
      <Stage>
        <defs><mask id={id}><rect width={W} height={H} fill="#fff" /><circle cx={cx} cy={cy} r={r} fill="#000" /></mask></defs>
        <rect width={W} height={H} fill={color} mask={`url(#${id})`} />
        <circle cx={cx} cy={cy} r={r + 18} fill="none" stroke={color2} strokeWidth="18" />
      </Stage>
    );
  }
  if (kind === "slide") {
    const yT = t < 0.5 ? lerp(H + 200, -200, p) : -200;
    const yB = t < 0.5 ? H + 400 : lerp(H + 400, -200, p);
    const k = 140;
    return (
      <Stage>
        <path d={`M0 ${yT + k} L${W} ${yT - k} L${W} ${yB - k} L0 ${yB + k} Z`} fill={color} />
        <path d={`M0 ${yT + k + 70} L${W} ${yT - k + 70} L${W} ${yT - k + 40} L0 ${yT + k + 40} Z`} fill={color2} opacity={t < 0.5 ? 1 : 0} />
      </Stage>
    );
  }
  const xR = t < 0.5 ? lerp(-300, W + 300, p) : W + 300;
  const xL = t < 0.5 ? -300 : lerp(-300, W + 300, p);
  const k = 170;
  return (
    <Stage>
      <path d={`M${xL + k} 0 L${xR + k} 0 L${xR - k} ${H} L${xL - k} ${H} Z`} fill={color} />
      <path d={`M${xR + k - 70} 0 L${xR + k - 40} 0 L${xR - k - 40} ${H} L${xR - k - 70} ${H} Z`} fill={color2} opacity={t < 0.5 ? 1 : 0} />
    </Stage>
  );
}

/**
 * A hand-drawn marker swipe behind its parent box, wiped in over `duration`
 * frames. The stroke is a filled shape in box units, so it stays in proportion
 * at any type size. `strike` draws a thin line through the middle instead.
 */
export function Highlight({ frame, from, color = SAFFRON, thickness = 0.55, opacity = 0.5, strike = false, duration = 14, y }: { frame: number; from: number; color?: string; thickness?: number; opacity?: number; strike?: boolean; duration?: number; y?: number }) {
  const p = tween(frame, from, from + duration, 0, 1, EASE.out);
  if (p <= 0) return null;
  const mid = y ?? (strike ? 52 : 68);
  const h = strike ? 7 : Math.max(10, thickness * 62);
  const a = mid - h / 2, b = mid + h / 2;
  const d = `M1 ${a + 2} C 22 ${a - 3}, 48 ${a + 3}, 74 ${a - 1} S 95 ${a + 2}, 99 ${a} L99 ${b - 1} C 74 ${b + 3}, 46 ${b - 3}, 22 ${b + 2} S 5 ${b - 1}, 1 ${b} Z`;
  return (
    <span aria-hidden style={{ position: "absolute", left: -4, right: -4, top: 0, bottom: 0, zIndex: strike ? 1 : -1, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%" }}>
        <path d={d} fill={color} opacity={opacity} />
      </svg>
    </span>
  );
}

export type KineticTextProps = { frame: number; from: number; text: string; x: number; y: number; width?: number; size: number; color?: string; targets?: string[]; targetColor?: string; marker?: string | false; markerDelay?: number; stagger?: number; align?: "left" | "center"; weight?: number; lineHeight?: number; letterSpacing?: number; style?: CSSProperties; strike?: { from: number; color?: string } };

/** Word-by-word pop with an overshoot spring; target phrases get a colour and a marker stroke. */
export function KineticText({ frame, from, text, x, y, width = STAGE_W - 2 * x, size, color = INK, targets = [], targetColor = ACCENT, marker = false, markerDelay = 10, stagger = 5, align = "left", weight = 800, lineHeight = 1.1, letterSpacing, style, strike }: KineticTextProps) {
  const words = text.split(" ");
  const mask = targetMask(words, targets);
  return (
    <div style={{ position: "absolute", left: x, top: y, width, display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.28, rowGap: 0, fontSize: size, fontWeight: weight, lineHeight, letterSpacing, color, zIndex: 0, ...style }}>
      {words.map((w, i) => {
        const s = springIn(frame, from + i * stagger, { damping: 9, stiffness: 190 });
        const hit = mask[i];
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", color: hit ? targetColor : color, opacity: Math.min(1, s * 2.5), transform: `translateY(${(1 - s) * 40}px) scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -5}deg)`, transformOrigin: "50% 100%", zIndex: 0 }}>
            {w}
            {hit && marker ? <Highlight frame={frame} from={from + i * stagger + markerDelay} color={marker} /> : null}
          </span>
        );
      })}
      {strike ? <Highlight frame={frame} from={strike.from} color={strike.color ?? PINK} strike opacity={0.9} /> : null}
    </div>
  );
}

/** Which words belong to a target phrase (multi-word phrases match in sequence). */
export function targetMask(words: string[], targets: string[]): boolean[] {
  const mask = words.map(() => false);
  const cw = words.map(clean);
  for (const t of targets) {
    const tw = t.split(" ").map(clean);
    for (let i = 0; i + tw.length <= cw.length; i++) {
      if (tw.every((x, k) => cw[i + k] === x)) for (let k = 0; k < tw.length; k++) mask[i + k] = true;
    }
  }
  return mask;
}

/** Expanding rings around a disc (a mic ring, a tap hint). SVG, centred at (x, y). */
export function Pulse({ frame, x, y, size = 130, color = SAFFRON, period = 48, children }: { frame: number; x: number; y: number; size?: number; color?: string; period?: number; children?: ReactNode }) {
  const breathe = 1 + Math.sin(frame / 6) * 0.04;
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 1, 2].map((k) => {
        const ph = ((frame + (k * period) / 3) % period) / period;
        return <circle key={k} r={(size / 2) * (1 + ph * 1.1)} fill="none" stroke={color} strokeWidth={10 * (1 - ph)} opacity={(1 - ph) * 0.55} />;
      })}
      <g transform={`scale(${breathe})`}>
        <circle r={size / 2 + 5} fill={INK} />
        <circle r={size / 2} fill={color} />
        {children}
      </g>
    </g>
  );
}

/** Seeded confetti falling from the top. */
export function Confetti({ frame, from, count = 70, seed = 7, colors = [SAFFRON, PAPER, SEA, PINK, "#ffd166"], w = STAGE_W, h = STAGE_H }: { frame: number; from: number; count?: number; seed?: number; colors?: string[]; w?: number; h?: number }) {
  if (frame < from) return null;
  const r = rng(seed);
  const parts = [];
  for (let i = 0; i < count; i++) {
    const x0 = r() * w, delay = r() * 40, vy = 7 + r() * 7, sway = 20 + r() * 40, ph = r() * 6.3, rot = (r() - 0.5) * 14, size = 14 + r() * 16, c = colors[Math.floor(r() * colors.length)], shape = Math.floor(r() * 3);
    const f = frame - from - delay;
    if (f < 0) continue;
    const y = -40 + f * vy;
    if (y > h + 40) continue;
    const x = x0 + Math.sin(f / 14 + ph) * sway;
    const a = f * rot;
    const sx = Math.cos(f / 9 + ph);
    parts.push(
      <g key={i} transform={`translate(${x} ${y}) rotate(${a}) scale(${sx} 1)`} fill={c}>
        {shape === 0 ? <rect x={-size / 2} y={-size / 4} width={size} height={size / 2} rx="2" /> : shape === 1 ? <circle r={size / 3} /> : <path d={`M0 ${-size / 2} L${size / 2} ${size / 2} L${-size / 2} ${size / 2} Z`} />}
      </g>,
    );
  }
  return <g>{parts}</g>;
}

/** A comic speech bubble with typing and a tail pointing at the speaker. */
export function SpeechBubble({ text, targets = [], x, y, w, from, until, frame, tail = "right", tailX, size = 54, typing = true }: { text: string; targets?: string[]; x: number; y: number; w: number; from: number; until?: number; frame: number; tail?: "left" | "right"; tailX?: number; size?: number; typing?: boolean }) {
  if (frame < from) return null;
  if (until !== undefined && frame >= until + 10) return null;
  const s = springIn(frame, from, { damping: 10, stiffness: 160 }) * (until !== undefined ? 1 - tween(frame, until, until + 10, 0, 1, EASE.in) : 1);
  const typed = typing ? Math.min(text.length, Math.floor((frame - from - 3) * 1.7)) : text.length;
  const shown = text.slice(0, Math.max(0, typed));
  const words = shown.split(" ");
  const mask = targetMask(text.split(" "), targets);
  const tx = tailX ?? (tail === "right" ? w - 110 : 70);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${s}) rotate(${(1 - s) * (tail === "right" ? 4 : -4)}deg)`, transformOrigin: tail === "right" ? "90% 100%" : "10% 100%" }}>
      <div style={{ position: "absolute", inset: 0, transform: "translate(8px, 10px)", background: INK, borderRadius: 44 }} />
      <div style={{ position: "relative", background: "#fff", border: `6px solid ${INK}`, borderRadius: 44, padding: "26px 38px", fontSize: size, lineHeight: 1.2, fontWeight: 700, color: INK, minHeight: 80 }}>
        {words.map((p, i) => <span key={i} style={{ color: mask[i] ? ACCENT : INK, fontWeight: mask[i] ? 800 : 700 }}>{p}{i < words.length - 1 ? " " : ""}</span>)}
        <span style={{ opacity: typed < text.length ? (Math.floor(frame / 8) % 2 ? 1 : 0) : 0 }}>|</span>
      </div>
      <svg width="90" height="70" viewBox="0 0 90 70" style={{ position: "absolute", top: "100%", marginTop: -8, left: tx, transform: tail === "right" ? "none" : "scaleX(-1)" }}>
        <path d="M6 0 L84 0 L62 54 Z" fill={INK} />
        <path d="M20 0 L72 0 L58 36 Z" fill="#fff" />
      </svg>
    </div>
  );
}

/** Small letterspaced heading. */
export function Eyebrow({ text, x, y, color = FAINT, frame, from, size = 38, align = "left" }: { text: string; x: number; y: number; color?: string; frame?: number; from?: number; size?: number; align?: "left" | "center" }) {
  const o = frame !== undefined && from !== undefined ? tween(frame, from, from + 14, 0, 1, EASE.out) : 1;
  return <div style={{ position: "absolute", left: align === "center" ? 0 : x, right: align === "center" ? 0 : undefined, top: y, textAlign: align, fontSize: size, fontWeight: 800, letterSpacing: 6, color, opacity: o, transform: `translateY(${(1 - o) * 14}px)` }}>{text}</div>;
}

/** The caption bar every explainer keeps at the bottom (50px in from the edges). */
export function CaptionBar({ line, k, targets = [], l1 }: { line: string; k: number; targets?: string[]; l1?: string }) {
  const words = line.split(" ");
  return (
    <div style={{ position: "absolute", left: 50, right: 50, bottom: 50 }}>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, transform: "translate(6px, 8px)", background: INK, borderRadius: 30 }} />
        <div style={{ position: "relative", background: "rgba(255,255,255,0.96)", border: `4px solid ${INK}`, borderRadius: 30, padding: "20px 30px", fontSize: 44, fontWeight: 700, lineHeight: 1.25, color: INK, textAlign: "center" }}>
          {words.map((w, i) => <span key={i} style={{ color: i < k ? (wordIsTarget(w, targets) ? ACCENT : INK) : FOG, marginRight: 12, display: "inline-block", transform: i === k - 1 ? "translateY(-3px)" : "none" }}>{w}</span>)}
        </div>
      </div>
      {l1 ? (
        <div style={{ marginTop: 14, textAlign: "center" }}>
          {/* pill so the learner's own language stays legible over dark scenes too */}
          <span style={{ display: "inline-block", background: "rgba(255,255,255,0.94)", borderRadius: 20, padding: "6px 22px", fontSize: 34, fontWeight: 600, color: INK }}>{l1}</span>
        </div>
      ) : null}
    </div>
  );
}

/** Beat progress segments kept at the top (40px). */
export function BeatProgress({ frame, beats, color = ACCENT }: { frame: number; beats: { id: string; from: number; to: number }[]; color?: string }) {
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 40, display: "flex", gap: 10 }}>
      {beats.map((b) => {
        const p = frame >= b.to ? 1 : frame >= b.from ? (frame - b.from) / (b.to - b.from) : 0;
        return (
          <div key={b.id} style={{ flex: b.to - b.from, height: 10, borderRadius: 6, background: "rgba(27,29,58,0.16)", overflow: "hidden" }}>
            <div style={{ width: `${p * 100}%`, height: "100%", background: color, borderRadius: 6 }} />
          </div>
        );
      })}
    </div>
  );
}
