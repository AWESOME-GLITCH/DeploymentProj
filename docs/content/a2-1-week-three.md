# A2.1 week three: take something back to a shop

LP-35 (LEA-27) · Learning Designer · 27 October 2026 · for QA Reviewer, then the board

One full week of A2.1 content authored on the lesson spine, shipped as data in `lib/learning-path/content.ts`. It is the first week written for the spine from a blank page rather than brought onto it, so it doubles as the worked example a content author or a model copies: the day map, the eight-item template, the modality split and the spacing are all reproducible from this document alone.

Sources: `docs/learning-model.md` §1.1 to §1.3 (the spine, the one-thing rule, the session), §4.6 rule 5 (the week shape), `docs/exercises.md` (the item verdicts and the modality target), `lib/learning-path/types.ts` (the schema) and the board note of 26 October.

## 1. The can-do and its criteria

| Field | Value |
| --- | --- |
| Outcome | `OUT-A2.1-INT-17` |
| Can-do, learner words | Can take something back to a shop |
| Strand | INT |
| Sub-level | A2.1 |
| CEFR descriptor | Transactions to obtain goods and services A2: can deal with common aspects of everyday living such as shopping, and can make a complaint |
| Prerequisite | `CRI-A2.1-INT-01-01`, the cafe's Could I have. The week reuses that frame and only adds what is new |

| # | Criterion | Descriptor | Taught on | Mastery rule |
| --- | --- | --- | --- | --- |
| 1 | `CRI-A2.1-INT-17-01` | Say what is wrong with it: this one doesn't work, or it is too small | Days 1 and 2 | `ai` |
| 2 | `CRI-A2.1-INT-17-02` | Ask them to change it for another one, and take what they offer | Day 3 | `ai` |
| 3 | `CRI-A2.1-INT-17-03` | Show the receipt and say when you bought it | Day 4 | `ai` |

All three are `ai` for the reason week two gives in `content.ts`: every atom's delayed check is a spoken say-it, and `complete_session` drops spoken attempts from a keyed sitting, so a keyed criterion could never pass a sitting on this spine.

Out of scope on purpose: asking for money back. It is a fourth criterion's worth of language (refund, exchange policy, proof of payment) and would break the one-new-thing-a-day rule. It belongs in week four.

## 2. The week map

One new thing a day (§1.1). Four of the five are language; day 5's is a sound on sentences the learner already says, which is what a performance day can afford.

| Day | Atom | Type | Criterion | The one new thing | Kind |
| --- | --- | --- | --- | --- | --- |
| 1 | `ATM-A2-INT-0021` It doesn't work | video | 17-01 | This one doesn't work. | phrase |
| 2 | `ATM-A2-INT-0022` Too small, too big | word tutorial | 17-01 | too plus an adjective | pattern |
| 3 | `ATM-A2-INT-0023` Could I change it? | video | 17-02 | Could I change it for a bigger one? | phrase |
| 4 | `ATM-A2-INT-0024` Here's the receipt | video | 17-03 | Here's the receipt. I bought it on Saturday. | phrase |
| 4 | `ATM-A2-INT-0025` Saturday jobs | practice, the use atom | 17-02 | nothing new, three strands interleaved | interleave |
| 5 | `ATM-A2-INT-0026` Back to the shop | practice, the performance | 17-03 | the problem word carries the stress | sound |

A story goes with the week: `STO-A2-0006` The big jacket, 98% known words, no items attached.

Why this shape: mastery learning needs a stated criterion and a performance against it (Bloom 1984), and interleaving on day 4 rather than another blocked day roughly doubles delayed test scores (Rohrer and Taylor 2007).

## 3. The spine, atom by atom

The six steps of §1.2 are scene, notice, say it with a response, say it again, use it, come back later. Days 1 to 4 carry all six. The two day-4-and-5 atoms are built from old material, and what they drop is listed with the reason.

| Atom | input | noticing | free_use (step 3) | controlled (step 4) | free_use (step 5) | check (delayed) |
| --- | --- | --- | --- | --- | --- | --- |
| 0021 | video 50 s | This one doesn't work. | 2101 | 2102, 2103, 2104, 2105 | 2106, 2107 | 2108 |
| 0022 | 4 word cards | too small, too big | 2201 | 2202, 2203, 2204, 2205 | 2206, 2207 | 2208 |
| 0023 | video 50 s | Could I change it for a bigger one? | 2301 | 2302, 2303, 2304, 2305 | 2306, 2307 | 2308 |
| 0024 | video 50 s | Here's the receipt. I bought it on Saturday. | 2401 | 2402, 2403, 2404, **2205**, 2405 | 2406, 2407 | 2408 |
| 0025 | video 35 s | none: nothing new is taught | 2501 | **2205**, 2502, **2305**, **ITM-INT-0105** | 2503, 2504 | 2505 |
| 0026 | none: the week's four scenes are the input | the sound, on known sentences | folded into the run-up, which opens on a spoken item | 2601, 2602, 2603 | 2604, 2605 | 2606 |

