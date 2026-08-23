import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import type { NumericProblem } from "@/lib/problems/types";

const state = new StateVector([new Complex(0.6), new Complex(0, 0.8)]);
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
      "A qubit is in the state $|\\psi\\rangle = 0.6|0\\rangle + 0.8i|1\\rangle$. What is the probability of measuring 1?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: probabilityOfOne,
    tolerance: 0.01,
    incorrectFeedback: "The imaginary unit on the |1⟩ amplitude doesn't change the probability calculation — |0.8i|² is still just 0.8².",
  },
  hints: [
    { text: "The Born rule says P(1) = |β|², where β is the amplitude on |1⟩." },
    { text: "Here β = 0.8i. Its magnitude is |0.8i| = 0.8 — the imaginary unit doesn't add extra length." },
    { text: "Square 0.8." },
  ],
  solution: {
    steps: [
      { description: "Identify the amplitude on $|1\\rangle$: $\\beta = 0.8i$." },
      { description: "Its modulus is $|\\beta| = |0.8i| = 0.8$ — multiplying by $i$ rotates a complex number but doesn't change its length." },
      { description: "Apply the Born rule.", latex: "P(1) = |\\beta|^2 = 0.8^2 = 0.64" },
    ],
    finalAnswer: "$P(1) = 0.64$",
  },
  explanation: {
    correctIdea: "Squaring a complex amplitude means multiplying by its own conjugate, which discards phase entirely — only the modulus matters for a probability.",
    whyCorrect: "|0.8i|² = (0.8i)(0.8i)* = (0.8i)(-0.8i) = 0.64, the same result you'd get from ignoring the i and squaring 0.8 directly.",
    whyWrong: [
      "Squaring 0.8i without conjugating (treating it as an ordinary real square) would incorrectly give -0.64, a negative number that can't be a probability at all.",
      "Using 0.6 (the amplitude on |0⟩) instead of 0.8 answers a different question — P(0), not P(1).",
    ],
  },
};
