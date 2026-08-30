import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";

/**
 * ============================================================
 * Client-bundle boundary
 * ============================================================
 * This site is ~800 statically generated pages of content. The heaviest
 * things in the repo are the content registries — 547 problems with every
 * hint, answer and worked solution; 32 courses with every module; the lesson
 * corpus loader. None of them belong in a browser bundle.
 *
 * They get there the same way every time: a `"use client"` component imports
 * a helper for one small thing, and the whole registry follows it across the
 * boundary. That is not hypothetical — `src/components/home/DailyPuzzle.tsx`
 * was a client component that called `getAllProblemMeta()`/`getProblem()` to
 * preview a single daily problem, and shipped **the entire problem corpus,
 * ~366 KB gzip, to every visitor who loaded the homepage.** Nothing failed.
 * `tsc` was happy, the page rendered correctly, and the only symptom was a
 * homepage bundle twice the size of every other route.
 *
 * So the rule is enforced mechanically, transitively, from the source graph.
 */

const SRC = path.resolve(import.meta.dirname, "../../..");

/**
 * Gzipped size of what a module actually *ships*, with comments removed first.
 *
 * The budgets below existed for a while measured against raw source, and that
 * was quietly the wrong quantity. Comments are stripped by the bundler and
 * reach no browser, but they are 14–74% of the gzipped source of the modules
 * budgeted here (`lib/problems/types.ts` is 74%; `field/regimes.ts` 54%;
 * `curriculum.ts` 30%). Measuring them made these tests a tax on the one thing
 * this codebase most wants people to do: a fifteen-line comment explaining why
 * a prerequisite edge was removed pushed `curriculum.ts` from 15.8 to 16.1 KB
 * and failed a "these ship to the browser" assertion, over bytes that ship
 * nowhere.
 *
 * A guard that punishes documentation gets documentation deleted, or gets its
 * number raised until it no longer guards anything. So the numbers now track
 * payload. They are correspondingly *smaller* than the old raw-source figures
 * and no looser: what is left is data, and data is what regresses.
 *
 * The stripper is deliberately blunt — block comments and whole-line `//` —
 * rather than a real parser. It is measuring a budget, not generating code, so
 * a `//` inside a string literal costing us a few bytes of imagined payload is
 * a rounding error, and blunt means it cannot itself break.
 */
function payloadKb(absolutePath: string): number {
  const source = readFileSync(absolutePath, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("//"))
    .join("\n");
  return gzipSync(Buffer.from(source)).length / 1024;
}

/**
 * Modules that must never reach a client bundle, and why.
 *
 * `lib/problems/registry` is the severe one, and it is worth being precise
 * about why: `registry.generated.ts` *statically* imports all 547 problem
 * modules from `src/content/problems/**`, so importing the registry pulls in
 * every question, hint, tolerance, **answer and worked solution** — measured
 * at ~366 KB gzip. That is both a bundle-size problem and a pedagogical one:
 * the answers to every problem on the site would sit in a file any student
 * can open in devtools.
 */
const SERVER_ONLY: Record<string, string> = {
  "lib/problems/registry":
    "statically imports all 547 problem modules — every answer and worked solution, ~366 KB gzip",
  "lib/content/lessons": "the lesson-corpus loader (dynamic-imports all 219 MDX modules)",
  // 239 terms with full definitions, ~38KB gzipped source and growing with
  // every lesson that needs a word explained. It reached the client exactly
  // once, through `lib/search/glossaryEntries.ts`, which `SearchOverlay`
  // dynamic-imported so the search panel could match glossary rows. That file
  // is gone: glossary rows are now baked into `public/search-index.json` at
  // build time, so search matches them without the module. Every remaining
  // importer is a server component (`app/glossary/page.tsx`,
  // `app/about/page.tsx`, `components/mdx/Term.tsx`) or type-only
  // (`lib/search/index.ts`, `components/glossary/**`). Keeping it here means a
  // future `"use client"` component that reaches for a definition fails loudly
  // rather than quietly shipping the whole glossary to every visitor.
  "lib/content/glossary.ts": "all 272 glossary definitions (~38KB gzip); search reads the prebuilt index instead",
  // The meta-only registry split out of `lib/problems/registry` so server
  // pages can list/count problems without the bodies. Meta-only is *lighter*
  // than the full registry, not light: 547 titles/slugs/tags is still a
  // corpus-sized module, and any client surface that needs a slice of it
  // should be handed that slice by a server component — as a prop, the way
  // `app/layout.tsx` hands `Navbar` its `problemCount` — rather than
  // importing the whole thing, and rather than mirroring it into a
  // client-safe table of its own (see ALLOWED_BUDGET_KB for how that ended).
  "lib/problems/metaRegistry.ts": "meta for all 547 problems; shape a slice server-side instead of shipping the index",
  "lib/problems/problemMeta.generated.ts": "the generated all-problem meta array behind metaRegistry",
  // Same reasoning as the problem meta registry: 219 lesson metas (~40KB
  // gzip) are for server components to slice; client surfaces get exactly
  // the fields they need as props (slug→title maps etc.).
  "lib/content/lessonMeta.generated.ts": "the generated all-lesson meta array behind lib/content/lessons",
  // Was a CLIENT_DATA_BUDGET_KB entry at 20KB until it outgrew it (21.3KB
  // gzip, and climbing with every entry added). The fix was the same split
  // the problem corpus already uses: `currentQuantum/metaRegistry.ts` now
  // holds the slug/date/title/category/lesson of each entry — everything a
  // *link* to one needs — while `data.ts` keeps the summary prose, "why this
  // matters" line, source citation, image metadata and the editorial
  // provenance comments, keyed by slug. `registry.ts` joins the two.
  // `ConceptDetailPanel` (the one client surface that ever needed any of
  // this, to print a date and a title in a mini-card) now imports the meta
  // registry, so the prose half has no client reader at all — and "must not
  // reach a client bundle" is a stronger, non-renegotiable promise than a
  // number that has to be raised every time an entry is added. The light
  // half keeps a budget below.
  "lib/content/currentQuantum/data.ts":
    "every entry's summary/whyThisMatters/citation/image metadata; import metaRegistry.ts for slug/date/title/category",
  "lib/content/currentQuantum/registry.ts":
    "joins the meta to the prose, so it drags data.ts along; the meta-only twin is metaRegistry.ts",
  content: "raw lesson/problem content modules",
};

