# Learning model: the lesson spine, CEFR map, repetition and path rules

LP-02 · Learning Designer · 26 October 2026 · v1.2, for QA then the board

This is the pedagogy contract for the Learning Path app. It says what a lesson is, how lessons add up to a CEFR level, when a lesson comes back, and how the system picks the next one. It is written so a developer can implement the path logic without asking a question, and a content author or a model can write three consistent chunks from the template alone.

**What changed in v1.2.** The twelve findings QA returned on LEA-21 are fixed. Where they go:

| Finding | Fixed in |
| --- | --- |
| R1 Deleting `recall` leaves items at New and Learning with no way back | §1.3, §1.4 rows 2 and 3, §3.2's return column, §4.4, §4.6 day 2, §4.7.1 |
| R2 §2.2's "Checked by" column named item types §1.7 cuts | §2.2, all five level tables, column renamed and rebuilt from §1.7 |
| R3 The 0:50 mic invariant cannot hold at B2 or C1 | §1.2, §1.10 item 4, §4.7, §4.7.1, §5.2, §5.6 |
| R4 SPK and INT chunks have no scaffolds, so variants and cuts have nothing to act on | §1.5, §1.6, §1.7, §4.6 day 1 |
| R5 The §5.6 three-chunk test is unpassable for the WRT brief | §1.1, §1.2, §1.7, §1.10 item 7, §4.4, §5.3, §5.6 |
| R6 Four rows of §1.4 describe an engine that has moved | §1.4, re-derived against the file; every citation in §1 re-checked |
| R7 `target_items` breaks the `content.ts` convention | §1.9 |
| R8 §5.2's video-rules paragraph is duplicated and the copy drops a board rule | §5.2 |
| R9 The light variant's clock does not reproduce | §1.2, §1.5 |
| R10 The rung-advance gaps and `strand_minutes_this_week` are not in the document | §3.2, §4.5 |
| R11 The worked-example totals omit the tie-break term | §4.6, §4.7 |
| R12 Timers below B1, internal conflict | §1.8, §5.3 |

Two rulings from the Product Lead are also in: R6 and R7 are fixed doc-side, describing the engine as it behaves today rather than asking for a rename; and the uncapped half-life compounding is now a rule with numbers (§3.2.1), traced in §3.5.1, with §7 row 6 rewritten as the engine ticket it needs.

Settled in v1.1 and not reopened: F1 and F2 (§3.5 reproduces against `applyAttempt` cell for cell), the F3 cut-list ruling (§1.6), the recall-phase ruling (§1.3) and the day-one label call (§4.2 rule 4, §7 row 7).

**What changed in v1.1.** Section 1 stopped being a free-form chunk template. It is the board's lesson order of 26 October, mapped onto `AtomPhase` and `SessionPhase`, with a divergences table against the code as it stands (§1.4). The consequences reach sections 4.2 to 4.7, 5.1 to 5.3, 5.6 and 7.

**Code citations.** Every line number in this document was re-checked against the working tree while writing v1.2: HEAD `ac708cf`, with uncommitted changes in `Capsule.tsx` and `content.ts` from other runs in this shared checkout. Several agents edit these files daily, so the function name is the contract and the line number is only where it sat: read "`composeSession` (`engine.ts:356`)" as the former first.

Source documents: the board note of 26 October (lesson order and its seven points), `docs/learning-path/PRD.md` (sections "The learning atom and the 10-minute session", "Repetition and memory engine", "Competency framework and adaptive path"), `docs/exercises.md` (the LP-20 item cut list) and `docs/design-rules.md`. Where a rule here differs from the PRD or from the code, it is listed in section 7 or §1.4 with the reason. Board direction outranks both.

## 0. Terminology, so nothing is ambiguous

| Word | Means | Where it appears |
| --- | --- | --- |
| Chunk | The bite-size unit of learning, 3 to 5 minutes, one "I can" outcome. The unit of production, scheduling, analytics and mastery | This spec, Paperclip tickets |
| Atom | The same thing in code and in the PRD. `Atom` in `lib/learning-path/types.ts`, IDs `ATM-...` | PRD, code, CMS |
| Lesson | The same thing in learner-facing copy. Never "atom", "chunk", "unit" or "module" on screen | UI, i18n strings |
| Phrase item | A multi-word lexical item scheduled as one thing ("I'd like...", "Could I have..."). The PRD calls these "chunks" in rule 7 | This spec, item bank |
| Criterion | One observable micro-skill. The thing mastery is decided on. IDs `CRI-...` | PRD, code |
| Can-do outcome | One CEFR descriptor, 1 to 4 criteria beneath it. IDs `OUT-...` | PRD, code, Road screen |
| Strand | One of GRM, RDG, WRT, LST, SPK, MED, INT | PRD, code |

Read "chunk" and "atom" as the same object throughout. Section 1.9 maps every field of this template onto the implemented `Atom` type so there is one schema, not two.

One more word, because the board note changes it: this spec says **item**, not "check". A check implies something that tests. Every item in a lesson ends with the learner producing the phrase, and the only thing that "checks" is the delayed say-it in the close.

Hierarchy, unchanged from the PRD: Level > Sub-level > Strand > Cluster > Can-do outcome > Criterion > Chunk > Item.

---

## 1. The lesson spine

### 1.1 The spine, and what "one thing at a time" binds

Board direction of 26 October sets the lesson order. Section 1 is that order, not a free-form template: **scene, notice, say it with a response, use it, come back later.** The five rules below are the test every chunk passes.

| Rule | What it means here |
| --- | --- |
| Comprehensible input first | The scene teaches. The learner hears and sees the phrase in a situation where the meaning is obvious before being asked to produce it. No rule on screen, no Explain beat, no caption that explains instead of showing |
| Say it early and often | The mic is live inside the first minute, in every lesson, in every variant, video or word tutorial, with a response that reacts to what was said. The number is 0:50 to B1 and 0:55 from B2 (§1.2) |
| One thing at a time | One phrase, one pattern or one sound per session |
| Spaced return inside new situations | Due items come back inside the lesson: at Consolidating or better into the "use it" step, at New or Learning as the sentences the "say it again" scaffolds are built from (§1.3). No recall phase before the scene, no review tab to find |
| Exercises produce, not recognise | Every item ends with the learner producing the whole sentence, in the strand's own modality: said aloud in six strands, typed in WRT at steps 5 and 6 (§1.7). A tap or drag earns its place only as a scaffold that hands straight to production |

**On "one thing at a time": I agree with the Product Lead's reading, and it needs the atom-level rule underneath it to be enforceable.** Binding the rule to the session is right, because the learner meets the session, not the atom. But the session rule can only be held if no atom smuggles in a second new target, so both grains are specified and the narrower one is the mechanism for the wider one.

| Grain | Rule | Enforced by |
| --- | --- | --- |
| Session | At most one new thing per ten minutes. Everything else in the session is old material returning inside a new scene | At most one phase with `role: "new"`. `composeSession` already has `alreadyNewToday` (`engine.ts:409`) |
| Atom | One target form or phrase, highlighted once in the notice step | §1.10 item 3, Gate A |
| What counts as new | A **target item**. Incidental words inside a scene or a story are not new things, which is why a story at 98% known-word coverage is still allowed | Every item in a phase whose role is not `new` must have `ItemMastery.state != "new"` |

### 1.2 The phase list to build

One chunk, 3 to 5 minutes, one criterion, one "I can" outcome. If a chunk needs two outcomes it is two chunks. The "I can" line is 10 words or fewer and uses the same wording as the closing line and the delayed check stem, so a learner can read it and say yes or not yet. Clock times are the first pass at A1 to B1.

| # | Spine step | On screen | `AtomPhase` kind | Clock to B1 | Clock from B2 | Required |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Scene | The phrase happening in a situation where the meaning is obvious. 95% known language plus the one new element | `input` | 0:00 to 0:35 | 0:00 to 0:45 | Yes |
| 2 | Notice | The target highlighted once, in the scene it just appeared in, with a 12-word why in L1 below B1. From B2 the highlight alone, no why | `noticing` | 0:35 to 0:47, 12 s | 0:45 to 0:53, 8 s | Yes |
| 3 | Say it with a response | The learner's first spoken turn, with the coach. She answers what was said; she does not mark it | `free_use` | 0:47 to 1:30 | 0:53 to 1:36 | Yes |
| 4 | Say it again | A fixed 80 s window, 1 to 3 scaffolds or support turns inside it. Each one ends with the whole sentence produced | `controlled` | 1:30 to 2:50 | 1:36 to 2:56 | Yes |
| 5 | Use it | The whole exchange, with one problem to repair, carrying up to 3 due items at Consolidating or better | `free_use` | 2:50 to 4:00 | 2:56 to 4:06 | Yes |
| 6 | Come back later | One delayed production of the whole sentence, served in the session close | `check`, `delayed: true` | +0:25 | +0:25 | Yes, every variant |

About 4 minutes in the chunk plus 0:25 in the close, so 4 min 25 s to B1 and 4 min 31 s from B2. Both are inside the 3 to 5 minute band and inside the 4 minutes `phaseMinutes` bills for a new atom.

Four things follow that are not negotiable:

- **The mic is live inside the first minute: by 0:50 to B1, by 0:55 from B2, never later than 1:00.** The arithmetic is the table above, and it is the reason the notice shortens from B2 rather than the scene: 45 s first pass plus an 8 s notice is 0:53. The scene's first pass is hard-capped at 35 s to B1 and 45 s from B2 (§5.2). If a scene cannot carry its phrase in 35 s at A1, it is the wrong scene. QA's R3 was right that 45 plus 12 is 0:57; the fix is the 8 s notice plus an invariant stated per band, not a number that only holds at A1.
- **Step 4 is a fixed window, not a per-scaffold budget.** 80 s whatever the density, so one scaffold gets up to 80 s, two get 40 s each, three get 27 s each. The clock above is therefore the same in every variant, which answers R9: a light lesson is not a shorter lesson, it is the same lesson with more time per attempt for the learner who needs it.
- **Word tutorials get the same spine.** At most 3 cards before step 3, the rest return in step 5. The template this replaces gave word-tutorial chunks no spoken turn at all.
- **The first production turn comes before the scaffolds, not after.** The learner tries, then the scaffolds repair what the attempt showed. This is the generation effect and productive failure (Bjork; Kapur), so the old order recognise, complete, produce is reversed and §5.3 is rewritten to match.

**Ruling for typed strands, which answers R5's first half.** Step 3 is spoken in **every** strand, WRT included: the learner says the message's key sentence to the coach before typing anything. The mastery evidence then stays in the strand's own modality, because WRT's step 5 is the typed 20 to 60 word message and its step 6 is one typed key sentence of 8 to 15 words (§1.7). So "ends with the learner producing the whole sentence" means aloud at step 3 in all seven strands, and at steps 5 and 6 in the strand's own modality. Reasons: oral rehearsal before writing is the cheapest route to a live mic inside the first minute, and transfer-appropriate processing (Morris et al. 1977) only binds the step that decides mastery.

`AtomPhase[]` is authored in exactly that order, so `free_use` appears twice. `AtomRun` walks `atom.phases` in authored order with `check` filtered out (`Capsule.tsx:165`), so the repeat needs no type change.

### 1.3 The session, in `SessionPhase`

| # | `SessionPhase` | Role | Minutes |
| --- | --- | --- | --- |
| 1 | `atom` | `new`, the scene-led chunk of §1.2 | 4 |
| 2 | `atom` | `use`, a second scene built from old material only, carrying due items at Consolidating or better as `tryItems` | 3 |
| 3 | `story` | One story at 98% or higher known-word coverage, no checks attached | 1.5 |
| 4 | `close` | The delayed production of the sentence, said aloud in six strands and typed in WRT, then a one-tap "I can / not yet", then the can-do line in plain words | 0.5 |

Nine minutes, inside the ten-minute target with a minute of headroom. There is no `plan` phase, no `recall` phase and no `vote` phase. Where their work goes:

| Removed | Why | Where its job goes |
| --- | --- | --- |
| `plan` | A list of what is about to happen is not a scene, and it spends the opening on text a beginner cannot read | A 3-second title card on the scene's first frame, not a phase. The can-do line stays in `close` |
| `recall` | A front-loaded recall drill is the thing the board ruled out, and it put up to 2 minutes of items in front of a learner who had not seen anything yet. Today it is pushed after the two atoms (`engine.ts:426`), which is better than the PRD's order and still a drill | Split in two by state, below |
| `vote` | `vote_see_revote` was cut on LP-20: the peer percentages are invented numbers in `config.peers`, the model answer is revealed before the second vote, and the learner produces nothing | Nothing. Day 4 interleaves across strands, which was always the pedagogical point of day 4 |

