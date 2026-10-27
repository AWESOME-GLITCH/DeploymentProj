import pw from '/opt/node-tools/node_modules/playwright-core/index.js';
const { chromium } = pw;

const FILE = 'file:///home/user/DeploymentProj/docs/prototypes/07-fill-the-gap.html';
const OUT = '/home/user/DeploymentProj/docs/prototypes/shots';

const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});
const ctx = await b.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  hasTouch: true,
  isMobile: true,
});
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });

const shot = (n) => p.screenshot({ path: `${OUT}/${n}.png` });

await p.goto(FILE);
await p.waitForTimeout(1200);

// 1: the gap waiting, Leo with the tray
await shot('07-a-round1');

// no page scroll anywhere
const scroll = await p.evaluate(() => ({
  body: document.body.scrollHeight - window.innerHeight,
  doc: document.documentElement.scrollHeight - window.innerHeight,
}));

// 2: Blobert mid-gag on a wrong chip
const wrong = await p.evaluate(() => {
  const chips = [...document.querySelectorAll('.chip')];
  const bad = chips.find(c => c.textContent !== 'have');
  bad.click();
  return bad.textContent;
});
await p.waitForTimeout(430);
await shot('07-b-blobert-gag');
await p.waitForTimeout(220);
await shot('07-c-blobert-wave');

// 3: the calm correction line, then the right chip in the gap
await p.waitForTimeout(700);
await shot('07-d-after-correction');
await p.evaluate(() => [...document.querySelectorAll('.chip')].find(c => c.textContent === 'have').click());
await p.waitForTimeout(500);
await shot('07-e-filled-star');

// round two and three, auto-answered
await p.waitForTimeout(1600);
await shot('07-f-round2');
await p.evaluate(() => window.dispatchEvent(new CustomEvent('lp:auto', { detail: { correct: true } })));
await p.waitForTimeout(1900);
await p.evaluate(() => window.dispatchEvent(new CustomEvent('lp:auto', { detail: { correct: true } })));
await p.waitForTimeout(1900);
await shot('07-g-you-can-now');

// dark mode: a round, a gag, then the done card again
await p.click('#againBtn');
await p.waitForTimeout(700);
await p.click('#themeBtn');
await p.waitForTimeout(500);
await shot('07-h-dark-round1');
await p.evaluate(() => window.dispatchEvent(new CustomEvent('lp:auto', { detail: { correct: false } })));
await p.waitForTimeout(430);
await shot('07-i-dark-blobert');
await p.waitForTimeout(1400);
for (let i = 0; i < 3; i += 1) {
  await p.evaluate(() => window.dispatchEvent(new CustomEvent('lp:auto', { detail: { correct: true } })));
  await p.waitForTimeout(1900);
}
await shot('07-j-dark-done');

// keyboard focus on a chip, back in light mode
await p.click('#againBtn');
await p.waitForTimeout(600);
await p.click('#themeBtn');
await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('.chip').focus());
await shot('07-k-focus');

console.log('scroll', JSON.stringify(scroll), 'wrong chip', wrong);
console.log(errs.length ? errs.join('\n') : 'no console or page errors');
await b.close();
