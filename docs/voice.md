# Voice

## Who is speaking

One tutor. The same person every time: the woman in the explainer videos and in
the speaking practice (Maya in the explainer kit). She is British, warm,
specific and a little dry. She has taught adults for years, so she knows what
the learner is about to do before they do it, and she says that thing and
nothing else.

She is not a brand, a mascot, a coach app or a cheerleader. She never raises her
voice and never celebrates. When something goes well she says what went well.
When it does not, she names the word and asks again.

Learners read her at A1 with a dictionary in their head. Short sentences, common
words, one idea per line.

## The five rules

1. **Name the next thing, and its size.** "Today: order a coffee. Five minutes."
   Never a promise, a metaphor or a mood. If the learner cannot tell what the
   button will do, the line has failed.
2. **Describe, do not mark.** Feedback says what happened: which word was
   missing, which sentence was heard, what comes back later. No scores in words,
   no praise adjectives, no "correct" and "incorrect".
3. **One idea, under ten words.** Two short sentences beat one long one. A
   heading is a headline, not a paragraph.
4. **Plain and concrete.** Home, Lesson, Practice, How I'm doing. Say "road",
   "stop", "ten minutes", "a word you know". Never "module", "unit", "ring",
   "streak", "XP", "content".
5. **Say it as a person, not as an app.** If the line could sit unchanged in any
   other app, it is wrong. British English, no exclamation marks, no em dashes.

**Never write:** "Your journey starts here", "Your path starts here", "Let's
go", "Awesome", "Great job", "Well done", "Level up", "Unlock", "Keep going",
"You've got this", "Can you do it?", "Today I will...", "Welcome back!", or any
sentence that would fit a fitness app.

## Ten before and after, from this app

| Where | Before | After |
| --- | --- | --- |
| Placement landing | Your path starts here | This is your road. You are at the lit stop. |
| First lesson title | Your first lesson | First lesson. Ten minutes. |
| Lesson plan eyebrow | Today I will... | By the end of today |
| Reflection question | Can you do it? | Is this true for you? |
| Button after a miss | Keep going | Move on |
| Home, part way through | Pick up where you left off. | You stopped halfway. Carry on from there. |
| Home, day finished | Done for today. Rest is part of learning. | That is today done. Tomorrow, something new. |
| Placement intro | Let us find your start / A few quick questions. No timer. | Where should we start? / A few short questions. No timer, no mark. |
| Speech not heard | Practise again. The audio was not clear. | I did not hear that. Try once more. |
| Wrong answer | Here is the right one. | This is the one. |

Two more worth keeping as they are, because they already sound like her: "Yes."
after a right answer, and "Day 1. See you tomorrow." at the end of the first
session. Short, flat, true.

## The spoken turn (ruling for LP-80, LEA-48)

These are the only words a learner hears after speaking, so they are settled
here and nowhere else. Keys are in `i18n.ts`; the line or word she then says is
teaching material and stays in English.

| Name | Key | Ruled string |
| --- | --- | --- |
| Clear | `coach_clear` | Clear. That is how you say it. |
| Nearly | `coach_nearly` | Nearly. Listen once more. |
| Hard word | `coach_hard_word` | This word. |
| Tries spent | `coach_tries_spent` | That one is hard. |
| Close screen | `close_returns` | This comes back tomorrow, and again until you know it. |

Why these and not the proposed four:

- **"ask it" becomes "say it".** The Clear line fires whenever the scene has no
  reply of its own, which includes turns that are not asks at all: describing
  yourself, reporting a notice, explaining a bill. "That is how you ask it"
  would be plainly wrong after "I'm Fatima. I live in Dubai." "Say" is true of
  every spoken turn. On the length question: seven words is fine *here*, and
  only here, because nothing follows the Clear. The short-lead-in rule protects
  audio the learner must then attend to, and Clear introduces nothing.
- **"Good try." goes.** It is praise for effort, which the same ticket rightly
  forbids, and it is the single most reused phrase in learning apps. "That one
  is hard." puts the difficulty in the item rather than in the learner, which is
  what actually removes the fail state. Three words, and the sentence staying on
  screen carries the choice to reopen, so the line does not have to.
- **No fixed four days.** The engine schedules on a half-life, not a calendar
  (`engine.ts`, `dueAt`). A freshly taught item is due in about a day, then
  about a day again; the four-day gap only arrives once the item is Known. "and
  again until you know it" is true at every state and still names the return.
- Nearly and Hard word are accepted as proposed. Two words and two words, and
  both name the thing that is about to happen.

Also removed, not in the original list: `"Every word. Well done."` at
`Coach.tsx:176`. It says "well done", and it is a second Clear path that
contradicts the one above. Both branches fall to `coach_clear`.

## Where the words live

- `lib/learning-path/i18n.ts` is the string table: British English source plus
  six translations (ar, es, hi, ru, tr, zh). Every key keeps its name; only
  values change. A translation follows the English line, including its dryness.
- Lesson content (sentences the learner reads, hears or says) lives in
  `lib/learning-path/content.ts` and the explainer compositions. That is teaching
  material, in English, and is not translated.
- Copy hard-coded inside a component is a bug. Move it to `i18n.ts`.
