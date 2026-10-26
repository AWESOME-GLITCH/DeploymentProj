"use client";

// "Yesterday, today, tomorrow" (ATM-A2-GRM-0003): a 2D flat-vector
// motion-graphics explainer built as a Remotion composition (3:4, 1080x1440,
// 30 fps, 50 s). Seven beats from docs/explainers/storyboards.md: hook, three
// notices along a road-style timeline, explain, practise aloud, recap.
// Single target: the time word first, then the regular verb changes,
// worked / work / will work.
// Built on the shared kit in ./lib; every value is a pure function of the
// frame, so the same component plays in the Remotion Player and renders
// deterministically to MP4.

import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";
import {
  ACCENT, BeatProgress, CaptionBar, Character, EASE, Eyebrow, FAINT, FOG, FONT, INK, karaoke,
  KineticText, PAPER, Pulse, SAFFRON, SEA, SpeechBubble, springIn, Stage, Transition, tween, WOOD, WOOD_LIGHT,
} from "./lib";
import type { Beat } from "./Cafe";

export const GRM3_FPS = 30;
export const GRM3_W = 1080;
export const GRM3_H = 1440;

export const GRM3_BEATS: Beat[] = [
  { id: "hook", kind: "hook", from: 0, to: 120, line: "One week. Three cities." },
  { id: "n1", kind: "notice", from: 120, to: 270, line: "Yesterday I worked in Riyadh.", target: ["worked"] },
  { id: "n2", kind: "notice", from: 270, to: 420, line: "Today I work in Dubai.", target: ["work"] },
  { id: "n3", kind: "notice", from: 420, to: 570, line: "Tomorrow I will work in London.", target: ["will work"] },
  { id: "explain", kind: "explain", from: 570, to: 1020, line: "Past: add ed. Future: add will.", target: ["ed", "will"] },
  { id: "practise", kind: "practise", from: 1020, to: 1350, line: "Say it with me. Worked. Work. Will work.", target: ["Worked", "Work", "Will work"], pauseAt: 1230 },
  { id: "recap", kind: "recap", from: 1350, to: 1500, line: "worked, work, will work", target: ["worked", "work", "will work"] },
];
export const GRM3_DURATION = 1500;

function beatAt(frame: number): Beat {
  return GRM3_BEATS.find((b) => frame >= b.from && frame < b.to) ?? GRM3_BEATS[GRM3_BEATS.length - 1];
}

// Daylight palette for the three skylines, kept inside the kit's colour family.
const SKY = "#dbeaf5";
const SKY_LOW = "#eef4f8";
const GROUND = "#e3d8c4";
const CITY_MID = "#8fa9c4";
const CITY_DARK = "#6f89a6";
const CITY_LIGHT = "#b3c6da";
const ROAD = "#4a4f6b";
const ROAD_EDGE = "#393d55";
const GLASS = "#cfe0ef";
const CARD = "#ffffff";

// Riyadh is the memory of last week, so its stop is washed sepia; London has
// not happened yet, so it is drawn as a dotted outline.
const SEPIA = "sepia(0.74) saturate(0.82) contrast(1.02)";

type Mode = "solid" | "outline";

const STOP_X = [540, 1620, 2700];
const BASE = 900;

// ---------------------------------------------------------------- small parts

/** A flat silhouette drawn solid, or as a dotted outline for "not here yet". */
function Silhouette({ parts, mode }: { parts: { d: string; fill: string }[]; mode: Mode }) {
  return (
    <g>
      {parts.map((p, i) =>
        mode === "outline" ? (
          <path key={i} d={p.d} fill="none" stroke={FAINT} strokeWidth="5" strokeDasharray="15 13" strokeLinejoin="round" strokeLinecap="round" />
        ) : (
          <path key={i} d={p.d} fill={p.fill} />
        ),
      )}
    </g>
  );
}

/** Left arrow for yesterday, a pin for today, right arrow for tomorrow. */
function TimeIcon({ kind, x, y, scale = 1, color = INK }: { kind: "back" | "now" | "next"; x: number; y: number; scale?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={color}>
      {kind === "now" ? (
        <g>
          <path d="M0 26 C-14 2 -30 -12 -30 -30 A30 30 0 1 1 30 -30 C30 -12 14 2 0 26 Z" />
          <circle cx="0" cy="-32" r="11" fill={CARD} />
        </g>
      ) : (
        <g transform={`scale(${kind === "back" ? -1 : 1} 1)`}>
          <rect x="-34" y="-12" width="44" height="22" rx="10" />
          <path d="M6 -34 L40 0 L6 34 Z" />
        </g>
      )}
    </g>
  );
}

/** A calendar page: the day word, a time arrow, and two torn rings at the top. */
function CalendarPage({
  x, y, label, kind, frame, appear, scale = 1, flutterFrom, mode = "solid",
}: {
  x: number; y: number; label: string; kind: "back" | "now" | "next"; frame: number; appear: number;
  scale?: number; flutterFrom?: number; mode?: Mode;
}) {
  if (frame < appear) return null;
  const s = springIn(frame, appear, { damping: 11, stiffness: 150 });
  // The hook's page flutters down instead of popping in.
  const fall = flutterFrom !== undefined ? 1 - tween(frame, appear, appear + 32, 0, 1, EASE.out) : 0;
  const dy = flutterFrom !== undefined ? -fall * flutterFrom : 0;
  const rot = flutterFrom !== undefined ? Math.sin((frame - appear) / 6) * 9 * fall : (1 - s) * -7;
  const grow = flutterFrom !== undefined ? 1 : s;
  const line = mode === "outline" ? FAINT : INK;
  return (
    <g transform={`translate(${x} ${y + dy}) rotate(${rot}) scale(${scale * grow})`}>
      {mode === "outline" ? (
        <g fill="none" stroke={FAINT} strokeWidth="5" strokeDasharray="15 13" strokeLinejoin="round">
          <rect x="-120" y="0" width="240" height="250" rx="20" />
          <line x1="-120" y1="58" x2="120" y2="58" />
        </g>
      ) : (
        <g>
          <rect x="-112" y="10" width="240" height="250" rx="20" fill={INK} opacity="0.16" />
          <rect x="-120" y="0" width="240" height="250" rx="20" fill={CARD} stroke={INK} strokeWidth="5" />
          <path d="M-120 20 A20 20 0 0 1 -100 0 L100 0 A20 20 0 0 1 120 20 L120 58 L-120 58 Z" fill={SAFFRON} />
          <line x1="-120" y1="58" x2="120" y2="58" stroke={INK} strokeWidth="5" />
          {[-56, 0, 56].map((rx) => (
            <g key={rx}>
              <line x1={rx} y1="-22" x2={rx} y2="26" stroke={INK} strokeWidth="7" strokeLinecap="round" />
              <circle cx={rx} cy="-24" r="8" fill="none" stroke={INK} strokeWidth="6" />
            </g>
          ))}
        </g>
      )}
      <text x="0" y="148" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="40" fill={line}>{label}</text>
      <TimeIcon kind={kind} x={0} y={204} scale={0.78} color={mode === "outline" ? FAINT : ACCENT} />
    </g>
  );
}

