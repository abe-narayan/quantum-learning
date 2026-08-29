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
    incorrectFeedback: "Watch the order of operations. The identity gives the impurity, twice the square of |ad-bc|, and the purity is 1 minus that. Two common slips: forgetting the factor of 2, or reporting the impurity itself instead of subtracting it from 1. A quick sanity check: your result should land strictly between the two purities quoted in the prompt.",
    nearMisses: [
      {
        value: 2 * determinantMagnitude * determinantMagnitude,
        feedback: "That is the impurity, 1 − Tr(ρ_A²). The identity leaves it on the left-hand side, so subtract it from 1 to get the purity itself.",
      },
      {
        value: 1 - determinantMagnitude * determinantMagnitude,
        feedback: "You dropped the factor of 2 in 2|ad−bc|². With it, the impurity doubles and the purity falls into the 0.5-to-0.58 window the prompt asks you to check.",
      },
    ],
  },
  hints: [
    { text: "You are asked for the purity Tr(ρ_A²), and the identity in the prompt relates that purity to the single number |ad-bc| you were given. So the whole problem is: rearrange the identity to isolate the purity, then substitute." },
    { text: "Rearranged, the identity reads Tr(ρ_A²) = 1 - 2|ad-bc|². Square the given value, double it, and subtract from 1." },
    { text: "Before submitting, check the bracketing described in the prompt: a larger |ad-bc| means more entanglement and therefore lower reduced purity, so your number must sit between the Bell state's purity and the capstone state's purity." },
  ],
  solution: {
    steps: [
      { description: "$2(0.48)^2 = 2(0.2304) = 0.4608$." },
      { description: "$\\text{Tr}(\\rho_A^2) = 1 - 0.4608 = 0.5392$." },
    ],
    finalAnswer: "Tr(ρ_A²) = 0.5392",
  },
  explanation: {
    correctIdea: "0.5392 sits between the capstone state's 0.58 and a Bell state's 0.5, as expected since |ad-bc|=0.48 sits between 0.458 and 0.5.",
    whyCorrect: "This confirms the identity behaves monotonically and continuously: closer to maximal entanglement (larger |ad-bc|) means lower reduced purity.",
    whyWrong: ["Getting a value outside the 0.5-0.58 range would indicate an arithmetic error, since 0.48 sits strictly between 0.458 and 0.5 by construction."],
  },
};
