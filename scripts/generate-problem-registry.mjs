#!/usr/bin/env node
/**
 * Generates TWO files from one walk of `src/content/problems/**`:
 *
 * 1. `src/lib/problems/registry.generated.ts` — imports every problem file's
 *    single `export const <name>: <ProblemVariant> = {...}` and assembles the
 *    full `PROBLEMS: Problem[]` array (question/answer/hints/solution and
 *    all — this statically pulls every problem module, and through them the
 *    `src/lib/quantum` graph, into any importer's module graph).
 *
 * 2. `src/lib/problems/problemMeta.generated.ts` — a plain-data
 *    `PROBLEM_METAS: ProblemMeta[]` array text-extracted from each file's
 *    `meta: {...}` block (same brace-scan + literal-eval technique as
 *    `generate-search-index.mjs`; see `scripts/lib/extract.mjs`). This one
 *    imports NOTHING but the `ProblemMeta` type, so meta-only consumers
 *    (every lesson MDX's `practiceProblems`, the sitemap, catalog pages)
 *    can read problem metadata without dragging the full 547-module +
 *    quantum-lib graph into their server module graph — see
 *    `src/lib/problems/metaRegistry.ts` for the consumer-facing API and the
 *    build-memory rationale. `src/lib/problems/__tests__/metaRegistry.test.ts`
 *    guards that the extracted metas never drift from the real modules.
 *
 * Why registry generation exists at all: `src/lib/problems/registry.ts`
 * previously hand-maintained one `import` + one array entry per problem
 * (423 problems as of writing — see docs/ARCHITECTURE.md, "Deliberately not
 * attempted this session" from an earlier pass, which flagged this exact
 * pattern as a scaling/merge-conflict risk). Unlike
 * `src/lib/content/lessons.ts`'s lesson auto-discovery, this can't switch to
 * *runtime* (async, dynamic-`import()`-based) discovery: the registry lookup
 * functions are called synchronously at MDX module top level and across the
 * whole codebase. So this script only automates the *import list + array
 * literal* at build time — the generated `PROBLEMS` array is still a plain
 * synchronous static array.
 *
 * Run via `npm run generate:registry`, or automatically before `dev`/`build`
 * via the `predev`/`prebuild` npm lifecycle hooks.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { walk, compareSlugs, extractObjectLiteral } from "./lib/extract.mjs";

const ROOT = path.join(process.cwd(), "src/content/problems");
const OUTPUT = path.join(process.cwd(), "src/lib/problems/registry.generated.ts");
const META_OUTPUT = path.join(process.cwd(), "src/lib/problems/problemMeta.generated.ts");

// Anchored to a line that *starts* (modulo indentation) with `meta:` — a
// bare /\bmeta:\s*\{/ would happily match e.g. `optionFeedback: { meta: ...`
// or a `meta:` key nested in some other object earlier in the file.
const META_KEY_RE = /^\s*meta:\s*\{/m;

const EXPORT_RE = /^export const (\w+)\s*:/gm;

const PROBLEM_DIFFICULTIES = new Set(["beginner", "intermediate", "advanced", "master"]);
const PROBLEM_TYPES = new Set(["multiple-choice", "numeric", "conceptual"]);

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

/**
 * Validates the extracted object against what `ProblemMeta`
 * (src/lib/problems/types.ts) declares — required: slug, title, course,
 * difficulty, estimatedMinutes, problemType, tags; optional: lesson,
 * prerequisites. Text extraction bypasses the compiler, so this re-checks
 * what `tsc` would otherwise have enforced. Fails loudly: a bad meta must
 * break the generate step, not surface as a silently-wrong catalog page.
 */
function validateMeta(meta, filePath) {
  const fail = (message) => {
    throw new Error(`${filePath}: invalid meta — ${message}`);
  };

  if (typeof meta !== "object" || meta === null || Array.isArray(meta)) {
    fail("expected an object literal");
  }
  if (!isNonEmptyString(meta.slug)) fail("`slug` must be a non-empty string");
  if (!isNonEmptyString(meta.title)) fail("`title` must be a non-empty string");
  if (!isNonEmptyString(meta.course)) fail("`course` must be a non-empty string");
  if (meta.lesson !== undefined && !isNonEmptyString(meta.lesson)) {
    fail("`lesson`, when present, must be a non-empty string");
  }
  if (!PROBLEM_DIFFICULTIES.has(meta.difficulty)) {
    fail(`\`difficulty\` must be one of ${[...PROBLEM_DIFFICULTIES].join(" | ")} (got ${JSON.stringify(meta.difficulty)})`);
  }
  if (typeof meta.estimatedMinutes !== "number" || !Number.isFinite(meta.estimatedMinutes)) {
    fail("`estimatedMinutes` must be a finite number");
  }
  if (!PROBLEM_TYPES.has(meta.problemType)) {
    fail(`\`problemType\` must be one of ${[...PROBLEM_TYPES].join(" | ")} (got ${JSON.stringify(meta.problemType)})`);
  }
  if (!isStringArray(meta.tags)) fail("`tags` must be an array of strings");
  if (meta.prerequisites !== undefined && !isStringArray(meta.prerequisites)) {
    fail("`prerequisites`, when present, must be an array of strings");
  }
}

