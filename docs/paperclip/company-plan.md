# Learning Path explainers: Paperclip company plan

Paperclip runs on your machine and hires Claude Code sessions as agents. This file is the
company you create there so the explainer work runs as a team: one art director who owns
the shared kit and the style, one animator per lesson, one QA agent, one release agent.
Every agent works in this repository on branch `claude/stoic-heisenberg-wokkl6`.

Inputs the agents read first:

- `docs/PRD.md` (pedagogy: noticing, one target per atom, 80% watched rule, lessons in English)
- `docs/explainers/storyboards.md` (beats, narration, targets, pause points, L1 captions, per atom)
- `components/learning-path/explainer/lib.tsx` (shared characters, props, transitions, text helpers)
- `components/learning-path/explainer/Cafe.tsx` (the reference composition, 1080×1440, 30 fps)
- `components/learning-path/explainer/ExplainerPlayer.tsx` (register a new explainer in `EXPLAINERS`)

Style rules every agent must keep: 2D flat vector only, no 3D, no purple, palette ink `#1b1d3a`,
indigo `#3a3fc7`, saffron `#f5b733`, paper `#fbf7f0`; font `var(--lp-font, "Plus Jakarta Sans")`;
deterministic frames from `useCurrentFrame()` only; caption bar at the bottom and beat bar at the top.

Verification every agent runs before marking an issue done:

```
npx tsc --noEmit
CI=1 npx next build
```

then the Playwright capture in the issue, and they attach 5 frame PNGs to the issue.

## Agents

| Agent | Adapter | Role instructions (paste as the agent's instructions) |
| --- | --- | --- |
| Art Director | Claude Code | You own `components/learning-path/explainer/lib.tsx` and the look of every explainer. Review each animator's pull request frames against the cafe reference. Reject anything that is not crafted: stiff characters, overlaps, cut-off text, flat static scenes. Add missing kit pieces yourself rather than letting animators fork the kit. |
| Animator (one per lesson) | Claude Code | Build the Remotion composition for your assigned atom from its storyboard, using only `lib.tsx` components. Keep the Beat contract: ids, frame ranges, line, target, pauseAt. Register it in `EXPLAINERS` with the L1 caption map. Capture frames, iterate until the Art Director approves. |
| QA | Claude Code | Run the full walkthrough script (`scratchpad/pw/walk2.mjs` pattern: onboarding, placement, first lesson, day 2) on every push. Confirm no console errors, every fixed screen fits 375×812, Continue unlocks at 80%, the mic pause scores and resumes, light and dark both pass. File a blocking issue for any failure with the PNG attached. |
| Release | Claude Code | After QA passes: rebuild the standalone bundle (`scratchpad/build-artifact.sh`), republish the artifact, commit with a clear message, push the branch. Never create a pull request unless the PM asks. |

Budgets: give each animator a monthly cap; one lesson explainer is roughly a 2 to 4 hour Claude Code run.

## Issues (create in this order; animators run in parallel)

| # | Title | Assignee | Depends on | Done when |
| --- | --- | --- | --- | --- |
| 1 | Upgrade cafe explainer craft and extract the shared kit | Art Director | – | `lib.tsx` exists, `Cafe.tsx` rebuilt on it, frames approved by the PM |
| 2 | Storyboards reviewed and locked | Art Director | – | `docs/explainers/storyboards.md` approved, kit gaps listed in the "Shared kit needs" section are added to `lib.tsx` |
| 3 | Explainer: ATM-A2-GRM-0002 | Animator A | 1, 2 | registered, frames approved |
| 4 | Explainer: ATM-A2-LST-0004 | Animator B | 1, 2 | registered, frames approved |
| 5 | Explainer: ATM-A1-SPK-0005 | Animator C | 1, 2 | registered, frames approved |
| 6 | Explainer: ATM-A2-RDG-0006 | Animator D | 1, 2 | registered, frames approved |
| 7 | Explainer: ATM-A2-WRT-0007 | Animator E | 1, 2 | registered, frames approved |
| 8 | Explainer: ATM-A2-MED-0008 | Animator F | 1, 2 | registered, frames approved |
| 9 | Explainer: ATM-A2-INT-0009 | Animator G | 1, 2 | registered, frames approved |
| 10 | Explainer: ATM-A2-GRM-0003 | Animator H | 1, 2 | registered, frames approved |
| 11 | Explainer: ATM-A2-INT-0010 | Animator I | 1, 2 | registered, frames approved |
| 12 | Full walkthrough QA, light and dark | QA | 3 to 11 | no failures, PNGs attached |
| 13 | Bundle, publish artifact, commit, push | Release | 12 | artifact link posted to the PM |

## Connecting Paperclip to this cloud session (optional)

This session runs in a cloud container with Node 22 and no route to your machine, so it cannot
run Paperclip itself (Paperclip needs Node 24.11 or newer) and cannot reach a Paperclip bound to
localhost. If you want the cloud session to create and track these issues inside your Paperclip,
run a Paperclip MCP bridge where claude.ai can reach it and add it as a custom connector:

```
npx paperclip-mcp   # community bridge, exposes the Paperclip API as MCP tools
```

Then add the bridge's URL under claude.ai connector settings and send a message here.
