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

9. **Learning Path** — a tappable, phone-sized prototype of the Learning Path English app at `/learning-path` (see below)

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

## Learning Path prototype

Open `/learning-path` on a phone, or on a laptop to get the phone frame with a tester panel beside it. The spec it follows is `docs/learning-path/PRD.md` (build-ready PRD) and `docs/learning-path/MARKET-RESEARCH.md`. It is a standalone initiative with its own identity: light mode is linen with a deep teal accent, dark mode is slate charcoal with a saffron yellow accent, and there is no product branding in the app.

What you can test, all in the browser with no backend:

- **First run** in under four minutes: language, why, daily time, an if-then study plan, "let us find your start" (an adaptive placement that is never called a test), the first lesson and the reward.
- **Ten-minute sessions** composed by the engine: plan, recall echo, one new atom (animated concept video or word tutorial, noticing, controlled practice, free use), a use atom, a story at 98% known words, and the close with the delayed check, the "I can / not yet" reflection and the week's can-do.
- **Every item type** from the PRD: tap-to-order, gap fill, error spot, transform, picture match, true/false/not given, heading match, dictation, detail gap, gist and inference, sentence build, short production with a rubric, read-aloud, shadowing with Sounds/Rhythm/Words bars, open response, "Say it, see it" (a scene that re-renders what you said), magnet tiles, the time slider, role-play with an AI character, "Explain it to Sami" relay, and vote-see-revote.
- **Speech** through the browser's Web Speech API (Chrome and Edge) with a type-instead fallback everywhere; scoring is a deterministic stand-in for the AZE engine with a confidence gate.
- **The memory engine**: a per-item half-life model (p = 2^(-elapsed/half-life), due at 0.8), the New to Mastered ladder, error rules, the two-modality Known rule, the 25-review cap, criterion mastery on separate days, provisional sub-levels and a mock AZE checkpoint that never demotes.
- **Home, Road (with fog of memory), Progress, Classmates (5-item challenge) and Me**, L1 interfaces for Arabic (RTL), Hindi, Russian, Spanish, Turkish and Chinese following the L1 rule, text size to 130%, reduce motion, light and dark themes.

The **tester panel** (the flask tab on a phone) fills any item correctly or wrongly, moves the clock by days to trigger reviews, warm restarts and the checkpoint, and shows the scheduler table, criterion mastery, the composer's reasons for today's session and the analytics event stream. State lives in `localStorage`; "Start again" in Me resets it.

Not built in this prototype: real video, the AZE API, accounts, offline caching, the CMS and the analytics pipeline.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Anthropic SDK. Deployable to Vercel.
