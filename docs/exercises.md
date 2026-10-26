# Exercises: what each item type is for, and what goes

Owner: Learning Designer. Status: for board approval. Part 2 (the change to `items.tsx` and `content.ts`) is held until this is approved.

## The test

From the board note of 26 October. Every item type is judged against these, in this order.

| # | Test | Fails if |
| --- | --- | --- |
| 1 | An exercise exists to make the learner **produce** the phrase, not to test recognition | The learner finishes the item without ever saying or writing the target sentence |
| 2 | A tap or drag item earns its place only if it **leads to** saying the sentence | The item ends on a tap |
| 3 | One thing at a time: one phrase, one pattern or one sound per lesson | The item introduces a second new thing |
| 4 | Comprehensible input first: the scene teaches, not the explanation | The item is the first place the learner meets the language |
| 5 | Feedback is patient, not a mark: say it again slowly, show it big, one more try | There is a score, a bar, a cross or a count |
| 6 | A visual belongs on screen only when it is the stimulus the learner must look at, or the one progress signal | The visual decorates |

## Where today stands

Lesson items only (59; placement and checkpoint counted separately below).

| Modality | Items | Share |
| --- | --- | --- |
| recognition | 31 | 53% |
| cued (tap, drag, slide) | 10 | 17% |
| typed | 4 | 7% |
| spoken | 14 | 24% |

Over half the lesson is recognition. That is what the board is reacting to. Target after part 2: **spoken at least 50%, recognition at most 15%**, and recognition only where recognition *is* the outcome (hearing fourteen against forty) or where a mic is forbidden (placement is scores-only by product rule).

## Verdicts

Counts are lesson items. "Scaffold" means the item runs up to a spoken item and hands over to it.

| Item type | Now | Verdict | What is wrong today for a learner with little English | Place in the lesson |
| --- | --- | --- | --- | --- |
| `gap_fill` | 14 | **Cut from lessons** | The learner picks one word from three and never says the sentence. The model sentence sits in `audio` and is never played; the speaker button reads the gapped line, so the learner hears "I'd blank a coffee". Fails tests 1, 2 and 4. | none. The meaning work moves to the notice step, the sentence to a say-it item |
| `pick_picture` (emoji) | 3 | **Cut** | The "pictures" are emoji. 🍵🍵 for "two teas" asks the learner to count glyphs, not to hear English. ☕ against 🍵 is a guess at a glyph, not comprehension. Fails tests 1 and 6. | none |
| `pick_picture` (numbers) | 2 | **Keep**, renamed `listen_and_do` | Here the digit *is* the stimulus and hearing 14 against 40 is the whole can-do, so recognition is honest. But it ends on a tap. | scaffold, before say it |
| `detail_gap` | 2 | **Fix**, folded into `listen_and_do` | Same job as the above, different screen for no reason. Two screens for one skill. | scaffold |
| `tfng` | 4 | **Fix**, 4 to 2 | Reading a notice is a real outcome, but "Not given" is an exam construct an A2 learner cannot parse, and three of the four are about the same six-word notice. | scaffold, before the relay |
| `gist_mcq` | 2 | **Cut** | "What is the bill for? Gas / Water / Internet" after a recording that opens with "This is your gas bill". It tests nothing the relay item does not prove by production. | none |
| `inference_mcq` | 1 | **Cut** | "We're out of oat milk means..." is a vocabulary gloss dressed as a test. The gloss belongs in the notice step. | none |
| `heading_match` | 1 | **Cut** | One instance, and choosing a title is a reading-exam task, not something the learner will do. | none |
| `error_spot` | 1 | **Fix** | Good instinct, wrong ending: the learner finds the wrong word and stops. | scaffold, must end in saying the corrected sentence |
| `tap_order` | 5 | **Fix** | Earns its place under test 2 only once saying the sentence follows. Today it ends on a tick. | scaffold, hands straight to say it |
| `sentence_build` | 1 | **Cut as a type**, merged into `tap_order` | Identical screen and identical code path. Two names for one item. | n/a |
| `magnet_tiles` | 3 | **Fix** | The scaffold is sound (a wrong sentence can never be built) but the bounce prints a grammar label inside the tile in warning colour, and after three bounces it self-assembles and still records a fail. That is a mark. Fails test 5. | scaffold, one per lesson at most |
| `time_slider` | 1 | **Cut** | Three tenses on one screen breaks test 3, the cue card and the track carry four emoji, and the dot row scores the learner mid-item. | replaced by three say-it items, one tense each, across three lessons |
| `transform` | 1 | **Keep, fix** | Real production ("Make it polite: I want a sandwich"). Wrong channel: typing is the fallback, not the first offer. | say it, with the keyboard as fallback |
| `correct_message` | 1 | **Keep** | Writing is the outcome here, so typing is right. | use it |
| `dictation` | 1 | **Keep** | Typing a price you have just heard is a real act. | scaffold |
| `short_production` | 1 | **Keep, fix** | Writing outcome, right channel. The target-word pill row and the live word counter are clutter. | use it |
| `read_aloud` | 4 | **Keep**, through the coach | Right idea. Today it is a mic under a prompt with three score bars after it. | say it |
| `shadow` | 1 | **Fix**, merged into the coach say-it turn | The instruction is the hardcoded English string "Shadow duet". A beginner cannot read it and it is not localised. | say it |
| `say_it_see_it` | 3 | **Fix**, coach only | The concept passes test 6 (the scene is what the learner must understand) but the drawing does not: two emoji faces, a 🧑 labelled "You", the drink emoji repeated to count quantity, and the word "counter" as a placeholder. In `use` mode the coach already renders these; the emoji scene is the leftover. | say it with a response |
| `open_response` | 3 | **Keep**, through the coach | The strongest item we have. | use it |
| `roleplay` / `dialogue_turn` | 1 | **Keep, fix** | Exactly the board's shape: line, mic, response. Two faults: the chat log grows until the mic leaves a 375×812 screen, and the character's turns are the only English the learner sees, so a miss gives no model. | use it |
| `relay` | 2 | **Keep, fix** | Real mediation and real production. The question dots are a score row shown before the learner speaks, and the panel is labelled "Source" in English. | use it |
| `explain_chart`, `translate_gist` | 0 | **Cut the dead routes** | Both route to the relay screen, which cannot show a chart. Nothing renders them. | n/a |
| `picture_describe` | 0 | **Cut the dead route** | Routes to the speech item, which draws no picture. A picture-description item with no picture. | n/a |
| `vote_see_revote` | 1 | **Cut** | The peer percentages are invented numbers in `config.peers`, the model answer is revealed before the second vote, and the learner produces nothing. Social proof theatre. | none |
| teach back (`open_response` + `teach_back`) | 1 | **Keep** | Explaining it to someone else is production plus retrieval. Keep as it is. | come back later |
| fluency rounds (`read_aloud` + `fluency`) | 2 | **Keep, fix** | The screen promises three rounds and ends after the first pass, so "say it three times" is not what happens. The round counter is untranslated. | come back later |
| last check (`check` mode) | 6 | **Fix** | Every delayed check is a `gap_fill`, so the one moment that decides mastery is a three-way tap. | come back later, as a say-it of the whole sentence |
| placement and checkpoint | 14 | **Keep as recognition** | Placement is scores-only by product rule and must work with no mic and no feedback. Recognition is correct here and only here. | outside the lesson |

