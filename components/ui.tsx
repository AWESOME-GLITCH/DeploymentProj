import { ReactNode } from "react";
import { Icon } from "./Icon";

export function Card({
  children,
  className = "",
  glow,
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-bg-card shadow-card ${className}`}
      style={
        glow
          ? { boxShadow: `0 0 0 1px rgba(${glow},0.14), 0 18px 50px -30px rgba(${glow},0.5)` }
          : undefined
      }
    >
      {children}
    </div>
  );
}

export function StatusPill({ status }: { status: "live" | "beta" | "next" }) {
  const map = {
    live: { label: "Live", cls: "text-accent-teal border-accent-teal/30 bg-accent-teal/10" },
    beta: { label: "Beta", cls: "text-accent-amber border-accent-amber/30 bg-accent-amber/10" },
    next: { label: "Next", cls: "text-ink-faint border-line bg-bg-hover" },
  }[status];
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${map.cls}`}>
      {map.label}
    </span>
  );
}

export function AgentChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/10 px-2.5 py-1 text-xs text-brand-soft">
      <Icon name="Sparkles" className="h-3 w-3" />
      {name}
    </span>
  );
}

export function ConfidenceBadge({ level }: { level: "high" | "medium" | "low" }) {
  const map = {
    high: { cls: "text-accent-teal bg-accent-teal/10 border-accent-teal/30", label: "High confidence" },
    medium: { cls: "text-accent-amber bg-accent-amber/10 border-accent-amber/30", label: "Medium confidence" },
    low: { cls: "text-accent-rose bg-accent-rose/10 border-accent-rose/30", label: "Low — verify" },
  }[level];
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${map.cls}`}>
      <Icon name="ShieldCheck" className="h-3 w-3" />
      {map.label}
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "subtle";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-brand text-white hover:bg-brand-soft shadow-[0_8px_30px_-12px_rgba(124,108,255,0.9)]",
    ghost: "text-ink-soft hover:text-ink hover:bg-bg-hover",
    subtle: "border border-line bg-bg-soft text-ink hover:bg-bg-hover",
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants} ${className}`}>
      {children}
    </button>
  );
}
