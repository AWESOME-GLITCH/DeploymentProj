"use client";

// "At the cafe": a 2D motion-graphics explainer built as a Remotion
// composition (3:4, 1080×1440, 30 fps, 52 s). The same component renders to MP4 and
// plays interactively inside the app through the Remotion Player.
// Five beats from the PRD: hook, notice, explain, practise aloud, recap.

import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CSSProperties } from "react";

export const CAFE_FPS = 30;
export const CAFE_W = 1080;
export const CAFE_H = 1440;

export type Beat = { id: string; from: number; to: number; line: string; target?: string[]; kind: "hook" | "notice" | "explain" | "practise" | "recap"; pauseAt?: number };

export const CAFE_BEATS: Beat[] = [
  { id: "hook", kind: "hook", from: 0, to: 150, line: "Monday morning. Shoreditch. Coffee first." },
  { id: "n1", kind: "notice", from: 150, to: 300, line: "I'd like a coffee, please.", target: ["I'd like", "please"] },
  { id: "n2", kind: "notice", from: 300, to: 450, line: "I'd like two coffees, please.", target: ["I'd like", "please"] },
  { id: "n3", kind: "notice", from: 450, to: 600, line: "Could I have a tea?", target: ["Could I have"] },
  { id: "explain", kind: "explain", from: 600, to: 990, line: "I'd like means I want, but polite.", target: ["I'd like"] },
  { id: "practise", kind: "practise", from: 990, to: 1350, line: "Say it with me. I'd like a coffee, please.", target: ["I'd like", "please"], pauseAt: 1200 },
  { id: "recap", kind: "recap", from: 1350, to: 1560, line: "I'd like ... please.", target: ["I'd like", "please"] },
];
export const CAFE_DURATION = 1560;

const INK = "#1b1d3a";
const ACCENT = "#3a3fc7";
const SAFFRON = "#f5b733";
const PAPER = "#fbf7f0";

export function beatAt(frame: number): Beat {
  return CAFE_BEATS.find((b) => frame >= b.from && frame < b.to) ?? CAFE_BEATS[CAFE_BEATS.length - 1];
}

/** Word-level karaoke progress for a line, by character weight. */
export function karaoke(line: string, progress: number): number {
  const words = line.split(" ");
  const total = line.length;
  let acc = 0;
  for (let i = 0; i < words.length; i++) {
    acc += words[i].length + 1;
    if (acc / total > progress) return i;
  }
  return words.length;
}

function Steam({ x, y, seed, frame }: { x: number; y: number; seed: number; frame: number }) {
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const t = ((frame + seed * 13 + i * 20) % 60) / 60;
        const yy = y - t * 90;
        const op = Math.sin(t * Math.PI) * 0.7;
        const xx = x + Math.sin(t * Math.PI * 2 + i) * 10 + (i - 1) * 18;
        return <path key={i} d={`M${xx} ${yy} q 12 -18 0 -36`} fill="none" stroke="#9a8f82" strokeWidth={6} strokeLinecap="round" opacity={op} />;
      })}
    </g>
  );
}

function Cup({ x, y, kind, appear, frame, fps }: { x: number; y: number; kind: "coffee" | "tea"; appear: number; frame: number; fps: number }) {
  const s = spring({ frame: frame - appear, fps, config: { damping: 9, stiffness: 160, mass: 0.7 } });
  if (frame < appear) return null;
  const fill = kind === "coffee" ? "#6b3f22" : "#b9823a";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} style={{ transformOrigin: `${x}px ${y}px` }}>
      <g transform="scale(2.6)">
        <path d="M-18 -40 L18 -40 L13 0 L-13 0 Z" fill="#fff" stroke="#d8cfc4" strokeWidth="2.5" />
        <path d="M-16 -26 L16 -26 L13 0 L-13 0 Z" fill={fill} />
        <path d="M18 -32 Q34 -30 26 -10 L14 -10" fill="none" stroke="#d8cfc4" strokeWidth="4" />
      </g>
      <Steam x={0} y={-110} seed={x} frame={frame} />
    </g>
  );
}

