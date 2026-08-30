#!/usr/bin/env node
/**
 * Generates `public/search-index.json`, the static, site-wide search index
 * the client-side search overlay fetches lazily (only once a user actually
 * opens search — see `src/components/search/SearchOverlay.tsx` and
 * `src/lib/search/fetchIndex.ts`) instead of it being baked into every
 * page's RSC/hydration payload via the root layout.
 *
 * Why this exists as a script rather than something called at request time:
 * the index needs metadata from every lesson (the MDX files under
 * `src/content/lessons/**`) and every problem (the TS files under
 * `src/content/problems/**`), and neither is something a plain Node script
 * can get by just importing the real modules:
 *
 *   - A lesson's `lessonMeta` lives inside its `.mdx` file, which only
 *     Next/Turbopack's configured MDX loader (see `next.config.ts`) can
 *     actually parse — `import()`ing a `.mdx` path from plain Node fails.
 *   - A problem's `meta` lives inside a `.ts` file that itself imports
 *     other modules via the `@/...` path alias (e.g.
 *     `import { Complex } from "@/lib/quantum/complex"`), which plain
 *     Node's module resolution doesn't understand (no tsconfig `paths`
 *     support without a bundler/loader).
 *
 * So, mirroring `generate-problem-registry.mjs`'s "walk + parse the source
 * text, don't execute the module" approach, this script extracts just the
 * plain-object-literal `lessonMeta` / `meta` blocks via lightweight text
 * scanning (find the key, then scan forward tracking string/brace state to
 * find the matching closing brace) and evaluates *only* that extracted
 * literal — never the whole file, so none of a file's own problematic
 * imports ever need to run. The resulting plain arrays are then handed to
 * `buildSearchIndex()` from `src/lib/search/index.ts`, which owns the
 * actual index-assembly logic (courses, hardcoded simulators, pillar
 * links, entry shaping) and is safe to import directly here because it has
 * no filesystem or Next-specific runtime dependencies of its own (see the
 * doc comment on `buildSearchIndex` for why).
 *
 * Since 2026-08 this script also reduces each lesson's `.mdx` **body** to a
 * bounded set of the terms it teaches (`src/lib/search/lessonKeywords.ts`),
 * because an index of titles and one-line descriptions could not answer the
 * queries a stuck reader actually types — `power series`, `factorial`,
 * `half angle`, `theta/2` all returned nothing, for concepts the corpus
 * teaches. That extraction is text-only and stays inside the regime this
 * whole file exists to preserve: the `.mdx` source is *read*, never imported,
 * because importing 219 compiled MDX modules is what produced the 2026-08
 * Vercel OOM (docs/DEPLOYMENT.md). Every lesson is already being read here
 * for its `lessonMeta`; the keyword pass is another regex sweep over the same
 * string and adds no I/O.
 *
 * The output is a file the browser downloads whole, so its size is checked
 * here, not only in a test — see `MAX_INDEX_BYTES` below.
 *
 * Run via `npm run generate:search-index`, or automatically before
 * `dev`/`build`/`test` via the `predev`/`prebuild`/`pretest` npm lifecycle
 * hooks (alongside `generate:registry`). NOT run by `pretypecheck`: its
 * output is JSON fetched at runtime, so `tsc` has nothing to say about it.
 */
import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
// Shared with generate-lesson-registry.mjs and generate-problem-registry.mjs —
// one implementation of the walk + brace-scan + literal-eval technique, and
// (critically) ONE definition of each key pattern. This script extracts the
// same `lessonMeta` / `meta` blocks those two generators do; when the
// patterns were duplicated per-file, nothing enforced that they still
// selected the same block, and only the registries are drift-tested. See
// scripts/lib/extract.mjs and scripts/__tests__/crossGenerator.test.ts.
import {
  walk,
  compareSlugs,
  extractObjectLiteral,
  writeGenerated,
  LESSON_META_KEY_RE,
  PROBLEM_META_KEY_RE,
} from "./lib/extract.mjs";

/**
 * Lets this script `import()` the repo's plain-data `.ts` modules that use
 * extension-less relative specifiers.
 *
 * Node's native TypeScript support strips types but keeps ESM's strict
 * resolution rules: `import { CONCEPT_NODES } from "./concepts"` (which is
 * how `src/lib/content/glossary.ts` is written, and how the rest of the repo
 * is written) has no extension, so Node refuses it. This synchronous,
 * in-thread resolve hook appends `.ts` for relative specifiers that have no
 * extension and do resolve to a real `.ts` file, and defers to Node for
 * everything else — bare specifiers, `node:` builtins, `@/...` aliases (which
 * are still NOT resolvable here, and must not appear in any module this
 * script imports at runtime).
 *
 * Deliberately not a general TypeScript loader: nothing this script imports
 * is allowed to do anything at import time except define plain data.
 */
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      specifier.startsWith(".") &&
      !path.extname(specifier) &&
      context.parentURL?.startsWith("file:")
    ) {
      const candidate = path.resolve(path.dirname(fileURLToPath(context.parentURL)), `${specifier}.ts`);
      if (existsSync(candidate)) {
        return { url: pathToFileURL(candidate).href, shortCircuit: true };
      }
    }
    return nextResolve(specifier, context);
  },
});

