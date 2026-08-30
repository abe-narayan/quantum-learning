import type { NumericProblem } from "@/lib/problems/types";

const t = 1.0;
const commNorm = 5.656854249492381;
const epsilon = 0.01;
const value = Math.ceil((t * t * commNorm) / (2 * epsilon));

export const trotterStepsForTargetError: NumericProblem = {
  meta: {
    slug: "trotter-steps-for-target-error",
    title: "Trotter Steps Needed for a Target Error",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["trotterization", "error-bound", "hamiltonian-simulation"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization"],
  },
  question: {
    type: "numeric",
    prompt: "Using the derived bound (t²/2n)‖[A,B]‖ ≤ ε, with t=1 and ‖[A,B]‖_F≈5.656854 (this lesson's exact 2-qubit commutator norm), what is the smallest integer number of Trotter steps n that brings the bound below ε=0.01?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback: "Solve n ≥ t²‖[A,B]‖/(2ε) directly, then round up to the nearest integer. Rounding down leaves the bound unmet, so 282 does not qualify even though it is closer to the raw 282.84.",
    nearMisses: [
      { value: 566, tolerance: 2, feedback: "566 drops the factor of 2 in the denominator. The bound is t²‖[A,B]‖/(2ε), so halving the denominator doubles the step count needlessly." },
      { value: 141, tolerance: 2, feedback: "141 halves the answer once too often, as if the denominator were 4ε. The derived bound has 2ε." },
    ],
  },
  hints: [
    { text: "Rearrange the bound: n ≥ t²‖[A,B]‖/(2ε)." },
    { text: "Plug in t=1, ‖[A,B]‖≈5.656854, ε=0.01." },
    { text: "Divide the commutator norm by twice the target error, then round up: n is a whole number of steps, and rounding down would leave the bound unsatisfied." },
  ],
  solution: {
    steps: [
      { description: "The derived total-error bound is (t²/2n)‖[A,B]‖ ≤ ε." },
      { description: "Solving for n: n ≥ t²‖[A,B]‖/(2ε) = (1)(5.656854)/(0.02) ≈ 282.84." },
      { description: "Since n must be a whole number of steps and must not undershoot the bound, round up: n = 283." },
    ],
    finalAnswer: `n = ${value}`,
  },
  explanation: {
    correctIdea: "The derived bound directly determines the minimum step count for any target accuracy: a real, checkable resource estimate, not a qualitative guess.",
    whyCorrect: "Inverting the error bound turns a target accuracy into a step count, which is the practical form the derivation was aimed at: resource estimates come straight out of it.",
    whyWrong: ["Rounding down, or forgetting the factor of 2 from t²/(2n), both give an n that doesn't actually satisfy the bound."],
  },
};