type Who = "leo" | "you" | "maya";
const SKIN: Record<Who, string> = { leo: "#f1c9a5", you: "#d9a071", maya: "#8d5524" };
const HAIR: Record<Who, string> = { leo: "#2b2118", you: "#3b2a20", maya: "#1e1a17" };
const TOP: Record<Who, string> = { leo: "#2f7f8a", you: "#f5b733", maya: "#e07a5f" };

function Person({ who, x, y, scale, facing, frame, fps, enter, talking, arm }: { who: Who; x: number; y: number; scale: number; facing: 1 | -1; frame: number; fps: number; enter: number; talking: boolean; arm: "down" | "raise" | "wave" }) {
  const s = spring({ frame: frame - enter, fps, config: { damping: 12, stiffness: 120 } });
  const bob = Math.sin(frame / 12) * 4;
  const mouth = talking ? 0.7 + Math.abs(Math.sin(frame / 2.2)) * 1.4 : 1;
  const armRot = arm === "raise" ? -115 : arm === "wave" ? -140 + Math.sin(frame / 4) * 14 : 0;
  const armSpring = spring({ frame: frame - enter - 8, fps, config: { damping: 10, stiffness: 100 } });
  if (frame < enter) return null;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${scale * s * facing} ${scale * s})`}>
      <path d="M-34 10 Q-34 -4 -18 -8 L18 -8 Q34 -4 34 10 L34 86 Q34 92 28 92 L-28 92 Q-34 92 -34 86 Z" fill={TOP[who]} />
      <line x1="-26" y1="6" x2="-40" y2="60" stroke={TOP[who]} strokeWidth="14" strokeLinecap="round" />
      <circle cx="-41" cy="64" r="8" fill={SKIN[who]} />
      <circle cx="0" cy="-38" r="28" fill={SKIN[who]} />
      {who === "maya"
        ? <path d="M-30 -42 Q-30 -74 0 -74 Q30 -74 30 -42 L30 -20 Q22 -52 0 -52 Q-22 -52 -30 -20 Z" fill={HAIR[who]} />
        : <path d="M-28 -46 Q-26 -68 0 -68 Q26 -68 28 -46 Q14 -56 0 -56 Q-14 -56 -28 -46 Z" fill={HAIR[who]} />}
      <circle cx="10" cy="-40" r="3.2" fill={INK} />
      <circle cx="-8" cy="-40" r="3.2" fill={INK} />
      <g transform={`translate(0 -26) scale(1 ${mouth}) translate(0 26)`}>
        <path d="M-6 -26 Q0 -20 8 -26" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <g transform={`rotate(${armRot * armSpring} 24 6)`}>
        <line x1="26" y1="6" x2="40" y2="60" stroke={TOP[who]} strokeWidth="14" strokeLinecap="round" />
        <circle cx="41" cy="64" r="8" fill={SKIN[who]} />
      </g>
    </g>
  );
}

function Bubble({ text, target, x, y, w, from, frame, fps, tail }: { text: string; target?: string[]; x: number; y: number; w: number; from: number; frame: number; fps: number; tail: "left" | "right" }) {
  const s = spring({ frame: frame - from, fps, config: { damping: 11, stiffness: 150 } });
  if (frame < from) return null;
  const typed = Math.min(text.length, Math.floor((frame - from - 4) * 1.6));
  const shown = text.slice(0, Math.max(0, typed));
  const parts = splitTargets(shown, target ?? []);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${s})`, transformOrigin: tail === "right" ? "100% 100%" : "0% 100%" }}>
      <div style={{ background: "#fff", border: `6px solid ${INK}`, borderRadius: 44, padding: "30px 40px", fontSize: 54, lineHeight: 1.2, fontWeight: 600, color: INK, boxShadow: "0 24px 40px -30px rgba(27,29,58,0.5)", minHeight: 80 }}>
        {parts.map((p, i) => <span key={i} style={{ color: p.hit ? ACCENT : INK, fontWeight: p.hit ? 800 : 600 }}>{p.text}</span>)}
        <span style={{ opacity: typed < text.length ? (Math.floor(frame / 8) % 2 ? 1 : 0) : 0 }}>|</span>
      </div>
      <div style={{ position: "absolute", bottom: -34, [tail === "right" ? "right" : "left"]: 80, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `40px solid ${INK}` }} />
      <div style={{ position: "absolute", bottom: -22, [tail === "right" ? "right" : "left"]: 88, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: "30px solid #fff" }} />
    </div>
  );
}

