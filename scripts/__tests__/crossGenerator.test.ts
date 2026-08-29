import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  compareSlugs,
  extractObjectLiteral,
  findMatchingBrace,
  walk,
  LESSON_META_KEY_RE,
  PROBLEM_META_KEY_RE,
} from "../lib/extract.mjs";
import { LESSON_METAS } from "../../src/lib/content/lessonMeta.generated";
import { PROBLEM_METAS } from "../../src/lib/problems/problemMeta.generated";
import { PROBLEMS } from "../../src/lib/problems/registry.generated";

/**
 * The invariants that span more than one generator, run against the real
 * corpus rather than fixtures.
 *
 * THE PROBLEM THIS SUITE EXISTS FOR. Two generators text-extract the SAME
 * `meta: {...}` block out of every one of the 547 problem files:
 * `generate-problem-registry.mjs` (whose output IS drift-tested against the
 * real modules by `src/lib/problems/__tests__/metaRegistry.test.ts`) and
 * `generate-search-index.mjs` (whose output is not tested by anything). The
 * two used to hold separate copies of the key pattern with a comment saying
 * they "must stay identical" — an invariant with no enforcement, whose
 * violation would show up only as a search index quietly built from the wrong
 * blocks. The pattern now lives once in `scripts/lib/extract.mjs`; the tests
 * below check both that the sharing is still real (nobody re-inlined a copy)
 * and that extraction still reproduces both generated artifacts exactly.
 *
 * The round-trip tests close the other silent failure: a file skipped rather
 * than failing. Every slug on disk must appear in every artifact that is
 * supposed to describe it, so a file that vanished from a generated output
 * fails here instead of vanishing from search/catalogs behind a green build.
 */
const ROOT = process.cwd();
const LESSONS_ROOT = path.join(ROOT, "src/content/lessons");
const PROBLEMS_ROOT = path.join(ROOT, "src/content/problems");
const SCRIPTS = ["generate-lesson-registry.mjs", "generate-problem-registry.mjs", "generate-search-index.mjs"];

/** The exact source slice a key pattern selects — what actually has to agree. */
function selectedBlock(source: string, pattern: RegExp): string {
  const match = pattern.exec(source);
  if (!match) throw new Error(`pattern ${pattern} matched nothing`);
  const open = match.index + match[0].length - 1;
  return source.slice(open, findMatchingBrace(source, open) + 1);
}

async function readAll(root: string, ext: string) {
  const slugs = await walk(root, ext);
  return Promise.all(
    slugs.map(async (slug: string) => ({
      slug,
      filePath: path.join(root, `${slug}${ext}`),
      source: await readFile(path.join(root, `${slug}${ext}`), "utf8"),
    }))
  );
}

