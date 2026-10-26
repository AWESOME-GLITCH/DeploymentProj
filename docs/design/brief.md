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
