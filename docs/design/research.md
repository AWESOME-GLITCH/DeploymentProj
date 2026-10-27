# Modern UI research: what reads as new in late 2026, and what fits our ink world

Design director, 27 October 2026. Brief: ST wants "the glassiness and shininess, super modern but in
a newish style", on top of the approved look (bold colour-block cards, ink-outline cast, black pill
buttons, springy motion). This is the survey behind `system.md`. Each technique gets four lines:
what it is, why it reads as modern, whether it fits our cast, and a verdict.

Sources are listed at the end and cited inline by number. Several primary pages (Apple HIG, Google's
research write-up, LogRocket, CSS-Tricks) were only reachable through search summaries from this
container, so where a number is vendor-reported it is marked as such.

## 1. Apple Liquid Glass (iOS 26) and its web reinterpretations

**What.** A material for the control and navigation layer that behaves like real glass: it lenses and
refracts what is behind it, carries a specular highlight that moves with device motion, and has a
faint chromatic fringe at the edge. Apple's own rule is that it is a functional layer for controls
floating above content, and it must not be used in the content layer or stacked glass on glass [1][2].
**Why modern.** It replaced the 2020 "frosted panel" (flat blur plus white tint) with optics: an edge
that bends light and a highlight that responds to the user. The movement is the tell.
**Web state of the art.** `backdrop-filter` cannot displace pixels, so true refraction needs SVG
`feDisplacementMap`, which is Chromium-only in practice and pixelates without supersampling [3][4].
The web consensus is: blur plus saturate, a single inset top-edge highlight ("that one line makes it
read as glass rather than tinted film"), offset edge shadows for the rim, and restraint [3][5]. The
most cited criticism is text contrast; W3C discussion points at `prefers-contrast: more` [5].
**Fit.** Strong, if we obey Apple's own rule: glass only on things that sit on top of a card (bubble,
sheet, tab bar, chips), never as the card and never on a character. The cast is flat ink; the glass is
the lens the learner looks through.
**Verdict: adapt.** Lens, not sheet. Blur 18 px, saturate 160%, rim highlight, a specular streak
driven by tilt, chromatic fringe only on large panels, no SVG displacement in production.

## 2. Material 3 Expressive (Google, 2025)

**What.** Spring physics replaces cubic-bezier for anything that reacts, shapes morph, type is big
and bold, surfaces blur and react to gestures (the swipe-to-dismiss where neighbours react) [6][7].
**Why modern.** Google's own research (46 studies, 18,000+ participants, vendor-reported) says
expressive designs were preferred by all ages, up to 87% among 18 to 24, and key elements were found
up to four times faster in eye tracking [8].
**Fit.** Our brief already asks for springs, 2 to 4 word headlines in 800 weight and one big shape
per screen. Expressive is the research backing for what the board liked on Dribbble.
**Verdict: adopt** the motion model (springs with follow-through, neighbours react) and the bold
type scale. Reject the morphing icon shapes; our icons are ink line, not blobs.

## 3. Aurora and mesh gradients

**What.** Two to four blurred colour blobs drifting behind content [9][10].
**Why modern.** It is the current shorthand for "premium software" (Stripe, Apple, every AI product),
and it gives glass something to refract; glass over a flat colour is just tint.
**Fit.** Risky: the brief says one block colour per screen and flat fills. The fix is to keep the
aurora on the page layer and inside the lens, never on the card, and build it from the screen's own
block colour plus one neighbour at low alpha, so it reads as light, not as a second block.
**Verdict: adapt.** Page-level aurora of two palette colours at 35 to 55% alpha, slow drift (14 to
18 s), visible mainly through glass. Off under reduced motion.

## 4. Grain and noise

**What.** An SVG `feTurbulence` layer at low opacity over gradients, 2 to 5% [11][12].
**Why modern.** It kills banding and makes a gradient feel printed rather than rendered; it is the
one ingredient that keeps aurora from looking like a 2021 SaaS hero.
**Fit.** Perfect for an ink-and-paper world: our cards already look screen-printed.
**Verdict: adopt** at 4% on the page background only. Never on cards, text or characters (it would
fight the clean ink line).

## 5. Chromatic and refractive edges

**What.** A warm fringe on one edge and a cool fringe on the opposite edge, the dispersion a real
lens shows; Apple uses it on Camera Control and Siri [13].
**Why modern.** It is the detail that says "this is a lens" rather than "this is a blur".
**Fit.** Only at a size where the eye can read it; on a chip it is noise and hurts legibility [13].
**Verdict: adapt.** Tangerine top-left, sky bottom-right, 1 px, 20 to 30% alpha, large panels only.

## 6. Soft 3D "claymorphism"

