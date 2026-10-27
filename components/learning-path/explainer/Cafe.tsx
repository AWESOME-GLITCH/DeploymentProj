"use client";

// "At the cafe": a 2D motion-graphics explainer built as a Remotion
// composition (3:4, 1080×1440, 30 fps, 52 s). The same component renders to MP4 and
// plays interactively inside the app through the Remotion Player.
// Five beats from the PRD: hook, notice (three lines), explain, practise aloud, recap.
// Built on the explainer kit in ./lib (characters, props, camera, transitions, type).

import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";
import {
  ACCENT, Badge, BeatProgress, Birds, CaptionBar, Character, Confetti, CREAM, Cup, EASE, Eyebrow, FaceChip, FAINT, FOG, FONT, Highlight, INK, KineticText, karaoke, MenuBoard,
  PAPER, Parallax, Pastry, PendantLamp, PINK, Plant, SAFFRON, SEA, SpeechBubble, springIn, Stage, TapCue, Till, Transition, tween, WallShelf, Waveform, Window, WOOD, WOOD_DARK, WOOD_LIGHT,
} from "./lib";

export { karaoke };

export const CAFE_FPS = 30;
export const CAFE_W = 1080;
export const CAFE_H = 1440;

export type Beat = { id: string; from: number; to: number; line: string; target?: string[]; kind: "hook" | "notice" | "explain" | "practise" | "recap" | "word"; pauseAt?: number };

// Beats are 5 to 7 seconds and every teaching beat ends on its stopping line,
// so the learner acts before anything passive runs past 8 seconds (board rule,
// 26 Oct 2026). The asks grow: tap the key words, say the line, say it with a
// new word. The player derives the stop from `target` and `pauseAt`, so a
// `pauseAt` must sit strictly inside its own beat.
export const CAFE_BEATS: Beat[] = [
  { id: "hook", kind: "hook", from: 0, to: 150, line: "Monday morning. Shoreditch. Coffee first." },
  { id: "n1", kind: "notice", from: 150, to: 300, line: "I'd like a coffee, please.", target: ["I'd like", "please"] },
  { id: "n2", kind: "notice", from: 300, to: 450, line: "I'd like two coffees, please.", target: ["I'd like", "please"] },
  { id: "n3", kind: "notice", from: 450, to: 600, line: "Could I have a tea?", target: ["Could I have"] },
  { id: "explain", kind: "explain", from: 600, to: 795, line: "I want is direct. I'd like is polite.", target: ["I'd like"] },
  { id: "polite", kind: "explain", from: 795, to: 990, line: "Add please. It sounds warm.", target: ["please"] },
  { id: "practise", kind: "practise", from: 990, to: 1200, line: "Say it with me. I'd like a coffee, please.", target: ["I'd like", "please"], pauseAt: 1186 },
  { id: "again", kind: "practise", from: 1200, to: 1350, line: "I'd like a tea, please.", target: ["a tea"], pauseAt: 1320 },
  { id: "recap", kind: "recap", from: 1350, to: 1560, line: "You can order a coffee politely.", target: ["politely"] },
];
export const CAFE_DURATION = 1560;

/** Captions in the learner's own language, one line per beat id. The lead
 *  registers this in ExplainerPlayer; it lives here so the beat list and its
 *  captions cannot drift apart. */
