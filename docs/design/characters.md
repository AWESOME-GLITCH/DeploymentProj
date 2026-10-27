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

## Blobert, the blob who clears mistakes

Board request, 26 October 2026 (`docs/design/brief.md`, section "Blobert"). He is the only thing in
the app that handles an error, so a mistake is never red, never a loss, always a small laugh. One
gag per miss, never the same twice in a row. Code: `Blobert` in the same kit file.

**Drawing.** A soft wobbly blob, 100 units across and 86 tall, in the same 3 px ink line and flat
fill as the cast. Two dot eyes, radius 5.4, set wide. One big mouth: a smile at rest, a filled ink
oval for a small sound, a filled wide open mouth for a swallow or a sneeze. Two stubby arms with
circle hands, no legs, no hair, no face beyond eyes and mouth. He has happy arc eyes for the wave,
the same arcs the cast uses for `celebrate`. He never has a hat, a badge or a prop other than his
one tool.

**Colour.** His fill is the screen's one block colour, passed in with `fill`; the default is sun. On
a card that is already a block colour, fill him cream or white instead, never the card's own colour.
Tools are cream on the ink line. He is never two colours at once.

**Size and placement.** His viewBox is 300 x 200: Blobert stands in the left third, x 26 to 126, and
the gag happens in the right two thirds. Place him so that right-hand area sits over the tile or
word being cleared; his own `word` tile is centred at x 184 on the baseline, y 168. Default render
height is 170 px.

**Poses.** `in` (pops in from the edge), `look` (leans at the wrong word, the held frame), `gag`,
`wave`, `out` (slides off). `pose="gag"` plays the whole scripted miss by default; pass
`scripted={false}` for the 360 ms gag core alone when the host already has him on screen.

**The six gags.** Each one is the whole miss in 880 ms, under the brief's 900:

| Gag | Tool | What happens |
| --- | --- | --- |
| `sweep` | broom | sweeps the wrong word off the screen |
| `eat` | none | eats it and burps a four-point star |
| `mop` | mop | mops it into a puddle that dries away |
| `bin` | bin | flicks it in and the lid claps |
| `vacuum` | vacuum hose | sucks it up, then sneezes and recoils |
| `crane` | tiny crane | hooks it and lifts it out of frame |

**Timing.** One table of keyframes drives both playback paths, so the browser and the videos cannot
drift: `in` 0 to 200 ms, `look` 200 to 320, the gag 320 to 680, the wave 560 to 720, `out` 720 to
880. The wave overlaps the tail of the gag by 120 ms, which is what brings the total under 900.
`BLOBERT_SEQUENCE`, `BLOBERT_GAG_MS` and `BLOBERT_CORE_MS` export those numbers; read them, never
retype them.

**Driving him.** `play` runs the timeline once on mount. `progress` (0 to 1) draws one exact frame
and runs no CSS, which is what the Remotion compositions use. `seed` re-rolls the line wobble and is
deterministic, so keep it fixed for a shot. `nextBlobertGag(last)` picks the next gag and never
repeats the one you pass it.

**Sound and captions.** He never speaks a sentence. Tiny sounds only, captioned as a sticker, so a
learner at any level reads him.

**Reduced motion.** Every timeline is dropped for one 360 ms sequence: he fades in, the wrong word
fades out, he fades out. No travel, no bounce, no wobble. The kit does this; the caller does
nothing.

**Where he appears.** Every exercise type, the explainer's practice pause, Talk with Maya (he tidies
a mispronounced word out of the bubble), and Welcome back (he has dusted the path). Never on Today
and never on the session-end card. After the gag, show the right answer and replay the line at 0.75
speed, calm.

**Do not.** Do not give him a second tool in one gag, a sentence of speech, red anything, a sad
face, or a gag over 900 ms. Do not use him for anything that is not a learner mistake: he is not a
loader, not a mascot and not a decoration.

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
