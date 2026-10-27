// Shoot the Talk with Maya states at 390x844.
// Usage: node docs/prototypes/src/shoot-01.cjs [outdir]
const { chromium } = require("/opt/node-tools/node_modules/playwright-core");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const out = process.argv[2] || path.join(root, "docs/prototypes/shots");
const file = "file://" + path.join(root, "docs/prototypes/01-talk-with-maya.html");

(async () => {
  const b = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
  });
  const page = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const shot = (n) => page.screenshot({ path: path.join(out, `01-${n}.png`) });
  const wait = (ms) => page.waitForTimeout(ms);

  await page.goto(file);
  await wait(900);
  await shot("a-start");

  // Maya speaking: catch her mid-line with the mouth open.
  await page.click("#go");
  await wait(1200);
  await shot("b-speaking");

  // Your turn: listen face, lean-in, mic pill.
  await page.waitForFunction(() => window.PROTO.state() === "listen", null, { timeout: 8000 });
  await wait(600);
  await shot("c-your-turn");

  // Typed fallback.
  await page.click("#minor");
  await page.fill("#typedIn", "A coffee please");
  await wait(300);
  await shot("d-typed");

  // Good reaction with the star burst.
  await page.click("#typedGo");
  await wait(360);
  await shot("e-nice");

  // A miss on turn two.
  await page.click("#go");
  await page.waitForFunction(() => window.PROTO.state() === "listen", null, { timeout: 8000 });
  await page.evaluate(() => window.PROTO.answer("hmm"));
  await wait(500);
  await shot("f-nearly");

  // Straight to the end card.
  await page.evaluate(() => {
    window.PROTO.start();
  });
  // One turn is answered loosely, so the end card shows three different bars
  // and not three full ones.
  const SAID = ["A coffee, please.", "Take away", "No, thank you."];
  for (let i = 0; i < 3; i++) {
    await page.waitForFunction(() => window.PROTO.state() === "listen", null, { timeout: 9000 });
    await page.evaluate((t) => window.PROTO.answer(t), SAID[i]);
    await wait(260);
    if (i < 2) await page.click("#go");
  }
  await page.click("#go");
  await wait(1200);
  await shot("g-you-did-it");

  // Dark mode on the end card, then on a turn.
  await page.click("#theme");
  await wait(600);
  await shot("h-dark-done");
  await page.click("#go");
  await page.waitForFunction(() => window.PROTO.state() === "listen", null, { timeout: 9000 });
  await wait(600);
  await shot("i-dark-your-turn");

  // Keyboard focus ring on the primary action.
  await page.click("#theme");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await wait(300);
  await shot("j-focus");

  await b.close();
  console.log("shots written to", out);
})();
