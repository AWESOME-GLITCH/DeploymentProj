"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getModule } from "@/lib/modules";
import { useItems, useProducts } from "@/lib/store";
import { exportPDF } from "@/lib/export";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionLabel } from "@/components/ui";
import { Icon } from "@/components/Icon";

const M = getModule("library")!;

export default function LibraryPage() {
  const { items, remove } = useItems();
  const { products } = useProducts();
  const [kind, setKind] = useState("All");

  const nameFor = (pid: string) => products.find((p) => p.id === pid)?.name || "Unassigned";
  const kinds = useMemo(() => Array.from(new Set(items.map((i) => i.kind))), [items]);
  const filtered = kind === "All" ? items : items.filter((i) => i.kind === kind);

  const groups = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const it of filtered) {
      if (!map.has(it.productId)) map.set(it.productId, []);
      map.get(it.productId)!.push(it);
    }
    return Array.from(map.entries())
      .map(([pid, list]) => ({ pid, name: nameFor(pid), list }))
      .sort((a, b) => a.name.localeCompare(b.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, products]);

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <PageHeader
        icon={M.icon}
        accent={M.accent}
        glow={M.glow}
        title={M.name}
        tagline="Everything you've created, in one place — grouped by programme."
        status={M.status}
        agent={M.agent}
        right={
          <div className="text-right">
            <div className="text-2xl font-bold text-ink">{items.length}</div>
            <div className="text-xs text-ink-faint">items saved</div>
          </div>
        }
      />

      {items.length === 0 ? (
        <Card className="flex h-64 flex-col items-center justify-center gap-3 text-center text-ink-faint">
          <Icon name="Boxes" className="h-8 w-8" />
          <div className="text-sm">Nothing saved yet.</div>
          <div className="max-w-sm text-xs">
            Create a brief, quote, flyer, pricing or idea in any module, then hit <span className="text-brand-soft">Save to programme</span> — it lands here.
          </div>
          <Link href="/flow" className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
            Start a launch <Icon name="ArrowRight" className="h-4 w-4" />
          </Link>
        </Card>
      ) : (
        <>
          {/* Kind filter */}
          <div className="mb-6 flex flex-wrap gap-1.5">
            {["All", ...kinds].map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${kind === k ? "border-brand/40 bg-brand/10 text-brand-soft" : "border-line text-ink-faint hover:text-ink-soft"}`}
              >
                {k}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {groups.map((g) => (
              <div key={g.pid}>
                <div className="mb-2 flex items-center gap-2">
                  <Link href="/knowledge" className="text-sm font-semibold text-ink hover:text-brand-soft">
                    {g.name}
                  </Link>
                  <span className="text-xs text-ink-faint">{g.list.length}</span>
                </div>
                <div className="space-y-2">
                  {g.list.map((w) => (
                    <Card key={w.id} className="flex items-center gap-3 p-3">
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand-soft">{w.kind}</span>
                      <span className="flex-1 truncate text-sm text-ink">{w.title}</span>
                      {w.html && (
                        <button onClick={() => exportPDF(w.title, w.html!)} className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft transition-colors hover:border-brand/40 hover:text-ink">
                          Open
                        </button>
                      )}
                      <button onClick={() => remove(w.id)} className="rounded-lg p-1.5 text-ink-faint hover:text-accent-rose">
                        <Icon name="Trash2" className="h-4 w-4" />
                      </button>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
