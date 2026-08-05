"use client";

import { useMemo, useState } from "react";
import { getModule } from "@/lib/modules";
import { CATEGORIES, type Product, type Campus, type Category } from "@/lib/knowledge";
import { useProducts, useItems, newId } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionLabel, Button } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ExportMenu } from "@/components/ExportMenu";
import { H, exportPDF } from "@/lib/export";

const M = getModule("knowledge")!;
const CAMPUSES = ["All", "Dubai", "London"] as const;
const STAGES = ["Flagship", "Growth", "Established", "New", "Promo"];
const CAMPUS_OPTS: Campus[] = ["Dubai", "London", "Online"];
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "course", label: "Course" },
  { id: "market", label: "Market" },
  { id: "files", label: "Files & work" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const stageCls: Record<string, string> = {
  Flagship: "text-brand-soft border-brand/30 bg-brand/10",
  Growth: "text-accent-teal border-accent-teal/30 bg-accent-teal/10",
  Established: "text-accent-blue border-accent-blue/30 bg-accent-blue/10",
  Promo: "text-accent-amber border-accent-amber/30 bg-accent-amber/10",
  New: "text-ink-soft border-line bg-bg-hover",
};
const healthColor = (h: number) => (h >= 78 ? "text-accent-teal" : h >= 65 ? "text-accent-amber" : "text-accent-rose");
const inp = "w-full rounded-xl border border-line bg-bg-soft px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand/40 focus:outline-none";
const lines = (s: string) => s.split("\n").map((t) => t.trim()).filter(Boolean);

function blank(): Product {
  return { id: newId(), name: "", campus: "Dubai", category: "English", stage: "New", oneLiner: "", audience: "", levels: "", format: "", price: "On request", tags: [], health: 70, assets: 0, updated: "2026" };
}

export default function KnowledgePage() {
  const { products, add, update, remove } = useProducts();
  const { items: savedItems, remove: removeItem } = useItems();
  const [campus, setCampus] = useState<(typeof CAMPUSES)[number]>("All");
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [viewing, setViewing] = useState<Product | null>(null);
  const [tab, setTab] = useState<TabId>("overview");
  const [draft, setDraft] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (campus === "All" || p.campus === campus) &&
          (cat === "All" || p.category === cat) &&
          (q === "" || p.name.toLowerCase().includes(q.toLowerCase()) || p.tags.join(" ").includes(q.toLowerCase()))
      ),
    [products, campus, cat, q]
  );

  function openView(p: Product) { setViewing(p); setTab("overview"); }
  function openNew() { setDraft(blank()); setIsNew(true); setViewing(null); }
  function openEdit(p: Product) { setDraft({ ...p }); setIsNew(false); setViewing(null); }
  function save() { if (!draft?.name.trim()) return; if (isNew) add(draft); else update(draft.id, draft); setDraft(null); }

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <PageHeader
        icon={M.icon} accent={M.accent} glow={M.glow} title={M.name}
        tagline="All your courses in one place — full detail, personas and documents."
        status={M.status} agent={M.agent}
        right={
          <div className="flex items-center gap-2">
            <ExportMenu
              title="ES World Catalogue"
              html={() => H.brandTitle("Course Catalogue — ES World", "Dubai & London") + "<table><tr><th>Programme</th><th>Campus</th><th>Category</th><th>Levels</th><th>Price</th></tr>" + products.map((p) => `<tr><td>${p.name}</td><td>${p.campus}</td><td>${p.category}</td><td>${p.levels || ""}</td><td>${p.price}</td></tr>`).join("") + "</table>"}
              rows={() => [["Programme", "Campus", "Category", "Levels", "Format", "Price"], ...products.map((p) => [p.name, p.campus, p.category, p.levels || "", p.format, p.price] as string[])]}
            />
            <Button onClick={openNew}><Icon name="Plus" className="h-4 w-4" /> New</Button>
          </div>
        }
      />

      {!viewing && !draft && (
        <>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-line bg-bg-card p-1">
          {CAMPUSES.map((c) => (
            <button key={c} onClick={() => setCampus(c)} className={`rounded-full px-4 py-1.5 text-sm transition-colors ${campus === c ? "bg-brand text-white" : "text-ink-soft hover:text-ink"}`}>{c}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["All", ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${cat === c ? "border-brand/40 bg-brand/10 text-brand-soft" : "border-line text-ink-faint hover:text-ink-soft"}`}>{c}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 rounded-full border border-line bg-bg-card px-4 py-1.5">
          <Icon name="Search" className="h-4 w-4 text-ink-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-36 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <button key={p.id} onClick={() => openView(p)} className="text-left">
            <Card className="hover-lift group flex h-full flex-col p-5 hover:border-brand/40">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-bg-hover px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">{p.campus}</span>
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${stageCls[p.stage]}`}>{p.stage}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-ink">{p.name || "Untitled"}</h3>
              <div className="mt-1 text-xs font-medium text-brand-soft">{p.category}</div>
              <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.oneLiner}</p>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <span className="text-sm font-semibold text-ink">{p.price}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-ink-faint"><Icon name="Circle" className={`h-2 w-2 fill-current ${healthColor(p.health)}`} /> {p.health}</span>
              </div>
            </Card>
          </button>
        ))}
      </div>
      {filtered.length === 0 && <div className="py-16 text-center text-sm text-ink-faint">Nothing here yet — hit “New”.</div>}
        </>
      )}

      {/* Detail — full page */}
      {viewing && (
        <div className="animate-rise">
          <button onClick={() => setViewing(null)} className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink">
            <Icon name="ArrowRight" className="h-4 w-4 rotate-180" /> Back to catalogue
          </button>
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${stageCls[viewing.stage]}`}>{viewing.stage}</span>
                <span className="text-xs text-ink-faint">{viewing.campus} · {viewing.category}</span>
              </div>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-ink">{viewing.name}</h2>
              <p className="mt-1 max-w-md text-sm text-ink-soft">{viewing.oneLiner}</p>
            </div>
            <div className="shrink-0 rounded-2xl border border-brand/25 bg-brand/10 px-4 py-3 text-right">
              <div className="text-lg font-bold text-brand-soft">{viewing.price}</div>
              <div className="text-[11px] text-ink-faint">health {viewing.health}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex gap-5 border-b border-line">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`-mb-px border-b-2 pb-2.5 text-sm font-medium transition-colors ${tab === t.id ? "border-brand text-ink" : "border-transparent text-ink-faint hover:text-ink-soft"}`}>{t.label}</button>
            ))}
          </div>

          <div className="mt-5 min-h-[10rem]">
            {tab === "overview" && <OverviewTab p={viewing} />}
            {tab === "course" && <CourseTab p={viewing} />}
            {tab === "market" && <MarketTab p={viewing} />}
            {tab === "files" && <FilesTab p={viewing} items={savedItems.filter((i) => i.productId === viewing.id)} removeItem={removeItem} />}
          </div>

          <div className="mt-6 flex gap-2 border-t border-line pt-5">
            <Button variant="subtle" onClick={() => openEdit(viewing)}><Icon name="FileText" className="h-4 w-4" /> Edit</Button>
            <button onClick={() => { remove(viewing.id); setViewing(null); }} className="inline-flex items-center gap-1.5 rounded-full border border-accent-rose/30 px-4 py-2 text-sm text-accent-rose transition-colors hover:bg-accent-rose/10">
              <Icon name="Trash2" className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Editor — full page */}
      {draft && (
        <div className="animate-rise">
          <button onClick={() => setDraft(null)} className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink">
            <Icon name="ArrowRight" className="h-4 w-4 rotate-180" /> Back
          </button>
          <h2 className="text-2xl font-bold text-ink">{isNew ? "New programme" : "Edit programme"}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2"><Fld label="Name"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inp} /></Fld></div>
            <Fld label="Campus"><select value={draft.campus} onChange={(e) => setDraft({ ...draft, campus: e.target.value as Campus })} className={inp}>{CAMPUS_OPTS.map((c) => <option key={c} className="bg-bg-soft">{c}</option>)}</select></Fld>
            <Fld label="Category"><select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })} className={inp}>{CATEGORIES.map((c) => <option key={c} className="bg-bg-soft">{c}</option>)}</select></Fld>
            <Fld label="Stage"><select value={draft.stage} onChange={(e) => setDraft({ ...draft, stage: e.target.value as Product["stage"] })} className={inp}>{STAGES.map((s) => <option key={s} className="bg-bg-soft">{s}</option>)}</select></Fld>
            <Fld label="Health"><input type="number" value={draft.health} onChange={(e) => setDraft({ ...draft, health: Number(e.target.value) })} className={inp} /></Fld>
            <div className="sm:col-span-2"><Fld label="One-liner"><input value={draft.oneLiner} onChange={(e) => setDraft({ ...draft, oneLiner: e.target.value })} className={inp} /></Fld></div>
            <div className="sm:col-span-2"><Fld label="Overview"><textarea value={draft.overview || ""} onChange={(e) => setDraft({ ...draft, overview: e.target.value })} className={`${inp} h-20 resize-none`} /></Fld></div>
            <div className="sm:col-span-2"><Fld label="Target audience"><input value={draft.audience} onChange={(e) => setDraft({ ...draft, audience: e.target.value })} className={inp} /></Fld></div>
            <Fld label="Levels"><input value={draft.levels || ""} onChange={(e) => setDraft({ ...draft, levels: e.target.value })} className={inp} /></Fld>
            <Fld label="Price"><input value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} className={inp} /></Fld>
            <Fld label="Schedule"><input value={draft.schedule || ""} onChange={(e) => setDraft({ ...draft, schedule: e.target.value })} className={inp} /></Fld>
            <Fld label="Intakes"><input value={draft.intakes || ""} onChange={(e) => setDraft({ ...draft, intakes: e.target.value })} className={inp} /></Fld>
            <div className="sm:col-span-2"><Fld label="Format"><input value={draft.format} onChange={(e) => setDraft({ ...draft, format: e.target.value })} className={inp} /></Fld></div>
            <div className="sm:col-span-2"><Fld label="Learning outcomes (one per line)"><textarea value={(draft.outcomes || []).join("\n")} onChange={(e) => setDraft({ ...draft, outcomes: lines(e.target.value) })} className={`${inp} h-16 resize-none`} /></Fld></div>
            <div className="sm:col-span-2"><Fld label="Course outline (one per line)"><textarea value={(draft.outline || []).join("\n")} onChange={(e) => setDraft({ ...draft, outline: lines(e.target.value) })} className={`${inp} h-20 resize-none`} /></Fld></div>
            <div className="sm:col-span-2"><Fld label="Enrolment steps (one per line)"><textarea value={(draft.enrolment || []).join("\n")} onChange={(e) => setDraft({ ...draft, enrolment: lines(e.target.value) })} className={`${inp} h-16 resize-none`} /></Fld></div>
            <Fld label="Prerequisites"><input value={draft.prerequisites || ""} onChange={(e) => setDraft({ ...draft, prerequisites: e.target.value })} className={inp} /></Fld>
            <Fld label="Owner"><input value={draft.owner || ""} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} className={inp} /></Fld>
            <Fld label="Study materials"><input value={draft.materials || ""} onChange={(e) => setDraft({ ...draft, materials: e.target.value })} className={inp} /></Fld>
            <Fld label="Assessment"><input value={draft.assessment || ""} onChange={(e) => setDraft({ ...draft, assessment: e.target.value })} className={inp} /></Fld>
            <div className="sm:col-span-2"><Fld label="Accreditation"><input value={draft.accreditation || ""} onChange={(e) => setDraft({ ...draft, accreditation: e.target.value })} className={inp} /></Fld></div>
            <div className="sm:col-span-2"><Fld label="Positioning"><textarea value={draft.positioning || ""} onChange={(e) => setDraft({ ...draft, positioning: e.target.value })} className={`${inp} h-16 resize-none`} /></Fld></div>
            <div className="sm:col-span-2"><Fld label="Why choose (one per line)"><textarea value={(draft.whyChoose || []).join("\n")} onChange={(e) => setDraft({ ...draft, whyChoose: lines(e.target.value) })} className={`${inp} h-16 resize-none`} /></Fld></div>
            <div className="sm:col-span-2"><Fld label="Personas (one per line: Who — need)"><textarea value={(draft.personas || []).map((x) => `${x.who} — ${x.need}`).join("\n")} onChange={(e) => setDraft({ ...draft, personas: lines(e.target.value).map((l) => { const [who, ...rest] = l.split(/\s[—-]\s/); return { who: (who || "").trim(), need: rest.join(" — ").trim() }; }) })} className={`${inp} h-20 resize-none`} /></Fld></div>
            <div className="sm:col-span-2"><Fld label="Tags (comma separated)"><input value={draft.tags.join(", ")} onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} className={inp} /></Fld></div>
          </div>
          <div className="mt-6 flex gap-2 border-t border-line pt-5">
            <Button onClick={save}><Icon name="Check" className="h-4 w-4" /> Save</Button>
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Tabs ---------- */

function OverviewTab({ p }: { p: Product }) {
  const facts: [string, string | undefined][] = [
    ["Levels", p.levels], ["Schedule", p.schedule], ["Format", p.format],
    ["Intakes", p.intakes], ["Prerequisites", p.prerequisites], ["Capacity", p.capacity], ["Owner", p.owner], ["Updated", p.updated],
  ];
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink-soft">{p.overview || p.oneLiner}</p>
      {p.audience && (
        <div className="rounded-2xl border border-brand/25 bg-brand/[0.06] p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-soft">Target audience</div>
          <p className="mt-1 text-sm text-ink">{p.audience}</p>
        </div>
      )}
      <div>
        <SectionLabel>Key facts</SectionLabel>
        <table className="w-full text-sm">
          <tbody>
            {facts.filter(([, v]) => v).map(([k, v]) => (
              <tr key={k} className="border-b border-line last:border-0">
                <td className="w-40 py-2 pr-4 align-top text-ink-faint">{k}</td>
                <td className="py-2 text-ink-soft">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {p.outcomes?.length ? (
        <div>
          <SectionLabel>Learning outcomes</SectionLabel>
          <ul className="space-y-1.5">
            {p.outcomes.map((o, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-soft"><Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-teal" />{o}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function CourseTab({ p }: { p: Product }) {
  const rows: [string, string | undefined][] = [
    ["Prerequisites", p.prerequisites], ["Study materials", p.materials], ["Assessment", p.assessment], ["Accreditation", p.accreditation],
  ];
  return (
    <div className="space-y-5">
      {p.outline?.length ? (
        <div>
          <SectionLabel>Course outline</SectionLabel>
          <table className="w-full overflow-hidden rounded-xl border border-line text-sm">
            <tbody>
              {p.outline.map((m, i) => (
                <tr key={i} className={i % 2 ? "bg-bg-soft/40" : ""}>
                  <td className="w-10 py-2.5 pl-4 pr-2 font-semibold text-brand-soft">{i + 1}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-ink-faint">No outline yet — add one via Edit.</p>
      )}
      {rows.some(([, v]) => v) && (
        <table className="w-full text-sm">
          <tbody>
            {rows.filter(([, v]) => v).map(([k, v]) => (
              <tr key={k} className="border-b border-line last:border-0">
                <td className="w-40 py-2 pr-4 align-top text-ink-faint">{k}</td>
                <td className="py-2 text-ink-soft">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {p.enrolment?.length ? (
        <div>
          <SectionLabel>Enrolment process</SectionLabel>
          <div className="space-y-2">
            {p.enrolment.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-line bg-bg-soft/50 px-3 py-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand-soft">{i + 1}</span>
                <span className="text-sm text-ink-soft">{s}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MarketTab({ p }: { p: Product }) {
  const empty = !p.positioning && !p.personas?.length && !p.whyChoose?.length;
  return (
    <div className="space-y-5">
      {p.positioning && (
        <div className="rounded-2xl border border-line bg-bg-soft/50 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Positioning</div>
          <p className="mt-1 text-sm text-ink">{p.positioning}</p>
        </div>
      )}
      {p.personas?.length ? (
        <div>
          <SectionLabel>Personas</SectionLabel>
          <table className="w-full overflow-hidden rounded-xl border border-line text-sm">
            <thead>
              <tr className="bg-bg-hover text-left text-ink-faint">
                <th className="px-4 py-2 font-medium">Persona</th>
                <th className="px-4 py-2 font-medium">What they need</th>
              </tr>
            </thead>
            <tbody>
              {p.personas.map((x, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="px-4 py-2.5 align-top font-medium text-ink">{x.who}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{x.need}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {p.whyChoose?.length ? (
        <div>
          <SectionLabel>Why choose it</SectionLabel>
          <ul className="space-y-1.5">
            {p.whyChoose.map((w, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-soft"><Icon name="Sparkles" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-soft" />{w}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {empty && <p className="text-sm text-ink-faint">No market info yet — add positioning &amp; personas via Edit.</p>}
    </div>
  );
}

function FilesTab({ p, items, removeItem }: { p: Product; items: { id: string; kind: string; title: string; html?: string }[]; removeItem: (id: string) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <SectionLabel>Documents ({p.documents?.length || 0})</SectionLabel>
        {p.documents?.length ? (
          <div className="grid gap-1.5 sm:grid-cols-2">
            {p.documents.map((d, i) => {
              const inner = (
                <>
                  <Icon name={d.url ? "ArrowUpRight" : "FileText"} className="h-4 w-4 shrink-0 text-brand-soft" />
                  <span className="flex-1 truncate text-sm text-ink-soft">{d.name}</span>
                  <span className="rounded-full bg-bg-hover px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-faint">{d.type}</span>
                </>
              );
              return d.url ? (
                <a key={i} href={d.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/5 px-3 py-2 transition-colors hover:bg-brand/10">{inner}</a>
              ) : (
                <div key={i} className="flex items-center gap-2 rounded-xl border border-line bg-bg-soft/60 px-3 py-2">{inner}</div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-ink-faint">No documents attached.</p>
        )}
      </div>
      <div>
        <SectionLabel>Saved work ({items.length})</SectionLabel>
        {items.length ? (
          <div className="space-y-1.5">
            {items.map((w) => (
              <div key={w.id} className="flex items-center gap-2 rounded-xl border border-line bg-bg-soft/60 px-3 py-2">
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand-soft">{w.kind}</span>
                <span className="flex-1 truncate text-sm text-ink-soft">{w.title}</span>
                {w.html && <button onClick={() => exportPDF(w.title, w.html!)} className="text-xs text-brand-soft hover:underline">Open</button>}
                <button onClick={() => removeItem(w.id)} className="text-ink-faint hover:text-accent-rose"><Icon name="Trash2" className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-faint">Nothing saved yet. Create a brief, quote or flyer and hit “Save to programme”.</p>
        )}
      </div>
    </div>
  );
}

/* ---------- Shared ---------- */

function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
function Drawer({ children, onClose, wide }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className={`h-full w-full ${wide ? "max-w-3xl" : "max-w-md"} overflow-y-auto border-l border-line bg-bg-soft p-8 animate-rise`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="mb-4 rounded-full p-1 text-ink-faint hover:bg-bg-hover hover:text-ink"><Icon name="ArrowRight" className="h-5 w-5" /></button>
        {children}
      </div>
    </div>
  );
}
