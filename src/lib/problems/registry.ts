import type { Problem, ProblemMeta, Quiz } from "./types";
import { plusStateMeasurementProbability } from "@/content/problems/quantum-computing/qubits-and-quantum-states/plus-state-measurement-probability";
import { tensorProductBasisLabel } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/tensor-product-basis-label";
import { bellStateSeparability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/bell-state-separability";
import { bellStateOutcomeProbability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/bell-state-outcome-probability";
import { hThenCnotResult } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/h-then-cnot-result";

/**
 * Problems are plain, statically-imported TypeScript objects rather than
 * MDX files scanned off disk (contrast `lib/content/lessons.ts`). See
 * docs/ARCHITECTURE.md §10 for the reasoning — in short, a problem is a
 * structured record (metadata + typed question/answer/hints/solution), not
 * prose-heavy long-form content, so a plain array of typed imports gives
 * full compile-time checking of every problem's shape with no MDX
 * compilation step. Adding a problem is: write the file, add one import
 * and one array entry here — the same amount of ceremony `curriculum.ts`
 * already asks of adding a course.
 */
export const PROBLEMS: Problem[] = [
  plusStateMeasurementProbability,
  tensorProductBasisLabel,
  bellStateSeparability,
  bellStateOutcomeProbability,
  hThenCnotResult,
];

export function getAllProblems(): Problem[] {
  return PROBLEMS;
}

export function getAllProblemMeta(): ProblemMeta[] {
  return PROBLEMS.map((problem) => problem.meta);
}

export function getProblem(slug: string): Problem | undefined {
  return PROBLEMS.find((problem) => problem.meta.slug === slug);
}

export function getProblemsForLesson(lessonSlug: string): Problem[] {
  return PROBLEMS.filter((problem) => problem.meta.lesson === lessonSlug);
}

export function getProblemsForCourse(courseSlug: string): Problem[] {
  return PROBLEMS.filter((problem) => problem.meta.course === courseSlug);
}

/**
 * No quizzes are authored yet — this phase establishes the `Quiz` type and
 * its lookup functions (architecture) without building the quiz-taking UI.
 * See docs/ARCHITECTURE.md §10.
 */
export const QUIZZES: Quiz[] = [];

export function getAllQuizzes(): Quiz[] {
  return QUIZZES;
}

export function getQuiz(slug: string): Quiz | undefined {
  return QUIZZES.find((quiz) => quiz.slug === slug);
}
