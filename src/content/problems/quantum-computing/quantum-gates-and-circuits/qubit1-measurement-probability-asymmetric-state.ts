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
      "For the state $\\frac{1}{2}|00\\rangle + \\frac{\\sqrt3}{2}|01\\rangle$ (the same one from this lesson's worked example), find $P(\\text{qubit }1{=}0)$ — this time measuring qubit 1 instead of qubit 0.",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: probabilityQubit1IsZero,
    tolerance: 0.01,
    incorrectFeedback: "Check qubit 1's bit (not qubit 0's) in each basis term, and sum |amplitude|² over only the terms where that bit is 0.",
  },
  hints: [
    { text: "Qubit 1 is the second (rightmost) label in each ket." },
    { text: "In |00⟩, qubit 1 = 0. In |01⟩, qubit 1 = 1 — only one of the two terms has qubit 1 = 0." },
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
    whyCorrect: "Only |00⟩ has qubit 1 = 0 in this state, so P(qubit 1=0) is just that one term's probability, 1/4 — different from the worked example's P(qubit 0=0)=1.",
    whyWrong: [
      "Reusing the worked example's P(qubit 0=0)=1 for this different question conflates measuring qubit 0 with measuring qubit 1 — they're generally not the same calculation.",
      "Assuming symmetry between the two qubits ignores that this particular state isn't symmetric under swapping which qubit is which.",
    ],
  },
};
