"use client";

// "We're out of oat milk" (ATM-A2-INT-0009): a 2D flat-vector motion-graphics
// explainer built as a Remotion composition (3:4, 1080x1440, 30 fps, 50 s).
// Eight beats from docs/explainers/storyboards.md: hook, four notices, explain,
// practise aloud, recap. Single target: "Do you have ... instead?" answered with
// "That's fine, thank you." Built on the shared kit in ./lib on the Shoreditch
// cafe set, plus a glass-door fridge behind leo. Every value is a pure function
// of the frame, so the same component plays in the Player and renders to MP4.

import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { CSSProperties, ReactNode } from "react";
import {
  ACCENT, Badge, BeatProgress, CaptionBar, Character, Confetti, CREAM, Cup, EASE, Eyebrow, FAINT, FOG, FONT,
  Highlight, INK, karaoke, KineticText, MenuBoard, PAPER, PendantLamp, Plant, Pulse, SAFFRON, SEA, SpeechBubble,
  springIn, Stage, Steam, Transition, tween, Window, WOOD, WOOD_DARK, WOOD_LIGHT,
} from "./lib";
import type { Beat } from "./Cafe";

export const INT9_FPS = 30;
export const INT9_W = 1080;
export const INT9_H = 1440;

export const INT9_BEATS: Beat[] = [
  { id: "hook", kind: "hook", from: 0, to: 150, line: "A latte with oat milk, please." },
  { id: "n1", kind: "notice", from: 150, to: 300, line: "Sorry, we're out of oat milk.", target: ["out of"] },
  { id: "n2", kind: "notice", from: 300, to: 450, line: "Do you have soy milk instead?", target: ["instead"] },
  { id: "n3", kind: "notice", from: 450, to: 540, line: "Yes, we do." },
  { id: "n4", kind: "notice", from: 540, to: 690, line: "That's fine, thank you.", target: ["That's fine"] },
  { id: "explain", kind: "explain", from: 690, to: 1050, line: "Out of means none left. Instead means in its place.", target: ["Out of", "Instead"] },
  { id: "practise", kind: "practise", from: 1050, to: 1380, line: "Say it with me. Do you have soy milk instead?", target: ["Do you have", "instead"], pauseAt: 1260 },
  { id: "recap", kind: "recap", from: 1380, to: 1500, line: "Do you have ... instead? That's fine.", target: ["Do you have", "instead", "That's fine"] },
];
export const INT9_DURATION = 1500;

function beatAt(frame: number): Beat {
  return INT9_BEATS.find((b) => frame >= b.from && frame < b.to) ?? INT9_BEATS[INT9_BEATS.length - 1];
}

// Milk colours, kept inside the kit family: oat is the ACCENT blue, soy the leaf
// green the storyboard asks for, almond the warm wood tone.
const OAT = "#3a3fc7";
const SOY = "#1fb48a";
const ALMOND = "#c9a27a";
const FRIDGE_FRAME = "#c3c7dd";
const FRIDGE_GLASS = "#dcebf3";
const FRIDGE_BACK = "#eaf2f7";
const SHELF = "#aab0c9";

// ---------------------------------------------------------------- small props

/**
 * A gable-top milk carton. `dotted` draws the empty slot outline the storyboard
 * uses for "out of", so the same shape carries both states.
 */
