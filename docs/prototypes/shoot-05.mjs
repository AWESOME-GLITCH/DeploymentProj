import pw from '/opt/node-tools/node_modules/playwright-core/index.js';
const { chromium } = pw;

const FILE = 'file:///home/user/DeploymentProj/docs/prototypes/05-today-and-path.html';
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

await p.goto(FILE);
await p.waitForTimeout(1400);

const shot = (n) => p.screenshot({ path: `${OUT}/${n}.png` });

await shot('05-today');

// scroll check
const scroll = await p.evaluate(() => ({
  bodyScroll: document.body.scrollHeight - window.innerHeight,
  docScroll: document.documentElement.scrollHeight - window.innerHeight,
}));

// welcome back
await p.click('#variant');
await p.waitForTimeout(900);
await shot('05-welcome-back');

// path tab
await p.click('#variant'); await p.waitForTimeout(400);
await p.click('#variant'); await p.waitForTimeout(600);
await p.click('.screen.is-on .tab[data-tab="path"]');
await p.waitForTimeout(900);
await shot('05-path');

await p.click('.screen.is-on .tab[data-tab="me"]');
await p.waitForTimeout(800);
await shot('05-me');

// dark mode today
await p.click('.screen.is-on .tab[data-tab="today"]');
await p.waitForTimeout(600);
await p.click('#theme');
await p.waitForTimeout(700);
await shot('05-today-dark');
await p.click('#theme');
await p.waitForTimeout(500);

// lesson
await p.click('#start');
await p.waitForTimeout(130);
await shot('05-lesson-transition');
await p.waitForTimeout(900);
await shot('05-lesson');

// typed fallback
await p.click('#type-toggle');
await p.waitForTimeout(600);
await shot('05-typed');
await p.fill('.typed', 'a flat white please');
await p.keyboard.press('Enter');
await p.waitForTimeout(150);
await shot('05-star');
await p.waitForTimeout(1200);
await shot('05-turn2');
await p.click('#type-toggle'); await p.waitForTimeout(300);
await p.fill('.typed', 'thank you');
await p.keyboard.press('Enter');
await p.waitForTimeout(2200);
await shot('05-you-can-now');

// keyboard focus check
await p.keyboard.press('Tab');
await p.waitForTimeout(300);
await shot('05-focus');

// audit: tap targets, labels, tab order
await p.goto(FILE);
await p.waitForTimeout(900);
const audit = await p.evaluate(() => {
  const small = [];
  document.querySelectorAll('button,input,[role="tab"]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width && r.height < 44) small.push(`${el.id || el.className}:${Math.round(r.width)}x${Math.round(r.height)}`);
  });
  const unlabelled = [...document.querySelectorAll('svg[role="img"]')]
    .filter(s => !s.getAttribute('aria-label')).length;
  const nameless = [...document.querySelectorAll('button')]
    .filter(b => b.offsetParent && !(b.textContent.trim() || b.getAttribute('aria-label'))).length;
  return { small, unlabelled, nameless };
});

// keyboard: tab to Start and press Enter, then Escape
const order = [];
for (let i = 0; i < 6; i++) {
  await p.keyboard.press('Tab');
  order.push(await p.evaluate(() => document.activeElement.id || document.activeElement.textContent.trim().slice(0, 12)));
}
await p.keyboard.press('Tab');
await p.evaluate(() => document.getElementById('start').focus());
await p.keyboard.press('Enter');
await p.waitForTimeout(600);
const lessonOpen = await p.evaluate(() => document.getElementById('s-lesson').classList.contains('is-on'));
await p.keyboard.press('Escape');
await p.waitForTimeout(400);
const lessonShut = await p.evaluate(() => !document.getElementById('s-lesson').classList.contains('is-on'));

console.log(JSON.stringify({ scroll, errs, audit, order, lessonOpen, lessonShut }, null, 1));
await b.close();
