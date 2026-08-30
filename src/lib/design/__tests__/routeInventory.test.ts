import { describe, expect, it } from "vitest";

import { DEFAULT_ROUTES } from "../../../../scripts/audit/responsive.mjs";
import { A11Y_ROUTES } from "../../../../scripts/audit/a11y.mjs";
import { COURSES } from "@/lib/content/curriculum";
import { LESSON_METAS } from "@/lib/content/lessonMeta.generated";
import { PROBLEM_METAS } from "@/lib/problems/problemMeta.generated";
import { PILLAR_ORDER, PILLAR_VISUALS } from "@/lib/design/pillars";

/**
 * Every route the responsive/accessibility audit visits must be a page that
 * actually exists.
 *
 * This guards a failure mode that is worse than a broken test, because it
 * looks like success. `scripts/audit/responsive.mjs` renders each route in
 * headless Chrome and reports overflow, contrast and console errors. If a
 * route 404s, the audit happily measures the **not-found page** instead, and
 * the not-found page is a short, centred, single-column layout with no wide
 * figures, no equations and no simulators. It has no overflow and no contrast
 * failures at any width. So a single typo in that list silently converts a
 * real audit into a clean bill of health for a page nobody ships.
 *
 * That is not hypothetical: `/problems/bell-state-measurement-correlations`
 * was in the list on 2026-08-30 and had never existed. Every "no findings"
 * that route ever produced was measuring the 404 page.
 *
 * Checking the slugs against the registries here, rather than fetching them,
 * keeps this a fast unit test with no dev server and no network: the
 * registries are the same data `generateStaticParams` builds the routes from,
 * so agreeing with them is the same thing as the page existing.
 */

// A pillar's landing route is NOT `/${pillar}`: the six live at /mechanics,
// /computing, /hardware, /software, /mastery and /apex, and the mapping is
// owned by `PILLAR_VISUALS[pillar].route`. Deriving it here rather than
// retyping the six keeps this test from being a second table that can drift.
const PILLAR_ROUTES = new Set(PILLAR_ORDER.map((pillar) => PILLAR_VISUALS[pillar].route));

/** Routes with no dynamic segment, kept in sync with `src/app/**` by hand. */
const STATIC_ROUTES = new Set([
  "/",
  "/about",
  "/learn",
  "/lessons",
  "/simulators",
  "/problems",
  "/glossary",
  "/map",
  "/current-quantum",
]);

describe("the audit route inventory", () => {
  it("is not empty, and covers more than one template", () => {
    expect(DEFAULT_ROUTES.length).toBeGreaterThan(10);
    expect(new Set(DEFAULT_ROUTES).size).toBe(DEFAULT_ROUTES.length);
  });

  it("points every route at a page that exists", () => {
    const lessonSlugs = new Set(LESSON_METAS.map((lesson) => lesson.slug));
    const problemSlugs = new Set(PROBLEM_METAS.map((problem) => problem.slug));
    const courseSlugs = new Set(COURSES.map((course) => course.slug));

    const unresolved: string[] = [];

    for (const route of DEFAULT_ROUTES) {
      if (STATIC_ROUTES.has(route) || PILLAR_ROUTES.has(route)) continue;

      if (route.startsWith("/lessons/")) {
        const slug = route.slice("/lessons/".length);
        if (!lessonSlugs.has(slug)) unresolved.push(`${route} (no lesson "${slug}")`);
        continue;
      }
      if (route.startsWith("/problems/")) {
        const slug = route.slice("/problems/".length);
        if (!problemSlugs.has(slug)) unresolved.push(`${route} (no problem "${slug}")`);
        continue;
      }
      if (route.startsWith("/courses/")) {
        const slug = route.slice("/courses/".length);
        if (!courseSlugs.has(slug)) unresolved.push(`${route} (no course "${slug}")`);
        continue;
      }
      unresolved.push(`${route} (not a known static, pillar, lesson, problem or course route)`);
    }

    expect(
      unresolved,
      "these audit routes do not resolve to a real page, so the audit is " +
        "measuring the 404 page for them and reporting it as clean"
    ).toEqual([]);
  });

  it("still audits every pillar landing page", () => {
    for (const pillar of PILLAR_ORDER) {
      const route = PILLAR_VISUALS[pillar].route;
      expect(
        DEFAULT_ROUTES,
        `no audit route covers the ${pillar} pillar landing page (${route})`
      ).toContain(route);
    }
  });

  it("audits at least one lesson, one problem and one course detail page", () => {
    expect(DEFAULT_ROUTES.some((r) => r.startsWith("/lessons/"))).toBe(true);
    expect(DEFAULT_ROUTES.some((r) => r.startsWith("/problems/"))).toBe(true);
    expect(DEFAULT_ROUTES.some((r) => r.startsWith("/courses/"))).toBe(true);
  });

  /**
   * `scripts/audit/a11y.mjs` visits a shorter list, because its checks are
   * per-interaction rather than per-layout and cost seconds each. Rather than
   * validate that list a second way, it is required to be a subset of the one
   * above — so the resolution check already written stands for both, and an
   * a11y route can never be a slug nothing verifies.
   */
  it("keeps the accessibility route list a subset of the audited routes", () => {
    const audited = new Set(DEFAULT_ROUTES);
    const strays = A11Y_ROUTES.filter((route: string) => !audited.has(route));
    expect(
      strays,
      "these a11y audit routes are not in DEFAULT_ROUTES, so nothing checks " +
        "that they resolve to a real page"
    ).toEqual([]);
    expect(A11Y_ROUTES.length).toBeGreaterThan(5);
  });
});
