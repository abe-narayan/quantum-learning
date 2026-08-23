import { QuantumCircuit, runCircuit } from "@/lib/quantum/circuitBuilder";
import type { NumericProblem } from "@/lib/problems/types";

const circuit = new QuantumCircuit(1);
circuit.h(0).z(0).h(0);
const state = runCircuit(circuit);
const value = state.probabilities()[1];

export const hzhEqualsXCheck: NumericProblem = {
  meta: {
    slug: "hzh-equals-x-check",
    title: "Running H-Z-H on |0⟩",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/circuit-representation-in-code",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["circuit-representation"],
    prerequisites: ["quantum-software/programming-quantum-computers/circuit-representation-in-code"],
  },
  question: {
    type: "numeric",
    prompt: "Building a circuit with .h(0).z(0).h(0) and running it from |0⟩, what is P(measuring |1⟩)?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "H, Z, H composed together equal the X gate exactly (a standard gate identity) — what does X do to |0⟩?",
  },
  hints: [
    { text: "HZH is a known identity, equal to the X gate." },
    { text: "X flips |0⟩ to |1⟩ exactly." },
    { text: "So P(measuring |1⟩) should be exactly 1." },
  ],
  solution: {
    steps: [{ description: "HZH=X, and X|0⟩=|1⟩, so P(|1⟩)=1 exactly." }],
    finalAnswer: "1.0",
  },
  explanation: {
    correctIdea: "This confirms the circuit-as-data representation reproduces a known matrix identity exactly, since runCircuit just dispatches to the same gate functions in sequence.",
    whyCorrect: "Matches this platform's own circuitBuilder test suite result.",
    whyWrong: ["Answering 0 would suggest confusing this with HH=I (which WOULD leave |0⟩ unchanged) rather than HZH=X."],
  },
};
