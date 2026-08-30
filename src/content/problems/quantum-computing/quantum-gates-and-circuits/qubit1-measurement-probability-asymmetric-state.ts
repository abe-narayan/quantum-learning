import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { qubitMeasurementProbabilities } from "@/lib/quantum/measurement";
import type { NumericProblem } from "@/lib/problems/types";

const state = new StateVector([new Complex(0.5), new Complex(Math.sqrt(3) / 2), Complex.ZERO, Complex.ZERO]);
const [probabilityQubit1IsZero] = qubitMeasurementProbabilities(state, 1);

export const qubit1MeasurementProbabilityAsymmetricState: NumericProblem = {
  meta: {
    slug: "qubit1-measurement-probability-asymmetric-state",
    title: "Measuring the Other Qubit",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/multi-qubit-measurement",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["partial-measurement", "born-rule"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/multi-qubit-measurement"],
  },
  question: {
    type: "numeric",
    prompt:
      "For the state $\\frac{1}{2}|00\\rangle + \\frac{\\sqrt3}{2}|01\\rangle$ (the same one from this lesson's worked example), find $P(\\text{qubit }1{=}0)$, measuring qubit 1 this time rather than qubit 0.",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: probabilityQubit1IsZero,
    tolerance: 0.01,
    incorrectFeedback: "Check qubit 1's bit (not qubit 0's) in each basis term, and sum |amplitude|² over only the terms where that bit is 0.",
    nearMisses: [
      { value: 0.75, feedback: "0.75 is P(qubit 1 = 1), the |01⟩ term's weight. The question asks for the outcome 0, carried by |00⟩ alone." },
      { value: 1, feedback: "1 is P(qubit 0 = 0) from the lesson's worked example. Both terms have qubit 0 at 0; qubit 1 is the one that varies." },
      { value: 0.5, feedback: "0.5 assumes the two outcomes are balanced. The amplitudes 1/2 and √3/2 are not equal, so their squares split 1/4 against 3/4." },
    ],
  },
  hints: [
    { text: "Qubit 1 is the second (rightmost) label in each ket." },
    { text: "In |00⟩, qubit 1 = 0; in |01⟩, qubit 1 = 1. Only one of the two terms contributes." },
    { text: "Sum |amplitude|² only over the term(s) where qubit 1 = 0." },
  ],
  solution: {
    steps: [
      { description: "Identify which term(s) have qubit 1 = 0: only $|00\\rangle$ does; $|01\\rangle$ has qubit 1 = 1." },
      {
        description: "Sum $|c_i|^2$ over that one term.",
        latex: "P(\\text{qubit }1{=}0) = \\left|\\frac12\\right|^2 = \\frac14",
      },
    ],
    finalAnswer: "$P(\\text{qubit }1{=}0) = 0.25$",
  },
  explanation: {
    correctIdea: "Partial measurement of a different qubit sums over a different subset of basis terms, generally giving a different probability than measuring qubit 0 did.",
    whyCorrect: "Only |00⟩ has qubit 1 = 0 in this state, so P(qubit 1=0) is that one term's probability, 1/4, unlike the worked example's P(qubit 0=0)=1.",
    whyWrong: [
      "Reusing the worked example's P(qubit 0=0)=1 for this different question conflates measuring qubit 0 with measuring qubit 1. They are not the same calculation.",
      "Assuming symmetry between the two qubits ignores that this particular state isn't symmetric under swapping which qubit is which.",
    ],
  },
};
