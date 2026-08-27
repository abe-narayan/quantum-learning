import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { NAV_ITEMS, TRACK_NAV_ITEMS } from "@/lib/nav";
import { COURSES } from "@/lib/content/curriculum";

/**
 * ============================================================
 * Route inventory consistency
 * ============================================================
 * Three lists have to agree about what pages exist, and nothing makes them:
 *
 *   - the App Router directory tree (what actually exists),
 *   - `src/lib/nav.ts` (what a visitor can navigate to),
 *   - `src/app/sitemap.ts`'s `STATIC_ROUTES` (what a crawler is told about).
 *
 * A page missing from the sitemap is invisible to search with no symptom
 * anywhere — no broken link, no failing build, nothing in the UI. That is
 * exactly what happened to `/current-quantum`: a whole section of the site,
 * linked from the main nav, absent from the sitemap. `/mastery` had the same
 * shape of problem earlier in this sprint (it existed in the pillar table
 * before it had a page at all).
 *
 * ---------------------------------------------------------------
 * Why this file reads source text instead of importing the modules
 * ---------------------------------------------------------------
 * This is load-bearing, not a stylistic choice. `src/app/sitemap.ts` and
 * `src/app/courses/[slug]/page.tsx` both call `getAllLessonSlugs()` /
 * `getAllLessonsMeta()`, which dynamically import every lesson in
 * `src/content/lessons/**`. Under Vitest those .mdx files have no build
 * cache: `vitest.config.ts`'s `mdx()` plugin recompiles all ~219 of them
 * in-process through remark-math + rehype-katex on first import. Measured
 * on this machine, a single test that touches that corpus
 * (`src/lib/content/__tests__/lessons.test.ts`) takes **56.5s** — right up
 * against the 60s `testTimeout`, which is why a route test that imported
 * the sitemap module intermittently "timed out at 60s" (see
 * docs/A11Y_AUDIT.md, "What I could not check"). The cause was never the 32
 * `/courses/[slug]` static params; it was the lesson corpus behind them.
 *
 * So: everything here is either a filesystem `readdir`/`readFileSync` or an
 * import of `@/lib/nav` / `@/lib/content/curriculum` — both plain data
 * modules with no content-registry dependency. The last test in this file
 * enforces that. If you need to assert something about the *rendered*
 * sitemap or a *rendered* course page, put it in a test alongside the
 * content suite where the 56s is already being paid, not here.
 */

const APP_DIR = path.resolve(import.meta.dirname, "../../../app");
const SRC_DIR = path.resolve(import.meta.dirname, "../../..");

/** Every source file this suite reads, read at most once. The suite reads a
 *  handful of files repeatedly across six tests; memoizing keeps the whole
 *  file in the low hundreds of milliseconds. */
const sourceCache = new Map<string, string>();
function source(absolutePath: string): string {
  let text = sourceCache.get(absolutePath);
  if (text === undefined) {
    text = readFileSync(absolutePath, "utf8");
    sourceCache.set(absolutePath, text);
  }
  return text;
}

const SITEMAP_PATH = path.join(APP_DIR, "sitemap.ts");
const COURSE_ROUTE = path.join(APP_DIR, "courses", "[slug]", "page.tsx");

/** The `STATIC_ROUTES` array, parsed out of the real sitemap source. */
function sitemapRoutes(): string[] {
  const block = source(SITEMAP_PATH).match(/const STATIC_ROUTES = \[([\s\S]*?)\]/);
  if (!block) throw new Error("STATIC_ROUTES not found in src/app/sitemap.ts");
  return [...block[1].matchAll(/"([^"]*)"/g)].map((m) => m[1]);
}

/** Top-level static routes that have a real `page.tsx`, excluding dynamic
 *  segments (which the sitemap enumerates separately from content) and
 *  route-less special files. */
let routesOnDiskCache: string[] | null = null;
function routesOnDisk(): string[] {
  if (routesOnDiskCache) return routesOnDiskCache;
  const found: string[] = [];
  for (const entry of readdirSync(APP_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("[") || entry.name.startsWith("_")) continue;
    if (existsSync(path.join(APP_DIR, entry.name, "page.tsx"))) {
      found.push(`/${entry.name}`);
    }
  }
  if (existsSync(path.join(APP_DIR, "page.tsx"))) found.push("");
  routesOnDiskCache = found;
  return found;
}

/**
 * Routes that deliberately stay out of the sitemap, and why.
 *
 * Currently empty, and that is the point. `/lessons` lived here on the
 * grounds that it was "a permanentRedirect stub to /learn — no content of
 * its own"; it is now a full lesson index, and the entry silently kept it
 * out of the sitemap. Note the failure mode: an exemption whose reason has
 * expired makes this suite pass *more* easily, so nothing here will ever
 * report it. Every entry added below must therefore be re-justified by hand
 * whenever the page it names changes shape.
 */
const EXCLUDED_FROM_SITEMAP: Record<string, string> = {};

