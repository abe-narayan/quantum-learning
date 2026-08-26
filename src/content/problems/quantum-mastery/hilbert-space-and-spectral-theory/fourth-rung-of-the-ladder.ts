import { infiniteSquareWellEnergyLevel } from "@/lib/quantum/potentials";
import type { NumericProblem } from "@/lib/problems/types";

const E3 = infiniteSquareWellEnergyLevel(3, 2);

export const fourthRungOfTheLadder: NumericProblem = {
  meta: {
    slug: "fourth-rung-of-the-ladder",
    title: "The Third Rung, From Any of the Four Directions",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/capstone-what-rigor-buys-you",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["capstone", "infinite-well", "synthesis"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/capstone-what-rigor-buys-you"],
  },
  question: {
    type: "numeric",
    prompt:
      "For the infinite well with half-width a=1 (natural units), compute E₃=n²π²/(8a²) at n=3 — the same number this course's four independent derivations (direct solution, spectral theorem, resolvent poles, Sturm-Liouville) all agree on.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: E3,
    tolerance: 0.01,
    incorrectFeedback: "Use E_n=n²π²/(8a²) directly with n=3, a=1.",
  },
  hints: [
    { text: "E_n=n²π²/(8a²), with n=3 and a=1." },
    { text: "n²=9." },
    { text: "E₃=9π²/8." },
  ],
  solution: {
    steps: [
      { description: "Substitute n=3, a=1 into the formula.", latex: "E_3=\\frac{3^2\\pi^2}{8\\cdot1^2}=\\frac{9\\pi^2}{8}" },
      { description: "Evaluate numerically.", latex: "E_3\\approx11.1033" },
    ],
    finalAnswer: "E₃ ≈ 11.1033 (natural units).",
  },
  explanation: {
    correctIdea:
      "This is exactly the value this platform's real infiniteSquareWellEnergyLevel(3,2) returns, and exactly the value each of this course's four independent derivations (direct ODE solution, spectral-theorem staircase sum, Green's function pole, Sturm-Liouville eigenvalue) converges to.",
    whyCorrect: "Direct substitution into the closed-form infinite-well energy formula, matching the platform's own engine.",
    whyWrong: [
      "Using the full width (2a) in place of the half-width a in the formula gives a different (smaller) number — the boxed formula throughout this course uses the half-width consistently.",
    ],
  },
};
