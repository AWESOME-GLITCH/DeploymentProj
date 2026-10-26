"use client";

// "Platform 4, not 14" (ATM-A2-LST-0004): a 2D flat-vector motion-graphics
// explainer built as a Remotion composition (3:4, 1080x1440, 30 fps, 55 s).
// Seven beats from docs/explainers/storyboards.md: hook, three notices, explain,
// practise aloud, recap. Single target: word stress tells teens from tens,
// fourTEEN (stress at the end) against FORty (stress at the start).
// Built on the shared kit in ./lib; every value is a pure function of the frame,
// so the same component plays in the Remotion Player and renders to MP4.

import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";
import {
  ACCENT, BeatProgress, CaptionBar, Character, CREAM, EASE, Eyebrow, FAINT, FOG, FONT, Highlight, INK, karaoke,
  KineticText, PAPER, Parallax, Pulse, SAFFRON, SEA, springIn, Stage, Transition, tween, WOOD_LIGHT,
} from "./lib";
import type { Beat } from "./Cafe";

export const LST_FPS = 30;
export const LST_W = 1080;
export const LST_H = 1440;

export const LST_BEATS: Beat[] = [
  { id: "hook", kind: "hook", from: 0, to: 150, line: "Dubai Metro. Friday evening." },
  { id: "n1", kind: "notice", from: 150, to: 330, line: "Platform fourteen.", target: ["fourteen"] },
  { id: "n2", kind: "notice", from: 330, to: 480, line: "Platform four.", target: ["four"] },
  { id: "n3", kind: "notice", from: 480, to: 630, line: "Platform forty.", target: ["forty"] },
  { id: "explain", kind: "explain", from: 630, to: 1110, line: "FourTEEN. Stress at the end. FORty. Stress at the start.", target: ["fourTEEN", "FORty"] },
  { id: "practise", kind: "practise", from: 1110, to: 1500, line: "Say it with me. Fourteen. Forty.", target: ["Fourteen", "Forty"], pauseAt: 1320 },
  { id: "recap", kind: "recap", from: 1500, to: 1650, line: "thirTEEN, THIRty.", target: ["thirTEEN", "THIRty"] },
];
export const LST_DURATION = 1650;

function beatAt(frame: number): Beat {
  return LST_BEATS.find((b) => frame >= b.from && frame < b.to) ?? LST_BEATS[LST_BEATS.length - 1];
}

// Evening palette for the station, kept inside the kit's colour family.
const SKY_HIGH = "#ef8f54";
const SKY_MID = "#f7a65c";
const SKY_LOW = "#fbc27f";
const CITY = "#cf7046";
const GOLD = "#e0a73c";
const GOLD_LIGHT = "#f0c874";
const WALL = "#e8dfd2";
const WALL_DARK = "#dbd0bf";
const FLOOR = "#d9d2c5";
const TRACK = "#3b3f52";
const STEEL = "#8f94a8";
const GLASS = "#cfe0ef";

// ---------------------------------------------------------------- small props

/** A flat weight: the "heavy syllable" marker used across the explainer. */
function Weight({ x, y, scale = 1, color = INK }: { x: number; y: number; scale?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={color}>
      <rect x="-9" y="-33" width="18" height="11" rx="5" />
      <path d="M-25 -23 L25 -23 L33 9 L-33 9 Z" />
      <rect x="-37" y="9" width="74" height="12" rx="5" />
    </g>
  );
}

