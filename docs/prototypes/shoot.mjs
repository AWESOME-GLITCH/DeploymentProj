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

await shot('01-today');

// scroll check
const scroll = await p.evaluate(() => ({
  bodyScroll: document.body.scrollHeight - window.innerHeight,
  docScroll: document.documentElement.scrollHeight - window.innerHeight,
}));

// welcome back
await p.click('#variant');
await p.waitForTimeout(900);
await shot('02-welcome-back');

// path tab
await p.click('#variant'); await p.waitForTimeout(400);
await p.click('#variant'); await p.waitForTimeout(600);
await p.click('.screen.is-on .tab[data-tab="path"]');
await p.waitForTimeout(900);
await shot('03-path');

await p.click('.screen.is-on .tab[data-tab="me"]');
await p.waitForTimeout(800);
await shot('04-me');

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
await p.waitForTimeout(250);
await shot('06-lesson-transition');
await p.waitForTimeout(900);
await shot('07-lesson');

// typed fallback
await p.click('#type-toggle');
await p.waitForTimeout(600);
await shot('08-typed');
await p.fill('.typed', 'a flat white please');
await p.keyboard.press('Enter');
await p.waitForTimeout(260);
await shot('09-star');
await p.waitForTimeout(1200);
await shot('10-turn2');
await p.click('#type-toggle'); await p.waitForTimeout(300);
await p.fill('.typed', 'thank you');
await p.keyboard.press('Enter');
await p.waitForTimeout(2200);
await shot('11-done');

// keyboard focus check
await p.keyboard.press('Tab');
await p.waitForTimeout(300);
await shot('12-focus');

console.log(JSON.stringify({ scroll, errs }, null, 1));
await b.close();
