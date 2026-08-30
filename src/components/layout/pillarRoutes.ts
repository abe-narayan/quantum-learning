import type { Pillar } from "@/lib/content/types";
import { PILLAR_ORDER, PILLAR_VISUALS } from "@/lib/design/pillars";

/**
 * ============================================================
 * Route <-> pillar lookups for site chrome
 * ============================================================
 * Small helpers shared by Navbar and Footer so "which pillar is the visitor
 * looking at" and "what color dot goes next to this track link" are each
 * computed once, from the single source of truth in `src/lib/design/pillars.ts`,
 * rather than a second hand-maintained table drifting out of sync with it.
 *
 * Both of these are cheap: `PILLAR_VISUALS` is a 6-entry object (a few dozen
 * bytes), not the curriculum. Nothing here imports course/lesson data, so it
 * stays safe to use from client components without shipping the corpus to
 * the browser.
 */

/** Route (e.g. "/mechanics") -> pillar, for tinting a nav/footer link that
 *  points at a pillar's landing page. */
export const ROUTE_TO_PILLAR: Partial<Record<string, Pillar>> = Object.fromEntries(
  PILLAR_ORDER.map((pillar) => [PILLAR_VISUALS[pillar].route, pillar])
);

/**
 * "Where am I" detection for the navbar, from a pathname alone. Three cases:
 *
 * 1. A pillar's own landing route (e.g. `/mechanics`, `/apex`) or anything
 *    nested under it.
 * 2. A lesson route, `/lessons/<pillar>/<course>/<lesson>` — the first path
 *    segment under `/lessons/` IS a `Pillar` value verbatim (lesson content
 *    lives at `src/content/lessons/<pillar>/...`, see
 *    `src/lib/content/lessons.ts`), so detecting it is a string compare
 *    against the six known pillar slugs, not a curriculum lookup.
 *
 * A problem route, `/problems/<slug>`, is deliberately NOT a third case, and
 * the reason is the interesting one. A problem's slug doesn't encode its
 * pillar (`ProblemMeta.slug` is a flat identifier — see
 * `src/lib/problems/types.ts`), so answering it from a pathname alone needs a
 * table: `components/layout/problemPillarIndex.ts` used to hold one row per
 * problem for exactly this. That table was 7.2KB gzip — 7.2% of the whole
 * client-data ceiling in `lib/design/__tests__/clientBoundary.test.ts` — and
 * `Navbar` is in the root layout, so all 823 routes downloaded all 556 rows
 * to tint one badge on 556 of them.
 *
 * The page already publishes the answer. `ProblemLayout` resolves the real
 * pillar on the server (`getProblem(slug) -> getCourse(...).pillar`) and
 * hands it to `<PillarScope pillar>`, which writes it to the module-level
 * `components/field/fieldStore`. `Navbar` reads it from there with
 * `useFieldState()` — see the note on `scopePillar` in Navbar.tsx — so the
 * badge is tinted from the page's own declaration, by subscription, with no
 * table and no fetch.
 */
export function detectPillar(pathname: string): Pillar | undefined {
  const lessonSegment = pathname.match(/^\/lessons\/([^/]+)/)?.[1];
  if (lessonSegment && (PILLAR_ORDER as readonly string[]).includes(lessonSegment)) {
    return lessonSegment as Pillar;
  }
  for (const pillar of PILLAR_ORDER) {
    const route = PILLAR_VISUALS[pillar].route;
    if (pathname === route || pathname.startsWith(`${route}/`)) return pillar;
  }
  return undefined;
}

/** A single problem's page, `/problems/<slug>` — not the `/problems` catalog,
 *  which belongs to no pillar. The one route shape whose pillar `detectPillar`
 *  cannot answer from the path, and so the only one that reads the field
 *  store's scoped pillar instead. */
export function isProblemPage(pathname: string): boolean {
  return /^\/problems\/[^/]+/.test(pathname);
}
