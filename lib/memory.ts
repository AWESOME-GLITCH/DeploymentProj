import type { Product } from "./knowledge";

/** Builds the shared grounding block every module feeds to the agent:
 *  the selected programme's real knowledge + pricing, plus any PM corrections.
 *  This is the app's "memory" — one source of truth across all segments. */
export function memoryBlock(product?: Product | null, corrections?: { kind: string; note: string }[]): string {
  let s = "";
  if (product) {
    s +=
      `\n\nES WORLD PRODUCT KNOWLEDGE — single source of truth. Use these REAL facts (name, campus, price, levels, format, schedule, intakes, audience, outcomes, outline, personas, positioning). Never invent a price — copy it exactly or write "[TBC]":\n` +
      JSON.stringify(product, null, 2);
  }
  if (corrections?.length) {
    s +=
      `\n\nPM CORRECTIONS — GROUND TRUTH. These override the knowledge above whenever they conflict. Obey every one; never repeat the mistakes they describe:\n` +
      corrections.map((c, i) => `${i + 1}. [${c.kind}] ${c.note}`).join("\n");
  }
  return s;
}