function Carton({
  x, baseY, w = 64, color, dotted = false, dash = FAINT, tilt = 0, opacity = 1, sprig = false, label,
}: {
  x: number; baseY: number; w?: number; color: string; dotted?: boolean; dash?: string; tilt?: number;
  opacity?: number; sprig?: boolean; label?: string;
}) {
  const h = w * 1.62;
  const gable = w * 0.44;
  const top = baseY - h;
  const body = `M${x} ${baseY} L${x} ${top + gable} L${x + w / 2} ${top} L${x + w} ${top + gable} L${x + w} ${baseY} Z`;
  const cx = x + w / 2;
  const cy = baseY - h / 2;
  return (
    <g opacity={opacity} transform={tilt ? `rotate(${tilt} ${cx} ${cy})` : undefined}>
      {dotted ? (
        <path d={body} fill="none" stroke={dash} strokeWidth="5" strokeLinejoin="round" strokeDasharray="13 11" />
      ) : (
        <>
          <path d={body} fill={color} />
          <path d={`M${x} ${top + gable} L${x + w / 2} ${top} L${x + w} ${top + gable} Z`} fill="#fff" opacity="0.22" />
          <rect x={x} y={top + gable + h * 0.26} width={w} height={h * 0.2} fill="#fff" opacity="0.88" />
          {sprig ? (
            <g stroke={color} strokeWidth="3.4" strokeLinecap="round" fill="none" transform={`translate(${cx} ${top + gable + h * 0.36})`}>
              <path d="M0 10 L0 -10" />
              <path d="M0 -4 L-9 -11 M0 -4 L9 -11 M0 3 L-9 -4 M0 3 L9 -4" />
            </g>
          ) : null}
          {label && w >= 84 ? (
            <text x={cx} y={top + gable + h * 0.42} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize={w * 0.24} fill={color}>
              {label}
            </text>
          ) : null}
        </>
      )}
    </g>
  );
}

/** The one drop that falls out of the last oat carton. */
function Drop({ frame, from, x, y, to }: { frame: number; from: number; x: number; y: number; to: number }) {
  const p = tween(frame, from, from + 22, 0, 1, EASE.in);
  if (p <= 0) return null;
  const ring = tween(frame, from + 22, from + 40, 0, 1, EASE.out);
  return (
    <g>
      {p < 1 ? <ellipse cx={x} cy={y + (to - y) * p} rx="7" ry="10" fill={OAT} /> : null}
      {ring > 0 ? (
        <ellipse cx={x} cy={to} rx={10 + ring * 26} ry={3 + ring * 7} fill="none" stroke={OAT} strokeWidth="4" opacity={1 - ring} />
      ) : null}
    </g>
  );
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

/** The glass-door fridge behind leo. Cartons are supplied by the scene. */
function Fridge({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: ReactNode }) {
  const inx = x + 16;
  const inw = w - 32;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="20" fill={FRIDGE_FRAME} />
      <rect x={inx} y={y + 16} width={inw} height={h - 32} rx="12" fill={FRIDGE_BACK} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={inx} y={y + 190 + i * 170} width={inw} height="9" rx="4" fill={SHELF} />
      ))}
      {children}
      <rect x={inx} y={y + 16} width={inw} height={h - 32} rx="12" fill={FRIDGE_GLASS} opacity="0.4" />
      <path d={`M${inx + 30} ${y + h - 40} L${inx + inw - 36} ${y + 40} L${inx + inw - 4} ${y + 40} L${inx + 62} ${y + h - 40} Z`} fill="#fff" opacity="0.3" />
      <rect x={x} y={y} width={w} height={h} rx="20" fill="none" stroke={INK} strokeWidth="6" />
      <rect x={x + w - 34} y={y + h / 2 - 60} width="12" height="120" rx="6" fill={INK} opacity="0.75" />
    </g>
  );
}

// The fridge sits on the back wall behind the counter, to leo's right, so the
// camera pan in n1 lands on it.
const FR = { x: 450, y: 296, w: 272, h: 640 };
const SLOT_Y = FR.y + 199 + 170; // the middle shelf line
const SLOT_X = [FR.x + 32, FR.x + 112, FR.x + 192];

// ---------------------------------------------------------------- the cafe set

function CafeWall({ frame }: { frame: number }) {
  return (
    <Stage>
      <rect x="-240" y="-40" width="1560" height="1520" fill={CREAM} />
      <rect x="-240" y="700" width="1560" height="180" fill="#e9d8bf" />
      {[-1, 0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={30 + i * 176} y="724" width="140" height="134" rx="8" fill="none" stroke="#d9c4a4" strokeWidth="6" />
      ))}
      <rect x="-240" y="694" width="1560" height="12" fill={WOOD_LIGHT} />
      <Window x={28} y={250} w={270} h={340} />
      <MenuBoard x={752} y={248} w={306} h={300} items={[["Latte", "3.20"], ["Coffee", "2.50"], ["Tea", "2.00"]]} />
      <Plant x={1028} y={694} scale={0.6} frame={frame} seed={2} />
      <PendantLamp x={150} length={70} frame={frame} seed={0} />
      <PendantLamp x={930} length={70} frame={frame} seed={2} />
    </Stage>
  );
}

