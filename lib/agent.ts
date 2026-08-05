import Anthropic from "@anthropic-ai/sdk";

// Cheap + capable by default. Override with PM_AGENT_MODEL if you want more power.
export const AGENT_MODEL = process.env.PM_AGENT_MODEL || "claude-haiku-4-5-20251001";

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
  // Web search is powerful but costs more — off unless ENABLE_WEB_SEARCH=1.
  // Agents still work well from the provided product knowledge.
  const useTools = webSearch && process.env.ENABLE_WEB_SEARCH === "1";
  const fullSystem =
    system +
    (useTools ? "\n\nUse web search only if it clearly improves accuracy." : "") +
    "\n\nRespond with ONLY a single valid JSON object — no prose, no markdown fences.";

  async function once(tools: boolean): Promise<T> {
    const msg = await client.messages.create({
      model: AGENT_MODEL,
      max_tokens: maxTokens,
      system: fullSystem,
      tools: tools ? ([{ type: "web_search_20250305", name: "web_search", max_uses: maxSearches }] as any) : undefined,
      messages: [{ role: "user", content: user }],
    });
    const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    return JSON.parse(extractJson(text)) as T;
  }

  try {
    return await once(useTools);
  } catch (e) {
    console.error("[agent] failed:", (e as Error)?.message || String(e));
    if (useTools) {
      try {
        return await once(false);
      } catch (e2) {
        console.error("[agent] retry failed:", (e2 as Error)?.message || String(e2));
        throw e2;
      }
    }
    throw e;
  }
}
