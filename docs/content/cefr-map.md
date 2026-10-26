# CEFR map: every atom and item

Owner: CEFR Content Lead. Status: audit complete, LEA-42, 26 October 2026. Source of truth for levels is this file plus `ITEM_CEFR` in `lib/learning-path/content.ts`, which carries the same level and descriptor in the data.

## How the levels were decided

| Dimension | Source | How it was applied |
| --- | --- | --- |
| Function and task | CEFR Companion Volume 2020 descriptor scales | Each outcome, criterion and item is tied to one named scale and band, for example "Transactions to obtain goods and services A2". Mediation items use the mediation scales, not reading or speaking |
| Grammar | British Council and EAQUALS Core Inventory for General English | The band where the form is first taught: plural s and present of be A1, countable and uncountable with some, past simple, will and modal requests A2, second conditional and defining relatives B1, non-defining relatives B2 |
| Vocabulary and phrases | English Vocabulary Profile | Every content word checked at A1 or A2 for the first week. Two chunks sit above band and are kept on purpose, noted below |
| Level of an item | The lower of the two | An item is at the band of its hardest necessary element. An item whose language is A1 is recorded as A1 even inside an A2.1 atom, because the first controlled item after the input deliberately recycles the input |

Three structural decisions, stated so they can be argued with:

1. **Atoms keep their sub-level; items carry their own.** A2.1 atoms legitimately open one band low. What is not legitimate is the band-low item sitting in the `check` phase, where mastery is decided. Five of the ten delayed checks were below their criterion and are fixed.
2. **"Not given" is gone as a learner-facing word.** It is an exam construct, not language. The third option is now "It does not say", which an A2 reader can read. The item type, the key and the three-way shape are untouched, so the renderer and the Learning Designer's pending cut list are unaffected.
3. **Nothing above B1 was added.** Launch content is Pre-A1 to B1 (PRD line 17). The one B2.1 placement item stays as a ceiling probe, because a top band cannot be confirmed without an item above it, and a learner who passes it is still placed at B1.2.

## What was mislevelled, and why

The headline list. Everything else was in band.

| # | What | Claimed | Actually | Why it was wrong | Fixed by |
| --- | --- | --- | --- | --- | --- |
| 1 | `ITM-WRT-0701`, `0703`, `0705`, the whole item spine of the A2.1 writing atom | A2.1 | A1.1 | "Where are you?", "Are you OK?" are question inversion with be, Core Inventory A1. The atom's criterion is a two-line message, which is A2. Every item, including the delayed check, sat two bands below its own criterion | Items raised to message level and to present continuous for an arrangement ("Are you coming?"), which is Core Inventory A2. The video is not changed; see flag F1 |
| 2 | `ITM-MED-0801`, `0805` | A2.1 | A1.1 | "What is the bill for? Gas / Water / Internet" after a recording opening "This is your gas bill" is word spotting. `0805` quoted the answer back verbatim | `0801` now asks what the flatmate must do. `0805` needs website mapped onto internet, which is Processing text in speech A2 |
| 3 | "Please pay by thirty May" | n/a | wrong English | British English speaks a date as "the thirtieth of May". Written "Pay by 30 May" is right and is kept, so the notice and the noticing highlight are unchanged | Audio and the caption of the video line say "by the thirtieth of May" |
| 4 | `ITM-INT-0102` options Could / Want / Give | A2.1 | unanswerable | "Want I have a tea" is not a form any learner produces, so there was one option, not three. The politeness contrast cannot be a gap: "Can I have a tea" is also correct English | The gap moved to the verb after the modal: Could I ___ a tea, with have / having / to have. One target, three real learner errors, Core Inventory A2 |
| 5 | `ITM-GRM-0206` distractor "coffeys" | A2.1 | nonsense | No learner writes "coffeys". The real error is the apostrophe plural | Options are now coffees / coffee / coffee's |
| 6 | `ITM-GRM-0202` distractor "a" | A2.1 | two correct answers | "A water, please" is ordinary spoken British English in a cafe, so "a" was not wrong | Options are now some / many / a few, which are wrong with an uncountable noun and are the errors learners make |
| 7 | `ITM-LST-0401` audio "Platform fourteen, not four" | A2.1 | two answers in the stimulus | The audio named two of the three options. The item tested memory of the word "not", not the teen and ty contrast | Audio is a real announcement with one number in it |
| 8 | `ITM-INT-0106`, the delayed check for the cafe criterion | A2.1 | A1.2, and ambiguous | "I'd ___ a coffee" with like / want / have: "I'd have a coffee" is correct English. The one item that decides mastery had two answers and tested the band below | The check is now the A2.1 extension, number plus size plus plural noun |
| 9 | `ITM-RDG-0604` "Escalator rules" | A2.1 | B1 vocabulary | "escalator" is B1 in the English Vocabulary Profile and "rules" as a heading is an exam task. A learner picks a title in no real situation | Reframed as what the notice is about, with A1 and A2 words only |
| 10 | `PLC-07`, the B1.2 placement item | B1.2 | B2 | "push back" for postpone is not in the English Vocabulary Profile below B2. A learner at B1.2 would fail it and be placed a band low | Audio now uses "put the meeting off", which is B1 |
| 11 | `CKP-06`, the B1.1 checkpoint item | B1.1 | B2 | Same fault: "get back to you" is a B2 phrase | Audio now uses "let you know", which is B1 |
| 12 | `CKP-01`, the A2.1 checkpoint item | A2.1 | A1.2 | "___ like a tea" with I'd / I / Me tested the contraction, which is A1, and the checkpoint is what moves a learner's band | Now a choice between I'd like, I want and Give me with quantity and size, which is Sociolinguistic appropriateness A2 |
| 13 | `CKP-05`, the A2.2 checkpoint item | A2.2 | A2.1 | Past simple of a regular verb is what A2.1 teaches, so it could not discriminate A2.2 | Now an irregular past (found), which is the A2.2 step |
| 14 | The placement cut score | n/a | not defensible | The level was the highest band answered correctly. One lucky tap on a three-option item, a one in three chance, set the learner's whole path | `placementLevel()` in `content.ts`, the staircase rule below |
| 15 | `ITM-INT-0903` distractors | A2.1 | implausible | "Oat milk is free" is not a reading anyone would make of "we're out of oat milk" | Both distractors are now plausible readings: in the fridge, costs more |
| 16 | `ITM-MED-0803` distractor "bus" | A2.1 | implausible | A bus number on a gas bill | Now account, which is what a bill really carries |
| 17 | Currency | n/a | incoherent | "seventeen dirhams" in one item of the listening atom and "three pounds fifty" in the next, both cafe prices | Pounds throughout the week |
| 18 | `STO-A2-0001`, the Monday story | A2.1 | out of order | Fatima paid by card and then asked for the bill | Order fixed, and the price was added so the story carries the £ the listening atom teaches |
| 19 | `STO-A2-0003`, Amira is late | A2.1 | B1 grammar in a 98% known words story | "Platform forty was closed" is the passive, which is B1 | "There was a problem at platform forty", which is A2 |
| 20 | `CRI-A2.1-RDG-04-01` descriptor | A2.1 | not a can-do | "True, false or not given on a short notice" describes a test format, so nothing in the strand could be checked against the CEFR | "Find the rule in a short notice and say what you can and cannot do" |
| 21 | `CRI-A2.1-LST-03-01` type | `communicative` | pronunciation | Hearing fourteen against forty is Phonological control. The field is cosmetic for the engine, which reads only `mastery_rule` and `prerequisites`, but it mislabelled the strand's one phonology criterion | `type: "pronunciation"` |

