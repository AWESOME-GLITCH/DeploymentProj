import { notFound } from "next/navigation";
import { getModule } from "@/lib/modules";
import { SHOWCASE, type Showcase } from "@/lib/showcase";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionLabel, ConfidenceBadge } from "@/components/ui";
import { Icon } from "@/components/Icon";

export function generateStaticParams() {
  return Object.keys(SHOWCASE).map((slug) => ({ slug }));
}

function Steps({ steps }: { steps: Showcase["steps"] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {steps.map((s, i) => (
        <Card key={i} className="p-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/15 text-sm font-semibold text-brand-soft">
            {i + 1}
          </div>
          <div className="mt-3 font-medium text-ink">{s.title}</div>
          <p className="mt-1 text-sm text-ink-soft">{s.detail}</p>
        </Card>
      ))}
    </div>
  );
}

function Sample({ s, glow }: { s: Showcase["sample"]; glow: string }) {
  if (s.kind === "insights") {
    return (
      <Card glow={glow} className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Icon name="TrendingUp" className="h-4 w-4 text-accent-teal" />
          <h3 className="font-semibold text-ink">{s.title}</h3>
        </div>
        <div className="space-y-2.5">
          {s.items.map((it, i) => (
            <div key={i} className="rounded-xl border border-line bg-bg-soft/50 p-3">
              <p className="text-sm text-ink">{it.claim}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <ConfidenceBadge level={it.confidence} />
                {it.label && (
                  <span className="rounded-md border border-line bg-bg-hover px-1.5 py-0.5 text-[10px] text-ink-faint">
                    {it.label}
                  </span>
                )}
                <span className="text-[11px] text-ink-faint">{it.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (s.kind === "pricing") {
    return (
      <Card glow={glow} className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Icon name="Tags" className="h-4 w-4 text-accent-amber" />
          <h3 className="font-semibold text-ink">{s.title}</h3>
        </div>
        <div className="overflow-hidden rounded-xl border border-line">
          {[
            ["Bundle price", "$17,000", "high"],
            ["Cost floor (est.)", "tuition + Careers + ATHE reg + AI Module", "medium"],
            ["Dubai study-abroad comparables", "public bands scanned", "medium"],
            ["UK pathway (DMU) comparables", "custom / on-request", "low"],
          ].map((row, i) => (
            <div
              key={i}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 text-sm ${i % 2 ? "bg-bg-soft/40" : ""}`}
            >
              <span className="text-ink-soft">{row[0]}</span>
              <span className="flex items-center gap-2">
                <span className="text-ink">{row[1]}</span>
                <ConfidenceBadge level={row[2] as "high" | "medium" | "low"} />
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-faint">{s.note}</p>
      </Card>
    );
  }

  if (s.kind === "feedback") {
    return (
      <Card glow={glow} className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Icon name="MessagesSquare" className="h-4 w-4 text-accent-blue" />
          <h3 className="font-semibold text-ink">{s.title}</h3>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-3">
          {[
            ["NPS", "+61", "text-accent-teal"],
            ["CSAT", "4.6/5", "text-accent-blue"],
            ["CES", "Low effort", "text-accent-amber"],
          ].map(([k, v, c]) => (
            <div key={k} className="rounded-xl border border-line bg-bg-soft/50 p-3 text-center">
              <div className={`text-lg font-semibold ${c}`}>{v}</div>
              <div className="text-[11px] uppercase tracking-wider text-ink-faint">{k}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2.5">
          <div className="rounded-xl border border-line bg-bg-soft/50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">Theme · Trainer quality</span>
              <span className="text-xs text-accent-teal">positive · 38 mentions</span>
            </div>
            <div className="mt-2 flex gap-2 text-sm text-ink-soft">
              <Icon name="Quote" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" />
              <span className="italic">“My tutor completely changed how confident I feel presenting.”</span>
            </div>
          </div>
          <div className="rounded-xl border border-line bg-bg-soft/50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">Theme · Scheduling</span>
              <span className="text-xs text-accent-rose">negative · 14 mentions</span>
            </div>
            <div className="mt-2 flex gap-2 text-sm text-ink-soft">
              <Icon name="Quote" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" />
              <span className="italic">“Hard to rebook a missed session in the intensive weeks.”</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-accent-amber">
              <Icon name="AlertTriangle" className="h-3 w-3" /> small sample — flagged for a follow-up, not a conclusion
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // roadmap-style
  return (
    <Card glow={glow} className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon name="ListChecks" className="h-4 w-4 text-brand-soft" />
        <h3 className="font-semibold text-ink">{s.title}</h3>
      </div>
      <div className="space-y-2">
        {s.items.map((it, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-line bg-bg-soft/50 px-3 py-2.5">
            <span className="shrink-0 rounded-md border border-brand/30 bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand-soft">
              {it.name}
            </span>
            <span className="text-sm text-ink-soft">{it.detail}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function ModulePage({ params }: { params: { slug: string } }) {
  const mod = getModule(params.slug);
  const sc = SHOWCASE[params.slug];
  if (!mod || !sc) notFound();

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <PageHeader
        icon={mod.icon}
        accent={mod.accent}
        glow={mod.glow}
        title={mod.name}
        tagline={mod.description}
        status={mod.status}
        agent={mod.agent}
      />

      <div className="mb-8">
        <SectionLabel>How it works</SectionLabel>
        <Steps steps={sc.steps} />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div>
          <SectionLabel>Live example</SectionLabel>
          <Sample s={sc.sample} glow={mod.glow} />
        </div>
        <div>
          <SectionLabel>Capabilities</SectionLabel>
          <Card className="p-5">
            <ul className="space-y-2.5">
              {sc.capabilities.map((c, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink-soft">
                  <Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-line bg-bg-soft/50 p-3">
              <Icon name="ShieldCheck" className="mt-0.5 h-4 w-4 shrink-0 text-accent-teal" />
              <p className="text-xs text-ink-soft">{sc.guardrail}</p>
            </div>
          </Card>
        </div>
      </div>

      {mod.status === "next" && (
        <div className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-ink-soft">
          <Icon name="Sparkles" className="mr-2 inline h-4 w-4 text-brand-soft" />
          This module came out of the gap analysis for a multi-programme operator. It’s designed and queued — say the word and it’s next to build.
        </div>
      )}
    </div>
  );
}
