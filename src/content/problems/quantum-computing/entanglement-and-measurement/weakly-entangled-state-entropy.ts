import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { entanglementEntropy } from "@/lib/quantum/entanglement";
import type { NumericProblem } from "@/lib/problems/types";

const state = new StateVector([new Complex(Math.sqrt(0.99)), Complex.ZERO, Complex.ZERO, new Complex(Math.sqrt(0.01))]);
const value = entanglementEntropy(state);

export const weaklyEntangledStateEntropy: NumericProblem = {
  meta: {
    slug: "weakly-entangled-state-entropy",
    title: "Entanglement Entropy of a Weakly Entangled State",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/entanglement-entropy-for-pure-states",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["entanglement-entropy"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/entanglement-entropy-for-pure-states"],
  },
  question: {
    type: "numeric",
    prompt: "Find the entanglement entropy of $|\\psi\\rangle=\\sqrt{0.99}|00\\rangle+\\sqrt{0.01}|11\\rangle$.",
    inputHint: "in bits, as a decimal; well under 1",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "The reduced state here is diag(0.99, 0.01). Apply Shannon entropy directly to that lopsided pair.",
    nearMisses: [
      { value: 0, tolerance: 0.005, feedback: "Zero entropy means a product state. The |11⟩ term has small but nonzero amplitude, so a little entanglement survives." },
      { value: 1, feedback: "1 bit is the Bell-state maximum, reached only by a balanced 50/50 split. A 99/1 split sits near the bottom of the range." },
      {
        value: -0.99 * Math.log(0.99) - 0.01 * Math.log(0.01),
        tolerance: 0.003,
        feedback: "That is the same entropy in nats. Bits require log base 2.",
      },
    ],
  },
  hints: [
    { text: "ρ_A = diag(0.99, 0.01) directly from the amplitudes' squared magnitudes." },
    { text: "This is already diagonal, so its entropy is the Shannon entropy of (0.99, 0.01)." },
    { text: "A very lopsided split like 99/1 gives entropy much closer to 0 than to 1." },
  ],
  solution: {
    steps: [
      { description: "ρ_A = diag(0.99, 0.01)." },
      { description: "$S = -0.99\\log_2(0.99) - 0.01\\log_2(0.01) \\approx 0.0144+0.0664$", latex: "S \\approx 0.081 \\text{ bits}" },
    ],
    finalAnswer: "S ≈ 0.081 bits: weakly entangled, far from the Bell-state maximum of 1 bit.",
  },
  explanation: {
    correctIdea: "A 99/1 amplitude split gives a nearly-pure reduced state, hence low but nonzero entanglement entropy.",
    whyCorrect: "This matches the general pattern: entanglement entropy grows as the amplitude split moves from lopsided toward balanced (50/50 at θ=π/4).",
    whyWrong: ["Answering close to 1 bit would incorrectly treat any nonzero entanglement as maximal entanglement."],
  },
};
