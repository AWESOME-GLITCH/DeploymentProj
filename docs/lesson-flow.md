# Lesson flow: the cafe lesson at A2.1

One lesson, minute by minute, as the learner feels it. This is the shape every
lesson follows. The worked example is the first cafe lesson: atom
`ATM-A2-INT-0001` "At the cafe", criterion `CRI-A2.1-INT-01-01`, outcome
"Can order food and drink in a cafe".

The rule the whole timeline serves: **the learner says something out loud inside
the first 90 seconds of pressing Continue.** Everything before that exists only
to make the first sentence sayable.

Since the board's attention rule of 26 October, the scene is no longer the
passive part of that 90 seconds. The player stops at every beat that carries a
target, so the learner's first act is a tap at **9.6 s** and the first thing they
say out loud is at **14.6 s**, both inside the explainer. The rule is met by the
scene, and the coach's turn is no longer the first time the learner speaks. See
**The attention law** below for the lesson-side half of the board's six rules;
`docs/explainers/storyboards.md` carries the explainer-side half.

## The timeline

| From | Step | Sees | Hears | Says | Gets back |
|---|---|---|---|---|---|
| 0:00 | **Scene** | The explainer plays full screen. Maya in a Shoreditch cafe, one line of caption at a time. No buttons except a quiet Skip. It stops seven times and asks for something each time: see the ladder below. | "Monday morning. Shoreditch. Coffee first." then "I'd like a coffee, please." three times in three shapes. | Taps the key words at 0:10, then says the line at 0:15 and five more times before the scene ends. | A word in her voice each time, never a mark. The scene ends on the frame it taught: `I'd like ... please.` |
| 1:27 | **Notice** | One card. `I'd like` large, the rest of the sentence grey. One why line in the interface language. | The line once more, slowly. | Nothing, one tap to go on. | The tap. Nothing to get wrong. |
| 1:37 | **Say it** | The coach, and one short task: "Order two large coffees." The model sentence sits under it until the learner starts. | The coach asks in her own voice, then listens. | "I'd like two large coffees, please." | One of three coach responses, below. A landed attempt gets a cafe reply, not a score: "Two large coffees. Anything else?" |
| 2:17 | **Use it** | Two or three short tasks. Each one ends with the learner saying the whole sentence. A tap or a gap is allowed as a 20 second run-up, never as the finish. | The target line each time before the turn. | The target sentence, in a new shape each time: a tea instead of a coffee, a bill instead of a drink, the same words to a different person. | A coach response each time. The last task of the three is free: the learner chooses what to order. |
| 3:47 | **Come back later** | The recall echo: six to eight lines from earlier days, one per screen. | Each line once. | The ones that are speakable, said aloud; the rest tapped. | A line that names the next return, not a score: "This comes back tomorrow." |
| 4:47 | **Close** | The can-do ring moves. One sentence: "You can order a drink." Under it, when the lesson returns and where. | Nothing. | Nothing. | The road marker for the week advances by one. |

First act at **0:10**, first spoken turn at **0:15**, both inside the scene. The
coach's turn is at about **1:37**.

### The scene's own ladder

The seven stops in `ATM-A2-INT-0001`, computed from `asksFor` in
`ExplainerPlayer.tsx` against the beats in `Cafe.tsx`. This is the first 52
seconds of the lesson, and it is where the 90-second rule is now satisfied:

| Beat | Stop | At | Ask | What the learner does |
|---|---|---|---|---|
| n1 | 288 | **0:09.6** | tap | Taps `I'd like` and `please` in the caption |
| n2 | 438 | **0:14.6** | say | **Says "I'd like two coffees, please." The first spoken turn.** |
| n3 | 588 | 0:19.6 | say | Says "Could I have a tea?" |
| explain | 783 | 0:26.1 | tap | Taps the two chips in "I want is direct. I'd like is polite." |
| polite | 978 | 0:32.6 | tap | Taps `please` |
| practise | 1186 | 0:39.5 | say | Says "I'd like a coffee, please." |
| again | 1320 | 0:44.0 | say | Says "I'd like a tea, please." |

No passive stretch runs longer than 9.6 s, and the first ask is a tap, not a
sentence, which is rules 1 and 2 met.

