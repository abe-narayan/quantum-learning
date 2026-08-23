import { computationalBasisDensityMatrix, convexCombination, purity } from "@/lib/quantum/densityMatrix";
import type { NumericProblem } from "@/lib/problems/types";

const rho = convexCombination([
  { probability: 0.8, density: computationalBasisDensityMatrix(1, 0) },
  { probability: 0.2, density: computationalBasisDensityMatrix(1, 1) },
]);
const value = purity(rho);

export const biasedMixturePurity: NumericProblem = {
  meta: {
    slug: "biased-mixture-purity",
    title: "Purity of an 80/20 Mixture",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["purity", "mixed-states"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states"],
  },
  question: {
    type: "numeric",
    prompt: "A qubit is |0⟩ with probability 0.8 and |1⟩ with probability 0.2. Find Tr(ρ²).",
    inputHint: "as a decimal between 0.5 and 1",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.005,
    incorrectFeedback: "ρ is diagonal here — Tr(ρ²) is just the sum of the squared diagonal entries.",
  },
  hints: [
    { text: "This mixture's density matrix is diagonal: ρ=diag(0.8,0.2)." },
    { text: "For a diagonal matrix, ρ² is also diagonal, with each entry squared." },
    { text: "Tr(ρ²) = 0.8² + 0.2²." },
  ],
  solution: {
    steps: [
      { description: "ρ = diag(0.8, 0.2)." },
      { description: "Tr(ρ²) = 0.8² + 0.2² = 0.64 + 0.04.", latex: "\\text{Tr}(\\rho^2) = 0.64+0.04" },
    ],
    finalAnswer: "Tr(ρ²) = 0.68",
  },
  explanation: {
    correctIdea: "For a diagonal ρ, purity is just the sum of squared diagonal entries.",
    whyCorrect: "0.68 is strictly between 0.5 (maximally mixed) and 1 (pure), matching an unbalanced but still genuinely mixed state.",
    whyWrong: ["Answering exactly 0.5 would assume this is maximally mixed, but 80/20 is not a balanced mixture."],
  },
};
