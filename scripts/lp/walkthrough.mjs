#!/usr/bin/env node
/*
 * The full learner walkthrough, in light and dark, at 375 x 812.
 *
 * Onboarding -> placement -> Home -> the first lesson (explainer, coach, every
 * item type the session serves) -> reward -> How I'm doing, Me, Road,
 * Classmates, checkpoint -> day 2 and a second session.
 *
 * It never reads the app's source: it drives the real screens through the
 * learner's own controls plus the tester hook CLAUDE.md documents
 * (window.dispatchEvent(new CustomEvent("lp:auto", {detail:{correct:true}}))),
 * so it keeps working while other agents move the markup around, and the thing
 * it reports is the thing a learner would meet.
 *
 * Writes to scripts/lp/out/:
 *   <theme>-<nn>-<screen>.png   one per screen
 *   report.txt                  one PASS/WARN/FAIL line per screen
 *   report.md                   the table, plus the evidence for each failure
 *   report.json                 the same, for whatever comes next
 *
 * Usage: node scripts/lp/walkthrough.mjs [--base-url http://127.0.0.1:3131]
 *                                        [--themes light,dark] [--keep]
 */

import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const PW = process.env.LP_PW ?? "/opt/node-tools/node_modules/playwright";
const { chromium } = require(PW);

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const OUT = path.join(REPO, "scripts/lp/out");
const CHROME = process.env.LP_CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
let BASE = arg("base-url", process.env.LP_BASE_URL ?? "http://127.0.0.1:3123").replace(/\/$/, "");
const THEMES = arg("themes", "light,dark").split(",").map((s) => s.trim()).filter(Boolean);
const KEEP = argv.includes("--keep");
const appUrl = () => `${BASE}/learning-path`;

/* Other agents share this checkout, and a blanket `pkill next-server` from one
 * of their restart scripts will take our server down mid-walk. That is their
 * business, not a bug in the app, so bring the server back from the snapshot
 * that is already built and carry on rather than reporting a false failure. */
async function serverAlive() {
  try {
    const r = await fetch(appUrl(), { signal: AbortSignal.timeout(5000) });
    return r.ok;
  } catch { return false; }
}

async function ensureServer() {
  if (await serverAlive()) return true;
  console.log("[lp] the server is gone; restarting it from the existing snapshot");
  try {
    const out = execFileSync("bash", [path.join(REPO, "scripts/lp/build-and-serve.sh"), "--no-build"], { cwd: REPO, stdio: ["ignore", "pipe", "pipe"] }).toString();
    const m = out.match(/LP_BASE_URL=(\S+)/);
    if (m) { BASE = m[1].replace(/\/$/, ""); console.log(`[lp] back up on ${BASE}`); return true; }
  } catch (e) {
    console.error(`[lp] could not restart the server: ${String(e.message || e).split("\n")[0]}`);
  }
  return false;
}

/* Console noise that is not the app's fault. Keep this list short and obvious:
 * anything else must show up as a failure, or the walkthrough is theatre. */
const IGNORE_CONSOLE = [
  /favicon/i,
  /\/api\/learning-path\/tts/i, // no voice key in this environment
  /speechSynthesis|SpeechRecognition/i, // headless has no voice
  /Autoplay is only allowed/i,
  /AudioContext/i,
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const STORAGE_KEY = "learning-path.v1";

/* ------------------------------------------------------------------ report */

const rows = []; // { theme, n, screen, status, png, notes[] }
const fatal = []; // stages that could not be driven at all

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 46) || "screen";
}

function blame(file) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%h %an %ad %s", "--date=short", "--", file], { cwd: REPO }).toString().trim();
    return out || "(no commit touches this file yet)";
  } catch {
    return "(git log unavailable)";
  }
}

/** Every source file under the app, walked once and cached, for class lookups. */
let sourceCache = null;
function sources() {
  if (sourceCache) return sourceCache;
  const out = [];
  const walk = (dir) => {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.name === "node_modules" || e.name === ".next" || e.name.startsWith(".")) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(tsx?|css)$/.test(e.name)) out.push(p);
    }
  };
  walk(path.join(REPO, "app"));
  walk(path.join(REPO, "components"));
  walk(path.join(REPO, "lib"));
  sourceCache = out.map((p) => {
    let body = "";
    try { body = fs.readFileSync(p, "utf8"); } catch { /* raced with another agent's write */ }
    return { rel: path.relative(REPO, p), body };
  });
  return sourceCache;
}