**What this costs, stated plainly.** Seven stops add roughly 35 seconds of dwell
to a 52-second video, so the scene now occupies about 0:00 to 1:27 of wall clock
and the lesson runs 5 to 6 minutes, over the 3-to-5-minute chunk in
`docs/learning-model.md`. The answer is not to undo the board's rule but to stop
doing the same work twice after the scene: the **Notice** step now repeats the
scene's own notice beat, and the first `controlled` run-up repeats its practise
beat. Dropping the separate Notice step for any atom whose explainer already has
a notice beat with a tap ask brings the lesson back to 4 to 5 minutes and removes
nothing the learner has not already done. Recommended to the board rather than
applied here, because the phase order landed on LEA-46 one change ago and should
not move again in the same week without a ruling.

### Why this order

| Step | Principle | One line |
|---|---|---|
| Scene before anything | Comprehensible input | The sentence has to mean something before it can be produced. |
| An ask at the end of every beat | Attention decays without action | Nothing passive runs longer than ten seconds, so the scene is watched awake. |
| The first ask is a tap, not a sentence | Foot in the door | A tiny first commitment makes the next one likely; starting with the hardest thing makes the learner quit. |
| Notice one thing only | Attention is the bottleneck | One highlighted form per lesson, not four. |
| Guess before the answer | Generation effect | A wrong guess that is then corrected is remembered better than a right answer read off the screen. |
| Say it third, not last | Retrieval practice | Producing the sentence is the learning event, so it happens while attention is still fresh. |
| Use it in changed shapes | Varied retrieval | Same function, new situation, so the sentence transfers out of the cafe. |
| Come back later at the end | Spacing | Older material is retrieved after the new sentence has landed, so the two do not compete. |
| A response to every turn | Immediate feedback | The learner never waits to find out whether they were understood. |
| The close names the can-do and the return | Self-efficacy, and Zeigarnik | "You can order a coffee politely" is evidence the learner can act; naming tomorrow's return leaves the loop open. |
| Every ask can be skipped | Autonomy | An ask the learner cannot refuse is a test. One they can refuse is an invitation, and more of them take it. |

## The attention law

Board rule, 26 October 2026, from behavioural psychology. It is law for every
explainer and for this lesson flow. `docs/explainers/storyboards.md` carries the
explainer-side half, beat by beat; this is the lesson-side half.

| # | Board rule | What it means for the lesson | State |
|---|---|---|---|
| 1 | No passive stretch longer than 8 to 10 s. The learner acts at the end of every beat that teaches. | The scene was the only long passive stretch in the lesson and is now broken by seven stops, the longest gap 9.6 s. Everything after the scene is already one act per screen. | **Met.** Ladder above, computed from the player |
| 2 | The first ask is tiny and inside the first 10 s, then the asks grow. Never start with the hardest thing. | The lesson's ask ladder runs across the whole 5 minutes, not just the scene: tap in the scene (0:10), say a line in the scene (0:15), the coach's own turn (1:37), the whole exchange with a problem to repair, then the delayed check. | **Met** |
| 3 | Before the video gives the answer, ask the learner to predict it where the scene allows. | Inside the scene, the `predict` beat. In the lesson, the Say it step must ask **before** the model is spoken: the model sentence sits on screen as something to fall back on, never read aloud first, or the learner reads instead of retrieving. | Scene side **needs LP-46**; lesson side **met** |
| 4 | Immediate specific feedback in words, never a mark. Max two tries, then move on kindly. No red, no loss. | The three responses below, in words, with the word that went wrong named. Two tries, then `coach_tries_spent` and the turn stays reopenable. No bars, no transcript, no percentage on any spoken turn. | **Met on screen**, not yet in the coach's voice: LEA-47 |
| 5 | The close says what the learner can now do and names when it comes back, which keeps the loop open. | The Close step says the can-do ("You can order a drink.") and the return. The board's example names the **next situation** too, "Tomorrow: two coffees", which the current close does not. See the change below. | **Half met.** New string needed |
| 6 | Tap any word to hear it, replay a beat, skip an ask. One target per beat, one line on screen. | The player gives all three in the scene. After the scene, every item screen carries one task and one line, and the board's element budget already holds that. An ask the learner cannot skip is a test, not an invitation. | **Met** |

### The one change this rule asks of the close screen

Rule 5 wants the return named as a situation, not only as a time. The current
close screen says the can-do and then `close_returns`, "This comes back tomorrow,
and again until you know it." True, and it keeps the loop open, but it does not
say what is coming, and the thing that makes Zeigarnik work is knowing what the
unfinished thing is.

