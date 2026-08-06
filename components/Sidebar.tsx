"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CORE_MODULES, PLANNED_MODULES } from "@/lib/modules";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

function NavItem({ href, icon, label, active, muted }: { href: string; icon: string; label: string; active: boolean; muted?: boolean }) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-all ${
        active
          ? "bg-bg-elevated text-ink shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
          : muted
          ? "text-ink-faint hover:text-ink-soft"
          : "text-ink-soft hover:bg-white/[0.03] hover:text-ink"
      }`}
    >
      {active && <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-brand" />}
      <Icon name={icon} className={`h-[17px] w-[17px] transition-colors ${active ? "text-brand-soft" : "text-ink-faint group-hover:text-ink-soft"}`} />
      <span className="flex-1 truncate font-medium">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-line bg-bg-soft/70 backdrop-blur-xl">
      {/* faint brand glow behind the wordmark */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-32 bg-[radial-gradient(220px_120px_at_28%_0%,rgba(255,131,0,0.10),transparent_70%)]" />
      <Link href="/" className="relative flex items-center gap-3 px-5 pb-5 pt-6">
        <Logo size={32} />
        <div>
          <div className="text-[13px] font-semibold leading-tight tracking-tight text-ink">ES World</div>
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-ink-faint">Product OS</div>
        </div>
      </Link>

      <nav className="relative flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        <NavItem href="/" icon="LayoutGrid" label="Home" active={pathname === "/"} />
        {CORE_MODULES.map((m) => (
          <NavItem key={m.slug} href={`/${m.slug}`} icon={m.icon} label={m.name} active={pathname === `/${m.slug}`} />
        ))}

        <div className="px-3 pb-1 pt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">Soon</div>
        {PLANNED_MODULES.map((m) => (
          <NavItem key={m.slug} href={`/${m.slug}`} icon={m.icon} label={m.name} active={pathname === `/${m.slug}`} muted />
        ))}
      </nav>

      <div className="relative border-t border-line px-3 py-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand/25 to-brand/5 text-[11px] font-bold text-brand-soft ring-1 ring-inset ring-white/10">PM</div>
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-ink">Head of Product</div>
            <div className="truncate text-[11px] text-ink-faint">ES World</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
