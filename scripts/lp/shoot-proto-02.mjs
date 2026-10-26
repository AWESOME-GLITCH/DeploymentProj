// Screenshots for the At the cafe explainer prototype.
// node scripts/lp/shoot-proto-02.mjs
import { chromium } from "/opt/node-tools/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";

const OUT = "docs/prototypes/shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
});
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));
await page.goto("file://" + process.cwd() + "/docs/prototypes/02-explainer.html");
await page.waitForTimeout(1600);

const shot = async (name) => {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("shot", name);
};

// scroll check
const scroll = await page.evaluate(() => ({
  sh: document.documentElement.scrollHeight,
  ch: document.documentElement.clientHeight,
  bw: document.body.scrollWidth,
}));
console.log("scroll", JSON.stringify(scroll));

await shot("02-a-start");

// walk the beats by tapping the beat bar, let each settle
for (let i = 0; i < 6; i++) {
  await page.locator(".beat").nth(i).click();
  await page.waitForTimeout(i === 3 ? 3600 : 1400);
  await page.evaluate(() => window.__pauseForShot && window.__pauseForShot());
  await shot(`02-beat-${i + 1}`);
}

// the talk-like pause at the end
await page.locator(".beat").nth(5).click();
await page.waitForTimeout(3200);
await shot("02-b-your-turn");

// typed fallback and the win state
const toType = page.locator("#toType");
if (await toType.count()) await toType.click();
await page.waitForTimeout(500);
await page.fill("#typed", "I would like a coffee, please");
await shot("02-c-typed");
await page.click("#main");
await page.waitForTimeout(900);
await shot("02-d-you-did-it");

// dark mode
await page.click("#theme");
await page.waitForTimeout(600);
await shot("02-e-dark");
await page.locator(".beat").nth(3).click();
await page.waitForTimeout(3600);
await shot("02-f-dark-build");

// keyboard focus
await page.click("#theme");
await page.waitForTimeout(400);
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await shot("02-g-focus");

await browser.close();
console.log("done");
