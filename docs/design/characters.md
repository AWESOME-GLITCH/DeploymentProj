# Character style sheet

The source of truth for every character in the app and in the videos. Read this with
`docs/design/brief.md` (the board's direction) and look at `docs/design/characters.html` (the
gallery, generated from the real components).

Board ruling, 26 October: round one was judged "super low quality" because the characters were
hand-coded and read as clip-art. Hand-drawn cast art is withdrawn. **The cast is pre-rendered art
and is never redrawn.** Only Blobert and the stickers are still drawn by us.

## Where the art comes from

| What | Source | Files | Licence |
| --- | --- | --- | --- |
| Faces, nine expressions each | Open Peeps by Pablo Stanley | `docs/design/cast/<name>-<expression>.svg` | CC0 |
| Full-body hero figures | Open Doodles by Pablo Stanley | `docs/design/cast/doodle-<name>.svg` | CC0 |
| Blobert, stickers | ours | `components/learning-path/art/characters.tsx` | - |

`node scripts/lp/cast.mjs` re-renders the cast in the palette. `node
scripts/design/build-cast-module.cjs` then inlines it into `art/cast-faces.ts` and
`art/cast-doodles.ts`, which is what the components import: the Remotion compositions have to draw
every frame with no network, so the art is strings the bundler can see, not file requests.

Inline the SVG. Never trace it, never re-type a path, never run it through a filter.

## The cast

| Name | Role | Block colour | Jumper | Head | Skin |
| --- | --- | --- | --- | --- | --- |
| Maya | the coach, the one who talks with the learner | sun `#FFD93D` | sun `#FFD93D` | bun with a tied scarf | `#D08B5B` |
| Leo | the barista | sky `#BFE3FF` | tangerine `#FF5A2D` | short, chin beard | `#FFDBB4` |
| Fatima | a classmate | mint `#A8F0C6` | lilac `#CDB8FF` | hijab | `#EDB98A` |
| Sami | a classmate | lilac `#CDB8FF` | mint `#A8F0C6` | dreads, glasses | `#694D3D` |
| You | the learner | tangerine `#FF5A2D` | sky `#BFE3FF` | medium bangs | `#AE5D29` |

The block colour is the card that character is normally placed on. A character is never put on a
card the same colour as their jumper, with one deliberate exception: Maya on sun is tone on tone,
and the ink outline is what separates her. One block colour per screen, always.

### Line, proportions, eyes, mouths, hands

These are properties of the source art. They are written down so anything custom matches it.

- **Line**: a single black `#121212` ink outline, roughly 3 px at a 390 px card width, with a
  living, slightly uneven edge. Flat fills inside it. No gradients, no shading, no drop shadows on
  the figure itself.
- **Proportions**: the face is a head-and-shoulders crop. The head is large, the jaw soft, the neck
  short. Hair is a solid ink mass, so hair against a dark background disappears: never put a black
  sticker over hair.
- **Eyes**: solid ink dots or short arcs. Closed eyes are arcs (think, laugh). No whites, no irises,
  no highlights.
- **Mouths**: one shape per expression, open or closed, with teeth only on `happy` and `laugh` and
  a tongue only on `talk` and `laugh`.
- **Hands and gestures**: the faces do not have hands. When a screen needs a gesture or a held
  object, use a doodle, not a face.

### The nine expressions

| Expression | Open Peeps face | Use it for |
| --- | --- | --- |
| `idle` | smile | resting, and the closed-mouth half of the talking beat |
| `talk` | explaining | the open-mouth half of the talking beat |
| `listen` | calm | waiting for the learner, always with the lean-in |
| `happy` | smileBig | a correct answer |
| `wow` | awe | a streak, a new level, a surprise |
| `think` | eyesClosed | a pause, loading, "have a go" |
| `oops` | concerned | a miss, paired with Blobert |
| `laugh` | smileLOL | the session-end card |
| `cheeky` | cheeky | a nudge, a hint, the second try |

### Talking, listening, reacting

- **Talking is a swap**, not a mouth rig: alternate `talk` and `idle` every `TALK_BEAT_MS` (125 ms),
  one burst per word, held for roughly 190 ms plus 150 ms a syllable. Stop on `idle`, never on
  `talk`, or she looks frozen mid-word.
- **Listening is `listen` plus the lean-in**: a 2.5 degree tilt towards the learner and a 6 % scale
  up, settling in 350 ms. The `lean` prop does both.
- **Reactions** use `happy`, `wow`, `laugh` and `oops` only, held for about 900 ms, with one sticker
  popping beside the head. A miss is `oops` and then Blobert. Never red, never a shake.

### Scale and crop: the gate

