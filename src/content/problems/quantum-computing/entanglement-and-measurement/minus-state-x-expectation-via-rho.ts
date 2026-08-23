import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { PAULI_X } from "@/lib/quantum/gates";
import { pureStateDensityMatrix, densityMatrixExpectationValue } from "@/lib/quantum/densityMatrix";
import type { NumericProblem } from "@/lib/problems/types";

const minusState = new StateVector([new Complex(Math.SQRT1_2), new Complex(-Math.SQRT1_2)]);
const rho = pureStateDensityMatrix(minusState);
const expectation = densityMatrixExpectationValue(rho, PAULI_X).re;

export const minusStateXExpectationViaRho: NumericProblem = {
  meta: {
    slug: "minus-state-x-expectation-via-rho",
    title: "⟨X⟩ for |−⟩, Computed via Tr(ρX)",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["density-matrix", "expectation-value", "trace"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices"],
  },
  question: {
    type: "numeric",
    prompt:
      "For $|-\\rangle=\\frac{1}{\\sqrt2}(|0\\rangle-|1\\rangle)$, compute $\\langle X\\rangle$ using $\\text{Tr}(\\rho X)$, where $\\rho=|-\\rangle\\langle-|$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: expectation,
    tolerance: 0.01,
    incorrectFeedback: "Recall |−⟩ is an eigenstate of X — which eigenvalue?",
  },
  hints: [
    { text: "|−⟩ is the −1 eigenstate of X: X|−⟩ = −|−⟩." },
    { text: "For an eigenstate, ⟨A⟩ equals the eigenvalue directly." },
    { text: "Tr(ρX) must agree with this, since it's the same expectation-value formula in different notation." },
  ],
  solution: {
    steps: [
      { description: "|−⟩ is an eigenstate of X with eigenvalue −1: $X|-\\rangle=-|-\\rangle$." },
      { description: "So $\\langle X\\rangle=\\langle-|X|-\\rangle=\\langle-|(-|-\\rangle)=-\\langle-|-\\rangle=-1$." },
      { description: "$\\text{Tr}(\\rho X)$ must give the same value, since Lesson 1 proved the two formulas are identical." },
    ],
    finalAnswer: "$\\langle X\\rangle = -1$",
  },
  explanation: {
    correctIdea: "|−⟩ is an X-eigenstate with eigenvalue −1, so ⟨X⟩=−1 regardless of which formula computes it.",
    whyCorrect: "Tr(ρX) and ⟨−|X|−⟩ are proven identical in this course's first lesson.",
    whyWrong: ["Confusing |−⟩ with |+⟩ (eigenvalue +1) gives the wrong sign."],
  },
};