/** A white engineer's hat. `y` is the centre of the head it sits on. */
function HardHat({ x, y, scale = 1, mode = "solid" }: { x: number; y: number; scale?: number; mode?: Mode }) {
  const line = mode === "outline" ? FAINT : INK;
  const dash = mode === "outline" ? "15 13" : undefined;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-62 -58 C-62 -116 -34 -132 0 -132 C34 -132 62 -116 62 -58 Z" fill={mode === "outline" ? "none" : CARD} stroke={line} strokeWidth="5" strokeDasharray={dash} />
      <path d="M-92 -56 L92 -56 A14 14 0 0 1 92 -34 L-92 -34 A14 14 0 0 1 -92 -56 Z" fill={mode === "outline" ? "none" : CARD} stroke={line} strokeWidth="5" strokeDasharray={dash} />
      {mode === "solid" ? <path d="M0 -130 L0 -58" stroke={SAFFRON} strokeWidth="9" strokeLinecap="round" /> : null}
    </g>
  );
}

/** A desk with a laptop and a rolled drawing: the engineer's work surface. */
function Desk({ x, y, mode = "solid" }: { x: number; y: number; mode?: Mode }) {
  if (mode === "outline") {
    return (
      <g transform={`translate(${x} ${y})`} fill="none" stroke={FAINT} strokeWidth="5" strokeDasharray="15 13" strokeLinejoin="round">
        <rect x="-230" y="0" width="460" height="28" rx="10" />
        <line x1="-196" y1="28" x2="-196" y2="166" />
        <line x1="196" y1="28" x2="196" y2="166" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* the laptop and the rolled drawing stand on the top edge */}
      <g transform="translate(96 0)">
        <path d="M-56 0 L-44 -62 L44 -62 L56 0 Z" fill={CITY_LIGHT} stroke={INK} strokeWidth="4" />
        <path d="M-44 -62 L44 -62 L44 -8 L-44 -8 Z" fill={GLASS} />
        <rect x="-62" y="-4" width="124" height="12" rx="6" fill={INK} opacity="0.85" />
      </g>
      <rect x="-230" y="0" width="460" height="28" rx="10" fill={WOOD_LIGHT} stroke={INK} strokeWidth="4" />
      <rect x="-210" y="28" width="28" height="138" rx="8" fill={WOOD} />
      <rect x="182" y="28" width="28" height="138" rx="8" fill={WOOD} />
      <rect x="-196" y="40" width="392" height="16" rx="7" fill={WOOD} opacity="0.55" />
    </g>
  );
}

/** A stool and a seated lower body, so you reads as sitting at the desk. */
function Seated({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* the stool */}
      <rect x="-60" y="-158" width="110" height="20" rx="9" fill={WOOD} />
      <rect x="-16" y="-142" width="24" height="138" rx="10" fill={WOOD} />
      <ellipse cx="-4" cy="-2" rx="44" ry="11" fill={WOOD} />
      {/* thigh forward, shin down, shoe on the ground */}
      <rect x="-26" y="-162" width="150" height="48" rx="22" fill={ACCENT} />
      <rect x="82" y="-130" width="44" height="118" rx="18" fill={ACCENT} />
      <path d="M80 -24 L128 -24 Q166 -24 166 -6 Q166 2 154 2 L88 2 Q80 2 80 -8 Z" fill={INK} />
    </g>
  );
}