/**
 * Data modules that a genuinely interactive client component may import —
 * a search box, a filter, or the concept map cannot work without the data it
 * filters — but which must not silently balloon. Sizes are gzipped source,
 * measured with `payloadKb` (comments excluded, since they ship nowhere);
 * the budget is deliberately close to current so that a large addition forces
 * a conversation rather than sliding in.
 */
const CLIENT_DATA_BUDGET_KB: Record<string, number> = {
  "lib/content/curriculum.ts": 12,
  "lib/content/concepts.ts": 14,
  // `lib/content/glossary.ts` used to sit here at a 20KB budget. It has moved
  // to SERVER_ONLY instead — see the note there. A size budget was the right
  // guard while a client component imported it; now that none does, "must not
  // reach a client bundle at all" is both true and a stronger promise than any
  // number, and it does not have to be renegotiated every time the glossary
  // grows a term.
  // Reached from `ConceptDetailPanel` via
  // `currentQuantum/metaRegistry`'s `getCurrentQuantumMetaForLesson`, which
  // closes over the whole meta list. Mitigated by the concept map being
  // `ssr:false` and code-split, so it never blocks first paint — but it is
  // real client weight, which is why it belongs here.
  //
  // This replaces the 20KB budget that `currentQuantum/data.ts` used to
  // hold. That module carried the whole collection — prose, citations,
  // image metadata — because the panel imported the full registry to print
  // a date and a title; it hit 21.3KB gzip and failed. Splitting the five
  // link-shaped fields out into `metaRegistry.ts` took the client-reachable
  // half to 4.5KB and moved `data.ts` to SERVER_ONLY (see the note there).
  // The number below is deliberately close to that 4.5KB: the whole point
  // of the split is that this half grows by ~0.15KB per entry instead of
  // ~0.7KB, so a budget this tight still allows years of entries while
  // catching anyone who tries to move a prose field back across.
  "lib/content/currentQuantum/metaRegistry.ts": 4,
};

/**
 * Deliberate, reviewed exceptions to SERVER_ONLY. The bar is that the module
 * is genuinely small and purpose-built, not that the failure was tolerable.
 */
const ALLOWED: Record<string, string> = {
  // `components/layout/problemPillarIndex.ts` was the first and largest entry
  // here and is gone: a 556-row slug->pillar table, exempted on the grounds
  // that it carried no problem bodies, which was true and beside the point at
  // 7.24KB gzip on every route. See the note on ALLOWED_BUDGET_KB below for
  // what the number attached to it was for, and CLIENT_DATA_TOTAL_CEILING_KB
  // for what replaced the table.
  "lib/content/types.ts": "types plus the DIFFICULTY_LABEL constant; trivial at runtime",
  "lib/problems/types.ts": "types only",
  "lib/content/progress": "client-side progress storage; belongs on the client by design",
  "lib/problems/progress": "client-side progress storage; belongs on the client by design",
};

/**
 * A size cap for every `ALLOWED` exception, because "small and purpose-built"
 * is a claim about today that nothing was checking.
 *
 * `components/layout/problemPillarIndex.ts` is the reason this map exists,
 * and the reason it works. It was exempt from SERVER_ONLY on the grounds that
 * it carried no problem bodies — true, and still beside the point for a
 * browser: one row per problem, imported by `Navbar`, `Navbar` in the root
 * layout, so every visitor on every route downloaded all 556 rows to tint a
 * badge on the 556 problem pages. At ~15 bytes gzip per slug it grew with the
 * corpus forever, and an exemption with no number attached cannot notice.
 *
 * The number noticed. It was set at 9KB against 8.4KB with the note "roughly
 * another 100 problems before someone has to decide whether the navbar's
 * pillar tint is worth a table that large" — and that decision came due at
 * 7.24KB of a 100KB ceiling rather than at the per-module cap. The answer was
 * neither "shrink it" nor "raise it" but the third option the note named:
 * `detectPillar` no longer answers `/problems/*` at all. `<PillarScope>` has
 * always published the page's pillar to `components/field/fieldStore`, so
 * `Navbar` subscribes to that with `useFieldState()`, and the table, its
 * exemption and its budget are all deleted rather than renegotiated. The
 * entry is gone from both maps; this paragraph is what it left behind.
 *
 * A prefix that names a directory is measured as the sum of every
 * client-reachable module under it, so splitting a file in two does not
 * launder its weight.
 */
const ALLOWED_BUDGET_KB: Record<string, number> = {
  "lib/content/types.ts": 1,
  "lib/problems/types.ts": 2,
  "lib/content/progress": 3,
  "lib/problems/progress": 3,
};

