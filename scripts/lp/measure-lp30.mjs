// LP-30 (LEA-22) acceptance measurement: how long from the session starting to
// the learner's first spoken turn, read off the tester panel's own counter.
//
// Two runs, as the ticket asks:
//   1. first run  - fresh learner, onboarding and placement, then the first lesson
//   2. day 5 run  - the same learner on day 5 (week day 5), seeded with four
//                   completed days so the composer takes the day-5 branch
//
// Writes PNGs and a JSON summary to scripts/lp/out-lp30/ (its own folder, so it
// never wipes the Test Engineer's walkthrough PNGs in scripts/lp/out/).

import pw from "/opt/node-tools/node_modules/playwright-core/index.js";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.LP_BASE_URL || "http://127.0.0.1:3141";
const EXE = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const OUT = new URL("./out-lp30/", import.meta.url).pathname;
const KEY = "learning-path.v1";
const MOBILE = { width: 375, height: 812 };

mkdirSync(OUT, { recursive: true });

const log = [];
const say = (m) => { log.push(m); console.log(m); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const readState = (page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) || "null"), KEY);

/** The tester panel's own formula, so the number in the report is the panel's. */
function timeToSpoken(state) {
  const cur = state?.current;
  if (!cur) return null;
  const spoken = state.events.find((e) => e.at >= cur.started_at
    && (e.name === "explainer_spoken" || (e.name === "item_answered" && e.data?.modality === "spoken")));
  return spoken ? (spoken.at - cur.started_at) / 1000 : null;
}

/** Click a visible, enabled button whose text matches, if there is one. */
async function clickText(page, re) {
  const btns = await page.$$("button");
  for (const b of btns) {
    if (!(await b.isVisible()) || !(await b.isEnabled())) continue;
    const txt = ((await b.textContent()) || "").trim();
    if (re.test(txt)) { await b.click(); return txt; }
  }
  return null;
}

/** Drive the session forward until the first spoken turn is recorded. */
async function driveToFirstSpokenTurn(page, tag, budgetMs = 180_000) {
  const t0 = Date.now();
  let shot = 0;
  while (Date.now() - t0 < budgetMs) {
    const st = await readState(page);
    const secs = timeToSpoken(st);
    if (secs !== null) return secs;

    // The pause's mic: the tester hook fills it with the model line.
    if (await page.$(".lp-mic")) {
      await page.screenshot({ path: `${OUT}${tag}-pause-${++shot}.png` });
      await page.evaluate(() => window.dispatchEvent(new CustomEvent("lp:auto", { detail: { correct: true } })));
      await sleep(600);
      continue;
    }
    // A tap-the-word pause: tap every word, the panel works out the targets.
    const panel = await page.$(".lp-say, [data-lp-pause]");
    if (panel) {
      const words = await panel.$$("button");
      for (const w of words) { if (await w.isEnabled()) { await w.click(); await sleep(120); } }
    }
    // Anything else that is just waiting on a tap.
    await clickText(page, /^(Continue|Start|Next|Got it|I said it)/i);
    await sleep(500);
  }
  return null;
}

/** Read the figure off the tester panel, at mobile width, through its own button. */
async function readTesterPanel(page, tag) {
  const btn = await page.$('button[aria-label="Tester"]');
  if (btn) await btn.click();
  await sleep(700);
  await page.screenshot({ path: `${OUT}${tag}-tester.png` });
  const text = await page.evaluate(() => {
    const el = [...document.querySelectorAll("div")].find((d) => /First spoken turn:/.test(d.textContent || "") && d.children.length === 0);
    const opens = [...document.querySelectorAll("div")].find((d) => /^Opens on:/.test((d.textContent || "").trim()) && d.children.length === 0);
    return { spoken: el?.textContent?.trim() ?? null, opens: opens?.textContent?.trim() ?? null };
  });
  const close = await page.$(".lp-tester button");
  if (close) await close.click();
  await sleep(300);
  return text;
}

const browser = await chromium.launch({ executablePath: EXE });
const results = {};