Two chunks are deliberately kept above band, which the CEFR allows when the lexis is what the task needs and it is taught as a fixed chunk: **reference number** (`ITM-MED-0803`) and **priority seat** (`ITM-RDG-0606`). Both are survival vocabulary for the exact situation and both are glossed in the word tutorial before they are tested.

## Level labels the UI should show

Plain words, British English, no sub-level arithmetic in front of the learner. In the data as `SUBLEVEL_PLAIN` in `content.ts`.

| Sub-level | Band label | Step |
| --- | --- | --- |
| PreA1.1, PreA1.2 | Pre-A1 · First words | First half, Second half |
| A1.1, A1.2 | A1 · Beginner | First half, Second half |
| A2.1, A2.2 | A2 · Elementary | First half, Second half |
| B1.1, B1.2 | B1 · Intermediate | First half, Second half |
| B2.1, B2.2 | B2 · Upper intermediate | First half, Second half |
| C1.1, C1.2 | C1 · Advanced | First half, Second half |
| C2 | C2 · Fluent | n/a |

How to use it: the badge shows the band label only ("A2 · Elementary"). The step belongs on the progress page, next to the road, where there is room for a second line. `CEFR_LABEL` in `i18n.ts` currently prints the raw code "A2.1", which is the only level string a learner sees today; swapping it for `SUBLEVEL_PLAIN[level].band` is a one-line change in a file I do not own, raised as flag F3.

## Outcomes

All eight were in band. Two descriptors were sharpened; the sub-level fields are unchanged.

| Outcome | Sub-level | Companion Volume scale and band | Verdict |
| --- | --- | --- | --- |
| OUT-A2.1-INT-01 Can order food and drink in a cafe | A2.1 | Transactions to obtain goods and services A2, "can order a meal" | In band |
| OUT-A2.1-GRM-02 Can say how much and how many | A2.1 | Grammatical accuracy A2, with Core Inventory countable and uncountable at A2 | In band. The Companion Volume has no grammar scales, so grammar outcomes map to accuracy plus the Core Inventory |
| OUT-A2.1-LST-03 Can understand numbers, prices and platform announcements | A2.1 | Understanding announcements and instructions A2, "can catch the main point in short, clear, simple messages and announcements" | In band |
| OUT-A1.2-SPK-03 Can describe myself, where I live and what I do | A1.2 | Sustained monologue, describing experience A1, "can describe him or herself, what he or she does and where he or she lives" | In band, and the only atom in the week whose items were all correctly levelled |
| OUT-A2.1-RDG-04 Can understand short notices and signs | A2.1 | Reading instructions A2, "can understand regulations expressed in simple language" | In band |
| OUT-A2.1-WRT-05 Can write a short message to a colleague | A2.1 | Correspondence A2, "can write short simple notes and messages on matters of immediate need" | In band. Its items were not; see finding 1 |
| OUT-A2.1-MED-06 Can tell a friend the key points of a simple notice | A2.1 | Relaying specific information in speech A2 | In band |
| OUT-A2.1-GRM-07 Can talk about yesterday, today and tomorrow | A2.1 | Grammatical accuracy A2, with Core Inventory past simple and will at A2 | In band |

## Criteria

| Criterion | Band | Descriptor it now carries | Change |
| --- | --- | --- | --- |
| CRI-A2.1-INT-01-01 | A2.1 | Order politely with Could I have, and say how many and what size | Rewritten. "I'd like" alone is Core Inventory A1, so the criterion now names the A2 part, which is the modal request and the expanded noun phrase |
| CRI-A2.1-INT-01-02 | A2.1 | Understand that something is not available and ask for an alternative with instead | Rewritten to name both halves, because the delayed check tests the first half |
| CRI-A2.1-INT-01-03 | A2.1 | Ask for the bill and say how you will pay | Rewritten. "and pay" is not observable language; saying how you will pay is |
| CRI-A2.1-GRM-02-01 | A2.1 | Choose a number plus plural s for things you can count, and some for things you cannot | Rewritten in plain words, and it now names the contrast rather than the grammar label |
| CRI-A2.1-LST-03-01 | A2.1 | Catch the number in a short announcement or price, including fourteen against forty | Rewritten, and `type` corrected to `pronunciation`. The old descriptor was a single minimal pair, which is narrower than the outcome it serves |
| CRI-A1.2-SPK-03-01 | A1.2 | Three to five connected sentences with I am, I live, I work | Unchanged. Correct as written |
| CRI-A2.1-RDG-04-01 | A2.1 | Find the rule in a short notice and say what you can and cannot do | Rewritten, finding 20 |
| CRI-A2.1-WRT-05-01 | A2.1 | A two-line message that asks a question and gives a reason | A reason added. A bare question is A1; the second line is what makes the message A2 |
| CRI-A2.1-MED-06-01 | A2.1 | Tell someone the three things they must do | Unchanged. Correct, and it is the cleanest mediation criterion in the set |
| CRI-A2.1-GRM-07-01 | A2.1 | Match the time word to the verb: worked, work, will work | Rewritten. "Past, present and future of regular verbs" named three targets for one criterion |

## Atoms

Sub-level fields are unchanged. The "input band" column is the band of the language in the video or word cards, which is what the learner meets first.

| Atom | Sub-level | Input band | Criterion | Verdict and change |
| --- | --- | --- | --- | --- |
| ATM-A2-INT-0001 At the cafe | A2.1 | A1.2 | INT-01-01 | Input is one band low by design, which is right for the first atom of the week. Items 2, 3 and 6 raised to A2.1 so the atom does not end below its criterion |
| ATM-A2-GRM-0002 Two coffees, some water | A2.1 | A2.1 | GRM-02-01 | Word cards in band. Item 1 now carries the countable and uncountable contrast in one sentence, items 2 and 6 had distractor faults |
| ATM-A2-LST-0004 Platform 4, not 14 | A2.1 | A2.1 | LST-03-01 | In band. Item 1 had two answers in the audio, item 4 changed currency mid-atom |
| ATM-A1-SPK-0005 Meet Fatima | A1.2 | A1.2 | SPK-03-01 | Correct throughout. No change |
| ATM-A2-RDG-0006 Metro notices | A2.1 | A2.1 | RDG-04-01 | In band. "Not given" replaced with "It does not say" on three items, and the heading item reframed out of B1 vocabulary |
| ATM-A2-WRT-0007 Where are you? | A2.1 | A1.1 | WRT-05-01 | The gap of the audit, finding 1. The four word cards are A1.1 chunks. Items raised; the video needs a re-cut, flag F1 |
| ATM-A2-MED-0008 The gas bill | A2.1 | A2.1 | MED-06-01 | In band once the spoken date is corrected. Items 1 and 5 raised out of word spotting |
| ATM-A2-INT-0009 We're out of oat milk | A2.1 | A2.1 | INT-01-02 | In band. One distractor set rebuilt |
| ATM-A2-GRM-0003 Yesterday, today, tomorrow | A2.1 | A2.1 | GRM-07-01 | In band. "will work" for a future arrangement is Core Inventory A2 and is kept. One collocation fixed: worked **in the shop**, not "at home", which also ties the item to Fatima's atom |
| ATM-A2-INT-0010 The bill, please | A2.1 | A2.1 | INT-01-03 | In band, and the only atom whose word cards are all A2 functional chunks. No change |
| ATM-A2-INT-0011 Teach it back | A2.1 | n/a | INT-01-01 | In band. Relaying specific information in speech A2 |
| ATM-A2-FLU-0001 Fluency | A2.1 | n/a | INT-01-01 | In band. Fluency A2 over known material |
| STO-A2-0001 Monday at the cafe | A2.1 | A2.1 | INT-01-01 | Order of events fixed, finding 18 |
| STO-A2-0002 Platform fourteen | A2.1 | A2.1 | LST-03-01 | In band. No change |
| STO-A2-0003 Amira is late | A2.1 | A2.1 | WRT-05-01 | Passive removed, finding 19 |

