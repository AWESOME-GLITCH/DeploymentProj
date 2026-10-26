// Screenshot harness for docs/prototypes/03-build-the-sentence.html
// node docs/prototypes/shots/shoot-03.mjs
import { chromium } from "/opt/node-tools/node_modules/playwright-core/index.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const page_url = "file://" + path.join(here, "..", "03-build-the-sentence.html");
const out = here;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
});
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  hasTouch: true,
  isMobile: true,
  colorScheme: "light",
});
page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));
page.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE:", m.text()); });

async function fresh(theme = "light") {
  await page.goto(page_url);
  await page.evaluate((t) => window.lpProto.theme(t === "dark"), theme);
  await wait(700);
}

async function shot(name) {
  await page.screenshot({ path: path.join(out, name) });
  const over = await page.evaluate(() => ({
    scrollH: document.documentElement.scrollHeight,
    clientH: document.documentElement.clientHeight,
    appH: document.getElementById("app").getBoundingClientRect().height,
  }));
  console.log(name, JSON.stringify(over));
}

// 1. building, three words placed
await fresh("light");
await page.evaluate(() => window.lpProto.place(3));
await wait(1600);
await shot("03-a-build.png");

// 2. a wrong tile wobbles
await fresh("light");
await page.evaluate(() => window.lpProto.place(2));
await wait(1200);
await page.getByRole("button", { name: "money" }).click();
await wait(160);
await shot("03-b-wobble.png");

// 3. complete, star pops, coach cheers
await fresh("light");
await page.evaluate(() => window.lpProto.place(6));
await wait(3200);
await shot("03-c-complete.png");

// 4. speaking, dark mode
await fresh("dark");
await page.evaluate(() => window.lpProto.place(6));
await wait(3200);
await page.evaluate(() => window.lpProto.listening());
await wait(700);
await shot("03-d-speak-dark.png");

// 5. typed fallback
await fresh("light");
await page.evaluate(() => { window.lpProto.place(6); });
await wait(3200);
await page.evaluate(() => window.lpProto.typed());
await wait(600);
await shot("03-e-typed.png");

// 6. you did it
await fresh("light");
await page.evaluate(() => window.lpProto.place(6));
await wait(3200);
await page.evaluate(() => window.lpProto.done());
await wait(900);
await shot("03-f-done.png");

await browser.close();