/**
 * Where a CSS class comes from: the stylesheet that declares it, then the
 * components that put it on an element. A style failure names a class, not a
 * file, so without this the owner has to go looking.
 */
function classHomes(cls, onScreen = "") {
  const esc = cls.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const decl = new RegExp(`\\.${esc}(?![\\w-])`);
  const used = new RegExp(`["'\\s\`]${esc}(?![\\w-])`);
  // Words that were on the broken screen: a file carrying them is the likelier site.
  const words = String(onScreen).split(/[^A-Za-z']+/).filter((w) => w.length > 3);
  const defs = [];
  const uses = [];
  for (const f of sources()) {
    if (f.rel.endsWith(".css")) { if (decl.test(f.body)) defs.push(f.rel); }
    else if (used.test(f.body)) uses.push({ rel: f.rel, hits: words.filter((w) => f.body.includes(w)).length });
  }
  uses.sort((a, b) => b.hits - a.hits || a.rel.localeCompare(b.rel));
  return [...defs, ...uses.slice(0, 5).map((u) => u.rel)];
}

/** Repo files named in a stack trace or error text, so a failure points at an owner. */
function suspects(text) {
  const found = new Set();
  const s = String(text);
  for (const m of s.matchAll(/((?:app|components|lib|scripts)\/[\w./-]+\.(?:tsx?|mjs|css))/g)) found.add(m[1]);
  // Style failures quote the offending selector (`.lp-glass.lp-ask`) instead.
  const onScreen = (s.match(/"([^"]{4,})"/) || [, ""])[1];
  for (const m of s.matchAll(/`((?:\.[\w-]+)+)`/g)) {
    for (const cls of m[1].split(".").filter(Boolean)) {
      for (const f of classHomes(cls, onScreen)) found.add(f);
    }
  }
  return [...found];
}

/* -------------------------------------------------------------- page probes */

const lsState = (page) =>
  page.evaluate((k) => {
    try { return JSON.parse(window.localStorage.getItem(k) || "null"); } catch { return null; }
  }, STORAGE_KEY);

const fire = (page, correct = true) =>
  page.evaluate((c) => window.dispatchEvent(new CustomEvent("lp:auto", { detail: { correct: c } })), correct);

/** Everything a screenshot needs to be judged, read in one pass. */
const inspect = (page) =>
  page.evaluate(() => {
    const vis = (el) => {
      if (!el || !el.isConnected) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && window.getComputedStyle(el).visibility !== "hidden";
    };
    const root = document.querySelector(".lp-root");
    const vh = window.innerHeight;
    const text = root ? (root.innerText || "").replace(/\s+/g, " ").trim() : "";
    // Real controls, measured against the 44px bar. Speakers, single words,
    // beat dots and the coach's tap-to-hear words are affordances inside text,
    // and a Pill is a label, so none of them are measured as tap targets.
    const CONTROL = ".lp-btn-primary, .lp-btn-secondary, .lp-choice, .lp-icon-btn, .lp-mic, .lp-nav button";
    const controls = [...document.querySelectorAll(CONTROL)].filter((b) => vis(b) && b.tagName === "BUTTON").map((b) => {
      const r = b.getBoundingClientRect();
      return {
        label: (b.getAttribute("aria-label") || b.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40),
        cls: b.className && typeof b.className === "string" ? b.className.slice(0, 60) : "",
        disabled: !!b.disabled,
        w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom),
      };
    });
    const actionable = [...document.querySelectorAll("button, a[href], input, select, textarea")].filter((b) => vis(b) && !b.disabled);
    const primary = [...document.querySelectorAll(".lp-btn-primary")].filter(vis).map((b) => ({
      text: (b.textContent || "").replace(/\s+/g, " ").trim().slice(0, 30), disabled: !!b.disabled,
      bottom: Math.round(b.getBoundingClientRect().bottom),
    }));
    const focusable = actionable.length;
    // A card that carries words over a lesson scene has to be opaque. The
    // dark glass token is 5% white, which disappears over a bright explainer
    // and leaves the line sitting on the picture.
    const alphaOf = (c) => {
      const m = String(c).match(/rgba?\(([^)]+)\)/);
      if (!m) return 1;
      const parts = m[1].split(",").map((x) => parseFloat(x));
      return parts.length > 3 && Number.isFinite(parts[3]) ? parts[3] : 1;
    };
    const seeThrough = [...document.querySelectorAll(".lp-video .lp-glass, .lp-video .lp-surface")]
      .filter((el) => vis(el) && (el.innerText || "").trim().length > 0 && alphaOf(window.getComputedStyle(el).backgroundColor) < 0.85)
      .map((el) => ({ alpha: alphaOf(window.getComputedStyle(el).backgroundColor), cls: String(el.className || ""), text: (el.innerText || "").replace(/\s+/g, " ").trim().slice(0, 40) }));

    // A nav laid out for more tabs than it has leaves the tabs bunched up.
    const navEl = document.querySelector(".lp-nav");
    const nav = navEl
      ? { cols: (window.getComputedStyle(navEl).gridTemplateColumns || "").split(/\s+/).filter(Boolean).length, items: navEl.querySelectorAll("button").length }
      : null;

    return {
      hasRoot: !!root,
      theme: root ? root.getAttribute("data-theme") : null,
      seeThrough,
      nav,
      text,
      controls,
      primary,
      focusable,
      // One desktop screen, no main-page scroll; the phone frame must not clip.
      docOverflow: Math.max(0, document.documentElement.scrollHeight - vh),
      rootClipped: root ? Math.max(0, root.scrollHeight - root.clientHeight) : 0,
      imagesNoAlt: [...document.querySelectorAll("img")].filter((i) => i.getAttribute("alt") === null).length,
      visualAid: !!document.querySelector(".lp-root svg, .lp-root canvas, .lp-root .lp-ring, .lp-root .lp-dot, .lp-root [class*='lp-prog'], .lp-root [class*='lp-bar'], .lp-root .lp-video"),
      vh,
    };
  });

