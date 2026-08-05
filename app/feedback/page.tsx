"use client";

import { useState } from "react";
import { getModule } from "@/lib/modules";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, SectionLabel } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { FileDrop } from "@/components/FileDrop";
import { ExportMenu } from "@/components/ExportMenu";
import { SaveToProgramme } from "@/components/SaveToProgramme";
import { H } from "@/lib/export";
import type { FeedbackAnalysis, Theme } from "../api/feedback/route";

const M = getModule("feedback")!;

const SENT = {
  positive: { hex: "#35d6c0", label: "Positive" },
  neutral: { hex: "#8a94a6", label: "Neutral" },
  negative: { hex: "#ff5d6c", label: "Negative" },
  mixed: { hex: "#f5b23b", label: "Mixed" },
} as const;

const IMPACT: Record<string, string> = { high: "#35d6c0", medium: "#5b9dff", low: "#8a94a6" };

const THINKING = [
  "Reading the feedback…",
  "Detecting sample size…",
  "Clustering into themes…",
  "Pinning verbatim quotes…",
  "Scoring sentiment & metrics…",
  "Flagging bias & opportunities…",
];

function analysisHtml(a: FeedbackAnalysis) {
  return (
    H.brandTitle("Feedback analysis — ES World", `n = ${a.sampleSize}`) +
    H.p(a.summary) +
    H.kv("Sentiment", `Positive ${a.sentiment.positive}% · Neutral ${a.sentiment.neutral}% · Negative ${a.sentiment.negative}%`) +
    (a.metrics.nps != null ? H.kv("NPS", String(a.metrics.nps)) : "") +
    (a.metrics.csat != null ? H.kv("CSAT", `${a.metrics.csat}%`) : "") +
    (a.metrics.ces != null ? H.kv("CES", String(a.metrics.ces)) : "") +
    H.h2("Themes") +
    a.themes.map((t) => `<h3>${t.theme} — ${t.sentiment} (${t.mentions})</h3>` + (t.quotes.length ? "<ul>" + t.quotes.map((q) => `<li><i>“${q}”</i></li>`).join("") + "</ul>" : "")).join("") +
    H.h2("Opportunities") + H.ul(a.opportunities.map((o) => `${o.title} — impact ${o.impact}, effort ${o.effort}. ${o.rationale}`)) +
    H.h2("Bias & caveats") + H.ul(a.biasFlags)
  );
}

