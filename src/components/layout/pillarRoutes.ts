import type { Pillar } from "@/lib/content/types";
import { PILLAR_ORDER, PILLAR_VISUALS } from "@/lib/design/pillars";
import { problemPillar } from "./problemPillarIndex";

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
 * 3. A problem route, `/problems/<slug>`. Unlike lessons, a problem's slug
 *    doesn't encode its pillar (`ProblemMeta.slug` is a flat identifier —
 *    see `src/lib/problems/types.ts`), so this can't be a string compare.
 *    `ProblemLayout` (a server component) resolves the real pillar via
 *    `getProblem(slug) -> getCourse(...).pillar` and scopes the page's
 *    background/accent/focus-ring color to it — `./problemPillarIndex.ts`
 *    is a small, chrome-only slug -> pillar table (deliberately *not* an
 *    import of `@/lib/problems/registry`, which would bundle the entire
 *    problem corpus — every question, hint and worked solution — into the
 *    client just for this badge) so the navbar can agree with it.
 */
export function detectPillar(pathname: string): Pillar | undefined {
  const lessonSegment = pathname.match(/^\/lessons\/([^/]+)/)?.[1];
  if (lessonSegment && (PILLAR_ORDER as readonly string[]).includes(lessonSegment)) {
    return lessonSegment as Pillar;
  }
  const problemSlug = pathname.match(/^\/problems\/([^/]+)/)?.[1];
  if (problemSlug) {
    return problemPillar(problemSlug);
  }
  for (const pillar of PILLAR_ORDER) {
    const route = PILLAR_VISUALS[pillar].route;
    if (pathname === route || pathname.startsWith(`${route}/`)) return pillar;
  }
  return undefined;
}
