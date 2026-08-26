import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { MDXComponents } from "mdx/types";
import { beforeAll, describe, expect, it } from "vitest";
import { getAllLessonSlugs, loadLesson } from "@/lib/content/lessons";
import { useMDXComponents } from "@/mdx-components";

/** An MDX module's default export accepts a `components` map at runtime, but
 *  the type `loadLesson` exposes describes it only as a component — so the
 *  prop has to be reintroduced here to call it the way the app does. */
type MDXContent = ComponentType<{ components?: MDXComponents }>;

/**
 * ============================================================
 * Every lesson renders
 * ============================================================
 * `lessons.test.ts` proves every lesson *compiles and evaluates* — that its
 * module loads and exports what it should. That is a different and weaker
 * claim than "the page works", and the gap between them is where the
 * expensive bugs live: a component that throws while rendering imports fine.
 *
 * Two such bugs shipped into this corpus and were caught only by a full
 * `next build`, seven minutes in, one page at a time:
 *
 *   1. `ErrorCorrectionCycle` computed an inner product between a
 *      dimension-8 codeword and a dimension-2 logical state, throwing
 *      "States must have the same dimension for an inner product" the moment
 *      a lesson embedded it.
 *   2. A lesson wrote `e^{iφ}` in bare markdown prose. MDX parses `{iφ}` as a
 *      JSX expression, so the page died with "iφ is not defined" — invisible
 *      in the source, invisible to `tsc`, and invisible to a compile-only
 *      test.
 *
 * Rendering every lesson to static markup catches both in ~80 seconds
 * instead of a seven-minute build that aborts on the first failure and never
 * reveals the second. It is deliberately a *static* render — no jsdom, no new
 * dependency — using the same `react-dom/server` the framework itself uses to
 * prerender these pages, and the real MDX component registry, so what is
 * exercised here is what actually ships.
 *
 * Effects never run in a static render, so this does not exercise canvas
 * drawing, `useEffect`, or event handlers. It covers the render path only —
 * which is exactly the path that turns a build green or red.
 */

let slugs: string[] = [];
const failures: Array<{ slug: string; message: string }> = [];
let rendered = 0;

describe("lesson render integrity", () => {
  beforeAll(async () => {
    slugs = await getAllLessonSlugs();
    const components = useMDXComponents();

    for (const slug of slugs) {
      const mod = await loadLesson(slug);
      if (!mod) continue;
      try {
        renderToStaticMarkup(createElement(mod.default as MDXContent, { components }));
        rendered += 1;
      } catch (error) {
        // Keep going rather than bailing on the first failure: when a shared
        // component breaks, knowing it took out forty lessons rather than one
        // is the difference between a five-minute fix and an afternoon.
        failures.push({ slug, message: (error as Error).message });
      }
    }
  }, 600_000);

  it("renders every authored lesson to static markup without throwing", () => {
    const report = failures
      .map(({ slug, message }) => `${slug}\n    ${message.split("\n")[0]}`)
      .join("\n  ");

    expect(failures.length, `lessons failed to render:\n  ${report}`).toBe(0);
  });

  it("actually rendered the whole corpus (guards the guard)", () => {
    // Without this, a `loadLesson` regression that returned null for
    // everything would make the assertion above pass vacuously.
    expect(rendered).toBe(slugs.length);
    expect(rendered).toBeGreaterThan(200);
  });
});
