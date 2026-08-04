"use client";

import { useState } from "react";
import { getModule } from "@/lib/modules";
import { PRODUCTS } from "@/lib/knowledge";
import { BRAND_STANDARDS } from "@/lib/brand";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, SectionLabel } from "@/components/ui";
import { Icon } from "@/components/Icon";
import type { MarketingDraft } from "../api/marketing/route";

const M = getModule("marketing")!;
const TYPES = ["Website", "Flyer", "Presentation", "Social post", "Email"];

const THINKING = [
  "Loading brand standards…",
  "Pulling course facts from Knowledge…",
  "Writing in ES World's voice…",
  "Applying palette & typography…",
  "Running the brand compliance check…",
];

export default function MarketingPage() {
  const [type, setType] = useState("Flyer");
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [brief, setBrief] = useState("");
  const [draft, setDraft] = useState<MarketingDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState(false);
  const [step, setStep] = useState(0);

  async function generate() {
    setLoading(true);
    setDraft(null);
    const timer = setInterval(() => setStep((s) => (s + 1) % THINKING.length), 700);
    try {
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: type, productId, brief }),
      });
      const data = await res.json();
      setDraft(data.draft);
      setDemo(Boolean(data.demo));
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
        tagline="Brand-compliant content, drafted from your Knowledge hub — never off-brand, never invented."
        status={M.status}
        agent={M.agent}
      />

      {/* Brand strip */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-bg-card p-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Locked to brand</span>
        <span className="flex items-center gap-1.5 text-xs text-ink-soft">
          <span className="h-4 w-4 rounded" style={{ background: BRAND_STANDARDS.colors.orange }} /> #FF8300
        </span>
        <span className="flex items-center gap-1.5 text-xs text-ink-soft">
          <span className="h-4 w-4 rounded border border-line" style={{ background: "#000" }} /> #000000
        </span>
        <span className="flex items-center gap-1.5 text-xs text-ink-soft">
          <span className="h-4 w-4 rounded border border-line" style={{ background: "#fff" }} /> #FFFFFF
        </span>
        <span className="text-xs text-ink-faint">· {BRAND_STANDARDS.typography.family}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <SectionLabel>Content type</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    type === t ? "border-brand/40 bg-brand/10 text-brand-soft" : "border-line text-ink-soft hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Course (from Knowledge)</SectionLabel>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-xl border border-line bg-bg-card px-3 py-2.5 text-sm text-ink focus:border-brand/40 focus:outline-none"
            >
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id} className="bg-bg-soft">
                  {p.name} · {p.campus}
                </option>
              ))}
            </select>
          </div>

          <div>
            <SectionLabel>Fields to emphasise (optional)</SectionLabel>
            <Card className="p-1">
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="e.g. lead with the free first session; target working professionals; mention the July promo…"
                className="h-28 w-full resize-none rounded-xl bg-transparent p-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
              />
            </Card>
          </div>

          <Button onClick={generate} disabled={loading}>
            {loading ? (
              <>
                <Icon name="Loader2" className="h-4 w-4 animate-spin" /> Writing…
              </>
            ) : (
              <>
                <Icon name="Sparkles" className="h-4 w-4" /> Draft content
              </>
            )}
          </Button>
        </div>

        {/* Output */}
        <div>
          <SectionLabel>Draft</SectionLabel>
          <Card glow={M.glow} className="min-h-[20rem] p-5">
            {loading && (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15">
                  <Icon name="Megaphone" className="h-6 w-6 animate-pulse text-brand-soft" />
                </div>
                <div className="text-sm text-ink-soft">{THINKING[step]}</div>
                <div className="h-1 w-40 overflow-hidden rounded-full bg-bg-hover"><div className="shimmer h-full w-full" /></div>
              </div>
            )}

            {!loading && !draft && (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-ink-faint">
                <Icon name="Megaphone" className="h-8 w-8" />
                <div className="text-sm">Your brand-compliant draft appears here.</div>
              </div>
            )}

            {!loading && draft && (
              <div className="animate-rise space-y-4">
                {demo && (
                  <div className="flex items-start gap-2 rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-3 py-2 text-xs text-accent-amber">
                    <Icon name="AlertTriangle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Demo mode — add an ANTHROPIC_API_KEY for live copy.
                  </div>
                )}
                <div className="text-[11px] font-mono text-ink-faint">{draft.docCode}</div>
                <div>
                  <h2 className="text-xl font-semibold text-brand-soft">{draft.headline}</h2>
                  <p className="mt-1 text-sm text-ink-soft">{draft.subheadline}</p>
                </div>
                <div className="space-y-3">
                  {draft.sections.map((s, i) => (
                    <div key={i} className="rounded-xl border border-line bg-bg-soft/50 p-3">
                      <div className="text-sm font-semibold text-ink">{s.heading}</div>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.body}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-brand/25 bg-brand/10 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-soft">Call to action</div>
                  <p className="text-sm text-ink">{draft.cta}</p>
                </div>
                <div>
                  <SectionLabel>Brand compliance check</SectionLabel>
                  <div className="space-y-1.5">
                    {draft.brandChecklist.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-ink-soft">
                        <Icon name={c.ok ? "Check" : "AlertTriangle"} className={`h-4 w-4 ${c.ok ? "text-accent-teal" : "text-accent-rose"}`} />
                        {c.rule}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
