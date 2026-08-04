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
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-soft"
          style={{ boxShadow: `inset 0 0 0 1px rgba(${glow},0.15)` }}
        >
          <Icon name={icon} className={`h-6 w-6 ${accent}`} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-bold tracking-tight text-ink">{title}</h1>
            {status && <StatusPill status={status} />}
          </div>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">{tagline}</p>
        </div>
      </div>
      {right}
    </div>
  );
}