A screen passes only if, placed next to the Dribbble reference, it reads as the same family.

- One bold block colour. One character. The character fills **at least half the card**.
- Crop with confidence: let the card edge cut the head or the body. A figure that floats small in
  the middle of a block is a fail, and so is a card with empty space in it.
- Above the fold: a headline of two to four words in heavy type, one line at most, the character,
  one black pill button, one or two stickers. Nothing else.
- Faces for talking and reacting. Doodles for arriving, finishing and celebrating.

## The hero doodles

Full-body figures, ink and tangerine, in `DOODLE_NAMES` (33 of them: coffee, reading, strolling,
dancing, jumping, meditating, unboxing, and so on). Use them at 400 px and up on a 390 px card,
bleeding off two edges.

Choose the doodle whose ink mass sits away from the headline, or move the figure until it does. The
coffee doodle, for instance, has a heavy black splash at its top left, so on a card it is pushed
down and right to keep the headline clear. See the exemplar card at the top of the doodle section in
`characters.html`.

## Blobert

Custom, and the only character we draw. He is the only thing in the app that handles a mistake, so a
miss is never red, never a loss, always a small laugh. Full behaviour: `docs/design/brief.md`,
section "Blobert".

- **Line**: the doodle line, done our way. Every path is jittered by `wobble()` and then **drawn
  twice**, once at full weight and once at half weight with a larger jitter, the way a brush doubles
  back over itself. No filters: a filter blurs the line and kills the crispness the videos need.
  Outline weight 4 at his drawing scale.
- **Proportions**: one soft blob, no legs, 58 x 50 in a 300 x 200 box, standing in the left third.
  The gag happens in the right two thirds. Two stubby arms with round hands.
- **Eyes**: two ink dots, 6.2 across, that swap to happy arcs on the wave. The swap is a cut, never
  a cross-fade.
- **Brows and blush**: two short ink arcs above the eyes, and two tangerine blush dots at 65 %
  opacity. They carry as much of his expression as the mouth does.
- **Mouths**: three, swapped as cuts: a wide smile stroke, a small ink O for surprise, a big open
  shape for the burp and the sneeze.
- **Colour**: his body takes the cream, or the screen's block colour when he is on a cream page.
  Never the colour he is standing on, or he disappears.
- **Six gags**, one per miss, never the same twice in a row, each under 880 ms: sweeps it off, eats
  it and burps a star, mops it into a puddle, bins it and the lid claps, vacuums it up and sneezes,
  lifts it away with the tiny crane.
- **Voice**: never a sentence. Tiny sounds only, captioned as stickers.

## Stickers

Five kinds: `heart`, `star`, `sparkle`, `squiggle`, `cloud`. Solid ink, the same double-pass line as
Blobert, drawn in a 24 unit box.

- Black, at 24 to 44 px. One or two on a card, never a scatter.
- Place them where the block colour is clear: the top corners, beside the headline, in the gap
  between the figure and the card edge.
- **Never over hair or a face.** Black on black is a smudge, and it is the fastest way to make a
  card look accidental.
- On a reaction, one sticker pops beside the head and fades, under 400 ms. The one that pops is one
  of six, never the same twice in a row.

## Do and do not

**Do**

- Inline the cast files and leave them alone.
- One block colour, one oversized character, one headline, one pill.
- Crop the figure at the card edge.
- Swap `talk` and `idle` on the beat; lean in to listen; end on `idle`.
- Give anything custom the double-pass ink line and a deterministic seed.

**Do not**

- Redraw, trace or filter the cast.
- Float a small figure in an empty block, or leave a card half empty.
- Put a sticker over hair or a face.
- Use three block colours on one screen, or a second filled button.
- Give Blobert words, or make a mistake red.

## Using the kit

```tsx
import { Character, Doodle, Sticker, Blobert, CAST, TALK_BEAT_MS }
  from "@/components/learning-path/art/characters";

<Character name="maya" expression="talk" size={320} />
<Character name="maya" expression="listen" lean />
<Doodle name="coffee" size={420} />
<Sticker kind="star" size={28} />
<Blobert pose="gag" gag="sweep" play word="goed" fill={ART.cream} />
```

Props are documented at the top of `components/learning-path/art/characters.tsx`, which is the
contract other agents build on: names are added, never renamed. The round-one `pose` prop still
works on `Character` as an alias for `expression`, so nothing written against the old kit breaks.

To refresh everything after a change to the cast:

```
node scripts/lp/cast.mjs                                        # re-render the source art
node scripts/design/build-cast-module.cjs                       # inline it for the components
node_modules/.bin/sucrase-node scripts/design/characters-gallery.cjs   # rebuild the gallery
```
