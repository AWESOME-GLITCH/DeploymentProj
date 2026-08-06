"use client";

import { useEffect, useState } from "react";
import { getModule } from "@/lib/modules";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, SectionLabel } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ExportMenu } from "@/components/ExportMenu";
import { SaveToProgramme } from "@/components/SaveToProgramme";
import { FileDrop } from "@/components/FileDrop";
import { ClarifyPanel } from "@/components/ClarifyPanel";
import { useProducts, useItems } from "@/lib/store";
import { useCorrections } from "@/lib/corrections";
import { ProposalFormView } from "@/components/ProposalFormView";
import { proposalFormToHtml } from "@/lib/proposalForm";
import { H } from "@/lib/export";
import type { Brief } from "../api/brief/route";
import type { Proposal } from "../api/proposal/route";

function briefHtml(b: Brief) {
  return (
    H.brandTitle(b.title, "Product Brief · ES World") +
    H.p(b.summary) +
    H.h2("Problem") + H.p(b.problem) +
    H.kv("Audience", b.targetAudience) +
    H.h2("Goals") + H.ul(b.goals) +
    H.h2("Non-goals") + H.ul(b.nonGoals) +
    H.h2("Key features") + H.ul(b.keyFeatures) +
    H.h2("Risks to validate") + H.ul(b.risks) +
    H.h2("Success metrics") + H.ul(b.successMetrics) +
    H.h2("Open questions") + H.ul(b.openQuestions)
  );
}
function proposalHtml(p: Proposal) {
  return proposalFormToHtml(p);
}

const M = getModule("brief")!;
type Mode = "brief" | "proposal";

const EXAMPLE = `notes from the team call, lots of Flex Lessons students in Dubai keep asking "can I also do a proper qualification while I'm here". idea: a bridge from Flex/Speaking into the ATHE Business Diploma. right now there's no pathway, students just leave when they want something accredited. want a "next step" offer we pitch at the 10-session review. must not cannibalise the standalone English courses. NOT building a new course, just packaging + a conversion flow. success = X% of Flex students book a Diploma consult. worry: visa eligibility differs (Flex has no visa sponsorship). who owns the handoff from teacher to careers office?`;

const THINKING = [
  "Reading the input…",
  "Extracting the core problem…",
  "Identifying audience & goals…",
  "Structuring the output…",
  "Surfacing risks to validate…",
  "Assembling the document…",
];

function List({ items, accent }: { items: string[]; accent?: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2 text-sm text-ink-soft">
          <Icon name="Circle" className={`mt-1.5 h-1.5 w-1.5 shrink-0 fill-current ${accent || "text-brand-soft"}`} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-bg-soft/50 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">{label}</div>
      <div className="mt-1 text-sm text-ink-soft">{children}</div>
    </div>
  );
}

