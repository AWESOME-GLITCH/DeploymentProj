"use client";

import { useState } from "react";
import { getModule } from "@/lib/modules";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, SectionLabel, ConfidenceBadge } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ExportMenu } from "@/components/ExportMenu";
import { SaveToProgramme } from "@/components/SaveToProgramme";
import { FileDrop } from "@/components/FileDrop";
import { ClarifyPanel } from "@/components/ClarifyPanel";
import { H } from "@/lib/export";
import type { Concept } from "../api/think-lab/route";

function conceptHtml(c: Concept) {
  return (
    H.brandTitle(c.concept, "Think Lab · ES World") +
    H.kv("Opportunity fit", c.opportunity.fit) +
    H.h2("Problem") + H.p(c.problemStatement) +
    H.h2("Hypothesis") + H.p(c.hypothesis) +
    H.h2("Jobs to be done") + H.ul(c.jobsToBeDone) +
    H.h2("Assumptions to validate") + H.ul(c.assumptions.map((a) => `${a.text} — <b>${a.risk} risk</b>`)) +
    H.h2("MVP · Build") + H.ul(c.mvp.build) +
    H.h2("MVP · Measure") + H.ul(c.mvp.measure) +
    H.h2("MVP · Learn") + H.ul(c.mvp.learn) +
    H.h2("Run this first") + H.p(c.firstExperiment) +
    H.h2("Success metrics") + H.ul(c.successMetrics) +
    H.h2("Already known (Knowledge hub)") + H.ul(c.knownFromKnowledge) +
    H.h2("Research pass") + H.ul(c.researchNotes.map((r) => `${r.claim} — ${r.confidence} (${r.source})`))
  );
}

const M = getModule("think-lab")!;

const EXAMPLE = `random thought — what if ES World launched an "AI English coach" companion app that students on any course get for free between lessons? it gives speaking practice 24/7 using the same real-world tasks (debates, pitches, small talk) we teach in Flex. could be a differentiator vs other Dubai/London schools, and a retention hook. not sure if it's a paid add-on or a freebie that boosts course sales. worried about teacher pushback and whether it cannibalises 1-1 lessons.`;

const THINKING = [
  "Reading the idea…",
  "Pulling context from Knowledge hub…",
  "Separating facts from assumptions…",
  "Running an evidence pass…",
  "Scoping the smallest testable MVP…",
  "Choosing the first experiment…",
];

const riskCls: Record<string, string> = {
  high: "text-accent-rose border-accent-rose/30 bg-accent-rose/10",
  medium: "text-accent-amber border-accent-amber/30 bg-accent-amber/10",
  low: "text-ink-faint border-line bg-bg-hover",
};

