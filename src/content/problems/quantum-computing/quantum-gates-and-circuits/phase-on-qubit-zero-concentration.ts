import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, HADAMARD, PAULI_Z } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

// The lesson's Worked Example claims this gives exactly |10>; verify it
// independently through the actual engine rather than trusting the prose.
const start = StateVector.zero(2);
const afterFirstH = applySingleQubitGate(applySingleQubitGate(start, HADAMARD, 0), HADAMARD, 1);
const afterPhase = applySingleQubitGate(afterFirstH, PAULI_Z, 0);
const afterSecondH = applySingleQubitGate(applySingleQubitGate(afterPhase, HADAMARD, 0), HADAMARD, 1);
const probabilityOf10 = afterSecondH.probabilities()[2];

export const phaseOnQubitZeroConcentration: NumericProblem = {
  meta: {
    slug: "phase-on-qubit-zero-concentration",
    title: "Moving the Phase Gate to Qubit 0",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["interference", "phase", "hadamard"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits"],
  },
  question: {
    type: "numeric",
    prompt:
      "Starting from $|00\\rangle$: apply $H\\otimes H$, then $Z$ on qubit 0 (instead of qubit 1), then $H\\otimes H$ again. What is $P(|10\\rangle)$ for the resulting state?",
    inputHint: "as a decimal between 0 and 1 — predict using the lesson's Worked Example before computing",
  },
  answer: {
    type: "numeric",
    value: probabilityOf10,
    tolerance: 0.01,
    incorrectFeedback:
      "Track each qubit independently: this whole circuit stays a product state, so you can apply the single-qubit facts $H|+\\rangle=|0\\rangle$ and $H|-\\rangle=|1\\rangle$ to each factor separately.",
  },
  hints: [
    { text: "$H\\otimes H$ on $|00\\rangle$ gives $|+\\rangle\\otimes|+\\rangle$." },
    { text: "$Z$ on qubit 0 turns its $|+\\rangle$ factor into $|-\\rangle$, leaving qubit 1's factor untouched." },
    { text: "The second $H\\otimes H$ gives $H|-\\rangle\\otimes H|+\\rangle = |1\\rangle\\otimes|0\\rangle = |10\\rangle$, with certainty." },
  ],
  solution: {
    steps: [
      { description: "After the first $H\\otimes H$: $|+\\rangle\\otimes|+\\rangle$." },
      { description: "$Z$ on qubit 0 only: $|-\\rangle\\otimes|+\\rangle$." },
      { description: "Second $H\\otimes H$: $H|-\\rangle\\otimes H|+\\rangle = |1\\rangle\\otimes|0\\rangle = |10\\rangle$.", latex: `P(10) = ${probabilityOf10.toFixed(3)}` },
    ],
    finalAnswer: `$P(10) = ${probabilityOf10.toFixed(2)}$ — certainty, on the outcome $|10\\rangle$ instead of $|01\\rangle$.`,
  },
  explanation: {
    correctIdea: "Moving the phase gate to the other qubit moves which outcome the circuit concentrates onto, but doesn't change that it concentrates with certainty.",
    whyCorrect: "The mechanism (constructive interference on one outcome, destructive on the rest) is symmetric between the two qubits; only the label of the surviving outcome changes.",
  },
};
