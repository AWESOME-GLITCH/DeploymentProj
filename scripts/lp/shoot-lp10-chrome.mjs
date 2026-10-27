#!/usr/bin/env node
/*
 * LP-10 checkpoint shooter: the surfaces this ticket owns, in light and dark.
 *
 * Nav, How I'm doing, Me, the lesson capsule chrome and the explainer player
 * controls. It seeds a placed learner in localStorage so it does not spend two
 * minutes on onboarding, then drives the real screens through the learner's own
 * buttons and the tester hook from CLAUDE.md.
 *
 * Writes scripts/lp/out-lp10/<theme>-<nn>-<screen>.png.
 * Usage: node scripts/lp/shoot-lp10-chrome.mjs [--base-url http://127.0.0.1:3123]
 */

import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.LP_PW ?? "/opt/node-tools/node_modules/playwright");
const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const OUT = path.join(REPO, "scripts/lp/out-lp10");
const CHROME = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const argv = process.argv.slice(2);
const i = argv.indexOf("--base-url");
const BASE = (i >= 0 ? argv[i + 1] : "http://127.0.0.1:3123").replace(/\/$/, "");

fs.mkdirSync(OUT, { recursive: true });
const errors = [];
const browser = await chromium.launch({ executablePath: CHROME });

for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(`${theme}: ${m.text().slice(0, 160)}`); });
  page.on("pageerror", (e) => errors.push(`${theme}: PAGEERROR ${e.message.slice(0, 160)}`));

  await page.goto(`${BASE}/learning-path`, { waitUntil: "domcontentloaded" });
  await page.evaluate((theme) => {
    window.localStorage.setItem("learning-path.v1", JSON.stringify({
      version: 1,
      learner: { onboarded: true, placement_done: true, confirmed_sublevel: "A2.1", provisional_sublevel: "A2.1", theme },
    }));
  }, theme);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(900);

  let n = 0;
  const shot = async (name) => {
    n += 1;
    await page.waitForTimeout(350);
    const file = path.join(OUT, `${theme}-${String(n).padStart(2, "0")}-${name}.png`);
    await page.screenshot({ path: file });
    const over = await page.evaluate(() => {
      const root = document.querySelector(".lp-root");
      if (!root) return "no root";
      const bad = [];
      root.querySelectorAll("*").forEach((el) => {
        const cs = getComputedStyle(el);
        if ((cs.overflowY === "auto" || cs.overflowY === "scroll") && el.scrollHeight > el.clientHeight + 2) bad.push(`${String(el.className).slice(0, 24)} ${el.scrollHeight}>${el.clientHeight}`);
      });
      if (root.scrollHeight > root.clientHeight + 2) bad.push(`root ${root.scrollHeight}>${root.clientHeight}`);
      return bad.join("; ");
    });
    console.log(`${theme} ${n} ${name}`, over ? `OVERFLOW ${over}` : "ok");
  };

  const btn = (name) => page.getByRole("button", { name, exact: true }).first();
  const vis = async (l) => (await l.isVisible().catch(() => false)) && (await l.isEnabled().catch(() => false));
  const tester = async (label) => {
    await btn("Tester").click();
    await page.locator(".lp-tester button", { hasText: label }).first().click();
    const close = btn("Close");
    if (await vis(close)) await close.click();
    await page.waitForTimeout(500);
  };

  await shot("home");
  await page.locator("nav.lp-nav button").nth(1).click(); await shot("how-im-doing");
  await page.locator("nav.lp-nav button").nth(2).click(); await shot("me");
  await page.locator("nav.lp-nav button").nth(0).click();

  // Into the lesson: the capsule chrome, then every stage it serves.
  await tester("start session");
  await shot("capsule-plan");

  const seen = new Set();
  for (let step = 0; step < 30; step += 1) {
    // The explainer: start it, let the caption run, catch the coach's ask.
    const listen = btn("Listen");
    const play = page.getByRole("button", { name: "Play", exact: true }).first();
    if (await vis(listen)) {
      await listen.click();
      await page.waitForTimeout(2600);
      if (!seen.has("explainer")) { seen.add("explainer"); await shot("explainer-caption"); }
      continue;
    }
    if (await vis(play) && !seen.has("explainer-more")) {
      seen.add("explainer-more");
      await page.getByRole("button", { name: "More options" }).first().click();
      await shot("explainer-more");
      await page.getByRole("button", { name: "More options" }).first().click();
      continue;
    }
    // An ask inside the video: shoot it once, then answer it the way it asks.
    const ask = page.locator(".lp-vcaption").first();
    if (!seen.has("ask") && await page.locator("text=Tap the key words").first().isVisible().catch(() => false)) {
      seen.add("ask");
      await shot("explainer-ask");
    }
    for (const name of ["Continue", "Next", "Check", "Done", "Your turn", "Start", "I can", "Skip"]) {
      const b = btn(name);
      if (await vis(b)) {
        const label = name.toLowerCase().replace(/[^a-z]+/g, "-");
        if (!seen.has(`before-${label}-${step}`)) await shot(`stage-${String(step).padStart(2, "0")}`);
        await b.click();
        await page.waitForTimeout(600);
        break;
      }
    }
    // An item with no obvious control: answer it through the tester hook.
    if (await page.locator(".lp-choice, .lp-tile, .lp-input, .lp-mic").first().isVisible().catch(() => false)) {
      await page.evaluate(() => window.dispatchEvent(new CustomEvent("lp:auto", { detail: { correct: true } })));
      await page.waitForTimeout(700);
    }
    if (n > 18) break;
    await page.waitForTimeout(250);
    if (await vis(ask)) continue;
  }
  await ctx.close();
}

console.log("ERRORS:", errors.length ? [...new Set(errors)].join("\n") : "none");
await browser.close();
