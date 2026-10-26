// Screenshot the "Listen and pick" prototype at 390x844 in light and dark.
import { chromium } from "/opt/node-tools/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";

const OUT = "docs/prototypes/shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
});
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});

const logs = [];
page.on("console", (m) => logs.push(`${m.type()}: ${m.text()}`));
page.on("pageerror", (e) => logs.push(`pageerror: ${e.message}`));

const shot = (n) => page.screenshot({ path: `${OUT}/04-listen-and-pick-${n}.png` });
const tile = (re) => page.getByRole("button", { name: re });
const words = () => page.locator("#wordsBtn");

await page.goto("file://" + process.cwd() + "/docs/prototypes/04-listen-and-pick.html");
await page.waitForTimeout(1500);

// 1. round one, light, speaking. Headless has no voices, so the words fallback
// fires; hide them to shoot the real default a phone with audio shows.
if ((await words().textContent()).includes("Hide")) await words().click();
await page.waitForTimeout(300);
await shot("round1");

// 2. a miss: the coach leans in and replays
await tile(/teabag/i).click();
await page.waitForTimeout(420);
await shot("miss");

// 3. the right card with its star sticker
await page.waitForTimeout(1300);
await tile(/One cup of coffee/i).click();
await page.waitForTimeout(420);
await shot("correct");

// 4. round two in dark mode
await page.waitForTimeout(1000);
await page.locator("#themeBtn").click();
if ((await words().textContent()).includes("Hide")) await words().click();
await page.waitForTimeout(700);
await shot("dark");

// 5. words shown (the fallback when there is no audio)
await words().click();
await page.waitForTimeout(500);
await shot("dark-words");

// 6. finish and shoot the "You can now" card, dark then light
await tile(/Two cups of coffee/i).click();
await page.waitForTimeout(1500);
await tile(/bill with a coin/i).click();
await page.waitForTimeout(1700);
await shot("done-dark");
await page.locator("#themeBtn").click();
await page.waitForTimeout(600);
await shot("done");

// 7. keyboard focus ring
await page.locator("#againBtn").click();
await page.waitForTimeout(900);
await page.locator(".tile").first().focus();
await page.keyboard.press("ArrowRight");
await page.keyboard.press("ArrowDown");
await page.waitForTimeout(300);
await shot("focus");

const m = await page.evaluate(() => ({
  scrollH: document.documentElement.scrollHeight,
  clientH: document.documentElement.clientHeight,
  bodyScroll: document.body.scrollHeight,
  gridBottom: Math.round(document.getElementById("grid").getBoundingClientRect().bottom),
  focused: document.activeElement && document.activeElement.getAttribute("aria-label"),
}));
console.log(JSON.stringify(m));
console.log(logs.join("\n") || "no console output");

await browser.close();
