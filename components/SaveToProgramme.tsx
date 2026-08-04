"use client";

import { useEffect, useRef, useState } from "react";
import { useProducts, useItems, newId } from "@/lib/store";
import { Icon } from "./Icon";

/** Saves a module's output into a programme's dossier (Knowledge → Saved work). */
export function SaveToProgramme({ kind, title, getHtml }: { kind: string; title: string; getHtml: () => string }) {
  const { products } = useProducts();
  const { add } = useItems();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function save(pid: string, pname: string) {
    add({ id: newId(), productId: pid, kind, title: title || kind, html: getHtml() });
    setSaved(pname);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative no-print">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-soft px-3 py-1.5 text-xs font-medium text-ink-soft transition-all hover:border-brand/40 hover:text-ink"
      >
        <Icon name={saved ? "Check" : "Library"} className="h-3.5 w-3.5" />
        {saved ? `Saved to ${saved}` : "Save to programme"}
        <Icon name="ChevronDown" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 max-h-72 w-64 overflow-y-auto rounded-xl border border-line bg-bg-card p-1 shadow-xl animate-rise">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => save(p.id, p.name)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-soft transition-colors hover:bg-bg-hover hover:text-ink"
            >
              <Icon name="Circle" className="h-1.5 w-1.5 shrink-0 fill-current text-brand-soft" />
              <span className="flex-1 truncate">{p.name}</span>
              <span className="text-[10px] text-ink-faint">{p.campus}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
