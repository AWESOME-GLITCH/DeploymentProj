"use client";

// Illustrated, animated concept scenes for the input phase. Flat vector
// characters and settings drawn in SVG, animated with CSS: one idea per shot,
// a face on screen in every shot, the target language on screen in the accent
// colour and nothing else as text. Animation handles quantity, availability,
// time and word order, as the PRD asks.

import type { ReactNode } from "react";

export type Pose = "idle" | "talk" | "order" | "wave" | "sorry" | "point" | "hold";
export type Who = "leo" | "you" | "arjun" | "fatima" | "sami" | "yusuf" | "maya" | "elena";

export type SceneSpec =
  | { type: "cafe"; cups?: { kind: "coffee" | "tea" | "water" | "latte"; n: number; large?: boolean }; empty?: boolean; bubble?: { who: "left" | "right"; text: string; tone?: "sorry" }; left?: Pose; right?: Pose; leftWho?: Who; rightWho?: Who; label?: string }
  | { type: "metro"; sign: string; stress?: { word: string; syllables: string[]; stressed: number }[]; train?: boolean; bubble?: string; pose?: Pose }
  | { type: "shop"; who: Who; facts: { icon: "wave" | "pin" | "shop" | "tea" | "work"; text: string }[]; show: number; bubble?: string }
  | { type: "flat"; who: Who; letter?: { title: string; lines: string[]; highlight: number[] }; bubble?: string; pose?: Pose }
  | { type: "timeline"; who: Who; position: "past" | "present" | "future" | "all"; verb: string; label: string }
  | { type: "chat"; bubbles: { who: "me" | "them"; text: string }[] }
  | { type: "title"; text: string; setting: "cafe" | "metro" | "flat" | "shop" | "city" };

const SKIN: Record<Who, string> = { leo: "#f1c9a5", you: "#d9a071", arjun: "#b9794f", fatima: "#e2b58f", sami: "#c68642", yusuf: "#c9906a", maya: "#8d5524", elena: "#f3d2b8" };
const HAIR: Record<Who, string> = { leo: "#2b2118", you: "#3b2a20", arjun: "#1e1a17", fatima: "#1e1a17", sami: "#2b2118", yusuf: "#1e1a17", maya: "#1e1a17", elena: "#6b3f22" };
const TOP: Record<Who, string> = { leo: "#2f7f8a", you: "#d9a441", arjun: "#2b4162", fatima: "#5a8f5e", sami: "#e07a5f", yusuf: "#3d5a80", maya: "#c3533e", elena: "#4f7cac" };
const NAME: Record<Who, string> = { leo: "Leo", you: "You", arjun: "Arjun", fatima: "Fatima", sami: "Sami", yusuf: "Yusuf", maya: "Maya", elena: "Elena" };

