"use client";

import { useCallback, useEffect, useState } from "react";
import { getModule } from "@/lib/modules";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, SectionLabel } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ExportMenu } from "@/components/ExportMenu";
import { Sources, type Source } from "@/components/Sources";
import { H } from "@/lib/export";
import type { CompetitorMatrix } from "../api/competitors/route";

const M = getModule("competitors")!;

const LEVEL: Record<string, { glyph: string; hex: string; label: string }> = {
  full: { glyph: "●", hex: "#35d6c0", label: "Full" },
  partial: { glyph: "◐", hex: "#f5b23b", label: "Partial" },
  none: { glyph: "○", hex: "#6c7789", label: "None" },
};
const GAP: Record<string, { hex: string; label: string }> = {
  moat: { hex: "#35d6c0", label: "MOAT" },
  parity: { hex: "#8a94a6", label: "PARITY" },
  close: { hex: "#f5b23b", label: "CLOSE" },
  watch: { hex: "#ff5d6c", label: "WATCH" },
};

const THINKING = ["Scanning competitor sites…", "Reading pricing pages…", "Diffing changelogs…", "Mapping gaps to our roadmap…", "Scoring the matrix…"];

function matrixHtml(m: CompetitorMatrix) {
  const cell = (l: string) => (l === "full" ? "●" : l === "partial" ? "◐" : "○");
  return (
    H.brandTitle("Competitor gap matrix — ES World", m.headline) +
    "<table><tr><th>Capability</th><th>ES World</th>" + m.competitors.map((c) => `<th>${c}</th>`).join("") + "<th>Gap</th></tr>" +
    m.features.map((f) => `<tr><td>${f.capability}</td><td>${cell(f.esworld)}</td>` + f.competitors.map((c) => `<td>${cell(c.level)}</td>`).join("") + `<td>${GAP[f.gap].label}</td></tr>`).join("") +
    "</table>" +
    H.h2("Pricing snapshot") + "<table><tr><th>Competitor</th><th>Plan</th><th>Price</th><th>Note</th></tr>" +
    m.pricing.map((p) => `<tr><td>${p.competitor}</td><td>${p.plan}</td><td>${p.price}</td><td>${p.note}</td></tr>`).join("") + "</table>"
  );
}

function Dot({ level }: { level: string }) {
  const l = LEVEL[level] || LEVEL.none;
  return <span title={l.label} style={{ color: l.hex }} className="text-base leading-none">{l.glyph}</span>;
}