**Ruling on QA's open question.** A dedicated recall phase does **not** count as "inside the scene", wherever it sits in the order. Inside the scene means the due item is retrieved because the situation needs it. That is only true of steps 4 and 5, which is why the phase goes rather than moving.

**The two return paths, which answers R1.** QA was right that deleting the phase without this left items at New and Learning with nowhere to go: `tryToUse` (`engine.ts:464`) admits only `consolidating`, `known` and `mastered`, so on day 2 of an item's life `dueItems` returns it and `tryToUse` does not. A due item returns by its **state**, and the state decides which step carries it:

| Item state when due | Returns in | Owned by | What the learner does |
| --- | --- | --- | --- |
| New, Learning | Step 4, as the **sentence a scaffold is built from** | A new function, `dueSentences(state, at, exclude, max)`, where `max` is the number of step 4 items this variant serves, so 1 at light and 3 at dense | Builds or repairs that sentence, then says it. The sentence is on screen, which is what §3.2 promises at these two rungs |
| Consolidating, Known, Mastered | Step 5, as `tryItems` | `tryToUse`, filter unchanged | Uses it unprompted inside the exchange. Nothing on screen |
| Any state, item is today's target | Neither. It is already the lesson | The `exclude` argument both functions take | Nothing extra |

Three things a developer needs from this, all in §1.4 rows 2 and 3:

- `dueSentences` is a **new function**, not `pickRecall` with a smaller count. `pickRecall` filters through `isRecallable` (`content.ts:709`), which excludes `say_it_see_it`, `roleplay`, `relay` and `shadow`: exactly the production types §1.7 makes the backbone. Reusing it would let no spoken item back in, which is R1's mirror problem.
- `isRecallable` itself **stays**, because `strandStrength` also calls it (`engine.ts:183`). It must not be reused as the return-path filter. Its doc comment should say so.
- The filter for `dueSentences` is by state and by whether the item has a single target sentence to build, not by item type. Order is lowest recall probability first, the same order `dueItems` already returns (`engine.ts:258`).

So the first three days of an item's life are covered: day 2 it is at Learning and comes back as tomorrow's scaffold sentence, and it reaches step 5 free use only once it is at Consolidating, which is the rung at which §3.2 says it can be said from a cue with nothing shown. The spacing is unchanged; what changes is how much scaffolding is standing when the learner produces it.

### 1.4 Divergences from the code as it stands

Against `composeSession` (`engine.ts:356`), `phaseMinutes` (`engine.ts:475`), `ringSlice` (`engine.ts:487`) and the `AtomRun` order (`Capsule.tsx:141`). Document only. The code change is LP-30's, not this ticket's.

Re-derived from the file for v1.2 after QA's R6. Four rows of v1.1 described an engine revision that no longer exists, and the engine had already moved in this spec's direction: there is no plan push, and recall is pushed after the atoms rather than before them. Rows 1, 2, 6 and 15 carry the correction.

