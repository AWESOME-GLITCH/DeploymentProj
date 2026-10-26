"use client";

// "Metro notices" (ATM-A2-RDG-0006): a word tutorial explainer built as a Remotion
// composition (1080x1440, 30 fps, 40 s, 1200 frames). Seven beats from
// docs/explainers/storyboards.md: hook, four word beats, say it with me, recap.
// One target: "No" plus ing means do not do it, and its opposite on a sign is "allowed".
//
// Re-cut on 26 Oct 2026 for the board's attention rule. The beat ids, the set and
// the single target are the storyboard's; the timings and the narration lines are
// not. Each teaching beat now holds one sayable line, ends on a designed stopping
// frame with its payoff kept back for the resume, and the asks grow from one tap
// to both rules spoken. See METRO_BEATS for the stop frames.
// Everything is a pure function of useCurrentFrame(), so the same component plays in
// the Remotion Player and renders deterministically to MP4.
//
// Built on the shared kit in ./lib. Fatima, the metro set, the escalator and the five
// metro signs are not in the kit yet, so they live here as local flat-vector parts
// drawn to the same rig and palette (lib.tsx and Cafe.tsx are owned elsewhere).

import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";
import {
  ACCENT, BeatProgress, blink, CaptionBar, Character, EASE, Eyebrow, FAINT, FOG, FONT, hash, Highlight, INK,
  karaoke, PAPER, Parallax, Pulse, SAFFRON, SEA, springIn, Stage, STAGE_H, STAGE_W, Transition, tween,
} from "./lib";

// ---------------------------------------------------------------- beats
export type Beat = {
  id: string;
  from: number;
  to: number;
  line: string;
  target?: string[];
  kind: "hook" | "word" | "practise" | "recap";
  pauseAt?: number;
};

// Cut to the board's attention rule (26 Oct 2026): the player stops at every beat
// with a target, so each teaching beat is 5 to 8 s, carries one sayable line, and
// ends on a held stopping frame with its payoff kept back for the resume. The first
// ask is the tiny one (tap the key words) and lands at frame 240, 8.0 s in. Longest
// passive stretch between two stops is 7.8 s.
//
// stop frames: 240 tap, 420 say, 594 say, 774 say, 1008 say (the two rules together).
export const METRO_BEATS: Beat[] = [
  { id: "hook", kind: "hook", from: 0, to: 96, line: "On the metro. Signs everywhere." },
  { id: "w1", kind: "word", from: 96, to: 300, line: "No eating or drinking on the train.", target: ["No eating or drinking"], pauseAt: 240 },
  { id: "w2", kind: "word", from: 300, to: 474, line: "Water is allowed.", target: ["allowed"], pauseAt: 420 },
  { id: "w3", kind: "word", from: 474, to: 648, line: "Stand on the right.", target: ["Stand on the right"], pauseAt: 594 },
  { id: "w4", kind: "word", from: 648, to: 828, line: "This is a priority seat.", target: ["priority seat"], pauseAt: 774 },
  { id: "practise", kind: "practise", from: 828, to: 1062, line: "Say it with me. No eating or drinking. Water is allowed.", target: ["No eating or drinking", "allowed"], pauseAt: 1008 },
  { id: "recap", kind: "recap", from: 1062, to: 1200, line: "No plus ing means do not. You can read the signs now.", target: ["No", "ing"] },
];
export const METRO_DURATION = 1200;

/** How much of the frame survives a stop. Measured from the player's own markup
 *  against app/learning-path/lp.css at 375px: the tap panel is 190.8 CSS px over
 *  a 500px video and the say panel, which carries the mic, is 280.4. So a say
 *  stop leaves only the top 633 px of 1440. Nothing the learner needs in order to
 *  answer may sit below these lines on a stop frame. */
export const STOP_SAFE_Y = 633;
export const STOP_SAFE_Y_TAP = 891;

export function metroBeatAt(frame: number): Beat {
  return METRO_BEATS.find((b) => frame >= b.from && frame < b.to) ?? METRO_BEATS[METRO_BEATS.length - 1];
}

// Per-beat caption line in the learner's own language. English stays on screen above it.
export const METRO_L1: Record<string, Record<string, string>> = {
  ar: {
    hook: "في المترو. لافتات في كل مكان.",
    w1: "ممنوع الأكل أو الشرب في القطار.",
    w2: "الماء مسموح.",
    w3: "قف على اليمين.",
    w4: "هذا مقعد أولوية.",
    practise: "قلها معي.",
    recap: "No مع ing تعني لا تفعل. يمكنك الآن قراءة اللافتات.",
  },
  es: {
    hook: "En el metro. Carteles por todas partes.",
    w1: "No se puede comer ni beber en el tren.",
    w2: "El agua está permitida.",
    w3: "De pie a la derecha.",
    w4: "Este es un asiento prioritario.",
    practise: "Dilo conmigo.",
    recap: "No más ing: no lo hagas. Ya puedes leer los carteles.",
  },
  hi: {
    hook: "मेट्रो में। हर जगह संकेत।",
    w1: "ट्रेन में खाना-पीना मना है।",
    w2: "पानी की अनुमति है।",
    w3: "दाईं ओर खड़े हों।",
    w4: "यह प्राथमिकता सीट है।",
    practise: "मेरे साथ बोलो।",
    recap: "No के साथ ing: मत करो। अब आप संकेत पढ़ सकते हैं।",
  },
  ru: {
    hook: "В метро. Везде знаки.",
    w1: "В поезде нельзя есть и пить.",
    w2: "Воду пить можно.",
    w3: "Стойте справа.",
    w4: "Это приоритетное место.",
    practise: "Скажи со мной.",
    recap: "No плюс ing: нельзя. Теперь вы читаете знаки.",
  },
  tr: {
    hook: "Metroda. Her yerde tabela.",
    w1: "Trende yiyip içmek yasak.",
    w2: "Su içmek serbest.",
    w3: "Sağda dur.",
    w4: "Bu öncelikli bir koltuk.",
    practise: "Benimle söyle.",
    recap: "No artı ing: yapma. Artık tabelaları okuyabilirsin.",
  },
  zh: {
    hook: "在地铁里。到处是标志。",
    w1: "列车内禁止饮食。",
    w2: "可以喝水。",
    w3: "右侧站立。",
    w4: "这是优先座位。",
    practise: "跟我一起说。",
    recap: "No 加 ing 表示禁止。现在你能读懂标志了。",
  },
};

// ---------------------------------------------------------------- local palette
const WALL = "#e9e5de";
const WALL_DARK = "#d6cfc4";
const SEAT = "#9aa0b4";
const SEAT_DARK = "#7b8296";
const GOLD = "#d9a21f";
const SKY = "#cfe3ef";
const SKYLINE = "#9db6c7";
const FLOOR = "#cfc8bd";
const GREY_FIG = "#9b9eb0";
const PALE = "#dbe9f3";
const BAG = "#b0896a";
const SCARF = "#1fb48a";
const SCARF_DARK = "#17997a";
const ABAYA = "#9a938c";
const ABAYA_DARK = "#857e78";
const F_SKIN = "#c98f62";

// Carriage geometry, shared by every carriage beat.
const RAIL_Y = 330;
const WIN_T = 380;
const WIN_H = 260;
const SEAT_T = 880;
const FLOOR_T = 1000;
const SCENE_B = 1230;

