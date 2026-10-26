"use client";

// "Metro notices" (ATM-A2-RDG-0006): a word tutorial explainer built as a Remotion
// composition (1080x1440, 30 fps, 40 s, 1200 frames). Seven beats from
// docs/explainers/storyboards.md: hook, four word beats, say it with me, recap.
// One target: "No" plus ing means do not do it, and its opposite on a sign is "allowed".
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

export const METRO_BEATS: Beat[] = [
  { id: "hook", kind: "hook", from: 0, to: 120, line: "On the metro. Signs everywhere." },
  { id: "w1", kind: "word", from: 120, to: 320, line: "No eating or drinking. You cannot eat or drink here.", target: ["No eating or drinking"] },
  { id: "w2", kind: "word", from: 320, to: 510, line: "Allowed. You can do it. Water is allowed.", target: ["allowed"] },
  { id: "w3", kind: "word", from: 510, to: 690, line: "Stand on the right. Walk on the left.", target: ["Stand on the right"] },
  { id: "w4", kind: "word", from: 690, to: 860, line: "Priority seat. A seat for people who need it more.", target: ["Priority seat"] },
  { id: "practise", kind: "practise", from: 860, to: 1110, line: "Say it with me. No eating or drinking. Water is allowed.", target: ["No eating or drinking", "allowed"], pauseAt: 1050 },
  { id: "recap", kind: "recap", from: 1110, to: 1200, line: "No plus ing means do not.", target: ["No", "ing"] },
];
export const METRO_DURATION = 1200;

export function metroBeatAt(frame: number): Beat {
  return METRO_BEATS.find((b) => frame >= b.from && frame < b.to) ?? METRO_BEATS[METRO_BEATS.length - 1];
}