/** you, not here yet: a dotted outline with a small suitcase. */
function GhostYou({ x, y, frame, appear, scale = 1 }: { x: number; y: number; frame: number; appear: number; scale?: number }) {
  if (frame < appear) return null;
  const o = tween(frame, appear, appear + 22, 0, 1, EASE.out);
  const bob = Math.sin(frame / 18) * 5;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${scale})`} opacity={o}>
      <g fill="none" stroke={FAINT} strokeWidth="5" strokeDasharray="15 13" strokeLinejoin="round" strokeLinecap="round">
        {/* one outline for the whole body, so no inner lines cross */}
        <path d="M-62 -296 Q-62 -324 -34 -324 L34 -324 Q62 -324 62 -296 L54 -160 L40 -160 L40 -10 Q40 0 30 0 L10 0 Q0 0 0 -10 L0 -160 L-8 -160 L-8 -10 Q-8 0 -18 0 L-38 0 Q-48 0 -48 -10 L-48 -160 L-54 -160 Z" />
        <circle cx="0" cy="-400" r="52" />
      </g>
      <HardHat x={0} y={-400} scale={0.86} mode="outline" />
      {/* the tiny suitcase waiting on the ground */}
      <g fill="none" stroke={FAINT} strokeWidth="5" strokeDasharray="12 10" strokeLinejoin="round">
        <rect x="66" y="-80" width="96" height="76" rx="12" />
        <path d="M92 -80 Q114 -112 136 -80" />
      </g>
    </g>
  );
}

/** The saffron "you are here" pin, bouncing. */
function HerePin({ x, y, frame, appear }: { x: number; y: number; frame: number; appear: number }) {
  if (frame < appear) return null;
  const s = springIn(frame, appear, { damping: 8, stiffness: 190 });
  const bob = Math.sin((frame - appear) / 9) * 10;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <ellipse cx="0" cy="26" rx="22" ry="7" fill={INK} opacity="0.18" />
      <path d="M0 18 C-18 -12 -36 -28 -36 -52 A36 36 0 1 1 36 -52 C36 -28 18 -12 0 18 Z" fill={SAFFRON} stroke={INK} strokeWidth="5" />
      <circle cx="0" cy="-54" r="13" fill={CARD} stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** A magnet tile in flight: the part that is about to clip onto the verb. */
function Tile({
  frame, from, to, x0, y0, x1, y1, text, w, h = 112, size = 82,
}: {
  frame: number; from: number; to: number; x0: number; y0: number; x1: number; y1: number; text: string; w: number; h?: number; size?: number;
}) {
  if (frame < from || frame >= to) return null;
  const p = tween(frame, from, to, 0, 1, EASE.out);
  const x = x0 + (x1 - x0) * p;
  const y = y0 + (y1 - y0) * p;
  const spin = (1 - p) * (x1 > x0 ? -12 : 12);
  return (
    <g transform={`translate(${x} ${y}) rotate(${spin})`}>
      <rect x={-w / 2 + 7} y={-h / 2 + 9} width={w} height={h} rx="22" fill={INK} opacity="0.2" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="22" fill={ACCENT} stroke={INK} strokeWidth="5" />
      <rect x={-w / 2 + 14} y={-h / 2 + 12} width={w - 28} height="14" rx="7" fill={CARD} opacity="0.3" />
      <text x="0" y={size * 0.34} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize={size} fill={CARD}>{text}</text>
    </g>
  );
}

/** The tile that falls off when the knob comes back to today. */
function FallingTile({ frame, from, x, y, text, w }: { frame: number; from: number; x: number; y: number; text: string; w: number }) {
  if (frame < from || frame > from + 44) return null;
  const t = frame - from;
  return (
    <g transform={`translate(${x + t * 1.6} ${y + t * t * 0.9}) rotate(${t * 4})`} opacity={1 - tween(frame, from + 26, from + 44, 0, 1, EASE.in)}>
      <rect x={-w / 2} y="-56" width={w} height="112" rx="22" fill={ACCENT} stroke={INK} strokeWidth="5" />
      <text x="0" y="28" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="82" fill={CARD}>{text}</text>
    </g>
  );
}

/** Two short motion lines and a flash: the clack as a tile clips on. */
function Clack({ frame, at, x, y }: { frame: number; at: number; x: number; y: number }) {
  if (frame < at || frame > at + 14) return null;
  const p = tween(frame, at, at + 14, 0, 1, EASE.out);
  return (
    <g transform={`translate(${x} ${y})`} opacity={1 - p}>
      <circle r={30 + p * 60} fill="none" stroke={SAFFRON} strokeWidth={12 * (1 - p)} />
      {[-1, 1].map((k) => (
        <line key={k} x1={k * (40 + p * 20)} y1={k * 34} x2={k * (86 + p * 44)} y2={k * 34} stroke={SAFFRON} strokeWidth="9" strokeLinecap="round" />
      ))}
    </g>
  );
}

export type FormPart = {
  t: string;
  /** Added parts are coloured and grow their slot as the tile clips on. */
  add?: boolean;
  /** Frame the part attaches; left out, the part is always there. */
  at?: number;
  /** Frame the part falls off again. */
  off?: number;
  /** Final width of the part, in ems, used only while the slot grows. */
  em?: number;
};

/**
 * The verb with its added parts. An added part grows its slot from nothing to
 * its own width over eight frames, so the stem slides across to make room
 * exactly as the magnet tile clips on, and the settled word is laid out by the
 * browser rather than by my estimate.
 */
function FormWord({
  frame, parts, size, top, color = INK, addColor = ACCENT, align = "center", left, width, addChip = false,
}: {
  frame: number; parts: FormPart[]; size: number; top: number; color?: string; addColor?: string;
  align?: "center" | "left"; left?: number; width?: number; addChip?: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute", left: left ?? 0, right: left === undefined && width === undefined ? 0 : undefined, width, top,
        display: "flex", justifyContent: align === "left" ? "flex-start" : "center", alignItems: "baseline",
        fontSize: size, fontWeight: 800, lineHeight: 1.1, color, whiteSpace: "pre",
      }}
    >
      {parts.map((p, i) => {
        if (!p.add) return <span key={i} style={{ whiteSpace: "pre" }}>{p.t}</span>;
        const inP = p.at === undefined ? 1 : tween(frame, p.at, p.at + 8, 0, 1, EASE.out);
        const outP = p.off === undefined ? 0 : tween(frame, p.off, p.off + 8, 0, 1, EASE.in);
        const grow = inP * (1 - outP);
        if (grow <= 0) return null;
        const settled = grow >= 1;
        return (
          <span
            key={i}
            style={{
              display: "inline-block", whiteSpace: "pre", color: addChip ? INK : addColor,
              width: settled ? undefined : (p.em ?? 1.2) * size * grow,
              overflow: settled ? "visible" : "hidden",
              // Saffron is a chip, not text: ink on saffron keeps the contrast.
              background: addChip ? addColor : undefined,
              borderRadius: addChip ? size * 0.2 : undefined,
              padding: addChip ? `0 ${size * 0.1}px` : undefined,
              marginLeft: addChip && p.t.startsWith(" ") ? size * 0.16 : undefined,
              marginRight: addChip && p.t.endsWith(" ") ? size * 0.16 : undefined,
            }}
          >
            {addChip ? p.t.trim() : p.t}
          </span>
        );
      })}
    </div>
  );
}

/** The time slider: three notches, one knob, the same control as the item. */
function Slider({
  frame, appear, x0, x1, y, knob, scale = 1, labels,
}: {
  frame: number; appear: number; x0: number; x1: number; y: number; knob: number; scale?: number; labels?: [string, string, string];
}) {
  const draw = tween(frame, appear, appear + 20, 0, 1, EASE.out);
  const s = springIn(frame, appear + 8, { damping: 10, stiffness: 160 });
  const mid = (x0 + x1) / 2;
  return (
    <g>
      <rect x={x0} y={y - 9 * scale} width={(x1 - x0) * draw} height={18 * scale} rx={9 * scale} fill={FOG} />
      {[x0, mid, x1].map((nx, i) => (
        <g key={nx} opacity={draw}>
          <circle cx={nx} cy={y} r={13 * scale} fill={CARD} stroke={INK} strokeWidth={5 * scale} />
          {/* labels sit above the track, clear of the knob and the dragging hand */}
          {labels ? (
            <text x={nx} y={y - 44 * scale} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize={32 * scale} fill={FAINT}>{labels[i]}</text>
          ) : null}
        </g>
      ))}
      <g transform={`translate(${knob} ${y}) scale(${s * scale})`}>
        <rect x="-38" y="-32" width="88" height="80" rx="24" fill={INK} opacity="0.2" />
        <rect x="-44" y="-40" width="88" height="80" rx="24" fill={ACCENT} stroke={INK} strokeWidth="5" />
        {[-14, 0, 14].map((gx) => <line key={gx} x1={gx} y1="-16" x2={gx} y2="16" stroke={CARD} strokeWidth="6" strokeLinecap="round" opacity="0.8" />)}
      </g>
    </g>
  );
}

/** A hand that drags the knob. */
function DragHand({ frame, from, until, x, y }: { frame: number; from: number; until: number; x: number; y: number }) {
  if (frame < from || frame > until) return null;
  const o = tween(frame, from, from + 10, 0, 1, EASE.out) * (1 - tween(frame, until - 12, until, 0, 1, EASE.in));
  return (
    // Smaller than the knob and set below and right of it, so the knob and its
    // notch label stay readable while the hand drags.
    <g transform={`translate(${x} ${y}) scale(0.68)`} opacity={o}>
      <path d="M-26 86 L-26 26 Q-26 -6 2 -6 L2 -52 Q2 -74 22 -74 Q42 -74 42 -52 L42 -6 L58 -6 Q78 -6 78 14 L78 86 Z" fill="#e6b088" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <path d="M-26 44 Q-52 30 -46 58 L-26 86" fill="#e6b088" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
    </g>
  );
}

/** A city stamp: the stickers on the hook's suitcase and under the recap card. */
function CitySticker({
  city, x, y, frame, appear, scale = 1, rotate = 0,
}: {
  city: 0 | 1 | 2; frame: number; x: number; y: number; appear: number; scale?: number; rotate?: number;
}) {
  if (frame < appear) return null;
  const s = springIn(frame, appear, { damping: 7, stiffness: 240 });
  const name = ["Riyadh", "Dubai", "London"][city];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate * s}) scale(${(2 - s) * 0.5 + s * 0.5})`}>
      <rect x="-78" y="-72" width="170" height="170" rx="26" fill={INK} opacity="0.18" />
      <rect x="-85" y="-80" width="170" height="170" rx="26" fill={CARD} stroke={INK} strokeWidth="5" />
      <path d="M-85 -54 A26 26 0 0 1 -59 -80 L59 -80 A26 26 0 0 1 85 -54 Z" fill={SAFFRON} />
      <g transform="translate(0 44)">
        {city === 0 ? (
          <g fill={ACCENT}>
            <path d="M-40 0 L-30 -80 L-14 -80 L-20 0 Z" />
            <path d="M20 0 L14 -80 L30 -80 L40 0 Z" />
            <path d="M-30 -80 Q0 -124 30 -80 L14 -80 Q0 -104 -14 -80 Z" />
          </g>
        ) : city === 1 ? (
          <g fill={ACCENT}>
            <path d="M-32 0 L-32 -104 L-24 -104 Q24 -64 20 0 Z" />
          </g>
        ) : (
          <g fill={ACCENT}>
            <rect x="-26" y="-84" width="52" height="84" />
            <path d="M-30 -84 L0 -116 L30 -84 Z" />
            <circle cx="0" cy="-54" r="17" fill={CARD} />
            <path d="M0 -64 L0 -54 L9 -49" stroke={ACCENT} strokeWidth="5" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>
      <text x="0" y="76" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="26" fill={INK}>{name}</text>
    </g>
  );
}

