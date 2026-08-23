import { StateVector } from "@/lib/quantum/state";
import { HADAMARD, applySingleQubitGate, applyCNOT } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

const bellState = applyCNOT(applySingleQubitGate(StateVector.zero(2), HADAMARD, 0), 0, 1);
const probabilityOf11 = bellState.probabilities()[bellState.amplitudes.length - 1];

export const bellStateOutcomeProbability: NumericProblem = {
  meta: {
    slug: "bell-state-outcome-probability",
    title: "Measurement Probability in a Bell State",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/multi-qubit-measurement",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["born-rule", "measurement", "entanglement", "bell-states"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"],
  },
  question: {
    type: "numeric",
    prompt:
      "The Bell state $|\\Phi^+\\rangle = \\frac{1}{\\sqrt2}(|00\\rangle + |11\\rangle)$ is measured in the computational basis. What is the probability of observing $|11\\rangle$?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: probabilityOf11,
    tolerance: 0.01,
    incorrectFeedback:
      "Only basis terms with nonzero amplitude in the state can be measured — check the amplitude on |11⟩ specifically.",
  },
  hints: [
    { text: "Which basis terms appear in |Φ+⟩ with nonzero amplitude?" },
    { text: "The amplitude on |11⟩ is 1/√2 — the same as on |00⟩." },
    { text: "Apply the Born rule to that amplitude: P = |amplitude|²." },
  ],
  solution: {
    steps: [
      { description: "Identify the amplitude on $|11\\rangle$ in $|\\Phi^+\\rangle$.", latex: "c_{11} = \\frac{1}{\\sqrt2}" },
      {
        description: "Apply the Born rule.",
        latex: "P(11) = |c_{11}|^2 = \\left(\\frac{1}{\\sqrt2}\\right)^2",
      },
    ],
    finalAnswer: "$P(11) = 0.5$",
  },
  explanation: {
    correctIdea: "Only the |00⟩ and |11⟩ terms have nonzero amplitude in |Φ+⟩, and they're equal in magnitude.",
    whyCorrect:
      "The Born rule applies to a multi-qubit state exactly the way it does to a single qubit — square the amplitude of the outcome in question.",
    whyWrong: [
      "Assuming all four two-qubit outcomes (00, 01, 10, 11) are equally likely (25% each) ignores that |01⟩ and |10⟩ have zero amplitude in this particular state.",
    ],
  },
};
