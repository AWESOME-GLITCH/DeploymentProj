const { chromium } = require('/opt/node-tools/node_modules/playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell" });
  const p = await b.newPage({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 2 });
  await p.goto('file:///home/user/DeploymentProj/docs/design/engagement-patterns.html');
  await p.waitForTimeout(400);
  const names = { 'shot-1': 'engagement-today-path', 'shot-2': 'engagement-coach-item', 'shot-3': 'engagement-end-return' };
  for (const [id, name] of Object.entries(names)) {
    const el = await p.$('#' + id);
    const box = await el.boundingBox();
    console.log(id, JSON.stringify(box));
    await el.screenshot({ path: `/home/user/DeploymentProj/docs/design/shots/${name}.png` });
  }
  // overflow check on each phone frame
  const ov = await p.$$eval('.phone', els => els.map((e,i) => ({ i, sh: e.scrollHeight, ch: e.clientHeight, sw: e.scrollWidth, cw: e.clientWidth })));
  console.log(JSON.stringify(ov));
  await b.close();
})();
