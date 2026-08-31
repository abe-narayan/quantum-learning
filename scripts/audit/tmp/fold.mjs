import { launchChrome, Page } from "../cdp.mjs";
const chrome = await launchChrome({ port: 9711 });
const routes = [
  ["/", "home"],
  ["/lessons/quantum-computing/qubits-and-quantum-states/what-is-a-qubit", "lesson"],
  ["/problems/bell-state-outcome-probability", "problem"],
  ["/courses/quantum-gates-and-circuits", "course"],
  ["/learn", "learn"],
  ["/simulators", "simulators"],
  ["/problems", "problem-index"],
];
const probe = `(() => {
  const m = document.querySelector('main'); if(!m) return 'no main';
  const vh = window.innerHeight;
  const inFold = el => { const r = el.getBoundingClientRect(); return r.top < vh && r.bottom > 0 && r.width > 0 && r.height > 0; };
  const actions = [...m.querySelectorAll('a[href],button')].filter(inFold).map(e=>(e.textContent||'').trim().slice(0,28)).filter(Boolean);
  // first substantial prose paragraph
  const p = [...m.querySelectorAll('p')].find(el => (el.textContent||'').trim().length > 110);
  const h1 = m.querySelector('h1');
  const y = el => el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
  return JSON.stringify({
    vh, h1: h1 ? (h1.textContent||'').trim().slice(0,34) : null, h1Y: y(h1),
    firstProseY: y(p), proseInFold: p ? inFold(p) : null,
    actionsInFold: [...new Set(actions)].slice(0,8), nActions: new Set(actions).size,
    docH: document.documentElement.scrollHeight
  });
})()`;
for (const w of [375, 1440]) {
  console.log(`\n########## ${w}px ##########`);
  const page = await Page.open(chrome.port, { width: w, height: w === 375 ? 812 : 900, mobile: w < 700 });
  for (const [r, name] of routes) {
    await page.goto("http://localhost:3000" + r, { settleMs: 1800 });
    console.log(name.padEnd(14), await page.eval(probe));
  }
  await page.close();
}
await chrome.close();
