# Learning Path PRD

Oct 23, 2026 · @ST

## Summary

Learning Path is a public, mobile-first English learning app that takes a learner from Pre-A1 to C2 through bite-size atoms of 60 to 120 seconds, each a short video or simple word tutorial followed by a learning check. It covers all seven strands of English (grammar, vocabulary-led reading, writing, listening, speaking, mediation and interaction) and builds the path for each learner automatically from their AZE placement result and every session they complete.

It is "Duolingo style but better" in three defensible ways: the learning science is built into the engine rather than bolted on (spacing, retrieval, interleaving, mastery gates); it teaches and measures the CEFR modes competitors ignore (mediation and interaction, plus AI-scored speaking and writing); and it sits inside a real ecosystem, with AZE certifying progress and ES World's face-to-face classes available when a learner wants a teacher.

| Dimension | Decision |
| --- | --- |
| Owner | ST, Global Product Manager (ES World) and Product Manager (AZE) |
| Audience | Public learners worldwide, Pre-A1 to C2, ages 16 to 70; ES World enrolled students; later B2B and B2G licences |
| Platform | iOS and Android app first, responsive web second; admin console on web |
| Core loop | 10-minute daily session of 4 to 6 atoms, 60 to 70% new, 30 to 40% review |
| Launch scope | Pre-A1 to B1 content, all seven strands, English UI with L1 support for 6 languages |
| Status | PRD v0.2, build-ready, 23 October 2026; includes signature activities and a technical build specification |

## Problem statement

Most people who start learning English on an app stop within two weeks and most who continue do not reach a CEFR level they can use. Existing apps optimise for streaks and session count, not for measured competence: they drill recognition (tap the word, match the picture) and leave speaking, writing, interaction and mediation, the skills a learner needs at work or in a visa interview, almost untouched. Beginners are the worst served: interfaces assume reading ability in English, feedback is text-heavy, and placement is a crude self-selection.

Who has the problem:

- Adults anywhere in the world who need English for work, study or migration and cannot attend classes daily.
- ES World students who want structured practice between face-to-face lessons and continuity after their course ends.
- Institutions and employers who need a learning product whose progress claims are backed by a real assessment.

Cost of not solving it: ES World and AZE keep selling a test and a classroom with no continuous learning product between them, while the learner's daily attention goes to a competitor whose outcomes we cannot influence or certify.

## Vision and product principles

Vision: the only English app where ten minutes a day produces a CEFR level you can prove. Every design decision is tested against one question: did the learner demonstrably move closer to the next can-do?

| # | Principle | What it rules out |
| --- | --- | --- |
| 1 | Competence over activity | Streak flames, XP leagues, hearts, or any progress bar that moves without a demonstrated can-do |
| 2 | The engine owns the path | Learners choosing what to revise, skipping ahead past unmet prerequisites, or picking "units" |
| 3 | Production from day one | Speaking, writing and interaction checked by doing them, never by multiple choice proxies |
| 4 | Clear to someone with no English | Any screen a Pre-A1 learner cannot act on without reading an English sentence |
| 5 | Calm, not loud | Dense dashboards, bold-block gamification, more than one call to action per screen |
| 6 | Every error is a teaching moment | Penalties, lost lives, red shaming; feedback always shows the correct form in context |
| 7 | Assessment and learning are one system | Progress claims that AZE cannot verify; a separate test experience with its own rules |
| 8 | Fully online, with a path to ES World | Human tutoring, chat or staff contact inside the app; ES World courses are an optional referral link, not a feature |
| 9 | Respect the learner's time | Sessions over 12 minutes by default, unskippable intros, content padding |
| 10 | Inclusive by design | Content that assumes a European 20-year-old; the demographic is 16 to 70 across GCC, MENA and beyond |

## Target learners and personas

The app must work for a 52-year-old Arabic speaker with no English and for a 19-year-old at B2 preparing for university, on the same screens. Four personas anchor design decisions; every requirement is checked against the first two.

| Persona | Profile | Starting level | Goal | Design implications |
| --- | --- | --- | --- | --- |
| Fatima, 52, Dubai | Shop owner, Arabic L1, no English, uses WhatsApp daily, never used a learning app | Pre-A1 | Serve customers and read simple messages | Full L1 interface and audio, icons with labels, 22pt lesson text, RTL, no timers, no reading-dependent navigation |
| Arjun, 28, Dubai | Delivery supervisor, Hindi L1, A2 reading but weak speaking, 10 minutes on the commute | A2.1 | Promotion that needs spoken English at work | Speaking atoms with headphones-off option, interaction role-plays for work, Access to Work pathway hooks |
| Elena, 19, London | ES World student, Spanish L1, in a face-to-face B1 class, wants IELTS 6.0 later | B1.2 | Reach B2 and enter a UK university | Classroom bridge to her ES class, mediation and writing atoms, AZE checkpoints, downloadable report |
| Yusuf, 35, Riyadh | Engineer, Arabic L1, strong grammar and reading, avoids speaking | B2.1 | Lead meetings in English | Fluency and interaction emphasis, English interface with L1 on demand, challenge mode with peers |

The audience is global: the four personas are drawn from ES World's campuses for concreteness, but the launch L1 set (Arabic, Hindi, Russian, Spanish, Turkish, Chinese) is chosen to cover the largest English-learning populations worldwide, and content settings include Dubai, London and generic international contexts so no learner feels the app was made for someone else. Academic English is a first-class need, not an add-on: Elena's persona represents the Access to Education learner who needs lecture listening, note-taking, academic writing and seminar interaction, which the mediation, writing and interaction strands carry from B1. Secondary audiences, designed for but not optimised for in v1: institutions licensing seats (schools, universities, employers, ministries) and parents of 16 to 17-year-olds who need a progress report.

## Goals and non-goals

Success means learners measurably move up the CEFR scale and stay long enough to do it. Activity metrics are instruments, not goals.

| # | Goal | Measure | Target by day 180 |
| --- | --- | --- | --- |
| G1 | Learners gain a CEFR sub-level in 10 to 12 weeks of daily use | AZE checkpoint pre and post | 60% of learners active 60+ days gain at least one sub-level |
| G2 | Beginners can use the app unaided | Pre-A1 testers finish the first atom with no help | 90% in moderated tests |
| G3 | Habit forms | Day-30 retention of registered users | 25% (industry median 10 to 15%) |
| G4 | Speaking is practised, not avoided | Share of sessions with a completed spoken item | 70% |
| G5 | The app feeds the ecosystem | Learners who take a paid AZE test or enquire about an ES World course | 8% of day-90 actives |
| G6 | Content quality holds under scale | Item facility 0.4 to 0.9, drop-off under 10% per atom | 95% of live atoms within band |

| Non-goal (v1) | Why it is out of scope |
| --- | --- |
| Teacher portal or teacher-set homework | The app is a public product; ES World classroom integration is handled by the LMS, not by this app. Covered in P2 |
| Languages other than English | Engine and content model are language-agnostic by design, but content and scoring are English only until B2 content ships |
| Live human tutoring or chat between learners | Safety, moderation cost and scope; social presence and challenges give relatedness without messaging |
| Exam-specific preparation (IELTS, TOEFL) | Separate product line; the path targets CEFR competence and feeds exam prep later |
| Replacing the AZE formal test | Learning checks move the path; only AZE moves the certified level |
| Desktop-first experience | Mobile first; responsive web is a P1 follow-on |

## Learning model: the non-negotiable design rules

Fifteen rules from second language acquisition and cognitive science are encoded in the engine. Each is a requirement, not a guideline; a feature that breaks one does not ship.

| # | Rule | Evidence | Product behaviour |
| --- | --- | --- | --- |
| 1 | Retrieve, do not re-read | Roediger and Karpicke 2006: testing beats restudy by 30 to 50% at one week | Every check is recall or production from memory; no "tap to reveal, mark as known" |
| 2 | Space with expanding intervals | Cepeda et al. 2006: optimal gap is 10 to 20% of the retention interval | The scheduler owns review; the learner never chooses what to revise |
| 3 | Target about 80% success | Wilson et al. 2019 "85% rule"; Duolingo tunes to 80 to 90% recall | Difficulty and review timing adapt to hold item success between 75 and 85% |
| 4 | Interleave, do not block | Rohrer and Taylor 2007: interleaving doubles delayed test scores | Sessions mix strands and mix new with old; no single-topic drill sessions |
| 5 | Input before output, at i+1 | Krashen comprehensible input; Nation's meaning-focused input | Each atom opens with video or text at 95%+ known language plus one new element |
| 6 | Four strands in balance | Nation 2007: 25% each for input, output, language focus, fluency | Weekly plan enforces strand quotas; fluency atoms reuse only known material |
| 7 | Chunks over words | Ellis 2002; Boers and Lindstromberg on formulaic sequences | Vocabulary is stored and scheduled as chunks ("I'd like to..."), not single words |
| 8 | Noticing is explicit | Schmidt 1990; Norris and Ortega 2000, focus on form d = 0.9 | One highlighted target form per atom, shown in context, never a rule page first |
| 9 | Manage cognitive load | Sweller; Mayer's segmenting, modality and redundancy principles | Video 45 to 90 seconds, one idea, narration plus visual, no on-screen text duplicating audio |
| 10 | Errors are information | Metcalfe 2017: corrected errors beat errorless learning | Elaborated feedback shows the correct form in context; no lives or hearts |
| 11 | Generate before you are told | Bjork generation effect; Kapur productive failure | Learners attempt the target before the model answer in 1 of every 3 atoms |
| 12 | Fluency needs time pressure on known material | Nation fluency strand; 4/3/2 technique | Weekly fluency atoms use only mastered items with a visible timer (opt-in below B1) |
| 13 | Transfer-appropriate processing | Morris et al. 1977 | Speaking can-dos are checked by speaking, listening by listening; no multiple-choice proxies |
| 14 | Mastery gates on can-dos, not streaks | Bloom 1984 mastery learning | Progress is credited only when a can-do is demonstrated in free use at the 80% threshold |
| 15 | Short, frequent, same time | Distributed practice; Lally 2010 habit formation at about 66 days | Default 10-minute daily session at a user-set time; a 7-day dot row, not streak flames |

