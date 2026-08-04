import Anthropic from "@anthropic-ai/sdk";

export const AGENT_MODEL = process.env.PM_AGENT_MODEL || "claude-sonnet-5";

export function hasLiveAgents(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * Runs a single agent turn that MUST return JSON matching the shape the caller
 * asks for. Returns the parsed object. Throws if the model output can't be
 * parsed — callers decide whether to surface the error or fall back to demo.
 */
export async function runJsonAgent<T>({
  system,
  user,
  maxTokens = 2000,
}: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<T> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const msg = await client.messages.create({
    model: AGENT_MODEL,
    max_tokens: maxTokens,
    system:
      system +
      "\n\nRespond with ONLY a single valid JSON object. No prose, no markdown fences.",
    messages: [{ role: "user", content: user }],
  });

  const text = msg.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("");

  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned) as T;
}
