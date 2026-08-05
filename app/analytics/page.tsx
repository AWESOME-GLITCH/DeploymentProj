"use client";

import { useMemo, useState } from "react";
import { getModule } from "@/lib/modules";
import { CATEGORIES, type Product } from "@/lib/knowledge";
import { useProducts } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionLabel } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ExportMenu } from "@/components/ExportMenu";
import { H } from "@/lib/export";

const M = getModule("analytics")!;

// ---- shared programme scoring (matches the Portfolio cockpit) ----
type Action = "Scale" | "Grow" | "Hold" | "Nurture" | "Watch";
const ACTION: Record<Action, { label: string; hex: string; note: string }> = {
  Scale: { label: "Scale", hex: "#35d6c0", note: "Strong — invest to grow" },
  Grow: { label: "Grow", hex: "#5b9dff", note: "Healthy — keep investing" },
  Hold: { label: "Hold", hex: "#8a94a6", note: "Stable — maintain" },
  Nurture: { label: "Nurture", hex: "#f5b23b", note: "Early — build demand" },
  Watch: { label: "Watch", hex: "#ff5d6c", note: "Low health — investigate" },
};
const ACTION_ORDER: Action[] = ["Scale", "Grow", "Hold", "Nurture", "Watch"];
function actionFor(p: Product): Action {
  if (p.health < 65) return "Watch";
  if (p.stage === "Flagship" || p.health >= 84) return "Scale";
  if (p.stage === "New") return "Nurture";
  if (p.stage === "Growth" && p.health >= 72) return "Grow";
  return "Hold";
}

// pricing model bucket from the free-text price
function priceModel(price: string): string {
  const p = price.toLowerCase();
  if (/request|bespoke|tbc/.test(p)) return "On request";
  if (/member/.test(p)) return "Membership";
  if (/lesson/.test(p)) return "Per lesson";
  if (/week/.test(p)) return "Per week";
  if (/\/\s*yr|year|scholar/.test(p)) return "Per year";
  return "Fixed fee";
}

const healthHex = (h: number) => (h >= 84 ? "#35d6c0" : h >= 72 ? "#5b9dff" : h >= 65 ? "#f5b23b" : "#ff5d6c");