## Items

`Claimed` is the sub-level of the atom the item sits in. `Actual` is the band recorded in `ITEM_CEFR` after the audit. Descriptors are shortened here; the full string is in the data.

### ATM-A2-INT-0001 At the cafe

| Item | Claimed | Actual | Descriptor | Change |
| --- | --- | --- | --- | --- |
| ITM-INT-0101 tap_order | A2.1 | A1.2 | Transactions A1, can ask people for things | None. Recycles the input on purpose, first controlled item |
| ITM-INT-0102 gap_fill | A2.1 | A2.1 | Linguistic range A2, modal plus plain verb | Rebuilt, finding 4 |
| ITM-INT-0103 pick_picture | A2.1 | A2.1 | Understanding an interlocutor A2, quantity and size | Audio and labels now carry number plus size, so the item is about English and not about counting glyphs. The emoji visual is the Learning Designer's cut, flag F2 |
| ITM-INT-0104 transform | A2.1 | A2.1 | Sociolinguistic appropriateness A2 | None. The strongest item in the atom |
| ITM-INT-0105 say_it_see_it | A2.1 | A2.1 | Transactions A2, can order a drink | None |
| ITM-INT-0106 gap_fill, check | A2.1 | A2.1 | Grammatical accuracy A2, number plus size plus plural | Rebuilt, finding 8 |

### ATM-A2-GRM-0002 Two coffees, some water

| Item | Claimed | Actual | Descriptor | Change |
| --- | --- | --- | --- | --- |
| ITM-GRM-0201 magnet_tiles | A2.1 | A2.1 | Accuracy A2, both noun types in one phrase | Key is now "I'd like two coffees and some water", so the contrast is the target rather than the plural alone. Also the sentence the fluency item reuses |
| ITM-GRM-0202 gap_fill | A2.1 | A2.1 | Accuracy A2, some with an uncountable noun | Distractors rebuilt, finding 6 |
| ITM-GRM-0203 error_spot | A2.1 | A2.1 | Accuracy A2, number with an uncountable noun | None |
| ITM-GRM-0204 magnet_tiles | A2.1 | A2.1 | Transactions A2 plus accuracy A2 | None |
| ITM-GRM-0205 say_it_see_it | A2.1 | A2.1 | Transactions A2, asks for an uncountable item | None |
| ITM-GRM-0206 gap_fill, check | A2.1 | A1.2 | Orthographic control A1 to A2, plural s | Distractor rebuilt, finding 5. Stays at A1.2: the plural spelling is A1, and it is honest for the check to carry the contrast through the stem |

### ATM-A2-LST-0004 Platform 4, not 14

| Item | Claimed | Actual | Descriptor | Change |
| --- | --- | --- | --- | --- |
| ITM-LST-0401 pick_picture | A2.1 | A2.1 | Announcements A2, catches the number | Audio rebuilt, finding 7 |
| ITM-LST-0402 dictation | A2.1 | A2.1 | Announcements A2, writes a price down | None. Writing a price you heard is the real act |
| ITM-LST-0403 detail_gap | A2.1 | A2.1 | Announcements A2, clock time | None |
| ITM-LST-0404 pick_picture | A2.1 | A2.1 | Understanding an interlocutor A2, total price | Dirhams to pounds, and a basket that makes £17 plausible, finding 17 |
| ITM-LST-0405 read_aloud | A2.1 | A2.1 | Phonological control A2, word stress | None |
| ITM-LST-0406 pick_picture, check | A2.1 | A2.1 | Announcements A2, tens against teens | None |

### ATM-A1-SPK-0005 Meet Fatima

| Item | Claimed | Actual | Descriptor | Change |
| --- | --- | --- | --- | --- |
| ITM-SPK-0501 shadow | A1.2 | A1.2 | Phonological control A1 | None |
| ITM-SPK-0502 gap_fill | A1.2 | A1.1 | Accuracy A1, present simple with I | None. Building block, correctly placed in the controlled phase |
| ITM-SPK-0503 tap_order | A1.2 | A1.2 | Describing experience A1, job | None |
| ITM-SPK-0504 read_aloud | A1.2 | A1.2 | Describing experience A1, three facts | None |
| ITM-SPK-0505 open_response | A1.2 | A1.2 | Describing experience A1, the full descriptor | None. This item is the outcome |
| ITM-SPK-0506 gap_fill, check | A1.2 | A1.1 | Accuracy A1, live in | None. The one check below its atom that is defensible, because the preposition is the error that survives at A1.2 |

### ATM-A2-RDG-0006 Metro notices

| Item | Claimed | Actual | Descriptor | Change |
| --- | --- | --- | --- | --- |
| ITM-RDG-0601 tfng | A2.1 | A2.1 | Reading instructions A2, regulations | Third option in plain words |
| ITM-RDG-0602 tfng | A2.1 | A2.1 | Reading instructions A2, applies a prohibition | Third option in plain words |
| ITM-RDG-0603 tfng | A2.1 | A2.2 | Reading for orientation A2, information absent | Stem rewritten so that "It does not say" is a natural answer, not an exam label. Recorded at A2.2: deciding that a text does not carry something is the hardest of the three |
| ITM-RDG-0604 heading_match | A2.1 | A2.1 | Reading for orientation A2 | Reframed, finding 9 |
| ITM-RDG-0605 relay | A2.1 | A2.1 | Relaying specific information in speech A2 | None |
| ITM-RDG-0606 tfng, check | A2.1 | A2.1 | Reading instructions A2, a request on a sign | Third option in plain words |

### ATM-A2-WRT-0007 Where are you?

| Item | Claimed | Actual | Descriptor | Change |
| --- | --- | --- | --- | --- |
| ITM-WRT-0701 sentence_build | A2.1 | A2.1 | Coherence and cohesion A2, greeting then question | Was "Where are you", three tiles, A1.1. Now builds the message: "Hi Amira. Where are you?" |
| ITM-WRT-0702 correct_message | A2.1 | A1.2 | Accuracy A2, corrects word order | None. One error, one fix, and word order in questions is the error that persists into A2 |
| ITM-WRT-0703 gap_fill | A2.1 | A2.1 | Accuracy A2, present continuous for an arrangement | Was "___ you OK?" with be, A1.1. Now "I'm at the cafe. ___ you coming?", which is the A2 form and keeps the same three-way be and do contrast |
| ITM-WRT-0704 short_production | A2.1 | A2.1 | Correspondence A2, short notes and messages | Task now asks for the question **and** the reason, and `min_words` is 8, so a one-line answer cannot pass. Both variants updated |
| ITM-WRT-0705 tap_order, check | A2.1 | A2.1 | Accuracy A2, are plus ing plus place | Was "Are you OK", A1.1, deciding mastery of an A2.1 criterion. Now "Are you coming to the cafe?" |

### ATM-A2-MED-0008 The gas bill

| Item | Claimed | Actual | Descriptor | Change |
| --- | --- | --- | --- | --- |
| ITM-MED-0801 gist_mcq | A2.1 | A2.1 | Processing text in speech A2, the obligation | Rebuilt, finding 2. Also carries the corrected spoken date |
| ITM-MED-0802 detail_gap | A2.1 | A2.1 | Announcements A2, a date said once | Audio corrected to "by the thirtieth of May", finding 3. Written stem keeps "by 30 May" |
| ITM-MED-0803 gap_fill | A2.1 | A2.1 | Relaying specific information A2, which number | Distractor rebuilt, finding 16. "reference number" is kept above band as a taught chunk |
| ITM-MED-0804 relay | A2.1 | A2.1 | Relaying specific information in speech A2, the full descriptor | None. This item is the outcome |
| ITM-MED-0805 gist_mcq, check | A2.1 | A2.2 | Processing text in speech A2, maps website onto internet | Rebuilt, finding 2. Recorded at A2.2 because it needs a paraphrase, and the facts of the bill are unchanged so the check is still the same bill |

