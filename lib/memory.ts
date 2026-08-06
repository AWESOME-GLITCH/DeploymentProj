import type { Product } from "./knowledge";
import { COMPANY_MEMORY } from "./company";

export type MemoryItem = { kind: string; title: string; html?: string };

/** Strip HTML to clean text and bound the length so context stays cheap. */
function toText(html = "", max = 700): string {
  const t = html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return t.length > max ? t.slice(0, max) + "…" : t;
}

/** Builds the shared grounding block every module feeds to the agent:
 *  the selected programme's real knowledge + pricing, the work already created
 *  for it (from the Library), plus any PM corrections. This is the app's
 *  "memory", one source of truth across all segments. */
export function memoryBlock(
  product?: Product | null,
  corrections?: { kind: string; note: string }[],
  savedWork?: MemoryItem[]
): string {
  let s = "\n\n" + COMPANY_MEMORY;
  if (product) {
    s +=
      `\n\nES WORLD PRODUCT KNOWLEDGE, single source of truth. Use these REAL facts (name, campus, price, levels, format, schedule, intakes, audience, outcomes, outline, personas, positioning). Never invent a price, copy it exactly or write "[TBC]":\n` +
      JSON.stringify(product, null, 2);
  }
  if (savedWork?.length) {
    s +=
      `\n\nWORK ALREADY CREATED FOR THIS PROGRAMME (from the Library, reuse and stay consistent with it; don't contradict decisions already made here):\n` +
      savedWork
        .slice(0, 8)
        .map((w) => `, ${w.kind}: ${w.title}${w.html ? `\n  ${toText(w.html)}` : ""}`)
        .join("\n");
  }
  if (corrections?.length) {
    s +=
      `\n\nPM CORRECTIONS, GROUND TRUTH. These override everything above whenever they conflict. Obey every one; never repeat the mistakes they describe:\n` +
      corrections.map((c, i) => `${i + 1}. [${c.kind}] ${c.note}`).join("\n");
  }
  return s;
}