const ROOT = process.cwd();
const LESSONS_ROOT = path.join(ROOT, "src/content/lessons");
const PROBLEMS_ROOT = path.join(ROOT, "src/content/problems");
const OUTPUT = path.join(ROOT, "public/search-index.json");

/**
 * Hard ceiling on the generated file, enforced at generation time.
 *
 * `public/search-index.json` is fetched *whole* by the search overlay the
 * first time a reader opens it (`src/lib/search/fetchIndex.ts`), so its size
 * is a real, user-visible cost and not a build-artifact statistic. It was
 * 403KB raw / 100.7KB gzip for 1,076 entries before lesson keyword sets;
 * adding them takes it to ~535KB / ~135KB. The ceiling below leaves a little
 * over 4% of headroom, which at ~0.75KB per lesson is roughly thirty more
 * lessons — enough that ordinary corpus growth does not trip it, tight enough
 * that a change of *kind* (someone deciding the whole lesson body should go
 * in after all) fails the generate step instead of quietly tripling what
 * every reader downloads.
 *
 * The per-lesson budget in `lessonKeywords.ts` is the mechanism that keeps
 * this true; this is the assertion that it still is. Both are mirrored by a
 * gzip-measured test in `src/lib/design/__tests__/clientBoundary.test.ts`,
 * which is where this project keeps its payload discipline — the check is
 * here as well because a generator that can write a file no test has run
 * against yet is exactly how the 2026-08 build memory regression reached
 * Vercel.
 */
const MAX_INDEX_BYTES = 560 * 1024;

/**
 * The `objectives` of a lesson, as authored strings.
 *
 * `extractObjectLiteral` has already evaluated the whole `lessonMeta` literal,
 * so this is only a shape guard: `objectives` is required by the lesson schema
 * and every lesson has it, but the keyword extractor is handed corpus data and
 * should not throw on a malformed one — a lesson with a broken `objectives`
 * array is `validateLessonMeta`'s failure to report, not this script's.
 */
function objectivesOf(meta) {
  return Array.isArray(meta.objectives) ? meta.objectives.filter((line) => typeof line === "string") : [];
}

/** `<Term id="...">` in a lesson body, single or double quoted. */
const TERM_LINK_RE = /<Term\s+id=["']([^"']+)["']/g;

/** Filled by `collectLessons`, read once in `main`. Module scope rather than
 *  a return value because `collectLessons` already returns the lesson array
 *  and the two callers of that array should not have to unpack a tuple. */
const termLinkCounts = Object.create(null);

async function collectLessons(extractLessonKeywords) {
  const slugs = (await walk(LESSONS_ROOT, ".mdx")).sort(compareSlugs);
  if (slugs.length === 0) {
    throw new Error(`No lesson files found under ${LESSONS_ROOT}, so refusing to generate an empty search index.`);
  }

  const lessons = [];
  for (const slug of slugs) {
    const filePath = path.join(LESSONS_ROOT, `${slug}.mdx`);
    const source = await readFile(filePath, "utf8");
    const meta = extractObjectLiteral(source, LESSON_META_KEY_RE, filePath, "lessonMeta");
    // The same string, swept a second time for the terms the lesson teaches.
    // Note what is NOT happening: the module is not imported, compiled, or
    // executed — see this file's header, and `lessonKeywords.ts`'s.
    lessons.push({ ...meta, slug, keywords: extractLessonKeywords(source, objectivesOf(meta)) });
    // Third sweep of the same string, for how often the corpus links to each
    // glossary entry. It is a ranking weight, not content: when two terms
    // score identically for a query ("Dirac" names both Dirac Notation and
    // the Dirac delta; "Grover" names both the algorithm and its diffusion
    // operator) the one the lessons actually lean on should lead, and the
    // alternative tie-break is alphabetical. See `linkCount` in
    // src/lib/search/types.ts for why difficulty and glossary-graph degree
    // were both tried and both rejected.
    for (const match of source.matchAll(TERM_LINK_RE)) {
      const id = match[1];
      termLinkCounts[id] = (termLinkCounts[id] ?? 0) + 1;
    }
  }
  return lessons;
}

async function collectProblems() {
  const slugs = (await walk(PROBLEMS_ROOT, ".ts")).sort(compareSlugs);
  if (slugs.length === 0) {
    throw new Error(`No problem files found under ${PROBLEMS_ROOT}, so refusing to generate an empty search index.`);
  }

  const problems = [];
  for (const slug of slugs) {
    const filePath = path.join(PROBLEMS_ROOT, `${slug}.ts`);
    const source = await readFile(filePath, "utf8");
    const meta = extractObjectLiteral(source, PROBLEM_META_KEY_RE, filePath, "meta");
    problems.push(meta);
  }
  return problems;
}