| Line | Key | Now | Wanted |
|---|---|---|---|
| Can-do | `close_cando` | "You can order a drink." | unchanged |
| Return | `close_returns` | "This comes back tomorrow, and again until you know it." | keep as the fallback, for when there is no next situation to name |
| Next situation | `close_next` (new) | — | "Tomorrow: two coffees." The noun phrase comes from the next due item, so the engine supplies it and the string is a frame, not a sentence |

The scheduling work for this already exists: `dueItems(state, at)` is exported
from `engine.ts` and is already called inside `composeSession` (line 359), so the
next due item is known at the moment the session is built. What is missing is one
field: the `close` phase is pushed with `check_items` and `can_do` only (lines
377, 395, 407, 437), so it has nowhere to carry the situation. That is a small
engine change on my side plus a string from the Copywriter and a slot from the
Front-end Builder. Until all three land, the fallback above is correct and says
nothing false.

## Where the coach speaks

The coach speaks at four moments and nowhere else. She never comments on effort,
never counts, never says well done twice.

| Moment | She says |
|---|---|
| Opening the Say it turn | The task in her own words: "What can I get you?" |
| After a landed attempt | The scene's reply, or the Clear response. |
| After a near attempt | Nearly, or Hard word. |
| When the tries are spent | "That one is hard." The sentence stays on screen and the turn can be reopened. |

## The three responses

Every spoken turn ends in exactly one of three. There is no fourth, and none of
them is a mark.

Strings are **ruled by the Copywriter on LP-70** (LEA-50, reasoning in
`docs/voice.md` under "The spoken turn") and are live in `lib/learning-path/i18n.ts`
with all six translations. They are settled there and nowhere else; this table
quotes them and does not compete with them.

| Response | When | Key | What she says | What is on screen | What happens next |
|---|---|---|---|---|---|
| **Clear** | The attempt passes the speech score. | `coach_clear` | The scene's own reply where there is one ("Two large coffees. Anything else?"), otherwise "Clear. That is how you say it." | The sentence, settled. | The turn rests. No retry offered. |
| **Nearly, once more slower** | Below the pass mark with nothing single to fix, or below the confidence gate, so nothing is written as evidence. | `coach_nearly` | "Nearly. Listen once more." then the whole line again, slower. | The whole line. | She asks again. Up to the try limit. |
| **Let's hear the hard word** | Below the pass mark with one word clearly missed (three letters or more). | `coach_hard_word` | "This word." then the word alone, slowly, twice. | That word, large, alone. | She asks the whole line again. |

Exit line when the tries are spent: **"That one is hard."** (`coach_tries_spent`).
The word or line stays on screen and the turn can be reopened by choice, never by
instruction. It is not "Good try.": praise for effort after a miss is the thing
that stops a learner trusting the Clear, and naming the item as hard rather than
the learner is what removes the fail state.

Two strings go, and both for the same reason. `"Good. Almost every word."` fired
on a **passing** attempt that had missed words, and `"Every word. Well done."`
fired on a clean one. Sorting a landed attempt by how clean it was is the single
thing that makes a spoken turn read as marked rather than answered, and "well
done" is the praise the row above forbids. Both branches fall to `coach_clear`.

`Thank you. I heard "X".` stays as it is, for the open, convo and relay kinds. It
names what she actually heard, which is the most specific feedback in the app, and
it is not one of the three.

### Which language she speaks them in

The ruling left this open as a product call. It is a pedagogy call, so: **the
three lead-ins are shown and spoken in the interface language. The line and the
word she then says are always English.**

The lead-in is a stage direction, not teaching material, so CLAUDE.md's "lessons
are in English" is satisfied by the line and the word, which are the lesson. A
learner who has just missed a sentence has no spare attention for a second
English utterance, and the repair instruction is the one thing in the turn that
has to be understood instantly rather than worked out. This matters most at
Pre-A1 and A1, where "Nearly. Listen once more." is itself harder than the item.

## What returns, and where

The lesson is not finished when the close screen appears. The same can-do comes
back in a new situation, which is what makes it feel learned rather than
rehearsed.

The schedule is **not a calendar**. `engine.ts` holds a half-life per item and
brings it back when predicted recall falls to 0.8, so each return is earned by
the one before it. Days below are the ladder replayed against `applyAttempt` for
a spoken item answered correctly every time, counting from the lesson:

| Return | Lands about | State after | In which situation | Shape |
|---|---|---|---|---|
| First echo | 8 hours later, so the same day or the next session | Learning | Same cafe, different order: a tea, a sandwich | One spoken line in the recall echo |
| Second echo | Day 1 | Learning | A cafe that is out of what you wanted | The next lesson's Use it step, as the run-up |
| Third echo | Day 1 to 2 | Consolidating | Teach it back: tell Maya how to order | The week's free-use performance, day five |
| Fourth echo | Day 4 | Consolidating, second rung | A shop, not a cafe: the same polite ask | Recall echo, spoken |
| Fifth echo | Day 11 | **Known** | Anywhere the polite ask fits | Recall echo, and it stops being taught |

So the first week carries four returns, close together and each in a changed
situation, and the gaps only open out once the item is Known: day 11, then day
30, then two months. There is no fixed four-day step anywhere in it.

A miss moves the ladder, it does not reset it. One miss in Learning or
Consolidating halves the half-life and requeues the item inside the same session;
a miss on a Known or Mastered item drops it to Consolidating with the interval
back to three days, never to zero. Two consecutive misses set `reteach`, which is
what pulls the atom's scene back in front of the learner instead of another check.

Said to the learner in one sentence on the close screen: **"This comes back
tomorrow, and again until you know it."** (`close_returns`). That sentence is true
at every state, which "again in four days" was not: a learner told four days and
echoed on day one has been given a false promise by the one screen whose job is
to be trusted.

## The cut

A lesson that feels like a quiz has too many tapping tasks. For the first week,
an item earns its place only if it ends in the learner saying the target
sentence. Tap-order, gap-fill and error-spot survive only as a 20 second run-up
inside a step that finishes in speech.

Taking the cafe lesson, ATM-A2-INT-0001, as the worked case:

| Keep | Step it sits in | Why |
|---|---|---|
| `ITM-INT-0105` say it, see it: order two large coffees | Say it, opens at 1:00 | The spoken turn itself |
| `ITM-INT-0104` transform: make it polite | The run-up, 20 seconds | One scaffold, then said aloud |
| `ITM-INT-0107` roleplay: no large cups today | Use it | The whole exchange, with a problem to repair |
| `ITM-INT-0106` gap fill: I'd ___ a coffee | The delayed check | One item, after the sentence has landed |

| Cut from week one | Why |
|---|---|
| `ITM-INT-0101` tap order | Three tapping items on the same sentence. One run-up is enough. |
| `ITM-INT-0102` gap fill: Could I have | Recognition only, and the form returns in the check. |
| `ITM-INT-0103` pick the picture | Listening dressed as the cafe lesson. It belongs in the LST atom. |

The changed-situation item stays inside its own atom. `ITM-INT-0107` is the
cafe atom's; `ITM-INT-0904` is the oat-milk atom's, and `ITM-INT-1006` the
bill atom's. An earlier draft of this table borrowed `ITM-INT-0902` across
atoms, which would have put the oat-milk problem inside the cafe lesson.

Same test applied across the week. As built, the cut is:

| Atom | Cut | Keeps as the run-up |
|---|---|---|
| ATM-A2-INT-0001 | `ITM-INT-0101`, `ITM-INT-0102`, `ITM-INT-0103` | `ITM-INT-0104` |
| ATM-A2-GRM-0002 | `ITM-GRM-0201`, `ITM-GRM-0203` | `ITM-GRM-0202`, `ITM-GRM-0204` |
| ATM-A1-SPK-0005 | `ITM-SPK-0503` | `ITM-SPK-0504`, `ITM-SPK-0502` |
| ATM-A2-WRT-0007 | `ITM-WRT-0701` | `ITM-WRT-0702`, `ITM-WRT-0703` |
| ATM-A2-INT-0009 | `ITM-INT-0903` | `ITM-INT-0901`, `ITM-INT-0902` |
| ATM-A2-INT-0010 | `ITM-INT-1003` | `ITM-INT-1001`, `ITM-INT-1002` |
| ATM-A2-LST-0004, ATM-A2-RDG-0006 | nothing | all four: there the recognition work is the criterion |
| ATM-A2-MED-0008, ATM-A2-GRM-0003 | nothing | all three: the three facts, and the three time frames, are what the criterion names |

