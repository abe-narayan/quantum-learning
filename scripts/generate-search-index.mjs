#!/usr/bin/env node
/**
 * Generates `public/search-index.json`, the static, site-wide search index
 * the client-side search overlay fetches lazily (only once a user actually
 * opens search — see `src/components/search/SearchOverlay.tsx` and
 * `src/lib/search/fetchIndex.ts`) instead of it being baked into every
 * page's RSC/hydration payload via the root layout.
 *
 * Why this exists as a script rather than something called at request time:
 * the index needs metadata from every lesson (158 MDX files under
 * `src/content/lessons/**`) and every problem (423 TS files under
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
 * Run via `npm run generate:search-index`, or automatically before
 * `dev`/`build`/`test` via the `predev`/`prebuild`/`pretest` npm lifecycle
 * hooks (alongside `generate:registry`).
 */
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

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

/** Recursively collects every file ending in `extension` under `dir`, as slugs relative to `dir` (posix-separated, no extension). */
async function walk(dir, extension, base = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const slugs = [];

  for (const entry of entries) {
    const relativePath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      slugs.push(...(await walk(path.join(dir, entry.name), extension, relativePath)));
    } else if (entry.name.endsWith(extension)) {
      slugs.push(relativePath.slice(0, -extension.length));
    }
  }

  return slugs;
}

/** Finds the index of the `}` that closes the `{` at `openIndex`, respecting string literals (so braces inside strings don't confuse depth-counting). */
function findMatchingBrace(source, openIndex) {
  let depth = 0;
  let inString = null;

  for (let i = openIndex; i < source.length; i++) {
    const ch = source[i];
    if (inString) {
      if (ch === "\\") {
        i++; // skip the escaped character
      } else if (ch === inString) {
        inString = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
    } else if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }

  throw new Error("Unbalanced braces while scanning for the end of an object literal");
}

/**
 * Finds the first match of `keyPattern` (a regex whose match ends in "{",
 * e.g. `/meta:\s*\{/`) in `source`, then extracts and evaluates the object
 * literal that opening brace starts. Only ever evaluates the small,
 * self-contained literal it extracts — not the surrounding file — so this
 * is safe even though the source files themselves import from aliases this
 * script can't resolve.
 */
function extractObjectLiteral(source, keyPattern, filePath, label) {
  const match = keyPattern.exec(source);
  if (!match) {
    throw new Error(`${filePath}: could not find ${label} (expected to match ${keyPattern})`);
  }
  const openIndex = match.index + match[0].length - 1;
  const closeIndex = findMatchingBrace(source, openIndex);
  const literal = source.slice(openIndex, closeIndex + 1);
  try {
    // Evaluating our own trusted, plain-data object literal extracted from
    // this repo's source (never user input) — the whole point is to avoid
    // executing the rest of the file, which is what a real `import()`
    // would do.
    return new Function(`"use strict"; return (${literal});`)();
  } catch (err) {
    throw new Error(`${filePath}: failed to evaluate ${label}: ${err.message}`);
  }
}

async function collectLessons() {
  const slugs = (await walk(LESSONS_ROOT, ".mdx")).sort((a, b) => a.localeCompare(b));
  if (slugs.length === 0) {
    throw new Error(`No lesson files found under ${LESSONS_ROOT} — refusing to generate an empty search index.`);
  }

  const lessons = [];
  for (const slug of slugs) {
    const filePath = path.join(LESSONS_ROOT, `${slug}.mdx`);
    const source = await readFile(filePath, "utf8");
    const meta = extractObjectLiteral(source, /export const lessonMeta\s*=\s*\{/, filePath, "lessonMeta");
    lessons.push({ ...meta, slug });
  }
  return lessons;
}

async function collectProblems() {
  const slugs = (await walk(PROBLEMS_ROOT, ".ts")).sort((a, b) => a.localeCompare(b));
  if (slugs.length === 0) {
    throw new Error(`No problem files found under ${PROBLEMS_ROOT} — refusing to generate an empty search index.`);
  }

  const problems = [];
  for (const slug of slugs) {
    const filePath = path.join(PROBLEMS_ROOT, `${slug}.ts`);
    const source = await readFile(filePath, "utf8");
    const meta = extractObjectLiteral(source, /\bmeta:\s*\{/, filePath, "meta");
    problems.push(meta);
  }
  return problems;
}

async function main() {
  const [lessons, problems] = await Promise.all([collectLessons(), collectProblems()]);

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
      "No glossary terms found in src/lib/content/glossary.ts — refusing to generate a search index with no glossary. A single-word query is the most common search a newcomer makes."
    );
  }

  const searchModule = await import(pathToFileURL(path.join(ROOT, "src/lib/search/index.ts")).href);
  const index = searchModule.buildSearchIndex(
    lessons,
    problems,
    curriculumModule.COURSES,
    terms,
    curriculumModule.PILLARS
  );

  if (index.length === 0) {
    throw new Error("buildSearchIndex() produced an empty index — refusing to write an empty search-index.json.");
  }

  await mkdir(path.dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(index), "utf8");
  console.log(
    `generate-search-index: wrote ${index.length} entries (${terms.length} glossary terms, ${lessons.length} lessons, ${problems.length} problems) to ${path.relative(ROOT, OUTPUT)}`
  );
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