/**
 * Ceiling on the *sum* of every non-component module a client component can
 * reach — the number no per-module budget can see.
 *
 * Each cap above answers "is this one module too big"; none of them answers
 * "how much data does this app ship in total", and that is the quantity that
 * actually regresses. It regresses by addition, not by growth: ten new 3KB
 * modules, each obviously fine on its own, each below every budget, each
 * added by a different person. Measured at 90.1KB gzip of payload across 85
 * modules when this was written (the earlier 160.3KB figure counted comment
 * text, which ships nowhere — see `payloadKb`); the ceiling left ~11%, about
 * five more simulators' worth of `lib/quantum` kernels, or one new content
 * registry, before it had to be raised on purpose.
 *
 * RAISED ONCE, ON PURPOSE, WITH THE ARITHMETIC.
 *
 * That headroom is spent: the tree reached 99.9KB across 88 modules on its
 * own, and the simulator-correctness pass then added 0.435KB and crossed the
 * line. Measured, per module, rather than waved through:
 *
 *   lib/quantum/timeEvolution.ts                        +0.213KB
 *   components/simulators/bloch-sphere/
 *     useAnimatedBlochPoint.ts                          +0.207KB
 *   lib/quantum/format.ts                               +0.015KB
 *
 * All three are bug fixes with tests, not features. `timeEvolution` gained
 * two probability-mass checks that let the Wavefunction Explorer notice when
 * a packet has wrapped around the periodic FFT box, which it previously
 * narrated as physical spreading while ⟨x⟩ ran backwards;
 * `useAnimatedBlochPoint` gained the length/direction split that stops the
 * Noise Explorer's Bloch arrow growing 24% mid-tween while decohering; and
 * `format` stopped printing a zero amplitude as "-0.00". None of it is
 * corpus-shaped, none of it grows with the content, and shrinking it further
 * (the error strings are already trimmed and the two new sums already share
 * one loop) only buys back hundredths of a KB.
 *
 * 102 rather than 101: at 101 the next module of any size trips this again
 * immediately, which turns a deliberate decision into a recurring tax on
 * whoever is unlucky. The ~1.6KB of room left is roughly one more engine
 * kernel; the next person to need more should do this same arithmetic rather
 * than nudge the number.
 *
 * LOWERED AGAIN, SAME DAY, BY DERIVATION RATHER THAN BY FEEL.
 *
 * `components/layout/problemPillarIndex.ts` then left the client graph
 * entirely — 7.24KB, 7.2% of this whole ceiling, one row per problem shipped
 * on all 830 routes so the navbar could tint a badge on 556 of them. The page
 * already publishes its pillar to `components/field/fieldStore` through
 * `<PillarScope>`, so `Navbar` subscribes with `useFieldState()` instead, and
 * the count the table also carried (`PROBLEM_COUNT`) now crosses the boundary
 * as a prop from `app/layout.tsx`, the way `startLessonMinutes` already did.
 * Total: 99.9 -> 93.9KB across 89 modules.
 *
 * Leaving the ceiling at 102 would have handed that 8KB to whoever asked
 * next, which is the opposite of what a reduction is for. So it is re-derived
 * rather than restored:
 *
 *   measured total                                        93.87KB
 *   + slack the per-module budgets above already grant      5.24KB
 *       curriculum.ts        11.83 / 12   0.17
 *       concepts.ts          13.13 / 14   0.88
 *       currentQuantum/
 *         metaRegistry.ts     2.83 / 4    1.17
 *       content/types.ts      0.43 / 1    0.57
 *       problems/types.ts     1.12 / 2    0.88
 *       content/progress      2.03 / 3    0.97
 *       problems/progress     2.40 / 3    0.60
 *   ------------------------------------------------------------
 *                                                         99.11KB  ->  100
 *
 * The margin IS that slack, and nothing else. Anything with a budget of its
 * own can grow into it without this number firing first and pointing at the
 * wrong guard; anything *without* one — a new module, a new registry, an
 * unbudgeted helper — trips this immediately, which is the addition this
 * ceiling exists to catch. Rounding 99.11 up to a whole KB is the only free
 * room in it, 0.89KB, and it is there because eleven agents were editing this
 * tree while it was measured (it moved 0.74KB in ninety minutes) and a guard
 * that fires on measurement jitter gets deleted.
 *
 * Note the coupling this creates, deliberately: raising a per-module budget
 * raises the slack, so it also raises the honest value of this number. They
 * move together, and both should be re-derived in the same change.
 *
 * WHAT THIS NUMBER IS NOT. It is the union across all 830 routes, not what a
 * reader downloads. The walk roots at every `"use client"` file whether or not
 * any route eagerly renders it, and it does not model `next/dynamic`, so a
 * lazily-fetched module counts here at full weight. Measured against the real
 * build: 29 emitted chunks totalling 986KB raw are referenced by none of the
 * 824 HTML files. The ceiling is therefore conservative relative to per-reader
 * cost — which is a reason to keep it strict, not a reason to loosen it.
 *
 * `curriculum.ts` is untouched by any of this and remains the tightest thing
 * here: 11.83KB against its own 12KB budget, 0.17KB, with course descriptions
 * still being written. Nothing in this change helps it — different scope, and
 * the navbar table was never in its graph. When it goes over, the move is the
 * one `currentQuantum` already made: the client surfaces that import it
 * (`CurriculumExplorer`, `FilterChips`, `CourseList`) need slugs, titles,
 * pillars and order, not the prose, and the prose is the half that grows.
 */
const CLIENT_DATA_TOTAL_CEILING_KB = 100;