Three failure patterns of current apps, and the rule that prevents each: recognition counted as mastery (rule 13); streaks and hearts driving behaviour (rules 10 and 15); content outrunning memory with no review budget (rule 2, with new content pausing when overdue reviews exceed 25 items).

## The learning atom and the 10-minute session

The atom is the unit of everything: content production, scheduling, analytics and mastery. One atom teaches exactly one criterion with 1 to 3 new items (0 for review atoms) and takes 3 to 4 minutes.

| Phase | Content | Time |
| --- | --- | --- |
| Input | 45 to 90 second video, or a 6 to 8 card word tutorial; 95% known language plus the target | 60 to 90 s |
| Noticing | Target form or chunk highlighted in the input; one-line "why" in L1 below A2 | 15 s |
| Controlled practice | 3 to 4 retrieval items on the target: recognise, then complete, then produce | 60 s |
| Free use | One open task: say it, type it, or take a turn in a mini-dialogue | 45 to 60 s |
| Check | 1 to 2 items that decide mastery credit, delayed to the end of the session | 20 s |

Session shape (10 minutes, fixed so the learner always knows what comes next):

1. Plan (20 s, "Today I will...") then recall echo: 6 to 8 due retrievals from yesterday and 3 to 6 days ago across at least three strands (2 min)
2. New atom: today's target (4 min)
3. Use atom: a speaking or interaction task combining today's target with items due for free-use retrieval (3 min)
4. Story shelf: one graded 60 to 90 second story, read or listened to, at 98% known words, no quiz (1 to 2 min, optional extras for motivated learners); then close: the delayed check on the new atom, a one-tap "I can / not yet" reflection, and "what you can now do" in plain words (30 s)

A second optional session serves only review and fluency; below B1 there is never a second new atom on the same day. A missed day triggers a welcome-back reward (a story unlock) and a 3 to 5 minute warm restart, never a penalty; any four sessions in a week count as on track. One session a day (day 4 by default) includes a one-minute vote, see, revote item: the learner answers a concept question, sees anonymised peer answers and a model, then answers again.

Week shape: one can-do goal per week (for example A2 "Can order food and drink in a cafe"). Days 1 to 3 introduce the components, day 4 interleaves them, day 5 is a free-use performance scored against the can-do. Weekend sessions are optional pure review. At 8 to 10 can-dos per sub-level, A1 to A2 takes 10 to 12 weeks of daily use, in line with the 90 to 100 guided hours per level that providers quote.

## Repetition and memory engine

Every item (chunk, word, grammar pattern, pronunciation feature, can-do) has its own forgetting curve per learner, modelled with half-life regression (Settles and Meeder 2016): recall probability p = 2^(-Δ/h). Review fires when p falls to 0.8. The half-life h is updated from correct and incorrect retrievals, item difficulty, learner strand ability, time since last seen and the modality of the last retrieval. Until the model has enough data, the default ladder below applies.

| State | Entry condition | Next review | Retrieval type |
| --- | --- | --- | --- |
| New | First exposure | Same session, 2 to 3 atoms later | Recognition |
| Learning | 1 correct retrieval | 1 day | Recognition, then cued recall |
| Consolidating | 3 correct across 2 days | 3 days, then 7 | Cued recall (gap-fill, say it) |
| Known | Correct at 7 days | 14, then 30 | Free production in a new context |
| Mastered | Correct at 30 days in free use | 60, 120, retire at 180 with spot checks | Appears only inside fluency and interaction atoms |

Error rules:

- Wrong at Learning or Consolidating: half-life halved, item re-queued in the same session at least 2 atoms later, then next day
- Wrong at Known: drop to Consolidating, interval reset to 3 days (relearning is fast, so never to zero)
- Two consecutive errors: item tagged for a fresh input atom (re-teach) before further retrieval
- Slow correct (response time above the learner's 80th percentile): half-life multiplied by 0.8, no state change
- Hesitation and self-correction in speech are logged, not penalised

An item is not Known until retrieved correctly in at least two modalities, one of them productive. Speaking retrievals count double towards half-life because production is the stronger memory event.

| Strand | What is retrieved | How it is re-surfaced |
| --- | --- | --- |
| Grammar | Pattern slot | Gap-fill, sentence build, then unprompted use in a speaking or writing atom |
| Reading | Chunk in text | Due chunks seeded into the next reading text; 90% of a text must be known items |
| Listening | Chunk in audio | Due items placed in dictation and listen-and-choose at natural speed |
| Writing | Chunk, pattern | Due items listed as "try to use" targets; AI checks use and accuracy |
| Speaking | Chunk, pattern, pronunciation | Prompted recall ("How do you ask for the bill?") and 20-second tasks; ASR scores accuracy, fluency and target-item use |
| Mediation | Chunk, strategy | Summarise or relay a short text or audio; due items appear in the source |
| Interaction | Chunk, pattern, turn-taking move | AI dialogue; due items planted in the partner's turns and expected in the learner's |

## Competency framework and adaptive path

The path is built on a seven-layer hierarchy with stable IDs, extending the ES General English model (level, cluster, outcome, criteria, with language use as a per-task switch) by adding sub-level and strand: Level (Pre-A1 to C2) > Sub-level (x.1 and x.2, 13 bands) > Strand (7) > Cluster > Can-do outcome (CEFR Companion Volume descriptor, adapted) > Criterion (observable micro-skill) > Atom > Learning check. One outcome lives in one strand and one sub-level; a criterion may be reused across outcomes; each criterion maps to 1 to 3 atoms and each atom teaches exactly one criterion.

Indicative outcomes per level and strand (about 3 criteria per outcome, 2 atoms per criterion, so roughly 1,450 criteria and 2,500 to 3,000 atoms at full build):

| Level | Grammar | Reading | Writing | Listening | Speaking | Mediation | Interaction | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pre-A1 | 6 | 4 | 3 | 5 | 5 | 2 | 5 | 30 |
| A1 | 12 | 8 | 6 | 8 | 8 | 4 | 10 | 56 |
| A2 | 16 | 10 | 8 | 10 | 10 | 6 | 12 | 72 |
| B1 | 18 | 12 | 10 | 12 | 12 | 10 | 14 | 88 |
| B2 | 18 | 14 | 12 | 14 | 14 | 12 | 14 | 98 |
| C1 | 12 | 12 | 12 | 12 | 12 | 12 | 12 | 84 |
| C2 | 6 | 8 | 8 | 8 | 8 | 10 | 8 | 56 |
| Total | 88 | 68 | 59 | 69 | 69 | 56 | 75 | 484 |

Grammar and vocabulary are enablers, not modes. The grammar strand stays visible on the dashboard because learners and sales teams expect it, but the engine treats it as scaffolding: each communicative criterion lists its enabler grammar and vocabulary IDs (English Grammar Profile and English Vocabulary Profile references), an enabler atom is inserted only when placement or a failed check shows a gap, and enabler mastery is inferred from correct use in three communicative checks without a discrete grammar test.

Worked example, A1.2 Speaking: outcome SPK-A1.2-03 "Can describe themselves, where they live and what they do, in simple phrases" has three criteria (3 to 5 connected sentences using I am / I live / I work; linking with and / but; intelligible core vocabulary at word level). Four atoms: present simple be and live/work (grammar enabler), linking with and / but, word stress in jobs and places (pronunciation enabler), model video "Meet Fatima" then a 30-second recorded self-introduction. The check is a 30-second speaking task scored on sentence count, linker use and intelligibility.

Worked example, B2.1 Mediation: outcome MED-B2.1-04 "Can summarise the main points of a complex text for someone who has not read it" has four criteria (identify the main claim and two supports; reformulate rather than copy; adapt register to audience; signal source and stance). Six atoms, ending in a free written or spoken summary of a new text scored on content coverage, paraphrase ratio, register fit and attribution.

Adaptive sequencing:

- Prerequisite graph: every can-do and grammar pattern lists explicit prerequisites; a new atom is drawn only from nodes whose prerequisites are at Consolidating or better
- Placement seed: the AZE test sets a starting ability per strand and marks items below that level as provisionally Known with a short half-life, so the first weeks verify rather than teach
- Next atom score = prerequisite readiness x 0.4 + strand deficit against the weekly quota x 0.3 + closeness of predicted success to 0.8 x 0.3; ties go to the weaker strand
- Difficulty targeting: Bayesian knowledge tracing per can-do plus item half-life gives predicted success; above 0.9 the engine removes support (open production, faster audio), below 0.7 it adds scaffolding (model answer first, slower audio, chunk bank)
- Time split: 30% new, 50% review, 20% fluency; 40% new below A1 where the prerequisite graph is sparse; new content pauses when overdue reviews exceed 25 items
- Interleaving: no two consecutive items from the same strand or target pattern; at least three strands per session
- Plateau detection: a can-do that fails its day-5 performance twice triggers a diagnostic atom to find the failing component, not a repeat of the week

Learning checks versus the AZE test:

| Dimension | Learning check | AZE test |
| --- | --- | --- |
| Purpose | Mastery of one criterion, formative | Level certification, summative |
| Items | Short, scaffolded, retried, hints allowed | Standardised, timed, secure |
| Mastery rule | Keyed: 3 of 4 correct in two sittings on separate days. AI-scored: 2 attempts on different days at or above threshold, second task unseen | IRT-scaled score, 150+ metrics, CEFR band |
| Decay | Mastered criteria re-sampled every 3 to 4 weeks; two misses revert to shaky | Not applicable |
| Effect | Moves the path | Moves the certified level |

Progression gates: atom complete (watched to 80%, first check attempted) unlocks the next atom; criterion mastered fills the outcome ring; all criteria mastered advances the strand marker; a sub-level is provisional at 80% of outcomes achieved with no strand under 60%, at which point 30% of new atoms come from the next sub-level; the sub-level is confirmed only by an AZE checkpoint (15 to 20 minutes, adaptive, every 4 to 6 weeks or when provisional criteria are met); a whole level is confirmed by a full AZE test every 12 to 16 weeks. If a checkpoint places lower than in-app mastery suggests, the app never demotes; it reweights towards the weak strand, and two consecutive disagreements trigger an item review.

Data model for the backend team (mastery is derived and recomputable from Attempt; scorer version stored on every attempt; IRT parameters nullable until calibrated):

| Entity | Key fields |
| --- | --- |
| Level, SubLevel | id, cefr\_code, order, aze\_score\_min, aze\_score\_max |
| Strand | id, code, cefr\_mode (reception, production, interaction, mediation, enabler), display\_order |
| Cluster | id, strand\_id, sublevel\_id, name, order |
| Outcome | id, cluster\_id, cefr\_descriptor\_ref, can\_do\_text, can\_do\_text\_l1 (json), icon\_id |
| Criterion | id, descriptor, type (communicative, grammar, vocab, pronunciation), egp\_ref, evp\_ref, mastery\_rule\_id; many-to-many with Outcome |
| CriterionEnabler | criterion\_id, enabler\_criterion\_id, required |
| Atom | id, criterion\_id, type (video, word\_tutorial, model, practice), media\_url, duration\_sec, language\_use (bool, the ES per-task switch), transcript, variant (dense, standard, light), status |
| Item | id, criterion\_id, item\_type, stem, options, key, rubric\_id, difficulty\_b, discrimination\_a, exposure\_count |
| Rubric | id, dimensions (json), scoring\_model\_version |
| Learner | id, l1, age\_band, confirmed\_sublevel\_id, provisional\_sublevel\_id, aze\_latest\_test\_id |
| Path, PathStep | path\_id, learner\_id, generator\_version, source; atom\_id, order, reason (gap, core, review, enabler), status |
| Attempt | id, learner\_id, item\_id, atom\_id, response (text or audio\_url), score, sub\_scores, ai\_confidence, scorer\_version, response\_time, device |
| MasteryState | learner\_id, criterion\_id, state (unseen, learning, shaky, mastered, decayed), half\_life, next\_review\_at, strength |
| LevelEvent | learner\_id, from\_sublevel\_id, to\_sublevel\_id, trigger (checkpoint, full\_test, manual), aze\_test\_id |

## Content and video production model

Every video follows one fixed five-beat structure so learners never wonder what comes next, and every atom exists in three script densities (dense, standard, light) so the engine can change how a lesson is told, not only which lesson comes next.

| Level | Length | Speech rate (wpm) | Lead presenter | L1 allowance |
| --- | --- | --- | --- | --- |
| Pre-A1 | 30 to 45 s | 90 to 100 | Animation plus real teacher face | L1 subtitles on by default; one-line L1 "what this is" card at start |
| A1 | 45 to 60 s | 100 to 110 | Real teacher | L1 subtitles optional; L1 gloss for 3 to 5 key words |
| A2 | 60 to 75 s | 110 to 125 | Real teacher or avatar | L1 word glosses on tap only |
| B1 | 60 to 90 s | 125 to 140 | Avatar or teacher | Tap-to-translate only |
| B2 | 75 to 90 s | 140 to 155 | Avatar | None |
| C1 to C2 | 75 to 90 s | 155 to 170 | Avatar or authentic clip | None |

| Beat | Share | Purpose |
| --- | --- | --- |
| Hook | 10% | A real situation in Dubai or London, one sentence, no teaching yet |
| Notice | 20% | Target language heard two or three times in context, highlighted on screen |
| Explain | 30% | One rule or one meaning only; visual model (timeline, picture, gesture), no metalanguage |
| Practise aloud | 25% | Presenter says it, learner repeats; a 2-second pause is built in |
| Recap | 15% | One-line summary card in the same wording as the learning-check stem |

Video rules: vertical 9:16; captions always available, word-synced at Pre-A1 to A2 and phrase-level from B1; L1 subtitles a separate toggle, never burnt in; max 7 words per caption line and 2 lines; only the target language appears as text, never the presenter's full script; the target form in the accent colour and everything else neutral; one idea per shot; a face on screen for at least 60% of every video. Real teachers present all Pre-A1 to A1 explanation beats and all pronunciation atoms (mouth visible, slowed replay). AI avatars take dialogue partners, A2+ explanation beats and anything needing rapid re-versioning. Animation handles time, aspect, articles and word order.

Word tutorial (text-first atom): a swipe-up card stack of word plus picture plus audio, one-sentence meaning, three examples in different settings (home, work, study) each with audio and tap-to-translate, then "your turn". Words per screen: 12 at Pre-A1 to A1, 25 at A2 to B1, 40 above. Used for vocabulary sets, collocations, sound-letter links, functional chunks and review; cheaper to localise and works on poor data. Video is reserved for anything that needs modelling.

| Strand | Learning-check item types | Example |
| --- | --- | --- |
| Grammar | Tap-to-order, gap fill, error spot, transform | Reorder: to / work / I / by / go / metro |
| Reading | Picture match, true/false/not given, heading match, inference | A Dubai Metro notice: "You can eat on the train." True, false or not given |
| Writing | Sentence build, 20 to 60 word production, correct the message | "Your colleague Amira is late. Write a 2-line WhatsApp message asking where she is." |
| Listening | Pick the picture, dictation (A1+), gist, detail gap fill, accent variant repeat | Hear "Platform 4, not 14." Choose 4, 14 or 40 |
| Speaking | Shadowing, read-aloud, picture description, open response 20 to 45 s | "Describe your morning commute. 30 seconds." |
| Mediation | Relay to a friend, explain a chart in simple words, translate the gist | "Your flatmate cannot read this gas bill. Tell them the three things they must do." |
| Interaction | Role-play with an AI character, turn-choice branching, repair | AI cafe owner: "We are out of oat milk." Negotiate an alternative in 3 turns |

AI scoring uses the AZE engine so practice scores and certificate scores share one scale: ASR to transcript, then pronunciation (phoneme goodness-of-pronunciation), fluency (rate, pauses) and content, lexis and grammar via rubric-aligned LLM scoring calibrated against human-rated anchors per level. Shadowing is scored on timing and stress, not words. Low-confidence responses get a second pass or "practise again" rather than a score; 5% of open responses are human re-rated weekly and drift over 0.3 of a band triggers recalibration.

| Scope | Atoms | Video hours (avg 65 s) | Items (8 per atom) | Effort (person-weeks) |
| --- | --- | --- | --- | --- |
| Launch, Pre-A1 to B1 | 840 | 9 | 6,720 | 110 to 130 |
| Full, to C2 | 1,440 | 16 | 11,520 | 190 to 220 |

Effort assumes a core team of five (content lead, two materials writers, one video producer, one QA linguist) with AI drafting of scripts and items, yielding about 8 atoms per person-week end to end. Human-presented video costs three times avatar video; keep it to about 25% of the total.

| Stage | Output | Owner | Gate |
| --- | --- | --- | --- |
| 1 Outcome spec | Can-do, target forms, vocabulary list, item blueprint | Content lead | Maps to exactly one CEFR descriptor |
| 2 AI draft | Script, word cards, 12 candidate items | Writer with LLM | Writer edits, never publishes raw |
| 3 Script review | Final script and storyboard | Senior writer | Gate A pedagogical: one idea, beat structure, level lexis against word list |
| 4 Production | Video, TTS audio, avatar render | Producer | Gate B linguistic: pronunciation, stress, naturalness, caption sync |
| 5 Assembly | Atom packaged with items and metadata in the CMS | Producer | Automated: duration, captions, alt text |
| 6 QA | Signed-off atom | QA linguist, accessibility reviewer | Gate C accessibility (WCAG AA); Gate D bias and cultural fit for Gulf and UK audiences |
| 7 Pilot | 20-learner trial per level | Content lead | Item facility 0.4 to 0.9, drop-off under 10%, else revise |
| 8 Publish | Live, versioned atom | Content lead | Monthly performance review |

Style: warm, calm, respectful of adult intelligence, no exclamation marks. A recurring cast of six across Dubai and London (a nurse from Kerala, an Emirati business student, a Brazilian barista in Shoreditch, a Saudi engineer on secondment, a Ukrainian mother retraining, a retired Egyptian teacher), each with a story arc across levels. Settings: Metro and Tube, clinics, offices, campuses, supermarkets, flat shares, markets, interviews, landlord calls, GP bookings, video meetings. Gentle situational humour only, never at a character's language, religion, nationality or age. Balanced gender and age including competent over-50s, a range of accents in listening from A2, modest dress options, no alcohol or dating scenarios by default.

## Learner experience and UX principles

A Pre-A1 learner with all text muted must still complete a lesson using icons, colour and motion alone. That is the acceptance test for the whole interface. Visual direction is the calm frosted-glass style with glowing icons and buttons already set for the AZE portal, with simple bars and lines for progress and no radar charts.

| # | Principle | Testable rule |
| --- | --- | --- |
| 1 | One job per screen | A new user can say what to tap within 3 seconds; one glowing primary button per screen |
| 2 | Show, do not tell | Every instruction has an icon, a 2-second animation or an example; no instruction over 6 words |
| 3 | Language-free navigation | With text muted, a Pre-A1 tester completes a lesson |
| 4 | Calm by default | No more than 2 animated elements moving at once; no red full-screen states; nothing flashes |
| 5 | Progress always visible, always forward | Bars and the road marker never move backwards; decayed mastery becomes "review", never "lost" |
| 6 | Ten minutes is the unit | Any session finishes in under 10 minutes; pause and return costs nothing |
| 7 | Hear first, read second | Every word, sentence and instruction has tap-to-hear; audio plays before text is required |
| 8 | Mistakes are information | Wrong answers reveal the right one plus a one-line why; no life counter or lockout |
| 9 | Respect the adult | No baby talk, no mascot nagging, no guilt; tone is a calm, age-neutral coach |
| 10 | One hand, one thumb | Primary actions in the bottom 40% of the screen; targets 48dp or larger |

| Screen | One job | Contains | Fits one screen |
| --- | --- | --- | --- |
| Home (Today) | Start today's 10 minutes | Three-slice ring, one-line growth-mindset coach message, glowing Start, small two-character study scene with live learner count, 7-day dot row | Yes |
| Road | See where I am and where I am going | Drawn road with weekly stops, marker, next stop highlighted, level flags A1 to C2 | Scrolls along the road only |
| Atom | Learn one thing | Video or word cards, then checks one per screen, thin progress line, exit always visible | Yes |
| Speak | Say it and hear myself | Large mic button, model audio, waveform, three result bars (Sounds, Rhythm, Words), retry | Yes |
| Classmates | See who is here, send a challenge | Online avatars, Challenge per person, incoming challenge card; no messaging | Yes, up to 8 avatars |
| Progress | Understand my growth | Seven strand bars, level estimate line, weeks-active strip, Download report | Yes |
| Me | Settings and language | L1, audio speed, text size, daily goal, notifications, report sharing | Scrolls, low frequency |

First run, install to first atom in under 4 minutes: language (flag grid with native names, interface switches instantly); why (four picture cards in L1: work, study, travel, family); daily time (5, 10 or 15 minutes with ring preview, default 10); account (Apple, Google or phone number, deferrable to day 2); "let us find your start" (never called a test, framed in L1 as three quick questions, adaptive, 6 to 8 items with audio, stops after two consecutive misses, no timer, ends with the marker landing on the road); first atom (40-second video or word cards and three checks); reward (one ring slice fills, coach line "Day 1. See you tomorrow", notification permission asked now with the reason shown). The CEFR label appears in Progress only after a week of data.

| Motivation mechanic used | Design | Excluded | Reason excluded |
| --- | --- | --- | --- |
| Daily ring | Three slices of 3 to 4 minutes | Hearts or lives | Punishes the learners who need practice most |
| Gentle streak | Row of dots per week; four sessions count as on track; a lapse earns a welcome-back reward, never a reset | Leagues and public leaderboards | Shame for the bottom half; older users disengage |
| Road stops | Weekly checkpoint atom unlocks a flag | Guilt notifications | Erodes trust with adults; replaced by a neutral reminder at the chosen time |
| Mastery bars | Fill with practice, fade slowly to a review tint | Pay-to-skip or buy-back streaks | Turns learning into a transaction |
| Social presence | Two-character study scene plus live classmate count | Countdown timers on exercises | Stress for beginners; time pressure only in opt-in challenges |
| Challenges | Same-level 5-item sprint, result shown privately to both | Infinite lesson feeds | The ring closes and the app says stop |
| Shareable report | Clean PDF with level line, strand bars and hours |  |  |

Feedback: a wrong option dims to grey with a soft haptic, the correct one glows and plays audio, a one-line why appears (in L1 below A2); each missed item returns once at the end of the atom and, if missed twice, is scheduled for tomorrow. Speaking shows three bars against a pass line with mispronounced words highlighted for tap-to-hear and retry of that word only; three attempts then "keep going", never a fail state. Celebration scale: micro glow for a correct item, slice fill for a check set, flag for a weekly stop, no full-screen confetti.

Accessibility and clarity: body text 17pt minimum, lesson content 22pt, headlines 28pt, scalable to 130%; every icon has a one-word label in L1 and the icon set stays under 24 glyphs; interface, instructions, coach line and error explanations in L1 for Pre-A1 to A2, lesson instructions in English with tap-to-translate from B1, L1 on demand only from B2, always overridable; every text has a speaker icon and auto-plays on first exposure with 0.75 and 1.0 speed; contrast 4.5:1 on the busiest frosted background and glow is never the only state indicator; no red-green-only meaning; 48dp targets, 56dp for primary actions; reduce-motion respected; full RTL mirroring for Arabic including the road direction; maximum two lines of instruction per screen, example before rule.

Five memorable features no current app does well:

1. Say it to someone real: once a week the speaking atom is a 60-second recorded message to a classmate who replies with their own recording, both scored by AZE
2. Life phrases of the week: the learner picks a situation (job interview, parents' evening, landlord call) and the path injects three mediation and interaction atoms around it
3. My mistakes, my lesson: every Friday an auto-generated atom built only from that learner's errors, with their own recordings played next to the model
4. Progress in plain words: an AZE-generated "What I can do now" line in L1 and English on the Progress screen and in the report
5. Classroom bridge (ES World students): the next in-class lesson appears as a stop on the road; completing its pre-atom unlocks a classroom check-in QR

## Signature learning activities and UI

Thirteen activity and interface types make the product recognisably different in the learner's hands. Each is specified as an activity type the atom player can render from content JSON (see the build specification), with its inputs, scoring and failure handling. Priority 1 items ship in the MVP, priority 2 in v1, priority 3 in v2.

| # | Activity | Priority | Strands | Mechanic | Input and scoring | Failure handling | Data captured |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Say it, see it | 1 | Speaking, grammar | A scene (SVG or layered PNG) with slots. The learner speaks; ASR plus a slot-filling parser maps the utterance to scene parameters (quantity, object, colour, time). The scene re-renders to show what was said. If the utterance is well-formed and matches the prompt, the character reacts positively; if it is ambiguous, the character shows the misunderstanding (wrong number of cups) and asks a one-line clarifying question | Target intent from the atom (e.g. order 2 coffees, large). Score = intent match (0 or 1) plus form accuracy (AZE engine) plus intelligibility; pass needs intent match and form at or above threshold | Two attempts, then the model sentence plays with the correct scene; a third attempt is optional; the item is scheduled for tomorrow | Transcript, parsed slots, intent match, form score, attempts, response time |
| 2 | Touchable scene | 1 | Listening, vocabulary | The input phase is a scene with 6 to 10 tappable hotspots. Each tap plays the chunk in context and highlights its text. After 3 taps or 40 seconds the scene character speaks a 20 to 30 second monologue using the tapped chunks | No score; records which hotspots were tapped and how often; the controlled-practice items prioritise untapped and single-tapped chunks | None; the monologue always plays | Hotspot taps, replays, time in scene |
| 3 | Grammar you can drag | 1 | Grammar | Two interactions. Time slider: a sentence with a slider from past to now to future; dragging morphs the verb phrase live with the changed morphemes highlighted. Magnet tiles: word tiles that snap only into grammatical sequences; an ungrammatical drop bounces with a soft haptic and a one-word reason (order, agreement) | Slider: the learner must set the slider to match a pictured time cue in 3 of 4 items. Tiles: full sentence assembled in under 3 attempts | After 3 attempts the sentence self-assembles with each tile sliding into place one by one | Slider positions over time, tile drops, bounces, attempts |
| 4 | Voice-note soap | 2 | Interaction, listening | A character sends a 10 to 20 second voice note in a chat-style thread. The learner replies by voice (10 to 30 s). The reply is classified into 2 to 3 branches (agree, decline, ask for more) and the next note continues the story. One episode per weekday, 5 to 10 episodes per arc per level | AZE scoring on task completion and appropriacy; branch classification by intent; pass needs an on-task reply | An off-topic or empty reply gets a gentle follow-up note ("Sorry, I did not catch that, can you say it again?"); two misses move the story on with a neutral branch | Transcript, intent, branch taken, AZE sub-scores, listen count |
| 5 | Explain it to Sami | 2 | Mediation | The learner watches or reads a 20 to 40 second source, then explains it in simpler English to a character who did not understand. Scoring asks whether the character can now answer 2 to 3 content questions: an LLM reads the learner's transcript and answers the questions from it alone | Content coverage (questions answerable from transcript), paraphrase ratio (overlap with source below 60%), register fit; pass needs 2 of 3 questions answerable | Sami says what he still does not understand ("How many people?") and the learner adds one more sentence; max two additions | Transcript, questions answered, paraphrase ratio, additions |
| 6 | Shadow duet | 1 | Speaking, pronunciation | Split view: presenter clip on the left, learner on the right (audio only by default, camera optional). The learner speaks along; a rhythm ribbon (syllable energy over time) draws under each voice. Divergent words are highlighted; tapping a word plays the model word and the learner's version, then records a one-word retry | Timing alignment (dynamic time warping distance), stress pattern match, per-word pronunciation score; pass needs alignment and stress above threshold, words individually fixed | Three full attempts, then "keep going" and the words below threshold enter the review queue as single-word items | Alignment distance, stress match, per-word scores, retried words |
| 7 | Snap the world | 3 | Reading, vocabulary | The learner photographs text (menu, sign, message). OCR extracts text; the content service builds a one-minute atom: the text with tap-to-hear chunks, three meaning items, one production item. New chunks within one sub-level of the learner's level are added to their item pool | Standard item scoring | Illegible or unsafe text returns "try another photo" with examples; items are flagged auto-generated and excluded from mastery decisions until a human review or three correct retrievals | Photo text, chunks added, item results |
| 8 | Teach it back | 2 | Speaking, mediation | On day 5 the learner records a 30-second explanation of the week's can-do to a beginner character ("Tell Maya how to order in a cafe"). Scored for use of the week's target items and clarity | Target items used (at least 3 of 5), coherence, intelligibility; a pass counts as the week's free-use performance for those items | One optional re-record; no fail state, result shown as the can-do ring filling partially or fully | Transcript, target items used, AZE sub-scores |
| 9 | Fog of memory | 1 | UI, all strands | The Road screen renders mastered stretches clear and unmastered stretches in soft fog. Items whose predicted recall has fallen below 0.85 start to re-fog their stop (opacity tied to predicted recall), so forgetting is visible before review fires | No scoring; fog opacity = 1 minus mean predicted recall of the stop's items | None | Fog state at session start, taps on fogged stops |
| 10 | Your English city | 2 | UI | Each achieved outcome becomes a building on a skyline (one skyline per level). Decaying outcomes dim; fluent ones glow. The downloadable report includes the skyline image. Building art is a fixed set of 40 silhouettes tagged by strand | None; building state = outcome mastery state | None | Skyline renders, report downloads |
| 11 | The capsule | 1 | UI | During a session the navigation bar hides; content flows as a vertical story with the ring at the top. Exit is a single icon that pauses and keeps the exact phase. The session ends itself with the close phase; no "next lesson" button appears below B1 | None | None | Phase reached on exit, resume rate |
| 12 | Meaning-first feedback | 1 | UI, all strands | Wrong answers show the consequence first (the scene, the character's reaction, or the learner's own words played back), then the correct form glows and plays; red is never used | None | None | Feedback views, time to next |
| 13 | Same-level voices on a map | 3 | Listening, social | On Classmates, a world map shows pins of learners at the same sub-level who opted in. Tap a pin to hear that learner's recording of today's chunk. Listen only; recordings are the learner's own atom recordings with explicit consent, moderated by the same AI safety filter as all speech | None | Recordings failing moderation are never published | Plays, opt-in rate |

Activity types 1, 3, 6, 9, 11 and 12 are MVP because they define the feel of the product and can be built with current speech recognition, a slot-filling parser, SVG scene rendering and the AZE engine; none depends on the LMS or on social features.

## User stories by persona

Ordered by priority within each persona. Stories marked P0 must ship in v1.

| Persona | Story | Priority |
| --- | --- | --- |
| Beginner learner (Fatima) | As a learner with no English, I want the whole app in my language with audio on every screen so that I can start without being able to read English | P0 |
| Beginner learner | As a beginner, I want my starting point found in a few picture questions, never called a test, so that I am not frightened off on day one | P0 |
| Beginner learner | As a beginner, I want to hear every word before I see it so that I learn sounds and meaning together | P0 |
| Beginner learner | As a beginner, I want a wrong answer to show me the right one with a short reason in my language so that I learn from it instead of feeling punished | P0 |
| Working learner (Arjun) | As a commuter, I want a complete session in 10 minutes that I can pause and resume so that learning fits my day | P0 |
| Working learner | As someone who avoids speaking, I want short speaking tasks with private, specific feedback so that I build confidence without an audience | P0 |
| Working learner | As a learner with a work goal, I want role-plays based on my job so that what I practise is what I need on Monday | P1 |
| Working learner | As a learner who skipped yesterday, I want a short catch-up rather than a lost streak so that I keep going | P0 |
| Student learner (Elena) | As an ES World student, I want my next class to appear as a stop on my road so that app practice and classroom lessons connect | P1 |
| Student learner | As a learner aiming for university, I want writing and mediation tasks scored with specific feedback so that I improve the skills exams and lectures demand | P0 |
| Student learner | As a learner, I want a downloadable progress report that explains in plain words what I can now do so that I can show it to my parents or an admissions office | P1 |
| Advanced learner (Yusuf) | As a B2 learner, I want fluency tasks on language I already know, under light time pressure, so that I speak faster and more naturally | P1 |
| Advanced learner | As a competitive learner, I want to challenge a classmate who is online to a short sprint, with results shown privately, so that I stay motivated without messaging | P1 |
| Advanced learner | As a learner who knows the grammar, I want the engine to skip what I already use correctly so that I do not waste time on drills | P0 |
| All learners | As a learner, I want my official level confirmed by a short AZE checkpoint every few weeks so that my progress means something outside the app | P0 |
| All learners | As a learner, I want to see which can-do I am working on this week in plain words so that I know why today's lesson matters | P0 |
| Admin (content lead) | As the content lead, I want to create, version and publish atoms with their items and metadata so that content ships without engineering | P0 |
| Admin | As the content lead, I want item facility, drop-off and scoring drift per atom so that weak content is found and fixed | P0 |
| Admin | As an AZE administrator, I want to see learner cohorts, mastery and checkpoint results so that I can report learning gains to institutions | P1 |
| Admin | As an admin, I want to configure levels, strands, outcomes and prerequisites so that the framework can evolve without code changes | P1 |

Edge cases that stories must cover: a learner who fails placement entirely (start at Pre-A1 with a welcome atom, no "fail" state); an offline session on the Metro (word tutorials and cached video play offline, attempts sync later); a learner at two levels across strands (path follows strand ability, dashboard shows a range); an account on a shared family phone (profile switch at launch, no cross-contamination of mastery); a 16 or 17-year-old (age gate, consent flow, report sharing to a parent).

## Requirements

P0 is the smallest set that still solves the core problem: a beginner can learn unaided, the engine owns spacing and mastery, speaking is produced not recognised, and AZE confirms progress. Everything else is P1 or P2.

| ID | P0 requirement | Acceptance criteria |
| --- | --- | --- |
| R1 | Placement and path generation | Given a new learner completes the short AZE placement, when it ends, then a path exists with a starting sub-level per strand, items below that level marked provisionally Known, and the first atom served within 2 seconds |
| R2 | Learning atom player | Video or word tutorial, noticing highlight, 3 to 4 controlled items, one free-use task and a delayed check, in that order; atom completes in 3 to 4 minutes at median; exit always visible and resume returns to the exact phase |
| R3 | Spaced repetition scheduler | Per-item, per-learner half-life model with the state ladder New to Mastered; review fires at p = 0.8; new content pauses when overdue reviews exceed 25; an item is Known only after correct retrieval in two modalities including one productive |
| R4 | 10-minute session composer | Warm-up review, new atom, use atom, close; at least three strands per session; no two consecutive items from one strand or pattern; second session serves review and fluency only |
| R5 | Seven strands with matching-modality checks | Speaking checked by speech, listening by audio, writing by typed production, interaction by AI dialogue, mediation by relay or summary; no strand's mastery can be earned through multiple choice alone |
| R6 | AI scoring of speaking and writing via the AZE engine | Scores on the AZE scale; confidence threshold routes low-confidence attempts to "practise again"; scorer version stored on every attempt; 5% weekly human re-rating sample exported; scorer agreement benchmarked and published per L1 (Arabic, Hindi and Urdu, Mandarin, Spanish, Portuguese) against the Speak and Improve corpus; the recorder applies noise gating and prompts a re-record on poor audio |
| R7 | Mastery and progression gates | Keyed criteria: 3 of 4 correct in two sittings on separate days; AI-scored criteria: two passes on different days with the second task unseen; sub-level provisional at 80% of outcomes with no strand under 60%; confirmed only by an AZE checkpoint |
| R8 | AZE checkpoint integration | A 15 to 20 minute adaptive checkpoint is offered every 4 to 6 weeks or when provisional criteria are met; result updates confirmed level and regenerates the path; the app never demotes on a lower checkpoint |
| R9 | Error feedback | Wrong answer dims to grey, correct answer glows and plays audio, one-line explanation in L1 below A2; missed item returns once at atom end; no hearts, lives or lockouts anywhere in the product |
| R10 | L1 support | Interface, instructions, coach line and error explanations available in Arabic, Hindi, Russian, Spanish, Turkish and Chinese at launch; full RTL for Arabic; L1 level rules (full to A2, English with tap-to-translate from B1, on demand from B2) with learner override |
| R11 | Audio-first content | Every word, sentence and instruction has tap-to-hear; audio auto-plays on first exposure; 0.75 and 1.0 speed; all video captioned, word-synced at Pre-A1 to A2 |
| R12 | Home, Road, Atom, Speak and Progress screens | Each fits one phone screen without scrolling except the Road, which scrolls along the road only; one primary action per screen; seven strand bars and a level line on Progress; no radar charts |
| R13 | First-run flow | Install to first completed atom in under 4 minutes at median; placement framed as questions, not a test, with no timer and no numeric result shown on day one; onboarding asks when and where the learner will study (an if-then plan) and schedules the reminder to it |
| R14 | Content management console | Content lead can create, version, preview and publish atoms with items, metadata, variant density and language-use flag; publishing requires gates A to D ticked; per-atom facility, drop-off and drift shown |
| R15 | Learner data capture | Every attempt records item, modality, correctness, response time, hints, error type, half-life before and after, predicted and actual success; speaking attempts record transcript, rate, pause ratio and per-feature pronunciation scores |
| R16 | Age gate and consent | Under-18 learners pass a consent flow meeting UAE PDPL and UK Age Appropriate Design Code; data minimisation and UAE and UK residency options; DPIA signed before launch |
| R17 | Launch content | Pre-A1 to B1 complete across all seven strands: about 840 atoms and 6,720 items passed through all QA gates and a 20-learner pilot per level |

| ID | P1 requirement | Acceptance criteria |
| --- | --- | --- |
| R18 | Adaptive video variants | Each atom holds dense, standard and light scripts; the engine switches variant from live check data within a path; prototyped on one level in the MVP |
| R19 | Classmates and challenges | Online classmates visible; same-level 5-item challenge; results private to both; no messaging surface exists |
| R20 | Downloadable progress report | One-page PDF with level line, strand bars, hours and an AZE-generated "What I can do now" line in English and L1; shareable by link |
| R21 | Life phrases of the week | Learner picks a situation; three mediation and interaction atoms are injected that week |
| R22 | My mistakes, my lesson | A weekly auto-generated atom built only from the learner's own errors with their recordings beside the model |
| R23 | Say it to someone real | Weekly recorded exchange between matched classmates, both scored by AZE, no free-text messaging |
| R24 | Classroom bridge for ES World students | Next in-class lesson appears as a road stop; pre-atom completion unlocks a check-in QR; enrolment data synced from the ES LMS |
| R25 | Offline mode | Word tutorials and the next three atoms cached; attempts queue and sync; scheduler recomputes on reconnect |
| R26 | Responsive web app | Same account and path on desktop web for enrolled students and institutions |
| R27 | Subscription and paywall | Free tier: core lessons with a daily cap; paywall AI speaking depth, certificates and offline; one-month free trial; regional pricing anchored at US$6 to 9 a month annualised; ES World enrolment bundle unlocks everything |
| R34 | Supporter sentence (automated) | The learner may nominate one supporter (friend, family member, colleague) by phone number or email; each week the system sends that person one sentence with the learner's can-do goal and a suggested question to ask in English; the learner sees the sentence before it is sent and can stop it at any time; no staff involvement; off by default for under-18s |
| R35 | Institutional readiness | SCORM or LTI export of progress and mastery; audit trail of attempts and level events; WCAG 2.2 AA conformance statement; cohort analytics exportable for tenders |

| ID | P2 consideration (design for, do not build) | Architectural implication |
| --- | --- | --- |
| R28 | B2 to C2 content | Framework and CMS already support 13 sub-levels; speech scoring calibrated to C-level anchors later |
| R29 | B2B and B2G licensing with institution admin | Learner belongs to zero or more organisations; cohort analytics on the AZE client portal |
| R30 | Teacher view and teacher-assigned atoms | Path steps carry a source field (engine, teacher); the teacher portal reads mastery states |
| R31 | Exam tracks (IELTS, Access to Work) | Outcomes tagged to exam constructs; separate path generators per track |
| R32 | Additional target languages | Level, strand, outcome and atom entities are language-agnostic; scoring engine is the only English-specific component |
| R33 | ES World course referral | A single optional link to ES World courses in Me; the product is fully online with no human tutoring, chat or teacher content in the app |

## Technical build specification

This section is written so a Claude Code session can scaffold the product from it. Stack choices are recommendations; the contracts (schemas, algorithms, API, events) are the requirement. Build order is at the end.

**Architecture**

| Component | Responsibility | Recommended stack |
| --- | --- | --- |
| Mobile app | Atom player, screens, offline cache, audio capture | React Native with Expo (iOS, Android, web from one codebase); react-native-reanimated for ring, road and fog; expo-av for audio; SVG scenes via react-native-svg |
| API gateway | Auth, learner profile, path, attempts, content delivery | Node.js (NestJS) or Python (FastAPI); REST plus a small GraphQL read layer for the Progress screen; JWT with refresh |
| Learning engine service | Scheduler (half-life model), session composer, path generator, mastery updater | Python service; stateless workers reading MasteryState and writing PathStep; runs on every attempt submit and nightly |
| Scoring service | Routes speech and writing attempts to the AZE engine or the practice scorer; stores sub-scores and scorer\_version | Python; queue-based (Redis or SQS); self-hosted Whisper variant for practice shadowing, AZE API for mastery decisions |
| Content service and CMS | Atom authoring, versioning, QA gates, publish, variants, media | Headless CMS (Sanity or Payload) storing atom JSON; media on S3-compatible storage with CDN; signed URLs |
| Analytics pipeline | Event ingestion, learner model features, item statistics | Event stream to a warehouse (BigQuery or ClickHouse); dbt models for facility, drop-off, drift |
| Admin console | Content lead and AZE admin views | Next.js web app against the same API |
| Data store | Relational core | PostgreSQL with the entities in the data model; Attempt and Event tables partitioned by month |

**Atom content schema (JSON, stored in the CMS, versioned)**

```json
{
  "atom_id": "ATM-A1-SPK-0031",
  "version": 3,
  "criterion_id": "CRI-A1.2-SPK-03-01",
  "strand": "SPK",
  "sublevel": "A1.2",
  "type": "video",
  "variant": "standard",
  "language_use": true,
  "target_items": ["ITM-CHK-00412", "ITM-GRM-00077"],
  "prerequisites": ["CRI-A1.1-GRM-04-01"],
  "phases": [
    {"kind": "input", "media": {"video_url": "...", "captions_url": "...", "l1_subtitles": {"ar": "...", "hi": "..."}}, "duration_sec": 60},
    {"kind": "noticing", "highlight": {"text": "I'd like", "start_ms": 12400, "end_ms": 13100}, "why": {"en": "...", "ar": "..."}},
    {"kind": "controlled", "items": ["ITM-...", "ITM-...", "ITM-..."]},
    {"kind": "free_use", "activity": "say_it_see_it", "config": {"scene_id": "SCN-cafe-01", "intent": {"action": "order", "item": "coffee", "quantity": 2}}},
    {"kind": "check", "items": ["ITM-..."], "delayed": true}
  ],
  "status": "published",
  "qa": {"pedagogical": true, "linguistic": true, "accessibility": true, "bias": true}
}
```

Item schema: item\_id, criterion\_id, strand, item\_type (one of: tap\_order, gap\_fill, error\_spot, transform, picture\_match, tfng, heading\_match, inference\_mcq, sentence\_build, short\_production, correct\_message, pick\_picture, dictation, gist\_mcq, detail\_gap, shadow, read\_aloud, picture\_describe, open\_response, relay, explain\_chart, translate\_gist, dialogue\_turn, roleplay, say\_it\_see\_it, time\_slider, magnet\_tiles, vote\_see\_revote, story), stem, options, key, rubric\_id, media, difficulty\_b (nullable), discrimination\_a (nullable), exposure\_count, status. Activity-specific config lives in a config object validated against a per-type JSON schema.

**Scheduler algorithm (per learner, per item)**

1. Recall probability p = 2^(-(now - last\_seen) / half\_life). Due when p <= 0.8.
2. Default half-lives by state in days: new 0.1 (same session), learning 1, consolidating 3 then 7, known 14 then 30, mastered 60 then 120, retired at 180 with spot checks.
3. On a correct retrieval: half\_life = half\_life x 2.0 (x 2.4 if modality was productive, x 2.8 if speaking); advance state when the entry condition in the mastery ladder is met.
4. On an error: learning or consolidating, half\_life x 0.5, re-queue in session at least 2 atoms later; known, drop to consolidating with half\_life 3; two consecutive errors, flag reteach = true so the next session inserts the item's input atom.
5. Slow correct (response\_time above the learner's 80th percentile for that item type): half\_life x 0.8, no state change.
6. Once an item has 6 or more attempts, replace the multiplier rules with the half-life regression model (features: correct count, incorrect count, item difficulty\_b, learner strand ability, hours since last seen, last modality) trained nightly; keep the rules as fallback.
7. An item is Known only if correct in at least two modalities, one productive; store modality\_mask on MasteryState.

**Session composer**

1. Load due items (p <= 0.8), sort by p ascending. If count > 25, set new\_allowed = false.
2. Phase 1 plan and recall echo: show the 20-second "Today I will..." plan (prefilled from the week's can-do), then pick 6 to 8 due items prioritising last\_seen between 1 and 6 days ago, across at least 3 strands, no two consecutive from one strand or pattern.
3. Phase 2 new atom (if new\_allowed and no new atom today below B1): candidate criteria = those whose prerequisites are all at consolidating or better and not yet mastered. Score = 0.4 x readiness (fraction of prerequisites at known or better) + 0.3 x strand\_deficit (weekly quota minus minutes done, normalised) + 0.3 x (1 - |predicted\_success - 0.8|). Pick the highest; ties to the weaker strand. Variant = light if learner's rolling check accuracy < 0.7, dense if > 0.9, else standard.
4. Phase 3 use atom: a speaking or interaction activity whose config includes today's target items plus up to 3 due items eligible for free-use retrieval.
5. Phase 4 story shelf: one story atom (type story, 60 to 90 s, read or listen) whose known-word coverage for this learner is at least 98%, computed from MasteryState; no items attached. Phase 5 close: the delayed check items from phase 2, a one-tap "I can / not yet" reflection stored as a confidence rating, then the can-do line for the week. On the week's day 4, insert one vote\_see\_revote item after phase 3 (answer, show anonymised aggregate of peer answers at the same sub-level plus a model, answer again). On any return after 2 or more missed days, replace phases 2 and 3 with a 3 to 5 minute warm restart (review and one story) and grant a welcome-back story unlock.
6. Second session on the same day: phases 1 and 3 only, plus one fluency atom built from mastered items.
7. Week plan: on Monday (or first session of the week) pick the week's can-do outcome (lowest-mastery outcome in the current sub-level whose prerequisites are met); days 1 to 3 serve its criteria, day 4 interleaves, day 5 serves the teach-it-back or free-use performance.

**Mastery updater**

- Keyed criteria: mastered when 3 of 4 correct in each of two sittings on separate calendar days.
- AI-scored criteria: mastered when two attempts on different days are at or above the rubric threshold and the second task\_id differs from the first.
- Decay: mastered criteria sampled with one item every 21 to 28 days; two consecutive misses set state = shaky.
- Outcome achieved when all its criteria are mastered; sub-level provisional when 80% of its outcomes are achieved and no strand is under 60%; confirmed only by a LevelEvent with trigger checkpoint or full\_test.

**Scoring routing**

| Attempt type | Scorer | Latency budget | Used for |
| --- | --- | --- | --- |
| Shadow, read-aloud (practice) | Self-hosted ASR plus alignment (Whisper variant, DTW) | 2 s | Feedback only, never mastery |
| Open speaking, dialogue turn, relay, teach-back | AZE speech engine | 5 s, async with placeholder | Mastery decisions |
| Short production, correct message, explain chart | AZE writing engine | 3 s | Mastery decisions |
| Say it, see it | ASR plus slot parser (LLM function call with a fixed schema) plus AZE form score | 3 s | Intent locally, form via AZE |
| Explain it to Sami | LLM answers content questions from transcript only; AZE for form | 5 s | Mastery decisions |

All scoring responses store scorer\_version, ai\_confidence and raw sub\_scores; confidence below 0.6 returns "practise again" and does not write mastery evidence.

**API surface (REST, versioned under /v1)**

| Method and path | Purpose |
| --- | --- |
| POST /auth/start, POST /auth/verify | Phone, Apple or Google sign-in; deferred account creation allowed with a device token |
| GET /learner/me, PATCH /learner/me | Profile, L1, age band, daily goal, consent flags |
| POST /placement/start, POST /placement/answer, POST /placement/finish | Short adaptive placement via AZE; finish returns starting sub-levels per strand |
| GET /session/today | Composed session: ordered phases with atom and item payloads and signed media URLs |
| POST /attempts | Submit one attempt (text, choice, or audio upload reference); returns score or a pending token |
| GET /attempts/{id} | Poll async scoring result |
| GET /path | Road data: stops, mastery, fog opacity per stop, week can-do |
| GET /progress | Strand strengths, level estimate, weeks active, can-do lines |
| POST /checkpoint/start, POST /checkpoint/finish | AZE checkpoint; finish may emit a LevelEvent and regenerate the path |
| GET /classmates, POST /challenges, POST /challenges/{id}/answer | Presence and challenges (v1) |
| GET /report.pdf | Downloadable report |
| Admin: CRUD /content/atoms, /content/items, /content/outcomes, POST /content/atoms/{id}/publish, GET /content/atoms/{id}/stats | CMS and quality data |

Additional endpoints from the beyond-apps research: POST /supporter, DELETE /supporter and GET /supporter/preview (nominate or remove the weekly supporter and preview the automated sentence before it is sent, R34); POST /plan/weekly (store the Monday if-then plan, cue text and time, used to schedule the week's reminders); GET /stories/next (the next story atom at 98% known-word coverage).

**Screen specifications (phone, portrait)**

| Screen | Layout | Components | States |
| --- | --- | --- | --- |
| Home | Ring centred in top 45%; coach line beneath; Start button in the thumb zone; small study scene bottom-left; 7-day dot row bottom-right | Ring (3 slices, animated fill), CoachLine (one sentence, L1 below A2), PrimaryButton (glow), StudyScene (two characters, live count), DotRow | Fresh day, mid-session (ring partial, button says Continue), day complete (ring full, button hidden, city or road peek) |
| Road | Horizontal scroll; road path as SVG; weekly stops as circles; marker at current stop; fog layer with per-stop opacity | RoadCanvas, Stop (clear, fogged, next), Marker, LevelFlag | Loading, normal, checkpoint available (flag pulses) |
| Atom (capsule) | Full screen; top progress line; nav hidden; one phase per screen; exit icon top-left | VideoPlayer (captions, L1 toggle, speed), WordCards, ItemRenderer (one component per item\_type), SceneRenderer, SliderGrammar, MagnetTiles, ShadowDuet, Recorder | Per phase; paused; scoring pending (placeholder ribbon); feedback (consequence first, then correct form glows) |
| Speak | Model clip top; waveform centre; mic button bottom centre; three result bars beneath | Recorder (noise gate, auto re-record prompt), ResultBars (Sounds, Rhythm, Words, pass line), WordChips (tap to hear and retry) | Idle, recording, scoring, result, retry single word |
| Classmates | Avatars grid (up to 8 glowing), challenge button per avatar; map toggle (v2) | AvatarGrid, ChallengeCard, VoiceMap | No one online, online, incoming challenge |
| Progress | Seven horizontal strand bars; level estimate line; weeks-active strip; can-do line; download button | StrandBars, LevelLine, WeeksStrip, CanDoLine, DownloadButton | First week (no label), normal, checkpoint due |
| Me | Scrollable settings | LanguagePicker, TextSize, AudioSpeed, DailyGoal, Notifications, ReportSharing, TeenModeConsent | Normal, under-18 (consent and parent email) |

All screens except Me and Road must render without vertical scrolling at 375 x 812 points. Type scale 17, 22, 28; targets 48dp (56dp primary); contrast 4.5:1 on frosted panels; RTL mirrored for Arabic; reduce-motion replaces animations with static states.

**Analytics events (one row per event, learner\_id, session\_id, timestamp, device)**

session\_started, phase\_entered (phase\_kind, atom\_id), video\_progress (pct, replays, speed, captions\_on, l1\_subtitles\_on), hotspot\_tapped (scene\_id, hotspot\_id), item\_shown (item\_id, modality), item\_answered (item\_id, correct, response\_ms, hint\_used, attempt\_n, error\_type), speech\_attempt (item\_id, scorer, sub\_scores, confidence, duration\_ms, retried\_words), slider\_moved (positions), tile\_dropped (accepted, reason), scene\_rendered (intent\_match), feedback\_shown (kind), mastery\_changed (criterion\_id, from, to), item\_state\_changed (item\_id, from, to, half\_life\_before, half\_life\_after, predicted\_success, actual), session\_exited (phase\_kind), session\_completed (minutes), checkpoint\_completed (sublevel\_before, sublevel\_after), path\_regenerated (source), challenge\_sent, challenge\_completed, report\_downloaded, consent\_recorded (type), plan\_set (cue, time), reflection\_recorded (can, not\_yet), story\_completed (story\_id, mode, coverage), vote\_revote (item\_id, first, second, changed), welcome\_back\_shown (days\_missed), supporter\_sentence\_sent (week).

**Content quality jobs (nightly)**

Item facility = correct / shown over the last 30 days (flag outside 0.4 to 0.9); atom drop-off = exits during atom / atom starts (flag above 10%); scorer drift = mean AZE score minus mean human re-rating on the 5% sample (flag above 0.3 band); exposure cap = retire an item from new sittings after 2,000 exposures until reviewed.

**Non-functional requirements**

| Area | Requirement |
| --- | --- |
| Performance | Session payload under 300 KB excluding media; first atom playable within 2 s on 4G; scoring placeholder shown within 500 ms |
| Offline | Next three atoms and all word tutorials cached; attempts queued with idempotency keys; scheduler recomputes on sync |
| Privacy | Audio stored encrypted, retained 90 days unless consented for calibration; teen mode disables profiling-based nudges and ads; data residency selectable UAE or UK; DPIA before launch |
| Accessibility | WCAG 2.2 AA; screen-reader labels on every control; captions on all video |
| Reliability | 99.5% API availability; scoring queue retries with backoff; graceful "practise again" on scorer outage |
| Localisation | All UI strings in i18n files for en, ar, hi, ru, es, tr, zh; RTL layout tested |

**Build order for Claude Code**

1. Monorepo scaffold: apps/mobile (Expo), apps/admin (Next.js), services/api, services/engine, services/scoring, packages/schemas (JSON schemas for atom, item, activity configs, events), packages/ui (design tokens: colours, glass panels, glow, type scale)
2. PostgreSQL schema from the data model; seed with the A2.1 framework (outcomes, criteria, 20 atoms, 160 items) as fixtures
3. Engine: scheduler, session composer, mastery updater as pure functions with unit tests against the rules above; nightly job stubs
4. API: auth, learner, session/today, attempts, path, progress; contract tests from the schemas
5. Mobile: capsule atom player with ItemRenderer for the MVP item types, Recorder with noise gate, Home ring, Road with fog, Progress bars; i18n and RTL from the start
6. Scoring: adapter interface with two implementations (practice ASR, AZE API mock) and the confidence gate
7. Signature activities: say\_it\_see\_it (scene renderer plus slot parser), time\_slider and magnet\_tiles, shadow\_duet; each behind a feature flag
8. Admin console: atom editor from the JSON schema, QA gate checklist, publish, stats view
9. Analytics: event emitter in the app, ingestion endpoint, dbt models for facility, drop-off and drift
10. Placement and checkpoint integration with the AZE API; LevelEvent and path regeneration
11. Consent, teen mode, DPIA checklist, data residency configuration
12. Pilot build: TestFlight and closed Android for 150 ES World students, with the efficacy study instrumentation (cohort tag, pre and post test ids)

## Success metrics

North star: weekly learners gaining measurable sub-level progress (active 4+ sessions a week with a positive AZE checkpoint delta). Benchmarks are industry ranges for language apps, drawn from public Duolingo filings and mobile analytics reports, and are approximate. Measurement is by in-app analytics and AZE results; evaluation at 30, 90 and 180 days after public launch.

| Metric | Type | Benchmark | 30 days | 90 days | 180 days |
| --- | --- | --- | --- | --- | --- |
| Time to first lesson from install | Leading | 5 to 10 min median | under 8 min | under 6 min | under 5 min |
| Placement completion rate | Leading | not applicable | 60% | 70% | 75% |
| Day-1 retention | Leading | 25 to 35%, top quartile about 45% | 35% | 42% | 45% |
| Day-7 retention | Leading | 12 to 20% | 18% | 22% | 25% |
| Day-30 retention | Lagging | 5 to 10%, Duolingo est. 12 to 15% | 9% | 12% | 15% |
| Sessions per active user per week | Leading | 3 to 5 | 3.5 | 4.5 | 5 |
| Atom completion rate | Leading | 60 to 75% | 70% | 78% | 80% |
| Sessions with a completed spoken item | Leading | not applicable | 55% | 65% | 70% |
| Checkpoint pass rate, first attempt | Leading | not applicable | 55 to 65% calibration band | same | same |
| Sub-level progression per month, actives at 4+ sessions a week | Lagging | Classroom about 1 sub-level per 80 to 120 guided hours | measure only | 0.25 | 0.33 |
| Free-to-paid conversion of monthly actives | Lagging | 2 to 5%, Duolingo about 8 to 9% | 2% | 4% | 6% |
| Enrolled-student weekly active rate | Lagging | not applicable | 50% | 65% | 75% |
| Learners taking a paid AZE test or enquiring about ES World | Lagging | not applicable | measure only | 5% of day-90 actives | 8% |
| NPS | Lagging | Edtech 30 to 45 | 30 | 40 | 50 |
| Live atoms within quality band (facility 0.4 to 0.9, drop-off under 10%) | Leading | not applicable | 90% | 95% | 95% |
| Crash-free sessions | Leading | 99.5%+ | 99.3% | 99.6% | 99.8% |

Efficacy evidence plan, so the progress claim is defensible to institutions:

| Phase | Design | Output |
| --- | --- | --- |
| Internal validity (MVP) | AZE pre and post on 150 ES World students over 8 weeks: app-only, classroom-only and blended cohorts; AZE scored blind | Effect size per strand; proof the path moves scores |
| Equivalence (v1) | Map hours in app to sub-level gain against ES World's classroom norm | A defensible "X hours in Learning Path equals one ES World term" claim with a confidence interval |
| External validation (v1 to v2) | Correlate AZE gain with IELTS or Linguaskill on 100 learners; independent university review | Third-party credibility for B2B and B2G |
| Continuous | Item-level IRT on checkpoints, learning gain by atom type, A/B tests of spacing intervals | Ongoing efficacy and content pruning |

Controls: pre-register the study, exclude learners with under 10 sessions, report attrition, publish a white paper.

## Competitive position

Positioning: Learning Path is the only English app that measures you first, teaches every CEFR mode including speaking, interaction and mediation, and is backed by a real school. Place in 20 minutes with AZE, follow a path built for your exact sub-level, and prove your progress with a recognised score. Pricing figures are approximate estimates.

| Competitor | Core model | Strength | Weakness we exploit | Price (est.) |
| --- | --- | --- | --- | --- |
| Duolingo | Gamified freemium, streaks, leagues | Scale, habit engine, brand, free tier | Weak speaking and writing feedback, no credible placement, plateaus at B1, no human pathway | Free; Super US$7 to 13 a month |
| Babbel | Subscription courses, dialogue-based | Structured grammar, Babbel Live tutors | No adaptive placement, little production feedback | US$8 to 15 a month |
| Busuu | Freemium with community correction | CEFR-aligned, peer feedback, certificates | Peer feedback slow and variable; certificates lack assessment rigour | US$7 to 14 a month |
| Speak | AI speaking tutor | Strong speech practice, low anxiety | Speaking only; no reading, writing or mediation; no proof of level | About US$20 a month |
| ELSA Speak | AI pronunciation scoring | Phoneme-level feedback | Narrow; no pathway or CEFR outcome | US$12 a month |
| Praktika | AI avatar tutors, role-play | Engaging conversation | Unverified outcomes, no placement rigour | US$15 to 25 a month |
| Memrise, Cake | Video clips of real speech, vocabulary | Authentic input, short sessions | No skills integration, no assessment | Free to US$9 a month |
| Cambridge One, Oxford English Hub | Publisher LMS tied to coursebooks | Pedagogy, brand authority, exam alignment | Not mobile-first, institutional purchase, weak engagement | Bundled, B2B |

Defensible differentiators:

1. Integrated assessment loop: AZE placement generates the path, checkpoints re-score it, a final AZE test certifies the result; competitors bolt on quizzes, we own the psychometrics
2. Full CEFR coverage: no consumer app teaches or scores mediation or interaction as distinct modes, which matters to universities, employers and ministries
3. Human school behind it: Dubai and London campuses give blended options, teacher escalation and a route into Access to Education and Access to Work
4. Learning science as the product layer: spacing, retrieval, interleaving and production-first tasks tied to measured sub-level gain rather than XP
5. Built for the world's learners from day one: six-language L1 support at launch, L1-specific error profiling (starting with Arabic, Hindi, Spanish and Russian transfer patterns), international content settings, RTL, and a 16 to 70 design range that competitors built for 20-year-olds do not serve

Monetisation: freemium core with no ads, consumer subscription with regional pricing (indicatively US$10 a month or US$80 a year), everything included for ES World enrolled students from day one, an AZE certificate upsell at path end, and B2B and B2G seat licensing as the primary revenue line from v2 once the efficacy study is published. Consumer revenue funds content; institutional revenue builds the business.

## Open questions and risks

| # | Open question | Owner | Blocking? |
| --- | --- | --- | --- |
| Q1 | Does the AZE engine already expose a 15 to 20 minute adaptive checkpoint, or must it be built for this product? | AZE engineering (India) | Yes, shapes R8 and the MVP |
| Q2 | Can the AZE speech scorer return per-feature pronunciation and fluency sub-scores at the latency a lesson needs (under 3 seconds)? | AZE engineering, Academic Lead | Yes, shapes R6 |
| Q3 | Which six L1s launch? Proposed Arabic, Hindi, Russian, Spanish, Turkish, Chinese; Portuguese and French are the next candidates | ST with sales in Dubai and London | Yes, drives translation and content budget |
| Q4 | Which academic English outcomes (lecture listening, note-taking, academic writing, seminar interaction) are in the B1 to B2 framework, and does Access to Education need a dedicated track or tags on existing outcomes? | Academic Lead, ST | No, resolve during framework build |
| Q5 | How does the app share enrolment and class data with the ES LMS for the classroom bridge? | ES World IT, Ryan (backend) | No, P1 |
| Q6 | Store listing and legal entity: AZE or ES World, and data residency for UAE and UK learners? | CEO (AZE), Montse, legal | Yes, before DPIA |
| Q7 | Free tier boundary: content depth, checkpoints or both? | ST, CCO | No, before v1 paywall |
| Q8 | Human teacher recording budget: how many of the 25% human-presented videos are filmed in Dubai versus London? | Content lead, finance | No |
| Q9 | Will the independent efficacy review partner be a UAE or UK university? | AZE CEO, Academic Lead | No, v1 |

| # | Risk | Area | Mitigation |
| --- | --- | --- | --- |
| 1 | Engagement falls to category norms and the app becomes a quieter Duolingo | Product | Fixed 10-minute session with a natural end, pause day, catch-up atoms, classroom bridge for enrolled students |
| 2 | Learners do not improve or progress feels invisible | Learning | Checkpoints every 4 to 6 weeks, weekly can-do performance, pre-registered efficacy study |
| 3 | Content production cannot keep pace across seven strands and 13 sub-levels | Operations | Atom templates, AI drafting with human gates, launch Pre-A1 to B1 only, 25% human video cap |
| 4 | AI speaking and writing scoring drifts or is biased by L1 or accent | Technical, fairness | Score intelligibility against listener comprehension, L1-stratified calibration sets, monthly score-gap monitoring, 5% human re-rating |
| 5 | Transfer errors treated as random (Arabic article omission, p/b, copula drop; Spanish false friends; Hindi retroflex, article use) | Learning | Tagged transfer-error library per L1 routing to targeted enabler atoms |
| 6 | Mastery inflation from item exposure and guessing | Assessment | Separate-day rule, 12 to 16 items per criterion, exposure caps, AZE checkpoint as an external anchor |
| 7 | Minor data: UAE PDPL, UK GDPR and Age Appropriate Design Code for 16 to 17s | Regulatory | Age gate, consent flow, data minimisation, residency options, DPIA before launch |
| 8 | Cannibalising face-to-face enrolments | Commercial | Position as entry and continuation; enrolment bundle raises classroom value |
| 9 | High paid acquisition cost globally | Commercial | Lead with ES World students and agents, school referrals, organic content; paid channels only after D7 above 18% |
| 10 | LLM vendor cost and availability | Technical | Abstraction layer, cached scoring for common items, cost per session capped |
| 11 | Older and low-literacy learners drop out at onboarding | UX | Separate usability cohorts for 16 to 20 and 50+, L1 audio instructions, no timed items below B1 |

## Phasing and timeline

Three phases, each with a proof point that gates the next. Dates are indicative from a January 2027 start; no contractual deadlines exist yet.

| Phase | Duration | Scope | Gate to proceed |
| --- | --- | --- | --- |
| MVP: proves learning | 12 to 14 weeks (Jan to Apr 2027) | Short AZE placement, auto-generated path for A2 to B1 only, three strands (grammar, listening, speaking), 10-minute session with spacing engine, checkpoint at week 4 and 8, Arabic and English UI, 150 ES World students on TestFlight and closed Android | Positive AZE pre and post delta over 8 weeks; Day-7 retention above 18%; beginners finish first atom unaided in moderated tests |
| v1 public launch | +16 to 20 weeks (May to Sep 2027) | Pre-A1 to B1 across all seven strands (840 atoms), six L1s, full first-run, Progress and Road screens, AI scoring via AZE, CMS with QA gates, consent and age gate, subscription and enrolment bundle, certificate upsell, store launch worldwide with marketing focus on ES World markets first | 90-day metric targets; pre-registered RCT with an external test and blinded raters under way; content quality band held |
| v2 scale | +6 months (to Mar 2028) | B2 content, classmates and challenges, adaptive video variants, offline mode, responsive web, B2B and B2G admin and licensing, classroom bridge, external validation published | 180-day targets; first institutional contracts; white paper |
| v3 | 2028 onward | C1 to C2, exam tracks (IELTS, Access to Work, academic English), teacher view, additional target languages | Decided on v2 results |

&#91;embedded content: roadmap · 4 phases, 3 gates\]

Each gate is a measured result, not a date; a phase that misses its gate extends rather than the next phase starting.

Dependencies: AZE checkpoint and speech sub-score APIs (Q1, Q2) are on the MVP critical path; the launch L1 decision (Q3) gates translation; the legal entity and residency decision (Q6) gates the DPIA and store listing; the ES LMS integration (Q5) gates the classroom bridge only.

## Expert panel consulted and team to assemble

This PRD was built from five specialist perspectives, each briefed independently and then reconciled. The same five seats, held by people, are the minimum team to build the product well.

| Seat | Expertise brought to this PRD | Hire or partner profile |
| --- | --- | --- |
| Learning scientist | Spaced retrieval, interleaving, cognitive load, comprehensible input, mastery learning, half-life regression; wrote the 15 rules and the memory engine | PhD in SLA or cognitive psychology with applied edtech experience (Duolingo, Carnegie Learning, Cambridge research background) |
| CEFR and assessment architect | Companion Volume decomposition, item design, mastery reliability, IRT, fairness; wrote the framework, gates and data model | Language assessment specialist; AZE Academic Lead plus an external psychometrician |
| Learning experience and UX lead | Motivation science, accessibility for 16 to 70 and low literacy, consumer learning app patterns; wrote the principles, screens, first run and feedback design | Senior product designer from a top consumer learning or wellbeing app, with accessibility credentials |
| Head of learning content and video | Multimedia learning principles, ELT materials writing, AI-assisted production pipelines; wrote the video spec, item bank, volume and pipeline | ELT materials author with video production experience; team of two writers, one producer, one QA linguist |
| Edtech strategist and growth analyst | Market, positioning, metrics, efficacy study design, monetisation, risk; wrote the competitive position, metrics and roadmap | Consumer edtech PM or strategist with a published efficacy study on their record |

Also required for build: a backend lead for the engine and data model (Ryan's current work on the ES outcome model is the starting point), a mobile lead (iOS and Android), an ML engineer owning the scoring integration with the AZE engine, and a data analyst for the efficacy study.

Deep-search findings on the market and innovation opportunities: Market research
