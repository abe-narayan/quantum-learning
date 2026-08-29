import { Complex } from "@/lib/quantum/complex";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const overlap = new Complex(2, 3);
const reversedOverlap = overlap.conjugate();

export const conjugateSymmetryOfInnerProduct: MultipleChoiceProblem = {
  meta: {
    slug: "conjugate-symmetry-of-inner-product",
    title: "Reversing an Inner Product's Order",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/dirac-notation",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["dirac-notation", "inner-product", "conjugate"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/dirac-notation"],
  },
  question: {
    type: "multiple-choice",
    prompt: "If $\\langle\\phi|\\psi\\rangle = 2+3i$, what is $\\langle\\psi|\\phi\\rangle$?",
    options: [
      { id: "a", text: "$2-3i$" },
      { id: "b", text: "$2+3i$" },
      { id: "c", text: "$-2-3i$" },
      { id: "d", text: "$-2+3i$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "That would mean the two inner products are equal, but they're generally only equal when the value is real — 2+3i is not real.",
      c: "This negates the real part too — the reversal rule only conjugates the value, it doesn't negate it entirely.",
      d: "This negates the real part but keeps the imaginary part's sign — the reversal rule does the opposite: it keeps the real part and flips only the imaginary part's sign.",
    },
    defaultIncorrectFeedback: "Recall $\\langle\\psi|\\phi\\rangle=\\langle\\phi|\\psi\\rangle^*$: reversing the order conjugates the value.",
  },
  hints: [
    { text: "Dirac notation's key asymmetry: ⟨ψ|φ⟩ = ⟨φ|ψ⟩*, the complex conjugate, not the same value." },
    { text: "Conjugating a complex number flips only the sign of its imaginary part." },
  ],
  solution: {
    steps: [
      { description: "Apply the reversal rule.", latex: "\\langle\\psi|\\phi\\rangle = \\langle\\phi|\\psi\\rangle^* = (2+3i)^*" },
      { description: "Conjugate: flip the imaginary part's sign only.", latex: "(2+3i)^* = 2-3i" },
    ],
    finalAnswer: `$${reversedOverlap.re}-${Math.abs(reversedOverlap.im)}i$`,
  },
  explanation: {
    correctIdea: "⟨φ|ψ⟩ and ⟨ψ|φ⟩ are complex conjugates of each other, not equal in general — order in Dirac notation matters.",
    whyCorrect: "This directly follows from the bra being a conjugate-transpose: swapping which ket is the bra and which is the ket introduces exactly one extra conjugation.",
    whyWrong: [
      { optionId: "b", text: "Treats the inner product as symmetric in its two arguments. The two orderings agree only when the value is real, and 2+3i is not." },
      { optionId: "c", text: "Negates the whole number. Conjugation leaves the real part alone." },
      { optionId: "d", text: "Flips the wrong sign: it negates the real part and keeps the imaginary one, the reverse of what conjugation does." },
    ],
  },
};