| # | The code today | This spec | Change needed |
| --- | --- | --- | --- |
| 1 | **No plan push.** `engine.ts:381-382` is the comment "The lesson opens on the scene, never on a plan screen", and `composeSession` never pushes one. The residue is still live: `{ kind: "plan" }` (`types.ts:162`), `PlanPhase` (`Capsule.tsx:77`), the `plan` branch of `PhaseView` (`Capsule.tsx:67`), the `p.kind !== "plan"` filter (`Capsule.tsx:81`) and `phaseMinutes`' `plan` case (`engine.ts:477`) | No plan phase, and no type that can express one | Delete all five residue sites listed. Nothing to remove from the composer. v1.1 said the composer pushes it; it does not |
| 2 | `composeSession` builds `recallPhase` at `engine.ts:383-384` and pushes it at `engine.ts:426`, **after** the new atom and the use atom, under the comment "older material is retrieved once today's sentence has landed". 8 items, 10 on a warm restart | No recall phase. Due items return by state, per §1.3 | Remove the build and the push, drop `{ kind: "recall" }` (`types.ts:163`), remove the `recall` branch of `PhaseView` (`Capsule.tsx:68`) and `recall` from `ItemRun`'s `mode` union (`Capsule.tsx:99`). Delete `pickRecall` (`engine.ts:261`) |
| 3 | Nothing populates step 4's scaffold sentences. `AtomRun`'s `controlled` branch passes `phase.items` and `variant` only (`Capsule.tsx:188`) | Up to 3 due items at New or Learning supply the sentences | **Add `dueSentences(state, at, exclude, max)`** per §1.3, filtered by state not by `isRecallable`, and pass its result into the `controlled` branch. This is the row that makes the recall deletion safe |
| 4 | **Step 5 of a new atom carries no due items.** `AtomRun`'s `free_use` branch calls `ItemRun` with no `tryItems` and no `variant` (`Capsule.tsx:192`). The only `tryToUse` call is in the `USE:` branch, for the use atom (`Capsule.tsx:151`) | Step 5 carries up to 3 due items at Consolidating or better | Call `tryToUse(state, now, [today's targets])` in the `free_use` branch and pass it down. Easy to miss, because the use atom already does it and the session therefore looks correct from the outside |
| 5 | `phaseMinutes`: `plan` 0.33, `recall` up to 2 (`engine.ts:477-478`) | Neither phase exists | Delete both cases |
| 6 | `phaseMinutes`: `atom` with role `new` bills 4 | 4, unchanged, now spent scene-first | None. The chunk is 4:25 to B1 and 4:31 from B2 (§1.2), so the close's 0.5 absorbs the delayed check |
| 7 | A week-day-4 session today bills 2 + 4 + 3 + 1 + 1.5 + 0.5 = **12.0 min**, which is **at** §4.4's 12-minute ceiling, not over it | 9 min | Fixed by rows 2, 5 and 9. v1.1 claimed 12.33 by billing a plan phase that is not pushed; the correction does not weaken the case, because a session at its own hard ceiling every week day 4 has no headroom for a mic that waits |
| 8 | `AtomRun` runs the authored phase order, and `content.ts`'s atoms are authored input, noticing, controlled, free_use, so the first spoken turn lands at roughly minute 4 to 6 of the session | Scene, notice, say it, scaffolds, use it, with the mic live inside the first minute | **No change to `AtomRun`.** Reorder the authored `phases` array in `content.ts` so the two `free_use` phases sit either side of `controlled`. `ATM-A2-INT-0001` (`content.ts:233`) is the pattern to copy |
| 9 | `composeSession` pushes `vote` on week day 4 (`engine.ts:427`) | No vote phase | Remove the push, drop `{ kind: "vote" }`, delete the `vote` branch of `PhaseView` (`Capsule.tsx:70`) and the `vote_q` i18n key |
| 10 | `composeSession` can stack a new atom, a use atom, a recall phase, a vote and a story in one ten minutes | One `role: "new"`, one `use`, one story | The `new` limit already holds via `alreadyNewToday` (`engine.ts:409`). What overfills the session is the vote and the recall phase, so rows 2 and 9. The fluency atom is only composed in a second session, so row 11 |
| 11 | A second session the same day pushes a recall phase, a use atom and `ATM-A2-FLU-0001` (`engine.ts:397-403`) | The use atom and the fluency atom are correct, both old material returning. The recall phase goes with row 2 | Remove the recall push only |
| 12 | `Atom.variant` is one scalar (`types.ts:79`) and `AtomPhase.items` is a flat `string[]`, so there is nowhere to record a cut list | One atom carrying the dense bank plus two drop lists | Add `Atom.cuts`, §1.6 |
| 13 | `pickVariant` (`engine.ts:314`) sets the density from rolling accuracy, and `AtomRun` picks it with a **local duplicate**, `pickVariantLocal` (`Capsule.tsx:167`, defined at `Capsule.tsx:203`) | One density rule, one implementation | Not blocking, worth folding in when `cuts` lands: have `AtomRun` call `pickVariant` so the two cannot drift. The cut lists are filtered where `variant` is already in hand |
| 14 | Delayed `check` items are filtered out of the atom (`Capsule.tsx:165`) and served in `close` (`engine.ts:432-433`) | Unchanged, and the right place | None |
| 15 | `ringSlice` (`engine.ts:487-490`) maps `plan` and the new atom to slice 0, then `atom`, `recall` and `vote` to slice 1, everything else to 2 | Three phases, so three slices: new atom, use atom, then story plus close | Rewrite: `new` atom to 0, `use` atom to 1, `story` and `close` to 2. v1.1 put `recall` in slice 0; it is in slice 1. The rewrite is needed either way, because deleting `plan`, `recall` and `vote` empties three of the five cases |

### 1.5 Variants: what changes, and what never changes

Each chunk is authored at one density so the engine can change how a lesson is told, not only which lesson comes next.

| Variant | Served when | Step 4 items | Say it, step 3 | Use it, step 5 | Come back later, step 6 | Items |
| --- | --- | --- | --- | --- | --- | --- |
| Light | Rolling check accuracy below 0.70 | 1 | 1 | 1 | 1 | 4 |
| Standard | Accuracy 0.70 to 0.90, or fewer than 5 recent attempts | 2 | 1 | 1 | 1 | 5 |
| Dense | Accuracy above 0.90 | 3 | 1 | 1 | 1 | 6 |

The variant changes the number of step 4 items and nothing else. Step 4's window is a fixed 80 s either way (§1.2), so light means more time per attempt, not a shorter lesson. **The first spoken turn, the use turn and the delayed production are in every variant, light included.** The table this replaces dropped the delayed check from light, which took the one production moment that decides mastery away from the learner who most needed it.

**What step 4 holds, which answers R4.** QA was right that §1.7 left SPK and INT with no scaffolds, so there was nothing for a variant to cut and nothing to make up six items. Step 4 holds one of two things, and every strand has one of them:

| Strand group | Step 4 holds | Dense example |
| --- | --- | --- |
| GRM, RDG, WRT, LST, MED | 1 to 3 **scaffolds**: a tap or drag that builds the sentence, each handing straight to production | `tap_order`, then `error_spot`, then the one permitted cross-strand scaffold |
| SPK, INT | 1 to 3 **support turns**: the same sentence produced again through the coach with less support each time. Not a different kind of item, the same production at falling support | `say_it_see_it` (whole sentence shown), then `read_aloud` (shown, model withdrawn), then `open_response` (prompt only) |

Support turns are authored as items of the `controlled` phase, so they are cuttable exactly like scaffolds and the item counts in the table above hold for all seven strands. Why falling support rather than none: scaffolding that fades is what makes an unaided production possible, and the alternative for SPK and INT was three items and no density at all.

Why about 80% success: Wilson et al. 2019, the "85% rule". The variant switch exists to hold first-attempt accuracy between 0.75 and 0.85.

### 1.6 Cut lists: one atom, three densities

Ruling on QA's F3: **one `Atom` row carrying the dense bank plus two drop lists**, not three `Atom` rows.

Why one row. `pickVariant(state)` chooses the density per learner per session, after `composeSession` has already resolved an `atom_id`, and `SessionPhase` carries only that ID. Three rows would force the composer to resolve an ID to a variant row. `AtomRun` already receives `variant` (`Capsule.tsx:163`), so filtering one bank there is the smaller change and leaves one source of truth.

```json
"variant": "standard",
"cuts": { "standard": ["ITM-INT-0005"], "light": ["ITM-INT-0005", "ITM-INT-0004"] }
```

| Rule | Detail |
| --- | --- |
| Where the bank lives | `phases` always carries the **dense** set. Dense has no `cuts` entry and drops nothing |
| What a cut list is | The item IDs **removed** at that density. `cuts.light` is a superset of `cuts.standard`, so the three densities cannot drift apart |
| How the player applies it | `phase.items.filter(id => !(atom.cuts?.[variant] ?? []).includes(id))` |
| What may be cut | Items of the `controlled` phase only, which is scaffolds in five strands and support turns in SPK and INT (§1.5). A cut that touches a `free_use` or `check` item fails Gate A |
| Cut order | The author writes step 4 **most supportive first**, and the cut lists remove from the **end**: `cuts.standard` drops the last item, `cuts.light` drops the last two. So the struggling learner keeps the most supported attempt, which is the whole point of the light variant |
| Type change | `cuts?: { standard: string[]; light: string[] }` on `Atom`. `variant` stays as the fallback density that `AtomRun` reads when `role !== "new"` |

An author writes six items once and marks two drops. The schema this replaces asked authors for three cut lists and gave them nowhere to put them.

### 1.7 Item types per strand

Allowed types are the survivors of the LP-20 cut list (`docs/exercises.md`). A scaffold or support turn earns its place only by handing straight to production; the production column is the step that counts. Step 3 is spoken in every strand, including WRT (§1.2).

| Strand | Learner word | Step 4, most supportive first | Step 3, first turn | Production, steps 5 and 6 | Modality recorded | Mastery rule |
| --- | --- | --- | --- | --- | --- | --- |
| GRM Grammar | Grammar | `tap_order`, `magnet_tiles`, `error_spot` | `transform`, spoken | `transform`, spoken, keyboard as fallback | spoken, typed | keyed |
| RDG Reading | Reading | `tfng`, at most 2, on one notice | `read_aloud` of the line of the notice the first item turned on | `read_aloud` of the line that answers it. From B1 also `open_response`: say the claim in your own words | spoken | keyed |
| WRT Writing | Writing | `dictation`, then `tap_order` of the key sentence | The key sentence said aloud to the coach before any typing | Step 5 `correct_message` or `short_production`, typed, 15 words at A1 rising to 300 at C1 (the band per level is in §2.2). Step 6 one key sentence, 8 to 15 words, typed, inside 0:25 | typed at steps 5 and 6, spoken at step 3 | ai |
| LST Listening | Listening | `listen_and_do`, natural speed, no replay before the first attempt. May repeat twice, see below | `shadow`: say back the number or line just heard | `shadow` or `dialogue_turn`, the number or line said back inside an exchange. From B1 also `open_response`: say what the speaker wanted | spoken | keyed |
| SPK Speaking | Speaking | Support turns: `say_it_see_it`, `read_aloud`, `open_response` (§1.5) | `open_response` through the coach | `read_aloud`, `open_response`, all through the coach | spoken | ai |
| MED Mediation | Explaining | `tfng` on the source, then `tap_order` of the relay sentence | `relay` of the first of the three things | `relay` to a named listener who cannot see the source | spoken | ai |
| INT Interaction | Talking with someone | Support turns: `say_it_see_it`, `read_aloud`, `open_response` (§1.5) | `dialogue_turn` with the coach | `roleplay` / `dialogue_turn`. The partner creates one problem to repair | spoken | ai |

Cut on LP-20 and not to be authored: `gap_fill`, `gist_mcq`, `inference_mcq`, `heading_match`, `time_slider`, `vote_see_revote`, `pick_picture` with emoji, `sentence_build` (merged into `tap_order`), `explain_chart`, `translate_gist`, `picture_describe`.

Two notes on the type names, so an author is never guessing:

- **`listen_and_do` is LP-20's rename of `pick_picture` (numbers), with `detail_gap` folded into it** (`docs/exercises.md`, the LST rows). It is not yet a member of `ItemType` in `lib/learning-path/types.ts`; adding it, and removing the eleven cut names, is LP-20 part 2's change to `types.ts`, `items.tsx` and `content.ts`. Author against this spec and the name will exist when the chunk ships.
- Everything else named above is already in `ItemType`.

**May a scaffold type repeat inside a chunk? Yes, up to twice**, which answers R5's second half. LST is the case that forces the ruling: `listen_and_do` is its only in-strand scaffold, so a dense LST chunk is two `listen_and_do` items on different numbers plus the one permitted cross-strand scaffold. The conditions: no two items share a target sentence, the second use is harder than the first (a closer minimal pair, a faster delivery), and the third step 4 item must be a different type. The §4.4 interleaving guard does **not** forbid this: it applies across the session's phases, not inside one chunk, where every item is one target by §1.1.

Cross-strand rule: a chunk may use at most one step 4 item from outside its own strand, and no step 4 item is ever mastery evidence. Mastery evidence is always the production step, in the strand's own modality (transfer-appropriate processing, Morris et al. 1977).

Two consequences worth stating:

- Every strand now has a spoken step 3 and a production step 5, so the two-modality rule in §3.2 (Known needs two modalities, one of them productive) is satisfied by the spine itself rather than by hoping a production item turns up. WRT banks both modalities inside one chunk: spoken at step 3, typed at step 5.
- Every delayed check is a production of the whole sentence, said aloud in six strands and typed in WRT. On LP-20 all six delayed checks in `content.ts` were `gap_fill`, so the one moment that decided mastery was a three-way tap.

Enabler chunks (grammar, vocabulary, pronunciation) carry the GRM or SPK item set but are never credited as communicative mastery. Their mastery is inferred from correct use in three communicative productions (PRD: grammar and vocabulary are enablers, not modes).

### 1.8 Instructions inside a chunk

Learners may have almost no English. The chunk is only usable if it works with the text muted.

| Rule | Limit |
| --- | --- |
| Instruction length | 6 words maximum, 2 lines maximum per screen |
| Every instruction carries | An icon, a 2 second animation, or a worked example. Example before rule, always |
| Language of instructions | L1 to A2, English with tap-to-translate from B1, English on demand from B2, learner can override |
| Audio | Every word, sentence and instruction has tap-to-hear; audio auto-plays on first exposure; 0.75 and 1.0 speed |
| The "why" line after a wrong answer | 12 words maximum, shows the correct form in context, in L1 below B1 |
| Lesson text | English only. L1 is the interface and the caption, never the lesson |
| Forbidden | A rule on screen anywhere, grammar metalanguage below B1, red, any "wrong" wording, counters, a visible countdown below B1, a score row shown before the learner has spoken |

**A response window is not a timer, which answers R12.** The window in §2.2 and §5.3 (20 s at A1 up to 90 s at C1) is how long the coach waits before she offers help. Below B1 nothing counts down on screen, the window never ends the attempt, and the learner can take as long as they like; the window only decides when a prompt reappears. What is forbidden below B1 is a **visible countdown that ends the turn**. The one exception is the fluency chunk in §4.4, where time pressure on known material is the point and the timer is visible and opt-in below B1 (Nation, 4/3/2).

Why: errors are information and corrected errors beat errorless learning (Metcalfe 2017), so feedback shows the right form rather than a penalty. Feedback is a patient person, not a mark: say it again slowly, show it big, one more try.

### 1.9 The chunk schema an author or a model fills in

One chunk is one JSON object. Field names match `Atom` in `lib/learning-path/types.ts`, so an author's output is loadable without translation. `cuts` is the one field this spec adds, per §1.6.

```json
{
  "atom_id": "ATM-A2-INT-0001",
  "version": 1,
  "criterion_id": "CRI-A2.1-INT-01-01",
  "strand": "INT",
  "sublevel": "A2.1",
  "type": "video",
  "variant": "standard",
  "language_use": true,
  "title": { "en": "Two coffees, please", "ar": "...", "es": "..." },
  "target_items": ["ITM-INT-0101", "ITM-INT-0102", "ITM-INT-0103", "ITM-INT-0104", "ITM-INT-0105", "ITM-INT-0106"],
  "prerequisites": ["CRI-A2.1-GRM-02-01"],
  "phases": [
    { "kind": "input", "media": { "kind": "video", "title": "...", "presenter": "...", "lines": [{ "text": "I'd like two coffees, please.", "at": 12, "target": true }], "duration_sec": 34, "l1_card": { "en": "..." } } },
    { "kind": "noticing", "highlight": "I'd like", "why": { "en": "Ask for it this way.", "ar": "..." } },
    { "kind": "free_use", "items": ["ITM-INT-0101"] },
    { "kind": "controlled", "items": ["ITM-INT-0102", "ITM-INT-0103", "ITM-INT-0104"] },
    { "kind": "free_use", "items": ["ITM-INT-0105"] },
    { "kind": "check", "items": ["ITM-INT-0106"], "delayed": true }
  ],
  "cuts": { "standard": ["ITM-INT-0104"], "light": ["ITM-INT-0104", "ITM-INT-0103"] },
  "status": "published"
}
```

Read the `phases` array against §1.2: `input` is the scene, `noticing` is the notice, the first `free_use` is say it with a response, `controlled` is step 4, the second `free_use` is use it, and `check` is come back later. The order of this array is the lesson order, so it is the one thing in the file an author may not rearrange.

**`target_items` is the chunk's own item list, which answers R7.** It holds exactly the IDs the `phases` carry, in the same order: six at dense, and the cut lists do not change it. The v1.1 example listed two IDs that appeared in no phase, which breaks three things in the engine, all keyed off `targets` in `scoreNewAtoms` (`engine.ts:339-346`): `predicted_success` would sit at its 0.80 default for ever, the already-served penalty would never fire, and the re-teach bonus would never fire. It also left §1.1's "what counts as new is a target item" with no referent. The convention is already uniform in the bank: `ATM-A2-INT-0001` lists its six `ITM-INT-01xx` (`content.ts:235`), and so do the other seven atoms. Note the IDs in this example match that convention too, because an author copying a schema copies its ID shape as well.

Cut order follows §1.6: step 4 is authored most supportive first, so the cut lists drop `0104` then `0103`, never `0102`.

ID conventions, all stable and never reused:

| Entity | Pattern | Example |
| --- | --- | --- |
| Outcome | `OUT-{sublevel}-{STRAND}-{nn}` | `OUT-A2.1-INT-01` |
| Criterion | `CRI-{sublevel}-{STRAND}-{nn}-{nn}` | `CRI-A2.1-INT-01-01` |
| Chunk | `ATM-{level}-{STRAND}-{nnnn}` | `ATM-A2-INT-0009` |
| Story chunk | `STO-{level}-{nnnn}` | `STO-A2-0001` |
| Item | `ITM-{STRAND or type}-{nnnn}` | `ITM-INT-0003` |

### 1.10 Author's completeness checklist

A chunk is not finished until all thirteen are true. This is the list QA runs, and items 4, 5 and 7 are the lesson order made checkable.

1. One criterion, one "I can" line of 10 words or fewer.
2. The scene carries the phrase in a situation where the meaning is obvious, its first pass is 35 s or less to B1 and 45 s or less from B2, and 95% of its language is already known at this sub-level.
3. Exactly one new target form or phrase, highlighted once in the notice step. The notice is 12 s to B1, 8 s from B2.
4. **The mic is live by 0:50 to B1, by 0:55 from B2, never later than 1:00.** Timed on a stopwatch against the built lesson, not read off the script.
5. `phases` is authored in the order `input`, `noticing`, `free_use`, `controlled`, `free_use`, `check`, and `target_items` holds exactly the IDs those phases carry.
6. Six items in the dense bank, with `cuts.standard` and `cuts.light` marked, dropping the last step 4 item then the last two, and no cut touching a `free_use` or `check` item.
7. **Every item ends with the learner producing the whole sentence**, aloud in six strands and typed at WRT's steps 5 and 6. Any tap or drag hands straight to production.
8. The production step for the strand is present, in the strand's own modality, per §1.7.
9. No rule on screen anywhere, and no caption that explains instead of showing.
10. Every instruction is 6 words or fewer and carries an icon or a worked example.
11. Every miss shows the right form said slowly and shown big, then one more try, with a 12-word why in context. No red, no mark, no counter.
12. The closing line, the delayed production stem and the "I can" line use the same wording. All media has alt text, all video has captions, all text has tap-to-hear.
13. Prerequisites are listed as criterion IDs, and each one really is needed.

---

## 2. CEFR map, A1 to C1

### 2.1 Grid

Thirteen sub-levels exist in the product (`SubLevel` in `types.ts`). This map covers A1 to C1 as the ticket asks. Pre-A1 is a bridge, below; C2 reuses the C1 shape with greater range.

| Level | Sub-levels | Outcomes (all 7 strands) | Chunks at 2 per criterion | Typical daily use to clear the level |
| --- | --- | --- | --- | --- |
| Pre-A1 | PreA1.1, PreA1.2 | 30 | about 180 | 6 to 8 weeks |
| A1 | A1.1, A1.2 | 56 | about 336 | 10 to 12 weeks |
| A2 | A2.1, A2.2 | 72 | about 430 | 12 to 14 weeks |
| B1 | B1.1, B1.2 | 88 | about 530 | 16 to 20 weeks |
| B2 | B2.1, B2.2 | 98 | about 590 | 20 to 24 weeks |
| C1 | C1.1, C1.2 | 84 | about 500 | 24 to 30 weeks |

Pacing rule: 8 to 10 can-do outcomes per sub-level per strand group, one can-do per week, which is what gives the "10 to 12 weeks per sub-level at 10 minutes a day" figure in the PRD. Progress is credited per strand, so a learner is normally at two or three different sub-levels at once; the Road shows the lowest, "How I'm doing" shows the range.

### 2.2 Can-do descriptors per strand

Adapted from the CEFR Companion Volume, shortened to learner-readable English. Each is the parent of 1 to 4 criteria.

**The third column is the production step that carries the mastery decision, and it is drawn from §1.7, which answers R2.** The v1.1 column was built from the old item bank and named nine types §1.7 cuts, including four multiple-choice ones, so an author writing A1 reading from this table would have made a `picture_match` the thing that decides mastery. The production step is the same type all the way up a strand; what changes with the level is the length, the speed and the support withdrawn. The response windows below are windows, not countdowns (§1.8).

**A1**

| Strand | Can do | Mastery decided by |
| --- | --- | --- |
| GRM | Can use I am, I have, this is and the simple present of about 20 common verbs to make short statements | `transform`, spoken |
| RDG | Can understand single words and very short phrases on signs, labels and menus, with picture support | `read_aloud` of the words on the sign that answer the question |
| WRT | Can complete a simple form and write 2 to 3 phrases about themselves | `short_production`, 15 to 25 words typed |
| LST | Can recognise familiar words, numbers to 100, prices and clock times in slow, clear speech | `shadow`: the number or word said back |
| SPK | Can describe themselves, where they live and what they do, in short simple phrases | `open_response`, 20 s window |
| MED | Can pass on one fact (a time, a price, a place) from a short text to another person | `relay` |
| INT | Can ask and answer simple questions about immediate needs, with repetition and help | `dialogue_turn` |

**A2**

| Strand | Can do | Mastery decided by |
| --- | --- | --- |
| GRM | Can use past, present and future of common regular verbs, countable and uncountable quantity, and and / but / because | `transform`, spoken, across two time references |
| RDG | Can understand short notices, signs, menus and messages, and say what is and is not stated | `read_aloud` of the line that answers the `tfng` item, then say which part is not stated |
| WRT | Can write a message or note of 20 to 50 words that asks or answers a question | `correct_message` or `short_production`, 20 to 50 words typed |
| LST | Can understand the main point and key details of short announcements and simple conversations, including similar numbers such as fourteen and forty | `shadow`: the confusable number or line said back |
| SPK | Can give a short prepared description of a routine, a job or a recent event in connected sentences | `open_response`, 30 s window |
| MED | Can tell a friend the key points of a simple notice or bill and say what they must do | `relay`, three things, named listener |
| INT | Can handle a short everyday exchange, ask for repetition, and respond when something is not available | `roleplay` with one problem to repair |

**B1** (academic strand starts here, see 2.3)

| Strand | Can do | Mastery decided by |
| --- | --- | --- |
| GRM | Can use present perfect, past continuous, first conditional and modals of obligation and advice with reasonable accuracy on familiar topics | `transform`, spoken, model withdrawn |
| RDG | Can understand the main points and specific detail of straightforward factual texts, letters and online articles | `read_aloud` of the claim, then say it again in the learner's own words |
| WRT | Can write a clear connected text of 100 to 150 words with a simple structure, such as an email or a complaint | `short_production`, 100 to 150 words typed |
| LST | Can follow the main points of clear standard speech, including longer announcements, instructions and short talks | `dialogue_turn`: say back what the speaker asked for, inside an exchange |
| SPK | Can give a straightforward description or short talk on a familiar topic and explain reasons | `open_response`, 45 s window |
| MED | Can summarise the main points of a short factual text or talk for someone who has not seen it, reformulating rather than copying | `relay`, source overlap capped at 60% |
| INT | Can take an active part in routine conversation and transactional calls, and repair a misunderstanding | `roleplay`, two turns of repair |

**B2**

| Strand | Can do | Mastery decided by |
| --- | --- | --- |
| GRM | Can use a broad range of tense, aspect, passive, relative clause and hedging forms so that errors rarely cause misunderstanding | `transform`, spoken, with the hedge chosen by the learner |
| RDG | Can read articles, reports and correspondence on contemporary issues and identify the writer's position | `open_response`: state the writer's position in the learner's own words |
| WRT | Can write a clear, detailed text of 180 to 250 words that develops an argument and weighs options | `short_production`, 180 to 250 words typed |
| LST | Can understand extended speech, talks and news, and follow a complex line of argument on reasonably familiar subjects | `open_response`: say the line of argument back, from the learner's own notes |
| SPK | Can give a clear, systematically developed talk with reasons and examples, and handle questions | `open_response`, 60 s window, then one unseen question |
| MED | Can summarise a complex text for someone who has not read it, adapt the register to the listener, and signal source and stance | `relay`, register set by the named listener |
| INT | Can interact with fluency and spontaneity, hold their own in a discussion, account for views and negotiate an outcome | `roleplay`, partner disagrees once |

**C1**

| Strand | Can do | Mastery decided by |
| --- | --- | --- |
| GRM | Can use complex structures, including cleft, inversion, nominalisation and modal hedging, flexibly and with consistent control | `transform`, spoken, the learner chooses the structure |
| RDG | Can understand long, demanding and specialised texts and appreciate implicit meaning and style | `open_response`: the implied stance, with the evidence for it |
| WRT | Can write clear, well-structured texts of 300 words or more on complex subjects, choosing the style for the reader | `short_production`, 300 words or more typed |
| LST | Can understand extended speech even when it is not clearly structured and relationships are only implied | `open_response`: the unstated relationship between two points |
| SPK | Can give a clear, well-structured talk on a complex subject, develop points, digress and return, and deliver it fluently | `open_response`, 90 s window, then two unseen questions |
| MED | Can act as an informal interpreter, relay complex information clearly, and mediate between people who disagree | `relay` in both directions between two speakers |
| INT | Can use language flexibly and precisely for social, academic and professional purposes, with skilful turn-taking | `roleplay`, the learner holds a position under challenge |

**Pre-A1 bridge** (launch scope, outside the ticket's A1 to C1 range): survival only. Can recognise the written alphabet and numbers to 20; can say and understand greetings, their own name, nationality and job; can respond to a yes or no question about an immediate need; can point to the right picture for 100 very frequent words. All seven strands exist but MED and INT carry two outcomes each, and every instruction is in L1 with audio.

### 2.3 Academic English, a strand from B1 upwards

Academic English is **a tag, not an eighth strand**. Outcomes from B1 upwards carry `academic: true`, and the path lifts their quota when the learner's stated goal is study. Reasons: the academic can-dos decompose cleanly into the existing seven modes; a separate strand would need its own bars on "How I'm doing" and would break the seven-bar design; and the tag lets Access to Education filter a report without a parallel framework.

This is a proposal that answers PRD open question Q4 and needs the Academic Lead and ST to confirm. Everything else in this spec works either way.

| Level | Strand | Academic can-do (tagged ACAD) |
| --- | --- | --- |
| B1 | RDG | Can find the main claim and two supporting points in a short academic text |
| B1 | WRT | Can write a paragraph with a topic sentence and two supports |
| B1 | LST | Can take simple notes from a 2-minute lecture extract |
| B1 | INT | Can contribute a point and ask one question in a seminar-style discussion |
| B2 | RDG | Can distinguish claim, evidence and interpretation in an academic article |
| B2 | WRT | Can write an essay paragraph set with citation signalling and a counter-argument |
| B2 | LST | Can follow a 5-minute lecture and note the main points and their supports |
| B2 | MED | Can summarise two sources on one topic for a classmate who has read neither |
| B2 | INT | Can disagree with a seminar point and give grounds without causing offence |
| C1 | RDG | Can read a research article critically and evaluate its method |
| C1 | WRT | Can write an extended academic argument that integrates sources |
| C1 | LST | Can follow an unstructured lecture and the question session after it |
| C1 | MED | Can synthesise two conflicting sources and state where they disagree |
| C1 | INT | Can defend a position under challenge in a viva-style exchange |

Quota rule: when `learner.why === "study"`, academic-tagged outcomes take 40% of new chunks from B1 upwards; otherwise 15%. Below B1 the tag does not exist and the quota is 0.

---

## 3. Repetition schedule

### 3.1 The one sentence the learner sees

> We bring each thing back just before you forget it, and sooner if you get it wrong.

That line lives in the i18n files for all seven interface languages and is the only explanation the learner is ever given. There is no "review mode" to find and no recall phase to sit through: a due item comes back inside the day's scene, because the situation needs it (§1.3).

### 3.2 The ladder

Each item (phrase item, pattern, pronunciation feature) has its own forgetting curve per learner. Recall probability is `p = 2^(-elapsed_days / half_life_days)`. An item is **due when p falls to 0.8**, which is `elapsed = 0.3219 x half_life`, **or at the rung's interval cap, whichever comes first** (§3.2.1).

Each state has two rungs, `rung: 0` and `rung: 1` on `ItemMastery`. The second rung is earned by surviving a gap, never by being asked more often.

| State | Entered when | Half-life floor, rung 0 then rung 1 | Rung 1 earned by | Interval: at the floor, and the cap (§3.2.1) | How it comes back |
| --- | --- | --- | --- | --- | --- |
| New | First exposure | 0.1 | n/a | Same session | Said with the sentence still on screen, in the use step |
| Learning | 1 correct retrieval | 1 | n/a | 0.3 days, capped at 1 | As the sentence a step 4 scaffold is built from (§1.3) |
| Consolidating | 3 correct across 2 or more days | 3, then 7 | A correct retrieval after a gap of **2.5 days or more** | 1 then 2.3, capped at 2.5 then 7 | Said from a cue, no sentence shown. From here it can ride into step 5 |
| Known | Correct after a gap of 7 days or more, in 2 modalities, one of them productive | 14, then 30 | A correct retrieval after a gap of **12 days or more** | 4.5 then 9.7, capped at 12 then 30 | Free production in a new scene, as a step 5 `tryItem` |
| Mastered | Correct after a gap of 30 days or more in a productive modality | 60, then 120 | A correct retrieval after a gap of **50 days or more** | 19 then 39, capped at 50 then 60 | Only inside fluency and interaction chunks |
| Retired | 180 days at Mastered | n/a | n/a | Spot check every 21 to 28 days | Free use only |

The rung gates in column four were implemented but unpublished, which was R10: they are `elapsedDays >= 2.5`, `>= 12` and `>= 50` in `applyAttempt` (`engine.ts:105`, `:111`, `:115`), and §3.5 silently turns on the first of them. The state gates are in the same function: `>= 7` with two modalities for Known (`engine.ts:103`), `>= 30` with a productive modality for Mastered (`engine.ts:109`). A developer now has every number the trace depends on.

Note what the last column no longer says. The earlier version of this table had items returning as recognition at New and Learning, which is the half of the review stack the board ruled out. Every rung of the ladder is now a production event; what changes with the rung is how much scaffolding is left standing when the learner produces it.

Important: the half-life column is the **floor applied on entering the state**, not the interval the learner gets. The multipliers below compound on top of it, so without a ceiling the real intervals run far longer than the published ladder. That ceiling is the next section.

### 3.2.1 The interval cap

**Rule.** The scheduler presents a due item at

```
next_due = last_seen + min(0.3219 x half_life_days, CAP[state][rung]) days

