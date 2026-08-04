"use client";

import { useMemo, useState } from "react";
import { getModule } from "@/lib/modules";
import { PRODUCTS, CATEGORIES, BRAND, type Product } from "@/lib/knowledge";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionLabel } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ExportMenu } from "@/components/ExportMenu";
import { H } from "@/lib/export";

const M = getModule("knowledge")!;
const CAMPUSES = ["All", "Dubai", "London"] as const;

const stageCls: Record<string, string> = {
  Flagship: "text-brand-soft border-brand/30 bg-brand/10",
  Growth: "text-accent-teal border-accent-teal/30 bg-accent-teal/10",
  Established: "text-accent-blue border-accent-blue/30 bg-accent-blue/10",
  Promo: "text-accent-amber border-accent-amber/30 bg-accent-amber/10",
  New: "text-ink-soft border-line bg-bg-hover",
};

function healthColor(h: number) {
  if (h >= 78) return "text-accent-teal";
  if (h >= 65) return "text-accent-amber";
  return "text-accent-rose";
}

function ProductCard({ p, onOpen }: { p: Product; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="text-left">
      <Card className="group h-full p-5 transition-all hover:-translate-y-0.5 hover:border-brand/30">
        <div className="flex items-start justify-between gap-2">
          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${stageCls[p.stage]}`}>
            {p.stage}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-ink-faint">
            <Icon name="Circle" className={`h-2 w-2 fill-current ${healthColor(p.health)}`} />
            {p.health}
          </span>
        </div>
        <h3 className="mt-3 font-semibold text-ink">{p.name}</h3>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-faint">
          <Icon name="Map" className="h-3 w-3" />
          {p.campus} · {p.category}
          {p.internal && <span className="ml-1 rounded bg-bg-hover px-1 text-[9px] uppercase text-ink-faint">internal</span>}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.oneLiner}</p>
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span className="text-sm font-medium text-brand-soft">{p.price}</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-ink-faint">
            <Icon name="FileText" className="h-3 w-3" /> {p.assets} assets
          </span>
        </div>
      </Card>
    </button>
  );
}

function Detail({ p, onClose }: { p: Product; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-bg-soft p-6 animate-rise"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${stageCls[p.stage]}`}>
              {p.stage}
            </span>
            <h2 className="mt-2 text-xl font-semibold text-ink">{p.name}</h2>
            <div className="text-xs text-ink-faint">{p.campus} · {p.category} · updated {p.updated}</div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-ink-faint hover:bg-bg-hover hover:text-ink">
            <Icon name="ArrowRight" className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-sm text-ink-soft">{p.oneLiner}</p>

        <div className="mt-5 space-y-4">
          <div>
            <SectionLabel>Audience</SectionLabel>
            <p className="text-sm text-ink-soft">{p.audience}</p>
          </div>
          {p.levels && (
            <div>
              <SectionLabel>Levels</SectionLabel>
              <p className="text-sm text-ink-soft">{p.levels}</p>
            </div>
          )}
          <div>
            <SectionLabel>Format</SectionLabel>
            <p className="text-sm text-ink-soft">{p.format}</p>
          </div>
          <div className="rounded-xl border border-brand/25 bg-brand/10 p-3">
            <SectionLabel>Price</SectionLabel>
            <p className="text-lg font-semibold text-brand-soft">{p.price}</p>
            {p.priceNote && <p className="mt-1 text-xs text-ink-soft">{p.priceNote}</p>}
          </div>
          {p.focus && (
            <div>
              <SectionLabel>Focus areas</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {p.focus.map((f) => (
                  <span key={f} className="rounded-full border border-line bg-bg-card px-2.5 py-1 text-xs text-ink-soft">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <SectionLabel>Tags</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="rounded-md bg-bg-hover px-2 py-0.5 text-[11px] text-ink-faint">
                  #{t}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-bg-card p-3 text-xs text-ink-faint">
            <Icon name="Sparkles" className="mr-1 inline h-3 w-3 text-brand-soft" />
            Every module reads from this record. Update it once here and Marketing, Pricing &amp; Briefs stay in sync.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KnowledgePage() {
  const [campus, setCampus] = useState<(typeof CAMPUSES)[number]>("All");
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Product | null>(null);

  const filtered = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (campus === "All" || p.campus === campus) &&
          (cat === "All" || p.category === cat) &&
          (q === "" ||
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.tags.join(" ").includes(q.toLowerCase()))
      ),
    [campus, cat, q]
  );

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <PageHeader
        icon={M.icon}
        accent={M.accent}
        glow={M.glow}
        title={M.name}
        tagline="One source of truth for the whole ES World catalogue — Dubai & London."
        status={M.status}
        agent={M.agent}
        right={
          <ExportMenu
            title="ES World Catalogue"
            html={() =>
              H.brandTitle("Course Catalogue — ES World", "Dubai & London") +
              "<table><tr><th>Programme</th><th>Campus</th><th>Category</th><th>Levels</th><th>Format</th><th>Price</th></tr>" +
              PRODUCTS.map((p) => `<tr><td>${p.name}</td><td>${p.campus}</td><td>${p.category}</td><td>${p.levels || ""}</td><td>${p.format}</td><td>${p.price}</td></tr>`).join("") +
              "</table>"
            }
            rows={() => [
              ["Programme", "Campus", "Category", "Levels", "Format", "Price"],
              ...PRODUCTS.map((p) => [p.name, p.campus, p.category, p.levels || "", p.format, p.price] as (string | number)[]),
            ]}
          />
        }
      />

      {/* Brand proof strip */}
      <div className="mb-6 flex flex-wrap gap-2">
        {BRAND.proof.map((p) => (
          <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-card px-3 py-1 text-xs text-ink-soft">
            <Icon name="ShieldCheck" className="h-3 w-3 text-brand-soft" />
            {p}
          </span>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-line bg-bg-card p-1">
          {CAMPUSES.map((c) => (
            <button
              key={c}
              onClick={() => setCampus(c)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                campus === c ? "bg-brand text-white" : "text-ink-soft hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                cat === c ? "border-brand/40 bg-brand/10 text-brand-soft" : "border-line text-ink-faint hover:text-ink-soft"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 rounded-xl border border-line bg-bg-card px-3 py-1.5">
          <Icon name="Search" className="h-4 w-4 text-ink-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search programmes…"
            className="w-40 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} p={p} onOpen={() => setOpen(p)} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="py-16 text-center text-sm text-ink-faint">No programmes match those filters.</div>
      )}

      {open && <Detail p={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
