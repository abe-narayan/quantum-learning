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
    incorrectFeedback: "Think about the range of ⟨Z⟩: it runs between the two eigenvalues of Z, and the Ry ansatz sweeps that full range. If your value sits above the bottom of the range, either the search resolution or a sign convention slipped.",
    nearMisses: [
      { value: 1, feedback: "+1 is the maximum of ⟨Z⟩, reached at θ=0. The search minimizes, so it runs the other way." },
      { value: 0, feedback: "0 is ⟨Z⟩ at θ=π/2, on the equator. The Ry ansatz can go all the way to the south pole, where ⟨Z⟩ reaches its lowest eigenvalue." },
    ],
  },
  hints: [
    { text: "A variational search can at best match the true minimum. So first ask what the exact ground-state energy of H = Z is, and which basis state achieves it." },
    { text: "The ground state of Z is the excited computational basis state, and an Ry rotation by π maps the start state onto it exactly. The ansatz can therefore reach the true minimum." },
    { text: "So the grid search attains the exact ground-state energy of Z. Read that eigenvalue off the operator itself." },
  ],
  solution: {
    steps: [{ description: "The grid search finds θ=π, giving ⟨Z⟩=-1 exactly, matching exactGroundStateEnergy(Z)=-1." }],
    finalAnswer: "-1",
  },
  explanation: {
    correctIdea: "This confirms the QuantumCircuit-based implementation reproduces Quantum Algorithms II's matrix-based ground energy exactly, not approximately.",
    whyCorrect: "Ry(θ) sweeps the state around the Y axis, so ⟨Z⟩ traces cos θ and bottoms out at −1 when θ = π. The check is that a grid search over the circuit and exactGroundStateEnergy on the matrix arrive at the same −1 by unrelated routes.",
    whyWrong: ["Any value other than exactly -1 would indicate either a search-resolution issue or a genuine implementation bug; the build-time check confirms this doesn't happen."],
  },
};
