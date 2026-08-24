import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, applyCNOT, HADAMARD, PAULI_X } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

const bellPair = applyCNOT(applySingleQubitGate(StateVector.zero(2), HADAMARD, 0), 0, 1);
const encoded01 = applySingleQubitGate(bellPair, PAULI_X, 0);
const decoded01 = applySingleQubitGate(applyCNOT(encoded01, 0, 1), HADAMARD, 0);
const probabilityOf01 = decoded01.probabilities()[1]; // index 1 = |01>

export const superdense01MessageDecodeProbability: NumericProblem = {
  meta: {
    slug: "superdense-01-message-decode-probability",
    title: "Verifying the 01 Row of Superdense Coding",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/superdense-coding",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["superdense-coding", "bell-states", "measurement"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/superdense-coding"],
  },
  question: {
    type: "numeric",
    prompt:
      "Alice wants to send message $01$: she applies $X$ to her half of the shared Bell pair $|\\Phi^+\\rangle$, sends it to Bob, and Bob runs his decode circuit ($\\text{CNOT}(0,1)$ then $H$ on qubit 0). What is Bob's probability of measuring the joint outcome $|01\\rangle$?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: probabilityOf01,
    tolerance: 0.01,
    incorrectFeedback:
      "Run the same three steps as the lesson's $11$-row worked example, but with $X$ alone (not $Z$ then $X$): Bell pair, apply $X$ to qubit 0, then Bob's decode circuit.",
  },
  hints: [
    { text: "Apply $X$ to qubit 0 of $|\\Phi^+\\rangle=\\frac{1}{\\sqrt2}(|00\\rangle+|11\\rangle)$: this gives $\\frac{1}{\\sqrt2}(|10\\rangle+|01\\rangle)=|\\Psi^+\\rangle$." },
    { text: "Bob's decode circuit is $\\text{CNOT}(0,1)$ then $H$ on qubit 0 — the exact inverse of the circuit that built the Bell pair." },
    { text: "This should recover $|01\\rangle$ with certainty, exactly like the lesson's $11$-row worked example recovered $|11\\rangle$." },
  ],
  solution: {
    steps: [
      { description: "Shared pair: $|\\Phi^+\\rangle=\\frac{1}{\\sqrt2}(|00\\rangle+|11\\rangle)$." },
      { description: "Alice applies $X$ to qubit 0 (encoding message $01$).", latex: "X\\otimes I\\,|\\Phi^+\\rangle = \\frac{1}{\\sqrt2}(|10\\rangle+|01\\rangle) = |\\Psi^+\\rangle" },
      { description: "Bob applies $\\text{CNOT}(0,1)$ then $H$ on qubit 0.", latex: `P(01) = ${probabilityOf01.toFixed(2)}` },
    ],
    finalAnswer: `$P(01) = ${probabilityOf01.toFixed(2)}$ — Bob recovers message $01$ with certainty.`,
  },
  explanation: {
    correctIdea: "Bob's decode circuit exactly inverts the Bell-pair-preparation circuit, so every one of Alice's four possible messages decodes to the matching computational basis state with certainty.",
    whyCorrect: "This independently confirms, via the real engine rather than the lesson's own displayed numbers, the $01$ row of the message table.",
    whyWrong: ["A probability less than 1 would indicate a circuit-order or gate mistake — this protocol recovers every message with exact certainty, not merely high probability."],
  },
};