// The kit's character rig, mirrored here so a held prop can be placed in the hand.
const SHOULDER = { x: 46, y: -300 };
const UPPER = 78;
const FORE = 72;
const HAND_POSE: Record<"cup" | "raise" | "point", { s: number; e: number }> = {
  cup: { s: 52, e: 72 },
  raise: { s: 118, e: 62 },
  point: { s: 78, e: 4 },
};

/** Screen position of a kit character's leading hand, for props they hold. */
function handAt(x: number, y: number, scale: number, facing: 1 | -1, pose: "cup" | "raise" | "point") {
  const p = HAND_POSE[pose];
  const d = (deg: number) => ({ x: Math.sin((deg * Math.PI) / 180), y: Math.cos((deg * Math.PI) / 180) });
  const el = { x: SHOULDER.x + UPPER * d(p.s).x, y: SHOULDER.y + UPPER * d(p.s).y };
  const hd = { x: el.x + FORE * d(p.s + p.e).x, y: el.y + FORE * d(p.s + p.e).y };
  return { x: x + hd.x * scale * facing, y: y + hd.y * scale };
}

// ---------------------------------------------------------------- fatima
type FatimaProps = {
  x: number;
  y: number;
  frame: number;
  scale?: number;
  facing?: 1 | -1;
  enter?: number;
  slideFrom?: number;
  talking?: boolean;
  sit?: boolean;
  walking?: boolean;
  arm?: "idle" | "wave" | "rail" | "point";
  armAt?: number;
  nodAt?: number;
  smile?: boolean;
  seed?: number;
};

/**
 * Fatima: Dubai shop owner, leaf-green headscarf, warm grey abaya, round glasses.
 * Same proportions as the kit's `Character` (origin at the feet, head at -400,
 * shoulders at -300) so she can stand or sit beside `you` at the same scale.
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
  const armA = p.arm && p.arm !== "idle" ? springIn(frame, p.armAt ?? enter, { damping: 11, stiffness: 110 }) : 0;
  const idle = { s: 7 + br * 1.5, e: 10 };
  const target = p.arm === "wave"
    ? { s: 150, e: 40 + Math.sin(frame / 2.6) * 28 }
    : p.arm === "rail"
      ? { s: 104, e: 16 }
      : p.arm === "point"
        ? { s: 78, e: 6 }
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
          {p.sit ? (
            <g>
              <path d="M-58 -296 Q-58 -324 -32 -324 L32 -324 Q58 -324 58 -296 L68 -150 L-68 -150 Z" fill={ABAYA} />
              <path d="M-68 -168 L68 -168 L68 -150 L-68 -150 Z" fill={ABAYA_DARK} />
            </g>
          ) : (
            <g>
              <path d="M-60 -296 Q-60 -324 -32 -324 L32 -324 Q60 -324 60 -296 L80 -18 L-80 -18 Z" fill={ABAYA} />
              <path d="M-80 -40 Q0 -24 80 -40 L80 -18 L-80 -18 Z" fill={ABAYA_DARK} />
              {[-26, 26].map((k, i) => (
                <ellipse key={k} cx={k + (p.walking ? Math.sin(walkT + i * Math.PI) * 14 : 0)} cy="-4" rx="24" ry="10" fill={INK} />
              ))}
            </g>
          )}
          <path d="M-6 -306 L6 -306 L4 -180 L-4 -180 Z" fill={ABAYA_DARK} opacity="0.5" />
          {/* scarf drape over the shoulders */}
          <path d="M-54 -332 L54 -332 L64 -246 Q0 -226 -64 -246 Z" fill={SCARF} />
          <path d="M-64 -246 Q0 -226 64 -246 L62 -232 Q0 -212 -62 -232 Z" fill={SCARF_DARK} />
        </g>
        {/* head */}
        <g transform={`translate(0 -400) rotate(${nod})`}>
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

