import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { concurrenceOfPureState } from "@/lib/quantum/entanglement";
import type { NumericProblem } from "@/lib/problems/types";

const psiMinus = new StateVector([Complex.ZERO, new Complex(Math.SQRT1_2), new Complex(-Math.SQRT1_2), Complex.ZERO]);
const value = concurrenceOfPureState(psiMinus);

export const psiMinusConcurrence: NumericProblem = {
  meta: {
    slug: "psi-minus-concurrence",
    title: "Concurrence of |Ψ−⟩",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["concurrence", "bell-states"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure"],
  },
  question: {
    type: "numeric",
    prompt: "Compute the concurrence of $|\\Psi^-\\rangle=\\frac{1}{\\sqrt2}(|01\\rangle-|10\\rangle)$ directly from $C=2|ad-bc|$.",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Here a=d=0, b=1/√2, c=-1/√2 — compute ad-bc carefully, including the sign on c.",
  },
  hints: [
    { text: "a=0, d=0, b=1/√2, c=-1/√2." },
    { text: "ad-bc = 0 - (1/√2)(-1/√2) = 0.5." },
    { text: "C = 2|ad-bc|." },
  ],
  solution: {
    steps: [
      { description: "$ad-bc = 0 - \\left(\\tfrac1{\\sqrt2}\\right)\\left(-\\tfrac1{\\sqrt2}\\right) = 0.5$." },
      { description: "$C = 2\\times0.5 = 1$." },
    ],
    finalAnswer: "C = 1 — |Ψ−⟩ is maximally entangled, like all four Bell states.",
  },
  explanation: {
    correctIdea: "Every Bell state reaches the maximum concurrence of 1, regardless of which specific relative sign or basis pair it uses.",
    whyCorrect: "This matches the general fact that all four Bell states are maximally entangled by every measure this course has built.",
    whyWrong: ["Forgetting the negative sign on c would give ad-bc=0, incorrectly suggesting a product state."],
  },
};
