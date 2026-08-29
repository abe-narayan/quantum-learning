import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const classicalVarianceIndependenceMc: MultipleChoiceProblem = {
  meta: {
    slug: "classical-variance-independence-mc",
    title: "Why the Classical Walk's Variance Is Exact, Not Asymptotic",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/quantum-walks",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["quantum-walks", "classical-random-walk"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/quantum-walks"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Why does Var(x_T) = T hold exactly for the classical random walk at every T, with no large-T approximation needed, while the quantum walk's ⟨x²⟩ ≈ (1−1/√2)T² is only an asymptotic (large-T) statement?",
    options: [
      { id: "a", text: "The classical result follows from independence of steps (variance of a sum of independent variables adds exactly); the quantum result comes from a stationary-phase/limiting-density argument valid only as T→∞" },
      { id: "b", text: "The classical walk is actually also only approximately T, and the lesson's claim of exactness is a simplification" },
      { id: "c", text: "The quantum walk's result is exact too — the lesson's simulation just hadn't converged yet at the T values tested" },
      { id: "d", text: "Both results are equally exact and equally asymptotic; the difference is purely cosmetic" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Var(x_T)=T for the classical walk is an exact algebraic consequence of independent-step variance addition, true for every T including T=1, not an approximation.",
      c: "The lesson's numerical results (quantum/T² converging toward 0.2929 as T grows, not sitting there exactly at small T) directly show this constant is a large-T limit, not an exact value at finite T.",
      d: "The two results have genuinely different mathematical status: one is exact for all T, the other is a limiting behavior.",
    },
    defaultIncorrectFeedback: "Recall which derivation used only elementary independence, and which used a stationary-phase/limiting-density argument.",
  },
  hints: [
    { text: "The classical walk's position is literally a sum of T independent ±1 random variables." },
    { text: "Variance of a sum of independent random variables adds exactly, for any T, not just large T." },
    { text: "The quantum result comes from analyzing where probability concentrates as T→∞, a genuinely asymptotic argument." },
  ],
  solution: {
    steps: [
      { description: "Classical: x_T = sum of T i.i.d. ±1 steps, so Var(x_T) = T·Var(single step) = T exactly, for any T." },
      { description: "Quantum: ⟨x²⟩/T² → 1−1/√2 is a limiting statement from the momentum-space dispersion relation's stationary-phase analysis, exact only in the T→∞ limit." },
    ],
    finalAnswer: "Independent steps make the classical variance add exactly at every T; the quantum result comes from a stationary-phase argument valid only as T→∞.",
  },
  explanation: {
    correctIdea: "Different mathematical machinery produces different degrees of exactness: elementary independence gives an exact finite-T formula; stationary-phase analysis gives an asymptotic one.",
    whyCorrect: "The lesson's own numerical table shows quantum/T² only converging toward the cited constant as T grows (0.2995 at T=10 vs 0.2929 at T=160), directly confirming this is asymptotic, not exact at finite T.",
    whyWrong: [
      { optionId: "b", text: "Demotes the classical result to an approximation. Var(x_T)=T is an algebraic consequence of independent-step variance addition, true at every T including T=1." },
      { optionId: "c", text: "Promotes the quantum result to exactness. The numerics show quantum/T² converging toward 0.2929 rather than sitting there at small T." },
      { optionId: "d", text: "Calls the difference cosmetic. One result holds for all T; the other is a limiting behavior." },
    ],
  },
};