### ATM-A2-INT-0009 We're out of oat milk

| Item | Claimed | Actual | Descriptor | Change |
| --- | --- | --- | --- | --- |
| ITM-INT-0901 gap_fill | A2.1 | A2.1 | Transactions A2, asks for an alternative | None. "instead" is A2 in the English Vocabulary Profile and end position is the target |
| ITM-INT-0902 tap_order | A2.1 | A1.2 | Sociolinguistic appropriateness A2, accepts politely | None. Short fixed chunk, right place in the atom |
| ITM-INT-0903 inference_mcq | A2.1 | A2.1 | Identifying cues and inferring A2 | Distractors rebuilt, finding 15 |
| ITM-INT-0904 roleplay | A2.1 | A2.1 | Transactions A2, settles an alternative over three turns | None. This item is the outcome |
| ITM-INT-0905 gap_fill, check | A2.1 | A2.1 | Understanding an interlocutor A2, hears that an item is unavailable | None. It checks the first half of the criterion, which the rewritten criterion descriptor now names |

### ATM-A2-GRM-0003 Yesterday, today, tomorrow

| Item | Claimed | Actual | Descriptor | Change |
| --- | --- | --- | --- | --- |
| ITM-GRM-0301 time_slider | A2.1 | A2.1 | Accuracy A2, time word chooses the form | None to the language. The screen itself is cut by the Learning Designer, flag F2 |
| ITM-GRM-0302 gap_fill | A2.1 | A2.1 | Accuracy A2, past simple regular | "at home" to "in the shop": British English is "worked from home", and the shop ties the item to Fatima |
| ITM-GRM-0303 magnet_tiles | A2.1 | A2.1 | Accuracy A2, will for a future arrangement | None |
| ITM-GRM-0304 open_response | A2.1 | A2.1 | Describing experience A2, did and will do | None |
| ITM-GRM-0305 gap_fill, check | A2.1 | A2.1 | Accuracy A2, will plus plain verb | None. In band, and the check matches the criterion |

### ATM-A2-INT-0010 The bill, please

| Item | Claimed | Actual | Descriptor | Change |
| --- | --- | --- | --- | --- |
| ITM-INT-1001 tap_order | A2.1 | A2.1 | Transactions A2, asks for the bill | None |
| ITM-INT-1002 gap_fill | A2.1 | A2.1 | Transactions A2, pay by card | None. "pay by" against "pay in cash" is the A2 collocation pair |
| ITM-INT-1003 pick_picture | A2.1 | A1.2 | Understanding an interlocutor A2, card against cash | None to the language. Emoji visual is a cut, flag F2 |
| ITM-INT-1004 say_it_see_it | A2.1 | A2.1 | Transactions A2, asks for the bill in the scene | None |
| ITM-INT-1005 gap_fill, check | A2.1 | A2.1 | Announcements A2, bill in a minimal pair set | None. bill, bell, ball is a real A2 listening discrimination |

### Day 5 and the second session

| Item | Claimed | Actual | Descriptor | Change |
| --- | --- | --- | --- | --- |
| ITM-TEACH-0001 open_response | A2.1 | A2.1 | Relaying specific information in speech A2 | None. Targets already name the five chunks of the week |
| ITM-VOTE-0001 vote_see_revote | A2.1 | A2.1 | Sociolinguistic appropriateness A2 | None to the language. The item type is cut, flag F2 |
| ITM-FLU-0001 read_aloud | A2.1 | A2.1 | Fluency A2 | None. Its model is now exactly the sentence ITM-GRM-0201 builds |
| ITM-FLU-0002 read_aloud | A2.1 | A1.2 | Fluency A1 to A2 | None. A1.2 material under time pressure is the right fluency load in week one |

## The first week as an A2.1 slice

The board asked whether the week holds together. It does, with one caveat.

| Day | Atom | Band | What the learner can do that they could not on the day before |
| --- | --- | --- | --- |
| 1 | At the cafe, Meet Fatima | A2.1 on an A1.2 base | Order one thing politely, and say who they are |
| 2 | Two coffees some water, Platform 4 not 14 | A2.1 | Say how many and how much, and catch the number said back to them |
| 3 | Metro notices, Where are you? | A2.1 | Read a notice and send a two-line message about it |
| 4 | The gas bill, We're out of oat milk | A2.1 | Pass a bill's three facts to someone else, and settle an alternative when the answer is no |
| 5 | Yesterday today tomorrow, The bill please, Teach it back | A2.1 | Place all of it in time, pay, and teach the routine to someone else |

Every band in the week is A2.1 except the two A1.2 atoms that feed it, which is the shape the Companion Volume implies: one band of consolidation under the band being taught. The grammar is a coherent A2 set from the Core Inventory, countable and uncountable with some, modal requests, present continuous for arrangements, past simple regular and will, and no form appears before the atom that teaches it.

**The caveat, and it is not mine to fix.** The week is set in two cities. The cafe, the gas bill and "Where are you" are London, including Shoreditch and now pounds throughout. The metro, Fatima and Yusuf are Dubai and Riyadh. Pounds in a Dubai Metro station is the visible seam. Platform fourteen also implies a mainline station rather than a metro. My recommendation is to re-set the listening atom in London, which is a one-line change to the presenter and the first caption, but the scene title and the Remotion composition for that atom carry the same words and both belong to other agents. Raised as flag F4 rather than edited across the line.

## Placement and the cut score

Eight items, one per band, Pre-A1 to B1 plus a B2.1 ceiling probe. The ladder is monotone by level, which the adaptive walk in `Onboarding.tsx` depends on, so no item was added or re-ordered.

| Item | Band | What it tests | Descriptor | Change |
| --- | --- | --- | --- | --- |
| PLC-01 | PreA1.1 | A very frequent word said slowly | Reception Pre-A1 | None. Keeps its glyphs: placement runs with no mic and no feedback, so the picture is the only thing there is to pick |
| PLC-02 | A1.1 | Present of be with I | Accuracy A1 | None |
| PLC-03 | A1.2 | Where someone works, third person | Understanding conversation A1 | None |
| PLC-04 | A2.1 | Past simple with a past time marker | Accuracy A2 | None. "went" is A1 as a word and A2 as a form in the Core Inventory, so it discriminates at A2.1 |
| PLC-05 | A2.2 | A claim checked against opening times | Reading instructions A2 | Third option in plain words |
| PLC-06 | B1.1 | Second conditional | Linguistic range B1 | None |
| PLC-07 | B1.2 | Inferring a postponement | Identifying cues and inferring B1 | Audio rebuilt, finding 10 |
| PLC-08 | B2.1 | Non-defining relative clause | Accuracy B2 | None. Kept on purpose as a ceiling probe: B1.2 cannot be confirmed without an item above it. A learner who passes it is still placed at B1.2, the top of launch content |

### The rule

`placementLevel(answers)` in `content.ts`. In words:

1. Sort the items the learner actually saw by band.
2. Walk up from the lowest. The **staircase top** is the highest band answered correctly with no miss below it.
3. The staircase top counts only if a **second** correct answer sits at or below it. Otherwise step one band down.
4. If the lowest band administered was missed, place one band below the lowest band they did answer correctly.
5. No correct answer at all means PreA1.1 and a welcome atom. There is no fail state and no retake prompt.
6. Cap at B1.2, the top of the launch content.

