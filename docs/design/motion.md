# Motion spec

Owner: Motion Director. Source of truth for every animation in the app and every explainer video.
It sits under `docs/design/brief.md` (board approved, 26 Oct 2026): where the brief states a number,
this file turns it into a preset you can paste. Where this file and the brief disagree, the brief wins.

British English, concise. All numbers measured at 30 fps.

## 1. The one rule

Motion exists to say "this is new, look here" and "that was right". Nothing else moves. If a thing
moves and a learner with little English cannot say what the movement told them, cut it.

## 2. Timing

| Band | Duration | Use |
| --- | --- | --- |
| Instant | 0 to 80 ms | Press state, focus ring, tap feedback |
| Quick | 120 to 200 ms | Chip fill, highlight sweep, colour change, text swap |
| Standard | 200 to 350 ms | Card and character pop-in, sheet open, screen change |
| Ceiling | 400 ms | Nothing but an idle loop may exceed this |
| Stagger | 60 ms | Between siblings, capped at five steps (300 ms total) |
| Idle breathe | 2 to 3 s | Character rest loop |
| Sticker twinkle | 4 s | Sticker rest loop |

Stagger caps at five. A sixth sibling starts with the fifth: a learner should never watch a queue.

## 3. Easing

Use springs for anything that enters or reacts. Use easing only for things that travel or fade.

| Name | Curve | Use |
| --- | --- | --- |
| `out` | `Easing.out(Easing.cubic)` | Enter, slide in, reveal |
| `in` | `Easing.in(Easing.cubic)` | Exit, fade out |
| `inOut` | `Easing.inOut(Easing.cubic)` | Camera moves, pans, parallax |
| `linear` | none | Progress bars and the beat rail only |

Withdrawn: `EASE.bounce` and `EASE.back` for UI and scene entries. A spring preset does the same job
with a controlled overshoot. `bounce` stays available for a prop that physically drops.

## 4. Spring presets

Add these to `components/learning-path/explainer/lib.tsx` as `SPRING` and use them by name. Every
figure below is measured from Remotion's `spring()` at 30 fps, peak value and time to settle within
0.5 per cent of 1.

| Preset | Config | Overshoot | Settles | Use |
| --- | --- | --- | --- | --- |
| `pop` | `{ damping: 20, stiffness: 520, mass: 0.4 }` | 1.045 | 200 ms | Default. Cards, characters, bubbles, tiles |
| `snap` | `{ damping: 16, stiffness: 440, mass: 0.4 }` | 1.084 | 200 ms | Stickers, the star reward, a chip filling |
| `settle` | `{ damping: 18, stiffness: 300, mass: 0.6 }` | 1.057 | 333 ms | One big scene piece, a full-screen card |
| `soft` | `{ damping: 24, stiffness: 520, mass: 0.4 }` | 1.009 | 200 ms | Text, numbers, anything that must not wobble |

`pop` is the brief's "overshoot to 1.04, settle in 350 ms". Use it unless you can say why not.

**The current kit defaults are all out of spec and must change.** Measured today:

| Call site | Config | Overshoot | Settles | Verdict |
| --- | --- | --- | --- | --- |
| `springIn` default | `d12 s120 m1` | 1.127 | 567 ms | Three times the brief's overshoot, 167 ms over the ceiling |
| `Character` enter | `d9 s150 m1` | 1.287 | 733 ms | A 29 per cent overshoot reads as rubbery, not springy |
| `Character` gesture | `d11 s110 m1` | 1.143 | 600 ms | Gesture lands after the line it illustrates |

Change `springIn`'s default to `pop` and the two `Character` call sites to `pop`. That single change
fixes the "not crisp" note on every explainer at once; it belongs to the kit owner (LP-45), not to
the individual lesson tickets.

## 5. Entry choreography

A scene assembles in this order, 60 ms apart, and never in more than four steps:

1. Ground: the background block or surface, `settle`, no overshoot visible.
2. Character, `pop`, from 24 px below with a 1.35 horizontal squash that resolves with the spring.
3. The object the character holds, `pop`, 60 ms after the character.
4. Text, `soft`, 60 ms after that.

Stickers arrive last, `snap`, 80 ms apart, and only two of them.

## 6. Character idle

