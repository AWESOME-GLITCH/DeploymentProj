import { NextResponse } from "next/server";
import { researchMatrix } from "@/lib/competitors";
import { kvGetJSON, kvSetJSON, kvEnabled } from "@/lib/kv";

export type { CompetitorMatrix, FeatureRow } from "@/lib/competitors";

const CACHE_KEY = "competitors:latest";

// On-demand live research ("Refresh research"). Caches the result if KV is on.
export async function POST() {
  const result = await researchMatrix();
  if (kvEnabled && !result.demo) {
    await kvSetJSON(CACHE_KEY, { ...result, capturedAt: new Date().toISOString() });
  }
  return NextResponse.json(result);
}

// Returns the last cached (e.g. cron-refreshed) matrix without spending tokens.
export async function GET() {
  const cached = await kvGetJSON<any>(CACHE_KEY);
  if (cached) return NextResponse.json({ ...cached, cached: true });
  return NextResponse.json({ cached: false });
}