export const CAFE_L1: Record<string, Record<string, string>> = {
  ar: { hook: "صباح الاثنين. شورديتش. القهوة أولًا.", n1: "أريد قهوة، من فضلك.", n2: "أريد قهوتين، من فضلك.", n3: "هل يمكنني الحصول على شاي؟", explain: "I want مباشرة. I'd like مؤدبة.", polite: "أضف please. تصبح أدفأ.", practise: "قلها معي.", again: "أريد شايًا، من فضلك.", recap: "يمكنك الآن طلب قهوة بأدب." },
  es: { hook: "Lunes por la mañana. Shoreditch. Primero, café.", n1: "Quisiera un café, por favor.", n2: "Quisiera dos cafés, por favor.", n3: "¿Podría tomar un té?", explain: "I want es directo. I'd like es cortés.", polite: "Añade please. Suena más amable.", practise: "Dilo conmigo.", again: "Quisiera un té, por favor.", recap: "Ya puedes pedir un café con cortesía." },
  hi: { hook: "सोमवार की सुबह। शोरडिच। पहले कॉफ़ी।", n1: "मुझे एक कॉफ़ी चाहिए, कृपया।", n2: "मुझे दो कॉफ़ी चाहिए, कृपया।", n3: "क्या मुझे एक चाय मिल सकती है?", explain: "I want सीधा है। I'd like विनम्र है।", polite: "please जोड़ें। यह और गर्मजोशी भरा लगता है।", practise: "मेरे साथ बोलो।", again: "मुझे एक चाय चाहिए, कृपया।", recap: "अब आप विनम्रता से कॉफ़ी माँग सकते हैं।" },
  ru: { hook: "Утро понедельника. Шордич. Сначала кофе.", n1: "Я бы хотел кофе, пожалуйста.", n2: "Я бы хотел два кофе, пожалуйста.", n3: "Можно мне чай?", explain: "I want — прямо. I'd like — вежливо.", polite: "Добавьте please. Звучит теплее.", practise: "Скажи со мной.", again: "Я бы хотел чай, пожалуйста.", recap: "Теперь вы можете вежливо заказать кофе." },
  tr: { hook: "Pazartesi sabahı. Shoreditch. Önce kahve.", n1: "Bir kahve istiyorum, lütfen.", n2: "İki kahve istiyorum, lütfen.", n3: "Bir çay alabilir miyim?", explain: "I want düz. I'd like kibar.", polite: "please ekle. Daha sıcak olur.", practise: "Benimle söyle.", again: "Bir çay istiyorum, lütfen.", recap: "Artık kibarca kahve sipariş edebilirsin." },
  zh: { hook: "星期一早晨。肖尔迪奇。先来杯咖啡。", n1: "我想要一杯咖啡，谢谢。", n2: "我想要两杯咖啡，谢谢。", n3: "可以给我一杯茶吗？", explain: "I want 很直接。I'd like 很礼貌。", polite: "加上 please，听起来更温暖。", practise: "跟我一起说。", again: "我想要一杯茶，谢谢。", recap: "现在你可以礼貌地点一杯咖啡了。" },
};

export function beatAt(frame: number): Beat {
  return CAFE_BEATS.find((b) => frame >= b.from && frame < b.to) ?? CAFE_BEATS[CAFE_BEATS.length - 1];
}