/** A flat vector person. Facing: 1 looks right, -1 looks left. */
function Person({ who, x, y, scale = 1, facing = 1, pose = "idle", talking = false }: { who: Who; x: number; y: number; scale?: number; facing?: 1 | -1; pose?: Pose; talking?: boolean }) {
  const hijab = who === "fatima";
  const glasses = who === "yusuf" || who === "sami";
  const beard = who === "arjun" || who === "yusuf";
  const armClass = pose === "order" || pose === "point" ? "lp-arm-raise" : pose === "wave" ? "lp-arm-wave" : pose === "sorry" ? "lp-arm-sorry" : pose === "hold" ? "lp-arm-hold" : "";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`} className={`lp-person ${talking || pose === "talk" ? "lp-talking" : ""}`}>
      {/* body */}
      <path d="M-34 10 Q-34 -4 -18 -8 L18 -8 Q34 -4 34 10 L34 86 Q34 92 28 92 L-28 92 Q-34 92 -34 86 Z" fill={TOP[who]} />
      {hijab ? <path d="M-40 92 L40 92 L34 0 Q0 -16 -34 0 Z" fill="#8a6fa0" opacity="0" /> : null}
      {/* back arm */}
      <line x1="-26" y1="6" x2="-40" y2="60" stroke={TOP[who]} strokeWidth="14" strokeLinecap="round" />
      <circle cx="-41" cy="64" r="8" fill={SKIN[who]} />
      {/* head */}
      {hijab ? <path d="M-36 -22 Q-36 -74 0 -74 Q36 -74 36 -22 L36 6 Q0 18 -36 6 Z" fill="#2f7f8a" /> : null}
      <circle cx="0" cy="-38" r="28" fill={SKIN[who]} />
      {!hijab ? (who === "leo" || who === "maya" || who === "elena"
        ? <path d="M-30 -42 Q-30 -70 0 -70 Q30 -70 30 -42 L30 -30 Q22 -52 0 -52 Q-22 -52 -30 -30 Z" fill={HAIR[who]} />
        : <path d="M-28 -46 Q-26 -68 0 -68 Q26 -68 28 -46 Q14 -56 0 -56 Q-14 -56 -28 -46 Z" fill={HAIR[who]} />) : null}
      {hijab ? <path d="M-28 -44 Q-28 -70 0 -70 Q28 -70 28 -44 L28 -34 Q16 -56 0 -56 Q-16 -56 -28 -34 Z" fill="#2f7f8a" /> : null}
      {beard ? <path d="M-20 -30 Q0 -8 20 -30 L20 -24 Q0 -2 -20 -24 Z" fill={HAIR[who]} opacity="0.85" /> : null}
      {/* eyes */}
      <circle cx="10" cy="-40" r="3" fill="#1e1a17" />
      <circle cx="-8" cy="-40" r="3" fill="#1e1a17" />
      {glasses ? <g fill="none" stroke="#1e1a17" strokeWidth="2"><circle cx="10" cy="-40" r="8" /><circle cx="-8" cy="-40" r="8" /><line x1="2" y1="-40" x2="-0" y2="-40" /></g> : null}
      {/* mouth */}
      <path className="lp-mouth" d="M-6 -26 Q0 -20 8 -26" fill="none" stroke="#1e1a17" strokeWidth="2.5" strokeLinecap="round" />
      {/* front arm */}
      <g className={armClass} style={{ transformOrigin: "24px 6px" }}>
        <line x1="26" y1="6" x2="40" y2="60" stroke={TOP[who]} strokeWidth="14" strokeLinecap="round" />
        <circle cx="41" cy="64" r="8" fill={SKIN[who]} />
      </g>
    </g>
  );
}

function Cup({ x, y, kind, large, delay }: { x: number; y: number; kind: "coffee" | "tea" | "water" | "latte"; large?: boolean; delay: number }) {
  const s = large ? 1.3 : 1;
  const fill = kind === "coffee" ? "#6b3f22" : kind === "tea" ? "#b9823a" : kind === "latte" ? "#e9d6bf" : "#8fd0ef";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}><g className="lp-anim-pop" style={{ animationDelay: `${delay}s`, transformBox: "fill-box", transformOrigin: "50% 100%" }}>
      {kind === "water" ? (
        <g><path d="M-12 -40 L12 -40 L9 0 L-9 0 Z" fill="#dff2fb" stroke="#9fb6c2" strokeWidth="2" /><path d="M-10 -22 L10 -22 L9 0 L-9 0 Z" fill={fill} /></g>
      ) : (
        <g>
          <path d="M-16 -34 L16 -34 L12 0 L-12 0 Z" fill="#fbf7f1" stroke="#c9bfb2" strokeWidth="2" />
          <path d="M-14 -22 L14 -22 L12 0 L-12 0 Z" fill={fill} />
          <path d="M16 -28 Q30 -26 24 -10 L13 -10" fill="none" stroke="#c9bfb2" strokeWidth="3" />
          <g className="lp-steam" stroke="#b8b0a4" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M-6 -40 q4 -8 0 -14" /><path d="M4 -42 q4 -8 0 -14" />
          </g>
        </g>
      )}
    </g></g>
  );
}

function MilkCarton({ x, y, empty }: { x: number; y: number; empty: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}><g className={empty ? "lp-carton-tip" : "lp-anim-pop"} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
      <path d="M-14 -50 L14 -50 L14 0 L-14 0 Z" fill="#f4efe6" stroke="#c9bfb2" strokeWidth="2" />
      <path d="M-14 -50 L0 -62 L14 -50 Z" fill="#e9e2d6" stroke="#c9bfb2" strokeWidth="2" />
      <rect x="-14" y="-32" width="28" height="12" fill="#8fb98f" />
      <text x="0" y="-23" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily="system-ui, sans-serif">OAT</text>
      {empty ? <g className="lp-anim-pop" style={{ animationDelay: "0.5s" }}><circle cx="18" cy="-54" r="11" fill="#e07a5f" /><path d="M14 -58 L22 -50 M22 -58 L14 -50" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /></g> : null}
    </g></g>
  );
}

function CafeSet({ children }: { children: ReactNode }) {
  return (
    <g>
      <rect x="0" y="0" width="360" height="640" fill="#f3e9dc" />
      {/* window */}
      <rect x="40" y="60" width="140" height="150" rx="10" fill="#cfe3ef" />
      <rect x="40" y="60" width="140" height="150" rx="10" fill="none" stroke="#c9a27a" strokeWidth="6" />
      <line x1="110" y1="60" x2="110" y2="210" stroke="#c9a27a" strokeWidth="5" />
      {/* shelves */}
      <rect x="210" y="90" width="120" height="6" fill="#b08a63" />
      <rect x="210" y="150" width="120" height="6" fill="#b08a63" />
      {[0, 1, 2].map((i) => <rect key={i} x={220 + i * 36} y="64" width="22" height="26" rx="4" fill={["#e07a5f", "#d9a441", "#5a8f5e"][i]} />)}
      {[0, 1, 2].map((i) => <rect key={i} x={222 + i * 36} y="128" width="20" height="22" rx="10" fill="#fbf7f1" stroke="#c9bfb2" strokeWidth="2" />)}
      {/* lamp */}
      <line x1="180" y1="0" x2="180" y2="40" stroke="#2b2118" strokeWidth="2" />
      <path d="M160 40 L200 40 L190 64 L170 64 Z" fill="#d9a441" />
      {/* counter */}
      <rect x="0" y="380" width="360" height="180" fill="#8b6b4e" />
      <rect x="0" y="368" width="360" height="18" fill="#c9a27a" />
      <rect x="0" y="560" width="360" height="80" fill="#e4d7c4" />
      {children}
    </g>
  );
}

function MetroSet({ sign, train, children }: { sign: string; train?: boolean; children: ReactNode }) {
  return (
    <g>
      <rect x="0" y="0" width="360" height="640" fill="#e8eef2" />
      {Array.from({ length: 9 }).map((_, r) => Array.from({ length: 7 }).map((__, c) => <rect key={`${r}-${c}`} x={c * 52 + (r % 2 ? 26 : 0) - 26} y={r * 40} width="50" height="38" fill={r % 3 === 0 ? "#dfe6ea" : "#e8eef2"} stroke="#d2dae0" strokeWidth="1" />))}
      {/* sign */}
      <g className="lp-anim-rise">
        <rect x="90" y="46" width="180" height="70" rx="12" fill="#1f2b3d" />
        <text x="180" y="78" textAnchor="middle" fontSize="16" fill="#cfd8e2" fontFamily="system-ui, sans-serif" letterSpacing="2">PLATFORM</text>
        <text key={sign} x="180" y="106" textAnchor="middle" fontSize="28" fontWeight="800" fill="#f3cc5a" fontFamily="system-ui, sans-serif" className="lp-sign-flip">{sign}</text>
      </g>
      {/* track and platform edge */}
      <rect x="0" y="470" width="360" height="170" fill="#9aa5ad" />
      <rect x="0" y="470" width="360" height="12" fill="#d4a943" />
      {train ? (
        <g className="lp-train">
          <rect x="-10" y="300" width="380" height="150" rx="22" fill="#c9ced3" />
          <rect x="-10" y="330" width="380" height="14" fill="#d4a943" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={20 + i * 90} y="318" width="60" height="50" rx="8" fill="#2b4162" opacity="0.85" />)}
          <rect x="-10" y="430" width="380" height="20" fill="#8c9399" />
        </g>
      ) : <rect x="0" y="380" width="360" height="90" fill="#bfc8cf" />}
      {children}
    </g>
  );
}

function ShopSet({ children }: { children: ReactNode }) {
  return (
    <g>
      <rect x="0" y="0" width="360" height="640" fill="#fbf4ea" />
      <rect x="20" y="40" width="320" height="56" rx="10" fill="#5a8f5e" />
      <text x="180" y="76" textAnchor="middle" fontSize="20" fontWeight="800" fill="#fff" fontFamily="system-ui, sans-serif" letterSpacing="3">FATIMA'S SHOP</text>
      {[0, 1, 2].map((r) => <g key={r}><rect x="30" y={140 + r * 70} width="300" height="8" fill="#c9a27a" />{[0, 1, 2, 3, 4].map((c) => <rect key={c} x={44 + c * 58} y={108 + r * 70} width="38" height="32" rx="6" fill={["#e07a5f", "#d9a441", "#2f7f8a", "#5a8f5e", "#c3533e"][(c + r) % 5]} />)}</g>)}
      <rect x="0" y="420" width="360" height="220" fill="#e4d7c4" />
      <rect x="0" y="408" width="360" height="16" fill="#c9a27a" />
      {children}
    </g>
  );
}

function FlatSet({ children }: { children: ReactNode }) {
  return (
    <g>
      <rect x="0" y="0" width="360" height="640" fill="#eef0e9" />
      <rect x="0" y="440" width="360" height="200" fill="#d7cdbb" />
      <rect x="30" y="80" width="110" height="140" rx="8" fill="#cfe3ef" stroke="#f8f8f6" strokeWidth="8" />
      <rect x="200" y="300" width="150" height="150" rx="14" fill="#4f7cac" />
      <rect x="190" y="360" width="170" height="90" rx="14" fill="#3d5a80" />
      <line x1="300" y1="80" x2="300" y2="300" stroke="#2b2118" strokeWidth="3" />
      <path d="M270 80 L330 80 L320 120 L280 120 Z" fill="#d9a441" />
      {children}
    </g>
  );
}

function Bubble({ x, y, w, text, tail, tone }: { x: number; y: number; w: number; text: string; tail: "left" | "right"; tone?: "sorry" }) {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const wd of words) { if ((cur + " " + wd).trim().length > Math.floor(w / 10.5)) { lines.push(cur.trim()); cur = wd; } else cur += " " + wd; }
  if (cur.trim()) lines.push(cur.trim());
  const h = 22 + lines.length * 24;
  const targets = /I'd like|Could I have|instead|out of|please|That's fine|Do you have/;
  return (
    <g transform={`translate(${x} ${y})`}><g className="lp-anim-pop" style={{ transformBox: "fill-box", transformOrigin: tail === "left" ? "0% 100%" : "100% 100%", animationDelay: "0.2s" }}>
      <rect x="0" y="0" width={w} height={h} rx="16" fill="#fff" stroke={tone === "sorry" ? "#d9a441" : "#1e1a17"} strokeWidth="2.5" />
      {tail === "left" ? <path d={`M18 ${h} L10 ${h + 14} L34 ${h}`} fill="#fff" stroke="#1e1a17" strokeWidth="2.5" strokeLinejoin="round" /> : <path d={`M${w - 34} ${h} L${w - 10} ${h + 14} L${w - 18} ${h}`} fill="#fff" stroke="#1e1a17" strokeWidth="2.5" strokeLinejoin="round" />}
      <rect x={tail === "left" ? 12 : w - 32} y={h - 3} width="20" height="6" fill="#fff" />
      {lines.map((l, i) => (
        <text key={i} x="14" y={30 + i * 24} fontSize="18" fontWeight="600" fontFamily="system-ui, sans-serif" fill="#1e1a17">
          {l.split(/(I'd like|Could I have|instead|out of|please|That's fine|Do you have)/).map((part, j) => <tspan key={j} fill={targets.test(part) ? "#1f3ae6" : "#1e1a17"} fontWeight={targets.test(part) ? 800 : 600}>{part}</tspan>)}
        </text>
      ))}
    </g></g>
  );
}

function Stage({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="lp-stage">
      <svg viewBox="0 0 360 560" preserveAspectRatio="xMidYMax slice" className="lp-stage-svg" aria-hidden="true">{children}</svg>
      {label ? <div className="lp-stage-label">{label}</div> : null}
    </div>
  );
}

export function Scene({ spec, talking }: { spec?: SceneSpec; talking?: boolean }) {
  if (!spec) return <div className="lp-stage" />;
  switch (spec.type) {
    case "cafe": {
      const lw = spec.leftWho ?? "leo";
      const rw = spec.rightWho ?? "you";
      const speakingLeft = spec.bubble?.who === "left";
      return (
        <Stage label={spec.label}>
          <CafeSet>
            <Person who={lw} x={92} y={300} scale={1.1} facing={1} pose={spec.left ?? (speakingLeft ? "talk" : "idle")} talking={!!talking && speakingLeft} />
            <Person who={rw} x={272} y={320} scale={1.15} facing={-1} pose={spec.right ?? (spec.bubble && !speakingLeft ? "order" : "idle")} talking={!!talking && !!spec.bubble && !speakingLeft} />
            {/* counter top layer so people stand behind it */}
            <rect x="0" y="368" width="360" height="18" fill="#c9a27a" />
            <rect x="0" y="386" width="360" height="174" fill="#8b6b4e" />
            {spec.cups ? Array.from({ length: Math.min(5, spec.cups.n) }).map((_, i) => <Cup key={i} x={180 + (i - (Math.min(5, spec.cups!.n) - 1) / 2) * (spec.cups!.large ? 50 : 40)} y={372} kind={spec.cups!.kind} large={spec.cups!.large} delay={0.3 + i * 0.3} />) : null}
            {spec.empty ? <MilkCarton x={180} y={372} empty /> : null}
            {spec.bubble ? <Bubble x={spec.bubble.who === "left" ? 24 : 110} y={70} w={226} text={spec.bubble.text} tail={spec.bubble.who} tone={spec.bubble.tone} /> : null}
          </CafeSet>
        </Stage>
      );
    }
    case "metro":
      return (
        <Stage>
          <MetroSet sign={spec.sign} train={spec.train}>
            <Person who="arjun" x={110} y={340} scale={1.1} facing={1} pose={spec.pose ?? (spec.bubble ? "talk" : spec.train ? "point" : "idle")} talking={!!talking} />
            {spec.stress ? (
              <g transform="translate(200 220)">
                {spec.stress.map((w, wi) => (
                  <g key={w.word} transform={`translate(${wi * 80} 0)`}>
                    {w.syllables.map((s, i) => {
                      const stressed = i === w.stressed;
                      return (
                        <g key={i} transform={`translate(${i * 36} 0)`}>
                          <rect className="lp-stress-bar-svg" x="-12" y={stressed ? -80 : -36} width="26" height={stressed ? 80 : 36} rx="6" fill={stressed ? "#1f3ae6" : "#aab6c0"} style={{ animationDelay: `${wi * 0.5 + i * 0.15}s`, transformBox: "fill-box", transformOrigin: "50% 100%" }} />
                          <text x="1" y="24" textAnchor="middle" fontSize={stressed ? 20 : 14} fontWeight={stressed ? 800 : 600} fill={stressed ? "#1f3ae6" : "#1e1a17"} fontFamily="system-ui, sans-serif">{s}</text>
                        </g>
                      );
                    })}
                  </g>
                ))}
              </g>
            ) : null}
            {spec.bubble ? <Bubble x={120} y={140} w={216} text={spec.bubble} tail="left" /> : null}
          </MetroSet>
        </Stage>
      );
    case "shop":
      return (
        <Stage>
          <ShopSet>
            <Person who={spec.who} x={110} y={330} scale={1.25} facing={1} pose={spec.show >= 1 ? "wave" : "idle"} talking={!!talking} />
            <rect x="0" y="408" width="360" height="16" fill="#c9a27a" />
            <rect x="0" y="424" width="360" height="216" fill="#e4d7c4" />
            {spec.facts.slice(0, spec.show).map((f, i) => (
              <g key={i} transform={`translate(190 ${160 + i * 54})`}><g className="lp-anim-rise" style={{ animationDelay: `${0.25 + i * 0.3}s` }}>
                <rect x="0" y="0" width="156" height="42" rx="12" fill="#fff" stroke="#1e1a17" strokeWidth="2" />
                <text x="12" y="27" fontSize="15" fontWeight="700" fill="#1e1a17" fontFamily="system-ui, sans-serif">{f.text}</text>
              </g></g>
            ))}
            {spec.bubble ? <Bubble x={120} y={100} w={216} text={spec.bubble} tail="left" /> : null}
          </ShopSet>
        </Stage>
      );
    case "flat":
      return (
        <Stage>
          <FlatSet>
            <Person who={spec.who} x={110} y={330} scale={1.2} facing={1} pose={spec.pose ?? "hold"} talking={!!talking} />
            {spec.letter ? (
              <g transform="translate(176 150)"><g className="lp-anim-rise">
                <rect x="0" y="0" width="166" height="190" rx="8" fill="#fff" stroke="#1e1a17" strokeWidth="2" />
                <text x="14" y="30" fontSize="12" fontWeight="800" letterSpacing="2" fill="#6f757c" fontFamily="system-ui, sans-serif">{spec.letter.title}</text>
                {spec.letter.lines.map((l, i) => {
                  const hi = spec.letter!.highlight.includes(i);
                  return (
                    <g key={i} transform={`translate(10 ${48 + i * 44})`}>
                      {hi ? <rect x="0" y="-6" width="146" height="34" rx="6" fill="#e3e8ff" className="lp-anim-pop" style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }} /> : null}
                      <text x="6" y="17" fontSize="15" fontWeight={hi ? 800 : 600} fill={hi ? "#1f3ae6" : "#1e1a17"} fontFamily="system-ui, sans-serif">{l}</text>
                    </g>
                  );
                })}
              </g></g>
            ) : null}
            {spec.bubble ? <Bubble x={120} y={60} w={216} text={spec.bubble} tail="left" /> : null}
          </FlatSet>
        </Stage>
      );
    case "timeline": {
      const px = spec.position === "past" ? 60 : spec.position === "future" ? 300 : 180;
      return (
        <Stage>
          <rect x="0" y="0" width="360" height="640" fill="#eef3f0" />
          <Person who={spec.who} x={180} y={420} scale={1.2} facing={1} pose="point" talking={!!talking} />
          <g transform="translate(0 200)">
            <line x1="40" y1="0" x2="320" y2="0" stroke="#1e1a17" strokeWidth="4" strokeLinecap="round" />
            {[["past", 60, "yesterday"], ["present", 180, "today"], ["future", 300, "tomorrow"]].map(([k, x, l]) => (
              <g key={String(k)} opacity={spec.position === "all" || spec.position === k ? 1 : 0.4}>
                <circle cx={Number(x)} cy="0" r="12" fill="#fff" stroke="#1e1a17" strokeWidth="3" />
                <text x={Number(x)} y="36" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e1a17" fontFamily="system-ui, sans-serif">{String(l)}</text>
              </g>
            ))}
            {spec.position !== "all" ? <circle cx={px} cy="0" r="14" fill="#1f3ae6" className="lp-marker-slide" style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }} /> : null}
          </g>
          <g transform="translate(180 120)"><g className="lp-anim-rise">
            <text x="0" y="0" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1e1a17" fontFamily="system-ui, sans-serif">{spec.label ? `${spec.label} I` : ""} <tspan fill="#1f3ae6" fontWeight="800">{spec.verb}</tspan></text>
          </g></g>
        </Stage>
      );
    }
    case "chat":
      return (
        <Stage>
          <FlatSet>
            <Person who="elena" x={90} y={360} scale={1.1} facing={1} pose="hold" talking={!!talking} />
            <g transform="translate(150 90)">
              <rect x="0" y="0" width="190" height="330" rx="26" fill="#1e1a17" />
              <rect x="8" y="8" width="174" height="314" rx="20" fill="#fff" />
              {spec.bubbles.map((b, i) => (
                <g key={i} transform={`translate(${b.who === "me" ? 40 : 18} ${40 + i * 62})`}><g className="lp-anim-rise" style={{ animationDelay: `${0.2 + i * 0.7}s` }}>
                  <rect x="0" y="0" width="134" height="46" rx="14" fill={b.who === "me" ? "#e3e8ff" : "#eeeae2"} />
                  <text x="10" y="28" fontSize="14" fontWeight="700" fill="#1e1a17" fontFamily="system-ui, sans-serif">{b.text}</text>
                </g></g>
              ))}
            </g>
          </FlatSet>
        </Stage>
      );
    case "title":
      return (
        <Stage>
          {spec.setting === "cafe" ? <CafeSet><Person who="leo" x={92} y={300} scale={1.1} pose="idle" /><rect x="0" y="368" width="360" height="18" fill="#c9a27a" /><rect x="0" y="386" width="360" height="174" fill="#8b6b4e" /></CafeSet>
            : spec.setting === "metro" ? <MetroSet sign="14"><Person who="arjun" x={110} y={340} scale={1.1} pose="idle" /></MetroSet>
            : spec.setting === "shop" ? <ShopSet><Person who="fatima" x={110} y={330} scale={1.25} pose="idle" /></ShopSet>
            : spec.setting === "flat" ? <FlatSet><Person who="sami" x={110} y={330} scale={1.2} pose="hold" /></FlatSet>
            : <g><rect x="0" y="0" width="360" height="640" fill="#cfe3ef" />{[40, 110, 180, 250, 300].map((x, i) => <rect key={x} x={x} y={200 + (i % 2) * 60} width="50" height={440 - (i % 2) * 60} fill={["#2b4162", "#3d5a80", "#4f7cac", "#2b4162", "#3d5a80"][i]} />)}<circle cx="300" cy="90" r="30" fill="#d9a441" /></g>}
          <g className="lp-anim-rise">
            <rect x="30" y="250" width="300" height="100" rx="18" fill="#fff" stroke="#1e1a17" strokeWidth="2.5" />
            <text x="180" y="310" textAnchor="middle" fontSize="24" fontWeight="800" fill="#1e1a17" fontFamily="system-ui, sans-serif">{spec.text}</text>
          </g>
        </Stage>
      );
  }
}

const FATIMA_FACTS: { icon: "wave" | "pin" | "shop" | "tea"; text: string }[] = [{ icon: "wave", text: "I'm Fatima." }, { icon: "pin", text: "I live in Dubai." }, { icon: "shop", text: "I work in a shop." }, { icon: "tea", text: "I like tea." }];
const BILL = { title: "GAS BILL", lines: ["Pay by 30 May", "Pay online or at the shop", "Reference 4471"] };

/** Storyboards: one scene per caption line of each video atom. */
export const SCENES: Record<string, SceneSpec[]> = {
  "ATM-A2-INT-0001": [
    { type: "title", text: "Monday morning, Shoreditch", setting: "cafe" },
    { type: "cafe", cups: { kind: "coffee", n: 1 }, bubble: { who: "right", text: "I'd like a coffee, please." } },
    { type: "cafe", cups: { kind: "coffee", n: 2 }, bubble: { who: "right", text: "I'd like two coffees, please." } },
    { type: "cafe", cups: { kind: "tea", n: 1 }, bubble: { who: "right", text: "Could I have a tea?" } },
    { type: "cafe", bubble: { who: "left", text: "I'd like = I want, but polite." }, left: "talk" },
    { type: "cafe", cups: { kind: "coffee", n: 1 }, bubble: { who: "right", text: "I'd like a coffee, please." } },
    { type: "cafe", cups: { kind: "coffee", n: 1 }, bubble: { who: "left", text: "I'd like ... please." }, left: "hold" },
  ],
  "ATM-A2-LST-0004": [
    { type: "title", text: "Dubai Metro, Friday evening", setting: "metro" },
    { type: "metro", sign: "14", stress: [{ word: "fourteen", syllables: ["four", "TEEN"], stressed: 1 }], train: true },
    { type: "metro", sign: "4", stress: [{ word: "four", syllables: ["FOUR"], stressed: 0 }] },
    { type: "metro", sign: "40", stress: [{ word: "forty", syllables: ["FOR", "ty"], stressed: 0 }] },
    { type: "metro", sign: "14 · 40", stress: [{ word: "fourteen", syllables: ["four", "TEEN"], stressed: 1 }, { word: "forty", syllables: ["FOR", "ty"], stressed: 0 }] },
    { type: "metro", sign: "14 · 40", bubble: "Fourteen. Forty.", stress: [{ word: "fourteen", syllables: ["four", "TEEN"], stressed: 1 }, { word: "forty", syllables: ["FOR", "ty"], stressed: 0 }] },
    { type: "metro", sign: "13 · 30", stress: [{ word: "thirteen", syllables: ["thir", "TEEN"], stressed: 1 }, { word: "thirty", syllables: ["THIR", "ty"], stressed: 0 }] },
  ],
  "ATM-A1-SPK-0005": [
    { type: "shop", who: "fatima", facts: FATIMA_FACTS, show: 1, bubble: "Hello. I'm Fatima." },
    { type: "shop", who: "fatima", facts: FATIMA_FACTS, show: 2, bubble: "I live in Dubai." },
    { type: "shop", who: "fatima", facts: FATIMA_FACTS, show: 3, bubble: "I work in a shop." },
    { type: "shop", who: "fatima", facts: FATIMA_FACTS, show: 4, bubble: "I like tea. I don't like coffee." },
    { type: "shop", who: "fatima", facts: FATIMA_FACTS, show: 3 },
    { type: "shop", who: "fatima", facts: [{ icon: "pin", text: "I live in ..." }, { icon: "work", text: "I work in ..." }], show: 2, bubble: "Say it with me." },
    { type: "shop", who: "fatima", facts: [{ icon: "wave", text: "I'm ..." }, { icon: "pin", text: "I live in ..." }, { icon: "work", text: "I work in ..." }], show: 3 },
  ],
  "ATM-A2-MED-0008": [
    { type: "flat", who: "sami", letter: { ...BILL, highlight: [] }, bubble: "What does it say?" },
    { type: "flat", who: "sami", letter: { ...BILL, highlight: [] }, bubble: "This is your gas bill." },
    { type: "flat", who: "sami", letter: { ...BILL, highlight: [0] } },
    { type: "flat", who: "sami", letter: { ...BILL, highlight: [1] } },
    { type: "flat", who: "sami", letter: { ...BILL, highlight: [2] } },
    { type: "flat", who: "sami", letter: { ...BILL, highlight: [0, 1, 2] }, bubble: "When. How. The number." },
    { type: "flat", who: "sami", letter: { ...BILL, highlight: [0, 1, 2] } },
  ],
  "ATM-A2-INT-0009": [
    { type: "cafe", cups: { kind: "latte", n: 1 }, bubble: { who: "right", text: "A latte with oat milk, please." } },
    { type: "cafe", empty: true, bubble: { who: "left", text: "Sorry, we're out of oat milk.", tone: "sorry" }, left: "sorry" },
    { type: "cafe", empty: true, bubble: { who: "right", text: "Do you have soy milk instead?" } },
    { type: "cafe", cups: { kind: "latte", n: 1 }, bubble: { who: "left", text: "Yes, we do." }, left: "hold" },
    { type: "cafe", cups: { kind: "latte", n: 1 }, bubble: { who: "right", text: "That's fine, thank you." }, right: "wave" },
    { type: "cafe", empty: true, bubble: { who: "left", text: "out of = none left. instead = in its place." }, left: "talk" },
    { type: "cafe", bubble: { who: "right", text: "Do you have soy milk instead?" } },
    { type: "cafe", cups: { kind: "latte", n: 1 }, bubble: { who: "right", text: "Do you have ... instead? That's fine." } },
  ],
  "ATM-A2-GRM-0003": [
    { type: "timeline", who: "yusuf", position: "past", verb: "worked", label: "Yesterday" },
    { type: "timeline", who: "yusuf", position: "present", verb: "work", label: "Today" },
    { type: "timeline", who: "yusuf", position: "future", verb: "will work", label: "Tomorrow" },
    { type: "timeline", who: "yusuf", position: "all", verb: "+ ed · will +", label: "" },
    { type: "timeline", who: "yusuf", position: "all", verb: "worked · work · will work", label: "" },
    { type: "timeline", who: "yusuf", position: "all", verb: "worked · work · will work", label: "" },
  ],
};

export function sceneFor(atomId: string, lineIdx: number): SceneSpec | undefined {
  return SCENES[atomId]?.[lineIdx];
}
