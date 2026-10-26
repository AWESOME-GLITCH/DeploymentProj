"use client";

// "The bill, please" (ATM-A2-INT-0010): a 2D flat-vector motion-graphics
// explainer built as a Remotion composition (3:4, 1080x1440, 30 fps, 39 s).
// Seven beats from docs/explainers/storyboards.md: hook, four word beats,
// practise aloud, recap. Single target: "Could I have the bill, please?" shown
// as the same frame the ordering lesson taught, plus pay by card, pay in cash
// and keep the change. Built on the shared kit in ./lib, set at a cafe table by
// the window. Every value is a pure function of the frame, so the same
// component plays in the Player and renders deterministically to MP4.

import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { CSSProperties, ReactNode } from "react";
import {
  ACCENT, BeatProgress, CaptionBar, Character, COFFEE, CREAM, Cup, EASE, Eyebrow, FAINT, FOG, FONT,
  Highlight, INK, karaoke, KineticText, lerp, PAPER, Parallax, PendantLamp, Plant, Pulse, SAFFRON, SEA,
  SpeechBubble, springIn, Stage, Transition, tween, Window, WOOD, WOOD_DARK, WOOD_LIGHT,
} from "./lib";

export const INT10_FPS = 30;
export const INT10_W = 1080;
export const INT10_H = 1440;

export type Beat = {
  id: string;
  from: number;
  to: number;
  line: string;
  target?: string[];
  kind: "hook" | "word" | "practise" | "recap";
  pauseAt?: number;
};

export const INT10_BEATS: Beat[] = [
  { id: "hook", kind: "hook", from: 0, to: 120, line: "Coffee finished. Time to pay." },
  { id: "w1", kind: "word", from: 120, to: 330, line: "The bill. The paper with the price. Could I have the bill, please?", target: ["the bill", "Could I have"] },
  { id: "w2", kind: "word", from: 330, to: 540, line: "Pay by card. Pay with a bank card.", target: ["pay by card"] },
  { id: "w3", kind: "word", from: 540, to: 720, line: "Pay in cash. Notes and coins.", target: ["pay in cash"] },
  { id: "w4", kind: "word", from: 720, to: 870, line: "Keep the change. The extra money is for you.", target: ["Keep the change"] },
  { id: "practise", kind: "practise", from: 870, to: 1080, line: "Say it with me. Could I have the bill, please?", target: ["Could I have", "the bill", "please"], pauseAt: 1040 },
  { id: "recap", kind: "recap", from: 1080, to: 1170, line: "Could I have the bill, please?", target: ["Could I have", "the bill", "please"] },
];
export const INT10_DURATION = 1170;

export function int10BeatAt(frame: number): Beat {
  return INT10_BEATS.find((b) => frame >= b.from && frame < b.to) ?? INT10_BEATS[INT10_BEATS.length - 1];
}

// Cafe tones, kept inside the kit family: cream walls, wood table, the card
// reader's leaf tick for "paid" and saffron coins.
const WALL = CREAM;
const WALL_LOW = "#e9d8bf";
const FLOOR = "#e4d7c4";
const GLASS = "#dbe9ef";
const GLASS_LINE = "#c3d3d8";
const NOTE_FACE = "#dfeee4";
const PRACTISE_BG = "#eef0ff";

// The table by the window, the two characters behind it, and the shelf of frame
// where props stand on the table top.
const TABLE = { cx: 540, cy: 1050, rx: 400, ry: 58 };
const PROP_Y = 1024;
const FEET = 1215;
const CH = 1.22;
const LEO_X = 300;
const YOU_X = 800;
// Leo's serving hand, by forward kinematics of the kit rig at this scale.
const HAND = { x: 492, y: 975 };

// The sentence frame panel and the blank slot inside it (page coordinates).
const FRAME = { x: 70, y: 300, w: 940, h: 152 };
const SLOT = { x: 420, y: 334, w: 270, h: 84 };
const SLOT_MID = SLOT.x + SLOT.w / 2;

const PRACTISE_LINE = "Could I have the bill, please?";
// Could / I / have in ACCENT, the / bill in SAFFRON, please in ACCENT. The line
// is set in two fixed rows so "the bill" never breaks across them.
const PRACTISE_COLOURS = [ACCENT, ACCENT, ACCENT, SAFFRON, SAFFRON, ACCENT];
const PRACTISE_ROWS = [3, 3];

// ---------------------------------------------------------------- small props

/** A saucer, flat on the table at (x, y). */
function Saucer({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="5" cy="7" rx="98" ry="17" fill={INK} opacity="0.12" />
      <ellipse cx="0" cy="0" rx="98" ry="19" fill="#fff" stroke="#d8cfc4" strokeWidth="4" />
      <ellipse cx="0" cy="-6" rx="70" ry="12" fill="#f4efe6" />
    </g>
  );
}

/** The last drop of coffee leaving a tipped cup. */
function LastDrop({ frame, from, x, y }: { frame: number; from: number; x: number; y: number }) {
  const p = tween(frame, from, from + 24, 0, 1, EASE.in);
  const land = tween(frame, from + 24, from + 42, 0, 1, EASE.out);
  return (
    <g>
      {p > 0 && p < 1 ? <ellipse cx={x} cy={y + p * 86} rx={9} ry={11 + p * 5} fill={COFFEE} opacity="0.9" /> : null}
      {land > 0 && land < 1 ? (
        <ellipse cx={x} cy={y + 90} rx={10 + land * 26} ry={3 + land * 7} fill="none" stroke={COFFEE} strokeWidth={5 * (1 - land)} opacity={1 - land} />
      ) : null}
    </g>
  );
}