CAP = { learning:      { 0: 1,    1: 1  },
        consolidating: { 0: 2.5,  1: 7  },
        known:         { 0: 12,   1: 30 },
        mastered:      { 0: 50,   1: 60 },
        retired:       { 0: 28,   1: 28 } }     // days
```

New items are served in the same session and take no cap. The learner is served on the first session on or after `next_due`, so in practice intervals round up to the next session day.

**Why those numbers and not others.** Each cap is that rung's own promotion gap, so a gate the spec publishes is a gate the schedule can actually reach: 2.5 is the Consolidating rung gate, 7 is the Known gate, 12 is the Known rung gate, 30 is the Mastered gate, 50 is the Mastered rung gate. A naive cap at the published half-life would have frozen the ladder: an item capped at 7 days of half-life is presented every 2.25 days and never clears the 7-day gap Known requires, so it would sit at Consolidating for ever. The longest an item is ever unseen becomes **60 days**, which is inside the 180-day retirement rule rather than three times it.

**What it changes.** Three things, and only the third is a loss:

| | Without the cap | With the cap |
| --- | --- | --- |
| Mastered arrives | day 129 | **day 60** (§3.5.1) |
| Longest gap before Mastered | 79 days | 30 days |
| Longest gap after Mastered | 221 days | 60 days |
| Retrievals to Mastered | 9 correct plus 1 miss | 9 correct plus 1 miss, the same |
| Reviews the learner does | fewer, spread wider | about 2 more per item per year |

The cost is honest: slightly more review. Cepeda et al. 2006 puts the optimal gap at 10 to 20% of the retention interval, and a 221-day gap is only optimal if we are testing for retention at three years, which is not what a learner on a 12-week level is doing.

The learner-facing sentence in §3.1 does not change, because the cap only ever moves an item **earlier**: "just before you forget it" is still true when we ask a little sooner than that.

**Implementation note.** This is a cap on the **interval**, not on `half_life_days`, so the multipliers, `recallProbability` and the strand strength maths are untouched. `nextReviewAt` takes the `min`, and `isDue` becomes `at >= nextReviewAt(m)` rather than a second `p <= 0.8` test, so the two cannot disagree. Until the PRD's half-life regression model exists in `lib/` the cap has no hand-over condition and applies at every attempt count; the PRD's "6 or more attempts" condition is recorded in §7 row 6 and does nothing today, because there is nothing to hand over to.

Why expanding intervals: Cepeda et al. 2006, the optimal gap is 10 to 20% of the retention interval. Why the review budget is owned by the engine and not the learner: PRD rule 2.

On a correct retrieval the half-life is multiplied by:

| Modality of the correct retrieval | Multiplier | Reason |
| --- | --- | --- |
| recognition, cued | 2.0 | Baseline. Inside a lesson only `cued` occurs, because the scaffolds hand to the mic; `recognition` now comes only from placement and checkpoints, which stay scores-only by product rule |
| typed | 2.4 | Production is a stronger memory event |
| spoken | 2.8 | Strongest, and the strand we most need practised |
| any, but slow (above the learner's 80th percentile response time for that item type) | 0.8, no state change | A slow correct is a weak trace |

The two-modality rule: an item cannot reach Known until it has been retrieved correctly in at least two modalities, one of them productive (`modality_mask` on `ItemMastery`). Recognition alone never buys Known.

### 3.3 What a miss does

| Situation | Half-life | State | Also |
| --- | --- | --- | --- |
| Wrong at New | reset to 0.1 | stays New | Comes back in this session's use step, inside the exchange |
| Wrong at Learning or Consolidating | halved, floor 0.1 | unchanged | Comes back in this session's use step, then in tomorrow's scene |
| Wrong at Known or Mastered | reset to 3 days | drops to Consolidating | Never to zero: relearning is fast |
| Two consecutive misses on the same item | as above | as above | `reteach = true`, so the next session's new chunk is replaced by that item's **scene**, not by a correction |
| Hesitation or self-correction in speech | no change | no change | Logged, never penalised |

A missed item also returns once at the end of the same chunk: the right form said slowly and shown big, then one more try. No lives, no hearts, no lockout, no red, no mark, anywhere (PRD R9, board note point 5).

Two returns, which are not the same thing and a developer should not conflate them. The **same-session** return in the table above is the requeue `applyAttempt` already sets (`requeue: true`), and it happens inside the chunk the learner is in, with the sentence on screen. The **next-session** return is §1.3's, by state: step 4's sentence at New and Learning, step 5's `tryItems` at Consolidating and above. An item can therefore be seen twice today and once more in two days, and only the second kind is scheduled.

### 3.4 How mastery is decided

Two levels, and only the second one moves the Road.

**Item level** is the ladder in 3.2, used by the scheduler.

**Criterion level** is the mastery gate.

| Criterion type | Pass on one sitting | Mastered when |
| --- | --- | --- |
| Keyed (GRM, RDG, LST, and keyed INT) | 3 or more items attempted and at least 75% correct, of which at least one is the strand's production step (§1.7) | Passed on two sittings on two different calendar days |
| AI-scored (WRT, SPK, MED, and AI INT) | Rubric score 0.70 or above, confidence 0.60 or above | Passed on two different days, and the second task is one the learner has not seen |

Why the separate-day rule: it is the cheapest defence against mastery inflation from item exposure and guessing (PRD risk 6). Why 0.80 as the target success rate rather than 1.0: Wilson et al. 2019.

Decay: a mastered criterion is re-sampled with one item every 21 to 28 days. Two consecutive misses set it to `shaky`, which puts its chunks back in the candidate pool. On screen a decayed stop never says "lost"; it fogs, and the word is "review" (design rules: progress never moves backwards).

Outcome and level gates:

| Gate | Condition |
| --- | --- |
| Chunk complete | The scene watched to 80% and the first spoken turn taken. A lesson the learner did not speak in is not complete |
| Outcome achieved | All of its criteria mastered |
| Strand marker advances | All outcomes in that strand at that sub-level achieved |
| Sub-level provisional | 80% of the sub-level's outcomes achieved and no strand below 60% strength. From here, 30% of new chunks come from the next sub-level |
| Sub-level confirmed | An AZE checkpoint only, offered after 7 clear days and either day 28 or the provisional condition above |
| Level confirmed | A full AZE test, every 12 to 16 weeks |

The app never demotes on a lower checkpoint. It reweights towards the weak strand, and two consecutive disagreements between in-app mastery and the checkpoint trigger an item review.

### 3.5 One item, first meeting to Mastered (worked)

Phrase item `ITM-INT-0001` "I'd like", first met on day 1 in `ATM-A2-INT-0001`. This trace was run against the rules as implemented in `applyAttempt` and `nextReviewAt`, so QA can reproduce it line by line. "Next due" is the day the scheduler will surface the item, which is why the learner is not asked on every intervening day.

| Day | Event | Modality | Half-life before | After | State after | Next due |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | First exposure in the scene, then said inside the use step of the same session: correct | cued | 0.1 | 1.0 | Learning | 1.3 |
| 2 | Rides into day 2's use step as a `tryItem`, said from the tiles: correct | cued | 1.0 | 2.0 | Learning (2 correct, needs 3) | 2.6 |
| 3 | Supplies the sentence for a day 3 scaffold, then said alone: correct, 3 correct across 3 days | spoken | 2.0 | 5.6 | Consolidating | 4.8 |
| 5 | Due. Free-use task: **wrong** | spoken | 5.6 | 2.8 | Consolidating, re-queued today and tomorrow | 5.9 |
| 6 | Comes back in the use step, said from a cue: correct | cued | 2.8 | 5.6 | Consolidating | 7.8 |
| 8 | Due. Said from a cue inside a new scene: correct. Gap of 2 days, so no rung advance | cued | 5.6 | 11.2 | Consolidating | 11.6 |
| 12 | Due. Say it: correct. Gap of 4 days, rung advances | spoken | 11.2 | 31.4 | Consolidating, rung 1 | 22.1 |
| 22 | Due after a 10-day gap, two modalities banked, one productive | spoken | 31.4 | 87.8 | **Known** | 50.3 |
| 50 | Due. Free production in an interaction chunk: correct | spoken | 87.8 | 245.9 | Known, rung 1 | 129.2 |
| 129 | Due after a 79-day gap, productive modality | spoken | 245.9 | 688.4 | **Mastered** | 350.6 |

This table is the engine **as built**, with no interval cap. QA reproduced all ten rows cell for cell from `applyAttempt` and `nextReviewAt`, so it stays in the document as the baseline the cap is measured against. §3.5.1 is the same item under §3.2.1.

Four things to read off it. The schedule is self-correcting. A miss costs days, not weeks. Spoken retrievals carry the item fastest, which is what we want from a product whose weakest competitor feature is speaking. And the promotion gates are gap-based, not calendar-based, so Known arrives on day 22 rather than day 15: an item cannot be promoted by being asked often, only by surviving a long gap.

The last two rows are the problem §3.2.1 now fixes. Because each correct retrieval multiplies the half-life with no ceiling, the **eighth** correct retrieval, on day 50, schedules the item 79 days out, and the ninth, on day 129, schedules it 221 days out. (v1.1 said "nine retrievals, 79 days"; QA's count is the right one, and the retrieval numbering is days 1, 2, 3, 6, 8, 12, 22, 50 for one to eight, the day-5 miss not counting.) An item unseen for 221 days is not spaced repetition, it is forgetting, and it is longer than the 180-day retirement rule assumes.

### 3.5.1 The same item under the interval cap

Same item, same ten events, same modalities, same miss on day 5. The only difference is §3.2.1's `min`. Dates are session days, so an interval is served on the first session on or after it.

| Day | Event | Modality | h before | After | State after | Rung | Interval | Next served |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | First exposure, then said in the use step: correct | cued | 0.1 | 1.0 | Learning | 0 | 0.32, uncapped | day 2 |
| 2 | Step 4 scaffold sentence, then said: correct | cued | 1.0 | 2.0 | Learning, 2 correct | 0 | 0.64, uncapped | day 3 |
| 3 | Said alone: correct, 3 correct across 3 days | spoken | 2.0 | 5.6 | Consolidating | 0 | 1.8, uncapped | day 5 |
| 5 | Free-use task: **wrong** | spoken | 5.6 | 2.8 | Consolidating | 0 | 0.9, uncapped | day 6 |
| 6 | Said from a cue: correct | cued | 2.8 | 5.6 | Consolidating | 0 | 1.8, uncapped | day 8 |
| 8 | Said from a cue in a new scene: correct. Gap 2, under 2.5, no rung | cued | 5.6 | 11.2 | Consolidating | 0 | **2.5, capped** from 3.6 | day 11 |
| 11 | Say it: correct. Gap 3, so rung 1 | spoken | 11.2 | 31.4 | Consolidating | 1 | **7, capped** from 10.1 | day 18 |
| 18 | Gap 7, two modalities banked, one productive | spoken | 31.4 | 87.8 | **Known** | 0 | **12, capped** from 28.3 | day 30 |
| 30 | Free production in an interaction chunk: correct. Gap 12, so rung 1 | spoken | 87.8 | 245.9 | Known | 1 | **30, capped** from 79.1 | day 60 |
| 60 | Gap 30, productive modality | spoken | 245.9 | 688.4 | **Mastered** | 0 | **50, capped** from 221.6 | day 110 |

After that: day 110 clears the 50-day gate, so rung 1 and a 60-day interval; day 170 and every 60 days after it; 180 days at Mastered falls on day 240, when the item retires to a 21 to 28 day spot check.

What to read off it. The first five rows are **identical** to §3.5, because at those intervals the forgetting curve is the binding constraint and the cap is not. The cap first bites on day 8. Known arrives on day 18 instead of day 22 and Mastered on day 60 instead of day 129, on the same nine correct retrievals, because the item is asked at the gate rather than long after it. The learner's experience of the difference is roughly two extra sightings of that item in its first two months, and never a two-thirds-of-a-year gap.

### 3.6 Review budget

Overdue non-provisional items are counted at session start. **Above 25, new chunks pause** and the session is review and fluency only (PRD rule 2: content must not outrun memory). Items marked provisionally Known by placement do not count towards the cap, because they are verification rather than backlog.

---

## 4. Path logic

Written as numbered rules against the implemented types. A developer should be able to read sections 1 and 4 alone and build it: section 1 is the order inside a session, section 4 is which content the session gets.

### 4.1 Inputs

| Input | Source | Type |
| --- | --- | --- |
| Starting ability per strand | AZE placement, 6 to 8 adaptive items, stops after two consecutive misses | `Record<Strand, SubLevel>` |
| Item memory | Every attempt | `Record<string, ItemMastery>` |
| Criterion mastery | Mastery updater | `Record<string, CriterionMastery>` |
| Sessions completed | Session close | `{ day, minutes, spoken, second, completed }[]` |
| Week can-do | Rule 4.3 | `outcome_id` |
| Goal | Onboarding | `work`, `study`, `travel`, `family` |
| Rolling accuracy | Last 20 scaffold and typed first attempts. Spoken attempts are excluded because an AI rubric score is not a right-or-wrong event | number or null |
| Due items | `dueItems(state, now)` | `ItemMastery[]`, split by state into step 5's `tryItems` (`tryToUse`) and step 4's sentences (`dueSentences`), per §1.3 |

### 4.2 Placement to a starting path

1. Placement returns a score per strand. Map each score to a sub-level and store it in `learner.strand_levels`. The lowest of the seven becomes `provisional_sublevel`; `confirmed_sublevel` stays null until a checkpoint.
2. Mark every item belonging to a criterion **below** that strand's starting sub-level as provisionally Known with a half-life of 3 days (`provisionalMastery`). The first fortnight then verifies rather than teaches.
3. Provisional items that are answered wrongly follow the normal Known miss rule: drop to Consolidating at 3 days. The `provisional` flag clears on the first attempt either way.
4. Never show a **score** on day one: no placement number, no percentage, no strand bar. The sub-level **name** may appear from the path reveal onwards, because a label like `A2.1` read as a position on the road is the visible journey the board asked for, not a mark. Anything derived from in-app performance, which is the strand strength bars on "How I'm doing", waits for a week of data. This settles the conflict QA raised between the earlier wording of this rule and the running app, in the app's favour; §7 row 7 records it.
5. A learner who misses every placement item starts at PreA1.1 with a welcome chunk. There is no fail state and no retake prompt.

### 4.3 Choosing the week's can-do

Run on the first session of each week.

1. Candidate outcomes: not achieved, and every criterion's prerequisites met (prerequisite met = that criterion is mastered or its mean item state is Consolidating or better).
2. Keep only outcomes at or below the **strand's own** sub-level from `strand_levels`. Outcomes one sub-level above are admitted only once that strand is provisional at its current sub-level, and then at a 30% share.
3. Apply the academic quota from 2.3.
4. Sort: outcomes at the strand's current sub-level first, then by lowest outcome progress. Take the first.
5. Week shape: days 1 to 3 serve its criteria, day 4 interleaves them with other strands, day 5 is the free-use performance (teach it back) scored against the can-do.

Why one can-do per week: mastery learning needs a stated criterion and a performance against it (Bloom 1984). Why day 4 interleaves rather than blocks: Rohrer and Taylor 2007, interleaving roughly doubles delayed test scores.

### 4.4 Composing a session

Fixed order, so the learner always knows what comes next. The session opens on the scene. Target 10 minutes, hard ceiling 12. This is §1.3 restated as composer rules; where the two differ, §1.3 wins.

| # | Phase | Rule | Minutes |
| --- | --- | --- | --- |
| 1 | New chunk | Rule 4.5, run as the spine in §1.2. The learner is speaking by 0:50 of the session, 0:55 from B2. Skipped if the review cap is hit or a non-second session already completed today | 4 |
| 2 | Use chunk | A second scene: a speaking or interaction task from a chunk already seen, lowest predicted recall first, carrying today's targets plus up to 3 due items at Consolidating or better. On week day 5 this is the teach-it-back performance instead | 3 |
| 3 | Story | One story chunk at 98% or higher known-word coverage for this learner, no checks attached | 1.5 |
| 4 | Close | The delayed production from phase 1, a one-tap "I can / not yet", then the can-do line in plain words | 0.5 |

Due items have no phase of their own. By state (§1.3): at Consolidating or better they are carried into phase 1's step 5 and phase 2 as `tryItems` (`tryToUse`), and at New or Learning they supply the sentences phase 1's step 4 scaffolds are built from (`dueSentences`). That is what "spaced return inside new situations" means, and it is why no learner's item is left without a return path in its first three days.

Variations:

- **Review cap hit** (over 25 overdue): phase 1 is skipped, and phase 2 becomes two use chunks built from the most overdue items. Still two scenes, still no drill.
- **Warm restart** (2 or more days missed): one use chunk and the story, 3 to 5 minutes, plus a welcome-back story unlock. Never a penalty, and any four sessions in a week count as on track.
- **Second session the same day**: one use chunk, one fluency chunk built only from mastered items. No new chunk below B1, ever.
- **First run**: one light chunk plus its close, so install to first completed chunk stays under 4 minutes. Scene-first, so the first spoken turn is inside the first minute of the app.
- **Interleaving guard**, applied to the session's **phase order**: no two consecutive phases from the same strand or the same target pattern, and at least three strands per session. It does not apply inside a chunk, where every item serves one target by §1.1, nor to a repeated scaffold type inside one chunk (§1.7).
- **Fluency** uses mastered items only, with a visible timer, opt-in below B1 (Nation's fluency strand, 4/3/2 technique). This is the one visible countdown the product has, and §1.8 excepts it by name.

### 4.5 Choosing the next chunk

Candidates: chunks whose criterion is not mastered and whose prerequisites are all met (definition in 4.3 rule 1).

```
score = 0.40 x readiness
      + 0.30 x strand_deficit
      + 0.30 x (1 - |predicted_success - 0.80|)
      + 0.25 if the chunk's criterion is in this week's can-do and week day <= 3
      + 0.30 if any target item has reteach = true
      - 0.50 if this chunk has already been served and no target needs re-teaching
      + 0.01 x (1 - strand_strength)        // tie-break towards the weaker strand