// ---------------------------------------------------------------- hook: the street
function HookScene({ frame }: { frame: number }) {
  const sun = springIn(frame, 0, { damping: 14, stiffness: 40, clamp: true });
  const drift = frame * 0.35;
  const rise = (i: number) => (1 - springIn(frame, 4 + i * 6, { damping: 13, stiffness: 90, clamp: true })) * 420;
  const walkX = tween(frame, 0, 138, 120, 616, EASE.inOut);
  return (
    <AbsoluteFill style={{ background: "#dbe9f3" }}>
      <Parallax frame={frame} from={0} to={150} zoom={1.07} originX={640} originY={980} layers={[
        { depth: 0, children: (
          <Stage>
            <circle cx="930" cy={470 - sun * 150} r="104" fill={SAFFRON} opacity="0.18" />
            <circle cx="930" cy={470 - sun * 150} r="84" fill={SAFFRON} />
            <g fill="#fff" opacity="0.95">
              <path transform={`translate(${120 + drift} 230)`} d="M0 40 q 0 -34 34 -34 q 14 -30 50 -16 q 30 -14 48 14 q 36 -4 36 36 Z" />
              <path transform={`translate(${560 + drift * 0.6} 330) scale(0.8)`} d="M0 40 q 0 -34 34 -34 q 14 -30 50 -16 q 30 -14 48 14 q 36 -4 36 36 Z" />
            </g>
            <Birds frame={frame} y={430} count={4} seed={9} color="#6e7ea8" speed={0.9} />
          </Stage>
        ) },
        { depth: 0.3, children: (
          <Stage>
            {[[0, 700, 150], [150, 640, 120], [270, 690, 160], [430, 620, 110], [540, 680, 150], [690, 650, 130], [820, 700, 140], [960, 660, 120]].map(([x, top, w], i) => (
              <g key={i} transform={`translate(0 ${rise(i) * 0.5})`}>
                <rect x={x} y={top} width={w} height={1100 - top} fill="#aac0d0" />
                {[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={x + 22 + c * (w / 2)} y={top + 30 + r * 70} width={w / 2 - 44} height="34" rx="4" fill="#d9e9f1" />))}
              </g>
            ))}
          </Stage>
        ) },
        { depth: 0.6, children: (
          <Stage>
            {/* left: brick */}
            <g transform={`translate(0 ${rise(1)})`}>
              <rect x="0" y="600" width="300" height="420" fill="#c47a5a" />
              <rect x="0" y="600" width="300" height="22" fill="#a9644a" />
              {[0, 1].map((r) => [0, 1].map((c) => <g key={`${r}${c}`}><rect x={40 + c * 130} y={660 + r * 150} width="90" height="110" rx="6" fill="#f3e6d3" /><rect x={40 + c * 130} y={660 + r * 150} width="90" height="110" rx="6" fill="none" stroke="#8d5240" strokeWidth="8" /><line x1={85 + c * 130} y1={660 + r * 150} x2={85 + c * 130} y2={770 + r * 150} stroke="#8d5240" strokeWidth="6" /></g>))}
            </g>
            {/* right: blue */}
            <g transform={`translate(0 ${rise(3)})`}>
              <rect x="800" y="640" width="280" height="380" fill="#3d5a80" />
              <rect x="800" y="640" width="280" height="20" fill="#2b4162" />
              {[0, 1].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={836 + c * 120} y={700 + r * 140} width="86" height="100" rx="6" fill="#d9e9f1" />))}
            </g>
            {/* centre: the cafe */}
            <g transform={`translate(0 ${rise(0)})`}>
              <rect x="300" y="560" width="500" height="460" fill={INK} />
              <rect x="300" y="560" width="500" height="18" fill="#0f1130" />
              <text x="550" y="650" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="58" letterSpacing="14" fill={PAPER}>CAFÉ</text>
              <circle cx="372" cy="632" r="12" fill={SAFFRON} /><circle cx="728" cy="632" r="12" fill={SAFFRON} />
              {/* awning */}
              <path d="M290 690 L810 690 L790 760 L310 760 Z" fill={SAFFRON} />
              {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${312 + i * 84} 690 L${354 + i * 84} 690 L${352 + i * 84} 760 L${322 + i * 84} 760 Z`} fill={PAPER} />)}
              {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${310 + i * 80} 760 Q${350 + i * 80} 790 ${390 + i * 80} 760 Z`} fill={SAFFRON} />)}
              {/* window with warm light */}
              <rect x="330" y="790" width="250" height="180" rx="10" fill="#f7e2a6" />
              <rect x="330" y="790" width="250" height="180" rx="10" fill="none" stroke="#2b2d4a" strokeWidth="10" />
              <line x1="455" y1="790" x2="455" y2="970" stroke="#2b2d4a" strokeWidth="8" />
              <g transform="translate(395 920)"><path d="M-22 -40 L22 -40 L17 0 L-17 0 Z" fill={INK} /><path d="M22 -34 Q40 -32 32 -10 L18 -10" fill="none" stroke={INK} strokeWidth="6" /></g>
              <g transform="translate(515 900)"><rect x="-20" y="-40" width="40" height="60" rx="6" fill={INK} /><path d="M-12 -46 Q0 -70 12 -46" fill="none" stroke={INK} strokeWidth="5" /></g>
              {/* door */}
              <rect x="620" y="790" width="120" height="230" rx="10" fill="#2b2d4a" />
              <rect x="640" y="810" width="80" height="110" rx="6" fill="#f7e2a6" />
              <circle cx="708" cy="950" r="7" fill={SAFFRON} />
              <rect x="640" y="834" width="80" height="26" fill="none" stroke={INK} strokeWidth="4" />
              <text x="680" y="854" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="20" letterSpacing="3" fill={INK}>OPEN</text>
            </g>
          </Stage>
        ) },
        { depth: 0.85, children: (
          <Stage>
            <rect x="0" y="1010" width="1080" height="180" fill="#d9d2c5" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <line key={i} x1={i * 130 - 20} y1="1010" x2={i * 130 + 10} y2="1190" stroke="#c8bfae" strokeWidth="4" />)}
            <rect x="0" y="1184" width="1080" height="14" fill="#bfb6a6" />
            <rect x="0" y="1198" width="1080" height="260" fill="#2b2d4a" />
            {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={40 + i * 190} y="1290" width="100" height="10" rx="5" fill={PAPER} opacity="0.5" />)}
            <g transform={`translate(0 ${rise(2) * 0.6})`}>
              <rect x="96" y="520" width="12" height="670" fill={INK} />
              <rect x="72" y="470" width="60" height="70" rx="10" fill={INK} />
              <rect x="82" y="482" width="40" height="46" rx="6" fill={SAFFRON} />
            </g>
            {/* pavement A-board */}
            <g transform={`translate(880 ${1178 + rise(4) * 0.4})`}>
              <ellipse cx="0" cy="4" rx="86" ry="11" fill={INK} opacity="0.12" />
              <path d="M-76 0 L-40 -160 L40 -160 L76 0 Z" fill={WOOD_LIGHT} />
              <path d="M-58 -16 L-32 -142 L32 -142 L58 -16 Z" fill="#2f3b37" />
              <text x="0" y="-100" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="28" fill={PAPER}>OPEN</text>
              <text x="0" y="-56" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="24" fill={SAFFRON}>Coffee</text>
            </g>
            <rect x="990" y="1120" width="34" height="70" rx="10" fill={INK} />
          </Stage>
        ) },
        { depth: 1, children: (
          <Stage>
            <Character who="you" x={walkX} y={1172} scale={0.72} facing={1} frame={frame} enter={0} walking walkSpeed={5.6} mood="happy" gaze={0.7} holding="takeaway" gesture="cup" gestureAt={0} />
          </Stage>
        ) },
      ]} />
      <KineticText frame={frame} from={14} text="Monday morning." x={80} y={140} size={94} color={INK} stagger={7} />
      <KineticText frame={frame} from={48} text="Shoreditch." x={80} y={262} size={70} color={FAINT} stagger={7} />
      <KineticText frame={frame} from={84} text="Coffee first." x={80} y={360} size={112} color={ACCENT} targets={["Coffee first."]} targetColor={ACCENT} marker={SAFFRON} markerDelay={14} stagger={7} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- notice: inside the cafe
