import { NextResponse } from "next/server";

// Diagnostic only — reports whether the API key is present, never its value.
export const dynamic = "force-dynamic";

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  console.log(`[keycheck] hasKey=${hasKey}`);
  return NextResponse.json({
    hasKey,
    model: process.env.PM_AGENT_MODEL || "claude-sonnet-5",
    note: hasKey ? "Live agents enabled." : "No key on this deployment — add ANTHROPIC_API_KEY (Production) and redeploy.",
  });
}
