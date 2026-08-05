"use client";

import { useMemo, useState } from "react";
import { getModule } from "@/lib/modules";
import { PRODUCTS } from "@/lib/knowledge";
import { useProducts } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, SectionLabel, ConfidenceBadge } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ExportMenu } from "@/components/ExportMenu";
import { SaveToProgramme } from "@/components/SaveToProgramme";
import { H } from "@/lib/export";
import type { PricingAnalysis } from "../api/pricing/route";

function pricingHtml(name: string, a: PricingAnalysis) {
  return (
    H.brandTitle(`Pricing — ${name}`, "ES World") +
    H.kv("Recommended", a.recommendedPrice) +
    H.p(a.recommendation) +
    H.muted(a.positioning) +
    H.h2("Rationale") + H.ul(a.rationale) +
    H.h2("Competitors (researched)") +
    "<table><tr><th>Name</th><th>Price</th><th>Confidence</th><th>Note</th></tr>" +
    a.competitors.map((c) => `<tr><td>${c.name}</td><td>${c.price}</td><td>${c.confidence}</td><td>${c.note}</td></tr>`).join("") +
    "</table>" +
    H.h2("Market trends") + H.ul(a.trends.map((t) => `${t.note} (${t.confidence})`)) +
    H.h2("Risks") + H.ul(a.risks)
  );
}

const M = getModule("pricing")!;

function firstNumber(s: string): number {
  const m = s.replace(/,/g, "").match(/\d+/);
  return m ? Number(m[0]) : 0;
}

const THINKING = [
  "Reading your cost inputs…",
  "Searching competitor pricing…",
  "Normalising to a common value metric…",
  "Checking the cost floor & margin…",
  "Writing the recommendation…",
];