/** A hanging platform sign. Origin is the hanger bar; the panel drops below it. */
function SignBoard({
  x, y, label, frame, appear, swing = false, glowFrom, glowTo, scale = 1, weightSide = 0, weightColor = ACCENT,
}: {
  x: number; y: number; label: string; frame: number; appear: number;
  swing?: boolean; glowFrom?: number; glowTo?: number; scale?: number; weightSide?: -1 | 0 | 1; weightColor?: string;
}) {
  if (frame < appear) return null;
  const s = springIn(frame, appear, { damping: swing ? 7 : 11, stiffness: swing ? 150 : 160 });
  const rot = swing ? (1 - s) * -26 : 0;
  const glowIn = glowFrom !== undefined ? tween(frame, glowFrom, glowFrom + 14, 0, 1, EASE.out) : 0;
  const glowOut = glowTo !== undefined ? tween(frame, glowTo, glowTo + 18, 0, 1, EASE.in) : 0;
  const glow = glowIn * (1 - glowOut);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale * s})`}>
      <rect x="-62" y="-9" width="124" height="11" rx="5" fill={STEEL} />
      {[-42, 42].map((dx) => <line key={dx} x1={dx} y1="2" x2={dx} y2="24" stroke={STEEL} strokeWidth="7" />)}
      <rect x="-82" y="26" width="164" height="124" rx="14" fill={INK} />
      <rect x="-72" y="36" width="144" height="104" rx="9" fill="none" stroke={PAPER} strokeWidth="3" opacity="0.28" />
      <text x="0" y="68" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="19" letterSpacing="4" fill={FOG}>PLATFORM</text>
      <text x="0" y="130" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="66" fill={glow > 0.5 ? SAFFRON : PAPER}>{label}</text>
      {glow > 0 ? (
        <g opacity={glow}>
          <rect x="-86" y="22" width="172" height="132" rx="17" fill="none" stroke={ACCENT} strokeWidth="9" />
          <rect x={-86 - glow * 16} y={22 - glow * 16} width={172 + glow * 32} height={132 + glow * 32} rx={17 + glow * 8} fill="none" stroke={ACCENT} strokeWidth={8 * (1 - glow)} opacity={1 - glow} />
        </g>
      ) : null}
      {weightSide !== 0 ? <Weight x={weightSide * 66} y={208} scale={0.92} color={weightColor} /> : null}
    </g>
  );
}

/** The tannoy: a pole from the roof, a speaker cone and three expanding sound rings. */
function Tannoy({ x, y, frame, ringsFrom }: { x: number; y: number; frame: number; ringsFrom: number }) {
  // Rings stay inside the 1080 frame: the cone mouth sits at x + 72, the widest
  // ring reaches about x + 152.
  const live = frame >= ringsFrom && frame < ringsFrom + 90;
  return (
    <g>
      <line x1={x} y1={y - 200} x2={x} y2={y} stroke={STEEL} strokeWidth="12" />
      <g transform={`translate(${x} ${y})`}>
        <rect x="-20" y="-15" width="40" height="30" rx="8" fill={STEEL} />
        <path d="M14 -46 L72 -74 L72 74 L14 46 Z" fill={INK} />
        <ellipse cx="72" cy="0" rx="13" ry="74" fill={GOLD_LIGHT} />
        <ellipse cx="72" cy="0" rx="7" ry="56" fill={INK} opacity="0.35" />
        <path d="M14 -46 L72 -74 L72 -44 L14 -28 Z" fill={FOG} opacity="0.45" />
        <rect x="2" y="-30" width="18" height="60" rx="7" fill={STEEL} />
        {live
          ? [0, 1, 2].map((k) => {
              const ph = ((frame - ringsFrom + (k * 30) / 3) % 30) / 30;
              return (
                <path
                  key={k}
                  d={`M${84 + ph * 42} ${-56 - ph * 26} A ${96 + ph * 46} ${96 + ph * 46} 0 0 1 ${84 + ph * 42} ${56 + ph * 26}`}
                  fill="none"
                  stroke={SAFFRON}
                  strokeWidth={11 * (1 - ph)}
                  strokeLinecap="round"
                  opacity={(1 - ph) * 0.85}
                />
              );
            })
          : null}
      </g>
    </g>
  );
}

type Syl = { t: string; strong?: boolean };

/**
 * The tannoy's bubble. Types the announcement, then grows the stressed
 * syllable to 1.3 and bumps it up 12px before it settles a little. The growth
 * is a font-size change, not a transform, so the rest of the line reflows round
 * it instead of being overlapped. The tail points up and right, at the speaker.
 */
function StressBubble({
  parts, x, y, w, frame, from, until, bumpAt, size = 44,
}: {
  parts: Syl[]; x: number; y: number; w: number; frame: number; from: number; until?: number; bumpAt: number; size?: number;
}) {
  if (frame < from) return null;
  if (until !== undefined && frame >= until + 10) return null;
  const s = springIn(frame, from, { damping: 10, stiffness: 160 }) * (until !== undefined ? 1 - tween(frame, until, until + 10, 0, 1, EASE.in) : 1);
  const full = parts.reduce((n, p) => n + p.t.length, 0);
  const typed = Math.min(full, Math.max(0, Math.floor((frame - from - 3) * 1.6)));
  const grow = tween(frame, bumpAt, bumpAt + 6, 0, 1, EASE.out) * (1 - tween(frame, bumpAt + 10, bumpAt + 36, 0, 0.45, EASE.inOut));
  let seen = 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${s}) rotate(${(1 - s) * 3}deg)`, transformOrigin: "80% 0%" }}>
      <div style={{ position: "absolute", inset: 0, transform: "translate(8px, 10px)", background: INK, borderRadius: 40 }} />
      <div style={{ position: "relative", background: "#fff", border: `6px solid ${INK}`, borderRadius: 40, padding: "40px 34px 26px", fontSize: size, lineHeight: 1, fontWeight: 700, color: INK, whiteSpace: "nowrap" }}>
        {parts.map((p, i) => {
          const start = seen;
          seen += p.t.length;
          const shown = p.t.slice(0, Math.max(0, Math.min(p.t.length, typed - start)));
          const on = typed >= seen;
          return (
            <span
              key={i}
              style={{
                position: "relative",
                display: "inline-block",
                whiteSpace: "pre",
                verticalAlign: "baseline",
                fontSize: p.strong ? size * (1 + 0.3 * grow) : size,
                color: p.strong && on ? ACCENT : INK,
                fontWeight: p.strong ? 800 : 700,
                transform: p.strong ? `translateY(${-12 * grow}px)` : "none",
                zIndex: 0,
              }}
            >
              {shown}
              {p.strong ? <Highlight frame={frame} from={bumpAt + 4} color={SAFFRON} opacity={0.45} /> : null}
            </span>
          );
        })}
        <span style={{ opacity: typed < full ? (Math.floor(frame / 8) % 2 ? 1 : 0) : 0 }}>|</span>
      </div>
      <svg width="150" height="66" viewBox="0 0 150 66" style={{ position: "absolute", left: w - 250, top: -54 }}>
        <path d="M10 64 L96 64 L142 4 Z" fill={INK} />
        <path d="M30 58 L84 58 L120 14 Z" fill="#fff" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------- hook: the station outside