```

| Term | Definition |
| --- | --- |
| `readiness` | Fraction of the chunk's prerequisite criteria at Known or better (mean item state 3 of 4, or criterion mastered). 1.0 when there are no prerequisites |
| `strand_deficit` | `clamp((weekly_quota - strand_minutes_this_week) / weekly_quota, 0, 1)`, where `weekly_quota = max(1, week_minutes / 7)` |
| `strand_minutes_this_week` | **Attempts in that strand since `week_start_day`, times 0.5** (`engine.ts:328-329`). It is a proxy: the engine bills every attempt at half a minute rather than timing it. R10 was right that a developer could not derive this, and it is worth knowing it is a proxy, because a strand whose items are slow to answer is under-counted |
| `week_minutes` | Sum of `minutes` over this week's sessions, floored at 1 so the first session of a week cannot divide by zero (`engine.ts:327`) |
| `predicted_success` | Mean recall probability of the chunk's target items. 0.80 when none has been seen, which is why `target_items` must be the real item list (§1.9) |
| `strand_strength` | Item-state weighted mean for that strand, 0 to 1 (`new` 0.1, `learning` 0.3, `consolidating` 0.55, `known` 0.8, `mastered` 1.0, each scaled by `0.5 + 0.5p`), over items passing `isRecallable` (`strandStrength`, `engine.ts:182-192`) |

Take the highest score. Then set the variant from rolling check accuracy: below 0.70 light, above 0.90 dense, otherwise standard. The variant selects the cut list in §1.6, which only ever removes scaffolds.

Why these three terms and not more: prerequisite readiness implements the prerequisite graph, strand deficit implements Nation's four strands in balance (2007, roughly 25% each), and the distance from 0.80 implements the desired difficulty band. Nothing in the formula rewards activity for its own sake.

Plateau rule: a can-do that fails its day-5 performance twice triggers a diagnostic chunk to find the failing component. It never repeats the week unchanged.

### 4.6 Worked example at A1

Fatima, 52, Arabic L1, placement day 0. Scores put her at A1.2 for SPK and GRM, A1.1 for RDG, WRT, LST, MED and INT. `provisional_sublevel = A1.1`. Items below those levels are marked provisionally Known at a 3-day half-life.

**Week can-do.** Candidates with prerequisites met include `OUT-A1.2-SPK-03` "Can describe myself, where I live and what I do" (progress 0.00) and `OUT-A2.1-INT-01` (above her strand level, so excluded by rule 4.3.2). `OUT-A1.2-SPK-03` is at the SPK strand's own sub-level and has the lowest progress, so it is the week's can-do.

**Day 1, next chunk.** No attempts exist yet, so every eligible chunk ties:

| Chunk | readiness | strand_deficit | predicted | Base score | Tie-break `+0.01 x (1 - strand_strength)` | Week bonus | Total |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `ATM-A1-SPK-0005` "Meet Fatima" | 1.00 | 1.00 | 0.80 | 1.000 | +0.010 | +0.25 | **1.260** |
| `ATM-A2-GRM-0002` "Two coffees, some water" | 1.00 | 1.00 | 0.80 | 1.000 | +0.010 | 0 | 1.010 |
| `ATM-A2-LST-0004` "Platform 4, not 14" | 1.00 | 1.00 | 0.80 | 1.000 | +0.010 | 0 | 1.010 |

The tie-break term is in the formula and the code applies it (`engine.ts:348`), so it is in the arithmetic here too, which was R11. At cold start every strand strength is 0, so it adds 0.010 to every row and changes no ranking; it matters on day 30, not day 1.

The cold-start tie is broken entirely by the week's can-do, which is the behaviour we want: day one is never arbitrary. Variant is standard, because fewer than 5 attempts exist, so `cuts.standard` drops the last step 4 item and she gets 2.

Her session, phase by phase, with the clock:

| Clock | Phase | What Fatima does |
| --- | --- | --- |
| 0:00 | `ATM-A1-SPK-0005` scene | Fatima (the character) says who she is outside a shop in Hackney. 33 s, no rule on screen |
| 0:33 | Notice | "I work in" highlighted once, in the frame it was said in, with an Arabic why of 9 words |
| 0:47 | Say it with a response | The coach asks where she works. Fatima speaks. The coach answers what was said. This is her first spoken turn, at 0:47 of her first ever session |
| 1:30 | Say it again | SPK, so 2 support turns in the 80 s window (§1.5): a `say_it_see_it` of "I work in a shop" with the sentence shown, then a `read_aloud` of it with the model withdrawn. v1.1 gave this chunk a `tap_order` and an `error_spot`, which are two GRM items in an SPK chunk and broke the one-cross-strand cap. That was R4's own example |
| 2:50 | Use it | The whole exchange. Nothing due yet, so no `tryItems` ride along |
| 4:00 | Use chunk | A `say_it_see_it` turn on an already-seen item. Nothing is seen yet, so `pickUseItem`'s unseen fallback serves an eligible `say_it_see_it` (`engine.ts:453`) |
| 7:00 | Story | A story at 98% known-word coverage, no checks |
| 8:30 | Close | The delayed say-it of the whole sentence, one tap "I can / not yet", the can-do line |

Nine minutes. No plan screen, no recall drill, and she has spoken four times.

**Days 2 to 5.**

| Day | What the engine does | Why |
| --- | --- | --- |
| 2 | The new chunk is the next criterion of the same can-do. All 6 items from day 1 are due and all 6 are at **Learning**, so 3 of them become the sentences the new chunk's step 4 scaffolds are built from (`dueSentences`) and **none** rides into the use chunk as a `tryItem`, because nothing has reached Consolidating yet. The use chunk runs on its own item | Items at Learning are due at 1 day. A due item returns by its state (§1.3): at Learning the sentence is still shown. This row was R1: v1.1 had 3 items riding in as `tryItems` on day 2, which `tryToUse` cannot do |
| 3 | Fatima misses "I work in a shop" twice. `reteach = true`, so the day 3 new chunk is replaced by the scene for that item (+0.30), and she meets it as a situation again rather than as a correction | Two consecutive errors trigger re-teach before further retrieval |
| 4 | Interleaved session: a GRM enabler chunk (strand deficit 1.00 for GRM), a use chunk carrying 3 due items from a different strand, which by now are at Consolidating and so eligible for `tryToUse`, a story. 4 strands across the session | Day 4 interleaves. No two consecutive phases from one strand |
| 5 | Teach it back: 30 seconds explaining who she is to a beginner character. AI-scored, pass needs 3 of 5 target items used. First pass recorded; mastery needs a second pass on another day with an unseen task | Mastery gates on a can-do demonstrated in free use |

**Day 8.** Three criteria have one pass each. Due count is 14, under the cap, so new chunks continue. The SPK marker on the Road has not moved yet and that is correct: one pass is not mastery.

### 4.7 Worked example at B2

Yusuf, 35, Arabic L1, engineer. Strong grammar and reading, avoids speaking. Placement: GRM B2.2, RDG B2.2, LST B2.1, WRT B2.1, MED B2.1, INT B1.2, SPK B1.2. `provisional_sublevel = B1.2`, `confirmed_sublevel = B2.1` after his week-4 checkpoint. Goal is `work`, so the academic quota is 15%.

**Week can-do.** Candidates at each strand's own sub-level, prerequisites met:

| Outcome | Strand | Outcome progress | Picked |
| --- | --- | --- | --- |
| `OUT-B2.1-RDG-02` "Can identify the writer's position" | RDG | 0.60 | no |
| `OUT-B2.1-INT-07` "Can hold their own in a discussion" | INT | 0.12 | no |
| `OUT-B2.1-MED-04` "Can summarise a complex text for someone who has not read it" | MED | 0.05 | **yes** |

Lowest progress wins, so the week is mediation. This is the point of the rule: Yusuf would have chosen reading.

**Day 2, next chunk.** Three candidates, with his real memory state:

| Chunk | readiness | strand_deficit | predicted | Arithmetic | strand_strength | Tie-break | Week bonus | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ATM-B2-MED-0042` reformulate, do not copy | 1.00 | 0.80 | 0.86 | 0.400 + 0.240 + 0.282 = 0.922 | 0.21 | +0.0079 | +0.25 | **1.180** |
| `ATM-B2-GRM-0051` hedging and stance verbs | 1.00 | 0.20 | 0.94 | 0.400 + 0.060 + 0.258 = 0.718 | 0.79 | +0.0021 | 0 | 0.720 |
| `ATM-B2-SPK-0033` extended turn with examples | 0.50 | 1.00 | 0.55 | 0.200 + 0.300 + 0.225 = 0.725 | 0.31 | +0.0069 | 0 | 0.732 |

