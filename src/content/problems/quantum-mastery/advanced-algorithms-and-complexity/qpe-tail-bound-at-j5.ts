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
    inputHint: "as a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "Check the half-step correction: the denominator uses |j|−1/2, not |j|. The order of operations matters too: square the bracketed quantity before multiplying by 4. If your bound came out larger than a few percent, one of those two steps went astray.",
    nearMisses: [
      { value: 0.01, tolerance: 0.0002, feedback: "0.01 = 1/(4·5²) uses |j| where the derivation uses |j| − 1/2. The half-step makes the bound slightly looser, not tighter." },
      { value: 1 / (4 * 5.5 ** 2), tolerance: 0.0002, feedback: "The half-step is subtracted, not added: the denominator uses |j| − 1/2 = 4.5." },
      { value: 0.05, tolerance: 0.002, feedback: "0.05 is 1/(4|j|), missing the square. The bound falls off quadratically with distance from the best estimate." },
    ],
  },
  hints: [
    { text: "The bound is given in the prompt, so the work is substitution. First be clear on what j means: how many steps the measured outcome sits from the best estimate. Then note the half-step subtraction inside the parentheses before plugging anything in." },
    { text: "With j = 5, the bracketed quantity is |j| − 1/2 = 4.5." },
    { text: "Square 4.5, multiply the result by 4, then take the reciprocal. Expect a small probability, on the order of one percent." },
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
    whyCorrect: "Applying the derived inequality at j=5 involves no further approximation, and the bound was checked independently against the engine's exact probabilities, so it is both valid and reasonably tight.",
    whyWrong: ["Using |j| instead of |j|−1/2 in the denominator gives a different (looser) bound than the one actually derived in the lesson."],
  },
};
