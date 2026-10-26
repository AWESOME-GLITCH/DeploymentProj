# Learning Path design direction

One page. Decided for LP-10, applied to `/learning-path`. British English.

## Style name

**Quiet Horizon.** A drawn journey on calm paper by day and on night air by dark.
The learner always sees a road, where they stand on it, and one lit button. Everything
else is removed. Finish is precision-made and quiet, never decorated.

Three moves make the whole system:

1. **The road is the interface.** Progress is a drawn line with stops, not a list of rows.
2. **One lit thing per screen.** Exactly one glowing element: the primary button, or today's
   marker on the road. Nothing else glows.
3. **Feedback is movement, not prose.** A tick scales in, a stop fills, the marker slides.
   Sentences only appear when the learner got something wrong and needs the model answer.

## What the references actually taught us

| Reference | What we took | What we left |
| --- | --- | --- |
| Duolingo path | A single linear path removes the "what now?" decision entirely; ordering carries spaced repetition without the learner having to find a "revision mode" ([Duolingo](https://blog.duolingo.com/new-duolingo-home-screen-design), [schools note](https://duolingoschools.zendesk.com/hc/en-us/articles/6829627901197-The-new-Duolingo-homescreen)) | Cartoon blocks, mascot, loud gamification |
| Headspace, Calm | Slow easing and long transitions settle the user before the task; one consistent visual language, motion and timing included ([Headspace: Designing for Calm](https://blakecrosley.com/guides/design/headspace), [Headspace UI breakdown](https://screensdesign.com/showcase/headspace-meditation-sleep)) | Illustrated characters as the brand; warm orange gradients |
| Linear, Stripe | 4px spacing base, small precise radii (6 to 12px), tracking tightened at display sizes and relaxed at small sizes, almost no ornament so the content is the only texture ([Linear tokens](https://duply.ai/linear/design-md), [Linear design system](https://www.designsystems.one/design-systems/linear)) | Near-black lavender tint (the board rejected violet "AI" looks) |
| Apple Fitness rings | A progress visual simple enough to read at a glance can carry a whole engagement system; three slices, colour-coded, closed or not closed ([Close Your Rings](https://www.apple.com/watch/close-your-rings/), [gamification analysis](https://saasdesigner.com/saas-gamification/apple-fitness/)) | Badges, monthly challenges, competitions |
| Speak, ELSA | Pronunciation reads as a conversation: a line to copy, a mic, an immediate per-sound response you can replay against the model ([ELSA UI breakdown](https://screensdesign.com/showcase/elsa-speak-english-learning), [review](https://e-student.org/elsa-speak-review/)) | The friendly AI mascot that guides every screen |
| Kurzgesagt, Vox | Flat geometric shapes and solid fills, so motion carries the explanation; one idea per shot; the palette and the font never change mid-piece ([Vox look breakdown](https://www.premiumbeat.com/blog/replicating-vox-motion-graphic/), [why it reads](https://trydemotion.com/blog/motion-graphics-like-vox)) | 3D, texture, anything decorative that does not explain |
| Founderz portal | Everything in one calm place, bite-size lessons, progress always visible ([Founderz](https://founderz.com/)) | Community feeds, live sessions |
| Material 3 motion | Concrete duration and easing tokens, with emphasised curves for the one thing that matters ([M3 easing and duration](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)) | Long multi-stage choreography |

## Palette

No purple. No orange. Yellow is allowed in dark mode only, on the "you are here" marker
and the review tint. One primary-action hue in both modes so the button is learnable.

### Light

| Role | Token | Value |
| --- | --- | --- |
| Page | `--lp-bg-0` | `#f3f6f5` |
| Card | `--lp-surface`, `--lp-glass` | `#ffffff` |
| Ink | `--lp-paper` | `#101f1d` |
| Ink soft | `--lp-paper-soft` | `#425c58` |
| Ink faint | `--lp-paper-faint` | `#56736f` (4.7:1 on paper) |
| Primary action | `--lp-glow` | `#0b7a6c` (white text, 5.2:1) |
| Primary deep | `--lp-glow-2` | `#0a6a5e` |
| Known, correct | `--lp-sea` | `#157f62` |
| You are here | `--lp-marker` | `#0d7f9c` (deep cyan) |
| Review, not lost | `--lp-sand` | `#2f7d93` (deep cyan, never amber by day) |
| Fog, not yet learned | `--lp-fog` | `#aebfbb` |
| Road surface | `--lp-road` | `#e0e9e7` |

### Dark

| Role | Token | Value |
| --- | --- | --- |
| Page | `--lp-bg-0` | `#07100f` |
| Glass | `--lp-glass` | `rgba(255,255,255,0.05)` |
| Ink | `--lp-paper` | `#eaf4f1` |
| Ink soft | `--lp-paper-soft` | `#a4bcb7` |
| Ink faint | `--lp-paper-faint` | `#71908a` |
| Primary action | `--lp-glow` | `#2fb89f` (ink text `#04201c`) |
| Known, correct | `--lp-sea` | `#3cc89c` |
| You are here | `--lp-marker` | `#f0d070` (soft yellow, the lamp on the night road) |
| Review | `--lp-sand` | `#d8b86a` (soft yellow, allowed at night) |
| Fog | `--lp-fog` | `#2b3b39` |
| Road surface | `--lp-road` | `rgba(255,255,255,0.07)` |

Strand colours stay as a set of seven but lose the pink and the coral-red that read as
errors: grammar teal, reading blue, writing moss, listening sky, speaking cyan, mediation
emerald, interaction deep blue.

## Type scale

Outfit, the AZE typeface. Tracking tightens as size grows and relaxes at small sizes, after
Linear. Everything multiplies by `--lp-scale` so the learner can reach 130%.

| Class | Size | Line | Weight | Tracking |
| --- | --- | --- | --- | --- |
| `.lp-display` | 34px | 1.08 | 700 | -0.03em |
| `.lp-head` | 28px | 1.14 | 700 | -0.022em |
| `.lp-lesson` | 22px | 1.35 | 500 | -0.01em |
| `.lp-body` | 17px | 1.45 | 400 | 0 |
| `.lp-small` | 13.5px | 1.4 | 500 | +0.005em |
| `.lp-eyebrow` | 11px | 1.2 | 700 | 0.14em, caps |

## Spacing scale

4px base: 4, 8, 12, 16, 20, 24, 32, 40 as `--lp-sp-1` to `--lp-sp-8`. Page gutter 20px on
mobile. Radii: 10 small, 14 tile, 20 card, 28 sheet, 999 pill. Tap targets: 56px primary,
48px everything else, never below 44px.

## Shadow

Light mode: two layers, tinted with ink rather than black, so cards sit on paper instead of
floating: `0 1px 2px rgba(10,26,24,.05), 0 12px 28px -18px rgba(10,26,24,.20)`.
Dark mode: no spread shadow, a 1px top highlight plus a deep ambient
`0 18px 40px -28px rgba(0,0,0,.8)`. The primary button is the only element allowed a
coloured shadow.

## Motion rules

Durations and easing follow Material 3 tokens, slowed slightly for calm after Headspace.

| Token | Value | Used for |
| --- | --- | --- |
| `--lp-t-press` | 120ms `cubic-bezier(.2,0,0,1)` | Press and release |
| `--lp-t-swap` | 220ms `cubic-bezier(.2,0,0,1)` | Items entering and leaving |
| `--lp-t-move` | 420ms `cubic-bezier(.05,.7,.1,1)` | The marker sliding, a stop filling, the ring |
| `--lp-t-ambient` | 2600ms ease-in-out | The single breathing marker, nothing else |

What moves and why: the marker moves because the learner moved; a stop fills because a
thing was learned; a tick scales in because an answer was right. What never moves: the page
frame, body text, the nav, anything decorative. `data-reduce-motion="true"` and
`prefers-reduced-motion` stop all of it.

## Illustration and video style

2D flat vector, no 3D, no texture, no gradients inside an illustration (gradients belong only
to the ambient page glow). Three fills and one 2px line weight per scene. One idea per shot,
cut on the narration. Captions are a single line, centred, on a solid plate. Characters are
simple geometric people with no facial detail beyond eyes and mouth, never a mascot.

## Five screen principles

1. **One headline, one action.** If a screen has two primary buttons it is two screens.
2. **The journey is drawn, never listed.** Where the learner is must be a picture.
3. **State is shape and fill, not sentences.** Ticked, lit, or faint. Words only for the
   model answer when the learner was wrong.
4. **One lit thing.** Only the primary button or today's marker glows, never both.
5. **Five seconds.** If a learner with little English cannot name the next action in five
   seconds, remove an element and test again.

## Conflicts resolved

- `docs/design-rules.md` describes the AZE dark-only system with violet accents and lists
  light themes as rejected. The LP-10 board brief asks for light and dark, no purple, no
  orange, yellow in dark mode only, and rejects pure violet "AI" looks. Per `CLAUDE.md` the
  ticket wins, so this direction is light and dark with no violet anywhere.
- `CLAUDE.md` said to keep the current tokens until the board settled the colour question.
  LP-10 settles it and instructs the rewrite, so the tokens are rewritten.
