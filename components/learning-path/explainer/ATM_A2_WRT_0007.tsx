"use client";

// "Where are you?" (ATM-A2-WRT-0007): a word tutorial built as a Remotion
// composition (3:4, 1080x1440, 30 fps, 39 s). Seven beats from
// docs/explainers/storyboards.md: hook, four word beats, practise aloud, recap.
// Single target: question order, question word then "are" then "you". Built on
// the shared kit in ./lib, on a small office set with a chat thread on a phone.
// Amira is a contact name only and is never drawn. Every value is a pure
// function of the frame, so the same component plays in the Player and renders
// deterministically to MP4.

import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { CSSProperties, ReactNode } from "react";
import {
  ACCENT, BeatProgress, CaptionBar, Character, EASE, Eyebrow, FAINT, FOG, FONT, Highlight, INK, karaoke,
  PAPER, Pulse, SAFFRON, SEA, Stage, Transition, springIn, tween, WOOD, WOOD_DARK, WOOD_LIGHT,
} from "./lib";

export const WRT7_FPS = 30;
export const WRT7_W = 1080;
export const WRT7_H = 1440;

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

export const WRT7_BEATS: Beat[] = [
  { id: "hook", kind: "hook", from: 0, to: 120, line: "Nine o'clock. Amira is not here." },
  { id: "w1", kind: "word", from: 120, to: 300, line: "Hi Amira. Start with Hi and the name.", target: ["Hi Amira"] },
  { id: "w2", kind: "word", from: 300, to: 540, line: "Where are you? Question word, then are, then you.", target: ["Where are you"] },
  { id: "w3", kind: "word", from: 540, to: 720, line: "Are you OK? Are first, then you.", target: ["Are you OK"] },
  { id: "w4", kind: "word", from: 720, to: 870, line: "See you soon. A friendly ending.", target: ["See you soon"] },
  { id: "practise", kind: "practise", from: 870, to: 1080, line: "Say it with me. Where are you? Are you OK?", target: ["Where are you", "Are you OK"], pauseAt: 1040 },
  { id: "recap", kind: "recap", from: 1080, to: 1170, line: "Where are you? Are you OK?", target: ["Where are you", "Are you OK"] },
];
export const WRT7_DURATION = 1170;

export function wrt7BeatAt(frame: number): Beat {
  return WRT7_BEATS.find((b) => frame >= b.from && frame < b.to) ?? WRT7_BEATS[WRT7_BEATS.length - 1];
}

// Office tones, kept inside the kit family: warm paper walls, wood furniture,
// the learner's own messages in saffron and Amira's in a quiet grey.
const WALL = "#f1e7d8";
const WALL_LOW = "#e7d9c2";
const FLOOR = "#ddcdb4";
const GREY_BUBBLE = "#e7e9f2";
const PHONE_SCREEN = "#f7f8fc";
const PHONE_BODY = "#2b2e52";

// The phone at full size, and the chat area inside it.
const PH = { x: 380, y: 262, w: 520, h: 878 };
const SCR = { x: 404, y: 286, w: 472, h: 830 };
const SCR_R = SCR.x + SCR.w - 24; // right text edge
const SCR_L = SCR.x + 24; // left text edge
const SCR_MID = SCR.x + SCR.w / 2;

// ---------------------------------------------------------------- small props

/** A wall clock whose hands can snap to a time and tick on from it. */
function WallClock({
  cx, cy, r, frame, hourDeg, minuteDeg, pulseAt,
}: {
  cx: number; cy: number; r: number; frame: number; hourDeg: number; minuteDeg: number; pulseAt?: number;
}) {
  const ring = pulseAt !== undefined ? tween(frame, pulseAt, pulseAt + 24, 0, 1, EASE.out) : 1;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 7} fill={INK} opacity="0.14" transform={`translate(5 7)`} />
      <circle cx={cx} cy={cy} r={r + 7} fill={WOOD_LIGHT} />
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={INK} strokeWidth={r * 0.05} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <line
          key={i}
          x1={cx} y1={cy - r * 0.86} x2={cx} y2={cy - r * (i % 3 === 0 ? 0.7 : 0.78)}
          stroke={INK} strokeWidth={i % 3 === 0 ? r * 0.07 : r * 0.035} strokeLinecap="round"
          transform={`rotate(${i * 30} ${cx} ${cy})`}
        />
      ))}
      <g transform={`rotate(${hourDeg} ${cx} ${cy})`}>
        <line x1={cx} y1={cy + r * 0.1} x2={cx} y2={cy - r * 0.46} stroke={INK} strokeWidth={r * 0.1} strokeLinecap="round" />
      </g>
      <g transform={`rotate(${minuteDeg} ${cx} ${cy})`}>
        <line x1={cx} y1={cy + r * 0.12} x2={cx} y2={cy - r * 0.68} stroke={ACCENT} strokeWidth={r * 0.075} strokeLinecap="round" />
      </g>
      <circle cx={cx} cy={cy} r={r * 0.08} fill={INK} />
      {pulseAt !== undefined && ring > 0 && ring < 1 ? (
        <circle cx={cx} cy={cy} r={r * (1 + ring * 0.6)} fill="none" stroke={SAFFRON} strokeWidth={10 * (1 - ring)} opacity={1 - ring} />
      ) : null}
    </g>
  );
}

