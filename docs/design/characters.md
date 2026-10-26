# Character style sheet

The source of truth for every drawn person in the Learning Path app and in the explainer videos.
It follows the board brief in `docs/design/brief.md` (26 October 2026). Code:
`components/learning-path/art/characters.tsx`. Gallery: `docs/design/characters.html`.

If a screen or a video needs a character, use the kit. Do not draw a new one.

## The look in one line

Hand-drawn ink outlines, flat colour, dot eyes, big clear gestures, a sticker or two, nothing else.

## Line

- Outline weight 3 px at the drawing scale (the viewBox is 200 x 280, so a figure at 220 px high
  carries a line of about 2.4 px on screen). Limbs are drawn as a thick ink stroke with a thinner
  colour stroke on top, which gives the same 3 px edge on every arm and leg.
- The wobble is a jitter on the path numbers, never a filter. Filters blur the line and the videos
  need it crisp at 1080 x 1440. `wobble()` and `blob()` in the kit do this and are deterministic:
  the same `seed` draws the same line on every frame, so nothing crawls during a video.
- Round caps and round joins everywhere. No sharp corners except the four-point stars.
- No gradients, no shadows, no shading, no texture, no outline inside an outline.

## Proportions

- Head to body is about 1 to 3.2: a big readable head, a short body. The figure is 280 units tall
  with the head 68 units across.
- Shoulders are a little narrower than the head. Hands are circles about a quarter of the head.
- Feet are flat ink ovals with a cream sole line so they read on a dark page.
- The figure stands on the baseline of the frame. Nothing floats.

## Face

- Eyes: two ink dots, radius 4, set level and wide. No whites, no pupils, no lashes, no eyebrows
  except where a pose needs one.
- Happy eyes (celebrate) are two upward arcs. That is the only eye variant.
- Mouths: a small upward arc at rest; a filled ink oval when talking; a filled half-round when
  celebrating; a short flat arc when listening.
- Eyebrows appear only on `listen` (both raised) and on `talk` and `point` (one raised). They carry
  the whole expression, so keep them small.
- No noses, no ears, no cheeks, no blush. A learner with little English reads the gesture, not
  the face.

## Hands and gestures

- Hands are plain circles. A pointing finger is one short stroke off the circle. No fingers
  otherwise, ever.
- The gesture says what the screen is about, so make it large: a hand fully raised, an arm fully
  out, both arms up. A small gesture reads as nothing at 150 px.
- A character holds one object at a time, in both hands, in front of the body.

## Poses

| Pose | What it is for | What changes |
| --- | --- | --- |
| `idle` | the character is present, nothing is being asked | arms down, small smile |
| `talk` | the coach is speaking, a line is playing | one arm raised open, mouth open, head tilted in |
| `listen` | the mic is on, the learner's turn | hand cupped at the ear, body leaning in, brows up |
| `point` | draw the eye to the next thing on screen | arm straight out, finger extended |
| `hold` | say what the lesson is about with an object | both hands in front around the item |
| `celebrate` | a correct answer or the end of a session | both arms up, happy eyes, open smile, stickers |

Nothing else. If a screen seems to need a seventh pose, the screen is doing too much.

## Colour per character

Each character wears cream or white plus one block colour from the palette. The block colour is
their accent, never the whole outfit, so the cast reads on any card.

| Character | Role | Accent | Skin | Hair or headwear | Holds |
| --- | --- | --- | --- | --- | --- |
| Maya | the coach | sun `#FFD93D` | `#D99A6C` | ink bun, sun earrings | phone |
| Leo | the barista | tangerine `#FF5A2D` | `#F0C3A0` | short ink crop | cup |
| Fatima | classmate | lilac `#CDB8FF` | `#9C6136` | lilac headscarf and shoulder drape | book |
| Sami | classmate | sky `#BFE3FF` | `#7A4A2B` | ink curls | suitcase |
| You | the learner | mint `#A8F0C6` | `#E8B089` | mint hood, no hair shown | star |

Trousers and shoes are ink for everyone. "You" has no hair and no strong features on purpose: any
learner should be able to read themselves into it.

**Pairing.** Never put a character on a card in their own accent colour, or the accent sinks into
the card. Use: Maya on lilac, Leo on sun, Fatima on mint, Sami on sun, You on sky. The pairing
check strip in the gallery shows all twenty five combinations.

**Dark mode.** Characters keep their colours and sit on a bright card, never straight on the ink
page: ink trousers on an ink page disappear.

## Sticker set

Five ink stickers: `heart`, `star` (four points), `sparkle`, `squiggle`, `cloud`. Always ink, always
small, always outside the figure, never on top of the face.

- Two or three per screen at most. They are punctuation, not decoration.
- A star pops on a good answer. Six different stickers rotate so the same one never pops twice in
  a row (brief, variable reward).
- `twinkle` gives the 4 second scale loop. It is off under reduced motion.

## Motion

- Pop in with a spring: scale 0.86 to 1.04 to 1 over 350 ms. Characters and cards use the same
  curve, 60 ms apart.
- Idle is a slow sway of about 1 degree with a 2 px lift, 3 seconds, looping, pivoting at the feet.
- Everything else finishes under 400 ms.
- `prefers-reduced-motion: reduce` stops the idle sway and the twinkle, and cuts the pop to nothing.
  The kit does this for you; do not add motion outside it.

## Videos

The same components are used in the explainer compositions, so the lesson and the video are one
world. Keep `seed` fixed for a shot: the wobble is deterministic, and changing the seed between
frames makes the line boil.

## Do

- One character per screen, large: 180 to 260 px on mobile.
- Match the pose to the moment: `talk` while audio plays, `listen` while the mic is open.
- Let the held object carry the meaning. A cup says cafe faster than a sentence does.
- Keep the figure whole and standing on the baseline.
- Give the character a `title` when it is the only thing explaining the screen; leave it off when
  there is text beside it saying the same thing, so a screen reader does not say it twice.

## Do not

- No mascots, no animals, no 3D, no isometric, no cartoon bubble letters.
- No outline other than ink, no second line weight, no filter-based roughness.
- No more than three stickers, none over the face.
- No character on their own accent colour, and no three block colours on one screen.
- No new cast members, no new poses, no recolouring outside the palette. Raise it with the board
  instead and this sheet changes first.