/** A small flat clock on the windowsill: the shop is closing, time to pay. */
function ClockIcon({ x, baseY, r = 42, frame }: { x: number; baseY: number; r?: number; frame: number }) {
  const tick = Math.floor(frame / 15) * 6;
  return (
    <g>
      <ellipse cx={x} cy={baseY + 4} rx={r * 0.9} ry={r * 0.18} fill={INK} opacity="0.14" />
      <circle cx={x} cy={baseY - r} r={r} fill="#fff" stroke={INK} strokeWidth="6" />
      {[0, 3, 6, 9].map((i) => (
        <line key={i} x1={x} y1={baseY - r * 1.7} x2={x} y2={baseY - r * 1.5} stroke={INK} strokeWidth="5" strokeLinecap="round" transform={`rotate(${i * 30} ${x} ${baseY - r})`} />
      ))}
      <line x1={x} y1={baseY - r} x2={x} y2={baseY - r * 1.46} stroke={INK} strokeWidth="7" strokeLinecap="round" transform={`rotate(150 ${x} ${baseY - r})`} />
      <line x1={x} y1={baseY - r} x2={x} y2={baseY - r * 1.62} stroke={ACCENT} strokeWidth="5.5" strokeLinecap="round" transform={`rotate(${tick} ${x} ${baseY - r})`} />
      <circle cx={x} cy={baseY - r} r="5" fill={INK} />
    </g>
  );
}

/**
 * The bill: a folded paper that unfolds from `unfoldAt` and shows the price.
 * `baseY` is the bottom edge, so it can stand in a hand or lie on the table.
 */
function Bill({
  frame, appear, unfoldAt, x, baseY, scale = 1, price = "3.50", tilt = 0,
}: {
  frame: number; appear: number; unfoldAt?: number; x: number; baseY: number; scale?: number; price?: string; tilt?: number;
}) {
  if (frame < appear) return null;
  const s = springIn(frame, appear, { damping: 9, stiffness: 200 });
  const open = unfoldAt !== undefined ? tween(frame, unfoldAt, unfoldAt + 26, 0, 1, EASE.out) : 1;
  const w = 164;
  const h = lerp(96, 210, open);
  const top = -h;
  const text = tween(frame, (unfoldAt ?? appear) + 16, (unfoldAt ?? appear) + 34, 0, 1, EASE.out);
  return (
    <g transform={`translate(${x} ${baseY}) scale(${scale * s}) rotate(${tilt})`}>
      <ellipse cx="6" cy="6" rx={w * 0.52} ry="12" fill={INK} opacity="0.12" />
      <rect x={-w / 2 + 6} y={top + 8} width={w} height={h} rx="8" fill={INK} opacity="0.12" />
      <rect x={-w / 2} y={top} width={w} height={h} rx="8" fill={PAPER} stroke="#d8cfc4" strokeWidth="4" />
      {/* ruled lines, then the price once the paper is open */}
      <g opacity={open}>
        {[0, 1, 2].map((i) => (
          <line key={i} x1={-w / 2 + 22} y1={top + 44 + i * 30} x2={w / 2 - 50} y2={top + 44 + i * 30} stroke={FOG} strokeWidth="6" strokeLinecap="round" />
        ))}
        <line x1={-w / 2 + 22} y1={top + 148} x2={w / 2 - 22} y2={top + 148} stroke={INK} strokeWidth="4" />
      </g>
      <text x="0" y={top + h - 26} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="44" fill={INK} opacity={text}>
        £{price}
      </text>
      {/* the crease, visible only while the paper is still folded */}
      <line x1={-w / 2} y1={top + h * 0.5} x2={w / 2} y2={top + h * 0.5} stroke="#d8cfc4" strokeWidth="4" opacity={1 - open} />
    </g>
  );
}