/** A cheap fingerprint of the current screen, used to tell "it moved" from "it did nothing". */
const signature = (page) =>
  page.evaluate(() => {
    const root = document.querySelector(".lp-root");
    const txt = root ? (root.innerText || "").replace(/\s+/g, " ").trim().slice(0, 240) : "no-root";
    const btns = [...document.querySelectorAll(".lp-btn-primary, .lp-choice")]
      .map((b) => `${(b.textContent || "").trim().slice(0, 14)}${b.disabled ? "-off" : ""}`).join("|");
    return `${txt}##${btns}`;
  });

/** What kind of screen this is, from what is on it. Used only for file names. */
const screenKind = (page) =>
  page.evaluate(() => {
    const has = (s) => !!document.querySelector(s);
    if (has('[aria-label="Your coach"]')) return "coach";
    if (has(".lp-wordline")) return "explainer";
    if (has(".lp-video")) return "video";
    if (has("textarea")) return "typing";
    if (has(".lp-mic")) return "speaking";
    if (has('input[type="range"]')) return "slider";
    if (has(".lp-choice")) return "choice";
    if (has(".lp-tile")) return "tiles";
    return "screen";
  });

/* --------------------------------------------------------------- one screen */

class Run {
  constructor(theme, page) {
    this.theme = theme;
    this.page = page;
    this.n = 0;
    this.console = []; // since the last shot
    this.seen = new Set();
  }

  take(msgs) { this.console.push(...msgs); }