Items in bold come from an earlier atom. Item ids are `ITM-INT-` unless the table says otherwise; `2502` is `ITM-LST-2502` and `2504` is `ITM-MED-2504`.

The mic is live inside the first minute of every atom. In the five atoms with a scene, step 3 is a `dialogue_turn` with the coach, who answers what was said rather than marking it; in 0026 there is no scene to get through, so the first spoken item follows a 12-second notice. Step 4 is the fixed 80-second window, so four scaffolds get 20 seconds each.

## 4. The item template

Every teaching atom has the same eight items in the same order. A content author fills the template; nothing else needs deciding.

| # | Item type | Modality | Spine step | What the learner does |
| --- | --- | --- | --- | --- |
| 1 | `dialogue_turn` | spoken | 3, say it with a response | Says the target to the coach, who replies in character |
| 2 | `shadow` | spoken | 4 | Speaks along with the model, stress marked |
| 3 | `magnet_tiles` or `sentence_build` | cued | 4 | Builds the sentence, then says it. The only tap in the atom, and it hands straight to item 5 |
| 4 | `gap_fill` | recognition | 4 | One choice, on the single thing the attempt is likely to break |
| 5 | `read_aloud` | spoken | 4 | Says the whole sentence, with one word changed from the model |
| 6 | `dialogue_turn` | spoken | 5 | Answers an unexpected reply: the repair rehearsal |
| 7 | `roleplay` | spoken | 5 | The whole exchange, three turns, `need` 2 |
| 8 | `read_aloud` | spoken | 6, come back later | Produces the whole sentence again, a day later, in the session close |

`say_it_see_it` is not used anywhere in this week. Its scene renderer (`items.tsx`, `CafeScene`) only knows cafe ordering intents (item, quantity, size, bill), so a shop return would speak to an empty counter and `matchIntent` could never pass. `dialogue_turn` and `roleplay` are scene-free and keyword-judged, so they carry the spoken turns instead. Flagged for the dev gate, not worked around in content.

## 5. Spoken against recognition

Measured from `content.ts`, all 43 new items of the week.

| Modality | Items | Share | Target in `docs/exercises.md` |
| --- | --- | --- | --- |
| spoken | 35 | 81% | at least 50% |
| cued (tap, drag) | 4 | 9% | scaffold only |
| recognition | 4 | 9% | at most 15% |
| typed | 0 | 0% | WRT strands only, and this week is INT |

Per atom: days 1 to 4 are six spoken, one cued, one recognition each. The day-4 interleave and the day-5 performance are spoken only. Every cued item is immediately followed by a spoken item that says the sentence the tiles built, so no item in the week ends on a tap. Four recognition items in 43 is one per teaching atom, each one sitting on the single contrast likely to break the attempt: doesn't against don't, too against two, for after change it, and bought against buyed.

Retrieval practice and immediate feedback: production attempts, not re-reading, with a one-line why on a miss (Roediger and Karpicke 2006).

## 6. How the week comes back

Spacing is carried by the engine's half-life ladder; what the content decides is where the same sentence is met again inside a new situation (§1.1, spaced return).

| Target | First said | Returns in | And again in |
| --- | --- | --- | --- |
| This one doesn't work. | Day 1, step 3 | Day 1 close (delayed check) | Day 4 interleave as `ITM-INT-2501`, a different shop |
| too plus adjective | Day 2, step 3 | Day 2 close, then day 3's `2305` | Day 4 run-up (`2205` inside atom 0024), day 4 interleave, day 5 performance |
| Could I change it for a bigger one? | Day 3, step 3 | Day 3 close | Day 4 interleave (`2305` and `2503`), day 5 performance and close |
| Here's the receipt. I bought it on Saturday. | Day 4, step 3 | Day 4 close, and the interleave's check (`2505`) | Day 5 roleplay and teach-back |
| teen against ty (week one) | Week one | Day 4 interleave, `ITM-LST-2502` | The engine's recall echo |
| Could I have (week one) | Week one | Day 4 interleave, `ITM-INT-0105` | The engine's recall echo |

## 7. How the path reaches each atom

No date and no hard-coded week number: prerequisites hold the shape. `prerequisitesMet` (`engine.ts`) passes a criterion at Consolidating or better, which is level 2.

| Atom | `prerequisites` | Earliest day it can be served |
| --- | --- | --- |
| 0021 | `CRI-A2.1-INT-01-01` | Day 1, once the cafe is Known |
| 0022 | `CRI-A2.1-INT-01-01` | Day 2, once 0021 carries the already-served penalty |
| 0023 | `CRI-A2.1-INT-01-01` | Day 3 |
| 0024 | `CRI-A2.1-INT-01-01` | Day 4 |
| 0025 | `CRI-A2.1-INT-17-01` | Day 4, once day 2's delayed check has put 17-01 at Consolidating |
| 0026 | `CRI-A2.1-INT-17-02` | Day 5 |

The order inside the week is the authored order of `ATOMS` plus the minus 0.5 already-served penalty in `scoreNewAtoms`, which is how week one works. A same-week criterion chain was tried first and does not work: a criterion only reaches Consolidating after three correct retrievals across two days, so chaining 0022 behind 17-01 would hold day 2 empty. Prerequisites gate the two atoms that must not come early; the rest is the scorer.

