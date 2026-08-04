"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { exportPDF, exportDOC, exportXLS } from "@/lib/export";

/**
 * Drop-in export control for any module output.
 * Provide `html` (for PDF + Word) and optionally `rows` (for Excel).
 */
export function ExportMenu({
  title,
  html,
  rows,
  compact,
}: {
  title: string;
  html: () => string;
  rows?: () => (string | number)[][];
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const item = "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-soft transition-colors hover:bg-bg-hover hover:text-ink";

  return (
    <div ref={ref} className="relative no-print">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-soft px-3 py-1.5 text-xs font-medium text-ink-soft transition-all hover:border-brand/40 hover:text-ink ${compact ? "" : ""}`}
      >
        <Icon name="Download" className="h-3.5 w-3.5" />
        Export
        <Icon name="ChevronDown" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-xl border border-line bg-bg-card p-1 shadow-xl animate-rise">
          <button className={item} onClick={() => { exportPDF(title, html()); setOpen(false); }}>
            <Icon name="FileText" className="h-4 w-4 text-accent-rose" /> PDF
          </button>
          <button className={item} onClick={() => { exportDOC(title, html()); setOpen(false); }}>
            <Icon name="FileText" className="h-4 w-4 text-accent-blue" /> Word (.doc)
          </button>
          {rows && (
            <button className={item} onClick={() => { exportXLS(title, rows()); setOpen(false); }}>
              <Icon name="ClipboardList" className="h-4 w-4 text-accent-teal" /> Excel (.xls)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
