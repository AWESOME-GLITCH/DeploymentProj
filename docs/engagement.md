# Engagement: why a learner comes back, screen by screen

Owner: Engagement Psychologist (LP-101, LEA-56). Status: revision 1, for the board.

This document says, for every screen type in the app, **which engagement mechanic it uses, the
evidence behind it, the exact rule a builder implements, the copy pattern, and what is forbidden
there**. It is the psychology layer only. It does not re-rule things that are already settled
elsewhere, and where it needs them it quotes them:

| Already ruled | Where | This document |
| --- | --- | --- |
| Visual style, palette, motion, element budget | `docs/design/brief.md` (board, 26 Oct) | obeys it; every UI rule below fits inside four elements above the fold |
| The words the coach says, and the never-write list | `docs/voice.md` | quotes the ruled strings, never competes with them |
| The spacing ladder, misses, mastery gates | `docs/learning-model.md` §3 | takes its numbers as given and says how they are *shown* |
| Which exercise types survive and their screens | `docs/exercises.md` | adds the mechanic and the feedback timing per type |
| The minute-by-minute lesson | `docs/lesson-flow.md` | adds why each moment holds attention |

Two things to hold in mind while reading. First, **this app has no fail state and no currency**, so
every mechanic below has to work without one; that is the hard part and it is why each entry names
the thing it replaces. Second, **most learners here read English at A1 with a dictionary in their
head**, so a mechanic that needs reading is not a mechanic. Show, do not tell.

---

## 1. The five rules of engagement

Everything in section 3 is an application of one of these. If a new screen appears and nobody has
specified it, these five decide it.

| # | Rule | Why, in one line | What it rules out |
| --- | --- | --- | --- |
| 1 | **Competence, not reward.** The thing the learner gets at the end of a session is the true statement that they can now do something. | Perceived competence is the strongest of the three needs that sustain a behaviour over months; extrinsic rewards attached to an already interesting task reduce the chance of returning once the reward stops. Deci and Ryan 1985; Deci, Koestner and Ryan 1999. | Points, coins, XP, badges for attendance. |
| 2 | **The next step is visible, small, and close.** The learner can always see where the next stop is and how far it is. | Effort rises as the perceived distance to the goal falls, and a goal only pulls once the finish is in view. Hull 1932; Kivetz, Urminsky and Zheng 2006. | A path that shows the whole of B2 on day one. A progress bar that starts empty. |
| 3 | **The surprise is which reward, never whether.** A landed turn always gets something back; what is unpredictable is only the sticker that pops. | Unpredictable reward raises engagement, but withholding reward on a schedule is the mechanic that produces compulsive checking, so we take the first half and refuse the second. Skinner 1948 for the effect; Zendle and Cairns 2018 for why the gambling-shaped version is off limits. | Loot boxes, chests, "come back in 4 hours", a daily spin. |
| 4 | **Nothing can be lost.** No state the learner has earned can go away, and no screen ever frames the next session as protecting something. | Losses feel about twice as large as equal gains, so a loss frame drives short-term compliance and then quitting: the learner who breaks a 40-day streak does not restart at 1, they leave. Kahneman and Tversky 1979. | Streak flames, lives, hearts, "don't lose your progress", a bar that goes down overnight. |
| 5 | **Other people are present, never ranked.** The learner sees that others are here today, and never where they stand against them. | Relatedness supports persistence; comparative ranking undermines intrinsic motivation and hurts exactly the learners at the bottom of the ranking, who are the ones most likely to leave. Deci and Ryan 2000. | Leaderboards, leagues, divisions, "you are 7th this week". |

### 1.1 How the three needs map to our screens

Self-determination theory says a behaviour sustains itself when three needs are met. We satisfy each
one in a named place, so a reviewer can check it rather than take it on trust.

| Need | Where it is met | The one thing that would break it |
| --- | --- | --- |
| **Competence** | The "You can now ..." card at session end (§3.6); the success rate held near 80% by the engine (`learning-model.md` §3.2) | A score. The moment a number appears, the learner judges themselves instead of the sentence. |
| **Autonomy** | One choice of two equally good next steps, once per session (§3.6); the free last task in Use it; Skip always available on the explainer (§3.3) | A forced daily goal, or more than one choice (choice overload: Iyengar and Lepper 2000). |
| **Relatedness** | The coach as one consistent person (§3.4); classmates today as small characters (§3.2) | Making her a mascot, or turning the classmates into a ranking. |

