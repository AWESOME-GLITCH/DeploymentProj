# Learning Path design direction (board decision, 26 Oct)

ST approved the look in the Dribbble shot ("Speak With Confidence", "Learn Anytime, Easily Anywhere",
"Lessons that work for you"): bold flat colour-block cards, black-outline hand-drawn characters, black
pill buttons, playful black stickers, springy motion. "These colours and animations are super nice."
The Studybox portal file in `docs/design/reference/` is the secondary reference for structure only:
calm spacing, one headline, white cards on a faint grid, pill tabs, bottom tab bar on mobile.

Everything below replaces earlier style rules (dark glass base, violet and cyan glows, "no cartoon").
Those are withdrawn.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--sun` | `#FFD93D` | hero cards, highlights, the coach's world |
| `--lilac` | `#CDB8FF` | second card colour, calm screens |
| `--tangerine` | `#FF5A2D` | energy, speaking, call-to-action cards |
| `--mint` | `#A8F0C6` | success, "known" |
| `--sky` | `#BFE3FF` | listening, reading |
| `--ink` | `#121212` | outlines, text, pill buttons, stickers |
| `--cream` | `#FFF7E8` | page background (light) |
| `--paper` | `#FFFFFF` | neutral cards |
| dark mode | page `#121212`, cards keep their bright fills, text on page `#FFF7E8`, sun stays `#FFD93D` |

One screen uses one block colour plus ink and cream. Never three block colours on one screen.

## Type

Plus Jakarta Sans. Display 800 at 32 to 40 px on mobile with tight leading (1.05). Body 600 at 16 px.
Short lines: a headline of 2 to 4 words, one supporting line of at most 12 words.

## Characters and stickers

- Hand-drawn look: ink outline 3 px with a slightly wobbly line, flat fills, no gradients, no shading.
- Dot eyes, simple mouths, big expressive gestures. Characters hold or ride objects (a phone, a cup,
  a suitcase, a star) that say what the screen is about.
- Stickers: black hearts, four-point stars, sparkles and squiggles placed around the character.
- Cast: Maya the coach (the one who talks with the learner), Leo the barista, Fatima, Sami, and "you".
  One style sheet in `docs/design/characters.md` is the source of truth; every screen and video uses it.

## Components

- Card: radius 28 px, block colour fill, ink text, one headline, one line, one character, one button.
- Button: ink pill, 56 px tall, white 700 text, full width on mobile, a `»` on the right for "go".
  Secondary action is plain ink text, never a second filled button.
- Tabs and chips: ink outline pills, filled ink when active.
- Progress: a single thick rounded bar or a ring, ink on the card colour. No charts on learner screens.
- Bottom tab bar on mobile with three tabs: Today, Path, Me.

## Screen rules

- At most four elements above the fold: headline, one line, one visual, one button.
- One primary action per screen. If a second thing competes, remove it.
- No boxes inside boxes. No dashboards for learners.
- Understandable in five seconds by someone with little English. Show, do not tell.
- Copy in British English, plain words: Today, Lesson, Practice, Path, Me.

## Motion

- Spring pop-in for cards and characters (overshoot to 1.04, settle in 350 ms), 60 ms stagger.
- Character idle: slow breathe or sway every 2 to 3 s. Stickers twinkle on a 4 s loop.
- Reactions: a star sticker pops on a good answer; on a miss the character leans in and the line
  replays at 0.75 speed. No red, no lives, no shaking.
- Everything under 400 ms except idle loops. Reduced-motion setting turns idle loops off.

## Videos (explainers)

- Same hand-drawn outline style as the UI characters, so the lesson and the video are one world.
- 20 to 40 seconds. One target per video. Crisp: vector only, high contrast, 1080×1440.
- Minimal text on screen: the target phrase and nothing else while a character speaks.
- A talk-like pause: the coach says the line, then turns to the learner and waits for the mic.

## Talk with the coach (pronunciation and interaction)