// ---------------------------------------------------------------- background passenger
/** A grey silhouette passenger. No face, never speaks. */
function Silhouette({ x, y, frame, scale = 1, facing = 1, sit = false, stick = true, enter = 0, slideFrom = 0 }: { x: number; y: number; frame: number; scale?: number; facing?: 1 | -1; sit?: boolean; stick?: boolean; enter?: number; slideFrom?: number }) {
  if (frame < enter) return null;
  const s = springIn(frame, enter, { damping: 12, stiffness: 150 });
  const slide = slideFrom * (1 - tween(frame, enter, enter + 26, 0, 1, EASE.out));
  const walking = !sit && frame < enter + 44;
  const walkT = frame / 4.5;
  const bob = walking ? Math.abs(Math.sin(walkT)) * 6 : Math.sin(frame / 18) * 1.4;
  return (
    <g transform={`translate(${x + slide * facing} ${y}) scale(${scale * facing} ${scale * s})`}>
      <ellipse cx="0" cy="2" rx="66" ry="11" fill={INK} opacity="0.12" />
      <g transform={`translate(0 ${-bob})`} fill={GREY_FIG}>
        <rect x="-74" y="-300" width="20" height="132" rx="10" />
        <rect x="54" y="-300" width="20" height="132" rx="10" />
        {sit ? (
          <path d="M-62 -292 Q-62 -324 -30 -324 L30 -324 Q62 -324 62 -292 L66 -150 L-66 -150 Z" />
        ) : (
          <g>
            <path d="M-62 -292 Q-62 -324 -30 -324 L30 -324 Q62 -324 62 -292 L46 -150 L-46 -150 Z" />
            {[-18, 18].map((k, i) => (
              <g key={k} transform={`rotate(${walking ? Math.sin(walkT + i * Math.PI) * 16 : 0} ${k} -150)`}>
                <rect x={k - 15} y="-156" width="30" height="156" rx="13" />
                <ellipse cx={k + 6} cy="0" rx="24" ry="9" />
              </g>
            ))}
          </g>
        )}
        <rect x="-13" y="-366" width="26" height="54" />
        <circle cx="0" cy="-398" r="44" />
      </g>
      {stick ? (
        <g transform={`translate(0 ${-bob})`}>
          <path d="M64 -192 Q86 -196 86 -166 L92 -6" fill="none" stroke="#6f7384" strokeWidth="10" strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  );
}

// ---------------------------------------------------------------- metro set
const SKY_SHAPES: [number, number, number][] = [
  [10, 120, 70], [90, 186, 46], [146, 96, 60], [214, 150, 54], [276, 76, 84],
  [368, 206, 38], [414, 112, 66], [488, 164, 50], [546, 90, 44],
];

/** A window pane of passing skyline. Deterministic scroll, loops every 600px. */
function SkylineBand({ frame, w, h, id, speed = 1.7 }: { frame: number; w: number; h: number; id: string; speed?: number }) {
  const off = -((frame * speed) % 600);
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={w} height={h} rx="26" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x="0" y="0" width={w} height={h} fill={SKY} />
        <circle cx={w * 0.74} cy={h * 0.3} r="26" fill="#f6e7c6" opacity="0.9" />
        {[0, 1].map((k) => (
          <g key={k} transform={`translate(${off + k * 600} 0)`}>
            {SKY_SHAPES.map(([bx, bh, bw], i) => (
              <rect key={i} x={bx} y={h - 34 - bh} width={bw} height={bh} rx="4" fill={SKYLINE} opacity={0.9} />
            ))}
            <path d={`M310 ${h - 34} L330 ${h - 250} L350 ${h - 34} Z`} fill={SKYLINE} opacity="0.9" />
          </g>
        ))}
        <rect x="0" y={h - 34} width={w} height="34" fill="#8aa3b4" />
      </g>
      <rect x="0" y="0" width={w} height={h} rx="26" fill="none" stroke={WALL_DARK} strokeWidth="12" />
    </g>
  );
}

/** Carriage interior: upper wall, gold rail with hand loops, windows, bench, floor. */
function Carriage({ frame, doors = false, doorOpen = 1, keyId }: { frame: number; doors?: boolean; doorOpen?: number; keyId: string }) {
  const wins: [number, number][] = doors ? [[40, 280], [760, 280]] : [[50, 300], [390, 300], [730, 300]];
  return (
    <g>
      <rect x="0" y="0" width={STAGE_W} height={SCENE_B} fill={WALL} />
      <rect x="0" y={SCENE_B - 240} width={STAGE_W} height="20" fill={WALL_DARK} opacity="0.5" />
      {/* windows */}
      {wins.map(([wx, ww], i) => (
        <g key={wx} transform={`translate(${wx} ${WIN_T})`}>
          <SkylineBand frame={frame} w={ww} h={WIN_H} id={`${keyId}-win-${i}`} />
        </g>
      ))}
      {/* gold rail with hand loops, in front of the glass */}
      <rect x="0" y={RAIL_Y} width={STAGE_W} height="16" rx="8" fill={SAFFRON} />
      <rect x="0" y={RAIL_Y + 10} width={STAGE_W} height="6" rx="3" fill={GOLD} />
      {[180, 460, 740, 1000].map((lx) => (
        <g key={lx}>
          <path d={`M${lx} ${RAIL_Y + 14} L${lx} ${RAIL_Y + 66}`} stroke={GOLD} strokeWidth="9" strokeLinecap="round" />
          <ellipse cx={lx} cy={RAIL_Y + 92} rx="24" ry="30" fill="none" stroke={GOLD} strokeWidth="11" />
        </g>
      ))}
      {/* doors */}
      {doors ? (
        <g>
          <rect x="340" y={WIN_T - 70} width="400" height={FLOOR_T - WIN_T + 70} rx="10" fill="#b9b2a6" />
          <rect x="356" y={WIN_T - 54} width="368" height={FLOOR_T - WIN_T + 38} rx="8" fill="#9aa3ab" />
          {/* platform behind */}
          <rect x="380" y={WIN_T - 30} width="320" height="320" fill="#ccd6dd" />
          <rect x="556" y={WIN_T - 30} width="52" height="260" fill="#bbc6ce" />
          <rect x="404" y={WIN_T + 40} width="120" height="54" rx="10" fill="#aebac3" />
          <rect x="380" y={WIN_T + 230} width="320" height="24" fill={SAFFRON} />
          <rect x="380" y={WIN_T + 254} width="320" height={FLOOR_T - WIN_T - 254 + 36} fill="#b5bcc4" />
          <rect x="380" y={FLOOR_T - 26} width="320" height="22" fill={INK} opacity="0.3" />
          {[0, 1].map((k) => {
            const slid = 200 * doorOpen;
            return (
              <g key={k} transform={`translate(${k === 0 ? -slid : slid} 0)`}>
                <rect x={k === 0 ? 340 : 540} y={WIN_T - 70} width="200" height={FLOOR_T - WIN_T + 70} rx="8" fill="#e3ded5" stroke={WALL_DARK} strokeWidth="8" />
                <rect x={k === 0 ? 372 : 572} y={WIN_T - 40} width="136" height="190" rx="18" fill={SKY} stroke={WALL_DARK} strokeWidth="8" />
                <rect x={k === 0 ? 510 : 554} y={WIN_T + 240} width="18" height="70" rx="9" fill={GOLD} />
              </g>
            );
          })}
        </g>
      ) : null}
      {/* bench */}
      <rect x="40" y={SEAT_T + 50} width="1000" height="70" rx="12" fill={SEAT_DARK} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={48 + i * 198} y={SEAT_T} width="186" height="62" rx="18" fill={SEAT} />
          <rect x={48 + i * 198} y={SEAT_T} width="186" height="62" rx="18" fill="none" stroke={INK} strokeWidth="3" opacity="0.2" />
        </g>
      ))}
      <CarriageFloor />
    </g>
  );
}

/** The floor, drawn again over seated characters so their feet shadows stay hidden. */
function CarriageFloor() {
  return (
    <g>
      <rect x="0" y={FLOOR_T + 20} width={STAGE_W} height={SCENE_B - FLOOR_T - 20} fill={FLOOR} />
      <rect x="0" y={FLOOR_T + 20} width={STAGE_W} height="10" fill={WALL_DARK} />
      <rect x="0" y={SCENE_B - 70} width={STAGE_W} height="12" fill={SAFFRON} opacity="0.5" />
    </g>
  );
}

// ---------------------------------------------------------------- signs
/** The expanding ring a sign gets when it is the one being talked about. */
function Glow({ frame, from, x, y, r, color = ACCENT }: { frame: number; from: number; x: number; y: number; r: number; color?: string }) {
  if (frame < from) return null;
  const t = tween(frame, from, from + 34, 0, 1, EASE.out);
  const hold = frame < from + 90 ? 0.55 + Math.sin((frame - from) / 5) * 0.2 : 0;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r * (1 + t * 0.9)} fill="none" stroke={color} strokeWidth={10 * (1 - t)} opacity={1 - t} />
      <circle r={r + 12} fill="none" stroke={color} strokeWidth="8" opacity={hold} />
    </g>
  );
}

function SignPlate({ children, k = 1, x, y, frame, from, w = 150, h = 150 }: { children: React.ReactNode; k?: number; x: number; y: number; frame: number; from: number; w?: number; h?: number }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 9, stiffness: 190 });
  return (
    <g transform={`translate(${x} ${y}) scale(${k * s})`}>
      <rect x={-w / 2 + 6} y={-h / 2 + 8} width={w} height={h} rx="22" fill={INK} opacity="0.2" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="22" fill="#fff" stroke={INK} strokeWidth="6" />
      {children}
    </g>
  );
}

/** No eating or drinking: a circle with a bar over a sandwich and a cup. No red. */
function NoFoodSign({ x, y, frame, from = 0, k = 1 }: { x: number; y: number; frame: number; from?: number; k?: number }) {
  return (
    <SignPlate x={x} y={y} frame={frame} from={from} k={k}>
      <g transform="translate(0 -4)">
        <path d="M-44 14 L-14 -34 L16 14 Z" fill={SAFFRON} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M-32 14 L-14 -14 L2 14 Z" fill="#e3a06f" />
        <path d="M18 -26 L52 -26 L47 18 Q34 26 23 18 Z" fill={PAPER} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M21 -14 L49 -14" stroke="#8c7a63" strokeWidth="5" />
      </g>
      <circle r="58" fill="none" stroke={INK} strokeWidth="9" />
      <line x1="-42" y1="42" x2="42" y2="-42" stroke={INK} strokeWidth="9" strokeLinecap="round" />
    </SignPlate>
  );
}

/** Allowed: a leaf tick. */
function TickSign({ x, y, frame, from = 0, k = 1, label }: { x: number; y: number; frame: number; from?: number; k?: number; label?: string }) {
  const draw = tween(frame, from + 6, from + 26, 0, 1, EASE.out);
  const beat = frame > from + 26 ? 1 + Math.sin((frame - from) / 6) * 0.04 : 1;
  return (
    <SignPlate x={x} y={y} frame={frame} from={from} k={k}>
      <g transform={`scale(${beat})`}>
        <circle r="54" fill={SEA} opacity="0.16" />
        <path
          d="M-34 2 L-10 28 L36 -26"
          fill="none"
          stroke={SEA}
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset={100 * (1 - draw)}
        />
      </g>
      {label ? (
        <text y="60" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="26" fill={INK}>{label}</text>
      ) : null}
    </SignPlate>
  );
}

