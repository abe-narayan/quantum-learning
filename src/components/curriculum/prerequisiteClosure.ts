import { COURSES, getCourse } from "@/lib/content/curriculum";
import type { Course } from "@/lib/content/types";

/**
 * ============================================================
 * What a reader has necessarily read, and what that opens
 * ============================================================
 *
 * Everything here answers one question: standing at the end of a course, what
 * can this reader actually start next?
 *
 * The naive answer is the reverse prerequisite edge, "courses that list this
 * one as a prerequisite", and it is a half-truth that strands people. **24 of
 * the graph's 32 courses have at least one forward edge into a course that
 * needs another prerequisite the reader has not been sent to.** Finishing Wave
 * Mechanics points at Operators, Observables & Measurement, which also wants
 * Quantum Gates & Circuits from the Computing track. Finishing Noise,
 * Decoherence & Scaling points at Rigorous Quantum Information Theory, which
 * also wants Advanced Topics in Quantum Mechanics *and* Quantum Error
 * Correction, so before this was fixed every single forward pointer on that
 * page went to a course the reader could not open.
 *
 * Naming the gap costs one clause and turns a wall into an itinerary, which is
 * why `unmetPrerequisites` exists alongside the boolean.
 *
 * This module exists because the closure had been written three times, in
 * `/courses/[slug]`, in `LessonLayout`, and in
 * `curriculumProgression.test.ts`, with identical semantics and three
 * different names. Two of those are reader-facing surfaces that must agree
 * with each other, and a test that computes the invariant its own way cannot
 * catch them drifting apart.
 *
 * Pure functions over `COURSES`, no React, no client data: safe from a server
 * component, a client component, or a test.
 */

/**
 * The transitive prerequisite closure of a course, **including the course
 * itself**: everything a reader standing at its last lesson has necessarily
 * read.
 *
 * Iterative rather than recursive, and guarded by the `seen` set, so a cycle
 * in the curriculum data terminates here instead of blowing the stack.
 * `curriculum.test.ts` asserts the graph is acyclic; this does not rely on it.
 */
export function coursesReadBy(slug: string): Set<string> {
  const seen = new Set<string>([slug]);
  const queue = [slug];
  while (queue.length > 0) {
    const current = queue.pop();
    if (current === undefined) break;
    for (const prereqSlug of getCourse(current)?.prerequisites ?? []) {
      if (seen.has(prereqSlug)) continue;
      seen.add(prereqSlug);
      queue.push(prereqSlug);
    }
  }
  return seen;
}

/**
 * The prerequisites of `candidate` that `read` does not already cover, in the
 * order the course declares them.
 *
 * Empty means the reader can start it now. Non-empty is the sentence a reader
 * needs: "Also needs X and Y" is useful, a link that quietly fails is not.
 */
export function unmetPrerequisites(candidate: Course, read: Set<string>): string[] {
  return candidate.prerequisites.filter((prereqSlug) => !read.has(prereqSlug));
}

/** True when every one of `candidate`'s prerequisites is already covered. */
export function isStartable(candidate: Course, read: Set<string>): boolean {
  return unmetPrerequisites(candidate, read).length === 0;
}

/**
 * Every course that lists `slug` as a prerequisite, annotated with what else
 * it still needs, and **sorted so the ones a reader can start now come
 * first**.
 *
 * Sorting rather than filtering is deliberate. Hiding the blocked ones would
 * make the curriculum look smaller than it is and give the reader no way to
 * see what the course they just finished was building toward; showing them
 * unannotated is what produced the dead ends. Ordering plus a named gap keeps
 * both facts on the page.
 */
export function dependentsOf(slug: string): Array<{ course: Course; alsoNeeds: string[] }> {
  const read = coursesReadBy(slug);
  return COURSES.filter((candidate) => candidate.prerequisites.includes(slug))
    .map((course) => ({ course, alsoNeeds: unmetPrerequisites(course, read) }))
    .sort((a, b) => a.alsoNeeds.length - b.alsoNeeds.length);
}

/**
 * Courses the reader can start now that are **not** already offered as
 * dependents of `slug`.
 *
 * The fallback for the case that produced the worst dead ends: a course whose
 * every forward pointer is blocked. Finishing it used to end the road. The
 * closure has still opened doors elsewhere in the graph, and this finds them.
 */
export function nowOpenAfter(slug: string): Course[] {
  const read = coursesReadBy(slug);
  const alreadyOffered = new Set(
    COURSES.filter((candidate) => candidate.prerequisites.includes(slug)).map((c) => c.slug)
  );
  return COURSES.filter(
    (candidate) =>
      !read.has(candidate.slug) &&
      !alreadyOffered.has(candidate.slug) &&
      isStartable(candidate, read)
  );
}
