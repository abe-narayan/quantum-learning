import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { NAV_ITEMS, TRACK_NAV_ITEMS } from "@/lib/nav";

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
 */

const APP_DIR = path.resolve(import.meta.dirname, "../../../app");
const SITEMAP = readFileSync(path.join(APP_DIR, "sitemap.ts"), "utf8");

/** The `STATIC_ROUTES` array, parsed out of the real sitemap source. */
function sitemapRoutes(): string[] {
  const block = SITEMAP.match(/const STATIC_ROUTES = \[([\s\S]*?)\]/);
  if (!block) throw new Error("STATIC_ROUTES not found in src/app/sitemap.ts");
  return [...block[1].matchAll(/"([^"]*)"/g)].map((m) => m[1]);
}

/** Top-level static routes that have a real `page.tsx`, excluding dynamic
 *  segments (which the sitemap enumerates separately from content) and
 *  route-less special files. */
function routesOnDisk(): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(APP_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("[") || entry.name.startsWith("_")) continue;
    if (existsSync(path.join(APP_DIR, entry.name, "page.tsx"))) {
      found.push(`/${entry.name}`);
    }
  }
  if (existsSync(path.join(APP_DIR, "page.tsx"))) found.push("");
  return found;
}

/** Routes that deliberately stay out of the sitemap, and why. */
const EXCLUDED_FROM_SITEMAP: Record<string, string> = {
  "/lessons": "a permanentRedirect stub to /learn — no content of its own",
};

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

  it("lists every navigable page in the sitemap", () => {
    const inSitemap = new Set(sitemapRoutes());
    const missing = [...NAV_ITEMS, ...TRACK_NAV_ITEMS]
      .map((item) => item.href)
      .filter((href) => !inSitemap.has(href));
    expect(missing, "a page good enough for the nav is good enough for the sitemap").toEqual([]);
  });
});