/** A bank card: chip, stripe and the contactless arcs. */
function BankCard({ x, y, rot = 0, scale = 1, opacity = 1 }: { x: number; y: number; rot?: number; scale?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`} opacity={opacity}>
      <rect x="-82" y="-46" width="164" height="100" rx="16" fill={INK} opacity="0.14" transform="translate(5 7)" />
      <rect x="-82" y="-46" width="164" height="100" rx="16" fill={ACCENT} />
      <rect x="-62" y="-26" width="42" height="32" rx="7" fill={SAFFRON} />
      <line x1="-55" y1="-10" x2="-27" y2="-10" stroke={INK} strokeWidth="3" opacity="0.4" />
      <rect x="-62" y="22" width="84" height="10" rx="5" fill={PAPER} opacity="0.85" />
      <rect x="-62" y="38" width="52" height="8" rx="4" fill={PAPER} opacity="0.55" />
      <g fill="none" stroke={PAPER} strokeWidth="5" strokeLinecap="round" opacity="0.9">
        <path d="M40 -22 a 22 22 0 0 1 0 30" />
        <path d="M54 -32 a 36 36 0 0 1 0 50" />
      </g>
    </g>
  );
}

/** A card reader. Shows the total, then a leaf tick and a short beep. */
function CardReader({
  frame, appear, x, baseY, scale = 1, total = "3.50", tickAt,
}: {
  frame: number; appear: number; x: number; baseY: number; scale?: number; total?: string; tickAt?: number;
}) {
  if (frame < appear) return null;
  const s = springIn(frame, appear, { damping: 10, stiffness: 190 });
  const paid = tickAt !== undefined ? springIn(frame, tickAt, { damping: 8, stiffness: 220 }) : 0;
  const beep = tickAt !== undefined ? tween(frame, tickAt, tickAt + 26, 0, 1, EASE.out) : 0;
  return (
    <g transform={`translate(${x} ${baseY}) scale(${scale * s}) rotate(-8)`}>
      <rect x="-66" y="-180" width="132" height="186" rx="20" fill={INK} opacity="0.14" transform="translate(5 7)" />
      <rect x="-66" y="-180" width="132" height="186" rx="20" fill="#3b3f5c" />
      <rect x="-50" y="-164" width="100" height="62" rx="10" fill="#d9ead6" />
      {paid < 0.1 ? (
        <text x="0" y="-120" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="34" fill={INK}>£{total}</text>
      ) : (
        <g transform={`translate(0 -133) scale(${paid})`}>
          <path d="M-26 2 L-8 20 L26 -18" fill="none" stroke={SEA} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
        <rect key={`${r}${c}`} x={-44 + c * 32} y={-86 + r * 26} width="24" height="16" rx="5" fill={PAPER} opacity="0.7" />
      )))}
      {beep > 0 && beep < 1 ? (
        <g fill="none" stroke={SEA} strokeWidth={7 * (1 - beep)} opacity={1 - beep}>
          <circle cx="0" cy="-196" r={16 + beep * 44} />
        </g>
      ) : null}
    </g>
  );
}

/** A banknote, flat on the table. */
function Note({ x, y, rot = 0, scale = 1 }: { x: number; y: number; rot?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <rect x="-96" y="-44" width="192" height="88" rx="10" fill={INK} opacity="0.12" transform="translate(4 6)" />
      <rect x="-96" y="-44" width="192" height="88" rx="10" fill={NOTE_FACE} stroke={SEA} strokeWidth="4" />
      <circle cx="-54" cy="0" r="24" fill="#fff" stroke={SEA} strokeWidth="3" />
      <circle cx="-54" cy="-6" r="9" fill={SEA} opacity="0.5" />
      <path d="M-68 10 a 14 14 0 0 1 28 0 Z" fill={SEA} opacity="0.5" />
      <text x="34" y="14" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="42" fill={SEA}>£5</text>
      <line x1="-18" y1="30" x2="76" y2="30" stroke={SEA} strokeWidth="4" opacity="0.5" />
    </g>
  );
}

/** A coin. */
function Coin({ x, y, r = 28, rot = 0, scale = 1 }: { x: number; y: number; r?: number; rot?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <circle cx="3" cy="5" r={r} fill={INK} opacity="0.14" />
      <circle cx="0" cy="0" r={r} fill={SAFFRON} />
      <circle cx="0" cy="0" r={r * 0.76} fill="none" stroke={INK} strokeWidth="3" opacity="0.35" />
      <text x="0" y={r * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize={r * 0.95} fill={INK}>£</text>
    </g>
  );
}

/** The tip jar on the table: a glass jar with a paper label and coins inside. */
function TipJar({
  frame, appear = 0, x, baseY, scale = 1, coins = 2, clinkAt,
}: {
  frame: number; appear?: number; x: number; baseY: number; scale?: number; coins?: number; clinkAt?: number;
}) {
  if (frame < appear) return null;
  const s = springIn(frame, appear, { damping: 10, stiffness: 180 });
  const clink = clinkAt !== undefined ? tween(frame, clinkAt, clinkAt + 24, 0, 1, EASE.out) : 0;
  const extra = clinkAt !== undefined && frame >= clinkAt ? 1 : 0;
  return (
    <g transform={`translate(${x} ${baseY}) scale(${scale * s})`}>
      <ellipse cx="5" cy="6" rx="62" ry="13" fill={INK} opacity="0.12" />
      <path d="M-56 0 L-56 -140 Q-56 -152 -44 -152 L44 -152 Q56 -152 56 -140 L56 0 Z" fill={GLASS} fillOpacity="0.75" stroke={GLASS_LINE} strokeWidth="5" />
      <rect x="-62" y="-168" width="124" height="22" rx="8" fill={GLASS_LINE} />
      {Array.from({ length: coins + extra }).map((_, i) => (
        <Coin key={i} x={-26 + (i % 3) * 26} y={-24 - Math.floor(i / 3) * 22} r={20} rot={i * 24} />
      ))}
      <rect x="-40" y="-118" width="80" height="48" rx="8" fill={PAPER} stroke="#d8cfc4" strokeWidth="3" />
      <text x="0" y="-84" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="28" letterSpacing="2" fill={INK}>TIPS</text>
      {clink > 0 && clink < 1 ? (
        <circle cx="0" cy="-150" r={20 + clink * 50} fill="none" stroke={SAFFRON} strokeWidth={8 * (1 - clink)} opacity={1 - clink} />
      ) : null}
    </g>
  );
}

/** A coin tossed along an arc from a hand into the jar. */
function CoinToss({
  frame, from, to, x0, y0, x1, y1,
}: {
  frame: number; from: number; to: number; x0: number; y0: number; x1: number; y1: number;
}) {
  if (frame < from || frame >= to) return null;
  const p = tween(frame, from, to, 0, 1, EASE.inOut);
  const x = lerp(x0, x1, p);
  const y = lerp(y0, y1, p) - Math.sin(p * Math.PI) * 110;
  return <Coin x={x} y={y} r={26} rot={p * 320} />;
}

/** The short ink burst that marks a tile clipping into its slot. */
function ClickMark({ frame, at, x, y }: { frame: number; at: number; x: number; y: number }) {
  const p = tween(frame, at, at + 16, 0, 1, EASE.out);
  if (p <= 0 || p >= 1) return null;
  return (
    <g stroke={INK} strokeWidth={6 * (1 - p)} strokeLinecap="round" opacity={1 - p}>
      {[-1, 1].map((k) => (
        <g key={k}>
          <line x1={x + k * (40 + p * 30)} y1={y - 22} x2={x + k * (62 + p * 40)} y2={y - 30} />
          <line x1={x + k * (40 + p * 30)} y1={y + 22} x2={x + k * (62 + p * 40)} y2={y + 30} />
        </g>
      ))}
    </g>
  );
}

// ---------------------------------------------------------------- word tiles

/** A rounded ink-outline word chip, the same shape the sentence_build item uses. */
function Chip({
  text, x, y, w, h = 84, size = 40, accent = [], opacity = 1, scale = 1, shift = 0,
}: {
  text: string; x: number; y: number; w: number; h?: number; size?: number; accent?: string[]; opacity?: number; scale?: number; shift?: number;
}) {
  const words = text.split(" ");
  return (
    <div
      style={{
        position: "absolute", left: x + shift, top: y, width: w, height: h, opacity,
        transform: `scale(${scale})`, transformOrigin: "50% 50%",
        display: "flex", alignItems: "center", justifyContent: "center", gap: size * 0.22,
        background: "#fff", border: `5px solid ${INK}`, borderRadius: 24,
        boxShadow: "4px 6px 0 rgba(27,29,58,0.14)",
        fontSize: size, fontWeight: 800, lineHeight: 1, color: INK, whiteSpace: "nowrap",
      }}
    >
      {words.map((word, i) => (
        <span key={i} style={{ color: accent.includes(word) ? ACCENT : INK }}>{word}</span>
      ))}
    </div>
  );
}

const CARDS: { text: string; from: number; to: number; accent?: string[] }[] = [
  { text: "the bill", from: 126, to: 330 },
  { text: "pay by card", from: 336, to: 540, accent: ["by"] },
  { text: "pay in cash", from: 546, to: 720, accent: ["in"] },
  { text: "Keep the change", from: 726, to: 868 },
];

/** The word card at the top of every word beat: one phrase, nothing else. */
function WordCard({ frame }: { frame: number }) {
  return (
    <>
      {CARDS.map((c) => {
        const o = tween(frame, c.from, c.from + 12, 0, 1, EASE.out) * (1 - tween(frame, c.to - 10, c.to, 0, 1, EASE.in));
        if (o <= 0.01) return null;
        const words = c.text.split(" ");
        return (
          <div
            key={c.text}
            style={{
              position: "absolute", left: 150, top: 96, width: 780, height: 128, opacity: o,
              transform: `translateY(${(1 - o) * -16}px)`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 18,
              background: "#fff", border: `6px solid ${INK}`, borderRadius: 38,
              boxShadow: "5px 8px 0 rgba(27,29,58,0.16)",
              fontSize: 62, fontWeight: 800, lineHeight: 1, color: INK, whiteSpace: "nowrap",
            }}
          >
            {words.map((word, i) => (
              <span key={i} style={{ color: c.accent?.includes(word) ? ACCENT : INK }}>{word}</span>
            ))}
          </div>
        );
      })}
    </>
  );
}

/**
 * The sentence frame "Could I have ___, please?" with an empty slot. The tiles
 * that fill the slot are drawn by the caller, so they can travel across the
 * stage and lock in.
 */
function SentenceFrame({ frame, appear, label }: { frame: number; appear: number; label?: string }) {
  if (frame < appear) return null;
  const s = springIn(frame, appear, { damping: 11, stiffness: 170 });
  const lab = label ? tween(frame, appear + 40, appear + 60, 0, 1, EASE.out) : 0;
  const text: CSSProperties = { position: "absolute", top: 50, fontSize: 44, fontWeight: 800, lineHeight: 1, color: INK, whiteSpace: "nowrap" };
  return (
    <>
      <div
        style={{
          position: "absolute", left: FRAME.x, top: FRAME.y, width: FRAME.w, height: FRAME.h,
          transform: `scale(${s})`, transformOrigin: "75% 100%",
        }}
      >
        <div style={{ position: "absolute", inset: 0, transform: "translate(8px, 10px)", background: INK, borderRadius: 44 }} />
        <div style={{ position: "absolute", inset: 0, background: "#fff", border: `6px solid ${INK}`, borderRadius: 44 }} />
        <div style={{ ...text, left: 26 }}>Could I have</div>
        <div
          style={{
            position: "absolute", left: SLOT.x - FRAME.x, top: SLOT.y - FRAME.y, width: SLOT.w, height: SLOT.h,
            border: `5px dashed ${FOG}`, borderRadius: 24,
          }}
        />
        <div style={{ ...text, left: SLOT.x - FRAME.x + SLOT.w + 8 }}>, please?</div>
        <svg width="80" height="62" viewBox="0 0 80 62" style={{ position: "absolute", top: "100%", marginTop: -8, left: 700 }}>
          <path d="M6 0 L74 0 L56 50 Z" fill={INK} />
          <path d="M18 0 L62 0 L50 32 Z" fill="#fff" />
        </svg>
      </div>
      {label ? (
        <div style={{ position: "absolute", left: FRAME.x, top: FRAME.y + FRAME.h + 68, width: FRAME.w - 240, textAlign: "center", fontSize: 34, fontWeight: 700, color: INK, opacity: lab }}>
          {label}
        </div>
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------- the cafe set

/** Wall, window, lamps and plant: everything behind the table. */
function BackWall({ frame, clock = false }: { frame: number; clock?: boolean }) {
  return (
    <Stage>
      <rect width="1080" height="1440" fill={WALL} />
      <rect x="0" y="700" width="1080" height="170" fill={WALL_LOW} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={30 + i * 176} y="724" width="140" height="124" rx="8" fill="none" stroke="#d9c4a4" strokeWidth="6" />
      ))}
      <rect x="0" y="694" width="1080" height="12" fill={WOOD_LIGHT} />
      <Window x={620} y={230} w={360} h={360} />
      {clock ? <ClockIcon x={700} baseY={582} frame={frame} /> : null}
      <Plant x={120} y={694} scale={0.62} frame={frame} seed={4} />
      <PendantLamp x={400} length={70} frame={frame} seed={1} />
      <rect x="0" y="1100" width="1080" height="340" fill={FLOOR} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} x={(i % 2) * 140 + Math.floor(i / 2) * 280 - 140} y={1100 + (i % 2) * 84} width="140" height="84" fill="#d8c9b2" />
      ))}
      <rect x="0" y="1094" width="1080" height="12" fill="#cfc0a8" />
    </Stage>
  );
}

/** The round table by the window. Drawn in front of the characters. */
function TableTop({ children }: { children?: ReactNode }) {
  return (
    <g>
      <rect x={TABLE.cx - 26} y={TABLE.cy} width="52" height="200" fill={WOOD_DARK} />
      <ellipse cx={TABLE.cx} cy={TABLE.cy + 206} rx="110" ry="24" fill={WOOD_DARK} />
      <ellipse cx={TABLE.cx} cy={TABLE.cy + 14} rx={TABLE.rx} ry={TABLE.ry} fill={WOOD_DARK} />
      <ellipse cx={TABLE.cx} cy={TABLE.cy} rx={TABLE.rx} ry={TABLE.ry} fill={WOOD} />
      <ellipse cx={TABLE.cx} cy={TABLE.cy - 4} rx={TABLE.rx - 26} ry={TABLE.ry - 14} fill={WOOD_LIGHT} opacity="0.45" />
      {children}
    </g>
  );
}

// ---------------------------------------------------------------- hook

function HookScene({ frame }: { frame: number }) {
  const tip = tween(frame, 16, 36, 0, -20, EASE.out) + tween(frame, 58, 74, 0, 20, EASE.inOut);
  const walkX = tween(frame, 52, 118, 60, LEO_X, EASE.inOut);
  const youGesture = frame < 46 ? { g: "cup" as const, at: 0, from: "idle" as const } : { g: "raise" as const, at: 46, from: "cup" as const };
  return (
    <AbsoluteFill style={{ background: WALL }}>
      <Parallax
        frame={frame}
        from={0}
        to={120}
        zoom={1.05}
        originX={620}
        originY={1000}
        layers={[
          { depth: 0, children: <BackWall frame={frame} clock /> },
          {
            depth: 0.6,
            children: (
              <Stage>
                <Character who="leo" x={walkX} y={FEET} scale={1.04} facing={1} frame={frame} enter={50} walking mood="neutral" gesture="idle" />
                <Character who="you" x={YOU_X} y={FEET} scale={CH} facing={-1} frame={frame} enter={0} legs={false} mood="neutral" gesture={youGesture.g} gestureAt={youGesture.at} from={youGesture.from} />
                <TableTop>
                  <Saucer x={650} y={PROP_Y} scale={0.88} />
                  <g transform={`rotate(${tip} 650 ${PROP_Y})`}>
                    <Cup kind="mug" x={650} y={PROP_Y - 14} frame={frame} appear={0} scale={0.78} steam={false} />
                  </g>
                  <LastDrop frame={frame} from={26} x={610} y={PROP_Y - 86} />
                  <TipJar frame={frame} x={215} baseY={PROP_Y} scale={0.72} coins={2} />
                </TableTop>
              </Stage>
            ),
          },
        ]}
      />
      <KineticText frame={frame} from={8} text="Coffee finished." x={70} y={126} width={820} size={76} color={FAINT} stagger={6} />
      <KineticText frame={frame} from={44} text="Time to pay." x={70} y={266} width={620} size={104} color={ACCENT} targets={["Time to pay."]} targetColor={ACCENT} marker={SAFFRON} markerDelay={14} stagger={6} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- word beats

function TableScene({ frame }: { frame: number }) {
  // w1: the ordering frame loses "a tea" and gains "the bill".
  const teaOut = tween(frame, 160, 190, 0, 1, EASE.in);
  const billIn = springIn(frame, 192, { damping: 12, stiffness: 120 });
  // w2: the card taps the reader, then comes away so the tick shows.
  const tap = tween(frame, 402, 426, 0, 1, EASE.inOut);
  const cardBack = tween(frame, 438, 464, 0, 1, EASE.out);
  // w3: the cup moves aside and the note and coins land on the saucer.
  const cupAside = tween(frame, 556, 584, 0, 1, EASE.inOut);
  const cashIn = springIn(frame, 574, { damping: 11, stiffness: 140 });
  // w4: the change goes into the jar.
  const changeHeld = frame >= 744 && frame < 790;

  const leoGesture = frame < 248 ? { g: "idle" as const, at: 120, from: "idle" as const } : { g: "serve" as const, at: 248, from: "idle" as const };
  const youGesture = frame < 396
    ? { g: "idle" as const, at: 120, from: "idle" as const }
    : frame < 540
      ? { g: "point" as const, at: 396, from: "idle" as const }
      : frame < 752
        ? { g: "idle" as const, at: 540, from: "point" as const }
        : { g: "wave" as const, at: 752, from: "idle" as const };
  const youTalking = (frame > 148 && frame < 242) || (frame > 362 && frame < 440) || (frame > 766 && frame < 826);
  const leoMood = frame >= 790 ? "happy" as const : "neutral" as const;

  return (
    <AbsoluteFill style={{ background: WALL }}>
      <Parallax
        frame={frame}
        from={120}
        to={870}
        zoom={1.05}
        originX={540}
        originY={1000}
        layers={[
          { depth: 0, children: <BackWall frame={frame} /> },
          {
            depth: 0.6,
            children: (
              <Stage>
                <Character who="leo" x={LEO_X} y={FEET} scale={CH} facing={1} frame={frame} enter={120} legs={false} mood={leoMood} gesture={leoGesture.g} gestureAt={leoGesture.at} from={leoGesture.from} />
                <Character who="you" x={YOU_X} y={FEET} scale={CH} facing={-1} frame={frame} enter={120} legs={false} talking={youTalking} mood="neutral" gesture={youGesture.g} gestureAt={youGesture.at} from={youGesture.from} />
                <TableTop>
                  <Saucer x={650} y={PROP_Y} scale={0.88} />
                  <Cup kind="mug" x={lerp(650, 826, cupAside)} y={PROP_Y - 10} frame={frame} appear={120} scale={0.7} steam={false} />
                  <TipJar frame={frame} x={215} baseY={PROP_Y} scale={0.72} coins={2} clinkAt={frame >= 790 ? 812 : undefined} />

                  {/* w1: leo brings the folded bill and it opens on £3.50 */}
                  {frame < 340 ? (
                    <Bill frame={frame} appear={248} unfoldAt={272} x={HAND.x} baseY={HAND.y + 10} scale={0.92} tilt={-4} />
                  ) : (
                    <Bill frame={frame} appear={248} x={350} baseY={PROP_Y} scale={0.8} tilt={-8} />
                  )}

                  {/* w2: the reader in leo's hand, the card taps it */}
                  {frame >= 346 && frame < 556 ? (
                    <CardReader frame={frame} appear={346} x={HAND.x} baseY={HAND.y + 14} scale={0.92} tickAt={428} />
                  ) : null}
                  {frame >= 396 && frame < 490 ? (
                    <BankCard
                      x={lerp(620, HAND.x + 6, tap) + cardBack * 120}
                      y={lerp(856, 902, tap) - cardBack * 40}
                      rot={lerp(-16, -8, tap)}
                      scale={0.84}
                      opacity={1 - cardBack}
                    />
                  ) : null}

                  {/* w3: a note and two coins on the saucer */}
                  {frame >= 560 ? (
                    <g opacity={Math.min(1, cashIn * 1.6)} transform={`translate(${(1 - cashIn) * 240} 0)`}>
                      <Note x={624} y={PROP_Y - 18} rot={-5} scale={0.8} />
                      <Coin x={700} y={PROP_Y - 48} r={26} rot={12} />
                      <Coin x={742} y={PROP_Y - 28} r={26} rot={-24} />
                    </g>
                  ) : null}

                  {/* w4: the change held out, then tossed into the jar */}
                  {changeHeld ? <Coin x={HAND.x + 10} y={HAND.y - 6} r={26} /> : null}
                  <CoinToss frame={frame} from={790} to={814} x0={HAND.x + 10} y0={HAND.y - 6} x1={215} y1={PROP_Y - 150} />
                </TableTop>
              </Stage>
            ),
          },
        ]}
      />

      <WordCard frame={frame} />

      {/* w1: the ordering frame, with the tile swap inside the blank */}
      {frame < 336 ? (
        <>
          <SentenceFrame frame={frame} appear={132} label="same shape as ordering" />
          {teaOut < 1 ? (
            <Chip text="a tea" x={SLOT_MID - 95} y={SLOT.y} w={190} opacity={1 - teaOut} shift={-teaOut * 620} />
          ) : null}
          {frame >= 192 ? (
            <Chip text="the bill" x={SLOT_MID - 125} y={SLOT.y} w={250} shift={(1 - billIn) * 700} />
          ) : null}
        </>
      ) : null}

      {/* w2 and w4: the learner's line */}
      {frame >= 356 && frame < 532 ? (
        <SpeechBubble text="Can I pay by card?" targets={["by", "card"]} x={330} y={296} w={660} from={356} until={520} frame={frame} tail="right" size={52} />
      ) : null}
      {frame >= 758 && frame < 866 ? (
        <SpeechBubble text="Keep the change." targets={["Keep the change"]} x={370} y={296} w={620} from={758} until={856} frame={frame} tail="right" size={52} />
      ) : null}

      {/* w3: by card beside in cash, so the contrast is visible */}
      {frame >= 552 && frame < 716 ? (
        <>
          <Chip text="by card" x={295} y={520} w={230} accent={["by"]} scale={springIn(frame, 552, { damping: 10, stiffness: 200 })} />
          <Chip text="in cash" x={555} y={520} w={230} accent={["in"]} scale={springIn(frame, 566, { damping: 10, stiffness: 200 })} />
        </>
      ) : null}

      <Stage>
        <ClickMark frame={frame} at={214} x={SLOT_MID} y={SLOT.y + SLOT.h / 2} />
      </Stage>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- practise

function PractiseScene({ frame }: { frame: number }) {
  const words = PRACTISE_LINE.split(" ");
  const total = PRACTISE_LINE.length;
  let acc = 0;
  const reach = words.map((w) => {
    acc += w.length + 1;
    return 906 + (acc / total) * 112;
  });
  const circle = springIn(frame, 870, { damping: 11, stiffness: 120 });
  const yourTurn = frame >= 1040;
  const turn = springIn(frame, 1040, { damping: 9, stiffness: 160 });
  // After the learner's turn leo hands the bill over and the reader ticks.
  const hand = tween(frame, 1046, 1072, 0, 1, EASE.out);
  const tick = springIn(frame, 1058, { damping: 8, stiffness: 200 });
  return (
    <AbsoluteFill style={{ background: PRACTISE_BG }}>
      <Stage>
        <defs><clipPath id="int10-leo-clip"><circle cx="540" cy="430" r="300" /></clipPath></defs>
        <g transform={`translate(540 430) scale(${circle}) translate(-540 -430)`}>
          <circle cx="552" cy="444" r="300" fill={INK} />
          <circle cx="540" cy="430" r="300" fill="#fff" />
          <circle cx="540" cy="430" r="300" fill="none" stroke={SAFFRON} strokeWidth="14" />
          <g clipPath="url(#int10-leo-clip)">
            <Character who="leo" x={540} y={1160} scale={1.95} facing={1} frame={frame} enter={874} talking={frame > 884 && frame < 1030} mood="happy" gesture="raise" gestureAt={880} />
            <g transform={`translate(${lerp(0, -180, hand)} ${lerp(0, 300, hand)})`}>
              <Bill frame={frame} appear={884} x={716} baseY={462} scale={0.86} tilt={8} />
            </g>
          </g>
          {hand > 0.6 ? (
            <g transform={`translate(700 630) scale(${tick})`}>
              <circle r="52" fill={SEA} />
              <path d="M-22 2 L-6 18 L24 -16" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : null}
        </g>
        {yourTurn ? (
          <g transform={`translate(150 250) scale(${turn}) translate(-150 -250)`}>
            <Pulse frame={frame} x={150} y={250} size={120}>
              <g transform="translate(-30 -30) scale(2.5)" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" />
              </g>
            </Pulse>
            <text x="150" y="358" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="36" fill={INK}>Your turn</text>
          </g>
        ) : null}
      </Stage>
      <Eyebrow text="SAY IT WITH ME" x={0} y={788} align="center" frame={frame} from={880} />
      {PRACTISE_ROWS.map((count, row) => {
        const start = PRACTISE_ROWS.slice(0, row).reduce((a, b) => a + b, 0);
        return (
          <div
            key={row}
            style={{
              position: "absolute", left: 60, right: 60, top: 852 + row * 112,
              display: "flex", justifyContent: "center", columnGap: 24,
              fontSize: 96, fontWeight: 800, lineHeight: 1.15, zIndex: 0,
            }}
          >
            {words.slice(start, start + count).map((w, k) => {
              const i = start + k;
              const s = springIn(frame, reach[i], { damping: 8, stiffness: 220 });
              const on = frame >= reach[i];
              const colour = PRACTISE_COLOURS[i] ?? INK;
              return (
                <span
                  key={i}
                  style={{
                    position: "relative", display: "inline-block", color: on ? colour : FOG,
                    transform: `translateY(${on ? (1 - s) * -14 : 0}px) scale(${on ? 1 + (1 - s) * 0.18 : 1})`, zIndex: 0,
                  }}
                >
                  {w}
                  {colour === SAFFRON ? <Highlight frame={frame} from={reach[i]} color={ACCENT} opacity={0.2} /> : null}
                  {colour === ACCENT ? <Highlight frame={frame} from={reach[i]} color={SAFFRON} /> : null}
                </span>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- recap

function RecapScene({ frame }: { frame: number }) {
  const card = springIn(frame, 1086, { damping: 11, stiffness: 110 });
  const words = PRACTISE_LINE.split(" ");
  const miniText: CSSProperties = { fontSize: 34, fontWeight: 800, color: INK, lineHeight: 1 };
  return (
    <AbsoluteFill style={{ background: ACCENT }}>
      <Stage>
        <defs>
          <pattern id="int10-stripes" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="30" height="60" fill={PAPER} opacity="0.06" />
          </pattern>
        </defs>
        <rect width="1080" height="1440" fill="url(#int10-stripes)" />
        <BankCard x={300} y={900} rot={-9} scale={0.92 * springIn(frame, 1104, { damping: 10, stiffness: 180 })} />
        <Coin x={520} y={924} r={32} rot={10} scale={springIn(frame, 1112, { damping: 9, stiffness: 200 })} />
        <Coin x={596} y={948} r={32} rot={-18} scale={springIn(frame, 1118, { damping: 9, stiffness: 200 })} />
        <TipJar frame={frame} appear={1110} x={820} baseY={1000} scale={0.82} coins={3} />
      </Stage>
      <div style={{ position: "absolute", left: 80, top: 170, width: 920, transform: `scale(${card}) rotate(${(1 - card) * -4}deg)`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", inset: 0, transform: "translate(10px, 14px)", background: INK, borderRadius: 56 }} />
        <div style={{ position: "relative", background: "#fff", borderRadius: 56, padding: "42px 48px 48px", textAlign: "center" }}>
          <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: 6, color: FAINT }}>REMEMBER</div>
          {PRACTISE_ROWS.map((count, row) => {
            const start = PRACTISE_ROWS.slice(0, row).reduce((a, b) => a + b, 0);
            return (
              <div key={row} style={{ display: "flex", justifyContent: "center", columnGap: 20, fontSize: 84, fontWeight: 800, lineHeight: 1.14, marginTop: row === 0 ? 12 : 0 }}>
                {words.slice(start, start + count).map((w, k) => (
                  <span key={k} style={{ color: PRACTISE_COLOURS[start + k] ?? INK }}>{w}</span>
                ))}
              </div>
            );
          })}
          {/* the same blank takes either tile */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 30 }}>
            <span style={miniText}>Could I have</span>
            <span style={{ width: 150, height: 54, border: `4px dashed ${FOG}`, borderRadius: 18 }} />
            <span style={miniText}>, please?</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 22, fontSize: 36, fontWeight: 800 }}>
            {["a tea", "the bill"].map((t, i) => (
              <span
                key={t}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "14px 26px", border: `4px solid ${INK}`, borderRadius: 20,
                  color: i === 1 ? SAFFRON : INK, background: "#fff", boxShadow: "3px 5px 0 rgba(27,29,58,0.14)",
                  transform: `scale(${springIn(frame, 1098 + i * 8, { damping: 9, stiffness: 200 })})`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- composition

export function BillPleaseExplainer({ l1 }: { l1?: Record<string, string> }) {
  const frame = useCurrentFrame();
  const beat = int10BeatAt(frame);
  const progress = (frame - beat.from) / Math.max(1, Math.min(120, beat.to - beat.from));
  const k = karaoke(beat.line, Math.min(1, progress));
  const font: CSSProperties = { fontFamily: FONT };
  return (
    <AbsoluteFill style={{ ...font, background: PAPER, overflow: "hidden" }}>
      {beat.kind === "hook" ? <HookScene frame={frame} /> : null}
      {beat.kind === "word" ? <TableScene frame={frame} /> : null}
      {beat.kind === "practise" ? <PractiseScene frame={frame} /> : null}
      {beat.kind === "recap" ? <RecapScene frame={frame} /> : null}
      <Transition frame={frame} at={120} kind="wipe" color={SAFFRON} color2={INK} />
      <Transition frame={frame} at={870} kind="slide" color={ACCENT} color2={SAFFRON} />
      <Transition frame={frame} at={1080} kind="iris" color={ACCENT} color2={SAFFRON} cx={540} cy={620} />
      <CaptionBar line={beat.line} k={k} targets={beat.target} l1={l1?.[beat.id]} />
      <BeatProgress frame={frame} beats={INT10_BEATS} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- L1 captions

export const INT10_L1: Record<string, Record<string, string>> = {
  ar: {
    hook: "انتهت القهوة. وقت الدفع.",
    w1: "الفاتورة: الورقة التي فيها السعر.",
    w2: "الدفع بالبطاقة.",
    w3: "الدفع نقدًا: أوراق وعملات.",
    w4: "احتفظ بالباقي.",
    practise: "قلها معي.",
    recap: "هل يمكنني الحصول على الفاتورة، من فضلك؟",
  },
  es: {
    hook: "Café terminado. Hora de pagar.",
    w1: "The bill: el papel con el precio.",
    w2: "Pagar con tarjeta.",
    w3: "Pagar en efectivo: billetes y monedas.",
    w4: "Quédate con el cambio.",
    practise: "Dilo conmigo.",
    recap: "¿Me trae la cuenta, por favor?",
  },
  hi: {
    hook: "कॉफ़ी ख़त्म। भुगतान का समय।",
    w1: "The bill: दाम वाला काग़ज़।",
    w2: "कार्ड से भुगतान।",
    w3: "नक़द भुगतान: नोट और सिक्के।",
    w4: "बाक़ी पैसे आप रखें।",
    practise: "मेरे साथ बोलो।",
    recap: "क्या मुझे बिल मिल सकता है?",
  },
  ru: {
    hook: "Кофе выпит. Пора платить.",
    w1: "The bill: бумага с ценой.",
    w2: "Оплата картой.",
    w3: "Наличными: купюры и монеты.",
    w4: "Сдачи не надо.",
    practise: "Скажи со мной.",
    recap: "Можно счёт, пожалуйста?",
  },
  tr: {
    hook: "Kahve bitti. Ödeme zamanı.",
    w1: "The bill: fiyatın yazdığı kağıt.",
    w2: "Kartla ödemek.",
    w3: "Nakit ödemek: banknot ve bozuk para.",
    w4: "Üstü kalsın.",
    practise: "Benimle söyle.",
    recap: "Hesabı alabilir miyim, lütfen?",
  },
  zh: {
    hook: "咖啡喝完了。该付钱了。",
    w1: "The bill：写着价格的单子。",
    w2: "刷卡支付。",
    w3: "现金支付：纸币和硬币。",
    w4: "不用找零。",
    practise: "跟我一起说。",
    recap: "可以给我账单吗？",
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
  component: BillPleaseExplainer,
  beats: INT10_BEATS,
  duration: INT10_DURATION,
  fps: 30,
  width: 1080,
  height: 1440,
  l1: INT10_L1,
};
