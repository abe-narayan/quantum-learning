import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import type { NumericProblem } from "@/lib/problems/types";

const plusState = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
const probabilityOfOne = plusState.probabilities()[1];

export const plusStateMeasurementProbability: NumericProblem = {
  meta: {
    slug: "plus-state-measurement-probability",
    title: "Measuring the |+⟩ State",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/what-is-a-qubit",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["born-rule", "measurement", "superposition"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/what-is-a-qubit"],
  },
  question: {
    type: "numeric",
    prompt:
      "A qubit is in the state $|\\psi\\rangle = \\frac{1}{\\sqrt2}|0\\rangle + \\frac{1}{\\sqrt2}|1\\rangle$. What is the probability of measuring $|1\\rangle$?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: probabilityOfOne,
    tolerance: 0.01,
    incorrectFeedback: "Not quite. Remember that probabilities come from |amplitude|², not the amplitude itself.",
    nearMisses: [
      { value: Math.SQRT1_2, tolerance: 0.01, feedback: "0.707 is the amplitude 1/√2 itself. The Born rule squares it, and squaring 1/√2 gives 1/2." },
      { value: 1, feedback: "Certainty would mean the state is |1⟩. Here half the amplitude sits on |0⟩, so the outcome is uncertain." },
    ],
  },
  hints: [
    { text: "Start by identifying the amplitude on the |1⟩ term." },
    { text: "The Born rule says P(1) = |β|², where β is that amplitude." },
    { text: "Here β = 1/√2. Square its magnitude, and check the two outcome probabilities sum to 1." },
  ],
  solution: {
    steps: [
      { description: "Identify the amplitude on $|1\\rangle$: $\\beta = \\frac{1}{\\sqrt2}$." },
      { description: "Apply the Born rule.", latex: "P(1) = |\\beta|^2" },
      { description: "Square the amplitude.", latex: "P(1) = \\left(\\frac{1}{\\sqrt2}\\right)^2 = \\frac12" },
    ],
    finalAnswer: "$P(1) = 0.5$",
  },
  explanation: {
    correctIdea: "Measurement probabilities come from the squared magnitude of the amplitude, not the amplitude itself.",
    whyCorrect: "The Born rule is a postulate of quantum mechanics: P(outcome) = |amplitude of that outcome|².",
    whyWrong: [
      "Using the amplitude directly (1/√2 ≈ 0.71) skips the squaring step the Born rule requires.",
      "Assuming a 'plus' state is somehow special and always gives probability 1 confuses the state's name with its measurement statistics.",
    ],
  },
};