function NoticeScene({ frame }: { frame: number }) {
  const local = frame - 150;
  const beat = local < 150 ? 0 : local < 300 ? 1 : 2;
  const bs = 150 + beat * 150;
  // the customer speaks after the barista's greeting in the first beat
  const say = beat === 0 ? 196 : bs + 22;
  const youTalks = frame > say && frame < say + 78;
  const leoTalks = frame > 154 && frame < 182;
  const leoGesture = beat === 0 ? (frame < 214 ? { g: "wave" as const, at: 152, from: "idle" as const } : { g: "serve" as const, at: 214, from: "wave" as const })
    : beat === 1 ? (frame < 366 ? { g: "point" as const, at: 312, from: "idle" as const } : { g: "serve" as const, at: 366, from: "point" as const })
    : (frame < 516 ? { g: "thumbs" as const, at: 470, from: "idle" as const } : { g: "serve" as const, at: 516, from: "thumbs" as const });
  const youGesture = beat === 0 ? { g: "raise" as const, at: 196 } : beat === 1 ? { g: "two" as const, at: 322 } : { g: "think" as const, at: 466 };
  const youMood = beat === 2 ? (frame < 545 ? "think" as const : "happy" as const) : (frame > bs + 60 ? "happy" as const : "neutral" as const);
  return (
    <AbsoluteFill style={{ background: CREAM }}>
      <Parallax frame={frame} from={150} to={600} zoom={1.09} originX={540} originY={860} layers={[
        { depth: 0, children: (
          <Stage>
            <rect width="1080" height="1440" fill={CREAM} />
            <rect x="0" y="700" width="1080" height="180" fill="#e9d8bf" />
            {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={30 + i * 176} y="724" width="140" height="134" rx="8" fill="none" stroke="#d9c4a4" strokeWidth="6" />)}
            <rect x="0" y="694" width="1080" height="12" fill={WOOD_LIGHT} />
            <WallShelf x={32} y={392} w={230} frame={frame} seed={2} plant={false} />
            <Window x={40} y={444} w={280} h={228} />
            <MenuBoard x={690} y={140} w={350} h={290} />
            <PendantLamp x={214} length={60} frame={frame} seed={0} />
            <PendantLamp x={880} length={60} frame={frame} seed={2} />
          </Stage>
        ) },
        { depth: 0.45, children: (
          <Stage>
            <Character who="leo" x={780} y={1150} scale={1.5} facing={-1} frame={frame} enter={150} slideFrom={-120} talking={leoTalks} mood="happy" gaze={0.8} gesture={leoGesture.g} gestureAt={leoGesture.at} from={leoGesture.from} />
            {/* counter */}
            <rect x="0" y="924" width="1080" height="330" fill={WOOD} />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <rect key={i} x={i * 124 - 10} y="950" width="100" height="250" rx="8" fill="none" stroke={WOOD_DARK} strokeWidth="5" opacity="0.6" />)}
            <rect x="0" y="1228" width="1080" height="26" fill={WOOD_DARK} />
            <rect x="0" y="878" width="1080" height="50" rx="6" fill={WOOD_LIGHT} />
            <rect x="0" y="878" width="1080" height="10" fill="#dcc096" />
            <Pastry x={120} y={878} />
            <Till x={480} y={878} frame={frame} total={beat === 0 ? "2.50" : beat === 1 ? "5.00" : "2.00"} />
            <Plant x={1040} y={878} scale={0.9} frame={frame} seed={5} />
            {beat === 0 ? <Cup kind="mug" x={690} y={876} frame={frame} appear={222} slideFrom={170} leave={290} seed={1} /> : null}
            {beat === 1 ? <><Cup kind="takeaway" x={650} y={876} frame={frame} appear={372} slideFrom={210} leave={440} seed={2} /><Cup kind="takeaway" x={764} y={876} frame={frame} appear={388} slideFrom={150} leave={444} seed={3} /></> : null}
            {beat === 2 ? <Cup kind="tea" x={690} y={876} frame={frame} appear={522} slideFrom={170} dunkAt={542} seed={4} /> : null}
            {beat === 1 ? <Badge frame={frame} from={404} text="2" x={598} y={716} /> : null}
            {/* floor */}
            <rect x="0" y="1254" width="1080" height="200" fill="#e4d7c4" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={(i % 2) * 140 + Math.floor(i / 2) * 280 - 140} y={1254 + (i % 2) * 70} width="140" height="70" fill="#d8c9b2" />)}
          </Stage>
        ) },
        { depth: 0.85, children: (
          <Stage>
            <Character who="you" x={300} y={1246} scale={1.55} facing={1} frame={frame} enter={158} slideFrom={-300} talking={youTalks} mood={youMood} gaze={0.8} gesture={youGesture.g} gestureAt={youGesture.at} />
          </Stage>
        ) },
      ]} />
      {/* the stop at the end of this line: a tap on the first one, then saying it */}
      <Stage><TapCue frame={frame} from={bs + 114} x={140} y={1110} kind={beat === 0 ? "tap" : "say"} size={86} /></Stage>
      <SpeechBubble text="Hi there!" x={402} y={172} w={268} from={154} until={184} frame={frame} tail="right" tailX={168} size={46} typing={false} />
      {beat === 0 ? <SpeechBubble text="I'd like a coffee, please." targets={["I'd like", "please"]} x={58} y={128} w={580} from={196} frame={frame} tail="left" tailX={188} size={50} /> : null}
      {beat === 1 ? <SpeechBubble text="I'd like two coffees, please." targets={["I'd like", "please"]} x={58} y={128} w={580} from={322} frame={frame} tail="left" tailX={188} size={50} /> : null}
      {beat === 2 ? <SpeechBubble text="Could I have a tea?" targets={["Could I have"]} x={58} y={128} w={580} from={472} frame={frame} tail="left" tailX={188} size={50} /> : null}
    </AbsoluteFill>
  );
}

