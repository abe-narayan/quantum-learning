import { QuantumCircuit, runCircuit } from "@/lib/quantum/circuitBuilder";
import type { NumericProblem } from "@/lib/problems/types";

const circuit = new QuantumCircuit(3);
circuit.h(0).cnot(0, 1).cnot(1, 2);
const state = runCircuit(circuit);
const value = state.probabilities()[0];

export const ghzExactProbability: NumericProblem = {
  meta: {
    slug: "ghz-exact-probability",
    title: "Exact P(|000⟩) for the GHZ Circuit",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/writing-your-first-circuit",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["ghz", "circuits"],
    prerequisites: ["quantum-software/programming-quantum-computers/writing-your-first-circuit"],
  },
  question: {
    type: "numeric",
    prompt: "Running .h(0).cnot(0,1).cnot(1,2) from |000⟩, what is the exact probability of measuring |000⟩?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "The GHZ state is an equal superposition of just two terms. Square the amplitude of the all-zeros term; if you answered a smaller fraction, you may have spread the probability across all eight basis states.",
    nearMisses: [
      { value: 0.125, feedback: "1/8 spreads probability over all eight three-qubit outcomes. Six of them have zero amplitude in the GHZ state." },
      { value: Math.SQRT1_2, tolerance: 0.005, feedback: "1/√2 is the amplitude. Squaring it gives the probability." },
    ],
  },
  hints: [
    { text: "The GHZ state is an equal superposition of |000⟩ and |111⟩ only." },
    { text: "Each term has amplitude 1/√2." },
    { text: "Square the magnitude of the all-zeros amplitude. Only two terms share the total probability, and they share it equally." },
  ],
  solution: {
    steps: [{ description: "|000⟩'s amplitude is 1/√2, so P(|000⟩)=0.5 exactly." }],
    finalAnswer: "0.5",
  },
  explanation: {
    correctIdea: "This is the exact result from runCircuit, distinct from the sampled counts sampleMeasurements would produce with statistical noise around this exact value.",
    whyCorrect: "The Hadamard splits the amplitude evenly, and the two CNOTs copy that choice onto the other wires without changing its size. |000⟩ keeps amplitude 1/√2, so its probability is exactly one half, with the other half sitting on |111⟩.",
    whyWrong: ["Answering anything other than exactly 0.5 confuses the exact simulation result with a sampled (noisy) result."],
  },
};
