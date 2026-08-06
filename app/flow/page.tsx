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
import { ProposalFormView } from "@/components/ProposalFormView";
import { proposalFormToHtml } from "@/lib/proposalForm";
import { Sources, type Source } from "@/components/Sources";
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
      return proposalFormToHtml(v);
    default:
      return "";
  }
}
function flowHtml(artifacts: Record<string, any> | null, plan: any[] | null) {
  let s = H.brandTitle("Launch Flow, ES World");
  if (plan && plan.length) {
    s += H.h2("Who does what") + "<table><tr><th>Person</th><th>Role</th><th>Task</th><th>Step</th></tr>" +
      plan.map((p) => `<tr><td>${p.name}</td><td>${p.role}</td><td>${p.task}</td><td>${p.action}</td></tr>`).join("") + "</table>";
  }
  if (artifacts) for (const [k, v] of Object.entries(artifacts)) s += artifactToHtml(k, v);
  return s;
}

const M = getModule("flow")!;
const DEFAULT_ON: FlowActionKey[] = ["brief", "pricing", "flyer", "website"];
// The producing steps in the order the pipeline runs them.
const STEP_ORDER = ["brief", "pricing", "flyer", "presentation", "website", "proposal"];
const ASSET_TITLE: Record<string, string> = { brief: "Product Brief", pricing: "Pricing", flyer: "Marketing Flyer", presentation: "Presentation", website: "Website Course Page", proposal: "Proposal" };

const THINKING = ["Reading your input…", "Pulling programme facts…", "Drafting this asset…", "Formatting it…", "Almost there…"];

