import { ReactNode } from "react";
import { Icon } from "./Icon";
import { StatusPill } from "./ui";

export function PageHeader({
  icon,
  accent,
  glow,
  title,
  tagline,
  status,
  agent,
  right,
}: {
  icon: string;
  accent: string;
  glow: string;
  title: string;
  tagline: string;
  status?: "live" | "beta" | "next";
  agent?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b from-bg-elevated to-bg-card"
          style={{ boxShadow: `inset 0 0 0 1px rgba(${glow},0.22), inset 0 1px 0 0 rgba(255,255,255,0.05)` }}
        >
          <Icon name={icon} className={`h-[22px] w-[22px] ${accent}`} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[30px] font-bold leading-none tracking-[-0.03em] text-ink">{title}</h1>
            {status && <StatusPill status={status} />}
          </div>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">{tagline}</p>
        </div>
      </div>
      {right}
    </div>
  );
}