The tie-break column is R11's fix here too. Yusuf's strand strengths on day 2 are the reason it is worth printing: it adds four times as much to the mediation chunk as to the grammar one, because he is strong in grammar. It is still a tie-break, not a term that decides anything on its own, and the winner is unchanged.

`ATM-B2-MED-0042` wins. Note what the formula did to the other two: the grammar chunk is penalised for being easy and for a strand already over quota, and the speaking chunk is penalised for unmet prerequisites and a predicted success of 0.55, which is too far below 0.80 to be useful. The engine's answer is that Yusuf is not ready for that speaking chunk yet, not that speaking should be skipped. Its prerequisite criterion rises in the week's candidate set as soon as its readiness clears 1.0, and the use phase gives him a spoken task every single session regardless.

Variant: his rolling accuracy is 0.93, so dense. No cut list applies, so he gets all 3 step 4 items and the full six-item bank.

His session opens on the scene too, and that is the point for a learner like Yusuf. The spec he would have written for himself begins with the rule; the spine puts him in a situation at 0:00 and on the mic at **0:53**, because this is a B2 chunk: a 45 s first pass and an 8 s notice (§1.2). Inside the first minute, and later than an A1 learner's 0:47, which is R3's answer in a worked case. Nothing in the composer lets him opt out of the spoken turn, because there is no phase before it to hide in.

