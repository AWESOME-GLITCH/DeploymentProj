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

**Planned (from the gap analysis)** — Portfolio, Roadmap, Prioritization, Strategy & OKRs.

## Design principles (research-backed)

- **Hub-and-spoke, few agents** — one agent per module, all reading/writing one versioned Knowledge store.
- **Human-in-the-loop** — agents draft & synthesize; you approve what becomes "truth".
- **Evidence-preserving** — insights carry sample size, confidence, and correlation-vs-causation labels; competitor prices carry source/confidence flags.
- **On brand** — ES World Brand Standards 2026 (Orange `#FF8300`, Calibri Light) enforced in the Marketing module.

## Run locally

```bash
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY to enable live agents
npm run dev
```

Without an `ANTHROPIC_API_KEY` the AI modules run in **demo mode** (crafted sample output) so the app still deploys and demos cleanly.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Anthropic SDK. Deployable to Vercel.
