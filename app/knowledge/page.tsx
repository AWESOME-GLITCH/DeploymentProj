"use client";

import { useMemo, useState } from "react";
import { getModule } from "@/lib/modules";
import { CATEGORIES, BRAND, type Product, type Campus, type Category } from "@/lib/knowledge";
import { useProducts, newId } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionLabel, Button } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ExportMenu } from "@/components/ExportMenu";
import { H } from "@/lib/export";

const M = getModule("knowledge")!;
const CAMPUSES = ["All", "Dubai", "London"] as const;
const STAGES = ["Flagship", "Growth", "Established", "New", "Promo"];
const CAMPUS_OPTS: Campus[] = ["Dubai", "London", "Online"];

const stageCls: Record<string, string> = {
  Flagship: "text-brand-soft border-brand/30 bg-brand/10",
  Growth: "text-accent-teal border-accent-teal/30 bg-accent-teal/10",
  Established: "text-accent-blue border-accent-blue/30 bg-accent-blue/10",
  Promo: "text-accent-amber border-accent-amber/30 bg-accent-amber/10",
  New: "text-ink-soft border-line bg-bg-hover",
};

function healthColor(h: number) {
  return h >= 78 ? "text-accent-teal" : h >= 65 ? "text-accent-amber" : "text-accent-rose";
}

function blank(): Product {
  return { id: newId(), name: "", campus: "Dubai", category: "English", stage: "New", oneLiner: "", audience: "", levels: "", format: "", price: "On request", tags: [], health: 70, assets: 0, updated: "2026" };
}

