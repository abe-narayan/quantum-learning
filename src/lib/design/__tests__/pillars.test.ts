import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { readGlobalsCss } from "./cssTokens";
import { PILLARS } from "@/lib/content/curriculum";
import { TRACK_NAV_ITEMS } from "@/lib/nav";
import { PILLAR_ORDER, PILLAR_VISUALS, pillarDepth } from "@/lib/design/pillars";
import { REGIME_DESCRIPTIONS, REGIME_RENDERERS } from "@/components/field/regimes";

/**
 * The pillar identity channel is defined in two places by necessity:
 *   - src/app/globals.css section 2, because CSS has to resolve the ramp for
 *     every element under `[data-pillar]`, and
 *   - src/lib/design/pillars.ts, because the background field draws with the
 *     same colors on a canvas and cannot read a stylesheet it isn't in.
 *
 * Two copies of the same numbers is exactly the kind of duplication that
 * silently drifts — a pillar quietly rendering one hue in its text and a
 * different one in its background, with nothing failing. These tests pin them
 * together, and pin both to the actual curriculum, so adding a pillar or
 * retuning a hue can't half-land.
 */

// Comment-stripped: globals.css quotes declaration syntax inside its own
// prose, which a naive scan would happily match. See ./cssTokens.
const GLOBALS_CSS = readGlobalsCss();

/** Parses the `[data-pillar="<slug>"] { --pillar-hue: N; --pillar-chroma: N; }`
 *  blocks back out of globals.css. Deliberately a real parse of the shipped
 *  stylesheet rather than a second hard-coded table in this file — a test that
 *  restates the expected values can't detect drift, it can only restate it. */
function parsePillarChannelsFromCss(): Map<string, { hue: number; chroma: number }> {
  const channels = new Map<string, { hue: number; chroma: number }>();
  const blockPattern = /\[data-pillar="([^"]+)"\]\s*\{([^}]*)\}/g;

  for (const match of GLOBALS_CSS.matchAll(blockPattern)) {
    const [, slug, body] = match;
    const hue = body.match(/--pillar-hue:\s*([\d.]+)\s*;/);
    const chroma = body.match(/--pillar-chroma:\s*([\d.]+)\s*;/);
    // Some `[data-pillar="..."]` blocks exist only to override surfaces (the
    // light-theme Apex block, the print reset); those legitimately declare no
    // channel and are skipped rather than treated as a mismatch.
    if (!hue || !chroma) continue;
    channels.set(slug, { hue: Number(hue[1]), chroma: Number(chroma[1]) });
  }

  return channels;
}

