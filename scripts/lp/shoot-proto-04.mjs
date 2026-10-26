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

await page.goto("file://" + process.cwd() + "/docs/prototypes/04-listen-and-pick.html");
await page.waitForTimeout(1600);

// 1. the exercise, light
await page.screenshot({ path: `${OUT}/04-listen-and-pick-round1.png` });

// 2. a miss, then a right answer with the sticker
await page.getByRole("button", { name: /teabag/i }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/04-listen-and-pick-miss.png` });
await page.waitForTimeout(1200);
await page.getByRole("button", { name: /One cup of coffee/i }).click();
await page.waitForTimeout(420);
await page.screenshot({ path: `${OUT}/04-listen-and-pick-correct.png` });

// 3. round two with the words shown, dark mode
await page.waitForTimeout(900);
await page.getByRole("button", { name: /Show the words/i }).click();
await page.getByRole("button", { name: /dark mode/i }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/04-listen-and-pick-dark.png` });

// 4. finish the set and shoot the "You can now" card
await page.getByRole("button", { name: /Two cups of coffee/i }).click();
await page.waitForTimeout(1500);
await page.getByRole("button", { name: /bill with a coin/i }).click();
await page.waitForTimeout(1600);
await page.screenshot({ path: `${OUT}/04-listen-and-pick-done.png` });

// back to light for the done card too
await page.getByRole("button", { name: /light mode/i }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/04-listen-and-pick-done-light.png` });

// overflow check
const m = await page.evaluate(() => ({
  scrollH: document.documentElement.scrollHeight,
  clientH: document.documentElement.clientHeight,
  phone: document.getElementById("phone").getBoundingClientRect().height,
  gridBottom: document.getElementById("grid").getBoundingClientRect().bottom,
}));
console.log(JSON.stringify(m));
console.log(logs.join("\n") || "no console output");

await browser.close();