function splitTargets(text: string, targets: string[]): { text: string; hit: boolean }[] {
  if (!targets.length) return [{ text, hit: false }];
  const re = new RegExp(`(${targets.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return text.split(re).filter(Boolean).map((part) => ({ text: part, hit: targets.includes(part) }));
}

function CafeSet({ frame }: { frame: number }) {
  const sway = Math.sin(frame / 25) * 2;
  return (
    <svg viewBox="0 0 1080 1440" width={CAFE_W} height={CAFE_H} style={{ position: "absolute", inset: 0 }}>
      <rect width="1080" height="1440" fill="#f3e9dc" />
      <rect x="110" y="200" width="420" height="380" rx="28" fill="#cfe3ef" stroke="#c9a27a" strokeWidth="18" />
      <line x1="320" y1="200" x2="320" y2="580" stroke="#c9a27a" strokeWidth="14" />
      <rect x="640" y="300" width="340" height="18" fill="#b08a63" />
      <rect x="640" y="460" width="340" height="18" fill="#b08a63" />
      {[0, 1, 2].map((i) => <rect key={i} x={670 + i * 108} y="220" width="64" height="80" rx="12" fill={["#e07a5f", "#d9a441", "#5a8f5e"][i]} />)}
      {[0, 1, 2].map((i) => <circle key={i} cx={700 + i * 108} cy="430" r="30" fill="#fbf7f1" stroke="#c9bfb2" strokeWidth="5" />)}
      <g transform={`rotate(${sway} 540 0)`}>
        <line x1="540" y1="0" x2="540" y2="150" stroke={INK} strokeWidth="6" />
        <path d="M470 150 L610 150 L580 230 L500 230 Z" fill={SAFFRON} />
      </g>
      <rect x="0" y="880" width="1080" height="380" fill="#8b6b4e" />
      <rect x="0" y="856" width="1080" height="40" fill="#c9a27a" />
      <rect x="0" y="1250" width="1080" height="190" fill="#e4d7c4" />
    </svg>
  );
}

function HookScene({ frame, fps }: { frame: number; fps: number }) {
  const sun = spring({ frame, fps, config: { damping: 14, stiffness: 60 } });
  const t1 = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  const t2 = spring({ frame: frame - 60, fps, config: { damping: 12 } });
  const t3 = spring({ frame: frame - 95, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#cfe3ef 0%,#f3e9dc 70%)" }}>
      <svg viewBox="0 0 1080 1440" width={CAFE_W} height={CAFE_H} style={{ position: "absolute", inset: 0 }}>
        <circle cx="840" cy={330 - sun * 120} r="100" fill={SAFFRON} />
        {[60, 190, 330, 470, 600, 740, 880].map((x, i) => {
          const h = [320, 430, 290, 490, 380, 320, 440][i];
          const s = spring({ frame: frame - i * 5, fps, config: { damping: 14, stiffness: 90 } });
          return <rect key={x} x={x} y={1130 - h * s} width="120" height={h * s + 320} fill={["#2b4162", "#3d5a80", "#4f7cac", "#2b4162", "#3d5a80", "#4f7cac", "#2b4162"][i]} />;
        })}
        <rect x="0" y="1130" width="1080" height="310" fill="#1b1d3a" />
      </svg>
      <div style={{ position: "absolute", left: 90, top: 190, color: INK, fontWeight: 800, fontSize: 112, lineHeight: 1.02, letterSpacing: -3 }}>
        <div style={{ transform: `translateY(${(1 - t1) * 60}px)`, opacity: t1 }}>Monday</div>
        <div style={{ transform: `translateY(${(1 - t2) * 60}px)`, opacity: t2 }}>morning.</div>
        <div style={{ transform: `translateY(${(1 - t3) * 60}px)`, opacity: t3, color: ACCENT, fontSize: 76, marginTop: 24 }}>Shoreditch. Coffee first.</div>
      </div>
    </AbsoluteFill>
  );
}

function NoticeScene({ frame, fps }: { frame: number; fps: number }) {
  const local = frame - 150;
  // camera: slow push in over the three lines
  const zoom = interpolate(local, [0, 450], [1, 1.12], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const beat = local < 150 ? 0 : local < 300 ? 1 : 2;
  const beatStart = 150 + beat * 150;
  const talking = frame > beatStart + 6 && frame < beatStart + 110;
  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 60%" }}>
      <CafeSet frame={frame} />
      <svg viewBox="0 0 1080 1440" width={CAFE_W} height={CAFE_H} style={{ position: "absolute", inset: 0 }}>
        <Person who="leo" x={300} y={620} scale={3} facing={1} frame={frame} fps={fps} enter={150} talking={false} arm={local < 40 ? "wave" : "down"} />
        <Person who="you" x={820} y={650} scale={3.1} facing={-1} frame={frame} fps={fps} enter={158} talking={talking} arm={talking ? "raise" : "down"} />
        <rect x="0" y="856" width="1080" height="40" fill="#c9a27a" />
        <rect x="0" y="896" width="1080" height="364" fill="#8b6b4e" />
        {beat === 0 ? <Cup x={540} y={868} kind="coffee" appear={230} frame={frame} fps={fps} /> : null}
        {beat === 1 ? <><Cup x={470} y={868} kind="coffee" appear={385} frame={frame} fps={fps} /><Cup x={610} y={868} kind="coffee" appear={400} frame={frame} fps={fps} /></> : null}
        {beat === 2 ? <Cup x={540} y={868} kind="tea" appear={535} frame={frame} fps={fps} /> : null}
      </svg>
      {beat === 1 ? <Badge frame={frame} fps={fps} from={400} text="2" x={560} y={700} /> : null}
      {beat === 0 ? <Bubble text="I'd like a coffee, please." target={["I'd like", "please"]} x={330} y={250} w={640} from={160} frame={frame} fps={fps} tail="right" /> : null}
      {beat === 1 ? <Bubble text="I'd like two coffees, please." target={["I'd like", "please"]} x={330} y={250} w={640} from={310} frame={frame} fps={fps} tail="right" /> : null}
      {beat === 2 ? <Bubble text="Could I have a tea?" target={["Could I have"]} x={330} y={250} w={640} from={460} frame={frame} fps={fps} tail="right" /> : null}
    </AbsoluteFill>
  );
}

function Badge({ frame, fps, from, text, x, y }: { frame: number; fps: number; from: number; text: string; x: number; y: number }) {
  const s = spring({ frame: frame - from, fps, config: { damping: 8, stiffness: 200 } });
  if (frame < from) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: 110, height: 110, borderRadius: 999, background: SAFFRON, color: INK, fontWeight: 800, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})`, boxShadow: "0 20px 30px -16px rgba(0,0,0,0.4)" }}>{text}</div>;
}