describe("the problem `meta:` pattern is shared, not duplicated", () => {
  it("no generator declares its own copy of a meta key pattern", async () => {
    // The structural half of the guard. Sharing one constant makes divergence
    // unrepresentable — but only for as long as nobody re-inlines a literal.
    const inlineMetaPattern = /\/\^?[^/\n]*\bmeta:\s*\\s\*\\\{/;
    const inlineLessonPattern = /\/\^?[^/\n]*\blessonMeta\b[^/\n]*\\\{/;
    for (const name of SCRIPTS) {
      const source = await readFile(path.join(ROOT, "scripts", name), "utf8");
      expect(
        inlineMetaPattern.test(source),
        `scripts/${name} declares its own problem-meta regex. Import PROBLEM_META_KEY_RE from ` +
          `scripts/lib/extract.mjs instead — two copies is how the search index and the meta ` +
          `registry silently start reading different blocks.`
      ).toBe(false);
      expect(
        inlineLessonPattern.test(source),
        `scripts/${name} declares its own lessonMeta regex. Import LESSON_META_KEY_RE instead.`
      ).toBe(false);
    }
  });

  it("both problem generators import the one shared pattern", async () => {
    for (const name of ["generate-problem-registry.mjs", "generate-search-index.mjs"]) {
      const source = await readFile(path.join(ROOT, "scripts", name), "utf8");
      expect(source, `scripts/${name} must use PROBLEM_META_KEY_RE`).toContain("PROBLEM_META_KEY_RE");
    }
    for (const name of ["generate-lesson-registry.mjs", "generate-search-index.mjs"]) {
      const source = await readFile(path.join(ROOT, "scripts", name), "utf8");
      expect(source, `scripts/${name} must use LESSON_META_KEY_RE`).toContain("LESSON_META_KEY_RE");
    }
  });

  it("selects the identical source block in every one of the real problem files", async () => {
    // The behavioural half. Both generators call `extractObjectLiteral` with
    // the same pattern object; this asserts what that means in practice —
    // for all 547 files, a byte-identical slice — and would still fail if a
    // future refactor gave the two call sites subtly different patterns.
    const files = await readAll(PROBLEMS_ROOT, ".ts");
    expect(files.length).toBeGreaterThan(500);

    const registryPattern = PROBLEM_META_KEY_RE;
    const searchIndexPattern = PROBLEM_META_KEY_RE;
    for (const { filePath, source } of files) {
      const fromRegistry = selectedBlock(source, registryPattern);
      const fromSearchIndex = selectedBlock(source, searchIndexPattern);
      expect(fromSearchIndex, `${filePath}: the two generators selected different blocks`).toBe(fromRegistry);
      // And the selected block is the one the file actually starts with a
      // `meta:` key for — not some later nested object.
      expect(fromRegistry.startsWith("{"), `${filePath}: selection does not start at a brace`).toBe(true);
    }
  });

  it("selects the identical source block in every one of the real lesson files", async () => {
    const files = await readAll(LESSONS_ROOT, ".mdx");
    expect(files.length).toBeGreaterThan(200);
    for (const { filePath, source } of files) {
      const block = selectedBlock(source, LESSON_META_KEY_RE);
      expect(block.startsWith("{"), `${filePath}: selection does not start at a brace`).toBe(true);
      expect(selectedBlock(source, LESSON_META_KEY_RE)).toBe(block);
    }
  });
});

describe("extraction is deterministic across the real corpus", () => {
  it("two passes over every lesson produce byte-identical JSON", async () => {
    const files = await readAll(LESSONS_ROOT, ".mdx");
    const pass = () =>
      JSON.stringify(
        files.map(({ slug, filePath, source }) => ({
          ...(extractObjectLiteral(source, LESSON_META_KEY_RE, filePath, "lessonMeta") as object),
          slug,
        }))
      );
    expect(pass()).toBe(pass());
  });

  it("two passes over every problem produce byte-identical JSON", async () => {
    const files = await readAll(PROBLEMS_ROOT, ".ts");
    const pass = () =>
      JSON.stringify(
        files.map(({ filePath, source }) => extractObjectLiteral(source, PROBLEM_META_KEY_RE, filePath, "meta"))
      );
    expect(pass()).toBe(pass());
  });

  it("the walk order is already sorted, so artifact element order is machine-independent", async () => {
    const lessons = await walk(LESSONS_ROOT, ".mdx");
    const problems = await walk(PROBLEMS_ROOT, ".ts");
    expect(lessons).toEqual([...lessons].sort(compareSlugs));
    expect(problems).toEqual([...problems].sort(compareSlugs));
    // And the generated lesson registry is in exactly that order.
    expect(LESSON_METAS.map((meta) => meta.slug)).toEqual(lessons);
  });
});

describe("round trip: nothing on disk is silently skipped", () => {
  it("every lesson .mdx on disk has an entry in lessonMeta.generated.ts", async () => {
    const slugs = await walk(LESSONS_ROOT, ".mdx");
    const registered = new Set(LESSON_METAS.map((meta) => meta.slug));
    const missing = slugs.filter((slug: string) => !registered.has(slug));
    expect(
      missing,
      `These lessons exist on disk but are absent from lessonMeta.generated.ts — they would vanish ` +
        `from catalogs, prerequisites, search, and generateStaticParams with no build error. ` +
        `Re-run \`npm run generate:lesson-registry\`.`
    ).toEqual([]);
    // And nothing extra: a deleted lesson left in the registry is a 404 link.
    expect(LESSON_METAS.length).toBe(slugs.length);
  });

  it("every lesson registry entry still re-extracts to the same meta", async () => {
    // Catches a stale generated file, not just a missing one.
    const files = await readAll(LESSONS_ROOT, ".mdx");
    const byslug = new Map(LESSON_METAS.map((meta) => [meta.slug, meta]));
    for (const { slug, filePath, source } of files) {
      const fresh = { ...(extractObjectLiteral(source, LESSON_META_KEY_RE, filePath, "lessonMeta") as object), slug };
      expect(JSON.parse(JSON.stringify(fresh)), `lessonMeta.generated.ts is stale for ${slug}`).toEqual(
        JSON.parse(JSON.stringify(byslug.get(slug)))
      );
    }
  });

  it("every problem .ts on disk appears in BOTH problem outputs", async () => {
    const files = await readAll(PROBLEMS_ROOT, ".ts");
    const onDisk = files.map(({ filePath, source }) =>
      (extractObjectLiteral(source, PROBLEM_META_KEY_RE, filePath, "meta") as { slug: string }).slug
    );

    const inMetaRegistry = new Set(PROBLEM_METAS.map((meta) => meta.slug));
    const inFullRegistry = new Set(PROBLEMS.map((problem) => problem.meta.slug));

    expect(
      onDisk.filter((slug) => !inMetaRegistry.has(slug)),
      "Problems on disk missing from problemMeta.generated.ts — re-run `npm run generate:registry`."
    ).toEqual([]);
    expect(
      onDisk.filter((slug) => !inFullRegistry.has(slug)),
      "Problems on disk missing from registry.generated.ts — re-run `npm run generate:registry`."
    ).toEqual([]);
    expect(PROBLEM_METAS.length).toBe(onDisk.length);
    expect(PROBLEMS.length).toBe(onDisk.length);
  });

  it("every problem slug in the search index came from a real problem file", async () => {
    // The search index is the artifact with no drift test of its own; this is
    // the closest standing check that its problem half is complete.
    const indexPath = path.join(ROOT, "public/search-index.json");
    const index = JSON.parse(await readFile(indexPath, "utf8")) as { type: string; href: string }[];
    const hrefs = new Set(index.filter((entry) => entry.type === "problem").map((entry) => entry.href));
    expect(hrefs.size).toBe(PROBLEM_METAS.length);
    for (const meta of PROBLEM_METAS) {
      expect(
        hrefs.has(`/problems/${meta.slug}`),
        `Problem "${meta.slug}" is in problemMeta.generated.ts but not in public/search-index.json — ` +
          `the index is stale or the problem was silently skipped. Re-run \`npm run generate:search-index\`.`
      ).toBe(true);
    }
  });

  it("every lesson slug in the search index came from a real lesson file", async () => {
    const indexPath = path.join(ROOT, "public/search-index.json");
    const index = JSON.parse(await readFile(indexPath, "utf8")) as { type: string; href: string }[];
    const hrefs = new Set(index.filter((entry) => entry.type === "lesson").map((entry) => entry.href));
    expect(hrefs.size).toBe(LESSON_METAS.length);
    for (const meta of LESSON_METAS) {
      expect(
        hrefs.has(`/lessons/${meta.slug}`),
        `Lesson "${meta.slug}" is missing from public/search-index.json — re-run ` +
          `\`npm run generate:search-index\`.`
      ).toBe(true);
    }
  });

  it("gives every lesson in the search index the keyword set its body was reduced to", async () => {
    // The half of the index that no other drift test can see. Lesson bodies
    // became searchable through a `keywords` field that
    // `generate-search-index.mjs` derives by text-scanning each `.mdx` (see
    // `src/lib/search/lessonKeywords.ts`); a lesson missing it is not a
    // missing *page* — the href is still there and every check above passes —
    // it is a page that has silently dropped out of every query that is not a
    // title match, which is exactly the failure the field was added to fix.
    //
    // The stale-artifact caveat that applies to the glossary check in
    // `src/lib/search/__tests__/index.test.ts` applies here too: this compares
    // the committed index against the committed lesson registry, both written
    // by `npm run generate`, so they move together.
    const indexPath = path.join(ROOT, "public/search-index.json");
    const index = JSON.parse(await readFile(indexPath, "utf8")) as {
      type: string;
      href: string;
      keywords?: string;
    }[];
    const missing = index
      .filter((entry) => entry.type === "lesson" && (entry.keywords ?? "").length === 0)
      .map((entry) => entry.href);

    expect(
      missing,
      "these lessons are in the search index with no body terms — re-run " +
        "`npm run generate:search-index`, and if it still happens check bodyOf() in " +
        "src/lib/search/lessonKeywords.ts against how those lessons open"
    ).toEqual([]);

    // Guards the guard: a run that dropped the field everywhere would pass the
    // assertion above by having nothing to report.
    expect(index.filter((entry) => entry.type === "lesson" && entry.keywords).length).toBe(
      LESSON_METAS.length
    );

    // Only lessons. Problem modules carry `answer`, `nearMisses`, `hints` and
    // a worked `solution`, and this file is a public static asset — the
    // decision not to index their bodies is a pedagogical one, not an
    // oversight, so it is pinned rather than left to be rediscovered.
    expect(
      index.filter((entry) => entry.type !== "lesson" && entry.keywords).map((entry) => entry.href),
      "only lessons may carry body keywords; a problem's body contains its answer"
    ).toEqual([]);
  });
});

describe("generated artifacts are checked in with stable, LF line endings", () => {
  it("no generated file carries a carriage return", async () => {
    // The generators concatenate CRLF-sensitive template literals (from their
    // own .mjs sources, whose endings a core.autocrlf=true checkout rewrites)
    // with always-LF JSON.stringify output. `writeGenerated` normalizes, so
    // the bytes are a pure function of the corpus; if that normalization were
    // dropped, a Windows contributor would produce a ~200KB whole-file diff
    // containing no content change.
    for (const rel of [
      "src/lib/content/lessonMeta.generated.ts",
      "src/lib/problems/problemMeta.generated.ts",
      "src/lib/problems/registry.generated.ts",
      "public/search-index.json",
    ]) {
      const source = await readFile(path.join(ROOT, rel), "utf8");
      expect(source.includes("\r"), `${rel} contains CR — writeGenerated's LF normalization regressed`).toBe(
        false
      );
    }
  });

  it("leaves no staging files behind next to the artifacts", async () => {
    for (const dir of ["public", "src/lib/problems", "src/lib/content"]) {
      const { readdir } = await import("node:fs/promises");
      const stale = (await readdir(path.join(ROOT, dir))).filter((name) => name.endsWith(".tmp"));
      expect(stale, `${dir} has leftover writeGenerated staging files`).toEqual([]);
    }
  });
});