**What.** Inflated pastel shapes with two inset shadows and a pastel drop shadow [14].
**Why modern.** Friendly volume without photoreal skeuomorphism; common in onboarding.
**Fit.** It fights the hand-drawn line: an inflated card next to a 3 px ink outline looks like two
different apps. It also reads as 2022 already.
**Verdict: reject** for surfaces. Keep one idea from it: convex gloss on pills (a top highlight and
a darker underside), which gives the "shininess" ST asked for without inflating anything.

## 7. Neo-brutalist ink lines with glass

**What.** Thick black outlines, hard offset shadows, cream and pastel blocks; now used as an accent
inside otherwise soft layouts rather than full-page [15][16].
**Why modern.** The 2026 reaction against over-polished bento sites; "anti-grid brutalism" is named
as the emerging counter-move [16].
**Fit.** It is us. The cast is ink line, the cards are blocks, the buttons are black pills.
**Verdict: adopt** as the base, with one change: the hard offset shadow is withdrawn in favour of
the glass rim and caustic glow, so the two languages do not compete.

## 8. Kinetic typography

**What.** Letters that move: springing in, shifting weight, responding to scroll or gesture [17][18].
**Why modern.** Awwwards winners lean on it; it makes a headline feel alive without adding an element.
**Fit.** Our headlines are 2 to 4 words, so per-letter springs stay under 400 ms total.
**Verdict: adopt** for headlines only: letters rise and settle with a 40 ms stagger. Body text never
moves.

## 9. Bento grids and card stacks

**What.** 6 to 9 tiles of mixed size, or a fanned stack of cards [15][16].
**Why modern.** Default layout for feature sections since 2024.
**Fit.** Already rejected by the board ("no bento grids"); one headline, one card per screen.
**Verdict: reject** bento. **Adapt** the stack as a single sheet rising over the card, which is how
our "You can now" summary arrives.

## 10. Pill tab bars

**What.** A floating capsule tab bar that shrinks on scroll; iOS 26 made it the system default and
Safari's compact layout is the clearest example [19][20].
**Why modern.** It floats over content rather than cutting the screen off; it is the one place Apple
puts glass everywhere.
**Fit.** The brief already has a three-tab bar (Today, Path, Me) and the Dribbble reference has pills.
**Verdict: adopt.** A glass capsule bar with an ink pill for the active tab.

## 11. Spatial depth and parallax

**What.** Layers that move at different speeds under pointer, drag or scroll; light 3D rather than
WebGL [17][18].
**Why modern.** 2026 write-ups call lightweight parallax mainstream and note WebGL underdelivered on
performance [16].
**Fit.** The brief asks for a 2 degree tilt with the character moving against the background.
**Verdict: adopt.** Three layers (aurora, card, character), transform-only, 2 degrees, no WebGL.

## 12. Haptic-feeling micro-interactions

**What.** Press scales the control down, release springs back; Meta's and Apple's haptic libraries
model it on the rebound of a mechanical spring switch; most sources put the whole thing under 200
to 300 ms [21].
**Why modern.** Expressive's "neighbours react" and iOS 26 controls both make every tap feel physical.
**Fit.** Our motion spec already has `pop` and `snap` springs.
**Verdict: adopt.** Press 0.97 in 80 ms, release on the spring curve in 350 ms, siblings stagger
60 ms, `navigator.vibrate(8)` where the platform allows.

## 13. What the best learning apps do

- **Duolingo.** Characters are the feedback: a wing flap on a good answer, a slow clap from Lily,
  "gentle animations and encouraging feedback, not red error screens" [22][23]. Characters are
  rigged in Rive with 64+ idle variations so loops never repeat [24]. Streak milestones were redrawn
  as "power-ups" after research found the flame metaphor did not translate across cultures [25].
  Takeaway: our cast reacting (happy, oops, Blobert) is the right model; our "no flame" rule has
  research behind it.
- **Speak.** Winter 2025 redesign rebuilt the home screen so "you can see exactly where you are,
  what's next, and how far you've come", plus a single fluency number [26]. Takeaway: Today plus the
  next stop, nothing else.
- **Elsa.** Colour-coded phoneme feedback is the selling point, but reviewers say the granularity is
  for serious learners and that natural variation gets marked down [27]. Takeaway: three ink bars
  (Sounds, Rhythm, Words), never a percentage, never red.
- **Busuu.** The Learn tab was rebuilt around a single "Next up" button and clearer per-lesson
  progress [28]. Takeaway: one pill.
- **Headway.** Brainy, a single mascot drawn in one line style, appears in achievements and seasonal
  variants; daily insights use motion and dark mode [29]. Takeaway: one cast, one line, dark mode
  from day one.

## Verdict table

