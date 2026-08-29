import { Complex } from "@/lib/quantum/complex";
import { Matrix } from "@/lib/quantum/matrix";
import { PAULI_X } from "@/lib/quantum/gates";
import { evolveDensityMatrix } from "@/lib/quantum/densityMatrix";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const rho = new Matrix([
  [new Complex(0.75), Complex.ZERO],
  [Complex.ZERO, new Complex(0.25)],
]);
const evolved = evolveDensityMatrix(rho, PAULI_X);
if (Math.abs(evolved.get(0, 0).re - 0.25) > 1e-9 || Math.abs(evolved.get(1, 1).re - 0.75) > 1e-9) {
  throw new Error("xGateOnBiasedMixture: expected X to swap the diagonal entries.");
}

export const xGateOnBiasedMixture: MultipleChoiceProblem = {
  meta: {
    slug: "x-gate-on-biased-mixture",
    title: "Applying X to a Biased Mixture",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["unitary-evolution", "mixed-states"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Apply X to $\\rho=\\begin{pmatrix}0.75&0\\\\0&0.25\\end{pmatrix}$ using $\\rho'=X\\rho X^\\dagger$. What is $\\rho'$?",
    options: [
      { id: "a", text: "$\\begin{pmatrix}0.25&0\\\\0&0.75\\end{pmatrix}$" },
      { id: "b", text: "$\\begin{pmatrix}0.75&0\\\\0&0.25\\end{pmatrix}$ (unchanged)" },
      { id: "c", text: "$\\begin{pmatrix}0.5&0.25\\\\0.25&0.5\\end{pmatrix}$" },
      { id: "d", text: "$I/2$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "X is not the identity — it actively swaps |0⟩ and |1⟩, so it must change a state that treats them differently.",
      c: "X⊗X† conjugation only ever permutes or rotates a density matrix's entries — it doesn't introduce off-diagonal terms out of nowhere for a diagonal input.",
      d: "X is unitary but doesn't erase information the way a measurement or noise channel would — it just relabels which basis state has which probability.",
    },
    defaultIncorrectFeedback: "X swaps the roles of |0⟩ and |1⟩ — apply that directly to ρ's diagonal entries.",
  },
  hints: [
    { text: "X swaps |0⟩ ↔ |1⟩, so it should swap the probabilities associated with each." },
    { text: "For a diagonal ρ, XρX† is diagonal too, with the two entries swapped." },
    { text: "0.75 was the |0⟩ probability; after X, it becomes the |1⟩ probability." },
  ],
  solution: {
    steps: [
      { description: "X conjugation permutes the computational basis, swapping the roles of |0⟩ and |1⟩." },
      { description: "For diagonal ρ=diag(0.75,0.25), XρX† = diag(0.25,0.75)." },
    ],
    finalAnswer: "ρ' = diag(0.25, 0.75)",
  },
  explanation: {
    correctIdea: "X conjugation swaps a diagonal density matrix's two entries, matching its action of flipping |0⟩↔|1⟩.",
    whyCorrect: "This is physically sensible: whatever probability was on |0⟩ moves to |1⟩ and vice versa, with no new coherence introduced.",
    whyWrong: [
      { optionId: "b", text: "Leaves ρ unchanged, which would make X the identity on a state that treats |0⟩ and |1⟩ differently." },
      { optionId: "c", text: "Invents off-diagonal terms. Conjugating a diagonal matrix by X permutes its entries and creates no coherence." },
      { optionId: "d", text: "Erases the bias, which is what a measurement or a noise channel would do. A unitary relabels the probabilities and keeps them." },
    ],
  },
};