export default function PricingPage() {
  const [pid, setPid] = useState(PRODUCTS[0].id);
  const product = PRODUCTS.find((p) => p.id === pid)!;

  const [price, setPrice] = useState(firstNumber(product.price));
  const [teacher, setTeacher] = useState(60);
  const [other, setOther] = useState(15);
  const [classSize, setClassSize] = useState(8);
  const [targetMargin, setTargetMargin] = useState(60);
  const [market, setMarket] = useState("");

  const [analysis, setAnalysis] = useState<PricingAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState(false);
  const [step, setStep] = useState(0);

  // Price-list generator
  const { products: catalog } = useProducts();
  const [mode, setMode] = useState<"analyse" | "pricelist">("analyse");
  const [year, setYear] = useState("2027");
  const [pct, setPct] = useState(5);
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const BASE_YEAR = 2026;
  const yearsAhead = Math.max(0, (Number(year) || BASE_YEAR) - BASE_YEAR);
  function uplift(price: string) {
    const mult = Math.pow(1 + pct / 100, yearsAhead);
    return price.replace(/[\d][\d,]*(\.\d+)?/g, (m) => {
      const n = Number(m.replace(/,/g, ""));
      if (!n) return m;
      return Math.round(n * mult).toLocaleString();
    });
  }
  const newPrice = (p: (typeof catalog)[number]) => overrides[p.id] ?? uplift(p.price);
  const prevYear = String(BASE_YEAR);
  function pricelistHtml() {
    return (
      H.brandTitle(`Price List ${year} — ES World`, `Generated with a ${pct}% uplift · VAT-inclusive`) +
      "<table><tr><th>Programme</th><th>Campus</th><th>" + prevYear + "</th><th>" + year + "</th></tr>" +
      catalog.map((p) => `<tr><td>${p.name}</td><td>${p.campus}</td><td>${p.price}</td><td>${newPrice(p)}</td></tr>`).join("") +
      "</table>"
    );
  }
  const pricelistRows = () => [
    ["Programme", "Campus", prevYear, year],
    ...catalog.map((p) => [p.name, p.campus, p.price, newPrice(p)] as string[]),
  ];

  function onPick(id: string) {
    setPid(id);
    const p = PRODUCTS.find((x) => x.id === id)!;
    setPrice(firstNumber(p.price));
    setClassSize(p.tags.includes("1-1") ? 1 : 8);
  }

  const econ = useMemo(() => {
    const costPerStudent = (teacher / Math.max(classSize, 1)) + other;
    const contribution = price - costPerStudent;
    const margin = price > 0 ? (contribution / price) * 100 : 0;
    const breakEven = price > other ? Math.ceil(teacher / (price - other)) : Infinity;
    return { costPerStudent, contribution, margin, breakEven };
  }, [price, teacher, other, classSize]);

  const marginOk = econ.margin >= targetMargin;

  async function research() {
    setLoading(true);
    setAnalysis(null);
    const timer = setInterval(() => setStep((s) => (s + 1) % THINKING.length), 800);
    try {
      const economics = `price ${price}/unit, cost/student ${econ.costPerStudent.toFixed(1)}, contribution ${econ.contribution.toFixed(1)}, margin ${econ.margin.toFixed(0)}%, break-even ${econ.breakEven} students, target margin ${targetMargin}%`;
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: product.name, campus: product.campus, currentPrice: product.price, market, economics }),
      });
      const data = await res.json();
      setAnalysis(data.analysis);
      setDemo(Boolean(data.demo));
    } finally {
      clearInterval(timer);
      setLoading(false);
      setStep(0);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <PageHeader
        icon={M.icon}
        accent={M.accent}
        glow={M.glow}
        title={M.name}
        tagline={M.tagline}
        status={M.status}
        agent={M.agent}
        right={
          <div className="flex rounded-full border border-line bg-bg-card p-1">
            {(["analyse", "pricelist"] as const).map((mm) => (
              <button key={mm} onClick={() => setMode(mm)} className={`rounded-full px-4 py-1.5 text-sm transition-colors ${mode === mm ? "bg-brand text-white" : "text-ink-soft hover:text-ink"}`}>
                {mm === "analyse" ? "Analyse" : "Price list"}
              </button>
            ))}
          </div>
        }
      />

      {mode === "pricelist" && (
        <div className="animate-rise">
          <Card className="mb-4 p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Target year</span>
                <div className="mt-1 flex gap-1.5">
                  {["2027", "2028", "2029", "2030"].map((y) => (
                    <button
                      key={y}
                      onClick={() => { setYear(y); setOverrides({}); }}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${year === y ? "border-brand/40 bg-brand/10 text-brand-soft" : "border-line text-ink-soft hover:text-ink"}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Uplift % / year</span>
                <input type="number" value={pct} onChange={(e) => { setPct(Number(e.target.value)); setOverrides({}); }} className="mt-1 w-24 rounded-lg border border-line bg-bg-soft px-2.5 py-1.5 text-sm text-ink focus:outline-none" />
              </label>
              <p className="max-w-xs text-xs text-ink-faint">Compounds {pct}%/yr from {BASE_YEAR} → {year} ({yearsAhead} {yearsAhead === 1 ? "year" : "years"}). Non-numeric prices stay as-is; edit any cell to override.</p>
              <div className="ml-auto">
                <ExportMenu title={`ES World Price List ${year}`} html={pricelistHtml} rows={pricelistRows} />
              </div>
            </div>
          </Card>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-ink-faint">
                    <th className="px-4 py-3 font-medium">Programme</th>
                    <th className="px-4 py-3 font-medium">Campus</th>
                    <th className="px-4 py-3 font-medium">{prevYear}</th>
                    <th className="px-4 py-3 font-medium">{year}</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.map((p, i) => (
                    <tr key={p.id} className={i % 2 ? "bg-bg-soft/40" : ""}>
                      <td className="px-4 py-2.5 text-ink">{p.name}</td>
                      <td className="px-4 py-2.5 text-ink-faint">{p.campus}</td>
                      <td className="px-4 py-2.5 text-ink-soft">{p.price}</td>
                      <td className="px-4 py-2">
                        <input value={newPrice(p)} onChange={(e) => setOverrides({ ...overrides, [p.id]: e.target.value })} className="w-full rounded-lg border border-line bg-bg-soft px-2 py-1 font-medium text-brand-soft focus:border-brand/40 focus:outline-none" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      <div className={mode === "pricelist" ? "hidden" : "grid gap-6 lg:grid-cols-2"}>
        {/* Cost inputs + economics */}
        <div className="space-y-4">
          <Card className="p-4">
            <SectionLabel>Programme</SectionLabel>
            <select value={pid} onChange={(e) => onPick(e.target.value)} className="w-full rounded-lg border border-line bg-bg-soft px-2.5 py-2 text-sm text-ink focus:outline-none">
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id} className="bg-bg-soft">{p.name} · {p.campus}</option>
              ))}
            </select>
            <div className="mt-1 text-xs text-ink-faint">List: {product.price}</div>
          </Card>

          <Card className="p-4">
            <SectionLabel>Cost inputs (edit to your numbers)</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <Num label="Price / unit" value={price} onChange={setPrice} />
              <Num label="Teacher cost / class" value={teacher} onChange={setTeacher} />
              <Num label="Other cost / student" value={other} onChange={setOther} />
              <Num label="Class size" value={classSize} onChange={setClassSize} />
              <Num label="Target margin %" value={targetMargin} onChange={setTargetMargin} />
            </div>
            <p className="mt-2 text-[11px] text-ink-faint">Same currency for price & costs. 1-1 courses use class size 1.</p>
          </Card>

          {/* Live unit economics */}
          <Card glow={M.glow} className="p-4">
            <SectionLabel>Unit economics (live)</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              <Metric label="Cost / student" value={econ.costPerStudent.toFixed(0)} />
              <Metric label="Contribution" value={econ.contribution.toFixed(0)} tone={econ.contribution > 0 ? "text-accent-teal" : "text-accent-rose"} />
              <Metric label="Margin" value={`${econ.margin.toFixed(0)}%`} tone={marginOk ? "text-accent-teal" : "text-accent-amber"} />
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-line bg-bg-soft/50 px-3 py-2 text-sm">
              <span className="text-ink-soft">Break-even class size</span>
              <span className="font-semibold text-ink">{econ.breakEven === Infinity ? "—" : `${econ.breakEven} students`}</span>
            </div>
            <div className={`mt-2 text-xs ${marginOk ? "text-accent-teal" : "text-accent-amber"}`}>
              <Icon name={marginOk ? "Check" : "AlertTriangle"} className="mr-1 inline h-3 w-3" />
              {marginOk ? `Clears your ${targetMargin}% target margin.` : `Below your ${targetMargin}% target — raise price or class size.`}
            </div>
          </Card>

          <Card className="p-4">
            <SectionLabel>Target market / region (optional)</SectionLabel>
            <input value={market} onChange={(e) => setMarket(e.target.value)} placeholder="e.g. Dubai group English, or a competitor to compare" className="w-full rounded-lg border border-line bg-bg-soft px-2.5 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none" />
            <Button onClick={research} disabled={loading} className="mt-3">
              {loading ? <><Icon name="Loader2" className="h-4 w-4 animate-spin" /> Researching…</> : <><Icon name="Search" className="h-4 w-4" /> Research the market</>}
            </Button>
          </Card>
        </div>

        {/* Research results */}
        <div>
          <SectionLabel>Market research & recommendation</SectionLabel>
          {loading && (
            <Card glow={M.glow} className="flex h-72 flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15"><Icon name="Tags" className="h-6 w-6 animate-pulse text-brand-soft" /></div>
              <div className="text-sm text-ink-soft">{THINKING[step]}</div>
              <div className="h-1 w-44 overflow-hidden rounded-full bg-bg-hover"><div className="shimmer h-full w-full" /></div>
            </Card>
          )}
          {!loading && !analysis && (
            <Card className="flex h-72 flex-col items-center justify-center gap-3 text-center text-ink-faint">
              <Icon name="Tags" className="h-8 w-8" />
              <div className="text-sm">Enter your costs, then research the market.</div>
              <div className="max-w-xs text-xs">The agent searches live competitor pricing, respects your cost floor, and flags confidence — it never invents a number.</div>
            </Card>
          )}
          {!loading && analysis && (
            <div className="animate-rise space-y-4">
              {demo && (
                <div className="flex items-start gap-2 rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-3 py-2 text-xs text-accent-amber">
                  <Icon name="AlertTriangle" className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Demo mode — add an ANTHROPIC_API_KEY for live research.
                </div>
              )}
              <div className="flex justify-end gap-2">
                <SaveToProgramme kind="Pricing" title={`Pricing — ${product.name}`} getHtml={() => pricingHtml(product.name, analysis)} />
                <ExportMenu
                  title={`Pricing ${product.name}`}
                  html={() => pricingHtml(product.name, analysis)}
                  rows={() => [["Competitor", "Price", "Confidence", "Note"], ...analysis.competitors.map((c) => [c.name, c.price, c.confidence, c.note] as string[])]}
                />
              </div>
              <Card glow={M.glow} className="p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Recommended</div>
                <div className="text-xl font-semibold text-brand-soft">{analysis.recommendedPrice}</div>
                <p className="mt-1 text-sm text-ink-soft">{analysis.recommendation}</p>
                <p className="mt-2 text-xs text-ink-faint">{analysis.positioning}</p>
              </Card>

              <Card className="p-4">
                <SectionLabel>Rationale chain</SectionLabel>
                <ul className="space-y-1.5">
                  {analysis.rationale.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink-soft"><Icon name="ChevronRight" className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" />{r}</li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4">
                <SectionLabel>Competitors (researched)</SectionLabel>
                <div className="space-y-2">
                  {analysis.competitors.map((c, i) => (
                    <div key={i} className="rounded-lg border border-line bg-bg-soft/50 p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-ink">{c.name}</span>
                        <span className="text-sm text-brand-soft">{c.price}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <ConfidenceBadge level={c.confidence} />
                        <span className="text-[11px] text-ink-faint">{c.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-4">
                  <SectionLabel>Market trends</SectionLabel>
                  <div className="space-y-2">
                    {analysis.trends.map((t, i) => (
                      <div key={i} className="text-sm text-ink-soft"><ConfidenceBadge level={t.confidence} /> <span className="ml-1">{t.note}</span></div>
                    ))}
                  </div>
                </Card>
                <Card className="p-4">
                  <SectionLabel>Risks</SectionLabel>
                  <ul className="space-y-1.5">
                    {analysis.risks.map((r, i) => (
                      <li key={i} className="flex gap-2 text-sm text-ink-soft"><Icon name="AlertTriangle" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-rose" />{r}</li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-line bg-bg-soft px-2.5 py-1.5 text-sm text-ink focus:border-brand/40 focus:outline-none" />
    </label>
  );
}
function Metric({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-lg border border-line bg-bg-soft/50 p-2 text-center">
      <div className={`text-lg font-semibold ${tone || "text-ink"}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-ink-faint">{label}</div>
    </div>
  );
}