function ArtifactCard({ k, data, onFix, fixing }: { k: string; data: any; onFix?: (kind: string, note: string) => void; fixing?: boolean }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  function submit() {
    if (!note.trim() || !onFix) return;
    onFix(k, note.trim());
    setNote("");
    setOpen(false);
  }
  return (
    <Card glow="51,214,192" className="p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon name={fixing ? "Loader2" : "Check"} className={`h-4 w-4 text-accent-teal ${fixing ? "animate-spin" : ""}`} />
        <h4 className="font-semibold text-ink">{ASSET_TITLE[k] ?? k}</h4>
        {onFix && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="ml-auto inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-faint transition-colors hover:border-accent-rose/40 hover:text-accent-rose"
          >
            <Icon name="Flag" className="h-3 w-3" /> This is wrong
          </button>
        )}
      </div>
      {open && onFix && (
        <div className="mb-3 space-y-2 rounded-xl border border-accent-rose/25 bg-accent-rose/[0.06] p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-accent-rose">What's wrong? Give the correct version, it's remembered</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. The price is wrong, the Diploma is AED 18,900 incl. VAT. And the audience is career-changers 25-40."
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
              <span className="font-medium text-brand-soft">{data.pricePoint}</span>, {data.recommendation}
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
                <div className="text-xs font-semibold text-ink">{i + 1}. {s.title}</div>
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
        {k === "proposal" && <ProposalFormView f={data} />}
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

type Phase = "idle" | "running" | "review" | "done";

export default function FlowPage() {
  const { products, add } = useProducts();
  const { add: addItem } = useItems();
  const [input, setInput] = useState("");
  const [productId, setProductId] = useState("athe-diploma");
  const [newName, setNewName] = useState("");
  const [region, setRegion] = useState("All regions");
  const [selected, setSelected] = useState<FlowActionKey[]>(DEFAULT_ON);
  const { corrections, add: addCorrection, remove: removeCorrection } = useCorrections(productId);

  // step-by-step engine
  const [queue, setQueue] = useState<string[]>([]);
  const [artifacts, setArtifacts] = useState<Record<string, any>>({});
  const [activeIdx, setActiveIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [plan, setPlan] = useState<PlanItem[] | null>(null);
  const [demo, setDemo] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [savedLib, setSavedLib] = useState(false);

  useEffect(() => {
    const stash = typeof window !== "undefined" ? window.localStorage.getItem("es-flow-input") : null;
    if (stash) { setInput(stash); window.localStorage.removeItem("es-flow-input"); }
  }, []);

  const programmeName = products.find((p) => p.id === productId)?.name || (productId === "__new__" ? newName : "") || "New offering";
  const currentKey = queue[activeIdx];
  const isLast = activeIdx >= queue.length - 1;
  const started = phase !== "idle";

  function toggle(k: FlowActionKey) {
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  }

  // Generate exactly ONE step (one cheap API call). Nothing else runs.
  async function generateStep(q: string[], idx: number, extraCorrections?: { kind: string; note: string }[]) {
    const key = q[idx];
    if (!key) return;
    setPhase("running");
    setError(null);
    const timer = setInterval(() => setTick((t) => (t + 1) % THINKING.length), 800);
    try {
      const res = await fetch("/api/flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          productId: productId === "__new__" ? undefined : productId,
          newName: productId === "__new__" ? newName : undefined,
          region,
          actions: [key],
          corrections: extraCorrections ?? corrections.map((c) => ({ kind: c.kind, note: c.note })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setArtifacts((prev) => ({ ...prev, [key]: data.artifacts?.[key] }));
      if (data.plan) setPlan(data.plan);
      setDemo(Boolean(data.demo));
      setSources(data.sources || []);
      setSearched(Boolean(data.searched));
      setPhase("review");
    } catch (e: any) {
      setError(e.message);
      setPhase("review");
    } finally {
      clearInterval(timer);
      setTick(0);
    }
  }

  function start() {
    const q = STEP_ORDER.filter((k) => selected.includes(k as FlowActionKey));
    if (!q.length) { setError("Pick at least one asset to build."); return; }
    setQueue(q);
    setArtifacts({});
    setActiveIdx(0);
    setSavedLib(false);
    generateStep(q, 0);
  }
  function approve() {
    if (isLast) { setPhase("done"); return; }
    const next = activeIdx + 1;
    setActiveIdx(next);
    generateStep(queue, next);
  }
  function redo() {
    generateStep(queue, activeIdx);
  }
  function correctAndRedo(kind: string, note: string) {
    addCorrection({ productId, kind, note });
    generateStep(queue, activeIdx, [...corrections.map((c) => ({ kind: c.kind, note: c.note })), { kind, note }]);
  }
  function stopHere() { setPhase("done"); }
  function restart() { setPhase("idle"); setQueue([]); setArtifacts({}); setActiveIdx(0); setSavedLib(false); setError(null); }

  function saveAll() {
    if (!Object.keys(artifacts).length) return;
    let pid = productId;
    let pname = programmeName;
    if (productId === "__new__") {
      pid = newId();
      add({ id: pid, name: (newName || "New offering").trim(), campus: "Dubai", category: "English", stage: "New", oneLiner: input.slice(0, 140), audience: "", format: "[TBC]", price: "On request", tags: ["new", "from-flow"], health: 60, assets: 0, updated: "2026" } as Product);
      pname = newName || "New offering";
    }
    for (const [k, v] of Object.entries(artifacts)) {
      if (!v) continue;
      const label = KLABEL[k] || k;
      addItem({ id: newId(), productId: pid, kind: label, title: `${label}, ${pname}`, html: artifactToHtml(k, v) });
    }
    setSavedLib(true);
  }

  // group plan by person for the team board
  const board = useMemo(() => {
    if (!plan) return [];
    const map = new Map<string, { role: string; tasks: { task: string; action: string }[] }>();
    for (const it of plan) {
      if (!map.has(it.name)) map.set(it.name, { role: it.role, tasks: [] });
      map.get(it.name)!.tasks.push({ task: it.task, action: it.action });
    }
    return Array.from(map.entries()).map(([name, v]) => ({ name, ...v }));
  }, [plan]);

  const madeCount = Object.values(artifacts).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <PageHeader
        icon={M.icon}
        accent={M.accent}
        glow={M.glow}
        title={M.name}
        tagline="One asset at a time, approve each before the next runs. Nothing extra is generated, so you never pay for output you don't want."
        status={M.status}
        agent={M.agent}
      />

      {/* Setup */}
      <Card className="p-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <SectionLabel>What are we launching / doing?</SectionLabel>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={started}
              placeholder="e.g. Launch the Dubai IELTS group course for the September intake, target Thailand + Japan, promo pricing…"
              className="h-28 w-full resize-none rounded-xl border border-line bg-bg-soft p-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand/40 focus:outline-none disabled:opacity-60"
            />
            {!started && (
              <div className="mt-2 space-y-2">
                <FileDrop onText={(t) => setInput((p) => (p ? p + "\n\n" + t : t))} label="Drop a brief, filled form or notes, any format" />
                <ClarifyPanel input={input} context="ES World launch flow" onApply={(t) => setInput((p) => (p ? p + "\n\n" + t : t))} />
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Programme (the course this is for)</span>
                <select value={productId} onChange={(e) => setProductId(e.target.value)} disabled={started} className="mt-1 w-full rounded-lg border border-line bg-bg-soft px-2.5 py-2 text-sm text-ink focus:outline-none disabled:opacity-60">
                  <option value="__new__" className="bg-bg-soft">＋ New programme (not in catalogue)</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} className="bg-bg-soft">{p.name} · {p.campus}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Target region (sales)</span>
                <select value={region} onChange={(e) => setRegion(e.target.value)} disabled={started} className="mt-1 w-full rounded-lg border border-line bg-bg-soft px-2.5 py-2 text-sm text-ink focus:outline-none disabled:opacity-60">
                  {["All regions", ...SALES_REGIONS].map((r) => (<option key={r} value={r} className="bg-bg-soft">{r}</option>))}
                </select>
              </label>
            </div>
            {productId === "__new__" && !started && (
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New programme name (e.g. Junior Summer Camp, Dubai)" className="w-full rounded-lg border border-accent-teal/40 bg-bg-soft px-2.5 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none" />
            )}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Assets to build (each is a step)</span>
              <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {FLOW_ACTIONS.filter((a) => STEP_ORDER.includes(a.key)).map((a) => (
                  <label key={a.key} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-sm transition-colors ${selected.includes(a.key) ? "border-accent-teal/40 bg-accent-teal/10 text-ink" : "border-line text-ink-soft hover:text-ink"} ${started ? "pointer-events-none opacity-60" : ""}`}>
                    <input type="checkbox" checked={selected.includes(a.key)} onChange={() => toggle(a.key)} className="accent-[#33d6c0]" />
                    {a.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              {phase === "idle" ? (
                <Button onClick={start} disabled={input.trim().length < 4}>
                  <Icon name="Workflow" className="h-4 w-4" /> Start, one step at a time
                </Button>
              ) : (
                <Button variant="subtle" onClick={restart}>
                  <Icon name="ArrowRight" className="h-4 w-4 rotate-180" /> Start over
                </Button>
              )}
            </div>
            {error && <div className="text-sm text-accent-rose">{error}</div>}
          </div>
        </div>

        {corrections.length > 0 && (
          <div className="mt-4 border-t border-line pt-4">
            <div className="mb-2 flex items-center gap-2">
              <Icon name="GraduationCap" className="h-4 w-4 text-brand-soft" />
              <h3 className="text-sm font-semibold text-ink">What Flow has learned</h3>
              <span className="ml-auto text-[11px] text-ink-faint">{corrections.length} correction{corrections.length > 1 ? "s" : ""} · applied every step</span>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {corrections.map((c) => (
                <div key={c.id} className="flex items-start gap-2 rounded-lg border border-line bg-bg-soft/50 px-2.5 py-1.5">
                  <span className="mt-0.5 shrink-0 rounded border border-brand/25 bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand-soft">{c.kind}</span>
                  <span className="flex-1 text-xs text-ink-soft">{c.note}</span>
                  <button onClick={() => removeCorrection(c.id)} className="shrink-0 text-ink-faint hover:text-accent-rose" title="Forget this"><Icon name="Trash2" className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Pipeline */}
      {started && (
        <div className="animate-rise mt-6 space-y-5">
          {demo && (
            <div className="flex items-start gap-2 rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-3 py-2 text-xs text-accent-amber">
              <Icon name="AlertTriangle" className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Demo mode, add an ANTHROPIC_API_KEY for live output.
            </div>
          )}

          {/* Step map */}
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="Workflow" className="h-4 w-4 text-brand-soft" />
              <h3 className="text-sm font-semibold text-ink">Steps</h3>
              <span className="ml-auto text-[11px] text-ink-faint">{madeCount} of {queue.length} approved{phase === "done" ? " · finished" : ""}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {queue.map((k, i) => {
                const done = i < activeIdx || (i === activeIdx && phase === "done");
                const current = i === activeIdx && phase !== "done";
                return (
                  <div key={k} className="flex items-center gap-1.5">
                    <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${done ? "border-accent-teal/40 bg-accent-teal/10 text-accent-teal" : current ? "border-brand/50 bg-brand/10 text-brand-soft" : "border-line text-ink-faint"}`}>
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${done ? "bg-accent-teal text-white" : current ? "bg-brand text-white" : "bg-bg-hover text-ink-faint"}`}>
                        {done ? "✓" : i + 1}
                      </span>
                      {ASSET_TITLE[k]}
                    </div>
                    {i < queue.length - 1 && <Icon name="ChevronRight" className="h-3.5 w-3.5 text-ink-faint" />}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Header actions */}
          <div className="flex flex-wrap items-center gap-3 border-b border-line pb-3">
            <h2 className="text-lg font-semibold text-ink">{programmeName}</h2>
            <div className="ml-auto flex gap-2">
              <Button variant="subtle" onClick={saveAll} disabled={savedLib || madeCount === 0}>
                <Icon name={savedLib ? "Check" : "Boxes"} className="h-4 w-4" />
                {savedLib ? "Saved to Library" : "Save to Library"}
              </Button>
              <ExportMenu
                title="ES World Launch Flow"
                html={() => flowHtml(artifacts, plan)}
                rows={plan ? () => [["Person", "Role", "Task", "Step"], ...plan.map((p) => [p.name, p.role, p.task, p.action] as string[])] : undefined}
              />
            </div>
          </div>

          {/* Approved assets (read-only) */}
          {queue.slice(0, activeIdx).map((k) => (artifacts[k] ? <ArtifactCard key={k} k={k} data={artifacts[k]} /> : null))}

          {/* Current step */}
          {phase === "running" && (
            <Card glow="51,214,192" className="flex h-48 flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-teal/15"><Icon name="Loader2" className="h-6 w-6 animate-spin text-accent-teal" /></div>
              <div className="text-sm text-ink-soft">Building <span className="font-medium text-ink">{ASSET_TITLE[currentKey]}</span>, {THINKING[tick]}</div>
            </Card>
          )}

          {phase === "review" && currentKey && artifacts[currentKey] && (
            <div className="space-y-3">
              <ArtifactCard k={currentKey} data={artifacts[currentKey]} onFix={correctAndRedo} />
              {!demo && (searched || sources.length > 0) && <Sources sources={sources} searched={searched} />}
              <Card className="flex flex-wrap items-center gap-3 p-3">
                <span className="text-sm text-ink-soft">Happy with the {ASSET_TITLE[currentKey]}?</span>
                <div className="ml-auto flex flex-wrap gap-2">
                  <Button onClick={approve}>
                    <Icon name="Check" className="h-4 w-4" /> {isLast ? "Approve & finish" : `Approve & next → ${ASSET_TITLE[queue[activeIdx + 1]]}`}
                  </Button>
                  <Button variant="subtle" onClick={redo}><Icon name="Loader2" className="h-4 w-4" /> Redo this step</Button>
                  {!isLast && <button onClick={stopHere} className="rounded-full px-3 py-2 text-sm text-ink-faint hover:text-ink">Stop here</button>}
                </div>
              </Card>
            </div>
          )}

          {phase === "review" && currentKey && !artifacts[currentKey] && (
            <Card className="flex flex-wrap items-center gap-3 p-4">
              <Icon name="AlertTriangle" className="h-4 w-4 text-accent-rose" />
              <span className="text-sm text-ink-soft">{error || "That step didn't return anything."}</span>
              <Button variant="subtle" onClick={redo} className="ml-auto"><Icon name="Loader2" className="h-4 w-4" /> Try again</Button>
            </Card>
          )}

          {phase === "done" && (
            <Card glow="51,214,192" className="flex flex-wrap items-center gap-3 p-4">
              <Icon name="Check" className="h-5 w-5 text-accent-teal" />
              <span className="text-sm text-ink">Finished, {madeCount} asset{madeCount === 1 ? "" : "s"} approved. Save them to the Library, or start over.</span>
              <Button variant="subtle" onClick={restart} className="ml-auto">New flow</Button>
            </Card>
          )}

          {/* Requests & assets table */}
          {madeCount > 0 && (
            <Card className="p-0">
              <div className="border-b border-line px-4 py-3"><SectionLabel>Every request &amp; the asset it produced</SectionLabel></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wide text-ink-faint">
                      <th className="px-4 py-2 text-left font-semibold">#</th>
                      <th className="px-3 py-2 text-left font-semibold">Step</th>
                      <th className="px-3 py-2 text-left font-semibold">Request</th>
                      <th className="px-3 py-2 text-left font-semibold">Asset</th>
                      <th className="px-4 py-2 text-right font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((k, i) => {
                      const has = Boolean(artifacts[k]);
                      const done = i < activeIdx || (i === activeIdx && phase === "done");
                      const current = i === activeIdx && phase !== "done";
                      return (
                        <tr key={k} className="border-t border-line">
                          <td className="px-4 py-2.5 font-mono text-ink-faint">{i + 1}</td>
                          <td className="px-3 py-2.5 text-ink">{ASSET_TITLE[k]}</td>
                          <td className="px-3 py-2.5 text-ink-soft">Make the {ASSET_TITLE[k].toLowerCase()} for {programmeName}</td>
                          <td className="px-3 py-2.5 text-ink-soft">{has ? "✓ created" : ", "}</td>
                          <td className="px-4 py-2.5 text-right">
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${done ? "bg-accent-teal/15 text-accent-teal" : current ? "bg-brand/15 text-brand-soft" : "bg-bg-hover text-ink-faint"}`}>
                              {done ? "APPROVED" : current ? (phase === "running" ? "BUILDING" : "REVIEW") : "PENDING"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Team board when finished */}
          {phase === "done" && board.length > 0 && (
            <Card className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <Icon name="Users" className="h-4 w-4 text-brand-soft" />
                <h3 className="font-semibold text-ink">Who does what</h3>
                <span className="ml-auto text-[11px] text-ink-faint">{board.length} people</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {board.map((b) => (
                  <div key={b.name} className="rounded-xl border border-line bg-bg-soft/50 p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand-soft">{b.name.slice(0, 2)}</div>
                      <div className="min-w-0"><div className="truncate text-sm font-medium text-ink">{b.name}</div><div className="truncate text-[11px] text-ink-faint">{b.role}</div></div>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {b.tasks.map((t, i) => (<li key={i} className="flex gap-2 text-xs text-ink-soft"><Icon name="ClipboardList" className="mt-0.5 h-3 w-3 shrink-0 text-accent-teal" /><span>{t.task}</span></li>))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
