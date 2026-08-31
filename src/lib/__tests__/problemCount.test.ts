import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { NAV_ITEMS, PROBLEM_COUNT_TOKEN, navDescription } from "@/lib/nav";
import { PROBLEM_COUNT, SITE_DESCRIPTION } from "@/lib/structuredData";
import { LESSON_METAS } from "@/lib/content/lessonMeta.generated";
import { SIMULATOR_COUNT } from "@/components/home/siteFigures";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import type { Pillar } from "@/lib/content/types";

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

  /**
   * The three counts that are spelled out as a word rather than a numeral.
   *
   * `SITE_DESCRIPTION` above is pinned because it interpolates a digit, which
   * is easy to match. These three do not: `nav.ts` says "Fourteen simulators",
   * and `/simulators` says "Fourteen quantum simulators" in its metadata and
   * "Fourteen live instruments" on the page. Nothing checked any of them.
   *
   * They are typed out for a real reason rather than through carelessness.
   * `SIMULATOR_COUNT` derives itself by building the search index, and `nav.ts`
   * is imported by `Navbar`, a client component in the root layout, so
   * importing the constant there would drag `lib/search` into every page's
   * bundle and break the client-boundary budget. The literal has to stay.
   *
   * What does not have to stay is the drift. A test file is under no such
   * constraint, so it can import both and hold them together. This is the
   * failure `CLAUDE.md` records as having already shipped once: a hand-typed
   * 549 against a corpus of 556, rendered on every page. Adding a fifteenth
   * simulator would otherwise leave three surfaces quietly saying Fourteen.
   */
  it("keeps every spelled-out simulator count in step with SIMULATOR_COUNT", () => {
    const NUMBER_WORDS = [
      "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
      "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
      "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
    ];
    const expected = NUMBER_WORDS[SIMULATOR_COUNT];
    expect(
      expected,
      `SIMULATOR_COUNT is ${SIMULATOR_COUNT}, outside this test's number-word ` +
        "list. Extend NUMBER_WORDS."
    ).toBeDefined();

    // Comments are not scanned: `nav.ts` explains the arrangement in prose that
    // names the other two literals, and matching that would be a false find.
    const stripComments = (source: string) =>
      source.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");

    const surfaces = ["src/lib/nav.ts", "src/app/simulators/page.tsx"];
    const claims: string[] = [];
    const wrong: string[] = [];

    for (const relative of surfaces) {
      const source = stripComments(
        readFileSync(path.join(process.cwd(), relative), "utf8")
      );
      const pattern = new RegExp(
        `\\b(${NUMBER_WORDS.join("|")})\\s+(?:quantum\\s+)?(?:simulators|live instruments)\\b`,
        "gi"
      );
      for (const match of source.matchAll(pattern)) {
        claims.push(`${relative}: "${match[0]}"`);
        if (match[1].toLowerCase() !== expected) wrong.push(`${relative}: "${match[0]}"`);
      }
    }

    expect(
      claims.length,
      "found no spelled-out simulator count in nav.ts or /simulators; either " +
        "they now interpolate the constant (in which case delete this test) or " +
        "the matcher has rotted and is passing vacuously"
    ).toBeGreaterThanOrEqual(3);

    expect(
      wrong,
      `these surfaces spell a simulator count that is no longer right. ` +
        `SIMULATOR_COUNT is ${SIMULATOR_COUNT}, so they should read "${expected}".`
    ).toEqual([]);
  });

  /**
   * The same failure, one tier up: spelled-out course counts for Apex and
   * Mastery.
   *
   * Found by a reviewer checking the claim that "every printed figure on the
   * homepage is derived from a registry", which was overstated. Four
   * reader-facing sentences hand-type the number five: Apex's landing page and
   * its hero both say "five courses", and Mastery's page and the homepage's
   * index row both say "Five self-contained structures". All four are correct
   * today and none of them is pinned, which is precisely the state
   * "Fourteen simulators" was in before the test above.
   *
   * These are spelled out for readability rather than for a bundle constraint,
   * so they could in principle interpolate. They read better as words, and a
   * test costs nothing, so the words stay and the drift does not.
   */
  it("keeps every spelled-out course count in step with the curriculum", () => {
    const NUMBER_WORDS = [
      "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
      "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
      "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
    ];
    const word = (n: number) => NUMBER_WORDS[n];

    // What each sentence is counting, and which pillar answers it.
    const CLAIMS: { file: string; phrase: string; pillar: Pillar }[] = [
      { file: "src/app/apex/page.tsx", phrase: "courses", pillar: "apex" },
      { file: "src/components/apex/ApexHero.tsx", phrase: "courses", pillar: "apex" },
      {
        file: "src/app/mastery/page.tsx",
        phrase: "self-contained structures",
        pillar: "quantum-mastery",
      },
      {
        file: "src/components/home/SiteContents.tsx",
        phrase: "self-contained structures",
        pillar: "quantum-mastery",
      },
    ];

    const stripComments = (source: string) =>
      source.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");

    const found: string[] = [];
    const wrong: string[] = [];

    for (const { file, phrase, pillar } of CLAIMS) {
      const expected = word(getCoursesByPillar(pillar).length);
      const source = stripComments(readFileSync(path.join(process.cwd(), file), "utf8"));
      const pattern = new RegExp(`\\b(${NUMBER_WORDS.join("|")})\\s+${phrase}\\b`, "gi");
      for (const match of source.matchAll(pattern)) {
        found.push(`${file}: "${match[0]}"`);
        if (match[1].toLowerCase() !== expected) {
          wrong.push(`${file}: "${match[0]}" but ${pillar} has ${expected} courses`);
        }
      }
    }

    expect(
      found.length,
      "found no spelled-out course count in the Apex or Mastery copy; either " +
        "it now interpolates (delete this test) or the matcher has rotted and " +
        "is passing vacuously"
    ).toBeGreaterThanOrEqual(CLAIMS.length);

    expect(wrong, "a tier states a course count its curriculum no longer has").toEqual([]);
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
