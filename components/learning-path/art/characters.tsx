"use client";

// =====================================================================
// Learning Path character kit
// Hand-drawn ink-outline cast for every screen and every video.
// Style sheet and rationale: docs/design/characters.md
// Gallery: docs/design/characters.html (built by scripts/design/characters-gallery.mjs)
//
// ---------------------------------------------------------------------
// PUBLIC API (stable, other agents build on this; add, never rename)
// ---------------------------------------------------------------------
//
//   import { Maya, Leo, Fatima, Sami, You, Character, Sticker } from
//     "@/components/learning-path/art/characters";
//
//   <Maya pose="talk" size={240} />
//   <Leo pose="hold" item="cup" />
//   <Character name="you" pose="celebrate" stickers idle />
//   <Sticker kind="star" size={28} />
//
// Character props (all optional):
//   pose      "idle" | "talk" | "listen" | "point" | "hold" | "celebrate"
//             default "idle". "hold" uses `item`.
//   item      "phone" | "cup" | "suitcase" | "star" | "book" | "mic"
//             default "phone". Ignored unless pose is "hold".
//   size      rendered height in CSS px, default 220. Width is size * 5/7.
//   flip      mirror the figure (face the other way), default false.
//   stickers  draw the character's ink sticker garnish, default false.
//   idle      slow sway and breathe loop, default false. Off under
//             prefers-reduced-motion.
//   popIn     spring pop-in on mount (350 ms, overshoot 1.04), default false.
//   seed      integer that re-rolls the line wobble, default 1. Same seed
//             gives the same drawing every render, so videos stay
//             deterministic frame to frame.
//   title     accessible label. Given: role="img" plus <title>. Omitted:
//             aria-hidden, for decorative use beside real text.
//   className, style  passed to the root <svg>.
//
// <Character> takes the same props plus `name`:
//   "maya" | "leo" | "fatima" | "sami" | "you".
//
// Sticker props: kind, size (default 24), color (default ink), seed,
//   twinkle, title, className, style.
//
// Also exported: ART (palette), CAST (cast metadata for galleries and
//   pickers), POSES, HOLD_ITEMS, STICKER_KINDS, VIEWBOX.
//
// ---------------------------------------------------------------------
// HOW THE HAND-DRAWN LINE WORKS
// ---------------------------------------------------------------------
// No filters: a filter blurs the line and kills the crispness the videos
// need. Instead every path is nudged by `wobble()`, a deterministic jitter
// on the path numbers, so the ink looks drawn by hand but stays vector
// sharp at any size and identical on every frame. Outline weight is 3 px
// at the drawing scale (VIEWBOX is 200x280).
// =====================================================================

import type { CSSProperties, ReactNode } from "react";

// ------------------------------------------------------------ palette
export const ART = {
  ink: "#121212",
  cream: "#FFF7E8",
  paper: "#FFFFFF",
  sun: "#FFD93D",
  lilac: "#CDB8FF",
  tangerine: "#FF5A2D",
  mint: "#A8F0C6",
  sky: "#BFE3FF",
} as const;

export const VIEWBOX = { w: 200, h: 280 } as const;

const INK = ART.ink;
const STROKE = 3; // outline weight at drawing scale

export type Pose = "idle" | "talk" | "listen" | "point" | "hold" | "celebrate";
export type HoldItem = "phone" | "cup" | "suitcase" | "star" | "book" | "mic";
export type CharacterName = "maya" | "leo" | "fatima" | "sami" | "you";
export type StickerKind = "heart" | "star" | "sparkle" | "squiggle" | "cloud";

export const POSES: Pose[] = ["idle", "talk", "listen", "point", "hold", "celebrate"];
export const HOLD_ITEMS: HoldItem[] = ["phone", "cup", "suitcase", "star", "book", "mic"];
export const STICKER_KINDS: StickerKind[] = ["heart", "star", "sparkle", "squiggle", "cloud"];

