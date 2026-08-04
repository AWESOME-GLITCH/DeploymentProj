import Link from "next/link";
import { CORE_MODULES, PLANNED_MODULES } from "@/lib/modules";
import { PORTFOLIO_STATS } from "@/lib/knowledge";
import { Icon } from "@/components/Icon";
import { Card, StatusPill } from "@/components/ui";
import { AgentActivity } from "@/components/AgentActivity";

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <Card className="p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${accent}`}>{value}</div>
      {sub && <div className="text-xs text-ink-faint">{sub}</div>}
    </Card>
  );
}

function ModuleCard({ slug, name, icon, accent, glow, tagline, description, status, agent }: (typeof CORE_MODULES)[number]) {
  return (
    <Link href={`/${slug}`}>
      <Card className="hover-lift group h-full p-5 hover:border-brand/40">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-bg-soft transition-colors group-hover:bg-brand/10">
            <Icon name={icon} className={`h-5 w-5 ${accent}`} />
          </div>
          <StatusPill status={status} />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <h3 className="font-semibold text-ink">{name}</h3>
          <Icon
            name="ArrowUpRight"
            className="h-4 w-4 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-soft"
          />
        </div>
        <div className={`text-xs ${accent}`}>{tagline}</div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-ink-faint">
          <Icon name="Sparkles" className="h-3 w-3" /> {agent}
        </div>
      </Card>
    </Link>
  );
}

export default function Hub() {
  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs text-brand-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-dot" />
          ES World · AI-native · hub-and-spoke · human-in-the-loop
        </div>
        <h1 className="mt-5 text-5xl font-bold leading-[1.04] tracking-tight text-ink">
          ES World <span className="text-gradient">Product OS</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">
          One source of truth, agents that do the heavy lifting, and a full launch flow —
          seeded with your real Dubai &amp; London catalogue.
        </p>
      </div>

      {/* Portfolio stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Programmes" value={`${PORTFOLIO_STATS.programmes}`} sub="in the catalogue" accent="text-ink" />
        <Stat label="Campuses" value={`${PORTFOLIO_STATS.campuses}`} sub="Dubai · London" accent="text-accent-teal" />
        <Stat label="Flagship" value={PORTFOLIO_STATS.flagship} sub="ATHE Diploma" accent="text-brand-soft" />
        <Stat label="Watch list" value={`${PORTFOLIO_STATS.atRisk}`} sub="lower health" accent="text-accent-rose" />
      </div>

      {/* Modules */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">Modules</h2>
        <span className="text-xs text-ink-faint">Click any module to open its workspace</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CORE_MODULES.map((m) => (
          <ModuleCard key={m.slug} {...m} />
        ))}
      </div>

      {/* Live agent activity */}
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <Icon name="Activity" className="h-4 w-4 text-brand-soft" />
            <h3 className="font-semibold text-ink">Live agent activity</h3>
            <span className="ml-auto text-[11px] text-ink-faint">real-time</span>
          </div>
          <AgentActivity />
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Icon name="Target" className="h-4 w-4 text-accent-amber" />
            <h3 className="font-semibold text-ink">Next from gap analysis</h3>
          </div>
          <p className="mb-3 text-xs text-ink-soft">
            Research flagged the <span className="text-ink">decide → plan → coordinate</span> half of
            PM as the biggest gap for a 20+ product portfolio. These are queued:
          </p>
          <div className="space-y-2">
            {PLANNED_MODULES.map((m) => (
              <Link
                key={m.slug}
                href={`/${m.slug}`}
                className="flex items-center gap-2 rounded-lg border border-line bg-bg-soft/50 px-3 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
              >
                <Icon name={m.icon} className="h-4 w-4 text-ink-faint" />
                <span className="flex-1">{m.name}</span>
                <Icon name="ChevronRight" className="h-4 w-4 text-ink-faint" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-10 text-center text-xs text-ink-faint">
        PM Command Center · designed hub-and-spoke around Product Knowledge as the single source of truth
      </div>
    </div>
  );
}
