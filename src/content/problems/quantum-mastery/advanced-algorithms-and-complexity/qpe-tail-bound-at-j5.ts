import type { NumericProblem } from "@/lib/problems/types";

const j = 5;
const value = 1 / (4 * (Math.abs(j) - 0.5) ** 2);

export const qpeTailBoundAtJ5: NumericProblem = {
  meta: {
    slug: "qpe-tail-bound-at-j5",
    title: "QPE Tail-Probability Bound at j=5",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/phase-estimation-precision-and-qft-depth",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["phase-estimation", "tail-bound"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/phase-estimation-precision-and-qft-depth"],
  },
  question: {
    type: "numeric",
    prompt: "Using the lesson's derived tail bound P(m) ≤ 1/(4(|j|−1/2)²) for j=m−b, what upper bound does this give for the probability of measuring an outcome j=5 steps from the best estimate?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "Plug j=5 into 1/(4(|j|−1/2)²): compute (5−0.5)²=20.25 first, then 1/(4×20.25).",
  },
  hints: [
    { text: "|j|−1/2 = 5−0.5 = 4.5." },
    { text: "(4.5)² = 20.25." },
    { text: "1/(4×20.25) = 1/81." },
  ],
  solution: {
    steps: [
      { description: "P(m) ≤ 1/(4(|j|−1/2)²) with j=5." },
      { description: "(|j|−1/2)² = 4.5² = 20.25." },
      { description: "1/(4×20.25) = 1/81 ≈ 0.012346." },
    ],
    finalAnswer: "1/81 ≈ 0.012346",
  },
  explanation: {
    correctIdea: "The tail bound shrinks quadratically in how far an outcome is from the best estimate, a concrete, derived guarantee.",
    whyCorrect: "This directly applies the lesson's derived inequality, which was independently verified against the real engine's exact probabilities.",
    whyWrong: ["Using |j| instead of |j|−1/2 in the denominator gives a different (looser) bound than the one actually derived in the lesson."],
  },
};
