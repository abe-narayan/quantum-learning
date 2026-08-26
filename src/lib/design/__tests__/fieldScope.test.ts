import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * ============================================================
 * Every route declares its background environment
 * ============================================================
 * The background field renders whichever regime the current page declared,
 * via `<PillarScope>`. A route that declares nothing does not get "no
 * background" — it inherits whatever the module store's default happens to
 * be, and it gets no `.atmosphere` layer at all, so it sits on flat
 * `--depth-0` while every other page has depth behind it.
 *
 * That is not hypothetical either. Six routes (learn, glossary, map,
 * problems, problems/[slug], about) shipped with no `<PillarScope>` while the
 * store's default was `journey` — the *homepage's* six-pillar curriculum
 * crossfade. Scrolling the alphabetical glossary from "Amplitude" to "Zeeman"
 * played wave → state → lattice → graph → operator → frontier behind it, for
 * no reason connected to the content: decorative motion with no educational
 * payload, which the design system explicitly forbids. See
 * `docs/UX_REVIEW.md` P1-2.
 *
 * The default is now the neutral `atlas` regime, but "every route says what
 * it wants" is the actual invariant, and it is the one worth pinning.
 */

const APP_DIR = path.resolve(import.meta.dirname, "../../../app");
const COMPONENTS_DIR = path.resolve(import.meta.dirname, "../../../components");

/**
 * Routes that legitimately render no `<PillarScope>` of their own, and what
 * supplies it instead. Anything not listed here must declare its own.
 */
const DELEGATES_TO: Record<string, { component: string; why: string }> = {
  "lessons/[...slug]/page.tsx": {
    component: "lessons/LessonLayout.tsx",
    why: "LessonLayout scopes to the lesson's course pillar, which the route itself does not resolve",
  },
  "problems/[slug]/page.tsx": {
    component: "problems/ProblemLayout.tsx",
    why: "ProblemLayout scopes to the problem's course pillar; a second route-level scope would double-paint the atmosphere layer",
  },
};

/** Routes with no UI at all. */
const NO_UI: Record<string, string> = {
  "lessons/page.tsx": "a permanentRedirect stub — renders nothing",
};

function findPages(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findPages(full, out);
    else if (entry.name === "page.tsx") out.push(full);
  }
  return out;
}

const PAGES = findPages(APP_DIR);

describe("background field scope", () => {
  it("finds the App Router pages (guards the guard)", () => {
    expect(PAGES.length).toBeGreaterThan(10);
  });

  it("has every route declare a field scope, directly or through its layout", () => {
    const missing: string[] = [];

    for (const page of PAGES) {
      const key = path.relative(APP_DIR, page).replace(/\\/g, "/");
      const source = readFileSync(page, "utf8");

      if (source.includes("PillarScope")) continue;
      if (key in NO_UI) continue;

      const delegate = DELEGATES_TO[key];
      if (!delegate) {
        missing.push(`${key} renders no <PillarScope> and is not a documented exception`);
        continue;
      }

      // A delegation is only real if the component it names actually does it.
      const componentSource = readFileSync(path.join(COMPONENTS_DIR, delegate.component), "utf8");
      if (!componentSource.includes("PillarScope")) {
        missing.push(
          `${key} delegates to ${delegate.component}, but that component no longer renders <PillarScope>`,
        );
      }
    }

    expect(
      missing,
      "a route with no field scope gets no atmosphere layer and inherits whatever regime was last set",
    ).toEqual([]);
  });

  it("keeps the `journey` regime exclusive to the homepage", () => {
    // `journey` crossfades the six pillars in curriculum order across the
    // document's scroll range. It means something only where scroll position
    // genuinely tracks a descent through the curriculum — i.e. the homepage.
    // Anywhere else it is motion with no referent.
    const declaring = PAGES.filter((page) => /regime=["']journey["']/.test(readFileSync(page, "utf8")))
      .map((page) => path.relative(APP_DIR, page).replace(/\\/g, "/"));

    expect(declaring).toEqual(["page.tsx"]);
  });
});
