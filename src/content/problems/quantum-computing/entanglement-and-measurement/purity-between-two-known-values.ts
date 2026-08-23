import type { NumericProblem } from "@/lib/problems/types";

const determinantMagnitude = 0.48;
const value = 1 - 2 * determinantMagnitude * determinantMagnitude;

export const purityBetweenTwoKnownValues: NumericProblem = {
  meta: {
    slug: "purity-between-two-known-values",
    title: "Reduced Purity for |ad−bc|=0.48",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["purity", "entanglement", "capstone"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using the identity $1-\\text{Tr}(\\rho_A^2)=2|ad-bc|^2$, find $\\text{Tr}(\\rho_A^2)$ for a state with $|ad-bc|=0.48$, and confirm it lies between this lesson's $|\\psi\\rangle$ ($|ad-bc|\\approx0.458$, purity $0.58$) and a Bell state ($|ad-bc|=0.5$, purity $0.5$).",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.005,
    incorrectFeedback: "Square 0.48 first, double it, then subtract from 1.",
  },
  hints: [
    { text: "0.48² = 0.2304." },
    { text: "2 × 0.2304 = 0.4608." },
    { text: "Tr(ρ_A²) = 1 - 0.4608." },
  ],
  solution: {
    steps: [
      { description: "$2(0.48)^2 = 2(0.2304) = 0.4608$." },
      { description: "$\\text{Tr}(\\rho_A^2) = 1 - 0.4608 = 0.5392$." },
    ],
    finalAnswer: "Tr(ρ_A²) = 0.5392",
  },
  explanation: {
    correctIdea: "0.5392 sits between the capstone state's 0.58 and a Bell state's 0.5, exactly as expected since |ad-bc|=0.48 sits between 0.458 and 0.5.",
    whyCorrect: "This confirms the identity behaves monotonically and continuously — closer to maximal entanglement (larger |ad-bc|) means lower reduced purity.",
    whyWrong: ["Getting a value outside the 0.5-0.58 range would indicate an arithmetic error, since 0.48 sits strictly between 0.458 and 0.5 by construction."],
  },
};