function HookScene({ frame }: { frame: number }) {
  const rise = (1 - springIn(frame, 8, { damping: 14, stiffness: 60, clamp: true })) * 540;
  const sun = springIn(frame, 0, { damping: 14, stiffness: 38, clamp: true });
  const trainX = 1760 - 1220 * springIn(frame, 44, { damping: 11, stiffness: 52 });
  const door = tween(frame, 130, 150, 0, 1, EASE.out) * 56;
  return (
    <AbsoluteFill style={{ background: SKY_MID }}>
      <Stage>
        <defs>
          <clipPath id="lst-train-body"><rect x="-370" y="820" width="740" height="180" rx="28" /></clipPath>
          <clipPath id="lst-door-a"><rect x="-212" y="840" width="124" height="122" /></clipPath>
          <clipPath id="lst-door-b"><rect x="88" y="840" width="124" height="122" /></clipPath>
        </defs>
        {/* evening sky in flat bands, deepest at the top */}
        {([[0, 380, SKY_HIGH], [380, 140, "#f09a58"], [520, 180, SKY_MID], [700, 130, "#f8b56c"], [830, 190, SKY_LOW]] as [number, number, string][]).map(([by, bh, bc]) => (
          <rect key={by} x="0" y={by} width="1080" height={bh} fill={bc} />
        ))}
        <circle cx="828" cy={706 - sun * 72} r="88" fill={SAFFRON} />
        {/* city silhouettes */}
        <g fill={CITY}>
          <path d="M60 1000 L60 650 L84 560 L108 650 L108 1000 Z" />
          <path d="M150 1000 L150 700 Q210 560 262 700 L262 1000 Z" />
          <rect x="300" y="760" width="86" height="240" />
          <rect x="404" y="820" width="64" height="180" />
          <rect x="640" y="800" width="74" height="200" />
          <path d="M742 1000 L742 740 L800 700 L800 1000 Z" />
          <rect x="930" y="840" width="120" height="160" />
        </g>
        {/* the station rises from the bottom */}
        <g transform={`translate(0 ${rise})`}>
          <rect x="132" y="770" width="74" height="236" fill={WALL} />
          <rect x="876" y="770" width="74" height="236" fill={WALL} />
          {[132, 876].map((cx) => <rect key={cx} x={cx} y="770" width="12" height="236" fill={INK} opacity="0.1" />)}
          <path d="M90 836 Q540 590 990 836 L990 790 Q540 540 90 790 Z" fill={GOLD} />
          <path d="M90 800 Q540 552 990 800 L990 786 Q540 536 90 786 Z" fill={GOLD_LIGHT} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const t = 0.08 + i * 0.14;
            const bx = 90 + t * 900;
            const by = (1 - t) * (1 - t) * 836 + 2 * t * (1 - t) * 590 + t * t * 836;
            return <line key={i} x1={bx} y1={by} x2={bx} y2={by + 34} stroke={GOLD} strokeWidth="6" opacity="0.75" />;
          })}
          {/* viaduct deck */}
          <rect x="0" y="1000" width="1080" height="58" fill="#cfc6b6" />
          <rect x="0" y="1052" width="1080" height="14" fill="#b8ae9c" />
          {[80, 420, 760].map((px) => <rect key={px} x={px} y="1066" width="86" height="374" fill="#c2b8a6" />)}
          {/* the train glides in and stops */}
          <g transform={`translate(${trainX} 0)`}>
            <rect x="-370" y="820" width="740" height="180" rx="28" fill="#f4f5fa" />
            <g clipPath="url(#lst-train-body)">
              <rect x="-370" y="938" width="740" height="22" fill={SAFFRON} />
              <rect x="-370" y="960" width="740" height="40" fill={INK} opacity="0.88" />
              <rect x="-344" y="848" width="92" height="62" rx="16" fill={GLASS} />
              <rect x="-236" y="852" width="18" height="56" rx="8" fill={FOG} opacity="0.6" />
              <rect x="-80" y="848" width="150" height="62" rx="14" fill={GLASS} />
              <rect x="228" y="848" width="124" height="62" rx="14" fill={GLASS} />
              <g clipPath="url(#lst-door-a)">
                <rect x="-212" y="840" width="124" height="122" fill="#dde4ef" />
                <rect x={-212 - door} y="840" width="62" height="122" fill="#f9fafd" stroke={INK} strokeWidth="3" />
                <rect x={-150 + door} y="840" width="62" height="122" fill="#f9fafd" stroke={INK} strokeWidth="3" />
              </g>
              <g clipPath="url(#lst-door-b)">
                <rect x="88" y="840" width="124" height="122" fill="#dde4ef" />
                <rect x={88 - door} y="840" width="62" height="122" fill="#f9fafd" stroke={INK} strokeWidth="3" />
                <rect x={150 + door} y="840" width="62" height="122" fill="#f9fafd" stroke={INK} strokeWidth="3" />
              </g>
            </g>
            <rect x="-370" y="820" width="740" height="180" rx="28" fill="none" stroke={INK} strokeWidth="6" />
            <circle cx="-348" cy="926" r="11" fill={SAFFRON} />
          </g>
        </g>
      </Stage>
      <KineticText frame={frame} from={14} text="Dubai Metro." x={80} y={130} size={94} color={INK} stagger={7} />
      <KineticText frame={frame} from={54} text="Friday evening." x={80} y={254} size={70} color={INK} stagger={7} style={{ opacity: 0.8 }} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- notice: on the platform