function CafeCounter({ frame, children }: { frame: number; children?: ReactNode }) {
  return (
    <>
      <rect x="-240" y="924" width="1560" height="330" fill={WOOD} />
      {[-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <rect key={i} x={i * 124 - 10} y="950" width="100" height="250" rx="8" fill="none" stroke={WOOD_DARK} strokeWidth="5" opacity="0.6" />
      ))}
      <rect x="-240" y="1228" width="1560" height="26" fill={WOOD_DARK} />
      <rect x="-240" y="878" width="1560" height="50" rx="6" fill={WOOD_LIGHT} />
      <rect x="-240" y="878" width="1560" height="10" fill="#dcc096" />
      {children}
      <Plant x={1040} y={878} scale={0.8} frame={frame} seed={5} />
      <rect x="-240" y="1254" width="1560" height="200" fill="#e4d7c4" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <rect key={i} x={(i % 2) * 140 + Math.floor(i / 2) * 280 - 280} y={1254 + (i % 2) * 70} width="140" height="70" fill="#d8c9b2" />
      ))}
    </>
  );
}

/** One camera layer. depth 0 is the far wall, 1 the foreground. */
function Layer({ pan, zoom, depth, children }: { pan: number; zoom: number; depth: number; children: ReactNode }) {
  const z = 1 + (zoom - 1) * (0.55 + depth * 0.9);
  return (
    <AbsoluteFill style={{ transform: `translateX(${pan * (0.3 + depth)}px) scale(${z})`, transformOrigin: "540px 860px" }}>
      {children}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- hook + notices

/**
 * One continuous cafe scene for the hook and the four notice beats, so the
 * camera pan to the fridge and back reads as one take.
 */
function CafeScene({ frame }: { frame: number }) {
  // the camera pans right onto the fridge with leo in n1, then back for n2
  const pan = tween(frame, 170, 238, 0, -168, EASE.inOut) + tween(frame, 306, 374, 0, 168, EASE.inOut);
  const zoom = tween(frame, 0, 690, 1, 1.07, EASE.inOut);

  const hook = frame < 150;
  const n1 = frame >= 150 && frame < 300;
  const n2 = frame >= 300 && frame < 450;
  const n3 = frame >= 450 && frame < 540;
  const n4 = frame >= 540;

  // the oat carton leaves the slot into leo's hand, is tipped, then goes away
  const lifted = tween(frame, 196, 224, 0, 1, EASE.inOut);
  const liftX = SLOT_X[0] + (458 - SLOT_X[0]) * lifted;
  const liftY = SLOT_Y + (568 - SLOT_Y) * lifted;
  const tip = tween(frame, 228, 254, 0, 180, EASE.inOut);
  const oatGone = tween(frame, 288, 306, 1, 0, EASE.in);
  const slotEmpty = frame >= 206;

  // the soy carton slides along the shelf from the right into the empty slot
  const soyIn = tween(frame, 326, 368, 0, 1, EASE.out);
  const bump = frame > 360 ? Math.sin((frame - 360) / 2.2) * 3 * Math.max(0, 1 - (frame - 360) / 16) : 0;
  const soyX = 790 + (SLOT_X[0] - 790) * soyIn + bump;

  const leoTalks = (frame > 164 && frame < 236) || (frame > 468 && frame < 500);
  const youTalks = (frame > 40 && frame < 118) || (frame > 318 && frame < 400) || (frame > 558 && frame < 628);

  const leoGesture = hook
    ? { g: "wave" as const, at: 8, from: "idle" as const }
    : n1
      ? { g: "raise" as const, at: 188, from: "wave" as const }
      : n2
        ? { g: "idle" as const, at: 306, from: "raise" as const }
        : n3
          ? { g: "raise" as const, at: 462, from: "idle" as const }
          : { g: "serve" as const, at: 560, from: "raise" as const };
  const youGesture = hook
    ? { g: "raise" as const, at: 34, from: "idle" as const }
    : n1
      ? { g: "think" as const, at: 206, from: "raise" as const }
      : n2
        ? { g: "raise" as const, at: 316, from: "think" as const }
        : n3
          ? { g: "idle" as const, at: 456, from: "raise" as const }
          : { g: "thumbs" as const, at: 584, from: "idle" as const };
  const youMood = n1 ? (frame > 236 ? "surprised" as const : "neutral" as const) : n2 ? "think" as const : frame > 470 ? "happy" as const : "neutral" as const;
  const leoMood = n1 ? "think" as const : frame >= 450 ? "happy" as const : "happy" as const;

  return (
    <AbsoluteFill style={{ background: CREAM }}>
      <Layer pan={pan} zoom={zoom} depth={0}>
        <CafeWall frame={frame} />
      </Layer>
      <Layer pan={pan} zoom={zoom} depth={0.2}>
        <Stage>
          <Fridge {...FR}>
            {/* top shelf: spare stock */}
            <Carton x={FR.x + 32} baseY={FR.y + 199} w={56} color={ALMOND} opacity={0.9} />
            <Carton x={FR.x + 112} baseY={FR.y + 199} w={56} color={SOY} opacity={0.9} />
            <Carton x={FR.x + 192} baseY={FR.y + 199} w={56} color={ALMOND} opacity={0.9} />
            {/* middle shelf: the oat slot, the almond, and the soy that arrives */}
            {slotEmpty ? <Carton x={SLOT_X[0]} baseY={SLOT_Y} w={64} color={OAT} dotted /> : null}
            {!slotEmpty ? <Carton x={SLOT_X[0]} baseY={SLOT_Y} w={64} color={OAT} sprig /> : null}
            <Carton x={SLOT_X[1]} baseY={SLOT_Y} w={64} color={ALMOND} />
            {frame >= 300 ? <Carton x={soyX} baseY={SLOT_Y} w={64} color={SOY} label="SOY" /> : <Carton x={SLOT_X[2]} baseY={SLOT_Y} w={64} color={SOY} label="SOY" />}
            {/* bottom shelf */}
            <Carton x={FR.x + 72} baseY={FR.y + 199 + 340} w={56} color={ALMOND} opacity={0.75} />
            <Carton x={FR.x + 152} baseY={FR.y + 199 + 340} w={56} color={SOY} opacity={0.75} />
          </Fridge>
        </Stage>
      </Layer>
      <Layer pan={pan} zoom={zoom} depth={0.45}>
        <Stage>
          <Character
            who="leo" x={330} y={1150} scale={1.5} facing={1} frame={frame} enter={0} slideFrom={-90}
            talking={leoTalks} mood={leoMood} gesture={leoGesture.g} gestureAt={leoGesture.at} from={leoGesture.from}
          />
          {/* the gag: leo lifts the last oat carton and turns it over */}
          {frame >= 196 && frame < 306 ? (
            <g opacity={oatGone}>
              <Carton x={liftX} baseY={liftY} w={64} color={OAT} sprig tilt={tip} />
              <Drop frame={frame} from={258} x={liftX + 36} y={liftY + 6} to={872} />
            </g>
          ) : null}
          <CafeCounter frame={frame}>
            {/* the oat carton the order is about, bouncing on the counter */}
            {hook ? (
              <g transform={`translate(0 ${Math.sin(frame / 7) * 8 - 8})`}>
                <g transform={`translate(175 876) scale(${springIn(frame, 46, { damping: 8, stiffness: 190 })}) translate(-175 -876)`}>
                  <Carton x={132} baseY={876} w={86} color={OAT} sprig />
                </g>
              </g>
            ) : null}
            {/* leo holds up the soy carton in n3, then pours and serves in n4 */}
            {frame >= 452 && frame < 566 ? (
              <g>
                <Carton x={458} baseY={568} w={84} color={SOY} label="SOY" />
                <Tick frame={frame} from={486} x={500} y={452} size={0.8} />
              </g>
            ) : null}
            {n4 ? (
              <>
                <Cup kind="mug" x={560} y={876} frame={frame} appear={568} slideFrom={-150} seed={3} />
                {frame > 600 ? <Steam x={560} y={812} frame={frame} seed={3} /> : null}
              </>
            ) : null}
          </CafeCounter>
        </Stage>
      </Layer>
      <Layer pan={pan} zoom={zoom} depth={0.85}>
        <Stage>
          <Character
            who="you" x={848} y={1250} scale={1.55} facing={-1} frame={frame} enter={6} slideFrom={260}
            talking={youTalks} mood={youMood} gesture={youGesture.g} gestureAt={youGesture.at} from={youGesture.from}
          />
        </Stage>
      </Layer>

      {hook ? <SpeechBubble text="A latte with oat milk, please." x={150} y={168} w={660} from={30} frame={frame} tail="right" tailX={530} /> : null}
      {n1 ? <SpeechBubble text="Sorry, we're out of oat milk." targets={["out of"]} x={96} y={176} w={620} from={162} frame={frame} tail="left" tailX={236} /> : null}
      {n2 ? <SpeechBubble text="Do you have soy milk instead?" targets={["instead"]} x={150} y={168} w={660} from={314} frame={frame} tail="right" tailX={530} /> : null}
      {n3 ? <SpeechBubble text="Yes, we do." x={96} y={214} w={400} from={464} frame={frame} tail="left" tailX={210} /> : null}
      {n4 ? <SpeechBubble text="That's fine, thank you." targets={["That's fine"]} x={150} y={196} w={620} from={554} frame={frame} tail="right" tailX={500} /> : null}

      {n3 ? <Badge frame={frame} from={500} text="soy" x={768} y={672} size={92} color={SEA} /> : null}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- explain

const TRAIN: { text: string; w: number; accent: boolean }[] = [
  { text: "Do you have", w: 352, accent: false },
  { text: "soy milk", w: 268, accent: false },
  { text: "instead?", w: 262, accent: true },
];

function ExplainScene({ frame }: { frame: number }) {
  const fade = tween(frame, 714, 744, 0, 1, EASE.out);
  const oatSolid = tween(frame, 720, 752, 1, 0, EASE.inOut);
  const soyIn = tween(frame, 840, 884, 0, 1, EASE.out);
  const soyX = 980 + (300 - 980) * soyIn;
  const roll = tween(frame, 930, 1000, 0, 1, EASE.out);
  const trainX = -980 + 980 * roll;
  const maya = springIn(frame, 706, { damping: 11, stiffness: 130 });
  let carX = 0;

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Stage>
        <defs>
          <pattern id="int9-dots" width="44" height="44" patternUnits="userSpaceOnUse">
            <circle cx="22" cy="22" r="3" fill={INK} opacity="0.08" />
          </pattern>
          <clipPath id="int9-maya"><circle cx="940" cy="1084" r="86" /></clipPath>
        </defs>
        <rect width="1080" height="1440" fill="url(#int9-dots)" />

        {/* top half: the shelf with two slots */}
        <g opacity={fade}>
          <rect x="190" y="478" width="700" height="12" rx="6" fill={SHELF} />
          <rect x="206" y="490" width="26" height="54" rx="8" fill={SHELF} opacity="0.55" />
          <rect x="848" y="490" width="26" height="54" rx="8" fill={SHELF} opacity="0.55" />
          {/* left slot: oat goes from solid to a dotted outline */}
          <Carton x={300} baseY={478} w={104} color={OAT} dotted />
          {oatSolid > 0.01 ? (
            <g opacity={oatSolid}><Carton x={300} baseY={478} w={104} color={OAT} sprig /></g>
          ) : null}
          {/* right slot: the almond that was never the question */}
          <Carton x={640} baseY={478} w={104} color={ALMOND} opacity={0.45} />
          {/* the soy slides in and takes the oat's place */}
          {frame >= 836 ? <Carton x={soyX} baseY={478} w={104} color={SOY} label="SOY" /> : null}
        </g>

        {/* the question as a three-carriage train */}
        <g opacity={tween(frame, 926, 952, 0, 1, EASE.out)} transform={`translate(${trainX} 0)`}>
          <rect x="78" y="948" width="924" height="10" rx="5" fill={INK} opacity="0.25" />
          {TRAIN.map((car, i) => {
            const x = 96 + carX;
            carX += car.w + 18;
            return (
              <g key={car.text}>
                <rect x={x + 8} y="788" width={car.w} height="150" rx="22" fill={INK} opacity="0.18" />
                <rect x={x} y="780" width={car.w} height="150" rx="22" fill="#fff" stroke={INK} strokeWidth="6" />
                <text
                  x={x + car.w / 2} y="872" textAnchor="middle" fontFamily={FONT} fontWeight="800"
                  fontSize={car.accent ? 58 : 52} fill={car.accent ? ACCENT : INK}
                >
                  {car.text}
                </text>
                <circle cx={x + 42} cy="946" r="22" fill={INK} />
                <circle cx={x + car.w - 42} cy="946" r="22" fill={INK} />
                {i < TRAIN.length - 1 ? <rect x={x + car.w} y="912" width="18" height="12" rx="6" fill={INK} /> : null}
                {car.accent ? (
                  <g>
                    <line x1={x + car.w - 30} y1="780" x2={x + car.w - 30} y2="716" stroke={INK} strokeWidth="6" />
                    <path d={`M${x + car.w - 30} 716 L${x + car.w + 42} 734 L${x + car.w - 30} 752 Z`} fill={SAFFRON} />
                  </g>
                ) : null}
              </g>
            );
          })}
        </g>

        {/* maya presents from the corner circle */}
        <g transform={`translate(940 1084) scale(${maya}) translate(-940 -1084)`}>
          <circle cx="948" cy="1094" r="86" fill={INK} />
          <circle cx="940" cy="1084" r="86" fill="#fff" />
          <circle cx="940" cy="1084" r="86" fill="none" stroke={SAFFRON} strokeWidth="9" />
          <g clipPath="url(#int9-maya)">
            <Character who="maya" x={940} y={1300} scale={0.64} facing={-1} frame={frame} enter={708} talking={frame > 720 && frame < 900} mood="happy" gesture="point" gestureAt={742} />
          </g>
        </g>
      </Stage>

      <Eyebrow text="WHAT THEY MEAN" x={80} y={150} frame={frame} from={700} />
      <KineticText frame={frame} from={756} text="out of = none left" x={80} y={562} size={56} color={INK} targets={["out", "of"]} targetColor={ACCENT} stagger={4} />
      <KineticText frame={frame} from={876} text="instead = in its place" x={80} y={650} size={56} color={INK} targets={["instead"]} targetColor={ACCENT} marker={SAFFRON} markerDelay={14} stagger={4} />
      <Eyebrow text="INSTEAD GOES LAST" x={80} y={716} frame={frame} from={1006} size={32} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- practise

const PRACTISE_LINE = "Do you have soy milk instead?";
const PRACTISE_TARGETS = [0, 1, 2, 5];

function PractiseScene({ frame }: { frame: number }) {
  const words = PRACTISE_LINE.split(" ");
  const total = PRACTISE_LINE.length;
  let acc = 0;
  const reach = words.map((w) => {
    acc += w.length + 1;
    return 1104 + (acc / total) * 140;
  });
  const circle = springIn(frame, 1050, { damping: 11, stiffness: 120 });
  const yourTurn = frame >= 1260;
  const turn = springIn(frame, 1260, { damping: 9, stiffness: 160 });
  const leoGesture = frame < 1292 ? { g: "listen" as const, at: 1068, from: "idle" as const } : { g: "thumbs" as const, at: 1292, from: "listen" as const };

  return (
    <AbsoluteFill style={{ background: "#eaf1fb" }}>
      <Stage>
        <defs><clipPath id="int9-leo"><circle cx="540" cy="440" r="300" /></clipPath></defs>
        <g transform={`translate(540 440) scale(${circle}) translate(-540 -440)`}>
          <circle cx="552" cy="454" r="300" fill={INK} />
          <circle cx="540" cy="440" r="300" fill="#fff" />
          <circle cx="540" cy="440" r="300" fill="none" stroke={SAFFRON} strokeWidth="14" />
          <g clipPath="url(#int9-leo)">
            <Character
              who="leo" x={540} y={1186} scale={1.88} facing={1} frame={frame} enter={1054}
              talking={frame > 1070 && frame < 1240} mood="happy"
              gesture={leoGesture.g} gestureAt={leoGesture.at} from={leoGesture.from}
            />
          </g>
        </g>
        {yourTurn ? (
          <g transform={`translate(152 246) scale(${turn}) translate(-152 -246)`}>
            <Pulse frame={frame} x={152} y={246} size={120}>
              <g transform="translate(-30 -30) scale(2.5)" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" />
              </g>
            </Pulse>
            <text x="152" y="354" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="36" fill={INK}>Your turn</text>
          </g>
        ) : null}
        {/* on resume the soy carton pops a tick */}
        {frame >= 1286 ? (
          <g>
            <Carton x={856} baseY={318} w={84} color={SOY} label="SOY" />
            <Tick frame={frame} from={1300} x={940} y={206} size={0.8} />
          </g>
        ) : null}
      </Stage>

      <Eyebrow text="SAY IT WITH ME" x={0} y={796} align="center" frame={frame} from={1060} />
      <div
        style={{
          position: "absolute", left: 60, right: 60, top: 852, display: "flex", flexWrap: "wrap",
          justifyContent: "center", columnGap: 24, fontSize: 92, fontWeight: 800, lineHeight: 1.16, zIndex: 0,
        }}
      >
        {words.map((w, i) => {
          const s = springIn(frame, reach[i], { damping: 8, stiffness: 220 });
          const on = frame >= reach[i];
          const target = PRACTISE_TARGETS.includes(i);
          const last = i === words.length - 1;
          return (
            <span
              key={i}
              style={{
                position: "relative", display: "inline-block",
                color: on ? (target ? ACCENT : INK) : FOG,
                transform: `translateY(${on ? (1 - s) * -14 - (last ? 10 : 0) : 0}px) scale(${on ? 1 + (1 - s) * 0.18 : 1})`,
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

function RecapScene({ frame }: { frame: number }) {
  const a = springIn(frame, 1386, { damping: 11, stiffness: 110 });
  return (
    <AbsoluteFill style={{ background: ACCENT }}>
      <Stage>
        <defs>
          <pattern id="int9-stripes" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="30" height="60" fill={PAPER} opacity="0.06" />
          </pattern>
        </defs>
        <rect width="1080" height="1440" fill="url(#int9-stripes)" />
        <g transform={`translate(418 1004) scale(${springIn(frame, 1428, { damping: 9, stiffness: 180 })}) translate(-418 -1004)`}>
          <Carton x={356} baseY={1004} w={124} color={OAT} dotted dash={PAPER} />
        </g>
        <g opacity={tween(frame, 1440, 1458, 0, 1, EASE.out)}>
          <path d="M496 918 L584 918" stroke={SAFFRON} strokeWidth="11" strokeLinecap="round" />
          <path d="M566 900 L592 918 L566 936" fill="none" stroke={SAFFRON} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g transform={`translate(662 1004) scale(${springIn(frame, 1446, { damping: 9, stiffness: 180 })}) translate(-662 -1004)`}>
          <Carton x={600} baseY={1004} w={124} color={SOY} label="SOY" />
        </g>
        <Confetti frame={frame} from={1384} count={80} seed={9} />
      </Stage>
      <div
        style={{
          position: "absolute", left: 72, right: 72, top: 212,
          transform: `scale(${a}) rotate(${(1 - a) * -5}deg)`, transformOrigin: "50% 50%",
        }}
      >
        <div style={{ position: "absolute", inset: 0, transform: "translate(10px, 14px)", background: INK, borderRadius: 56 }} />
        <div style={{ position: "relative", background: "#fff", borderRadius: 56, padding: "46px 48px 52px", textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 6, color: FAINT }}>REMEMBER</div>
          <div style={{ fontSize: 76, fontWeight: 800, color: INK, lineHeight: 1.12, marginTop: 14 }}>
            Do you have
            <span style={{ color: SAFFRON, letterSpacing: 4 }}> … </span>
            <span style={{ position: "relative", display: "inline-block", color: ACCENT, zIndex: 0 }}>
              instead?
              <Highlight frame={frame} from={1416} color={SAFFRON} />
            </span>
          </div>
          <div style={{ fontSize: 62, fontWeight: 800, color: SEA, marginTop: 18 }}>That&apos;s fine.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- composition

export function OatMilkExplainer({ l1 }: { l1?: Record<string, string> }) {
  const frame = useCurrentFrame();
  const beat = beatAt(frame);
  const progress = (frame - beat.from) / Math.max(1, Math.min(120, beat.to - beat.from));
  const k = karaoke(beat.line, Math.min(1, progress));
  const font: CSSProperties = { fontFamily: FONT };
  return (
    <AbsoluteFill style={{ ...font, background: PAPER, overflow: "hidden" }}>
      {beat.kind === "hook" || beat.kind === "notice" ? <CafeScene frame={frame} /> : null}
      {beat.kind === "explain" ? <ExplainScene frame={frame} /> : null}
      {beat.kind === "practise" ? <PractiseScene frame={frame} /> : null}
      {beat.kind === "recap" ? <RecapScene frame={frame} /> : null}
      <Transition frame={frame} at={690} kind="iris" color={PAPER} color2={ACCENT} cx={540} cy={620} />
      <Transition frame={frame} at={1050} kind="slide" color={ACCENT} color2={SAFFRON} />
      <Transition frame={frame} at={1380} kind="wipe" color={SAFFRON} color2={INK} />
      <CaptionBar line={beat.line} k={k} targets={beat.target} l1={l1?.[beat.id]} />
      <BeatProgress frame={frame} beats={INT9_BEATS} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- L1 captions
export const INT9_L1: Record<string, Record<string, string>> = {
  ar: {
    hook: "لاتيه بحليب الشوفان، من فضلك.",
    n1: "آسف، نفد حليب الشوفان.",
    n2: "هل لديك حليب الصويا بدلًا منه؟",
    n3: "نعم، لدينا.",
    n4: "لا بأس، شكرًا.",
    explain: "Out of تعني لم يبقَ شيء. Instead تعني بدلًا منه.",
    practise: "قلها معي.",
    recap: "هل لديك ... بدلًا منه؟ لا بأس.",
  },
  es: {
    hook: "Un latte con leche de avena, por favor.",
    n1: "Lo siento, no queda leche de avena.",
    n2: "¿Tienes leche de soja en su lugar?",
    n3: "Sí, tenemos.",
    n4: "Está bien, gracias.",
    explain: "Out of: no queda. Instead: en su lugar.",
    practise: "Dilo conmigo.",
    recap: "¿Tienes ... en su lugar? Está bien.",
  },
  hi: {
    hook: "ओट मिल्क वाला लाते, कृपया।",
    n1: "माफ़ कीजिए, ओट मिल्क ख़त्म है।",
    n2: "क्या इसकी जगह सोया मिल्क है?",
    n3: "हाँ, है।",
    n4: "ठीक है, धन्यवाद।",
    explain: "Out of मतलब ख़त्म। Instead मतलब उसकी जगह।",
    practise: "मेरे साथ बोलो।",
    recap: "क्या ... इसकी जगह है? ठीक है।",
  },
  ru: {
    hook: "Латте на овсяном молоке, пожалуйста.",
    n1: "Извините, овсяное молоко закончилось.",
    n2: "А соевое молоко есть вместо него?",
    n3: "Да, есть.",
    n4: "Хорошо, спасибо.",
    explain: "Out of: ничего не осталось. Instead: вместо него.",
    practise: "Скажи со мной.",
    recap: "А ... есть вместо него? Хорошо.",
  },
  tr: {
    hook: "Yulaf sütlü latte, lütfen.",
    n1: "Üzgünüm, yulaf sütü bitti.",
    n2: "Onun yerine soya sütü var mı?",
    n3: "Evet, var.",
    n4: "Tamam, teşekkürler.",
    explain: "Out of: kalmadı. Instead: onun yerine.",
    practise: "Benimle söyle.",
    recap: "Onun yerine ... var mı? Tamam.",
  },
  zh: {
    hook: "一杯燕麦奶拿铁，谢谢。",
    n1: "抱歉，燕麦奶没了。",
    n2: "那有豆奶吗？",
    n3: "有的。",
    n4: "好的，谢谢。",
    explain: "Out of 表示没了。Instead 表示代替。",
    practise: "跟我一起说。",
    recap: "那有……吗？好的。",
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
  component: OatMilkExplainer,
  beats: INT9_BEATS,
  duration: INT9_DURATION,
  fps: 30,
  width: 1080,
  height: 1440,
  l1: INT9_L1,
};
