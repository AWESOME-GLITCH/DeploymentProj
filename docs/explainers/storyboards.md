# Explainer storyboards for the A2.1 slice

Production storyboards for the 2D motion-graphics explainers that open every lesson atom in `lib/learning-path/content.ts`, except `ATM-A2-INT-0001` (At the cafe), which is already built in `components/learning-path/explainer/Cafe.tsx` and is the reference for everything below.

Pedagogy comes from `docs/learning-path/PRD.md` and, since 26 October 2026, from the board's
behavioural rules, which are law here and are set out in full in **The attention law** below:

- Input before use, but not input alone. The explainer is the input phase, and the learner now acts at
  the end of every beat that teaches something. Nothing passive runs longer than 8 to 10 seconds.
- One target per atom. Each storyboard teaches exactly one form or chunk, highlighted in the accent colour wherever it is heard. Nothing else is explained.
- Noticing is explicit. The target is shown in context and highlighted; the explain beat uses a visual model (timeline, slider, seesaw, magnet), never a rule page or metalanguage.
- Lessons are in English. All narration and all on-screen text is English. L1 (ar, es, hi, ru, tr, zh) appears only as the optional caption line under the English caption and is never burnt in.
- Watched credit. The player credits the atom from frame progress, and progress only grows. Every stop
  resumes into the next beat whether the learner answers, retries or skips, so a learner who stays to
  the recap reaches 100%. The only way to finish under 80% is to leave the lesson.
- Recap wording matches the learning-check stem, and the recap narration is the self-efficacy close:
  what the learner can now do, then when it comes back.

## The attention law

Board rule, 26 October 2026, from behavioural psychology. It applies to every explainer and to the
lesson flow (`docs/lesson-flow.md` carries the lesson-side half). Six rules, and what each one means
for a beat table:

| # | Board rule | What it means here |
| --- | --- | --- |
| 1 | Attention: no passive stretch longer than 8 to 10 s. The learner acts at the end of every beat that teaches something. | Every beat that teaches carries a `target`, so the player stops on it. The gap from the start of the video to the first stop, and between any two stops, is never more than 10 s. |
| 2 | Foot in the door: the first ask is tiny and inside the first 10 s, then the asks grow. Never start with the hardest thing. | The first stop is a tap, at or before frame 300. The asks then climb the ladder below. |
| 3 | Generation effect: before the video gives the answer, ask the learner to predict it where the scene allows. | A `predict` beat, one tap, placed immediately before the beat that says the target line. |
| 4 | Immediate specific feedback in words, never a mark. Max two tries, then move on kindly. No red, no loss. | The player owns the strings; a storyboard never writes a score, a tick count or a percentage into the composition. A miss is a lean-in and a replay at 0.75, never a cross. |
| 5 | Self-efficacy close: the recap says what the learner can now do and names when it comes back. | The recap narration is "You can \<do the thing\>. \<When it returns\>." Spoken and captioned in the learner's own language, because it is addressed to the learner, not taught. |
| 6 | Autonomy: tap any word to hear it, replay a beat, skip an ask. Cognitive load: one target per beat, one line on screen. | The player gives all three affordances. The storyboard's half is the second clause: one speaker turn per beat. A beat that carries two turns is two beats. |

### The beat law

| Thing | Value | Where it comes from |
| --- | --- | --- |
| Duration | 600 to 1200 frames (20 to 40 s). 1200 is a hard cap. | `docs/design/brief.md`, measured in `docs/design/motion.md` §9 |
| Beats | 6 to 8 | The ask ladder needs five stops, plus a hook and a recap that carry none |
| Teaching beat | 150 to 240 frames (5 to 8 s), and never over 210 where the motion spec's cap binds | Board rule 1; motion spec §10 |
| Hook and recap | As short as the line takes, 60 to 150 frames | They teach nothing, so padding them to 5 s only adds passive time, which rule 1 forbids |
| One turn per beat | A beat holds one speaker's one line | Board rule 6, cognitive load |
| First stop | At or before frame 300 (10 s) | Board rule 2 |
| Stops | One per teaching beat. `pauseAt` is a settled frame: nothing mid-move, the caption fully lit | Board rule 1; the pause cue springs in 24 frames early, per motion spec §9 |

### The ask ladder

Five stops, in this order, so the first ask is tiny and each one is a little more than the last. The
player derives the stop and its kind from the beat (`asksFor` in `ExplainerPlayer.tsx`); the storyboard
decides which rung each beat carries and writes it in the `ask` column.

| Rung | Ask | What the learner does | Beat it sits on |
| --- | --- | --- | --- |
| 1 | **tap** | Finds the key words in the line and hears each one | The first notice or word beat |
| 2 | **say the word** | Says the target word alone, not the sentence | The second notice or word beat |
| 3 | **predict** | One tap: which of two or three things will they say next | The `predict` beat, before the answer |
| 4 | **say the line** | Says the whole target line, with the scene still around it | The notice beat that carries the target line |
| 5 | **say it changed** | Says the line with one new word in it | The practise beat |

Rung 3 is not a step up in difficulty; it is a different thing, a guess before the answer, and it is a
tap so that it stays tiny. Where a scene has nobody about to say anything (a word tutorial that
introduces four nouns, for instance), rung 3 is dropped rather than invented: "where the scene allows"
is the board's wording and it is meant.

### The two spines

Every storyboard is cut on one of these two grids. Deviate only with a reason written in the
storyboard.

**Video, 8 beats, 1200 frames, 40.0 s**

| Beat | from | to | s | Ask | Stop | At |
| --- | --- | --- | --- | --- | --- | --- |
| hook | 0 | 120 | 4.0 | none | | |
| n1 | 120 | 270 | 5.0 | tap | 258 | 8.6 s |
| n2 | 270 | 450 | 6.0 | say the word | 438 | 14.6 s |
| predict | 450 | 570 | 4.0 | predict | 558 | 18.6 s |
| n3 | 570 | 720 | 5.0 | say the line | 708 | 23.6 s |
| explain | 720 | 900 | 6.0 | tap | 888 | 29.6 s |
| practise | 900 | 1080 | 6.0 | say it changed | 1068 | 35.6 s |
| recap | 1080 | 1200 | 4.0 | none | | |

**Word tutorial, 8 beats, 1050 frames, 35.0 s**

| Beat | from | to | s | Ask | Stop | At |
| --- | --- | --- | --- | --- | --- | --- |
| hook | 0 | 90 | 3.0 | none | | |
| w1 | 90 | 240 | 5.0 | tap | 228 | 7.6 s |
| w2 | 240 | 390 | 5.0 | say the word | 378 | 12.6 s |
| predict | 390 | 480 | 3.0 | predict | 468 | 15.6 s |
| w3 | 480 | 630 | 5.0 | say the word | 618 | 20.6 s |
| w4 | 630 | 780 | 5.0 | say the line | 768 | 25.6 s |
| practise | 780 | 960 | 6.0 | say it changed | 948 | 31.6 s |
| recap | 960 | 1050 | 3.0 | none | | |

A word tutorial carries four cards because the content in `content.ts` has four, so it spends a beat
more on vocabulary and drops one notice rung; where a tutorial's scene has nobody about to speak, the
`predict` beat goes and the grid closes up to 960 frames.

**Video with a three-way contrast, 9 beats, 1200 frames, 40.0 s**

Two atoms have a criterion that is itself a contrast between three things: `ATM-A2-LST-0004` (4 / 14 /
40) and `ATM-A2-GRM-0003` (worked / work / will work). Three things need three notice beats, and a rule
stated as two sentences needs two explain beats, so these run to nine. They still fit 1200 frames, but
only by spending 2 s on the hook:

| Beat | from | to | s | Ask | Stop | At |
| --- | --- | --- | --- | --- | --- | --- |
| hook | 0 | 60 | 2.0 | none | | |
| n1 | 60 | 210 | 5.0 | tap | 198 | 6.6 s |
| n2 / predict | 210 | 300 or 360 | 3.0 or 5.0 | predict or say the word | 288 / 348 | 9.6 / 11.6 s |
| n3 / predict | 300 or 360 | 450 | 3.0 or 5.0 | say the word or predict | 438 | 14.6 s |
| n3 | 450 | 600 | 5.0 | say the word or the line | 588 | 19.6 s |
| explain | 600 | 750 | 5.0 | tap | 738 | 24.6 s |
| explain2 | 750 | 900 | 5.0 | tap | 888 | 29.6 s |
| practise | 900 | 1080 | 6.0 | say it changed | 1068 | 35.6 s |
| recap | 1080 | 1200 | 4.0 | none | | |

The `predict` beat sits in whichever slot comes immediately before the answer, which is slot 3 in
Platform 4, not 14 and slot 4 in Yesterday, today, tomorrow.

**The one place the board's rules and the 40 s cap genuinely collide.** A nine-beat video fits 1200
frames only because the hook drops to 2 s and the recap to 4 s. The recap at 4 s is the floor: the
self-efficacy close is a spoken sentence in the learner's own language and it cannot be hurried. So a
tenth beat does not fit, and an atom whose criterion needs ten is two atoms. If the board would rather
not spend a 2 s hook, the honest alternative is a 42 s cap for the two contrast atoms, not a quieter
breach of rule 1. Flagged for the board on LP-80 rather than decided here.

**Two things the board's rules cost.** First, they need eight beats, where `docs/design/motion.md` §10
says five to seven; the binding numbers are the 1200-frame total and the 210-frame beat, and eight
beats of 150 to 180 satisfy both, so that line in the motion spec wants to read "6 to 8". Raised with
the Motion Director on LP-107. Second, the videos as first storyboarded ran 45 to 55 s, so every one of
them loses 5 to 15 s. Almost none of that is content: it comes from splitting beats that carried two
speaker turns, which costs nothing, and from hooks and recaps that were padded to 5 s.

## Conventions (shared with Cafe.tsx)

| Thing | Value |
| --- | --- |
| Canvas | 1080 x 1440 (3:4), 30 fps, Remotion composition played in `ExplainerPlayer` |
| Style | 2D flat vector, rounded shapes, thick ink outlines on speech bubbles, no gradients on characters, no 3D, no drop shadows except the soft one under bubbles and cards |
| Palette | INK `#1b1d3a`, ACCENT (indigo blue) `#3a3fc7`, SAFFRON `#f5b733`, PAPER `#fbf7f0`, teal `#2f7f8a`, coral `#e07a5f`, leaf `#1fb48a`, rose `#e75c94` (used only for "wrong" strikes, never red). No purple anywhere: the accent stays at the blue end, hue 235 to 240. |
| Target highlighting | Target phrases are ACCENT and weight 800 in bubbles and captions; everything else INK |
| Captions | English, word-synced karaoke, max 7 words per line, 2 lines. L1 line below, one short line per beat, keyed by beat id exactly as in `EXPLAINERS[atomId].l1[lang][beatId]` |
| Narration | One line per beat, spoken by TTS when the beat starts (`say(beat.line)`), 100 to 125 wpm, no exclamation marks, no em dashes |
| Beat kinds | `hook`, `notice`, `predict`, `explain`, `practise`, `recap` for video atoms; `hook`, `word`, `predict`, `practise` (the say-it beat), `recap` for word tutorials. `predict` is new on 26 October and is not in the `Beat` union yet: see LP-46 |
| Lengths | 600 to 1200 frames (20 to 40 s), 1200 a hard cap. Video atoms 1200, word tutorials 960 to 1050. See **The beat law** |
| Beat shares | Superseded by **The two spines**. Beats are 150 to 210 frames each, not a share of the whole |
| pauseAt | The frame at which the player stops and the learner acts. One per teaching beat, five per video, the first at or before frame 300. A settled frame: the karaoke line has played once in full, nothing is mid-move, the caption is fully lit, and the cue has sprung in 24 frames earlier |
| Faces | A character is on screen for at least 60% of every explainer; explain beats keep a small presenter in a corner circle when the main area is a diagram |
| Transitions | 10-frame fade on beat change (as in `CafeExplainer`), plus the specific move written in each scene note |
| Progress bar | Top strip, one segment per beat, as in Cafe.tsx |

### Cast

Existing (from Cafe.tsx `Person`): **leo** the barista (teal top, Shoreditch cafe owner), **you** the learner (saffron top, drawn facing left when listening), **maya** the teacher (coral top, long hair; presents explain and practise beats).

New recurring characters (two, and no more, across all storyboards):

- **fatima**: 52, Dubai shop owner, from the PRD personas. Headscarf in leaf green, warm grey abaya-style top, round glasses. Calm, competent, smiles with the eyes. Appears in Meet Fatima and Metro notices.
- **sami**: late twenties, London flat share, from the mediation item (`character: "Sami"`). Short curly hair, mustard hoodie. Friendly, a little lost with paperwork. Appears in The gas bill.

Named people who are NOT drawn: Amira (a contact name on a phone), Arjun and Yusuf (the "presenter" strings in content.ts; their videos are told through **you** so the learner is the one on the platform and on the timeline).

### Atoms with no explainer

`ATM-A2-INT-0011` (Teach it back) and `ATM-A2-FLU-0001` (Fluency) are practice-only atoms with no input phase. `STO-A2-000x` are stories (read or listen, no items). None of them needs a storyboard.

---

## 1. ATM-A2-LST-0004: Platform 4, not 14

| Field | Value |
| --- | --- |
| atom_id | ATM-A2-LST-0004 |
| title | Platform 4, not 14 |
| sublevel / strand | A2.1 / LST (Listening) |
| type | video, 40 s, 1200 frames (re-cut from 55 s on 26 October) |
| single target | Word stress tells teens from tens: four**TEEN** (end) vs **FOR**ty (start) |
| characters | you (on the platform), maya (explain and practise), a tannoy speaker as a "voice" prop |
| setting | Dubai Metro, Friday evening: gold station roof, orange sky, platform signs 4, 14 and 40 |
| check stem echo | "Listen. Which platform?" with 4 / 14 / 40 pictures |

### Beats

Re-cut 26 October 2026 to **The attention law**. Nine beats, not seven: the criterion is a three-way
contrast (4 / 14 / 40), so it needs three announcement beats, and the stress rule is two sentences, so
it needs two explain beats. The hook pays for the extra at 2 s, and the whole
thing lands on 1200 frames with no beat over 180. The old sixteen-second explain and
thirteen-second practise are gone. The target here is a word, not a line, so ladder rung 4 is "say the
word" twice and rung 5 is the same job on a new pair, thirteen and thirty.