Cut items stay in `ITEMS` and in each atom's `target_items`, so they remain
reachable from the practice deck and from a recall echo, where tapping is the
right shape because the work there is remembering, not producing.

`ITM-GRM-0206` and `ITM-WRT-0705` are not cuts: they are the delayed checks of
their atoms. An earlier draft of this section listed them as cuts.

## Measured, not assumed

A full first-run walkthrough at 375x812, auto-answering each item through the
tester hook, clock started at the Continue on the road screen.

| Measured | Time | Note |
|---|---|---|
| The scene is on screen | 0.6s | No plan screen. The session now opens on the lesson. |
| A mic the learner can speak into | about 28s | The scene's own "Say it with me" line sits at 28s in `ATM-A2-INT-0001` and the video clock runs at 1:1. The walkthrough confirms the say-along mic is present by 51s; the 28s is read off the content, not off the clock. |
| Notice | 54.1s | After the full 50 second scene and its say-along. |
| Four tapping items | 54.7s to 62.1s | Auto-answered at about one second each. A learner needs 15 to 20 seconds each. |
| **The coached production turn** | **62.1s** | "Order two large coffees", answered with the cafe's own reply "Coming right up." |
| Delayed check, then close | 63.6s to 66.0s | |

That walkthrough is now two changes out of date and its verdict, "not yet met for
a real learner", no longer holds. Two things have landed since:

**1. The phase order (LEA-46), verified in the data, not taken on trust.** All ten
week-one atoms now read `input -> noticing -> free_use -> controlled -> free_use
-> check`, and in every one of the ten the **first item the learner meets is a
spoken one**, checked by walking each atom's phases and reading `modality` from
`ITEM_BY_ID`:

| Atom | First item | Type | Modality |
|---|---|---|---|
| ATM-A2-INT-0001 | `ITM-INT-0105` | say_it_see_it | spoken |
| ATM-A2-GRM-0002 | `ITM-GRM-0205` | say_it_see_it | spoken |
| ATM-A2-GRM-0003 | `ITM-GRM-0306` | dialogue_turn | spoken |
| ATM-A2-LST-0004 | `ITM-LST-0405` | read_aloud | spoken |
| ATM-A1-SPK-0005 | `ITM-SPK-0501` | shadow | spoken |
| ATM-A2-RDG-0006 | `ITM-RDG-0605` | relay | spoken |
| ATM-A2-WRT-0007 | `ITM-WRT-0706` | shadow | spoken |
| ATM-A2-MED-0008 | `ITM-MED-0806` | dialogue_turn | spoken |
| ATM-A2-INT-0009 | `ITM-INT-0906` | dialogue_turn | spoken |
| ATM-A2-INT-0010 | `ITM-INT-1004` | say_it_see_it | spoken |

Nothing tapping stands between the scene and the first coached turn in any of the
ten. The six tapping screens in the walkthrough below are gone.

**2. The board's attention rule, which moves the number that matters.** The scene
itself now stops seven times and the learner speaks at **14.6 s**, so the first
spoken turn no longer waits for the coach at all. The 90-second requirement is
met with 75 seconds to spare, and it is met by the scene.

The coached turn with Maya, by contrast, now arrives **later** than before, at
about 1:37, because the scene's seven stops add dwell time. That is the right
trade: the requirement is a speaking turn, and the learner gets one at 15
seconds instead of at 62. It is also the reason the lesson now runs 5 to 6
minutes, which is the one real cost of the board's rule and is written up under
**The attention law** above with the change that pays for it.

**Still outstanding: the end-to-end re-measure.** The figures in the table above
are from the old order. Re-running `scripts/lp/run.sh` needs a clean build, and
the checkout is being written by another run right now (`content.ts` is modified
mid-flight), so a build taken this minute would measure someone else's
half-finished tree. The two numbers this run could establish without a build are
established: the scene's stop ladder, computed from `asksFor` against `Cafe.tsx`,
and the phase order, read out of `content.ts`.

### Seen, not just measured

The LP-90 walkthrough of 26 October (`scripts/lp/out/`) captures the first cafe
lesson screen by screen, and the file names alone are the finding:

| Shot | Screen |
|---|---|
| `light-13/14/15-lesson-explainer-*` | The scene, playing, through its say-along |
| `light-16-lesson-screen-02` | tapping |
| `light-17-lesson-tiles-03` | **tap-order, "PUT THE WORDS IN ORDER", `I'd / like / a / coffee / please`** |
| `light-18-lesson-choice-04` | tapping |
| `light-19-lesson-choice-05` | tapping |
| `light-20-lesson-screen-06` | tapping |
| `light-21-lesson-tiles-07` | tapping |
| `light-22-lesson-coach-08` | **the mic. The first time the learner speaks.** |

Six tapping screens between the scene and the microphone. `light-17` is
`ITM-INT-0101`, the first item on the cut list, and it asks the learner to
assemble a sentence the scene has just said three times. That is the quiz the
board means, and it is visible without reading a single number.

The spoken turn itself, `light-22`, is now right: the coach, the sentence large,
one quiet instruction line under it, the mic. No bars, no dots, no transcript, no
score. That screen is the lesson the ticket asks for. It just arrives sixth.

**Superseded, 26 October, and kept here as the before-picture.** The six tapping
screens are gone from the data: `ITM-INT-0101`, `0102` and `0103` are out of the
cafe atom's phases and the atom's first item is now the spoken `ITM-INT-0105`,
checked in the table above. The shots themselves are from a build taken before
that landed, so `light-16` to `light-21` no longer describe the lesson. A fresh
walk will show the scene with its own asks and then the coach, and those shots
are what should go to the board; the ones above are useful only as the contrast.
The same walk also now stops seven times inside the explainer, which is what the
QA run of 11:45 was seeing when it reported six ask sheets.

### Three things the walkthrough turned up

1. **The scene does not play on its own.** Pressing Continue lands the learner on
   a paused video with a play button over it. One more tap, and it makes the
   first thing in the lesson a decision rather than a story. The scene should
   start playing as the phase opens, with pause available.
2. **The scene gate is 80% of 50 seconds.** Continue stays disabled for 40
   seconds. That is right for a first watch and wrong for a return visit; on a
   repeat the gate should already be open.
3. **A landed turn is answered with three meters.** The cafe says "Coming right
   up", and under it sit Sounds, Rhythm and Words as three filled bars plus the
   transcript. That is the single thing that makes a spoken turn read as marked
   rather than answered. On a Clear the reply is the whole response: no bars, no
   transcript. Keep the sub-scores going to `onAnswer` as evidence, and keep
   them out of the learner's sight.
   **Fixed, 26 October** (LEA-51, in the coach work on LEA-6). `light-22` shows
   the spoken turn with no bars, no transcript and no progress dots. The
   sub-scores still go to `onAnswer` as evidence, which is where they belong.

### Verified session shapes

`composeSession` output, five cases, after the re-order. Re-verified 26 October
2026 against `content.ts` with the Content Lead's eight new atoms in it, to be
sure the wider atom pool had not changed which phases get composed. It has not:

| Case | Phase order |
|---|---|
| First run | `atom:new` -> `close` |
| Day 1, nothing due | `atom:new` -> `atom:use` -> `story` -> `close` |
| Day 2, items due | `atom:new` -> `atom:use` -> `recall` -> `story` -> `close` |
| Second session | `recall` -> `atom:use` -> `atom:fluency` -> `close` |
| Warm restart | `recall` -> `story` -> `close` |

No `plan` phase in any of them. The two review-only shapes open on the recall
echo, which is correct: there is no new scene to open on, and the echo is
familiar material.

## The atom shape this timeline needs

The timeline above is an atom's `phases` array. The canonical order, adopted from
the shape the CEFR Content Lead authored for atoms 12 to 19, is five phases:

| Phase | Timeline step | Items | Why this slot |
|---|---|---|---|
| `input` | Scene | the video or word tutorial | Comprehensible input before anything is asked |
| `noticing` | Notice | one highlighted form | One thing, not four |
| `free_use` | **Say it** | **one** spoken turn with the coach | The first spoken turn, inside 90 seconds |
| `controlled` | Use it, the run-up | two or three scaffolds | A 20 second run-up, never the finish |
| `free_use` | Use it, the whole thing | one exchange with a problem to repair | Varied retrieval, changed situation |
| `check` | Delayed check | one say-it of the whole sentence | Retrieval, delayed |

