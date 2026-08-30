import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import type { NumericProblem } from "@/lib/problems/types";

const state = new StateVector([new Complex(0.28), new Complex(0, 0.96)]);
const probabilityOfOne = state.probabilities()[1];

export const biasedQubitP1: NumericProblem = {
  meta: {
    slug: "biased-qubit-p1",
    title: "A Biased Qubit's Measurement Probability",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/what-is-a-qubit",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["born-rule", "measurement", "normalization"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/what-is-a-qubit"],
  },
  question: {
    type: "numeric",
    prompt:
      "A qubit is in the state $|\\psi\\rangle = 0.28|0\\rangle + 0.96i|1\\rangle$ (normalized: $0.28^2 + 0.96^2 = 1$). What is the probability of measuring 1?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: probabilityOfOne,
    tolerance: 0.01,
    incorrectFeedback: "The imaginary unit on the |1⟩ amplitude does not change the probability calculation: |0.96i|² is 0.96².",
    nearMisses: [
      { value: 0.0784, feedback: "0.0784 is P(0), from the amplitude on |0⟩. The question asks for the |1⟩ outcome." },
      { value: 0.96, feedback: "0.96 is |β|, the amplitude's magnitude. The Born rule squares it." },
      { value: -0.9216, feedback: "A probability cannot be negative. Squaring a complex amplitude means multiplying by its conjugate, so (0.96i)(0.96i)* = +0.9216." },
    ],
  },
  hints: [
    { text: "The Born rule says P(1) = |β|², where β is the amplitude on |1⟩." },
    { text: "Here β = 0.96i. Multiplying by i rotates a complex number in the plane without stretching it, so |0.96i| = 0.96." },
    { text: "Square that modulus, then check your answer against normalization: P(0) + P(1) must come to 1." },
  ],
  solution: {
    steps: [
      { description: "Identify the amplitude on $|1\\rangle$: $\\beta = 0.96i$." },
      { description: "Its modulus is $|\\beta| = |0.96i| = 0.96$, since multiplying by $i$ rotates a complex number without changing its length." },
      { description: "Apply the Born rule.", latex: "P(1) = |\\beta|^2 = 0.96^2 = 0.9216" },
    ],
    finalAnswer: "$P(1) = 0.9216$",
  },
  explanation: {
    correctIdea: "Squaring a complex amplitude means multiplying by its own conjugate, which discards phase entirely. Only the modulus matters for a probability.",
    whyCorrect: "|0.96i|² = (0.96i)(0.96i)* = (0.96i)(-0.96i) = 0.9216, the same result you'd get from ignoring the i and squaring 0.96 directly. It also checks out against normalization: P(0) + P(1) = 0.0784 + 0.9216 = 1.",
    whyWrong: [
      "Squaring 0.96i without conjugating (treating it as an ordinary real square) would incorrectly give -0.9216, a negative number that can't be a probability at all.",
      "Using 0.28, the amplitude on |0⟩, answers a different question: it gives P(0), not P(1).",
    ],
  },
};
