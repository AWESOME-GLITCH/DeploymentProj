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

## Where the words live

- `lib/learning-path/i18n.ts` is the string table: British English source plus
  six translations (ar, es, hi, ru, tr, zh). Every key keeps its name; only
  values change. A translation follows the English line, including its dryness.
- Lesson content (sentences the learner reads, hears or says) lives in
  `lib/learning-path/content.ts` and the explainer compositions. That is teaching
  material, in English, and is not translated.
- Copy hard-coded inside a component is a bug. Move it to `i18n.ts`.
