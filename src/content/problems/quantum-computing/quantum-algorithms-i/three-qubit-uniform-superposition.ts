import { StateVector } from "@/lib/quantum/state";
import { HADAMARD, applySingleQubitGate } from "@/lib/quantum/gates";
import type { NumericProblem } from "@/lib/problems/types";

let s = StateVector.zero(3);
for (let q = 0; q < 3; q++) s = applySingleQubitGate(s, HADAMARD, q);
const value = s.probabilities()[5];

export const threeQubitUniformSuperposition: NumericProblem = {
  meta: {
    slug: "three-qubit-uniform-superposition",
    title: "Probability of One Outcome in H^⊗3|000⟩",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["quantum-parallelism", "hadamard"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model"],
  },
  question: {
    type: "numeric",
    prompt: "After applying H to each of 3 qubits starting from |000⟩, what is the probability of measuring any one specific 3-bit outcome (e.g. |101⟩)?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.005,
    incorrectFeedback: "H^⊗3|000⟩ is a uniform superposition over all 8 three-bit strings — each equally likely.",
    nearMisses: [
      { value: 1 / 3, tolerance: 0.005, feedback: "1/3 counts qubits rather than outcomes. Three qubits give 2³ = 8 distinct bit strings, and the superposition is uniform over all of them." },
      { value: Math.SQRT1_2 / 2, tolerance: 0.005, feedback: "That is 1/√8, the amplitude. The probability is its square." },
      { value: 0.5, feedback: "0.5 is the probability for a single qubit. Each additional qubit halves the share of any one full outcome." },
    ],
  },
  hints: [
    { text: "H^⊗3|000⟩ = (1/√8)Σₓ|x⟩ — 8 equally-weighted basis states." },
    { text: "Each amplitude has magnitude 1/√8." },
    { text: "Probability is the squared magnitude: (1/√8)² = 1/8." },
  ],
  solution: {
    steps: [{ description: "Each of the 8 basis states has amplitude 1/√8, so probability (1/√8)² = 1/8 = 0.125." }],
    finalAnswer: "P = 0.125",
  },
  explanation: {
    correctIdea: "H^⊗n|0...0⟩ is exactly uniform over all 2ⁿ basis states.",
    whyCorrect: "1/8 matches 1/2³, consistent with 3 independent 50/50 Hadamards.",
    whyWrong: ["Answering 1/3 confuses 'number of qubits' with 'number of outcomes' — there are 2³=8 outcomes, not 3."],
  },
};
