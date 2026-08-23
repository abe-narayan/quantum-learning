import { QuantumCircuit, runCircuit } from "@/lib/quantum/circuitBuilder";
import { PAULI_Z } from "@/lib/quantum/gates";
import { exactGroundStateEnergy } from "@/lib/quantum/vqe";
import type { NumericProblem } from "@/lib/problems/types";

function expectationZ(theta: number): number {
  const circuit = new QuantumCircuit(1);
  circuit.ry(0, theta);
  const state = runCircuit(circuit);
  const probs = state.probabilities();
  return probs[0] - probs[1];
}

let bestVal = Infinity;
const steps = 2000;
for (let i = 0; i <= steps; i++) {
  const theta = (i / steps) * 2 * Math.PI;
  const val = expectationZ(theta);
  if (val < bestVal) bestVal = val;
}

const value = bestVal;
const exact = exactGroundStateEnergy(PAULI_Z);
if (Math.abs(value - exact) > 1e-6) {
  throw new Error(`circuit-vqe-matches-exact: expected grid search to match exact ground energy, got ${value} vs ${exact}`);
}

export const circuitVqeMatchesExact: NumericProblem = {
  meta: {
    slug: "circuit-vqe-matches-exact",
    title: "Grid-Search VQE Result for H=Z",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["variational-algorithms"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation"],
  },
  question: {
    type: "numeric",
    prompt: "Grid-searching θ for circuit.ry(0,θ)'s ⟨Z⟩ expectation value, what minimum value does the search find?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "The ground state of H=Z is |1⟩, with ⟨Z⟩=-1. The Ry ansatz can reach |1⟩ exactly at θ=π.",
  },
  hints: [
    { text: "H=Z's ground state is |1⟩, giving ⟨Z⟩=-1." },
    { text: "circuit.ry(0,π) applied to |0⟩ gives exactly |1⟩ (up to sign)." },
    { text: "So the grid search should find exactly -1." },
  ],
  solution: {
    steps: [{ description: "The grid search finds θ=π, giving ⟨Z⟩=-1 exactly, matching exactGroundStateEnergy(Z)=-1." }],
    finalAnswer: "-1",
  },
  explanation: {
    correctIdea: "This confirms the QuantumCircuit-based implementation reproduces Quantum Algorithms II's matrix-based ground energy exactly, not approximately.",
    whyCorrect: "Matches this platform's own verified grid-search result, cross-checked against exactGroundStateEnergy.",
    whyWrong: ["Any value other than exactly -1 would indicate either a search-resolution issue or a genuine implementation bug — this platform's own build-time check confirms this doesn't happen."],
  },
};
