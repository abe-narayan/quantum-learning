#!/usr/bin/env node
/**
 * Generates `src/lib/problems/registry.generated.ts` by walking
 * `src/content/problems/**` and importing every problem file's single
 * `export const <name>: <ProblemVariant> = {...}`.
 *
 * Why this exists: `src/lib/problems/registry.ts` previously hand-maintained
 * one `import` + one array entry per problem (423 problems as of writing —
 * see docs/ARCHITECTURE.md, "Deliberately not attempted this session" from an
 * earlier pass, which flagged this exact pattern as a scaling/merge-conflict
 * risk). Unlike `src/lib/content/lessons.ts`'s lesson auto-discovery, this
 * can't switch to *runtime* (async, dynamic-`import()`-based) discovery: 150+
 * MDX lesson files do
 *
 *   export const practiceProblems = getProblemsForLesson("...");
 *
 * synchronously at MDX module top level, and `registry.ts`'s lookup
 * functions (`getProblem`, `getProblemsForLesson`, `getAllProblemMeta`, etc.)
 * are called synchronously across the whole codebase. So instead this script
 * only automates the *import list + array literal* at build time — the
 * generated `PROBLEMS` array is still a plain synchronous static array, and
 * `registry.ts`'s public API (and every caller of it) is completely
 * unchanged.
 *
 * Run via `npm run generate:registry`, or automatically before `dev`/`build`
 * via the `predev`/`prebuild` npm lifecycle hooks.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "src/content/problems");
const OUTPUT = path.join(process.cwd(), "src/lib/problems/registry.generated.ts");

/** Recursively collects every `.ts` file under `dir`, as slugs relative to `ROOT` (posix-separated, no extension). */
async function walk(dir, base = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const slugs = [];

  for (const entry of entries) {
    const relativePath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      slugs.push(...(await walk(path.join(dir, entry.name), relativePath)));
    } else if (entry.name.endsWith(".ts")) {
      slugs.push(relativePath.replace(/\.ts$/, ""));
    }
  }

  return slugs;
}

const EXPORT_RE = /^export const (\w+)\s*:/m;

async function main() {
  const slugs = (await walk(ROOT)).sort((a, b) => a.localeCompare(b));

  if (slugs.length === 0) {
    throw new Error(`No problem files found under ${ROOT} — refusing to generate an empty registry.`);
  }

  const entries = [];
  for (const slug of slugs) {
    const filePath = path.join(ROOT, `${slug}.ts`);
    const source = await readFile(filePath, "utf8");
    const match = source.match(EXPORT_RE);
    if (!match) {
      throw new Error(
        `${filePath} has no top-level "export const <name>: ..." — every problem file must have exactly ` +
          `one such export for auto-discovery to find it. (Found something else, or the export isn't ` +
          `typed inline.)`
      );
    }
    entries.push({ slug, identifier: match[1] });
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
 * Entries are sorted by content path for reproducibility, which is NOT the
 * same as the previous hand-authored order. The only place PROBLEMS order is
 * read semantically is \`getCourseCheckpointProblems\` in \`registry.ts\`
 * (spreads a sample across a course) — a reordering changes which sample
 * problems it picks, not correctness.
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

  await writeFile(OUTPUT, contents, "utf8");
  console.log(`generate-problem-registry: wrote ${entries.length} problems to ${path.relative(process.cwd(), OUTPUT)}`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
