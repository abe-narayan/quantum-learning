#!/usr/bin/env node
/**
 * Can a first-time visitor tell what this page is and what to do, without
 * scrolling?
 *
 * Usage:
 *   node scripts/audit/orientation.mjs [--base http://localhost:3000]
 *                                      [--widths 375,1440] [--routes "/a,/b"]
 *                                      [--json]
 *
 * WHY THIS EXISTS
 * ---------------
 * Every other harness in this directory answers a question about correctness:
 * does this overflow, does this control have a name, does this text clear AA.
 * All of them passed on a homepage whose first screen, measured at 375x812,
 * contained **zero** links or buttons inside `<main>`. Three dense paragraphs
 * and nothing to click. At 1440x900 the only actions were the hero
 * simulation's own preset switches; "Start learning" appeared nowhere except a
 * small navbar button.
 *
 * That is not a bug any correctness check can see, because nothing is broken.
 * It is an orientation failure, and it was the single largest problem with the
 * site. So it gets a measurement of its own.
 *
 * WHAT IT MEASURES, AND WHY EACH ONE
 * ----------------------------------
 * Per route per width, at scroll 0:
 *
 *  - **Actions in the first screen.** Links and buttons inside `<main>` whose
 *    box intersects the viewport. Navbar chrome is deliberately excluded: a
 *    persistent header is not an answer to "what is this page for". A page
 *    with none of these is asking the visitor to scroll on faith.
 *  - **Whether any of them is a *forward* action.** Breadcrumbs are links, and
 *    a first screen whose only actions are three breadcrumbs pointing back the
 *    way you came is not oriented. This is the check that catches the case the
 *    raw count misses.
 *  - **Where the first substantial prose sits**, and whether it is visible.
 *    Read this as "where does continuous reading start", and **not** as "where
 *    does the page's main content start". The two differ on any template whose
 *    primary content is not prose. A problem statement is rendered through
 *    `ScrollableMathText` and is mostly math, so this number lands on a later
 *    paragraph and is a poor proxy for the statement's own box; an early
 *    reading of it here produced a confident "the statement sits at y=840,
 *    below the fold" that was wrong, and the statement's box was found at 557.
 *    When you need a specific element, locate that element.
 *  - **Page height.** Not a defect on its own, but a 38,000px page reached
 *    from "Browse the curriculum" is worth knowing about.
 *
 * WHAT IT REFUSES TO MEASURE
 * --------------------------
 * The status code is fetched separately from the navigation, because a
 * crashed page measures beautifully. During this file's own development a
 * parallel edit put the dev server into a compile error for about a minute,
 * and `/glossary` and `/about` both came back as ordinary pages with two
 * sensible forward actions above the fold. They were the global error
 * boundary's buttons. Nothing in the shape of the result said so.
 *
 * So a 5xx, a missing load event, and a `loading.tsx` skeleton that never
 * cleared are all reported as NOT MEASURED CLEANLY and are excluded from the
 * findings rather than counted as either pass or fail. Under
 * `--require-forward` they fail the run: a check that cannot see the page must
 * never be the reason a run goes green.
 *
 * DELIBERATELY NOT A PASS/FAIL GATE
 * ---------------------------------
 * There is no universally right number of first-screen actions, and a
 * threshold would be cargo-culted into layouts that satisfy it without
 * orienting anyone. This prints a table and exits 0. The one exception is
 * `--require-forward`, which fails when a route's first screen offers no
 * forward action at all: that case has no defensible reading.
 */
import { launchChrome, Page } from "./cdp.mjs";

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const BASE = (getArg("base", "http://localhost:3000") ?? "").replace(/\/+$/, "");
const WIDTHS = (getArg("widths", "375,1440") ?? "").split(",").map((w) => Number(w.trim()));
const AS_JSON = args.includes("--json");
const REQUIRE_FORWARD = args.includes("--require-forward");

/**
 * A private debugging port, not the 9333 the other harnesses default to.
 *
 * `launchChrome` now refuses to attach to a browser it did not spawn, so this
 * is belt and braces rather than the actual guard: it keeps two concurrent
 * runs from contending for the same port in the first place, instead of one of
 * them paying for a probe, a failed spawn and a retry.
 */
const PORT = Number(getArg("port", String(9400 + Math.floor(Math.random() * 400))));

