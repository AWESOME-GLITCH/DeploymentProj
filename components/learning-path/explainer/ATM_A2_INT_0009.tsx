"use client";

// "We're out of oat milk" (ATM-A2-INT-0009): a 2D flat-vector motion-graphics
// explainer built as a Remotion composition (3:4, 1080x1440, 30 fps, 50 s).
// Ten beats from docs/explainers/storyboards.md: hook, a notice, the prediction
// moment, three more notices, two explain beats, practise aloud, recap. Single
// target: "Do you have ... instead?" answered with "That's fine, thank you."
// Built on the shared kit in ./lib on the Shoreditch
// cafe set, plus a glass-door fridge behind leo. Every value is a pure function
// of the frame, so the same component plays in the Player and renders to MP4.

import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { CSSProperties, ReactNode } from "react";
import {
  ACCENT, BeatProgress, CaptionBar, Character, Confetti, CREAM, Cup, EASE, Eyebrow, FAINT, FOG, FONT,
  Highlight, INK, karaoke, KineticText, MenuBoard, PAPER, PendantLamp, Plant, Pulse, SAFFRON, SEA, SpeechBubble,
  springIn, Stage, Steam, Transition, tween, Window, WOOD, WOOD_DARK, WOOD_LIGHT,
} from "./lib";
import type { Beat } from "./Cafe";

export const INT9_FPS = 30;
export const INT9_W = 1080;
export const INT9_H = 1440;

