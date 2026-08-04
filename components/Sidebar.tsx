"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CORE_MODULES, PLANNED_MODULES } from "@/lib/modules";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

function NavItem({
  href,
  icon,
  label,
  accent,
  active,
  muted,
}: {
  href: string;
  icon: string;
  label: string;
  accent: string;
  active: boolean;
  muted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all ${
        active
          ? "bg-bg-hover text-ink shadow-[inset_0_0_0_1px_rgba(124,108,255,0.25)]"
          : muted
            ? "text-ink-faint hover:bg-bg-hover/60 hover:text-ink-soft"
            : "text-ink-soft hover:bg-bg-hover hover:text-ink"
      }`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-lg ${
          active ? "bg-brand/15" : "bg-bg-soft group-hover:bg-bg-hover"
        }`}
      >
        <Icon name={icon} className={`h-4 w-4 ${active ? accent : ""}`} />
      </span>
      <span className="flex-1 truncate">{label}</span>
      {active && <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-dot" />}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-line bg-bg-soft/70 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3 px-5 py-5">
        <Logo size={36} />
        <div>
          <div className="text-sm font-semibold leading-tight text-ink">ES World</div>
          <div className="text-[11px] text-ink-faint">Product Operating System</div>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        <NavItem
          href="/"
          icon="LayoutGrid"
          label="Hub"
          accent="text-brand-soft"
          active={pathname === "/"}
        />

        <div className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Modules
        </div>
        {CORE_MODULES.map((m) => (
          <NavItem
            key={m.slug}
            href={`/${m.slug}`}
            icon={m.icon}
            label={m.name}
            accent={m.accent}
            active={pathname === `/${m.slug}`}
          />
        ))}

        <div className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Planned · from gap analysis
        </div>
        {PLANNED_MODULES.map((m) => (
          <NavItem
            key={m.slug}
            href={`/${m.slug}`}
            icon={m.icon}
            label={m.name}
            accent={m.accent}
            active={pathname === `/${m.slug}`}
            muted
          />
        ))}
      </nav>

      <div className="border-t border-line px-4 py-3">
        <div className="flex items-center gap-3 rounded-xl bg-bg-card px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-teal to-accent-blue text-xs font-bold text-bg">
            PM
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs font-medium text-ink">Head of Product</div>
            <div className="truncate text-[11px] text-ink-faint">Enterprise workspace</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