export default function AnalyticsPage() {
  const { products } = useProducts();
  const [campus, setCampus] = useState<"All" | "Dubai" | "London">("All");
  const [cat, setCat] = useState<string>("All");
  const [action, setAction] = useState<Action | null>(null);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (campus === "All" || p.campus === campus) &&
          (cat === "All" || p.category === cat) &&
          (!action || actionFor(p) === action)
      ),
    [products, campus, cat, action]
  );

  const avgHealth = filtered.length ? Math.round(filtered.reduce((s, p) => s + p.health, 0) / filtered.length) : 0;
  const watch = filtered.filter((p) => actionFor(p) === "Watch").length;
  const dubai = filtered.filter((p) => p.campus === "Dubai").length;
  const london = filtered.filter((p) => p.campus === "London").length;

  const byAction = ACTION_ORDER.map((a) => ({ a, n: products.filter((p) => (campus === "All" || p.campus === campus) && (cat === "All" || p.category === cat) && actionFor(p) === a).length }));
  const byCategory = CATEGORIES.map((c) => ({ c, n: filtered.filter((p) => p.category === c).length })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n);
  const byModel = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach((p) => m.set(priceModel(p.price), (m.get(priceModel(p.price)) || 0) + 1));
    return Array.from(m.entries()).map(([k, n]) => ({ k, n })).sort((a, b) => b.n - a.n);
  }, [filtered]);

  const histo = [
    { label: "85–100", key: "hi", n: filtered.filter((p) => p.health >= 84).length, hex: "#35d6c0" },
    { label: "72–84", key: "mid", n: filtered.filter((p) => p.health >= 72 && p.health < 84).length, hex: "#5b9dff" },
    { label: "65–71", key: "low", n: filtered.filter((p) => p.health >= 65 && p.health < 72).length, hex: "#f5b23b" },
    { label: "< 65", key: "watch", n: filtered.filter((p) => p.health < 65).length, hex: "#ff5d6c" },
  ];

  const ranked = [...filtered].sort((a, b) => b.health - a.health);
  const top = ranked.slice(0, 5);
  const bottom = ranked.filter((p) => p.health < 72).slice(-5).reverse();

  // interactive planning funnel
  const [enq, setEnq] = useState(400);
  const [consultRate, setConsultRate] = useState(45);
  const [enrolRate, setEnrolRate] = useState(35);
  const consults = Math.round((enq * consultRate) / 100);
  const enrols = Math.round((consults * enrolRate) / 100);
  const funnel = [
    { label: "Enquiries", n: enq, hex: "#5b9dff" },
    { label: "Consultations", n: consults, hex: "#ff8300" },
    { label: "Enrolments", n: enrols, hex: "#35d6c0" },
  ];

  function reportHtml() {
    return (
      H.brandTitle("Analytics — ES World", `${campus} · ${cat}`) +
      H.kv("Programmes", String(filtered.length)) + H.kv("Average health", String(avgHealth)) + H.kv("On watch", String(watch)) +
      H.h2("By recommended action") + H.ul(byAction.map((x) => `${x.a}: ${x.n}`)) +
      H.h2("By category") + H.ul(byCategory.map((x) => `${x.c}: ${x.n}`)) +
      H.h2("Pricing model mix") + H.ul(byModel.map((x) => `${x.k}: ${x.n}`)) +
      H.h2("Needs attention") + H.ul(bottom.map((p) => `${p.name} (${p.campus}) — health ${p.health}`))
    );
  }

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${active ? "border-brand/40 bg-brand/10 text-brand-soft" : "border-line text-ink-soft hover:text-ink"}`;

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <PageHeader
        icon={M.icon}
        accent={M.accent}
        glow={M.glow}
        title={M.name}
        tagline="Your whole portfolio at a glance — health, mix and pipeline, from your live catalogue."
        status={M.status}
        agent={M.agent}
        right={<ExportMenu title="ES World Analytics" html={reportHtml} />}
      />

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Campus</span>
        {(["All", "Dubai", "London"] as const).map((c) => (
          <button key={c} onClick={() => setCampus(c)} className={chip(campus === c)}>{c}</button>
        ))}
        <span className="ml-3 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Category</span>
        <button onClick={() => setCat("All")} className={chip(cat === "All")}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={chip(cat === c)}>{c}</button>
        ))}
        {(action || campus !== "All" || cat !== "All") && (
          <button onClick={() => { setAction(null); setCampus("All"); setCat("All"); }} className="ml-auto text-xs text-brand-soft hover:text-brand">Reset</button>
        )}
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi label="Programmes" value={String(filtered.length)} sub={`${dubai} Dubai · ${london} London`} />
        <Kpi label="Avg health" value={String(avgHealth)} sub="0–100 composite" accent={healthHex(avgHealth)} />
        <Kpi label="On watch" value={String(watch)} sub="need attention" accent={watch ? "#ff5d6c" : undefined} />
        <Kpi label="New / early" value={String(filtered.filter((p) => p.stage === "New").length)} sub="build demand" accent="#f5b23b" />
      </div>

      {/* Row 1: action bars + campus donut */}
      <div className="mb-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <SectionLabel>Recommended action</SectionLabel>
            {action && <button onClick={() => setAction(null)} className="text-xs text-brand-soft hover:text-brand">Clear filter</button>}
          </div>
          <div className="space-y-2.5">
            {byAction.map(({ a, n }) => {
              const max = Math.max(1, ...byAction.map((x) => x.n));
              return (
                <button key={a} onClick={() => setAction(action === a ? null : a)} className={`block w-full text-left transition-opacity ${action && action !== a ? "opacity-40" : ""}`}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-ink">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: ACTION[a].hex }} />
                      {ACTION[a].label} <span className="text-ink-faint">· {ACTION[a].note}</span>
                    </span>
                    <span className="font-mono text-ink-soft">{n}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-bg-hover">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(n / max) * 100}%`, background: ACTION[a].hex }} />
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-ink-faint">Click a band to filter the whole dashboard.</p>
        </Card>

        <Card className="p-5">
          <SectionLabel>By campus</SectionLabel>
          <Donut dubai={dubai} london={london} />
        </Card>
      </div>

      {/* Row 2: category + pricing model */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionLabel>By category</SectionLabel>
          <BarList items={byCategory.map((x) => ({ label: x.c, n: x.n }))} color="#ff8300" />
        </Card>
        <Card className="p-5">
          <SectionLabel>Pricing model mix</SectionLabel>
          <BarList items={byModel.map((x) => ({ label: x.k, n: x.n }))} color="#5b9dff" />
        </Card>
      </div>

      {/* Health histogram */}
      <Card className="mb-6 p-5">
        <SectionLabel>Health distribution</SectionLabel>
        <div className="flex items-end gap-4">
          {histo.map((b) => {
            const max = Math.max(1, ...histo.map((x) => x.n));
            return (
              <div key={b.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end justify-center">
                  <div className="w-full max-w-[72px] rounded-t-lg transition-all" style={{ height: `${(b.n / max) * 100}%`, background: b.hex, minHeight: b.n ? 6 : 0 }} />
                </div>
                <div className="text-sm font-semibold text-ink">{b.n}</div>
                <div className="text-[11px] text-ink-faint">{b.label}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Leaderboards */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Icon name="TrendingUp" className="h-4 w-4 text-accent-teal" />
            <SectionLabel>Top performers</SectionLabel>
          </div>
          <Ranked list={top} />
        </Card>
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Icon name="AlertTriangle" className="h-4 w-4 text-accent-rose" />
            <SectionLabel>Needs attention</SectionLabel>
          </div>
          {bottom.length ? <Ranked list={bottom} /> : <p className="text-sm text-ink-faint">Nothing on watch in this view — healthy portfolio.</p>}
        </Card>
      </div>

      {/* Interactive pipeline model */}
      <Card glow={M.glow} className="p-5">
        <div className="mb-1 flex items-center gap-2">
          <Icon name="Workflow" className="h-4 w-4 text-brand-soft" />
          <SectionLabel>Enquiry → consult → enrol — pipeline model</SectionLabel>
        </div>
        <p className="mb-4 text-xs text-ink-faint">A planning model you control — set the assumptions to project enrolments. Connect your CRM to replace these with live rates.</p>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <Slider label="Monthly enquiries" value={enq} min={50} max={2000} step={50} onChange={setEnq} suffix="" />
            <Slider label="Enquiry → consult" value={consultRate} min={5} max={90} step={5} onChange={setConsultRate} suffix="%" />
            <Slider label="Consult → enrol" value={enrolRate} min={5} max={90} step={5} onChange={setEnrolRate} suffix="%" />
            <div className="rounded-xl border border-brand/25 bg-brand/10 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-soft">Projected monthly enrolments</div>
              <div className="mt-0.5 text-2xl font-bold text-ink">{enrols.toLocaleString()}</div>
              <div className="text-xs text-ink-soft">{(enq && enrols ? ((enrols / enq) * 100).toFixed(1) : "0")}% end-to-end · {(enrols * 12).toLocaleString()} / year</div>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3">
            {funnel.map((s, i) => {
              const w = 100 - i * 26;
              return (
                <div key={s.label} className="mx-auto w-full" style={{ maxWidth: `${w}%` }}>
                  <div className="flex items-center justify-between rounded-lg px-4 py-3 text-white" style={{ background: s.hex }}>
                    <span className="text-sm font-semibold">{s.label}</span>
                    <span className="font-mono text-lg font-bold">{s.n.toLocaleString()}</span>
                  </div>
                  {i < funnel.length - 1 && (
                    <div className="py-1 text-center text-[11px] text-ink-faint">
                      ↓ {i === 0 ? consultRate : enrolRate}% convert
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <p className="mt-6 text-center text-xs text-ink-faint">
        Charts are computed live from your catalogue (health, stage, campus, category, price). The pipeline is a planning model — wire enrolment/CRM data to make it live.
      </p>
    </div>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <Card className="p-4">
      <div className="text-3xl font-bold tracking-tight" style={accent ? { color: accent } : undefined}>{value}</div>
      <div className="mt-0.5 text-sm text-ink">{label}</div>
      {sub && <div className="text-[11px] text-ink-faint">{sub}</div>}
    </Card>
  );
}

function BarList({ items, color }: { items: { label: string; n: number }[]; color: string }) {
  const max = Math.max(1, ...items.map((i) => i.n));
  if (!items.length) return <p className="text-sm text-ink-faint">No data in this view.</p>;
  return (
    <div className="space-y-2.5">
      {items.map((it) => (
        <div key={it.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-ink-soft">{it.label}</span>
            <span className="font-mono text-ink-faint">{it.n}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-bg-hover">
            <div className="h-full rounded-full" style={{ width: `${(it.n / max) * 100}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Ranked({ list }: { list: Product[] }) {
  return (
    <div className="space-y-2">
      {list.map((p) => (
        <div key={p.id} className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm text-ink">{p.name}</div>
            <div className="text-[11px] text-ink-faint">{p.campus} · {p.category}</div>
          </div>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-bg-hover">
            <div className="h-full rounded-full" style={{ width: `${p.health}%`, background: healthHex(p.health) }} />
          </div>
          <span className="w-7 text-right font-mono text-sm" style={{ color: healthHex(p.health) }}>{p.health}</span>
        </div>
      ))}
    </div>
  );
}

function Donut({ dubai, london }: { dubai: number; london: number }) {
  const total = dubai + london || 1;
  const frac = dubai / total;
  const C = 2 * Math.PI * 52;
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
        <circle cx="70" cy="70" r="52" fill="none" stroke="#5b9dff" strokeWidth="18" />
        <circle cx="70" cy="70" r="52" fill="none" stroke="#ff8300" strokeWidth="18" strokeDasharray={`${C * frac} ${C}`} strokeLinecap="butt" />
      </svg>
      <div className="space-y-2">
        <Legend hex="#ff8300" label="Dubai" n={dubai} total={total} />
        <Legend hex="#5b9dff" label="London" n={london} total={total} />
      </div>
    </div>
  );
}
function Legend({ hex, label, n, total }: { hex: string; label: string; n: number; total: number }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="h-3 w-3 rounded-sm" style={{ background: hex }} />
      <span className="text-ink">{label}</span>
      <span className="font-mono text-ink-faint">{n} · {Math.round((n / total) * 100)}%</span>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, suffix }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; suffix: string }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-ink-soft">{label}</span>
        <span className="font-mono text-sm text-ink">{value.toLocaleString()}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#ff8300]" />
    </label>
  );
}