Why this is defensible: with three options, a single correct answer carries a one in three chance of being a guess, so a lone correct answer at a band is not evidence of that band. Two adjacent correct answers bring that to about one in nine. Stepping down one band on thin evidence costs the learner a few minutes of easy material, which the scheduler clears quickly, where stepping up one band on a guess costs them the lesson. The engine already re-tests the placed band with provisional items in the first sessions, so the rule only has to land within one band, and this one does by construction.

Worked examples, run against the implementation:

| Answers | Placed | Why |
| --- | --- | --- |
| A1.2 ✓, A2.1 ✓, A2.2 ✗, B1.1 ✗ | A2.1 | Staircase top A2.1, supported by A1.2 |
| A1.1 ✓, A1.2 ✗ | PreA1.2 | One correct answer, nothing supporting it, so one band down |
| A1.1 ✗, A1.2 ✓ | A1.1 | Missed the lowest band administered, so one band below the correct one |
| Everything correct to B2.1 | B1.2 | Capped at the launch ceiling |
| Nothing correct | PreA1.1 | Welcome atom, no fail state |

`Onboarding.tsx` still computes the level with its own line, `SUBLEVELS[Math.max(...correct)]`, which is the rule finding 14 rejects. Swapping it for `placementLevel(list)` is a one-line change in a file I do not own. Raised as flag F3.

## Checkpoint

Six items, scores only, no mic, by product rule. Recognition is correct here and only here.

| Item | Band | Descriptor | Change |
| --- | --- | --- | --- |
| CKP-01 | A2.1 | Sociolinguistic appropriateness A2, polite order with quantity and size | Rebuilt, finding 12 |
| CKP-02 | A2.1 | Announcements A2, teen against ty | None. Keeps its glyphs, same reason as PLC-01 |
| CKP-03 | A2.1 | Accuracy A2, some with an uncountable noun | None |
| CKP-04 | A2.2 | Reading instructions A2, a two-part rule | Third option in plain words |
| CKP-05 | A2.2 | Accuracy A2, past simple irregular | Rebuilt, finding 13 |
| CKP-06 | B1.1 | Identifying cues and inferring B1 | Audio rebuilt, finding 11 |

The checkpoint covers GRM, LST, RDG and INT. It has no WRT, SPK or MED item, which is a consequence of the no-mic rule rather than an oversight, and it means a checkpoint cannot move a learner's band in the three strands the week works hardest on. Recorded as flag F5 rather than fixed, because fixing it means either a typed checkpoint item or a product rule change.

## Flags for other owners

| # | What | Who | Why it is not in this change |
| --- | --- | --- | --- |
| F1 | `ATM-A2-WRT-0007` teaches A1.1 chunks as the input for an A2.1 outcome. The items now carry the A2.1 work, so the learner meets "Are you coming?" for the first time in a controlled item rather than in the video, which breaks comprehensible input first | Front-end Builder and the explainer owner, with the board | The composition `explainer/ATM_A2_WRT_0007.tsx` is built frame by frame around the four old chunks, and `scenes.tsx` mirrors the captions index for index. A fifth word card, "Are you coming?", fixes it, and that is a video ticket |
| F2 | Items whose language is now in band but whose screen is already cut by `docs/exercises.md` part 2: `ITM-INT-0103` and `ITM-INT-1003` emoji pictures, `ITM-GRM-0301` time slider, `ITM-VOTE-0001` | Learning Designer | Every id, type, key and phase reference is unchanged by this audit, so part 2 applies on top without a conflict. I have levelled the language and left the screens alone |
| F3 | `Onboarding.tsx` should call `placementLevel()`, and `i18n.ts` `CEFR_LABEL` should print `SUBLEVEL_PLAIN[level].band` | Front-end Builder | Two one-line changes in files this ticket does not name |
| F4 | The week is set in two cities and the seam is now visible, because the currency is consistent | UX Designer or the board | The listening atom's presenter, caption, scene title and Remotion composition all say Dubai, and three of the four are other agents' files |
| F5 | The checkpoint cannot move a learner's band in WRT, SPK or MED | Product Lead | Needs either a typed checkpoint item or a change to the no-mic product rule |
| F6 | Five of ten delayed checks were below their criterion before this audit. The pattern, not the five items, is the risk: `check` phases were built by copying a `gap_fill` from the controlled phase | Learning Designer, and whoever writes the next week | Fixed here for week one. `docs/exercises.md` already proposes replacing every check with a spoken say-it, which would also prevent it |

## Verification

`npx tsc --noEmit` clean after every edit. Every item id, criterion id, outcome id, atom id, item type, `key` shape, `config` shape and phase reference is unchanged, so the engine, the scheduler, the renderer and any persisted learner state are unaffected. `ITEM_CEFR` covers all 73 items, checked against the item ids parsed out of `content.ts`.

---

# Part two: the second A2.1 week and the Pre-A1 to A1.1 starter slice

Owner: CEFR Content Lead. Status: authored on LP-61 (LEA-43), 26 October 2026. Everything above this line is the LEA-42 audit of the first week and is unchanged. This part is the levelling record for the 49 items, 9 atoms, 2 stories, 9 criteria and 9 outcomes added in the same pass, written to the same sources: the 2020 Companion Volume descriptor scales, the British Council and EAQUALS Core Inventory for grammar and functions, and the English Vocabulary Profile for words and phrases.

## What was authored, and why this shape

| Slice | Content | The question it answers |
| --- | --- | --- |
| A2.1 week two | Six atoms and one story, one theme: making an appointment and getting to it | The first week is a cafe week. A second week at the same band has to be a different situation or the learner is practising a script, not a level. Appointments are the next Core Inventory A2 function set: making arrangements, comparing options, asking the way, times and days, changing a plan, passing a message on |
| Pre-A1 to A1.1 starter | Three atoms and one story, a ladder: greeting and name, asking for a thing, I'm and you're | Launch scope is Pre-A1 to B1 (PRD line 17) and `placementLevel()` can place a learner at PreA1.1, where until now there was nothing to serve. A learner placed at Pre-A1 was given A2.1 content |

The week-two spine, one atom a day, and what each day adds:

| Day | Atom | Band | What the learner can do that they could not the day before |
| --- | --- | --- | --- |
| 1 | Monday at ten | A2.1 | Ask for an appointment on the phone and take the time offered |
| 2 | Earlier or later? | A2.1 | Compare two options, and ask for a better time |
| 3 | Which way? | A2.1 | Ask the way and say the directions back to check them |
| 4 | Thursday at half past six | A2.1 | Catch a day and a clock time, and ask for a repeat |
| 5 | Sorry, I can't come / Pass it on | A2.1 | Change an arrangement in writing, and pass an appointment to someone else |

The starter ladder, each atom a prerequisite of the next, and the last one feeding `CRI-A1.2-SPK-03-01` (Meet Fatima) without being wired as its prerequisite, which would block existing learners:

| Step | Atom | Band | Target |
| --- | --- | --- | --- |
| 1 | Hello, I'm Ana | PreA1.1 | Hello. I'm + name |
| 2 | Two, please | PreA1.2 | A number, the thing, then please |
| 3 | I'm from Spain | A1.1 | I'm about me, you're about the other person |

## Outcomes