### 7.1 What the five-day simulation found

Five days composed with `composeSession` against a learner who has week one at Known, each session answered correctly throughout, clock advanced a day at a time. Three engine problems came out of it. None is fixed here: `engine.ts` is not a file this ticket names, and all three are reproducible with week one's content too.

| # | Finding | Evidence from the run | Proposed fix | Owner |
| --- | --- | --- | --- | --- |
| 1 | A single-can-do week loses to strand balancing from day 2. The week bonus is 0.25 and the strand-deficit term is worth up to 0.30, so once the week's strand has had one day's work, any week-one atom in an untouched strand outscores the week's own next atom | Day 2 served `ATM-A2-GRM-0002` (score 1.01) ahead of `ATM-A2-INT-0022` (0.95), and day 3 served `ATM-A2-LST-0004` | Inside the week's can-do, strand balance is not the engine's business. Treat `deficit` as 1 for an atom whose criterion is in `week_can_do`. With that one line changed, the same run serves 0021, 0022 and 0023 on days 1, 2 and 3 | Dev |
| 2 | New content pauses on day 4 and stays paused. The recall echo serves 8 items a day, a session creates about 20, so the overdue count crosses the 25 cap on day 3 and never comes down | Day 4 reported 45 overdue, day 5 the same. Raising the echo to 16 changes nothing, because only 10 due items are eligible: `isRecallable` excludes `shadow`, `roleplay`, `relay` and `say_it_see_it`, which is most of a spoken week. Counting only recallable items still leaves 34 against the cap of 25 | Two parts. Count only items the echo can actually serve in the pause test, and schedule the chunk rather than every item: `Item.retrieves` is in `types.ts` and is read nowhere, so a run-up item that retrieves the atom's target sentence should credit that target instead of opening a schedule of its own. §0 of the learning model already calls the chunk the unit of scheduling | Dev, with me on the scheduling rule |
| 3 | `composeSession` hard-codes `ATM-A2-INT-0011` as the day-5 use atom, which is week one's cafe teach-it-back | Day 5 served the cafe performance to a learner who spent the week in a shop | Serve the performance atom of the week's own can-do, found through `week_can_do`, and exclude it from `LEARNING_ATOMS` the way 0011 and the fluency atom already are | Dev |

Finding 2 is the one the ticket was asking for: seventeen atoms were too few for the spacing to show itself, and at five weeks of content the review queue outgrows the only channel that drains it. It is a path problem, not a content problem, and the content should not be thinned to hide it.

Until the three are fixed the week still runs in order for days 1 to 3, and the prerequisites keep 0025 and 0026 at the end, so a learner meets the material in the right sequence through the new-atom slot.

## 8. Acceptance criteria, and where each is met

| # | Criterion | Where |
| --- | --- | --- |
| 1 | One can-do, 3 criteria, 5 to 7 atoms, about 8 items per atom | §1 and §2. Six atoms; 8, 8, 8, 8, 8 and 6 items served, 43 new items |
| 2 | Every atom follows the spine | §3. Days 1 to 4 carry all six steps. 0025 drops `noticing` and 0026 drops `input`, each with the reason in the table, because neither teaches new language |
| 3 | Every item ends in production; taps only as a run-up; state the split | §4 and §5. 81% spoken, 9% recognition, every cued item followed by the spoken item that says what it built |
| 4 | Day 4 interleaves earlier atoms, day 5 is a free-use performance | §2 and §3. 0025 serves four criteria across three strands, two of them from week one; 0026 is four unaided turns plus a teach-back |
| 5 | One new thing a day | §2. Phrase, pattern, phrase, phrase, sound |
| 6 | Typed against `types.ts`, `npx tsc --noEmit` clean | Clean, with `CI=1 npx next build` also clean. No change to `types.ts` was needed |
| 7 | Lesson copy in English, L1 for interface and captions only | Every `stem`, `key`, `options`, roleplay turn and scene line is English. L1 appears only in `can_do`, `descriptor`, atom `title`, `l1_card`, the `noticing` why, the word-card meanings and the item `why`, which are the caption and interface surfaces |

## 9. Principles used, one line each

| Principle | Used for | Source |
| --- | --- | --- |
| Comprehensible input first | The scene teaches the phrase before any item asks for it | Krashen 1982, and the board note of 26 October |
| Generation effect and productive failure | Step 3 comes before the scaffolds: the learner tries, then the run-up repairs | Bjork 1994; Kapur 2008 |
| Retrieval practice | Every item is a production attempt, not a re-reading | Roediger and Karpicke 2006 |
| Spacing | The same sentence returns on days 1, 2, 4 and 5 inside different situations | Cepeda et al. 2006 |
| Interleaving | Day 4 mixes three strands and four criteria in one session | Rohrer and Taylor 2007 |
| Immediate, non-judgemental feedback | One-line why on a miss, the model said slowly, one more try. No score, no cross | Hattie and Timperley 2007 |
| Mastery learning | One can-do a week, closed by a performance against it | Bloom 1984 |
