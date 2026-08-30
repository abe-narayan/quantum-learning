import { PAULI_X } from "@/lib/quantum/gates";
import { exactGroundStateEnergy } from "@/lib/quantum/vqe";
import type { NumericProblem } from "@/lib/problems/types";

const value = exactGroundStateEnergy(PAULI_X);

export const groundEnergyOfPauliX: NumericProblem = {
  meta: {
    slug: "ground-energy-of-pauli-x",
    title: "Ground State Energy of H=X",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["vqe", "variational-principle"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits"],
  },
  question: {
    type: "numeric",
    prompt: "What is the ground state energy E₀ of the Hamiltonian H=X?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Since X² = I, X's eigenvalues are the two square roots of 1. Which of the two is the ground energy?",
    nearMisses: [
      { value: 1, feedback: "+1 is X's other eigenvalue, the highest energy. The ground state is the minimum, so take the other one." },
      { value: 0, feedback: "0 is ⟨X⟩ in the |0⟩ or |1⟩ state, not an eigenvalue of X. X² = I forces its eigenvalues to be ±1." },
    ],
  },
  hints: [
    { text: "X's eigenstates are |+⟩ and |−⟩." },
    { text: "X|+⟩=+|+⟩ and X|−⟩=−|−⟩." },
    { text: "The ground energy is the smaller of the two eigenvalues." },
  ],
  solution: {
    steps: [{ description: "X's eigenvalues are +1 and −1; the ground energy is the smaller one, −1." }],
    finalAnswer: "E₀ = −1",
  },
  explanation: {
    correctIdea: "Every Pauli matrix has eigenvalues ±1, so its ground energy is always −1.",
    whyCorrect: "Matches exactGroundStateEnergy's direct output for H=X.",
    whyWrong: ["Answering +1 gives the highest energy rather than the lowest. The ground state corresponds to the minimum eigenvalue."],
  },
};