| Outcome | Sub-level | Companion Volume scale and band | Note |
| --- | --- | --- | --- |
| OUT-A2.1-INT-08 Can make an appointment on the phone | A2.1 | Telephone and online conversation A2, "can make simple arrangements by phone" | In band. The scale is new to the product; the first week used Transactions only |
| OUT-A2.1-GRM-09 Can compare two things | A2.1 | Grammatical accuracy A2, with Core Inventory comparative adjectives at A2 | In band. Grammar outcomes map to accuracy plus the Core Inventory, as in part one |
| OUT-A2.1-SPK-10 Can ask the way and check I understood | A2.1 | Transactions to obtain goods and services A2, "can ask for and give directions referring to a map or plan" | In band. The checking-back half is Understanding an interlocutor A2, "can ask for repetition or clarification" |
| OUT-A2.1-LST-11 Can catch the day and the time in a message | A2.1 | Understanding announcements and instructions A2 | In band, and distinct from OUT-A2.1-LST-03: that one is numbers in public announcements, this one is a day and a clock time addressed to the learner |
| OUT-A2.1-WRT-12 Can write a message to change a time | A2.1 | Correspondence A2, "can write short simple notes and messages on matters of immediate need" | In band. The reason clause is what keeps it above the A1 bare question |
| OUT-A2.1-MED-13 Can pass on an appointment to someone else | A2.1 | Relaying specific information in speech A2 | In band. Three facts from a written card, which is the written-to-spoken direction the gas bill already uses |
| OUT-PreA1.1-SPK-14 Can say hello and give my name | PreA1.1 | Conversation Pre-A1, "can say hello and goodbye, can introduce him or herself" | In band |
| OUT-PreA1.2-INT-15 Can ask for one thing in a shop | PreA1.2 | Transactions to obtain goods and services Pre-A1, "can ask people for things and give people things" | In band |
| OUT-A1.1-GRM-16 Can say who I am and where I am from | A1.1 | Grammatical accuracy A1, with Core Inventory present of be and from at A1 | In band |

## Criteria, and one decision that needs stating

All nine new criteria carry `mastery_rule: "ai"`, including the two grammar ones. This is a change of practice from part one, where grammar, reading and listening criteria are `keyed`, and it is forced by two things that are both outside this file:

1. `docs/learning-model.md` §1.7 makes **every delayed check a spoken say-it**. The new atoms are authored that way.
2. `complete_session` in `store.tsx` builds a keyed sitting from today's first attempts and **skips every attempt whose modality is spoken**, and `updateCriterion` only passes a keyed sitting at `total >= 3`. A criterion whose production and check are spoken therefore needs three further non-spoken items in the same session before it can pass a single sitting.

A keyed criterion authored to the new spine can never be mastered. The three available answers were: author four non-spoken scaffolds per atom, which contradicts §1.5's two; drop the spoken check, which contradicts §1.7; or record mastery from the AI-scored production, which is what the PRD asks for anyway ("grammar and vocabulary are enablers, mastery is inferred from correct use in communicative production"). The third is taken. Every new atom therefore carries **two** AI-scored items with different task ids, which is what the `ai` branch of `updateCriterion` needs (two days, two tasks).

| Criterion | Band | Rule | AI evidence it masters from | Prerequisite |
| --- | --- | --- | --- | --- |
| CRI-A2.1-INT-08-01 | A2.1 | ai | ITM-INT-1201 dialogue_turn, ITM-INT-1204 roleplay | CRI-A2.1-INT-01-01 |
| CRI-A2.1-GRM-09-01 | A2.1 | ai | ITM-GRM-1301 dialogue_turn, ITM-GRM-1305 open_response | CRI-A2.1-INT-08-01 |
| CRI-A2.1-SPK-10-01 | A2.1 | ai | ITM-SPK-1401 dialogue_turn, ITM-SPK-1404 roleplay | CRI-A2.1-INT-08-01 |
| CRI-A2.1-LST-11-01 | A2.1 | ai | ITM-LST-1501 dialogue_turn, ITM-LST-1505 roleplay | CRI-A2.1-LST-03-01 |
| CRI-A2.1-WRT-12-01 | A2.1 | ai | ITM-WRT-1601 shadow, ITM-WRT-1605 short_production | CRI-A2.1-WRT-05-01 |
| CRI-A2.1-MED-13-01 | A2.1 | ai | ITM-MED-1701 dialogue_turn, ITM-MED-1704 relay | CRI-A2.1-MED-06-01 |
| CRI-PreA1.1-SPK-14-01 | PreA1.1 | ai | ITM-SPK-1801 dialogue_turn, ITM-SPK-1804 open_response | none |
| CRI-PreA1.2-INT-15-01 | PreA1.2 | ai | ITM-INT-1901 dialogue_turn, ITM-INT-1904 roleplay | CRI-PreA1.1-SPK-14-01 |
| CRI-A1.1-GRM-16-01 | A1.1 | ai | ITM-GRM-2001 shadow, ITM-GRM-2005 open_response | CRI-PreA1.2-INT-15-01 |

The same arithmetic shows two criteria in part one that **cannot** master as they stand. Recorded as flag F7 rather than fixed, because fixing them means adding an item to a week-one atom and the Learning Designer's cut list is pending on those atoms.

## Atoms

Input band is the band of the language in the video or the word cards, which is what the learner meets first.

| Atom | Sub-level | Type | Input band | Items | Target |
| --- | --- | --- | --- | --- | --- |
| ATM-A2-INT-0012 Monday at ten | A2.1 | video 50 s | A2.1 | 5 | Could I make an appointment, please? |
| ATM-A2-GRM-0013 Earlier or later? | A2.1 | word tutorial 40 s | A2.1 | 6 | er plus than |
| ATM-A2-SPK-0014 Which way? | A2.1 | video 50 s | A2.1 | 5 | Excuse me, how do I get to ...? |
| ATM-A2-LST-0015 Thursday at half past six | A2.1 | video 45 s | A2.1 | 6 | on + day, at + time |
| ATM-A2-WRT-0016 Sorry, I can't come | A2.1 | word tutorial 40 s | A1.2 to A2.1 | 6 | sorry, reason with because, new time |
| ATM-A2-MED-0017 Pass it on | A2.1 | video 45 s | A2.1 | 5 | day, time and place in one sentence |
| ATM-PA1-SPK-0018 Hello, I'm Ana | PreA1.1 | video 35 s | PreA1.1 | 5 | Hello. I'm + name |
| ATM-PA1-INT-0019 Two, please | PreA1.2 | video 35 s | PreA1.1 | 5 | number, thing, please |
| ATM-A1-GRM-0020 I'm from Spain | A1.1 | word tutorial 30 s | A1.1 | 6 | I'm, you're |
| STO-A2-0004 The second left | A2.1 | story | A2.1 | 0 | Recycles week two at 98% known words |
| STO-PA1-0005 Ana and Omar | PreA1.2 | story | PreA1.2 | 0 | Every word is taught in the three starter atoms |

Two conventions were extended, both stated so they can be rejected: the atom id pattern gains `ATM-PA1-...` for Pre-A1 (part one has only `ATM-A1-` and `ATM-A2-`), and the story id pattern gains `STO-PA1-0005`.

## Items

`Actual` is the band recorded in `ITEM_CEFR`. Phase is the lesson-order step the item serves: **say it** is the first spoken turn, **scaffold** the controlled step, **use it** the whole exchange, **check** the delayed say-it.

### ATM-A2-INT-0012 Monday at ten

| Item | Type | Phase | Actual | Descriptor |
| --- | --- | --- | --- | --- |
| ITM-INT-1201 | dialogue_turn | say it | A2.1 | Telephone and online conversation A2: makes a simple arrangement on the phone |
| ITM-INT-1202 | tap_order | scaffold | A2.1 | General linguistic range A2: modal request carrying a fixed A2 chunk |
| ITM-INT-1203 | transform | scaffold | A2.1 | Sociolinguistic appropriateness A2: performs a basic function politely |
| ITM-INT-1204 | roleplay | use it | A2.1 | Telephone conversation A2: makes an arrangement and takes a changed time |
| ITM-INT-1205 | read_aloud | check | A2.1 | Phonological control A2: the whole request and the agreed time |

"make an appointment" is A2 in the English Vocabulary Profile. The modal request is recycled from week one on purpose, so the only new element is the collocation and the arrangement that follows it.