export default function FeedbackPage() {
  const [input, setInput] = useState("");
  const [a, setA] = useState<FeedbackAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function analyse() {
    setLoading(true);
    setError(null);
    setA(null);
    const timer = setInterval(() => setStep((s) => (s + 1) % THINKING.length), 750);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setA(data.analysis);
      setDemo(Boolean(data.demo));
    } catch (e: any) {
      setError(e.message);
    } finally {
      clearInterval(timer);
      setLoading(false);
      setStep(0);
    }
  }

  const maxMentions = a ? Math.max(1, ...a.themes.map((t) => t.mentions)) : 1;

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <PageHeader
        icon={M.icon}
        accent={M.accent}
        glow={M.glow}
        title={M.name}
        tagline="Drop your feedback — surveys, reviews, transcripts, a CSV — and get a data-scientist's read: themes, sentiment, NPS/CSAT and what to do."
        status={M.status}
        agent={M.agent}
        right={a ? (
          <div className="flex gap-2">
            <SaveToProgramme kind="Feedback analysis" title="Feedback analysis" getHtml={() => analysisHtml(a)} />
            <ExportMenu title="ES World Feedback Analysis" html={() => analysisHtml(a)} />
          </div>
        ) : undefined}
      />

      {/* Input */}
      <div className="mb-6 grid gap-3">
        <FileDrop onText={(t) => setInput((p) => (p ? p + "\n\n" + t : t))} label="Drop feedback — CSV, survey export, reviews or a transcript (PDF/image/text)" />
        <Card className="p-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="…or paste raw feedback here — one comment per line, survey rows, review dumps, focus-group notes."
            className="h-40 w-full resize-none rounded-xl bg-transparent p-4 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </Card>
        <div className="flex items-center gap-3">
          <Button onClick={analyse} disabled={loading || input.trim().length < 8}>
            {loading ? <><Icon name="Loader2" className="h-4 w-4 animate-spin" /> Analysing…</> : <><Icon name="Activity" className="h-4 w-4" /> Analyse feedback</>}
          </Button>
          {input && <button onClick={() => setInput("")} className="text-xs text-ink-faint hover:text-ink-soft">Clear</button>}
        </div>
        {error && <div className="text-sm text-accent-rose">{error}</div>}
      </div>

      {loading && (
        <Card glow={M.glow} className="flex h-56 flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15"><Icon name="Activity" className="h-6 w-6 animate-pulse text-brand-soft" /></div>
          <div className="text-sm text-ink-soft">{THINKING[step]}</div>
          <div className="h-1 w-44 overflow-hidden rounded-full bg-bg-hover"><div className="shimmer h-full w-full" /></div>
        </Card>
      )}

      {!loading && !a && (
        <Card className="flex h-52 flex-col items-center justify-center gap-3 text-center text-ink-faint">
          <Icon name="MessagesSquare" className="h-8 w-8" />
          <div className="text-sm">Your analysis appears here — themes tied to real quotes, honest sentiment, NPS/CSAT, and scored opportunities.</div>
        </Card>
      )}

      {!loading && a && (
        <div className="animate-rise space-y-6">
          {demo && (
            <div className="flex items-start gap-2 rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-3 py-2 text-xs text-accent-amber">
              <Icon name="AlertTriangle" className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Demo mode — add an ANTHROPIC_API_KEY to analyse your real feedback.
            </div>
          )}

          {/* Summary + sample */}
          <Card glow={M.glow} className="p-5">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-ink">What the data says</h2>
              <span className="ml-auto rounded-full border border-line bg-bg-soft px-2.5 py-1 font-mono text-xs text-ink-soft">n = {a.sampleSize}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a.summary}</p>
          </Card>

          {/* Sentiment + metrics */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <Card className="p-5">
              <SectionLabel>Overall sentiment</SectionLabel>
              <div className="flex h-4 overflow-hidden rounded-full">
                {(["positive", "neutral", "negative"] as const).map((k) =>
                  a.sentiment[k] ? <div key={k} style={{ width: `${a.sentiment[k]}%`, background: SENT[k].hex }} title={`${SENT[k].label} ${a.sentiment[k]}%`} /> : null
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-4">
                {(["positive", "neutral", "negative"] as const).map((k) => (
                  <div key={k} className="flex items-center gap-2 text-sm">
                    <span className="h-3 w-3 rounded-sm" style={{ background: SENT[k].hex }} />
                    <span className="text-ink">{SENT[k].label}</span>
                    <span className="font-mono text-ink-faint">{a.sentiment[k]}%</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <SectionLabel>Metrics</SectionLabel>
              <div className="grid grid-cols-3 gap-3">
                <Metric label="NPS" value={a.metrics.nps} />
                <Metric label="CSAT" value={a.metrics.csat} suffix="%" />
                <Metric label="CES" value={a.metrics.ces} />
              </div>
              <p className="mt-2 text-[11px] text-ink-faint">Shown only when scores exist in your data — never fabricated.</p>
            </Card>
          </div>

          {/* Themes */}
          <div>
            <SectionLabel>Themes — each tied to real quotes</SectionLabel>
            <div className="grid gap-4 lg:grid-cols-2">
              {a.themes.map((t, i) => <ThemeCard key={i} t={t} max={maxMentions} />)}
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <SectionLabel>Opportunities — impact vs effort</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {a.opportunities.map((o, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start gap-2">
                    <Icon name="Zap" className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-ink">{o.title}</div>
                      <div className="mt-1.5 flex gap-1.5">
                        <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase" style={{ background: `${IMPACT[o.impact]}22`, color: IMPACT[o.impact] }}>Impact {o.impact}</span>
                        <span className="rounded-md border border-line px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-soft">Effort {o.effort}</span>
                      </div>
                      <p className="mt-2 text-xs text-ink-soft">{o.rationale}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Bias */}
          {a.biasFlags.length > 0 && (
            <Card className="border-accent-amber/25 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Icon name="AlertTriangle" className="h-4 w-4 text-accent-amber" />
                <SectionLabel>Bias &amp; caveats — read before you act</SectionLabel>
              </div>
              <ul className="space-y-1.5">
                {a.biasFlags.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink-soft"><Icon name="Circle" className="mt-1.5 h-1.5 w-1.5 shrink-0 fill-current text-accent-amber" />{b}</li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, suffix = "" }: { label: string; value: number | null; suffix?: string }) {
  return (
    <div className="rounded-xl border border-line bg-bg-soft/50 p-3 text-center">
      <div className="text-2xl font-bold text-ink">{value == null ? "—" : `${value}${suffix}`}</div>
      <div className="text-[11px] text-ink-faint">{label}</div>
    </div>
  );
}

function ThemeCard({ t, max }: { t: Theme; max: number }) {
  const s = SENT[t.sentiment];
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.hex }} />
        <h3 className="text-sm font-semibold text-ink">{t.theme}</h3>
        <span className="ml-auto rounded-full border border-line px-2 py-0.5 text-[10px] uppercase text-ink-faint">{t.aspect}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: s.hex }}>{s.label}</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-hover">
          <div className="h-full rounded-full" style={{ width: `${(t.mentions / max) * 100}%`, background: s.hex }} />
        </div>
        <span className="font-mono text-xs text-ink-faint">{t.mentions}</span>
      </div>
      {t.quotes.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {t.quotes.map((q, i) => (
            <div key={i} className="border-l-2 pl-2.5 text-xs italic text-ink-soft" style={{ borderColor: s.hex }}>“{q}”</div>
          ))}
        </div>
      )}
    </Card>
  );
}