const SIGN_X = { four: 230, fourteen: 500, forty: 770 };

function PlatformScene({ frame }: { frame: number }) {
  const beat = frame < 330 ? 0 : frame < 480 ? 1 : 2;
  // you: centre, then walks left to the "4" sign and stays there.
  // Kept left of x 460 so the head never meets the tannoy bubble on the right.
  const youX = beat === 0 ? tween(frame, 238, 308, 350, 230, EASE.inOut) : 230;
  const walking = frame >= 238 && frame < 308;
  // a nod in n1, then turning left, right, left again in n3.
  const nod = frame >= 196 && frame < 236 ? Math.sin((frame - 196) / 3.2) * 9 * Math.exp(-(frame - 196) / 22) : 0;
  const sx = beat === 2 ? -Math.cos(tween(frame, 500, 596, 0, Math.PI * 2, EASE.inOut)) : -1;
  const mood = beat === 0 ? (frame > 214 ? "happy" : "neutral") : beat === 1 ? (frame < 424 ? "happy" : "think") : "think";
  const shrink = tween(frame, 596, 630, 0, 1, EASE.inOut);
  const leafX = tween(frame, 392, 474, 1130, -90, EASE.inOut);
  const ask = springIn(frame, 556, { damping: 9, stiffness: 150 });
  return (
    <AbsoluteFill style={{ background: CREAM }}>
      <Parallax frame={frame} from={150} to={630} zoom={1.06} originX={480} originY={820} layers={[
        { depth: 0, children: (
          <Stage>
            <rect width="1080" height="1440" fill={WALL} />
            {/* vaulted gold roof seen from inside */}
            <path d="M0 230 Q540 60 1080 230 L1080 0 L0 0 Z" fill={GOLD} />
            <path d="M0 230 Q540 60 1080 230" fill="none" stroke={INK} strokeWidth="8" opacity="0.35" />
            {[0.16, 0.34, 0.5, 0.66, 0.84].map((t) => {
              const bx = t * 1080;
              const by = (1 - t) * (1 - t) * 230 + 2 * t * (1 - t) * 60 + t * t * 230;
              return <g key={t}><line x1={bx} y1={by} x2={bx} y2={by - 70} stroke={INK} strokeWidth="5" opacity="0.14" /><ellipse cx={bx} cy={by - 16} rx="34" ry="9" fill={GOLD_LIGHT} /></g>;
            })}
            {/* back wall and pillars */}
            <rect x="0" y="230" width="1080" height="560" fill={WALL} />
            {[20, 330, 640, 1004].map((px) => (
              <g key={px}>
                <rect x={px} y="236" width="56" height="554" fill={WALL_DARK} />
                <rect x={px - 10} y="236" width="76" height="18" rx="6" fill={FOG} opacity="0.55" />
              </g>
            ))}
            <rect x="0" y="770" width="1080" height="20" fill={FOG} opacity="0.5" />
          </Stage>
        ) },
        { depth: 0.4, children: (
          <Stage>
            <g transform={`translate(540 176) scale(${1 - 0.46 * shrink}) translate(-540 ${-176 + (1 - shrink) * 0})`}>
              <SignBoard x={SIGN_X.four} y={240} label="4" frame={frame} appear={150} />
              <SignBoard x={SIGN_X.fourteen} y={240} label="14" frame={frame} appear={150} glowFrom={250} glowTo={300} />
              <SignBoard x={SIGN_X.forty} y={240} label="40" frame={frame} appear={488} swing glowFrom={540} glowTo={600} />
            </g>
          </Stage>
        ) },
        { depth: 0.8, children: (
          <Stage>
            {/* platform floor */}
            <rect x="0" y="790" width="1080" height="222" fill={FLOOR} />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1={i * 170 - 40} y1="790" x2={i * 170 + 10} y2="1012" stroke="#cbc3b4" strokeWidth="4" />)}
            <rect x="0" y="946" width="1080" height="38" fill={SAFFRON} opacity="0.9" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => <circle key={i} cx={34 + i * 92} cy="965" r="7" fill={INK} opacity="0.3" />)}
            <rect x="0" y="1004" width="1080" height="12" fill={INK} />
            {/* the track */}
            <rect x="0" y="1016" width="1080" height="200" fill={TRACK} />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={i * 140 - 30} y="1052" width="96" height="18" rx="4" fill="#2c3040" />)}
            <rect x="0" y="1062" width="1080" height="9" fill={STEEL} />
            <rect x="0" y="1146" width="1080" height="9" fill={STEEL} />
            {/* n2: one leaf blows across the empty track */}
            {beat === 1 && frame >= 392 && frame < 476 ? (
              <g transform={`translate(${leafX} ${1108 + Math.sin(frame / 7) * 16}) rotate(${frame * 6})`}>
                <path d="M0 0 Q18 -16 36 0 Q18 16 0 0 Z" fill="#9a7b3f" />
                <line x1="0" y1="0" x2="-12" y2="4" stroke="#7d6232" strokeWidth="3" />
              </g>
            ) : null}
            {/* n2 and n3: the bag is set down */}
            {beat >= 1 ? (
              <g transform={`translate(336 ${934 - (1 - springIn(frame, 352, { damping: 9, stiffness: 180 })) * 90})`}>
                <rect x="-38" y="-62" width="76" height="62" rx="10" fill={ACCENT} />
                <path d="M-18 -62 Q0 -92 18 -62" fill="none" stroke={INK} strokeWidth="7" />
                <rect x="-38" y="-38" width="76" height="12" fill={INK} opacity="0.35" />
              </g>
            ) : null}
            <g transform={`translate(0 ${nod})`}>
              <g transform={`translate(${youX} 0) scale(${sx} 1) translate(${-youX} 0)`}>
                <Character
                  who="you" x={youX} y={934} scale={1.05} facing={1} frame={frame} enter={154} slideFrom={120}
                  walking={walking} mood={mood} gesture={beat === 2 ? "think" : beat === 1 ? "idle" : "idle"} gestureAt={520}
                />
              </g>
            </g>
            {/* n3: a small "?" over you */}
            {beat === 2 && frame >= 556 ? (
              <g transform={`translate(392 470) scale(${ask})`}>
                <circle r="50" fill={INK} />
                <circle r="44" fill="#fff" />
                <text x="0" y="22" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="58" fill={ACCENT}>?</text>
                <circle cx="-34" cy="42" r="11" fill="#fff" stroke={INK} strokeWidth="4" />
              </g>
            ) : null}
          </Stage>
        ) },
      ]} />
      <Stage>
        <Tannoy x={880} y={312} frame={frame} ringsFrom={beat === 0 ? 166 : beat === 1 ? 346 : 496} />
      </Stage>
      {beat === 0 ? (
        <StressBubble frame={frame} from={176} until={320} bumpAt={218} x={470} y={438} w={580}
          parts={[{ t: "Platform " }, { t: "four" }, { t: "teen", strong: true }, { t: "." }]} />
      ) : null}
      {beat === 1 ? (
        <StressBubble frame={frame} from={352} until={470} bumpAt={388} x={470} y={438} w={580}
          parts={[{ t: "Platform " }, { t: "four", strong: true }, { t: "." }]} />
      ) : null}
      {beat === 2 ? (
        <StressBubble frame={frame} from={502} until={620} bumpAt={538} x={470} y={438} w={580}
          parts={[{ t: "Platform " }, { t: "for", strong: true }, { t: "ty." }]} />
      ) : null}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- explain: the stress seesaw
