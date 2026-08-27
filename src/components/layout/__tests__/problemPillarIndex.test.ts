import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PROBLEM_SLUGS_BY_PILLAR, problemPillar } from "../problemPillarIndex";

/**
 * `problemPillarIndex.ts` is a hand-regenerated table (see the shell recipe
 * in its header comment) with no build step keeping it in sync with
 * `src/content/problems/<pillar>/**` — so after adding, removing, or moving
 * a problem file it can silently go stale, and the navbar quietly loses its
 * pillar badge on the affected problems. This test re-derives the table the
 * same way the recipe does — walk the content directory, take the pillar
 * from the top-level directory name, take the slugs from `slug: "..."`
 * matches in each file — and fails on any drift in either direction, or on
 * a slug filed under the wrong pillar.
 */

const PROBLEMS_ROOT = path.resolve(__dirname, "../../../content/problems");

/** Recursively collects every .ts file under `dir`. */
function walkFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(full));
    } else if (entry.name.endsWith(".ts")) {
      files.push(full);
    }
  }
  return files;
}

/** slug -> pillar, derived from the filesystem exactly as the regeneration recipe derives it. */
function slugsFromContentDirectory(): Map<string, string> {
  const bySlug = new Map<string, string>();
  const pillars = readdirSync(PROBLEMS_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const pillar of pillars) {
    for (const file of walkFiles(path.join(PROBLEMS_ROOT, pillar))) {
      // Mirrors the recipe's `grep -o 'slug: "[^"]*"'` — a file's meta.slug,
      // matched textually. (Prerequisite/lesson slugs in these files contain
      // "/" separators and live under different keys, so this pattern only
      // ever matches the problem's own slug field.)
      const matches = readFileSync(file, "utf8").matchAll(/slug: "([^"]*)"/g);
      for (const match of matches) {
        bySlug.set(match[1], pillar);
      }
    }
  }
  return bySlug;
}

describe("problemPillarIndex stays in sync with src/content/problems", () => {
  const actual = slugsFromContentDirectory();
  const table = new Map<string, string>(
    Object.entries(PROBLEM_SLUGS_BY_PILLAR).flatMap(([pillar, slugs]) =>
      slugs.map((slug) => [slug, pillar] as const)
    )
  );

  it("found problem files to compare against (sanity)", () => {
    expect(actual.size).toBeGreaterThan(0);
  });

  it("covers every problem file on disk", () => {
    const missing = [...actual.keys()].filter((slug) => !table.has(slug));
    expect(
      missing,
      "problem files exist whose slugs are missing from PROBLEM_SLUGS_BY_PILLAR — re-run the regeneration recipe in problemPillarIndex.ts"
    ).toEqual([]);
  });

  it("lists no slug that has no problem file", () => {
    const stale = [...table.keys()].filter((slug) => !actual.has(slug));
    expect(
      stale,
      "PROBLEM_SLUGS_BY_PILLAR lists slugs with no file under src/content/problems — re-run the regeneration recipe in problemPillarIndex.ts"
    ).toEqual([]);
  });

  it("maps every slug to the pillar its file actually lives under", () => {
    const mislabeled = [...actual.entries()]
      .filter(([slug, pillar]) => table.has(slug) && table.get(slug) !== pillar)
      .map(([slug, pillar]) => `${slug}: table says "${table.get(slug)}", file lives under "${pillar}"`);
    expect(mislabeled).toEqual([]);
  });

  it("problemPillar() serves the same mapping the table declares", () => {
    // Guards the flatMap that builds the runtime lookup — e.g. a duplicated
    // slug across two pillars would let a later entry silently win.
    for (const [slug, pillar] of table) {
      expect(problemPillar(slug), slug).toBe(pillar);
    }
    expect(problemPillar("not-a-problem-slug")).toBeUndefined();
  });
});