/** A small leaf tick that pops on the corner of a sign. */
function TickBadge({ x, y, frame, from, k = 1 }: { x: number; y: number; frame: number; from: number; k?: number }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 8, stiffness: 220 });
  const ring = tween(frame, from, from + 24, 0, 1, EASE.out);
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <circle r={30 * (1 + ring * 1.3)} fill="none" stroke={SEA} strokeWidth={6 * (1 - ring)} opacity={1 - ring} />
      <g transform={`scale(${s})`}>
        <circle r="32" fill={INK} />
        <circle r="27" fill={SEA} />
        <path d="M-12 1 L-4 10 L13 -9" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** Stand on the right, walk on the left. */
function EscalatorSign({ x, y, frame, from = 0, k = 1 }: { x: number; y: number; frame: number; from?: number; k?: number }) {
  const step = Math.floor(frame / 9) % 2;
  return (
    <SignPlate x={x} y={y} frame={frame} from={from} k={k} w={230} h={170}>
      <line x1="0" y1="-66" x2="0" y2="56" stroke={FOG} strokeWidth="4" />
      {/* left: walk */}
      <g transform="translate(-58 -2)">
        <path d="M0 -50 L0 -58" stroke={ACCENT} strokeWidth="0" />
        <circle cx="0" cy="-44" r="11" fill={ACCENT} />
        <path d="M0 -32 L0 -4" stroke={ACCENT} strokeWidth="11" strokeLinecap="round" />
        <path d={step ? "M0 -4 L-13 20 M0 -4 L14 18" : "M0 -4 L-6 22 M0 -4 L10 22"} stroke={ACCENT} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M-18 -26 L-30 -12" stroke={ACCENT} strokeWidth="9" strokeLinecap="round" />
        <path d="M-30 40 L-30 32 M-36 34 L-30 26 L-24 34" stroke={ACCENT} strokeWidth="7" strokeLinecap="round" fill="none" />
        <text y="62" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="26" fill={INK}>walk</text>
      </g>
      {/* right: stand */}
      <g transform="translate(58 -2)">
        <circle cx="0" cy="-44" r="11" fill={INK} />
        <path d="M0 -32 L0 -4" stroke={INK} strokeWidth="11" strokeLinecap="round" />
        <path d="M0 -4 L-9 22 M0 -4 L9 22" stroke={INK} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M14 -26 L26 -16" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <rect x="-34" y="26" width="18" height="14" rx="4" fill={INK} opacity="0.25" />
        <text y="62" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="26" fill={INK}>stand</text>
      </g>
    </SignPlate>
  );
}

/** Priority seat. */
function SeatSign({ x, y, frame, from = 0, k = 1 }: { x: number; y: number; frame: number; from?: number; k?: number }) {
  return (
    <SignPlate x={x} y={y} frame={frame} from={from} k={k}>
      <g transform="translate(-4 -6)">
        <path d="M-42 -34 L-42 30 L30 30" fill="none" stroke={ACCENT} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="4" cy="-38" r="13" fill={ACCENT} />
        <path d="M4 -24 L4 2 L30 2" fill="none" stroke={ACCENT} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 -20 L34 -4 L34 30" fill="none" stroke={ACCENT} strokeWidth="8" strokeLinecap="round" />
      </g>
      <text y="60" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="24" fill={INK}>priority</text>
    </SignPlate>
  );
}

/** Mind the gap: the bonus sign in the recap. */
function GapSign({ x, y, frame, from = 0, k = 1 }: { x: number; y: number; frame: number; from?: number; k?: number }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 9, stiffness: 170 });
  const slid = (1 - s) * 220;
  return (
    <g transform={`translate(${x + slid} ${y}) scale(${k})`}>
      <rect x="-69" y="-67" width="150" height="150" rx="22" fill={INK} opacity="0.2" />
      <rect x="-75" y="-75" width="150" height="150" rx="22" fill={SAFFRON} stroke={INK} strokeWidth="6" />
      <path d="M-46 36 L46 36" stroke={INK} strokeWidth="10" strokeLinecap="round" strokeDasharray="16 12" />
      <text y="-20" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="28" fill={INK}>MIND</text>
      <text y="12" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="28" fill={INK}>THE GAP</text>
    </g>
  );
}

// ---------------------------------------------------------------- small props
function Tote({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M-46 -50 Q-46 -92 0 -92 Q46 -92 46 -50" fill="none" stroke={BAG} strokeWidth="12" strokeLinecap="round" />
      <path d="M-54 -54 L54 -54 L46 36 L-46 36 Z" fill={BAG} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-54 -54 L54 -54 L52 -32 L-52 -32 Z" fill="#c69b7b" />
    </g>
  );
}

function Sandwich({ x, y, k = 1, rot = 0, dim = 0 }: { x: number; y: number; k?: number; rot?: number; dim?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} opacity={1 - dim * 0.55}>
      <path d="M-48 26 L0 -44 L48 26 Z" fill={SAFFRON} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <path d="M-30 26 L0 -14 L28 26 Z" fill="#e3a06f" />
      <path d="M-40 10 Q0 2 40 10" fill="none" stroke={SEA} strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

function Bottle({ x, y, k = 1, rot = 0 }: { x: number; y: number; k?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
      <rect x="-11" y="-78" width="22" height="20" rx="5" fill={ACCENT} />
      <path d="M-13 -58 Q-26 -48 -26 -22 L-26 44 Q-26 56 -14 56 L14 56 Q26 56 26 44 L26 -22 Q26 -48 13 -58 Z" fill="#dfeef5" stroke={INK} strokeWidth="5" />
      <path d="M-18 -8 Q0 -2 18 -8 L18 40 Q0 46 -18 40 Z" fill="#8ec8dd" />
      <rect x="-20" y="2" width="40" height="18" rx="4" fill="#fff" opacity="0.75" />
    </g>
  );
}

/** Three small puffs: the gentle sigh when the sandwich goes back in the bag. */
function Sigh({ x, y, frame, from }: { x: number; y: number; frame: number; from: number }) {
  if (frame < from || frame > from + 46) return null;
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 1, 2].map((i) => {
        const t = tween(frame, from + i * 7, from + i * 7 + 32, 0, 1, EASE.out);
        if (t <= 0) return null;
        return <circle key={i} cx={10 + i * 24 + t * 20} cy={-t * 54} r={7 + i * 3} fill={FAINT} opacity={(1 - t) * 0.6} />;
      })}
    </g>
  );
}

// ---------------------------------------------------------------- escalator
const ESC_A = { x: 90, y: 1150 };
const ESC_B = { x: 1000, y: 530 };
const ESC_D = { x: ESC_B.x - ESC_A.x, y: ESC_B.y - ESC_A.y };
const ESC_LEN = Math.sqrt(ESC_D.x * ESC_D.x + ESC_D.y * ESC_D.y);
const ESC_U = { x: ESC_D.x / ESC_LEN, y: ESC_D.y / ESC_LEN };
const ESC_N = { x: -ESC_U.y, y: ESC_U.x }; // points down-right, into the truss

function escPoint(t: number, lift = 0) {
  return {
    x: ESC_A.x + ESC_U.x * t * ESC_LEN + ESC_N.x * lift,
    y: ESC_A.y + ESC_U.y * t * ESC_LEN + ESC_N.y * lift,
  };
}