This is better than the single `controlled`/`free_use` swap I first proposed on
LEA-46, because it keeps a scaffold in the lesson without putting it between the
scene and the learner's first spoken turn. The swap moved the run-up after the
speaking turn; this shape *splits* `free_use` either side of it, so the learner
speaks at 1:00, gets a run-up, then speaks the whole exchange. Adopt this shape,
not the swap.

Atoms 12 to 19 already read this way, and **atoms 1 to 10 now do too**, verified
item by item in the table under **Measured, not assumed**. The gap this section
described is closed.

One line in that table is now stale in a way worth naming: `free_use` is no
longer "the first spoken turn". Since the board's attention rule, the first
spoken turn is inside `input`, at 14.6 s, and `free_use` is the first spoken turn
*with the coach*, at about 1:37. The slot is still right; the reason it is right
has changed from "it is first" to "it is the first one with a reply from a
person".

## What this asks of the build

| Owner | Change | Where | State |
|---|---|---|---|
| Learning Designer | `composeSession` in `lib/learning-path/engine.ts`: the session opens on the scene, the recall echo moves after the new atom, the plan screen goes (Home already carries the plan). | this ticket | **Done**, and the five session shapes above are its output |
| Copywriter (LP-70) | The exact strings in the three responses table, and the one close sentence. | LEA-48, ruled on LEA-50 | **Delivered.** Five keys live in `i18n.ts` with six translations; folded into this doc above |
| CEFR Content Lead (LP-60) | Bring atoms 1 to 10 onto the five-phase shape above, and the item cut below. Atoms 12 to 19 already had it. | LEA-46 | **Done.** All ten read `input -> noticing -> free_use -> controlled -> free_use -> check`, each third phase opens on a spoken item, no item reference dangles, cut items survive in `ITEMS` and `target_items`, `tsc` clean |
| Front-end Builder | `Coach.tsx`: the three responses named and nothing else; no score shown on a near attempt; both landed branches fall to `coach_clear`. | LEA-47 | **Open.** `"Good try."`, `"Good. Almost every word."` and `"Every word. Well done."` are all still in the file |
| Front-end Builder | The explainer ask sheet needs its own opaque surface in both themes. It uses `.lp-glass`, which is `rgba(255,255,255,0.05)` in dark, so all seven ask sheets are unreadable over the bright scene. Not a token change: the colours in `lp.css` are frozen. | QA found it on LEA-52; the file is `ExplainerPlayer.tsx`, which is the builder's | **Open, and not mine.** Triaged to the builder; see the note below |
| Front-end Builder / Motion | The cafe explainer runs 1560 frames, 52 s, against the 40 s cap in `docs/design/brief.md` and in the storyboard beat law. Its recap alone is 7 s. | `Cafe.tsx` | **Open.** Raised, not applied: `Cafe.tsx` is not mine to edit |
| Front-end Builder (LP-46) | The `predict` beat kind and ask kind. Every one of the eighteen storyboards now has a `predict` beat and none of them can play, because `asksFor` has no predict kind and the `Beat` union has no `predict` member. | LP-46 | **Open.** This is now the single thing blocking rule 3 across every explainer |
| Learning Designer | One field on the `close` phase to carry the next situation, so the close screen can say "Tomorrow: two coffees". | this ticket, after a ruling on the close wording | **Specified, not applied.** See **The attention law** |

**The 90-second rule is met**, and by a route the ticket did not anticipate: not
by shortening what comes before the coach, but by the scene itself asking the
learner to speak at 14.6 seconds. Both halves are verified without a build, one
from `asksFor` against `Cafe.tsx` and one from `content.ts`. The end-to-end
re-measure is still owed and is the last item on this ticket; it needs a clean
build, and the checkout is mid-write by another run.

**On the ask-sheet failure QA asked me to place (LEA-52).** It is not this
ticket's, and it is not mine. The pause panel lives in `ExplainerPlayer.tsx`,
which the Front-end Builder owns under LP-46; I am asked not to touch that file
or `Cafe.tsx`. QA is right on both counts: it is dark-only, and it must not be
fixed by editing the frozen `lp.css` tokens. One correction for the next run,
offered because it changes the count rather than the finding: the cafe explainer
stops **seven** times, not six. The seventh is the `again` beat at frame 1320,
"I'd like a tea, please.", and a driver that watches to the end should catch it
failing in dark as well.
LEA-47 does not move the number; it is about which words the coach says once the
learner has spoken.