| Loop | Period | Amount |
| --- | --- | --- |
| Breathe | 72 frames (2.4 s) | Shoulders and head rise 1.5 px |
| Sway | 90 frames (3 s) | Body tilts 0.8 degrees, only when not talking |
| Blink | 84 frames (2.8 s), seeded offset | 7 frames closed |
| Talk | 7 to 9 frames | Mouth opens; head tilt 1.5 degrees |
| Sticker twinkle | 120 frames (4 s), seeded offset | Scale 1 to 1.12, 8 frames |

The kit's breathe is currently `sin(frame / 16)`, a 32 frame period: 1.07 s, nearly three times too
fast. It reads as panting. Change the divisor to 36 for a 72 frame period.

Two characters on screen never breathe in phase. Offset by the existing `seed`.

## 7. Reactions

| Event | Motion | Length |
| --- | --- | --- |
| Good answer | One star sticker pops in `snap`, holds 400 ms, fades `out` in 160 ms. The character nods once | 800 ms total |
| Miss | The character leans in 4 degrees over 200 ms and holds. The line replays at 0.75 speed | 200 ms plus the line |
| Streak or session end | A "You can now..." card, `settle`, one line of text | 350 ms |

The reward sticker is one of six and never the same twice in a row: hold the last index and pick from
the other five. No red, no shake, no lives, no flame, no falling confetti at full screen. The kit's
`Confetti` default of 70 pieces in five colours breaks "one block colour per screen"; if a celebration
needs particles, cap it at 18 pieces in ink plus the screen's one block colour.

## 8. Reduced motion

`reduceMotion` turns off every loop in section 6 and every particle. It does not turn off entries:
replace each spring with a 120 ms `out` opacity fade so a learner can still see what is new. Beat
transitions become a hard cut. The talk-like pause and its mic cue are never suppressed; they carry
meaning, not decoration.

## 9. Video rules

Every explainer composition obeys all of these. The audit fails any one of them.

1. **Length 20 to 40 s.** 600 to 1200 frames at 30 fps. 25 to 30 s is the target; 40 s is the hard cap.
2. **One target.** One phrase or one pattern per video. A second target means a second video.
3. **Vector only.** Flat fills, ink outline, no gradient, no shadow, no blur, no 3D, no photographic
   texture. High contrast at 1080x1440.
4. **One block colour per screen** plus ink and cream, as the brief's palette table sets out.
5. **Minimal text.** While a character speaks, the target phrase is on screen and nothing else. No
   eyebrow label above it, no second bubble, no caption repeating the same words. Captions are the
   learner's own language only, and the player's job, not the composition's.
6. **Talk-like pause.** The coach says the line, turns to the learner, and a mic cue appears. The cue
   is in the composition, not only in the player chrome, so it survives an MP4 render. The waveform
   is flat until the learner speaks: an animated waveform during the pause is a lie.
7. **The whole frame earns its place.** No band taller than 200 px that carries nothing. Heads are
   not cropped by furniture. Nothing overlaps text.
8. **Hand-drawn outline style.** 3 px ink outline with a slightly wobbly line, flat fill, dot eyes,
   per `docs/design/characters.md`. A character appears as a full figure doing something, not as a
   bust in a circular medallion.
9. **Beat count 5 to 7.** Hook, two or three notice beats, one explain, one practise, one recap.
   A beat is 90 to 210 frames. Anything longer is two beats.
10. **Transitions.** One wipe or iris between beats, 18 to 24 frames, in ink or the screen's block
    colour. Never two different transition kinds in one video.

### Pause cue timing

A `springIn` keyed to `pauseAt` is at scale 0 on the held frame, so the cue is invisible exactly when
it matters. Start the cue 24 frames before `pauseAt` and hold it through the pause.

## 10. Crispness checklist

Run this against a composition before asking for approval. Shoot the midpoint of every beat and every
`pauseAt` frame, then look at the pictures.

- [ ] Duration between 600 and 1200 frames
- [ ] 5 to 7 beats, none longer than 210 frames
- [ ] One target phrase
- [ ] One block colour plus ink and cream
- [ ] At most one text element while a character speaks
- [ ] A visible mic cue on every `pauseAt` frame, started 24 frames early
- [ ] Characters are full figures in the hand-drawn outline style, not medallion busts
- [ ] No overlap, no cropped heads, no dead band over 200 px
- [ ] No chart, gauge, dial, slider or dashboard
- [ ] Springs are `pop`, `snap`, `settle` or `soft`; nothing overshoots past 1.09
- [ ] Idle loops run at 2 to 3 s and stop under reduced motion