// ------------------------------------------- explain, part one: direct or polite
function ExplainScene({ frame }: { frame: number }) {
  const local = frame - 600;
  const arc = tween(local, 40, 100, 0, 1, EASE.out);
  const needle = -180 + 180 * springIn(local, 126, { damping: 10, stiffness: 60 });
  const r = 190, cx = 540, cy = 1120;
  const pt = (deg: number, rad: number) => ({ x: cx + rad * Math.cos((deg * Math.PI) / 180), y: cy + rad * Math.sin((deg * Math.PI) / 180) });
  const seg = (a: number, b: number) => { const p1 = pt(a, r), p2 = pt(b, r); return `M${p1.x} ${p1.y} A${r} ${r} 0 0 1 ${p2.x} ${p2.y}`; };
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Stage>
        <defs><pattern id="dots" width="44" height="44" patternUnits="userSpaceOnUse"><circle cx="22" cy="22" r="3" fill={INK} opacity="0.08" /></pattern></defs>
        <rect width="1080" height="1440" fill="url(#dots)" />
        {/* politeness gauge */}
        <g opacity={tween(local, 34, 58)}>
          {[[180, 240, PINK], [240, 300, SAFFRON], [300, 360, SEA]].map(([a, b, c]) => <path key={c as string} d={seg(a as number, b as number)} fill="none" stroke={c as string} strokeWidth="38" strokeLinecap="butt" pathLength={100} strokeDasharray="100" strokeDashoffset={100 * (1 - arc)} />)}
          <g transform={`rotate(${needle} ${cx} ${cy})`}>
            <path d={`M${cx} ${cy - 14} L${cx + r - 30} ${cy} L${cx} ${cy + 14} Z`} fill={INK} />
          </g>
          <circle cx={cx} cy={cy} r="26" fill={INK} /><circle cx={cx} cy={cy} r="11" fill={PAPER} />
          <text x={cx - r - 10} y={cy + 56} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="42" fill={PINK}>rude</text>
          <text x={cx + r + 10} y={cy + 56} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="42" fill={SEA}>polite</text>
        </g>
        {/* two faces: the same wish, two tones */}
        <FaceChip x={760} y={292} r={62} mood="think" frame={frame} from={636} skin="#e7b998" />
        <FaceChip x={820} y={556} r={70} mood="happy" frame={frame} from={700} skin="#f1c9a5" />
        <TapCue frame={frame} from={759} x={150} y={1105} kind="tap" size={86} />
      </Stage>
      <Eyebrow text="THE SAME WISH" x={80} y={150} frame={frame} from={600} />
      <KineticText frame={frame} from={606} text="I want" x={80} y={200} width={520} size={150} color={FAINT} stagger={6} strike={{ from: 660, color: PINK }} />
      <KineticText frame={frame} from={656} text="direct · a bit rude" x={80} y={380} size={46} color={FAINT} stagger={3} weight={700} />
      <KineticText frame={frame} from={676} text="I'd like" x={80} y={470} size={170} color={ACCENT} targets={["I'd like"]} targetColor={ACCENT} marker={SAFFRON} markerDelay={16} stagger={7} />
      <KineticText frame={frame} from={708} text="soft · polite · the cafe way" x={80} y={672} size={46} color={INK} stagger={3} weight={700} />
    </AbsoluteFill>
  );
}

