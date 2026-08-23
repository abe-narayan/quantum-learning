import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, applyCNOT, HADAMARD, PAULI_X, PAULI_Z } from "@/lib/quantum/gates";
import { measureQubit, qubitMeasurementProbabilities } from "@/lib/quantum/measurement";
import type { NumericProblem } from "@/lib/problems/types";

// Reruns exactly the lesson's own derivation (same message state, same
// forced-outcome-1,1 branch) so the answer is independently engine-computed,
// not copied from the lesson's displayed numbers.
const messageState = new StateVector([new Complex(0.6), new Complex(0, 0.8)]);
const bellPair = applyCNOT(applySingleQubitGate(StateVector.zero(2), HADAMARD, 0), 0, 1);
const initial = messageState.tensor(bellPair);
const afterEntangle = applyCNOT(initial, 0, 1);
const afterHadamard = applySingleQubitGate(afterEntangle, HADAMARD, 0);
const firstMeasurement = measureQubit(afterHadamard, 0, 0.9);
const secondMeasurement = measureQubit(firstMeasurement.collapsed, 1, 0.9);
const bobAfterX = applySingleQubitGate(secondMeasurement.collapsed, PAULI_X, 2);
const bobFinal = applySingleQubitGate(bobAfterX, PAULI_Z, 2);

const bobP1 = qubitMeasurementProbabilities(bobFinal, 2)[1];
const messageP1 = messageState.probabilities()[1];

export const teleportationFinalPopulationMatchesMessage: NumericProblem = {
  meta: {
    slug: "teleportation-final-population-matches-message",
    title: "Checking Bob's Corrected Qubit Against the Original Message",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/quantum-teleportation",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["teleportation", "measurement", "verification"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/quantum-teleportation"],
  },
  question: {
    type: "numeric",
    prompt:
      "The message state in this lesson is $|\\psi\\rangle=0.6|0\\rangle+0.8i|1\\rangle$, so $P(1)=0.64$ for a direct measurement of it. After the full teleportation protocol completes (Alice's outcomes both 1, Bob applies $X$ then $Z$), what is $P(1)$ for measuring Bob's corrected qubit?",
    inputHint: "as a decimal between 0 and 1 — predict it before computing, then check",
  },
  answer: {
    type: "numeric",
    value: bobP1,
    tolerance: 0.01,
    incorrectFeedback:
      "The whole point of the correction table is that Bob's qubit, after the right correction, is exactly $|\\psi\\rangle$ again — its measurement statistics should match the original message state exactly.",
  },
  hints: [
    { text: "You don't need to redo the full derivation — the lesson already states the correction recovers $|\\psi\\rangle$ exactly for this branch." },
    { text: "If Bob's corrected qubit really equals $|\\psi\\rangle$, its measurement probabilities must equal $|\\psi\\rangle$'s own measurement probabilities exactly." },
    { text: "$P(1)$ for $|\\psi\\rangle=0.6|0\\rangle+0.8i|1\\rangle$ is $|0.8i|^2$." },
  ],
  solution: {
    steps: [
      { description: "The lesson derives that, for outcomes (1,1), Bob's corrected qubit equals the original message state exactly: $XZ$ applied to his branch recovers $|\\psi\\rangle$." },
      { description: "Therefore Bob's qubit's measurement statistics must equal the message state's own.", latex: `P(1)_{\\text{message}} = |0.8i|^2 = ${messageP1.toFixed(2)}` },
      { description: "Directly computing $P(1)$ from Bob's fully-corrected 3-qubit state (marginalizing over his qubit alone) confirms this exactly.", latex: `P(1)_{\\text{Bob}} = ${bobP1.toFixed(4)}` },
    ],
    finalAnswer: `$P(1) = ${bobP1.toFixed(2)}$, matching the original message state exactly.`,
  },
  explanation: {
    correctIdea: "Teleportation reproduces the original state exactly (not approximately) once the right correction is applied, so every measurement statistic of Bob's final qubit matches the original message state's.",
    whyCorrect: "This is a direct, engine-computed confirmation of the claim the lesson makes in prose: the correction table's entries are exact identities, not approximations.",
    whyWrong: [
      "A qubit that only approximately matches the message (e.g. giving $P(1)$ close to but not exactly 0.64) would indicate a mistake somewhere in the correction, not the expected outcome of a correctly-run protocol.",
    ],
  },
};