  /** Screenshot + judge. Returns the row. */
  async shot(screen, opts = {}) {
    const page = this.page;
    await sleep(opts.settle ?? 350);
    this.n += 1;
    const name = `${this.theme}-${String(this.n).padStart(2, "0")}-${slug(screen)}.png`;
    const png = path.join(OUT, name);
    let info = null;
    const notes = [];
    let status = "PASS";
    const fail = (m) => { notes.push(m); status = "FAIL"; };
    const warn = (m) => { notes.push(`warn: ${m}`); if (status === "PASS") status = "WARN"; };

    try {
      await page.screenshot({ path: png, timeout: 15000 });
    } catch (e) {
      fail(`screenshot failed: ${String(e.message || e).split("\n")[0]}`);
    }
    try {
      info = await inspect(page);
    } catch (e) {
      fail(`could not read the screen: ${String(e.message || e).split("\n")[0]}`);
    }

    // Console and page errors that arrived while this screen was on display.
    const errs = this.console.filter((m) => !IGNORE_CONSOLE.some((re) => re.test(m)));
    this.console = [];
    for (const e of errs) fail(e);

    if (info) {
      if (!info.hasRoot) fail("no .lp-root on the page: the app did not render");
      if (info.theme && info.theme !== this.theme) fail(`theme is "${info.theme}" but the browser asked for ${this.theme}`);
      if (info.docOverflow > 1) fail(`the page scrolls: ${info.docOverflow}px past the ${info.vh}px viewport (no main-page scroll allowed)`);
      if (info.rootClipped > 8 && !opts.mayScroll) warn(`${info.rootClipped}px of this screen is cut off below the fold`);
      if (!opts.mayHaveNoAction && info.focusable === 0) fail("nothing on this screen can be focused or tapped");
      const offscreen = info.primary.filter((b) => b.bottom > info.vh + 1);
      if (offscreen.length) fail(`the main button is off the bottom of the screen (${offscreen[0].text || "primary"} at ${offscreen[0].bottom}px)`);
      for (const g of info.seeThrough) {
        const where = g.cls ? ` on \`.${g.cls.trim().split(/\s+/).join(".")}\`` : "";
        fail(`a see-through panel (background alpha ${g.alpha})${where} sits over the lesson scene, so "${g.text}" is read against the picture behind it`);
      }
      if (info.nav && info.nav.cols > info.nav.items) {
        warn(`the bottom nav is laid out in ${info.nav.cols} columns for ${info.nav.items} tabs, so the tabs sit in the left ${info.nav.items}/${info.nav.cols} of the bar`);
      }
      const small = info.controls.filter((c) => !c.disabled && (c.h < 44 || c.w < 44));
      if (small.length) warn(`${small.length} tap target(s) under 44px: ${small.slice(0, 3).map((c) => `${c.label || c.cls.split(" ")[0]} ${c.w}x${c.h}`).join(", ")}`);
      if (info.imagesNoAlt) warn(`${info.imagesNoAlt} image(s) with no alt text`);
      if (!info.visualAid && !opts.mayHaveNoVisual) warn("no visual aid on this screen");
      if (info.text.length < 2 && !opts.mayBeWordless) warn("almost no text on the screen");
    }

    for (const m of opts.notes ?? []) notes.push(m);
    if (opts.status === "FAIL") status = "FAIL";

    const row = { theme: this.theme, n: this.n, screen: slug(screen), status, png: name, notes };
    rows.push(row);
    const flag = status === "PASS" ? "PASS" : status;
    console.log(`${flag.padEnd(4)} ${this.theme}/${String(this.n).padStart(2, "0")} ${screen}${notes.length ? ` -- ${notes[0]}` : ""}`);
    return row;
  }

  /** Screenshot this screen only if a screen like it has not been captured yet. */
  async shotOnce(key, screen, opts) {
    if (this.seen.has(key)) return null;
    this.seen.add(key);
    return this.shot(screen, opts);
  }

  async note(screen, message, status = "FAIL") {
    this.n += 1;
    const row = { theme: this.theme, n: this.n, screen: slug(screen), status, png: "", notes: [message] };
    rows.push(row);
    console.log(`${status.padEnd(4)} ${this.theme}/${String(this.n).padStart(2, "0")} ${screen} -- ${message}`);
    return row;
  }
}

/* --------------------------------------------------------------- the driver */

/** Click the one enabled main button, and insist the screen actually changes. */
async function advance(run, what, { timeout = 12000, selector = ".lp-btn-primary:not([disabled])" } = {}) {
  const page = run.page;
  const before = await signature(page);
  const btn = page.locator(selector).first();
  if (!(await btn.count())) {
    await run.note(what, `no enabled main button to carry on from ${what}`);
    return false;
  }
  const label = ((await btn.textContent()) || "").trim().slice(0, 24);
  await btn.click({ timeout: 5000 }).catch(() => {});
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    await sleep(250);
    if ((await signature(page)) !== before) return true;
  }
  await run.note(what, `the "${label}" button does nothing: the screen is unchanged ${timeout}ms after the tap`);
  return false;
}

/** The explainer: watch it through, take the ask turn, satisfy the 80% gate.
 *
 *  It plays in real time on purpose. An earlier version skipped ahead with the
 *  beat dots to save a minute, and when the cafe explainer grew from six beats
 *  to nine that shortcut jumped straight past the "say it with me" pause: the
 *  run stayed green while silently never opening the one screen where the
 *  learner speaks. Watching it the way a learner does cannot skip anything.
 */
