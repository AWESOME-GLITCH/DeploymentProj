# scripts/lp — the continuous walkthrough (LEA-52 / LP-90)

Owned by the Test Engineer. Nothing in here touches the app: if a run finds a
break, the fix belongs to whoever owns the file, and the finding goes on their
ticket with the error text and the PNG path.

## Run it

```
scripts/lp/run.sh                 # typecheck, build, serve, walk both themes, report
scripts/lp/run.sh --themes dark   # one theme
scripts/lp/run.sh --no-build      # reuse the snapshot already built
```

Exit codes: `0` every screen passed, `1` at least one screen failed, `10`
typecheck broke, `11` the build broke, `12`–`14` the server would not start.

Output lands in `scripts/lp/out/`:

| file | what |
|---|---|
| `<theme>-<nn>-<screen>.png` | one PNG per screen, 375×812 at 2× |
| `report.txt` | one PASS/WARN/FAIL line per screen |
| `report.md` | the table, plus the evidence and the likely source file (with `git log -1`) for each failure |
| `report.json` | the same, for whatever reads it next |
| `build.log`, `typecheck.log`, `server.log` | when a step fails |

## What it walks

Onboarding (language, why, time, plan) → placement → Home → the first lesson
(plan, explainer with the "say it with me" turn, the coach, every item the
session serves, the close) → reward → Home with today done → How I'm doing →
Me → Road → Classmates → checkpoint → day 2 on the tester clock → a second
day's session. Roughly 62 screens per theme.

It drives the app the way a learner does, through the real controls, plus the
one tester hook CLAUDE.md documents:

```js
window.dispatchEvent(new CustomEvent("lp:auto", { detail: { correct: true } }))
```

It never imports app source and never keys off a hand-written list of screens,
so it survives other agents moving the markup about. Screens are named from
what is on them, so a new screen shows up in the report on its own.

## How a failure finds its owner

`report.md` names the likely source file under each failure, with `git log -1`
so you can see which agent last touched it. Two routes:

- A console error or stack trace names the file directly.
- A style failure names only a selector, so the run resolves it: the stylesheet
  that declares the class, then the components that put it on an element,
  ranked by how much of the broken screen's wording each file carries. That
  ranking is what puts `ExplainerPlayer.tsx` above the four other `.lp-glass`
  users for the explainer's ask sheet.

It is a ranked guess, not a verdict. Read the PNG before you post it on a
ticket.

## What makes a screen fail

- a console error, page error, failed request, or a 5xx while that screen was up
- the app not rendering (`.lp-root` missing)
- the theme not matching what the browser asked for
- the page scrolling (no main-page scroll is allowed)
- nothing on the screen that can be focused or tapped
- the main button off the bottom of the viewport
- a see-through panel carrying words over a lesson scene
- the main button doing nothing: the screen is unchanged 12s after the tap
- a stretch that will not advance, or never finishes

Warnings (reported, do not fail the run): content cut off below the fold, tap
targets under 44px, images with no alt text, a screen with no visual aid, a nav
laid out for more tabs than it has.

## The shared checkout

Several agents build in this checkout at once, which breaks servers two ways.
Both are handled, and neither is a bug in the app:

1. **A rebuild under a running server** replaces the chunks and the next page
   load dies with `ChunkLoadError`. So `build-and-serve.sh` takes a hardlink
   snapshot of `.next` *inside the same flock as the build* and serves that
   from `/tmp/lp-snapshot-*`. The next agent's build cannot reach it.
2. **A blanket `pkill next-server`** from someone else's restart script takes
   our server down mid-walk. The walkthrough notices, restarts from the
   snapshot it already has (no rebuild), and takes that theme again from the
   top rather than reporting a false failure. It happened twice during the
   first run.

`build-and-serve.sh` only ever kills the server it started, by pid, and picks a
free port in 3131–3160 so it never fights another agent for 3123.

## The schedule

LEA-52 carries an issue monitor (`kind: external_service`, `serviceName:
lp-walkthrough`) that wakes the Test Engineer every 30 minutes to run this.
`maxAttempts` is capped at 100 and `timeoutAt` has to be a real date, so the
monitor needs re-arming on a later wake — push `nextCheckAt` forward each run
and extend `timeoutAt` before it lapses, or the schedule quietly stops.