// Ten beats, cut to the board's attention rule of 26 October: nothing passive
// runs longer than eight seconds, every beat that teaches something ends on a
// stopping line with a target, and the first ask is a tap at 8.4 s. The player
// derives the stops from this table (`asksFor` in ExplainerPlayer), so the
// pauseAt frames are the contract: each one is a settled frame, nothing is
// mid-move on it. `predict` is the generation-effect beat: the learner answers
// before n2 shows the line. It carries no target, so `asksFor` skips it and it
// plays as a two-second question; a tap ask on it needs a "predict" member in
// the Beat kind union in Cafe.tsx and a branch in asksFor, neither of which is
// mine to add.
export const INT9_BEATS: Beat[] = [
  { id: "hook", kind: "hook", from: 0, to: 120, line: "A latte with oat milk, please." },
  { id: "n1", kind: "notice", from: 120, to: 270, line: "Sorry, we're out of oat milk.", target: ["out of"], pauseAt: 252 },
  { id: "predict", kind: "notice", from: 270, to: 330, line: "What do you say?", pauseAt: 318 },
  { id: "n2", kind: "notice", from: 330, to: 480, line: "Do you have soy milk instead?", target: ["instead"], pauseAt: 456 },
  { id: "n3", kind: "notice", from: 480, to: 570, line: "Yes, we do." },
  { id: "n4", kind: "notice", from: 570, to: 720, line: "That's fine, thank you.", target: ["That's fine"], pauseAt: 696 },
  { id: "explain", kind: "explain", from: 720, to: 900, line: "Out of means none left.", target: ["Out of"], pauseAt: 876 },
  { id: "explain2", kind: "explain", from: 900, to: 1080, line: "Instead means in its place.", target: ["Instead"], pauseAt: 1056 },
  { id: "practise", kind: "practise", from: 1080, to: 1380, line: "Say it with me. Do you have soy milk instead?", target: ["Do you have", "instead"], pauseAt: 1290 },
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
      {p < 1 ? <ellipse cx={x} cy={y + (to - y) * p} rx="10" ry="14" fill={OAT} /> : null}
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
      {/* handle on the left edge: the right edge is where the learner's raised
          hand lands in n2, and a dark bar there reads as grabbing the door */}
      <rect x={x + 22} y={y + h / 2 - 60} width="12" height="120" rx="6" fill={INK} opacity="0.35" />
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
      <MenuBoard x={752} y={206} w={306} h={286} items={[["Latte", "3.20"], ["Coffee", "2.50"], ["Tea", "2.00"]]} />
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
  // the camera pans right onto the fridge with leo in n1, then back to the
  // learner for the prediction beat, which is where they answer before n2
  // shows the line
  const pan = tween(frame, 140, 208, 0, -168, EASE.inOut) + tween(frame, 268, 318, 0, 168, EASE.inOut);
  const zoom = tween(frame, 0, 720, 1, 1.07, EASE.inOut);

  const hook = frame < 120;
  const n1 = frame >= 120 && frame < 270;
  const predict = frame >= 270 && frame < 330;
  const n2 = frame >= 330 && frame < 480;
  const n3 = frame >= 480 && frame < 570;
  const n4 = frame >= 570;

  // the oat carton leaves the slot into leo's hand, is tipped, then goes away.
  // all of it lands before the n1 stop at 252, so the learner's first ask is
  // held on a settled frame rather than mid-pour
  const lifted = tween(frame, 166, 194, 0, 1, EASE.inOut);
  const liftX = SLOT_X[0] + (458 - SLOT_X[0]) * lifted;
  const liftY = SLOT_Y + (568 - SLOT_Y) * lifted;
  const tip = tween(frame, 198, 224, 0, 152, EASE.inOut);
  const oatGone = tween(frame, 262, 280, 1, 0, EASE.in);
  const slotEmpty = frame >= 176;

  // the soy carton slides along the shelf from the right into the empty slot
  const soyIn = tween(frame, 356, 398, 0, 1, EASE.out);
  const bump = frame > 390 ? Math.sin((frame - 390) / 2.2) * 3 * Math.max(0, 1 - (frame - 390) / 16) : 0;
  // it starts in the right-hand slot it has occupied since the hook and slides
  // left along the shelf, so it never floats on the wall outside the fridge
  const soyX = SLOT_X[2] + (SLOT_X[0] - SLOT_X[2]) * soyIn + bump;

  const leoTalks = (frame > 134 && frame < 206) || (frame > 498 && frame < 530);
  const youTalks = (frame > 40 && frame < 118) || (frame > 348 && frame < 430) || (frame > 588 && frame < 658);

  const leoGesture = hook
    ? { g: "wave" as const, at: 8, from: "idle" as const }
    : n1
      ? { g: "raise" as const, at: 158, from: "wave" as const }
      : predict || n2
        ? { g: "idle" as const, at: 276, from: "raise" as const }
        : n3
          ? { g: "raise" as const, at: 492, from: "idle" as const }
          : { g: "serve" as const, at: 590, from: "raise" as const };
  const youGesture = hook
    ? { g: "idle" as const, at: 34, from: "idle" as const }
    : n1 || predict
      ? { g: "think" as const, at: 176, from: "idle" as const }
      : n2
        ? { g: "raise" as const, at: 346, from: "think" as const }
        : n3
          ? { g: "idle" as const, at: 486, from: "raise" as const }
          : { g: "cup" as const, at: 614, from: "idle" as const };
  const youMood = n1 ? (frame > 206 ? "surprised" as const : "neutral" as const) : predict || n2 ? "think" as const : frame > 500 ? "happy" as const : "neutral" as const;
  const leoMood = n1 ? "think" as const : predict ? "neutral" as const : "happy" as const;

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
            {/* the dotted slot goes once the soy has seated in it, otherwise the
                dashes read through the carton that is meant to have filled it */}
            {slotEmpty && frame < 396 ? <Carton x={SLOT_X[0]} baseY={SLOT_Y} w={64} color={OAT} dotted /> : null}
            {!slotEmpty ? <Carton x={SLOT_X[0]} baseY={SLOT_Y} w={64} color={OAT} sprig /> : null}
            <Carton x={SLOT_X[1]} baseY={SLOT_Y} w={64} color={ALMOND} />
            <Carton x={soyX} baseY={SLOT_Y} w={64} color={SOY} label="SOY" />
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
          {frame >= 166 && frame < 280 ? (
            <g opacity={oatGone}>
              <Carton x={liftX} baseY={liftY} w={64} color={OAT} sprig tilt={tip} />
              <Drop frame={frame} from={228} x={liftX + 66} y={liftY - 4} to={872} />
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
            {frame >= 482 && frame < 596 ? (
              <g>
                <Carton x={458} baseY={568} w={84} color={SOY} label="SOY" />
                <Tick frame={frame} from={516} x={500} y={452} size={0.8} />
              </g>
            ) : null}
            {n4 ? (
              <>
                <Cup kind="mug" x={560} y={876} frame={frame} appear={598} slideFrom={-150} seed={3} />
                {frame > 630 ? <Steam x={560} y={812} frame={frame} seed={3} /> : null}
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

      {hook ? <SpeechBubble text="A latte with oat milk, please." x={150} y={168} w={620} from={30} frame={frame} tail="right" tailX={520} /> : null}
      {n1 ? <SpeechBubble text="Sorry, we're out of oat milk." targets={["out of"]} x={96} y={176} w={620} from={132} frame={frame} tail="left" tailX={236} /> : null}
      {n2 ? <SpeechBubble text="Do you have soy milk instead?" targets={["instead"]} x={150} y={168} w={620} from={344} frame={frame} tail="right" tailX={520} /> : null}
      {n3 ? <SpeechBubble text="Yes, we do." x={96} y={214} w={400} from={494} frame={frame} tail="left" tailX={210} /> : null}
      {n4 ? <SpeechBubble text="That's fine, thank you." targets={["That's fine"]} x={150} y={196} w={620} from={584} frame={frame} tail="right" tailX={500} /> : null}

      {/* the prediction moment: the learner's own thought, held until n2 says
          the line. It lives in the speech bubbles' lane, which is the one part
          of this frame that is always clear */}
      {frame >= 296 && frame < 344 ? <Stage><ThoughtCloud frame={frame} from={296} /></Stage> : null}
    </AbsoluteFill>
  );
}

/**
 * The prediction cue: a thought cloud over the learner holding the two milks
 * they can see in the fridge and a question mark. The caption asks "What do you
 * say?" in their own language while this is up, so the answer is generated
 * before n2 gives it away.
 */
function ThoughtCloud({ frame, from }: { frame: number; from: number }) {
  const s = springIn(frame, from, { damping: 11, stiffness: 150 });
  const body = (
    <>
      <rect x="150" y="214" width="620" height="226" rx="76" />
      <circle cx="300" cy="206" r="78" />
      <circle cx="470" cy="188" r="86" />
      <circle cx="638" cy="212" r="72" />
      <circle cx="786" cy="486" r="27" />
      <circle cx="826" cy="538" r="15" />
    </>
  );
  return (
    <g transform={`translate(700 470) scale(${s}) translate(-700 -470)`}>
      <g fill={INK} transform="translate(8 10)">{body}</g>
      <g fill="#fff" stroke={INK} strokeWidth="7" strokeLinejoin="round">{body}</g>
      <g fill="#fff">{body}</g>
      <text x="268" y="398" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="150" fill={ACCENT}>?</text>
      <Carton x={380} baseY={404} w={96} color={SOY} label="SOY" />
      <Carton x={556} baseY={404} w={96} color={ALMOND} />
    </g>
  );
}

// ---------------------------------------------------------------- explain

const TRAIN: { text: string; w: number; accent: boolean }[] = [
  { text: "Do you have", w: 352, accent: false },
  { text: "soy milk", w: 268, accent: false },
  { text: "instead?", w: 262, accent: true },
];

/**
 * One diagram across two beats. The first, `explain`, is the empty slot and
 * "out of"; the learner is asked to tap it at 876. The second, `explain2`,
 * fills the slot and builds the question. Splitting the old twelve-second
 * explain beat in two is the board's attention rule: one idea per beat, and an
 * action at the end of each.
 */
function ExplainScene({ frame }: { frame: number }) {
  const fade = tween(frame, 744, 774, 0, 1, EASE.out);
  const oatSolid = tween(frame, 750, 782, 1, 0, EASE.inOut);
  const soyIn = tween(frame, 906, 950, 0, 1, EASE.out);
  const soyX = 980 + (300 - 980) * soyIn;
  const roll = tween(frame, 1004, 1050, 0, 1, EASE.out);
  const trainX = -980 + 980 * roll;
  const maya = springIn(frame, 736, { damping: 11, stiffness: 130 });
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
          <g opacity={tween(frame, 950, 978, 1, 0.3, EASE.out)}><Carton x={300} baseY={478} w={104} color={OAT} dotted /></g>
          {oatSolid > 0.01 ? (
            <g opacity={oatSolid}><Carton x={300} baseY={478} w={104} color={OAT} sprig /></g>
          ) : null}
          {/* right slot: the almond that was never the question */}
          {/* kept solid: at a low opacity the white band washed out to the
              background and the carton read as two detached pieces */}
          <Carton x={640} baseY={478} w={104} color={ALMOND} opacity={0.85} />
          {/* the soy slides in and takes the oat's place */}
          {frame >= 902 ? <Carton x={soyX} baseY={478} w={104} color={SOY} label="SOY" /> : null}
        </g>

        {/* the question as a three-carriage train */}
        <g opacity={tween(frame, 1000, 1026, 0, 1, EASE.out)} transform={`translate(${trainX} 0)`}>
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
            <Character who="maya" x={940} y={1300} scale={0.64} facing={-1} frame={frame} enter={738} talking={(frame > 750 && frame < 832) || (frame > 912 && frame < 1000)} mood="happy" gesture="point" gestureAt={772} />
          </g>
        </g>
      </Stage>

      <Eyebrow text="WHAT THEY MEAN" x={80} y={150} frame={frame} from={730} />
      <KineticText frame={frame} from={786} text="out of = none left" x={80} y={562} size={56} color={INK} targets={["out", "of"]} targetColor={ACCENT} stagger={4} />
      <KineticText frame={frame} from={956} text="instead = in its place" x={80} y={650} size={56} color={INK} targets={["instead"]} targetColor={ACCENT} marker={SAFFRON} markerDelay={14} stagger={4} />
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
    return 1134 + (acc / total) * 140;
  });
  const circle = springIn(frame, 1080, { damping: 11, stiffness: 120 });
  // the cue springs in before the pause, so it is fully on screen and pulsing
  // on frame 1290 itself, which is the frame the player holds on
  const yourTurn = frame >= 1266;
  const turn = springIn(frame, 1266, { damping: 9, stiffness: 160 });
  const leoGesture = frame < 1322 ? { g: "listen" as const, at: 1098, from: "idle" as const } : { g: "thumbs" as const, at: 1322, from: "listen" as const };

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
              who="leo" x={540} y={1186} scale={1.88} facing={1} frame={frame} enter={1084}
              talking={frame > 1100 && frame < 1270} mood="happy"
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
        {frame >= 1316 ? (
          <g>
            <Carton x={856} baseY={372} w={84} color={SOY} label="SOY" />
            <Tick frame={frame} from={1330} x={936} y={262} size={0.8} />
          </g>
        ) : null}
      </Stage>

      <Eyebrow text="SAY IT WITH ME" x={0} y={796} align="center" frame={frame} from={1090} />
      <div
        style={{
          position: "absolute", left: 60, right: 60, top: 852, display: "flex", flexWrap: "wrap",
          justifyContent: "center", columnGap: 24, fontSize: 96, fontWeight: 800, lineHeight: 1.16, zIndex: 0,
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

function RecapScene({ frame, l1 }: { frame: number; l1?: Record<string, string> }) {
  const a = springIn(frame, 1386, { damping: 11, stiffness: 110 });
  // the close says what the learner can now do and when it comes back, which
  // is the board's self-efficacy rule. It carries its own L1 line, because a
  // learner who needs captions needs this sentence most of all
  const canDo = tween(frame, 1422, 1442, 0, 1, EASE.out);
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
          <div style={{ opacity: canDo, transform: `translateY(${(1 - canDo) * 12}px)`, marginTop: 26 }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: INK, lineHeight: 1.3 }}>You can ask for another milk. Again tomorrow.</div>
            {l1?.can_do ? <div style={{ fontSize: 30, fontWeight: 600, color: INK, opacity: 0.75, marginTop: 6, lineHeight: 1.3 }}>{l1.can_do}</div> : null}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- composition

export function OatMilkExplainer({ l1 }: { l1?: Record<string, string> }) {
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
      {beat.kind === "hook" || beat.kind === "notice" ? <CafeScene frame={frame} /> : null}
      {beat.kind === "explain" ? <ExplainScene frame={frame} /> : null}
      {beat.kind === "practise" ? <PractiseScene frame={frame} /> : null}
      {beat.kind === "recap" ? <RecapScene frame={frame} l1={l1} /> : null}
      <Transition frame={frame} at={720} kind="iris" color={PAPER} color2={ACCENT} cx={540} cy={620} />
      <Transition frame={frame} at={1080} kind="slide" color={ACCENT} color2={SAFFRON} />
      <Transition frame={frame} at={1380} kind="wipe" color={SAFFRON} color2={INK} />
      <CaptionBar line={beat.line} k={k} targets={beat.target} l1={l1?.[beat.id]} />
      {/* the recap sits on an ACCENT background, where the bar's default ACCENT
          fill disappears, so it turns white for that beat */}
      <BeatProgress frame={frame} beats={INT9_BEATS} color={beat.kind === "recap" ? CREAM : ACCENT} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- L1 captions
// One line per beat, plus `can_do`, which is not a beat: it is the L1 of the
// recap card's closing line, rendered inside the card by RecapScene.
export const INT9_L1: Record<string, Record<string, string>> = {
  ar: {
    hook: "لاتيه بحليب الشوفان، من فضلك.",
    n1: "آسف، نفد حليب الشوفان.",
    predict: "ماذا تقول أنت؟",
    n2: "هل لديك حليب الصويا بدلًا منه؟",
    n3: "نعم، لدينا.",
    n4: "لا بأس، شكرًا.",
    explain: "Out of تعني لم يبقَ شيء.",
    explain2: "Instead تعني بدلًا منه.",
    practise: "قلها معي.",
    recap: "هل لديك ... بدلًا منه؟ لا بأس.",
    can_do: "يمكنك أن تطلب حليبًا آخر. غدًا مرة أخرى.",
  },
  es: {
    hook: "Un latte con leche de avena, por favor.",
    n1: "Lo siento, no queda leche de avena.",
    predict: "¿Qué dices tú?",
    n2: "¿Tienes leche de soja en su lugar?",
    n3: "Sí, tenemos.",
    n4: "Está bien, gracias.",
    explain: "Out of: no queda.",
    explain2: "Instead: en su lugar.",
    practise: "Dilo conmigo.",
    recap: "¿Tienes ... en su lugar? Está bien.",
    can_do: "Ya puedes pedir otra leche. Mañana otra vez.",
  },
  hi: {
    hook: "ओट मिल्क वाला लाते, कृपया।",
    n1: "माफ़ कीजिए, ओट मिल्क ख़त्म है।",
    predict: "आप क्या कहेंगे?",
    n2: "क्या इसकी जगह सोया मिल्क है?",
    n3: "हाँ, है।",
    n4: "ठीक है, धन्यवाद।",
    explain: "Out of मतलब ख़त्म।",
    explain2: "Instead मतलब उसकी जगह।",
    practise: "मेरे साथ बोलो।",
    recap: "क्या ... इसकी जगह है? ठीक है।",
    can_do: "अब आप दूसरा दूध माँग सकते हैं। कल फिर।",
  },
  ru: {
    hook: "Латте на овсяном молоке, пожалуйста.",
    n1: "Извините, овсяное молоко закончилось.",
    predict: "Что вы скажете?",
    n2: "А соевое молоко есть вместо него?",
    n3: "Да, есть.",
    n4: "Хорошо, спасибо.",
    explain: "Out of: ничего не осталось.",
    explain2: "Instead: вместо него.",
    practise: "Скажи со мной.",
    recap: "А ... есть вместо него? Хорошо.",
    can_do: "Теперь вы можете попросить другое молоко. Завтра снова.",
  },
  tr: {
    hook: "Yulaf sütlü latte, lütfen.",
    n1: "Üzgünüm, yulaf sütü bitti.",
    predict: "Sen ne dersin?",
    n2: "Onun yerine soya sütü var mı?",
    n3: "Evet, var.",
    n4: "Tamam, teşekkürler.",
    explain: "Out of: kalmadı.",
    explain2: "Instead: onun yerine.",
    practise: "Benimle söyle.",
    recap: "Onun yerine ... var mı? Tamam.",
    can_do: "Artık başka bir süt isteyebilirsin. Yarın tekrar.",
  },
  zh: {
    hook: "一杯燕麦奶拿铁，谢谢。",
    n1: "抱歉，燕麦奶没了。",
    predict: "你会怎么说？",
    n2: "那有豆奶吗？",
    n3: "有的。",
    n4: "好的，谢谢。",
    explain: "Out of 表示没了。",
    explain2: "Instead 表示代替。",
    practise: "跟我一起说。",
    recap: "那有……吗？好的。",
    can_do: "你现在可以要另一种奶了。明天再来。",
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