function ExplainScene({ frame, fps }: { frame: number; fps: number }) {
  const local = frame - 600;
  const a = spring({ frame: local, fps, config: { damping: 12 } });
  const strike = interpolate(local, [60, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const b = spring({ frame: local - 110, fps, config: { damping: 10, stiffness: 140 } });
  const c = spring({ frame: local - 200, fps, config: { damping: 10, stiffness: 140 } });
  const dial = interpolate(local, [220, 330], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ position: "absolute", left: 80, top: 190, fontSize: 40, fontWeight: 800, letterSpacing: 6, color: "#8386a6" }}>THE SAME WISH</div>
      <div style={{ position: "absolute", left: 80, top: 250, transform: `translateX(${(1 - a) * -80}px)`, opacity: a }}>
        <div style={{ position: "relative", display: "inline-block", fontSize: 150, fontWeight: 800, color: "#8386a6", lineHeight: 1 }}>
          I want
          <div style={{ position: "absolute", left: 0, top: "52%", height: 14, width: `${strike * 100}%`, background: "#e75c94", borderRadius: 8 }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 420, fontSize: 52, fontWeight: 700, color: "#8386a6", opacity: strike }}>direct · a bit rude</div>
      <div style={{ position: "absolute", left: 80, top: 540, transform: `scale(${b})`, transformOrigin: "0 50%" }}>
        <div style={{ fontSize: 170, fontWeight: 800, color: ACCENT, lineHeight: 1 }}>I'd like</div>
        <div style={{ fontSize: 52, fontWeight: 700, color: INK, marginTop: 12, opacity: b }}>soft · polite · the cafe way</div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 820, transform: `scale(${c})`, transformOrigin: "0 50%", fontSize: 120, fontWeight: 800, color: SAFFRON, textShadow: "0 10px 0 rgba(27,29,58,0.12)" }}>+ please</div>
      {/* politeness dial */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 1060 }}>
        <div style={{ height: 26, borderRadius: 20, background: "linear-gradient(90deg,#e75c94,#f5b733,#1fb48a)" }} />
        <div style={{ position: "absolute", top: -22, left: `calc(${dial * 100}% - 35px)`, width: 70, height: 70, borderRadius: 999, background: "#fff", border: `8px solid ${INK}` }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, fontSize: 44, fontWeight: 800, color: INK }}><span>rude</span><span>polite</span></div>
      </div>
    </AbsoluteFill>
  );
}

