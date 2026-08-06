import { NextRequest, NextResponse } from "next/server";
import { hasLiveAgents, runJsonAgent } from "@/lib/agent";
import { memoryBlock } from "@/lib/memory";
import { PROPOSAL_FORM_SPEC, demoProposalForm, type ProposalForm } from "@/lib/proposalForm";

// Proposals are produced as ES World's official Product Proposal Form (Step 1).
export type Proposal = ProposalForm;

const SYSTEM = `You are the Product Manager for ES World (Dubai & London language education), filling out ES World's OFFICIAL Product Proposal Form (the Step 1 document in the product process).
Turn the PM's input into a complete, submission-ready proposal in that exact form. Use only facts present in the input, the product knowledge, or clearly reasonable for ES World; where a fact is genuinely missing, write "[TBC]" rather than inventing specifics. Never invent prices, copy them from the knowledge or write "[TBC]". Name which strategic pillar and which pathway (Access to English / Education / Work) the product serves.

Return a JSON object with exactly this shape:
${PROPOSAL_FORM_SPEC}`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const input: string = body.input || "";
  const memory = memoryBlock(body.product, body.corrections, body.savedWork);
  const title = (input.split("\n").find((l) => l.trim()) || "New proposal").trim().slice(0, 60);
  if (!input || typeof input !== "string" || input.trim().length < 4) {
    return NextResponse.json({ error: "Provide some input to build a proposal from." }, { status: 400 });
  }
  if (!hasLiveAgents()) {
    return NextResponse.json({ proposal: demoProposalForm(title), demo: true });
  }
  try {
    const proposal = await runJsonAgent<ProposalForm>({
      system: SYSTEM,
      user: `Fill the Product Proposal Form from this input.${memory}\n\nThe PM's input:\n${input}`,
      maxTokens: 5000,
      webSearch: true,
    });
    return NextResponse.json({ proposal, demo: false });
  } catch {
    return NextResponse.json({ proposal: demoProposalForm(title), demo: true, note: "Live agent errored; showing demo output." });
  }
}