/**
 * The other thing this app ships to a browser, which none of the budgets above
 * can see: `public/search-index.json`.
 *
 * It is not a module, so the import-graph walk never reaches it, and it is not
 * in any bundle — the overlay fetches it lazily, once, the first time a reader
 * opens search (`lib/search/fetchIndex.ts`). That makes it *cheaper* than a
 * bundled module, and not free: it is fetched **whole**, so every byte in it
 * is paid by every reader who ever uses search, and there is no code-splitting
 * story that makes half of it arrive.
 *
 * It got a budget when lesson bodies became searchable. Before that the index
 * carried a title, a description and an href per entry — 403KB raw / 100.7KB
 * gzip across 1,076 entries — and it could not answer the queries a stuck
 * reader types: `power series`, `factorial`, `half angle` and `theta/2` all
 * returned nothing about concepts the site teaches. The fix adds a bounded set
 * of the terms each lesson teaches (`lib/search/lessonKeywords.ts`), measured
 * at 526KB raw / 131.6KB gzip.
 *
 * The numbers below are what makes that a decision rather than a slope. For
 * scale, the alternative that was measured and rejected — appending each
 * lesson's deduplicated vocabulary, which is *still* not the full prose —
 * lands at 1.27MB raw / 316KB gzip, and would blow through both of these by
 * more than a factor of two.
 *
 * Raise them only with the per-lesson cap (`LESSON_KEYWORD_BUDGET`) and the
 * generator's own `MAX_INDEX_BYTES`, which fails the build rather than the
 * test suite, in the same change.
 *
 * The gzip ceiling was raised 140 -> 145 on 2026-08-29, under that rule and
 * with the cap pulled first. Ten glossary entries were added (258 -> 272), and
 * because a term carries its whole definition so it is findable by what it
 * says rather than only by its name, that took the index to 141.85KB gzip.
 * `LESSON_KEYWORD_BUDGET` went 600 -> 540, which is 531.5KB raw / 138.51KB
 * gzip. It did not go lower because 520 breaks `RECOVERY_QUERIES`: `factorial`
 * stops reaching the lesson that teaches it, which is the exact query class
 * the keyword set exists for. So the cap is now at its recall floor, the
 * content that pushed the number up is content a reader benefits from, and
 * 1.5KB of headroom is not enough to edit a definition against. 145 restores
 * 6.5KB.
 *
 * What has NOT changed is the shape of the decision. The alternative measured
 * and rejected when this budget was set (appending each lesson's deduplicated
 * vocabulary) is 1.27MB raw / 316KB gzip. This is a 5KB step taken with the
 * sweep written down, not a slope.
 */
const SEARCH_INDEX_PATH = "public/search-index.json";
const SEARCH_INDEX_RAW_CEILING_KB = 560;
const SEARCH_INDEX_GZIP_CEILING_KB = 145;

/**
 * Routes whose eager client graph reaches the `katex` runtime today.
 *
 * **Empty, and meant to stay that way.** `katex.min.js` is 268KB raw / 74KB
 * gzip, and the whole point of `rehypeKatexHtml.mjs` is that this site
 * renders math to HTML at build time and does not need it in a browser.
 *
 * All three chains the audit found are now closed. Two were lesson-side and
 * are pinned by name below (`mdx-components.tsx`, `LessonLayout.tsx`). The
 * third, and the largest by page count, was `/problems/[slug]`:
 * `ProblemView` (then a client component) -> `SolutionPanel` -> `KatexMath`,
 * plus `ProblemView` -> `AnswerInput` -> `ScrollableMathText` -> `MathText`,
 * on all 547 problem pages. Note what those chains have in common: not one
 * of `SolutionPanel`, `AnswerInput`, `ScrollableMathText` or `MathText`
 * carries a `"use client"` directive of its own — each was dragged over the
 * boundary by its importer, which is why the two by-name tests never saw it.
 *
 * It was fixed the way the lesson corpus already does it: `ProblemView` is
 * now a Server Component that renders the problem's math to KaTeX HTML
 * strings (`components/problems/renderProblemMath.ts`) and hands them to
 * `ProblemViewClient`, whose subtree only injects strings
 * (`components/problems/RenderedMathText.tsx`). Measured: ~568 bytes gzip
 * added to the average page's flight payload, 74.1KB gzip of JS removed from
 * every one of them.
 *
 * An entry here is debt, not a licence: it records a chain that exists, with
 * its fix written down. Adding one is a conversation; the test below fails
 * the moment an entry stops matching reality, so a fixed chain cannot leave
 * an excuse behind for the next route.
 */
const KATEX_IN_EAGER_CLIENT_GRAPH: Record<string, string> = {};

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx?|ts)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

const ALL_FILES = walk(SRC);

/** `src/`-relative, forward-slashed. */
function rel(file: string): string {
  return path.relative(SRC, file).replace(/\\/g, "/");
}

/** Extracts every import/export-from specifier, including `import type`
 *  (which is erased, and filtered out below by resolving to a real file and
 *  checking the statement form). */
function importsOf(source: string): string[] {
  const specifiers: string[] = [];
  // Skip `import type { ... } from "..."` — erased at compile time, so it
  // cannot pull anything into a bundle.
  const pattern = /(?:^|\n)\s*(?:import|export)\s+(type\s+)?([^;]*?)from\s*["']([^"']+)["']/g;
  for (const match of source.matchAll(pattern)) {
    const [, typeOnly, clause, specifier] = match;
    if (typeOnly) continue;
    // `import { type A, type B } from "x"` is also fully erased.
    const named = clause.match(/\{([^}]*)\}/);
    if (named && named[1].trim() && named[1].split(",").every((part) => /^\s*type\s/.test(part))) {
      continue;
    }
    specifiers.push(specifier);
  }
  return specifiers;
}

/** Resolves a specifier to a file under `src/`, or null if external. */
function resolve(fromFile: string, specifier: string): string | null {
  let base: string;
  if (specifier.startsWith("@/")) base = path.join(SRC, specifier.slice(2));
  else if (specifier.startsWith(".")) base = path.resolve(path.dirname(fromFile), specifier);
  else return null;

  for (const candidate of [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ]) {
    if (existsSync(candidate) && !readdirSafeIsDir(candidate)) return candidate;
  }
  return null;
}