// ---------------------------------------------------------------- hook: the suitcase
function HookScene({ frame }: { frame: number }) {
  // The suitcase is already in frame at 0, so the poster frame the player shows
  // before play is composed rather than empty.
  const slide = (1 - springIn(frame, 0, { damping: 13, stiffness: 68, clamp: true })) * 150;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Stage>
        <defs>
          <pattern id="grm3-dots" width="46" height="46" patternUnits="userSpaceOnUse"><circle cx="23" cy="23" r="3" fill={INK} opacity="0.07" /></pattern>
        </defs>
        <rect width="1080" height="1440" fill="url(#grm3-dots)" />
        <line x1="60" y1="1004" x2="1020" y2="1004" stroke={INK} strokeWidth="6" opacity="0.14" strokeLinecap="round" />
        <g transform={`translate(${-slide} 0)`}>
          <ellipse cx="548" cy="1000" rx="300" ry="26" fill={INK} opacity="0.13" />
          {/* the suitcase */}
          <g>
            <rect x="268" y="634" width="560" height="360" rx="44" fill={INK} opacity="0.18" />
            <rect x="260" y="620" width="560" height="360" rx="44" fill="#c2764f" stroke={INK} strokeWidth="6" />
            <rect x="260" y="762" width="560" height="34" fill={INK} opacity="0.14" />
            <path d="M470 620 L470 584 A70 36 0 0 1 610 584 L610 620" fill="none" stroke={INK} strokeWidth="18" strokeLinecap="round" />
            {[388, 692].map((sx) => (
              <g key={sx}>
                <rect x={sx} y="620" width="54" height="360" fill="#a55f3d" />
                <rect x={sx + 8} y="760" width="38" height="40" rx="8" fill={SAFFRON} stroke={INK} strokeWidth="5" />
              </g>
            ))}
            {[[300, 660], [756, 660], [300, 904], [756, 904]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="14" fill={INK} opacity="0.3" />)}
          </g>
          <CitySticker city={0} x={400} y={726} frame={frame} appear={34} rotate={-9} />
          <CitySticker city={1} x={570} y={828} frame={frame} appear={50} rotate={6} />
          <CitySticker city={2} x={726} y={906} frame={frame} appear={66} rotate={-5} />
          <CalendarPage x={852} y={560} label="Mon" kind="now" frame={frame} appear={78} scale={0.56} flutterFrom={520} />
        </g>
      </Stage>
      <KineticText frame={frame} from={4} text="One week." x={80} y={120} size={96} color={INK} stagger={6} />
      <KineticText frame={frame} from={30} text="Three cities." x={80} y={244} size={76} color={INK} stagger={6} style={{ opacity: 0.78 }} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- notices: the road
function RiyadhCity({ cx }: { cx: number }) {
  return (
    <Silhouette
      mode="solid"
      // The landmarks stand left and right of centre, so the desk never hides them.
      parts={[
        { d: `M${cx - 450} ${BASE} L${cx - 450} ${BASE - 190} L${cx - 340} ${BASE - 190} L${cx - 340} ${BASE} Z`, fill: CITY_LIGHT },
        { d: `M${cx - 320} ${BASE} L${cx - 302} ${BASE - 430} L${cx - 262} ${BASE - 430} L${cx - 272} ${BASE} Z`, fill: CITY_MID },
        { d: `M${cx - 188} ${BASE} L${cx - 198} ${BASE - 430} L${cx - 158} ${BASE - 430} L${cx - 140} ${BASE} Z`, fill: CITY_MID },
        { d: `M${cx - 302} ${BASE - 430} Q${cx - 230} ${BASE - 548} ${cx - 158} ${BASE - 430} L${cx - 198} ${BASE - 430} Q${cx - 230} ${BASE - 492} ${cx - 262} ${BASE - 430} Z`, fill: CITY_MID },
        { d: `M${cx + 120} ${BASE} L${cx + 120} ${BASE - 250} L${cx + 228} ${BASE - 250} L${cx + 228} ${BASE} Z`, fill: CITY_DARK },
        { d: `M${cx + 262} ${BASE} L${cx + 332} ${BASE - 350} L${cx + 402} ${BASE} Z`, fill: CITY_MID },
        { d: `M${cx + 420} ${BASE} L${cx + 420} ${BASE - 150} L${cx + 520} ${BASE - 150} L${cx + 520} ${BASE} Z`, fill: CITY_LIGHT },
      ]}
    />
  );
}

function DubaiCity({ cx }: { cx: number }) {
  return (
    <Silhouette
      mode="solid"
      parts={[
        { d: `M${cx - 470} ${BASE} L${cx - 470} ${BASE - 170} L${cx - 370} ${BASE - 170} L${cx - 370} ${BASE} Z`, fill: CITY_LIGHT },
        // the sail: a straight mast edge on the left, a curve falling to the right
        { d: `M${cx - 310} ${BASE} L${cx - 310} ${BASE - 404} L${cx - 296} ${BASE - 404} Q${cx - 150} ${BASE - 280} ${cx - 160} ${BASE} Z`, fill: CITY_MID },
        { d: `M${cx + 100} ${BASE} L${cx + 100} ${BASE - 236} L${cx + 160} ${BASE - 282} L${cx + 220} ${BASE - 236} L${cx + 220} ${BASE} Z`, fill: CITY_LIGHT },
        // the spire
        { d: `M${cx + 268} ${BASE} L${cx + 268} ${BASE - 300} L${cx + 282} ${BASE - 400} L${cx + 296} ${BASE - 470} L${cx + 304} ${BASE - 540} L${cx + 312} ${BASE - 470} L${cx + 326} ${BASE - 400} L${cx + 340} ${BASE - 300} L${cx + 340} ${BASE} Z`, fill: CITY_DARK },
        { d: `M${cx + 400} ${BASE} L${cx + 400} ${BASE - 160} L${cx + 520} ${BASE - 160} L${cx + 520} ${BASE} Z`, fill: CITY_LIGHT },
      ]}
    />
  );
}

function LondonCity({ cx }: { cx: number }) {
  return (
    <g>
      <Silhouette
        mode="outline"
        parts={[
          { d: `M${cx - 470} ${BASE} L${cx - 470} ${BASE - 170} L${cx - 360} ${BASE - 170} L${cx - 360} ${BASE} Z`, fill: "none" },
          { d: `M${cx - 330} ${BASE} L${cx - 330} ${BASE - 190} A90 90 0 0 1 ${cx - 150} ${BASE - 190} L${cx - 150} ${BASE} Z`, fill: "none" },
          { d: `M${cx + 214} ${BASE} L${cx + 214} ${BASE - 376} L${cx + 250} ${BASE - 436} L${cx + 286} ${BASE - 376} L${cx + 286} ${BASE} Z`, fill: "none" },
          { d: `M${cx + 370} ${BASE} L${cx + 370} ${BASE - 240} L${cx + 500} ${BASE - 240} L${cx + 500} ${BASE} Z`, fill: "none" },
        ]}
      />
      {/* the clock face on the tower */}
      <circle cx={cx + 250} cy={BASE - 310} r="30" fill="none" stroke={FAINT} strokeWidth="5" strokeDasharray="10 9" />
      <path d={`M${cx + 250} ${BASE - 330} L${cx + 250} ${BASE - 310} L${cx + 266} ${BASE - 302}`} fill="none" stroke={FAINT} strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

/** One stop on the road: skyline, desk, you, and the day's calendar page. */
function Stop({ i, frame }: { i: 0 | 1 | 2; frame: number }) {
  const cx = STOP_X[i];
  const enter = [128, 332, 486][i];
  const label = ["Yesterday", "Today", "Tomorrow"][i];
  const kind = (["back", "now", "next"] as const)[i];
  const mode: Mode = i === 2 ? "outline" : "solid";
  const youX = cx - 40;
  const youY = BASE - 20;
  return (
    // Riyadh is last week, so the whole stop carries a sepia wash.
    <g style={i === 0 ? { filter: SEPIA } : undefined}>
      {i === 0 ? <RiyadhCity cx={cx} /> : i === 1 ? <DubaiCity cx={cx} /> : <LondonCity cx={cx} />}
      {i === 2 ? (
        <GhostYou x={youX} y={youY} frame={frame} appear={enter} scale={0.84} />
      ) : (
        <g>
          <Seated x={youX} y={youY} scale={0.84} />
          <Character
            who="you" x={youX} y={youY} scale={0.84} facing={1} frame={frame} enter={enter} legs={false}
            mood="happy" talking={frame > enter + 16 && frame < enter + 110} gesture={i === 0 ? "idle" : "raise"} gestureAt={enter + 40}
          />
          <HardHat x={youX} y={youY - 400 * 0.84} scale={0.84} />
          <Desk x={cx + 60} y={BASE - 170} mode={mode} />
        </g>
      )}
      <CalendarPage x={cx - 330} y={150} label={label} kind={kind} frame={frame} appear={enter - 8} mode={mode} />
      {i === 1 ? <HerePin x={youX} y={BASE - 480} frame={frame} appear={enter + 24} /> : null}
    </g>
  );
}

function RoadScene({ frame }: { frame: number }) {
  // The camera slides right, one stop per notice beat.
  const camX = -1080 * (tween(frame, 270, 330, 0, 1, EASE.inOut) + tween(frame, 420, 480, 0, 1, EASE.inOut));
  const stop = frame < 270 ? 0 : frame < 420 ? 1 : 2;
  // The verb card: "-ed" clips on at Riyadh, nothing at Dubai, "will" at London.
  const cardAppear = [146, 334, 484][stop];
  const card = springIn(frame, cardAppear, { damping: 11, stiffness: 140 });
  const parts: FormPart[] =
    stop === 0 ? [{ t: "work" }, { t: "ed", add: true, at: 188, em: 1.2 }]
      : stop === 1 ? [{ t: "work" }]
        : [{ t: "will ", add: true, at: 524, em: 2.0 }, { t: "work" }];
  const underline = stop === 1 ? tween(frame, 364, 386, 0, 1, EASE.out) : 0;
  return (
    <AbsoluteFill style={{ background: SKY }}>
      <Stage>
        <defs>
          <linearGradient id="grm3-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SKY} />
            <stop offset="1" stopColor={SKY_LOW} />
          </linearGradient>
        </defs>
        <rect width="1080" height={BASE} fill="url(#grm3-sky)" />
        {/* far haze, moving slower than the road */}
        <g transform={`translate(${camX * 0.4} 0)`}>
          {[0, 1, 2].map((k) => (
            <rect key={k} x={-200 + k * 1080} y={BASE - 110} width="1240" height="110" fill={CARD} opacity="0.22" />
          ))}
        </g>
        <g transform={`translate(${camX} 0)`}>
          <rect x="-400" y={BASE} width="4400" height="120" fill={GROUND} />
          <Stop i={0} frame={frame} />
          <Stop i={1} frame={frame} />
          <Stop i={2} frame={frame} />
          {/* the road itself, with the dashes between the stops */}
          <rect x="-400" y={BASE + 24} width="4400" height="96" fill={ROAD} />
          <rect x="-400" y={BASE + 24} width="4400" height="10" fill={ROAD_EDGE} />
          <rect x="-400" y={BASE + 110} width="4400" height="10" fill={ROAD_EDGE} />
          {Array.from({ length: 22 }, (_, k) => k).map((k) => (
            <rect key={k} x={-300 + k * 180} y={BASE + 66} width="96" height="12" rx="6" fill={SAFFRON} opacity="0.85" />
          ))}
          {/* a pale pad across the road marks each stop */}
          {STOP_X.map((sx, i) => (
            <g key={sx}>
              <rect x={sx - 170} y={BASE + 24} width="340" height="96" fill={PAPER} opacity={i === 2 ? 0.45 : 0.9} />
              <rect x={sx - 170} y={BASE + 24} width="340" height="10" fill={i === 2 ? FAINT : SAFFRON} />
            </g>
          ))}
        </g>
      </Stage>

      {/* the sentence, after the camera has settled on the stop */}
      {stop === 0 ? (
        <SpeechBubble frame={frame} from={132} until={258} text="Yesterday I worked in Riyadh." targets={["worked"]} x={350} y={150} w={670} tail="left" tailX={60} size={52} />
      ) : null}
      {stop === 1 ? (
        <SpeechBubble frame={frame} from={336} until={410} text="Today I work in Dubai." targets={["work"]} x={350} y={150} w={670} tail="left" tailX={60} size={52} />
      ) : null}
      {stop === 2 ? (
        <SpeechBubble frame={frame} from={486} until={560} text="Tomorrow I will work in London." targets={["will", "work"]} x={350} y={150} w={670} tail="left" tailX={60} size={52} />
      ) : null}

      {/* the verb on its own card, where the tile clips on */}
      <Stage>
        <g transform={`translate(540 1080) scale(${card}) translate(-540 -1080)`}>
          <rect x="238" y="1014" width="620" height="152" rx="36" fill={INK} opacity="0.16" />
          <rect x="230" y="1006" width="620" height="152" rx="36" fill={CARD} stroke={INK} strokeWidth="5" />
          {underline > 0 ? <rect x={420} y="1126" width={240 * underline} height="12" rx="6" fill={ACCENT} /> : null}
        </g>
        {stop === 0 ? (
          <g>
            <Tile frame={frame} from={168} to={188} x0={1180} y0={1082} x1={640} y1={1082} text="ed" w={160} />
            <Clack frame={frame} at={188} x={650} y={1082} />
          </g>
        ) : null}
        {stop === 2 ? (
          <g>
            <Tile frame={frame} from={500} to={524} x0={-120} y0={1082} x1={400} y1={1082} text="will" w={246} />
            <Clack frame={frame} at={524} x={390} y={1082} />
          </g>
        ) : null}
      </Stage>
      {card > 0.05 ? (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${card})`, transformOrigin: "540px 1080px" }}>
          <FormWord frame={frame} parts={parts} size={96} top={1032} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- explain: the slider
function ExplainScene({ frame }: { frame: number }) {
  const X0 = 180;
  const X1 = 900;
  const MID = (X0 + X1) / 2;
  const KNOB_Y = 620;
  // The knob: centre, left to the past, back to centre, right to the future.
  const knob = MID
    + (X0 - MID) * tween(frame, 630, 660, 0, 1, EASE.inOut)
    + (MID - X0) * tween(frame, 750, 780, 0, 1, EASE.inOut)
    + (X1 - MID) * tween(frame, 840, 870, 0, 1, EASE.inOut);
  const bigOut = tween(frame, 918, 948, 0, 1, EASE.in);
  const rows = springIn(frame, 940, { damping: 11, stiffness: 120 });
  // Once the big verb goes, the slider rises to meet the summary card.
  const lift = -180 * tween(frame, 940, 984, 0, 1, EASE.inOut);
  const mayaIn = springIn(frame, 584, { damping: 11, stiffness: 130 });
  const mayaG = frame < 660 ? { g: "raise" as const, at: 590, from: "idle" as const }
    : frame < 840 ? { g: "point" as const, at: 660, from: "raise" as const }
      : { g: "thumbs" as const, at: 940, from: "point" as const };
  const ROWS: { label: string; kind: "back" | "now" | "next"; parts: FormPart[] }[] = [
    { label: "Yesterday", kind: "back", parts: [{ t: "work" }, { t: "ed", add: true }] },
    { label: "Today", kind: "now", parts: [{ t: "work" }] },
    { label: "Tomorrow", kind: "next", parts: [{ t: "will ", add: true }, { t: "work" }] },
  ];
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Stage>
        <defs>
          <pattern id="grm3-grid" width="52" height="52" patternUnits="userSpaceOnUse"><circle cx="26" cy="26" r="3" fill={INK} opacity="0.07" /></pattern>
          <clipPath id="grm3-maya-clip"><circle cx="152" cy="1012" r="100" /></clipPath>
        </defs>
        <rect width="1080" height="1440" fill="url(#grm3-grid)" />
        <g transform={`translate(0 ${lift})`}>
          <Slider frame={frame} appear={584} x0={X0} x1={X1} y={KNOB_Y} knob={knob} labels={["Yesterday", "Today", "Tomorrow"]} />
          <DragHand frame={frame} from={620} until={894} x={knob + 30} y={KNOB_Y + 34} />
        </g>
        {/* the magnet tiles and the clack at each snap */}
        <g opacity={1 - bigOut}>
          <Tile frame={frame} from={628} to={654} x0={1180} y0={360} x1={730} y1={360} text="ed" w={160} />
          <Clack frame={frame} at={654} x={730} y={360} />
          <FallingTile frame={frame} from={756} x={720} y={360} text="ed" w={160} />
          <Tile frame={frame} from={838} to={864} x0={-140} y0={360} x1={300} y1={360} text="will" w={246} />
          <Clack frame={frame} at={864} x={300} y={360} />
        </g>
        {/* maya explains from the corner */}
        <g transform={`translate(152 1012) scale(${mayaIn}) translate(-152 -1012)`}>
          <circle cx="163" cy="1023" r="100" fill={INK} />
          <circle cx="152" cy="1012" r="100" fill={CARD} />
          <circle cx="152" cy="1012" r="100" fill="none" stroke={SAFFRON} strokeWidth="11" />
          <g clipPath="url(#grm3-maya-clip)">
            <Character who="maya" x={152} y={1280} scale={0.66} facing={1} frame={frame} enter={588} talking={frame > 600 && frame < 930} mood="happy" gesture={mayaG.g} gestureAt={mayaG.at} from={mayaG.from} />
          </g>
        </g>
        {/* the three forms line up under their time icons */}
        {frame >= 940 ? (
          <g transform={`translate(640 740) scale(${rows}) translate(-640 -740)`}>
            <rect x="268" y="528" width="770" height="440" rx="38" fill={INK} opacity="0.14" />
            <rect x="260" y="520" width="770" height="440" rx="38" fill={CARD} stroke={INK} strokeWidth="5" />
            {ROWS.map((r, i) => (
              <g key={r.label}>
                <TimeIcon kind={r.kind} x={322} y={632 + i * 130} scale={0.62} color={ACCENT} />
                <text x={382} y={646 + i * 130} fontFamily={FONT} fontWeight="700" fontSize="36" fill={FAINT}>{r.label}</text>
                {i < 2 ? <line x1="300" y1={692 + i * 130} x2="990" y2={692 + i * 130} stroke={FOG} strokeWidth="3" /> : null}
              </g>
            ))}
          </g>
        ) : null}
      </Stage>
      <Eyebrow text="ONE VERB, THREE TIMES" x={0} y={132} align="center" frame={frame} from={580} />
      {bigOut < 1 ? (
        <div style={{ opacity: 1 - bigOut }}>
          <FormWord
            frame={frame}
            size={150}
            top={260}
            parts={[
              { t: "will ", add: true, at: 864, em: 2.0 },
              { t: "work" },
              { t: "ed", add: true, at: 654, off: 756, em: 1.2 },
            ]}
          />
        </div>
      ) : null}
      {frame >= 940 ? (
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, rows * 2), transform: `scale(${rows})`, transformOrigin: "640px 740px" }}>
          {ROWS.map((r, i) => (
            <FormWord key={r.label} frame={frame} parts={r.parts} size={64} top={592 + i * 130} align="left" left={636} />
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- practise: say it with me
function PractiseScene({ frame }: { frame: number }) {
  const circle = springIn(frame, 1020, { damping: 11, stiffness: 120 });
  const turn = springIn(frame, 1230, { damping: 9, stiffness: 160 });
  const X0 = 240;
  const X1 = 840;
  const MID = (X0 + X1) / 2;
  // The knob jumps to the notch of whichever form is being said.
  const knob = MID
    + (X0 - MID) * tween(frame, 1080, 1094, 0, 1, EASE.out)
    + (MID - X0) * tween(frame, 1140, 1154, 0, 1, EASE.out)
    + (X1 - MID) * tween(frame, 1196, 1210, 0, 1, EASE.out);
  const mayaG = frame < 1140 ? { g: "raise" as const, at: 1026, from: "idle" as const }
    : frame < 1196 ? { g: "point" as const, at: 1140, from: "raise" as const }
      : { g: "raise" as const, at: 1196, from: "point" as const };
  const glow = tween(frame, 1270, 1286, 0, 1, EASE.out);
  const LINES: { at: number; parts: FormPart[] }[] = [
    { at: 1080, parts: [{ t: "Work" }, { t: "ed.", add: true }] },
    { at: 1140, parts: [{ t: "Work." }] },
    { at: 1196, parts: [{ t: "Will", add: true }, { t: " work." }] },
  ];
  return (
    <AbsoluteFill style={{ background: "#e9f1f8" }}>
      <Stage>
        <defs><clipPath id="grm3-prac-clip"><circle cx="540" cy="400" r="252" /></clipPath></defs>
        <g transform={`translate(540 400) scale(${circle}) translate(-540 -400)`}>
          <circle cx="552" cy="414" r="270" fill={INK} />
          <circle cx="540" cy="400" r="270" fill={CARD} />
          <circle cx="540" cy="400" r="270" fill="none" stroke={SAFFRON} strokeWidth="14" />
          <g clipPath="url(#grm3-prac-clip)">
            <Character who="maya" x={540} y={1130} scale={1.9} facing={1} frame={frame} enter={1024} talking={frame > 1040 && frame < 1226} mood="happy" gesture={mayaG.g} gestureAt={mayaG.at} from={mayaG.from} />
          </g>
        </g>
        {/* the same slider as the explain beat, without labels: the three lines
            above it already read left, centre, right */}
        <Slider frame={frame} appear={1040} x0={X0} x1={X1} y={1135} knob={knob} scale={0.84} />
        {/* the mic marks the learner's turn; the player pauses on this frame */}
        {frame >= 1230 && frame < 1264 ? (
          <g transform={`translate(142 242) scale(${turn}) translate(-142 -242)`}>
            <Pulse frame={frame} x={142} y={242} size={116}>
              <g transform="translate(-29 -29) scale(2.4)" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" /></g>
            </Pulse>
            <text x="142" y="348" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="34" fill={INK}>Your turn</text>
          </g>
        ) : null}
      </Stage>
      <Eyebrow text="SAY IT WITH ME" x={0} y={700} align="center" frame={frame} from={1030} />
      {LINES.map((l, i) => {
        const s = springIn(frame, l.at, { damping: 9, stiffness: 200 });
        if (s <= 0) return null;
        return (
          <div key={i} style={{ opacity: Math.min(1, s * 2.5), transform: `translateY(${(1 - s) * 26}px)` }}>
            <FormWord frame={frame} parts={l.parts} size={92} top={748 + i * 112} color={glow > 0.5 ? SEA : INK} addColor={glow > 0.5 ? SEA : ACCENT} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- recap
function RecapScene({ frame }: { frame: number }) {
  const card = springIn(frame, 1356, { damping: 11, stiffness: 110 });
  const COLS: { kind: "back" | "now" | "next"; label: string; parts: FormPart[] }[] = [
    { kind: "back", label: "Yesterday", parts: [{ t: "work" }, { t: "ed", add: true }] },
    { kind: "now", label: "Today", parts: [{ t: "work" }] },
    { kind: "next", label: "Tomorrow", parts: [{ t: "will ", add: true }, { t: "work" }] },
  ];
  return (
    <AbsoluteFill style={{ background: ACCENT }}>
      <Stage>
        <defs>
          <pattern id="grm3-stripes" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="30" height="60" fill={PAPER} opacity="0.06" /></pattern>
        </defs>
        <rect width="1080" height="1440" fill="url(#grm3-stripes)" />
        <g transform={`translate(540 480) scale(${card}) translate(-540 -480)`}>
          <rect x="70" y="244" width="950" height="500" rx="48" fill={INK} opacity="0.22" />
          <rect x="60" y="230" width="950" height="500" rx="48" fill={CARD} />
          <text x="535" y="330" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="36" letterSpacing="6" fill={FAINT}>REMEMBER</text>
          {COLS.map((c, i) => (
            <g key={c.kind}>
              <TimeIcon kind={c.kind} x={225 + i * 310} y={450} scale={0.9} color={ACCENT} />
              <text x={225 + i * 310} y={648} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="34" fill={FAINT}>{c.label}</text>
              {i < 2 ? <line x1={380 + i * 310} y1="390" x2={380 + i * 310} y2="672" stroke={FOG} strokeWidth="4" /> : null}
            </g>
          ))}
        </g>
        {/* the three stickers from the hook spring back in */}
        <CitySticker city={0} x={240} y={940} frame={frame} appear={1420} rotate={-7} />
        <CitySticker city={1} x={540} y={940} frame={frame} appear={1436} rotate={5} />
        <CitySticker city={2} x={840} y={940} frame={frame} appear={1452} rotate={-4} />
      </Stage>
      {card > 0.05 ? (
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, card * 2), transform: `scale(${card})`, transformOrigin: "540px 480px" }}>
          {COLS.map((c, i) => (
            <FormWord key={c.kind} frame={frame} parts={c.parts} size={50} top={528} left={70 + i * 310} width={310} addColor={SAFFRON} addChip />
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- composition
export function TimeWordExplainer({ l1 }: { l1?: Record<string, string> }) {
  const frame = useCurrentFrame();
  const beat = beatAt(frame);
  const progress = (frame - beat.from) / Math.max(1, Math.min(120, beat.to - beat.from));
  const k = karaoke(beat.line, Math.min(1, progress));
  const font: CSSProperties = { fontFamily: FONT };
  return (
    <AbsoluteFill style={{ ...font, background: PAPER, overflow: "hidden" }}>
      {beat.kind === "hook" ? <HookScene frame={frame} /> : null}
      {beat.kind === "notice" ? <RoadScene frame={frame} /> : null}
      {beat.kind === "explain" ? <ExplainScene frame={frame} /> : null}
      {beat.kind === "practise" ? <PractiseScene frame={frame} /> : null}
      {beat.kind === "recap" ? <RecapScene frame={frame} /> : null}
      {/* the three notices are one continuous camera move, so they take no cut */}
      <Transition frame={frame} at={120} kind="wipe" color={SAFFRON} color2={INK} />
      <Transition frame={frame} at={570} kind="iris" color={PAPER} color2={ACCENT} cx={540} cy={620} />
      <Transition frame={frame} at={1020} kind="slide" color={ACCENT} color2={SAFFRON} />
      <Transition frame={frame} at={1350} kind="wipe" color={SAFFRON} color2={INK} />
      <CaptionBar line={beat.line} k={k} targets={beat.target} l1={l1?.[beat.id]} />
      {/* saffron in the recap: accent on an accent background would disappear */}
      <BeatProgress frame={frame} beats={GRM3_BEATS} color={beat.kind === "recap" ? SAFFRON : ACCENT} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- L1 captions
export const GRM3_L1: Record<string, Record<string, string>> = {
  ar: {
    hook: "أسبوع واحد. ثلاث مدن.",
    n1: "أمس عملت في الرياض.",
    n2: "اليوم أعمل في دبي.",
    n3: "غدًا سأعمل في لندن.",
    explain: "الماضي: أضف ed. المستقبل: أضف will.",
    practise: "قلها معي.",
    recap: "أمس، اليوم، غدًا.",
  },
  es: {
    hook: "Una semana. Tres ciudades.",
    n1: "Ayer trabajé en Riad.",
    n2: "Hoy trabajo en Dubái.",
    n3: "Mañana trabajaré en Londres.",
    explain: "Pasado: añade ed. Futuro: añade will.",
    practise: "Dilo conmigo.",
    recap: "ayer, hoy, mañana.",
  },
  hi: {
    hook: "एक हफ़्ता। तीन शहर।",
    n1: "कल मैंने रियाद में काम किया।",
    n2: "आज मैं दुबई में काम करता हूँ।",
    n3: "कल मैं लंदन में काम करूँगा।",
    explain: "भूतकाल: ed जोड़ें। भविष्य: will जोड़ें।",
    practise: "मेरे साथ बोलो।",
    recap: "कल, आज, कल।",
  },
  ru: {
    hook: "Одна неделя. Три города.",
    n1: "Вчера я работал в Эр-Рияде.",
    n2: "Сегодня я работаю в Дубае.",
    n3: "Завтра я буду работать в Лондоне.",
    explain: "Прошлое: добавь ed. Будущее: добавь will.",
    practise: "Скажи со мной.",
    recap: "вчера, сегодня, завтра.",
  },
  tr: {
    hook: "Bir hafta. Üç şehir.",
    n1: "Dün Riyad'da çalıştım.",
    n2: "Bugün Dubai'de çalışıyorum.",
    n3: "Yarın Londra'da çalışacağım.",
    explain: "Geçmiş: ed ekle. Gelecek: will ekle.",
    practise: "Benimle söyle.",
    recap: "dün, bugün, yarın.",
  },
  zh: {
    hook: "一周，三座城市。",
    n1: "昨天我在利雅得工作。",
    n2: "今天我在迪拜工作。",
    n3: "明天我将在伦敦工作。",
    explain: "过去：加 ed。将来：加 will。",
    practise: "跟我一起说。",
    recap: "昨天、今天、明天。",
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
  component: TimeWordExplainer,
  beats: GRM3_BEATS,
  duration: GRM3_DURATION,
  fps: 30,
  width: 1080,
  height: 1440,
  l1: GRM3_L1,
};
