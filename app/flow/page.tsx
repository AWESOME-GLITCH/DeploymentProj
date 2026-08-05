"use client";

import { useEffect, useMemo, useState } from "react";
import { getModule } from "@/lib/modules";
import type { Product } from "@/lib/knowledge";
import { useProducts, useItems, newId } from "@/lib/store";
import { useCorrections } from "@/lib/corrections";

const KLABEL: Record<string, string> = { brief: "Brief", pricing: "Pricing", flyer: "Flyer", presentation: "Presentation", website: "Website", proposal: "Proposal" };
import { FLOW_ACTIONS, SALES_REGIONS, type FlowActionKey, type PlanItem } from "@/lib/team";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, SectionLabel } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ExportMenu } from "@/components/ExportMenu";
import { FileDrop } from "@/components/FileDrop";
import { ClarifyPanel } from "@/components/ClarifyPanel";
import { FlyerView } from "@/components/FlyerView";
import { flyerToHtml } from "@/lib/flyer";
import { H } from "@/lib/export";

function artifactToHtml(k: string, v: any): string {
  switch (k) {
    case "brief":
      return H.h2("Product Brief") + H.p(v.summary) + H.kv("Problem", v.problem) + H.kv("Audience", v.audience) + H.ul(v.goals || []);
    case "pricing":
      return H.h2("Pricing") + H.kv("Price", v.pricePoint) + H.p(v.recommendation) + H.p(v.rationale) + H.muted(v.marketNote);
    case "flyer":
      return flyerToHtml(v);
    case "presentation":
      return H.h2("Presentation: " + (v.title || "")) + (v.slides || []).map((s: any) => `<h3>${s.title}</h3>` + H.ul(s.points || [])).join("");
    case "website":
      return H.h2("Website Course Page") + (v.fields || []).map((f: any) => `<h3>${f.field}</h3>` + H.p(f.value)).join("");
    case "proposal":
      return H.h2("Proposal") + H.p(v.summary) + H.kv("Opportunity", v.problemOpportunity) + H.kv("Pricing", v.pricing) + H.kv("Recommendation", v.recommendation);
    default:
      return "";
  }
}
function flowHtml(artifacts: Record<string, any> | null, plan: any[] | null) {
  let s = H.brandTitle("Launch Flow — ES World");
  if (plan && plan.length) {
    s += H.h2("Who does what") + "<table><tr><th>Person</th><th>Role</th><th>Task</th><th>Step</th></tr>" +
      plan.map((p) => `<tr><td>${p.name}</td><td>${p.role}</td><td>${p.task}</td><td>${p.action}</td></tr>`).join("") + "</table>";
  }
  if (artifacts) for (const [k, v] of Object.entries(artifacts)) s += artifactToHtml(k, v);
  return s;
}

const M = getModule("flow")!;
const DEFAULT_ON: FlowActionKey[] = ["brief", "pricing", "flyer", "website", "sales"];

const THINKING = [
  "Reading your input…",
  "Pulling programme facts from Knowledge…",
  "Researching the market…",
  "Drafting each asset…",
  "Assigning owners across the team…",
  "Assembling the action board…",
];