### ATM-A2-GRM-0013 Earlier or later?

| Item | Type | Phase | Actual | Descriptor |
| --- | --- | --- | --- | --- |
| ITM-GRM-1301 | dialogue_turn | say it | A2.1 | Grammatical accuracy A2: comparative er plus than on real prices |
| ITM-GRM-1302 | magnet_tiles | scaffold | A2.1 | Grammatical accuracy A2: comparative plus than in one sentence |
| ITM-GRM-1303 | error_spot | scaffold | A2.1 | Grammatical accuracy A2: notices more with a short adjective |
| ITM-GRM-1304 | tap_order | scaffold | A2.1 | Transactions A2: asks for an earlier time with a comparative |
| ITM-GRM-1305 | open_response | use it | A2.1 | Describing experience A2: compares two options |
| ITM-GRM-1306 | read_aloud | check | A2.1 | Grammatical accuracy A2: two comparatives joined with but |

Only -er comparatives of one-syllable and two-syllable -y adjectives are taught, which is where the Core Inventory puts A2. "more expensive" is A2.2 and is deliberately absent: the error_spot item uses "more cheap" as the wrong form, so the learner meets the boundary without being asked to produce it. Irregular comparatives (better, worse) are not in this atom.

### ATM-A2-SPK-0014 Which way?

| Item | Type | Phase | Actual | Descriptor |
| --- | --- | --- | --- | --- |
| ITM-SPK-1401 | dialogue_turn | say it | A2.1 | Transactions A2: asks for and follows simple directions |
| ITM-SPK-1402 | tap_order | scaffold | A2.1 | General linguistic range A2: question with do plus get to plus a place |
| ITM-SPK-1403 | dictation | scaffold | A2.1 | Understanding instructions A2: writes down directions heard once |
| ITM-SPK-1404 | roleplay | use it | A2.1 | Transactions A2: asks the way and says the directions back |
| ITM-SPK-1405 | read_aloud | check | A2.1 | Phonological control A2: the whole question |

"Go straight on", "take the second left" and "opposite" are the A2 direction set in the Core Inventory; ordinals are A1 as words and A2 in this use. The dictation is the one scaffold from outside the strand, which §1.7's cross-strand rule allows at one per chunk, and it is not mastery evidence.

### ATM-A2-LST-0015 Thursday at half past six

| Item | Type | Phase | Actual | Descriptor |
| --- | --- | --- | --- | --- |
| ITM-LST-1501 | dialogue_turn | say it | A2.1 | Understanding an interlocutor A2: catches a day and a time and says them back |
| ITM-LST-1502 | dictation | scaffold | A2.1 | Understanding announcements A2: writes down a day and a clock time |
| ITM-LST-1503 | detail_gap | scaffold | A2.1 | Understanding announcements A2: catches the day in a short message |
| ITM-LST-1504 | dictation | scaffold | A2.2 | Understanding announcements A2: minutes to the hour, quarter to five as 4.45 |
| ITM-LST-1505 | roleplay | use it | A2.1 | Understanding an interlocutor A2: asks for repetition, then confirms |
| ITM-LST-1506 | read_aloud | check | A2.1 | Phonological control A2: the day and the time in one sentence |

`ITM-LST-1504` is recorded a sub-level above its atom and is the only such item in the slice. "Half past" is A1 to A2; "quarter to" requires subtracting from the next hour and the Core Inventory puts the full clock at A2 late. It sits in the scaffold step, never in the check, which is the rule part one set.

### ATM-A2-WRT-0016 Sorry, I can't come

| Item | Type | Phase | Actual | Descriptor |
| --- | --- | --- | --- | --- |
| ITM-WRT-1601 | shadow | say it | A1.2 | Phonological control A1: repeats a model apology intelligibly |
| ITM-WRT-1602 | tap_order | scaffold | A2.1 | Correspondence A2: asks for a new time politely |
| ITM-WRT-1603 | correct_message | scaffold | A1.2 | Grammatical accuracy A1 to A2: can't before the verb |
| ITM-WRT-1604 | dictation | scaffold | A2.1 | Grammatical accuracy A2: because links the reason to the sentence |
| ITM-WRT-1605 | short_production | use it | A2.1 | Correspondence A2: short notes and messages on matters of immediate need |
| ITM-WRT-1606 | read_aloud | check | A2.1 | Phonological control A2: sorry, reason and new time in one turn |

Two items sit at A1.2 and both are deliberate: the first spoken turn recycles simple language so that the learner's first attempt is possible, and the word-order repair is the error that survives into A2. The band of the atom is carried by `because` and by the message in `ITM-WRT-1605`, which has `min_words: 12` so a one-line answer cannot pass. This atom also answers part one's flag F1 for its own strand: the input and the items are at the same band here, unlike ATM-A2-WRT-0007.

### ATM-A2-MED-0017 Pass it on

| Item | Type | Phase | Actual | Descriptor |
| --- | --- | --- | --- | --- |
| ITM-MED-1701 | dialogue_turn | say it | A2.1 | Relaying specific information in speech A2: gives the day from a written card |
| ITM-MED-1702 | tfng | scaffold | A2.1 | Reading for orientation A2: reads 18.30 as half past six |
| ITM-MED-1703 | tfng | scaffold | A2.2 | Reading for orientation A2: decides the card does not carry the information |
| ITM-MED-1704 | relay | use it | A2.1 | Relaying specific information in speech A2: the full descriptor |
| ITM-MED-1705 | read_aloud | check | A2.1 | Relaying specific information A2: day, time and place in one sentence |

`ITM-MED-1703` is recorded at A2.2 for the same reason part one records `ITM-RDG-0603` there: deciding that a text does not carry something is the hardest of the three answers. Both tfng items read the same card, which is the mediation source, so the reading is never a separate text.

### ATM-PA1-SPK-0018 Hello, I'm Ana

| Item | Type | Phase | Actual | Descriptor |
| --- | --- | --- | --- | --- |
| ITM-SPK-1801 | dialogue_turn | say it | PreA1.1 | Conversation Pre-A1: basic greetings and introducing themselves |
| ITM-SPK-1802 | tap_order | scaffold | PreA1.1 | Grammatical accuracy Pre-A1: I'm plus a name |
| ITM-SPK-1803 | magnet_tiles | scaffold | PreA1.2 | Conversation Pre-A1: asks a memorised question about personal details |
| ITM-SPK-1804 | open_response | use it | PreA1.1 | Conversation Pre-A1: greets and gives their name unprompted |
| ITM-SPK-1805 | read_aloud | check | PreA1.1 | Phonological control Pre-A1: a memorised greeting said intelligibly |

"What is your name?" is produced, not only understood, which is a half-level reach and is recorded as PreA1.2. The Companion Volume allows memorised chunks at Pre-A1 and the item is four tiles of a fixed question, so it is within the band's "fixed expressions" clause. It is a scaffold, never the check.

### ATM-PA1-INT-0019 Two, please

| Item | Type | Phase | Actual | Descriptor |
| --- | --- | --- | --- | --- |
| ITM-INT-1901 | dialogue_turn | say it | PreA1.2 | Transactions Pre-A1: can ask people for things |
| ITM-INT-1902 | tap_order | scaffold | PreA1.1 | Vocabulary range Pre-A1: number plus noun plus please |
| ITM-INT-1903 | magnet_tiles | scaffold | PreA1.2 | Grammatical accuracy Pre-A1: one plus a singular noun |
| ITM-INT-1904 | roleplay | use it | A1.1 | Transactions A1: changes the order when the thing is not there |
| ITM-INT-1905 | read_aloud | check | PreA1.2 | Phonological control Pre-A1: the whole request and thank you |

