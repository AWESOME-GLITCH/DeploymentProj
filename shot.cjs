const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const SS = '/tmp/claude-0/-home-user-DeploymentProj/4a399c4c-8891-5f4a-8e69-37ad98fbc5e9/scratchpad/';
  const target = process.argv[2] || 'flow';
  const run = process.argv[3] === 'run';
  await page.goto('http://localhost:3100/' + target, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  if (run) {
    try {
      await page.locator('textarea').first().fill('Launch the ATHE Business & Management Diploma for the September 2026 intake in Dubai, target career-changers 25-40, promote the university progression path.');
      await page.waitForTimeout(400);
      await page.getByText('Run full flow', { exact: false }).first().click();
      await page.waitForTimeout(4500);
    } catch (e) { console.log('interact skip', e.message.slice(0,60)); }
  }
  await page.screenshot({ path: SS + 'shot-' + target + '.png', fullPage: true });
  console.log('shot done', target);
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
