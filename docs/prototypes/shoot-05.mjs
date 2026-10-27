import pw from '/opt/node-tools/node_modules/playwright-core/index.js';
const { chromium } = pw;
const FILE='file:///home/user/DeploymentProj/docs/prototypes/05-today-and-path.html';
const OUT='/home/user/DeploymentProj/docs/prototypes/shots';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:true});
let p=await ctx.newPage();
const errs=[];
p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text());});
await p.goto(FILE); await p.waitForTimeout(1500);
const shot=n=>p.screenshot({path:`${OUT}/${n}.png`});
await shot('05-a-today');
await p.getByRole('button',{name:'Demo: switch state'}).tap(); await p.waitForTimeout(900);
await shot('05-b-welcome-back');
await p.getByRole('button',{name:'Demo: switch state'}).tap(); await p.waitForTimeout(900);
await shot('05-c-session-end');
await p.getByRole('button',{name:'Demo: switch state'}).tap(); await p.waitForTimeout(600);
// the transition into the lesson shell, caught mid-spring and then settled
await p.getByRole('button',{name:/Start/}).tap();
// freeze every animation and transition 60 ms into the spring so the frame is deterministic
await p.evaluate(()=>document.getAnimations().forEach(a=>{a.pause();a.currentTime=60;}));
await shot('05-d-lesson-transition');
await p.evaluate(()=>document.getAnimations().forEach(a=>a.play()));
await p.waitForTimeout(700);
await shot('05-e-lesson-shell');
await p.getByRole('button',{name:/Say it/}).tap(); await p.waitForTimeout(1500);
await shot('05-f-after-lesson');
// dark
await p.getByRole('button',{name:/Switch to dark/}).tap(); await p.waitForTimeout(500);
await p.evaluate(()=>window.lp.setState('today')); await p.waitForTimeout(700);
await shot('05-g-dark-today');
await p.evaluate(()=>window.lp.setState('back')); await p.waitForTimeout(700);
await shot('05-h-dark-welcome-back');
await p.getByRole('button',{name:/Switch to light/}).tap(); await p.waitForTimeout(400);
// path and me tabs, keyboard focus
await p.getByRole('tab',{name:'Path'}).tap(); await p.waitForTimeout(800);
await shot('05-i-path-tab');
await p.getByRole('tab',{name:'Me'}).tap(); await p.waitForTimeout(600);
await shot('05-j-me-tab');
await p.getByRole('tab',{name:'Today'}).tap(); await p.waitForTimeout(500);
await p.evaluate(()=>document.activeElement.blur());
await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(200);
let fo=await p.evaluate(()=>document.activeElement.tagName+'#'+document.activeElement.id);
if(!fo.startsWith('BUTTON')){ await p.focus('#start'); await p.keyboard.press('Shift'); fo=await p.evaluate(()=>document.activeElement.tagName+'#'+document.activeElement.id)+' (programmatic)'; }
console.log('focus on', fo);
await shot('05-k-focus');
// reduced motion still reads
await ctx.close();
const ctx2=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:true,reducedMotion:'reduce'});
const p2=await ctx2.newPage(); p2.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
await p2.goto(FILE); await p2.waitForTimeout(600); await p2.evaluate(()=>window.lp.setState('back')); await p2.waitForTimeout(300);
await p2.screenshot({path:`${OUT}/05-l-reduced-motion.png`});
p=p2;
const m=await p.evaluate(()=>({sh:document.documentElement.scrollHeight,bsh:document.body.scrollHeight,sw:document.documentElement.scrollWidth,ih:innerHeight,app:document.getElementById('app').getBoundingClientRect().height,
  card:document.getElementById('card').getBoundingClientRect().height, road:document.getElementById('road-today').getBoundingClientRect().height}));
console.log(JSON.stringify(m)); console.log('errors:',errs.length?errs:'none');
if(m.sh!==844||m.bsh!==844) {console.log('FAIL scrollHeight'); process.exitCode=1;}
if(errs.length) process.exitCode=1;
await b.close();
