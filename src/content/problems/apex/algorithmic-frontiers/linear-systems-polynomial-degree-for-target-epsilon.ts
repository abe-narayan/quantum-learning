import type { NumericProblem } from "@/lib/problems/types";

const kappa = 2;
const epsilon = 0.001;
const value = Math.ceil(kappa * Math.log(1 / epsilon));

export const linearSystemsPolynomialDegreeForTargetEpsilon: NumericProblem = {
  meta: {
    slug: "linear-systems-polynomial-degree-for-target-epsilon",
    title: "Polynomial Degree for a Target Inversion Accuracy",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["quantum-linear-systems", "qsvt", "condition-number", "hhl"],
    prerequisites: ["apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems"],
  },
  question: {
    type: "numeric",
    prompt:
      "This lesson's worked example has condition number κ=2. Using the lesson's stated degree estimate for the polynomial approximating c/x to accuracy ε on [1/κ,1], degree ≈ κ·ln(1/ε), what is the smallest integer polynomial degree needed for ε=0.001?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0,
    incorrectFeedback: "Compute κ·ln(1/ε) with κ=2 and ε=0.001, then round up to the nearest integer, since a polynomial degree can't be fractional.",
    nearMisses: [
      {
        value: kappa * Math.log(1 / epsilon),
        tolerance: 0.05,
        feedback: "That is the raw estimate before rounding. A polynomial degree is a whole number, and rounding down would miss the target accuracy, so round up.",
      },
      {
        value: Math.floor(kappa * Math.log(1 / epsilon)),
        feedback: "You rounded down. A degree below the estimate does not reach accuracy ε, so the rounding has to go up.",
      },
      {
        value: Math.ceil(kappa * Math.log2(1 / epsilon)),
        feedback: "That uses log base 2. The lesson's estimate is stated with the natural log, ln(1/ε).",
      },
      {
        value: Math.ceil(kappa * Math.log10(1 / epsilon)),
        feedback: "That uses log base 10. The lesson's estimate is stated with the natural log, ln(1/ε).",
      },
    ],
  },
  hints: [
    { text: "The lesson states the degree scales as O(κ log(1/ε)); take the estimate degree ≈ κ·ln(1/ε)." },
    { text: "ln(1/0.001) = ln(1000) ≈ 6.9078." },
    { text: "Multiply by κ, then round up: a polynomial degree must be a whole number, and rounding down would undershoot the target accuracy." },
  ],
  solution: {
    steps: [
      { description: "The lesson's stated estimate is degree ≈ κ·ln(1/ε), reflecting that a worse-conditioned A (larger κ) pushes the approximation domain [1/κ,1] closer to 1/x's unbounded singularity at 0, requiring a higher-degree polynomial." },
      { description: "Plugging in κ=2 and ε=0.001: degree ≈ 2 × ln(1000) ≈ 2 × 6.9078 ≈ 13.82." },
      { description: "Rounding up to the nearest whole degree: 14." },
    ],
    finalAnswer: `degree ≈ ${value}`,
  },
  explanation: {
    correctIdea: "The polynomial degree needed to approximate 1/x on a κ-dependent truncated interval scales with both κ and the target accuracy: a concrete, computable resource cost, not just a qualitative claim.",
    whyCorrect: "This is exactly the quantitative dependence the lesson's regularization discussion establishes: κ sets how close to the unbounded singularity at x=0 the approximation must remain valid.",
    whyWrong: ["Using log base 10 or log base 2 instead of the natural log, or forgetting to round up, both give a degree that doesn't actually match the lesson's stated ln(1/ε) scaling."],
  },
};
