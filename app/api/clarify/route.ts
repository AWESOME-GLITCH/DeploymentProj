import { NextRequest, NextResponse } from "next/server";
import { hasLiveAgents, runJsonAgent } from "@/lib/agent";

const DEFAULTS = [
  "Who exactly is this for (which segment / persona)?",
  "What's the single success metric we're chasing?",
  "What's the timeline / intake, and any hard deadline?",
  "What's the price point or budget, and what does it include?",
  "What must we NOT do — the constraints or non-goals?",
  "How is this different from what competitors offer?",
];

export async function POST(req: NextRequest) {
  const { input, context } = await req.json().catch(() => ({}));
  if (!input || input.trim().length < 4) return NextResponse.json({ questions: [] });

  if (!hasLiveAgents()) return NextResponse.json({ questions: DEFAULTS.slice(0, 5), demo: true });

  try {
    const out = await runJsonAgent<{ questions: string[] }>({
      system:
        "You are a sharp, experienced product manager running discovery for ES World (Dubai & London language education). Given a rough idea, ask the 4-6 MOST important clarifying questions to ask BEFORE any work — the ones that most change the outcome (target audience/persona, the one success metric, scope & non-goals, constraints, pricing/what's included, timeline/intake, differentiation). Make each question specific to THIS idea, not generic. Return JSON {\"questions\": string[]}.",
      user: `Context: ${context || "ES World language education"}\n\nThe idea / input:\n${input}\n\nAsk the clarifying questions now.`,
      maxTokens: 700,
    });
    return NextResponse.json({ questions: out.questions?.length ? out.questions : DEFAULTS.slice(0, 5) });
  } catch {
    return NextResponse.json({ questions: DEFAULTS.slice(0, 5), demo: true });
  }
}