function Block({ frame, appear, leave, heavy, text, side }: { frame: number; appear: number; leave?: number; heavy: boolean; text: string; side: -1 | 1 }) {
  if (frame < appear) return null;
  if (leave !== undefined && frame > leave + 18) return null;
  const s = springIn(frame, appear, { damping: 9, stiffness: 170 });
  const out = leave !== undefined ? tween(frame, leave, leave + 18, 0, 1, EASE.in) : 0;
  const w = heavy ? 228 : 176;
  const h = heavy ? 150 : 110;
  return (
    <g transform={`translate(${side * 198} ${-14 - (1 - s) * 220 - out * 300})`} opacity={(1 - out) * Math.min(1, s * 2)}>
      <rect x={-w / 2 + 8} y={-h + 10} width={w} height={h} rx="16" fill={INK} opacity="0.18" />
      <rect x={-w / 2} y={-h} width={w} height={h} rx="16" fill={heavy ? ACCENT : "#fff"} stroke={INK} strokeWidth="5" />
      <text x="0" y={-h / 2 + (heavy ? 24 : 18)} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize={heavy ? 64 : 50} fill={heavy ? "#fff" : FAINT}>{text}</text>
      {heavy ? <Weight x={0} y={-h - 16} scale={0.78} color={ACCENT} /> : null}
    </g>
  );
}