async function main() {
  // Imported before the corpus walk because `collectLessons` needs it, and
  // safe to `import()` here for the same reason `search/index.ts` is: the
  // module has no imports at all, by construction (see its header), so plain
  // Node's inability to resolve `@/...` never comes up.
  const { extractLessonKeywords } = await import(
    pathToFileURL(path.join(ROOT, "src/lib/search/lessonKeywords.ts")).href
  );

  const [lessons, problems] = await Promise.all([
    collectLessons(extractLessonKeywords),
    collectProblems(),
  ]);

  // Both imported with explicit ".ts" extensions and no "@/..." aliases —
  // Node's native TypeScript support resolves plain relative/absolute
  // specifiers fine, it just doesn't understand this project's tsconfig
  // path aliases or extension-less imports the way Next's bundler does.
  // `curriculum.ts` and (after the refactor described in its doc comment)
  // `search/index.ts` are both written so their only *runtime* imports are
  // each other/plain data, making this safe.
  const curriculumModule = await import(pathToFileURL(path.join(ROOT, "src/lib/content/curriculum.ts")).href);
  // The glossary is imported for real (it's plain data, and the resolve hook
  // at the top of this file handles its extension-less `./concepts` import)
  // rather than text-parsed like lessons and problems: `GLOSSARY_TERMS` is
  // assembled at module scope from `CONCEPT_NODES` *plus* a literal array, so
  // scraping the literal would silently drop every concept-derived term.
  //
  // This is also the only place the glossary is allowed to be read for
  // search. It is a large prose corpus under a client-bundle budget, so the
  // terms must reach the browser through this prebuilt JSON — never through a
  // client-side import in `src/components/search/**`.
  const glossaryModule = await import(pathToFileURL(path.join(ROOT, "src/lib/content/glossary.ts")).href);
  const terms = glossaryModule.GLOSSARY_TERMS;

  if (!Array.isArray(terms) || terms.length === 0) {
    throw new Error(
      "No glossary terms found in src/lib/content/glossary.ts, so refusing to generate a search index with no glossary. A single-word query is the most common search a newcomer makes."
    );
  }

  const searchModule = await import(pathToFileURL(path.join(ROOT, "src/lib/search/index.ts")).href);
  const index = searchModule.buildSearchIndex(
    lessons,
    problems,
    curriculumModule.COURSES,
    terms,
    curriculumModule.PILLARS,
    termLinkCounts
  );

  if (index.length === 0) {
    throw new Error("buildSearchIndex() produced an empty index, so refusing to write an empty search-index.json.");
  }

  const serialized = JSON.stringify(index);
  const bytes = Buffer.byteLength(serialized);
  if (bytes > MAX_INDEX_BYTES) {
    throw new Error(
      `search-index.json would be ${(bytes / 1024).toFixed(1)}KB, over the ${MAX_INDEX_BYTES / 1024}KB ceiling. ` +
        "Every reader who opens search downloads this file whole, so it is not free to grow. " +
        "If the corpus genuinely got bigger, raise MAX_INDEX_BYTES here and the gzip budget in " +
        "src/lib/design/__tests__/clientBoundary.test.ts together, deliberately. If a lesson's body " +
        "started arriving in bulk, the per-lesson cap is LESSON_KEYWORD_BUDGET in src/lib/search/lessonKeywords.ts."
    );
  }

  const withKeywords = index.filter((entry) => typeof entry.keywords === "string" && entry.keywords.length > 0);
  if (withKeywords.length < lessons.length) {
    throw new Error(
      `Only ${withKeywords.length} of ${lessons.length} lessons produced a keyword set. ` +
        "A lesson whose body yields no terms is either empty or has an .mdx preamble the body scan " +
        "cannot find the end of. See bodyOf() in src/lib/search/lessonKeywords.ts."
    );
  }

  await mkdir(path.dirname(OUTPUT), { recursive: true });
  // Staged through a temp file and renamed into place (see `writeGenerated`).
  // This destination in particular is the one that has failed with a bare
  // `UNKNOWN: unknown error, open '…\public\search-index.json'` on Windows
  // while the other two generators succeeded in the same run: `public/` is
  // exactly the directory a running `next dev` (and every file watcher and
  // antivirus scanner) keeps handles in, and the old truncating open needed
  // exclusive access. A half-written search index is also uniquely bad — it
  // is fetched as JSON at runtime, so a truncated file breaks the search
  // overlay for real users rather than failing a build.
  await writeGenerated(OUTPUT, serialized);
  console.log(
    `generate-search-index: wrote ${index.length} entries (${terms.length} glossary terms, ${lessons.length} lessons, ${problems.length} problems) to ${path.relative(ROOT, OUTPUT)}, ${(bytes / 1024).toFixed(1)}KB of ${MAX_INDEX_BYTES / 1024}KB`
  );
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