// ------------------------------------- explain, part two: and please makes it warm
/** One word tile of the sentence being built. */
function Tile({ frame, from, text, x, y, size, bg, fg, rot = 0 }: { frame: number; from: number; text: string; x: number; y: number; size: number; bg: string; fg: string; rot?: number }) {
  const s = springIn(frame, from, { damping: 10, stiffness: 160 });
  if (frame < from) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateY(${(1 - s) * 70}px) scale(${0.72 + 0.28 * s}) rotate(${rot}deg)`, opacity: Math.min(1, s * 2.5), transformOrigin: "20% 100%" }}>
      <div style={{ position: "absolute", inset: 0, transform: "translate(9px, 11px)", background: INK, borderRadius: 30 }} />
      <div style={{ position: "relative", background: bg, border: `6px solid ${INK}`, borderRadius: 30, padding: "12px 30px 20px", fontSize: size, fontWeight: 800, lineHeight: 1.1, color: fg, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
}

function PoliteScene({ frame }: { frame: number }) {
  const local = frame - 795;
  const spark = (i: number) => springIn(local, 80 + i * 5, { damping: 7, stiffness: 240 });
  const warm = tween(local, 92, 150, 0, 1, EASE.out);
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Stage>
        <defs><pattern id="dots2" width="44" height="44" patternUnits="userSpaceOnUse"><circle cx="22" cy="22" r="3" fill={INK} opacity="0.08" /></pattern></defs>
        <rect width="1080" height="1440" fill="url(#dots2)" />
        {/* the warmth spreading from the word to the person hearing it */}
        <circle cx={790} cy={880} r={300 * warm} fill={SAFFRON} opacity={0.16 * warm} />
        <circle cx={790} cy={880} r={190 * warm} fill={SAFFRON} opacity={0.14 * warm} />
        {/* the barista hears it and warms up */}
        <Character who="leo" x={790} y={1186} scale={0.95} facing={-1} frame={frame} enter={758} mood={local > 100 ? "happy" : "neutral"} gaze={-0.6} gesture={local < 100 ? "idle" : "serve"} gestureAt={899} from="idle" />
        <rect x="90" y="1046" width="900" height="150" rx="8" fill={WOOD} />
        <rect x="90" y="1046" width="900" height="26" rx="8" fill={WOOD_LIGHT} />
        <rect x="90" y="1190" width="900" height="16" rx="6" fill={WOOD_DARK} />
        <Cup kind="mug" x={420} y={1046} frame={frame} appear={906} slideFrom={200} seed={6} />
        <Plant x={160} y={1046} scale={0.7} frame={frame} seed={3} />
        {/* sparkles on "please." */}
        {[[742, 560, 1], [800, 512, 0.7], [790, 636, 0.6]].map(([x, y, k], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${spark(i) * (k as number)}) rotate(${local * 2})`} fill={SAFFRON}>
            <path d="M0 -26 L6 -6 L26 0 L6 6 L0 26 L-6 6 L-26 0 L-6 -6 Z" />
          </g>
        ))}
        <TapCue frame={frame} from={954} x={150} y={880} kind="tap" size={86} />
      </Stage>
      <Eyebrow text="ONE MORE WORD" x={80} y={150} frame={frame} from={796} />
      <Tile frame={frame} from={800} text="I'd like" x={80} y={204} size={104} bg="#fff" fg={ACCENT} rot={-1.5} />
      <Tile frame={frame} from={824} text="a coffee" x={300} y={372} size={92} bg="#fff" fg={INK} rot={1.5} />
      <Tile frame={frame} from={866} text="please." x={150} y={530} size={128} bg={SAFFRON} fg={INK} rot={-2} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- practise: Maya close-up