function ArtifactCard({ k, data, onFix, fixing }: { k: string; data: any; onFix: (kind: string, note: string) => void; fixing: boolean }) {
  const title: Record<string, string> = {
    brief: "Product Brief",
    pricing: "Pricing",
    flyer: "Marketing Flyer",
    presentation: "Presentation",
    website: "Website Course Page",
    proposal: "Proposal",
  };
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  function submit() {
    if (!note.trim()) return;
    onFix(k, note.trim());
    setNote("");
    setOpen(false);
  }
  return (
    <Card glow="51,214,192" className="p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon name={fixing ? "Loader2" : "Check"} className={`h-4 w-4 text-accent-teal ${fixing ? "animate-spin" : ""}`} />
        <h4 className="font-semibold text-ink">{title[k] ?? k}</h4>
        <button
          onClick={() => setOpen((v) => !v)}
          className="ml-auto inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-faint transition-colors hover:border-accent-rose/40 hover:text-accent-rose"
        >
          <Icon name="Flag" className="h-3 w-3" /> This is wrong
        </button>
      </div>
      {open && (
        <div className="mb-3 space-y-2 rounded-xl border border-accent-rose/25 bg-accent-rose/[0.06] p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-accent-rose">What's wrong? Give the correct version — it's remembered</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. The price is wrong — the Diploma is AED 18,900 incl. VAT, not 'On request'. And the audience is career-changers 25-40, not students."
            className="h-24 w-full resize-none rounded-lg border border-line bg-bg-soft px-2.5 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent-rose/40 focus:outline-none"
          />
          <div className="flex gap-2">
            <button onClick={submit} disabled={fixing || note.trim().length < 3} className="inline-flex items-center gap-1.5 rounded-full bg-accent-rose px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 disabled:opacity-40">
              <Icon name={fixing ? "Loader2" : "Sparkles"} className={`h-3.5 w-3.5 ${fixing ? "animate-spin" : ""}`} /> Save &amp; redo this step
            </button>
            <button onClick={() => { setOpen(false); setNote(""); }} className="rounded-full px-3 py-1.5 text-xs text-ink-faint hover:text-ink">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-2 text-sm text-ink-soft">
        {k === "brief" && (
          <>
            <p>{data.summary}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Mini label="Problem">{data.problem}</Mini>
              <Mini label="Audience">{data.audience}</Mini>
            </div>
            <Bullets items={data.goals} />
          </>
        )}
        {k === "pricing" && (
          <>
            <div className="rounded-lg border border-brand/25 bg-brand/10 p-2 text-ink">
              <span className="font-medium text-brand-soft">{data.pricePoint}</span> — {data.recommendation}
            </div>
            <p>{data.rationale}</p>
            <p className="text-xs text-ink-faint">🔎 {data.marketNote}</p>
          </>
        )}
        {k === "flyer" && <FlyerView f={data} />}
        {k === "presentation" && (
          <>
            <div className="font-medium text-ink">{data.title}</div>
            {(data.slides || []).map((s: any, i: number) => (
              <div key={i} className="rounded-lg border border-line bg-bg-soft/50 p-2">
                <div className="text-xs font-semibold text-ink">
                  {i + 1}. {s.title}
                </div>
                <Bullets items={s.points} small />
              </div>
            ))}
          </>
        )}
        {k === "website" && (
          <div className="space-y-1.5">
            {(data.fields || []).map((f: any, i: number) => (
              <div key={i} className="rounded-lg border border-line bg-bg-soft/50 p-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{f.field}</div>
                <div className="whitespace-pre-line">{f.value}</div>
              </div>
            ))}
          </div>
        )}
        {k === "proposal" && (
          <>
            <p>{data.summary}</p>
            <Mini label="Opportunity">{data.problemOpportunity}</Mini>
            <Mini label="Pricing">{data.pricing}</Mini>
            <div className="rounded-lg border border-accent-teal/25 bg-accent-teal/10 p-2 text-ink">
              <span className="font-medium text-accent-teal">Recommendation: </span>
              {data.recommendation}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

function Mini({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-bg-soft/50 p-2">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{label}</div>
      <div>{children}</div>
    </div>
  );
}
function Bullets({ items, small }: { items?: string[]; small?: boolean }) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-1">
      {items.map((it, i) => (
        <li key={i} className={`flex gap-2 ${small ? "text-xs" : "text-sm"} text-ink-soft`}>
          <Icon name="Circle" className="mt-1.5 h-1 w-1 shrink-0 fill-current text-accent-teal" />
          {it}
        </li>
      ))}
    </ul>
  );
}

export default function FlowPage() {
  const { products, add } = useProducts();
  const { add: addItem } = useItems();
  const [input, setInput] = useState("");
  const [productId, setProductId] = useState("athe-diploma");
  const [newName, setNewName] = useState("");
  const [region, setRegion] = useState("All regions");
  const [saved, setSaved] = useState(false);
  const [savedLib, setSavedLib] = useState(false);
  const { corrections, add: addCorrection, remove: removeCorrection } = useCorrections(productId);
  const [fixingKey, setFixingKey] = useState<string | null>(null);

  // Save the PM's correction, then regenerate just that one artifact with all corrections applied.
  async function fixArtifact(kind: string, note: string) {
    addCorrection({ productId, kind, note });
    setFixingKey(kind);
    const applied = [...corrections.map((c) => ({ kind: c.kind, note: c.note })), { kind, note }];
    try {
      const res = await fetch("/api/flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          productId: productId === "__new__" ? undefined : productId,
          newName: productId === "__new__" ? newName : undefined,
          region,
          actions: [kind],
          corrections: applied,
        }),
      });
      const data = await res.json();
      if (res.ok && data.artifacts && data.artifacts[kind]) {
        setArtifacts((prev) => ({ ...(prev || {}), [kind]: data.artifacts[kind] }));
        setSavedLib(false);
      }
    } catch {
      /* keep the old artifact if the redo fails */
    } finally {
      setFixingKey(null);
    }
  }

  function saveAll() {
    if (!artifacts) return;
    let pid = productId;
    let pname = products.find((p) => p.id === productId)?.name || newName || "New offering";
    if (productId === "__new__") {
      pid = newId();
      add({ id: pid, name: (newName || "New offering").trim(), campus: "Dubai", category: "English", stage: "New", oneLiner: input.slice(0, 140), audience: "", format: "[TBC]", price: "On request", tags: ["new", "from-flow"], health: 60, assets: 0, updated: "2026" });
      pname = newName || "New offering";
    }
    for (const [k, v] of Object.entries(artifacts)) {
      const label = KLABEL[k] || k;
      addItem({ id: newId(), productId: pid, kind: label, title: `${label} — ${pname}`, html: artifactToHtml(k, v) });
    }
    setSavedLib(true);
  }

  function saveNewProgramme() {
    if (!newName.trim()) return;
    const p: Product = {
      id: newId(),
      name: newName.trim(),
      campus: "Dubai",
      category: "English",
      stage: "New",
      oneLiner: input.slice(0, 140),
      audience: "",
      format: "[TBC]",
      price: "On request",
      tags: ["new", "from-flow"],
      health: 60,
      assets: 0,
      updated: "2026",
    };
    add(p);
    setSaved(true);
  }
  const [selected, setSelected] = useState<FlowActionKey[]>(DEFAULT_ON);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [artifacts, setArtifacts] = useState<Record<string, any> | null>(null);
  const [plan, setPlan] = useState<PlanItem[] | null>(null);
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stash = typeof window !== "undefined" ? window.localStorage.getItem("es-flow-input") : null;
    if (stash) {
      setInput(stash);
      window.localStorage.removeItem("es-flow-input");
    }
  }, []);

  function toggle(k: FlowActionKey) {
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  }

  async function run(all: boolean) {
    const actions = all ? FLOW_ACTIONS.map((a) => a.key) : selected;
    if (all) setSelected(actions);
    setLoading(true);
    setError(null);
    setArtifacts(null);
    setPlan(null);
    setSavedLib(false);
    const timer = setInterval(() => setStep((s) => (s + 1) % THINKING.length), 800);
    try {
      const res = await fetch("/api/flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          productId: productId === "__new__" ? undefined : productId,
          newName: productId === "__new__" ? newName : undefined,
          region,
          actions,
          corrections: corrections.map((c) => ({ kind: c.kind, note: c.note })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setArtifacts(data.artifacts || {});
      setPlan(data.plan || []);
      setDemo(Boolean(data.demo));
    } catch (e: any) {
      setError(e.message);
    } finally {
      clearInterval(timer);
      setLoading(false);
      setStep(0);
    }
  }

  // group plan by person
  const board = useMemo(() => {
    if (!plan) return [];
    const map = new Map<string, { role: string; tasks: { task: string; action: string }[] }>();
    for (const it of plan) {
      if (!map.has(it.name)) map.set(it.name, { role: it.role, tasks: [] });
      map.get(it.name)!.tasks.push({ task: it.task, action: it.action });
    }
    return Array.from(map.entries()).map(([name, v]) => ({ name, ...v }));
  }, [plan]);

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <PageHeader
        icon={M.icon}
        accent={M.accent}
        glow={M.glow}
        title={M.name}
        tagline="Feed it once → run any or all steps → get every asset plus who does what."
        status={M.status}
        agent={M.agent}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <SectionLabel>What are we launching / doing?</SectionLabel>
            <Card className="p-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Launch the Dubai IELTS group course for the September intake, target Thailand + Japan, promo pricing…"
                className="h-32 w-full resize-none rounded-xl bg-transparent p-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
              />
            </Card>
            <div className="mt-2 space-y-2">
              <FileDrop onText={(t) => setInput((p) => (p ? p + "\n\n" + t : t))} label="Drop a brief, filled form or notes — any format" />
              <ClarifyPanel input={input} context="ES World launch flow — brief, pricing, flyer, website, sales plan" onApply={(t) => setInput((p) => (p ? p + "\n\n" + t : t))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Programme</span>
              <select value={productId} onChange={(e) => setProductId(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-bg-soft px-2.5 py-1.5 text-sm text-ink focus:outline-none">
                <option value="__new__" className="bg-bg-soft">＋ New programme (not in catalogue)</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} className="bg-bg-soft">{p.name} · {p.campus}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Target region (sales)</span>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-bg-soft px-2.5 py-1.5 text-sm text-ink focus:outline-none">
                {["All regions", ...SALES_REGIONS].map((r) => (
                  <option key={r} value={r} className="bg-bg-soft">{r}</option>
                ))}
              </select>
            </label>
          </div>

          {productId === "__new__" && (
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New programme name (e.g. Junior Summer Camp — Dubai)"
              className="w-full rounded-lg border border-accent-teal/40 bg-bg-soft px-2.5 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            />
          )}

          <div>
            <SectionLabel>Steps to run</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {FLOW_ACTIONS.map((a) => (
                <label key={a.key} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-sm transition-colors ${selected.includes(a.key) ? "border-accent-teal/40 bg-accent-teal/10 text-ink" : "border-line text-ink-soft hover:text-ink"}`}>
                  <input type="checkbox" checked={selected.includes(a.key)} onChange={() => toggle(a.key)} className="accent-[#33d6c0]" />
                  {a.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => run(true)} disabled={loading || input.trim().length < 4}>
              {loading ? <><Icon name="Loader2" className="h-4 w-4 animate-spin" /> Running…</> : <><Icon name="Workflow" className="h-4 w-4" /> Run full flow</>}
            </Button>
            <Button variant="subtle" onClick={() => run(false)} disabled={loading || input.trim().length < 4 || selected.length === 0}>
              Run selected ({selected.length})
            </Button>
          </div>
          {error && <div className="text-sm text-accent-rose">{error}</div>}

          {corrections.length > 0 && (
            <Card className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Icon name="GraduationCap" className="h-4 w-4 text-brand-soft" />
                <h3 className="text-sm font-semibold text-ink">What Flow has learned</h3>
                <span className="ml-auto text-[11px] text-ink-faint">{corrections.length} correction{corrections.length > 1 ? "s" : ""}</span>
              </div>
              <p className="mb-2 text-[11px] text-ink-faint">Applied as ground truth every time you run this programme.</p>
              <ul className="space-y-1.5">
                {corrections.map((c) => (
                  <li key={c.id} className="flex items-start gap-2 rounded-lg border border-line bg-bg-soft/50 px-2.5 py-1.5">
                    <span className="mt-0.5 shrink-0 rounded border border-brand/25 bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand-soft">{c.kind}</span>
                    <span className="flex-1 text-xs text-ink-soft">{c.note}</span>
                    <button onClick={() => removeCorrection(c.id)} className="shrink-0 text-ink-faint hover:text-accent-rose" title="Forget this">
                      <Icon name="Trash2" className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Results */}
        <div>
          {loading && (
            <Card glow="51,214,192" className="flex h-64 flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-teal/15">
                <Icon name="Workflow" className="h-6 w-6 animate-pulse text-accent-teal" />
              </div>
              <div className="text-sm text-ink-soft">{THINKING[step]}</div>
              <div className="h-1 w-44 overflow-hidden rounded-full bg-bg-hover"><div className="shimmer h-full w-full" /></div>
            </Card>
          )}

          {!loading && !artifacts && !plan && (
            <Card className="flex h-64 flex-col items-center justify-center gap-3 text-center text-ink-faint">
              <Icon name="Workflow" className="h-8 w-8" />
              <div className="text-sm">Your assets and the team action board will appear here.</div>
              <div className="max-w-sm text-xs">Pick your steps on the left, then Run full flow — brief, pricing, flyer, website and more, generated together, with an owner for every part.</div>
            </Card>
          )}

          {!loading && (artifacts || plan) && (
            <div className="animate-rise space-y-4">
              {demo && (
                <div className="flex items-start gap-2 rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-3 py-2 text-xs text-accent-amber">
                  <Icon name="AlertTriangle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Demo mode — add an ANTHROPIC_API_KEY for live, researched output.
                </div>
              )}
              <div className="flex justify-end gap-2">
                {productId === "__new__" && newName.trim() && (
                  <Button variant="subtle" onClick={saveNewProgramme} disabled={saved}>
                    <Icon name={saved ? "Check" : "Plus"} className="h-4 w-4" />
                    {saved ? "Saved to Knowledge" : "Save to catalogue"}
                  </Button>
                )}
                <Button variant="subtle" onClick={saveAll} disabled={savedLib}>
                  <Icon name={savedLib ? "Check" : "Boxes"} className="h-4 w-4" />
                  {savedLib ? "Saved to Library" : "Save to Library"}
                </Button>
                <ExportMenu
                  title="ES World Launch Flow"
                  html={() => flowHtml(artifacts, plan)}
                  rows={plan ? () => [["Person", "Role", "Task", "Step"], ...plan.map((p) => [p.name, p.role, p.task, p.action] as string[])] : undefined}
                />
              </div>

              {/* Action board */}
              {board.length > 0 && (
                <Card className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon name="Users" className="h-4 w-4 text-brand-soft" />
                    <h3 className="font-semibold text-ink">Who does what</h3>
                    <span className="ml-auto text-[11px] text-ink-faint">{board.length} people</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {board.map((b) => (
                      <div key={b.name} className="rounded-xl border border-line bg-bg-soft/50 p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand-soft">
                            {b.name.slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-ink">{b.name}</div>
                            <div className="text-[11px] text-ink-faint">{b.role}</div>
                          </div>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {b.tasks.map((t, i) => (
                            <li key={i} className="flex gap-2 text-xs text-ink-soft">
                              <Icon name="ClipboardList" className="mt-0.5 h-3 w-3 shrink-0 text-accent-teal" />
                              <span>{t.task} <span className="text-ink-faint">· {t.action}</span></span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Artifacts */}
              {artifacts &&
                Object.keys(artifacts).length > 0 &&
                Object.entries(artifacts).map(([k, v]) => (
                  <ArtifactCard key={k} k={k} data={v} onFix={fixArtifact} fixing={fixingKey === k} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