/** One route per template, matching the set the other harnesses walk. */
export const ORIENTATION_ROUTES = [
  "/",
  "/learn",
  "/lessons",
  "/lessons/quantum-computing/qubits-and-quantum-states/what-is-a-qubit",
  "/problems",
  "/problems/bell-state-outcome-probability",
  "/courses/quantum-gates-and-circuits",
  "/simulators",
  "/glossary",
  "/map",
  "/current-quantum",
  "/apex",
  "/about",
];

const ROUTES = getArg("routes", null)?.split(",") ?? ORIENTATION_ROUTES;

const PROBE = String.raw`(() => {
  const main = document.querySelector('main');
  if (!main) return JSON.stringify({ error: 'no main element' });
  const vh = window.innerHeight;
  const onScreen = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return false;
    return r.top < vh && r.bottom > 0;
  };
  const label = (el) => ((el.textContent || '').trim() || el.getAttribute('aria-label') || '')
    .replace(/\s+/g, ' ').slice(0, 40);

  // A breadcrumb points back the way the reader came. It is a link, and it is
  // not an answer to "what do I do here", so it is counted separately.
  const inBreadcrumb = (el) => !!el.closest('nav[aria-label="Breadcrumb"], nav[aria-label="breadcrumb"]');

  // Inputs count. The glossary's first screen holds one link and a filter
  // field, and the field is the primary action on that page: a measure that
  // saw only <a> and <button> would report the glossary as nearly stranded
  // and be wrong about it. Hidden inputs are excluded by the box check below.
  const SELECTOR = 'a[href], button, input, select, textarea, ' +
    '[role="button"], [role="link"], [role="searchbox"]';
  const controls = [...main.querySelectorAll(SELECTOR)]
    .filter((el) => el.type !== 'hidden')
    .filter(onScreen);
  const forward = controls.filter((el) => !inBreadcrumb(el));

  // The first substantial block of text, whatever tag it happens to use.
  //
  // This looked at <p> only, and was wrong about the template it mattered most
  // on. A problem page renders its statement through ScrollableMathText, which
  // emits no <p> at all, so the first <p> found was some later paragraph and
  // the reported position was not the problem statement's. That produced a
  // "first prose at y=840, below the fold" reading for a statement whose box
  // actually started at 557. The number was real and it was measuring the
  // wrong element, which is worse than no number.
  //
  // So: any element with more than 110 characters of text, taking the
  // innermost such element, since every ancestor up to <main> also satisfies
  // the length test and only the innermost one is the text block itself.
  // The test is the element's OWN text, summed over its direct text-node
  // children, not textContent. textContent includes every descendant, so a
  // container holding thirty short links reads as one long passage: that
  // matched a wrapper at y=0 on /learn and reported the page as having its
  // prose below the fold when the prose was fine. Direct text is what makes an
  // element a paragraph rather than a box with paragraphs in it.
  // And it has to be text the reader can actually see. Screen-reader-only
  // copy is long, real prose, and sits in a 1x1 box clipped at the top of the
  // page, so without this filter the first "prose" on /learn, /glossary and
  // the problem page was an sr-only instruction reported at y=0 and therefore
  // as being below the fold. Wrong three times in three different ways before
  // it was right once: first <p> only, then any long textContent, now this.
  const LONG = 110;
  const ownText = (el) =>
    [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent || '')
      .join(' ')
      .trim().length;
  const hidden = (el) => {
    for (let p = el; p; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.visibility === 'hidden' || cs.display === 'none') return true;
      if (cs.clip === 'rect(0px, 0px, 0px, 0px)' || cs.clipPath === 'inset(50%)') return true;
      if (p.getAttribute && p.getAttribute('aria-hidden') === 'true') return true;
    }
    return false;
  };
  const prose = [...main.querySelectorAll('*')].find((el) => {
    if (ownText(el) <= LONG) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    return !hidden(el);
  });
  const h1 = main.querySelector('h1');
  const top = (el) => (el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null);

  return JSON.stringify({
    vh,
    h1: h1 ? label(h1) : null,
    h1Top: top(h1),
    proseTop: top(prose),
    proseOnScreen: prose ? onScreen(prose) : null,
    actions: controls.length,
    forwardActions: forward.length,
    forwardLabels: [...new Set(forward.map(label))].filter(Boolean).slice(0, 6),
    docHeight: document.documentElement.scrollHeight,
  });
})()`;