function Chips({ items, accent }: { items: string[]; accent: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2 text-sm text-ink-soft">
          <Icon name="Check" className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accent}`} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ThinkLabPage() {
  const [input, setInput] = useState("");
  const [c, setC] = useState<Concept | null>(null);
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setC(null);
    const timer = setInterval(() => setStep((s) => (s + 1) % THINKING.length), 750);
    try {
      const res = await fetch("/api/think-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setC(data.concept);
      setDemo(Boolean(data.demo));
    } catch (e: any) {
      setError(e.message);
    } finally {
      clearInterval(timer);
      setLoading(false);
      setStep(0);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <PageHeader
        icon={M.icon}
        accent={M.accent}
        glow={M.glow}
        title={M.name}
        tagline={M.tagline}
        status={M.status}
        agent={M.agent}
      />

      {/* Input */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel>Dump a raw idea</SectionLabel>
          <button onClick={() => setInput(EXAMPLE)} className="text-xs text-brand-soft hover:text-brand">
            Try an example
          </button>
        </div>
        <Card className="p-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="A half-formed concept, a 'what if we…', a company-level bet you can't quite articulate yet…"
            className="h-36 w-full resize-none rounded-xl bg-transparent p-4 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </Card>
        <div className="mt-3 space-y-2">
          <FileDrop onText={(t) => setInput((p) => (p ? p + "\n\n" + t : t))} />
          <ClarifyPanel input={input} context="ES World company-level concept / Think Lab MVP" onApply={(t) => setInput((p) => (p ? p + "\n\n" + t : t))} />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Button onClick={run} disabled={loading || input.trim().length < 4}>
            {loading ? (
              <>
                <Icon name="Loader2" className="h-4 w-4 animate-spin" />
                Structuring…
              </>
            ) : (
              <>
                <Icon name="FlaskConical" className="h-4 w-4" />
                Structure into an MVP
              </>
            )}
          </Button>
          {input && (
            <button onClick={() => setInput("")} className="text-xs text-ink-faint hover:text-ink-soft">
              Clear
            </button>
          )}
        </div>
        {error && <div className="mt-3 text-sm text-accent-rose">{error}</div>}
      </div>

      {loading && (
        <Card glow={M.glow} className="flex h-56 flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15">
            <Icon name="FlaskConical" className="h-6 w-6 animate-pulse text-brand-soft" />
          </div>
          <div className="text-sm text-ink-soft">{THINKING[step]}</div>
          <div className="h-1 w-44 overflow-hidden rounded-full bg-bg-hover">
            <div className="shimmer h-full w-full" />
          </div>
        </Card>
      )}

      {!loading && !c && (
        <Card className="flex h-56 flex-col items-center justify-center gap-3 text-center text-ink-faint">
          <Icon name="FlaskConical" className="h-8 w-8" />
          <div className="text-sm">Your structured concept + MVP will appear here.</div>
          <div className="max-w-md text-xs">
            Problem · hypothesis · jobs-to-be-done · assumptions (risk-ranked) · MVP (build/measure/learn) ·
            first experiment — grounded in your Knowledge hub + a research pass.
          </div>
        </Card>
      )}

      {!loading && c && (
        <div className="animate-rise space-y-5">
          {demo && (
            <div className="flex items-start gap-2 rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-3 py-2 text-xs text-accent-amber">
              <Icon name="AlertTriangle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Demo mode — add an ANTHROPIC_API_KEY to structure your real idea.
            </div>
          )}
          <div className="flex justify-end gap-2">
            <SaveToProgramme kind="Concept" title={c.concept || "Concept"} getHtml={() => conceptHtml(c)} />
            <ExportMenu title={c.concept || "Think Lab concept"} html={() => conceptHtml(c)} />
          </div>

          {/* Concept header */}
          <Card glow={M.glow} className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-ink">{c.concept}</h2>
              <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand-soft">
                {c.opportunity.fit}
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-soft">{c.problemStatement}</p>
            <div className="mt-4 rounded-xl border border-line bg-bg-soft/50 p-3">
              <SectionLabel>Hypothesis</SectionLabel>
              <p className="text-sm italic text-ink">{c.hypothesis}</p>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <SectionLabel>Jobs to be done</SectionLabel>
              <Chips items={c.jobsToBeDone} accent="text-accent-blue" />
              <div className="mt-4">
                <SectionLabel>Opportunity rationale</SectionLabel>
                <p className="text-sm text-ink-soft">{c.opportunity.rationale}</p>
              </div>
            </Card>

            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Icon name="AlertTriangle" className="h-4 w-4 text-accent-amber" />
                <SectionLabel>Assumptions to validate</SectionLabel>
              </div>
              <div className="space-y-2">
                {c.assumptions.map((a, i) => (
                  <label
                    key={i}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-bg-soft/50 px-3 py-2 hover:bg-bg-hover"
                  >
                    <input type="checkbox" className="mt-1 accent-[#ff8300]" />
                    <span className="flex-1 text-sm text-ink-soft">{a.text}</span>
                    <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase ${riskCls[a.risk]}`}>
                      {a.risk}
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-ink-faint">You confirm or kill each before it becomes truth.</p>
            </Card>
          </div>

          {/* MVP */}
          <Card glow={M.glow} className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Icon name="Zap" className="h-4 w-4 text-brand-soft" />
              <h3 className="font-semibold text-ink">The MVP — smallest test of the riskiest assumption</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-bg-soft/50 p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-teal">Build</div>
                <Chips items={c.mvp.build} accent="text-accent-teal" />
              </div>
              <div className="rounded-xl border border-line bg-bg-soft/50 p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-blue">Measure</div>
                <Chips items={c.mvp.measure} accent="text-accent-blue" />
              </div>
              <div className="rounded-xl border border-line bg-bg-soft/50 p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-amber">Learn</div>
                <Chips items={c.mvp.learn} accent="text-accent-amber" />
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-brand/25 bg-brand/10 p-3">
              <Icon name="ArrowRight" className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-soft">Run this first</div>
                <p className="text-sm text-ink">{c.firstExperiment}</p>
              </div>
            </div>
            <div className="mt-4">
              <SectionLabel>Success metrics</SectionLabel>
              <Chips items={c.successMetrics} accent="text-accent-teal" />
            </div>
          </Card>

          {/* Grounding */}
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Icon name="Library" className="h-4 w-4 text-brand-soft" />
                <SectionLabel>Already known (from Knowledge hub)</SectionLabel>
              </div>
              <Chips items={c.knownFromKnowledge} accent="text-brand-soft" />
            </Card>
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Icon name="Search" className="h-4 w-4 text-accent-teal" />
                <SectionLabel>Research pass</SectionLabel>
              </div>
              <div className="space-y-2">
                {c.researchNotes.map((r, i) => (
                  <div key={i} className="rounded-lg border border-line bg-bg-soft/50 p-3">
                    <p className="text-sm text-ink-soft">{r.claim}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <ConfidenceBadge level={r.confidence} />
                      <span className="text-[11px] text-ink-faint">· {r.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
