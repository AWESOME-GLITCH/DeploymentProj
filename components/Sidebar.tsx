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
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
        active ? "bg-white/[0.06] text-ink" : muted ? "text-ink-faint hover:text-ink-soft" : "text-ink-soft hover:bg-white/[0.03] hover:text-ink"
      }`}
    >
      {active && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-brand" />}
      <Icon name={icon} className={`h-[18px] w-[18px] ${active ? "text-brand-soft" : ""}`} />
      <span className="flex-1 truncate font-medium">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-line bg-bg-soft/60 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3 px-5 py-6">
        <Logo size={34} />
        <div>
          <div className="text-sm font-bold leading-tight tracking-tight text-ink">ES World</div>
          <div className="text-[11px] text-ink-faint">Product OS</div>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        <NavItem href="/" icon="LayoutGrid" label="Home" active={pathname === "/"} />
        {CORE_MODULES.map((m) => (
          <NavItem key={m.slug} href={`/${m.slug}`} icon={m.icon} label={m.name} active={pathname === `/${m.slug}`} />
        ))}

        <div className="px-3 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">Soon</div>
        {PLANNED_MODULES.map((m) => (
          <NavItem key={m.slug} href={`/${m.slug}`} icon={m.icon} label={m.name} active={pathname === `/${m.slug}`} muted />
        ))}
      </nav>

      <div className="border-t border-line px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand-soft">PM</div>
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-ink">Head of Product</div>
            <div className="truncate text-[11px] text-ink-faint">ES World</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