async function driveExplainer(run) {
  const page = run.page;
  const start = page.locator('.lp-video button[aria-label="Listen"]');
  if (await start.count()) await start.first().click({ timeout: 5000 }).catch(() => {});
  await run.shotOnce("explainer", "lesson-explainer-playing", { settle: 1200 });

  const t0 = Date.now();
  let asks = 0;
  let replayed = false;
  while (Date.now() - t0 < 180000) {
    if (!(await page.locator(".lp-btn-gated").count())) break; // watched enough

    // The ask: the explainer stops and hands the line to the learner.
    if (await page.locator(".lp-video .lp-glass").count()) {
      asks += 1;
      await run.shotOnce(`explainer-ask-${asks}`, `lesson-explainer-say-it-with-me-${asks}`, { settle: 400 });
      // It may want the key words tapped before the mic appears.
      if (!(await page.locator(".lp-video .lp-mic").count())) {
        const words = page.locator(".lp-video .lp-glass button");
        const n = Math.min(await words.count(), 8);
        for (let i = 0; i < n; i++) await words.nth(i).click({ timeout: 2000 }).catch(() => {});
        await sleep(400);
      }
      await fire(page);
      await sleep(700);
      const cont = page.locator(".lp-video button.lp-btn-primary:not([disabled])");
      if (await cont.count()) await cont.first().click({ timeout: 4000 }).catch(() => {});
      else await page.locator(".lp-video").getByText("Skip", { exact: true }).first().click({ timeout: 2000 }).catch(() => {});
      await sleep(500);
      continue;
    }

    // It ended before the gate opened: watch it again, once.
    const again = page.locator('.lp-video button[aria-label="Try again"]');
    if ((await again.count()) && !replayed) { replayed = true; await again.first().click({ timeout: 4000 }).catch(() => {}); }
    await sleep(700);
  }

  if (await page.locator(".lp-btn-gated").count()) {
    // Last resort so one stuck player does not cost the rest of the walk.
    const more = page.locator('button[aria-label="More options"]');
    if (await more.count()) {
      await more.first().click({ timeout: 4000 }).catch(() => {});
      await sleep(300);
      const beats = page.locator(".lp-beat");
      const n = await beats.count();
      if (n) await beats.nth(n - 1).click({ timeout: 4000 }).catch(() => {});
      await sleep(2000);
      await more.first().click({ timeout: 4000 }).catch(() => {});
    }
    if (await page.locator(".lp-btn-gated").count()) {
      await run.note("lesson-explainer", "the explainer never reached the 80% mark, so Continue stayed locked");
      return false;
    }
    await run.note("lesson-explainer", "the explainer only reached the 80% mark after jumping to the last part: it does not play through on its own", "WARN");
  }
  if (!asks) {
    await run.note("lesson-explainer", "the explainer played all the way through without ever asking the learner to say the line", "WARN");
  }
  return true;
}

/** One pass of "do whatever this screen needs". */
async function act(run) {
  const page = run.page;
  if (await page.locator(".lp-wordline").count()) {
    await driveExplainer(run);
  } else if (await page.locator(".lp-video").count() && await page.locator(".lp-btn-gated").count()) {
    // The video stand-in: press play and let it run to the gate.
    const play = page.locator('.lp-video button[aria-label="Listen"]');
    if (await play.count()) await play.first().click({ timeout: 4000 }).catch(() => {});
    const t0 = Date.now();
    while (Date.now() - t0 < 60000 && (await page.locator(".lp-btn-gated").count())) await sleep(700);
  }
  // Answer whatever is on screen. Harmless when nothing is listening.
  await fire(page);
  await sleep(450);
  const btn = page.locator(".lp-btn-primary:not([disabled])").first();
  if (await btn.count()) { await btn.click({ timeout: 5000 }).catch(() => {}); return true; }
  const sec = page.locator(".lp-btn-secondary:not([disabled])").first();
  if (await sec.count()) { await sec.click({ timeout: 5000 }).catch(() => {}); return true; }
  return false;
}

