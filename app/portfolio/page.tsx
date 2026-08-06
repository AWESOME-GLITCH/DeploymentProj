"use client";

import { useMemo, useState } from "react";
import { getModule } from "@/lib/modules";
import { type Product } from "@/lib/knowledge";
import { useProducts } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionLabel } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ExportMenu } from "@/components/ExportMenu";
import { H } from "@/lib/export";

const M = getModule("portfolio")!;

type Action = "Scale" | "Grow" | "Hold" | "Nurture" | "Watch";

const ACTION_META: Record<Action, { tone: string; bar: string; note: string; icon: string }> = {
  Scale: { tone: "text-accent-teal border-accent-teal/30 bg-accent-teal/10", bar: "bg-accent-teal", note: "Strong performer, invest to grow", icon: "TrendingUp" },
  Grow: { tone: "text-accent-blue border-accent-blue/30 bg-accent-blue/10", bar: "bg-accent-blue", note: "Healthy growth, keep investing", icon: "ArrowUpRight" },
  Hold: { tone: "text-ink-soft border-line bg-bg-hover", bar: "bg-ink-faint", note: "Stable & established, maintain", icon: "Check" },
  Nurture: { tone: "text-accent-amber border-accent-amber/30 bg-accent-amber/10", bar: "bg-accent-amber", note: "Early stage, build demand", icon: "Sparkles" },
  Watch: { tone: "text-accent-rose border-accent-rose/30 bg-accent-rose/10", bar: "bg-accent-rose", note: "Lower health, investigate demand/delivery", icon: "AlertTriangle" },
};

const ORDER: Action[] = ["Scale", "Grow", "Hold", "Nurture", "Watch"];

function actionFor(p: Product): Action {
  if (p.health < 65) return "Watch";
  if (p.stage === "Flagship" || p.health >= 84) return "Scale";
  if (p.stage === "New") return "Nurture";
  if (p.stage === "Growth" && p.health >= 72) return "Grow";
  return "Hold";
}

function healthColor(h: number) {
  if (h >= 78) return "text-accent-teal";
  if (h >= 65) return "text-accent-amber";
  return "text-accent-rose";
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <Card className="p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${accent}`}>{value}</div>
      {sub && <div className="text-xs text-ink-faint">{sub}</div>}
    </Card>
  );
}

