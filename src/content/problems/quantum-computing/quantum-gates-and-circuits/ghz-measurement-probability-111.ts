import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, applyCNOT, HADAMARD } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

const ghzStep0 = StateVector.zero(3);
const ghzStep1 = applySingleQubitGate(ghzStep0, HADAMARD, 0);
const ghzStep2 = applyCNOT(ghzStep1, 0, 1);
const ghzStep3 = applyCNOT(ghzStep2, 0, 2);
const probabilityOf111 = ghzStep3.probabilities()[7];

export const ghzMeasurementProbability111: NumericProblem = {
  meta: {
    slug: "ghz-measurement-probability-111",
    title: "P(111) for the GHZ State",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["ghz", "measurement", "multi-qubit"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/building-quantum-circuits"],
  },
  question: {
    type: "numeric",
    prompt:
      "The GHZ state built in this lesson is $\\frac{1}{\\sqrt2}(|000\\rangle+|111\\rangle)$. What is the probability of measuring all three qubits and getting outcome \"111\"?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: probabilityOf111,
    tolerance: 0.01,
    incorrectFeedback: "Apply the Born rule directly to the $|111\\rangle$ term's amplitude in the GHZ state.",
    nearMisses: [
      { value: 0.125, feedback: "1/8 spreads probability over all eight three-qubit outcomes. Six of them have zero amplitude in the GHZ state, so only two share the total." },
      { value: Math.SQRT1_2, tolerance: 0.01, feedback: "1/√2 is the amplitude on |111⟩. Squaring it gives the probability." },
    ],
  },
  hints: [
    { text: "The GHZ state has exactly two nonzero terms: $|000\\rangle$ and $|111\\rangle$, each with amplitude $\\frac{1}{\\sqrt2}$." },
    { text: "The Born rule says $P(\\text{outcome}) = |\\text{amplitude}|^2$." },
  ],
  solution: {
    steps: [
      { description: "The $|111\\rangle$ term's amplitude is $\\frac{1}{\\sqrt2}$." },
      { description: "Apply the Born rule.", latex: `P(111) = \\left|\\frac{1}{\\sqrt2}\\right|^2 = ${probabilityOf111.toFixed(2)}` },
    ],
    finalAnswer: `$P(111) = ${probabilityOf111.toFixed(2)}$`,
  },
  explanation: {
    correctIdea: "The GHZ state splits probability evenly between exactly two outcomes, $|000\\rangle$ and $|111\\rangle$, with zero probability everywhere else.",
    whyCorrect: "Only two of the eight possible 3-qubit outcomes have nonzero amplitude in this state, and by normalization they must split the total probability of 1 evenly (equal magnitude amplitudes).",
  },
};
