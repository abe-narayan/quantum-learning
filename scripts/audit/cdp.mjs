/**
 * A dependency-free Chrome DevTools Protocol client.
 *
 * WHY THIS EXISTS
 * ---------------
 * The responsive, accessibility and console audits this repo needs are
 * assertions about a *rendered page at a given viewport width*: does anything
 * overflow 320px, is the tap target 44px, did the console throw during
 * hydration. None of that is answerable from the source, and jsdom does not
 * lay out, so `vitest` alone cannot see any of it. The site also sets
 * `X-Frame-Options: DENY` and `frame-ancestors 'none'` (correctly), so the
 * cheap trick of measuring a narrow iframe from a normal tab is closed too.
 *
 * Playwright and Puppeteer both solve this, and both cost a devDependency plus
 * a browser download in CI. Chrome is already installed on any machine that
 * develops this site, Node 22+ ships a global `WebSocket`, and CDP is a
 * stable, documented JSON protocol. So this is about ninety lines instead of a
 * dependency, and `npm ci` stays exactly as fast as it was.
 *
 * Scope: enough CDP to open a page at an emulated device width, wait for it to
 * settle, evaluate expressions in it, and collect console errors. Deliberately
 * not a browser-automation library. If this file starts growing clicks,
 * selectors and retries, that is the signal to take the Playwright dependency
 * instead of reinventing it badly here.
 */
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

export function findChrome() {
  const found = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!found) throw new Error(`Could not find Chrome. Looked in:\n  ${CHROME_CANDIDATES.join("\n  ")}`);
  return found;
}