/** A side-view office chair facing right. `ghost` draws the "not here" outline. */
function Chair({ x, baseY, scale = 1, ghost = false }: { x: number; baseY: number; scale?: number; ghost?: boolean }) {
  const line = ghost ? FAINT : WOOD_DARK;
  const fill = ghost ? "none" : WOOD;
  const dash = ghost ? "14 12" : undefined;
  return (
    <g transform={`translate(${x} ${baseY}) scale(${scale})`}>
      {!ghost ? <ellipse cx="6" cy="4" rx="96" ry="14" fill={INK} opacity="0.12" /> : null}
      <path d="M-88 -150 L-72 -150 L-62 -34 L-78 -34 Z" fill={fill} stroke={line} strokeWidth="6" strokeDasharray={dash} />
      <path d="M-92 -164 L62 -164 L62 -136 L-92 -136 Z" fill={fill} stroke={line} strokeWidth="6" strokeDasharray={dash} />
      <path d="M-96 -260 L-72 -260 L-62 -166 L-86 -166 Z" fill={fill} stroke={line} strokeWidth="6" strokeDasharray={dash} />
      <path d="M-98 -300 L-54 -300 L-54 -258 L-98 -258 Z" fill={fill} stroke={line} strokeWidth="6" strokeDasharray={dash} />
      <path d="M-70 -136 L-56 -4 L-76 -4 Z" fill={fill} stroke={line} strokeWidth="6" strokeDasharray={dash} />
      <path d="M44 -136 L58 -4 L38 -4 Z" fill={fill} stroke={line} strokeWidth="6" strokeDasharray={dash} />
    </g>
  );
}

/** A small puff of dust rising off the empty chair. */
function DustPuff({ frame, from, x, y }: { frame: number; from: number; x: number; y: number }) {
  const p = tween(frame, from, from + 46, 0, 1, EASE.out);
  if (p <= 0 || p >= 1) return null;
  return (
    <g opacity={Math.sin((1 - p) * Math.PI) * 0.9}>
      {[-1, 0, 1].map((k) => (
        <circle
          key={k}
          cx={x + k * 34 * p} cy={y - 70 * p - Math.abs(k) * 10}
          r={10 + p * 20} fill={FOG} opacity={0.55 - Math.abs(k) * 0.12}
        />
      ))}
    </g>
  );
}

/** A flat-vector waving hand, drawn as a prop next to the greeting. */
function WaveHand({ frame, from, x, y, size = 1 }: { frame: number; from: number; x: number; y: number; size?: number }) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 8, stiffness: 220 });
  const tilt = Math.sin((frame - from) / 3.2) * 12;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * size}) rotate(${tilt})`}>
      <rect x="-28" y="-6" width="56" height="52" rx="22" fill="#d9a071" />
      {[-21, -7, 7, 21].map((fx, i) => (
        <rect key={fx} x={fx - 7} y={-44 - (i === 1 || i === 2 ? 8 : 0)} width="14" height={44 + (i === 1 || i === 2 ? 8 : 0)} rx="7" fill="#d9a071" />
      ))}
      <rect x="22" y="-12" width="14" height="34" rx="7" fill="#d9a071" transform="rotate(38 22 6)" />
    </g>
  );
}

/** A small flat train, the icon on Amira's reply. */
function TrainIcon({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-40 -14 Q-40 -46 -8 -46 L40 -46 L40 -14 Z" fill={ACCENT} />
      <rect x="-34" y="-40" width="22" height="18" rx="4" fill={PHONE_SCREEN} />
      <rect x="-6" y="-40" width="20" height="18" rx="4" fill={PHONE_SCREEN} />
      <rect x="18" y="-40" width="18" height="18" rx="4" fill={PHONE_SCREEN} />
      <rect x="-44" y="-14" width="88" height="8" rx="4" fill={INK} />
      <circle cx="-22" cy="0" r="7" fill={INK} />
      <circle cx="22" cy="0" r="7" fill={INK} />
    </g>
  );
}

/** Three bobbing dots: Amira is typing. */
function TypingDots({ frame, from, until, x, y }: { frame: number; from: number; until: number; x: number; y: number }) {
  if (frame < from || frame >= until) return null;
  const s = springIn(frame, from, { damping: 10, stiffness: 180 });
  const out = tween(frame, until - 12, until, 1, 0, EASE.in);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * out})`} opacity={out}>
      <rect x="0" y="-46" width="150" height="92" rx="34" fill={GREY_BUBBLE} stroke={INK} strokeWidth="4" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={40 + i * 36} cy={Math.sin((frame - from) / 4 + i * 1.1) * 8} r="11" fill={FAINT} />
      ))}
    </g>
  );
}

// ---------------------------------------------------------------- chat thread

type Side = "me" | "them";

/**
 * A chat bubble in the thread. `cps` types the text in character by character;
 * `lift` and `fade` let a bubble be handed over from the word tiles.
 */
