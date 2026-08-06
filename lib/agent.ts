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

/** A web source the agent actually consulted (from the web_search tool). */
export type Source = { url: string; title: string; age?: string };

/** Pull the real sources out of a response's web_search result + citation blocks. */
export function extractSources(content: any[]): Source[] {
  const out: Source[] = [];
  const seen = new Set<string>();
  const add = (url?: string, title?: string, age?: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    out.push({ url, title: title || url, age });
  };
  for (const b of content || []) {
    if (b?.type === "web_search_tool_result" && Array.isArray(b.content)) {
      for (const r of b.content) if (r?.type === "web_search_result") add(r.url, r.title, r.page_age);
    }
    if (b?.type === "text" && Array.isArray(b.citations)) {
      for (const c of b.citations) add(c.url, c.title);
    }
  }
  return out;
}

/** Pull the FIRST balanced JSON object out of a model response that may wrap it
 *  in prose ("I need to…"), code fences, or trailing commentary/citations.
 *  Scans brace depth while respecting strings, so preamble/postamble can't break it. */
function extractJson(text: string): string {
  const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  if (start === -1) return cleaned;
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < cleaned.length; i++) {
    const c = cleaned[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return cleaned.slice(start, i + 1);
    }
  }
  // Unbalanced (truncated), return best effort from the first brace.
  return cleaned.slice(start);
}

/**
 * Runs a single agent turn that returns JSON. When `webSearch` is true the
 * agent can search the live web (Anthropic server-side web_search tool) before
 * answering, this is what gives every module its research ability.
 */
export async function runJsonAgent<T>(
  {
    system,
    user,
    maxTokens = 2000,
    webSearch = false,
    maxSearches = 2,
  }: {
    system: string;
    user: string;
    maxTokens?: number;
    webSearch?: boolean;
    maxSearches?: number;
  },
  sink?: { sources?: Source[]; searched?: boolean }
): Promise<T> {
  const client = new Anthropic({ apiKey: apiKey() });
  // Research (web search) is OFF by default, it's the costly part. Agents still
  // work from your Knowledge. Turn live research on deliberately: ENABLE_WEB_SEARCH=1.
  const useTools = webSearch && process.env.ENABLE_WEB_SEARCH === "1";
  const HOUSE_STYLE =
    "\n\nWRITING STYLE: Write in clear, simple English at about CEFR B1 level. Use short sentences and common words. One idea per sentence. No jargon, no marketing waffle, no clever phrasing. Be direct and easy to understand. NEVER use em dashes or long dashes (—); use a full stop or a comma instead.";
  const fullSystem =
    system +
    HOUSE_STYLE +
    (useTools ? "\n\nUse web search only if it clearly improves accuracy." : "") +
    "\n\nRespond with ONLY a single valid JSON object, no prose, no markdown fences.";

  async function once(tools: boolean): Promise<T> {
    const msg = await client.messages.create({
      model: AGENT_MODEL,
      max_tokens: maxTokens,
      // Prompt-cache the (large) system prompt so repeated calls only pay ~10%
      // of its input cost, the strategy/company memory is reused on every run.
      system: [{ type: "text", text: fullSystem, cache_control: { type: "ephemeral" } }] as any,
      tools: tools ? ([{ type: "web_search_20250305", name: "web_search", max_uses: maxSearches }] as any) : undefined,
      messages: [{ role: "user", content: user }],
    });
    if (sink) {
      sink.sources = extractSources(msg.content as any[]);
      sink.searched = tools;
    }
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