/** Drive a stretch of the app, capturing one screenshot per screen it meets. */
async function runStretch(run, label, { done, maxTicks = 70, opts = {} }) {
  const page = run.page;
  for (let i = 0; i < maxTicks; i++) {
    if (await done()) return true;
    const sig = await signature(page);
    if (!run.seen.has(sig)) {
      run.seen.add(sig);
      const kind = await screenKind(page);
      await run.shot(`${label}-${kind}-${String(i + 1).padStart(2, "0")}`, opts);
    }
    const moved = await act(run);
    if (!moved) {
      // Nothing to press: give the screen a moment in case it moves itself.
      await sleep(1500);
      if ((await signature(page)) === sig && !(await done())) {
        await run.note(`${label}-stuck`, `stuck on this screen: nothing enabled to tap and it does not advance itself`);
        return false;
      }
    }
    await sleep(250);
  }
  await run.note(`${label}-budget`, `did not finish within ${maxTicks} steps`);
  return false;
}

/* ------------------------------------------------------------ the full walk */

async function walk(browser, theme) {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    colorScheme: theme,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const run = new Run(theme, page);

  page.on("console", (m) => { if (m.type() === "error") run.take([`console error: ${m.text().slice(0, 300)}`]); });
  page.on("pageerror", (e) => run.take([`page error: ${String(e.message || e).split("\n").slice(0, 2).join(" ").slice(0, 300)}`]));
  page.on("requestfailed", (r) => run.take([`request failed: ${r.url().replace(BASE, "")} ${r.failure()?.errorText ?? ""}`]));
  page.on("response", (r) => { if (r.status() >= 500) run.take([`server ${r.status()} on ${r.url().replace(BASE, "")}`]); });

  const resp = await page.goto(appUrl(), { waitUntil: "domcontentloaded", timeout: 45000 });
  if (!resp || !resp.ok()) {
    await run.note("load", `GET /learning-path returned ${resp ? resp.status() : "nothing"}`);
    await context.close();
    return;
  }
  await page.waitForSelector(".lp-root", { timeout: 20000 }).catch(() => {});

  /* --- onboarding: five screens, each one headline and one action --------- */
  await run.shot("onboarding-language");
  if (!(await advance(run, "onboarding-language"))) return context.close();

  await page.locator(".lp-choice").first().click({ timeout: 5000 }).catch(() => {});
  await run.shot("onboarding-why");
  if (!(await advance(run, "onboarding-why"))) return context.close();

  await run.shot("onboarding-time");
  if (!(await advance(run, "onboarding-time"))) return context.close();

  await run.shot("onboarding-plan");
  if (!(await advance(run, "onboarding-plan"))) return context.close();

  /* --- placement: adaptive, no timer, no score --------------------------- */
  await run.shot("placement-first-item");
  await runStretch(run, "placement", {
    maxTicks: 30,
    done: async () => !!(await lsState(page))?.learner?.placement_done,
  });
  const placed = await lsState(page);
  if (!placed?.learner?.placement_done) {
    await run.note("placement", "placement never finished, so the rest of the walk could not run");
    return context.close();
  }

  /* --- Home: the road, today's lesson, one button ------------------------ */
  await run.shot("home-first-visit", { settle: 900 });

  /* --- the first lesson: plan, explainer, coach, items, close ------------ */
  await advance(run, "home-start-lesson", { timeout: 15000 });
  await runStretch(run, "lesson", {
    maxTicks: 90,
    // The session is over when the store has no session in progress.
    done: async () => !(await lsState(page))?.current,
  });

  /* --- the reward, then Home with today done ----------------------------- */
  const afterLesson = await lsState(page);
  if (!afterLesson?.sessions?.length) await run.note("lesson", "the first session never recorded as completed");
  // The reward has more than one card before Done. Keep taking the bottom
  // button until the bottom nav says we are back on Home.
  for (let i = 0; i < 6 && !(await page.locator(".lp-nav").count()); i++) {
    await run.shotOnce(await signature(page), `reward-${i + 1}`, { settle: 500 });
    const last = page.locator(".lp-btn-primary:not([disabled])").last();
    if (!(await last.count())) break;
    await last.click({ timeout: 5000 }).catch(() => {});
    await sleep(700);
  }
  if (!(await page.locator(".lp-nav").count())) {
    await run.note("home-today-done", "never got back to Home with the bottom nav after the first lesson");
  }
  await run.shot("home-today-done", { settle: 900 });

  /* --- the other screens ------------------------------------------------- */
  const nav = async (name, screen, opts) => {
    const b = page.locator(`.lp-nav button[aria-label="${name}"]`);
    if (!(await b.count())) { await run.note(screen, `no "${name}" button in the bottom nav`); return false; }
    await b.first().click({ timeout: 5000 }).catch(() => {});
    await run.shot(screen, { settle: 700, ...(opts ?? {}) });
    return true;
  };
  await nav("How I'm doing", "progress");
  await nav("Me", "me", { mayHaveNoVisual: true });
  await nav("Today", "home-again");

  /* --- tester panel: the screens with no learner route, and day 2 -------- */
  const tester = async (fn) => {
    const toggle = page.locator('button[aria-label="Tester"]');
    if (!(await toggle.count())) return false;
    await toggle.first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForSelector(".lp-tester", { timeout: 8000 }).catch(() => {});
    const ok = await fn();
    const close = page.getByRole("button", { name: "Close", exact: true });
    if (await close.count()) await close.first().click({ timeout: 4000 }).catch(() => {});
    await sleep(400);
    return ok;
  };
  const jump = (where) => tester(async () => {
    const b = page.locator(".lp-tester").getByRole("button", { name: where, exact: true });
    if (!(await b.count())) return false;
    await b.first().click({ timeout: 5000 }).catch(() => {});
    return true;
  });

  if (await jump("road")) await run.shot("road"); else await run.note("road", "could not reach the Road screen from the tester");
  if (await jump("classmates")) await run.shot("classmates", { mayHaveNoVisual: true });
  if (await jump("checkpoint")) {
    await run.shot("checkpoint-start");
    await runStretch(run, "checkpoint", {
      maxTicks: 40,
      done: async () => !!(await page.locator(".lp-nav").count()),
    });
  }

  /* --- day 2: move the clock, then a second day's session ---------------- */
  const movedOn = await tester(async () => {
    const b = page.locator(".lp-tester").getByRole("button", { name: "+1 day", exact: true });
    if (!(await b.count())) return false;
    await b.first().click({ timeout: 5000 }).catch(() => {});
    return true;
  });
  if (!movedOn) {
    await run.note("day-2", "could not move the clock on from the tester, so day 2 was not walked");
  } else {
    await sleep(600);
    await run.shot("home-day-2", { settle: 900 });
    const before = (await lsState(page))?.sessions?.length ?? 0;
    await advance(run, "home-day-2-start", { timeout: 15000 });
    await runStretch(run, "day-2-lesson", {
      maxTicks: 90,
      done: async () => {
        const st = await lsState(page);
        return !st?.current && (st?.sessions?.length ?? 0) > before;
      },
    });
    await run.shot("home-day-2-done", { settle: 900 });
  }

  await context.close();
}

