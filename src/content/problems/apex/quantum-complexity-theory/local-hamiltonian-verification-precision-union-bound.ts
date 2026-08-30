import type { NumericProblem } from "@/lib/problems/types";

const termCount = 50;
const promiseGap = 0.02;
const requiredPrecision = promiseGap / (3 * termCount);

export const localHamiltonianVerificationPrecisionUnionBound: NumericProblem = {
  meta: {
    slug: "local-hamiltonian-verification-precision-union-bound",
    title: "Per-Term Precision for Local Hamiltonian Verification",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/the-local-hamiltonian-problem",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["local-hamiltonian", "qma-membership", "union-bound", "precision"],
    prerequisites: ["apex/quantum-complexity-theory/the-local-hamiltonian-problem"],
  },
  question: {
    type: "numeric",
    prompt:
      "A Local Hamiltonian instance has m=50 local terms and promise gap b-a=0.02. Following the lesson's QMA-membership argument, Arthur needs the sum of his m per-term estimation errors to stay below (b-a)/3 in the worst case, so he budgets each term the same slice of that error: epsilon = (b-a)/(3m). What value of epsilon (per-term additive precision) does this give?",
    inputHint: "as a decimal, to 6 decimal places, e.g. 0.000123",
  },
  answer: {
    type: "numeric",
    value: requiredPrecision,
    tolerance: 0.0000005,
    incorrectFeedback:
      "epsilon = (b-a)/(3m) = 0.02/(3*50) = 0.02/150. Divide the promise gap by 3 times the number of terms.",
    nearMisses: [
      {
        value: promiseGap / termCount,
        tolerance: 0.000002,
        feedback:
          "You divided by m but dropped the factor of 3. Without it the summed error can reach the full promise gap, leaving no margin either side of the decision threshold.",
      },
      {
        value: promiseGap / 3,
        tolerance: 0.00002,
        feedback: "That is the whole error budget. It has to be shared across all m=50 terms, not handed to each term in full.",
      },
    ],
  },
  hints: [
    { text: "The lesson's argument splits a total error budget of (b-a)/3 evenly across all m terms." },
    { text: "epsilon = (b-a)/(3m), not (b-a)/m or (b-a)/3 alone." },
    { text: "Plug in b-a=0.02 and m=50: epsilon = 0.02/150." },
  ],
  solution: {
    steps: [
      { description: "The verifier needs the total error across all m per-term estimates to stay below (b-a)/3, leaving margin on both sides of the (a+b)/2 decision threshold." },
      { description: "Splitting that budget evenly across m terms gives each term an allowed error of epsilon = (b-a)/(3m)." },
      { description: "$\\varepsilon = \\dfrac{0.02}{3 \\times 50} = \\dfrac{0.02}{150} \\approx 0.0001333$" },
    ],
    finalAnswer: `epsilon ≈ ${requiredPrecision.toFixed(7)}`,
  },
  explanation: {
    correctIdea:
      "Local Hamiltonian's QMA-membership proof needs each of the m per-term energy estimates accurate to within (b-a)/(3m), so that the worst-case sum of m errors still stays inside (b-a)/3 of the true total.",
    whyCorrect:
      "Because the m terms' errors could in the worst case all point the same direction, the total error is bounded by m times the per-term error; requiring that total to be below (b-a)/3 forces the per-term bound (b-a)/(3m).",
    whyWrong: [
      "Using epsilon=(b-a)/m ignores the factor of 3 margin needed to also cover the union-bound confidence requirement and leave room around the decision threshold.",
      "Using epsilon=(b-a)/3 ignores that this budget must be split across all m terms, not given to each term in full.",
    ],
  },
};
