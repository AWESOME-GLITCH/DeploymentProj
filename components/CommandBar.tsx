"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CORE_MODULES, PLANNED_MODULES } from "@/lib/modules";
import { Icon } from "./Icon";

type Cmd = { id: string; label: string; hint?: string; icon: string; group: string; keywords?: string; run: (r: ReturnType<typeof useRouter>) => void };

function buildCommands(): Cmd[] {
  const nav: Cmd[] = [
    { id: "home", label: "Home", icon: "LayoutGrid", group: "Go to", keywords: "dashboard start", run: (r) => r.push("/") },
    ...CORE_MODULES.map((m) => ({ id: m.slug, label: m.name, hint: m.tagline, icon: m.icon, group: "Go to", keywords: m.short, run: (r: any) => r.push(`/${m.slug}`) })),
    ...PLANNED_MODULES.map((m) => ({ id: m.slug, label: m.name, hint: "soon", icon: m.icon, group: "Go to", run: (r: any) => r.push(`/${m.slug}`) })),
  ];
  const actions: Cmd[] = [
    { id: "a-flow", label: "Run a launch flow", icon: "Workflow", group: "Do", keywords: "brief pricing flyer website proposal", run: (r) => r.push("/flow") },
    { id: "a-brief", label: "Draft a brief", icon: "FileText", group: "Do", keywords: "prd synthesize", run: (r) => r.push("/brief") },
    { id: "a-proposal", label: "Write a proposal (official form)", icon: "FileText", group: "Do", keywords: "product proposal form", run: (r) => { if (typeof window !== "undefined") window.localStorage.setItem("es-brief-mode", "proposal"); r.push("/brief"); } },
    { id: "a-pricing", label: "Pull pricing & competitor analysis", icon: "Tags", group: "Do", keywords: "compare competitor price research", run: (r) => r.push("/pricing") },
    { id: "a-pricelist", label: "Generate a price list", icon: "Tags", group: "Do", keywords: "2027 2028 uplift", run: (r) => { if (typeof window !== "undefined") window.localStorage.setItem("es-pricing-mode", "pricelist"); r.push("/pricing"); } },
    { id: "a-flyer", label: "Make a flyer", icon: "Megaphone", group: "Do", keywords: "marketing template", run: (r) => r.push("/marketing") },
    { id: "a-quote", label: "Build a quotation", icon: "ReceiptText", group: "Do", keywords: "quote pdf", run: (r) => r.push("/quotation") },
    { id: "a-feedback", label: "Analyse feedback", icon: "MessagesSquare", group: "Do", keywords: "sentiment nps csat data scientist", run: (r) => r.push("/feedback") },
    { id: "a-analytics", label: "Open analytics dashboard", icon: "LineChart", group: "Do", keywords: "charts funnel health", run: (r) => r.push("/analytics") },
    { id: "a-idea", label: "Structure an idea (Think Lab)", icon: "FlaskConical", group: "Do", keywords: "mvp concept", run: (r) => r.push("/think-lab") },
  ];
  return [...actions, ...nav];
}

export function CommandBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const commands = useMemo(buildCommands, []);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return commands;
    return commands.filter((c) => (c.label + " " + (c.hint || "") + " " + (c.keywords || "") + " " + c.group).toLowerCase().includes(t));
  }, [q, commands]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);
  useEffect(() => setSel(0), [q]);

  const runAt = useCallback(
    (i: number) => {
      const c = results[i];
      if (!c) return;
      setOpen(false);
      c.run(router);
    },
    [results, router]
  );

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); runAt(sel); }
  }

  if (!open) return null;

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] print:hidden" role="dialog" aria-modal="true" aria-label="Command bar">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-bg-card shadow-2xl">
        <div className="flex items-center gap-2 border-b border-line px-4">
          <Icon name="Command" className="h-4 w-4 text-brand-soft" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Type a command or search… (⌘K)"
            className="w-full bg-transparent py-3.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-ink-faint">esc</kbd>
        </div>
        <div className="max-h-[52vh] overflow-y-auto p-1.5">
          {results.length === 0 && <div className="px-3 py-6 text-center text-sm text-ink-faint">No commands match “{q}”.</div>}
          {results.map((c, i) => {
            const header = c.group !== lastGroup ? ((lastGroup = c.group)) : null;
            return (
              <div key={c.id}>
                {header && <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">{c.group}</div>}
                <button
                  onMouseEnter={() => setSel(i)}
                  onClick={() => runAt(i)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${i === sel ? "bg-brand/15" : "hover:bg-bg-hover"}`}
                >
                  <Icon name={c.icon} className={`h-4 w-4 shrink-0 ${i === sel ? "text-brand-soft" : "text-ink-faint"}`} />
                  <span className="flex-1 text-sm text-ink">{c.label}</span>
                  {c.hint && <span className="text-[11px] text-ink-faint">{c.hint}</span>}
                  {i === sel && <Icon name="ArrowRight" className="h-3.5 w-3.5 text-brand-soft" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
