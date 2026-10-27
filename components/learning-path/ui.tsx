"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Volume2 } from "lucide-react";
import type { L1, Localised } from "@/lib/learning-path/types";
import { loc } from "@/lib/learning-path/i18n";
import { say as ttsSay } from "@/lib/learning-path/speech";

export type Screen = "onboarding" | "reward" | "home" | "road" | "progress" | "classmates" | "me" | "session" | "checkpoint";

export type LpCtx = {
  t: (k: string) => string;
  lang: L1; // interface language after the L1 rule
  l1: L1; // learner's own language
  rtl: boolean;
  translate: boolean; // tap-to-translate offered (B1 with English UI)
  say: (text: string, onEnd?: () => void) => void;
  speed: number;
  reduceMotion: boolean;
  go: (s: Screen) => void;
  tester: boolean;
};

export const LpContext = createContext<LpCtx | null>(null);
export function useLp(): LpCtx {
  const c = useContext(LpContext);
  if (!c) throw new Error("useLp outside provider");
  return c;
}

export function Glass({ children, className = "", style, onClick, glow }: { children: ReactNode; className?: string; style?: CSSProperties; onClick?: () => void; glow?: boolean }) {
  return (
    <div onClick={onClick} className={`lp-glass ${glow ? "lp-glass-glow" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function GlowButton({ children, onClick, disabled, secondary, className = "", size = "primary", ariaLabel, style }: { children: ReactNode; onClick?: () => void; disabled?: boolean; secondary?: boolean; className?: string; size?: "primary" | "normal"; ariaLabel?: string; style?: CSSProperties }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      style={style}
      className={`${secondary ? "lp-btn-secondary" : "lp-btn-primary"} ${size === "primary" ? "lp-btn-56" : "lp-btn-48"} ${className}`}
    >
      {children}
    </button>
  );
}

/** Text with a speaker: every word, sentence and instruction has tap-to-hear. */
export function Say({ text, children, className = "", auto, size = "body", speakText }: { text?: string; children?: ReactNode; className?: string; auto?: boolean; size?: "body" | "lesson" | "head" | "small"; speakText?: string }) {
  const { say } = useLp();
  const spoken = speakText ?? text ?? "";
  const played = useRef(false);
  useEffect(() => {
    if (auto && !played.current && spoken) { played.current = true; const id = window.setTimeout(() => say(spoken), 250); return () => window.clearTimeout(id); }
  }, [auto, spoken, say]);
  const cls = size === "lesson" ? "lp-lesson" : size === "head" ? "lp-head" : size === "small" ? "lp-small" : "lp-body";
  return (
    <span className={`inline-flex items-start gap-2 ${className}`}>
      <span className={cls}>{children ?? text}</span>
      {spoken ? (
        <button type="button" aria-label="Listen" onClick={() => say(spoken)} className="lp-speaker" >
          <Volume2 size={16} />
        </button>
      ) : null}
    </span>
  );
}

/** Localised text with optional tap-to-translate (B1 rule). */
export function LocText({ text, size = "body", className = "", auto }: { text: Localised; size?: "body" | "lesson" | "head" | "small"; className?: string; auto?: boolean }) {
  const { lang, l1, translate } = useLp();
  const [showL1, setShowL1] = useState(false);
  const main = loc(text, lang);
  const l1Text = loc(text, l1);
  return (
    <span className={`inline-block ${className}`}>
      <Say text={main} size={size} auto={auto} speakText={lang === "en" ? main : text.en} />
      {translate && l1Text !== main ? (
        <button type="button" onClick={() => setShowL1((v) => !v)} className="lp-translate">{showL1 ? l1Text : "⇄"}</button>
      ) : null}
    </span>
  );
}

/** A stop on the road: a small isometric block with three visible faces, never
 *  a flat disc or rectangle. Lives inside a parent <svg>. */
export function IsoStop({ x, y, w, h, colour, shade = true }: { x: number; y: number; w: number; h: number; colour: string; shade?: boolean }) {
  const top = `${x},${y - h} ${x + w},${y - h / 2} ${x},${y} ${x - w},${y - h / 2}`;
  const left = `${x - w},${y - h / 2} ${x},${y} ${x},${y + h} ${x - w},${y + h / 2}`;
  const right = `${x + w},${y - h / 2} ${x},${y} ${x},${y + h} ${x + w},${y + h / 2}`;
  return (
    <g>
      <polygon points={left} fill={colour} />
      <polygon points={right} fill={colour} />
      {shade ? <polygon points={left} fill="var(--lp-shade)" opacity={0.18} /> : null}
      {shade ? <polygon points={right} fill="var(--lp-shade)" opacity={0.32} /> : null}
      <polygon points={top} fill={colour} />
    </g>
  );
}

/** The tick on a stop the learner has finished. */
export function StopTick({ x, y, size = 5.5 }: { x: number; y: number; size?: number }) {
  return (
    <polyline points={`${x - size},${y - size * 1.7} ${x - size * 0.3},${y - size} ${x + size},${y - size * 2.2}`}
      fill="none" stroke="var(--lp-bg-0)" strokeWidth={size * 0.45} strokeLinecap="round" strokeLinejoin="round" />
  );
}

/** Today's ten minutes as three slices, drawn around a point. Lives inside a
 *  parent <svg> so it can sit on the road at the learner's own stop. */
export function RingArcs({ cx, cy, r, width = 7, fills, colour = "var(--lp-glow)" }: { cx: number; cy: number; r: number; width?: number; fills: [number, number, number]; colour?: string }) {
  const { reduceMotion } = useLp();
  const c = 2 * Math.PI * r;
  const gap = c * 0.07;
  const seg = (c - gap * 3) / 3;
  return (
    <g transform={`rotate(-90 ${cx} ${cy})`}>
      {fills.map((f, i) => {
        const offset = i * (seg + gap);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--lp-track)" strokeWidth={width} strokeLinecap="round" strokeDasharray={`${seg} ${c - seg}`} strokeDashoffset={-offset} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={colour} strokeWidth={width} strokeLinecap="round"
              strokeDasharray={`${Math.max(0.01, seg * Math.min(1, f))} ${c}`} strokeDashoffset={-offset} opacity={f > 0 ? 1 : 0}
              style={{ transition: reduceMotion ? "none" : "stroke-dasharray var(--lp-t-move) var(--lp-ease-emph)" }} />
          </g>
        );
      })}
    </g>
  );
}

/** Three-slice daily ring as a standalone block. fills: 0..1 per slice. */
export function Ring({ fills, size = 200, label }: { fills: [number, number, number]; size?: number; label?: ReactNode }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <RingArcs cx={size / 2} cy={size / 2} r={size / 2 - 8} width={8} fills={fills} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{label}</div>
    </div>
  );
}

/** Seven-day dot row. A lapse never resets; four sessions count as on track. */
export function DotRow({ days, today }: { days: boolean[]; today: number }) {
  return (
    <div className="flex items-center gap-2" aria-label="This week">
      {days.map((d, i) => (
        <span key={i} className={`lp-dot ${d ? "lp-dot-on" : ""} ${i === today ? "lp-dot-today" : ""}`} />
      ))}
    </div>
  );
}

export function ProgressLine({ value }: { value: number }) {
  return (
    <div className="lp-progress-line"><div style={{ width: `${Math.round(value * 100)}%` }} /></div>
  );
}

export const STRAND_COLOR: Record<string, string> = { GRM: "var(--lp-s-GRM)", RDG: "var(--lp-s-RDG)", WRT: "var(--lp-s-WRT)", LST: "var(--lp-s-LST)", SPK: "var(--lp-s-SPK)", MED: "var(--lp-s-MED)", INT: "var(--lp-s-INT)" };

export function Bar({ value, label, tint, color }: { value: number; label: string; tint?: "review"; color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="lp-small w-24 shrink-0 truncate" style={{ opacity: 0.85 }}>{label}</div>
      <div className="lp-bar flex-1"><div className={tint === "review" ? "lp-bar-review" : ""} style={{ width: `${Math.round(value * 100)}%`, background: tint === "review" ? undefined : color }} /></div>
      <div className="lp-small w-9 text-right tabular-nums" style={{ opacity: 0.7 }}>{Math.round(value * 100)}</div>
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "glow" | "good" }) {
  return <span className={`lp-pill lp-pill-${tone}`}>{children}</span>;
}

export function Avatar({ emoji, name, online }: { emoji: string; name: string; online?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`lp-avatar ${online ? "lp-avatar-online" : ""}`}>{emoji}</div>
      <div className="lp-small truncate" style={{ maxWidth: 72 }}>{name}</div>
    </div>
  );
}

export function useSpeakTts(speed: number) {
  return (text: string, onEnd?: () => void) => ttsSay(text, speed, onEnd);
}
