"use client";

import { useState } from "react";
import { Icon } from "./Icon";

/** Asks PM-style clarifying questions about the input; answers append back to it. */
export function ClarifyPanel({ input, context, onApply }: { input: string; context?: string; onApply: (text: string) => void }) {
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  async function ask() {
    setLoading(true);
    try {
      const res = await fetch("/api/clarify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input, context }) });
      const j = await res.json();
      setQuestions(j.questions || []);
    } finally {
      setLoading(false);
    }
  }

  function apply() {
    const block = (questions || [])
      .map((q, i) => (answers[i]?.trim() ? `Q: ${q}\nA: ${answers[i].trim()}` : null))
      .filter(Boolean)
      .join("\n\n");
    if (block) onApply(block);
    setQuestions(null);
    setAnswers({});
  }

  if (!questions) {
    return (
      <button onClick={ask} disabled={loading || input.trim().length < 4} className="inline-flex items-center gap-1.5 text-xs text-brand-soft hover:text-brand disabled:opacity-40">
        <Icon name={loading ? "Loader2" : "MessagesSquare"} className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Thinking like a PM…" : "Ask me PM questions first"}
      </button>
    );
  }

  return (
    <div className="space-y-2.5 rounded-xl border border-brand/25 bg-brand/[0.05] p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-soft">
        <Icon name="MessagesSquare" className="h-3.5 w-3.5" /> A few questions before we build
      </div>
      {questions.map((q, i) => (
        <div key={i}>
          <div className="text-xs text-ink-soft">{q}</div>
          <input value={answers[i] || ""} onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })} placeholder="Your answer…" className="mt-1 w-full rounded-lg border border-line bg-bg-soft px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand/40 focus:outline-none" />
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <button onClick={apply} className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110">Add answers to input</button>
        <button onClick={() => setQuestions(null)} className="rounded-full px-3 py-1.5 text-xs text-ink-faint hover:text-ink">Skip</button>
      </div>
    </div>
  );
}
