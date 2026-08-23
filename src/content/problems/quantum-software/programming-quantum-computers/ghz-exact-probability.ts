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
    prompt: "Running .h(0).cnot(0,1).cnot(1,2) from |000⟩, what is the EXACT probability of measuring |000⟩?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "The GHZ state is (|000⟩+|111⟩)/√2 — what's the probability of each term?",
  },
  hints: [
    { text: "The GHZ state is an equal superposition of |000⟩ and |111⟩ only." },
    { text: "Each term has amplitude 1/√2." },
    { text: "Probability = |1/√2|² = 0.5." },
  ],
  solution: {
    steps: [{ description: "|000⟩'s amplitude is 1/√2, so P(|000⟩)=0.5 exactly." }],
    finalAnswer: "0.5",
  },
  explanation: {
    correctIdea: "This is the EXACT result from runCircuit, distinct from the SAMPLED counts sampleMeasurements would produce with statistical noise around this exact value.",
    whyCorrect: "Matches this platform's own test-suite-confirmed GHZ state probabilities.",
    whyWrong: ["Answering anything other than exactly 0.5 confuses the exact simulation result with a sampled (noisy) result."],
  },
};
