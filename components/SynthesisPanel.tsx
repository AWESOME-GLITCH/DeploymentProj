"use client";

import { useEffect, useState } from "react";
import { useSynthesis, SYNTH_TONE } from "./SynthesisBar";
import { Icon } from "./Icon";

/** The featured executive read for the home dashboard, a proper panel, not a strip. */
export function SynthesisPanel() {
  const synthesis = useSynthesis();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <section className="mb-10 overflow-hidden rounded-3xl border border-line bg-bg-card">
      <div className="flex items-center gap-2.5 border-b border-line px-6 py-3.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-teal/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-teal" />
        </span>
        <h2 className="text-sm font-semibold tracking-tight text-ink">Today, 24h synthesis</h2>
        <span className="ml-auto text-[11px] text-ink-faint">pivots · threats · risks, from your live data</span>
      </div>
      <div className="grid gap-px bg-line sm:grid-cols-3">
        {synthesis.map((s, i) => (
          <div key={i} className="flex flex-col gap-2 bg-bg-card p-5">
            <div className="flex items-center gap-2">
              <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${SYNTH_TONE[s.tone].chip}`}>
                <Icon name={s.icon} className="h-3.5 w-3.5" />
              </span>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${SYNTH_TONE[s.tone].chip}`}>{s.tag}</span>
            </div>
            <p className="text-sm leading-relaxed text-ink-soft">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