| id | kind | from | to | narration (TTS) | targets | ask | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 60 | Dubai Metro. Friday evening. | | | | Orange evening sky, a flat-vector metro station with its gold curved roof slides up from the bottom; a train glides in from the right and stops with a small overshoot. Title words "Dubai Metro." then "Friday evening." drop in top-left in INK. Cut to the platform as the train doors open at frame 48, so the cut is made before the first beat that teaches. |
| n1 | notice | 60 | 210 | Platform fourteen. | fourteen | tap | 198 | Interior platform. A tannoy speaker on a pole top-right emits three sound rings; its bubble types "Platform fourteen." and the word grows on TEEN (the syllable scales to 1.3 and bumps up 12 px). you stands centre and nods. The two hanging signs, "4" near and "14" far right, are both in frame and both lit the same, so the question the predict beat asks is visible here. Settled by 186. |
| predict | predict | 210 | 300 | Which platform? | 4, 14 | predict | 288 | The prediction moment, and this atom is the best case for one: the whole criterion is hearing which number was said. Camera holds on you between the two signs; a thought cloud carries a big ACCENT "?" and the two signs in miniature, 4 on the left and 14 on the right. Nothing is spoken in English; the caption asks the question in the learner's own language. The ask is one tap on a sign. A tap on 14 lights it leaf; a tap on 4 dims it and replays the announcement at 0.75, which is the answer arriving as a consequence rather than as a correction. |
| n2 | notice | 300 | 450 | Platform four. | four | say the word | 438 | you now stands under the "4" sign, bag down, looking hopeful. Tannoy bubble: "Platform four." (one bump on FOUR). Nothing arrives: a single leaf blows across the empty track, you tilt their head. The learner says "four" at 438, with the empty track behind it. |
| n3 | notice | 450 | 600 | Platform forty. | forty | say the word | 588 | A second sign swings in on a hard cut and three signs now line up overhead: 4, 14, 40. Tannoy bubble: "Platform forty." with the bump on FOR. you looks left, right, left again (head turns on a 12-frame ease each). The learner says "forty" at 588. The three signs then shrink into a row at the top as we fade to the explain beat. |
| explain | explain | 600 | 750 | FourTEEN. Stress at the end. | fourTEEN | tap | 738 | PAPER background. maya in a corner circle bottom-left, hand conducting. Centre: a flat-vector seesaw. The word "fourteen" sits on it as two blocks, "four" and "TEEN"; the TEEN block is drawn bigger and heavier, so the seesaw tips to the right with a soft thunk at frame 660. The label "end" fades in under the low side at 700. One idea on the page, nothing else. The tap is on the two syllable chips. |
| explain2 | explain | 750 | 900 | FORty. Stress at the start. | FORty | tap | 888 | The same seesaw. "forty" replaces "fourteen" as two blocks (frame 762); the "FOR" block is heavy and the board tips the other way at 798, same thunk, mirrored. The label "start" fades in under the new low side. At 840 both words appear side by side with the heavy syllable in ACCENT and a small weight icon under it, which is the picture the recap reuses. |
| practise | practise | 900 | 1080 | Say it with me. Thirteen. Thirty. | Thirteen, Thirty | say it changed | 1068 | Pale blue background, maya large in a white circle (as the cafe practise beat). A new pair, which is the point: the rule has to move off the two words the learner has just heard thirty times. Karaoke "Thirteen." then "Thirty." in 96 px, the stressed syllable rising 10 px as it is spoken, maya's hand coming down on each. The line is complete by 1032 and the mic cue has sprung in by 1044, so 1068 holds a settled frame. On resume both words glow leaf for 36 frames. |
| recap | recap | 1080 | 1200 | You can hear four, fourteen and forty. Again tomorrow. | | | | ACCENT background. A white card: two lines, "teen ... stress at the END" with the END in SAFFRON, and "ty ... stress at the START". Below the card the three platform signs 4, 14, 40 spring in with 14 and 40 showing a little weight icon on the stressed side. The narration is the self-efficacy close and is spoken in the learner's own language; the card is the check stem. Hold with nothing moving. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | مترو دبي. مساء الجمعة. | Metro de Dubái. Viernes por la tarde. | दुबई मेट्रो। शुक्रवार की शाम। | Метро Дубая. Вечер пятницы. | Dubai Metrosu. Cuma akşamı. | 迪拜地铁。星期五傍晚。 |
| n1 | الرصيف أربعة عشر. | Andén catorce. | प्लेटफ़ॉर्म चौदह। | Платформа четырнадцать. | Peron on dört. | 十四号站台。 |
| predict | أي رصيف؟ | ¿Qué andén? | कौन सा प्लेटफ़ॉर्म? | Какая платформа? | Hangi peron? | 哪个站台？ |
| n2 | الرصيف أربعة. | Andén cuatro. | प्लेटफ़ॉर्म चार। | Платформа четыре. | Peron dört. | 四号站台。 |
| n3 | الرصيف أربعون. | Andén cuarenta. | प्लेटफ़ॉर्म चालीस। | Платформа сорок. | Peron kırk. | 四十号站台。 |
| explain | fourTEEN: النبرة في النهاية. | fourTEEN: acento al final. | fourTEEN: ज़ोर अंत में। | fourTEEN: ударение в конце. | fourTEEN: vurgu sonda. | fourTEEN 重音在后。 |
| explain2 | FORty: النبرة في البداية. | FORty: acento al principio. | FORty: ज़ोर शुरू में। | FORty: ударение в начале. | FORty: vurgu başta. | FORty 重音在前。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | يمكنك الآن سماع four و fourteen و forty. غدًا مرة أخرى. | Ya distingues four, fourteen y forty. Mañana otra vez. | अब आप four, fourteen और forty पहचान सकते हैं। कल फिर। | Теперь вы различаете four, fourteen и forty. Завтра снова. | Artık four, fourteen ve forty'yi ayırt edebilirsin. Yarın tekrar. | 你现在能听出 four、fourteen 和 forty 了。明天再来。 |

### Interactive moments

- Tappable words: every caption word (player default); the stressed syllables are rendered as separate tappable chips "four", "TEEN", "FOR", "ty" in the two explain beats, each playing only that syllable.
- Six stops, growing: tap the key word at 198, predict the platform at 288, say "four" at 438 and "forty" at 588, tap the heavy syllable at 738 and 888, say the new pair at 1068. The first ask lands at 6.6 s and no passive stretch runs longer than 6.6 s.
- At 1068 the learner says "Thirteen. Thirty." Scored as shadow (timing and stress, not words). A good pass lights the seesaw tipping the right way for each word. The pair is deliberately new: saying "fourteen" back after hearing it four times is recognition wearing a microphone.
- Prediction (frame 288, `predict` beat): one tap on sign 4 or sign 14, before n2 shows what happens. A tap on 14 lights it leaf and plays "platform fourTEEN"; a tap on 4 dims it and replays the announcement at 0.75. Both are answers, neither is a mark. **Not wired yet**: needs the `predict` beat kind and ask kind, LP-46.
- Extra tap: in n3 the three signs are tappable for 60 frames; tapping 40 makes the sign glow leaf and plays "FORty"; tapping 4 or 14 dims it grey and replays the announcement at 0.75x (no red, no lives).

---

## 2. ATM-A1-SPK-0005: Meet Fatima

| Field | Value |
| --- | --- |
| atom_id | ATM-A1-SPK-0005 |
| title | Meet Fatima |
| sublevel / strand | A1.2 / SPK (Speaking) |
| type | video, 40 s, 1200 frames (re-cut from 45 s on 26 October) |
| single target | Three connected "I" sentences: I'm ..., I live in ..., I work in ... |
| characters | fatima (presenter), you (appears on the badge in the explain beat) |
| setting | Fatima's small shop in Dubai: striped awning, shelves of tea tins and scarves, a counter, warm morning light |
| check stem echo | "I live ___ Dubai." and "I'm ... I live in ... I work in ..." |

### Beats

Re-cut 26 October 2026 to **The attention law**. On the video spine exactly: eight beats, 1200 frames.
Two changes beyond re-timing. The old hook carried the first target line, "Hello. I'm Fatima.", which
made the beat that teaches the one beat with no ask; the hook is now the shop and nothing else, and the
line moved to n1 where it gets the tap. And the fourth notice beat, "I like tea and I don't like
coffee.", is cut: the criterion is `CRI-A1.2-SPK-03-01`, three connected sentences with I am, I live, I
work, and liking tea is a fourth sentence doing none of that work. It was also most of the 5 s this
video had to lose.

| id | kind | from | to | narration (TTS) | targets | ask | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 120 | A small shop in Dubai. | | | | Shop front, awning sways 2 degrees. fatima steps out from the door (spring in at frame 10), waves (arm "wave" for 40 frames), and a name badge pins itself to her top: "Fatima". No English line yet: the beat says where we are, and the badge says who she is without a sentence. Camera pushes in slowly and settles by 108. |
| n1 | notice | 120 | 270 | Hello. I'm Fatima. | I'm | tap | 258 | fatima at the door, now close. Bubble: "Hello. I'm Fatima." with "I'm" in ACCENT, typed on the narration, and the badge gives a small answering bounce as "Fatima" is said. The tap is the two chips "I'm" and "Fatima". |
| n2 | notice | 270 | 420 | I live in Dubai. | I live in | say the word | 408 | Behind fatima the shop wall opens like a window onto a flat Dubai skyline (tall tower, sail-shaped hotel, simple silhouettes in blue). A map pin drops from the top and bounces once on the skyline; a small house icon appears on the pin. fatima points at it. Bubble: "I live in Dubai." The learner says the chunk "I live in", not the whole sentence: rung 2 is deliberately small. |
| predict | predict | 420 | 540 | What does she do? | a shop, a school, a taxi | predict | 528 | The prediction moment. The skyline slides out and the shop interior slides halfway in, cropped so the counter is visible but the hanging sign is not. A thought cloud over fatima holds three small icons: a shop front, a school, a taxi. Nothing is spoken in English; the caption asks in the learner's own language. The ask is one tap. A tap on the shop lights it leaf; a tap on either other icon slides it gently off and leaves the other two, which is a nudge, not a mark. The answer arrives in n3 either way. |
| n3 | notice | 540 | 690 | I work in a shop. | I work in | say the line | 678 | The shop interior completes its slide. fatima is behind the counter, a tea tin in hand; the hanging sign reading "SHOP" swings in above her and settles by 600. Bubble: "I work in a shop." A customer silhouette (grey, no face) buys a tin and leaves by 660. The learner says the whole line at 678, with the shop still around it. |
| explain | explain | 690 | 870 | I'm, I live, I work. The same three sentences are yours. | I'm, I live, I work | tap | 858 | PAPER background. A large ID-style badge builds in the centre, line by line: "I'm Fatima" (frame 700), "I live in Dubai" (740), "I work in a shop" (780); each "I" word is ACCENT and the three I's line up vertically to show the same shape. At frame 812 the badge flips on its vertical axis: the photo circle now shows you, and the three lines become "I'm ...", "I live in ...", "I work in ..." with dotted blanks. fatima small in the corner circle, nodding. Settled by 846; the tap is the three "I" chips. |
| practise | practise | 870 | 1080 | Say it with me. I live in London and I work in a cafe. | I live in, I work in | say it changed | 1068 | Pale blue background, fatima large in a white circle. A new city and a new job, so the rung is a change of situation and not a repeat: the learner has said Fatima's sentences and now says the same shapes with different words in them. Karaoke in 88 px over two lines; "in" underlined in ACCENT both times, "London" and "a cafe" in SAFFRON. Line complete by 1032, mic cue in by 1044. On resume the flipped badge reappears small at the bottom with a leaf tick. |
| recap | recap | 1080 | 1200 | You can say where you live and what you do. Again tomorrow. | | | | ACCENT background, white card: three lines with blanks, each I-phrase in ACCENT and the blank a saffron dotted line, which is the check stem. Under the card three small icons spring in: name badge, map pin, shop sign. The narration is the self-efficacy close, in the learner's own language. Hold with nothing moving. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | متجر صغير في دبي. | Una tienda pequeña en Dubái. | दुबई में एक छोटी दुकान। | Небольшой магазин в Дубае. | Dubai'de küçük bir dükkan. | 迪拜的一家小店。 |
| n1 | مرحبًا. أنا فاطمة. | Hola. Soy Fatima. | नमस्ते। मैं फ़ातिमा हूँ। | Здравствуйте. Я Фатима. | Merhaba. Ben Fatima. | 你好。我是 Fatima。 |
| n2 | أعيش في دبي. | Vivo en Dubái. | मैं दुबई में रहती हूँ। | Я живу в Дубае. | Dubai'de yaşıyorum. | 我住在迪拜。 |
| predict | ماذا تعمل؟ | ¿A qué se dedica? | वह क्या काम करती है? | Чем она занимается? | Ne iş yapıyor? | 她做什么工作？ |
| n3 | أعمل في متجر. | Trabajo en una tienda. | मैं एक दुकान में काम करती हूँ। | Я работаю в магазине. | Bir dükkanda çalışıyorum. | 我在一家商店工作。 |
| explain | I'm، I live، I work. الجمل الثلاث نفسها لك. | I'm, I live, I work. Esas tres frases son tuyas. | I'm, I live, I work। वही तीन वाक्य आपके हैं। | I'm, I live, I work. Эти три фразы и твои. | I'm, I live, I work. Aynı üç cümle senin de. | I'm、I live、I work。同样三句话也是你的。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | يمكنك أن تقول أين تعيش وماذا تعمل. غدًا مرة أخرى. | Ya puedes decir dónde vives y qué haces. Mañana otra vez. | अब आप बता सकते हैं कि आप कहाँ रहते हैं और क्या करते हैं। कल फिर। | Теперь вы можете сказать, где живёте и чем занимаетесь. Завтра снова. | Artık nerede yaşadığını ve ne iş yaptığını söyleyebilirsin. Yarın tekrar. | 你现在能说出你住在哪里、做什么工作了。明天再来。 |

### Interactive moments

- Tappable words: all caption words. In the explain beat each of the three badge lines is a tappable chip that replays that line in Fatima's voice.
- Five stops, growing: tap the key words at 258, say "I live in" at 408, predict her job at 528, say the whole line at 678, tap the three I-chips at 858, say it with new words at 1068. The first ask lands at 8.6 s and no passive stretch runs longer than 8.6 s.
- At 1068 the learner says "I live in London and I work in a cafe." Scored as shadow (ITM-SPK-0501: timing and stress). The free-use item that follows asks for the learner's own three sentences, so both the practise beat and the recap deliberately avoid Fatima's answers.
- Prediction (frame 528, `predict` beat): one tap on the shop, the school or the taxi, before n3 answers it. A tap on the shop lights it; a tap on either other icon slides it away and leaves the other two. **Not wired yet**: needs the `predict` beat kind and ask kind, LP-46.
- Extra tap: in n2 and n3 the map pin and the shop sign are hotspots; tapping plays "I live in Dubai" / "I work in a shop" and highlights "in".

---

## 3. ATM-A2-MED-0008: The gas bill

| Field | Value |
| --- | --- |
| atom_id | ATM-A2-MED-0008 |
| title | The gas bill |
| sublevel / strand | A2.1 / MED (Mediation) |
| type | video, 40 s, 1200 frames (re-cut from 49 s on 26 October) |
| single target | "Pay by [date]" (on or before), carried into a three-point relay: when, how, the number |
| characters | sami (has the letter), you (reads it and tells him) |
| setting | London flat-share kitchen: small table, kettle, fridge with magnets, grey window light, a brown envelope |
| check stem echo | "Pay by ___ May." and the relay "Tell them the three things they must do." |

### Beats

Re-cut 26 October 2026 to **The attention law**. On the video spine: eight beats, 1200 frames. The old
"This is your gas bill." beat is folded into the hook, where the letter's header resolves to GAS BILL;
naming the object is not one of the three things the criterion asks the learner to pass on, so it does
not need a beat or an ask of its own. That pays for the `predict` beat. Rung 5, "say it changed", is
deliberately missing from this video: the changed situation for a mediation atom is telling somebody
else, which is the relay item `ITM-MED-0804` immediately after, and the video should not spend the
learner's first go at it.