const PRACTISE_LINE = "I'd like a coffee, please.";
function PractiseScene({ frame }: { frame: number }) {
  const local = frame - 990;
  const words = PRACTISE_LINE.split(" ");
  const total = PRACTISE_LINE.length;
  let acc = 0;
  const reach = words.map((w) => { acc += w.length + 1; return 1036 + (acc / total) * 104; });
  const circle = springIn(frame, 990, { damping: 11, stiffness: 120 });
  // the mic cue springs in 24 frames before the stop, so it has arrived on the held frame
  const yourTurn = frame >= 1162;
  const mayaGesture = local < 168 ? { g: "raise" as const, at: 1008, from: "idle" as const } : { g: "point" as const, at: 1158, from: "raise" as const };
  return (
    <AbsoluteFill style={{ background: "#eef0ff" }}>
      <Stage>
        <defs><clipPath id="maya-clip"><circle cx="540" cy="460" r="310" /></clipPath></defs>
        <g transform={`translate(540 460) scale(${circle}) translate(-540 -460)`}>
          <circle cx="552" cy="474" r="310" fill={INK} />
          <circle cx="540" cy="460" r="310" fill="#fff" />
          <circle cx="540" cy="460" r="310" fill="none" stroke={SAFFRON} strokeWidth="14" />
          <g clipPath="url(#maya-clip)">
            <Character who="maya" x={540} y={1200} scale={2.05} facing={1} frame={frame} enter={994} talking={local > 14 && local < 188} mood="happy" gaze={-0.5} gesture={mayaGesture.g} gestureAt={mayaGesture.at} from={mayaGesture.from} />
          </g>
        </g>
        {/* her voice, then yours */}
        <Waveform x={540} y={1168} frame={frame} from={1012} width={620} bars={27} color={yourTurn ? SEA : ACCENT} height={yourTurn ? 110 : 76} seed={4} />
        <TapCue frame={frame} from={1162} x={150} y={250} kind="say" size={120} label="Your turn" />
      </Stage>
      <Eyebrow text="SAY IT WITH ME" x={0} y={812} align="center" frame={frame} from={1000} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 868, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 26, fontSize: 92, fontWeight: 800, lineHeight: 1.15, zIndex: 0 }}>
        {words.map((w, i) => {
          const s = springIn(frame, reach[i], { damping: 8, stiffness: 220 });
          const on = frame >= reach[i];
          const target = i === 0 || i === 1 || i === 4;
          return (
            <span key={i} style={{ position: "relative", display: "inline-block", color: on ? (target ? ACCENT : INK) : FOG, transform: `translateY(${on ? (1 - s) * -14 : 0}px) scale(${on ? 1 + (1 - s) * 0.18 : 1})`, zIndex: 0 }}>
              {w}
              {target ? <Highlight frame={frame} from={reach[i]} color={SAFFRON} /> : null}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// -------------------------------------- again: the same pattern, a new word
/** The learner says the line in a new situation. The scene shows the situation
 *  (a tea on the counter, the barista waiting) and holds the sentence open with
 *  a gap, so the learner can produce the word before the video fills it in. */
function AgainScene({ frame }: { frame: number }) {
  const pop = (from: number) => springIn(frame, from, { damping: 9, stiffness: 190 });
  const filled = frame >= 1290;
  const slot = pop(1290);
  const word = (text: string, from: number) => {
    const s = pop(from);
    return <span style={{ display: "inline-block", opacity: Math.min(1, s * 2.5), transform: `translateY(${(1 - s) * 40}px) scale(${0.7 + 0.3 * s})` }}>{text}</span>;
  };
  return (
    <AbsoluteFill style={{ background: CREAM }}>
      <Stage>
        <rect width="1080" height="1440" fill={CREAM} />
        <rect x="0" y="826" width="1080" height="200" fill="#e9d8bf" />
        <rect x="0" y="820" width="1080" height="12" fill={WOOD_LIGHT} />
        {/* the menu is the situation: the learner can see the tea on it */}
        <MenuBoard x={650} y={450} w={350} h={300} />
        <WallShelf x={80} y={508} w={250} frame={frame} seed={3} />
        <Character who="leo" x={290} y={1200} scale={1} facing={1} frame={frame} enter={1164} mood="happy" gaze={0.8} gesture="listen" gestureAt={1218} />
        <rect x="0" y="1020" width="1080" height="180" fill={WOOD} />
        <rect x="0" y="1020" width="1080" height="26" fill={WOOD_LIGHT} />
        <rect x="0" y="1190" width="1080" height="18" fill={WOOD_DARK} />
        <Cup kind="tea" x={700} y={1018} frame={frame} appear={1236} slideFrom={160} dunkAt={1272} seed={4} />
        <Plant x={1030} y={1018} scale={0.8} frame={frame} seed={7} />
        <rect x="0" y="1208" width="1080" height="240" fill="#e4d7c4" />
        <TapCue frame={frame} from={1296} x={540} y={636} kind="say" size={104} />
      </Stage>
      <Eyebrow text="NOW YOU" x={0} y={150} align="center" frame={frame} from={1206} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 296, display: "flex", alignItems: "center", justifyContent: "center", gap: 22, fontSize: 72, fontWeight: 800, color: INK }}>
        {word("I'd like", 1230)}
        <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 238, height: 108, borderRadius: 26, padding: "0 18px", opacity: Math.min(1, pop(1240) * 2.5), border: `5px dashed ${filled ? "transparent" : INK}`, background: filled ? "transparent" : "rgba(27,29,58,0.06)" }}>
          {filled
            ? <span style={{ position: "relative", display: "inline-block", color: ACCENT, transform: `scale(${0.72 + 0.28 * slot})`, zIndex: 0 }}>a tea<Highlight frame={frame} from={1298} color={SAFFRON} /></span>
            : <span style={{ color: FAINT }}>?</span>}
        </span>
        {word("please.", 1248)}
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- recap
function RecapScene({ frame }: { frame: number }) {
  const local = frame - 1350;
  const a = springIn(local, 6, { damping: 11, stiffness: 110 });
  return (
    <AbsoluteFill style={{ background: ACCENT }}>
      <Stage>
        <defs><pattern id="stripes" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="30" height="60" fill={PAPER} opacity="0.06" /></pattern></defs>
        <rect width="1080" height="1440" fill="url(#stripes)" />
        <rect x="60" y="1203" width="960" height="7" rx="4" fill={PAPER} opacity="0.3" />
        {[0, 1, 2].map((i) => <Cup key={i} kind="takeaway" x={408 + i * 132} y={1205} frame={frame} appear={1396 + i * 9} scale={0.78} slideFrom={i === 2 ? 120 : -120} seed={i} />)}
        <Character who="leo" x={150} y={1205} scale={0.85} facing={1} frame={frame} enter={1390} slideFrom={-160} mood="happy" gaze={0.6} gesture="wave" gestureAt={1400} />
        <Character who="you" x={930} y={1205} scale={0.85} facing={-1} frame={frame} enter={1396} slideFrom={160} mood="happy" gaze={0.6} gesture="thumbs" gestureAt={1408} />
        <Confetti frame={frame} from={1354} count={90} seed={11} />
      </Stage>
      {/* What the learner can now do, then the next stop on the road: the loop
          stays open on purpose. */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 210, transform: `scale(${a}) rotate(${(1 - a) * -5}deg)`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", inset: 0, transform: "translate(10px, 14px)", background: INK, borderRadius: 60 }} />
        <div style={{ position: "relative", background: "#fff", borderRadius: 60, padding: "48px 54px 54px", textAlign: "center" }}>
          <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: 6, color: FAINT }}>YOU CAN NOW</div>
          <div style={{ fontSize: 92, fontWeight: 800, color: INK, lineHeight: 1.08, margin: "14px 0 6px" }}>
            Order a coffee <span style={{ position: "relative", display: "inline-block", color: ACCENT, zIndex: 0 }}>politely<Highlight frame={frame} from={1392} color={SAFFRON} /></span>
          </div>
          <div style={{ fontSize: 62, fontWeight: 700, color: FAINT, marginTop: 14 }}>
            <span style={{ color: ACCENT }}>I&rsquo;d like</span> … a coffee … <span style={{ color: "#b07c10" }}>please.</span>
          </div>
          <div style={{ marginTop: 34, transform: `scale(${springIn(frame, 1470, { damping: 10, stiffness: 150 })})` }}>
            <span style={{ display: "inline-block", background: SAFFRON, border: `5px solid ${INK}`, borderRadius: 999, padding: "14px 34px", fontSize: 40, fontWeight: 800, color: INK }}>Tomorrow: two coffees →</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- composition
export function CafeExplainer({ l1 }: { l1?: Record<string, string> }) {
  const frame = useCurrentFrame();
  const beat = beatAt(frame);
  const progress = (frame - beat.from) / Math.max(1, Math.min(120, beat.to - beat.from));
  const k = karaoke(beat.line, Math.min(1, progress));
  const font: CSSProperties = { fontFamily: FONT };
  return (
    <AbsoluteFill style={{ ...font, background: PAPER, overflow: "hidden" }}>
      {beat.kind === "hook" ? <HookScene frame={frame} /> : null}
      {beat.kind === "notice" ? <NoticeScene frame={frame} /> : null}
      {beat.id === "explain" ? <ExplainScene frame={frame} /> : null}
      {beat.id === "polite" ? <PoliteScene frame={frame} /> : null}
      {beat.id === "practise" ? <PractiseScene frame={frame} /> : null}
      {beat.id === "again" ? <AgainScene frame={frame} /> : null}
      {beat.kind === "recap" ? <RecapScene frame={frame} /> : null}
      <Transition frame={frame} at={150} kind="wipe" color={SAFFRON} color2={INK} />
      <Transition frame={frame} at={600} kind="iris" color={PAPER} color2={ACCENT} cx={540} cy={720} />
      <Transition frame={frame} at={795} kind="wipe" duration={18} color={SAFFRON} color2={INK} />
      <Transition frame={frame} at={990} kind="slide" color={ACCENT} color2={SAFFRON} />
      {/* out of Maya's circle and back into the cafe for the new word */}
      <Transition frame={frame} at={1200} kind="iris" color={CREAM} color2={SAFFRON} cx={540} cy={460} />
      <Transition frame={frame} at={1350} kind="wipe" color={SAFFRON} color2={INK} />
      <CaptionBar line={beat.line} k={k} targets={beat.target} l1={l1?.[beat.id]} />
      <BeatProgress frame={frame} beats={CAFE_BEATS} />
    </AbsoluteFill>
  );
}
