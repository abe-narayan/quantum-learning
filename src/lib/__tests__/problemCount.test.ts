import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { NAV_ITEMS, PROBLEM_COUNT_TOKEN, navDescription } from "@/lib/nav";
import { PROBLEM_COUNT, SITE_DESCRIPTION } from "@/lib/structuredData";
import { LESSON_METAS } from "@/lib/content/lessonMeta.generated";
import { SIMULATOR_COUNT } from "@/components/home/siteFigures";

/**
 * ============================================================
 * One derivation of "how many problems are there"
 * ============================================================
 * The site states this figure in the desktop "Problems" tooltip (so on every
 * one of the 823 routes), in the served 404's quick links, in
 * `SITE_DESCRIPTION` — which `app/layout.tsx`, `app/manifest.ts` and
 * `app/opengraph-image.tsx` all read — and in the JSON-LD. It has been wrong
 * before: `lib/nav.ts` carried a hand-typed 549 against a corpus of 556.
 *
 * That was fixed by giving the client half its own derivation — a 556-row
 * slug->pillar table in `components/layout/problemPillarIndex.ts` whose
 * `.size` was the count. Two derivations of one quantity is the defect, not
 * the fix, and that one cost 7.2KB gzip on every route (7.2% of the
 * client-data ceiling in `lib/design/__tests__/clientBoundary.test.ts`) to
 * state a three-digit number. There is now exactly one: `PROBLEM_COUNT` in
 * `lib/structuredData.ts`, counted from the generated problem-meta array,
 * handed to the one client surface that renders it (`Navbar`) as a prop.
 *
 * This file is what keeps that single derivation honest. It re-counts the
 * content directory from disk — independently of the generator, the same way
 * `problemPillarIndex.test.ts` used to before the table was deleted — and
 * pins every rendered surface to it.
 */

const PROBLEMS_ROOT = path.resolve(import.meta.dirname, "../../content/problems");

/** Recursively collects every .ts file under `dir`. */
function walkFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(full));
    else if (entry.name.endsWith(".ts")) files.push(full);
  }
  return files;
}

/** Every problem slug on disk, taken from the `slug: "..."` field of each
 *  content module. (Prerequisite/lesson slugs in these files contain "/"
 *  separators and live under different keys, so this pattern only ever
 *  matches the problem's own slug field.) */
function slugsOnDisk(): Set<string> {
  const slugs = new Set<string>();
  for (const pillar of readdirSync(PROBLEMS_ROOT, { withFileTypes: true })) {
    if (!pillar.isDirectory()) continue;
    for (const file of walkFiles(path.join(PROBLEMS_ROOT, pillar.name))) {
      for (const match of readFileSync(file, "utf8").matchAll(/slug: "([^"]*)"/g)) {
        slugs.add(match[1]);
      }
    }
  }
  return slugs;
}

describe("the site's problem count", () => {
  const onDisk = slugsOnDisk();

  it("found problem files to compare against (guards the guard)", () => {
    // Without this a broken walk would report zero and agree with a
    // PROBLEM_COUNT of zero forever.
    expect(onDisk.size).toBeGreaterThan(400);
  });

  it("agrees with the content directory", () => {
    expect(
      PROBLEM_COUNT,
      "PROBLEM_COUNT (counted from problemMeta.generated.ts) disagrees with src/content/problems — run `npm run generate:registry`",
    ).toBe(onDisk.size);
  });

  it("is what the site description states", () => {
    expect(SITE_DESCRIPTION).toContain(`${PROBLEM_COUNT} problems`);
  });

  /**
   * `SITE_DESCRIPTION` is the most-rendered string on the site: `layout.tsx`,
   * `manifest.ts`, `opengraph-image.tsx` and the JSON-LD all read it, so it
   * appears on every one of the 830 routes. It states three totals, and only
   * the problem count was interpolated; the lesson and simulator figures are
   * typed literals.
   *
   * Both are correct today, and neither can simply become
   * `${LESSON_METAS.length}`: the note on `SIMULATOR_COUNT` in `lib/nav.ts`
   * explains that importing it there would drag a registry across a bundle
   * boundary, and the same reasoning applies to the lesson registry. That is a
   * good reason to keep a literal. It is not a reason to leave it unpinned,
   * which is exactly how a hand-typed 549 shipped against a corpus of 556 and
   * a hand-typed 213 against 218.
   *
   * This test costs nothing, because it runs in Node where both registries are
   * free to import.
   */
  it("states a lesson count that matches the registry", () => {
    expect(
      SITE_DESCRIPTION,
      "SITE_DESCRIPTION's lesson figure is a typed literal and the corpus has moved. " +
        "Update it in src/lib/structuredData.ts and in src/app/opengraph-image.tsx, " +
        "which carries its own copy."
    ).toContain(`${LESSON_METAS.length} lessons`);
  });

  it("states a simulator count that matches SIMULATOR_COUNT", () => {
    expect(
      SITE_DESCRIPTION,
      "SITE_DESCRIPTION's simulator figure is a typed literal and SIMULATOR_COUNT has moved."
    ).toContain(`${SIMULATOR_COUNT} simulators`);
  });

  /**
   * `opengraph-image.tsx` carries its own second copy of the same sentence, in
   * two places: the `alt` export and the rendered card. It correctly
   * interpolates `PROBLEM_COUNT` and correctly explains in its own comment why
   * a hand-kept figure is a bad idea, and then types the lesson and simulator
   * numbers by hand anyway. This is the social-preview card, so a stale figure
   * there is the version that gets pasted into chat apps and search results.
   */
  it("keeps the OpenGraph card's own copy of the counts in step", () => {
    const source = readFileSync(
      path.join(process.cwd(), "src/app/opengraph-image.tsx"),
      "utf8"
    );
    const claims = [...source.matchAll(/(\d+) lessons, (\d+) simulators/g)];

    expect(
      claims.length,
      "found no 'N lessons, M simulators' phrase in opengraph-image.tsx; the " +
        "matcher has rotted, or the card no longer states those counts"
    ).toBeGreaterThan(0);

    const wrong = claims
      .filter(
        ([, lessons, simulators]) =>
          Number(lessons) !== LESSON_METAS.length || Number(simulators) !== SIMULATOR_COUNT
      )
      .map(([phrase]) => phrase);

    expect(
      wrong,
      `the OpenGraph card states counts that no longer match the corpus ` +
        `(${LESSON_METAS.length} lessons, ${SIMULATOR_COUNT} simulators)`
    ).toEqual([]);
  });

  it("is what the Problems nav item renders", () => {
    const problems = NAV_ITEMS.find((item) => item.href === "/problems");
    expect(problems).toBeDefined();
    expect(navDescription(problems!, PROBLEM_COUNT)).toContain(`${PROBLEM_COUNT} problems`);
  });

  it("leaves no substitution token in any rendered nav copy", () => {
    // `navDescription` is the only thing that fills `{problems}` in, so a
    // surface that reads `item.description` directly would print the token
    // to a reader. This is the assertion that makes the token safe.
    const unresolved = NAV_ITEMS.map((item) => navDescription(item, PROBLEM_COUNT)).filter((text) =>
      text.includes(PROBLEM_COUNT_TOKEN),
    );
    expect(unresolved).toEqual([]);
  });
});