| id | kind | from | to | narration (TTS) | targets | ask | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 120 | Sami has a letter. He cannot read it. | | | | Kitchen. sami at the table holding an unfolded letter whose text is grey squiggles. A "?" bubble grows over his head and wobbles. you walks in from the right with two mugs, puts them down, takes the letter. Camera pushes in; at frame 90 the top squiggle resolves into a header, a small flame icon and "GAS BILL" in INK, and the rest stays squiggly. Settled by 108. |
| n1 | notice | 120 | 270 | Please pay by thirty May. | pay by | tap | 258 | The letter's second line resolves: "Pay by 30 May". A wall calendar beside the fridge flips to May; the 30 gets a saffron circle; then all the days from today up to the 30 fill leaf green from left to right (the "on or before" metaphor) and the 31 stays grey. Bubble: "Please pay by thirty May." with "pay by" in ACCENT. The fill finishes by 240 so the tap sits on a still frame. |
| predict | predict | 270 | 390 | How can he pay? | online, at the shop | predict | 378 | The prediction moment. The letter's third line is still squiggles. A thought cloud over you holds three icons: a phone, a corner shop and an envelope with a stamp. Nothing is spoken in English; the caption asks in the learner's own language. The ask is one tap, and two of the three are right, which is the honest shape of this scene. A tap on the phone or the shop lights it leaf; a tap on the envelope slides it away gently. n2 answers it either way. |
| n2 | notice | 390 | 540 | You can pay online or at the shop. | online, at the shop | say the word | 528 | The third line resolves. The two icons the learner just tapped lift out of the thought cloud and settle above the table: a phone with a tick on screen and a small corner-shop front. A coin hops from the letter into the phone, then a second coin hops into the shop door. Bubble: "You can pay online or at the shop." The learner says "online" at 528. |
| n3 | notice | 540 | 690 | Use reference number four four seven one. | reference number | say the word | 678 | The fourth line resolves: a tag with four boxes; the digits 4, 4, 7, 1 stamp in one per 12 frames with a soft thump each, finishing at 636. The tag is drawn like a luggage label. Bubble: "Use reference number four four seven one." sami leans in, his "?" now half a "!" shape. The learner says "reference number" at 678. |
| explain | explain | 690 | 870 | Three things: when, how, and the number. | when, how, the number | tap | 858 | PAPER background. The letter shrinks to the left; three stickers peel off it one at a time and fly to the right into sami's open hand: a calendar sticker "when: by 30 May" (frame 710), a phone-and-shop sticker "how: online or at the shop" (760), a tag sticker "the number: 4471" (810). As the third lands, sami's "?" flips into a leaf tick. Below, a one-line strip: "pay by = on or before" with a tiny calendar bar. you small in the corner circle. The tap is the three stickers. |
| practise | practise | 870 | 1080 | Say it with me. Pay by thirty May, online or at the shop. | Pay by, online, at the shop | say the line | 1068 | Pale blue background, you large in a white circle facing sami (small, listening, right). Karaoke of "Pay by thirty May, online or at the shop." in 80 px over two lines. Line complete by 1032, mic cue in by 1044. On resume sami gives a thumbs up and the three stickers line up at the bottom with ticks. |
| recap | recap | 1080 | 1200 | You can pass on the three things. Again tomorrow. | | | | ACCENT background, white card: three lines with blanks, each starting word in ACCENT, which is the check stem. The three stickers spring in under the card in a row: calendar, phone and shop, tag. The narration is the self-efficacy close, in the learner's own language. Hold with nothing moving. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | لدى سامي رسالة. لا يستطيع قراءتها. | Sami tiene una carta. No puede leerla. | सामी के पास एक चिट्ठी है। वह पढ़ नहीं पाता। | У Сами письмо. Он не может его прочитать. | Sami'nin bir mektubu var. Okuyamıyor. | Sami 有一封信。他看不懂。 |
| n1 | يرجى الدفع بحلول 30 مايو. | Pague antes del 30 de mayo. | कृपया 30 मई तक भुगतान करें। | Оплатите до 30 мая. | Lütfen 30 Mayıs'a kadar ödeyin. | 请在 5 月 30 日前付款。 |
| predict | كيف يمكنه الدفع؟ | ¿Cómo puede pagar? | वह कैसे भुगतान कर सकता है? | Как он может заплатить? | Nasıl ödeyebilir? | 他可以怎么付款？ |
| n2 | يمكنك الدفع عبر الإنترنت أو في المتجر. | Puedes pagar en línea o en la tienda. | आप ऑनलाइन या दुकान पर भुगतान कर सकते हैं। | Можно оплатить онлайн или в магазине. | İnternetten veya dükkandan ödeyebilirsiniz. | 可以在线支付或在店里支付。 |
| n3 | استخدم الرقم المرجعي 4471. | Usa el número de referencia 4471. | रेफ़रेंस नंबर 4471 इस्तेमाल करें। | Укажите номер ссылки 4471. | 4471 referans numarasını kullanın. | 使用参考号 4471。 |
| explain | ثلاثة أشياء: متى، كيف، والرقم. | Tres cosas: cuándo, cómo y el número. | तीन बातें: कब, कैसे, और नंबर। | Три вещи: когда, как и номер. | Üç şey: ne zaman, nasıl ve numara. | 三件事：什么时候、怎么付、号码。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | يمكنك نقل الأشياء الثلاثة. غدًا مرة أخرى. | Ya puedes pasar los tres datos. Mañana otra vez. | अब आप तीनों बातें बता सकते हैं। कल फिर। | Теперь вы можете передать все три вещи. Завтра снова. | Artık üç şeyi aktarabilirsin. Yarın tekrar. | 你现在能把这三件事转告别人了。明天再来。 |

### Interactive moments

- Tappable words: all caption words; in the explain beat the three stickers are tappable chips that replay "by thirty May", "online or at the shop", "reference number four four seven one".
- Five stops, growing: tap the key words at 258, predict how he can pay at 378, say "online" at 528 and "reference number" at 678, tap the three stickers at 858, say the whole line at 1068. The first ask lands at 8.6 s and no passive stretch runs longer than 8.6 s.
- At 1068 the learner says: "Pay by thirty May, online or at the shop." Model answer: the same line. Scored as read-aloud; the relay item ITM-MED-0804 that follows asks for all three points in the learner's own words, which is where rung 5 lives for this atom.
- Prediction (frame 378, `predict` beat): one tap on the phone, the shop or the stamped envelope, before n2 answers it. Two of the three are right. **Not wired yet**: needs the `predict` beat kind and ask kind, LP-46.
- Extra tap: in n1, the calendar is a hotspot for 90 frames. Tapping any day up to the 30th fills it leaf and plays "pay by thirty May"; tapping the 31st dims it grey and the strip "pay by = on or before" flashes once (consequence first, then the correct form).

---

## 4. ATM-A2-INT-0009: We're out of oat milk

| Field | Value |
| --- | --- |
| atom_id | ATM-A2-INT-0009 |
| title | We're out of oat milk |
| sublevel / strand | A2.1 / INT (Interaction) |
| type | video, 54 s, 1620 frames |
| single target | "Do you have ... instead?" with instead at the end, answered with "That's fine, thank you." |
| characters | leo (barista), you (customer), maya (explain beat only, corner circle) |
| setting | The Shoreditch cafe set from Cafe.tsx (window, shelves, hanging sign, counter) plus a glass-door fridge with milk cartons behind leo |
| check stem echo | "Sorry, we're ___ of oat milk." and "Do you have soy milk ___?" |

### Beats

Re-cut 26 October 2026 to the board's attention rule, as the Cafe reference was:
eleven beats of 2 to 7 seconds, every teaching beat ending on its stopping line
with a `target` and a `pauseAt`, a prediction beat before the learner's line,
the old twelve-second explain beat split in two, and two say-asks instead of one
so the ask grows (the line, then the line with a new word in it). The recap
narration is the self-efficacy close. Duration grew from 1500 to 1620 frames.
Every `pauseAt` below is a settled frame: the composition holds it with nothing
mid-move and the whole caption lit.

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 120 | A latte with oat milk, please. | | | Cafe set. you at the counter (facing left), leo behind it waves. you's bubble (tail right): "A latte with oat milk, please." A small oat-milk carton icon (blue, with an oat sprig) bounces on the counter. Camera at rest. |
| n1 | notice | 120 | 270 | Sorry, we're out of oat milk. | out of | 252 | leo turns to the fridge; the camera pans right with him. On the shelf, the oat-milk slot is empty: a dotted carton outline. Gag: leo lifts the last carton, turns it upside down, one drop falls with a tiny plink. leo's bubble (tail left): "Sorry, we're out of oat milk." with "out of" in ACCENT. leo shrugs, palms up. The whole gag lands by 246, so the stop at 252 holds a settled frame. |
| predict | notice | 270 | 330 | What do you say? | | 318 | The prediction moment. Camera pans back to you, who is thinking. A thought cloud over you holds a big ACCENT "?" and the two milks they can see in the fridge, soy and almond. Nothing is said; the caption asks the question in the learner's own language. Carries no `target`, so the player plays it straight through until a "predict" ask kind exists; the intended ask is one tap on a carton. |
| n2 | notice | 330 | 480 | Do you have soy milk instead? | instead | 456 | A soy carton (green) slides along the shelf from the right and stops in the empty slot with a soft bump, filling the dotted outline. you's bubble builds word by word and "instead" arrives last. you's arm "raise". |
| n3 | notice | 480 | 570 | Yes, we do. | | | leo holds up the soy carton, nods twice. Bubble: "Yes, we do." A leaf tick pops over the carton. Short beat, no ask; hold on both characters smiling. |
| n4 | notice | 570 | 720 | That's fine, thank you. | That's fine | 696 | you's bubble: "That's fine, thank you." with "That's fine" in ACCENT. leo pours the soy milk into a latte cup (steam from the Cafe.tsx `Steam` helper), slides it across the counter to you. |
| explain | explain | 720 | 900 | Out of means none left. | Out of | 876 | PAPER background, maya small in the corner circle. A shelf with two slots, sitting in the middle of the frame while it is the only thing on the page. The oat carton fades to a dotted outline (750) and the label "out of = none left" appears under it in INK (786). Nothing else: one idea, one stop. |
| explain2 | explain | 900 | 1080 | Instead means in its place. | Instead | 1056 | The soy carton slides into the dotted slot (906 to 950) and the label "instead = in its place" appears (956). The shelf lifts 140 px (976) to make room, and the question rolls in as a three-carriage train (1004): "Do you have" (engine) + "soy milk" (carriage) + "instead?" (last carriage, ACCENT, with a small flag), so the learner sees instead is always the last carriage. |
| practise | practise | 1080 | 1296 | Say it with me. Do you have soy milk instead? | Do you have, instead | 1266 | Pale blue background, leo large in a white circle, listening pose. Karaoke of "Do you have soy milk instead?" in 96 px; "instead" rises 10 px and turns ACCENT as it is spoken. The line is complete by 1230 and the mic is up and pulsing by 1266, which is the frame the player holds. On resume leo gives a thumbs up and the soy carton pops a tick. |
| again | practise | 1296 | 1476 | Do you have almond milk instead? | almond milk, instead | 1446 | The same frame with a new word in it: the ask grows. Eyebrow "NOW THIS ONE", karaoke of "Do you have almond milk instead?" with "almond" and "instead?" in ACCENT. Mic up by 1446. On resume the almond carton pops a tick. |
| recap | recap | 1476 | 1620 | You can ask for another milk. Again tomorrow. | another milk | | ACCENT background, white card: "REMEMBER", line one "Do you have ... instead?" with the blank in saffron dots and "instead" in ACCENT, line two "That's fine." The card holds the check stem; the self-efficacy close is the narration, so it is spoken and captioned in the learner's own language. Below the card the dotted oat carton and the solid soy carton spring in side by side. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | لاتيه بحليب الشوفان، من فضلك. | Un latte con leche de avena, por favor. | ओट मिल्क वाला लाते, कृपया। | Латте на овсяном молоке, пожалуйста. | Yulaf sütlü latte, lütfen. | 一杯燕麦奶拿铁，谢谢。 |
| n1 | آسف، نفد حليب الشوفان. | Lo siento, no queda leche de avena. | माफ़ कीजिए, ओट मिल्क ख़त्म है। | Извините, овсяное молоко закончилось. | Üzgünüm, yulaf sütü bitti. | 抱歉，燕麦奶没了。 |
| predict | ماذا تقول أنت؟ | ¿Qué dices tú? | आप क्या कहेंगे? | Что вы скажете? | Sen ne dersin? | 你会怎么说？ |
| n2 | هل لديك حليب الصويا بدلًا منه؟ | ¿Tienes leche de soja en su lugar? | क्या इसकी जगह सोया मिल्क है? | А соевое молоко есть вместо него? | Onun yerine soya sütü var mı? | 那有豆奶吗？ |
| n3 | نعم، لدينا. | Sí, tenemos. | हाँ, है। | Да, есть. | Evet, var. | 有的。 |
| n4 | لا بأس، شكرًا. | Está bien, gracias. | ठीक है, धन्यवाद। | Хорошо, спасибо. | Tamam, teşekkürler. | 好的，谢谢。 |
| explain | Out of تعني لم يبقَ شيء. | Out of: no queda. | Out of मतलब ख़त्म। | Out of: ничего не осталось. | Out of: kalmadı. | Out of 表示没了。 |
| explain2 | Instead تعني بدلًا منه. | Instead: en su lugar. | Instead मतलब उसकी जगह। | Instead: вместо него. | Instead: onun yerine. | Instead 表示代替。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| again | هل لديك حليب اللوز بدلًا منه؟ | ¿Tienes leche de almendra en su lugar? | क्या इसकी जगह आमंड मिल्क है? | А миндальное молоко есть вместо него? | Onun yerine badem sütü var mı? | 那有杏仁奶吗？ |
| recap | يمكنك أن تطلب حليبًا آخر. غدًا مرة أخرى. | Ya puedes pedir otra leche. Mañana otra vez. | अब आप दूसरा दूध माँग सकते हैं। कल फिर। | Теперь вы можете попросить другое молоко. Завтра снова. | Artık başka bir süt isteyebilirsin. Yarın tekrar. | 你现在可以要另一种奶了。明天再来。 |

### Interactive moments

- Tappable words: all caption words; the two cartons in the explain beats are chips that play "out of oat milk" and "soy milk instead".
- Six stops, growing: tap the key words at 252, say the line at 456 and 696, tap the meaning at 876 and 1056, say it at 1266, then say it with a new word at 1446. Nothing passive runs longer than 8.4 s and the first ask lands at 8.4 s.
- At 1266 the learner says "Do you have soy milk instead?" and at 1446 "Do you have almond milk instead?" Both scored as read-aloud with "instead" weighted; the roleplay item ITM-INT-0904 then puts the learner opposite Leo for three turns.
- Prediction (frame 318, `predict` beat): "What do you say?" with the thought cloud up, before n2 gives the line. The ask is one tap on the soy or almond carton, each playing "Do you have [soy/almond] milk instead?"; tapping the dotted oat carton makes it wobble and replays "we're out of oat milk". **Not wired yet**: `asksFor` has no predict kind and the `Beat` kind union in `Cafe.tsx` has no `predict` member, so the beat carries no `target` and plays straight through. Its `pauseAt` of 318 is where the stop belongs once both exist.

---

## 5. ATM-A2-GRM-0003: Yesterday, today, tomorrow