function readdirSafeIsDir(target: string): boolean {
  try {
    readdirSync(target);
    return true;
  } catch {
    return false;
  }
}

function isAllowed(relativePath: string): boolean {
  return Object.keys(ALLOWED).some((prefix) => relativePath.startsWith(prefix));
}

function serverOnlyReason(relativePath: string): string | null {
  if (isAllowed(relativePath)) return null;
  for (const [prefix, reason] of Object.entries(SERVER_ONLY)) {
    if (relativePath === prefix || relativePath.startsWith(`${prefix}/`) || relativePath.startsWith(`${prefix}.`)) {
      return reason;
    }
  }
  return null;
}

const sourceCache = new Map<string, string>();
function read(file: string): string {
  let cached = sourceCache.get(file);
  if (cached === undefined) {
    cached = readFileSync(file, "utf8");
    sourceCache.set(file, cached);
  }
  return cached;
}

/** Walks the import graph from a client entry point, returning the first
 *  server-only module reached and the path taken to it. */
function findServerOnlyReachableFrom(entry: string): { module: string; reason: string; via: string[] } | null {
  const seen = new Set<string>();
  const queue: Array<{ file: string; via: string[] }> = [{ file: entry, via: [rel(entry)] }];

  while (queue.length > 0) {
    const { file, via } = queue.shift()!;
    if (seen.has(file)) continue;
    seen.add(file);

    for (const specifier of importsOf(read(file))) {
      const resolved = resolve(file, specifier);
      if (!resolved) continue;
      const relative = rel(resolved);
      const reason = serverOnlyReason(relative);
      if (reason) return { module: relative, reason, via: [...via, relative] };
      queue.push({ file: resolved, via: [...via, relative] });
    }
  }

  return null;
}

/**
 * Bare package specifiers (e.g. `"katex"`, `"react"`) reachable through
 * *static* imports from an entry module, mapped to the path that reached
 * them.
 *
 * Honest about lazy boundaries by construction, not by special-casing:
 * `importsOf` matches only `import ... from "..."` statement forms, so a
 * `dynamic(() => import("..."))` factory or an on-demand `await
 * import("...")` is never an edge here — which mirrors the bundler exactly,
 * where a dynamic `import()` starts a separate, lazily fetched chunk instead
 * of joining the eager graph. A `Lazy*` wrapper therefore contributes its
 * own (thin) imports but not its dynamically-loaded payload.
 */
function externalPackagesReachableFrom(entry: string): Map<string, string[]> {
  const seen = new Set<string>();
  const found = new Map<string, string[]>();
  const queue: Array<{ file: string; via: string[] }> = [{ file: entry, via: [rel(entry)] }];

  while (queue.length > 0) {
    const { file, via } = queue.shift()!;
    if (seen.has(file)) continue;
    seen.add(file);

    for (const specifier of importsOf(read(file))) {
      const resolved = resolve(file, specifier);
      if (resolved) {
        queue.push({ file: resolved, via: [...via, rel(resolved)] });
      } else if (!specifier.startsWith(".") && !specifier.startsWith("@/") && !found.has(specifier)) {
        // Unresolvable and not a project path — an external package.
        found.set(specifier, [...via, specifier]);
      }
    }
  }

  return found;
}