---

## 2. Forbidden everywhere

This list is global. It is not a style preference; each row is a mechanic that works in the short
term and costs us the learner in the long term. QA fails any screen containing one.

| Forbidden | Why | What we do instead |
| --- | --- | --- |
| **Streak flames**, fire icons, "day 12 streak!", a number that resets to zero | Loss frame (rule 4). The flame is a thing the learner can lose, so the app stops being about English and becomes about the flame. | The soft weekly bar: seven rounded ink marks, filled for days you learned, empty for days you did not. It never resets and never burns. §3.1. |
| **Lives, hearts, energy, a lockout** | A fail state. A learner with little English will spend hearts in the first five minutes, which punishes exactly the person we are for. | One retry on every item, then the model sentence, then the item returns later (`learning-model.md` §3.3). |
| **Red errors**, crosses, buzzers, shake animations | Red is read as damage before it is read as information, and it raises anxiety in the modality we most need the learner to use, speech. | The character leans in and the line replays at 0.75 speed (`brief.md`, Motion). Ink on the card colour, never red. |
| **Leaderboards**, leagues, divisions, percentile ranks | Rule 5. | Classmates today as characters, and a simple challenge with no ranking. |
| **Points, XP, coins, gems, badges for attendance** | Rule 1. Overjustification: the reward replaces the reason. | The can-do sentence, and the road marker moving one stop. |
| **A percentage or score on a learner screen** | A mark, not feedback. Already forbidden by the board note of 26 Oct and the design rules. | Three ink bars with no numbers for speech (`brief.md`); the ring for the can-do. |
| **A countdown timer on an item** | Time pressure on unknown material lowers performance and raises anxiety; it belongs only on fluency rounds, where the material is already mastered (`learning-model.md` §3.2, Nation's 4/3/2). | No timer outside fluency. In fluency, it is a filling bar and the material is Mastered only. |
| **Guilt notifications**: "you are losing your progress", "your streak is at risk", a sad character | Rule 4, and it is the single most common reason people uninstall a learning app. | "Ready when you are." One push a day at most, the learner's chosen hour, silent if they already learned today. §3.7. |
| **Confetti on everything** | If every turn is a celebration, nothing is. Reward devalues with density. | One sticker pop per landed production turn; one card at session end. §4. |
| **A number of days, items or minutes as the headline** | It makes the quantity the goal, and the quantity is not the goal. | The can-do. "You can order a drink." |

---

## 3. Screen by screen

Every entry has the same five parts: **mechanic**, **evidence**, **UI rule** (implementable, with
numbers), **copy pattern**, **forbidden here**. Copy patterns are written at the level of a learner
with very little English: present simple, common words, one idea, and the line length in words is
given so nobody writes a longer one. Slots are in `{braces}`.

### 3.1 Today

The first screen of the day, and the only one most learners will see when they are undecided.

**Mechanic.** Implementation intention plus a named, sized next action. One card, one line, one
button. The card states the exact act and its cost in minutes, which turns "I should do some
English" into "I will order a coffee, in five minutes".

**Evidence.** Naming the when and the what of a small action roughly doubles follow-through
(Gollwitzer and Sheeran 2006). Stating the size reduces the activation cost, which is the real
barrier on day 14, not motivation. Autonomy is preserved because nothing on the card is a demand
(Deci and Ryan 1985).

**UI rule.**

1. One block colour for the whole card, ink text, radius 28 px (`brief.md`).
2. Four elements above the fold and no more: headline (2 to 4 words), one line (at most 12 words),
   the coach or one character, one ink pill button 56 px.
3. The button label names the act, never the app: "Order a coffee »", not "Start lesson".
4. The line always carries the size: "Five minutes." It is the second sentence, always, so the
   learner learns where to look.
5. The weekly bar sits **below** the fold, 7 rounded ink marks 8 px tall, filled for days with a
   finished session. No count, no label, no flame. It is a record, not a target.
6. Classmates today: at most 5 small outlined characters, no names, no numbers, no ranking, below
   the fold. Tapping does nothing competitive.
7. Mid-session return state: the card says where the learner stopped, and the button resumes.
8. Finished-for-today state: the card goes calm (lilac), the button becomes plain ink text, and
   nothing nags. A second session is allowed but never urged.

**Copy pattern.**

| State | Headline (2 to 4 words) | Line (max 12 words) | Button |
| --- | --- | --- | --- |
| Fresh | `Today` | `{Act}. {N} minutes.` | `{Act} »` |
| Part way | `Carry on` | `You stopped halfway. Carry on from there.` | `Carry on »` |
| Done today | `That is today done` | `Tomorrow, something new.` | plain text: `Do one more` |

Worked: "Today" / "Order a coffee. Five minutes." / "Order a coffee »".

**Forbidden here.** A streak number, a flame, a percentage, two filled buttons, a dashboard, a
to-do list of several lessons, "Let's go", "Your journey starts here" (`voice.md`).

### 3.2 Path

**Mechanic.** Goal gradient, with the next stop deliberately close and the covered ground
deliberately visible. The path is a drawn road: behind the learner it is complete and marked, ahead
of them exactly one stop is lit and reachable.

**Evidence.** Effort increases as the remaining distance shrinks, so what matters is not how long
the road is but how near the next marker looks (Hull 1932; Kivetz et al. 2006). Showing covered
ground works for a second reason: progress already made is the main input to a learner's belief that
they can do this at all (Bandura 1977). Showing the whole of A1 to C1 at once does the opposite, it
makes the near stop look trivial and the road look endless.

**UI rule.**

1. The viewport shows **the last 2 stops done, the 1 next stop, and at most 2 ahead**. Never the
   whole level. Ahead of the next stop, the road fades out rather than ending.
2. The next stop is the only lit element on the screen and the only tappable one. Stops ahead are
   ink outline at 40% opacity and do not respond to a tap.
3. The distance is named in acts, not units: "2 stops to the next check". Never "unit 3 of 12".
4. Done stops keep a small ink tick sticker. They never un-tick. A decayed criterion **fogs** and
   the word is "review"; progress never moves backwards (`learning-model.md` §3.4, design rules).
5. One CEFR label may show, as a position on the road, never as a mark (`learning-model.md` §7 row 7).
6. No main-page scroll on desktop; on mobile the road is a single column with the next stop
   positioned in the lower third, where the thumb is.

**Copy pattern.** `This is your road. You are at the lit stop.` (ruled in `voice.md`).
Next-stop label: `{Act}` plus `{N} stops to {the check}`. Never a percentage.

**Forbidden here.** Flat or circular path nodes and an isometric 3D path (both rejected), a
percentage complete, locks and padlocks, a map of everything, "unlock".

### 3.3 Explainer (the scene)

**Mechanic.** Comprehensible input with a held attention budget, then one talk-like pause that
converts watching into producing. The video is not a reward and not entertainment; it exists to make
the first sentence sayable.

**Evidence.** Input must be understood before it can be produced, and situation does that work
better than explanation (Krashen; VanPatten). Segmenting, the modality principle and the redundancy
principle together say: short beats, no on-screen text that duplicates the audio, no rule on screen
(Mayer; Sweller). The pause is the generation effect: a retrieval attempt before the model is shown
beats being shown the model first, even when the attempt fails (Bjork; Kapur 2008).

**UI rule.**

1. 20 to 40 s, one target, three beats. Nothing on screen while a character speaks except the
   target phrase (`brief.md`, Videos).
2. **Skip is always present and always quiet.** Autonomy: a learner who already knows the phrase
   must be able to leave. Skipping is not penalised anywhere and is not logged as a miss.
3. The video ends on the frame it taught, and that frame stays while the mic opens. The learner
   never has to hold the sentence in memory across a scene change.
4. The talk-like pause: the coach says the line, turns to the learner, and waits. The pause holds
   until the learner acts; it does not time out into the answer.
5. Caption in the interface language, one line at a time, optional. The target phrase is always in
   English (CLAUDE.md).
6. First spoken turn by 0:50 to B1 and 0:55 from B2 (`learning-model.md` §1.2).

**Copy pattern.** No instruction line over the video. At the pause, her own words only:
`Now you.` or the scene's question, e.g. `What can I get you?` Both under four words.

**Forbidden here.** A progress ring on the video, a quiz straight after the video with no spoken
turn, a grammar rule on screen, "watch the video to earn ...", a replay counter.

### 3.4 Talk with the coach

The highest-value and highest-anxiety screen in the app. Everything here is designed to lower the
cost of being wrong out loud.

**Mechanic.** One consistent person, immediate and descriptive feedback, and a ceiling on
consequence. Maya is the same woman every time, she reacts within 400 ms, and the worst outcome of
any attempt is that the sentence stays on screen and can be tried again.

**Evidence.** Feedback given immediately after a spoken attempt beats delayed feedback for skill
acquisition, which is why the reaction must be in the same breath as the attempt (Kulik and Kulik
1988 for the timing; Shute 2008 for the content). Feedback that describes rather than evaluates
protects competence, while praise of the person or of effort lowers persistence after a setback
(Dweck and Mueller 1998). Corrected errors beat errorless learning: being wrong, then getting the
right form, outperforms never being wrong (Metcalfe 2017). Foreign language speaking anxiety
specifically depresses willingness to speak, and the single largest driver of it is the audience and
the mark (Horwitz et al. 1986), so we remove the mark and make the audience one familiar person.

**UI rule.**

1. Maya full-size and animated, three states only: speaking (mouth, gesture), listening (leans in,
   ear sticker), reacting (star pop, nod, replay). The learner's words appear as one bubble.
2. **Three turns, then the card.** The session does not keep asking. A fourth turn is the learner's
   choice, never the app's.
3. Exactly three responses, no fourth, and the strings are ruled in `voice.md`: Clear, Nearly, Hard
   word, plus the tries-spent line. The app may not invent a response.
4. Reaction latency: the state change starts within 400 ms of the attempt ending, and the whole
   reaction is under 400 ms (`brief.md`, Motion).
5. On a miss: lean in, replay the line at 0.75 speed, the word shown big. No red, no shake, no
   count of attempts visible.
6. Tries spent: "That one is hard." The sentence stays on screen, the turn can be reopened, and the
   item is scheduled to return. The difficulty is placed in the item, not in the learner.
7. Scoring, if shown at all, is three ink bars (Sounds, Rhythm, Words) with no numbers and no pass
   line. The 70% pass line and the score bars on the old item screen are cut (`exercises.md`).
8. Hesitation and self-correction are logged and never penalised (`learning-model.md` §3.3).
9. Keyboard fallback always available, and taking it is not a worse outcome.

**Copy pattern.** Hers, as ruled: `Clear. That is how you say it.` / `Nearly. Listen once more.` /
`This word.` / `That one is hard.` Learner-facing instruction, if any: `Say it.` Two words.

**Forbidden here.** A percentage, a pass line, a "try again" counter, "Good try", "Well done",
"Awesome", a red waveform, a microphone that looks like a record button for a test, any praise of
effort.

### 3.5 Exercises

Common rules first, then one row per surviving type. The surviving set and each screen's four parts
are `exercises.md`'s; what this section adds is the mechanic and the feedback timing.

**Mechanic, common to all.** Testing effect plus spacing, delivered as the lesson rather than as a
review mode the learner has to find. Every item ends in production, and the scaffolds exist only to
make the production possible.

**Evidence.** Retrieval beats restudy by 30 to 50% at one week (Roediger and Karpicke 2006).
Spacing at 10 to 20% of the retention interval is the optimum, which is the ladder in
`learning-model.md` §3.2 (Cepeda et al. 2006). Learning is fastest at about 80 to 85% success, which
is why items are due at p = 0.8 and why an exercise set that the learner gets wrong half the time is
a bug, not a challenge (Wilson et al. 2019). Interleaving strands roughly doubles delayed test
scores (Rohrer and Taylor 2007).

**Feedback timing, the rule.**

| Moment | Timing | Why |
| --- | --- | --- |
| Spoken production | Immediate, inside 400 ms | Skill acquisition; the learner must not wait to find out whether they were understood (Kulik and Kulik 1988). |
| Tap or build scaffold | Immediate, and it ends by handing the sentence to the mic | The tap only earns its place because production follows it (`exercises.md` test 2). |
| Typed production | Immediate on submit, with the model shown next to what they wrote | Comparison is the learning event. |
| Whether the item is mastered | **Never shown at the item.** It appears at session end as a can-do, and only after two sittings on two days | An item-level verdict invites the learner to track a score; mastery is a criterion-level fact (`learning-model.md` §3.4). |
| Delayed check | The next session, inside a scene | Spacing. The learner is not told "this is a test". |

**Per type.** Mechanic and the one engagement rule that is easy to get wrong.

| Type | Mechanic | The rule a builder must get right | Copy pattern (max 6 words) |
| --- | --- | --- | --- |
| `tap_order` | Generation with support; the tiles make a correct sentence available to produce | The screen does not end on the tick. The built sentence is said aloud, then "say it" | `Put it in order` |
| `magnet_tiles` | Errorless construction, so a beginner cannot build a wrong sentence | The bounce prints **nothing**: no grammar label, no warning colour, and three bounces must not record a fail | `Build it` |
| `error_spot` | Noticing, focus on form (Schmidt 1990) | Ends in saying the corrected sentence, not in finding the wrong word | `One word is wrong` |
| `listen_and_do` | Honest recognition: hearing 14 against 40 **is** the can-do | Logged by its spoken step, not by the tap | `Listen. Which one?` |
| `tfng` | Real reading outcome, then mediation | After True or False the learner says what the notice means for them. No "Not given" | `Is this true?` |
| `dictation` | Writing is the can-do, so the keyboard is the right ending | No mic, and no live character counter | `Type the price` |
| `transform` | Production under a changed constraint | Mic first, keyboard as fallback, never the reverse | `Say it politely` |
| `correct_message` | Writing outcome; the model sits beside what they wrote | One line of why, no mark | `Fix the message` |
| `short_production` | Free written production | No target-word pills, no live word counter (both counted the learner mid-thought) | `Write two lines` |
| coach say-it (`read_aloud`, `shadow`, `say_it_see_it`, `open_response`) | Retrieval in the strand's own modality (transfer-appropriate processing, Morris et al. 1977) | The coach owns the feedback surface. No second panel, no bars | her own line |
| `roleplay` | Situated production with a consequence: the character answers | Show the last two turns only, so the mic never leaves a 390 px screen. A miss must still give a model | `Turn 1 of 3` |
| `relay` | Mediation: say it to someone who needs it | No question dots before the learner has spoken. The panel is not labelled "Source" | `Tell Sami what to do` |
| delayed check | Spaced retrieval of the whole sentence | It is a say-it, not a three-way tap, and it is never announced as a test | her own line |
| fluency rounds | Automaticity under mild time pressure, on Mastered items only (Nation, 4/3/2) | If the screen promises three rounds, three rounds must run | `Say it three times` |
| teach back | Production plus retrieval: explaining it to someone else | No rubric on screen | `Tell Fatima how` |

**Forbidden in every exercise.** A score, a bar, a cross, a count, red, a lives counter, a lockout,
a timer (outside fluency), a dot row that appears before the learner acts, peer percentages, an
answer given away on the first miss.

### 3.6 Session end

The most important 8 seconds in the product. This is where the learner decides whether there is a
tomorrow.

**Mechanic.** Three things in one card, in this order: a true competence statement, a variable
sticker, and a single autonomous choice.

1. **"You can now ..."** in the learner's own words. Not a score, not a count, a capability.
2. **One sticker pops**, one of six, never the same twice in a row (`brief.md`, Engagement).
3. **Two equally good next steps**, exactly two, once per session.

**Evidence.** The competence line is the payoff rule 1 demands, and a specific capability statement
is what raises self-efficacy, which predicts persistence better than satisfaction does (Bandura
1977). The variable sticker is rule 3: the surprise is in which, never in whether, so it adds
delight without the schedule that produces compulsion (Skinner 1948; Zendle and Cairns 2018). Two
options support autonomy; three or more start to cost more than they give (Iyengar and Lepper 2000).
Ending on a high point matters disproportionately because the end of an episode dominates the
remembered experience and therefore the decision to repeat it (Kahneman, peak-end).

**UI rule.**

1. The can-do line is the headline, 32 to 40 px, 2 to 7 words, in the interface language, generated
   from the criterion that was mastered, never templated as "lesson complete".
2. The can-do ring or bar moves **on screen**, once, under 400 ms. It is the only progress signal.
3. The sticker pops once, 350 ms, overshoot 1.04, from the set of six, and never the same as last
   session's (store the last index). It is decoration. It is not counted, not collected, not
   displayed anywhere else.
4. One ink pill button, plus **one** plain-ink secondary choice. The two must be genuinely
   equivalent: "Say it once more" and "Finish for today" are both fine endings. Never a good option
   and a guilty option.
5. Below the fold, one line naming the return: when this comes back, in the coach's words.
6. The card never shows: minutes spent, items answered, accuracy, day count, a streak, or a
   comparison to yesterday.
7. Reduced motion: the sticker appears without the pop; the ring moves without the spring.

**Copy pattern.**

| Slot | Pattern | Worked |
| --- | --- | --- |
| Headline | `You can {do the thing}.` max 7 words | `You can order a drink.` |
| Return line | `This comes back {when}.` | `This comes back tomorrow.` |
| Primary | `{Next act} »` | `Say it once more »` |
| Secondary | plain ink text, no shame | `Finish for today` |
| First session only | `Day 1. See you tomorrow.` (ruled, `voice.md`) | |

**Forbidden here.** "Well done", "Great job", "Awesome", a percentage, items-correct, minutes,
confetti, a streak increment, a share-your-score button, a prompt to rate the app, a second filled
button, three or more next steps.

### 3.7 Missed day, and coming back

**Mechanic.** Zero-loss re-entry. A missed day costs the learner nothing, and the screen they
return to is smaller than the one they left.

**Evidence.** This is rule 4 applied to the one moment it decides. Losses loom about twice as large
as gains (Kahneman and Tversky 1979), so a loss-framed return screen reliably converts a lapsed
learner into a churned one: the learner who is already feeling bad about missing a day will not
choose a screen that agrees with them. The replacement mechanic is the fresh start effect: a lapse
reframed as a new beginning increases the chance of re-engagement (Dai, Milkman and Riis 2014). The
smaller-than-you-left rule follows from the activation cost being the binding constraint on the
return day, not motivation.

**UI rule.**

1. **Nothing decays visibly.** Done stops stay done. The weekly bar shows empty marks for the missed
   days and does not reset, change colour, or animate the gap.
2. The return card is one block colour (lilac, the calm screen), the character is settled and
   neutral, never sad, never pleading.
3. The returning session is **shorter than standard**: the light cut (4 items,
   `learning-model.md` §1.6), and it opens on an item the learner has already met, so the first
   thing that happens on the return day is a success.
4. One ink pill button. No catch-up list, no "you missed 3 lessons", no option to "repair" anything.
5. Re-entry after 7 days or more: offer one short re-meet of the last can-do before new material.
   Still no mark, still phrased as a choice.
6. Notifications: at most one a day, at the learner's chosen hour, silent if they already learned
   today, and the body is an offer, never a warning. Three consecutive ignored pushes and the app
   stops sending until the learner returns. No push may contain a number, a streak, or a loss word.

**Copy pattern.**

| Where | Pattern | Worked |
| --- | --- | --- |
| Return headline (2 to 3 words) | `Good to see you` or `Carry on` | `Carry on` |
| Return line (max 12 words) | `{Act} again. {N} minutes.` | `Order a coffee again. Three minutes.` |
| Push | `{Act}. {N} minutes.` | `Order a coffee. Five minutes.` |
| Long gap | `Start with something you know.` | |

Note on "Welcome back": `brief.md` uses it as the *principle* (a missed day is a welcome back, never
a loss), and `voice.md` forbids the literal string "Welcome back!" because of the exclamation mark
and the app-voice tone. Both hold: the principle is the rule, and the words on screen are
`Good to see you` or `Carry on`. Flagged so nobody thinks the two documents disagree.

**Forbidden here.** "You lost your streak", "Your progress is at risk", a sad or crying character, a
flame going out, a repair offer, a catch-up queue, a count of missed days, a guilt push, any number
at all on the return card.

---

## 4. The reward schedule, in full

One table, so there is no ambiguity about what the learner gets and when.

| Event | What always happens (certain) | What varies | What never happens |
| --- | --- | --- | --- |
| A landed spoken turn | The scene's own reply, or Clear | Which of the six stickers pops | A score, a count, confetti |
| A near attempt | Nearly, the line again at 0.75 speed | nothing | Red, a cross, a lost life |
| Tries spent | "That one is hard." The sentence stays | nothing | A fail, a lockout |
| A correct tap or build | The sentence said aloud, then the mic | nothing | A tick-and-score panel |
| Session end | The can-do card and the ring moving | Which sticker pops | Points, minutes, accuracy |
| A criterion mastered | One extra ink tick sticker on the road stop | nothing | A badge, a trophy, a share card |
| Returning after a miss | A shorter session that opens on a success | nothing | A penalty, a catch-up, a guilt line |

**The ethics test for any future reward**, three questions, all three must pass:

1. Does the learner get *something* every time they succeed? If no, we are withholding on a
   schedule, and that is the gambling mechanic. Reject.
2. Can the reward be lost, spent, counted or compared? If yes, it is a currency. Reject.
3. Would the screen still make sense with the reward removed? If no, the reward is carrying the
   screen instead of the learning. Reject.

---

## 5. Copy patterns, the short library

For writers and for anyone generating strings. All of it in British English, no exclamation marks,
no em dashes. Strings that are already ruled live in `voice.md` and `i18n.ts`; these are the
*patterns* for the ones that are not.

**The shape.** Headline 2 to 4 words. One line, at most 12 words, two short sentences allowed.
Instruction, at most 6 words. Button, the act plus `»`.

| Job | Pattern | Example | Words |
| --- | --- | --- | --- |
| Name today | `{Act}. {N} minutes.` | `Order a coffee. Five minutes.` | 5 |
| Start an act | `{Act} »` | `Order a coffee »` | 3 |
| Say the distance | `{N} stops to {the check}.` | `Two stops to the check.` | 5 |
| Instruct on an item | `{Verb} it.` | `Say it.` / `Build it.` | 2 |
| Describe a miss | `This word.` | | 2 |
| Name the return | `This comes back {when}.` | `This comes back tomorrow.` | 4 |
| State the can-do | `You can {do the thing}.` | `You can order a drink.` | 5 |
| Offer a choice | `{Act A}` and `{Act B}` | `Say it once more` / `Finish for today` | 4 |
| Come back after a gap | `Carry on` plus `{Act} again. {N} minutes.` | `Order a coffee again. Three minutes.` | 6 |

**Readability rules for a learner with little English.**

1. Present simple. No conditionals, no passive, no modals beyond `can`.
2. Words from the first 1,000 of English, except the target language itself.
3. One idea per line. If there is an "and", consider two lines.
4. No idioms, no metaphors, no humour that needs culture. "You are on fire" is three failures at
   once: idiom, flame, and praise.
5. The interface language carries the instruction; the English stays English (CLAUDE.md).
6. Never a word the learner has to learn in order to use the app: no "unit", "module", "ring",
   "streak", "XP", "level up", "unlock", "content".

**Never write** (extends `voice.md`'s list with the engagement cases): "Keep your streak",
"Don't break the chain", "You are on a roll", "Only 2 more to go!", "You beat 60% of learners",
"Claim your reward", "Your daily goal", "Perfect!", "Oops", "Try again!", "You lost a life".

---

## 6. Evidence index

One line each, so a reviewer can check a claim without reading the sources.

| # | Finding | Source | Used in |
| --- | --- | --- | --- |
| 1 | Competence, autonomy and relatedness sustain a behaviour; satisfying them predicts persistence | Deci and Ryan 1985, 2000 | §1, §1.1, all screens |
| 2 | Extrinsic rewards on an already interesting task reduce later intrinsic motivation | Deci, Koestner and Ryan 1999 | §1 rule 1, §2 (no points) |
| 3 | Effort rises as the perceived distance to the goal falls | Hull 1932; Kivetz, Urminsky and Zheng 2006 | §3.1, §3.2 |
| 4 | Past progress drives belief in future success; specific capability statements raise it | Bandura 1977 | §3.2, §3.6 |
| 5 | Unpredictable reward raises engagement; schedule-based withholding produces compulsion | Skinner 1948; Zendle and Cairns 2018 | §1 rule 3, §4 |
| 6 | Losses feel about twice as large as equal gains | Kahneman and Tversky 1979 | §1 rule 4, §2, §3.7 |
| 7 | The end of an episode dominates how it is remembered and whether it is repeated | Kahneman (peak-end) | §3.6 |
| 8 | A lapse reframed as a fresh start raises re-engagement | Dai, Milkman and Riis 2014 | §3.7 |
| 9 | Naming the when and what of a small action roughly doubles follow-through | Gollwitzer and Sheeran 2006 | §3.1 |
| 10 | Two options support choice; many options cost more than they give | Iyengar and Lepper 2000 | §3.6, §1.1 |
| 11 | Retrieval beats restudy by 30 to 50% at one week | Roediger and Karpicke 2006 | §3.5 |
| 12 | Optimal spacing is 10 to 20% of the retention interval | Cepeda et al. 2006 | §3.5, `learning-model.md` §3.2 |
| 13 | Learning is fastest at about 80 to 85% success | Wilson et al. 2019 | §3.5 |
| 14 | Interleaving roughly doubles delayed test scores | Rohrer and Taylor 2007 | §3.5 |
| 15 | Immediate feedback beats delayed for skill acquisition; feedback should describe, not evaluate | Kulik and Kulik 1988; Shute 2008 | §3.4, §3.5 |
| 16 | Praise of the person or of effort lowers persistence after a setback | Dweck and Mueller 1998 | §3.4, §2 |
| 17 | Corrected errors beat errorless learning | Metcalfe 2017 | §3.4, §3.5 |
| 18 | A retrieval attempt before the model beats seeing the model first, even when it fails | Bjork; Kapur 2008 | §3.3 |
| 19 | Speaking anxiety depresses willingness to speak; audience and marks drive it | Horwitz, Horwitz and Cope 1986 | §3.4 |
| 20 | Explicit noticing and focus on form, d = 0.9 | Schmidt 1990; Norris and Ortega 2000 | §3.5 (`error_spot`) |
| 21 | Segmenting, modality and redundancy limits on multimedia | Mayer; Sweller | §3.3 |
| 22 | Input must be understood before it can be produced | Krashen; VanPatten | §3.3 |
| 23 | Time pressure helps fluency only on already known material | Nation, 4/3/2 | §2 (timers), §3.5 (fluency) |
| 24 | Transfer-appropriate processing: practise in the modality of the outcome | Morris et al. 1977 | §3.5 |

---

## 7. The reviewer's checklist

Nine checks. Any screen in the app can be run against them in under a minute, and a fail is a fail.

| # | Check | Fails if |
| --- | --- | --- |
| 1 | Four elements above the fold, one primary action | A fifth element, or two filled buttons |
| 2 | The next act is named and sized | The button says "Start" or "Continue" where an act is available |
| 3 | Nothing on screen can be lost | A streak, a life, a bar that can go down, a decay animation |
| 4 | No number that reads as a mark | A percentage, a score, an items-correct count, a day count |
| 5 | Feedback describes what happened | "Well done", "Correct", red, a cross, a buzzer |
| 6 | Production happens, and the screen does not end on a tap | A scaffold that finishes on a tick |
| 7 | Reward is certain in kind and variable only in form | Withholding, collecting, counting, or no reward at all |
| 8 | Choice is exactly two, at most once per session | Three options, or a forced single path with no out |
| 9 | A learner with little English knows what to do in five seconds | The instruction needs reading, or is not in their language |

---

## 8. For the board

Three things in this document are rulings rather than reports, and I would like them confirmed or
overturned rather than left implicit.

1. **The weekly bar replaces the streak outright**, including the number. `brief.md` says "a soft
   weekly bar, never a flame"; I have also removed the count, because a count is the losable thing,
   not the flame. §3.1 rule 5.
2. **The returning session is deliberately shorter and opens on a known item.** That is a scheduler
   behaviour, not a design one, so it needs a ticket against the composer
   (`learning-model.md` §4.4) if it is approved. §3.7 rule 3.
3. **Notifications stop after three ignored pushes.** No notification work is specified anywhere
   else yet, so this is the first rule on the subject and it should be deliberate. §3.7 rule 6.

One wording conflict is resolved in §3.7 rather than escalated: "Welcome back" stays as the
principle and does not appear as a string. Say so if the board wants the words on screen.

Visual reference for the four moments this document invents rather than inherits (Today with the
weekly bar, Path with one stop in reach, session end, and the return card) is
`docs/design/engagement-patterns.html`, rendered at 390 px in
`docs/design/shots/engagement-today-path.png`, `docs/design/shots/engagement-coach-item.png`
and `docs/design/shots/engagement-end-return.png`.