async function main() {
  const slugs = (await walk(ROOT, ".ts")).sort(compareSlugs);

  if (slugs.length === 0) {
    throw new Error(`No problem files found under ${ROOT} — refusing to generate an empty registry.`);
  }

  const entries = [];
  const metas = [];
  const metaSlugSeenIn = new Map();

  for (const slug of slugs) {
    const filePath = path.join(ROOT, `${slug}.ts`);
    const source = await readFile(filePath, "utf8");

    const exportMatches = [...source.matchAll(EXPORT_RE)];
    if (exportMatches.length === 0) {
      throw new Error(
        `${filePath} has no top-level "export const <name>: ..." — every problem file must have exactly ` +
          `one such export for auto-discovery to find it. (Found something else, or the export isn't ` +
          `typed inline.)`
      );
    }
    if (exportMatches.length > 1) {
      throw new Error(
        `${filePath} has ${exportMatches.length} top-level "export const <name>: ..." exports ` +
          `(${exportMatches.map((m) => m[1]).join(", ")}) — every problem file must have exactly one, ` +
          `so the registry can't silently pick the wrong one.`
      );
    }
    entries.push({ slug, identifier: exportMatches[0][1] });

    const meta = extractObjectLiteral(source, META_KEY_RE, filePath, "meta");
    validateMeta(meta, filePath);
    const prior = metaSlugSeenIn.get(meta.slug);
    if (prior) {
      throw new Error(
        `Duplicate problem slug "${meta.slug}" in both "${prior}.ts" and "${slug}.ts" — slugs are the ` +
          `/problems/[slug] route segments and must be globally unique.`
      );
    }
    metaSlugSeenIn.set(meta.slug, slug);
    metas.push(meta);
  }

  // Guard against two files exporting the same identifier — that would
  // silently import one and shadow/collide with the other rather than
  // failing loudly.
  const seenBy = new Map();
  for (const { slug, identifier } of entries) {
    const prior = seenBy.get(identifier);
    if (prior) {
      throw new Error(
        `Duplicate export identifier "${identifier}" in both "${prior}.ts" and "${slug}.ts" — rename one ` +
          `so PROBLEMS doesn't silently drop a problem.`
      );
    }
    seenBy.set(identifier, slug);
  }

  const importLines = entries.map(({ slug, identifier }) => `import { ${identifier} } from "@/content/problems/${slug}";`);
  const arrayLines = entries.map(({ identifier }) => `  ${identifier},`);

  const contents = `/**
 * AUTO-GENERATED — do not hand-edit.
 *
 * Produced by \`node scripts/generate-problem-registry.mjs\` (\`npm run
 * generate:registry\`; also runs automatically before \`dev\`/\`build\` via the
 * \`predev\`/\`prebuild\` npm lifecycle hooks). Re-run it after adding,
 * renaming, or deleting a file under \`src/content/problems/**\` — this file
 * will be silently overwritten on the next run either way.
 *
 * Entries are sorted by content path (plain code-unit comparison — see
 * \`compareSlugs\` in scripts/lib/extract.mjs — deterministic across
 * machines/locales), which is NOT the same as the previous hand-authored
 * order. The only place PROBLEMS order is read semantically is
 * \`getCourseCheckpointProblems\` in \`registry.ts\` (spreads a sample across
 * a course) — a reordering changes which sample problems it picks, not
 * correctness. \`problemMeta.generated.ts\` is emitted by the same run in
 * the same order.
 *
 * See \`registry.ts\`, which imports \`PROBLEMS\` from here and owns every
 * lookup function (\`getProblem\`, \`getProblemsForLesson\`, ...); this file's
 * job ends at producing the array.
 */
import type { Problem } from "./types";

${importLines.join("\n")}

export const PROBLEMS: Problem[] = [
${arrayLines.join("\n")}
];
`;

  const metaContents = `/**
 * AUTO-GENERATED — do not hand-edit.
 *
 * Produced by \`node scripts/generate-problem-registry.mjs\` (\`npm run
 * generate:registry\`; also runs automatically before \`dev\`/\`build\` via the
 * \`predev\`/\`prebuild\` npm lifecycle hooks), in the same run that emits
 * \`registry.generated.ts\` — both walk the same file list in the same
 * sorted order, so PROBLEM_METAS[i] is PROBLEMS[i].meta, element for
 * element (guarded by \`src/lib/problems/__tests__/metaRegistry.test.ts\`).
 *
 * Unlike \`registry.generated.ts\`, this file imports NOTHING but the
 * \`ProblemMeta\` type: each \`meta\` block below was text-extracted from its
 * problem file's source (see scripts/lib/extract.mjs) rather than imported,
 * so pulling this module in does NOT pull in the problem modules or the
 * \`src/lib/quantum\` graph behind them. Meta-only consumers must import
 * \`src/lib/problems/metaRegistry.ts\` (which wraps this array) — see its
 * doc comment for the build-memory rationale.
 */
import type { ProblemMeta } from "./types";

export const PROBLEM_METAS: ProblemMeta[] = ${JSON.stringify(metas, null, 2)};
`;

  await writeFile(OUTPUT, contents, "utf8");
  await writeFile(META_OUTPUT, metaContents, "utf8");
  console.log(
    `generate-problem-registry: wrote ${entries.length} problems to ${path.relative(process.cwd(), OUTPUT)} ` +
      `and ${metas.length} metas to ${path.relative(process.cwd(), META_OUTPUT)}`
  );
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