| Field | Value |
| --- | --- |
| atom_id | ATM-A2-GRM-0003 |
| title | Yesterday, today, tomorrow |
| sublevel / strand | A2.1 / GRM (Grammar) |
| type | video, 50 s, 1500 frames |
| single target | Time word first, then the regular verb changes: worked / work / will work |
| characters | you (the traveller, in a hard hat as the engineer on secondment), maya (explain and practise) |
| setting | A road-style timeline across three flat skylines: Riyadh (left, sepia), Dubai (centre, full colour), London (right, outline only) |
| check stem echo | "Yesterday I ___ at home." and "Tomorrow I ___ in London." |

### Beats

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 120 | One week. Three cities. | | | PAPER background. A suitcase slides in from the left and stops; three city stickers slap onto it one by one: Riyadh (tower with a crown), Dubai (sail hotel), London (clock tower). A small calendar page flutters down and lands on the suitcase. Cut to the timeline road. |
| n1 | notice | 120 | 270 | Yesterday I worked in Riyadh. | worked | | A road runs left to right with three stops. Camera starts on the left stop: the Riyadh skyline in sepia, a calendar page reading "Yesterday" with a left-pointing arrow. you sits at a desk with a hard hat, drawn in sepia too. Bubble: "Yesterday I worked in Riyadh." As the word "worked" types, a small "-ed" tag flies in from the right and clips onto the end of "work" with a click. |
| n2 | notice | 270 | 420 | Today I work in Dubai. | work | | Camera slides right to the centre stop: Dubai in full colour, a saffron "you are here" pin bouncing over you at a desk. Calendar page "Today". Bubble: "Today I work in Dubai." The verb "work" stands alone, nothing attached, and gets a small ACCENT underline. |
| n3 | notice | 420 | 570 | Tomorrow I will work in London. | will work | | Camera slides right to the last stop: London drawn as a dotted outline (not here yet), the calendar page "Tomorrow" with a right-pointing arrow. you is a dotted outline too, with a tiny suitcase. Bubble: "Tomorrow I will work in London." As it types, a "will" tile slides in from the left and parks in front of "work" with a click. |
| explain | explain | 570 | 1020 | Past: add ed. Future: add will. | ed, will | | PAPER background, maya small in the corner circle. Centre: a horizontal slider with three notches labelled with the three calendar pages (Yesterday, Today, Tomorrow) and the verb "work" in 150 px above the knob. you's hand drags the knob left (frame 630): a magnet tile "-ed" snaps onto the end, "worked", with a magnetic clack and two small motion lines. Knob back to centre (750): the tile falls off, "work". Knob dragged right (840): a "will" magnet snaps onto the front, "will work". At frame 940 all three forms line up in a column under their calendar pages, the added parts in ACCENT. |
| practise | practise | 1020 | 1350 | Say it with me. Worked. Work. Will work. | Worked, Work, Will work | 1230 | Pale blue background, maya large in a white circle. Karaoke of the three forms in 96 px, one per line; as each is spoken the slider knob at the bottom jumps to its notch (left, centre, right). At 1230 the mic pulses and the player pauses. On resume the three forms glow leaf. |
| recap | recap | 1350 | 1500 | worked, work, will work | worked, work, will work | | ACCENT background, white card: "REMEMBER" and the three forms in a row with their time icons above (left arrow, pin, right arrow), the "-ed" and "will" parts in SAFFRON. The three city stickers from the hook spring in under the card. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | أسبوع واحد. ثلاث مدن. | Una semana. Tres ciudades. | एक हफ़्ता। तीन शहर। | Одна неделя. Три города. | Bir hafta. Üç şehir. | 一周，三座城市。 |
| n1 | أمس عملت في الرياض. | Ayer trabajé en Riad. | कल मैंने रियाद में काम किया। | Вчера я работал в Эр-Рияде. | Dün Riyad'da çalıştım. | 昨天我在利雅得工作。 |
| n2 | اليوم أعمل في دبي. | Hoy trabajo en Dubái. | आज मैं दुबई में काम करता हूँ। | Сегодня я работаю в Дубае. | Bugün Dubai'de çalışıyorum. | 今天我在迪拜工作。 |
| n3 | غدًا سأعمل في لندن. | Mañana trabajaré en Londres. | कल मैं लंदन में काम करूँगा। | Завтра я буду работать в Лондоне. | Yarın Londra'da çalışacağım. | 明天我将在伦敦工作。 |
| explain | الماضي: أضف ed. المستقبل: أضف will. | Pasado: añade ed. Futuro: añade will. | भूतकाल: ed जोड़ें। भविष्य: will जोड़ें। | Прошлое: добавь ed. Будущее: добавь will. | Geçmiş: ed ekle. Gelecek: will ekle. | 过去：加 ed。将来：加 will。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | أمس، اليوم، غدًا. | ayer, hoy, mañana. | कल, आज, कल। | вчера, сегодня, завтра. | dün, bugün, yarın. | 昨天、今天、明天。 |

### Interactive moments

- Tappable words: all caption words; the three calendar pages are chips that play "yesterday", "today", "tomorrow".
- At the pause (frame 1230) the learner says: "Worked. Work. Will work." Model answer: the same three forms. Scored as read-aloud; the open-response item that follows asks for one real yesterday and one real tomorrow sentence.
- Extra tap: in the explain beat the slider is live for the whole beat: the learner can drag the knob to any notch and hear that form; this is the same control as the `time_slider` item (ITM-GRM-0301), so the learner meets it here before being scored on it.

---

## 6. ATM-A2-GRM-0002: Two coffees, some water (word tutorial)

| Field | Value |
| --- | --- |
| atom_id | ATM-A2-GRM-0002 |
| title | Two coffees, some water |
| sublevel / strand | A2.1 / GRM (Grammar) |
| type | word_tutorial, 40 s, 1200 frames |
| single target | Count it: a number and s (two coffees). Cannot count it: some (some water) |
| characters | leo, you |
| setting | Cafe counter close-up from Cafe.tsx: counter top, a jug, a sugar jar, cups |
| check stem echo | "Two ___ and some water, please." |

### Beats

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 120 | Two coffees and some water, please. | | | Cafe counter. you orders, bubble (tail right): "Two coffees and some water, please." leo nods and reaches below the counter. Two cups and a glass appear as grey outlines waiting to be filled. Cut in on the counter. |
| w1 | word | 120 | 330 | A coffee, two coffees. You can count coffees. | a coffee, two coffees | | Word card at the top: "a coffee, two coffees" with the s in ACCENT. Mini-scene: one cup springs up, a pointing finger taps it, "1" pops; a second cup springs up, tap, "2" pops; an "s" tile flies from the number and clips onto the end of "coffee". Steam from both cups. |
| w2 | word | 330 | 540 | Some water. You cannot count water. | some water | | Word card: "some water". Mini-scene: leo pours from a jug into a glass. Gag: a "2" tile tries to land on the water, slides off the surface and plops into the glass, bubbles rise. Then a "some" tile floats on the surface like a little boat and stays. leo shrugs, smiles. |
| w3 | word | 540 | 720 | Some sugar. Sugar is not counted either. | some sugar | | Word card: "some sugar". Mini-scene: sugar pours from a jar into a small pile. The "2" tile tries again, sinks into the pile with a puff; a "some" scoop lifts a spoonful and the "some" tile sits on the spoon. Quick beat, same rhythm as w2 so the pattern lands. |
| w4 | word | 720 | 880 | A sandwich, two sandwiches. Add es after ch. | two sandwiches | | Word card: "a sandwich, two sandwiches" with "es" in ACCENT. Mini-scene: two sandwiches slide onto a plate; the word "sandwich" splits so "ch" is visible, and an "es" tile clips on after it with the same click as w1. you's hand reaches for one. |
| practise | practise | 880 | 1120 | Say it with me. Two coffees and some water, please. | two coffees, some water | 1060 | Pale blue background, leo large in a white circle. Karaoke of "Two coffees and some water, please." in 88 px; "coffees" gets the s in ACCENT, "some" in ACCENT. At 1060 the mic pulses and the player pauses. On resume the grey outlines from the hook fill in: two cups and a glass, with a tick. |
| recap | recap | 1120 | 1200 | Count it: two coffees. Cannot count it: some water. | two coffees, some water | | ACCENT background, white card in two columns: left "count it" with two cups and "two coffee**s**"; right "cannot count it" with the glass and "**some** water". Hold. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | قهوتان وبعض الماء، من فضلك. | Dos cafés y algo de agua, por favor. | दो कॉफ़ी और थोड़ा पानी, कृपया। | Два кофе и немного воды, пожалуйста. | İki kahve ve biraz su, lütfen. | 两杯咖啡和一些水，谢谢。 |
| w1 | يمكن عدّ القهوة: قهوة، قهوتان. | Los cafés se cuentan: uno, dos. | कॉफ़ी गिनी जा सकती है: एक, दो। | Кофе можно сосчитать: один, два. | Kahve sayılır: bir, iki. | 咖啡可以数：一杯，两杯。 |
| w2 | لا يمكن عدّ الماء. قل some. | El agua no se cuenta. Di some. | पानी गिना नहीं जाता। some कहें। | Воду не сосчитать. Говори some. | Su sayılmaz. Some de. | 水不可数。用 some。 |
| w3 | السكر أيضًا لا يُعد. | El azúcar tampoco se cuenta. | चीनी भी नहीं गिनी जाती। | Сахар тоже не считают. | Şeker de sayılmaz. | 糖也不可数。 |
| w4 | أضف es بعد ch. | Añade es después de ch. | ch के बाद es जोड़ें। | После ch добавь es. | ch'den sonra es ekle. | ch 后面加 es。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | معدود: رقم و s. غير معدود: some. | Se cuenta: número y s. No se cuenta: some. | गिन सकते हैं: संख्या और s। नहीं: some। | Считаем: число и s. Не считаем: some. | Sayılıyorsa: sayı ve s. Sayılmıyorsa: some. | 可数：数字加 s。不可数：some。 |

### Interactive moments

- Tappable words: all caption words; each word card title is a chip that plays the card word; the "s", "es" and "some" tiles are chips that play "two coffees", "two sandwiches", "some water".
- At the pause (frame 1060) the learner says: "Two coffees and some water, please." Model answer: the same line. Scored as read-aloud; the free-use item ITM-GRM-0205 then asks for "some water" in a scene.
- Extra tap: in w2 the "2" tile is draggable for 90 frames. Dropped on a cup it clips on and plays "two coffees" (leaf glow); dropped on the glass it slides off and plops, then the "some" boat appears and plays "some water". Consequence first, then the correct form.

---

## 7. ATM-A2-RDG-0006: Metro notices (word tutorial)

| Field | Value |
| --- | --- |
| atom_id | ATM-A2-RDG-0006 |
| title | Metro notices |
| sublevel / strand | A2.1 / RDG (Reading) |
| type | word_tutorial, 40 s, 1200 frames |
| single target | "No" plus ing means do not do it (No eating or drinking); its opposite on a sign is "allowed" |
| characters | you, fatima (fellow passenger) |
| setting | Dubai Metro carriage interior (grey seats, gold rail, windows with passing skyline) and an escalator |
| check stem echo | tfng on "No eating or drinking on the train. Water is allowed." |

### Beats

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 120 | On the metro. Signs everywhere. | | | Carriage doors slide open; you steps in with a bag. Four small signs pop onto the wall in sequence (a no-food circle, a green tick, an escalator arrow, a seat icon), each with a soft tick sound. you looks up at them. Push in on the first sign. |
| w1 | word | 120 | 320 | No eating or drinking. You cannot eat or drink here. | No eating or drinking | | Word card at the top: "No eating or drinking" with "No" and both "ing" endings in ACCENT. Mini-scene: you sits, pulls a sandwich from the bag; the sign glows; you looks at the sign, looks at the sandwich, and tucks it back in the bag with a small sigh (gentle, no telling off). Under the card a strip: "No + ing = do not". |
| w2 | word | 320 | 510 | Allowed. You can do it. Water is allowed. | allowed | | Word card: "allowed" with a leaf tick. Mini-scene: you takes out a water bottle; the second sign reads "Water is allowed" and the tick on it pulses green; you drinks, fatima (sitting opposite) nods. The sandwich sign and the water sign sit side by side: circle-with-line vs tick. |
| w3 | word | 510 | 690 | Stand on the right. Walk on the left. | Stand on the right | | Word card: "Stand on the right". Mini-scene: an escalator in side view moving up. you stands on the right step holding the rail; fatima walks up the left side and passes with a wave. Two arrows on the sign: a standing figure on the right, a walking figure on the left. |
| w4 | word | 690 | 860 | Priority seat. A seat for people who need it more. | Priority seat | | Word card: "Priority seat". Mini-scene: back in the carriage, a seat with the icon. A grey silhouette with a stick boards; you stands up, gestures to the seat; the silhouette sits and the seat glows leaf. fatima smiles. |
| practise | practise | 860 | 1110 | Say it with me. No eating or drinking. Water is allowed. | No eating or drinking, allowed | 1050 | Pale blue background, fatima large in a white circle. Karaoke of the two sentences, one per line, in 80 px; "No" and the two "ing" endings in ACCENT, "allowed" in ACCENT with the tick. At 1050 the mic pulses and the player pauses. On resume both signs pop a tick. |
| recap | recap | 1110 | 1200 | No plus ing means do not. | No, ing | | ACCENT background, white card: "REMEMBER" and the line "No + ing = do not" with "No" and "ing" in ACCENT, then a row of the four signs in miniature with a fifth, "Mind the gap", sliding in last as a bonus. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | في المترو. لافتات في كل مكان. | En el metro. Carteles por todas partes. | मेट्रो में। हर जगह संकेत। | В метро. Везде знаки. | Metroda. Her yerde tabela. | 在地铁里。到处是标志。 |
| w1 | ممنوع الأكل أو الشرب هنا. | No se puede comer ni beber aquí. | यहाँ खाना-पीना मना है। | Здесь нельзя есть и пить. | Burada yiyip içmek yasak. | 这里不能吃喝。 |
| w2 | Allowed: مسموح. الماء مسموح. | Allowed: está permitido. El agua sí. | Allowed: अनुमति है। पानी ठीक है। | Allowed: можно. Вода разрешена. | Allowed: izin var. Su serbest. | Allowed：允许。可以喝水。 |
| w3 | قف على اليمين. امشِ على اليسار. | De pie a la derecha. Andar por la izquierda. | दाईं ओर खड़े हों। बाईं ओर चलें। | Стойте справа. Идите слева. | Sağda dur. Solda yürü. | 右侧站立。左侧行走。 |
| w4 | مقعد الأولوية: لمن يحتاجه أكثر. | Asiento prioritario: para quien lo necesita más. | प्राथमिकता सीट: ज़रूरतमंद के लिए। | Приоритетное место: тем, кому нужнее. | Öncelikli koltuk: daha çok ihtiyacı olana. | 优先座位：给更需要的人。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | No مع ing تعني لا تفعل. | No más ing: no lo hagas. | No के साथ ing: मत करो। | No плюс ing: нельзя. | No artı ing: yapma. | No 加 ing 表示禁止。 |

### Interactive moments

- Tappable words: all caption words; every sign on screen is a hotspot that reads the sign aloud and highlights its text (this is the PRD "touchable scene" pattern in miniature).
- At the pause (frame 1050) the learner says: "No eating or drinking. Water is allowed." Model answer: the same two sentences. Scored as read-aloud; the relay item ITM-RDG-0605 then asks the learner to tell a friend one rule.
- Extra tap: in w2, the sandwich and the water bottle are both tappable for 90 frames. Tap the bottle: the tick sign glows and plays "Water is allowed". Tap the sandwich: it dims grey, the circle sign pulses once and plays "No eating" (consequence first, no red).

