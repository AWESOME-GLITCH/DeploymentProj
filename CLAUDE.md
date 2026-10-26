# Learning Path app

A public, self-serve English learning app: absolute beginner to high level, bite-size chunks, spaced repetition, clear CEFR progress. No tutoring or messaging inside the app. Owner and board: ST (Global Product Manager).

## Non-negotiable rules

Read `docs/design-rules.md` (copy of the Paperclip `learning-path-design-rules` skill) before any UI work. In short:

- Every screen understandable in five seconds. Few elements per screen; if in doubt, remove it. One headline, one primary action.
- Mobile-first at 375 to 390px, then desktop at 1440px. One desktop screen per page, no main-page scroll; mobile may scroll inside a lesson only.
- Every page has a visual aid (progress bar, ring, simple bar or line, road marker). No radar charts. No pages of text boxes.
- Plain learner-facing words: Home, Lesson, Practice, How I'm doing.
- Lessons are in English. The learner's own language is only the interface language and captions.
- Explainer videos are 2D flat-vector motion graphics, clear and well made. No 3D.
- Rejected and not to return: cartoon mascots, Duolingo-style bold blocks, flat or circular path nodes, bento grids, top nav instead of a left sidebar on desktop, radar charts.
- British English everywhere, concise, no em dashes.

Colour: the design rules file describes the AZE dark system. The board also asked in session for light and dark modes with no purple. Until the board settles this, keep the current tokens in `app/learning-path/lp.css` and do not restyle colours.

## Stack (as built, this is a Next.js app, not Vite)

- Next.js 14 App Router, TypeScript strict, Tailwind plus `app/learning-path/lp.css` tokens and components.
- The Learning Path prototype lives at route `/learning-path` (`app/learning-path/page.tsx`) and renders `components/learning-path/App.tsx` as a fixed full-screen app.
- Engine, content, scoring and persistence: `lib/learning-path/` (engine.ts, content.ts, scoring.ts, speech.ts, store.tsx, i18n.ts, types.ts).
- Screens: `components/learning-path/` (Onboarding, Home, Road, Capsule, Progress, Classmates, Me, items, ui, scenes).
- Explainer videos: Remotion compositions in `components/learning-path/explainer/` (`lib.tsx` shared kit, `Cafe.tsx` reference, `ExplainerPlayer.tsx` the interactive layer). 1080×1440, 30 fps, deterministic from `useCurrentFrame()`.
- Storyboards for the remaining lessons: `docs/explainers/storyboards.md`. Product spec: `docs/learning-path/PRD.md`.

## Commands

```
npm install
npx tsc --noEmit                 # must be clean
CI=1 npx next build              # must be clean; wrap in flock /tmp/lp-build.lock when agents share the checkout
npx next start -p 3123           # serve the production build for Playwright checks
```

Playwright is preinstalled; launch Chromium with `executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"` and a 375×812 mobile viewport. Tester hook: `window.dispatchEvent(new CustomEvent("lp:auto", { detail: { correct: true } }))` auto-answers the current item.

## How work arrives

Tickets come from Paperclip. Several agents share this checkout: touch only the files your ticket names, run builds under `flock /tmp/lp-build.lock`, never commit or push (the release step does that), and never create a pull request. If a ticket and this file conflict, the ticket wins; say so in your report.

## Quality bar

- Keyboard reachable, visible focus, 4.5:1 text contrast, alt text on every image, 44px minimum tap targets.
- A learner with little English can tell what to do on any screen within five seconds.
