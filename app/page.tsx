"use client";

import Link from "next/link";
import { CORE_MODULES, PLANNED_MODULES, getModule } from "@/lib/modules";
import { useProducts } from "@/lib/store";
import { Icon } from "@/components/Icon";
import { Card } from "@/components/ui";
import { SynthesisPanel } from "@/components/SynthesisPanel";

const flow = getModule("flow")!;
const gridModules = CORE_MODULES.filter((m) => m.slug !== "flow");

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-bg-card px-5 py-4">
      <div className="text-3xl font-bold tracking-tight text-ink">{value}</div>
      <div className="mt-0.5 text-xs text-ink-faint">{label}</div>
    </div>
  );
}

export default function Home() {
  const { products } = useProducts();
  const watch = products.filter((p) => p.health < 65).length;

  return (
    <div className="mx-auto max-w-6xl px-8 py-12">
      {/* Hero */}
      <div className="mb-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-faint">ES World · Product OS</div>
        <h1 className="mt-4 max-w-3xl text-[52px] font-bold leading-[1.02] tracking-tight text-ink">
          Run your whole product <span className="text-gradient">from one place.</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">
          Briefs, pricing, marketing, quotes and launches. The agents do the work.
        </p>
      </div>

      {/* Executive synthesis, the live read, up top */}
      <SynthesisPanel />

      {/* Hero action card, Launch Flow */}
      <Link href="/flow" className="group mb-10 block">
        <div
          className="hover-lift relative overflow-hidden rounded-3xl p-8 text-white"
          style={{ background: "linear-gradient(120deg,#ff8300,#ff5d3c 55%,#ff4d8d)" }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/80">
                <Icon name="Workflow" className="h-4 w-4" /> Launch Flow
              </div>
              <h2 className="mt-3 max-w-lg text-3xl font-bold leading-tight">One brief → every asset, plus who does what.</h2>
              <p className="mt-2 max-w-md text-white/85">Run the brief, pricing, flyer, website and proposal in a single pass.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#c24500] transition-transform group-hover:translate-x-1">
              Start a launch <Icon name="ArrowRight" className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Programmes" value={`${products.length}`} />
        <Stat label="Campuses" value="2" />
        <Stat label="Flagship" value="$17K" />
        <Stat label="On watch" value={`${watch}`} />
      </div>

      {/* Module grid */}
      <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">Modules</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gridModules.map((m) => (
          <Link key={m.slug} href={`/${m.slug}`}>
            <Card className="hover-lift group flex h-full items-center gap-4 p-5 hover:border-brand/40">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-bg-soft transition-colors group-hover:bg-brand/10">
                <Icon name={m.icon} className="h-5 w-5 text-brand-soft" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-ink">{m.name}</h3>
                  <Icon name="ArrowUpRight" className="h-3.5 w-3.5 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-soft" />
                </div>
                <p className="truncate text-sm text-ink-soft">{m.tagline}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Soon */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">Soon</span>
        {PLANNED_MODULES.map((m) => (
          <Link key={m.slug} href={`/${m.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-brand/30 hover:text-ink">
            <Icon name={m.icon} className="h-3.5 w-3.5" /> {m.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