const escBand = (a: number, b: number) =>
  `M${escPoint(0, a).x} ${escPoint(0, a).y} L${escPoint(1, a).x} ${escPoint(1, a).y} L${escPoint(1, b).x} ${escPoint(1, b).y} L${escPoint(0, b).x} ${escPoint(0, b).y} Z`;

// A step is a horizontal tread and a vertical riser, so the flight reads as stairs.
const STEP_RUN = 62;
const STEP_RISE = (STEP_RUN * -ESC_U.y) / ESC_U.x;
const STEP_PITCH = Math.sqrt(STEP_RUN * STEP_RUN + STEP_RISE * STEP_RISE);

/** The treads and the truss, behind the riders. */
function EscalatorBack({ frame }: { frame: number }) {
  const off = (frame * 2.2) % STEP_PITCH;
  const steps = [];
  for (let i = -1; i < Math.ceil(ESC_LEN / STEP_PITCH) + 1; i++) {
    const d = off + i * STEP_PITCH;
    if (d < -STEP_PITCH || d > ESC_LEN + STEP_PITCH) continue;
    const p = escPoint(d / ESC_LEN, 0);
    steps.push(
      <g key={i}>
        <rect x={p.x - STEP_RUN / 2} y={p.y} width={STEP_RUN} height="13" fill={SEAT} stroke={INK} strokeWidth="3" />
        <rect x={p.x + STEP_RUN / 2 - 13} y={p.y - STEP_RISE} width="13" height={STEP_RISE + 4} fill={SEAT_DARK} stroke={INK} strokeWidth="3" />
      </g>,
    );
  }
  return (
    <g>
      <path d={escBand(10, 180)} fill={SEAT_DARK} />
      <path d={escBand(90, 180)} fill={INK} opacity="0.2" />
      {steps}
    </g>
  );
}

/** The glass balustrade and the handrail, drawn in front of the riders. */
function EscalatorFront() {
  return (
    <g>
      {/* the glass has to read, or the handrail looks like a bar floating over the riders */}
      <path d={escBand(0, -134)} fill={PALE} opacity="0.32" />
      <path d={escBand(-126, -134)} fill={FOG} opacity="0.7" />
      <path
        d={`M${escPoint(0, -146).x} ${escPoint(0, -146).y} L${escPoint(1, -146).x} ${escPoint(1, -146).y}`}
        stroke={INK}
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d={`M${escPoint(0, -154).x} ${escPoint(0, -154).y} L${escPoint(1, -154).x} ${escPoint(1, -154).y}`}
        stroke="#474b73"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </g>
  );
}

// ---------------------------------------------------------------- word card
type Piece = { t: string; a?: boolean };

function Pieces({ parts, size, color = INK }: { parts: Piece[]; size: number; color?: string }) {
  return (
    <>
      {parts.map((p, i) => (
        <span key={i} style={{ color: p.a ? ACCENT : color, fontSize: size }}>{p.t}</span>
      ))}
    </>
  );
}

/** The word card every word beat keeps at the top. */
function WordCard({ frame, from, parts, size = 76, tick = false }: { frame: number; from: number; parts: Piece[]; size?: number; tick?: boolean }) {
  const s = springIn(frame, from, { damping: 10, stiffness: 150 });
  if (frame < from) return null;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 108, transform: `scale(${s}) translateY(${(1 - s) * -24}px)`, transformOrigin: "50% 0%" }}>
      <div style={{ position: "absolute", inset: 0, transform: "translate(8px, 10px)", background: INK, borderRadius: 40 }} />
      <div style={{ position: "relative", background: "#fff", border: `6px solid ${INK}`, borderRadius: 40, padding: "22px 30px", display: "flex", alignItems: "center", justifyContent: "center", gap: 20, fontWeight: 800, lineHeight: 1.1, whiteSpace: "nowrap" }}>
        <span>
          <Pieces parts={parts} size={size} />
        </span>
        {tick ? (
          <svg width="74" height="62" viewBox="0 0 74 62" aria-hidden>
            <path d="M8 32 L28 52 L66 10" fill="none" stroke={SEA} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </div>
    </div>
  );
}

/** The one rule of this atom, as a strip under the word card. */
function RuleStrip({ frame, from, y = 290 }: { frame: number; from: number; y?: number }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 11, stiffness: 160 });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", opacity: Math.min(1, s * 2) }}>
      <div style={{ background: "rgba(255,255,255,0.95)", border: `4px solid ${INK}`, borderRadius: 26, padding: "10px 28px", fontSize: 44, fontWeight: 800, color: INK, transform: `scale(${s})` }}>
        <span style={{ color: ACCENT }}>No</span>
        <span style={{ color: FAINT }}> + </span>
        <span style={{ color: ACCENT }}>ing</span>
        <span style={{ color: FAINT }}> = </span>
        <span>do not</span>
      </div>
    </div>
  );
}

/** A question held on the stopping frame, in the slot the answer will take.
 *  Generation effect: the learner commits before the scene resolves, so the
 *  question must be fully opaque for a few frames either side of the stop. */
function QuestionPill({ frame, from, out, text, y = 290 }: { frame: number; from: number; out: number; text: string; y?: number }) {
  const s = Math.min(1, springIn(frame, from, { damping: 11, stiffness: 160 }));
  const o = tween(frame, from, from + 10, 0, 1, EASE.out) * (1 - tween(frame, out, out + 8, 0, 1, EASE.inOut));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ background: "rgba(255,255,255,0.95)", border: `4px solid ${INK}`, borderRadius: 26, padding: "10px 28px", fontSize: 44, fontWeight: 800, color: INK, transform: `scale(${s})` }}>
        {text}
        <span style={{ color: SEA, marginLeft: 4 }}>?</span>
      </div>
    </div>
  );
}

/** Soft 10-frame fade over a beat change inside the same set. */
function Fade({ frame, at, duration = 10, color = PAPER }: { frame: number; at: number; duration?: number; color?: string }) {
  const t = (frame - (at - duration / 2)) / duration;
  if (t <= 0 || t >= 1) return null;
  return <AbsoluteFill style={{ background: color, opacity: 1 - Math.abs(t - 0.5) * 2 }} />;
}

