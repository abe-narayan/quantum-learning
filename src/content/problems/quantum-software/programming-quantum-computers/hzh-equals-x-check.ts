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
    incorrectFeedback: "If you answered 0.5, you probably reasoned from the first H alone; the second H undoes that basis change. If you answered 0, you may be thinking of the HH = I identity instead. Reduce the three gates to a single equivalent gate first, then apply it to |0⟩.",
    nearMisses: [
      { value: 0.5, feedback: "0.5 is where the first H leaves the state. The Z and the second H are what turn that superposition back into a definite outcome." },
      { value: 0, feedback: "0 is the HH = I result, with no Z in between. Inserting Z between the two Hadamards makes the circuit an X gate instead." },
    ],
  },
  hints: [
    { text: "Three gates in sequence. Rather than multiplying matrices entry by entry, ask whether this particular sandwich of gates is one of the standard conjugation identities." },
    { text: "Conjugating Z by H changes basis: HZH = X. The whole circuit therefore acts on |0⟩ as a single X gate." },
    { text: "Work out what X does to the start state, then read off the probability of the flipped outcome from the resulting state." },
  ],
  solution: {
    steps: [
      { description: "HZH = X, a standard conjugation identity." },
      { description: "X|0⟩ = |1⟩, so the final state is |1⟩ and P(|1⟩) = 1." },
    ],
    finalAnswer: "1.0",
  },
  explanation: {
    correctIdea: "This confirms the circuit-as-data representation reproduces a known matrix identity exactly, since runCircuit just dispatches to the same gate functions in sequence.",
    whyCorrect: "Conjugating Z by Hadamards rotates the axis of rotation: HZH = X. Starting from |0⟩ the circuit therefore ends on |1⟩ with certainty, which is why the measured probability is exactly 1 rather than merely close to it.",
    whyWrong: ["Answering 0 would suggest confusing this with HH=I (which would leave |0⟩ unchanged) rather than HZH=X."],
  },
};