function ExplainScene({ frame }: { frame: number }) {
  const tipA = springIn(frame, 720, { damping: 9, stiffness: 110 });
  const fadeA = 1 - tween(frame, 846, 868, 0, 1, EASE.inOut);
  const tipB = springIn(frame, 900, { damping: 9, stiffness: 110 });
  const angle = 9.5 * tipA * fadeA - 9.5 * tipB;
  const thunk = (at: number) => (frame > at && frame < at + 40 ? Math.sin((frame - at) / 1.7) * 3.2 * Math.exp(-(frame - at) / 9) : 0);
  const shake = thunk(722) + thunk(902);
  const card = springIn(frame, 1000, { damping: 11, stiffness: 120 });
  const mayaG = frame < 720 ? { g: "raise" as const, at: 648, from: "idle" as const }
    : frame < 880 ? { g: "point" as const, at: 720, from: "raise" as const }
    : frame < 900 ? { g: "raise" as const, at: 880, from: "point" as const }
    : { g: "point" as const, at: 900, from: "raise" as const };
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Stage>
        <defs>
          <pattern id="lst-dots" width="44" height="44" patternUnits="userSpaceOnUse"><circle cx="22" cy="22" r="3" fill={INK} opacity="0.08" /></pattern>
          <clipPath id="lst-maya-clip"><circle cx="165" cy="1030" r="103" /></clipPath>
        </defs>
        <rect width="1080" height="1440" fill="url(#lst-dots)" />
        {/* the seesaw: the heavy syllable tips it */}
        <g transform={`translate(0 ${shake})`}>
          <line x1="180" y1="662" x2="940" y2="662" stroke={INK} strokeWidth="9" opacity="0.2" strokeLinecap="round" />
          <path d="M506 662 L560 552 L614 662 Z" fill={INK} />
          <g transform={`translate(560 560) rotate(${angle})`}>
            <rect x="-310" y="-14" width="620" height="28" rx="14" fill={INK} />
            <rect x="-304" y="-12" width="608" height="9" rx="5" fill={WOOD_LIGHT} />
            <Block frame={frame} appear={660} leave={846} heavy={false} text="four" side={-1} />
            <Block frame={frame} appear={672} leave={846} heavy text="TEEN" side={1} />
            <Block frame={frame} appear={868} heavy text="FOR" side={-1} />
            <Block frame={frame} appear={880} heavy={false} text="ty" side={1} />
          </g>
          <circle cx="560" cy="560" r="17" fill={PAPER} stroke={INK} strokeWidth="6" />
        </g>
        <g opacity={tween(frame, 912, 934, 0, 1, EASE.out)}>
          <text x="250" y="724" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="46" fill={ACCENT}>start</text>
        </g>
        <g opacity={tween(frame, 736, 758, 0, 1, EASE.out)}>
          <text x="870" y="724" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="46" fill={ACCENT}>end</text>
        </g>
        {/* maya conducts from the corner */}
        <g transform={`translate(165 1030) scale(${springIn(frame, 644, { damping: 11, stiffness: 130 })}) translate(-165 -1030)`}>
          <circle cx="176" cy="1041" r="103" fill={INK} />
          <circle cx="165" cy="1030" r="103" fill="#fff" />
          <circle cx="165" cy="1030" r="103" fill="none" stroke={SAFFRON} strokeWidth="11" />
          <g clipPath="url(#lst-maya-clip)">
            <Character who="maya" x={165} y={1300} scale={0.66} facing={1} frame={frame} enter={648} talking={frame > 660 && frame < 930} mood="happy" gesture={mayaG.g} gestureAt={mayaG.at} from={mayaG.from} />
          </g>
        </g>
        {/* both words together, heavy syllable in accent with a weight under it */}
        {frame >= 1000 ? (
          <g transform={`translate(670 950) scale(${card}) translate(-670 -950)`}>
            <rect x="314" y="854" width="740" height="200" rx="34" fill={INK} opacity="0.16" />
            <rect x="306" y="846" width="740" height="200" rx="34" fill="#fff" stroke={INK} strokeWidth="5" />
            <g>
              <text x="470" y="952" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="70" fill={FAINT}>four<tspan fill={ACCENT}>TEEN</tspan></text>
              <Weight x={548} y={1026} scale={0.6} color={ACCENT} />
            </g>
            <line x1="796" y1="878" x2="796" y2="1014" stroke={FOG} strokeWidth="4" />
            <text x="926" y="952" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="70" fill={FAINT}><tspan fill={ACCENT}>FOR</tspan>ty</text>
            <Weight x={874} y={1026} scale={0.6} color={ACCENT} />
          </g>
        ) : null}
      </Stage>
      <Eyebrow text="WORD STRESS" x={80} y={132} frame={frame} from={640} />
      <KineticText frame={frame} from={650} text="one syllable is heavier" x={80} y={186} size={62} color={INK} stagger={4} weight={800} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- practise: say it with me
function KaraokeWord({
  frame, from, y, parts, size, glowFrom,
}: {
  frame: number; from: number; y: number; parts: Syl[]; size: number; glowFrom: number;
}) {
  const glow = tween(frame, glowFrom, glowFrom + 12, 0, 1, EASE.out) * (1 - tween(frame, glowFrom + 60, glowFrom + 76, 0, 1, EASE.in));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontSize: size, fontWeight: 800, lineHeight: 1 }}>
      {parts.map((p, i) => {
        const at = from + (p.strong ? 14 : 0);
        const s = springIn(frame, at, { damping: 8, stiffness: 210 });
        const on = frame >= at;
        const col = glow > 0.4 ? SEA : on ? (p.strong ? ACCENT : INK) : FOG;
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", verticalAlign: "baseline", fontSize: p.strong ? size * (1 + 0.08 * s) : size, color: col, transform: p.strong ? `translateY(${-10 * s}px)` : "none", textShadow: glow > 0.4 ? `0 0 ${16 * glow}px rgba(31,180,138,0.4)` : "none", zIndex: 0 }}>
            {p.t}
            {p.strong && on ? <Highlight frame={frame} from={at + 4} color={SAFFRON} opacity={0.5} /> : null}
          </span>
        );
      })}
    </div>
  );
}