---

## 8. ATM-A2-WRT-0007: Where are you? (word tutorial)

| Field | Value |
| --- | --- |
| atom_id | ATM-A2-WRT-0007 |
| title | Where are you? |
| sublevel / strand | A2.1 / WRT (Writing) |
| type | word_tutorial, 39 s, 1170 frames |
| single target | Question order: question word, then are, then you ("Where are you?") |
| characters | you (at a desk, typing). Amira is a contact name on the phone only; she is never drawn |
| setting | A small office at nine o'clock: desk, wall clock, an empty chair opposite, a phone held in you's hand with a chat thread |
| check stem echo | "Build the question." (Where / are / you) and "Fix the message: Where you are?" |

### Beats

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 120 | Nine o'clock. Amira is not here. | | | Office. The wall clock hands snap to 9:00 with a click. The chair opposite you is empty; a small dust-puff. you looks at the chair, picks up the phone; the phone screen grows to fill the lower two thirds of the frame with a chat header "Amira". |
| w1 | word | 120 | 300 | Hi Amira. Start with Hi and the name. | Hi Amira | | Word card at the top: "Hi Amira". Mini-scene on the phone: a typing cursor; "Hi Amira." types in letter by letter in a saffron bubble on the right; a small wave emoji pops after it. A faint label under the bubble: "Hi + name". |
| w2 | word | 300 | 540 | Where are you? Question word, then are, then you. | Where are you? | | Word card: "Where are you?". Gag: three tiles arrive on the phone in the wrong order, "Where you are?", and the question mark droops like a wilting stem. The "are" tile hops over "you" with a boing, lands in the middle, and the question mark stands up straight with a ping. Three labels fade in under the tiles: "question word", "are", "you". The tiles become the sent bubble. |
| w3 | word | 540 | 720 | Are you OK? Are first, then you. | Are you OK? | | Word card: "Are you OK?". Mini-scene: the tiles "you" "Are" "OK" arrive, "Are" hops to the front, the "?" pings again (same move as w2 so it reads as the same rule). The bubble sends. you looks at the empty chair once more. |
| w4 | word | 720 | 870 | See you soon. A friendly ending. | See you soon | | Word card: "See you soon". Mini-scene: typing dots appear on the left (grey bubble), then Amira's reply: "On the metro. See you soon." with a tiny train icon. you's shoulders drop in relief; the clock ticks to 9:05. |
| practise | practise | 870 | 1080 | Say it with me. Where are you? Are you OK? | Where are you, Are you OK | 1040 | Pale blue background, you large in a white circle holding the phone. Karaoke of the two questions in 88 px, one per line; "are" in ACCENT both times. At 1040 the mic pulses and the player pauses. On resume both question marks ping leaf. |
| recap | recap | 1080 | 1170 | Where are you? Are you OK? | Where are you, Are you OK | | ACCENT background, white card: "REMEMBER", the two questions with "are" in ACCENT, and under them a three-slot shape "[question word] [are] [you]" in saffron outlines. The phone thread shrinks into the corner. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | الساعة التاسعة. أميرة ليست هنا. | Las nueve. Amira no está. | नौ बजे। अमीरा यहाँ नहीं है। | Девять часов. Амиры нет. | Saat dokuz. Amira burada değil. | 九点了。Amira 不在。 |
| w1 | ابدأ بـ Hi والاسم. | Empieza con Hi y el nombre. | Hi और नाम से शुरू करें। | Начни с Hi и имени. | Hi ve isimle başla. | 用 Hi 加名字开头。 |
| w2 | أين أنت؟ كلمة السؤال، ثم are، ثم you. | ¿Dónde estás? Palabra interrogativa, are, you. | तुम कहाँ हो? प्रश्न शब्द, फिर are, फिर you। | Где ты? Вопрос, потом are, потом you. | Neredesin? Soru kelimesi, are, you. | 你在哪里？疑问词、are、you。 |
| w3 | هل أنت بخير؟ Are أولًا ثم you. | ¿Estás bien? Are primero, luego you. | तुम ठीक हो? पहले Are, फिर you। | Ты в порядке? Сначала are, потом you. | İyi misin? Önce are, sonra you. | 你还好吗？先 are，再 you。 |
| w4 | أراك قريبًا. خاتمة ودّية. | Hasta pronto. Un final amistoso. | जल्द मिलते हैं। दोस्ताना अंत। | До скорого. Дружеское окончание. | Görüşürüz. Samimi bir kapanış. | 回头见。友好的结尾。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | أين أنت؟ هل أنت بخير؟ | ¿Dónde estás? ¿Estás bien? | तुम कहाँ हो? तुम ठीक हो? | Где ты? Ты в порядке? | Neredesin? İyi misin? | 你在哪里？你还好吗？ |

### Interactive moments

- Tappable words: all caption words; each chat bubble on the phone is a chip that reads the message aloud.
- At the pause (frame 1040) the learner says: "Where are you? Are you OK?" Model answer: the same two questions. Scored as read-aloud (this is a writing atom, but hearing the order before typing it is the "hear first, read second" rule); the free-use item ITM-WRT-0704 then asks for a typed two-line message.
- Extra tap: in w2 the three tiles are draggable for 120 frames (same control as the `sentence_build` item ITM-WRT-0701). Correct order makes the "?" stand up and sends the bubble; a wrong order makes the "?" droop and the wrong tile wobble, then the "are" tile hops into place by itself.

---

## 9. ATM-A2-INT-0010: The bill, please (word tutorial)

| Field | Value |
| --- | --- |
| atom_id | ATM-A2-INT-0010 |
| title | The bill, please |
| sublevel / strand | A2.1 / INT (Interaction) |
| type | word_tutorial, 39 s, 1170 frames |
| single target | "Could I have the bill, please?" (the same shape as ordering: Could I have ... please) |
| characters | leo, you |
| setting | A cafe table by the window in the Cafe.tsx set: empty cup, saucer, a small card reader on the counter, a tip jar |
| check stem echo | "Could I have the ___, please?" and "Can I pay ___ card?" |

### Beats

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 120 | Coffee finished. Time to pay. | | | Table by the window. you's cup tips to show it is empty (last drop). you raises a hand (arm "raise"); leo across the room notices and starts over. A small clock icon in the window says it is time to go. Cut to the table as leo arrives. |
| w1 | word | 120 | 330 | The bill. The paper with the price. Could I have the bill, please? | the bill, Could I have | | Word card at the top: "the bill". Mini-scene: you's bubble shows the frame "Could I have ___, please?" with the blank empty; "a tea" (from the cafe lesson) slides out of the blank to the left and "the bill" slides in from the right and locks with a click. leo brings a small folded paper that unfolds to show "£3.50". Label under the frame: "same shape as ordering". |
| w2 | word | 330 | 540 | Pay by card. Pay with a bank card. | pay by card | | Word card: "pay by card". Mini-scene: leo holds out a card reader; you taps a bank card on it; the reader shows a leaf tick and a short beep. Bubble: "Can I pay by card?" with "by card" in ACCENT. |
| w3 | word | 540 | 720 | Pay in cash. Notes and coins. | pay in cash | | Word card: "pay in cash". Mini-scene: a note and two coins slide onto the saucer. Two small tiles sit side by side under the scene: "by card" and "in cash", the prepositions in ACCENT, so the contrast is visible without being explained. |
| w4 | word | 720 | 870 | Keep the change. The extra money is for you. | Keep the change | | Word card: "Keep the change". Mini-scene: leo holds out a coin as change; you waves a hand gently; the coin hops into the tip jar with a clink and leo smiles. Bubble: "Keep the change." |
| practise | practise | 870 | 1080 | Say it with me. Could I have the bill, please? | Could I have, the bill, please | 1040 | Pale blue background, leo large in a white circle holding the bill. Karaoke of "Could I have the bill, please?" in 96 px; "Could I have" and "please" in ACCENT, "the bill" in SAFFRON. At 1040 the mic pulses and the player pauses. On resume leo hands over the bill with a tick. |
| recap | recap | 1080 | 1170 | Could I have the bill, please? | Could I have, the bill, please | | ACCENT background, white card: "REMEMBER" and the line in the same three colours as the practise beat; under it the small frame "Could I have ___, please?" with "a tea" and "the bill" shown as two tiles that fit the same blank. Card icon, coins and the tip jar spring in below. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | انتهت القهوة. وقت الدفع. | Café terminado. Hora de pagar. | कॉफ़ी ख़त्म। भुगतान का समय। | Кофе выпит. Пора платить. | Kahve bitti. Ödeme zamanı. | 咖啡喝完了。该付钱了。 |
| w1 | الفاتورة: الورقة التي فيها السعر. | The bill: el papel con el precio. | The bill: दाम वाला काग़ज़। | The bill: бумага с ценой. | The bill: fiyatın yazdığı kağıt. | The bill：写着价格的单子。 |
| w2 | الدفع بالبطاقة. | Pagar con tarjeta. | कार्ड से भुगतान। | Оплата картой. | Kartla ödemek. | 刷卡支付。 |
| w3 | الدفع نقدًا: أوراق وعملات. | Pagar en efectivo: billetes y monedas. | नक़द भुगतान: नोट और सिक्के। | Наличными: купюры и монеты. | Nakit ödemek: banknot ve bozuk para. | 现金支付：纸币和硬币。 |
| w4 | احتفظ بالباقي. | Quédate con el cambio. | बाक़ी पैसे आप रखें। | Сдачи не надо. | Üstü kalsın. | 不用找零。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | هل يمكنني الحصول على الفاتورة، من فضلك؟ | ¿Me trae la cuenta, por favor? | क्या मुझे बिल मिल सकता है? | Можно счёт, пожалуйста? | Hesabı alabilir miyim, lütfen? | 可以给我账单吗？ |

### Interactive moments

- Tappable words: all caption words; the word card titles and the two tiles "by card" / "in cash" are chips.
- At the pause (frame 1040) the learner says: "Could I have the bill, please?" Model answer: the same line. Scored as read-aloud; the say-it-see-it item ITM-INT-1004 then asks for the bill in the scene.
- Extra tap: in w2 and w3, when leo holds out the reader he asks "Card or cash?" (a short extra TTS line, not a caption line). The bank card and the note are both tappable for 90 frames: card plays "Can I pay by card?" and the reader ticks; note plays "I'll pay in cash" and the coins land on the saucer. Both are right; there is no wrong answer here.

---

# Part two: the second A2.1 week and the starter slice

Added on LP-61 for the content authored in `lib/learning-path/content.ts` as the second A2.1 week (an appointment, and getting to it) and the Pre-A1 to A1.1 starter slice. Same conventions as part one, with three amendments, all stated here rather than assumed:

| # | Amendment | Why |
| --- | --- | --- |
| A1 | One new drawn character, **ana**, which takes the cast to three new faces rather than the two part one allows | The starter slice is Pre-A1. Every existing character speaks at A1.2 or above in the atoms they already carry, and a learner on their first day needs a peer who says three words and stops. Omar, Noor and Elena are **not** drawn: Omar is told through **you**, Noor is a voice on a phone with sound rings (the tannoy treatment from Platform 4, not 14), and Elena is gone from the content, replaced by sami as the passer-by so the cast stays closed |
| A2 | The lesson order is the one in `docs/learning-model.md` §1.2: scene, notice, **say it with a response**, scaffolds, use it, come back later | These atoms are authored with two `free_use` phases, so the first spoken turn comes before the scaffolds. The explainer owns the scene and the notice and ends at the practise pause, which is where it hands to the first `free_use` item. `pauseAt` is therefore earlier in the frame count than in part one: the mic must be live by 0:50 of the lesson, not of the video |
| A3 | Word tutorials get a practise beat with a say-it, same as the video atoms | Part one's word tutorials ended on a recap. §1.2 makes the spoken turn compulsory in every variant |

Cast for part two: **you** (Omar in the week-two atoms, the learner in the starter slice), **maya** (explain and practise), **sami** (the passer-by, and the flatmate with the appointment card), **leo** (the shopkeeper in Two, please), **ana** (new, the newcomer in the starter slice). Noor is a voice only.

---

## 10. ATM-A2-INT-0012: Monday at ten

| Field | Value |
| --- | --- |
| atom_id | ATM-A2-INT-0012 |
| title | Monday at ten |
| sublevel / strand | A2.1 / INT (Talking with someone) |
| type | video, 50 s, 1500 frames |
| single target | Could I make an appointment, please? |
| characters | you (on the phone), maya (explain and practise). Noor is a voice on the phone, not drawn |
| setting | A kitchen table in a London flat, morning: a mug of tea, a phone, a wall clock at ten to nine. The health centre arrives as a flat-vector building card |
| check stem echo | "Say it. Ask for an appointment." |

### Beats

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 150 | Tuesday morning. Omar has a bad tooth. | | | Kitchen table, flat morning light. you sits with one hand against the cheek; a soft saffron ring pulses at the jaw twice (40 frames apart), no grimace, no red. A phone slides up from the bottom right and settles on the table. Title words drop in top-left: "Tuesday morning." |
| n1 | notice | 150 | 420 | Hillside Health Centre. How can I help? Could I make an appointment, please? | Could I make an appointment, please? | | you lifts the phone to the ear. A grey bubble with a tail to the left and three sound rings types the centre's line. Then you's saffron bubble, tail right: "Could I make an appointment, please?" with the whole phrase in ACCENT weight 800, "make an appointment" arriving one word at a time on the narration. |
| n2 | notice | 420 | 660 | Of course. Monday at ten? Monday at ten is fine, thank you. | Monday at ten is fine, thank you. | | A calendar page springs in centre-right with "MONDAY" and a small clock whose hands snap to ten with a thunk. The grey bubble offers the time; you nods once (12-frame ease) and the saffron bubble answers, with "is fine, thank you" in ACCENT. The page gets a leaf tick. |
| explain | explain | 660 | 1020 | Could I ... please. The same words as the cafe. | Could I, please | | PAPER background, maya in the corner circle bottom-left. Centre: two cards side by side. Left, a cup and "Could I have a coffee, please?"; right, a phone and "Could I make an appointment, please?". At frame 780 "Could I" lifts out of both cards and merges into one ACCENT chip above them; at 870 "please" does the same below. A dotted line joins the two cards. Nothing else is explained. |
| practise | practise | 1020 | 1380 | Say it with me. Could I make an appointment, please? | Could I make an appointment, please? | 1230 | Pale blue background, maya large in a white circle. Karaoke of the line in 88 px over two lines, "make an appointment" rising 10 px as it is spoken. At 1230 the player pauses and the mic pulses top-left with "Your turn". On resume the phone from the hook lights leaf green for 60 frames. |
| recap | recap | 1380 | 1500 | Could I make an appointment, please? | Could I make an appointment, please? | | ACCENT background, white card: "REMEMBER" eyebrow, then "Could I make an appointment, please?" and under it, smaller, "Monday at ten is fine, thank you." Three icons spring in below: phone, calendar page, clock at ten. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | صباح الثلاثاء. عمر يؤلمه ضرسه. | Martes por la mañana. A Omar le duele un diente. | मंगलवार सुबह। उमर के दाँत में दर्द है। | Утро вторника. У Омара болит зуб. | Salı sabahı. Omar'ın dişi ağrıyor. | 星期二早上。Omar 牙疼。 |
| n1 | هل يمكنني تحديد موعد، من فضلك؟ | ¿Podría pedir una cita, por favor? | क्या मैं अपॉइंटमेंट ले सकता हूँ? | Можно записаться на приём? | Randevu alabilir miyim, lütfen? | 我可以预约吗？ |
| n2 | الاثنين في العاشرة مناسب، شكرًا. | El lunes a las diez está bien, gracias. | सोमवार दस बजे ठीक है, धन्यवाद। | В понедельник в десять подходит, спасибо. | Pazartesi onda olur, teşekkürler. | 星期一十点可以，谢谢。 |
| explain | Could I ... please: نفس كلمات المقهى. | Could I ... please: como en la cafetería. | Could I ... please: कैफ़े जैसे शब्द। | Could I ... please: как в кафе. | Could I ... please: kafedeki gibi. | Could I ... please：和咖啡馆一样。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | اطلب موعدًا، ثم اقبل الوقت. | Pide la cita y acepta la hora. | अपॉइंटमेंट माँगो, समय मान लो। | Попроси приём и прими время. | Randevu iste, saati kabul et. | 先约时间，再接受时间。 |