**Day 5 and after.**

| Day | Event | Effect |
| --- | --- | --- |
| 5 | Free-use performance: summarise a 300-word article for a classmate. Score 0.68, below the 0.70 threshold | No pass recorded. Paraphrase ratio was 0.38, so copying is the failing component |
| 8 | The failing component triggers a diagnostic chunk on reformulation, not a repeat of the week | Plateau rule |
| 11 | Second attempt on an unseen source: 0.81. Two passes on two days with two tasks | `CRI-B2.1-MED-04-02` mastered |
| 26 | 80% of B2.1 outcomes achieved, but SPK strand strength is 0.54 | Sub-level **not** provisional. New chunks reweight to SPK until it clears 0.60 |
| 33 | SPK at 0.62. B2.1 provisional, 30% of new chunks now come from B2.2 | Checkpoint offered. Only AZE confirms the level |

### 4.7.1 Pseudocode

```
function nextSession(state, now):
  due        = items where now >= nextReviewAt(item), sorted by p ascending
  overdue    = count(due where not provisional)
  new_ok     = overdue <= 25 and not completedNewToday(state)
  if daysMissed(state) >= 2: return warmRestart(state, due)

  # A due item returns by its state, never as a phase of its own (1.3).
  sentences  = dueSentences(due, states = [new, learning],              max = step4Count(variant(state)))
  tryItems   = tryToUse(due,      states = [consolidating, known, mastered], max = 3)

  phases = []
  if new_ok:
    chunk    = argmax(score(c) for c in candidates(state))
    phases  += sceneLedChunk(chunk, variant(state),
                             scaffoldSentences = sentences,
                             step5TryItems     = tryItems)
  phases += weekDay(state) == 5
            ? teachItBack()
            : useTask(state, todaysTargets, tryItems = tryItems)
  if not new_ok: phases += useTask(state, [], tryItems = next(tryItems, 3))
  phases += story(coverage >= 0.98)
  phases += close(delayedProductionOf(chunk), reflection, canDoLine)
  return phases

# sceneLedChunk emits atom.phases in authored order, check filtered out:
#   input -> noticing -> free_use -> controlled -> free_use
# with phase.items filtered through atom.cuts[variant], and both due-item
# lists passed in: sentences to controlled, tryItems to the second free_use.
#
# Invariant a developer can assert in a test, per band (1.2):
#   firstFreeUseStart(session) <= 50 s   for sublevel <= B1.2
#   firstFreeUseStart(session) <= 55 s   for sublevel >= B2.1
#   firstFreeUseStart(session) <= 60 s   always
# Measured from session start on the built lesson, not from the script.
```

---

## 5. Content spec: how to write a chunk

### 5.1 The author's brief

One row per chunk, filled in before any script is written. Gate A rejects a chunk whose brief is incomplete.

| Field | Rule | Example |
| --- | --- | --- |
| Criterion ID | Exactly one | `CRI-A2.1-INT-01-02` |
| "I can" line | 10 words or fewer, learner-facing, British English | "I can answer when something is not available" |
| Strand and sub-level | From the criterion | INT, A2.1 |
| Scene type | Video if it needs modelling (pronunciation, gesture, interaction), word tutorial otherwise | video |
| The situation | One line: where this happens and why the phrase is needed. If you cannot write it, there is no scene | "The barista has run out of what she ordered" |
| Target | One form or phrase only | "We're out of... / Then I'll have..." |
| Known-language budget | 95% of the scene must already be known at this sub-level; list any word that is not | "oat milk" (glossed) |
| Prerequisite criteria | Only what is genuinely needed | `CRI-A2.1-INT-01-01` |
| Items | 6 authored in the dense bank, `cuts.standard` and `cuts.light` marked | see 1.5 and 1.6 |
| First spoken turn | The coach's opening line and the response she gives to a correct and to a wrong attempt | "Where do you work?" |
| Setting and cast | From the PRD's six recurring characters and its settings list | Shoreditch cafe, Brazilian barista |
| L1 needs | Which lines need an L1 gloss or card | one L1 "what this is" card |

### 5.2 Writing the scene

The scene's first pass is capped so the mic is live inside the first minute (§1.2). The full scene exists, and it is offered as a replay in the close and as the framing of the use step; it is the **first pass** these caps govern.

| Level | First pass | Notice | Mic live by | Full scene | Speech rate | L1 allowance | Word cards before the first spoken turn |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Pre-A1 | 25 s | 12 s | 0:37 | 30 to 45 s | 90 to 100 wpm | L1 subtitles on by default, L1 card at the start | 3 |
| A1 | 30 s | 12 s | 0:42 | 45 to 60 s | 100 to 110 | L1 subtitles optional, gloss 3 to 5 key words | 3 |
| A2 | 35 s | 12 s | 0:47 | 60 to 75 s | 110 to 125 | L1 glosses on tap only | 3 |
| B1 | 35 s | 12 s | 0:47 | 60 to 90 s | 125 to 140 | Tap to translate only | 3 |
| B2 | 45 s | 8 s | 0:53 | 75 to 90 s | 140 to 155 | None | 4 |
| C1 | 45 s | 8 s | 0:53 | 75 to 90 s | 155 to 170 | None | 4 |

The "mic live by" column is the sum of the two before it, and it is the per-band invariant §1.2 publishes: 0:50 to B1, 0:55 from B2, never past 1:00. R3 was right that v1.1's single 0:50 could not hold at B2 on a 45 s first pass; the notice shortens from B2 rather than the scene, because from B2 the notice is the highlight alone with no L1 why.

Three beats in the first pass, every scene, no exceptions: **Situation 40%, the phrase in use 45%, the phrase again 15%.** The beats this replaces were Hook, Notice, Explain, Practise aloud, Recap, and two of those are now gone on purpose:

| Old beat | What happened to it |
| --- | --- |
| Explain, 30% of the video | **Cut.** An explanation standing in for the scene is what the board ruled out, and it was a third of every video |
| Practise aloud, 25% at 60% of runtime | **Cut from the video.** It was the only aloud moment in the old template, it was video-only so word tutorials had none, and it was a beat inside a film rather than a turn with someone. The coach owns it now, as step 3 of §1.2 |
| Recap, 15% | **Moved to the close**, where it is the delayed say-it rather than a card to read |

Video rules that QA checks mechanically: vertical 9:16; captions always available, word-synced to A2 and phrase-level from B1; L1 subtitles a separate toggle, never burnt in; 7 words per caption line and 2 lines maximum; only the target language appears as on-screen text; the target form in the accent colour and nothing else; **no rule, label or grammar term on screen at any point**; one idea per shot; a face on screen for at least 60% of the running time. Explainer videos are 2D flat-vector motion graphics, never 3D (design rules).

### 5.3 Writing the items

General rules:

| Rule | Detail |
| --- | --- |
| Order | **Produce first, then scaffold.** The learner's unscaffolded spoken attempt is step 3; the scaffolds in step 4 exist to repair what that attempt showed. This reverses the old recognise, complete, produce order (generation effect and productive failure: Bjork; Kapur) |
| Every item ends in the whole sentence produced | No item may end on a tick, a tap or a score. A scaffold hands straight to production, with the whole sentence as the thing produced: said aloud in six strands, typed at WRT's steps 5 and 6, and said aloud at WRT's step 3 (§1.2) |
| One target per item | An item that can fail for two reasons teaches nothing |
| Distractors | 3 maximum, each a real learner error (L1 transfer first: Arabic article omission and p/b, Spanish false friends, Hindi retroflex and article use), never a joke option |
| Facility band | Expected 0.4 to 0.9 correct. Outside that band after 30 days live, the item is flagged and revised |
| Feedback | 12 words maximum, says the right form slowly and shows it big, then one more try. Never a rule statement, never a mark |
| Forbidden | "Tap to reveal, mark as known"; any item answerable from a picture or an emoji; any multiple-choice item at all inside a lesson; any score row shown before the learner has spoken; any item whose last screen is not the learner producing |

Per strand, the production step and the scaffold that leads to it:

| Strand | Write it like this | Do not |
| --- | --- | --- |
| GRM | Reorder or spot the error, then say the whole corrected sentence. Transform one sentence into another time or number, spoken, keyboard as fallback | Ask for a rule name, test two forms at once, or end on the tiles being correct |
| RDG | Short authentic notice, at most 2 true / false items on it, then read aloud the line of the notice that answers them | Ask for "not given", match headings, or ask anything answerable without reading |
| WRT | Give a named person and a reason to write: "Amira is late. Ask where she is. Two lines." | Ask for free writing with no audience or purpose, or show a live word counter |
| LST | Natural speed, one replay after the first attempt, confusable numbers and minimal pairs, then say the number or line back | Allow unlimited replays before the first attempt, or use emoji as the "picture" |
| SPK | Give a prompt, a response window (20 to 45 s, a window and not a countdown, §1.8) and a visible target list of 3 to 5 items, through the coach | Score on accent (score intelligibility, rhythm and target use), put a mic under a prompt with score bars after it, or show a countdown below B1 |
| MED | Name the listener and what they cannot do: "Your flatmate cannot read this bill. Tell them the three things they must do." | Allow copying (cap source overlap at 60%), or label the source panel in English |
| INT | The partner must create one problem to repair (out of stock, wrong price, did not hear), and answers in one short sentence so a miss still gives a model | Write a partner who only agrees, or let the chat log grow until the mic leaves a 375x812 screen |

### 5.4 Tone and inclusion

Warm, calm, respectful of adult intelligence. No exclamation marks, no baby talk, no mascot, no guilt. Balanced gender and age including competent over-50s; a range of accents in listening from A2; modest dress options; no alcohol or dating scenarios by default; gentle situational humour only, never at a character's language, religion, nationality or age. British English throughout, concise, no em dashes.

### 5.5 Gates before a chunk goes live