export default function BriefPage() {
  const { products } = useProducts();
  const { forProduct } = useItems();
  const [mode, setMode] = useState<Mode>("brief");
  const [productId, setProductId] = useState("");
  const { corrections } = useCorrections(productId || undefined);
  const [input, setInput] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage.getItem("es-brief-mode") === "proposal") {
      setMode("proposal");
      window.localStorage.removeItem("es-brief-mode");
    }
  }, []);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setBrief(null);
    setProposal(null);
    const timer = setInterval(() => setStep((s) => (s + 1) % THINKING.length), 700);
    try {
      const product = products.find((p) => p.id === productId);
      const savedWork = productId
        ? forProduct(productId).map((i) => ({ kind: i.kind, title: i.title, html: i.html }))
        : [];
      const res = await fetch(mode === "brief" ? "/api/brief" : "/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, product, corrections: corrections.map((c) => ({ kind: c.kind, note: c.note })), savedWork }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      if (mode === "brief") setBrief(data.brief);
      else setProposal(data.proposal);
      setDemo(Boolean(data.demo));
    } catch (e: any) {
      setError(e.message);
    } finally {
      clearInterval(timer);
      setLoading(false);
      setStep(0);
    }
  }

  const hasOutput = brief || proposal;

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <PageHeader
        icon={M.icon}
        accent={M.accent}
        glow={M.glow}
        title={M.name}
        tagline="Messy input → a structured brief, or a ready-to-share Product/Service Proposal."
        status={M.status}
        agent={M.agent}
        right={
          <div className="flex rounded-xl border border-line bg-bg-card p-1">
            {(["brief", "proposal"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-lg px-3 py-1.5 text-sm capitalize transition-colors ${
                  mode === m ? "bg-brand text-white" : "text-ink-soft hover:text-ink"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div>
          <div className="mb-2">
            <SectionLabel>Ground in a programme (uses its knowledge + pricing)</SectionLabel>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-xl border border-line bg-bg-card px-3 py-2.5 text-sm text-ink focus:border-brand/40 focus:outline-none"
            >
              <option value="">No programme, use only my input</option>
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-bg-soft">
                  {p.name} · {p.campus}
                </option>
              ))}
            </select>
            {productId && (
              <p className="mt-1 text-[11px] text-ink-faint">
                Memory on: ES World strategy + this programme's facts &amp; pricing
                {forProduct(productId).length ? ` + ${forProduct(productId).length} saved item${forProduct(productId).length > 1 ? "s" : ""} from the Library` : ""}
                {corrections.length ? ` + ${corrections.length} correction${corrections.length > 1 ? "s" : ""}` : ""}.
              </p>
            )}
          </div>
          <div className="mb-2 flex items-center justify-between">
            <SectionLabel>Messy input</SectionLabel>
            <button onClick={() => setInput(EXAMPLE)} className="text-xs text-brand-soft hover:text-brand">
              Try an example
            </button>
          </div>
          <Card className="p-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste meeting notes, a transcript, a Slack thread, or a half-formed thought…"
              className="h-72 w-full resize-none rounded-xl bg-transparent p-4 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </Card>
          <div className="mt-3 space-y-2">
            <FileDrop onText={(t) => setInput((p) => (p ? p + "\n\n" + t : t))} />
            <ClarifyPanel input={input} context={`ES World ${mode === "brief" ? "product brief" : "product / service proposal"}`} onApply={(t) => setInput((p) => (p ? p + "\n\n" + t : t))} />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Button onClick={generate} disabled={loading || input.trim().length < 4}>
              {loading ? (
                <>
                  <Icon name="Loader2" className="h-4 w-4 animate-spin" />
                  {mode === "brief" ? "Synthesizing…" : "Drafting proposal…"}
                </>
              ) : (
                <>
                  <Icon name="Sparkles" className="h-4 w-4" />
                  {mode === "brief" ? "Generate brief" : "Generate proposal"}
                </>
              )}
            </Button>
            <a
              href="/flow"
              onClick={() => {
                if (typeof window !== "undefined" && input.trim()) window.localStorage.setItem("es-flow-input", input);
              }}
              className="inline-flex items-center gap-1 text-xs text-accent-teal hover:underline"
            >
              Run full flow <Icon name="ArrowRight" className="h-3 w-3" />
            </a>
            {input && (
              <button onClick={() => setInput("")} className="text-xs text-ink-faint hover:text-ink-soft">
                Clear
              </button>
            )}
          </div>
          {error && <div className="mt-3 text-sm text-accent-rose">{error}</div>}
        </div>

        {/* Output */}
        <div>
          <SectionLabel>{mode === "brief" ? "Structured brief" : "Product/Service Proposal"}</SectionLabel>
          <Card glow={M.glow} className="min-h-[19rem] p-5">
            {loading && (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15">
                  <Icon name="Sparkles" className="h-6 w-6 animate-pulse text-brand-soft" />
                </div>
                <div className="text-sm text-ink-soft">{THINKING[step]}</div>
                <div className="h-1 w-40 overflow-hidden rounded-full bg-bg-hover">
                  <div className="shimmer h-full w-full" />
                </div>
              </div>
            )}

            {!loading && !hasOutput && (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-ink-faint">
                <Icon name="FileText" className="h-8 w-8" />
                <div className="text-sm">
                  Your {mode === "brief" ? "structured brief" : "proposal"} will appear here.
                </div>
              </div>
            )}

            {/* Brief output */}
            {!loading && brief && (
              <div className="animate-rise space-y-5">
                {demo && <DemoNote />}
                <div className="flex justify-end gap-2">
                  <SaveToProgramme kind="Brief" title={brief.title || "Brief"} getHtml={() => briefHtml(brief)} />
                  <ExportMenu title={brief.title || "Product Brief"} html={() => briefHtml(brief)} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-ink">{brief.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{brief.summary}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Problem">{brief.problem}</Field>
                  <Field label="Audience">{brief.targetAudience}</Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><SectionLabel>Goals</SectionLabel><List items={brief.goals} accent="text-accent-teal" /></div>
                  <div><SectionLabel>Non-goals</SectionLabel><List items={brief.nonGoals} accent="text-ink-faint" /></div>
                </div>
                <div><SectionLabel>Key features</SectionLabel><List items={brief.keyFeatures} accent="text-accent-blue" /></div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><SectionLabel>Risks to validate</SectionLabel><List items={brief.risks} accent="text-accent-rose" /></div>
                  <div><SectionLabel>Success metrics</SectionLabel><List items={brief.successMetrics} accent="text-accent-amber" /></div>
                </div>
                <div><SectionLabel>Open questions</SectionLabel><List items={brief.openQuestions} accent="text-brand-soft" /></div>
                <SaveRow />
              </div>
            )}

            {/* Proposal output, the official Product Proposal Form */}
            {!loading && proposal && (
              <div className="animate-rise space-y-4">
                {demo && <DemoNote />}
                <div className="flex justify-end gap-2">
                  <SaveToProgramme kind="Proposal" title={proposal.title || "Proposal"} getHtml={() => proposalHtml(proposal)} />
                  <ExportMenu title={proposal.title || "Proposal"} html={() => proposalHtml(proposal)} />
                </div>
                <ProposalFormView f={proposal} />
                <SaveRow />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function DemoNote() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-3 py-2 text-xs text-accent-amber">
      <Icon name="AlertTriangle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      Demo mode, add an ANTHROPIC_API_KEY to generate from your real input.
    </div>
  );
}

function SaveRow() {
  return (
    <div className="flex items-center gap-3 border-t border-line pt-4">
      <Button variant="subtle">
        <Icon name="Library" className="h-4 w-4" />
        Save to Knowledge hub
      </Button>
      <span className="text-xs text-ink-faint">Human-in-the-loop: you approve before it becomes truth.</span>
    </div>
  );
}