## Lesson order

The board's order, and what fills each place.

| Place | What the learner does | Item types |
| --- | --- | --- |
| Scene | Watches or swipes the situation. No exercise. | input phase |
| Notice | Sees the one target form highlighted, hears it again. No exercise. | notice phase. The glosses cut from `inference_mcq` and `gap_fill` land here |
| Say it, with a response | Says the phrase inside the first minute and something reacts | coach say-it, `say_it_see_it`, `read_aloud` |
| Use it | Says or writes it to get something done | `roleplay`, `relay`, `open_response`, `correct_message`, `short_production` |
| Come back later | The same phrase inside a new situation | delayed say-it check, recall echo, fluency rounds, teach back |

Scaffolds (`tap_order`, `magnet_tiles`, `error_spot`, `listen_and_do`, `dictation`) sit between notice and say it. Each one ends by handing the sentence to the mic: the last thing the learner does on a scaffold screen is say what they just built. Retrieval practice, and it is the reason the tap survives at all.

Per atom after part 2: one scaffold, one listening or reading scaffold if the strand needs it, two spoken, one delayed say-it check. Reading and writing atoms swap one spoken for one typed.

## The minimal screen

One instruction line in plain words (six words at most, PRD principle 2, localised, never a hardcoded English string), the stimulus, the response control, the feedback. Nothing else above the fold.

| Item type | Instruction | Stimulus | Response | Feedback |
| --- | --- | --- | --- | --- |
| `tap_order` | "Put it in order" | the sentence heard, tap to hear again | word tiles, then the mic | the built sentence said aloud, then "say it" |
| `magnet_tiles` | "Build it" | the sentence heard | word tiles that only accept the next word, then the mic | the next word said slowly and shown big, no label |
| `error_spot` | "One word is wrong" | the sentence as tiles | tap the word, then the mic | the corrected sentence said aloud, then "say it" |
| `listen_and_do` | "Listen. Which one?" | one audio button, large | two or three numbers or prices as text, then the mic | the number said slowly, then "say it" |
| `tfng` | "Is this true?" | the notice, as the notice looks | True / False | the line of the notice that answers it, read aloud |
| `dictation` | "Type the price" | one audio button | number keypad input | the price written and said |
| `transform` | "Say it politely" | the blunt sentence | mic, keyboard as fallback | the polite version said, one line of why |
| `correct_message` | "Fix the message" | the wrong message as a message | text input | the fixed message, one line of why |
| `short_production` | "Write two lines" | the situation in one sentence | textarea | the model message, one line of why |
| coach say-it (`read_aloud`, `shadow`, `say_it_see_it`, `open_response`) | the coach's own line | the coach, her line, nothing else while she talks | mic, keyboard as fallback | owned by the coach, see below |
| `roleplay` | "Turn 1 of 3" as a localised line | the last two turns only, the character's line large | mic | the character answers in one short sentence |
| `relay` | "Tell Sami what to do" | the notice, unlabelled | mic | the character asks for the one thing that is missing |