export default function KnowledgePage() {
  const { products, add, update, remove } = useProducts();
  const [campus, setCampus] = useState<(typeof CAMPUSES)[number]>("All");
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [viewing, setViewing] = useState<Product | null>(null);
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

  function openNew() {
    setDraft(blank());
    setIsNew(true);
    setViewing(null);
  }
  function openEdit(p: Product) {
    setDraft({ ...p });
    setIsNew(false);
    setViewing(null);
  }
  function save() {
    if (!draft || !draft.name.trim()) return;
    if (isNew) add(draft);
    else update(draft.id, draft);
    setDraft(null);
  }
  function del(p: Product) {
    remove(p.id);
    setViewing(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <PageHeader
        icon={M.icon}
        accent={M.accent}
        glow={M.glow}
        title={M.name}
        tagline="All your courses in one place — searchable and editable."
        status={M.status}
        agent={M.agent}
        right={
          <div className="flex items-center gap-2">
            <ExportMenu
              title="ES World Catalogue"
              html={() =>
                H.brandTitle("Course Catalogue — ES World", "Dubai & London") +
                "<table><tr><th>Programme</th><th>Campus</th><th>Category</th><th>Levels</th><th>Price</th></tr>" +
                products.map((p) => `<tr><td>${p.name}</td><td>${p.campus}</td><td>${p.category}</td><td>${p.levels || ""}</td><td>${p.price}</td></tr>`).join("") +
                "</table>"
              }
              rows={() => [["Programme", "Campus", "Category", "Levels", "Format", "Price"], ...products.map((p) => [p.name, p.campus, p.category, p.levels || "", p.format, p.price] as string[])]}
            />
            <Button onClick={openNew}>
              <Icon name="Plus" className="h-4 w-4" /> New
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-line bg-bg-card p-1">
          {CAMPUSES.map((c) => (
            <button key={c} onClick={() => setCampus(c)} className={`rounded-full px-4 py-1.5 text-sm transition-colors ${campus === c ? "bg-brand text-white" : "text-ink-soft hover:text-ink"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["All", ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${cat === c ? "border-brand/40 bg-brand/10 text-brand-soft" : "border-line text-ink-faint hover:text-ink-soft"}`}>
              {c}
            </button>
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
          <button key={p.id} onClick={() => setViewing(p)} className="text-left">
            <Card className="hover-lift group h-full p-5 hover:border-brand/40">
              <div className="flex items-start justify-between gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${stageCls[p.stage]}`}>{p.stage}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-ink-faint">
                  <Icon name="Circle" className={`h-2 w-2 fill-current ${healthColor(p.health)}`} /> {p.health}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-ink">{p.name || "Untitled"}</h3>
              <div className="mt-0.5 text-[11px] text-ink-faint">{p.campus} · {p.category}</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.oneLiner}</p>
              <div className="mt-4 border-t border-line pt-3 text-sm font-medium text-brand-soft">{p.price}</div>
            </Card>
          </button>
        ))}
      </div>
      {filtered.length === 0 && <div className="py-16 text-center text-sm text-ink-faint">Nothing here yet — hit “New”.</div>}

      {/* View drawer */}
      {viewing && (
        <Drawer wide onClose={() => setViewing(null)}>
          <div className="flex items-start justify-between">
            <div>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${stageCls[viewing.stage]}`}>{viewing.stage}</span>
              <h2 className="mt-2 text-2xl font-bold text-ink">{viewing.name}</h2>
              <div className="text-xs text-ink-faint">{viewing.campus} · {viewing.category} · updated {viewing.updated}</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{viewing.overview || viewing.oneLiner}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand/25 bg-brand/10 p-3 sm:col-span-2">
              <SectionLabel>Price</SectionLabel>
              <p className="text-lg font-semibold text-brand-soft">{viewing.price}</p>
              {viewing.priceNote && <p className="mt-1 text-xs text-ink-soft">{viewing.priceNote}</p>}
            </div>

            {viewing.audience && <div className="sm:col-span-2"><KV label="Who it's for">{viewing.audience}</KV></div>}
            {viewing.levels && <KV label="Levels">{viewing.levels}</KV>}
            {viewing.schedule && <KV label="Schedule">{viewing.schedule}</KV>}
            <KV label="Format">{viewing.format}</KV>
            {viewing.intakes && <KV label="Intakes">{viewing.intakes}</KV>}
            {viewing.prerequisites && <KV label="Prerequisites">{viewing.prerequisites}</KV>}
            {viewing.capacity && <KV label="Capacity">{viewing.capacity}</KV>}

            {viewing.outcomes?.length ? <div className="sm:col-span-2"><Bul label="Learning outcomes" items={viewing.outcomes} /></div> : null}
            {viewing.outline?.length ? <div><Bul label="Course outline" items={viewing.outline} /></div> : null}
            {viewing.whyChoose?.length ? <div><Bul label="Why choose it" items={viewing.whyChoose} /></div> : null}
            {viewing.enrolment?.length ? <div className="sm:col-span-2"><Bul label="Enrolment process" items={viewing.enrolment} numbered /></div> : null}
            {viewing.materials && <KV label="Study materials">{viewing.materials}</KV>}
            {viewing.assessment && <KV label="Assessment & certification">{viewing.assessment}</KV>}
            {viewing.accreditation && <div className="sm:col-span-2"><KV label="Accreditation">{viewing.accreditation}</KV></div>}
            {viewing.owner && <KV label="Owner">{viewing.owner}</KV>}

            {viewing.focus && (
              <div className="flex flex-wrap gap-1.5 sm:col-span-2">
                {viewing.focus.map((f) => <span key={f} className="rounded-full border border-line bg-bg-card px-2.5 py-1 text-xs text-ink-soft">{f}</span>)}
              </div>
            )}

            {viewing.documents?.length ? (
              <div className="sm:col-span-2">
                <SectionLabel>Documents ({viewing.documents.length})</SectionLabel>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {viewing.documents.map((d, i) => {
                    const inner = (
                      <>
                        <Icon name={d.url ? "ArrowUpRight" : "FileText"} className="h-4 w-4 shrink-0 text-brand-soft" />
                        <span className="flex-1 truncate text-sm text-ink-soft">{d.name}</span>
                        <span className="rounded-full bg-bg-hover px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-faint">{d.type}</span>
                      </>
                    );
                    return d.url ? (
                      <a key={i} href={d.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/5 px-3 py-2 transition-colors hover:bg-brand/10">
                        {inner}
                      </a>
                    ) : (
                      <div key={i} className="flex items-center gap-2 rounded-xl border border-line bg-bg-soft/60 px-3 py-2">{inner}</div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
          <div className="mt-6 flex gap-2">
            <Button variant="subtle" onClick={() => openEdit(viewing)}><Icon name="FileText" className="h-4 w-4" /> Edit</Button>
            <button onClick={() => del(viewing)} className="inline-flex items-center gap-1.5 rounded-full border border-accent-rose/30 px-4 py-2 text-sm text-accent-rose transition-colors hover:bg-accent-rose/10">
              <Icon name="Trash2" className="h-4 w-4" /> Delete
            </button>
          </div>
        </Drawer>
      )}

      {/* Editor drawer */}
      {draft && (
        <Drawer onClose={() => setDraft(null)}>
          <h2 className="text-2xl font-bold text-ink">{isNew ? "New programme" : "Edit programme"}</h2>
          <div className="mt-4 space-y-3">
            <Fld label="Name"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inp} /></Fld>
            <div className="grid grid-cols-2 gap-3">
              <Fld label="Campus"><select value={draft.campus} onChange={(e) => setDraft({ ...draft, campus: e.target.value as Campus })} className={inp}>{CAMPUS_OPTS.map((c) => <option key={c} className="bg-bg-soft">{c}</option>)}</select></Fld>
              <Fld label="Category"><select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })} className={inp}>{CATEGORIES.map((c) => <option key={c} className="bg-bg-soft">{c}</option>)}</select></Fld>
              <Fld label="Stage"><select value={draft.stage} onChange={(e) => setDraft({ ...draft, stage: e.target.value as Product["stage"] })} className={inp}>{STAGES.map((s) => <option key={s} className="bg-bg-soft">{s}</option>)}</select></Fld>
              <Fld label="Health"><input type="number" value={draft.health} onChange={(e) => setDraft({ ...draft, health: Number(e.target.value) })} className={inp} /></Fld>
            </div>
            <Fld label="One-liner"><textarea value={draft.oneLiner} onChange={(e) => setDraft({ ...draft, oneLiner: e.target.value })} className={`${inp} h-16 resize-none`} /></Fld>
            <Fld label="Audience"><input value={draft.audience} onChange={(e) => setDraft({ ...draft, audience: e.target.value })} className={inp} /></Fld>
            <div className="grid grid-cols-2 gap-3">
              <Fld label="Levels"><input value={draft.levels || ""} onChange={(e) => setDraft({ ...draft, levels: e.target.value })} className={inp} /></Fld>
              <Fld label="Price"><input value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} className={inp} /></Fld>
            </div>
            <Fld label="Format"><input value={draft.format} onChange={(e) => setDraft({ ...draft, format: e.target.value })} className={inp} /></Fld>
            <Fld label="Tags (comma separated)"><input value={draft.tags.join(", ")} onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} className={inp} /></Fld>

            <div className="pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-soft">Detail</div>
            <Fld label="Overview"><textarea value={draft.overview || ""} onChange={(e) => setDraft({ ...draft, overview: e.target.value })} className={`${inp} h-20 resize-none`} /></Fld>
            <Fld label="Price note"><input value={draft.priceNote || ""} onChange={(e) => setDraft({ ...draft, priceNote: e.target.value })} className={inp} /></Fld>
            <div className="grid grid-cols-2 gap-3">
              <Fld label="Schedule"><input value={draft.schedule || ""} onChange={(e) => setDraft({ ...draft, schedule: e.target.value })} className={inp} /></Fld>
              <Fld label="Intakes"><input value={draft.intakes || ""} onChange={(e) => setDraft({ ...draft, intakes: e.target.value })} className={inp} /></Fld>
              <Fld label="Prerequisites"><input value={draft.prerequisites || ""} onChange={(e) => setDraft({ ...draft, prerequisites: e.target.value })} className={inp} /></Fld>
              <Fld label="Owner"><input value={draft.owner || ""} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} className={inp} /></Fld>
            </div>
            <Fld label="Learning outcomes (one per line)"><textarea value={(draft.outcomes || []).join("\n")} onChange={(e) => setDraft({ ...draft, outcomes: lines(e.target.value) })} className={`${inp} h-16 resize-none`} /></Fld>
            <Fld label="Course outline (one per line)"><textarea value={(draft.outline || []).join("\n")} onChange={(e) => setDraft({ ...draft, outline: lines(e.target.value) })} className={`${inp} h-20 resize-none`} /></Fld>
            <Fld label="Why choose (one per line)"><textarea value={(draft.whyChoose || []).join("\n")} onChange={(e) => setDraft({ ...draft, whyChoose: lines(e.target.value) })} className={`${inp} h-16 resize-none`} /></Fld>
            <Fld label="Enrolment steps (one per line)"><textarea value={(draft.enrolment || []).join("\n")} onChange={(e) => setDraft({ ...draft, enrolment: lines(e.target.value) })} className={`${inp} h-16 resize-none`} /></Fld>
            <Fld label="Study materials"><input value={draft.materials || ""} onChange={(e) => setDraft({ ...draft, materials: e.target.value })} className={inp} /></Fld>
            <Fld label="Assessment & certification"><input value={draft.assessment || ""} onChange={(e) => setDraft({ ...draft, assessment: e.target.value })} className={inp} /></Fld>
            <Fld label="Accreditation"><input value={draft.accreditation || ""} onChange={(e) => setDraft({ ...draft, accreditation: e.target.value })} className={inp} /></Fld>
          </div>
          <div className="mt-6 flex gap-2">
            <Button onClick={save}><Icon name="Check" className="h-4 w-4" /> Save</Button>
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
          </div>
        </Drawer>
      )}
    </div>
  );
}

const inp = "w-full rounded-xl border border-line bg-bg-soft px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand/40 focus:outline-none";
const lines = (s: string) => s.split("\n").map((t) => t.trim()).filter(Boolean);

function Bul({ label, items, numbered }: { label: string; items: string[]; numbered?: boolean }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-ink-soft">
            {numbered ? (
              <span className="shrink-0 font-semibold text-brand-soft">{i + 1}.</span>
            ) : (
              <Icon name="Circle" className="mt-1.5 h-1 w-1 shrink-0 fill-current text-brand-soft" />
            )}
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
function KV({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-bg-soft/60 p-3">
      <SectionLabel>{label}</SectionLabel>
      <p className="text-sm text-ink-soft">{children}</p>
    </div>
  );
}
function Drawer({ children, onClose, wide }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className={`h-full w-full ${wide ? "max-w-3xl" : "max-w-md"} overflow-y-auto border-l border-line bg-bg-soft p-8 animate-rise`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="mb-3 rounded-full p-1 text-ink-faint hover:bg-bg-hover hover:text-ink">
          <Icon name="ArrowRight" className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
