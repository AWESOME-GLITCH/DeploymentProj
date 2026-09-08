# ES World — Product Operating System

An AI-native product operating system for [ES World](https://esworld.com) (Dubai & London language education), built hub-and-spoke around a single **Product Knowledge** source of truth, with a trained agent behind each module and a human-in-the-loop gate on every decision.

## Modules

**Core (built)**
1. **Product Brief** — messy input → structured brief _(live AI + demo fallback)_
2. **Product Knowledge** — one source of truth for the whole catalogue (Dubai + London)
3. **Marketing Studio** — brand-compliant content from your Knowledge hub _(live AI + demo fallback)_
4. **Trends & Analytics** — cohorts, funnels, retention, honest insights
5. **Pricing Intelligence** — costs + market → informed price, with confidence flags
6. **Feedback Analysis** — themes tied to real quotes, NPS/CSAT/CES, bias flags
7. **Think Lab** — raw idea → testable MVP, grounded in Knowledge + research _(live AI + demo fallback)_
8. **Speaking Assessment** — a spoken level check in the browser: the examiner asks, the student answers out loud, and the report gives a CEFR band with the evidence behind it _(live AI + offline scoring fallback)_

**Planned (from the gap analysis)** — Portfolio, Roadmap, Prioritization, Strategy & OKRs.

## Design principles (research-backed)

- **Hub-and-spoke, few agents** — one agent per module, all reading/writing one versioned Knowledge store.
- **Human-in-the-loop** — agents draft & synthesize; you approve what becomes "truth".
- **Evidence-preserving** — insights carry sample size, confidence, and correlation-vs-causation labels; competitor prices carry source/confidence flags.
- **On brand** — ES World Brand Standards 2026 (Orange `#FF8300`, Calibri Light) enforced in the Marketing module.
- **Guardrails at the edge and the door** — the Speaking module runs the same rule set in the browser (before a turn is stored or spoken back) and again in the API route, so a hand-made request cannot skip it. Prompt injection, exam cheating, abuse and spoken card/ID numbers are held back and logged; a safeguarding disclosure stops the exam and points to a human.

## Run locally

```bash
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY to enable live agents
npm run dev
```

Without an `ANTHROPIC_API_KEY` the AI modules run in **demo mode** (crafted sample output) so the app still deploys and demos cleanly.

## Speaking Assessment, what it does and does not claim

Uses the browser Web Speech API (Chrome and Edge give voice; anywhere else a student can type and still get a band). Four parts, about ten minutes. The report scores fluency, vocabulary, grammar and task response from measured transcript signals (words per minute, moving-average type-token ratio, linking phrases, filler rate, answer length), then an examiner agent turns those into a band with evidence and next steps.

It never scores pronunciation, accent or intonation. It marks a speech-to-text transcript, and a transcript carries none of those, so scoring them would be inventing evidence. The report says so, and flags low confidence on a thin sample instead of padding a band. It is indicative placement, not an IELTS or CEFR certificate.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Anthropic SDK. Deployable to Vercel.
