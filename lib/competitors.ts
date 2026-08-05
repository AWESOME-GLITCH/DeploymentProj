import { hasLiveAgents, runJsonAgent, type Source } from "@/lib/agent";
import { COMPANY_MEMORY } from "@/lib/company";

export type Level = "full" | "partial" | "none";
export type FeatureRow = { capability: string; esworld: Level; competitors: { name: string; level: Level }[]; gap: "moat" | "parity" | "close" | "watch" };
export type CompetitorMatrix = {
  competitors: string[];
  features: FeatureRow[];
  pricing: { competitor: string; plan: string; price: string; note: string }[];
  headline: string;
};
export type MatrixResult = { matrix: CompetitorMatrix; demo: boolean; sources: Source[]; searched: boolean };

const SYSTEM = `You are ES World's competitive-intelligence analyst.
${COMPANY_MEMORY}

Build a HONEST competitor feature/gap matrix for ES World vs its real rivals (choose 3-4 of: British Council, EC English, Kaplan, Headway, IELTS/Cambridge, Duolingo English Test — the most relevant). Use web search for current facts (pricing pages, course pages, changelogs) where possible. Rules:
- Capabilities to compare (6-8): accredited higher-ed pathway (ATHE), own placement/assessment (AZE), flexible/on-demand formats, cultural immersion across two cities, transparent public pricing, IELTS preparation, teacher training (CELTA), instant results/feedback.
- Each capability: our level and each competitor's level as "full" | "partial" | "none". Do NOT overstate ours.
- gap: "moat" (we lead & it's defensible), "parity", "close" (rivals slightly ahead), "watch" (we're behind).
- pricing: 3-5 real, current competitor price points with a short note; copy figures from sources, never invent — if unknown, say "unpublished".

Return JSON exactly:
- competitors: string[] (column order, our rivals only)
- features: array of { capability, esworld: "full"|"partial"|"none", competitors: [{ name, level }], gap: "moat"|"parity"|"close"|"watch" }
- pricing: array of { competitor, plan, price, note }
- headline: string (one line — the single most important competitive read right now)`;

export function demoMatrix(): CompetitorMatrix {
  const L = (a: Level, b: Level, c: Level): { name: string; level: Level }[] => [
    { name: "British Council", level: a },
    { name: "EC English", level: b },
    { name: "Duolingo ET", level: c },
  ];
  return {
    competitors: ["British Council", "EC English", "Duolingo ET"],
    headline: "[Demo] Our accredited HE pathway + two-city immersion are moats; watch instant-results and public pricing.",
    features: [
      { capability: "Accredited HE pathway (ATHE)", esworld: "full", competitors: L("none", "none", "none"), gap: "moat" },
      { capability: "Own placement test (AZE)", esworld: "partial", competitors: L("full", "none", "full"), gap: "parity" },
      { capability: "Flexible / on-demand formats", esworld: "full", competitors: L("partial", "full", "full"), gap: "parity" },
      { capability: "Cultural immersion (two cities)", esworld: "full", competitors: L("partial", "partial", "none"), gap: "moat" },
      { capability: "Transparent public pricing", esworld: "partial", competitors: L("full", "full", "full"), gap: "close" },
      { capability: "IELTS preparation", esworld: "full", competitors: L("full", "full", "none"), gap: "parity" },
      { capability: "Teacher training (CELTA)", esworld: "full", competitors: L("full", "partial", "none"), gap: "parity" },
      { capability: "Instant results / feedback", esworld: "none", competitors: L("none", "none", "full"), gap: "watch" },
    ],
    pricing: [
      { competitor: "British Council", plan: "IELTS Preparation (Dubai)", price: "~AED 3,200", note: "Public price; recently trimmed." },
      { competitor: "EC English", plan: "General English / week", price: "~USD 250", note: "Excludes registration." },
      { competitor: "Duolingo ET", plan: "Test attempt", price: "~USD 65", note: "Convenience play; not a course." },
    ],
  };
}

/** Runs the competitor research once — shared by the on-demand POST and the cron. */
export async function researchMatrix(): Promise<MatrixResult> {
  if (!hasLiveAgents()) return { matrix: demoMatrix(), demo: true, sources: [], searched: false };
  const sink: { sources?: Source[]; searched?: boolean } = {};
  try {
    const matrix = await runJsonAgent<CompetitorMatrix>(
      { system: SYSTEM, user: "Build the current ES World competitor feature/gap matrix and pricing snapshot now. Research live where you can.", maxTokens: 3000, webSearch: true },
      sink
    );
    return { matrix, demo: false, sources: sink.sources || [], searched: Boolean(sink.searched) };
  } catch {
    return { matrix: demoMatrix(), demo: true, sources: [], searched: false };
  }
}
