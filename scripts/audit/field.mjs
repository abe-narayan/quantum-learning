#!/usr/bin/env node
/**
 * How loud is the background environment, really?
 *
 * WHY THIS EXISTS
 * ---------------
 * `docs/DESIGN_SYSTEM.md` §7 states the one rule the field has to keep: "the
 * field may never compete with text… If you cannot comfortably read body copy
 * over it, it is too strong." `regimes.ts` encodes that as
 * `REGIME_ALPHA_CEILING`, a cap on what any single mark may paint, and its
 * docstring reasons the number out against `--foreground` on `--depth-0`.
 *
 * Two things that reasoning cannot see, and this tool can:
 *
 *  1. **Overdraw.** The ceiling binds each mark. A frame composites many of
 *     them, and two marks at 0.5 leave a pixel at 0.75. Measured, the loudest
 *     pixel in a real frame runs 1.3–1.5x the per-mark ceiling, so the layer
 *     as a whole is brighter than the constant that governs it says.
 *  2. **The quiet voices.** `--foreground` is not the only text this site sets
 *     directly on the page ground: a `Lede` is `--muted-foreground` at 20px, a
 *     caption or a unit readout is `--subtle-foreground` at 12px, and both are
 *     routinely on the bare ground with the field behind them. They fail at a
 *     far lower ground luminance than `--foreground` does. This is the same
 *     shape of mistake §2 documents for `--axis`: a token tuned against the
 *     wrong bar because the wrong bar was the one in mind.
 *
 * WHAT IT MEASURES
 * ----------------
 * The canvas's own backing store, per route (and so per regime), sampled over
 * many frames at several scroll positions, composited onto `--depth-0` exactly
 * as the browser does. `getImageData` returns UNPREMULTIPLIED RGBA, so the
 * alpha is applied here rather than trusted to have been applied already —
 * the same trap `responsive.mjs` documents from the other direction.
 *
 * For every regime it reports the peak and the distribution, and the contrast
 * each of the three neutral text voices would get if a glyph landed on the
 * worst pixel. A regime whose worst pixel keeps every voice at 4.5:1 is
 * quiet enough by construction, whatever it draws.
 *
 * It also reports the painted share and the peak alpha, which are the other
 * half of the question. Quiet enough is a floor, not a goal: a field nobody
 * can see passes every assertion here and fails the design brief, and that is
 * exactly what the light theme did at a peak alpha of 11/255. Read the two
 * halves together — the contrast lines say whether the field is safe, the
 * alpha and painted columns say whether it is there.
 *
 * Usage:
 *   node scripts/audit/field.mjs [--routes "/,/software"] [--frames 120]
 */
import { pathToFileURL } from "node:url";

import { launchChrome, Page } from "./cdp.mjs";

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};

const BASE = (getArg("base", "http://localhost:3000") ?? "").replace(/\/+$/, "");
const FRAMES = Number(getArg("frames", "70"));
const WIDTH = Number(getArg("width", "1280"));
const THEME = getArg("theme", "dark");

/**
 * One route per regime. The mapping is not arbitrary: `regimes.ts` has eight
 * renderers and each of these routes declares exactly one of them, so this
 * list is how a regime is reached from the outside.
 */
export const FIELD_ROUTES = [
  ["/", "journey"],
  ["/mechanics", "wave"],
  ["/computing", "state"],
  ["/hardware", "lattice"],
  ["/software", "graph"],
  ["/mastery", "operator"],
  ["/apex", "frontier"],
  ["/lessons", "atlas"],
];

/**
 * The three neutral text voices this site sets directly on the page ground,
 * with nothing between them and the field but the atmosphere. Read out of the
 * live cascade rather than typed, because the light theme is a different
 * palette and not a de-tuned copy of the dark one.
 *
 * Which extreme is dangerous flips with the theme, which is why both are
 * measured. On the dark ground the field *lightens* toward light text, so the
 * brightest painted pixel is the risk; on paper it *darkens* toward dark ink,
 * so the darkest one is.
 */
const VOICE_TOKENS = ["--foreground", "--muted-foreground", "--subtle-foreground"];

