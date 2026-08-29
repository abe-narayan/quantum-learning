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
    incorrectFeedback: "The usual slip is the sign: c carries a minus sign, so the product bc is negative and ad-bc comes out positive. If you got zero, you probably dropped that sign, and a Bell state is certainly not a product state.",
    nearMisses: [
      { value: 0, feedback: "Zero concurrence means a product state. You dropped the minus sign on c: bc = −0.5, so ad − bc = +0.5, not 0." },
      { value: 0.5, feedback: "0.5 is |ad−bc|. The definition doubles it: C = 2|ad−bc|." },
    ],
  },
  hints: [
    { text: "Read the four amplitudes a, b, c, d off the state in standard basis order. Two of them vanish, and the two that survive carry opposite signs." },
    { text: "With a and d both zero, ad-bc reduces to -bc. Multiply the two surviving amplitudes, minding the minus sign on c." },
    { text: "Double the absolute value of what you found. As a check, the result should sit at the very top of the concurrence scale, where every Bell state lives." },
  ],
  solution: {
    steps: [
      { description: "$ad-bc = 0 - \\left(\\tfrac1{\\sqrt2}\\right)\\left(-\\tfrac1{\\sqrt2}\\right) = 0.5$." },
      { description: "$C = 2\\times0.5 = 1$." },
    ],
    finalAnswer: "C = 1: |Ψ−⟩ is maximally entangled, like all four Bell states.",
  },
  explanation: {
    correctIdea: "Every Bell state reaches the maximum concurrence of 1, regardless of which specific relative sign or basis pair it uses.",
    whyCorrect: "This matches the general fact that all four Bell states are maximally entangled by every measure this course has built.",
    whyWrong: ["Forgetting the negative sign on c would give ad-bc=0, incorrectly suggesting a product state."],
  },
};
