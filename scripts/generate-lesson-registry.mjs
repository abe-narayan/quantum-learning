#!/usr/bin/env node
/**
 * Generates `src/lib/content/lessonMeta.generated.ts`: every lesson's
 * `lessonMeta` (plus its path-derived slug) as one plain, statically-typed
 * array, extracted from the `.mdx` sources by text-scanning — the same
 * technique `generate-search-index.mjs` already uses (see its header for why
 * plain Node can't just `import()` an `.mdx` file).
 *
 * WHY THIS EXISTS — build memory, not convenience. Before this registry,
 * `getAllLessonsMeta()` in `src/lib/content/lessons.ts` obtained metadata by
 * dynamically importing every one of the 219 *compiled MDX modules* (each a
 * full React component tree with KaTeX-rendered math — collectively hundreds
 * of MB on the heap). Because the site Footer, every catalog page, every
 * lesson page, and every problem page call it, every one of Next's static
 * generation worker processes imported and retained the entire compiled
 * corpus for the whole build. On an 8GB Vercel build container that
 * multiplied into a SIGKILL/OOM. With this registry, metadata consumers read
 * a small plain-data array, and the only compiled MDX module a page ever
 * imports is the one lesson body it actually renders.
 *
 * The script validates every extracted meta against the `LessonMeta` shape
 * (src/lib/content/types.ts) and fails loudly — a lesson silently missing
 * from this registry would silently vanish from catalogs, prerequisites, and
 * `generateStaticParams`.
 *
 * Run via `npm run generate:lesson-registry`, or automatically before
 * `dev`/`build`/`test` via the `predev`/`prebuild`/`pretest` npm lifecycle
 * hooks (alongside the other generators), and before `typecheck` via
 * `pretypecheck` — `tsc` reads this generated `.ts` file, so it must exist
 * and be current for a typecheck to mean anything.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
// LESSON_META_KEY_RE is imported, never re-declared: generate-search-index.mjs
// extracts the same block from the same files, and the two selecting
// different blocks would put different metadata on the lesson page and in
// search with nothing to notice. See scripts/lib/extract.mjs's header.
import {
  walk,
  compareSlugs,
  extractObjectLiteral,
  writeGenerated,
  LESSON_META_KEY_RE,
} from "./lib/extract.mjs";

const ROOT = process.cwd();
const LESSONS_ROOT = path.join(ROOT, "src/content/lessons");
const OUTPUT = path.join(ROOT, "src/lib/content/lessonMeta.generated.ts");

const DIFFICULTIES = new Set(["foundational", "intermediate", "advanced", "master"]);

/** Throws unless `meta` matches the `LessonMeta` shape in src/lib/content/types.ts. */
function validateMeta(meta, filePath) {
  const fail = (msg) => {
    throw new Error(`${filePath}: invalid lessonMeta — ${msg}`);
  };
  if (typeof meta.title !== "string" || !meta.title.trim()) fail("missing/empty title");
  if (typeof meta.description !== "string" || !meta.description.trim()) fail("missing/empty description");
  if (typeof meta.course !== "string" || !meta.course.trim()) fail("missing/empty course");
  if (typeof meta.module !== "string" || !meta.module.trim()) fail("missing/empty module");
  if (typeof meta.order !== "number" || !Number.isFinite(meta.order)) fail("missing/non-numeric order");
  if (!DIFFICULTIES.has(meta.difficulty)) fail(`invalid difficulty "${meta.difficulty}"`);
  if (typeof meta.estimatedMinutes !== "number" || meta.estimatedMinutes <= 0) fail("missing/invalid estimatedMinutes");
  if (!Array.isArray(meta.prerequisites) || meta.prerequisites.some((p) => typeof p !== "string")) {
    fail("prerequisites must be an array of strings");
  }
  if (!Array.isArray(meta.objectives) || meta.objectives.length === 0 || meta.objectives.some((o) => typeof o !== "string")) {
    fail("objectives must be a non-empty array of strings");
  }
  if (meta.related !== undefined) {
    if (
      !Array.isArray(meta.related) ||
      meta.related.some((r) => typeof r?.slug !== "string" || typeof r?.note !== "string")
    ) {
      fail("related must be an array of { slug, note } objects");
    }
  }
}

async function main() {
  const slugs = (await walk(LESSONS_ROOT, ".mdx")).sort(compareSlugs);
  if (slugs.length === 0) {
    throw new Error(`No lesson files found under ${LESSONS_ROOT} — refusing to generate an empty lesson registry.`);
  }

  const metas = [];
  for (const slug of slugs) {
    const filePath = path.join(LESSONS_ROOT, `${slug}.mdx`);
    const source = await readFile(filePath, "utf8");
    const meta = extractObjectLiteral(source, LESSON_META_KEY_RE, filePath, "lessonMeta");
    validateMeta(meta, filePath);
    metas.push({ ...meta, slug });
  }

  const contents = `/**
 * AUTO-GENERATED — do not hand-edit.
 *
 * Produced by \`node scripts/generate-lesson-registry.mjs\` (\`npm run
 * generate:lesson-registry\`; also runs automatically before \`dev\`/\`build\`/
 * \`test\` via the npm lifecycle hooks). Re-run it after adding, renaming, or
 * deleting a lesson under \`src/content/lessons/**\` or editing a lesson's
 * \`lessonMeta\` export — this file is silently overwritten on the next run.
 *
 * This is the ONLY place lesson metadata is materialized for consumers
 * (\`src/lib/content/lessons.ts\` re-exports it). Nothing outside a lesson
 * page's own render may import a compiled \`.mdx\` module — that is the
 * build-memory invariant this registry exists to protect; see the generator
 * script's header.
 */
import type { LessonMetaWithSlug } from "./types";

export const LESSON_METAS: LessonMetaWithSlug[] = ${JSON.stringify(metas, null, 2)};
`;

  await writeGenerated(OUTPUT, contents);
  console.log(
    `generate-lesson-registry: wrote ${metas.length} lessons to ${path.relative(ROOT, OUTPUT)}`
  );
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