const PROBE = String.raw`(async (frames) => {
  const c = document.querySelector('canvas.field-canvas');
  if (!c) return { error: 'no field canvas on this route' };
  const g = c.getContext('2d');
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (r, gg, b) => 0.2126 * lin(r) + 0.7152 * lin(gg) + 0.0722 * lin(b);

  // The ground the canvas is composited onto. Read from the live cascade
  // rather than assumed, so this stays correct under a theme or pillar that
  // moves the ladder (Apex overrides the whole depth ramp).
  const sw = document.createElement('canvas');
  sw.width = 1; sw.height = 1;
  const sc = sw.getContext('2d', { willReadFrequently: true });
  sc.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--depth-0').trim();
  sc.fillRect(0, 0, 1, 1);
  const gp = sc.getImageData(0, 0, 1, 1).data;

  // Every token resolved on the live root, so the light palette is measured
  // as itself.
  const resolve = (name) => {
    sc.fillStyle = '#010203';
    sc.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    sc.clearRect(0, 0, 1, 1);
    sc.fillRect(0, 0, 1, 1);
    const d = sc.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  const voices = {};
  for (const token of ${JSON.stringify(VOICE_TOKENS)}) voices[token] = resolve(token);

  let peak = { L: -1, rgb: [0, 0, 0], alpha: 0 };
  let trough = { L: 2, rgb: [0, 0, 0], alpha: 0 };
  const samples = [];
  let painted = 0;
  let total = 0;
  // The loudest alpha anywhere in the sample, independent of which pixel is
  // the worst for contrast. This is "is the field visible at all", and it is
  // not derivable from the luminance columns: on paper a very dark mark at a
  // near-zero alpha and a mid mark at a healthy one can land on the same
  // luminance while looking nothing alike.
  let maxAlpha = 0;
  for (let f = 0; f < frames; f++) {
    await new Promise((r) => requestAnimationFrame(r));
    const d = g.getImageData(0, 0, c.width, c.height).data;
    // Every 11th pixel. The features that matter are strokes and glows several
    // pixels across; a prime stride avoids sampling in step with a grid.
    for (let i = 0; i < d.length; i += 4 * 11) {
      total++;
      const a = d[i + 3] / 255;
      if (a === 0) continue;
      painted++;
      if (a > maxAlpha) maxAlpha = a;
      const r = d[i] * a + gp[0] * (1 - a);
      const gg = d[i + 1] * a + gp[1] * (1 - a);
      const b = d[i + 2] * a + gp[2] * (1 - a);
      const L = lum(r, gg, b);
      samples.push(L);
      if (L > peak.L) peak = { L, rgb: [Math.round(r), Math.round(gg), Math.round(b)], alpha: +a.toFixed(3) };
      if (L < trough.L) trough = { L, rgb: [Math.round(r), Math.round(gg), Math.round(b)], alpha: +a.toFixed(3) };
    }
  }
  samples.sort((a, b) => a - b);
  const pct = (p) => (samples.length ? samples[Math.min(samples.length - 1, Math.floor(samples.length * p))] : 0);
  return {
    peak,
    trough: trough.L <= 1 ? trough : peak,
    voices,
    maxAlpha,
    paintedShare: total ? painted / total : 0,
    p50: pct(0.5),
    p90: pct(0.9),
    p99: pct(0.99),
    groundL: lum(gp[0], gp[1], gp[2]),
  };
})`;