function ChatBubble({
  frame, from, lines, side, baseY, w, accent = [], cps, scale = 1,
}: {
  frame: number; from: number; lines: string[]; side: Side; baseY: number; w: number;
  accent?: string[]; cps?: number; scale?: number;
}) {
  if (frame < from) return null;
  const s = springIn(frame, from, { damping: 9, stiffness: 200 });
  const h = 34 + lines.length * 52;
  const x = side === "me" ? SCR_R - w : SCR_L;
  const fill = side === "me" ? SAFFRON : GREY_BUBBLE;
  const total = lines.join(" ").length;
  const typed = cps ? Math.floor((frame - from) * cps) : total;
  let seen = 0;
  const caret = cps !== undefined && typed < total;
  return (
    <g transform={`translate(${x + w / 2} ${baseY + h / 2}) scale(${s * scale}) translate(${-(x + w / 2)} ${-(baseY + h / 2)})`}>
      <rect x={x} y={baseY} width={w} height={h} rx="30" fill={INK} opacity="0.14" transform="translate(5 7)" />
      <rect x={x} y={baseY} width={w} height={h} rx="30" fill={fill} stroke={INK} strokeWidth="4" />
      {lines.map((ln, i) => {
        const start = seen;
        seen += ln.length + 1;
        const shown = cps ? ln.slice(0, Math.max(0, typed - start)) : ln;
        const words = shown.split(" ");
        return (
          <text
            key={i} x={x + 26} y={baseY + 58 + i * 52}
            fontFamily={FONT} fontWeight="700" fontSize="40" fill={INK}
          >
            {words.map((wd, k) => (
              <tspan key={k} fill={accent.includes(wd.replace(/[.,?!]/g, "")) ? ACCENT : INK} fontWeight={accent.includes(wd.replace(/[.,?!]/g, "")) ? 800 : 700}>
                {k ? " " : ""}{wd}
              </tspan>
            ))}
            {caret && Math.floor(frame / 8) % 2 === 0 && i === lines.length - 1 ? <tspan fill={INK}>|</tspan> : null}
          </text>
        );
      })}
    </g>
  );
}

/** The phone body, header and thread. Drawn at full size; the scene scales it. */
function Phone({ frame, children }: { frame: number; children?: ReactNode }) {
  const screenOn = tween(frame, 128, 162, 0, 1, EASE.out);
  return (
    <g>
      <rect x={PH.x + 10} y={PH.y + 14} width={PH.w} height={PH.h} rx="56" fill={INK} opacity="0.18" />
      <rect x={PH.x} y={PH.y} width={PH.w} height={PH.h} rx="56" fill={PHONE_BODY} />
      <rect x={PH.x} y={PH.y} width={PH.w} height={PH.h} rx="56" fill="none" stroke={INK} strokeWidth="6" />
      <rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} rx="34" fill={PHONE_SCREEN} />
      <g opacity={screenOn}>
        {/* chat header: Amira is a name on the phone, never a drawn face */}
        <path d={`M${SCR.x} ${SCR.y + 34} a34 34 0 0 1 34 -34 h${SCR.w - 68} a34 34 0 0 1 34 34 v70 h${-SCR.w} Z`} fill={ACCENT} />
        <circle cx={SCR.x + 60} cy={SCR.y + 56} r="30" fill={PAPER} />
        <text x={SCR.x + 60} y={SCR.y + 70} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="34" fill={ACCENT}>A</text>
        <text x={SCR.x + 104} y={SCR.y + 70} fontFamily={FONT} fontWeight="800" fontSize="40" fill={PAPER}>Amira</text>
        {children}
      </g>
      <rect x={SCR_MID - 70} y={PH.y + PH.h - 32} width="140" height="9" rx="5" fill={PAPER} opacity="0.5" />
    </g>
  );
}

// ---------------------------------------------------------------- word tiles

type Tile = { id: string; text: string; w: number; accent?: boolean };

const TILE_H = 76;
const TILE_Y = 966;
const TILE_FONT = 38;
const GAP = 10;
const QM_W = 40;

/** A rounded ink-outline word tile, the same chip the sentence_build item uses. */
function WordTile({
  frame, appear, x, y, t, hop,
}: {
  frame: number; appear: number; x: number; y: number; t: Tile; hop?: number;
}) {
  if (frame < appear) return null;
  const s = springIn(frame, appear, { damping: 9, stiffness: 210 });
  const wobble = hop ? Math.sin(hop * Math.PI * 2) * 3 : 0;
  return (
    <g transform={`translate(${x + t.w / 2} ${y + TILE_H / 2}) scale(${s}) rotate(${wobble}) translate(${-(x + t.w / 2)} ${-(y + TILE_H / 2)})`}>
      <rect x={x} y={y} width={t.w} height={TILE_H} rx="22" fill={INK} opacity="0.13" transform="translate(4 6)" />
      <rect x={x} y={y} width={t.w} height={TILE_H} rx="22" fill="#fff" stroke={INK} strokeWidth="5" />
      <text
        x={x + t.w / 2} y={y + TILE_H / 2 + 14} textAnchor="middle"
        fontFamily={FONT} fontWeight="800" fontSize={TILE_FONT} fill={t.accent ? ACCENT : INK}
      >
        {t.text}
      </text>
    </g>
  );
}

