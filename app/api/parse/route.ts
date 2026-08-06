import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { apiKey, AGENT_MODEL, hasLiveAgents } from "@/lib/agent";

export const maxDuration = 60;

const isTextName = (n = "") => /\.(txt|md|markdown|csv|tsv|json|html?|log)$/i.test(n);
const isTextType = (t = "") => t.startsWith("text/") || t === "application/json";

// Accepts a base64 file → returns extracted plain text.
export async function POST(req: NextRequest) {
  const { data, mediaType, name } = await req.json().catch(() => ({}));
  if (!data) return NextResponse.json({ error: "No file." }, { status: 400 });

  // Text-like files: decode directly (works without a key).
  if (isTextType(mediaType) || isTextName(name)) {
    const text = Buffer.from(data, "base64").toString("utf8");
    return NextResponse.json({ text });
  }

  const isPdf = mediaType === "application/pdf" || /\.pdf$/i.test(name || "");
  const isImg = typeof mediaType === "string" && mediaType.startsWith("image/");
  if (!isPdf && !isImg) {
    return NextResponse.json({ text: "", note: "Drop a PDF, an image, or a text/CSV file. For Word docs, export to PDF first." });
  }
  if (!hasLiveAgents()) {
    return NextResponse.json({ text: "", note: "PDFs/images need the API key + credits to read; text files work without them." });
  }

  try {
    const client = new Anthropic({ apiKey: apiKey() });
    const block: any = isPdf
      ? { type: "document", source: { type: "base64", media_type: "application/pdf", data } }
      : { type: "image", source: { type: "base64", media_type: mediaType, data } };
    const msg = await client.messages.create({
      model: AGENT_MODEL,
      max_tokens: 2500,
      messages: [{ role: "user", content: [block, { type: "text", text: "Extract all the meaningful content from this file as clean plain text I can paste as input to a product tool. Keep numbers, prices, dates and field labels. No preamble, no commentary." }] }],
    });
    const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    return NextResponse.json({ text });
  } catch (e) {
    console.error("[parse] failed:", (e as Error)?.message || String(e));
    return NextResponse.json({ text: "", note: "Couldn't read that file, try a PDF, image, or text file." });
  }
}
