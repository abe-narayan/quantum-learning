import type { NumericProblem } from "@/lib/problems/types";

const commNorm = 4 * Math.sqrt(2);
const t = 10;
const epsilon = 0.001;
const value = Math.ceil((t * t * commNorm) / (2 * epsilon));

export const capstoneToolboxTrotterStepsT10: NumericProblem = {
  meta: {
    slug: "capstone-toolbox-trotter-steps-t10",
    title: "First-Order Trotter Steps at t=10",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/capstone-the-toolbox-that-ate-quantum-algorithms",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["capstone", "synthesis", "hamiltonian-simulation", "trotterization"],
    prerequisites: [
      "apex/algorithmic-frontiers/capstone-the-toolbox-that-ate-quantum-algorithms",
    ],
  },
  question: {
    type: "numeric",
    prompt:
      "Using this capstone's formula for first-order Trotter step count, n = ceil(t²‖[A,B]‖/(2ε)), with the same 2-qubit Hamiltonian's exact commutator norm ‖[A,B]‖=4√2≈5.656854, t=10, and target error ε=0.001, what is the smallest integer number of Trotter steps n needed?",
    inputHint: "an integer; anything within 1% of the exact count is accepted",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    toleranceType: "relative",
    incorrectFeedback: "Plug t=10, ‖[A,B]‖=4√2, ε=0.001 directly into n = ceil(t²‖[A,B]‖/(2ε)). If your answer is off by a factor of a hundred, the t² got dropped; if off by a factor of two, check the 2ε in the denominator.",
    nearMisses: [
      {
        value: Math.ceil(commNorm / (2 * epsilon)),
        feedback:
          "You dropped the t² and used the commutator norm alone. The quadratic dependence on evolution time is the whole point of this comparison: at t=10 it costs a factor of 100.",
      },
      {
        value: Math.ceil((t * commNorm) / (2 * epsilon)),
        feedback: "You used t rather than t². First-order Trotter error grows with t², so the step count does too.",
      },
      {
        value: Math.ceil((t * t * commNorm) / epsilon),
        feedback: "The denominator is 2ε, not ε. Halving it doubles the step count, so your answer is twice the bound's requirement.",
      },
    ],
  },
  hints: [
    { text: "The formula is n ≥ t²‖[A,B]‖/(2ε), then round up to the nearest integer." },
    { text: "t²=100, and 2ε=0.002, so compute 100 × 5.656854 / 0.002." },
    { text: "Multiply out the numerator, divide by 0.002, and round up. Expect something large: quadratic-in-t scaling is expensive at t=10." },
  ],
  solution: {
    steps: [
      { description: "The capstone's formula is n = ceil(t²‖[A,B]‖/(2ε)), the same first-order Trotter bound derived in the prerequisite Mastery course, applied here at t=10." },
      { description: "Substituting: n ≥ (10)²(4√2)/(2×0.001) = 100 × 5.656854 / 0.002 ≈ 282,842.71." },
      { description: "Rounding up to the nearest integer (the bound must be met, not undershot) gives n = 282,843." },
    ],
    finalAnswer: `n = ${value.toLocaleString("en-US")}`,
  },
  explanation: {
    correctIdea: "The same derived Trotter error formula this course reused throughout scales quadratically in t: a concrete illustration of why QSVT-based simulation's linear-in-t scaling is a genuine asymptotic improvement, not just a rebranding.",
    whyCorrect: "Direct substitution into the capstone's own trotterStepsFirstOrder formula, using the same real commutator norm established in the prerequisite Hamiltonian-simulation lesson.",
    whyWrong: ["Forgetting to square t, forgetting the factor of 2 in the denominator, or rounding down instead of up each give a value that doesn't actually satisfy the error bound."],
  },
};
