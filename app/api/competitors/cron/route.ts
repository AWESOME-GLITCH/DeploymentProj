import { NextRequest, NextResponse } from "next/server";
import { researchMatrix, type CompetitorMatrix } from "@/lib/competitors";
import { kvGetJSON, kvSetJSON, kvEnabled } from "@/lib/kv";

export const maxDuration = 60;
const CACHE_KEY = "competitors:latest";

// A compact fingerprint so we can tell if the matrix actually changed day-to-day.
function fingerprint(m: CompetitorMatrix): string {
  const feat = m.features.map((f) => `${f.capability}:${f.esworld}:${f.gap}:${f.competitors.map((c) => c.level).join("")}`).join("|");
  const price = m.pricing.map((p) => `${p.competitor}=${p.price}`).join("|");
  return feat + "||" + price;
}

// Hit daily by Vercel Cron (see vercel.json). Refreshes the matrix and records
// whether anything changed vs. yesterday, so the change can be surfaced later.
export async function GET(req: NextRequest) {
  // When CRON_SECRET is set, Vercel sends it as a bearer token — enforce it.
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await researchMatrix();
  if (result.demo) {
    return NextResponse.json({ ok: false, reason: "no live agent / credits — nothing cached", demo: true });
  }
  if (!kvEnabled) {
    return NextResponse.json({ ok: false, reason: "KV not provisioned — research ran but has nowhere to persist. Add a Vercel KV store." });
  }

  const prev = await kvGetJSON<{ matrix: CompetitorMatrix; fingerprint?: string }>(CACHE_KEY);
  const fp = fingerprint(result.matrix);
  const changed = prev?.fingerprint ? prev.fingerprint !== fp : false;

  await kvSetJSON(CACHE_KEY, { ...result, fingerprint: fp, changed, capturedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true, changed, headline: result.matrix.headline });
}
