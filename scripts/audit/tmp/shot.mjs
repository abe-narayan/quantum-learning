import { launchChrome, Page } from "../cdp.mjs";
import { writeFileSync } from "node:fs";
const OUT="C:/Users/abena/AppData/Local/Temp/claude/C--Users-abena-quantum-learning/a1d8ad48-df60-4a47-94d0-ad97cf74cd85/scratchpad";
const chrome = await launchChrome({ port: 9701 });
for (const [w,h,name] of [[1440,900,"home-desktop"],[375,812,"home-mobile"]]) {
  const page = await Page.open(chrome.port, { width: w, height: h, mobile: w<700 });
  await page.goto("http://localhost:3000/", { settleMs: 3000 });
  writeFileSync(`${OUT}/${name}.png`, await page.screenshot());
  const info = await page.eval(`(() => {
    const m=document.querySelector('main');
    const vh=window.innerHeight;
    const inFold=[...m.querySelectorAll('a[href],button')].filter(e=>{const r=e.getBoundingClientRect();return r.top<vh&&r.bottom>0&&r.width>0;}).map(e=>e.textContent.trim().slice(0,32)).filter(Boolean);
    return JSON.stringify({viewport:[window.innerWidth,vh], actionsInFirstScreen:[...new Set(inFold)], docHeight:document.documentElement.scrollHeight});
  })()`);
  console.log(name, info);
  await page.close();
}
await chrome.close();