// ------------------------------------------------------- wobbly ink
/** Deterministic 0..1 noise. Same input, same line, every render. */
function rnd(n: number): number {
  let t = (n + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Nudge every number in a path so the line reads as hand drawn. */
export function wobble(d: string, seed = 1, amount = 1): string {
  let i = 0;
  return d.replace(/-?\d*\.?\d+/g, (n) => {
    const j = (rnd(seed * 977 + i++ * 37) - 0.5) * 2 * amount;
    return (parseFloat(n) + j).toFixed(2);
  });
}

/** Closed wobbly ellipse: drawn through jittered points so it never kinks. */
export function blob(cx: number, cy: number, rx: number, ry: number, seed = 1, amount = 1.4, n = 11): string {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + ((rnd(seed * 131 + i * 17) - 0.5) * 2 * amount) / Math.max(rx, ry);
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  const mid = (a: [number, number], b: [number, number]) =>
    `${((a[0] + b[0]) / 2).toFixed(2)} ${((a[1] + b[1]) / 2).toFixed(2)}`;
  let d = `M${mid(pts[n - 1], pts[0])}`;
  for (let i = 0; i < n; i += 1) {
    d += ` Q${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)} ${mid(pts[i], pts[(i + 1) % n])}`;
  }
  return `${d} Z`;
}

function roundRect(x: number, y: number, w: number, h: number, r: number): string {
  return (
    `M${x + r} ${y} L${x + w - r} ${y} Q${x + w} ${y} ${x + w} ${y + r}` +
    ` L${x + w} ${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h}` +
    ` L${x + r} ${y + h} Q${x} ${y + h} ${x} ${y + h - r}` +
    ` L${x} ${y + r} Q${x} ${y} ${x + r} ${y} Z`
  );
}

/** Flat fill with an ink outline. */
function Shape({ d, fill, seed, amount = 0.9, width = STROKE }: { d: string; fill: string; seed: number; amount?: number; width?: number }) {
  return <path d={wobble(d, seed, amount)} fill={fill} stroke={INK} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" />;
}

/** Ink line, for mouths, creases, strings and steam. */
function Stroke({ d, seed, width = STROKE, color = INK, amount = 0.7 }: { d: string; seed: number; width?: number; color?: string; amount?: number }) {
  return <path d={wobble(d, seed, amount)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />;
}

/** Arm or leg: one ink pass, one fill pass, so the limb is outlined. */
function Limb({ d, fill, seed, width = 11 }: { d: string; fill: string; seed: number; width?: number }) {
  const w = wobble(d, seed, 0.8);
  return (
    <>
      <path d={w} fill="none" stroke={INK} strokeWidth={width + STROKE * 2} strokeLinecap="round" />
      <path d={w} fill="none" stroke={fill} strokeWidth={width} strokeLinecap="round" />
    </>
  );
}

function Hand({ at, fill, seed }: { at: [number, number]; fill: string; seed: number }) {
  return <Shape d={blob(at[0], at[1], 8.5, 8.5, seed, 1.1)} fill={fill} seed={seed + 3} amount={0.4} />;
}

// --------------------------------------------------------- animation
const STYLES = `
.lpc-pop{animation:lpc-pop 350ms cubic-bezier(.34,1.56,.64,1) both}
.lpc-idle{transform-box:fill-box;transform-origin:50% 100%;animation:lpc-sway 3s ease-in-out infinite}
.lpc-tw{transform-box:fill-box;transform-origin:50% 50%;animation:lpc-tw 4s ease-in-out infinite}
@keyframes lpc-pop{0%{transform:scale(.86)}60%{transform:scale(1.04)}100%{transform:scale(1)}}
@keyframes lpc-sway{0%,100%{transform:rotate(-1.1deg) translateY(0)}50%{transform:rotate(1.1deg) translateY(-2px)}}
@keyframes lpc-tw{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.18);opacity:.72}}
@media (prefers-reduced-motion: reduce){.lpc-idle,.lpc-tw{animation:none}.lpc-pop{animation-duration:1ms}}
`;

// ------------------------------------------------------------ stickers
function stickerShape(kind: StickerKind, seed: number, color: string): ReactNode {
  switch (kind) {
    case "heart":
      return <path d={wobble("M12 21.5 C1.5 13.5 3.5 3.5 12 8 C20.5 3.5 22.5 13.5 12 21.5 Z", seed, 0.5)} fill={color} />;
    case "star":
      return <path d={wobble("M12 1 L14.6 9.4 L23 12 L14.6 14.6 L12 23 L9.4 14.6 L1 12 L9.4 9.4 Z", seed, 0.5)} fill={color} />;
    case "sparkle":
      return (
        <>
          <path d={wobble("M11 3 L12.4 9.6 L19 11 L12.4 12.4 L11 19 L9.6 12.4 L3 11 L9.6 9.6 Z", seed, 0.45)} fill={color} />
          <circle cx="19.5" cy="18.5" r="2.1" fill={color} />
          <circle cx="4.5" cy="20" r="1.4" fill={color} />
        </>
      );
    case "squiggle":
      return <path d={wobble("M2 16 C5.5 5 9.5 21 13 11 C15 6.5 19 10 22 7.5", seed, 0.5)} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />;
    case "cloud":
      return (
        <path
          d={wobble("M6.5 19 C1 19 1 11.5 7 11.5 C7.6 5.5 16 4.8 17.4 10.6 C22.5 10 24 19 17.5 19 Z", seed, 0.5)}
          fill={color}
        />
      );
    default:
      return null;
  }
}

export function Sticker({
  kind,
  size = 24,
  color = INK,
  seed = 1,
  twinkle = false,
  title,
  className,
  style,
}: {
  kind: StickerKind;
  size?: number;
  color?: string;
  seed?: number;
  twinkle?: boolean;
  title?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {twinkle ? <defs><style>{STYLES}</style></defs> : null}
      <g className={twinkle ? "lpc-tw" : undefined}>{stickerShape(kind, seed, color)}</g>
    </svg>
  );
}

// ------------------------------------------------------------- poses
type ArmPose = {
  l: string;
  r: string;
  lh: [number, number];
  rh: [number, number];
  legs: [string, string];
  shoes: [[number, number], [number, number]];
  tilt: number; // head tilt in degrees
  lean: number; // whole-figure lean in degrees
  lift: number; // whole-figure lift in px
};

const LEGS_STAND: [string, string] = ["M86 182 Q81 218 84 250", "M114 182 Q119 218 116 250"];
const SHOES_STAND: [[number, number], [number, number]] = [
  [80, 254],
  [120, 254],
];
const ARM_DOWN_L = "M70 120 Q57 149 61 174";
const ARM_DOWN_R = "M130 120 Q143 149 139 174";

const ARMS: Record<Pose, ArmPose> = {
  idle: {
    l: ARM_DOWN_L,
    r: ARM_DOWN_R,
    lh: [60, 177],
    rh: [140, 177],
    legs: LEGS_STAND,
    shoes: SHOES_STAND,
    tilt: 0,
    lean: 0,
    lift: 0,
  },
  talk: {
    l: ARM_DOWN_L,
    r: "M130 120 Q158 130 155 102",
    lh: [60, 177],
    rh: [155, 97],
    legs: LEGS_STAND,
    shoes: SHOES_STAND,
    tilt: -3,
    lean: 0,
    lift: 0,
  },
  listen: {
    l: ARM_DOWN_L,
    r: "M130 120 Q158 116 143 88",
    lh: [60, 177],
    rh: [138, 78],
    legs: LEGS_STAND,
    shoes: SHOES_STAND,
    tilt: -7,
    lean: -4,
    lift: 0,
  },
  point: {
    l: ARM_DOWN_L,
    r: "M130 120 Q158 114 172 96",
    lh: [60, 177],
    rh: [174, 92],
    legs: LEGS_STAND,
    shoes: SHOES_STAND,
    tilt: 3,
    lean: 0,
    lift: 0,
  },
  hold: {
    l: "M70 120 Q66 146 74 155",
    r: "M130 120 Q134 146 126 155",
    lh: [73, 157],
    rh: [127, 157],
    legs: LEGS_STAND,
    shoes: SHOES_STAND,
    tilt: 0,
    lean: 0,
    lift: 0,
  },
  celebrate: {
    l: "M70 118 Q46 97 49 68",
    r: "M130 118 Q154 97 151 68",
    lh: [48, 63],
    rh: [152, 63],
    legs: ["M86 182 Q75 216 69 246", "M114 182 Q125 216 131 246"],
    shoes: [
      [65, 250],
      [135, 250],
    ],
    tilt: 0,
    lean: 0,
    lift: -5,
  },
};

// --------------------------------------------------------------- face
function Face({ pose, seed }: { pose: Pose; seed: number }) {
  const eyes =
    pose === "celebrate" ? (
      <>
        <Stroke d="M82 60 Q88 53 94 60" seed={seed + 11} width={3.2} />
        <Stroke d="M106 60 Q112 53 118 60" seed={seed + 12} width={3.2} />
      </>
    ) : (
      <>
        <circle cx={88 + (rnd(seed) - 0.5)} cy={61} r={4.1} fill={INK} />
        <circle cx={112 + (rnd(seed + 1) - 0.5)} cy={61} r={4.1} fill={INK} />
      </>
    );

  let mouth: ReactNode;
  if (pose === "talk") {
    mouth = <Shape d={blob(100, 79, 7, 8.5, seed + 21, 0.8)} fill={INK} seed={seed + 22} amount={0.3} />;
  } else if (pose === "celebrate") {
    mouth = <Shape d="M86 73 Q100 94 114 73 Z" fill={INK} seed={seed + 23} amount={0.6} />;
  } else if (pose === "listen") {
    mouth = <Stroke d="M93 77 Q100 82 107 77" seed={seed + 24} width={3.2} />;
  } else {
    mouth = <Stroke d="M90 75 Q100 85 110 75" seed={seed + 25} width={3.2} />;
  }

  const brows =
    pose === "listen" ? (
      <>
        <Stroke d="M81 47 Q88 42 95 47" seed={seed + 31} width={2.8} />
        <Stroke d="M105 47 Q112 42 119 47" seed={seed + 32} width={2.8} />
      </>
    ) : pose === "point" || pose === "talk" ? (
      <Stroke d="M105 48 Q112 44 119 47" seed={seed + 33} width={2.8} />
    ) : null;

  return (
    <>
      {brows}
      {eyes}
      {mouth}
    </>
  );
}

// -------------------------------------------------------------- items
function Item({ item, seed }: { item: HoldItem; seed: number }) {
  switch (item) {
    case "phone":
      return (
        <>
          <Shape d={roundRect(83, 118, 34, 50, 7)} fill={ART.cream} seed={seed} amount={0.7} />
          <Stroke d="M90 130 L110 130" seed={seed + 1} width={2.8} />
          <Stroke d="M90 141 L104 141" seed={seed + 2} width={2.8} />
          <Stroke d="M90 152 L110 152" seed={seed + 3} width={2.8} />
        </>
      );
    case "cup":
      return (
        <>
          <Stroke d="M93 112 C88 105 97 102 93 95" seed={seed + 3} width={2.8} />
          <Stroke d="M108 112 C103 106 111 103 108 97" seed={seed + 4} width={2.8} />
          <Shape d="M84 128 L116 128 L112 170 L88 170 Z" fill={ART.cream} seed={seed} amount={0.7} />
          <Shape d={roundRect(79, 116, 42, 13, 5)} fill={ART.cream} seed={seed + 1} amount={0.6} />
          <Stroke d="M87 146 L113 146" seed={seed + 2} width={2.8} />
        </>
      );
    case "suitcase":
      return (
        <>
          <Stroke d="M90 126 Q100 112 110 126" seed={seed + 1} width={3.4} />
          <Shape d={roundRect(74, 126, 52, 44, 7)} fill={ART.cream} seed={seed} amount={0.7} />
          <Stroke d="M74 142 L126 142" seed={seed + 2} width={2.8} />
          <Stroke d="M96 142 L96 126" seed={seed + 3} width={2.8} />
        </>
      );
    case "star":
      return (
        <g transform="translate(76 118) scale(2)">
          <path
            d={wobble("M12 1 L14.6 9.4 L23 12 L14.6 14.6 L12 23 L9.4 14.6 L1 12 L9.4 9.4 Z", seed, 0.4)}
            fill={ART.sun}
            stroke={INK}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </g>
      );
    case "book":
      return (
        <>
          <Shape d={roundRect(72, 122, 56, 46, 5)} fill={ART.cream} seed={seed} amount={0.7} />
          <Stroke d="M100 122 L100 168" seed={seed + 1} width={3.2} />
          <Stroke d="M79 134 L93 134" seed={seed + 2} width={2.6} />
          <Stroke d="M107 134 L121 134" seed={seed + 3} width={2.6} />
          <Stroke d="M79 145 L93 145" seed={seed + 4} width={2.6} />
          <Stroke d="M107 145 L121 145" seed={seed + 5} width={2.6} />
        </>
      );
    case "mic":
      return (
        <>
          <Stroke d="M100 146 L100 168" seed={seed + 1} width={4.4} />
          <Shape d={roundRect(87, 110, 26, 40, 13)} fill={ART.cream} seed={seed} amount={0.6} />
          <Stroke d="M92 120 L108 120" seed={seed + 2} width={2.6} />
          <Stroke d="M92 129 L108 129" seed={seed + 3} width={2.6} />
          <Stroke d="M86 170 L114 170" seed={seed + 4} width={3.4} />
        </>
      );
    default:
      return null;
  }
}

// --------------------------------------------------------------- cast
type Spec = {
  id: CharacterName;
  label: string;
  role: string;
  block: string; // the character's own block colour
  skin: string;
  garment: string; // torso and sleeve fill
  trousers: string;
  stickers: Array<{ kind: StickerKind; x: number; y: number; s: number }>;
  behind?: (seed: number) => ReactNode; // headwear or hair behind the head
  front?: (seed: number) => ReactNode; // hair or hood over the head
  clothes?: (seed: number) => ReactNode; // overlay on the torso
};

const SPECS: Record<CharacterName, Spec> = {
  maya: {
    id: "maya",
    label: "Maya",
    role: "the coach",
    block: ART.sun,
    skin: "#D99A6C",
    garment: ART.cream,
    trousers: INK,
    stickers: [
      { kind: "star", x: 22, y: 36, s: 1.1 },
      { kind: "sparkle", x: 150, y: 24, s: 0.9 },
      { kind: "squiggle", x: 158, y: 196, s: 0.9 },
    ],
    behind: (s) => (
      <>
        <Shape d={blob(127, 34, 14, 14, s + 41, 1.3)} fill={INK} seed={s + 42} amount={0.4} />
        <Shape d={blob(100, 58, 35, 36, s + 43, 1.4)} fill={INK} seed={s + 49} amount={0.5} />
      </>
    ),
    front: (s) => (
      <>
        <Shape d="M66 62 C64 24 136 24 134 64 C126 44 110 38 100 38 C84 38 70 44 66 62 Z" fill={INK} seed={s + 44} amount={0.8} />
        <Shape d={blob(68, 74, 4.5, 4.5, s + 45, 0.6)} fill={ART.sun} seed={s + 46} amount={0.3} />
        <Shape d={blob(132, 74, 4.5, 4.5, s + 47, 0.6)} fill={ART.sun} seed={s + 48} amount={0.3} />
      </>
    ),
    clothes: (s) => (
      <>
        <Shape d="M72 109 C84 99 116 99 128 109 C116 122 84 122 72 109 Z" fill={ART.sun} seed={s + 51} amount={0.7} />
        <Shape d="M110 117 L125 147 L104 142 Z" fill={ART.sun} seed={s + 52} amount={0.7} />
      </>
    ),
  },
  leo: {
    id: "leo",
    label: "Leo",
    role: "the barista",
    block: ART.tangerine,
    skin: "#F0C3A0",
    garment: ART.cream,
    trousers: INK,
    stickers: [
      { kind: "sparkle", x: 20, y: 44, s: 1 },
      { kind: "cloud", x: 146, y: 28, s: 1 },
      { kind: "star", x: 162, y: 190, s: 0.8 },
    ],
    behind: (s) => <Shape d="M66 60 C66 22 134 22 134 60 C128 40 116 34 100 34 C84 34 72 40 66 60 Z" fill={INK} seed={s + 41} amount={0.8} />,
    front: (s) => <Shape d="M68 50 C74 30 126 30 132 50 C118 42 110 44 100 44 C86 44 78 44 68 50 Z" fill={INK} seed={s + 42} amount={0.8} />,
    clothes: (s) => (
      <>
        <Shape d="M80 116 L120 116 L124 180 L76 180 Z" fill={ART.tangerine} seed={s + 51} amount={0.8} />
        <Stroke d="M80 116 L90 104" seed={s + 52} width={3} />
        <Stroke d="M120 116 L110 104" seed={s + 53} width={3} />
        <Stroke d="M84 148 L116 148" seed={s + 54} width={3} />
      </>
    ),
  },
  fatima: {
    id: "fatima",
    label: "Fatima",
    role: "classmate",
    block: ART.lilac,
    skin: "#9C6136",
    garment: ART.cream,
    trousers: INK,
    stickers: [
      { kind: "heart", x: 22, y: 30, s: 1.1 },
      { kind: "sparkle", x: 152, y: 34, s: 0.9 },
      { kind: "squiggle", x: 24, y: 196, s: 0.9 },
    ],
    behind: (s) => (
      <Shape
        d="M100 22 C62 22 58 60 62 86 C62 100 70 110 80 114 L120 114 C130 110 138 100 138 86 C142 60 138 22 100 22 Z"
        fill={ART.lilac}
        seed={s + 41}
        amount={1}
      />
    ),
    front: (s) => <Shape d="M68 64 C68 30 132 30 132 64 C126 46 116 40 100 40 C84 40 74 46 68 64 Z" fill={ART.lilac} seed={s + 42} amount={0.9} />,
    clothes: (s) => <Shape d="M66 110 C76 120 124 120 134 110 L137 136 C120 146 80 146 63 136 Z" fill={ART.lilac} seed={s + 51} amount={0.9} />,
  },
  sami: {
    id: "sami",
    label: "Sami",
    role: "classmate",
    block: ART.sky,
    skin: "#7A4A2B",
    garment: ART.sky,
    trousers: INK,
    stickers: [
      { kind: "star", x: 20, y: 38, s: 1 },
      { kind: "squiggle", x: 150, y: 28, s: 1 },
      { kind: "heart", x: 158, y: 194, s: 0.8 },
    ],
    behind: (s) => (
      <>
        <Shape d={blob(70, 48, 13, 13, s + 41, 1.3)} fill={INK} seed={s + 42} amount={0.4} />
        <Shape d={blob(84, 28, 15, 14, s + 43, 1.3)} fill={INK} seed={s + 44} amount={0.4} />
        <Shape d={blob(104, 22, 16, 15, s + 45, 1.3)} fill={INK} seed={s + 46} amount={0.4} />
        <Shape d={blob(126, 36, 15, 14, s + 47, 1.3)} fill={INK} seed={s + 48} amount={0.4} />
        <Shape d={blob(130, 54, 12, 12, s + 49, 1.3)} fill={INK} seed={s + 50} amount={0.4} />
      </>
    ),
    front: (s) => (
      <>
        <Shape d={blob(78, 44, 12, 11, s + 53, 1.3)} fill={INK} seed={s + 54} amount={0.4} />
        <Shape d={blob(99, 38, 13, 12, s + 55, 1.3)} fill={INK} seed={s + 56} amount={0.4} />
        <Shape d={blob(119, 43, 12, 11, s + 57, 1.3)} fill={INK} seed={s + 58} amount={0.4} />
      </>
    ),
    clothes: (s) => <Shape d="M87 102 Q100 117 113 102 Z" fill={ART.cream} seed={s + 51} amount={0.6} />,
  },
  you: {
    id: "you",
    label: "You",
    role: "the learner",
    block: ART.mint,
    skin: "#E8B089",
    garment: ART.mint,
    trousers: INK,
    stickers: [
      { kind: "sparkle", x: 22, y: 34, s: 1.1 },
      { kind: "heart", x: 150, y: 26, s: 1 },
      { kind: "star", x: 156, y: 196, s: 0.9 },
    ],
    behind: (s) => <Shape d={blob(100, 60, 42, 42, s + 41, 1.4)} fill={ART.mint} seed={s + 42} amount={0.5} />,
    front: (s) => (
      <>
        <Shape d="M66 62 C66 26 134 26 134 62 C126 44 116 38 100 38 C84 38 74 44 66 62 Z" fill={ART.mint} seed={s + 43} amount={0.9} />
        <Stroke d="M90 104 L88 126" seed={s + 44} width={3} />
        <Stroke d="M110 104 L112 126" seed={s + 45} width={3} />
      </>
    ),
    clothes: (s) => <Shape d="M77 148 L123 148 L119 172 L81 172 Z" fill={ART.cream} seed={s + 51} amount={0.8} />,
  },
};

export const CAST = (Object.keys(SPECS) as CharacterName[]).map((k) => ({
  name: SPECS[k].id,
  label: SPECS[k].label,
  role: SPECS[k].role,
  block: SPECS[k].block,
}));

// ------------------------------------------------------------- figure
export type CharacterProps = {
  pose?: Pose;
  item?: HoldItem;
  size?: number;
  flip?: boolean;
  stickers?: boolean;
  idle?: boolean;
  popIn?: boolean;
  seed?: number;
  title?: string;
  className?: string;
  style?: CSSProperties;
};

function Figure({
  spec,
  pose = "idle",
  item = "phone",
  size = 220,
  flip = false,
  stickers = false,
  idle = false,
  popIn = false,
  seed = 1,
  title,
  className,
  style,
}: CharacterProps & { spec: Spec }) {
  const a = ARMS[pose];
  const s = seed * 7 + spec.id.length;
  const w = (size * VIEWBOX.w) / VIEWBOX.h;
  const classes = [popIn ? "lpc-pop" : null, className].filter(Boolean).join(" ") || undefined;

  const garnish = stickers ? (
    <g className={idle ? "lpc-tw" : undefined}>
      {spec.stickers.map((st, i) => (
        <g key={`${st.kind}-${i}`} transform={`translate(${st.x} ${st.y}) scale(${st.s})`}>
          {stickerShape(st.kind, s + i * 13, INK)}
        </g>
      ))}
    </g>
  ) : null;

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      width={w}
      height={size}
      className={classes}
      style={style}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <style>{STYLES}</style>
      </defs>
      <g transform={flip ? `translate(${VIEWBOX.w} 0) scale(-1 1)` : undefined}>
        {garnish}
        <g className={idle ? "lpc-idle" : undefined}>
          <g transform={`translate(0 ${a.lift}) rotate(${a.lean} 100 256)`}>
            {/* legs and shoes, behind everything */}
            <Limb d={a.legs[0]} fill={spec.trousers} seed={s + 61} width={13} />
            <Limb d={a.legs[1]} fill={spec.trousers} seed={s + 62} width={13} />
            <Shape d={blob(a.shoes[0][0], a.shoes[0][1], 15, 8, s + 63, 1)} fill={INK} seed={s + 64} amount={0.5} />
            <Shape d={blob(a.shoes[1][0], a.shoes[1][1], 15, 8, s + 65, 1)} fill={INK} seed={s + 66} amount={0.5} />
            <Stroke d={`M${a.shoes[0][0] - 13} ${a.shoes[0][1] + 5} L${a.shoes[0][0] + 13} ${a.shoes[0][1] + 5}`} seed={s + 67} width={2.4} color={ART.cream} />
            <Stroke d={`M${a.shoes[1][0] - 13} ${a.shoes[1][1] + 5} L${a.shoes[1][0] + 13} ${a.shoes[1][1] + 5}`} seed={s + 68} width={2.4} color={ART.cream} />

            {/* neck and torso */}
            <Limb d="M100 88 L100 112" fill={spec.skin} seed={s + 71} width={16} />
            <Shape
              d="M66 120 C66 105 78 100 100 100 C122 100 134 105 134 120 L131 186 C131 193 69 193 69 186 Z"
              fill={spec.garment}
              seed={s + 72}
              amount={1}
            />
            {spec.clothes ? spec.clothes(s) : null}

            {/* held item sits between the hands */}
            {pose === "hold" ? <Item item={item} seed={s + 81} /> : null}

            {/* arms and hands */}
            <Limb d={a.l} fill={spec.garment} seed={s + 91} />
            <Limb d={a.r} fill={spec.garment} seed={s + 92} />
            <Hand at={a.lh} fill={spec.skin} seed={s + 93} />
            <Hand at={a.rh} fill={spec.skin} seed={s + 94} />
            {pose === "point" ? (
              <Limb d={`M${a.rh[0]} ${a.rh[1]} L${a.rh[0] + 17} ${a.rh[1] - 11}`} fill={spec.skin} seed={s + 95} width={5} />
            ) : null}

            {/* head */}
            <g transform={`rotate(${a.tilt} 100 94)`}>
              {spec.behind ? spec.behind(s) : null}
              <Shape d={blob(100, 62, 32, 34, s + 101, 1.5)} fill={spec.skin} seed={s + 102} amount={0.5} />
              {spec.front ? spec.front(s) : null}
              <Face pose={pose} seed={s + 111} />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

// ---------------------------------------------------------- exports
export function Maya(props: CharacterProps) {
  return <Figure spec={SPECS.maya} {...props} />;
}
export function Leo(props: CharacterProps) {
  return <Figure spec={SPECS.leo} {...props} />;
}
export function Fatima(props: CharacterProps) {
  return <Figure spec={SPECS.fatima} {...props} />;
}
export function Sami(props: CharacterProps) {
  return <Figure spec={SPECS.sami} {...props} />;
}
export function You(props: CharacterProps) {
  return <Figure spec={SPECS.you} {...props} />;
}

/** Pick a character by name, for data-driven screens. */
export function Character({ name, ...rest }: CharacterProps & { name: CharacterName }) {
  return <Figure spec={SPECS[name]} {...rest} />;
}

// =====================================================================
// BLOBERT: the blob who clears mistakes
// =====================================================================
// Board request, 26 October 2026. Spec: docs/design/brief.md section
// "Blobert", timing in docs/design/motion.md section 7a.
//
// Blobert is the only thing in the app that handles an error, so a
// mistake is never red, never a loss, always a small laugh. He pops in
// from the edge, looks at the wrong word, does one gag, waves and
// slides out, all in 880 ms.
//
// ---------------------------------------------------------------------
// PUBLIC API (stable, other agents build on this; add, never rename)
// ---------------------------------------------------------------------
//
//   import { Blobert, BLOBERT_GAGS, nextBlobertGag, BLOBERT_SEQUENCE }
//     from "@/components/learning-path/art/characters";
//
//   <Blobert pose="gag" gag="sweep" play word="has" fill={ART.sun} />
//   <Blobert pose="look" size={140} />                 // held frame
//   <Blobert pose="gag" gag="bin" progress={0.6} />    // frame driven
//
// Props (all optional):
//   pose      "in" | "look" | "gag" | "wave" | "out", default "look".
//   gag       "sweep" | "eat" | "mop" | "bin" | "vacuum" | "crane",
//             default "sweep". Only used when pose is "gag".
//   play      run the pose's timeline once on mount, default false.
//             pose="gag" plays the whole 880 ms script (in, look, gag,
//             wave, out). The other poses play their own short move.
//   scripted  default true. false makes pose="gag" play the 360 ms gag
//             core only, for when the host already has him on screen.
//   progress  0..1. Draws one exact frame of the timeline and runs no
//             CSS at all, so Remotion compositions stay deterministic.
//             Overrides `play`.
//   word      the wrong answer he clears, drawn as a tile to his right.
//             Omit it and he performs on the host's own tile (see the
//             box contract below).
//   fill      his body colour: pass the screen's one block colour.
//             Default ART.sun.
//   size      rendered height in CSS px, default 170. Width is
//             size * 300/200.
//   flip      mirror him, for when the wrong word is to his left.
//   idle      3.2 s soft wobble (scale on the horizontal only).
//   seed      integer that re-rolls the line wobble, default 1. Same
//             seed draws the same Blobert on every frame.
//   title     accessible label. Given: role="img" plus <title>.
//             Omitted: aria-hidden. He is a joke on top of a real
//             message, so usually leave it off.
//   className, style  passed to the root <svg>.
//
// Also exported: BLOBERT_POSES, BLOBERT_GAGS, BLOBERT_GAG_MS (880),
//   BLOBERT_CORE_MS (360), BLOBERT_SEQUENCE (the step timings),
//   BLOB_VIEWBOX, nextBlobertGag().
//
// THE BOX CONTRACT. His viewBox is 300 x 200 with Blobert standing in
// the left third (x 26 to 126) and the gag happening in the right two
// thirds. Position him so that right-hand area sits over the tile or
// word you want cleared; his own `word` tile is centred at x 184 and
// stands on the same baseline, y 168.
//
// REDUCED MOTION. Under prefers-reduced-motion every timeline is
// dropped for one 360 ms sequence: he fades in over 120 ms, the wrong
// word fades out over 120 ms, he fades out. No travel, no wobble, no
// bounce. Nothing else is needed from the caller.
//
// HOW THE TIMELINES WORK. One table of keyframes per pose and per gag
// drives both playback paths: `play` turns the table into CSS
// @keyframes, `progress` samples the same table in JavaScript. There is
// no second copy of the timing, so the CSS and the video frames cannot
// drift. Every animated layer carries its own pivot inside its own
// transform list (translate, rotate, scale, translate back), so no
// transform-origin guesswork and no transformed ancestors.
// =====================================================================

export type BlobertPose = "in" | "look" | "gag" | "wave" | "out";
export type BlobertGag = "sweep" | "eat" | "mop" | "bin" | "vacuum" | "crane";

export const BLOBERT_POSES: BlobertPose[] = ["in", "look", "gag", "wave", "out"];
export const BLOBERT_GAGS: BlobertGag[] = ["sweep", "eat", "mop", "bin", "vacuum", "crane"];

export const BLOB_VIEWBOX = { w: 300, h: 200 } as const;

/** The scripted miss, measured not estimated. The wave overlaps the tail
 *  of the gag by 120 ms, which is what brings the total under 900 ms. */
export const BLOBERT_SEQUENCE = {
  in: { from: 0, to: 200 },
  look: { from: 200, to: 320 },
  gag: { from: 320, to: 680 },
  wave: { from: 560, to: 720 },
  out: { from: 720, to: 880 },
} as const;
export const BLOBERT_GAG_MS = 880;
export const BLOBERT_CORE_MS = 360;

/** Variable reward, same rule as the sticker pop: never the same gag
 *  twice in a row. Pass the gag you played last. */
export function nextBlobertGag(last?: BlobertGag): BlobertGag {
  const pool = BLOBERT_GAGS.filter((g) => g !== last);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ------------------------------------------------------- the timeline
type Key = { t: number; x?: number; y?: number; r?: number; s?: number; o?: number; e?: string };
type Tracks = Record<string, Key[]>;
type Timeline = { ms: number; still: number; rest: number; tracks: Tracks };
type Vals = { x: number; y: number; r: number; s: number; o: number };

function vals(k: Key): Vals {
  return { x: k.x ?? 0, y: k.y ?? 0, r: k.r ?? 0, s: k.s ?? 1, o: k.o ?? 1 };
}

function lerp(a: number, b: number, u: number): number {
  return a + (b - a) * u;
}

/** The frame of one track at `t` ms. Holds the first and last key. */
function sampleTrack(keys: Key[], t: number): Vals {
  if (t <= keys[0].t) return vals(keys[0]);
  for (let i = 1; i < keys.length; i += 1) {
    if (t <= keys[i].t) {
      const a = vals(keys[i - 1]);
      const b = vals(keys[i]);
      const span = keys[i].t - keys[i - 1].t;
      const u = span <= 0 ? 1 : (t - keys[i - 1].t) / span;
      return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), r: lerp(a.r, b.r, u), s: lerp(a.s, b.s, u), o: lerp(a.o, b.o, u) };
    }
  }
  return vals(keys[keys.length - 1]);
}

// Pivot per layer, in viewBox units. A layer rotates and scales about
// its own pivot, so the arm swings from the shoulder and the body
// squashes on the ground.
const PIVOT: Record<string, [number, number]> = {
  body: [76, 169],
  eyes: [76, 114],
  eHappy: [76, 114],
  mSmile: [77, 142],
  mO: [77, 142],
  mWide: [77, 142],
  armL: [30, 128],
  armR: [120, 120],
  tool: [146, 118],
  word: [184, 146],
  bin: [258, 152],
  lid: [224, 128],
  hook: [204, 66],
  puddle: [184, 164],
  dust: [236, 140],
  star: [115, 103],
  sneeze: [140, 108],
};

// Layers that are not drawn unless their gag asks for them.
const HIDDEN = new Set(["mO", "mWide", "eHappy", "puddle", "dust", "star", "sneeze"]);

function attrXf(v: Vals, p: [number, number]): string {
  return `translate(${(p[0] + v.x).toFixed(2)} ${(p[1] + v.y).toFixed(2)}) rotate(${v.r.toFixed(2)}) scale(${v.s.toFixed(3)}) translate(${-p[0]} ${-p[1]})`;
}

function cssXf(v: Vals, p: [number, number]): string {
  return `translate(${(p[0] + v.x).toFixed(2)}px,${(p[1] + v.y).toFixed(2)}px) rotate(${v.r.toFixed(2)}deg) scale(${v.s.toFixed(3)}) translate(${-p[0]}px,${-p[1]}px)`;
}

/** One track becomes one @keyframes rule. Both ends are pinned so the
 *  browser never interpolates towards the element's own attributes. */
function keyframes(name: string, keys: Key[], p: [number, number], ms: number): string {
  const pinned: Key[] = [...keys];
  if (pinned[0].t > 0) pinned.unshift({ ...pinned[0], t: 0 });
  if (pinned[pinned.length - 1].t < ms) pinned.push({ ...pinned[pinned.length - 1], t: ms });
  const stops = pinned
    .map((k) => {
      const pct = Math.min(100, Math.max(0, (k.t / ms) * 100)).toFixed(3);
      const ease = k.e ? `;animation-timing-function:${k.e}` : "";
      return `${pct}%{transform:${cssXf(vals(k), p)};opacity:${vals(k).o}${ease}}`;
    })
    .join("");
  return `@keyframes ${name}{${stops}}`;
}

// ------------------------------------------------- the scripted miss
// Pop in from the edge, lean at the wrong word, hold, lean back, go.
const BODY_SCRIPT: Key[] = [
  { t: 0, x: -176, y: 10, s: 0.86, o: 0 },
  { t: 96, x: -58, y: 0, s: 1, o: 1 },
  { t: 200, x: 0, y: -5, s: 1.06, o: 1, e: "cubic-bezier(.34,1.56,.64,1)" },
  { t: 262, x: 0, y: 0, r: 4, s: 1, o: 1 },
  { t: 700, x: 0, y: 0, r: 4, s: 1, o: 1 },
  { t: 740, x: -14, y: 0, r: 1, s: 1, o: 1 },
  { t: 880, x: -176, y: 6, r: 0, s: 0.9, o: 0 },
];

// Dot eyes swap for happy arcs on the wave. The swap is a cut, not a
// cross-fade: two ink faces at half opacity read as a grey smudge, and
// ink is never see-through in this kit.
const EYES_SCRIPT: Key[] = [
  { t: 0, x: 0, o: 1 },
  { t: 200, x: 0, o: 1 },
  { t: 320, x: 5, o: 1 },
  { t: 560, x: 5, o: 1 },
  { t: 561, x: 5, o: 0 },
  { t: 880, x: 5, o: 0 },
];

const HAPPY_SCRIPT: Key[] = [
  { t: 0, x: 5, o: 0 },
  { t: 560, x: 5, o: 0 },
  { t: 561, x: 5, o: 1 },
  { t: 760, x: 0, o: 1 },
  { t: 880, x: 0, o: 1 },
];

// Two swings of a raised arm. The spec's 6 degrees does not read at
// 150 px, so the arm lifts 56 degrees and swings 12.
const WAVE_SCRIPT: Key[] = [
  { t: 0, r: 0 },
  { t: 560, r: 0 },
  { t: 596, r: 56 },
  { t: 632, r: 44 },
  { t: 668, r: 56 },
  { t: 700, r: 44 },
  { t: 760, r: 0 },
];

/** Merge extra body keys (a sneeze, a recoil) into the script in order. */
function bodyWith(extra: Key[]): Key[] {
  return [...BODY_SCRIPT, ...extra].sort((a, b) => a.t - b.t);
}

/** Swap the resting smile for one open mouth between two times. Both
 *  swaps are cuts for the same reason as the eyes: a cross-fade puts two
 *  ink mouths on top of each other and the face goes muddy. */
function mouth(variant: "mO" | "mWide", from: number, to: number): Tracks {
  return {
    mSmile: [
      { t: 0, o: 1 },
      { t: from - 1, o: 1 },
      { t: from, o: 0 },
      { t: to, o: 0 },
      { t: to + 1, o: 1 },
    ],
    [variant]: [
      { t: 0, o: 0 },
      { t: from - 1, o: 0 },
      { t: from, o: 1 },
      { t: to, o: 1 },
      { t: to + 1, o: 0 },
    ],
  };
}

const SCRIPT_BASE: Tracks = { eyes: EYES_SCRIPT, eHappy: HAPPY_SCRIPT, armL: WAVE_SCRIPT };

// ------------------------------------------------------- the six gags
const GAGS: Record<BlobertGag, Timeline> = {
  // Sweeps it off the screen with the broom.
  sweep: {
    ms: BLOBERT_GAG_MS,
    still: 0.59,
    rest: 320,
    tracks: {
      ...SCRIPT_BASE,
      body: BODY_SCRIPT,
      ...mouth("mO", 360, 640),
      armR: [
        { t: 0, r: 0 },
        { t: 320, r: 0 },
        { t: 404, r: -7 },
        { t: 500, r: 6 },
        { t: 600, r: 4 },
        { t: 680, r: 0 },
      ],
      tool: [
        { t: 0, r: 0 },
        { t: 320, r: 0 },
        { t: 404, r: 12 },
        { t: 504, r: -32, e: "cubic-bezier(.2,.85,.3,1)" },
        { t: 604, r: -26 },
        { t: 680, r: 0 },
      ],
      word: [
        { t: 0, x: 0, r: 0, o: 1 },
        { t: 432, x: 0, r: 0, o: 1 },
        { t: 520, x: 58, r: 12, o: 1 },
        { t: 624, x: 152, r: 30, o: 0 },
        { t: 880, x: 152, r: 30, o: 0 },
      ],
      dust: [
        { t: 0, x: 0, s: 0.8, o: 0 },
        { t: 468, x: 0, s: 0.8, o: 0 },
        { t: 532, x: 0, s: 1, o: 1 },
        { t: 648, x: 14, s: 1.15, o: 0 },
      ],
    },
  },

  // Eats it and burps a star.
  eat: {
    ms: BLOBERT_GAG_MS,
    still: 0.56,
    rest: 320,
    tracks: {
      ...SCRIPT_BASE,
      body: bodyWith([
        { t: 556, x: 0, y: 0, r: 4, s: 1.04, o: 1 },
        { t: 600, x: 0, y: 0, r: 4, s: 0.98, o: 1 },
        { t: 648, x: 0, y: 0, r: 4, s: 1, o: 1 },
      ]),
      ...mouth("mWide", 380, 556),
      armR: [
        { t: 0, r: 0 },
        { t: 320, r: 0 },
        { t: 384, r: -18 },
        { t: 444, r: 6 },
        { t: 504, r: -12 },
        { t: 600, r: 0 },
      ],
      word: [
        { t: 0, x: 0, y: 0, s: 1, o: 1 },
        { t: 348, x: 0, y: 0, s: 1, o: 1 },
        { t: 464, x: -56, y: -6, s: 0.78, o: 1 },
        { t: 540, x: -103, y: -2, s: 0.4, o: 1 },
        { t: 560, x: -103, y: -2, s: 0.26, o: 0 },
        { t: 880, x: -103, y: -2, s: 0.26, o: 0 },
      ],
      star: [
        { t: 0, y: 0, s: 0.5, o: 0 },
        { t: 584, y: 0, s: 0.5, o: 0 },
        { t: 636, y: -20, s: 1.1, o: 1 },
        { t: 712, y: -38, s: 1.2, o: 0 },
      ],
    },
  },

  // Mops it into a puddle that evaporates.
  mop: {
    ms: BLOBERT_GAG_MS,
    still: 0.64,
    rest: 320,
    tracks: {
      ...SCRIPT_BASE,
      body: BODY_SCRIPT,
      ...mouth("mO", 360, 640),
      armR: [
        { t: 0, r: 0 },
        { t: 320, r: 0 },
        { t: 400, r: 10 },
        { t: 480, r: 4 },
        { t: 544, r: 11 },
        { t: 620, r: 0 },
      ],
      tool: [
        { t: 0, r: 0, y: 0 },
        { t: 320, r: 0, y: 0 },
        { t: 400, r: -6, y: 4 },
        { t: 480, r: 6, y: 4 },
        { t: 544, r: -8, y: 4 },
        { t: 620, r: 0, y: 0 },
      ],
      word: [
        { t: 0, y: 0, s: 1, o: 1 },
        { t: 384, y: 0, s: 1, o: 1 },
        { t: 472, y: 10, s: 0.84, o: 1 },
        { t: 540, y: 22, s: 0.5, o: 0.5 },
        { t: 584, y: 26, s: 0.38, o: 0 },
        { t: 880, y: 26, s: 0.38, o: 0 },
      ],
      puddle: [
        { t: 0, s: 0.7, o: 0 },
        { t: 516, s: 0.7, o: 0 },
        { t: 572, s: 1, o: 1 },
        { t: 692, s: 1.3, o: 0 },
      ],
    },
  },

  // Flicks it into the bin and the lid claps.
  bin: {
    ms: BLOBERT_GAG_MS,
    still: 0.6,
    rest: 320,
    tracks: {
      ...SCRIPT_BASE,
      body: BODY_SCRIPT,
      ...mouth("mO", 360, 640),
      armR: [
        { t: 0, r: 0 },
        { t: 320, r: 0 },
        { t: 392, r: -14 },
        { t: 472, r: 22 },
        { t: 560, r: 8 },
        { t: 660, r: 0 },
      ],
      tool: [{ t: 0, r: 0 }],
      lid: [
        { t: 0, r: 0 },
        { t: 332, r: 0 },
        { t: 404, r: -62 },
        { t: 556, r: -62 },
        { t: 600, r: 7, e: "cubic-bezier(.3,.1,.2,1)" },
        { t: 628, r: -5 },
        { t: 664, r: 0 },
      ],
      word: [
        { t: 0, x: 0, y: 0, r: 0, o: 1 },
        { t: 424, x: 0, y: 0, r: 0, o: 1 },
        { t: 484, x: 30, y: -34, r: 14, o: 1 },
        { t: 532, x: 60, y: -10, r: 26, o: 1 },
        { t: 572, x: 74, y: 8, r: 34, o: 1 },
        { t: 596, x: 74, y: 16, r: 36, o: 0 },
        { t: 880, x: 74, y: 16, r: 36, o: 0 },
      ],
    },
  },

  // Vacuums it up, then sneezes.
  vacuum: {
    ms: BLOBERT_GAG_MS,
    still: 0.62,
    rest: 320,
    tracks: {
      ...SCRIPT_BASE,
      body: bodyWith([
        { t: 596, x: 0, y: 0, r: 4, s: 1, o: 1 },
        { t: 624, x: 0, y: -4, r: -9, s: 1.02, o: 1 },
        { t: 656, x: 0, y: 2, r: 15, s: 0.98, o: 1 },
        { t: 696, x: 0, y: 0, r: 4, s: 1, o: 1 },
      ]),
      mSmile: [
        { t: 0, o: 1 },
        { t: 352, o: 1 },
        { t: 384, o: 0 },
        { t: 700, o: 0 },
        { t: 736, o: 1 },
      ],
      mO: [
        { t: 0, o: 0 },
        { t: 352, o: 0 },
        { t: 384, o: 1 },
        { t: 592, o: 1 },
        { t: 616, o: 0 },
        { t: 880, o: 0 },
      ],
      mWide: [
        { t: 0, o: 0 },
        { t: 616, o: 0 },
        { t: 640, o: 1 },
        { t: 700, o: 1 },
        { t: 724, o: 0 },
      ],
      armR: [
        { t: 0, r: 0 },
        { t: 320, r: 0 },
        { t: 384, r: -6 },
        { t: 452, r: 2 },
        { t: 520, r: -4 },
        { t: 600, r: 0 },
      ],
      word: [
        { t: 0, x: 0, r: 0, s: 1, o: 1 },
        { t: 364, x: 0, r: 0, s: 1, o: 1 },
        { t: 472, x: 16, r: -8, s: 0.78, o: 1 },
        { t: 544, x: 34, r: 10, s: 0.44, o: 1 },
        { t: 580, x: 40, r: 16, s: 0.18, o: 0 },
        { t: 880, x: 40, r: 16, s: 0.18, o: 0 },
      ],
      sneeze: [
        { t: 0, x: 0, s: 0.7, o: 0 },
        { t: 636, x: 0, s: 0.7, o: 0 },
        { t: 668, x: 4, s: 1, o: 1 },
        { t: 736, x: 20, s: 1.25, o: 0 },
      ],
    },
  },

  // Lifts it away with the tiny crane.
  crane: {
    ms: BLOBERT_GAG_MS,
    still: 0.74,
    rest: 320,
    tracks: {
      ...SCRIPT_BASE,
      body: BODY_SCRIPT,
      ...mouth("mO", 360, 668),
      armR: [
        { t: 0, r: 0 },
        { t: 320, r: 0 },
        { t: 404, r: -3 },
        { t: 476, r: 2 },
        { t: 548, r: -3 },
        { t: 624, r: 0 },
      ],
      tool: [{ t: 0, r: 0 }],
      hook: [
        { t: 0, y: -44, o: 1 },
        { t: 336, y: -44, o: 1 },
        { t: 436, y: 0, o: 1 },
        { t: 504, y: 0, o: 1 },
        { t: 664, y: -118, o: 1 },
        { t: 704, y: -124, o: 0 },
        { t: 880, y: -124, o: 0 },
      ],
      word: [
        { t: 0, y: 0, r: 0, o: 1 },
        { t: 504, y: 0, r: 0, o: 1 },
        { t: 664, y: -118, r: -6, o: 1 },
        { t: 704, y: -124, r: -7, o: 0 },
        { t: 880, y: -124, r: -7, o: 0 },
      ],
    },
  },
};

/** The 360 ms gag core on its own, for when he is already on screen. */
function coreOnly(tl: Timeline): Timeline {
  const from = BLOBERT_SEQUENCE.gag.from;
  const to = BLOBERT_SEQUENCE.gag.to;
  const ms = to - from;
  const tracks: Tracks = {};
  for (const [id, keys] of Object.entries(tl.tracks)) {
    if (id === "body") continue; // no travel in, no slide out
    const shifted = keys
      .filter((k) => k.t >= from - 60 && k.t <= to + 60)
      .map((k) => ({ ...k, t: Math.min(ms, Math.max(0, k.t - from)) }));
    tracks[id] = shifted.length ? shifted : [{ ...sampleTrack(keys, from), t: 0 }];
  }
  tracks.body = [{ t: 0, r: 4 }, { t: ms, r: 4 }];
  return { ms, still: 0.5, rest: 0, tracks };
}

// ----------------------------------------------------- the short poses
const POSE_TL: Record<Exclude<BlobertPose, "gag">, Timeline> = {
  in: {
    ms: 200,
    still: 1,
    rest: 200,
    tracks: {
      body: [
        { t: 0, x: -176, y: 10, s: 0.86, o: 0 },
        { t: 96, x: -58, y: 0, s: 1, o: 1 },
        { t: 170, x: 0, y: -5, s: 1.06, o: 1, e: "cubic-bezier(.34,1.56,.64,1)" },
        { t: 200, x: 0, y: 0, s: 1, o: 1 },
      ],
    },
  },
  look: {
    ms: 120,
    still: 1,
    rest: 120,
    tracks: {
      body: [
        { t: 0, r: 0 },
        { t: 120, r: 4 },
      ],
      eyes: [
        { t: 0, x: 0 },
        { t: 120, x: 5 },
      ],
      mSmile: [
        { t: 0, o: 1 },
        { t: 56, o: 0 },
        { t: 120, o: 0 },
      ],
      mO: [
        { t: 0, o: 0 },
        { t: 56, o: 1 },
        { t: 120, o: 1 },
      ],
    },
  },
  wave: {
    ms: 200,
    still: 0.3,
    rest: 60,
    tracks: {
      armL: [
        { t: 0, r: 0 },
        { t: 44, r: 56 },
        { t: 88, r: 44 },
        { t: 132, r: 56 },
        { t: 176, r: 44 },
        { t: 200, r: 52 },
      ],
      eyes: [
        { t: 0, o: 1 },
        { t: 36, o: 0 },
        { t: 200, o: 0 },
      ],
      eHappy: [
        { t: 0, o: 0 },
        { t: 36, o: 1 },
        { t: 200, o: 1 },
      ],
    },
  },
  out: {
    ms: 160,
    still: 0.45,
    rest: 0,
    tracks: {
      body: [
        { t: 0, x: 0, y: 0, s: 1, o: 1 },
        { t: 160, x: -176, y: 6, s: 0.9, o: 0 },
      ],
    },
  },
};

// ------------------------------------------------------------ drawing
const BLOB_GROUND = 169;

/** The wrong answer, as a tile standing on the baseline. */
function WrongWord({ word, seed }: { word: string; seed: number }) {
  const w = Math.max(70, Math.min(116, 26 + word.length * 13));
  return (
    <>
      <Shape d={roundRect(184 - w / 2, 124, w, 44, 12)} fill={ART.paper} seed={seed} amount={0.8} />
      <text
        x={184}
        y={153}
        textAnchor="middle"
        fill={INK}
        style={{ font: `800 22px "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif` }}
      >
        {word}
      </text>
    </>
  );
}

/** What he holds for this gag. Drawn inside the `tool` layer, which
 *  pivots at his hand, so a sweep swings the whole broom. */
function BlobTool({ gag, seed, fill }: { gag: BlobertGag; seed: number; fill: string }) {
  switch (gag) {
    case "sweep":
      return (
        <g transform="rotate(-20 146 118)">
          <Stroke d="M146 112 L145 150" seed={seed} width={5} />
          <Shape d={roundRect(132, 150, 27, 11, 4)} fill={ART.cream} seed={seed + 1} amount={0.6} />
          <Stroke d="M137 161 L134 170" seed={seed + 2} width={3} />
          <Stroke d="M146 161 L146 171" seed={seed + 3} width={3} />
          <Stroke d="M155 161 L158 170" seed={seed + 4} width={3} />
        </g>
      );
    case "mop":
      return (
        <g transform="rotate(-16 146 118)">
          <Stroke d="M146 112 L145 148" seed={seed} width={5} />
          <Shape d={blob(145, 160, 17, 11, seed + 1, 1.8, 11)} fill={ART.cream} seed={seed + 2} amount={0.6} />
          <Stroke d="M136 168 L134 174" seed={seed + 3} width={2.6} />
          <Stroke d="M152 168 L155 174" seed={seed + 4} width={2.6} />
        </g>
      );
    case "vacuum":
      return <Stroke d="M146 122 Q198 90 252 110 Q264 118 257 132" seed={seed} width={5.5} />;
    case "crane":
      return (
        <>
          <Stroke d="M146 116 L146 73" seed={seed} width={5} />
          <Stroke d="M144 76 L206 67" seed={seed + 1} width={5} />
          <Shape d={blob(152, 112, 7, 7, seed + 2, 0.9)} fill={ART.cream} seed={seed + 3} amount={0.4} />
          <Stroke d="M152 112 L160 118" seed={seed + 4} width={3} />
        </>
      );
    default:
      return null;
  }
}

/** Gag furniture drawn behind Blobert. */
function GagBack({ gag, seed, fill, word, A }: { gag: BlobertGag; seed: number; fill: string; word?: string; A: AnimFn }) {
  const tile = word ? <A id="word"><WrongWord word={word} seed={seed + 7} /></A> : null;
  switch (gag) {
    case "sweep":
      return (
        <>
          {tile}
          <A id="dust">
            <Stroke d="M226 136 L240 132" seed={seed + 11} width={3.4} />
            <Stroke d="M232 148 L248 146" seed={seed + 12} width={3.4} />
            <Stroke d="M238 124 L250 118" seed={seed + 13} width={3.4} />
          </A>
        </>
      );
    case "mop":
      return (
        <>
          {tile}
          <A id="puddle">
            <Shape d={blob(184, 164, 36, 7, seed + 11, 1.6, 13)} fill={fill} seed={seed + 12} amount={0.5} />
            <Stroke d="M170 152 Q166 144 171 137" seed={seed + 13} width={2.8} />
            <Stroke d="M198 150 Q203 143 198 136" seed={seed + 14} width={2.8} />
          </A>
        </>
      );
    case "bin":
      return (
        <>
          {tile}
          <A id="bin">
            <Shape d="M226 136 L292 136 L284 170 L234 170 Z" fill={ART.paper} seed={seed + 11} amount={0.9} />
            <Stroke d="M246 144 L244 164" seed={seed + 12} width={3} />
            <Stroke d="M259 144 L259 164" seed={seed + 13} width={3} />
            <Stroke d="M272 144 L274 164" seed={seed + 14} width={3} />
          </A>
          <A id="lid">
            <Shape d={roundRect(222, 122, 74, 12, 5)} fill={ART.paper} seed={seed + 15} amount={0.7} />
            <Shape d={blob(259, 118, 7, 5, seed + 16, 0.8)} fill={ART.paper} seed={seed + 17} amount={0.4} />
          </A>
        </>
      );
    case "vacuum":
      return (
        <>
          {tile}
          <A id="bin">
            <Shape d="M238 140 L216 128 L216 164 L238 156 Z" fill={ART.paper} seed={seed + 11} amount={0.7} />
            <Shape d={roundRect(236, 130, 54, 40, 12)} fill={ART.paper} seed={seed + 12} amount={0.8} />
            <Stroke d="M250 146 L276 146" seed={seed + 13} width={3} />
            <Stroke d="M250 156 L276 156" seed={seed + 14} width={3} />
          </A>
        </>
      );
    case "crane":
      return (
        <>
          {tile}
          <A id="hook">
            <Stroke d="M204 70 L204 110" seed={seed + 11} width={2.8} />
            <Stroke d="M198 110 Q204 121 210 110" seed={seed + 12} width={3.4} />
          </A>
        </>
      );
    default:
      return null;
  }
}

/** Gag furniture drawn in front of Blobert: what goes into his mouth,
 *  and what comes back out. */
function GagFront({ gag, seed, word, A }: { gag: BlobertGag; seed: number; word?: string; A: AnimFn }) {
  switch (gag) {
    case "eat":
      return (
        <>
          {word ? <A id="word"><WrongWord word={word} seed={seed + 7} /></A> : null}
          <A id="star">
            <g transform="translate(103 91) scale(1.6)">{stickerShape("star", seed + 21, INK)}</g>
          </A>
        </>
      );
    case "vacuum":
      return (
        <A id="sneeze">
          <g transform="translate(120 92) scale(1.3)">{stickerShape("cloud", seed + 21, INK)}</g>
          <Stroke d="M152 100 L166 94" seed={seed + 22} width={3.2} />
          <Stroke d="M154 112 L170 112" seed={seed + 23} width={3.2} />
          <Stroke d="M150 122 L164 128" seed={seed + 24} width={3.2} />
        </A>
      );
    default:
      return null;
  }
}

type AnimFn = (props: { id: string; children?: ReactNode }) => ReactNode;

// ------------------------------------------------------------- Blobert
export type BlobertProps = {
  pose?: BlobertPose;
  gag?: BlobertGag;
  play?: boolean;
  scripted?: boolean;
  progress?: number;
  word?: string;
  fill?: string;
  size?: number;
  flip?: boolean;
  idle?: boolean;
  seed?: number;
  title?: string;
  className?: string;
  style?: CSSProperties;
};

export function Blobert({
  pose = "look",
  gag = "sweep",
  play = false,
  scripted = true,
  progress,
  word,
  fill = ART.sun,
  size = 170,
  flip = false,
  idle = false,
  seed = 1,
  title,
  className,
  style,
}: BlobertProps) {
  const s = seed * 7 + 5;
  const key = pose === "gag" ? (scripted ? gag : `${gag}-core`) : pose;
  const tl = pose === "gag" ? (scripted ? GAGS[gag] : coreOnly(GAGS[gag])) : POSE_TL[pose];
  const running = play && progress === undefined;
  const t = progress === undefined ? tl.still * tl.ms : Math.min(1, Math.max(0, progress)) * tl.ms;
  const w = (size * BLOB_VIEWBOX.w) / BLOB_VIEWBOX.h;

  // One wrapper per animated layer. Playing: a class with generated
  // keyframes, plus the resting frame as an attribute so a
  // reduced-motion browser (which drops the keyframes) still sees a
  // whole Blobert. Otherwise: one sampled frame, no CSS at all.
  const A: AnimFn = ({ id, children }) => {
    const keys = tl.tracks[id];
    const p = PIVOT[id] ?? [0, 0];
    const frame = keys ? sampleTrack(keys, running ? tl.rest : t) : { x: 0, y: 0, r: 0, s: 1, o: HIDDEN.has(id) ? 0 : 1 };
    return (
      <g className={running && keys ? `lpb-l lpb-${key}-${id}` : undefined} transform={attrXf(frame, p)} opacity={frame.o}>
        {children}
      </g>
    );
  };

  const css = running
    ? [
        BLOB_STYLES,
        ...Object.entries(tl.tracks).map(([id, keys]) => keyframes(`lpb-k-${key}-${id}`, keys, PIVOT[id] ?? [0, 0], tl.ms)),
        ...Object.keys(tl.tracks).map(
          (id) => `.lpb-${key}-${id}{animation:lpb-k-${key}-${id} ${tl.ms}ms ease-out both}`,
        ),
        REDUCED_STYLES,
      ].join("\n")
    : [BLOB_STYLES, REDUCED_STYLES].join("\n");

  return (
    <svg
      viewBox={`0 0 ${BLOB_VIEWBOX.w} ${BLOB_VIEWBOX.h}`}
      width={w}
      height={size}
      className={[running ? "lpb-play" : null, className].filter(Boolean).join(" ") || undefined}
      style={flip ? { ...style, transform: `${style?.transform ?? ""} scaleX(-1)`.trim() } : style}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <style>{css}</style>
      </defs>

      {pose === "gag" ? <GagBack gag={gag} seed={s} fill={fill} word={word} A={A} /> : word ? <A id="word"><WrongWord word={word} seed={s + 7} /></A> : null}

      <A id="body">
        <g className={idle ? "lpb-wob" : undefined}>
          {/* the blob */}
          <Shape d={blob(76, 126, 50, 43, s + 1, 2.6, 13)} fill={fill} seed={s + 2} amount={1.1} />

          {/* two stubby arms, no legs */}
          <A id="armL">
            <Limb d="M30 128 Q14 134 12 150" fill={fill} seed={s + 11} width={10} />
            <Shape d={blob(12, 152, 7.5, 7.5, s + 12, 1)} fill={fill} seed={s + 13} amount={0.4} />
          </A>
          <A id="armR">
            <Limb d="M120 120 Q136 116 146 116" fill={fill} seed={s + 14} width={10} />
            <Shape d={blob(146, 118, 7.5, 7.5, s + 15, 1)} fill={fill} seed={s + 16} amount={0.4} />
            {pose === "gag" ? (
              <A id="tool">
                <BlobTool gag={gag} seed={s + 31} fill={fill} />
              </A>
            ) : null}
          </A>

          {/* dot eyes and one big mouth */}
          <A id="eyes">
            <circle cx={62} cy={114} r={5.4} fill={INK} />
            <circle cx={92} cy={114} r={5.4} fill={INK} />
          </A>
          <A id="eHappy">
            <Stroke d="M55 117 Q62 108 69 117" seed={s + 21} width={3.4} />
            <Stroke d="M85 117 Q92 108 99 117" seed={s + 22} width={3.4} />
          </A>
          <A id="mSmile">
            <Stroke d="M58 136 Q76 154 95 135" seed={s + 23} width={3.6} />
          </A>
          <A id="mO">
            <Shape d={blob(77, 142, 7.5, 9, s + 24, 1)} fill={INK} seed={s + 25} amount={0.4} />
          </A>
          <A id="mWide">
            <Shape d="M54 133 Q77 172 99 132 Z" fill={INK} seed={s + 26} amount={0.7} />
          </A>
        </g>
      </A>

      {pose === "gag" ? <GagFront gag={gag} seed={s} word={word} A={A} /> : null}
    </svg>
  );
}

const BLOB_STYLES = `
.lpb-wob{transform-box:view-box;transform-origin:0 0;animation:lpb-wob 3200ms ease-in-out infinite}
@keyframes lpb-wob{0%,100%{transform:translate(76px,${BLOB_GROUND}px) scale(1,1) translate(-76px,-${BLOB_GROUND}px)}50%{transform:translate(76px,${BLOB_GROUND}px) scale(1.03,.99) translate(-76px,-${BLOB_GROUND}px)}}
.lpb-l{transform-box:view-box;transform-origin:0 0}
@keyframes lpb-rm{0%{opacity:0}33%{opacity:1}66%{opacity:1}100%{opacity:0}}
@keyframes lpb-rm-word{0%,33%{opacity:1}66%,100%{opacity:0}}
`;

// Last in the sheet on purpose: these rules must win over the generated
// per-layer ones, which share their specificity.
const REDUCED_STYLES = `
@media (prefers-reduced-motion: reduce){
.lpb-wob{animation:none}
.lpb-play .lpb-l{animation:none}
.lpb-play{animation:lpb-rm 360ms linear both}
.lpb-play .lpb-l[class*="-word"]{animation:lpb-rm-word 360ms linear both}
}
`;
