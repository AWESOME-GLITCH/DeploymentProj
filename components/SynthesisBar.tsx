"use client";

import { useEffect, useMemo, useState } from "react";
import { useProducts, useItems } from "@/lib/store";
import { useCorrections } from "@/lib/corrections";
import { Icon } from "./Icon";

type Item = { tag: string; tone: "risk" | "pivot" | "ship" | "focus"; text: string };

const TONE: Record<Item["tone"], string> = {
  risk: "bg-accent-rose/15 text-accent-rose",
  pivot: "bg-accent-blue/15 text-accent-blue",
  ship: "bg-accent-teal/15 text-accent-teal",
  focus: "bg-brand/15 text-brand-soft",
};

/** The always-on executive read: a rolling 3-bullet synthesis pinned to every
 *  screen, derived from live state (watch list, corrections taught, saved work). */
export function SynthesisBar() {
  const { products } = useProducts();
  const { items } = useItems();
  const { corrections } = useCorrections();
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => setMounted(true), []);

  const synthesis = useMemo<Item[]>(() => {
    const out: Item[] = [];
    // RISK — lowest-health programme on watch
    const watch = products.filter((p) => p.health < 65).sort((a, b) => a.health - b.health);
    if (watch[0]) out.push({ tag: "RISK", tone: "risk", text: `${watch[0].name} (${watch[0].campus}) health ${watch[0].health} — investigate demand/delivery${watch.length > 1 ? ` · +${watch.length - 1} more on watch` : ""}.` });
    // PIVOT — most recent correction taught
    if (corrections[0]) out.push({ tag: "LEARNED", tone: "pivot", text: `[${corrections[0].kind}] ${corrections[0].note.slice(0, 90)}${corrections[0].note.length > 90 ? "…" : ""}` });
    // SHIP — most recent saved work
    if (items[0]) out.push({ tag: "SAVED", tone: "ship", text: `${items[0].kind} — ${items[0].title} landed in the Library.` });
    // Fillers so there are always three
    if (out.length < 3) {
      const flagship = products.find((p) => p.stage === "Flagship");
      if (flagship && out.length < 3) out.push({ tag: "FOCUS", tone: "focus", text: `${flagship.name} is the flagship — protect and scale it.` });
    }
    if (out.length < 3) out.push({ tag: "TIP", tone: "focus", text: "Press ⌘K anywhere to jump to any module or action." });
    if (out.length < 3) out.push({ tag: "READY", tone: "focus", text: `${products.length} programmes tracked across Dubai & London.` });
    return out.slice(0, 3);
  }, [products, items, corrections]);

  if (!mounted || hidden) return null;

  return (
    <div className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur print:hidden">
      <div className="flex items-center gap-3 px-8 py-2">
        <div className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-teal" />
          24h synthesis
        </div>
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
          {synthesis.map((s, i) => (
            <div key={i} className="flex min-w-0 shrink-0 items-center gap-2 rounded-full border border-line bg-bg-card px-2.5 py-1 md:shrink">
              <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${TONE[s.tone]}`}>{s.tag}</span>
              <span className="truncate text-xs text-ink-soft">{s.text}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setHidden(true)} className="shrink-0 text-ink-faint hover:text-ink" title="Dismiss">
          <Icon name="ChevronRight" className="h-4 w-4 rotate-90" />
        </button>
      </div>
    </div>
  );
}