/* -------------------------------------------------------------------- main */

/**
 * One walk at a time in this checkout.
 *
 * A second run clears every PNG and report the first one has written so far,
 * which both destroys the evidence a ticket comment already points at and
 * leaves a half-and-half report that reads as if one walk produced it. Other
 * agents run this script directly, not just through run.sh, so the lock has to
 * live here. Returns a release function.
 */
async function acquireOutLock(waitMs = 11 * 60 * 1000) {
  const lock = path.join(OUT, ".lock");
  const release = () => { try { fs.rmSync(lock, { recursive: true, force: true }); } catch { /* already gone */ } };
  const deadline = Date.now() + waitMs;
  let told = false;
  for (;;) {
    try {
      fs.mkdirSync(lock);
      fs.writeFileSync(path.join(lock, "pid"), `${process.pid}\n`);
      return release;
    } catch (e) {
      if (e.code !== "EEXIST") throw e;
    }
    // A run killed mid-walk leaves the directory behind: treat a dead owner,
    // or one older than a walk could possibly take, as stale and take over.
    let stale = false;
    try {
      const st = fs.statSync(lock);
      const owner = Number(fs.readFileSync(path.join(lock, "pid"), "utf8").trim());
      let alive = false;
      try { process.kill(owner, 0); alive = true; } catch { alive = false; }
      stale = !alive || Date.now() - st.mtimeMs > 20 * 60 * 1000;
    } catch {
      stale = true; // no readable pid: nothing is claiming it
    }
    if (stale) { release(); continue; }
    if (Date.now() > deadline) {
      console.error(`[lp] another walk still holds ${lock} after ${Math.round(waitMs / 1000)}s: not starting, so its PNGs survive`);
      process.exit(4);
    }
    if (!told) { console.log(`[lp] another walk is writing ${OUT}, waiting for it to finish`); told = true; }
    await sleep(3000);
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const releaseOutLock = await acquireOutLock();
  for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => { releaseOutLock(); process.exit(130); });
  process.on("exit", releaseOutLock);
  if (!KEEP) {
    for (const f of fs.readdirSync(OUT)) {
      if (/\.png$/.test(f) || /^report\./.test(f)) fs.rmSync(path.join(OUT, f));
    }
  }
  if (!fs.existsSync(CHROME)) {
    console.error(`no browser at ${CHROME}`);
    process.exit(2);
  }

  const started = new Date();
  const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox", "--mute-audio"] });
  for (const theme of THEMES) {
    console.log(`\n=== ${theme} =============================================`);
    for (let attempt = 1; attempt <= 3; attempt++) {
      if (!(await ensureServer())) {
        rows.push({ theme, n: 0, screen: "server", status: "FAIL", png: "", notes: [`no server answering on ${BASE}`] });
        break;
      }
      try {
        await walk(browser, theme);
        break;
      } catch (e) {
        const msg = String(e && e.message ? e.message : e).split("\n").slice(0, 3).join(" ");
        const serverGone = /ERR_CONNECTION_REFUSED|ECONNREFUSED|ERR_EMPTY_RESPONSE|Target page.*closed/i.test(msg);
        if (serverGone && attempt < 3) {
          // Someone else's restart, not the app's doing: drop the rows this
          // half-walk produced and take the theme again from the top.
          for (let i = rows.length - 1; i >= 0; i--) if (rows[i].theme === theme) rows.splice(i, 1);
          console.error(`[lp] ${theme} lost the server mid-walk; starting that theme again`);
          continue;
        }
        fatal.push(`${theme}: ${msg}`);
        rows.push({ theme, n: 99, screen: "walkthrough-aborted", status: "FAIL", png: "", notes: [msg] });
        console.error(`FAIL ${theme} walkthrough aborted: ${msg}`);
        break;
      }
    }
  }
  await browser.close();

  /* ------------------------------------------------------------ write out */
  const counts = { PASS: 0, WARN: 0, FAIL: 0 };
  for (const r of rows) counts[r.status] = (counts[r.status] ?? 0) + 1;

  const lines = rows.map((r) => `${r.status.padEnd(4)} ${r.theme}/${String(r.n).padStart(2, "0")} ${r.screen.padEnd(40)} ${r.png || "-"}${r.notes.length ? `  :: ${r.notes.join(" | ")}` : ""}`);
  fs.writeFileSync(path.join(OUT, "report.txt"), `${lines.join("\n")}\n\n${counts.PASS} pass, ${counts.WARN} warn, ${counts.FAIL} fail  (${BASE}, ${started.toISOString()})\n`);

  const md = [];
  md.push(`# Learning Path walkthrough`, "");
  md.push(`${started.toISOString()} · ${BASE} · 375x812 · ${THEMES.join(" and ")}`, "");
  md.push(`**${counts.PASS} pass, ${counts.WARN} warn, ${counts.FAIL} fail**`, "");
  md.push("| | theme | screen | PNG | notes |", "|---|---|---|---|---|");
  for (const r of rows) md.push(`| ${r.status} | ${r.theme} | ${r.screen} | ${r.png ? `\`scripts/lp/out/${r.png}\`` : "-"} | ${r.notes.join("<br>").replace(/\|/g, "\\|") || "" } |`);
  const bad = rows.filter((r) => r.status === "FAIL");
  if (bad.length) {
    md.push("", "## Failures", "");
    for (const r of bad) {
      md.push(`### ${r.theme} · ${r.screen}`, "");
      if (r.png) md.push(`PNG: \`scripts/lp/out/${r.png}\``, "");
      for (const n of r.notes) {
        md.push(`- ${n}`);
        for (const f of suspects(n)) md.push(`  - \`${f}\` last changed by: ${blame(f)}`);
      }
      md.push("");
    }
  }
  fs.writeFileSync(path.join(OUT, "report.md"), `${md.join("\n")}\n`);
  fs.writeFileSync(path.join(OUT, "report.json"), `${JSON.stringify({ at: started.toISOString(), base: BASE, themes: THEMES, counts, rows, fatal }, null, 2)}\n`);

  console.log(`\n${counts.PASS} pass, ${counts.WARN} warn, ${counts.FAIL} fail -> scripts/lp/out/report.txt`);
  process.exit(counts.FAIL ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(3); });