// ------------------------------------------------------------------ run 1
{
  const ctx = await browser.newContext({ viewport: MOBILE, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") say(`  [console] ${m.text().slice(0, 160)}`); });
  await page.goto(`${BASE}/learning-path`, { waitUntil: "networkidle" });
  await page.evaluate((k) => localStorage.removeItem(k), KEY);
  await page.reload({ waitUntil: "networkidle" });
  await sleep(1200);
  say("run 1: fresh learner, walking onboarding");

  // language -> why -> time -> plan
  await page.click(".lp-choice");                       // a language
  await clickText(page, /^Continue/i);
  await sleep(400);
  await page.click(".lp-choice");                       // a reason
  await clickText(page, /^Continue/i);
  await sleep(400);
  await clickText(page, /^Continue/i);                  // daily minutes, default kept
  await sleep(400);
  await clickText(page, /^Continue/i);                  // when and where
  await sleep(800);

  // placement: auto-answer until the landing Home appears
  for (let i = 0; i < 20; i++) {
    const st = await readState(page);
    if (st?.learner?.placement_done) break;
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("lp:auto", { detail: { correct: true } })));
    await sleep(500);
    await clickText(page, /^(Continue|Next)/i);
    await sleep(400);
  }
  const placed = await readState(page);
  say(`  placement done: ${!!placed?.learner?.placement_done}, level ${placed?.learner?.provisional_sublevel}`);
  await page.screenshot({ path: `${OUT}run1-01-landing.png` });

  // the landing Home's one action starts the first lesson
  await clickText(page, /^(Start|Continue)/i);
  await sleep(1500);
  await page.screenshot({ path: `${OUT}run1-02-opens-on.png` });

  const st = await readState(page);
  const opensOn = st?.current?.session?.phases?.[0];
  say(`  first run opens on: ${JSON.stringify(opensOn)}`);
  say(`  phases: ${st?.current?.session?.phases?.map((p) => p.kind + (p.role ? ":" + p.role : "")).join(" -> ")}`);

  const secs = await driveToFirstSpokenTurn(page, "run1");
  const panel = await readTesterPanel(page, "run1-03");
  say(`  first spoken turn: ${secs === null ? "NOT REACHED" : secs.toFixed(1) + " s"}`);
  say(`  tester panel says: ${JSON.stringify(panel)}`);
  results.first_run = { opens_on: opensOn, phases: st?.current?.session?.phases, seconds: secs, panel };

  // keep the finished-ish state for run 2
  results._state = await readState(page);
  await ctx.close();
}

// ------------------------------------------------------------------ run 2
{
  const ctx = await browser.newContext({ viewport: MOBILE, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") say(`  [console] ${m.text().slice(0, 160)}`); });
  await page.goto(`${BASE}/learning-path`, { waitUntil: "networkidle" });
  say("run 2: the same learner on day 5 (week day 5)");

  // Seed day 5: four completed days behind the learner, so the composer takes
  // the day-5 branch rather than the warm restart (missed >= 2) branch.
  await page.evaluate(({ k, s }) => {
    const st = s;
    st.clock_offset = 4 * 86_400_000;
    st.week_start_day = 0;
    st.current = null;
    st.sessions = [0, 1, 2, 3].map((day) => ({ day, minutes: 10, spoken: true, second: false, completed: true }));
    localStorage.setItem(k, JSON.stringify(st));
  }, { k: KEY, s: results._state });
  await page.reload({ waitUntil: "networkidle" });
  await sleep(1200);

  // start the session through the tester panel, as the ticket asks
  const tbtn = await page.$('button[aria-label="Tester"]');
  if (tbtn) await tbtn.click();
  await sleep(600);
  const dayLine = await page.evaluate(() => {
    const d = [...document.querySelectorAll("div")].find((x) => /^Day \d+ · week day/.test((x.textContent || "").trim()) && x.children.length === 0);
    return d?.textContent?.trim() ?? null;
  });
  say(`  tester header: ${dayLine}`);
  await page.screenshot({ path: `${OUT}run2-01-tester-day5.png` });
  await clickText(page, /^start session$/i);
  await sleep(1500);
  await page.screenshot({ path: `${OUT}run2-02-opens-on.png` });

  const st = await readState(page);
  const opensOn = st?.current?.session?.phases?.[0];
  say(`  day 5 opens on: ${JSON.stringify(opensOn)}`);
  say(`  phases: ${st?.current?.session?.phases?.map((p) => p.kind + (p.role ? ":" + p.role : "")).join(" -> ")}`);

  const secs = await driveToFirstSpokenTurn(page, "run2");
  const panel = await readTesterPanel(page, "run2-03");
  say(`  first spoken turn: ${secs === null ? "NOT REACHED" : secs.toFixed(1) + " s"}`);
  say(`  tester panel says: ${JSON.stringify(panel)}`);
  results.day5_run = { day_line: dayLine, opens_on: opensOn, phases: st?.current?.session?.phases, seconds: secs, panel };
  await ctx.close();
}

delete results._state;
await browser.close();
writeFileSync(`${OUT}measure.json`, JSON.stringify(results, null, 2));
writeFileSync(`${OUT}measure.log`, log.join("\n") + "\n");
say(`\nwrote ${OUT}measure.json`);