const CLIENT_FILES = ALL_FILES.filter((file) => /^\s*["']use client["']/.test(read(file)));
const CLIENT_SET = new Set(CLIENT_FILES.map(rel));

/** Every module a `"use client"` file can reach through static imports —
 *  i.e. everything that ends up in *some* client chunk, eager or lazy. */
function clientReachableModules(): Set<string> {
  const reachable = new Set<string>();
  for (const file of CLIENT_FILES) {
    const seen = new Set<string>();
    const queue = [file];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (seen.has(current)) continue;
      seen.add(current);
      reachable.add(rel(current));
      for (const specifier of importsOf(read(current))) {
        const resolved = resolve(current, specifier);
        if (resolved) queue.push(resolved);
      }
    }
  }
  return reachable;
}

/** Every route-level entry the App Router compiles a page from, plus the
 *  global MDX mapping, which is spliced into all 219 lesson pages. */
const ROUTE_ENTRIES = ALL_FILES.map(rel).filter(
  (file) =>
    (file.startsWith("app/") && /\/(page|layout)\.tsx$/.test(file)) || file === "mdx-components.tsx",
);

/**
 * Bare package specifiers in one route's EAGER client graph — what a visitor
 * downloads before they interact with anything on that page.
 *
 * Unlike `externalPackagesReachableFrom`, this respects the server/client
 * boundary instead of over-approximating past it: it walks the server modules
 * from the route entry, stops at each `"use client"` file (that file, and
 * everything statically below it, is the client bundle), and collects
 * packages from there down. The difference is not cosmetic — the
 * over-approximating walk reports `katex` for `app/courses/[slug]/page.tsx`,
 * where `MathText` renders entirely on the server and no KaTeX ever reaches a
 * browser. A guard that cries wolf on a correct page is a guard someone
 * eventually deletes.
 *
 * Dynamic `import()` is not an edge here, for the same reason it is not one
 * in `externalPackagesReachableFrom`: it starts a separate chunk that is
 * fetched after paint, so a `Lazy*` wrapper contributes its own thin imports
 * and not its payload.
 */
function eagerClientPackagesForRoute(routeFile: string): Map<string, string[]> {
  const clientEntries: Array<{ file: string; via: string[] }> = [];
  const seenServer = new Set<string>();
  const serverQueue: Array<{ file: string; via: string[] }> = [
    { file: routeFile, via: [routeFile] },
  ];

  while (serverQueue.length > 0) {
    const { file, via } = serverQueue.shift()!;
    if (seenServer.has(file)) continue;
    seenServer.add(file);
    if (CLIENT_SET.has(file)) {
      clientEntries.push({ file, via });
      continue;
    }
    const full = path.join(SRC, file);
    for (const specifier of importsOf(read(full))) {
      const resolved = resolve(full, specifier);
      if (resolved) serverQueue.push({ file: rel(resolved), via: [...via, rel(resolved)] });
    }
  }

  const found = new Map<string, string[]>();
  const seen = new Set<string>();
  const clientQueue = [...clientEntries];
  while (clientQueue.length > 0) {
    const { file, via } = clientQueue.shift()!;
    if (seen.has(file)) continue;
    seen.add(file);
    const full = path.join(SRC, file);
    for (const specifier of importsOf(read(full))) {
      const resolved = resolve(full, specifier);
      if (resolved) {
        clientQueue.push({ file: rel(resolved), via: [...via, rel(resolved)] });
      } else if (!specifier.startsWith(".") && !specifier.startsWith("@/") && !found.has(specifier)) {
        found.set(specifier, [...via, specifier]);
      }
    }
  }

  return found;
}

describe("client bundle boundary", () => {
  it("finds the client components (guards the guard)", () => {
    // If the detection ever breaks, the rest of this file would pass over an
    // empty set and assert nothing.
    expect(CLIENT_FILES.length).toBeGreaterThan(10);
  });

  it("never reaches a server-only content registry from a client component", () => {
    const leaks: string[] = [];

    for (const file of CLIENT_FILES) {
      const leak = findServerOnlyReachableFrom(file);
      if (leak) {
        leaks.push(`${rel(file)}\n    reaches ${leak.module} (${leak.reason})\n    via ${leak.via.join(" -> ")}`);
      }
    }

    expect(
      leaks,
      "a client component pulls a content registry into the browser bundle; shape the data in a server component and pass the minimum to a thin client child",
    ).toEqual([]);
  });

  it("keeps client-importable data modules inside their size budget", () => {
    const over: string[] = [];

    for (const [relativePath, budgetKb] of Object.entries(CLIENT_DATA_BUDGET_KB)) {
      const full = path.join(SRC, relativePath);
      if (!existsSync(full)) {
        over.push(`${relativePath} no longer exists — update CLIENT_DATA_BUDGET_KB`);
        continue;
      }
      const gzipped = payloadKb(full);
      if (gzipped > budgetKb) {
        over.push(`${relativePath} is ${gzipped.toFixed(1)}KB gzipped, over its ${budgetKb}KB budget`);
      }
    }

    expect(
      over,
      "these ship to the browser for interactive filtering/search; if one has genuinely outgrown its budget, raise it deliberately or split the module",
    ).toEqual([]);
  });

  it("keeps every budgeted data module actually reachable from a client component", () => {
    // Guards the guard, and guards the *architecture*. A size budget is only
    // the right instrument while a client component genuinely imports the
    // module; the moment none does, "must not reach a client bundle at all"
    // is both true and stronger, and the entry belongs in SERVER_ONLY
    // instead (that is exactly the move `lib/content/glossary.ts` made, and
    // the move `currentQuantum/data.ts` made when its prose half was split
    // out of `currentQuantum/metaRegistry.ts`).
    //
    // Without this, a budget entry can go quietly vacuous: someone removes
    // the last client importer, the module keeps a number nobody is paying,
    // and the next person to add a client importer inherits a budget that
    // was set for a payload that no longer resembles theirs.
    const reachable = new Set<string>();
    for (const file of CLIENT_FILES) {
      const seen = new Set<string>();
      const queue = [file];
      while (queue.length > 0) {
        const current = queue.shift()!;
        if (seen.has(current)) continue;
        seen.add(current);
        reachable.add(rel(current));
        for (const specifier of importsOf(read(current))) {
          const resolved = resolve(current, specifier);
          if (resolved) queue.push(resolved);
        }
      }
    }

    const orphaned = Object.keys(CLIENT_DATA_BUDGET_KB).filter((module) => !reachable.has(module));

    expect(
      orphaned,
      "no client component imports these any more; move them to SERVER_ONLY rather than leaving an unpaid budget behind",
    ).toEqual([]);
  });

  it("lets the concept map panel read entry meta without the Current Quantum prose", () => {
    // The specific regression this split exists to prevent, pinned to the
    // one client surface involved so a failure names the real mistake
    // instead of "something, somewhere, reached data.ts". `ConceptDetailPanel`
    // renders a date, a category chip and a title per related entry; the
    // summary/citation/image half must stay on the server.
    const panel = path.join(SRC, "components/map/ConceptDetailPanel.tsx");

    expect(read(panel)).toContain("currentQuantum/metaRegistry");
    expect(
      findServerOnlyReachableFrom(panel),
      "ConceptDetailPanel must reach currentQuantum/metaRegistry, never registry.ts or data.ts",
    ).toBeNull();
  });

  it("keeps katex out of the eager graph of the global MDX component mapping", () => {
    // `src/mdx-components.tsx` is compiled into every one of the 219 lesson
    // pages, and the client components it references hydrate on all of them
    // — so anything statically reachable from it is paid on every lesson.
    // KaTeX is ~272KB minified and already rendered at build time for lesson
    // math; the only sanctioned client-side uses are on-demand (`await
    // import("katex")` in EquationReveal's misuse fallback) or behind
    // `next/dynamic` boundaries, neither of which is an eager edge — see
    // externalPackagesReachableFrom for why that exclusion is honest. This
    // walk slightly *over*approximates the client payload (it also traverses
    // mapping components that stay server-rendered), so a pass is a stronger
    // promise than the bundle needs, and a failure names a real static chain.
    const external = externalPackagesReachableFrom(path.join(SRC, "mdx-components.tsx"));

    // Guards the guard: the mapping's graph unquestionably reaches react,
    // clsx, etc. — if the walk ever finds nothing, the walk is broken, and
    // the katex assertion below would be passing vacuously.
    expect(external.size).toBeGreaterThan(1);

    expect(
      external.get("katex")?.join(" -> "),
      "katex must not be statically reachable from the MDX mapping; load it on demand or behind a client-side next/dynamic boundary",
    ).toBeUndefined();
  });

  it("keeps katex out of the eager graph of LessonLayout", () => {
    // The other katex-to-every-lesson chain the audit found: LessonLayout
    // statically imported CourseCheckpoint, which reaches katex (it is the
    // one surface that still renders problem math in the browser — a Client
    // Component cannot render the Server Component that does it for
    // /problems/[slug]), even though the checkpoint renders only on a
    // course's final lesson. It now goes through LazyCourseCheckpoint's
    // dynamic boundary. Same overapproximation caveat as above — this walk
    // also crosses LessonLayout's server-only imports (the problem registry),
    // which never ship to the client; that only makes a pass stronger.
    const external = externalPackagesReachableFrom(
      path.join(SRC, "components/lessons/LessonLayout.tsx"),
    );

    expect(
      external.get("katex")?.join(" -> "),
      "katex must not be statically reachable from LessonLayout; keep the checkpoint/problem chain behind LazyCourseCheckpoint",
    ).toBeUndefined();
  });

  it("keeps katex out of the problem page's client boundary", () => {
    // The third chain, pinned by name like the two above so a regression
    // names the real mistake instead of only a route. `ProblemViewClient` is
    // the `"use client"` file for /problems/[slug]: everything statically
    // below it is downloaded on all 547 problem pages before the reader
    // touches anything. Its math arrives as KaTeX HTML strings rendered by
    // the `ProblemView` Server Component wrapper
    // (`components/problems/renderProblemMath.ts`), so the panels below it
    // must reach only `RenderedMathText`, never `ScrollableMathText`,
    // `MathText` or `KatexMath`.
    //
    // Uses the overapproximating walk deliberately: it does not stop at the
    // client boundary, so it also catches a *lazily* reachable katex that the
    // route-level test would forgive. Nothing under this file should need the
    // runtime at all.
    const external = externalPackagesReachableFrom(
      path.join(SRC, "components/problems/ProblemViewClient.tsx"),
    );

    // Guards the guard: this subtree unquestionably reaches react and next.
    expect(external.size).toBeGreaterThan(1);

    expect(
      external.get("katex")?.join(" -> "),
      "katex must not be reachable from ProblemViewClient; problem math is rendered to HTML strings by the ProblemView server wrapper — render new math there and pass runs down, never import a renderer here",
    ).toBeUndefined();
  });

  it("adds no route that ships the katex runtime to the browser", () => {
    // The generalisation of the tests above. Those name entry points by hand,
    // which is exactly as much coverage as someone remembered to write:
    // `app/problems/[slug]/page.tsx` reached katex through `ProblemView` for
    // the whole life of the problem system, and neither of the original two
    // tests could see it because neither was looking at that route. This one
    // asks every route the same question, so the list of pages paying for
    // KaTeX can only shrink.
    //
    // Known debt lives in KATEX_IN_EAGER_CLIENT_GRAPH with its chain and its
    // fix written down. It is empty: fixing the last entry was a two-line
    // diff there (delete the entry); adding one is a conversation.
    const offenders: string[] = [];

    for (const route of ROUTE_ENTRIES) {
      const chain = eagerClientPackagesForRoute(route).get("katex");
      if (!chain) continue;
      if (route in KATEX_IN_EAGER_CLIENT_GRAPH) continue;
      offenders.push(`${route}\n    via ${chain.join(" -> ")}`);
    }

    expect(
      offenders,
      "this route's client bundle now contains the 268KB KaTeX runtime; lesson math is rendered to HTML at build time by rehypeKatexHtml.mjs — render this page's math on the server too, or put the component that needs it behind a lazy boundary like LazyCourseCheckpoint",
    ).toEqual([]);
  });

  it("keeps the recorded katex debt honest in both directions", () => {
    // Guards the guard above. Without this, the exception map is a licence
    // that outlives the problem: someone moves the problem page's math to the
    // server, the entry stays, and the next route to reach for `KatexMath`
    // inherits a documented excuse for a chain that no longer exists.
    const stale = Object.keys(KATEX_IN_EAGER_CLIENT_GRAPH).filter(
      (route) => !eagerClientPackagesForRoute(route).has("katex"),
    );

    expect(
      stale,
      "these routes no longer reach katex — delete them from KATEX_IN_EAGER_CLIENT_GRAPH so the guard starts holding them to it",
    ).toEqual([]);
  });

  it("never reaches a generated registry from a client component", () => {
    // The generated registries are the load-bearing half of the build-memory
    // fix (docs/DEPLOYMENT.md): `lessonMeta.generated.ts` and
    // `problemMeta.generated.ts` exist so that a page can list the corpus
    // without importing 219 compiled MDX modules, and `registry.generated.ts`
    // statically imports all 547 problem bodies. They are corpus-shaped by
    // construction — 296KB, 288KB and 94KB of source — and every one of them
    // is named individually in SERVER_ONLY today.
    //
    // "Named individually" is the weakness. These files are written by
    // `scripts/generate-*.mjs`, and the next one someone adds will be
    // corpus-shaped for exactly the same reason and on nobody's list. The
    // naming convention is the invariant, so assert on the convention.
    const leaks = [...clientReachableModules()]
      .filter((file) => /\.generated\.tsx?$/.test(file))
      .sort();

    // Guards the guard: if the convention is ever abandoned, this test would
    // pass by having nothing to check.
    expect(
      ALL_FILES.map(rel).filter((file) => /\.generated\.tsx?$/.test(file)).length,
      "no *.generated.ts modules found — either the generators changed their naming convention (update this test) or scripts/generate-*.mjs has not been run",
    ).toBeGreaterThan(0);

    expect(
      leaks,
      "a client component reaches a generated content registry; these are whole-corpus modules built for server rendering — pass the fields the client needs down as props instead",
    ).toEqual([]);
  });

  it("keeps each SERVER_ONLY exception inside a budget of its own", () => {
    // `ALLOWED` is the escape hatch from "must never reach a client bundle",
    // and until now it was the only list here with no numbers on it. That
    // made it the cheapest place for weight to accumulate: an exemption
    // granted once on the grounds that a module was small, and then never
    // re-examined as the corpus it mirrors tripled.
    const over: string[] = [];
    const reachable = clientReachableModules();

    for (const prefix of Object.keys(ALLOWED)) {
      const budgetKb = ALLOWED_BUDGET_KB[prefix];
      // A missing budget is the next test's failure, not a silent pass here.
      if (budgetKb === undefined) continue;
      const members = [...reachable].filter(
        (file) => file === prefix || file.startsWith(`${prefix}/`),
      );
      if (members.length === 0) continue;
      const gzipped = members.reduce((total, file) => total + payloadKb(path.join(SRC, file)), 0);
      if (gzipped > budgetKb) {
        over.push(
          `${prefix} is ${gzipped.toFixed(1)}KB gzipped across ${members.length} module(s), over its ${budgetKb}KB budget`,
        );
      }
    }

    expect(
      over,
      "an exception to SERVER_ONLY has outgrown the 'small and purpose-built' claim that earned it; shrink it, split it, or raise the number deliberately",
    ).toEqual([]);
  });

  it("gives every SERVER_ONLY exception a budget (guards the guard)", () => {
    const unbudgeted = Object.keys(ALLOWED).filter((prefix) => !(prefix in ALLOWED_BUDGET_KB));

    expect(
      unbudgeted,
      "a new ALLOWED entry has no size cap; add one to ALLOWED_BUDGET_KB, measured with gzipSync, close to its current size",
    ).toEqual([]);
  });

  it("keeps the total client-reachable data payload under a ceiling", () => {
    // The quantity no per-module budget can see. Every check above is
    // local — is *this* module too big, is *this* import allowed — and a
    // payload regresses globally: a dozen individually reasonable modules,
    // each waved through by a different reviewer, each genuinely fine.
    //
    // Scoped to `.ts` (not `.tsx`) so this measures data and logic rather
    // than markup, which is what the budgets in this file are all about, and
    // what actually grows with the content corpus.
    const modules = [...clientReachableModules()].filter((file) => file.endsWith(".ts")).sort();
    const totalKb = modules.reduce((total, file) => total + payloadKb(path.join(SRC, file)), 0);

    // Guards the guard: a broken walk would report zero and pass forever.
    expect(modules.length).toBeGreaterThan(40);

    expect(
      totalKb,
      `client-reachable data modules now total ${totalKb.toFixed(1)}KB gzip across ${modules.length} modules, over the ${CLIENT_DATA_TOTAL_CEILING_KB}KB ceiling; find what grew (each module's size is printed by the budget test above) before raising this number`,
    ).toBeLessThanOrEqual(CLIENT_DATA_TOTAL_CEILING_KB);
  });

  it("keeps the lazily-fetched search index under its transfer budget", () => {
    // Measured on the bytes as served, gzipped — this file is JSON, not
    // source, so `payloadKb`'s comment-stripping has nothing to do here and
    // the raw figure is the real one a CDN stores.
    const file = path.join(SRC, "..", SEARCH_INDEX_PATH);
    expect(existsSync(file), `${SEARCH_INDEX_PATH} is missing — run \`npm run generate\``).toBe(true);

    const bytes = readFileSync(file);
    const rawKb = bytes.length / 1024;
    const gzipKb = gzipSync(bytes).length / 1024;

    // Guards the guard: an empty or truncated index would pass both ceilings
    // while breaking search outright.
    expect(rawKb, `${SEARCH_INDEX_PATH} is suspiciously small — is it truncated?`).toBeGreaterThan(200);

    expect(
      rawKb,
      `${SEARCH_INDEX_PATH} is ${rawKb.toFixed(1)}KB raw, over its ${SEARCH_INDEX_RAW_CEILING_KB}KB ceiling; every reader who opens search downloads it whole`,
    ).toBeLessThanOrEqual(SEARCH_INDEX_RAW_CEILING_KB);

    expect(
      gzipKb,
      `${SEARCH_INDEX_PATH} is ${gzipKb.toFixed(1)}KB gzip, over its ${SEARCH_INDEX_GZIP_CEILING_KB}KB ceiling; the per-lesson cap is LESSON_KEYWORD_BUDGET in lib/search/lessonKeywords.ts`,
    ).toBeLessThanOrEqual(SEARCH_INDEX_GZIP_CEILING_KB);
  });

  it("keeps every App Router page a server component", () => {
    // A page-level `"use client"` opts the whole subtree out of static
    // rendering — the single most expensive mistake available in this app,
    // and invisible until someone reads the build's route table.
    const clientPages = CLIENT_FILES.map(rel).filter(
      (file) => file.startsWith("app/") && /\/page\.tsx$/.test(file),
    );

    expect(clientPages, "App Router pages must stay server components").toEqual([]);
  });
});
