import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  PREDICTION_INSTANCE_COUNT,
  PREDICTION_LESSON_COUNT,
} from "../lessonMeta.generated";
import { LESSON_METAS } from "../lessonMeta.generated";

/**
 * The homepage states, as a fact about the site, how many lessons stop and ask
 * the reader to commit to an answer before showing them one. That sentence is
 * the reader's evidence that the wager they just made on the homepage was not
 * a gimmick, so it has to be true.
 *
 * It was hand-kept until 2026-08-30, under a source comment asking the next
 * person to re-derive it with grep whenever the corpus moved. The corpus moved
 * and the sentence did not: the page shipped "213 of the 219 lessons" against
 * a corpus of 218. That is the same class of defect CLAUDE.md records for the
 * hand-typed problem total, and the same fix applies, which is to derive it.
 *
 * `scripts/generate-lesson-registry.mjs` now counts it on the pass that
 * already reads every lesson source. This test is the thing that makes the
 * derivation trustworthy: it re-scans the real corpus from disk, independently
 * of the generator's own logic, and fails if the two disagree. A stale
 * registry (someone edited lessons and did not re-run `npm run generate`) and
 * a broken generator both surface here rather than on the homepage.
 */

const LESSONS_ROOT = path.join(process.cwd(), "src/content/lessons");

function collectMdxFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...collectMdxFiles(full));
    else if (entry.name.endsWith(".mdx")) found.push(full);
  }
  return found;
}

describe("the homepage's prediction count", () => {
  const files = collectMdxFiles(LESSONS_ROOT);

  it("scans a corpus of the expected size, so the counts below cannot be vacuous", () => {
    expect(files.length).toBe(LESSON_METAS.length);
    expect(files.length).toBeGreaterThan(200);
  });

  it("matches the number of lessons that actually carry a PredictBeforeReveal", () => {
    const lessonsWithPrediction = files.filter((file) =>
      /<PredictBeforeReveal[\s/>]/.test(readFileSync(file, "utf8"))
    );

    expect(
      lessonsWithPrediction.length,
      "the generated PREDICTION_LESSON_COUNT disagrees with the corpus. Re-run " +
        "`npm run generate:lesson-registry`; if that does not fix it, the " +
        "generator's matcher and this test's matcher have diverged."
    ).toBe(PREDICTION_LESSON_COUNT);
  });

  it("matches the total number of prediction prompts, counting lessons that ask twice", () => {
    const instances = files.reduce((total, file) => {
      const matches = readFileSync(file, "utf8").match(/<PredictBeforeReveal[\s/>]/g);
      return total + (matches?.length ?? 0);
    }, 0);

    expect(instances).toBe(PREDICTION_INSTANCE_COUNT);
    expect(
      instances,
      "every lesson with a prediction has at least one instance, so the instance " +
        "total can never be below the lesson total"
    ).toBeGreaterThanOrEqual(PREDICTION_LESSON_COUNT);
  });

  it("stays close enough to the full corpus for the homepage's claim to be honest", () => {
    // The homepage prints this as "N of the M lessons" beside a sentence
    // saying almost every page on the site does it. If a future corpus change
    // dropped that ratio, the sentence would become a lie the numbers beside
    // it disprove. Nothing else would notice.
    const ratio = PREDICTION_LESSON_COUNT / LESSON_METAS.length;
    expect(ratio).toBeGreaterThan(0.9);
  });
});