## Feedback

Spoken items: the coach owns the surface (`components/learning-path/coach/Coach.tsx`, LEA-6, Front-end Builder). I specify no second panel. Non-spoken feedback matches her pattern exactly:

| Outcome | What happens | What never happens |
| --- | --- | --- |
| Right | The correct sentence is said aloud, a tick, continue | A score, a count, a streak, confetti |
| Wrong, first time | The target word or sentence is said again slowly and shown big, one short line of why in the learner's language below A2, and one more try on the same item | A cross, red, a mark, the answer given away |
| Wrong, second time | The full model sentence shown and said, then continue. The item returns later in a new situation. | "Incorrect", a lives counter, a lockout |

One retry on every non-spoken item is new; today a wrong tap goes straight to the answer and Continue. Immediate feedback plus one spaced retry is the evidence base for both halves of this.

## Decorative visual aids, cut

Named, with where they live.

| # | The visual | Where | Why it goes |
| --- | --- | --- | --- |
| 1 | Emoji faces 😊 🤔 🙂, the 🧑 figure labelled "You", the drink emoji repeated to show quantity, the placeholder word "counter" | `items.tsx` `CafeScene`, lines 564 to 578 | Emoji stand-ins for a scene. The coach already draws the real character. |
| 2 | Emoji as pictures: ☕ 🍵 🍵🍵 💳 💵 🧾 🏥 🏫 🏪 🍎 🚌 | `content.ts`, `pictures` arrays | Not pictures. Counting glyphs is not comprehension. |
| 3 | The ⏮️ 📍 ⏭️ row under the slider, and the cue-card emoji | `items.tsx` lines 317 and 325 | Icon row. Goes with the slider. |
| 4 | Score bars for sounds, rhythm and words, with a 70% pass line | `items.tsx` `ResultBars`, lines 472 to 488 | Three bars and a tick mark are a mark, not feedback. Fails test 5. |
| 5 | Dot rows that appear **before** the learner acts: the slider hit dots and the relay question dots | `items.tsx` lines 318 and 718 | A score bar before the learner has done anything. |
| 6 | The target-word pill row, including "ed" and "?" as pills | `items.tsx` lines 391 and 542 | Grammar fragments as chips. Noise to a beginner. |
| 7 | The live word counter on the writing item | `items.tsx` line 393 | Counts the learner while they are still thinking. |
| 8 | Peer percentages 12% / 71% / 17% | `items.tsx` line 762, `content.ts` `config.peers` | Invented data. Goes with the vote item. |

Kept, because each is the stimulus or the one progress signal: the audio button on a listening item, the notice text on a reading item, the word tiles, the coach figure, the capsule progress bar in the chrome (owned by LP-10).

Flagged, not mine to change: the emoji on word-tutorial cards where the word is abstract (✅ for "allowed", ⚠️ for "Mind the gap") and the outcome icons (☕ 🔢 🚇 🙋 🪧 💬 🧾 📅). The data is in `content.ts` but the renderers are Capsule chrome and Home, which belong to LP-10. Raising with the UX Designer rather than editing across the line.

## Defects found while judging

For part 2, with the fixes above.

| # | Defect | Where |
| --- | --- | --- |
| 1 | The model sentence in `audio` is never played on a `gap_fill`, and the speaker button reads the gapped line aloud, underscores included | `items.tsx` 109, 137 |
| 2 | `isListening` is a ternary whose first branch is the literal `true`, so the second half can never be reached | `items.tsx` 109 |
| 3 | Fluency rounds end after the first passing attempt, though the screen promises three | `items.tsx` 513, 545 |
| 4 | Hardcoded English instructions, not localised: "Shadow duet", "Say it, see it", "Explain it to ...", "Source", "Round 1 of 3", "Voice needs Chrome or Edge" | `items.tsx` 528, 607, 706, 709, 545, 446 |
| 5 | The roleplay log grows without bound and pushes the mic off a 375×812 screen | `items.tsx` 660 |
| 6 | `pick_picture` renders a 3-column grid of 34px glyphs with 12px labels, which truncate | `items.tsx` 146, 150 |
| 7 | The instruction line uses `lp-eyebrow`, a small faint style, for the one thing a beginner must read first | `items.tsx` 65 |

The engine contract (`ItemRenderer`, `ItemResult`, `onAnswer`, `onNext`, the `lp:auto` tester hook) is unchanged by any of this. Cut types lose their `switch` case and their items; nothing in `engine.ts` or `scoring.ts` needs a new shape.

## Sequencing

1. This document to the board. Nothing in `items.tsx` or `content.ts` changes until it is approved, because the cut list decides what content exists and the A2.1 content week is sequenced behind it.
2. On approval: `items.tsx` and `content.ts`, then QA Reviewer, then the board.