- Maya is on screen full-size, animated: speaking (mouth and gesture), listening (leans in, ear
  sticker), reacting (star pop, nod, replay). The learner's words appear as a bubble.
- Short turns: one line each. Three turns, then a "You did it" card.
- Scoring is shown as three ink bars (Sounds, Rhythm, Words) on the card, never as a percentage.

## Engagement (psychology)

- Goal gradient: the path always shows the next stop within reach and the stretch already covered.
- Variable reward: the sticker that pops is one of six, never the same twice in a row.
- Competence: every session ends with a "You can now…" card in the learner's own words.
- Autonomy: the learner picks between two equally good next steps once per session, never more.
- Relatedness: classmates online today shown as small characters, no leaderboard.
- Streak shown as a soft weekly bar, never a flame; a missed day is "Welcome back", never a loss.

## Blobert (board request, 26 Oct)

Blobert is a blob character who clears out mistakes in a funny way. He is the only thing that ever
handles an error, so a mistake is never red, never a loss, always a small laugh.

- Design: a soft rounded blob in the hand-drawn outline style (3 px ink line, flat fill in the
  screen's block colour, dot eyes, big expressive mouth, two stubby arms, no legs; he wobbles).
  He carries one tool at a time: a broom, a mop, a sponge, a bin, a vacuum, a tiny crane.
- Behaviour on a miss: he pops in from the edge with a spring, looks at the wrong tile or word,
  does one gag (sweeps it off the screen, eats it and burps a star, mops it into a puddle that
  evaporates, bins it and the lid claps, vacuums it up and sneezes, lifts it away with the crane),
  waves, and slides out. One gag per miss, never the same twice in a row, each under 900 ms.
- Then the real thing: the right answer is shown and the line replays at 0.75 speed, calm.
- Voice: he never speaks a sentence. Tiny sounds only (a "hup", a sweep, a burp), captioned as
  stickers, so every learner understands him regardless of English level.
- Where he appears: every exercise type, the explainer's practice pause, Talk with Maya (he
  tidies a mispronounced word out of the bubble), and the Welcome back screen (he has dusted the
  learner's path). He never appears on Today or the session-end card.
- Reduced motion: a single fade and sweep, no bounce.

## Illustration source (board decision after round one, 26 Oct)

Round one of the prototypes was judged "super low quality": generic clip-art characters, empty cards,
no wit in the line. Hand-coded characters are withdrawn as the primary art. From now on:

- Cast faces and expressions come from Open Peeps (CC0), pre-rendered in the palette by
  `node scripts/lp/cast.mjs` into `docs/design/cast/`: maya, leo, fatima, sami, you, each with
  idle, talk, listen, happy, wow, think, oops, laugh, cheeky. Inline these SVGs; never redraw them.
  Talking is a swap between talk and idle on the syllable beat; listening is listen with a lean-in.
- Full-body hero scenes come from Open Doodles (CC0), same folder, `doodle-*.svg`, recoloured
  ink and tangerine. Use them big: the character fills at least half the card, cropped with
  confidence, never a small figure floating in an empty block.
- Blobert stays custom but is drawn in the same sketchy ink line as the doodles.
- Quality gate: a screen passes only if, placed next to the Dribbble reference, it reads as the
  same family: a bold block colour, one oversized expressive character, black stickers with
  intent, a headline of 2 to 4 words in heavy type, one black pill button. Anything that reads as
  clip-art, a diagram, or a form is sent back.

## Glass layer and motion polish (board request, 27 Oct)

ST: "make it animated, their movement well done and more modern and glassy looking, and the paths
should seem more intertwined, connected and easy to learn and understand from."

### Glass layer
The block-colour cards and the ink-outline cast stay. Everything that sits ON TOP of a card becomes
glass: speech bubbles, score cards, the "You said" panel, instruction chips, the beat bar, the
bottom action bar, tab bars and toggles.
- Glass recipe: background rgba(255,255,255,0.58) light / rgba(18,18,18,0.55) dark;
  backdrop-filter blur(16px) saturate(140%); 1.5 px border rgba(255,255,255,0.75) light /
  rgba(255,255,255,0.18) dark; inner highlight 0 1px 0 rgba(255,255,255,0.6); shadow
  0 12px 32px -16px rgba(18,18,18,0.35); radius 22 px. Fallback without backdrop-filter: solid cream.
- Primary button: ink pill with a glass sheen (a soft top highlight gradient) and a 2 px lift on
  press. Secondary: glass pill with ink text.
- Progress: a glass track with an ink fill. Bars and knobs get the same sheen.
- Stickers and outlines stay flat ink; glass never touches the characters.
- Keep contrast: ink text on glass must stay at 4.5:1 (test on the sun, tangerine and sky cards).

### Motion polish
- Every entrance is a spring with follow-through: scale from 0.92 and 12 px below, overshoot 1.03,
  settle, 420 ms, cubic-bezier(.2,1.4,.4,1); children stagger 50 ms.
- Characters: squash and stretch on landings (scaleY 0.94 then 1.02), anticipation before a walk
  (lean 6 degrees back, then go), follow-through on stops (one extra bob), blink every 3 to 5 s,
  breathe 2.8 s loop, head turn towards the thing being talked about.
- Walk: puppet walk with rock 4 degrees at 6 Hz, bob 10 px, arm and leg flicker, footsteps shown
  as two faint ink ovals that fade.
- Cards: a 2 degree parallax tilt following drag or the pointer on desktop; the character layer
  moves 6 px against the background layer.
- Feedback: a star sticker pops with a 40 ms burst of four ink dots; Blobert's gags keep their
  timing (under 900 ms).
- Scene transitions: the card slides and the next card springs in, 320 ms, never a hard cut.
- Reduced motion: fades only, no loops.

### The path: intertwined and easy to learn from
The path is the learner's map of how skills connect, not a row of dots.
- Draw it as four ribbons (speaking in tangerine, listening in sky, reading and writing in lilac,
  grammar in mint) that braid into one cream road. Where ribbons cross there is a stop. The ribbon
  colours show which skills a stop uses; a stop that uses two skills sits on their crossing.
- Each stop is a landmark (home, shop, cafe, station, office, flag) with a glass label: the can-do
  in plain words ("Order at a cafe"), a small cast face, and the three stops it unlocks ahead,
  drawn as thin dotted connectors that light up when the stop is done.
- The covered stretch is filled in sun with ticks; the next stop glows with a soft glass halo and
  a "Next" tag; the far stretch is cream outline so the whole journey is visible at a glance.
- "You" stands on the road as a full-body figure; pressing Start walks them to the next stop.
- Tapping a stop opens a glass sheet: "You can now..." lines, what it unlocks, a Replay pill.
- Levels (A1, A2, B1) are gates across the road, drawn as arches, so progress to the next level
  is a visible place, not a number.
- The whole path fits on one phone screen scrolled vertically, with the next stop always in view
  on open.

## Engagement is the platform's job (board, 27 Oct)

ST: "engaging learning is not about the user having to speak, it is more about how the platform
keeps me engaged." And: "the face is still there." So:
- No more giant portrait heroes. The hero of a screen is a scene in the learner's world (a place,
  characters in it, something happening), with full-body characters at scene scale. A close-up face
  is reserved for a reaction beat, never the resting state of a card.
- Speaking is one activity type among tap, listen, build, pick, slide, read and story. The engine
  of return is the world, not the mic.
- The platform keeps the learner engaged through: a world that opens up stop by stop (places light
  up, characters move in), a story in weekly episodes with a part each day and a cliffhanger, a
  daily ritual of three small quests with a reward at the end, a collection shelf of things earned
  (a coffee cup, a metro card, a receipt), choices (pick one of two next steps), surprises (a
  character knocks with a two-minute challenge, a golden sticker), classmates visible in the world,
  a momentum meter instead of a streak flame, level gates as places, and "You can now..." ledgers
  that grow. Every screen must show at least two of these.