function PractiseScene({ frame }: { frame: number }) {
  const circle = springIn(frame, 1110, { damping: 11, stiffness: 120 });
  const turn = springIn(frame, 1306, { damping: 9, stiffness: 160 });
  const mayaG = frame < 1172 ? { g: "raise" as const, at: 1126, from: "idle" as const }
    : frame < 1210 ? { g: "point" as const, at: 1172, from: "raise" as const }
    : frame < 1232 ? { g: "raise" as const, at: 1210, from: "point" as const }
    : { g: "point" as const, at: 1232, from: "raise" as const };
  return (
    <AbsoluteFill style={{ background: "#eef0ff" }}>
      <Stage>
        <defs><clipPath id="lst-prac-clip"><circle cx="540" cy="420" r="272" /></clipPath></defs>
        <g transform={`translate(540 420) scale(${circle}) translate(-540 -420)`}>
          <circle cx="552" cy="434" r="290" fill={INK} />
          <circle cx="540" cy="420" r="290" fill="#fff" />
          <circle cx="540" cy="420" r="290" fill="none" stroke={SAFFRON} strokeWidth="14" />
          <g clipPath="url(#lst-prac-clip)">
            <Character who="maya" x={540} y={1170} scale={2} facing={1} frame={frame} enter={1114} talking={frame > 1130 && frame < 1300} mood="happy" gesture={mayaG.g} gestureAt={mayaG.at} from={mayaG.from} />
          </g>
        </g>
        {/* the mic marks the learner's turn; it clears once the words light up */}
        {frame >= 1306 && frame < 1332 ? (
          <g transform={`translate(150 250) scale(${turn}) translate(-150 -250)`}>
            <Pulse frame={frame} x={150} y={250} size={118}>
              <g transform="translate(-29 -29) scale(2.4)" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" /></g>
            </Pulse>
            <text x="150" y="356" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="36" fill={INK}>Your turn</text>
          </g>
        ) : null}
      </Stage>
      <Eyebrow text="SAY IT WITH ME" x={0} y={742} align="center" frame={frame} from={1120} />
      <KaraokeWord frame={frame} from={1150} y={796} size={96} glowFrom={1330}
        parts={[{ t: "Four" }, { t: "teen", strong: true }, { t: "." }]} />
      <KaraokeWord frame={frame} from={1218} y={936} size={96} glowFrom={1330}
        parts={[{ t: "For", strong: true }, { t: "ty." }]} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- recap
function RecapScene({ frame }: { frame: number }) {
  const a = springIn(frame, 1506, { damping: 11, stiffness: 110 });
  return (
    <AbsoluteFill style={{ background: ACCENT }}>
      <Stage>
        <defs><pattern id="lst-stripes" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="30" height="60" fill={PAPER} opacity="0.06" /></pattern></defs>
        <rect width="1080" height="1440" fill="url(#lst-stripes)" />
        {/* the three platform signs come back, weighted on the stressed side */}
        <SignBoard x={226} y={790} label="4" frame={frame} appear={1540} />
        <SignBoard x={540} y={790} label="14" frame={frame} appear={1552} weightSide={1} weightColor={SAFFRON} />
        <SignBoard x={854} y={790} label="40" frame={frame} appear={1564} weightSide={-1} weightColor={SAFFRON} />
      </Stage>
      <div style={{ position: "absolute", left: 70, right: 70, top: 236, transform: `scale(${a}) rotate(${(1 - a) * -4}deg)`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", inset: 0, transform: "translate(10px, 14px)", background: INK, borderRadius: 54 }} />
        <div style={{ position: "relative", background: "#fff", borderRadius: 54, padding: "44px 52px 52px" }}>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 6, color: FAINT, textAlign: "center" }}>REMEMBER</div>
          {/* saffron reads as a chip, not as text: ink on saffron keeps the contrast */}
          <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 28 }}>
            <div style={{ fontSize: 92, fontWeight: 800, color: ACCENT, minWidth: 196 }}>teen</div>
            <div style={{ fontSize: 44, fontWeight: 700, color: INK, lineHeight: 1.15 }}>stress at the <span style={{ display: "inline-block", background: SAFFRON, color: INK, fontWeight: 800, borderRadius: 14, padding: "2px 16px" }}>END</span></div>
          </div>
          <div style={{ height: 4, background: FOG, borderRadius: 2, margin: "18px 0" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ fontSize: 92, fontWeight: 800, color: ACCENT, minWidth: 196 }}>ty</div>
            <div style={{ fontSize: 44, fontWeight: 700, color: INK, lineHeight: 1.15 }}>stress at the <span style={{ display: "inline-block", background: SAFFRON, color: INK, fontWeight: 800, borderRadius: 14, padding: "2px 16px" }}>START</span></div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- composition
export function PlatformExplainer({ l1 }: { l1?: Record<string, string> }) {
  const frame = useCurrentFrame();
  const beat = beatAt(frame);
  const progress = (frame - beat.from) / Math.max(1, Math.min(120, beat.to - beat.from));
  const k = karaoke(beat.line, Math.min(1, progress));
  const font: CSSProperties = { fontFamily: FONT };
  return (
    <AbsoluteFill style={{ ...font, background: PAPER, overflow: "hidden" }}>
      {beat.kind === "hook" ? <HookScene frame={frame} /> : null}
      {beat.kind === "notice" ? <PlatformScene frame={frame} /> : null}
      {beat.kind === "explain" ? <ExplainScene frame={frame} /> : null}
      {beat.kind === "practise" ? <PractiseScene frame={frame} /> : null}
      {beat.kind === "recap" ? <RecapScene frame={frame} /> : null}
      <Transition frame={frame} at={150} kind="wipe" color={SAFFRON} color2={INK} />
      <Transition frame={frame} at={330} kind="wipe" duration={18} color={INK} color2={SAFFRON} />
      <Transition frame={frame} at={480} kind="wipe" duration={18} color={INK} color2={SAFFRON} />
      <Transition frame={frame} at={630} kind="iris" color={PAPER} color2={ACCENT} cx={540} cy={620} />
      <Transition frame={frame} at={1110} kind="slide" color={ACCENT} color2={SAFFRON} />
      <Transition frame={frame} at={1500} kind="wipe" color={SAFFRON} color2={INK} />
      <CaptionBar line={beat.line} k={k} targets={beat.target} l1={l1?.[beat.id]} />
      <BeatProgress frame={frame} beats={LST_BEATS} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- L1 captions
export const LST_L1: Record<string, Record<string, string>> = {
  ar: {
    hook: "مترو دبي. مساء الجمعة.",
    n1: "الرصيف أربعة عشر.",
    n2: "الرصيف أربعة.",
    n3: "الرصيف أربعون.",
    explain: "fourTEEN: النبرة في النهاية. FORty: النبرة في البداية.",
    practise: "قلها معي.",
    recap: "teen في النهاية، ty في البداية.",
  },
  es: {
    hook: "Metro de Dubái. Viernes por la tarde.",
    n1: "Andén catorce.",
    n2: "Andén cuatro.",
    n3: "Andén cuarenta.",
    explain: "fourTEEN: acento al final. FORty: al principio.",
    practise: "Dilo conmigo.",
    recap: "teen al final, ty al principio.",
  },
  hi: {
    hook: "दुबई मेट्रो। शुक्रवार की शाम।",
    n1: "प्लेटफ़ॉर्म चौदह।",
    n2: "प्लेटफ़ॉर्म चार।",
    n3: "प्लेटफ़ॉर्म चालीस।",
    explain: "fourTEEN: ज़ोर अंत में। FORty: ज़ोर शुरू में।",
    practise: "मेरे साथ बोलो।",
    recap: "teen अंत में, ty शुरू में।",
  },
  ru: {
    hook: "Метро Дубая. Вечер пятницы.",
    n1: "Платформа четырнадцать.",
    n2: "Платформа четыре.",
    n3: "Платформа сорок.",
    explain: "fourTEEN: ударение в конце. FORty: в начале.",
    practise: "Скажи со мной.",
    recap: "teen в конце, ty в начале.",
  },
  tr: {
    hook: "Dubai Metrosu. Cuma akşamı.",
    n1: "Peron on dört.",
    n2: "Peron dört.",
    n3: "Peron kırk.",
    explain: "fourTEEN: vurgu sonda. FORty: vurgu başta.",
    practise: "Benimle söyle.",
    recap: "teen sonda, ty başta.",
  },
  zh: {
    hook: "迪拜地铁。星期五傍晚。",
    n1: "十四号站台。",
    n2: "四号站台。",
    n3: "四十号站台。",
    explain: "fourTEEN 重音在后。FORty 重音在前。",
    practise: "跟我一起说。",
    recap: "teen 在后，ty 在前。",
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
  component: PlatformExplainer,
  beats: LST_BEATS,
  duration: LST_DURATION,
  fps: 30,
  width: 1080,
  height: 1440,
  l1: LST_L1,
};