| Gate | Owner | Checks |
| --- | --- | --- |
| A Pedagogical | Senior writer | Section 1.10 checklist, the three scene beats, level lexis against the word list, and the mic timing on the built lesson against the band in §5.2 |
| B Linguistic | QA linguist | Pronunciation, stress, naturalness, caption sync |
| C Accessibility | Accessibility reviewer | WCAG 2.2 AA, alt text, captions, 44px minimum tap targets, visible focus, 4.5:1 text contrast |
| D Bias and cultural fit | Content lead | The inclusion rules in 5.4, across Gulf, UK and international settings |
| E Pilot | Content lead | 20 learners per level: item facility 0.4 to 0.9, chunk drop-off under 10% |

### 5.6 The three-chunk consistency test

This is the ticket's acceptance criterion, and the test QA should actually run. Give one author, or one model, these three briefs and nothing but this document:

1. `CRI-A2.1-LST-03-01` "Hear the difference between fourteen and forty" (keyed, video, A2.1).
2. `CRI-A2.1-WRT-05-01` "A two-line message that asks a question" (AI-scored, word tutorial, A2.1).
3. `CRI-A2.1-MED-06-01` "Tell someone the three things they must do" (AI-scored, video, A2.1, prerequisite `CRI-A2.1-RDG-04-01`).

The three outputs pass if: each has one "I can" line of 10 words or fewer; each has 6 items in a dense bank with `cuts.standard` and `cuts.light` marked, dropping the last step 4 item then the last two, and no cut touching a `free_use` or `check` item; `target_items` holds exactly the IDs the phases carry; `phases` is in the §1.2 order in all three; the first `free_use` phase starts by 0:50 in all three, including the word-tutorial one, these three briefs all being A2.1; every item ends with the learner producing the whole sentence in the modality §1.7 gives its strand; no instruction exceeds 6 words; every miss shows the right form in 12 words or fewer; and the closing line, the delayed production stem and the "I can" line use identical wording. If two authors produce chunks that feel different in difficulty or shape, the template has failed, not the author.

**What each brief needs that v1.1 did not give it**, which is R5. QA tried to author these three from the document alone and brief 2 could not be written. The three answers, all now in §1.2 and §1.7:

| Brief | The question v1.1 could not answer | The answer |
| --- | --- | --- |
| 1, LST | `listen_and_do` is its only in-strand scaffold, so where do 3 step 4 items come from? | Two `listen_and_do` items on different numbers, harder the second time, plus the one permitted cross-strand scaffold (§1.7) |
| 2, WRT | "Ends with the learner saying the whole sentence" against a 20 to 60 word typed message, and a 0:25 delayed say-it of it | Step 3 is the key sentence said aloud, step 5 is the typed message, step 6 is one typed key sentence of 8 to 15 words inside 0:25 (§1.2, §1.7) |
| 3, MED | Nothing: it was authorable in v1.1 and stays so | `tfng` on the source then `tap_order` of the relay sentence, `relay` at steps 3, 5 and 6 |

---

## 6. Evidence, one line each

| # | Principle | Source | Where it is used here |
| --- | --- | --- | --- |
| 1 | Retrieval beats restudy by 30 to 50% at one week | Roediger and Karpicke 2006 | Every item ends in production, never recognition (1.2, 1.7, 5.3) |
| 2 | Optimal spacing gap is 10 to 20% of the retention interval | Cepeda et al. 2006 | Expanding half-life ladder (3.2), and the ceiling on how far it may expand (3.2.1) |
| 3 | Learning is fastest at about 80 to 85% success | Wilson et al. 2019 | Due at p = 0.8, variant switch, 0.30 term in the path score (3.2, 4.5) |
| 4 | Interleaving roughly doubles delayed test scores | Rohrer and Taylor 2007 | Interleaving guard, day 4, 3 strands per session (4.4) |
| 5 | Comprehensible input at i+1 | Krashen; Nation | 95% known plus one new element (1.2, 5.1) |
| 6 | Four strands in balance, about 25% each | Nation 2007 | `strand_deficit` term (4.5) |
| 7 | Formulaic sequences are learned and stored as units | Ellis 2002; Boers and Lindstromberg | Phrase items scheduled whole (0, 3.2) |
| 8 | Explicit noticing and focus on form, d = 0.9 | Schmidt 1990; Norris and Ortega 2000 | The noticing phase, one target only (1.2) |
| 9 | Segmenting, modality and redundancy | Mayer; Sweller | A 35 s first pass in three beats, no on-screen text duplicating audio, no rule on screen (5.2) |
| 10 | Corrected errors beat errorless learning | Metcalfe 2017 | Miss rules, meaning-first feedback, no penalties (1.8, 3.3) |
| 11 | Generation effect, productive failure | Bjork; Kapur | The unscaffolded spoken turn comes before the scaffolds and before any model answer (1.2 step 3, 5.3) |
| 12 | Fluency needs time pressure on known material | Nation; 4/3/2 | Fluency chunks use mastered items only (4.4) |
| 13 | Transfer-appropriate processing | Morris et al. 1977 | The production step is always in the strand's own modality (1.7) |
| 14 | Mastery learning gates on demonstrated criteria | Bloom 1984 | Two sittings on two days, outcome and level gates (3.4) |
| 15 | Distributed practice and habit formation at about 66 days | Lally 2010 | 10 minutes daily, four sessions a week counts as on track (4.4) |
| 16 | Input must be understood before it can be produced, and comprehension is driven by situation not explanation | Krashen; VanPatten | The scene opens every lesson and no rule appears on screen (1.1, 1.2, 5.2) |

---

## 7. Deviations from the PRD, and open questions

Flagged rather than quietly changed. None of them blocks implementation.

| # | This spec says | The PRD says | Why, and who decides |
| --- | --- | --- | --- |
| 1 | 4 to 6 items per chunk (6 authored, cut to 5 standard and 4 light), of which 3 are production in every variant | 3 to 4 controlled plus 1 free use plus 1 to 2 delayed, so 5 to 7. The LP-02 brief says 3 to 5 checks | The spine fixes the three production steps and lets only the scaffold count move, so light is 4 rather than 3 and dense is 6 rather than 5. Dropping to 3 would mean cutting a production step, which the board's lesson order forbids. Learning Designer; ST to confirm the 4 to 6 band |
| 2 | Week can-do candidates are filtered by each strand's own sub-level | The prototype filters by one overall sub-level (`pickWeekCanDo` in `engine.ts`) | A learner is normally at two or three sub-levels at once, and the PRD data model already stores ability per strand. A small change to the composer, worth making before B1 content lands. Front-end Builder to action under its own ticket, not this one |
| 3 | Academic English is a tag on existing outcomes from B1, not an eighth strand | Open question Q4 leaves this undecided | Keeps the seven-bar "How I'm doing" design and the seven-strand framework intact. Academic Lead and ST |
| 4 | Retire at 180 days with a spot check every 21 to 28 days | Retire at 180 with spot checks | Same rule, with the interval made explicit so it is implementable |
| 5 | Provisional items from placement are excluded from the 25-item review cap | Cap stated without the exclusion | Otherwise a learner placed at B2 is capped out on day one by items they already know. Matches the implemented behaviour |
| 6 | **Caps the review interval at each rung's own promotion gap: 1, 2.5, 7, 12, 30, 50, 60 days (§3.2.1)**, so the longest an item is ever unseen is 60 days | Multipliers compound with no ceiling, and a half-life regression model takes over at 6 or more attempts | Specified rather than recommended, on the Product Lead's ruling of 26 October. As built, an item reaches Mastered on day 129 and is then unseen for 221 days (§3.5); under the cap it reaches Mastered on day 60 and is never unseen for more than 60 (§3.5.1). Two corrections to v1.1's version of this row: the 221-day interval follows the **eighth** correct retrieval, not the ninth, and the "about day 85" figure is withdrawn, because the PRD's regression model exists only in `PRD.md:133` and `:486` and not in `lib/`, so nothing could have produced it. The cap therefore does not wait for that model and does not depend on the 6-attempt hand-over. A build ticket for the Front-end Builder, three lines in `nextReviewAt` and `isDue`; the Product Lead raises it once this document is approved |
| 7 | A score is never shown on day one, but the sub-level **name** may appear from the path reveal onwards (§4.2 rule 4) | The earlier wording of this spec said no level name on day one either, and the running app shows CEFR labels and an `A2.1` badge on day one (screenshots on LEA-5) | QA flagged the conflict and did not call it; I am calling it in the app's favour. A label read as a position on the road is the visible journey the board asked for in point 6, not a mark. What stays hidden is anything that reads as a score: the placement number, percentages, and the strand strength bars, which need a week of data to mean anything. No app change; the spec moved |
| 8 | No `plan`, `recall` or `vote` phase in a session (§1.3, §1.4) | The PRD and the prototype have `recall` and `vote`, and `plan` survives in the types. The PRD's session shape leads with plan and recall | Board direction of 26 October: the lesson opens on the scene, due items return inside the scene, and a front-loaded recall drill is ruled out. `vote_see_revote` was cut on LP-20 on its own evidence. The engine has already moved half way: there is no plan push, and recall is pushed after the atoms (§1.4 rows 1 and 2). Removing all three brings a week-day-4 session from 12.0 minutes, which is at the hard ceiling, back to 9. Board, already given; the code change is LP-30's |
| 9 | A due item at New or Learning returns as a step 4 scaffold sentence, and only an item at Consolidating or better rides into step 5 free use (§1.3) | `tryToUse` admits Consolidating and above, and the only other return path is the recall drill that §1.3 removes | Without this the recall deletion would leave an item with no return path for its first three days, which is QA's R1. It needs one new function, `dueSentences`, and one extra argument on the `free_use` branch of `AtomRun`. LP-30 owns both; the rows are §1.4 rows 3 and 4 |
| 10 | A SPK or INT chunk's step 4 is support turns, the same production at falling support, not scaffolds of another type (§1.5) | Not addressed | v1.1 gave these two strands no step 4 items, so a variant had nothing to cut and a chunk could not reach six items. Content-side only, no engine change. Learning Designer |

Open questions for the board, none blocking:

1. Confirm the academic tag decision in row 3 above, which also answers PRD Q4.
2. Confirm the 0.70 AI rubric pass threshold and the 0.60 confidence floor against AZE's own banding, once Q2 on speech sub-score latency is answered.
3. Confirm that "four sessions a week counts as on track" is the retention rule we want to publish, since it is the only place this model deliberately loosens daily spacing.
4. Approve the interval cap in row 6 and §3.2.1, which is the one rule in this document that changes code rather than content. The number to approve is the 60-day ceiling on how long an item can go unseen.
5. Confirm the 4 to 6 item band in row 1, which is one above the brief's "3 to 5" at the dense end and one above at the light end, because the three production steps are now fixed in every variant.
6. Note rather than decide: row 7 moves the spec to match the app on day-one labels. Say so if the board wants it the other way, because then the path reveal and the lesson badge both change and that is a design ticket.
7. Note rather than decide: the mic is now published per band, 0:50 to B1 and 0:55 from B2 (§1.2, §5.2). The board's rule was "inside the first minute" and that holds everywhere; the single 0:50 figure in v1.1 was not reachable at B2 on a 45 s scene.

---

Hand-off: QA Reviewer on LEA-54, against the acceptance criteria in LP-02 and against R1 to R12 returned on 26 October. The board gate is the Product Lead's to open, and only on a QA pass.

Dependent tickets, so nobody waits on the wrong thing:

| Ticket | What it takes from here | Status |
| --- | --- | --- |
| LP-30 Re-order the session so the lesson opens on the scene | §1.2, §1.3 and the divergences table in §1.4 are its spec. Rows 3 and 4 are the two it did not have in v1.1, and row 15 is the one easiest to miss | Blocked, and this unblocks it |
| LP-20 part 2 (`items.tsx`, `content.ts`, `types.ts`) | §1.7's surviving item types, the `listen_and_do` rename, and the authored phase reorder in §1.4 row 8 | Held on the cut-list approval card |
| LP-35 Author one full A2.1 week on the spine | §1.2, §1.5, §1.6, §1.9, §1.10 and §5 | Blocked on this document |
| The interval cap (not yet raised) | §3.2.1 is the rule, §3.5.1 the expected trace. Three lines in `nextReviewAt` and `isDue` | The Product Lead raises it after board approval |
| LP-03 / LP-04 the lesson capsule | §1.2's phase list and the per-band mic rule | Backlog |
