import { describe, expect, it } from "vitest";
/* Components are constructed with `createElement` rather than JSX, for the
   reason `src/components/mdx/__tests__/Term.test.ts` documents: vitest's
   `include` is `src/**\/*.test.ts`, and `.ts` files are not parsed for JSX. */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonObjectives } from "@/components/lessons/LessonObjectives";
import { LESSON_METAS } from "@/lib/content/lessonMeta.generated";

/**
 * ============================================================
 * The band between a lesson's title and its first teaching sentence
 * ============================================================
 * Measured in headless Chrome at 375x812 before this pass, the first teaching
 * paragraph of the entry lesson started at 905px, a mid-curriculum lesson at
 * 1163px and an Apex lesson at 1321px: a phone's whole first screen of a
 * *lesson* was chrome about the lesson. The single largest removable block was
 * the objectives list, which rendered open on foundational and intermediate
 * lessons — 203px on a three-objective lesson, more on a five.
 *
 * It now ships collapsed on every lesson. These tests pin the two halves of
 * that being a *fold* rather than a deletion: the disclosure is closed, and
 * every authored objective is still in the served HTML, reachable in one tap
 * and readable by a crawler or a reader with the panel open.
 *
 * The third test is the one that stops the fold quietly becoming a loss. A
 * collapsed disclosure whose summary reads "Objectives" and nothing else is
 * chrome the eye skips; this one has to say how many items are inside and
 * what kind of thing they are, because that sentence is the whole of what a
 * reader gets for free without opening it.
 */

/** A representative lesson per difficulty, straight from the corpus. */
const SAMPLES = ["foundational", "intermediate", "advanced", "master"].map((difficulty) => {
  const lesson = LESSON_METAS.find(
    (meta) => meta.difficulty === difficulty && meta.objectives.length > 0
  );
  if (!lesson) throw new Error(`No ${difficulty} lesson with objectives in the corpus`);
  return lesson;
});

function render(objectives: string[]) {
  return renderToStaticMarkup(createElement(LessonObjectives, { objectives }));
}

describe("a lesson's objectives are folded, not dropped", () => {
  it("ships collapsed at every difficulty", () => {
    for (const lesson of SAMPLES) {
      const html = render(lesson.objectives);
      expect(html, lesson.slug).toContain("<details");
      // `open` is the only thing that would put this block back between the
      // reader and the teaching. React renders the attribute bare when true.
      expect(html, lesson.slug).not.toMatch(/<details[^>]*\sopen\b/);
    }
  });

  it("still serves every authored objective in the HTML", () => {
    for (const lesson of SAMPLES) {
      // Entities first, then everything that is not a letter or digit: the
      // renderer escapes quotes as `&#x27;`, ampersands as `&amp;`, and
      // several objectives carry inline `$…$` LaTeX. Normalising both sides
      // the same way compares the words, which is the claim being made.
      const words = (text: string) =>
        text.replace(/&#?[a-zA-Z0-9]+;/g, " ").replace(/[^A-Za-z0-9]+/g, " ").trim();
      const html = words(render(lesson.objectives));
      for (const objective of lesson.objectives) {
        expect(html, `${lesson.slug}: ${objective.slice(0, 40)}`).toContain(words(objective));
      }
    }
  });

  it("advertises what is inside rather than only naming itself", () => {
    for (const lesson of SAMPLES) {
      const html = render(lesson.objectives);
      const plural = lesson.objectives.length === 1 ? "thing" : "things";
      expect(html, lesson.slug).toContain(`${lesson.objectives.length} ${plural}`);
    }
    // And the singular case is actually spelled singular, since the corpus
    // may not contain one to sample.
    expect(render(["Do the one thing"])).toContain("1 thing ");
  });
});
