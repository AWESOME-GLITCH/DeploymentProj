import Anthropic from "@anthropic-ai/sdk";

export const AGENT_MODEL = process.env.PM_AGENT_MODEL || "claude-sonnet-5";

// Accept the standard name or the PRD_OS name used in this deployment.
export function apiKey(): string {
  return process.env.ANTHROPIC_API_KEY || process.env.PRD_OS || "";
}

export function hasLiveAgents(): boolean {
  return Boolean(apiKey());
}

/** Pull the JSON object out of a model response that may also contain
 *  research commentary or citations. Grabs the outermost { ... } block. */
function extractJson(text: string): string {
  const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    return cleaned.slice(first, last + 1);
  }
  return cleaned;
}

/**
 * Runs a single agent turn that returns JSON. When `webSearch` is true the
 * agent can search the live web (Anthropic server-side web_search tool) before
 * answering — this is what gives every module its research ability.
 */
export async function runJsonAgent<T>({
  system,
  user,
  maxTokens = 2000,
  webSearch = false,
  maxSearches = 4,
}: {
  system: string;
  user: string;
  maxTokens?: number;
  webSearch?: boolean;
  maxSearches?: number;
}): Promise<T> {
  const client = new Anthropic({ apiKey: apiKey() });
  const fullSystem =
    system +
    "\n\nWhen research would improve accuracy (competitors, current prices, market facts), use web search first, then respond with ONLY a single valid JSON object — no prose, no markdown fences.";

  async function once(useTools: boolean): Promise<T> {
    const msg = await client.messages.create({
      model: AGENT_MODEL,
      max_tokens: maxTokens,
      system: fullSystem,
      tools: useTools ? ([{ type: "web_search_20250305", name: "web_search", max_uses: maxSearches }] as any) : undefined,
      messages: [{ role: "user", content: user }],
    });
    const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    return JSON.parse(extractJson(text)) as T;
  }

  try {
    return await once(webSearch);
  } catch (e) {
    // If web search isn't enabled on the account (or errored), retry without it
    // so a valid key still produces live output instead of falling back to demo.
    if (webSearch) return await once(false);
    throw e;
  }
}