/** The question mark that droops like a wilting stem, then stands up with a ping. */
function QuestionMark({
  frame, standAt, x, y, size = 46, colour = INK,
}: {
  frame: number; standAt: number; x: number; y: number; size?: number; colour?: string;
}) {
  const up = springIn(frame, standAt, { damping: 7, stiffness: 190 });
  const droop = 1 - up;
  const ring = tween(frame, standAt, standAt + 26, 0, 1, EASE.out);
  return (
    <g>
      <g transform={`translate(${x} ${y}) rotate(${droop * 42}) translate(${droop * 4} ${droop * 8})`}>
        <text
          x="0" y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="800"
          fontSize={size} fill={colour}
        >
          ?
        </text>
      </g>
      {frame >= standAt && ring < 1 ? (
        <circle cx={x} cy={y} r={size * 0.5 * (1 + ring * 1.5)} fill="none" stroke={SEA} strokeWidth={7 * (1 - ring)} opacity={1 - ring} />
      ) : null}
    </g>
  );
}

/** A faint label under a tile, one word per line so it never runs past the tile. */
function TileLabel({ frame, from, cx, words }: { frame: number; from: number; cx: number; words: string[] }) {
  const o = tween(frame, from, from + 16, 0, 1, EASE.out);
  if (o <= 0) return null;
  return (
    <g opacity={o} transform={`translate(0 ${(1 - o) * 10})`}>
      {words.map((wd, i) => (
        <text
          key={wd} x={cx} y={TILE_Y + TILE_H + 32 + i * 28} textAnchor="middle"
          fontFamily={FONT} fontWeight="700" fontSize="24" fill={FAINT}
        >
          {wd}
        </text>
      ))}
    </g>
  );
}

// w2: three tiles arrive as "Where you are?" and "are" hops into the middle.
const W2_WRONG: Tile[] = [
  { id: "where", text: "Where", w: 148 },
  { id: "you", text: "you", w: 104 },
  { id: "are", text: "are", w: 100, accent: true },
];
// w3: "you Are OK?" and "Are" hops to the front, the same move as w2.
const W3_WRONG: Tile[] = [
  { id: "you", text: "you", w: 104 },
  { id: "are", text: "Are", w: 100, accent: true },
  { id: "ok", text: "OK", w: 92 },
];

/** Left edges for a row of tiles plus the question mark, centred in the screen. */
function rowLayout(tiles: Tile[]): { xs: number[]; qx: number; x0: number } {
  const total = tiles.reduce((a, t) => a + t.w, 0) + GAP * (tiles.length - 1) + 6 + QM_W;
  const x0 = SCR_MID - total / 2;
  const xs: number[] = [];
  let x = x0;
  for (const t of tiles) {
    xs.push(x);
    x += t.w + GAP;
  }
  return { xs, qx: x - GAP + 6 + QM_W / 2, x0 };
}

/**
 * One tile row: the wrong order arrives, the "are" tile hops into place over
 * the tile beside it, the labels fade in, then the row flies up into the
 * sent bubble. `order` gives the tile ids in the right order.
 */
function TileRow({
  frame, appear, tiles, order, hopAt, standAt, labelAt, sendAt, labels, liftTo,
}: {
  frame: number; appear: number; tiles: Tile[]; order: string[]; hopAt: number; standAt: number;
  labelAt: number; sendAt: number; labels: Record<string, string[]>; liftTo: number;
}) {
  const wrong = rowLayout(tiles);
  const right = rowLayout(order.map((id) => tiles.find((t) => t.id === id) as Tile));
  const move = tween(frame, hopAt, hopAt + 32, 0, 1, EASE.inOut);
  const hopArc = Math.sin(Math.max(0, Math.min(1, move)) * Math.PI);
  const send = tween(frame, sendAt, sendAt + 20, 0, 1, EASE.in);
  if (frame < appear || send >= 1) return null;

  return (
    <g opacity={1 - send} transform={`translate(0 ${-liftTo * send}) scale(${1 - send * 0.12}) translate(0 ${liftTo * send * 0})`}>
      {tiles.map((t, i) => {
        const to = right.xs[order.indexOf(t.id)];
        const from = wrong.xs[i];
        const x = from + (to - from) * move;
        const isHopper = !!t.accent;
        const y = TILE_Y - (isHopper ? hopArc * 92 : 0);
        return (
          <g key={t.id}>
            {isHopper && hopArc > 0.05 ? (
              <g opacity={hopArc * 0.5}>
                <line x1={x - 16} y1={y + 10} x2={x - 42} y2={y + 34} stroke={FAINT} strokeWidth="5" strokeLinecap="round" />
                <line x1={x - 10} y1={y + 44} x2={x - 38} y2={y + 62} stroke={FAINT} strokeWidth="5" strokeLinecap="round" />
              </g>
            ) : null}
            <WordTile frame={frame} appear={appear + i * 10} x={x} y={y} t={t} hop={isHopper ? hopArc : 0} />
          </g>
        );
      })}
      <QuestionMark frame={frame} standAt={standAt} x={wrong.qx} y={TILE_Y + TILE_H / 2} size={52} />
      {order.map((id, i) => {
        const t = tiles.find((tt) => tt.id === id) as Tile;
        const words = labels[id];
        if (!words) return null;
        return <TileLabel key={id} frame={frame} from={labelAt + i * 8} cx={right.xs[i] + t.w / 2} words={words} />;
      })}
    </g>
  );
}

// ---------------------------------------------------------------- word card

type Card = { from: number; to: number; text: string; accent?: string };