### Interactive moments

- Tappable words: every caption word; in the explain beat the two cards are chips, each playing its own line, and the merged "Could I" chip plays both lines back to back.
- At the pause (frame 1230) the learner says: "Could I make an appointment, please?" Model answer: the same line. Scored as read-aloud, then the first `free_use` item `ITM-INT-1201` puts the same words into a live turn with Noor on the phone.
- Extra tap: in n2 the calendar page and the clock are tappable for 90 frames. Tapping the clock plays "ten o'clock" and the hands re-snap; tapping the page plays "Monday at ten". Tapping anywhere else replays the offer at 0.75x. No red, no lives.

---

## 11. ATM-A2-GRM-0013: Earlier or later? (word tutorial)

| Field | Value |
| --- | --- |
| atom_id | ATM-A2-GRM-0013 |
| title | Earlier or later? |
| sublevel / strand | A2.1 / GRM (Grammar) |
| type | word_tutorial, 40 s, 1200 frames |
| single target | Add er to the short word, and than before the second thing: cheaper than the taxi |
| characters | maya (presents throughout), you (in the mini-scenes) |
| setting | PAPER background with a bus stop strip along the bottom; a taxi, a bus and a train enter and leave the strip as the cards change |
| check stem echo | "Say it. Compare the two." |

### Beats

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 120 | The taxi is twelve pounds. The bus is two pounds. | | | Bus stop strip. A taxi pulls in with a price tag "£12" that drops like a luggage label; a bus pulls in behind with "£2". you stands between them, looking from one tag to the other (two head turns, 12-frame ease). No words on screen yet. |
| w1 | word | 120 | 330 | Cheaper. It costs less money. | cheaper | | Word card at the top: "cheaper" with "er" in ACCENT. Mini-scene: a seesaw with the two price tags on it tips down on the £2 side with a soft thunk; an "er" tile flies from the low side and clips onto the end of "cheap". The word card becomes "cheap**er**". |
| w2 | word | 330 | 520 | Quicker. It takes less time. | quicker | | Card: "quicker". Mini-scene: the bus and a train race across the strip; the train arrives first and a stopwatch above it stops at 20 minutes against the bus's 35. The "er" tile clips onto "quick" with the same click as w1, so the pattern is one gesture, not a rule. |
| w3 | word | 520 | 700 | Earlier. Before the time they said. Later. After it. | earlier, later | | Card: "earlier / later". Mini-scene: a single clock face centre; two ghost hands sweep back to nine and forward to eleven, leaving an "earlier" chip on the left of the clock and a "later" chip on the right. maya's hand points left, then right. |
| w4 | word | 700 | 860 | Nearer. It is a shorter way. | nearer | | Card: "nearer". Mini-scene: two map pins drop on a simple street line, the health centre at 300 m and the hospital at 2 km; a dotted path draws to the nearer pin and the "er" tile clips onto "near". The three "er" tiles from w1, w2 and w4 then line up at the top edge. |
| practise | practise | 860 | 1100 | Say it with me. The bus is cheaper than the taxi. | cheaper than | 1020 | Pale blue background, maya large in a white circle. Karaoke in 88 px; "cheaper" with the "er" in ACCENT, and "than" in SAFFRON with a small arrow under it pointing at "the taxi". At 1020 the mic pulses and the player pauses. On resume the two price tags from the hook swing in under the line. |
| recap | recap | 1100 | 1200 | cheaper, quicker, earlier, nearer. Than comes next. | cheaper, than | | ACCENT background, white card: "REMEMBER", then "cheap**er** **than** the taxi" with er and than picked out, and under it the four words in a row, each with its own small icon (coin, stopwatch, clock, map pin). Hold. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | التاكسي 12 جنيهًا. الباص 2. | El taxi cuesta 12 libras. El bus, 2. | टैक्सी 12 पाउंड। बस 2 पाउंड। | Такси 12 фунтов. Автобус 2. | Taksi 12 sterlin. Otobüs 2. | 出租车 12 镑，公交 2 镑。 |
| w1 | cheaper: أرخص، يكلف أقل. | cheaper: más barato, cuesta menos. | cheaper: सस्ता, कम पैसे। | cheaper: дешевле, стоит меньше. | cheaper: daha ucuz, az tutar. | cheaper：更便宜，花得少。 |
| w2 | quicker: أسرع، وقت أقل. | quicker: más rápido, menos tiempo. | quicker: तेज़, कम समय। | quicker: быстрее, меньше времени. | quicker: daha hızlı, az zaman. | quicker：更快，用时少。 |
| w3 | earlier: أبكر. later: لاحقًا. | earlier: más temprano. later: más tarde. | earlier: पहले। later: बाद में। | earlier: раньше. later: позже. | earlier: daha erken. later: daha geç. | earlier：更早。later：更晚。 |
| w4 | nearer: أقرب. | nearer: más cerca. | nearer: ज़्यादा पास। | nearer: ближе. | nearer: daha yakın. | nearer：更近。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | أضف er، ثم than قبل الشيء الثاني. | Añade er y than antes de la segunda cosa. | er जोड़ो, दूसरी चीज़ से पहले than। | Добавь er, затем than перед вторым. | er ekle, sonra than. | 加 er，第二样前面用 than。 |

### Interactive moments

- Tappable words: all caption words; each card title is a chip; the three "er" tiles are chips that play "cheaper", "quicker", "nearer" in isolation so the ending is audible on its own.
- At the pause (frame 1020) the learner says: "The bus is cheaper than the taxi." Model answer: the same line. Scored as read-aloud; the first `free_use` item `ITM-GRM-1301` then asks for the same comparison from the two prices, with Maya answering.
- Extra tap: in w1 the "er" tile is draggable for 90 frames. Dropped on "cheap" it clips on with a click and plays "cheaper"; dropped on "more" (a decoy chip that floats in at frame 250) the "more" chip wobbles, fades, and the tile returns to its start. Consequence first, then the correct form, no mark.

---

## 12. ATM-A2-SPK-0014: Which way?

| Field | Value |
| --- | --- |
| atom_id | ATM-A2-SPK-0014 |
| title | Which way? |
| sublevel / strand | A2.1 / SPK (Speaking) |
| type | video, 50 s, 1500 frames |
| single target | Excuse me, how do I get to the health centre? |
| characters | you (lost, with a phone in hand), sami (the passer-by), maya (explain corner) |
| setting | A north London street: terraced houses, a postbox, a chemist with a green cross, a side street on the left. Morning, thin blue sky |
| check stem echo | "Say it. Ask the way." |

### Beats

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 180 | Ten to ten. Omar cannot find the health centre. | | | Street in flat vector. you turns on the spot once (360 in 40 frames, feet sliding), a "?" bubble droops above. A wall clock graphic top-right reads ten to ten and ticks twice. The side street is visible at the left edge but unmarked. |
| n1 | notice | 180 | 450 | Excuse me, how do I get to the health centre? | how do I get to | | sami enters from the right with a shopping bag. you's bubble, tail right: "Excuse me, how do I get to the health centre?" with "how do I get to" in ACCENT. The phrase types word by word on the narration; "Excuse me" arrives first and alone, with a small open-hand gesture from you. |
| n2 | notice | 450 | 720 | Go straight on and take the second left. The second left. Thank you. | The second left | | sami's bubble, tail left, with the directions. As he speaks, a dotted ACCENT path draws along the street and turns down the second side street; two side-street mouths light in order, 1 then 2, with the second one holding. Then you's bubble repeats "The second left." and the dotted path flashes once to confirm. |
| explain | explain | 720 | 1080 | Say the directions back. Then you know you heard them. | second left | | PAPER background, maya in the corner circle. Centre: two speech bubbles stacked, sami's above and you's below, with the words "second left" in both, joined by a vertical dotted line and a small return arrow. At frame 900 a tick stamps between them. The street plan sits small at the bottom with the dotted path. Nothing about grammar. |
| practise | practise | 1080 | 1380 | Say it with me. How do I get to the health centre? | how do I get to | 1230 | Pale blue background, maya large in a white circle. Karaoke in 88 px, two lines, "get to" underlined in ACCENT. At 1230 the mic pulses and the player pauses. On resume the chemist sign and the health centre card slide in side by side with a leaf tick. |
| recap | recap | 1380 | 1500 | Excuse me, how do I get to the health centre? | how do I get to | | ACCENT background, white card: "REMEMBER", then "Excuse me, how do I get to ...?" with a saffron dotted blank, and under it "... the second left. Thank you." Icons: open hand, dotted path, chemist cross. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | العاشرة إلا عشر دقائق. عمر لا يجد المركز. | Las diez menos diez. Omar no encuentra el centro. | दस बजने में दस मिनट। उमर को रास्ता नहीं मिला। | Без десяти десять. Омар не находит центр. | Ona on var. Omar merkezi bulamıyor. | 九点五十。Omar 找不到诊所。 |
| n1 | عفوًا، كيف أصل إلى المركز الصحي؟ | Perdone, ¿cómo llego al centro de salud? | माफ़ कीजिए, हेल्थ सेंटर कैसे जाऊँ? | Извините, как добраться до поликлиники? | Affedersiniz, sağlık merkezine nasıl giderim? | 请问，诊所怎么走？ |
| n2 | امشِ مستقيمًا وخُذ الثاني يسارًا. | Siga recto y tome la segunda a la izquierda. | सीधे जाइए, दूसरा बाएँ लीजिए। | Идите прямо и второй поворот налево. | Düz gidin, ikinci soldan dönün. | 直走，第二个路口左转。 |
| explain | أعد الاتجاهات لتتأكد أنك سمعتها. | Repite las indicaciones para comprobar. | दिशा दोहराओ, तब पक्का होगा। | Повтори направления для проверки. | Yolu tekrarla, böylece emin olursun. | 把路线重复一遍就确认了。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | اسأل عن الطريق، ثم أعده. | Pregunta el camino y repítelo. | रास्ता पूछो, फिर दोहराओ। | Спроси дорогу и повтори её. | Yolu sor, sonra tekrarla. | 问路，然后重复一遍。 |

### Interactive moments

- Tappable words: all caption words; "second left" is one chip in both bubbles of the explain beat, so tapping either plays the same two words.
- At the pause (frame 1230) the learner says: "Excuse me, how do I get to the health centre?" Model answer: the same line. Scored as read-aloud; `ITM-SPK-1401` then runs the same question as a live turn with sami, and `ITM-SPK-1404` adds the saying-back.
- Extra tap: in n2 the two side-street mouths are tappable for 120 frames. Tapping the second one draws the dotted path and plays "the second left" (leaf glow); tapping the first dims it grey and replays the directions at 0.75x. The dotted path is never drawn wrongly, so a learner cannot be walked the wrong way.

---

## 13. ATM-A2-LST-0015: Thursday at half past six

| Field | Value |
| --- | --- |
| atom_id | ATM-A2-LST-0015 |
| title | Thursday at half past six |
| sublevel / strand | A2.1 / LST (Listening) |
| type | video, 45 s, 1350 frames |
| single target | The day after on, the time after at: on Thursday at half past six |
| characters | you (listening to a voice message), maya (explain and practise). Noor is a voice on the phone, not drawn |
| setting | The same kitchen table as Monday at ten, early evening: the window behind goes from blue to amber over the video. A phone on the table with a voicemail bar |
| check stem echo | "Say it. The day and the time." |

### Beats

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 150 | A voice message. Omar listens twice. | | | Kitchen table, amber window. The phone lies flat with a voicemail bar that fills left to right and a small "2" badge for two plays. you leans in, chin on hand. Sound rings rise from the phone in time with the bar. |
| n1 | notice | 150 | 420 | Your appointment is on Thursday at half past six. | on Thursday at half past six | | The message bubble floats up out of the phone, grey with a tail down. The words type on the narration; "Thursday" lands on a calendar page that springs in to the left, "half past six" on a clock face that springs in to the right, hands snapping to 6.30 with a thunk. Both stay on screen. |
| n2 | notice | 420 | 620 | On Thursday. Not Tuesday. | On Thursday | | The calendar page flicks through the week: a Tuesday page tries to settle, then slides off with a small wobble; the Thursday page drops back with a leaf tick. The clock dims slightly so the day is the only thing moving. No cross, no red. |
| explain | explain | 620 | 960 | The day after on. The time after at. | on, at | | PAPER background, maya in the corner circle. Centre: the sentence laid out as two slots, "on ___" over the calendar page and "at ___" over the clock. At frame 720 the Thursday page slides into the first slot with a click; at 810 the clock slides into the second. The words "on" and "at" are ACCENT chips above their slots. At 900 "half past six" and "6.30" appear side by side with an equals sign. |
| practise | practise | 960 | 1260 | Say it with me. On Thursday at half past six. | on Thursday at half past six | 1140 | Pale blue background, maya large in a white circle. Karaoke in 88 px, one line, "on" and "at" in ACCENT. At 1140 the mic pulses and the player pauses. On resume the calendar page and the clock land under the line with a tick. |
| recap | recap | 1260 | 1350 | On Thursday at half past six. | on Thursday at half past six | | ACCENT background, white card: "REMEMBER", then "**on** Thursday **at** half past six", and under it "6.30". Icons: calendar page, clock at 6.30, phone with a voicemail bar. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | رسالة صوتية. عمر يسمعها مرتين. | Un mensaje de voz. Omar lo oye dos veces. | एक वॉइस मैसेज। उमर दो बार सुनता है। | Голосовое сообщение. Омар слушает дважды. | Bir sesli mesaj. Omar iki kez dinler. | 一条语音留言。Omar 听了两遍。 |
| n1 | موعدك الخميس في السادسة والنصف. | Su cita es el jueves a las seis y media. | आपका अपॉइंटमेंट गुरुवार साढ़े छह बजे है। | Ваш приём в четверг в половине седьмого. | Randevunuz perşembe altı buçukta. | 您的预约是星期四六点半。 |
| n2 | الخميس، لا الثلاثاء. | El jueves, no el martes. | गुरुवार, मंगलवार नहीं। | В четверг, не во вторник. | Perşembe, salı değil. | 是星期四，不是星期二。 |
| explain | اليوم بعد on، والوقت بعد at. | El día tras on, la hora tras at. | on के बाद दिन, at के बाद समय। | После on день, после at время. | on'dan sonra gün, at'ten sonra saat. | on 后面是日子，at 后面是时间。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | half past six تعني 6.30. | half past six es 6.30. | half past six यानी 6.30। | half past six это 6.30. | half past six yani 6.30. | half past six 就是 6.30。 |

