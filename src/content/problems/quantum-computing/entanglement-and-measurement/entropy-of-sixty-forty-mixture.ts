import { Complex } from "@/lib/quantum/complex";
import { Matrix } from "@/lib/quantum/matrix";
import { vonNeumannEntropy } from "@/lib/quantum/densityMatrix";
import type { NumericProblem } from "@/lib/problems/types";

const rho = new Matrix([
  [new Complex(0.6), Complex.ZERO],
  [Complex.ZERO, new Complex(0.4)],
]);
const value = vonNeumannEntropy(rho);

export const entropyOfSixtyFortyMixture: NumericProblem = {
  meta: {
    slug: "entropy-of-sixty-forty-mixture",
    title: "Von Neumann Entropy of diag(0.6, 0.4)",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/purity-entropy-and-information",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["von-neumann-entropy", "shannon-entropy"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/purity-entropy-and-information"],
  },
  question: {
    type: "numeric",
    prompt: "Find the von Neumann entropy of ρ = diag(0.6, 0.4).",
    inputHint: "in bits, as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Since ρ is already diagonal, its eigenvalues are its diagonal entries. Apply Shannon entropy directly to (0.6, 0.4).",
    nearMisses: [
      {
        value: -0.6 * Math.log(0.6) - 0.4 * Math.log(0.4),
        tolerance: 0.005,
        feedback: "That is the same entropy in nats, from using the natural log. Bits need log base 2, so divide by ln 2.",
      },
      { value: 1, feedback: "1 bit is the maximum, reached only by a 50/50 split. A 0.6/0.4 split is slightly ordered, so its entropy sits a little below 1." },
      { value: 0, feedback: "Zero entropy means a pure state, a single outcome with probability 1. Both outcomes here carry real weight." },
    ],
  },
  hints: [
    { text: "ρ is already diagonal, so its eigenvalues are 0.6 and 0.4 directly." },
    { text: "S = -0.6 log₂(0.6) - 0.4 log₂(0.4)." },
    { text: "log₂(0.6) ≈ -0.737, log₂(0.4) ≈ -1.322." },
  ],
  solution: {
    steps: [
      { description: "Eigenvalues: 0.6 and 0.4 (already diagonal)." },
      { description: "$S = -0.6\\log_2(0.6) - 0.4\\log_2(0.4) \\approx 0.442+0.529$", latex: "S \\approx 0.971 \\text{ bits}" },
    ],
    finalAnswer: "S ≈ 0.971 bits",
  },
  explanation: {
    correctIdea: "For a diagonal ρ, entropy is just the Shannon entropy of the diagonal entries.",
    whyCorrect: "0.971 bits is close to the maximum of 1 bit, consistent with 0.6/0.4 being close to a balanced 50/50 split.",
    whyWrong: ["Answering exactly 1 would assume this is the maximally mixed state, but 0.6/0.4 isn't perfectly balanced."],
  },
};