describe("pillar visual identity", () => {
  it("covers exactly the pillars the curriculum defines", () => {
    const curriculumSlugs = PILLARS.map((pillar) => pillar.slug).sort();
    expect(Object.keys(PILLAR_VISUALS).sort()).toEqual(curriculumSlugs);
    expect([...PILLAR_ORDER].sort()).toEqual(curriculumSlugs);
  });

  it("orders pillars foundational-first and terminates at Apex", () => {
    expect(PILLAR_ORDER[0]).toBe("quantum-mechanics");
    expect(PILLAR_ORDER[PILLAR_ORDER.length - 1]).toBe("apex");
    expect(pillarDepth("apex")).toBe(PILLAR_ORDER.length - 1);
  });

  it("agrees with globals.css on every pillar's hue and chroma", () => {
    const fromCss = parsePillarChannelsFromCss();

    // The stylesheet must declare a channel for every pillar, and no extras.
    expect([...fromCss.keys()].sort()).toEqual(Object.keys(PILLAR_VISUALS).sort());

    for (const [slug, visual] of Object.entries(PILLAR_VISUALS)) {
      expect(fromCss.get(slug), `no --pillar-hue/--pillar-chroma for ${slug}`).toEqual({
        hue: visual.hue,
        chroma: visual.chroma,
      });
    }
  });

  it("gives every pillar a distinguishable hue", () => {
    // Two pillars 20 degrees apart would be indistinguishable in a badge.
    const hues = PILLAR_ORDER.map((pillar) => PILLAR_VISUALS[pillar].hue).sort((a, b) => a - b);
    for (let i = 1; i < hues.length; i += 1) {
      expect(hues[i] - hues[i - 1]).toBeGreaterThanOrEqual(30);
    }
  });

  it("keeps Apex the least saturated pillar", () => {
    // Apex's distinction is contrast, density and structure — not a louder
    // color than everything before it. See docs/DESIGN_SYSTEM.md section 2.
    const apexChroma = PILLAR_VISUALS.apex.chroma;
    for (const pillar of PILLAR_ORDER) {
      if (pillar === "apex") continue;
      expect(apexChroma).toBeLessThan(PILLAR_VISUALS[pillar].chroma);
    }
  });

  it("routes every pillar to a distinct absolute path", () => {
    const routes = PILLAR_ORDER.map((pillar) => PILLAR_VISUALS[pillar].route);
    for (const route of routes) expect(route.startsWith("/")).toBe(true);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it("has a real App Router page behind every pillar route", () => {
    // Quantum Mastery spent a long time as the one pillar with no landing
    // page — `PILLAR_ROUTES` pointed it at `/learn` and the Tracks nav simply
    // omitted it. A route declared here but not backed by a page file is a
    // dead link that neither `tsc` nor `next build` would flag, so it is
    // checked against the filesystem rather than trusted.
    const appDir = path.resolve(import.meta.dirname, "../../../app");
    for (const pillar of PILLAR_ORDER) {
      const route = PILLAR_VISUALS[pillar].route;
      const pagePath = path.join(appDir, route.replace(/^\//, ""), "page.tsx");
      expect(existsSync(pagePath), `${pillar}: no page at ${route} (${pagePath})`).toBe(true);
    }
  });

  it("lists every pillar route in the Tracks navigation", () => {
    const navHrefs = new Set(TRACK_NAV_ITEMS.map((item) => item.href));
    for (const pillar of PILLAR_ORDER) {
      const route = PILLAR_VISUALS[pillar].route;
      expect(navHrefs.has(route), `${pillar} (${route}) is missing from TRACK_NAV_ITEMS`).toBe(true);
    }
  });

  it("agrees with the search index's own pillar-route map", () => {
    // `src/lib/search/index.ts` cannot import the pillar table: the
    // search-index generator loads that module under plain Node, which
    // resolves neither the `@/...` alias nor extension-less specifiers, so
    // its only runtime imports must be ones Node can follow (everything else
    // there is `import type`, which is erased). It therefore restates the
    // routes, and this is what keeps the restatement honest — the same map
    // silently pointed Quantum Mastery at /learn long after it got a page.
    const source = readFileSync(
      path.resolve(import.meta.dirname, "../../search/index.ts"),
      "utf8",
    );
    const block = source.match(/const PILLAR_HREF: Record<Pillar, string> = \{([^}]*)\}/);
    expect(block, "PILLAR_HREF not found in src/lib/search/index.ts").not.toBeNull();

    const routes = new Map<string, string>();
    for (const entry of block![1].matchAll(/"?([\w-]+)"?:\s*"([^"]+)"/g)) {
      routes.set(entry[1], entry[2]);
    }

    expect([...routes.keys()].sort()).toEqual(Object.keys(PILLAR_VISUALS).sort());
    for (const [pillar, visual] of Object.entries(PILLAR_VISUALS)) {
      expect(routes.get(pillar), `search index routes ${pillar} wrongly`).toBe(visual.route);
    }
  });

  it("orders the Tracks navigation by curriculum depth", () => {
    // The nav is a visitor's main sense of the curriculum's shape; listing
    // Apex before Mastery (or Hardware before Mechanics) would quietly
    // misrepresent the progression.
    const routeToDepth = new Map(
      PILLAR_ORDER.map((pillar) => [PILLAR_VISUALS[pillar].route, pillarDepth(pillar)]),
    );
    const depths = TRACK_NAV_ITEMS.map((item) => routeToDepth.get(item.href)).filter(
      (depth): depth is number => depth !== undefined,
    );
    expect(depths).toEqual([...depths].sort((a, b) => a - b));
  });
});

describe("background field regimes", () => {
  it("has a renderer and a text description for every declared regime", () => {
    const declared = new Set(PILLAR_ORDER.map((pillar) => PILLAR_VISUALS[pillar].regime));
    // `journey` belongs to no single pillar — it is the homepage environment.
    declared.add("journey");

    for (const regime of declared) {
      expect(typeof REGIME_RENDERERS[regime]).toBe("function");
      // The environment carries meaning, so it must have a text equivalent
      // for anyone who can't see it (QuantumField renders this sr-only).
      expect(REGIME_DESCRIPTIONS[regime]?.length ?? 0).toBeGreaterThan(20);
    }
  });

  it("gives each pillar its own environment", () => {
    const regimes = PILLAR_ORDER.map((pillar) => PILLAR_VISUALS[pillar].regime);
    expect(new Set(regimes).size).toBe(regimes.length);
  });
});