// Per-beat caption line in the learner's own language. English stays on screen above it.
export const METRO_L1: Record<string, Record<string, string>> = {
  ar: {
    hook: "في المترو. لافتات في كل مكان.",
    w1: "ممنوع الأكل أو الشرب هنا.",
    w2: "Allowed: مسموح. الماء مسموح.",
    w3: "قف على اليمين. امشِ على اليسار.",
    w4: "مقعد الأولوية: لمن يحتاجه أكثر.",
    practise: "قلها معي.",
    recap: "No مع ing تعني لا تفعل.",
  },
  es: {
    hook: "En el metro. Carteles por todas partes.",
    w1: "No se puede comer ni beber aquí.",
    w2: "Allowed: está permitido. El agua sí.",
    w3: "De pie a la derecha. Andar por la izquierda.",
    w4: "Asiento prioritario: para quien lo necesita más.",
    practise: "Dilo conmigo.",
    recap: "No más ing: no lo hagas.",
  },
  hi: {
    hook: "मेट्रो में। हर जगह संकेत।",
    w1: "यहाँ खाना-पीना मना है।",
    w2: "Allowed: अनुमति है। पानी ठीक है।",
    w3: "दाईं ओर खड़े हों। बाईं ओर चलें।",
    w4: "प्राथमिकता सीट: ज़रूरतमंद के लिए।",
    practise: "मेरे साथ बोलो।",
    recap: "No के साथ ing: मत करो।",
  },
  ru: {
    hook: "В метро. Везде знаки.",
    w1: "Здесь нельзя есть и пить.",
    w2: "Allowed: можно. Вода разрешена.",
    w3: "Стойте справа. Идите слева.",
    w4: "Приоритетное место: тем, кому нужнее.",
    practise: "Скажи со мной.",
    recap: "No плюс ing: нельзя.",
  },
  tr: {
    hook: "Metroda. Her yerde tabela.",
    w1: "Burada yiyip içmek yasak.",
    w2: "Allowed: izin var. Su serbest.",
    w3: "Sağda dur. Solda yürü.",
    w4: "Öncelikli koltuk: daha çok ihtiyacı olana.",
    practise: "Benimle söyle.",
    recap: "No artı ing: yapma.",
  },
  zh: {
    hook: "在地铁里。到处是标志。",
    w1: "这里不能吃喝。",
    w2: "Allowed：允许。可以喝水。",
    w3: "右侧站立。左侧行走。",
    w4: "优先座位：给更需要的人。",
    practise: "跟我一起说。",
    recap: "No 加 ing 表示禁止。",
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
        {sit ? (
          <path d="M-52 -296 Q-52 -322 -28 -322 L28 -322 Q52 -322 52 -296 L60 -150 L-60 -150 Z" />
        ) : (
          <g>
            <path d="M-52 -296 Q-52 -322 -28 -322 L28 -322 Q52 -322 52 -296 L44 -150 L-44 -150 Z" />
            {[-18, 18].map((k, i) => (
              <g key={k} transform={`rotate(${walking ? Math.sin(walkT + i * Math.PI) * 16 : 0} ${k} -150)`}>
                <rect x={k - 15} y="-156" width="30" height="156" rx="13" />
                <ellipse cx={k + 6} cy="0" rx="24" ry="9" />
              </g>
            ))}
          </g>
        )}
        <rect x="-14" y="-362" width="28" height="56" />
        <circle cx="0" cy="-398" r="50" />
      </g>
      {stick ? (
        <g transform={`translate(0 ${-bob})`}>
          <path d="M62 -286 Q84 -288 84 -258 L90 -6" fill="none" stroke="#6f7384" strokeWidth="10" strokeLinecap="round" />
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
          <rect x="380" y={WIN_T - 30} width="320" height="320" fill="#c9cfd6" />
          <rect x="380" y={WIN_T + 230} width="320" height="24" fill={SAFFRON} />
          <rect x="380" y={WIN_T + 254} width="320" height={FLOOR_T - WIN_T - 254 + 36} fill="#b5bcc4" />
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
function TickBadge({ x, y, frame, from }: { x: number; y: number; frame: number; from: number }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 8, stiffness: 220 });
  const ring = tween(frame, from, from + 24, 0, 1, EASE.out);
  return (
    <g transform={`translate(${x} ${y})`}>
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

/** The steps and the truss, behind the riders. */
function EscalatorBack({ frame }: { frame: number }) {
  const off = (frame * 2.1) % 76;
  const steps = [];
  for (let i = -1; i < Math.ceil(ESC_LEN / 76) + 1; i++) {
    const d = off + i * 76;
    if (d < -40 || d > ESC_LEN + 40) continue;
    const p = escPoint(d / ESC_LEN, 0);
    steps.push(
      <g key={i} transform={`translate(${p.x} ${p.y})`}>
        <path
          d={`M0 0 L${ESC_U.x * 54} ${ESC_U.y * 54} L${ESC_U.x * 54 + ESC_N.x * 40} ${ESC_U.y * 54 + ESC_N.y * 40} L${ESC_N.x * 40} ${ESC_N.y * 40} Z`}
          fill={SEAT}
          stroke={INK}
          strokeWidth="4"
        />
        <path
          d={`M${ESC_N.x * 40} ${ESC_N.y * 40} L${ESC_U.x * 54 + ESC_N.x * 40} ${ESC_U.y * 54 + ESC_N.y * 40}`}
          stroke={SEAT_DARK}
          strokeWidth="9"
        />
      </g>,
    );
  }
  return (
    <g>
      <path d={escBand(0, 170)} fill={SEAT_DARK} />
      <path d={escBand(96, 170)} fill={INK} opacity="0.18" />
      {steps}
    </g>
  );
}

/** The glass balustrade and the handrail, drawn in front of the riders. */
function EscalatorFront() {
  return (
    <g>
      <path d={escBand(0, -156)} fill="#dceaf2" opacity="0.42" />
      <path d={escBand(-150, -156)} fill={FOG} opacity="0.5" />
      <path
        d={`M${escPoint(0, -168).x} ${escPoint(0, -168).y} L${escPoint(1, -168).x} ${escPoint(1, -168).y}`}
        stroke={INK}
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d={`M${escPoint(0, -176).x} ${escPoint(0, -176).y} L${escPoint(1, -176).x} ${escPoint(1, -176).y}`}
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

/** Soft 10-frame fade over a beat change inside the same set. */
function Fade({ frame, at, duration = 10, color = PAPER }: { frame: number; at: number; duration?: number; color?: string }) {
  const t = (frame - (at - duration / 2)) / duration;
  if (t <= 0 || t >= 1) return null;
  return <AbsoluteFill style={{ background: color, opacity: 1 - Math.abs(t - 0.5) * 2 }} />;
}

// ---------------------------------------------------------------- hook: doors and signs
function HookScene({ frame }: { frame: number }) {
  const open = tween(frame, 8, 40, 0, 1, EASE.inOut);
  const walkX = tween(frame, 26, 64, 560, 440, EASE.inOut);
  const looking = frame >= 70;
  return (
    <AbsoluteFill style={{ background: WALL }}>
      <Parallax frame={frame} from={62} to={120} zoom={1.2} originX={250} originY={240} layers={[
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
              <NoFoodSign x={250} y={210} frame={frame} from={54} k={0.78} />
              <TickSign x={450} y={210} frame={frame} from={64} k={0.78} />
              <EscalatorSign x={660} y={210} frame={frame} from={74} k={0.62} />
              <SeatSign x={860} y={210} frame={frame} from={84} k={0.78} />
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
                y={1180}
                scale={1.16}
                facing={1}
                frame={frame}
                enter={22}
                walking={frame < 64}
                mood={looking ? "surprised" : "neutral"}
                gesture={looking ? "think" : "idle"}
                gestureAt={72}
              />
              <Tote x={walkX + 120} y={1012} k={0.78} />
            </Stage>
          ),
        },
      ]} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- w1: no eating or drinking
const W1 = 120;

function W1Scene({ frame }: { frame: number }) {
  const youX = 300;
  const youY = 1040;
  const youK = 1.2;
  const hand = handAt(youX, youY, youK, 1, "cup");
  const bag = { x: 500, y: 876 };
  const out = tween(frame, W1 + 40, W1 + 70, 0, 1, EASE.out);
  const back = tween(frame, W1 + 134, W1 + 162, 0, 1, EASE.inOut);
  const held = out * (1 - back);
  const sx = bag.x + (hand.x - bag.x) * held;
  const sy = bag.y - 40 + (hand.y - (bag.y - 40)) * held;
  const looksAtSign = frame >= W1 + 78 && frame < W1 + 112;
  return (
    <AbsoluteFill style={{ background: WALL }}>
      <Stage>
        <Carriage frame={frame} keyId="w1" />
        <NoFoodSign x={830} y={716} frame={frame} from={W1 + 10} k={1.02} />
        <Glow frame={frame} from={W1 + 76} x={830} y={716} r={84} />
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
          gesture={frame >= W1 + 40 && frame < W1 + 150 ? "cup" : "idle"}
          gestureAt={W1 + 40}
        />
        <CarriageFloor />
        <Tote x={bag.x} y={bag.y} k={0.72} />
        {held > 0.02 ? <Sandwich x={sx} y={sy} k={0.62 + 0.1 * held} rot={-8 + held * 8} dim={looksAtSign ? 0.4 : 0} /> : null}
        <Sigh x={youX + 70} y={youY - 520} frame={frame} from={W1 + 166} />
      </Stage>
      <WordCard frame={frame} from={W1 + 4} parts={[{ t: "No", a: true }, { t: " eat" }, { t: "ing", a: true }, { t: " or " }, { t: "drink" }, { t: "ing", a: true }]} size={74} />
      <RuleStrip frame={frame} from={W1 + 96} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- w2: allowed
const W2 = 320;

function W2Scene({ frame }: { frame: number }) {
  const youX = 248;
  const youY = 1040;
  const youK = 1.2;
  const low = handAt(youX, youY, youK, 1, "cup");
  const high = handAt(youX, youY, youK, 1, "raise");
  const bag = { x: 418, y: 876 };
  const out = tween(frame, W2 + 22, W2 + 50, 0, 1, EASE.out);
  const drink = tween(frame, W2 + 76, W2 + 104, 0, 1, EASE.inOut) * (1 - tween(frame, W2 + 132, W2 + 158, 0, 1, EASE.inOut));
  const bx = bag.x + (low.x - bag.x) * out + (high.x - low.x) * drink - 34 * drink;
  const by = bag.y - 40 + (low.y - (bag.y - 40)) * out + (high.y - low.y) * drink + 18 * drink;
  return (
    <AbsoluteFill style={{ background: WALL }}>
      <Stage>
        <Carriage frame={frame} keyId="w2" />
        {/* the pair: not allowed next to allowed */}
        <NoFoodSign x={508} y={748} frame={frame} from={W2 + 56} k={0.72} />
        <TickSign x={676} y={748} frame={frame} from={W2 + 68} k={0.72} label="water" />
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
          gesture={frame >= W2 + 76 && frame < W2 + 150 ? "raise" : frame >= W2 + 22 ? "cup" : "idle"}
          from={frame >= W2 + 76 ? "cup" : "idle"}
          gestureAt={frame >= W2 + 76 ? W2 + 76 : W2 + 22}
        />
        <Fatima x={864} y={1040} frame={frame} scale={1.2} facing={-1} enter={W2 + 8} sit smile nodAt={W2 + 112} />
        <CarriageFloor />
        <Tote x={bag.x} y={bag.y} k={0.72} />
        <Bottle x={bx} y={by} k={0.68} rot={drink * 36} />
        <Glow frame={frame} from={W2 + 86} x={676} y={748} r={62} color={SEA} />
      </Stage>
      <WordCard frame={frame} from={W2 + 4} parts={[{ t: "allowed", a: true }]} size={86} tick />
      <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", fontSize: 44, fontWeight: 800, color: INK, opacity: tween(frame, W2 + 74, W2 + 92, 0, 1, EASE.out) }}>
        Water is <span style={{ color: SEA }}>allowed</span>.
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- w3: stand on the right
const W3 = 510;

function W3Scene({ frame }: { frame: number }) {
  const youT = tween(frame, W3 + 6, W3 + 170, 0.36, 0.5, EASE.inOut);
  const famT = tween(frame, W3 + 10, W3 + 162, 0.02, 0.94, EASE.inOut);
  const youP = escPoint(youT, 0);
  const famP = escPoint(famT, -52);
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
          arm={frame >= W3 + 74 ? "wave" : "idle"}
          armAt={W3 + 74}
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
          mood={frame >= W3 + 80 && frame < W3 + 124 ? "happy" : "neutral"}
        />
        <EscalatorFront />
        <EscalatorSign x={252} y={452} frame={frame} from={W3 + 20} k={1.12} />
      </Stage>
      <WordCard frame={frame} from={W3 + 4} parts={[{ t: "Stand", a: true }, { t: " on the " }, { t: "right", a: true }]} size={70} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- w4: priority seat
const W4 = 690;

function W4Scene({ frame }: { frame: number }) {
  const stands = frame >= W4 + 54;
  return (
    <AbsoluteFill style={{ background: WALL }}>
      <Stage>
        <Carriage frame={frame} keyId="w4" />
        {/* the priority seat itself */}
        <g>
          <rect x="642" y={SEAT_T} width="186" height="62" rx="18" fill={frame >= W4 + 116 ? "#cfeee3" : SEAT} />
          <rect x="642" y={SEAT_T} width="186" height="62" rx="18" fill="none" stroke={frame >= W4 + 116 ? SEA : INK} strokeWidth={frame >= W4 + 116 ? 6 : 3} opacity={frame >= W4 + 116 ? 1 : 0.2} />
          <g transform={`translate(735 ${SEAT_T + 30}) scale(0.4)`} opacity="0.5">
            <circle cx="4" cy="-38" r="13" fill={ACCENT} />
            <path d="M-42 -34 L-42 30 L30 30" fill="none" stroke={ACCENT} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 -24 L4 2 L30 2" fill="none" stroke={ACCENT} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <Fatima x={210} y={1040} frame={frame} scale={1.18} facing={1} enter={W4 + 6} sit smile nodAt={W4 + 130} />
        {/* you: seated, then up and offering the seat */}
        {!stands ? <Character who="you" x={712} y={1040} scale={1.18} facing={-1} frame={frame} enter={W4 + 4} legs={false} mood="neutral" /> : null}
        {frame >= W4 + 110 ? <Silhouette x={735} y={1040} frame={frame} scale={1.1} facing={-1} sit enter={W4 + 70} /> : null}
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
        {frame < W4 + 110 ? <Silhouette x={735} y={1168} frame={frame} scale={1.1} facing={-1} enter={W4 + 70} slideFrom={300} /> : null}
        <SeatSign x={920} y={700} frame={frame} from={W4 + 12} k={0.92} />
        <Glow frame={frame} from={W4 + 112} x={735} y={SEAT_T + 30} r={104} color={SEA} />
      </Stage>
      <WordCard frame={frame} from={W4 + 4} parts={[{ t: "Priority seat", a: true }]} size={80} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", fontSize: 42, fontWeight: 800, color: FAINT, opacity: tween(frame, W4 + 90, W4 + 108, 0, 1, EASE.out) }}>
        for people who need it more
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- practise: say it with me
const P0 = 860;
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
  const turn = springIn(frame, 1050, { damping: 11, stiffness: 150 });
  const yourTurn = frame >= 1050;
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
            talking={frame > P0 + 24 && frame < 1046}
            smile={frame >= 1050}
            nodAt={1056}
          />
        </g>
        <circle cx="540" cy="452" r={292 * circle} fill="none" stroke={INK} strokeWidth="8" />
        {/* both signs pop a tick when the learner comes back */}
        <NoFoodSign x={386} y={1104} frame={frame} from={P0 + 30} k={0.62} />
        <TickSign x={694} y={1104} frame={frame} from={P0 + 42} k={0.62} />
        <TickBadge x={428} y={1062} frame={frame} from={1060} />
        <TickBadge x={736} y={1062} frame={frame} from={1072} />
        {yourTurn ? (
          <g>
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
      <KaraokeLine frame={frame} words={SAY_A} start={P0 + 30} step={20} y={834} size={72} />
      <KaraokeLine frame={frame} words={SAY_B} start={P0 + 108} step={20} y={944} size={72} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- recap
const R0 = 1110;

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
        <GapSign x={940} y={700} frame={frame} from={R0 + 58} k={0.74} />
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
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- composition
export function MetroExplainer({ l1 }: { l1?: Record<string, string> }) {
  const frame = useCurrentFrame();
  const beat = metroBeatAt(frame);
  const progress = (frame - beat.from) / Math.max(1, Math.min(120, beat.to - beat.from));
  const k = karaoke(beat.line, Math.min(1, progress));
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