### Interactive moments

- Tappable words: all caption words; the calendar page plays "Thursday" and the clock plays "half past six" wherever they appear, including in the recap card.
- At the pause (frame 1140) the learner says: "On Thursday at half past six." Model answer: the same line. Scored as shadow (the day and the time must both be audible, not the whole sentence). `ITM-LST-1501` then asks for the same two facts back from a live message.
- Extra tap: in n1 the voicemail bar is a scrub bar for 120 frames. Dragging it replays the message from that point at 0.75x, which is the only replay offered before the first attempt, exactly as the listening rule in `docs/learning-model.md` §1.7 requires.

---

## 14. ATM-A2-WRT-0016: Sorry, I can't come (word tutorial)

| Field | Value |
| --- | --- |
| atom_id | ATM-A2-WRT-0016 |
| title | Sorry, I can't come |
| sublevel / strand | A2.1 / WRT (Writing) |
| type | word_tutorial, 40 s, 1200 frames |
| single target | Sorry, then the reason with because, then the new time |
| characters | you (writing), maya (practise). The reader is a contact name on the phone, not drawn |
| setting | A phone frame centre screen, chat header "Hillside Health Centre", saffron bubbles on the right. Behind it, a desk corner with a laptop and a wall clock at ten |
| check stem echo | "Say it. Sorry, the reason, the new time." |

### Beats

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 120 | Ten o'clock. Omar is at work. | | | The phone frame rises into the centre. Behind it the wall clock snaps to ten and a laptop screen glows. A calendar reminder slides down from the top of the phone: "Appointment 10.00" and pulses once. you looks at the clock, then at the phone. |
| w1 | word | 120 | 330 | I'm sorry. Say this first when you change a plan. | I'm sorry | | Word card above the phone: "I'm sorry". Typing dots appear in a saffron bubble, then the words type themselves in. The bubble holds alone on the screen for 20 frames so the learner sees that the message starts here and nowhere else. |
| w2 | word | 330 | 540 | I can't come at ten. | I can't come at ten | | Card: "I can't come at ten". The second saffron bubble types under the first. As "at ten" lands, the clock behind the phone dims to grey and the reminder card slides back up out of frame. Still no reason given: the message looks unfinished on purpose. |
| w3 | word | 540 | 780 | Because I'm at work. Give the reason with because. | because I'm at work | | Card: "because I'm at work". The word "because" slides in as an ACCENT chip and the laptop behind the phone lights up; a dotted line joins the lit laptop to the chip. The bubble completes to "I can't come at ten because I'm at work." The unfinished look resolves. |
| w4 | word | 780 | 940 | Could we make it later? Ask for a new time. | Could we make it later? | | Card: "Could we make it later?" A third saffron bubble types it, and the clock behind brightens again with the hands sweeping forward from ten to half past four. A small "?" chip hops once at the end of the bubble. |
| practise | practise | 940 | 1120 | Say it with me. I'm sorry, I can't come at ten because I'm at work. | I'm sorry, because | 1060 | Pale blue background, maya large in a white circle. Karaoke in 80 px over three lines; "I'm sorry" and "because" in ACCENT. At 1060 the mic pulses and the player pauses. On resume the three bubbles reassemble as one message with a sent tick. |
| recap | recap | 1120 | 1200 | Sorry. Then because. Then the new time. | sorry, because, later | | ACCENT background, white card: "REMEMBER" and three stacked lines, each with a small icon: 🙏 "I'm sorry", 💼 "because I'm at work", 📅 "Could we make it later?" Hold. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | العاشرة. عمر في العمل. | Las diez. Omar está en el trabajo. | दस बजे। उमर काम पर है। | Десять. Омар на работе. | Saat on. Omar işte. | 十点。Omar 在上班。 |
| w1 | I'm sorry: قلها أولًا. | I'm sorry: dilo primero. | I'm sorry: पहले यही कहें। | I'm sorry: скажи это первым. | I'm sorry: önce bunu söyle. | I'm sorry：先说这句。 |
| w2 | لا أستطيع الحضور في العاشرة. | No puedo ir a las diez. | मैं दस बजे नहीं आ सकता। | Я не могу прийти в десять. | Saat onda gelemiyorum. | 我十点来不了。 |
| w3 | because: اذكر السبب. | because: da el motivo. | because: कारण बताएँ। | because: назови причину. | because: nedeni söyle. | because：说原因。 |
| w4 | هل يمكن أن نجعله لاحقًا؟ | ¿Podríamos dejarlo más tarde? | क्या हम बाद में कर सकते हैं? | Можно перенести на позже? | Daha geç yapabilir miyiz? | 可以晚一点吗？ |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | اعتذار، ثم سبب، ثم وقت جديد. | Disculpa, motivo y hora nueva. | माफ़ी, कारण, नया समय। | Извинение, причина, новое время. | Özür, neden, yeni saat. | 道歉、原因、新时间。 |

### Interactive moments

- Tappable words: all caption words; each of the three bubbles is a chip that plays its own line, so the learner can hear the message in parts before writing it.
- At the pause (frame 1060) the learner says the first two lines aloud: "I'm sorry, I can't come at ten because I'm at work." Model answer: the same line. This is the atom's spoken turn; the writing comes later, at `ITM-WRT-1605`, which is where the strand's mastery evidence sits.
- Extra tap: in w3 the "because" chip is draggable for 90 frames. Dropped between the two halves it clips in with a click and the full sentence plays; dropped at the start of the message the bubble wobbles and the chip returns, with the message read back without a reason so the learner hears what is missing.

---

## 15. ATM-A2-MED-0017: Pass it on

| Field | Value |
| --- | --- |
| atom_id | ATM-A2-MED-0017 |
| title | Pass it on |
| sublevel / strand | A2.1 / MED (Explaining) |
| type | video, 45 s, 1350 frames |
| single target | Three facts in one sentence: on Thursday at half past six, at the health centre |
| characters | sami (holding the card), you (reading it to him), maya (explain corner) |
| setting | The flat-share kitchen from The gas bill: table, kettle, fridge with magnets. An appointment card on the table, the size of a postcard |
| check stem echo | "Say it. The day, the time, the place." |

### Beats

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 150 | Sami has an appointment card. He cannot read it. | | | Kitchen table. sami holds a small card, turning it over twice; the text on it is squiggle lines. A "?" bubble appears over him and droops. you sits down opposite and holds a hand out for the card. |
| n1 | notice | 150 | 420 | Your appointment is on Thursday. | on Thursday | | The card lands flat and large in the centre; its squiggles resolve line by line into "Hillside Health Centre / Thursday 18.30 / arrive 10 minutes early". The word "Thursday" lifts off the card into you's bubble and a calendar page springs in beside sami with THURSDAY on it. |
| n2 | notice | 420 | 600 | At half past six. | at half past six | | "18.30" lifts off the card and becomes a clock face whose hands snap to 6.30, with "half past six" typing underneath it. sami's "?" bubble stands up straight with a small ping. The calendar page stays in frame, so two facts are now visible at once. |
| n3 | notice | 600 | 780 | At the health centre. | at the health centre | | The health centre building card slides in behind the clock, with the green chemist cross from Which way? beside it as the landmark. Three objects now sit in a row in front of sami: calendar page, clock, building. |
| explain | explain | 780 | 1080 | Three things: the day, the time, the place. | the day, the time, the place | | PAPER background, maya in the corner circle. The three objects line up as three cards with their labels under them. At frame 870 a single sentence draws itself under the row, picking up each fact in order with a dotted line from its card: "on Thursday / at half past six / at the health centre". At 1000 sami's silhouette nods at the far right. |
| practise | practise | 1080 | 1290 | Say it with me. On Thursday at half past six, at the health centre. | on Thursday at half past six, at the health centre | 1200 | Pale blue background, maya large in a white circle. Karaoke in 80 px over two lines; the three facts in ACCENT in turn as they are spoken. At 1200 the mic pulses and the player pauses. On resume the three cards stack into sami's hand with a leaf tick. |
| recap | recap | 1290 | 1350 | On ... at ... at the ... | on, at, at the | | ACCENT background, white card: "REMEMBER", then three lines with saffron dotted blanks: "on ...", "at ...", "at the ...". The three icons sit under them in the same order. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | سامي لديه بطاقة موعد ولا يستطيع قراءتها. | Sami tiene una tarjeta de cita y no puede leerla. | सामी के पास अपॉइंटमेंट कार्ड है, पढ़ नहीं पाता। | У Сами карточка приёма, он не может её прочесть. | Sami'nin randevu kartı var, okuyamıyor. | Sami 有张预约卡，看不懂。 |
| n1 | موعدك يوم الخميس. | Tu cita es el jueves. | तुम्हारा अपॉइंटमेंट गुरुवार को है। | Твой приём в четверг. | Randevun perşembe. | 你的预约在星期四。 |
| n2 | في السادسة والنصف. | A las seis y media. | साढ़े छह बजे। | В половине седьмого. | Altı buçukta. | 六点半。 |
| n3 | في المركز الصحي. | En el centro de salud. | हेल्थ सेंटर में। | В поликлинике. | Sağlık merkezinde. | 在诊所。 |
| explain | ثلاث معلومات: اليوم، الوقت، المكان. | Tres datos: día, hora, lugar. | तीन बातें: दिन, समय, जगह। | Три факта: день, время, место. | Üç bilgi: gün, saat, yer. | 三件事：日子、时间、地点。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | قل الثلاثة، فلا يخطئ صديقك. | Di los tres y tu amigo no se equivoca. | तीनों कहो, दोस्त नहीं चूकेगा। | Назови все три, и друг не ошибётся. | Üçünü söyle, arkadaşın şaşırmaz. | 三件都说，朋友就不会错。 |

### Interactive moments

- Tappable words: all caption words; the three cards are chips that play "Thursday", "half past six" and "the health centre"; the card itself is a chip that reads all three lines in order.
- At the pause (frame 1200) the learner says: "On Thursday at half past six, at the health centre." Model answer: the same line. Scored as read-aloud; `ITM-MED-1701` then gives sami one question to answer live, and `ITM-MED-1704` asks for all three facts.
- Extra tap: in n2 "18.30" and the clock are a pair of chips for 120 frames. Tapping either plays "half past six" and flashes the other, which is the only place in the week where the 24-hour form and the spoken form are tied together. Tapping the "arrive 10 minutes early" line plays it and marks it on the clock as 6.20, ready for the relay item.

---

## 16. ATM-PA1-SPK-0018: Hello, I'm Ana

| Field | Value |
| --- | --- |
| atom_id | ATM-PA1-SPK-0018 |
| title | Hello, I'm Ana |
| sublevel / strand | PreA1.1 / SPK (Speaking) |
| type | video, 35 s, 1050 frames |
| single target | Hello. I'm + your name |
| characters | ana (new, the newcomer), you (the other new learner), maya (the teacher, in the doorway and the explain corner) |
| setting | A community classroom in London on a Monday morning: six chairs in a half circle, a window with a plane tree, a whiteboard with nothing written on it |
| check stem echo | "Say it. Hello and your name." |

Pre-A1 rules that override the shared conventions for this section and the next two: narration at 90 wpm with a 1 second gap after every sentence; **three words maximum per caption line** and never two lines at once; every caption carries an icon; the L1 line is on by default below A1.2, not optional; no written word appears before it has been heard twice.

### Beats

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 120 | A new class. Monday morning. | | | The classroom in flat vector, empty chairs. maya stands by the door and opens it; light spills in. No words on screen, only a small calendar card top-left showing MONDAY. The plane tree moves 2 degrees in the window. |
| n1 | notice | 120 | 390 | Hello. I'm Ana. | I'm | | ana steps in, stops, and waves (arm wave for 40 frames). Her bubble types "Hello." and holds for 30 frames, alone. Then "I'm Ana." types under it with "I'm" in ACCENT. A name badge pins itself to her top reading "Ana" with a small click. Nothing else moves while she speaks. |
| n2 | notice | 390 | 630 | Hello. I'm Omar. | I'm | | you is already sitting; you stands, waves back, bubble: "Hello. I'm Omar." with "I'm" in ACCENT again and in exactly the same position on screen, so the shape repeats. A second badge pins on, reading "Omar". The two badges then sit side by side at the top of frame. |
| explain | explain | 630 | 810 | What is your name? | What is your name? | | PAPER background, maya in the corner circle, hand open in a small question gesture. Centre: one badge card with the photo circle empty and a saffron dotted blank where the name goes. Above it the question types once, four words, each word a separate chip: "What / is / your / name?" At frame 760 an arrow points from the question to the blank. |
| practise | practise | 810 | 990 | Say it with me. Hello. I'm Ana. | Hello, I'm | 900 | Pale blue background, ana large in a white circle. Karaoke in 96 px, one short line, with a 1 second gap between "Hello." and "I'm Ana." At 900 the player pauses and the mic pulses with "Your turn". On resume the empty badge from the explain beat fills with a leaf tick. |
| recap | recap | 990 | 1050 | Hello. I'm ... | Hello, I'm | | ACCENT background, white card: "Hello." on the first line and "I'm ..." on the second with a saffron dotted blank. Two icons under it: a waving hand and a name badge. Hold on screen with no further movement. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | صف جديد. صباح الاثنين. | Una clase nueva. Lunes. | नई क्लास। सोमवार सुबह। | Новый класс. Утро понедельника. | Yeni bir sınıf. Pazartesi. | 新班级。星期一早上。 |
| n1 | مرحبًا. أنا آنا. | Hola. Soy Ana. | नमस्ते। मैं आना हूँ। | Здравствуйте. Я Ана. | Merhaba. Ben Ana. | 你好。我是 Ana。 |
| n2 | مرحبًا. أنا عمر. | Hola. Soy Omar. | नमस्ते। मैं ओमर हूँ। | Здравствуйте. Я Омар. | Merhaba. Ben Omar. | 你好。我是 Omar。 |
| explain | ما اسمك؟ | ¿Cómo te llamas? | तुम्हारा नाम क्या है? | Как вас зовут? | Adın ne? | 你叫什么名字？ |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | مرحبًا. أنا ... | Hola. Soy ... | नमस्ते। मैं ... हूँ। | Здравствуйте. Я ... | Merhaba. Ben ... | 你好。我是 ... |

### Interactive moments

- Tappable words: every caption word, and both name badges (each plays its own "I'm ..." line). In the explain beat the four question chips can be tapped one at a time, which is the only place a Pre-A1 learner meets the words separately.
- At the pause (frame 900) the learner says: "Hello. I'm ..." with their own name. Model answer: "Hello. I'm Ana." Scored as read-aloud on the two words "hello" and "I'm" only; the name is never scored, because no scorer can know it.
- Extra tap: in n1 and n2 the badge is draggable onto the empty badge card for 90 frames; dropping it there plays that person's line again. Nothing can be answered wrongly in this atom, by design: it is the first thing a learner ever does.

---

## 17. ATM-PA1-INT-0019: Two, please