const lin = (v) => { const x = v / 255; return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

async function main() {
  const only = getArg("routes", null);
  const routes = only
    ? only.split(",").map((r) => [r, "?"])
    : FIELD_ROUTES;

  const chrome = await launchChrome({ port: 9345 });
  let failures = 0;
  try {
    const page = await Page.open(chrome.port, { width: WIDTH, height: 900 });
    await page.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `try{localStorage.setItem("studyquantum:theme",${JSON.stringify(THEME)})}catch(e){}`,
    });
    console.log(
      `\n=== field loudness: ${routes.length} regimes @ ${WIDTH}px, ${THEME} theme, ${FRAMES} frames x 3 scroll positions ===\n`
    );
    for (const [route, regime] of routes) {
      let worst = null;
      let worstRatio = Infinity;
      let missing = false;
      for (const fraction of [0, 0.35, 0.75]) {
        await page.goto(`${BASE}${route}`);
        await page.eval(`window.scrollTo(0, Math.round((document.documentElement.scrollHeight - window.innerHeight) * ${fraction}))`);
        // Long enough for a cold `next dev` route to finish compiling,
        // hydrate and mount the canvas. At 500ms a route being compiled for
        // the first time reported "no field canvas", which — before the
        // `missing` bookkeeping below — was then skipped, and the run still
        // printed "every regime clears AA for every voice" having measured
        // two of the eight. A harness that reads a page that has not
        // rendered as a pass is the exact failure mode this directory's
        // header warns about.
        await new Promise((r) => setTimeout(r, 1200));
        const result = await page.eval(`(${PROBE})(${FRAMES})`);
        if (result.error) {
          console.log(`${route} (${regime}): ${result.error}`);
          worst = null;
          missing = true;
          break;
        }
        // Whichever extreme is closest in luminance to any voice is the one
        // that decides this regime, and which extreme that is depends on the
        // theme rather than on an assumption about it.
        const ratio = Math.min(
          ...VOICE_TOKENS.map((t) =>
            Math.min(contrast(lum(result.voices[t]), result.peak.L), contrast(lum(result.voices[t]), result.trough.L))
          )
        );
        if (!worst || ratio < worstRatio) {
          worst = result;
          worstRatio = ratio;
        }
      }
      if (missing) failures++;
      if (!worst) continue;
      // A canvas that exists and painted nothing used to sail through: every
      // voice trivially clears AA against a ground the field never touched,
      // and the run printed a pass. That is the same failure the alpha column
      // exists to make visible, so it is an error rather than a note — the
      // one case it legitimately fires on (`prefers-reduced-motion`, where
      // the field paints a single static frame) still paints, so a zero here
      // means a regime that drew nothing.
      if (worst.paintedShare === 0) {
        console.log(`${route.padEnd(12)} ${regime.padEnd(9)} FAILS: the canvas painted no pixels\n`);
        failures++;
        continue;
      }

      let scale = 1;
      const lines = VOICE_TOKENS.map((token) => {
        const voiceL = lum(worst.voices[token]);
        const against = contrast(voiceL, worst.peak.L) <= contrast(voiceL, worst.trough.L) ? worst.peak : worst.trough;
        const ratio = contrast(voiceL, against.L);
        const ok = ratio >= 4.5;
        if (!ok) {
          failures++;
          // The uniform factor this regime's alphas would have to be scaled
          // by for that pixel to clear this voice. Reported because it is the
          // number a fix is actually made of. Alpha scales the 8-bit value,
          // and luminance goes as roughly the 2.4 power of it — toward the
          // ground in both directions, so the same exponent serves paper.
          // Which side of the text the ground is on decides the formula.
          // Light text on a dark ground needs the ground BELOW a ceiling;
          // dark ink on paper needs it ABOVE a floor. Using the first form
          // for both is how this printed "needs x1.000" for eight light-theme
          // regimes it had just reported as failing.
          const limit =
            voiceL < worst.groundL ? 4.5 * (voiceL + 0.05) - 0.05 : (voiceL + 0.05) / 4.5 - 0.05;
          const distance = Math.abs(against.L - worst.groundL);
          const allowed = Math.abs(limit - worst.groundL);
          if (distance > 0) scale = Math.min(scale, Math.pow(Math.min(1, allowed / distance), 1 / 2.4));
        }
        return `      ${token.padEnd(22)} ${ratio.toFixed(2)}:1  ${ok ? "ok" : "FAILS AA"}`;
      });
      // Peak alpha is reported alongside the luminances because the two
      // answer different questions and only one of them is the contrast
      // budget. Luminance says whether the field is *safe*;
      // alpha, in 8-bit units of the canvas's own backing store, says whether
      // it is *there* at all — and the two come apart hard between themes,
      // because a mark on paper spends far more contrast per unit alpha than
      // the same mark on the dark ground does. A light theme sitting at the
      // AA line with a peak alpha of 11/255 is the shape of that failure, and
      // nothing in the luminance columns shows it.
      const alpha8 = (a) => `${Math.round(a * 255)}/255`;
      console.log(
        `${route.padEnd(12)} ${regime.padEnd(9)} painted ${(worst.paintedShare * 100).toFixed(2)}%  ` +
          `L p50=${worst.p50.toFixed(4)} p90=${worst.p90.toFixed(4)} p99=${worst.p99.toFixed(4)} ` +
          `peak=${worst.peak.L.toFixed(4)} trough=${worst.trough.L.toFixed(4)} ground=${worst.groundL.toFixed(4)} ` +
          `(worst rgb ${worst.peak.rgb.join(",")} / ${worst.trough.rgb.join(",")}` +
          `, peak alpha ${alpha8(worst.maxAlpha)})`
      );
      console.log(lines.join("\n"));
      console.log(`      needs x${scale.toFixed(3)} to clear every voice\n`);
    }
    await page.close();
  } finally {
    await chrome.close();
  }
  console.log(
    failures
      ? `${failures} regime failures (a voice below AA, or a regime that never rendered)`
      : "every regime clears AA for every voice"
  );
  process.exit(failures ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(2);
  });
}