describe("route inventory", () => {
  it("finds the routes (guards the guard)", () => {
    expect(routesOnDisk().length).toBeGreaterThan(10);
    expect(sitemapRoutes().length).toBeGreaterThan(10);
  });

  it("lists every real static page in the sitemap", () => {
    const inSitemap = new Set(sitemapRoutes());
    const missing = routesOnDisk().filter(
      (route) => !inSitemap.has(route) && !(route in EXCLUDED_FROM_SITEMAP),
    );

    expect(
      missing,
      "a page absent from the sitemap is invisible to search with no other symptom",
    ).toEqual([]);
  });

  it("has a real page behind every sitemap entry", () => {
    const onDisk = new Set(routesOnDisk());
    const dangling = sitemapRoutes().filter((route) => !onDisk.has(route));
    expect(dangling, "the sitemap advertises a route with no page").toEqual([]);
  });

  it("has a real page behind every navigation link", () => {
    const onDisk = new Set(routesOnDisk());
    const dangling = [...NAV_ITEMS, ...TRACK_NAV_ITEMS]
      .map((item) => item.href)
      .filter((href) => !onDisk.has(href));
    expect(dangling, "the nav links somewhere that does not exist").toEqual([]);
  });

  it("has a real page behind the course-card destination", () => {
    // `getCourseHref()` sends every course card on /learn and the four pillar
    // pages to `/courses/<slug>` when COURSE_PAGES_LIVE is on. If that flag is
    // on while the route is missing, every course card on the site 404s — and
    // nothing else would catch it, because the flag and the route live in
    // different files with no reference between them.
    const helper = source(path.join(SRC_DIR, "components/curriculum/courseHref.ts"));
    const live = /COURSE_PAGES_LIVE\s*=\s*true/.test(helper);
    if (!live) return; // flag is off; cards point at the first lesson instead.

    expect(existsSync(COURSE_ROUTE), "COURSE_PAGES_LIVE is on but /courses/[slug] has no page").toBe(
      true,
    );

    // The route is statically generated with `dynamicParams = false`, so a
    // course missing from generateStaticParams 404s rather than rendering.
    const route = source(COURSE_ROUTE);
    expect(route).toMatch(/export\s+(async\s+)?function\s+generateStaticParams/);

    // …and the params must come from `COURSES` itself, not a hand-kept list:
    // with `dynamicParams = false`, any course absent from that array is a
    // hard 404 behind a link the rest of the site still renders.
    expect(
      route,
      "generateStaticParams must map COURSES, or a new course 404s behind its own card",
    ).toMatch(/COURSES\.map\(\s*\(?\s*course\s*\)?\s*=>\s*\(\{\s*slug:\s*course\.slug/);
    expect(route, "every course page needs its own metadata").toMatch(
      /export\s+async\s+function\s+generateMetadata/,
    );

    // Search results have to agree with the cards. `src/lib/search/index.ts`
    // can't import the helper (it runs under plain Node in the index
    // generator, which resolves no `@/` alias), so it repeats the path — and
    // used to send every course result to the pillar landing page instead.
    expect(
      source(path.join(SRC_DIR, "lib/search/index.ts")),
      "a course search result must open the course, not its pillar landing page",
    ).toMatch(/href:\s*`\/courses\/\$\{course\.slug\}`/);
  });

  it("lists every course in the sitemap", () => {
    // `/courses/<slug>` is a dynamic segment, so it is absent from
    // `STATIC_ROUTES` by design — but 32 real, statically generated pages
    // being missing from the sitemap entirely is exactly the silent failure
    // this file exists to catch, and it was the state of the tree when the
    // route landed. Asserting on the generator (COURSES → one entry each)
    // rather than on a literal list keeps it true for course 33.
    expect(COURSES.length, "guards the guard — COURSES should not be empty").toBeGreaterThan(10);
    expect(
      source(SITEMAP_PATH),
      "the sitemap must enumerate every course, derived from COURSES",
    ).toMatch(/COURSES\.map\([\s\S]*?\/courses\/\$\{course\.slug\}/);
  });

  it("keeps itself off the lesson-corpus import path", () => {
    // The regression guard for the 60s timeout documented at the top of this
    // file. Importing `@/app/sitemap`, `@/lib/content/lessons`, or the course
    // page module here would pull ~219 .mdx files through remark/rehype/KaTeX
    // with no build cache (~56s measured) and put this suite back on the
    // wrong side of `testTimeout`. Reading their source text asserts the same
    // things in milliseconds.
    const self = source(path.join(import.meta.dirname, "routes.test.ts"));
    const forbidden = [
      "@/app/sitemap",
      "@/lib/content/lessons",
      "@/app/courses",
      "@/lib/search/index",
    ];
    const imported = forbidden.filter((moduleId) =>
      // No escaping needed: every id here is `@`, `/` and word characters.
      new RegExp(`(from|import)\\s*\\(?\\s*["']${moduleId}`).test(self),
    );
    expect(
      imported,
      "these modules load the whole MDX lesson corpus — read their source instead of importing them",
    ).toEqual([]);
  });

  it("lists every navigable page in the sitemap", () => {
    const inSitemap = new Set(sitemapRoutes());
    const missing = [...NAV_ITEMS, ...TRACK_NAV_ITEMS]
      .map((item) => item.href)
      .filter((href) => !inSitemap.has(href));
    expect(missing, "a page good enough for the nav is good enough for the sitemap").toEqual([]);
  });
});