/** True when whatever was measured is not the page the route names. */
function unusable(r) {
  return Boolean(r.timedOut) || r.skeleton === "stuck" || (r.status !== null && r.status >= 500);
}

function why(r) {
  if (r.status !== null && r.status >= 500) return `HTTP ${r.status}, so this is an error boundary`;
  return r.timedOut ? "no load event" : "skeleton never cleared";
}

async function main() {
  const chrome = await launchChrome({ port: PORT });
  const results = [];
  try {
    for (const width of WIDTHS) {
      const page = await Page.open(chrome.port, {
        width,
        height: width < 700 ? 812 : 900,
        mobile: width < 700,
      });
      for (const route of ROUTES) {
        const url = `${BASE}${route}`;
        // Ask for the status separately, because the DOM cannot be trusted to
        // reveal it. While this file was being written, a parallel agent's
        // half-saved edit put the dev server into a compile error for about a
        // minute, and `/glossary` and `/about` measured as ordinary pages with
        // two sensible forward actions: the numbers were real, they were just
        // the global error boundary's. Nothing in the shape of that result
        // said so, and the first reading of it was almost believed. A 5xx
        // means whatever was measured is not the page.
        let status = null;
        try {
          status = (await fetch(url, { redirect: "follow" })).status;
        } catch {
          // Server down or refused; the navigation below will show it.
        }
        const { timedOut, skeleton } = await page.goto(url);
        let probe;
        try {
          probe = JSON.parse(await page.eval(PROBE));
        } catch (err) {
          probe = { error: String(err.message ?? err) };
        }
        results.push({ width, route, status, timedOut, skeleton, ...probe });
      }
      await page.close();
      process.stderr.write(`  width ${width} done\n`);
    }
  } finally {
    await chrome.close();
  }

  if (AS_JSON) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    for (const width of WIDTHS) {
      console.log(`\n=== ${width}px ===`);
      console.log(
        "route".padEnd(46) + "h1".padStart(6) + "prose".padStart(7) + "seen".padStart(6) +
          "fwd".padStart(5) + "height".padStart(9)
      );
      for (const r of results.filter((r) => r.width === width)) {
        if (r.error) {
          console.log(`${r.route.padEnd(46)}  ERROR ${r.error}`);
          continue;
        }
        console.log(
          r.route.slice(0, 45).padEnd(46) +
            String(r.h1Top ?? "-").padStart(6) +
            String(r.proseTop ?? "-").padStart(7) +
            String(r.proseOnScreen ? "yes" : "NO").padStart(6) +
            String(r.forwardActions).padStart(5) +
            String(r.docHeight).padStart(9)
        );
        if (r.forwardActions === 0) {
          console.log("      no forward action in the first screen");
        }
        // A route still showing its loading.tsx skeleton was measured
        // half-rendered, so its numbers are not evidence of anything. Say so
        // rather than letting a skeleton's empty first screen read as a
        // finding, or its absence of overflow read as a pass.
        if (unusable(r)) console.log(`      NOT MEASURED CLEANLY (${why(r)})`);
        // Not unusable: the not-found page is a real page and measuring it is
        // meaningful. But a route in a sweep list is expected to exist, so a
        // 404 is worth saying out loud rather than reporting its (perfectly
        // good) two buttons as if they were the route's own.
        else if (r.status === 404) console.log("      served the not-found page (404)");
      }
    }
  }

  // Only routes that actually rendered. A stuck skeleton has no forward
  // action either, and counting it here would manufacture a finding.
  const stranded = results.filter((r) => !r.error && !unusable(r) && r.forwardActions === 0);
  if (stranded.length) {
    console.error(
      `\n${stranded.length} route/width pairs offer no forward action in the first screen:`
    );
    for (const r of stranded) console.error(`  ${r.width}px  ${r.route}`);
  }
  // A route whose probe threw is not a route that passed. The first run of
  // this harness against a 404 printed "ERROR no main element" and exited 0
  // under `--require-forward`, because the error path skipped the gate: the
  // page with the *worst* orientation on the site was the one case the gate
  // could not fail on. Errors count.
  const broken = results.filter((r) => r.error || unusable(r));
  if (broken.length) {
    console.error(`\n${broken.length} route/width pairs could not be measured:`);
    for (const r of broken) console.error(`  ${r.width}px  ${r.route}  ${r.error ?? why(r)}`);
  }
  if (REQUIRE_FORWARD && (stranded.length || broken.length)) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
