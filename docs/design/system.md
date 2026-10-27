# The lens: glass and shine on the ink world

Design director, 27 October 2026. Companion to `brief.md` (the board's direction) and `research.md`
(the survey behind these choices). Reference screen: `system.html`, screenshots in `shots/system-*.png`.

**Why this is modern and still ours.** The 2020 glass was a frosted sheet: a white blur laid over
whatever was underneath. What reads as new in 2026 (Apple's Liquid Glass, Material 3 Expressive, the
Awwwards winners) is glass as a *lens*: an edge that bends light, a highlight that moves when you
move, colour pooling under it, a grain that makes the gradient feel printed, and springs under every
touch. Our system keeps the three things the board loved untouched, the flat colour-block card, the
ink-outline cast and the black pill, and puts the lens only on what sits on top of them: the coach's
bubble, the sheet, the tab bar, the chips. The aurora behind the glass is made of our own two palette
colours, so the shine is sun and lilac, not iOS blue. Characters are never glass, stickers are never
glass, text is always ink at 4.5:1. The result is Dribbble's bold cast under an iPhone's glass, and
the join is the specular streak that slides across the bubble when the learner tilts the phone.

## 1. Rules

1. **Glass is a layer, not a surface.** It goes on things that float above a card: speech bubbles,
   sheets, score panels, chips, the beat bar, the tab bar, toggles. The card itself is flat block
   colour. The page is cream or ink. Never glass on glass, never a glass card.
2. **Never on characters, never on stickers.** The cast is flat ink line and fill. A glass panel may
   pass over a character (the sheet rises over Maya) but no character is ever styled as glass.
3. **Glass on a card is light in both modes.** The card keeps its bright fill in dark mode, so a
   panel on a card keeps the light tint and ink text (`.glass.on-card`). Glass on the page follows
   the page: light tint on cream, ink tint on ink.
4. **Text on glass is ink (light) or cream (dark), never grey.** Minimum 4.5:1. Tested on sun,
   tangerine and sky: ink on the light lens is above 9:1 on all three.
5. **Keep 32 px between a glass edge and a heavy ink mass.** The blur samples about 50 px past the
   panel edge, so hair or a thick outline right under a bubble smears into it. Place the character
   so the bun is clear of the bubble (see `system.html`).
6. **Aurora is light, not a block.** Two palette colours, the screen's block colour plus one
   neighbour, at 55% on cream and 34% on ink, blurred 46 px, drifting 14 to 19 s. It lives on the
   page layer and inside the lens, never on the card. The one-block-colour rule still holds.
7. **Grain at 4% on the page only.** Never on cards, text or characters.
8. **Chromatic fringe only on large panels** (`.glass-xl`, the sheet and the score card). On a chip
   it is noise.
9. **Every entrance is a spring; every press is physical.** Press 0.97 in 80 ms, release on the
   spring curve in 350 ms, `navigator.vibrate(8)` where allowed. Siblings stagger 50 ms on entrance,
   60 ms for UI children. Nothing but idle loops exceeds 420 ms.
10. **Reduced motion:** entrances become 200 ms fades, aurora and streak stand still, no tilt, no
    idle loops. State changes still happen, only the easing goes.

## 2. Tokens

```css
:root{
  /* palette (brief) */
  --sun:#FFD93D; --lilac:#CDB8FF; --tangerine:#FF5A2D; --mint:#A8F0C6; --sky:#BFE3FF;
  --ink:#121212; --cream:#FFF7E8; --paper:#FFFFFF;
  /* page */
  --page:var(--cream); --on-page:var(--ink);
  /* aurora: the screen's block colour plus one neighbour, as light not as a block */
  --aurora-a:var(--sun); --aurora-b:var(--lilac); --aurora-alpha:.55;
  /* glass lens */
  --glass-tint:rgba(255,255,255,.42); --glass-tint-2:rgba(255,255,255,.18);
  --glass-edge:rgba(255,255,255,.72);
  --glass-rim:rgba(255,255,255,.95); --glass-rim-under:rgba(18,18,18,.10);
  --glass-blur:18px; --glass-sat:160%;
  --glass-shadow:0 18px 40px -22px rgba(18,18,18,.38);
  --caustic-a:rgba(255,217,61,.55); --caustic-b:rgba(205,184,255,.55);
  --fringe-warm:rgba(255,90,45,.38); --fringe-cool:rgba(191,227,255,.6);
  --on-glass:var(--ink);
  /* ink pill gloss */
  --pill-top:#2b2b2b; --pill-mid:#151515; --pill-bottom:#060606;
  --pill-sheen:rgba(255,255,255,.30); --pill-under:rgba(0,0,0,.5);
  /* shape */
  --r-card:28px; --r-glass:22px; --r-pill:999px;
  /* motion */
  --spring:cubic-bezier(.2,1.4,.4,1);   /* overshoot to ~1.03, settle */
  --ease:cubic-bezier(.2,.8,.3,1);      /* travel and fades */
  --t-press:80ms; --t-release:350ms; --t-enter:420ms; --t-sheet:420ms;
  --stagger:50ms; --stagger-ui:60ms;
  /* tilt, set by JS in -1..1 */
  --tx:0; --ty:0;
  /* grain */
  --grain:.04;
}
html[data-theme="dark"]{
  --page:#121212; --on-page:#FFF7E8;
  --aurora-alpha:.34;
  --glass-tint:rgba(18,18,18,.55); --glass-tint-2:rgba(18,18,18,.35);
  --glass-edge:rgba(255,255,255,.18); --glass-rim:rgba(255,255,255,.26); --glass-rim-under:rgba(0,0,0,.5);
  --glass-shadow:0 18px 40px -20px rgba(0,0,0,.8);
  --caustic-a:rgba(255,217,61,.32); --caustic-b:rgba(205,184,255,.32);
  --on-glass:var(--cream);
}
```

Per screen, set `--aurora-a` to the block colour and `--aurora-b` to its neighbour: sun + lilac
(Today, Talk with Maya), lilac + sky (Path, calm screens), tangerine + sun (speaking), mint + sky
(success), sky + lilac (listening). `--caustic-*` follow the same pair.

## 3. Recipes

### `.aurora` (page layer, behind every glass panel)

```css
.bg{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;
  transform:translate3d(calc(var(--tx) * -6px),calc(var(--ty) * -6px),0);  /* parallax layer 1 */
  transition:transform .5s var(--spring)}
.aurora{position:absolute;inset:-10%;opacity:var(--aurora-alpha)}
.aurora i{position:absolute;display:block;border-radius:50%;filter:blur(46px);will-change:transform}
.aurora .a1{width:300px;height:300px;left:-40px;top:140px;background:var(--aurora-a);
  animation:drift-a 16s ease-in-out infinite alternate}
.aurora .a2{width:320px;height:320px;right:-80px;top:420px;background:var(--aurora-b);
  animation:drift-b 19s ease-in-out infinite alternate}
.aurora .a3{width:200px;height:200px;left:120px;bottom:-40px;background:var(--aurora-a);opacity:.8;
  animation:drift-a 14s ease-in-out infinite alternate-reverse}
@keyframes drift-a{from{transform:translate3d(0,0,0) scale(1)}to{transform:translate3d(70px,60px,0) scale(1.18)}}
@keyframes drift-b{from{transform:translate3d(0,0,0) scale(1.1)}to{transform:translate3d(-90px,-70px,0) scale(.92)}}
```

Markup: `<div class="bg"><div class="aurora"><i class="a1"></i><i class="a2"></i><i class="a3"></i></div><div class="grain"></div></div>`.

### `.grain` (4%, page only)

```css
.grain{position:absolute;inset:0;pointer-events:none;opacity:var(--grain);mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  background-size:220px 220px}
html[data-theme="dark"] .grain{mix-blend-mode:screen;opacity:calc(var(--grain) * 1.6)}
```

### `.glass` (the lens)

Four parts: a saturated blur with a diagonal tint; a rim (light enters at the top and left, a shadow
sits under the bottom edge); an aurora *inside* the lens (`::before`) so colour drifts through it
even over a flat card; a specular streak (`::after`) whose position is driven by `--tx` so it slides
across when the phone tilts. The two coloured shadows are the caustic: colour pooling under the glass.

```css
.glass{
  position:relative;isolation:isolate;color:var(--on-glass);
  border-radius:var(--r-glass);
  border:1px solid var(--glass-edge);
  background:linear-gradient(135deg,var(--glass-tint),var(--glass-tint-2));
  -webkit-backdrop-filter:blur(var(--glass-blur)) saturate(var(--glass-sat));
  backdrop-filter:blur(var(--glass-blur)) saturate(var(--glass-sat));
  box-shadow:
    inset 0 1px 0 var(--glass-rim),           /* rim: light enters at the top */
    inset 1px 0 0 rgba(255,255,255,.35),       /* rim: left */
    inset 0 -1px 0 var(--glass-rim-under),     /* rim: shadow under the bottom edge */
    var(--glass-shadow),                       /* lift */
    0 26px 36px -22px var(--caustic-a),        /* caustic: colour pooling under the lens */
    0 34px 40px -26px var(--caustic-b);
  transition:background .3s var(--ease),border-color .3s var(--ease),box-shadow .3s var(--ease),
    transform var(--t-release) var(--spring);
}
/* aurora inside the lens */
.glass::before{
  content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;opacity:.38;
  background:
    radial-gradient(70% 90% at 15% 20%,var(--aurora-a),transparent 62%),
    radial-gradient(60% 80% at 90% 85%,var(--aurora-b),transparent 60%);
  animation:lens-drift 12s ease-in-out infinite alternate;
}
@keyframes lens-drift{from{transform:translate3d(-6%,-4%,0) scale(1.05)}to{transform:translate3d(6%,5%,0) scale(1.15)}}
/* specular streak, slides with tilt */
.glass::after{
  content:"";position:absolute;inset:-1px;z-index:-1;border-radius:inherit;pointer-events:none;
  background:linear-gradient(112deg,transparent 28%,rgba(255,255,255,0) 38%,rgba(255,255,255,.62) 47%,
    rgba(255,255,255,.18) 52%,rgba(255,255,255,0) 60%,transparent 72%);
  background-size:220% 100%;
  background-position:calc(50% + var(--tx) * 60%) 0;
  mix-blend-mode:soft-light;opacity:.95;
  transition:background-position .45s var(--spring);
}
html[data-theme="dark"] .glass::after{mix-blend-mode:screen;opacity:.5}
/* glass on a card keeps the light tint in both modes: the card is bright, so the lens is bright */
.glass.on-card{--glass-tint:rgba(255,255,255,.46);--glass-tint-2:rgba(255,255,255,.2);
  --glass-edge:rgba(255,255,255,.78);--glass-rim:rgba(255,255,255,.95);--glass-rim-under:rgba(18,18,18,.12);
  --on-glass:var(--ink);--glass-shadow:0 14px 30px -18px rgba(18,18,18,.45);
  --caustic-a:rgba(255,255,255,.4);--caustic-b:rgba(205,184,255,.5)}
/* large panel: chromatic fringe (warm top-left, cool bottom-right), softer streak */
.glass-xl{border-radius:var(--r-card);
  box-shadow:
    inset 0 1.5px 0 var(--glass-rim),inset 1px 0 0 rgba(255,255,255,.35),inset 0 -1px 0 var(--glass-rim-under),
    -1px -1px 0 0 var(--fringe-warm),1px 1px 0 0 var(--fringe-cool),
    0 -12px 40px -20px rgba(18,18,18,.25),var(--glass-shadow),
    0 26px 36px -22px var(--caustic-a),0 34px 40px -26px var(--caustic-b)}
.glass-xl::after{opacity:.55;background-size:260% 100%}
/* fallback: no backdrop-filter means a solid pane, still readable */
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){
  .glass{background:rgba(255,247,232,.96)}
  html[data-theme="dark"] .glass{background:rgba(18,18,18,.94)}
  .glass.on-card{background:rgba(255,255,255,.9)}
}
```

Speech bubble tail: a 16 px square rotated 45 degrees with the same backdrop filter and the
bottom-right border only (`.bubble .tail` in `system.html`).

Why no SVG `feDisplacementMap` refraction: it is Chromium-only through `backdrop-filter: url()`,
pixelates without supersampling, and fails in Safari and Firefox. The rim plus streak plus caustic
reads as a lens on every browser; the displacement can be added later as a progressive enhancement.

### `.ink-pill` (primary: convex, glossy)

```css
.ink-pill{
  position:relative;display:flex;align-items:center;justify-content:center;gap:10px;
  width:100%;height:56px;border:0;border-radius:var(--r-pill);color:#fff;cursor:pointer;padding:0 20px;
  font-weight:700;font-size:17px;line-height:1;
  background:
    radial-gradient(120% 90% at 50% -30%,var(--pill-sheen),rgba(255,255,255,0) 62%),   /* convex top */
    linear-gradient(180deg,var(--pill-top),var(--pill-mid) 55%,var(--pill-bottom));
  box-shadow:inset 0 1px 0 rgba(255,255,255,.28),inset 0 -3px 0 var(--pill-under),
    0 14px 26px -12px rgba(18,18,18,.65);
  transition:transform var(--t-release) var(--spring),box-shadow var(--t-release) var(--spring);
}
.ink-pill::before{ /* specular dot */
  content:"";position:absolute;left:22px;top:8px;width:22px;height:4px;border-radius:50%;
  background:rgba(255,255,255,.36);filter:blur(1.5px);pointer-events:none}
.ink-pill:active,.ink-pill.pressed{transform:scale(.97);transition-duration:var(--t-press);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.18),inset 0 -1px 0 var(--pill-under),0 6px 14px -10px rgba(18,18,18,.6)}
.ink-pill .go{font-size:21px;font-weight:800;transition:transform var(--t-release) var(--spring)}
.ink-pill:hover .go{transform:translateX(4px)}
```

The same gradient and inset pair make the active tab, the tick discs and the fill of the three
score bars (`.fill` in `system.html`), so every ink shape has the same convex light.

### `.glass-pill` (secondary: glass with ink text)

```css
.glass-pill{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  height:48px;padding:0 22px;border-radius:var(--r-pill);cursor:pointer;
  font-weight:700;font-size:15px;line-height:1;color:var(--on-glass);
  --glass-tint:rgba(255,255,255,.6);--glass-tint-2:rgba(255,255,255,.28);
}
html[data-theme="dark"] .glass-pill{--glass-tint:rgba(255,255,255,.14);--glass-tint-2:rgba(255,255,255,.06)}
.on-card .glass-pill{--glass-tint:rgba(255,255,255,.66);--glass-tint-2:rgba(255,255,255,.3);--on-glass:var(--ink)}
.glass-pill::before{animation:none}   /* a pill is too small for a drifting aurora */
.glass-pill:active,.glass-pill.pressed{transform:scale(.97);transition-duration:var(--t-press)}
```

Use `class="glass glass-pill"`. Secondary actions stay plain ink text where the brief says so; the
glass pill is for Replay, Skip, and the like inside a sheet.

### `.tilt` (three-layer parallax, 2 degrees)

```css
.stage{position:relative;transform-style:preserve-3d}       /* parent has perspective:1000px */
.tilt{position:absolute;inset:0;transform-style:preserve-3d;
  transform:rotateY(calc(var(--tx) * 2deg)) rotateX(calc(var(--ty) * -2deg));
  transition:transform .5s var(--spring)}                     /* layer 2: the card */
.layer-char{position:absolute;pointer-events:none;transform-origin:0 0;
  transform:translate3d(calc(var(--tx) * 6px),calc(var(--ty) * 4px),0);
  transition:transform .55s var(--spring)}                    /* layer 3: the character, +6 px */
.app.dragging .tilt,.app.dragging .bg,.app.dragging .layer-char,.app.dragging .glass::after{transition:none}
```

JS sets `--tx` and `--ty` in -1..1 from drag distance (a third of the screen is full tilt) or, on
desktop, from the pointer position; on release they spring back to 0. The aurora (`.bg`) moves
-6 px, the card rotates 2 degrees, the character moves +6 px, and the streak on every glass panel
slides 60% of its width. Device orientation can feed the same two variables.

### `.kinetic` (headlines only)

```css
.kinetic{white-space:nowrap}
.kinetic .k{display:inline-block;white-space:pre;will-change:transform;animation:kin .62s var(--spring) both;
  animation-delay:calc(var(--i) * 40ms + 120ms)}
@keyframes kin{from{opacity:0;transform:translateY(.55em) rotate(-7deg) scale(.86)}60%{opacity:1}to{opacity:1;transform:none}}
/* a headline inside a sheet waits for the sheet */
.kinetic.kin-open .k{animation:none;opacity:0}
.app.open .kinetic.kin-open .k{animation:kin .62s var(--spring) both;animation-delay:calc(var(--i) * 40ms + 160ms)}
```

JS splits the headline into one `span.k` per letter with `--i` (spaces do not count) and keeps the
full text in `aria-label`. A 2 to 4 word headline finishes inside 400 ms after the first letter.
Body text never moves.

### Entrances and haptic press

```css
.pop{animation:pop var(--t-enter) var(--spring) both;animation-delay:calc(var(--i, 0) * var(--stagger))}
@keyframes pop{from{opacity:0;transform:translateY(12px) scale(.92)}to{opacity:1;transform:translateY(0) scale(1)}}
```

Order on Today: kicker 0, card and theme toggle 1, bubble 2, character 3, pill 4, peek 5, tab bar 6.
Press: every button gets `.pressed` on `pointerdown` (scale .97 in 80 ms) and loses it on release
(spring back in 350 ms); `navigator.vibrate(8)` on press, 12 on a sheet opening, inside try/catch.

### `.sheet` (rises over the card)

```css
.sheet{
  position:absolute;left:0;right:0;bottom:0;z-index:6;height:372px;padding:12px 22px 20px;
  display:flex;flex-direction:column;
  transform:translate3d(0,calc(100% + 30px),0);
  transition:transform var(--t-sheet) var(--spring),background .3s var(--ease);
  visibility:hidden;
}
.app.open .sheet{transform:translate3d(0,0,0);visibility:visible}
.sheet.drag{transition:none;visibility:visible}
.handle{width:44px;height:5px;border-radius:3px;background:currentColor;opacity:.32;margin:0 auto 14px}
/* the Today layer steps aside: the coach moves up and gets happy, the bubble, stickers and pill fade */
.app.open .layer-char{animation:none;transform:translate3d(calc(var(--tx) * 6px + 95px),calc(var(--ty) * 4px - 188px),0) scale(.66)}
.app.open .bubble,.app.open .sticker,.app.open .card .ink-pill{animation:none;opacity:0;transform:scale(.8)}
.app.open h1{opacity:0}
/* children pop in with a 60 ms stagger once the sheet is up */
.app.open .sheet .s{animation:pop .42s var(--spring) both;animation-delay:calc(160ms + var(--i) * var(--stagger-ui))}
.app.open .fill{transform:scaleX(1)}   /* bars fill after the lines, 140/200/260 ms */
```

Use `class="sheet glass glass-xl on-card"`: it is a large panel on a card, so it gets the fringe
and stays light in dark mode. Swipe up anywhere on the card or on the peek pill opens it; swipe
down, Close, Replay or Escape closes it. A drag past 30% of the sheet height, or a flick, commits.
Note the `animation:none` on anything that had an entrance animation: a `both` fill otherwise holds
the old opacity and the fade never happens.

### Reduced motion

```css
@media (prefers-reduced-motion:reduce){
  .aurora i,.glass::before,.breathe,.twinkle{animation:none !important}
  .pop,.kinetic .k,.app.open .sheet .s,.app.open .kinetic.kin-open .k{animation:fade .2s linear both !important;animation-delay:0s !important}
  @keyframes fade{from{opacity:0}to{opacity:1}}
  .tilt,.bg,.layer-char,.glass::after,.sheet,.fill,.ink-pill,.glass,.tab,.round{transition-duration:.15s !important;transition-timing-function:linear !important}
  .tilt,.bg,.layer-char{transform:none !important}
  .app.open .layer-char{transform:translate3d(95px,-188px,0) scale(.66) !important}
  .app.open .bubble,.app.open .sticker,.app.open .card .ink-pill,.app.open .peek{animation:none !important;opacity:0 !important}
}
```

JS also reads the media query and skips tilt and sheet drag-follow when it matches.

## 4. Motion table

| Moment | Curve | Duration | Notes |
| --- | --- | --- | --- |
| Entrance (card, bubble, character, pill, bars) | `--spring` | 420 ms | from 0.92 and 12 px below, 50 ms stagger |
| Kinetic letter | `--spring` | 620 ms per letter, 40 ms apart | from .55 em below, -7 degrees, 0.86 |
| Press | linear | 80 ms | scale .97, shadow flattens |
| Release | `--spring` | 350 ms | back to 1, slight overshoot |
| Sheet open and close | `--spring` | 420 ms | children stagger 60 ms after 160 ms |
| Bars fill | `--spring` | 550 ms | delays 140, 200, 260 ms |
| Tilt follow | none while dragging; `--spring` 500 ms on release | | 2 degrees, 6 px parallax |
| Specular streak | `--spring` | 450 ms | follows `--tx` |
| Aurora drift | ease-in-out, alternate | 14 to 19 s | off under reduced motion |
| Lens aurora | ease-in-out, alternate | 12 s | inside `.glass::before` |
| Breathe | ease-in-out | 2.8 s | character idle |
| Twinkle | `--ease` | 4 s | stickers |
| Theme switch | `--ease` | 300 ms | colours only |

## 5. Where glass goes and where it does not

| Element | Glass? | Class |
| --- | --- | --- |
| Page background | no, aurora plus grain | `.bg` `.aurora` `.grain` |
| Card (Today, lesson, session end) | no, flat block colour, 3 px ink border | `.card` |
| Characters, Blobert, doodles | never | `.layer-char` |
| Stickers | never, flat ink | `.sticker` |
| Coach speech bubble, "You said" panel | yes, on card | `.glass.on-card` |
| Session-end sheet, score card, stop sheet on the Path | yes, large, on card | `.glass.glass-xl.on-card` |
| Instruction chips, beat bar, toggles | yes | `.glass` |
| Bottom tab bar, peek pill, theme toggle | yes, follows page theme | `.glass` |
| Primary button | no, glossy ink | `.ink-pill` |
| Secondary action | plain ink text, or glass pill inside a sheet | `.plain` / `.glass.glass-pill` |
| Progress bars | glass track, glossy ink fill | `.track` `.fill` |
| Path ribbons and road | no, flat; stop labels are glass | |
| Explainer video frames | no glass at all, flat vector | |

## 6. Accessibility checks on the reference screen

- Measured from the screenshots (average backdrop under the text): ink on the coach bubble over sun
  14.7:1, ink on the sheet 12.3:1, ink on the light tab bar 15.7:1, cream on the dark tab bar 11.9:1,
  cream kicker on the dark page with aurora 9.2:1, white on the ink pill 11.2:1. All above 4.5:1.
- All tap targets 44 px or more (theme toggle 44, peek 46, tabs 52, pill 56, Close has `min-height:44px`).
- Verified with Playwright: swipe up opens the sheet, swipe down closes, tap on the peek opens,
  Escape closes, Enter on the peek opens and moves focus to Close for keyboard users, tab order
  reaches every control, zero console errors in light, dark, sheet and reduced-motion states.
- Focus ring 3 px in the page colour, offset 3 px; focus moves into the sheet only for keyboard users.
- Headlines keep their text in `aria-label`; letters are `aria-hidden`.
- `prefers-reduced-motion` verified in `shots/system-reduced-sheet.png`: no console errors, same states.
- No scroll at 390 x 844; `scrollHeight` 844 in both modes and both states.