| Technique | Verdict | How it lands in our system |
| --- | --- | --- |
| Liquid Glass | Adapt | `.glass`: lens with rim, specular streak on tilt, caustic glow; controls only |
| Material 3 Expressive | Adopt | Springs with follow-through, bold type; no morphing icons |
| Aurora / mesh gradient | Adapt | `.aurora`: two palette colours, page layer and inside the lens only |
| Grain / noise | Adopt | `.grain`: 4% on the page background only |
| Chromatic / refractive edge | Adapt | 1 px warm/cool fringe on `.glass-xl` only |
| Claymorphism | Reject | Keep only the convex gloss on pills |
| Neo-brutalist ink with glass | Adopt | Base language; hard offset shadow withdrawn |
| Kinetic typography | Adopt | `.kinetic` on headlines only |
| Bento / card stacks | Reject / adapt | One sheet (`.sheet`) rising over the card |
| Pill tab bar | Adopt | Glass capsule, ink pill for the active tab |
| Spatial depth / parallax | Adopt | `.tilt`: three layers, 2 degrees |
| Haptic micro-interactions | Adopt | Press .97, spring release, 60 ms stagger |

## Sources

1. Apple Developer, Human Interface Guidelines, Materials: https://developer.apple.com/design/human-interface-guidelines/materials
2. Apple Developer Forums, WWDC25 Design group lab summary: https://developer.apple.com/forums/thread/791070
3. LogRocket, How to create liquid glass effects with CSS and SVG: https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/
4. 80.lv, Accurate Apple Liquid Glass recreated with CSS and SVG: https://80.lv/articles/accurate-apple-s-liquid-glass-effect-recreated-with-css-svg
5. Frontend Masters, Liquid Glass on the Web, and the W3C CSS list thread on contrast: https://frontendmasters.com/blog/liquid-glass-on-the-web/ and https://lists.w3.org/Archives/Public/public-css-archive/2025Jun/0336.html
6. Android Authority, Material 3 Expressive features and changes: https://www.androidauthority.com/google-material-3-expressive-features-changes-availability-devices-3556392
7. Android Developers, Wear OS expressive design guides: https://developer.android.com/design/ui/wear/guides/get-started
8. Google Design, Expressive design: Google's research: https://design.google/library/expressive-material-design-google-research
9. daisyUI trends, Mesh gradient and aurora UI: https://trends.daisyui.com/trend/mesh-gradient-aurora-ui/
10. Kittl, The resurgence of gradient design: https://www.kittl.com/article/gradient-graphic-design-trend
11. CSS-Tricks, Grainy gradients: https://css-tricks.com/grainy-gradients/
12. Frontend Masters, Grainy gradients: https://frontendmasters.com/blog/grainy-gradients/
13. STRV, Liquid Glass and the future of design: https://www.strv.com/blog/liquid-glass-and-the-future-of-design
14. LogRocket, What is claymorphism: https://blog.logrocket.com/ux-design/what-is-claymorphism-web-design/
15. The Plus Addons, Web design trends 2026: https://theplusaddons.com/blog/web-design-trends-2026/
16. StudioMeyer, Web design trends 2026 reality check: https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check
17. Bellaworks, Website design trends 2026: https://bellaworksweb.com/website-design-trends-2026/
18. StudioMeyer, Kinetic typography: https://studiomeyer.io/en/blog/kinetische-typografie
19. Create with Swift, Making the tab bar collapse while scrolling: https://www.createwithswift.com/making-the-tab-bar-collapse-while-scrolling/
20. 9to5Mac, iOS 26 Safari compact design: https://9to5mac.com/2025/06/12/iphone-ios-26-safari-new-compact-design/
21. Meta, Haptics system design: https://developers.meta.com/horizon/design/haptics-system/
22. 60fps Design, Fun in every frame: https://60fpsdesign.substack.com/p/fun-in-every-frame
23. Blake Crosley, Duolingo design study: https://blakecrosley.com/guides/design/duolingo
24. Rive, Duolingo's AI video call brings Lily to life, and Duolingo blog on world character visemes: https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life and https://blog.duolingo.com/world-character-visemes
25. Duolingo blog, Streak milestone design and animation: https://blog.duolingo.com/streak-milestone-design-animation
26. Speak, Winter 2025 release: https://www.speak.com/blog/winter-2025
27. Screensdesign, ELSA Speak showcase, and Langua's review: https://screensdesign.com/showcase/elsa-speak-english-learning
28. Busuu blog, the Learn tab redesign: https://blog.busuu.com/
29. Headway on Dribbble: https://dribbble.com/headway_design
30. web.dev, Create OS-style backgrounds with backdrop-filter (support and @supports fallback): https://web.dev/articles/backdrop-filter