function Row({ p }: { p: Product }) {
  const a = actionFor(p);
  const m = ACTION_META[a];
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-bg-soft/50 px-4 py-3">
      <div className="min-w-[180px] flex-1">
        <div className="font-medium text-ink">{p.name}</div>
        <div className="flex items-center gap-1.5 text-[11px] text-ink-faint">
          <Icon name="Map" className="h-3 w-3" />
          {p.campus} · {p.category} · <span className="text-ink-soft">{p.stage}</span>
        </div>
      </div>

      {/* Health bar */}
      <div className="w-32">
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="text-ink-faint">Health</span>
          <span className={healthColor(p.health)}>{p.health}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-hover">
          <div className={`h-full ${m.bar}`} style={{ width: `${p.health}%` }} />
        </div>
      </div>

      <div className="w-28 text-right text-xs text-brand-soft">{p.price}</div>

      <div className="w-40">
        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${m.tone}`}>
          <Icon name={m.icon} className="h-3 w-3" />
          {a}
        </span>
        <div className="mt-0.5 text-[11px] text-ink-faint">{m.note}</div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const { products } = useProducts();
  const [groupBy, setGroupBy] = useState<"Action" | "Campus" | "Category">("Action");

  const enriched = useMemo(() => products.map((p) => ({ p, action: actionFor(p) })), [products]);
  const avgHealth = products.length ? Math.round(products.reduce((s, p) => s + p.health, 0) / products.length) : 0;
  const categories = new Set(products.map((p) => p.category)).size;
  const actionCounts = ORDER.map((a) => ({ a, n: enriched.filter((e) => e.action === a).length }));

  const groups = useMemo(() => {
    const map = new Map<string, Product[]>();
    const keyer = (p: Product) => (groupBy === "Action" ? actionFor(p) : groupBy === "Campus" ? p.campus : p.category);
    const order =
      groupBy === "Action" ? ORDER : groupBy === "Campus" ? ["Dubai", "London", "Online"] : Array.from(new Set(products.map((p) => p.category)));
    for (const p of products) {
      const k = keyer(p) as string;
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(p);
    }
    return (order as string[]).filter((k) => map.has(k)).map((k) => ({ key: k, items: map.get(k)!.sort((a, b) => b.health - a.health) }));
  }, [groupBy]);

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <PageHeader
        icon={M.icon}
        accent={M.accent}
        glow={M.glow}
        title={M.name}
        tagline="Every programme across Dubai & London, with a recommended action for each."
        status={M.status}
        agent={M.agent}
        right={
          <ExportMenu
            title="ES World Portfolio"
            html={() =>
              H.brandTitle("Portfolio, ES World") +
              "<table><tr><th>Programme</th><th>Campus</th><th>Category</th><th>Stage</th><th>Health</th><th>Action</th><th>Price</th></tr>" +
              products.map((p) => `<tr><td>${p.name}</td><td>${p.campus}</td><td>${p.category}</td><td>${p.stage}</td><td>${p.health}</td><td>${actionFor(p)}</td><td>${p.price}</td></tr>`).join("") +
              "</table>"
            }
            rows={() => [
              ["Programme", "Campus", "Category", "Stage", "Health", "Action", "Price"],
              ...products.map((p) => [p.name, p.campus, p.category, p.stage, p.health, actionFor(p), p.price] as (string | number)[]),
            ]}
          />
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Stat label="Programmes" value={`${products.length}`} accent="text-ink" />
        <Stat label="Campuses" value="2" sub="Dubai · London" accent="text-accent-teal" />
        <Stat label="Categories" value={`${categories}`} accent="text-accent-blue" />
        <Stat label="Avg health" value={`${avgHealth}`} accent={healthColor(avgHealth)} />
        <Stat label="On watch" value={`${actionCounts.find((c) => c.a === "Watch")?.n ?? 0}`} sub="need attention" accent="text-accent-rose" />
      </div>

      {/* Action summary */}
      <SectionLabel>Recommended actions</SectionLabel>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {actionCounts.map(({ a, n }) => {
          const m = ACTION_META[a];
          return (
            <Card key={a} className="p-3">
              <div className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${m.tone}`}>
                <Icon name={m.icon} className="h-3 w-3" />
                {a}
              </div>
              <div className="mt-2 text-2xl font-semibold text-ink">{n}</div>
              <div className="text-[11px] text-ink-faint">{m.note}</div>
            </Card>
          );
        })}
      </div>

      {/* Group toggle */}
      <div className="mb-4 flex items-center justify-between">
        <SectionLabel>Programmes</SectionLabel>
        <div className="flex rounded-xl border border-line bg-bg-card p-1">
          {(["Action", "Campus", "Category"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                groupBy === g ? "bg-brand text-white" : "text-ink-soft hover:text-ink"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped list */}
      <div className="space-y-6">
        {groups.map((g) => (
          <div key={g.key}>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-sm font-semibold text-ink">{g.key}</h3>
              <span className="text-xs text-ink-faint">{g.items.length}</span>
            </div>
            <div className="space-y-2">
              {g.items.map((p) => (
                <Row key={p.id + p.campus} p={p} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-start gap-2 rounded-xl border border-line bg-bg-soft/50 p-3">
        <Icon name="Sparkles" className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" />
        <p className="text-xs text-ink-soft">
          Actions are computed from lifecycle stage + programme health. Health scores are seed values, as you connect real
          enrolment and revenue data, the cockpit recomputes automatically. You always make the final invest/scale/hold call.
        </p>
      </div>
    </div>
  );
}
