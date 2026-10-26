# Lesson flow: the cafe lesson at A2.1

One lesson, minute by minute, as the learner feels it. This is the shape every
lesson follows. The worked example is the first cafe lesson: atom
`ATM-A2-INT-0001` "At the cafe", criterion `CRI-A2.1-INT-01-01`, outcome
"Can order food and drink in a cafe".

The rule the whole timeline serves: **the learner says something out loud inside
the first 90 seconds of pressing Continue.** Everything before that exists only
to make the first sentence sayable.

## The timeline

| From | Step | Sees | Hears | Says | Gets back |
|---|---|---|---|---|---|
| 0:00 | **Scene** | The explainer plays full screen. Maya in a Shoreditch cafe, one line of caption at a time. No buttons except a quiet Skip. | "Monday morning. Shoreditch. Coffee first." then "I'd like a coffee, please." three times in three shapes. | Nothing. Watching is allowed to be watching. | The scene ends on the frame it taught: `I'd like ... please.` |
| 0:50 | **Notice** | One card. `I'd like` large, the rest of the sentence grey. One why line in the interface language. | The line once more, slowly. | Nothing, one tap to go on. | The tap. Nothing to get wrong. |
| 1:00 | **Say it** | The coach, and one short task: "Order two large coffees." The model sentence sits under it until the learner starts. | The coach asks in her own voice, then listens. | "I'd like two large coffees, please." | One of three coach responses, below. A landed attempt gets a cafe reply, not a score: "Two large coffees. Anything else?" |
| 1:40 | **Use it** | Two or three short tasks. Each one ends with the learner saying the whole sentence. A tap or a gap is allowed as a 20 second run-up, never as the finish. | The target line each time before the turn. | The target sentence, in a new shape each time: a tea instead of a coffee, a bill instead of a drink, the same words to a different person. | A coach response each time. The last task of the three is free: the learner chooses what to order. |
| 3:10 | **Come back later** | The recall echo: six to eight lines from earlier days, one per screen. | Each line once. | The ones that are speakable, said aloud; the rest tapped. | A line that names the next return, not a score: "This comes back tomorrow." |
| 4:10 | **Close** | The can-do ring moves. One sentence: "You can order a drink." Under it, when the lesson returns and where. | Nothing. | Nothing. | The road marker for the week advances by one. |

Total 4 to 5 minutes. First spoken turn at **1:00 to 1:10**, landed by **1:40**.

### Why this order

| Step | Principle | One line |
|---|---|---|
| Scene before anything | Comprehensible input | The sentence has to mean something before it can be produced. |
| Notice one thing only | Attention is the bottleneck | One highlighted form per lesson, not four. |
| Say it third, not last | Retrieval practice | Producing the sentence is the learning event, so it happens while attention is still fresh. |
| Use it in changed shapes | Varied retrieval | Same function, new situation, so the sentence transfers out of the cafe. |
| Come back later at the end | Spacing | Older material is retrieved after the new sentence has landed, so the two do not compete. |
| A response to every turn | Immediate feedback | The learner never waits to find out whether they were understood. |

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

| Keep | Why |
|---|---|
| `ITM-INT-0105` say it, see it: order two large coffees | The Say it turn itself |
| `ITM-INT-0104` transform: make it polite | Run-up, then said aloud |
| `ITM-INT-0106` gap fill: I'd ___ a coffee | The delayed check, one item |
| `ITM-INT-0902` / `ITM-INT-0904` out of oat milk | Use it in a changed situation |
| `ITM-INT-1004` ask for the bill | Use it in a changed situation |

| Cut from week one | Why |
|---|---|
| `ITM-INT-0101` tap order | Three tapping items on the same sentence. One run-up is enough. |
| `ITM-INT-0102` gap fill: Could I have | Recognition only, and the form returns in the check. |
| `ITM-INT-0103` pick the picture | Listening dressed as the cafe lesson. It belongs in the LST atom. |

Same test applied across the week: `ITM-GRM-0201`, `ITM-GRM-0203`,
`ITM-GRM-0206`, `ITM-WRT-0701` and `ITM-WRT-0705` are tapping items whose
criterion is already carried by a spoken or written production item in the same
atom. Keep one run-up per atom, cut the rest from week one. They stay in the
bank for the practice deck and for recall echoes, where tapping is the right
shape because the work is remembering, not producing.

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

So the rule is **not yet met for a real learner**. The say-along mic inside the
scene arrives in time. The turn where the learner produces the sentence
themselves and gets a reply arrives at 62 seconds only because the four tapping
items cost a second each under the tester hook. Priced at a learner's real pace
those four items cost 60 to 80 seconds rather than 7, which puts the coached
turn at roughly 115 to 135 seconds.

The fix is the atom phase swap, not more engine work: moving `free_use` ahead of
`controlled` puts the coached turn straight after the notice, at about 65
seconds. That change is with the CEFR Content Lead, who owns `content.ts`.

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

### Verified session shapes

`composeSession` output, five cases, after the re-order:

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

## What this asks of the build

| Owner | Change | Where | State |
|---|---|---|---|
| Learning Designer | `composeSession` in `lib/learning-path/engine.ts`: the session opens on the scene, the recall echo moves after the new atom, the plan screen goes (Home already carries the plan). | this ticket | **Done**, and the five session shapes above are its output |
| Copywriter (LP-70) | The exact strings in the three responses table, and the one close sentence. | LEA-48, ruled on LEA-50 | **Delivered.** Five keys live in `i18n.ts` with six translations; folded into this doc above |
| CEFR Content Lead (LP-60) | Atom phase order in `lib/learning-path/content.ts`: `input` → `noticing` → `free_use` → `controlled` → `check`, and the item cut above. | LEA-46 | **Open, and it is the one thing still holding the 90-second rule.** `content.ts` is theirs; not touched from here |
| Front-end Builder | `Coach.tsx`: the three responses named and nothing else; no score shown on a near attempt; both landed branches fall to `coach_clear`. | LEA-47 | **Open.** `"Good try."`, `"Good. Almost every word."` and `"Every word. Well done."` are all still in the file |

The 90-second rule is met in the engine and not yet met in the product. The only
remaining blocker is the atom phase swap on LEA-46: until `free_use` sits before
`controlled`, four tapping items stand between the scene and the first spoken
turn, which prices the coached turn at 115 to 135 seconds at a learner's real
pace. Nothing else on this list changes that number.
