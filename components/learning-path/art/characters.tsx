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
