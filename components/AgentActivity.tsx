"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

const FEED = [
  { agent: "Insight Synthesizer", text: "clustered 210 CELTA enquiries into 6 objection themes", tone: "teal" },
  { agent: "Pricing Analyst", text: "benchmarked ATHE Diploma vs. Dubai study-abroad market", tone: "amber" },
  { agent: "Brief Synthesizer", text: "drafted a brief for the Flex Lessons London launch", tone: "blue" },
  { agent: "Strategy Partner", text: "structured 'Spanish for teens' idea into 5 assumptions", tone: "brand" },
  { agent: "Analytics Scientist", text: "flagged a summer dip in Speaking Class enrolments", tone: "teal" },
  { agent: "Knowledge Librarian", text: "indexed 11 programmes across Dubai & London", tone: "brand" },
  { agent: "Marketing Writer", text: "generated flyer copy for Tailor-Made English (Dubai)", tone: "rose" },
];

const toneCls: Record<string, string> = {
  teal: "text-accent-teal",
  amber: "text-accent-amber",
  blue: "text-accent-blue",
  brand: "text-brand-soft",
  rose: "text-accent-rose",
};

export function AgentActivity() {
  const [n, setN] = useState(3);
  useEffect(() => {
    const t = setInterval(() => setN((x) => (x % FEED.length) + 1), 2600);
    return () => clearInterval(t);
  }, []);

  const items = [...FEED].slice(0, n).reverse();

  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div
          key={`${it.agent}-${i}`}
          className={`flex items-start gap-3 rounded-xl border border-line bg-bg-soft/60 px-3 py-2.5 ${
            i === 0 ? "animate-rise" : ""
          }`}
        >
          <div className="mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-brand" />
            </span>
          </div>
          <div className="min-w-0 text-sm">
            <span className={`font-medium ${toneCls[it.tone]}`}>{it.agent}</span>{" "}
            <span className="text-ink-soft">{it.text}</span>
          </div>
          <Icon name="Check" className="ml-auto mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" />
        </div>
      ))}
    </div>
  );
}