function PractiseScene({ frame, fps }: { frame: number; fps: number }) {
  const local = frame - 990;
  const line = "I'd like a coffee, please.";
  const words = line.split(" ");
  const progress = interpolate(local, [60, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const k = karaoke(line, progress);
  const yourTurn = local >= 210;
  const pulse = 1 + Math.sin(frame / 5) * 0.06;
  return (
    <AbsoluteFill style={{ background: "#eef0ff" }}>
      <svg viewBox="0 0 1080 1440" width={CAFE_W} height={CAFE_H} style={{ position: "absolute", inset: 0 }}>
        <circle cx="540" cy="500" r="290" fill="#fff" />
        <Person who="maya" x={540} y={470} scale={4.4} facing={1} frame={frame} fps={fps} enter={990} talking={local > 8 && local < 190} arm={local > 20 && local < 120 ? "raise" : "down"} />
      </svg>
      <div style={{ position: "absolute", left: 80, right: 80, top: 850, fontSize: 44, fontWeight: 800, letterSpacing: 6, color: "#8386a6" }}>SAY IT WITH ME</div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 910, display: "flex", flexWrap: "wrap", gap: "0 24px", fontSize: 96, fontWeight: 800, lineHeight: 1.1 }}>
        {words.map((w, i) => (
          <span key={i} style={{ color: i < k ? ACCENT : "#b9bcd6", transform: i === k - 1 ? "translateY(-10px)" : "none", transition: "transform 0.1s" }}>{w}</span>
        ))}
      </div>
      {yourTurn ? (
        <div style={{ position: "absolute", left: 60, top: 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 130, height: 130, borderRadius: 999, background: SAFFRON, transform: `scale(${pulse})`, boxShadow: "0 0 0 24px rgba(245,183,51,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" /></svg>
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: INK }}>Your turn</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

function RecapScene({ frame, fps }: { frame: number; fps: number }) {
  const local = frame - 1350;
  const a = spring({ frame: local, fps, config: { damping: 12 } });
  const cups = [0, 1, 2].map((i) => spring({ frame: local - 40 - i * 12, fps, config: { damping: 9, stiffness: 160 } }));
  return (
    <AbsoluteFill style={{ background: ACCENT }}>
      <div style={{ position: "absolute", left: 80, right: 80, top: 260, transform: `scale(${a})`, transformOrigin: "50% 50%" }}>
        <div style={{ background: "#fff", borderRadius: 60, padding: "56px 60px", textAlign: "center", boxShadow: "0 40px 80px -40px rgba(0,0,0,0.5)" }}>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 6, color: "#8386a6" }}>REMEMBER</div>
          <div style={{ fontSize: 140, fontWeight: 800, color: ACCENT, lineHeight: 1.05, marginTop: 20 }}>I'd like</div>
          <div style={{ fontSize: 72, fontWeight: 700, color: "#8386a6", margin: "12px 0" }}>… a coffee …</div>
          <div style={{ fontSize: 140, fontWeight: 800, color: SAFFRON, lineHeight: 1.05 }}>please.</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center", gap: 40 }}>
        {cups.map((s, i) => (
          <svg key={i} width="140" height="140" viewBox="-40 -60 80 70" style={{ transform: `scale(${s})` }}>
            <path d="M-18 -40 L18 -40 L13 0 L-13 0 Z" fill="#fff" />
            <path d="M-16 -26 L16 -26 L13 0 L-13 0 Z" fill="#6b3f22" />
            <path d="M18 -32 Q34 -30 26 -10 L14 -10" fill="none" stroke="#fff" strokeWidth="4" />
          </svg>
        ))}
      </div>
    </AbsoluteFill>
  );
}

function Captions({ frame, l1 }: { frame: number; l1?: Record<string, string> }) {
  const beat = beatAt(frame);
  const progress = (frame - beat.from) / Math.max(1, Math.min(120, beat.to - beat.from) );
  const k = karaoke(beat.line, Math.min(1, progress));
  const words = beat.line.split(" ");
  const targets = beat.target ?? [];
  const isTarget = (w: string) => targets.some((t) => t.split(" ").includes(w.replace(/[.,?]/g, "")));
  return (
    <div style={{ position: "absolute", left: 50, right: 50, bottom: 50 }}>
      <div style={{ background: "rgba(255,255,255,0.92)", border: `4px solid ${INK}`, borderRadius: 30, padding: "20px 30px", fontSize: 44, fontWeight: 700, lineHeight: 1.25, color: INK, textAlign: "center" }}>
        {words.map((w, i) => <span key={i} style={{ color: i < k ? (isTarget(w) ? ACCENT : INK) : "#b9bcd6", marginRight: 12 }}>{w}</span>)}
      </div>
      {l1?.[beat.id] ? <div style={{ marginTop: 12, textAlign: "center", fontSize: 34, fontWeight: 600, color: INK, opacity: 0.75 }}>{l1[beat.id]}</div> : null}
    </div>
  );
}

export function CafeExplainer({ l1 }: { l1?: Record<string, string> }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = beatAt(frame);
  const fade = interpolate(frame - beat.from, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const font: CSSProperties = { fontFamily: 'var(--lp-font, "Plus Jakarta Sans"), "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' };
  return (
    <AbsoluteFill style={{ ...font, background: PAPER, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: fade }}>
        {beat.kind === "hook" ? <HookScene frame={frame} fps={fps} /> : null}
        {beat.kind === "notice" ? <NoticeScene frame={frame} fps={fps} /> : null}
        {beat.kind === "explain" ? <ExplainScene frame={frame} fps={fps} /> : null}
        {beat.kind === "practise" ? <PractiseScene frame={frame} fps={fps} /> : null}
        {beat.kind === "recap" ? <RecapScene frame={frame} fps={fps} /> : null}
      </AbsoluteFill>
      <Captions frame={frame} l1={l1} />
      {/* beat progress */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 40, display: "flex", gap: 10 }}>
        {CAFE_BEATS.map((b) => <div key={b.id} style={{ flex: b.to - b.from, height: 10, borderRadius: 6, background: frame >= b.to ? ACCENT : frame >= b.from ? `linear-gradient(90deg, ${ACCENT} ${((frame - b.from) / (b.to - b.from)) * 100}%, rgba(27,29,58,0.15) 0)` : "rgba(27,29,58,0.15)" }} />)}
      </div>
    </AbsoluteFill>
  );
}