`ITM-INT-1904` is the one item in the starter slice above its atom's band, because §1.2 requires the use-it step to carry one problem to repair and a refusal is A1, not Pre-A1. It passes at `need: 2` of 3 turns, so the two Pre-A1 turns carry the pass and the repair turn is a reach that does not gate anything.

### ATM-A1-GRM-0020 I'm from Spain

| Item | Type | Phase | Actual | Descriptor |
| --- | --- | --- | --- | --- |
| ITM-GRM-2001 | shadow | say it | PreA1.2 | Phonological control Pre-A1 to A1: repeats a two-sentence model |
| ITM-GRM-2002 | tap_order | scaffold | A1.1 | Grammatical accuracy A1: I'm plus from plus country |
| ITM-GRM-2003 | error_spot | scaffold | A1.1 | Grammatical accuracy A1: are with you, am with I |
| ITM-GRM-2004 | magnet_tiles | scaffold | A1.1 | Grammatical accuracy A1: question with are before you |
| ITM-GRM-2005 | open_response | use it | A1.1 | Describing experience A1: name, country and city |
| ITM-GRM-2006 | read_aloud | check | A1.1 | Phonological control A1: three connected I sentences |

Only `I'm` and `you're` are taught. He, she and they are A1.2 and belong with Meet Fatima, which already teaches third-person work; putting the whole paradigm here would be the second new thing in one lesson.

## Cut lists, ready for `Atom.cuts`

`Atom.cuts` does not exist in `types.ts` yet (learning-model §1.6, LP-30). Until it does, every learner gets the authored bank, so the banks are authored at the **standard** density of §1.5 (five or six items) rather than dense. These are the cut lists to paste in when the field lands, and they touch `controlled` items only, so no cut removes a say-it, a use-it or a check.

| Atom | Bank | `cuts.standard` | `cuts.light` |
| --- | --- | --- | --- |
| ATM-A2-INT-0012 | 5 | none | ITM-INT-1203 |
| ATM-A2-GRM-0013 | 6 | ITM-GRM-1304 | ITM-GRM-1304, ITM-GRM-1303 |
| ATM-A2-SPK-0014 | 5 | none | ITM-SPK-1403 |
| ATM-A2-LST-0015 | 6 | ITM-LST-1504 | ITM-LST-1504, ITM-LST-1503 |
| ATM-A2-WRT-0016 | 6 | ITM-WRT-1604 | ITM-WRT-1604, ITM-WRT-1603 |
| ATM-A2-MED-0017 | 5 | none | ITM-MED-1703 |
| ATM-PA1-SPK-0018 | 5 | none | ITM-SPK-1803 |
| ATM-PA1-INT-0019 | 5 | none | ITM-INT-1903 |
| ATM-A1-GRM-0020 | 6 | ITM-GRM-2004 | ITM-GRM-2004, ITM-GRM-2003 |

In every light list the dropped items are the ones furthest from the target: the harder clock form, the second tiles item, the extra dictation. The light learner keeps the say-it, the use-it and the delayed check, which §1.5 requires.

## Item types used, against the LP-20 cut list

Authored: `dialogue_turn`, `roleplay`, `relay`, `open_response`, `shadow`, `read_aloud`, `short_production`, `correct_message`, `transform`, `dictation`, `tap_order`, `magnet_tiles`, `error_spot`, `tfng`, `detail_gap`. Not authored, because `docs/exercises.md` cut them: `gap_fill`, `gist_mcq`, `inference_mcq`, `heading_match`, `time_slider`, `vote_see_revote`, `sentence_build`, `picture_describe`, `explain_chart`, `translate_gist`, and `pick_picture` with emoji. There is no emoji item anywhere in this slice, which is why the Pre-A1 atoms lean on tiles and the mic rather than pictures: the renderer has no real picture support, and emoji glyphs are the thing part one's flag F2 is about.

## Flags for other owners

Continuing the numbering of part one.

| # | What | Who | Why it is not in this change |
| --- | --- | --- | --- |
| F7 | `CRI-A2.1-INT-01-02` and `CRI-A2.1-MED-06-01` are `ai` criteria whose only AI-scored item is a `roleplay` and a `relay`. Both record `task_id: item.item_id`, a constant, so `tasks.size` never reaches the 2 that `updateCriterion` requires. Neither criterion can ever reach `mastered`, which also means "We're out of oat milk" and "The gas bill" never leave the new-atom pool | Front-end Builder, with the Learning Designer | The fix is one more AI item on each criterion (an `open_response` or `shadow`, whose task id flips with day parity), or a one-line change in `items.tsx` to give roleplay and relay the same `:dayParity` suffix. Both are files this ticket does not own, and the week one atoms are under the pending cut list |
| F8 | `scoreNewAtoms` has no level filter. With Pre-A1 content in the bank, an A2.1 learner with a strand deficit can be served "Hello, I'm Ana", because an unseen atom with no prerequisites scores near the top | Front-end Builder | `atomsForLevel(level)` is now exported from `content.ts` with the rule written out: at or below the learner's sub-level, and no more than one band below. Wiring it is one line in `engine.ts` |
| F9 | The nine new atoms have no `SCENES` entry in `scenes.tsx` and no Remotion composition, so `VideoPhase` plays them as captions over an empty stage | UX Designer and the explainer owner | `scenes.tsx` and `components/learning-path/explainer/` belong to other agents. The nine storyboards in `docs/explainers/storyboards.md` part two are the brief, written in the existing format with beats, frames, L1 captions and interactive moments |
| F10 | The new atoms are authored in the lesson order of learning-model §1.2 (input, noticing, free_use, controlled, free_use, check). The ten week-one atoms are still in the old order | Whoever takes LP-30, §1.4 row 6 | Reordering week one changes ten live lessons and is a separate ticket. Nothing breaks in the meantime: `AtomRun` walks whatever order it is given |
| F11 | A `roleplay` or `relay` that passes at `need: 2` of 3 turns scores 0.667, which is below the 0.7 an AI sitting needs. The item is marked correct and the criterion sitting still fails | Front-end Builder, with me | Deliberate for now, and consistent with week one: the item is a pass, mastery needs a clean run. Worth a decision, because a learner can pass every item in an atom and never see the criterion move |
| F12 | Pre-A1 needs rules the renderer cannot express yet: three words per caption line, the L1 line on by default below A1.2, 90 wpm narration, and no written word before it has been heard twice | Learning Designer | Instructions are i18n keys and the caption toggle is a learner setting. The rules are written into storyboards part two section 16 so they are at least in the brief |
| F13 | Part one's conventions allow two new drawn characters across all storyboards. The starter slice adds a third, **ana** | UX Designer and the explainer owner | Every existing character already speaks at A1.2 or above in the atoms they carry. A Pre-A1 learner needs a peer who says three words and stops. Stated as an amendment at the top of storyboards part two, not assumed |

## Verification

`npx tsc --noEmit` clean after every change. A data check over the built arrays confirms: no duplicate item or atom ids; every criterion, outcome, prerequisite and phase item reference resolves; every phase item belongs to its atom's criterion and appears in `target_items`; every index key is inside its options array; every `tap_order` and `magnet_tiles` key is exactly the tiles it is given, so none of them is unanswerable; and `ITEM_CEFR` covers all 122 items (108 lesson items plus the 8 placement and 6 checkpoint items). This change edited nothing in part one: the week one items, atoms, criteria, outcomes, placement ladder, checkpoint and `placementLevel()` are untouched, and the new outcomes are appended rather than inserted so `pickWeekCanDo` still offers the week one outcomes first. The one exception, stated because it is in the same file: two items in the week two atoms were authored with "Elena" as the partner and were changed to "Sami" before the storyboards were written, so the drawn cast stays closed.
