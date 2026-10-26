---
name: learning-path-design-rules
description: ST's non-negotiable design and product rules for the Learning Path app. Read before any design, build or QA work on the app.
metadata:
  paperclip:
    tags:
      - design
      - learning-path
---

# Learning Path design rules

These rules come from the board (ST). They are not suggestions. QA fails any work that breaks them.

## Audience

- Learners from all over the world, 16 to 70, absolute beginner to high level, many with very little English.
- Every screen must be understandable in five seconds without reading much. Show, don't tell.
- Plain words: Home, Lesson, Practice, How I'm doing. Never "module", "ring", "unit" in learner-facing copy.

## Layout

1. One desktop screen per page, no main-page scrolling. Mobile may scroll inside a lesson only.
2. Mobile-first (390px), then desktop (1440px).
3. Generous spacing, few elements per page. If in doubt, remove it.
4. Every page has at least one visual aid: progress bar, ring, simple bar or line, road marker. Never a page of text boxes.
5. Clear hierarchy: one headline, one primary action per screen.

## Visual style (AZE design system)

- Dark base (`#08090c`), glass surfaces with intentional opacity, violet / blue / cyan / emerald accents, Outfit typeface.
- Subtle glow on icons and the primary button only. Thin trails and opacity variation, never thick neon.
- Modern and futuristic but calm. Benchmarks: Founderz learning portal, Linear, Stripe.
- Simple bars and lines for data. **No radar or spider charts.**

## Product rules

- Placement is scores-only; the path shows CEFR levels.
- The path is built by the system from placement and completed sessions. It is the learner's own; teacher homework is a separate thing and not in this app.
- No messaging, no human tutoring inside the app. Showing other learners online and a simple challenge is fine.
- Repetition and spacing are part of the path, not a separate mode the learner must find.
- Reports must be modern, eye-catching and downloadable.

## Rejected, do not reintroduce

- Light themes, orange palette
- Cartoon mascots (e.g. "Orbi")
- Duolingo-style bold blocks and cartoon gamification
- Circles or flat 2D rectangles as path nodes; timeline-style paths with no depth
- Bento grids of many small boxes; "boxes on boxes"
- Top navigation in place of a left sidebar on desktop
- Radar charts
- Dense lesson pages that feel disorganised

## Home concept the board liked

A drawn road to the next CEFR level with weekly stops and a marker for today; a "today's 10 minutes" ring with three slices; one line from the coach. One primary button. Nothing else. An isometric 3D hex-node path is the other approved direction for the path view; keep nodes small, three visible faces, thin transparent trail, wide zigzag.

## British English

All copy, comments and documentation in British English, concise, no em dashes.
