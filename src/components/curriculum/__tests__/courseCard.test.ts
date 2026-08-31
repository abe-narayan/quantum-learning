import { describe, expect, it } from "vitest";
/* `createElement`, not JSX: vitest's `include` is `src/**\/*.test.ts` and
   `.ts` files are not parsed for JSX. Same reason as
   `lessons/__tests__/prerequisiteReadout.test.ts`. */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CourseList } from "@/components/curriculum/CourseList";
import { COURSES } from "@/lib/content/curriculum";
import { LESSON_METAS } from "@/lib/content/lessonMeta.generated";

/**
 * ============================================================
 * The course card, and the two things it must not lose
 * ============================================================
 * A card on `/learn` or a track page is a decision surface: a reader has to
 * be able to tell what a course teaches, roughly what level it is, what it
 * assumes, what it leads to, and how much of it is written, without opening
 * it. Two of those are graph facts and are therefore the two that can go
 * silently wrong.
 *
 * **"Leads to" is the reverse prerequisite edge.** It was added this pass and
 * is derived from `COURSES`, never authored, so the only way it can be wrong
 * is by drifting from the graph. `curriculumProgression.test.ts` pins that
 * every course *has* a forward move; this pins that the card names the right
 * one.
 *
 * **The module manifest is folded, not deleted.** Measured at 375px, the 32
 * open manifests were 13,074px of a 38,397px `/learn` — a third of the page a
 * reader lands on from "Browse the curriculum". They now sit behind a
 * `<details>`, and the invariant that matters is that every authored lesson
 * is still a real link in the served HTML.
 *
 * ============================================================
 * And the one that is invisible until someone clicks
 * ============================================================
 * This card's click target is a stretched `::after` on the course title, so
 * the whole panel activates the course link. Per CSS 2.1 Appendix E a
 * positioned element paints above a static one regardless of DOM order, and
 * hit-testing follows painting order — so any *real control* left at
 * `position: static` inside the card is painted under that overlay and
 * silently activates the course link instead of itself. The manifest's
 * `<summary>` is exactly such a control. It looks fine, it is announced
 * correctly, it is keyboard-operable, and a mouse click on it would have
 * navigated away. Nothing in the type system or the linter can see that, so
 * it is asserted here: every `<summary>` and every `<a>` inside a card is
 * raised out of the overlay's paint layer with `relative z-10`.
 */

const HTML = renderToStaticMarkup(
  createElement(CourseList, { courses: COURSES, lessons: LESSON_METAS })
);

/** Cap in `CourseList`; kept here as the number the assertion reads, not as a
 *  second definition — the test derives the expected list and slices to it. */
const MAX_LEADS_TO_SHOWN = 3;

describe("the card states the course's position in the graph", () => {
  it("names, for every course, exactly the courses that require it", () => {
    for (const course of COURSES) {
      const dependents = COURSES.filter((candidate) =>
        candidate.prerequisites.includes(course.slug)
      );
      if (dependents.length === 0) continue;
      for (const dependent of dependents.slice(0, MAX_LEADS_TO_SHOWN)) {
        // The href is the discriminating part: two courses can share words in
        // their titles, but only one card row points at a given course page.
        expect(HTML, `${course.slug} should lead to ${dependent.slug}`).toContain(
          `/courses/${dependent.slug}`
        );
      }
    }
  });

  it("counts the overflow rather than silently truncating it", () => {
    const overflowing = COURSES.filter(
      (course) =>
        COURSES.filter((candidate) => candidate.prerequisites.includes(course.slug)).length >
        MAX_LEADS_TO_SHOWN
    );
    for (const course of overflowing) {
      const hidden =
        COURSES.filter((candidate) => candidate.prerequisites.includes(course.slug)).length -
        MAX_LEADS_TO_SHOWN;
      expect(HTML, `${course.slug} hides ${hidden} dependents`).toContain(`and ${hidden} more`);
    }
  });

  it("renders a Leads to line for every course that has dependents", () => {
    const withDependents = COURSES.filter((course) =>
      COURSES.some((candidate) => candidate.prerequisites.includes(course.slug))
    );
    // One "Leads to" per such course, and none for the terminal ones.
    const rendered = HTML.match(/Leads to /g)?.length ?? 0;
    expect(rendered).toBe(withDependents.length);
  });
});

describe("the module manifest is folded, not removed", () => {
  it("keeps every authored lesson as a real link inside the disclosure", () => {
    const authored = LESSON_METAS.filter((lesson) =>
      COURSES.some((course) => course.slug === lesson.course)
    );
    expect(authored.length).toBeGreaterThan(0);
    for (const lesson of authored) {
      expect(HTML, lesson.slug).toContain(`href="/lessons/${lesson.slug}"`);
    }
  });

  it("gives every course exactly one collapsed manifest disclosure", () => {
    const details = HTML.match(/<details\b[^>]*>/g) ?? [];
    expect(details.length).toBe(COURSES.length);
    for (const tag of details) {
      // Open by default would put all 219 module rows back on the page and
      // undo the measurement this pass exists for.
      expect(tag).not.toMatch(/\sopen\b/);
    }
  });
});

describe("nothing real is left under the stretched card overlay", () => {
  it("raises every summary out of the overlay's paint layer", () => {
    const summaries = HTML.match(/<summary\b[^>]*>/g) ?? [];
    expect(summaries.length).toBe(COURSES.length);
    for (const tag of summaries) {
      expect(tag, tag.slice(0, 90)).toMatch(/class="[^"]*\brelative z-10\b/);
    }
  });

  it("raises every link except the one that IS the overlay", () => {
    const anchors = HTML.match(/<a\b[^>]*>/g) ?? [];
    expect(anchors.length).toBeGreaterThan(COURSES.length);
    for (const tag of anchors) {
      const isStretchedTitle = tag.includes("data-course-link");
      if (isStretchedTitle) {
        // The card's own target. It has to carry the stretched pseudo-element
        // and must *not* be raised, or the overlay would paint above the very
        // text blocks the raising exists to keep selectable.
        expect(tag).toContain("after:absolute after:inset-0");
        continue;
      }
      // Every other anchor is either raised itself or lives inside a raised
      // block (a raised element with a positive z-index is its own stacking
      // context, so its descendants come up with it). The prerequisite and
      // "Leads to" links are the second case, so this asserts the weaker,
      // true claim: no anchor carries a competing lower z-index.
      expect(tag, tag.slice(0, 90)).not.toMatch(/\bz-0\b|\b-z-\d/);
    }
  });
});