const CARDS: Card[] = [
  { from: 126, to: 300, text: "Hi Amira" },
  { from: 304, to: 540, text: "Where are you?", accent: "are" },
  { from: 544, to: 720, text: "Are you OK?", accent: "Are" },
  { from: 724, to: 870, text: "See you soon" },
];

/** The word card at the top of every word beat. One card at a time. */
function WordCard({ frame }: { frame: number }) {
  return (
    <g>
      {CARDS.map((c) => {
        const o = tween(frame, c.from, c.from + 12, 0, 1, EASE.out) * (1 - tween(frame, c.to - 10, c.to, 0, 1, EASE.in));
        if (o <= 0.01) return null;
        const words = c.text.split(" ");
        return (
          <g key={c.text} opacity={o} transform={`translate(0 ${(1 - o) * -16})`}>
            <rect x="155" y="104" width="700" height="128" rx="38" fill={INK} opacity="0.16" />
            <rect x="150" y="96" width="700" height="128" rx="38" fill="#fff" stroke={INK} strokeWidth="6" />
            <text x="500" y="182" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="62" fill={INK}>
              {words.map((wd, i) => (
                <tspan key={i} fill={c.accent && wd.replace(/[?.]/g, "") === c.accent ? ACCENT : INK}>
                  {i ? " " : ""}{wd}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// ---------------------------------------------------------------- office + phone

/**
 * One continuous take for the hook and the four word beats: the office, then
 * the phone grows and the room falls away so the thread has the frame.
 */
function OfficeScene({ frame }: { frame: number }) {
  // the room hands over to the focus background while the phone grows
  const focus = tween(frame, 104, 148, 0, 1, EASE.inOut);
  const grow = tween(frame, 88, 148, 0, 1, EASE.inOut);

  // the clock snaps to 9:00, then ticks on five minutes in w4
  const snap = springIn(frame, 16, { damping: 6, stiffness: 300 });
  const ticks = Math.floor(tween(frame, 800, 832, 0, 5.999, EASE.inOut));
  const minuteDeg = -34 + 34 * snap + ticks * 6;
  const hourDeg = -102 + 12 * snap + ticks * 0.5;

  // you walks the phone up: they shrink and slide left as it fills the frame
  const youX = 700 + (215 - 700) * focus;
  const youY = 1290 + (1140 - 1290) * focus;
  const youScale = 1.5 + (1.02 - 1.5) * focus;
  const relief = tween(frame, 806, 836, 0, 12, EASE.out);
  const facing: 1 | -1 = frame < 112 || (frame >= 676 && frame < 714) ? -1 : 1;

  const youGesture =
    frame < 76
      ? { g: "think" as const, at: 34, from: "idle" as const }
      : frame < 806
        ? { g: "raise" as const, at: 76, from: "think" as const }
        : { g: "listen" as const, at: 806, from: "raise" as const };
  const youMood =
    frame < 30 ? ("neutral" as const)
      : frame < 120 ? ("think" as const)
        : frame >= 790 ? ("happy" as const)
          : frame >= 300 && frame < 440 ? ("think" as const)
            : frame >= 676 && frame < 714 ? ("think" as const)
              : ("neutral" as const);

  const phoneCx = 690 + (640 - 690) * grow;
  const phoneCy = 1020 + (701 - 1020) * grow;
  const phoneS = 0.26 + (1 - 0.26) * grow;

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {/* the office, which fades out as the phone takes the frame */}
      <Stage style={{ opacity: 1 - focus }}>
        <rect width="1080" height="1440" fill={WALL} />
        <rect x="0" y="986" width="1080" height="26" fill={WALL_LOW} />
        <rect x="0" y="1012" width="1080" height="428" fill={FLOOR} />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={-120 + i * 280} y1="1440" x2={60 + i * 280} y2="1012" stroke="#d2c0a4" strokeWidth="6" />
        ))}
        <WallClock cx={780} cy={330} r={130} frame={frame} hourDeg={hourDeg} minuteDeg={minuteDeg} pulseAt={16} />
        <Chair x={300} baseY={1070} scale={1.1} />
        <DustPuff frame={frame} from={30} x={248} y={944} />
        {/* the desk you sit at; it hides the legs so you read as seated */}
        <rect x="-40" y="1150" width="1160" height="40" rx="14" fill={WOOD_LIGHT} />
        <rect x="-40" y="1190" width="1160" height="18" fill={WOOD_DARK} />
        <rect x="60" y="1208" width="34" height="232" fill={WOOD} />
        <rect x="960" y="1208" width="34" height="232" fill={WOOD} />
      </Stage>

      {/* the focus ground the word beats play on */}
      <Stage style={{ opacity: focus }}>
        <defs>
          <pattern id="wrt7-dots" width="46" height="46" patternUnits="userSpaceOnUse">
            <circle cx="23" cy="23" r="3" fill={INK} opacity="0.07" />
          </pattern>
        </defs>
        <rect width="1080" height="1440" fill={PAPER} />
        <rect width="1080" height="1440" fill="url(#wrt7-dots)" />
        <WallClock cx={960} cy={166} r={62} frame={frame} hourDeg={hourDeg} minuteDeg={minuteDeg} pulseAt={800} />
        <WordCard frame={frame} />
      </Stage>

      {/* you: at the desk in the hook, beside the phone for the word beats */}
      <Stage>
        {frame >= 676 && frame < 714 ? (
          <g opacity={tween(frame, 676, 692, 0, 1, EASE.out) * (1 - tween(frame, 704, 714, 0, 1, EASE.in))}>
            <Chair x={132} baseY={1130} scale={0.5} ghost />
          </g>
        ) : null}
        <g transform={`translate(0 ${relief})`}>
          <Character
            who="you" x={youX} y={youY} scale={youScale} facing={facing} frame={frame} enter={0} slideFrom={-60}
            mood={youMood} gesture={youGesture.g} gestureAt={youGesture.at} from={youGesture.from} seed={4}
          />
        </g>
      </Stage>

      {/* the phone: picked up in the hook, then the stage for every word beat */}
      {frame >= 88 ? (
        <Stage>
          <g transform={`translate(${phoneCx - 640} ${phoneCy - 701}) translate(640 701) scale(${phoneS * springIn(frame, 88, { damping: 11, stiffness: 180 })}) translate(-640 -701)`}>
            <Phone frame={frame}>
              {/* w1: the greeting types itself in */}
              <ChatBubble frame={frame} from={186} lines={["Hi Amira."]} side="me" baseY={420} w={262} cps={0.55} />
              <WaveHand frame={frame} from={232} x={508} y={498} size={0.72} />
              {frame >= 252 ? (
                <g opacity={tween(frame, 252, 268, 0, 1, EASE.out)}>
                  <text x={SCR_R} y="546" textAnchor="end" fontFamily={FONT} fontWeight="700" fontSize="26" fill={FAINT}>Hi + name</text>
                </g>
              ) : null}
              {/* w2: the question the learner is here for */}
              <ChatBubble frame={frame} from={508} lines={["Where are you?"]} side="me" baseY={578} w={360} accent={["are"]} />
              {/* w3: the same rule, said again */}
              <ChatBubble frame={frame} from={672} lines={["Are you OK?"]} side="me" baseY={700} w={300} accent={["Are"]} />
              {/* w4: Amira answers */}
              <TypingDots frame={frame} from={744} until={790} x={SCR_L} y={868} />
              <ChatBubble frame={frame} from={790} lines={["On the metro.", "See you soon."]} side="them" baseY={822} w={330} />
              {frame >= 812 ? (
                <g transform={`scale(${springIn(frame, 812, { damping: 8, stiffness: 220 })})`} style={{ transformOrigin: "812px 912px" }}>
                  <TrainIcon x={806} y={930} scale={0.78} />
                </g>
              ) : null}
              {/* the compose area: tiles in the wrong order, put right */}
              {frame >= 170 && frame < 300 ? (
                <g opacity={tween(frame, 170, 186, 0, 1, EASE.out) * (1 - tween(frame, 288, 300, 0, 1, EASE.in))}>
                  <rect x={SCR_L} y={TILE_Y} width={SCR.w - 48} height={TILE_H} rx="22" fill="#fff" stroke={FOG} strokeWidth="4" />
                  <rect
                    x={SCR_L + 26} y={TILE_Y + 18} width="4" height="40"
                    fill={INK} opacity={Math.floor(frame / 8) % 2 ? 0.9 : 0.1}
                  />
                </g>
              ) : null}
              {frame >= 330 && frame < 540 ? (
                <TileRow
                  frame={frame} appear={330} tiles={W2_WRONG} order={["where", "are", "you"]}
                  hopAt={400} standAt={440} labelAt={460} sendAt={500} liftTo={388}
                  labels={{ where: ["question", "word"], are: ["are"], you: ["you"] }}
                />
              ) : null}
              {frame >= 566 && frame < 720 ? (
                <TileRow
                  frame={frame} appear={566} tiles={W3_WRONG} order={["are", "you", "ok"]}
                  hopAt={612} standAt={650} labelAt={662} sendAt={664} liftTo={266}
                  labels={{ are: ["are"], you: ["you"] }}
                />
              ) : null}
            </Phone>
          </g>
        </Stage>
      ) : null}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- practise

const P_LINES = [
  { text: "Where are you?", accent: [1] },
  { text: "Are you OK?", accent: [0] },
];
const KAR_FROM = 930;
const KAR_TO = 1030;

function PractiseScene({ frame }: { frame: number }) {
  const circle = springIn(frame, 872, { damping: 11, stiffness: 120 });
  const words = P_LINES.flatMap((l, li) => l.text.split(" ").map((w, wi) => ({ w, li, wi })));
  const chars = words.reduce((a, x) => a + x.w.length + 1, 0);
  let acc = 0;
  const reach = words.map((x) => {
    acc += x.w.length + 1;
    return KAR_FROM + (acc / chars) * (KAR_TO - KAR_FROM);
  });
  const yourTurn = frame >= 1040;
  const turn = springIn(frame, 1040, { damping: 9, stiffness: 160 });
  const resumed = frame >= 1046;
  const youGesture = frame < 1044 ? { g: "raise" as const, at: 886, from: "idle" as const } : { g: "thumbs" as const, at: 1046, from: "raise" as const };

  return (
    <AbsoluteFill style={{ background: "#eaf1fb" }}>
      <Stage>
        <defs><clipPath id="wrt7-you"><circle cx="540" cy="420" r="290" /></clipPath></defs>
        <g transform={`translate(540 420) scale(${circle}) translate(-540 -420)`}>
          <circle cx="552" cy="434" r="290" fill={INK} />
          <circle cx="540" cy="420" r="290" fill="#fff" />
          <circle cx="540" cy="420" r="290" fill="none" stroke={SAFFRON} strokeWidth="14" />
          <g clipPath="url(#wrt7-you)">
            <Character
              who="you" x={540} y={1170} scale={2} facing={1} frame={frame} enter={876}
              mood={resumed ? "happy" : "neutral"} gesture={youGesture.g} gestureAt={youGesture.at} from={youGesture.from} seed={4}
            />
            {/* the phone held up, the one the thread was typed on */}
            <g transform={`rotate(-7 750 365)`}>
              <rect x="705" y="285" width="90" height="160" rx="18" fill={PHONE_BODY} stroke={INK} strokeWidth="5" />
              <rect x="714" y="298" width="72" height="134" rx="10" fill={PHONE_SCREEN} />
              <rect x="736" y="308" width="42" height="26" rx="10" fill={SAFFRON} />
              <rect x="722" y="344" width="40" height="24" rx="10" fill={GREY_BUBBLE} />
              <rect x="736" y="378" width="42" height="26" rx="10" fill={SAFFRON} />
            </g>
          </g>
        </g>
        {yourTurn && !resumed ? (
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

      <Eyebrow text="SAY IT WITH ME" x={0} y={722} align="center" frame={frame} from={896} />
      {P_LINES.map((l, li) => {
        const ws = l.text.split(" ");
        return (
          <div
            key={l.text}
            style={{
              position: "absolute", left: 60, right: 60, top: 790 + li * 118, display: "flex", flexWrap: "wrap",
              justifyContent: "center", columnGap: 22, fontSize: 88, fontWeight: 800, lineHeight: 1.12, zIndex: 0,
            }}
          >
            {ws.map((w, i) => {
              const idx = words.findIndex((x) => x.li === li && x.wi === i);
              const s = springIn(frame, reach[idx], { damping: 8, stiffness: 220 });
              const on = frame >= reach[idx];
              const target = l.accent.includes(i);
              const last = i === ws.length - 1;
              return (
                <span
                  key={i}
                  style={{
                    position: "relative", display: "inline-block",
                    color: on ? (target ? ACCENT : INK) : FOG,
                    transform: `translateY(${on ? (1 - s) * -14 : 0}px) scale(${on ? 1 + (1 - s) * 0.16 : 1})`,
                    zIndex: 0,
                  }}
                >
                  {/* on resume the question marks ping leaf green */}
                  {last && resumed ? (
                    <span style={{ color: SEA }}>
                      {w.slice(0, -1)}
                      <span style={{ display: "inline-block", transform: `scale(${1 + 0.3 * (1 - springIn(frame, 1046 + li * 8, { damping: 7, stiffness: 240 }))})` }}>?</span>
                    </span>
                  ) : (
                    w
                  )}
                  {target ? <Highlight frame={frame} from={reach[idx] + 8} color={SAFFRON} /> : null}
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

const SLOTS: { label: string; w: number }[] = [
  { label: "question word", w: 376 },
  { label: "are", w: 200 },
  { label: "you", w: 200 },
];

function RecapScene({ frame }: { frame: number }) {
  const a = springIn(frame, 1086, { damping: 11, stiffness: 110 });
  let sx = (1080 - (376 + 200 + 200 + 40)) / 2;
  return (
    <AbsoluteFill style={{ background: ACCENT }}>
      <Stage>
        <defs>
          <pattern id="wrt7-stripes" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="30" height="60" fill={PAPER} opacity="0.06" />
          </pattern>
        </defs>
        <rect width="1080" height="1440" fill="url(#wrt7-stripes)" />

        {/* the three-slot shape: question word, are, you */}
        {SLOTS.map((s, i) => {
          const x = sx;
          sx += s.w + 20;
          const sp = springIn(frame, 1118 + i * 10, { damping: 9, stiffness: 190 });
          return (
            <g key={s.label} transform={`translate(${x + s.w / 2} 836) scale(${sp}) translate(${-(x + s.w / 2)} -836)`}>
              <rect x={x} y="772" width={s.w} height="128" rx="34" fill="none" stroke={SAFFRON} strokeWidth="7" strokeDasharray="18 14" />
              <text x={x + s.w / 2} y="854" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize={i ? 50 : 38} fill={PAPER}>
                {s.label}
              </text>
            </g>
          );
        })}

        {/* the thread shrinks into the corner */}
        <g transform={`translate(888 1046) scale(${springIn(frame, 1140, { damping: 9, stiffness: 180 })}) translate(-888 -1046)`}>
          <rect x="828" y="952" width="120" height="196" rx="24" fill={PHONE_BODY} stroke={PAPER} strokeWidth="5" />
          <rect x="838" y="968" width="100" height="164" rx="14" fill={PHONE_SCREEN} />
          <rect x="844" y="974" width="88" height="22" rx="8" fill={ACCENT} />
          <rect x="876" y="1006" width="56" height="26" rx="11" fill={SAFFRON} />
          <rect x="844" y="1042" width="52" height="26" rx="11" fill={GREY_BUBBLE} />
          <rect x="876" y="1078" width="56" height="26" rx="11" fill={SAFFRON} />
        </g>
      </Stage>

      <div
        style={{
          position: "absolute", left: 72, right: 72, top: 236,
          transform: `scale(${a}) rotate(${(1 - a) * -5}deg)`, transformOrigin: "50% 50%",
        }}
      >
        <div style={{ position: "absolute", inset: 0, transform: "translate(10px, 14px)", background: INK, borderRadius: 56 }} />
        <div style={{ position: "relative", background: "#fff", borderRadius: 56, padding: "44px 48px 50px", textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 6, color: FAINT }}>REMEMBER</div>
          <div style={{ fontSize: 78, fontWeight: 800, color: INK, lineHeight: 1.14, marginTop: 16 }}>
            Where{" "}
            <span style={{ position: "relative", display: "inline-block", color: ACCENT, zIndex: 0 }}>
              are
              <Highlight frame={frame} from={1114} color={SAFFRON} />
            </span>{" "}
            you?
          </div>
          <div style={{ fontSize: 78, fontWeight: 800, color: INK, lineHeight: 1.14, marginTop: 6 }}>
            <span style={{ position: "relative", display: "inline-block", color: ACCENT, zIndex: 0 }}>
              Are
              <Highlight frame={frame} from={1126} color={SAFFRON} />
            </span>{" "}
            you OK?
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- composition

export function WhereAreYouExplainer({ l1 }: { l1?: Record<string, string> }) {
  const frame = useCurrentFrame();
  const beat = wrt7BeatAt(frame);
  const progress = (frame - beat.from) / Math.max(1, Math.min(120, beat.to - beat.from));
  const k = karaoke(beat.line, Math.min(1, progress));
  const font: CSSProperties = { fontFamily: FONT };
  return (
    <AbsoluteFill style={{ ...font, background: PAPER, overflow: "hidden" }}>
      {beat.kind === "hook" || beat.kind === "word" ? <OfficeScene frame={frame} /> : null}
      {beat.kind === "practise" ? <PractiseScene frame={frame} /> : null}
      {beat.kind === "recap" ? <RecapScene frame={frame} /> : null}
      <Transition frame={frame} at={870} kind="slide" color={ACCENT} color2={SAFFRON} />
      <Transition frame={frame} at={1080} kind="wipe" color={SAFFRON} color2={INK} />
      <CaptionBar line={beat.line} k={k} targets={beat.target} l1={l1?.[beat.id]} />
      <BeatProgress frame={frame} beats={WRT7_BEATS} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- L1 captions
export const WRT7_L1: Record<string, Record<string, string>> = {
  ar: {
    hook: "الساعة التاسعة. أميرة ليست هنا.",
    w1: "ابدأ بـ Hi والاسم.",
    w2: "أين أنت؟ كلمة السؤال، ثم are، ثم you.",
    w3: "هل أنت بخير؟ Are أولًا ثم you.",
    w4: "أراك قريبًا. خاتمة ودّية.",
    practise: "قلها معي.",
    recap: "أين أنت؟ هل أنت بخير؟",
  },
  es: {
    hook: "Las nueve. Amira no está.",
    w1: "Empieza con Hi y el nombre.",
    w2: "¿Dónde estás? Palabra interrogativa, are, you.",
    w3: "¿Estás bien? Are primero, luego you.",
    w4: "Hasta pronto. Un final amistoso.",
    practise: "Dilo conmigo.",
    recap: "¿Dónde estás? ¿Estás bien?",
  },
  hi: {
    hook: "नौ बजे। अमीरा यहाँ नहीं है।",
    w1: "Hi और नाम से शुरू करें।",
    w2: "तुम कहाँ हो? प्रश्न शब्द, फिर are, फिर you।",
    w3: "तुम ठीक हो? पहले Are, फिर you।",
    w4: "जल्द मिलते हैं। दोस्ताना अंत।",
    practise: "मेरे साथ बोलो।",
    recap: "तुम कहाँ हो? तुम ठीक हो?",
  },
  ru: {
    hook: "Девять часов. Амиры нет.",
    w1: "Начни с Hi и имени.",
    w2: "Где ты? Вопрос, потом are, потом you.",
    w3: "Ты в порядке? Сначала are, потом you.",
    w4: "До скорого. Дружеское окончание.",
    practise: "Скажи со мной.",
    recap: "Где ты? Ты в порядке?",
  },
  tr: {
    hook: "Saat dokuz. Amira burada değil.",
    w1: "Hi ve isimle başla.",
    w2: "Neredesin? Soru kelimesi, are, you.",
    w3: "İyi misin? Önce are, sonra you.",
    w4: "Görüşürüz. Samimi bir kapanış.",
    practise: "Benimle söyle.",
    recap: "Neredesin? İyi misin?",
  },
  zh: {
    hook: "九点了。Amira 不在。",
    w1: "用 Hi 加名字开头。",
    w2: "你在哪里？疑问词、are、you。",
    w3: "你还好吗？先 are，再 you。",
    w4: "回头见。友好的结尾。",
    practise: "跟我一起说。",
    recap: "你在哪里？你还好吗？",
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
  component: WhereAreYouExplainer,
  beats: WRT7_BEATS,
  duration: WRT7_DURATION,
  fps: WRT7_FPS,
  width: WRT7_W,
  height: WRT7_H,
  l1: WRT7_L1,
};