// ---------------------------------------------------------------- hook: doors and signs
function HookScene({ frame }: { frame: number }) {
  // 3.2 s, and the push-in finishes on the cut: the hook teaches nothing, so it
  // only has to get the learner to the first ask, which is 8 s in.
  const open = tween(frame, 6, 32, 0, 1, EASE.inOut);
  const walkX = tween(frame, 20, 52, 560, 440, EASE.inOut);
  const looking = frame >= 54;
  return (
    <AbsoluteFill style={{ background: WALL }}>
      <Parallax frame={frame} from={50} to={96} zoom={1.2} originX={250} originY={240} layers={[
        {
          depth: 0,
          children: (
            <Stage>
              <Carriage frame={frame} doors doorOpen={open} keyId="hook" />
            </Stage>
          ),
        },
        {
          depth: 0.5,
          children: (
            <Stage>
              {/* the four notices, popping in order */}
              <NoFoodSign x={250} y={210} frame={frame} from={40} k={0.78} />
              <TickSign x={450} y={210} frame={frame} from={48} k={0.78} />
              <EscalatorSign x={660} y={210} frame={frame} from={56} k={0.62} />
              <SeatSign x={860} y={210} frame={frame} from={64} k={0.78} />
            </Stage>
          ),
        },
        {
          depth: 0.9,
          children: (
            <Stage>
              <Character
                who="you"
                x={walkX}
                y={1040}
                scale={1.1}
                facing={1}
                frame={frame}
                enter={16}
                walking={frame < 52}
                mood={looking ? "surprised" : "neutral"}
                gesture={looking ? "think" : "idle"}
                gestureAt={56}
              />
              <Tote x={walkX + 120} y={880} k={0.78} />
            </Stage>
          ),
        },
      ]} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- w1: no eating or drinking
// The tiny first ask. Stop at 240 (8.0 s) with the sandwich still out and the
// question held; the answer, the rule strip and putting it back, is the resume.
const W1 = 96;

function W1Scene({ frame }: { frame: number }) {
  const youX = 300;
  const youY = 1040;
  const youK = 1.2;
  const hand = handAt(youX, youY, youK, 1, "cup");
  const bag = { x: 500, y: 876 };
  const out = tween(frame, W1 + 34, W1 + 62, 0, 1, EASE.out);
  const back = tween(frame, W1 + 156, W1 + 182, 0, 1, EASE.inOut);
  const held = out * (1 - back);
  const sx = bag.x + (hand.x - bag.x) * held;
  const sy = bag.y - 40 + (hand.y - (bag.y - 40)) * held;
  const looksAtSign = frame >= W1 + 74 && frame < W1 + 112;
  return (
    <AbsoluteFill style={{ background: WALL }}>
      <Stage>
        <Carriage frame={frame} keyId="w1" />
        <NoFoodSign x={830} y={716} frame={frame} from={W1 + 10} k={1.02} />
        <Glow frame={frame} from={W1 + 70} x={830} y={716} r={84} />
        <Character
          who="you"
          x={youX}
          y={youY}
          scale={youK}
          facing={1}
          frame={frame}
          enter={W1 + 6}
          legs={false}
          mood={looksAtSign ? "surprised" : frame >= W1 + 112 ? "think" : "neutral"}
          gesture={frame >= W1 + 34 && frame < W1 + 180 ? "cup" : "idle"}
          gestureAt={W1 + 34}
        />
        <CarriageFloor />
        <Tote x={bag.x} y={bag.y} k={0.72} />
        {held > 0.02 ? <Sandwich x={sx} y={sy} k={0.62 + 0.1 * held} rot={-8 + held * 8} dim={looksAtSign ? 0.4 : 0} /> : null}
        <Sigh x={youX + 70} y={youY - 520} frame={frame} from={W1 + 164} />
      </Stage>
      <WordCard frame={frame} from={W1 + 4} parts={[{ t: "No", a: true }, { t: " eat" }, { t: "ing", a: true }, { t: " or " }, { t: "drink" }, { t: "ing", a: true }]} size={74} />
      {/* question in, held across the stop at 240, out; then the rule takes the slot */}
      <QuestionPill frame={frame} from={W1 + 112} out={W1 + 150} text="Can he eat it" />
      <RuleStrip frame={frame} from={W1 + 160} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- w2: allowed
// First say-ask, and the shortest line in the atom: three words. The drink is
// finished before the stop at 420, so the held frame is a calm "he just drank
// and that was fine", not a frozen gulp.
const W2 = 300;

function W2Scene({ frame }: { frame: number }) {
  const youX = 248;
  const youY = 1040;
  const youK = 1.2;
  const low = handAt(youX, youY, youK, 1, "cup");
  const high = handAt(youX, youY, youK, 1, "raise");
  const bag = { x: 418, y: 876 };
  const out = tween(frame, W2 + 18, W2 + 44, 0, 1, EASE.out);
  const drink = tween(frame, W2 + 54, W2 + 78, 0, 1, EASE.inOut) * (1 - tween(frame, W2 + 86, W2 + 108, 0, 1, EASE.inOut));
  const bx = bag.x + (low.x - bag.x) * out + (high.x - low.x) * drink - 62 * drink;
  const by = bag.y - 40 + (low.y - (bag.y - 40)) * out + (high.y - low.y) * drink + 30 * drink;
  return (
    <AbsoluteFill style={{ background: WALL }}>
      <Stage>
        <Carriage frame={frame} keyId="w2" />
        {/* The pair: not allowed next to allowed. Stuck on the window glass, where
            metro notices actually live, which is also the only band of this set
            that stays visible above the say panel while the learner answers. */}
        <NoFoodSign x={470} y={540} frame={frame} from={W2 + 34} k={0.72} />
        <TickSign x={610} y={540} frame={frame} from={W2 + 46} k={0.72} label="water" />
        <Character
          who="you"
          x={youX}
          y={youY}
          scale={youK}
          facing={1}
          frame={frame}
          enter={W2 + 4}
          legs={false}
          mood={drink > 0.5 ? "neutral" : "happy"}
          gesture={frame >= W2 + 54 && frame < W2 + 108 ? "raise" : frame >= W2 + 18 ? "cup" : "idle"}
          from={frame >= W2 + 54 ? "cup" : "idle"}
          gestureAt={frame >= W2 + 54 ? W2 + 54 : W2 + 18}
        />
        {/* her nod is the payoff, so it lands after the learner has spoken */}
        <Fatima x={864} y={1040} frame={frame} scale={1.2} facing={-1} enter={W2 + 8} sit smile nodAt={W2 + 124} />
        <CarriageFloor />
        <Tote x={bag.x} y={bag.y} k={0.72} />
        <Bottle x={bx} y={by} k={0.68} rot={drink * 52} />
        <Glow frame={frame} from={W2 + 92} x={610} y={540} r={62} color={SEA} />
      </Stage>
      {/* The caption already reads "Water is allowed.", so the card is the only
          other text: one line on screen. */}
      <WordCard frame={frame} from={W2 + 4} parts={[{ t: "allowed", a: true }]} size={86} tick />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- w3: stand on the right
// He rides further up the flight than before, so on the stop frame at 594 his
// feet and the tread he is standing on are above the ask panel: the one thing
// the beat teaches must still be visible while the learner answers.
const W3 = 474;

function W3Scene({ frame }: { frame: number }) {
  const youT = tween(frame, W3 + 6, W3 + 168, 0.4, 0.66, EASE.inOut);
  const famT = tween(frame, W3 + 8, W3 + 150, 0.02, 1.02, EASE.inOut);
  const youP = escPoint(youT, 0);
  const famP = escPoint(famT, 0);
  const youK = 0.82 * (1 - 0.2 * youT);
  const famK = 0.68 * (1 - 0.2 * famT);
  return (
    <AbsoluteFill style={{ background: "#e4ecf1" }}>
      <Stage>
        <rect x="0" y="0" width={STAGE_W} height={SCENE_B} fill="#e4ecf1" />
        <rect x="0" y="0" width={STAGE_W} height="300" fill="#d7e2ea" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={60 + i * 280} y={330} width="140" height="18" rx="9" fill={WALL_DARK} opacity="0.7" />
        ))}
        {/* station floor at the bottom of the flight */}
        <rect x="0" y={SCENE_B - 150} width={STAGE_W} height="150" fill="#c9d5dd" />
        <rect x="0" y={SCENE_B - 150} width={STAGE_W} height="10" fill={FOG} />
        <rect x="860" y={300} width="52" height={SCENE_B - 450} fill="#cdd9e1" />
        <EscalatorBack frame={frame} />
        <Fatima
          x={famP.x}
          y={famP.y}
          frame={frame}
          scale={famK}
          facing={1}
          enter={W3 + 10}
          walking={frame < W3 + 150}
          arm={frame >= W3 + 56 ? "wave" : "idle"}
          armAt={W3 + 56}
          smile
        />
        <Character
          who="you"
          x={youP.x}
          y={youP.y}
          scale={youK}
          facing={1}
          frame={frame}
          enter={W3 + 6}
          mood={frame >= W3 + 64 && frame < W3 + 136 ? "happy" : "neutral"}
        />
        <EscalatorFront />
        <EscalatorSign x={252} y={452} frame={frame} from={W3 + 20} k={1.12} />
      </Stage>
      <WordCard frame={frame} from={W3 + 4} parts={[{ t: "Stand", a: true }, { t: " on the " }, { t: "right", a: true }]} size={70} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- w4: priority seat
// Prediction without a second question: the stop at 774 holds the offer, so the
// learner says the line while it is still open what happens. He sits, the seat
// turns, and fatima nods only on the resume.
const W4 = 648;

function W4Scene({ frame }: { frame: number }) {
  const stands = frame >= W4 + 54;
  const sat = frame >= W4 + 140;
  // The say panel leaves only the top 633 px, and a wide carriage shot puts the
  // seat, the offer and both faces below it. So the camera rises to the seat as
  // he stands, and settles before the stop at 774.
  // Up to the seat for the stop, then most of the way back as he sits, so the
  // beat does not end on a frame of empty floor.
  const pan = tween(frame, W4 + 88, W4 + 118, 0, 330, EASE.inOut) - tween(frame, W4 + 140, W4 + 172, 0, 190, EASE.inOut);
  // He steps across to the seat on the resume, so the swap to sitting is not a jump.
  const manX = 980 + (770 - 980) * tween(frame, W4 + 126, W4 + 140, 0, 1, EASE.inOut);
  return (
    <AbsoluteFill style={{ background: WALL }}>
      <Stage>
        <g transform={`translate(0 ${-pan})`}>
          <Carriage frame={frame} keyId="w4" />
          {/* on the wall above the seat it marks, and clear of where the passenger
              stands, so his shoulder never crosses the word "priority" */}
          <SeatSign x={840} y={700} frame={frame} from={W4 + 12} k={0.92} />
          {/* The priority seat reads as a marked seat from the first frame, or the
              learner has no referent for "this is a priority seat". It only turns
              leaf once he is sitting in it. */}
          <g>
            <rect x="642" y={SEAT_T} width="186" height="62" rx="18" fill={sat ? "#cfeee3" : PALE} />
            <rect x="642" y={SEAT_T} width="186" height="62" rx="18" fill="none" stroke={sat ? SEA : ACCENT} strokeWidth={sat ? 6 : 5} opacity={sat ? 1 : 0.55} />
            <g transform={`translate(735 ${SEAT_T + 30}) scale(0.46)`} opacity="0.85">
              <circle cx="4" cy="-38" r="13" fill={ACCENT} />
              <path d="M-42 -34 L-42 30 L30 30" fill="none" stroke={ACCENT} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 -24 L4 2 L30 2" fill="none" stroke={ACCENT} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
          {/* Fatima is not in this shot: once the camera rises to the seat her head
              sits behind the word card, and three figures is more than the beat
              needs. The offer is the whole story here. */}
          {/* you: seated, then up and offering the seat */}
          {!stands ? <Character who="you" x={712} y={1040} scale={1.18} facing={-1} frame={frame} enter={W4 + 4} legs={false} mood="neutral" /> : null}
          {/* Down into the cushion, not perched on top of it, and the stick is out
              of his hand now he is sitting. */}
          {sat ? <Silhouette x={735} y={1090} frame={frame} scale={0.98} facing={-1} sit stick={false} enter={W4 + 140} /> : null}
          <CarriageFloor />
          {stands ? (
            <Character
              who="you"
              x={432}
              y={1168}
              scale={1.1}
              facing={1}
              frame={frame}
              enter={W4 + 54}
              mood="happy"
              gesture="serve"
              gestureAt={W4 + 70}
            />
          ) : null}
          {/* he waits clear of the seat, so the empty marked seat is what the
              gesture points at */}
          {!sat ? <Silhouette x={manX} y={1168} frame={frame} scale={1.1} facing={-1} enter={W4 + 60} slideFrom={300} /> : null}
          <Glow frame={frame} from={W4 + 146} x={735} y={SEAT_T + 30} r={104} color={SEA} />
          {/* the floor the pan would otherwise run off the bottom of */}
          <rect x="0" y={SCENE_B} width={STAGE_W} height="540" fill={FLOOR} />
        </g>
      </Stage>
      {/* Who the seat is for is acted out, not written: the card and the caption
          are the only text, so this beat keeps to one line on screen. */}
      <WordCard frame={frame} from={W4 + 4} parts={[{ t: "Priority seat", a: true }]} size={80} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- practise: say it with me
// The culminating ask: both rules in one go, which is the hardest thing in the
// atom and so comes last. Stop at 1008; the cue starts 24 frames early so it is
// settled on the held frame rather than at scale 0.
const P0 = 828;
const P_PAUSE = 1008;
const SAY_A: Piece[][] = [
  [{ t: "No", a: true }],
  [{ t: "eat" }, { t: "ing", a: true }],
  [{ t: "or" }],
  [{ t: "drink" }, { t: "ing", a: true }, { t: "." }],
];
const SAY_B: Piece[][] = [[{ t: "Water" }], [{ t: "is" }], [{ t: "allowed", a: true }, { t: "." }]];

function KaraokeLine({ frame, words, start, step, y, size }: { frame: number; words: Piece[][]; start: number; step: number; y: number; size: number }) {
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: y, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.26, fontWeight: 800, lineHeight: 1.1, zIndex: 0 }}>
      {words.map((parts, i) => {
        const at = start + i * step;
        const s = springIn(frame, at, { damping: 8, stiffness: 220 });
        const on = frame >= at;
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", transform: `translateY(${on ? (1 - s) * -14 : 0}px) scale(${on ? 1 + (1 - s) * 0.16 : 1})`, zIndex: 0 }}>
            {parts.map((p, j) => (
              <span key={j} style={{ fontSize: size, color: on ? (p.a ? ACCENT : INK) : FOG }}>{p.t}</span>
            ))}
          </span>
        );
      })}
    </div>
  );
}

function PractiseScene({ frame }: { frame: number }) {
  const circle = springIn(frame, P0 + 6, { damping: 12, stiffness: 120 });
  const cue = P_PAUSE - 24;
  const turn = springIn(frame, cue, { damping: 11, stiffness: 150 });
  const yourTurn = frame >= cue;
  return (
    <AbsoluteFill style={{ background: PALE }}>
      <Stage>
        <defs>
          <clipPath id="metro-presenter">
            <circle cx="540" cy="452" r="292" />
          </clipPath>
        </defs>
        <circle cx="540" cy="452" r={306 * circle} fill={INK} opacity="0.18" />
        <circle cx="540" cy="452" r={292 * circle} fill="#fff" />
        <g clipPath="url(#metro-presenter)">
          <Fatima
            x={540}
            y={940}
            frame={frame}
            scale={1.42}
            facing={1}
            enter={P0 + 10}
            talking={frame > P0 + 24 && frame < cue - 4}
            smile={frame >= cue}
            nodAt={P_PAUSE + 6}
          />
        </g>
        <circle cx="540" cy="452" r={292 * circle} fill="none" stroke={INK} strokeWidth="8" />
        {/* both signs pop a tick when the learner comes back */}
        <NoFoodSign x={386} y={1104} frame={frame} from={P0 + 30} k={0.62} />
        <TickSign x={694} y={1104} frame={frame} from={P0 + 42} k={0.62} />
        {/* just off the plate corner, so the badge never covers the sign it is
            ticking. These tick the two rules on the resume, not the learner. */}
        <TickBadge x={440} y={1050} frame={frame} from={P_PAUSE + 6} k={0.72} />
        <TickBadge x={748} y={1050} frame={frame} from={P_PAUSE + 18} k={0.72} />
        {yourTurn ? (
          <g opacity={micOut}>
            <g transform={`translate(150 266) scale(${turn}) translate(-150 -266)`}>
              <Pulse frame={frame} x={150} y={266} size={118}>
                <g transform="translate(-30 -30) scale(2.5)" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="12" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" />
                </g>
              </Pulse>
            </g>
          </g>
        ) : null}
      </Stage>
      {yourTurn ? (
        <div style={{ position: "absolute", left: 40, top: 356, width: 220, textAlign: "center", fontSize: 36, fontWeight: 800, color: INK }}>Your turn</div>
      ) : null}
      <Eyebrow text="SAY IT WITH ME" x={0} y={774} align="center" frame={frame} from={P0 + 14} />
      {/* both lines are sung through 40 frames before the stop, so the learner is
          not cut off mid-karaoke by the mic */}
      <KaraokeLine frame={frame} words={SAY_A} start={P0 + 30} step={20} y={834} size={72} />
      <KaraokeLine frame={frame} words={SAY_B} start={P0 + 100} step={20} y={944} size={72} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- recap
// Self-efficacy close: the line says what the learner can now do, and the tag
// under the signs names when it comes back, so the loop stays open. The fifth
// sign was already the bonus, so it is what tomorrow is pinned to.
const R0 = 1062;

function RecapScene({ frame }: { frame: number }) {
  const card = springIn(frame, R0 + 6, { damping: 11, stiffness: 115 });
  return (
    <AbsoluteFill style={{ background: ACCENT }}>
      <Stage>
        <defs>
          <pattern id="metro-stripes" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="30" height="60" fill={PAPER} opacity="0.06" />
          </pattern>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="url(#metro-stripes)" />
        <NoFoodSign x={140} y={700} frame={frame} from={R0 + 32} k={0.74} />
        <TickSign x={340} y={700} frame={frame} from={R0 + 40} k={0.74} />
        <EscalatorSign x={540} y={700} frame={frame} from={R0 + 48} k={0.6} />
        <SeatSign x={740} y={700} frame={frame} from={R0 + 56} k={0.74} />
        <GapSign x={940} y={700} frame={frame} from={R0 + 46} k={0.74} />
        {/* a platform band to stand on: blue trousers vanish against the accent ground */}
        <rect x="0" y="1046" width={STAGE_W} height={STAGE_H - 1046} fill={PALE} opacity="0.94" />
        <rect x="0" y="1046" width={STAGE_W} height="9" fill={GOLD} />
        <Character who="you" x={232} y={1212} scale={0.88} facing={1} frame={frame} enter={R0 + 38} slideFrom={-150} mood="happy" gesture="thumbs" gestureAt={R0 + 50} />
        <Fatima x={856} y={1212} frame={frame} scale={0.88} facing={-1} enter={R0 + 44} slideFrom={150} smile arm="wave" armAt={R0 + 56} />
      </Stage>
      <div style={{ position: "absolute", left: 80, right: 80, top: 214, transform: `scale(${card}) rotate(${(1 - card) * -4}deg)`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", inset: 0, transform: "translate(10px, 14px)", background: INK, borderRadius: 54 }} />
        <div style={{ position: "relative", background: "#fff", borderRadius: 54, padding: "44px 40px 50px", textAlign: "center" }}>
          <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: 6, color: FAINT }}>REMEMBER</div>
          <div style={{ marginTop: 18, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 18, fontWeight: 800, lineHeight: 1.05 }}>
            <span style={{ position: "relative", fontSize: 112, color: ACCENT, zIndex: 0 }}>
              No
              <Highlight frame={frame} from={R0 + 26} color={SAFFRON} />
            </span>
            <span style={{ fontSize: 76, color: FAINT }}>+</span>
            <span style={{ position: "relative", fontSize: 112, color: ACCENT, zIndex: 0 }}>
              ing
              <Highlight frame={frame} from={R0 + 34} color={SAFFRON} />
            </span>
          </div>
          <div style={{ marginTop: 10, fontSize: 86, fontWeight: 800, color: INK }}>= do not</div>
        </div>
      </div>
      {/* Zeigarnik: name the next visit. It sits on the platform band between the
          two of them, where it clears both heads and the row of signs. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1078, display: "flex", justifyContent: "center", opacity: tween(frame, R0 + 66, R0 + 82, 0, 1, EASE.out) }}>
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 22, padding: "8px 26px", fontSize: 34, fontWeight: 800, color: INK, whiteSpace: "nowrap" }}>
          <span style={{ color: FAINT, letterSpacing: 3 }}>TOMORROW </span>
          Mind the gap
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- composition
export function MetroExplainer({ l1 }: { l1?: Record<string, string> }) {
  const frame = useCurrentFrame();
  const beat = metroBeatAt(frame);
  // The caption has to be fully sung before the beat stops, or the learner answers
  // while staring at a half-grey line. So it is paced to finish 20 frames before
  // the stop, not over a fixed window. karaoke() also compares a running character
  // count against progress, which leaves the final word unlit at exactly 1, hence
  // the cap above 1.
  const sungBy = (beat.pauseAt ?? beat.to) - 20;
  const progress = (frame - beat.from) / Math.max(30, sungBy - beat.from);
  const k = karaoke(beat.line, Math.min(1.1, progress));
  const font: CSSProperties = { fontFamily: FONT };
  return (
    <AbsoluteFill style={{ ...font, background: PAPER, overflow: "hidden" }}>
      {beat.id === "hook" ? <HookScene frame={frame} /> : null}
      {beat.id === "w1" ? <W1Scene frame={frame} /> : null}
      {beat.id === "w2" ? <W2Scene frame={frame} /> : null}
      {beat.id === "w3" ? <W3Scene frame={frame} /> : null}
      {beat.id === "w4" ? <W4Scene frame={frame} /> : null}
      {beat.id === "practise" ? <PractiseScene frame={frame} /> : null}
      {beat.id === "recap" ? <RecapScene frame={frame} /> : null}
      <Transition frame={frame} at={W1} kind="wipe" color={SAFFRON} color2={INK} duration={22} />
      <Fade frame={frame} at={W2} color={PAPER} />
      <Transition frame={frame} at={W3} kind="slide" color={ACCENT} color2={SAFFRON} duration={24} />
      <Transition frame={frame} at={W4} kind="wipe" color={SAFFRON} color2={INK} duration={22} />
      <Transition frame={frame} at={P0} kind="iris" color={PALE} color2={ACCENT} cx={540} cy={452} duration={26} />
      <Transition frame={frame} at={R0} kind="wipe" color={SAFFRON} color2={INK} duration={22} />
      <CaptionBar line={beat.line} k={k} targets={beat.target} l1={l1?.[beat.id]} />
      <BeatProgress frame={frame} beats={METRO_BEATS} color={beat.kind === "recap" ? PAPER : ACCENT} />
    </AbsoluteFill>
  );
}

// The lead registers this in ExplainerPlayer.tsx; nothing here touches that file.
export const EXPLAINER = {
  component: MetroExplainer,
  beats: METRO_BEATS,
  duration: METRO_DURATION,
  fps: 30,
  width: 1080,
  height: 1440,
  l1: METRO_L1,
};
