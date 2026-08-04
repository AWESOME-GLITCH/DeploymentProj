"use client";

import { useState } from "react";
import { getModule } from "@/lib/modules";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, SectionLabel } from "@/components/ui";
import { Icon } from "@/components/Icon";
import type { Brief } from "../api/brief/route";

const M = getModule("brief")!;

const EXAMPLE = `notes from the team call — lots of Flex Lessons students in Dubai keep asking "can I also do a proper qualification while I'm here". idea: a bridge from Flex/Speaking into the ATHE Business Diploma. right now there's no pathway, students just leave when they want something accredited. want a "next step" offer we pitch at the 10-session review. must not cannibalise the standalone English courses. NOT building a new course, just packaging + a conversion flow. success = X% of Flex students book a Diploma consult. worry: visa eligibility differs (Flex has no visa sponsorship). who owns the handoff from teacher to careers office?`;

const THINKING = [
  "Reading the input…",
  "Extracting the core problem…",
  "Identifying audience & goals…",
  "Separating goals from non-goals…",
  "Surfacing risks to validate…",
  "Assembling the brief…",
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

export default function BriefPage() {
  const [input, setInput] = useState("");
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setBrief(null);
    const timer = setInterval(() => setStep((s) => (s + 1) % THINKING.length), 700);
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setBrief(data.brief);
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <SectionLabel>Messy input</SectionLabel>
            <button
              onClick={() => setInput(EXAMPLE)}
              className="text-xs text-brand-soft hover:text-brand"
            >
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
          <div className="mt-3 flex items-center gap-3">
            <Button onClick={generate} disabled={loading || input.trim().length < 4}>
              {loading ? (
                <>
                  <Icon name="Loader2" className="h-4 w-4 animate-spin" />
                  Synthesizing…
                </>
              ) : (
                <>
                  <Icon name="Sparkles" className="h-4 w-4" />
                  Generate brief
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

        {/* Output */}
        <div>
          <SectionLabel>Structured brief</SectionLabel>
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

            {!loading && !brief && (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-ink-faint">
                <Icon name="FileText" className="h-8 w-8" />
                <div className="text-sm">Your structured brief will appear here.</div>
                <div className="max-w-xs text-xs">
                  Problem · audience · goals · non-goals · features · risks · metrics · open questions
                </div>
              </div>
            )}

            {!loading && brief && (
              <div className="animate-rise space-y-5">
                {demo && (
                  <div className="flex items-start gap-2 rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-3 py-2 text-xs text-accent-amber">
                    <Icon name="AlertTriangle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Demo mode — add an ANTHROPIC_API_KEY to generate from your real input.
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-ink">{brief.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{brief.summary}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-line bg-bg-soft/50 p-3">
                    <SectionLabel>Problem</SectionLabel>
                    <p className="text-sm text-ink-soft">{brief.problem}</p>
                  </div>
                  <div className="rounded-xl border border-line bg-bg-soft/50 p-3">
                    <SectionLabel>Audience</SectionLabel>
                    <p className="text-sm text-ink-soft">{brief.targetAudience}</p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <SectionLabel>Goals</SectionLabel>
                    <List items={brief.goals} accent="text-accent-teal" />
                  </div>
                  <div>
                    <SectionLabel>Non-goals</SectionLabel>
                    <List items={brief.nonGoals} accent="text-ink-faint" />
                  </div>
                </div>

                <div>
                  <SectionLabel>Key features</SectionLabel>
                  <List items={brief.keyFeatures} accent="text-accent-blue" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <SectionLabel>Risks to validate</SectionLabel>
                    <List items={brief.risks} accent="text-accent-rose" />
                  </div>
                  <div>
                    <SectionLabel>Success metrics</SectionLabel>
                    <List items={brief.successMetrics} accent="text-accent-amber" />
                  </div>
                </div>

                <div>
                  <SectionLabel>Open questions</SectionLabel>
                  <List items={brief.openQuestions} accent="text-brand-soft" />
                </div>

                <div className="flex items-center gap-3 border-t border-line pt-4">
                  <Button variant="subtle">
                    <Icon name="Library" className="h-4 w-4" />
                    Save to Knowledge hub
                  </Button>
                  <span className="text-xs text-ink-faint">Human-in-the-loop: you approve before it becomes truth.</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