/** Launches a private, headless Chrome and resolves once its CDP port answers. */
/** Does something already answer CDP on this port? */
async function portIsBusy(port) {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/json/version`, {
      signal: AbortSignal.timeout(1500),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function launchChrome({ port = 9333 } = {}) {
  // Find a port nobody is on before spawning.
  //
  // The readiness poll below decides Chrome is up when `/json/version`
  // answers, and an *already running* Chrome answers it instantly. So when the
  // port was taken, the spawned Chrome failed to bind, exited, and every
  // command after that drove the other run's tabs: two audits interleaved and
  // reported plausible nonsense rather than failing. Each harness picks a
  // different default port, which is enough until two copies of the *same*
  // harness run at once, which is routine when several agents work in
  // parallel.
  let chosen = port;
  for (let attempt = 0; attempt < 20 && (await portIsBusy(chosen)); attempt += 1) {
    chosen = 9400 + Math.floor(Math.random() * 400);
  }
  if (await portIsBusy(chosen)) {
    throw new Error(`no free debugging port found near ${port}`);
  }
  if (chosen !== port) {
    process.stderr.write(`  port ${port} was busy; using ${chosen}\n`);
  }
  port = chosen;

  const userDataDir = mkdtempSync(path.join(tmpdir(), "sq-audit-"));
  const proc = spawn(
    findChrome(),
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--disable-background-networking",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "about:blank",
    ],
    { stdio: "ignore", detached: false }
  );

  // Closes the race the check above cannot: two runs can both find the port
  // free and then both spawn, and the loser exits instead of binding. If our
  // own child is gone, a port that answers is somebody else's browser, and
  // attaching to it is the failure this whole guard exists to prevent.
  let exited = false;
  proc.on("exit", () => {
    exited = true;
  });

  const deadline = Date.now() + 30_000;
  for (;;) {
    if (exited) {
      throw new Error(
        `Chrome exited before port ${port} answered; another browser probably holds it`
      );
    }
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) break;
    } catch {
      // Chrome has not opened the port yet.
    }
    if (Date.now() > deadline) {
      proc.kill();
      throw new Error("Chrome did not open its debugging port within 30s");
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  return {
    port,
    async close() {
      try {
        proc.kill();
      } catch {
        // Already gone.
      }
      // Chrome holds the profile directory briefly after exit on Windows.
      await new Promise((r) => setTimeout(r, 400));
      try {
        rmSync(userDataDir, { recursive: true, force: true });
      } catch {
        // A leftover temp profile is not worth failing an audit over.
      }
    },
  };
}

/** One CDP target (tab), with the handful of domains these audits use. */
export class Page {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.consoleMessages = [];
    this.pageErrors = [];

    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(`${msg.error.message} (${JSON.stringify(msg.error.data ?? "")})`));
        else resolve(msg.result);
        return;
      }
      if (msg.method === "Runtime.consoleAPICalled") {
        this.consoleMessages.push({
          type: msg.params.type,
          text: msg.params.args.map((a) => a.value ?? a.description ?? a.type).join(" "),
        });
      }
      if (msg.method === "Runtime.exceptionThrown") {
        const d = msg.params.exceptionDetails;
        this.pageErrors.push(d.exception?.description ?? d.text);
      }
    });
  }

  static async open(port, { width, height = 900, mobile = false, deviceScaleFactor = 1 } = {}) {
    const res = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
    const target = await res.json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve, { once: true });
      ws.addEventListener("error", reject, { once: true });
    });
    const page = new Page(ws);
    page.targetId = target.id;
    page.port = port;
    await page.send("Page.enable");
    await page.send("Runtime.enable");
    if (width) {
      await page.send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor,
        mobile,
      });
    }
    return page;
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP timeout: ${method}`));
        }
      }, 60_000);
    });
  }

  /**
   * Navigates and waits for the load event, then for a short quiet period.
   * The quiet period matters: this site reveals content with an
   * IntersectionObserver and mounts simulators lazily, so measuring at `load`
   * measures a page that is still opacity-0 and half-empty.
   */
  async goto(url, { settleMs = 1200, skeletonTimeoutMs = 8000 } = {}) {
    this.consoleMessages.length = 0;
    this.pageErrors.length = 0;

    // Both exits have to tear down both resources, and the first version of
    // this tore down neither on the timeout path and left the timer running
    // on the load path. One `Page` serves every route in a sweep, so each
    // navigation slower than 45s leaked a listener that then ran `JSON.parse`
    // on every CDP frame for the rest of the run. That is self-amplifying: a
    // run that gets slow gets slower, and a 19-route sweep surfaced it as
    // `MaxListenersExceededWarning: 11 message listeners added to WebSocket`
    // after stalling with several agents competing for the machine.
    const loaded = new Promise((resolve) => {
      let timer;
      const done = (timedOut) => {
        this.ws.removeEventListener("message", onMessage);
        clearTimeout(timer);
        resolve(timedOut);
      };
      const onMessage = (event) => {
        if (JSON.parse(event.data).method === "Page.loadEventFired") done(false);
      };
      this.ws.addEventListener("message", onMessage);
      timer = setTimeout(() => done(true), 45_000);
    });
    await this.send("Page.navigate", { url });
    const timedOut = await loaded;
    await new Promise((r) => setTimeout(r, settleMs));
    const skeleton = await this.waitForContent({ timeoutMs: skeletonTimeoutMs });
    // Reported, not swallowed. A route that never fired `load`, or that is
    // still showing its `loading.tsx` skeleton, is measured anyway from a
    // half-rendered page, and its findings then read as clean — the same shape
    // of failure as an audit route that 404s and reports the not-found page as
    // having no defects. The caller has to be able to say so out loud.
    return { timedOut, skeleton };
  }

  /**
   * Waits until the route's `loading.tsx` skeleton is gone, and reports
   * whether it ever left.
   *
   * `Page.loadEventFired` plus a fixed settle is not enough. In dev, a
   * streamed RSC response fires `load` while the skeleton is still on screen,
   * so a harness that measures at that moment measures the skeleton. That
   * produced three false `h1-count: 0 visible h1` blockers on `/simulators`,
   * `/glossary` and `/map`, all of which serve exactly one `<h1>` and none of
   * whose skeletons contain any heading at all.
   *
   * **The false blocker is the visible half of the problem and the smaller
   * one.** Every other check on those routes also ran against the skeleton, so
   * a *clean* result there was equally meaningless. A check that can silently
   * pass is worse than one that noisily fails.
   *
   * Every `loading.tsx` in this app renders a `role="status"` line beginning
   * "Loading", added so screen-reader users are not left in silence during a
   * navigation. That accessibility affordance is also the most reliable
   * readiness signal available, and it is one the skeletons cannot lose
   * without failing their own audit.
   */
  async waitForContent({ timeoutMs = 8000, pollMs = 150 } = {}) {
    // `/^loading/i`, deliberately without a `\b`. This probe is a template
    // literal, and `\b` inside one is the BACKSPACE character (U+0008), not a
    // regex word boundary: the regex silently became `/^loading` followed by a
    // literal U+0008, which matched nothing, so the gate reported every route
    // as ready. Same hazard CLAUDE.md records for shell heredocs, reached a
    // different way, and it fails exactly as quietly. A prefix match is
    // sufficient here and cannot be broken the same way.
    const probe = `(() => [...document.querySelectorAll('[role="status"]')]
      .some((el) => /^loading/i.test((el.textContent || "").trim())))()`;
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      let stillLoading;
      try {
        stillLoading = await this.eval(probe);
      } catch {
        return "unknown";
      }
      if (!stillLoading) return "cleared";
      if (Date.now() > deadline) return "stuck";
      await new Promise((r) => setTimeout(r, pollMs));
    }
  }

  /** Evaluates an expression in the page and returns its JSON value. */
  async eval(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) {
      throw new Error(
        result.exceptionDetails.exception?.description ?? result.exceptionDetails.text
      );
    }
    return result.result.value;
  }

  /** The viewport as a PNG. `raw: true` skips the Buffer and returns base64,
   *  which is what you want when the picture is going straight back into the
   *  page to be decoded there (see the paint-contrast check in a11y.mjs). */
  async screenshot({ raw = false } = {}) {
    const { data } = await this.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    return raw ? data : Buffer.from(data, "base64");
  }

  /**
   * Emulates CSS media features for the whole page, e.g.
   * `emulateMedia([{ name: "prefers-reduced-motion", value: "reduce" }])`.
   *
   * This is the only honest way to test the reduced-motion contract. Reading
   * globals.css tells you a `@media (prefers-reduced-motion: reduce)` block
   * exists; it does not tell you whether an unlayered rule elsewhere outranks
   * it, whether a rAF loop ignores it, or whether "stopped" actually means
   * "slowed to 0.01ms and still running". Pass `[]` to clear.
   */
  emulateMedia(features) {
    return this.send("Emulation.setEmulatedMedia", { features });
  }

  /**
   * Presses one key, as a real user would: a keydown/keyup pair through the
   * browser's input pipeline, so the browser's own sequential-focus
   * navigation runs. Evaluating `document.querySelectorAll(focusable)` and
   * calling it a tab order is a guess; this is the tab order.
   */
  async pressKey(key) {
    const map = {
      Tab: { windowsVirtualKeyCode: 9, code: "Tab", key: "Tab", text: "\t" },
      Escape: { windowsVirtualKeyCode: 27, code: "Escape", key: "Escape" },
      Enter: { windowsVirtualKeyCode: 13, code: "Enter", key: "Enter", text: "\r" },
    };
    const spec = map[key];
    if (!spec) throw new Error(`pressKey: unmapped key ${key}`);
    const modifiers = 0;
    await this.send("Input.dispatchKeyEvent", { type: "rawKeyDown", modifiers, ...spec });
    if (spec.text) await this.send("Input.dispatchKeyEvent", { type: "char", modifiers, ...spec });
    await this.send("Input.dispatchKeyEvent", { type: "keyUp", modifiers, ...spec });
    // One frame, so React state changes from the keypress have landed before
    // the caller reads `document.activeElement`.
    await new Promise((r) => setTimeout(r, 30));
  }

  /**
   * Chrome's own computed accessibility tree. The point of using this rather
   * than reading `aria-label` out of the DOM is that the computed name is the
   * thing a screen reader actually says, and the accname algorithm has
   * several results a source read does not predict: an `aria-label` on a
   * generic element is discarded entirely, a link wrapping a figure and three
   * paragraphs is named by all of them concatenated, and KaTeX markup names
   * itself from whatever text nodes it happened to leave visible.
   */
  async axTree() {
    await this.send("Accessibility.enable");
    const { nodes } = await this.send("Accessibility.getFullAXTree");
    return nodes;
  }

  async close() {
    try {
      await fetch(`http://127.0.0.1:${this.port}/json/close/${this.targetId}`);
    } catch {
      // The tab may already be gone.
    }
    try {
      this.ws.close();
    } catch {
      // Ditto.
    }
  }
}
