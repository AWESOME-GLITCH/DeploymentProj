// Interaction and fit checks for the At the cafe explainer prototype.
import { chromium } from "/opt/node-tools/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
});
const fails = [];
const ok = (name, cond, extra) => {
  console.log((cond ? "PASS  " : "FAIL  ") + name + (extra ? "  " + extra : ""));
  if (!cond) fails.push(name);
};

for (const vp of [{ width: 390, height: 844 }, { width: 375, height: 667 }, { width: 1440, height: 900 }]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: true });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => { fails.push("pageerror: " + e.message); console.log("PAGE ERROR", e.message); });
  await page.goto("file://" + process.cwd() + "/docs/prototypes/02-explainer.html");
  await page.waitForTimeout(900);

  const fit = await page.evaluate(() => ({
    sh: document.documentElement.scrollHeight,
    ch: document.documentElement.clientHeight,
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  ok(`no scroll at ${vp.width}x${vp.height}`, fit.sh <= fit.ch && fit.sw <= fit.cw, JSON.stringify(fit));

  // tap targets
  const small = await page.evaluate(() =>
    [...document.querySelectorAll("button,input")]
      .filter((e) => e.offsetParent !== null)
      .map((e) => ({ id: e.id || e.className, r: e.getBoundingClientRect() }))
      .filter((x) => x.r.height < 43.5 || x.r.width < 43.5)
      .map((x) => `${x.id} ${Math.round(x.r.width)}x${Math.round(x.r.height)}`)
  );
  ok(`tap targets 44px at ${vp.width}x${vp.height}`, small.length === 0, small.join(", "));
  await ctx.close();
}

// behaviour, on the phone size
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
const page = await ctx.newPage();
page.on("pageerror", (e) => { fails.push("pageerror: " + e.message); console.log("PAGE ERROR", e.message); });
await page.goto("file://" + process.cwd() + "/docs/prototypes/02-explainer.html");
await page.waitForTimeout(600);

const beatOf = () => page.getAttribute("#stage", "data-beat");
const label = () => page.textContent("#mainLabel");

ok("starts on beat 1 and Play", (await beatOf()) === "0" && (await label()) === "Play");

// space plays, space pauses
await page.keyboard.press("Space");
await page.waitForTimeout(250);
ok("space plays", (await label()) === "Pause");
await page.keyboard.press("Space");
await page.waitForTimeout(150);
ok("space pauses", (await label()) === "Play");

// arrow keys move beats
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(200);
ok("arrow right steps a beat", (await beatOf()) === "1", "beat=" + (await beatOf()));
await page.keyboard.press("ArrowLeft");
await page.waitForTimeout(200);
ok("arrow left steps back", (await beatOf()) === "0");

// tapping a beat replays it
await page.locator(".beat").nth(4).tap();
await page.waitForTimeout(250);
ok("tapping beat 5 seeks there", (await beatOf()) === "4");

// run to the talk-like pause
await page.evaluate(() => window.scrollTo(0, 0));
await page.locator(".beat").nth(5).click();
await page.waitForTimeout(3200);
ok("ends in the mic pause", (await label()) === "Speak now" || (await label()) === "Type it");

// typed fallback, a wrong answer then a right one
const toType = page.locator("#toType");
if (await toType.count()) await toType.click();
await page.waitForTimeout(300);
ok("typed fallback appears", await page.isVisible("#typed"));
await page.fill("#typed", "give me coffee");
await page.click("#main");
await page.waitForTimeout(400);
ok("a wrong line is not a win", !(await page.evaluate(() => document.getElementById("stage").classList.contains("won"))));
ok("it offers another go", (await page.textContent("#hint")).indexOf("Nearly") === 0);

await page.click("#toType");
await page.waitForTimeout(300);
await page.fill("#typed", "I would like a coffee please");
await page.press("#typed", "Enter");
await page.waitForTimeout(500);
ok("the right line wins", await page.evaluate(() => document.getElementById("stage").classList.contains("won")));
ok("and offers a replay", (await label()) === "Play again");

// the star must not survive a replay
await page.locator(".beat").nth(0).click();
await page.waitForTimeout(300);
ok("the star clears on replay", !(await page.evaluate(() => document.getElementById("stage").classList.contains("won"))));

// dark mode
await page.click("#theme");
await page.waitForTimeout(300);
ok("dark mode toggles", (await page.getAttribute("html", "data-theme")) === "dark");
const darkFit = await page.evaluate(() => document.documentElement.scrollHeight <= document.documentElement.clientHeight);
ok("no scroll in dark mode", darkFit);

// contrast of the hint line over the page
const contrast = await page.evaluate(() => {
  const lum = (c) => {
    const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const parse = (s) => s.match(/[\d.]+/g).slice(0, 3).map(Number);
  const el = document.getElementById("hint");
  const cs = getComputedStyle(el);
  const fg = parse(cs.color), op = parseFloat(cs.opacity);
  const bg = parse(getComputedStyle(document.body).backgroundColor);
  const mix = fg.map((v, i) => v * op + bg[i] * (1 - op));
  const [a, b] = [lum(mix), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
});
ok("hint text contrast 4.5:1", contrast >= 4.5, contrast.toFixed(2) + ":1");

await browser.close();
console.log(fails.length ? "\nFAILED: " + fails.join(" | ") : "\nall checks passed");
process.exit(fails.length ? 1 : 0);