| Field | Value |
| --- | --- |
| atom_id | ATM-PA1-INT-0019 |
| title | Two, please |
| sublevel / strand | PreA1.2 / INT (Talking with someone) |
| type | video, 35 s, 1050 frames |
| single target | A number, the thing, then please: Two apples, please. |
| characters | leo (behind the counter), ana (buying), you (next in the queue) |
| setting | A small corner shop: a wooden counter, a crate of apples, a crate of bananas, a shelf of water bottles, a paper bag on a hook |
| check stem echo | "Say it. Ask for two apples." |

### Beats

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 150 | A small shop. Ana wants apples. | | | The shop in flat vector. ana comes in from the left and stops at the apple crate; she looks at the apples, then at leo. Two apples lift slightly out of the crate and hover with a soft bob, so what she wants is obvious with no words at all. |
| n1 | notice | 150 | 420 | Two apples, please. | Two apples, please | | ana at the counter. Her bubble types "Two apples, please." one word at a time on the narration, with "please" in ACCENT. As "Two" is said, a "2" chip stamps above the two hovering apples; as "apples" is said, the two apples fly into a paper bag. |
| n2 | notice | 420 | 630 | Here you are. Thank you. | Thank you | | leo hands the bag over (arm arc, 30 frames). His bubble: "Here you are." Then ana's bubble: "Thank you." with "Thank you" in ACCENT. Both bubbles stay on screen together for 40 frames: the exchange is the unit, not the single phrase. |
| explain | explain | 630 | 810 | One. Two. Three. The number, the thing, then please. | please | | PAPER background, leo in the corner circle. Centre: three slots in a row, each with an icon above it: a "2" chip, an apple, and a please chip in SAFFRON. At frame 700 the three chips drop into the slots left to right with a click each, and the line reads "Two apples, please." Then the apple swaps for a water bottle and the line re-reads itself, so the slot, not the word, is the pattern. |
| practise | practise | 810 | 990 | Say it with me. Two apples, please. | Two apples, please | 900 | Pale blue background, leo large in a white circle. Karaoke in 96 px, one line, with the "2" chip above the word "Two". At 900 the player pauses and the mic pulses. On resume the paper bag from n1 lands under the line with a leaf tick. |
| recap | recap | 990 | 1050 | Two apples, please. Thank you. | please, Thank you | | ACCENT background, white card: "... please." on the first line, "Thank you." on the second. Three icons under them: a number chip, an apple, a paper bag. Hold. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | متجر صغير. آنا تريد تفاحًا. | Una tienda pequeña. Ana quiere manzanas. | छोटी दुकान। आना को सेब चाहिए। | Маленький магазин. Ана хочет яблоки. | Küçük bir dükkan. Ana elma istiyor. | 一家小店。Ana 想买苹果。 |
| n1 | تفاحتان، من فضلك. | Dos manzanas, por favor. | दो सेब, कृपया। | Два яблока, пожалуйста. | İki elma, lütfen. | 两个苹果，谢谢。 |
| n2 | تفضل. شكرًا. | Aquí tienes. Gracias. | लीजिए। धन्यवाद। | Вот, пожалуйста. Спасибо. | Buyurun. Teşekkürler. | 给您。谢谢。 |
| explain | الرقم، ثم الشيء، ثم please. | El número, la cosa y please. | संख्या, चीज़, फिर please। | Число, предмет, потом please. | Sayı, şey, sonra please. | 数字、东西，再加 please。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | ... please. شكرًا. | ... please. Gracias. | ... please. धन्यवाद। | ... please. Спасибо. | ... please. Teşekkürler. | ... please。谢谢。 |

### Interactive moments

- Tappable words: every caption word; the "2" chip plays "two", the apple plays "apples", the please chip plays "please", so the three parts of the sentence are audible separately.
- At the pause (frame 900) the learner says: "Two apples, please." Model answer: the same line. Scored as read-aloud. `ITM-INT-1901` then runs the same request as a live turn with leo, and `ITM-INT-1904` adds the one problem to repair: no apples today.
- Extra tap: in the explain beat the thing slot is a carousel for 120 frames. Tapping it swaps apple for water, tea or bananas and re-reads the whole line with the new word. The number slot swaps between 1 and 2 and the noun follows ("One apple", "Two apples"), which is the first time a learner sees the plural s do anything, two bands before it is ever tested.

---

## 18. ATM-A1-GRM-0020: I'm from Spain (word tutorial)

| Field | Value |
| --- | --- |
| atom_id | ATM-A1-GRM-0020 |
| title | I'm from Spain |
| sublevel / strand | A1.1 / GRM (Grammar) |
| type | word_tutorial, 30 s, 900 frames |
| single target | I'm about me, you're about the other person |
| characters | ana, you, maya (practise) |
| setting | PAPER background with two badge cards side by side, and a simple world map strip along the bottom with Spain, Egypt and the United Kingdom marked |
| check stem echo | "Say it. Name, country, city." |

### Beats

| id | kind | from | to | narration (TTS) | targets | pauseAt | scene for the animator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hook | hook | 0 | 120 | I'm Ana. I'm from Spain. | I'm | | ana steps into the left badge card, which fills with her name. Her bubble: "I'm Ana. I'm from Spain." with both "I'm" in ACCENT. A map pin drops on Spain on the strip below and a thin line joins the pin to her badge. |
| w1 | word | 120 | 330 | I'm. I am. Say it about you. | I'm | | Word card at the top: "I'm = I am". Mini-scene: the "I'm" chip hops onto ana's badge, then onto the empty badge on the right and waits there, pointing at the learner. The two chips are the same object moving, not two chips, so the word belongs to whoever is speaking. |
| w2 | word | 330 | 540 | You're. You are. Say it about one person. | you're | | Card: "you're = you are". Mini-scene: ana turns to face right and the "you're" chip flies from her mouth across to the right badge and sticks. An arrow between the two badges points right. Then the chip tries to land back on ana's own badge, slides off and returns to the right, so the direction is visible without a rule. |
| w3 | word | 540 | 720 | From, for the country. In, for the city. | from, in | | Card: "from / in". Mini-scene: on the map strip, "from" sits under the Spain pin and "in" sits under a London pin; a dotted flight path arcs from Spain to London with a little plane. The badge on the right completes: "I'm ... I'm from ... I'm in London." with saffron dotted blanks. |
| practise | practise | 720 | 860 | Say it with me. I'm Ana. I'm from Spain. I'm in London. | I'm, from, in | 800 | Pale blue background, ana large in a white circle. Karaoke in 80 px over three short lines, one fact each, with a half second gap between them. At 800 the mic pulses and the player pauses. On resume all three lines show a leaf tick together. |
| recap | recap | 860 | 900 | I'm ... I'm from ... I'm in ... | I'm, from, in | | ACCENT background, white card with three lines and saffron dotted blanks, each with an icon: name badge, map pin on a country, map pin on a city. Under the card, small: "you're" with an arrow pointing away from the learner. Hold. |

### L1 captions

| beat | ar | es | hi | ru | tr | zh |
| --- | --- | --- | --- | --- | --- | --- |
| hook | أنا آنا. أنا من إسبانيا. | Soy Ana. Soy de España. | मैं आना हूँ। मैं स्पेन से हूँ। | Я Ана. Я из Испании. | Ben Ana. İspanya'danım. | 我是 Ana。我来自西班牙。 |
| w1 | I'm = I am. عن نفسك. | I'm = I am. Sobre ti. | I'm = I am। अपने लिए। | I'm = I am. О себе. | I'm = I am. Kendin için. | I'm = I am。说自己。 |
| w2 | you're = you are. عن الآخر. | you're = you are. Sobre el otro. | you're = you are। दूसरे के लिए। | you're = you are. О другом. | you're = you are. Diğeri için. | you're = you are。说对方。 |
| w3 | from للبلد، in للمدينة. | from para el país, in para la ciudad. | from देश के लिए, in शहर के लिए। | from о стране, in о городе. | from ülke, in şehir. | from 说国家，in 说城市。 |
| practise | قلها معي. | Dilo conmigo. | मेरे साथ बोलो। | Скажи со мной. | Benimle söyle. | 跟我一起说。 |
| recap | أنا ... أنا من ... أنا في ... | Soy ... Soy de ... Estoy en ... | मैं ... मैं ... से ... मैं ... में ... | Я ... Я из ... Я в ... | Ben ... ...danım ... ...deyim. | 我是 ... 我来自 ... 我在 ... |

### Interactive moments

- Tappable words: all caption words; the "I'm" and "you're" chips play their full forms ("I am", "you are") when tapped, which is the only place the uncontracted form is heard.
- At the pause (frame 800) the learner says: "I'm ... I'm from ... I'm in ..." with their own name, country and city. Model answer: "I'm Ana. I'm from Spain. I'm in London." Scored as shadow on "I'm", "from" and "in"; names and places are not scored.
- Extra tap: in w2 the "you're" chip is draggable for 90 frames. Dropped on the right badge it sticks and plays "You're Omar."; dropped on the learner's own badge it slides off and plays "I'm Omar." instead, so the wrong drop teaches the right word rather than marking anything.

---

## Part two additions to the shared kit

On top of the list below, which part one already asks for:

- `ana`: new `Who` value. Dark bob with a fringe, rose top with a round collar, small round earrings. Same rig as the others. Drawn facing right when listening, so she mirrors `you`.
- Props: a phone frame with a **call** state (handset held to the ear, three sound rings) and a **voicemail** state (a fill bar with a play count badge and a draggable scrub head); an appointment card the size of a postcard, with the squiggle-to-text resolve already used for the letter; a calendar page that can flick through a week and let one day settle; a clock face whose hands snap to a named time and can sweep between two times; luggage-label price tags that drop on a string; a paper bag that fills with items; crates of apples and bananas; a stopwatch that stops at a number; a world map strip with three named pins and a dotted flight path.
- Scene helpers: `StreetSet` (terraced houses, a postbox, a chemist with a green cross, two side-street mouths that can light in order, and a dotted route path that draws and turns); `ClassroomSet` (six chairs in a half circle, a door that opens, a blank whiteboard, a window with a plane tree); `CornerShopSet` (counter, crates, a shelf of bottles, a hook with paper bags); a `SlotLine` diagram helper (two to four labelled slots that chips drop into with a click, and a slot whose content can be swapped so the pattern re-reads itself).
- Audio: a 90 wpm narration mode with a one second tail, used by sections 16 to 18; a short "sent" tick for the message atom; a soft ping for a question mark standing up (already listed); per-word clips for "I am" and "you are".
- Player: `pauseAt` must be reachable inside the first 50 seconds of the **lesson**, which for these atoms means the explainer ends at the practise pause and the first `free_use` item follows immediately. The three Pre-A1 and A1 sections also need the L1 caption line on by default, which today is a learner toggle.

---

## Shared kit needs

What the storyboards assume exists in a shared explainer library, so a builder can add these once and reuse them. Items marked (have) already exist in `Cafe.tsx`; the rest are new.

### Characters (`Person` component)

- `leo` (have), `you` (have), `maya` (have).
- `fatima`: new `Who` value. Leaf-green headscarf drawn as a hood path over the head circle, warm grey top, round glasses (two circles plus a bridge line). Same body rig, same `talking`, `arm` and `facing` props.
- `sami`: new `Who` value. Short curly hair (scalloped hair path), mustard hoodie top with a pocket line. Same rig.
- Rig additions used above: a `pose` prop with `sit` (legs hidden, body lowered 30 px, used at desks and on the metro) and `hardhat` and `glasses` accessory flags; an `outline` flag that draws the character as a dotted INK outline with no fill (the "not here yet" look in Yesterday, today, tomorrow).
- Grey silhouette passenger (no face) for background figures: a single filled path, never speaks.

### Props

- `Cup` (have), `Steam` (have), `Badge` (have), `Bubble` (have), `Captions` (have), progress strip (have).
- Milk cartons: oat (blue), soy (green), almond (cream); each with a `dotted` variant for "out of".
- Jug and glass with a water-surface line; sugar jar and sugar pile; sandwich; plate.
- Bill paper (folds and unfolds, shows a price), bank card, card reader with tick and beep, bank note, two coins, tip jar.
- Platform sign (hanging rectangle with a number), tannoy speaker on a pole with sound rings.
- Letter with squiggle lines that resolve line by line into real text; brown envelope.
- Wall calendar that flips months and can fill a day range; single calendar page with a label and an arrow (left, none, right).
- Map pin that drops and bounces; small house icon; shop sign; name badge; ID-style badge card that flips on its vertical axis.
- Phone frame with a chat header, right (saffron) and left (grey) bubbles, typing dots, and a send animation.
- Metro signs: no eating or drinking (circle with a bar), tick (allowed), escalator arrows, priority seat, mind the gap.
- Suitcase with stickers; three flat city skylines (Riyadh, Dubai, London) each with a `sepia`, `colour` and `outline` mode.
- Word tiles (rounded INK-outline chips that can slide, hop, clip on and wobble) and magnet tiles ("-ed", "will", "s", "es", "some", "2") with a clack and two motion lines on snap.
- Question mark that can droop and stand up; "?" and "!" thought bubbles for characters.

### Scene helpers

- `CafeSet` (have); plus a fridge-with-shelves extension behind the counter and a table-by-the-window variant.
- `MetroSet`: platform (track, pillars, three hanging signs), carriage interior (seats, rail, windows with a scrolling skyline), escalator side view with a moving step pattern.
- `KitchenSet`: flat-share kitchen (table, kettle, fridge with magnets, grey window).
- `ShopSet`: Fatima's shop front with a swaying awning and an interior counter with shelves.
- `OfficeSet`: desk, wall clock whose hands snap to a time, one empty chair.
- `TimelineRoad`: a road with three stops and a camera that slides between them (ease in-out, 30 frames).
- Diagram helpers for explain beats: `Seesaw` (two labelled blocks, tips to the heavy side), `Slider` (three notches, draggable knob, magnet slots before and after a centre word), `Shelf` (two slots, dotted and solid items), `Train` (engine and carriages built from word tiles, rolls across), `StickerPeel` (an item shrinks and peels into N stickers that fly to a target).
- `PresenterCorner`: the small white circle with a character bottom-left for explain beats (keeps a face on screen while the diagram is centre).
- `KaraokeLine` (the practise-beat word list with rise-on-spoken, have inline) extracted so every atom reuses it, plus a `pauseLine` so the learner's turn line is read from the beat rather than hard-coded ("I'd like a coffee, please." is currently hard-coded in `ExplainerPlayer`; each storyboard above gives its own pause line and model answer).
- `RecapCard` (the white REMEMBER card on an ACCENT ground, have inline) extracted with a slot for icons underneath.
- Hotspot layer: a per-beat list of `{ from, to, shape, onTap }` regions for the extra-tap moments, with the three feedback states used above: glow leaf and play, dim grey and replay at 0.75x, wobble and self-correct. No red, no lives.
- Draggable tile helper shared with the `time_slider`, `sentence_build` and `magnet_tiles` items so the control a learner meets in the explainer is the one they are scored on.

### Audio

- TTS narration per beat (`say(beat.line)`, have); short extra TTS lines for hotspot feedback ("Card or cash?", "FORty"); syllable-level clips for the stress atom ("four", "TEEN", "FOR", "ty").
- Sound set, all soft and short: click (tile clips on), clack (magnet snaps), boing (tile hops), ping (question mark stands up), plink (one drop), plop (tile falls in water), beep (card reader), clink (coin in jar), thunk (seesaw tips), thump (digit stamps), doors (metro). Never a buzzer for a wrong tap.
