import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
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
  "lib/content/glossary.ts": "all 239 glossary definitions (~38KB gzip); search reads the prebuilt index instead",
  // The meta-only registry split out of `lib/problems/registry` so server
  // pages can list/count problems without the bodies. Meta-only is *lighter*
  // than the full registry, not light: 547 titles/slugs/tags is still a
  // corpus-sized module, and any client surface that needs a slice of it
  // should be handed that slice by a server component (the
  // `problemPillarIndex` pattern) rather than importing the whole thing.
  "lib/problems/metaRegistry.ts": "meta for all 547 problems; shape a slice server-side instead of shipping the index",
  "lib/problems/problemMeta.generated.ts": "the generated all-problem meta array behind metaRegistry",
  // Same reasoning as the problem meta registry: 219 lesson metas (~40KB
  // gzip) are for server components to slice; client surfaces get exactly
  // the fields they need as props (slug→title maps etc.).
  "lib/content/lessonMeta.generated.ts": "the generated all-lesson meta array behind lib/content/lessons",
  content: "raw lesson/problem content modules",
};

/**
 * Data modules that a genuinely interactive client component may import —
 * a search box, a filter, or the concept map cannot work without the data it
 * filters — but which must not silently balloon. Sizes are gzipped source,
 * measured; the budget is deliberately close to current so that a large
 * addition forces a conversation rather than sliding in.
 */
const CLIENT_DATA_BUDGET_KB: Record<string, number> = {
  "lib/content/curriculum.ts": 16,
  "lib/content/concepts.ts": 18,
  // `lib/content/glossary.ts` used to sit here at a 20KB budget. It has moved
  // to SERVER_ONLY instead — see the note there. A size budget was the right
  // guard while a client component imported it; now that none does, "must not
  // reach a client bundle at all" is both true and a stronger promise than any
  // number, and it does not have to be renegotiated every time the glossary
  // grows a term.
  // Reached from `ConceptDetailPanel` via `currentQuantum/registry`'s
  // `getEntriesForLesson`, which closes over the whole entry list. Mitigated
  // by the concept map being `ssr:false` and code-split, so it never blocks
  // first paint — but it is real client weight and was invisible until a
  // cross-cutting sweep measured it, which is exactly why it belongs here.
  "lib/content/currentQuantum/data.ts": 20,
};

/**
 * Deliberate, reviewed exceptions to SERVER_ONLY. The bar is that the module
 * is genuinely small and purpose-built, not that the failure was tolerable.
 */
const ALLOWED: Record<string, string> = {
  "components/layout/problemPillarIndex.ts":
    "a purpose-built slug->pillar table (~21KB source, no problem bodies), written specifically so the Navbar need not import the registry",
  "lib/content/types.ts": "types plus the DIFFICULTY_LABEL constant; trivial at runtime",
  "lib/problems/types.ts": "types only",
  "lib/content/progress": "client-side progress storage; belongs on the client by design",
  "lib/problems/progress": "client-side progress storage; belongs on the client by design",
};

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

  it("keeps client-importable data modules inside their size budget", async () => {
    const { gzipSync } = await import("node:zlib");
    const over: string[] = [];

    for (const [relativePath, budgetKb] of Object.entries(CLIENT_DATA_BUDGET_KB)) {
      const full = path.join(SRC, relativePath);
      if (!existsSync(full)) {
        over.push(`${relativePath} no longer exists — update CLIENT_DATA_BUDGET_KB`);
        continue;
      }
      const gzipped = gzipSync(readFileSync(full)).length / 1024;
      if (gzipped > budgetKb) {
        over.push(`${relativePath} is ${gzipped.toFixed(1)}KB gzipped, over its ${budgetKb}KB budget`);
      }
    }

    expect(
      over,
      "these ship to the browser for interactive filtering/search; if one has genuinely outgrown its budget, raise it deliberately or split the module",
    ).toEqual([]);
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
    // statically imported CourseCheckpoint -> ProblemView -> Solution/Hint
    // panels -> KatexMath -> katex, even though the checkpoint renders only
    // on a course's final lesson. It now goes through LazyCourseCheckpoint's
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