export default function CompetitorsPage() {
  const [m, setM] = useState<CompetitorMatrix | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [searched, setSearched] = useState(false);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [meta, setMeta] = useState<{ capturedAt?: string; changed?: boolean; cached?: boolean }>({});

  const run = useCallback(async () => {
    setLoading(true);
    const timer = setInterval(() => setStep((s) => (s + 1) % THINKING.length), 800);
    try {
      const res = await fetch("/api/competitors", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const data = await res.json();
      setM(data.matrix);
      setSources(data.sources || []);
      setSearched(Boolean(data.searched));
      setDemo(Boolean(data.demo));
      setMeta({ cached: false });
    } finally {
      clearInterval(timer);
      setLoading(false);
      setStep(0);
    }
  }, []);

  // On load, ONLY read the cached snapshot (a free KV read — no tokens, no cost).
  // Live research never runs on its own; it requires an explicit "Refresh research"
  // click, so opening this page never spends credits.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/competitors");
        const data = await res.json();
        if (data.cached && data.matrix) {
          setM(data.matrix);
          setSources(data.sources || []);
          setSearched(Boolean(data.searched));
          setDemo(Boolean(data.demo));
          setMeta({ capturedAt: data.capturedAt, changed: data.changed, cached: true });
        }
      } catch {
        /* no cache — wait for an explicit refresh */
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <PageHeader
        icon={M.icon}
        accent={M.accent}
        glow={M.glow}
        title={M.name}
        tagline="Where ES World leads and lags — a researched feature & pricing matrix, mapped to our strategy."
        status={M.status}
        agent={M.agent}
        right={
          <div className="flex gap-2">
            <Button variant="subtle" onClick={run} disabled={loading}>
              <Icon name={loading ? "Loader2" : "Search"} className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Researching…" : "Refresh research"}
            </Button>
            {m && <ExportMenu title="ES World Competitor Matrix" html={() => matrixHtml(m)} rows={() => [["Capability", "ES World", ...m.competitors, "Gap"], ...m.features.map((f) => [f.capability, f.esworld, ...f.competitors.map((c) => c.level), f.gap])]} />}
          </div>
        }
      />

      {loading && !m && (
        <Card glow={M.glow} className="flex h-56 flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15"><Icon name="Target" className="h-6 w-6 animate-pulse text-brand-soft" /></div>
          <div className="text-sm text-ink-soft">{THINKING[step]}</div>
          <div className="h-1 w-44 overflow-hidden rounded-full bg-bg-hover"><div className="shimmer h-full w-full" /></div>
        </Card>
      )}

      {!loading && !m && (
        <Card className="flex h-56 flex-col items-center justify-center gap-3 text-center text-ink-faint">
          <Icon name="Target" className="h-8 w-8" />
          <div className="text-sm">No competitor research cached yet.</div>
          <div className="max-w-sm text-xs">Press <span className="text-brand-soft">Refresh research</span> to run a live pull. That's the only thing here that uses credits — the page never researches on its own.</div>
        </Card>
      )}

      {m && (
        <div className="animate-rise space-y-6">
          {demo && (
            <div className="flex items-start gap-2 rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-3 py-2 text-xs text-accent-amber">
              <Icon name="AlertTriangle" className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Demo mode — add an ANTHROPIC_API_KEY + credits for live, researched competitor data.
            </div>
          )}

          <Card glow={M.glow} className="p-4">
            <div className="flex items-start gap-2">
              <Icon name="Target" className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" />
              <p className="flex-1 text-sm text-ink">{m.headline}</p>
              {meta.changed && <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: "#f5b23b22", color: "#f5b23b" }}>CHANGED</span>}
            </div>
            {meta.cached && meta.capturedAt && (
              <div className="mt-1.5 pl-6 text-[11px] text-ink-faint">Auto-refreshed {new Date(meta.capturedAt).toLocaleString()} · press “Refresh research” for a live pull.</div>
            )}
          </Card>

          {/* Matrix */}
          <Card className="p-0">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <SectionLabel>Feature &amp; gap matrix</SectionLabel>
              <div className="ml-auto flex items-center gap-3 text-[11px] text-ink-faint">
                {Object.values(LEVEL).map((l) => (<span key={l.label} className="flex items-center gap-1"><span style={{ color: l.hex }}>{l.glyph}</span>{l.label}</span>))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-ink-faint">
                    <th className="px-4 py-2 text-left font-semibold">Capability</th>
                    <th className="px-3 py-2 text-center font-semibold text-brand-soft">ES World</th>
                    {m.competitors.map((c) => <th key={c} className="px-3 py-2 text-center font-semibold">{c}</th>)}
                    <th className="px-4 py-2 text-right font-semibold">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {m.features.map((f, i) => (
                    <tr key={i} className="border-t border-line">
                      <td className="px-4 py-2.5 text-ink">{f.capability}</td>
                      <td className="px-3 py-2.5 text-center"><Dot level={f.esworld} /></td>
                      {f.competitors.map((c, j) => <td key={j} className="px-3 py-2.5 text-center"><Dot level={c.level} /></td>)}
                      <td className="px-4 py-2.5 text-right">
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: `${GAP[f.gap].hex}22`, color: GAP[f.gap].hex }}>{GAP[f.gap].label}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pricing snapshot */}
          <Card className="p-5">
            <SectionLabel>Competitor pricing snapshot</SectionLabel>
            <div className="space-y-2">
              {m.pricing.map((p, i) => (
                <div key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-line bg-bg-soft/50 px-3 py-2">
                  <span className="text-sm font-medium text-ink">{p.competitor}</span>
                  <span className="text-xs text-ink-faint">{p.plan}</span>
                  <span className="ml-auto text-sm text-brand-soft">{p.price}</span>
                  <span className="w-full text-[11px] text-ink-faint sm:w-auto sm:basis-full">{p.note}</span>
                </div>
              ))}
            </div>
          </Card>

          {!demo && <Sources sources={sources} searched={searched} />}

          <div className="rounded-xl border border-line bg-bg-soft/50 p-3 text-xs text-ink-faint">
            <Icon name="AlertTriangle" className="mr-1.5 inline h-3.5 w-3.5 text-accent-amber" />
            On-demand today. For a daily auto-refresh, connect a scheduler (e.g. Vercel Cron) to hit <span className="font-mono">/api/competitors</span> — the matrix then updates itself and the synthesis header flags any change.
          </div>
        </div>
      )}
    </div>
  );
}
