import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { pureStateDensityMatrix, convexCombination, maximallyMixedState } from "@/lib/quantum/densityMatrix";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const plus = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
const minus = new StateVector([new Complex(Math.SQRT1_2), new Complex(-Math.SQRT1_2)]);
const mixture = convexCombination([
  { probability: 0.5, density: pureStateDensityMatrix(plus) },
  { probability: 0.5, density: pureStateDensityMatrix(minus) },
]);
if (!mixture.equals(maximallyMixedState(2), 1e-9)) {
  throw new Error("plusMinusMixtureIdentity: expected a 50/50 mix of |+> and |-> to equal I/2.");
}

export const plusMinusMixtureIdentity: MultipleChoiceProblem = {
  meta: {
    slug: "plus-minus-mixture-identity",
    title: "A 50/50 Mixture of |+⟩ and |−⟩",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["mixed-states", "maximally-mixed"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What is ρ for a qubit prepared as |+⟩ with probability 0.5 and |−⟩ with probability 0.5?",
    options: [
      { id: "a", text: "$I/2$, the maximally mixed state" },
      { id: "b", text: "$|+\\rangle\\langle+|$, a pure state" },
      { id: "c", text: "$\\begin{pmatrix}0.5&0.5\\\\0.5&0.5\\end{pmatrix}$" },
      { id: "d", text: "The zero matrix" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "That would mean the mixture is somehow still pure — mixing two different pure states with nonzero probability of each generally gives a mixed result.",
      c: "That's ρ for |+⟩ alone, not a mixture of |+⟩ and |−⟩ — their off-diagonal contributions actually cancel.",
      d: "ρ must have trace 1, never 0 — the zero matrix isn't a valid density matrix at all.",
    },
    defaultIncorrectFeedback: "Add the two density matrices |+⟩⟨+| and |−⟩⟨−|, each weighted by 0.5, and simplify.",
  },
  hints: [
    { text: "Write out |+⟩⟨+| and |−⟩⟨−| explicitly as 2×2 matrices." },
    { text: "Their off-diagonal entries have opposite signs (+0.5 vs −0.5)." },
    { text: "Averaging them cancels the off-diagonal terms entirely." },
  ],
  solution: {
    steps: [
      {
        description: "Average the two density matrices.",
        latex: "\\tfrac12\\begin{pmatrix}0.5&0.5\\\\0.5&0.5\\end{pmatrix} + \\tfrac12\\begin{pmatrix}0.5&-0.5\\\\-0.5&0.5\\end{pmatrix} = \\begin{pmatrix}0.5&0\\\\0&0.5\\end{pmatrix}",
      },
    ],
    finalAnswer: "ρ = I/2, the maximally mixed state.",
  },
  explanation: {
    correctIdea: "The off-diagonal terms of |+⟩⟨+| and |−⟩⟨−| are opposite in sign and cancel under averaging.",
    whyCorrect: "This matches Convex Combinations and Physical Mixtures' general result: any orthonormal basis, mixed 50/50, gives I/2.",
    whyWrong: [
      { optionId: "b", text: "Keeps the result pure. Mixing two distinct pure states, each with nonzero probability, gives a mixed state." },
      { optionId: "c", text: "Is |+⟩⟨+| written out, dropping |−⟩⟨−|'s negative off-diagonal contribution, so the coherences never cancel." },
      { optionId: "d", text: "Has trace 0. Every density matrix has trace 1." },
    ],
  },
};
