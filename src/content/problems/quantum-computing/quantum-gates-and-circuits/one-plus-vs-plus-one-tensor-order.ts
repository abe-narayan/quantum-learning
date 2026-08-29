import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const plus = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
const zero = StateVector.zero(1);
const one = StateVector.basis(1, 1);

const correct = one.tensor(plus);
const reversedOrder = plus.tensor(one);
const noSuperposition = StateVector.basis(2, 3);
const zeroTensorPlus = zero.tensor(plus);

/** Renders a state's nonzero terms, same convention as the h-then-cnot-result problem. */
function ketLatex(state: StateVector): string {
  const terms = state.amplitudes
    .map((amplitude, index) => ({ amplitude, label: state.basisLabel(index) }))
    .filter(({ amplitude }) => amplitude.magnitudeSquared() > 1e-9);
  return terms.map(({ amplitude, label }) => `(${formatAmplitudeLatex(amplitude)})|${label}\\rangle`).join(" + ");
}

export const onePlusVsPlusOneTensorOrder: MultipleChoiceProblem = {
  meta: {
    slug: "one-plus-vs-plus-one-tensor-order",
    title: "|1⟩ ⊗ |+⟩ Is Not |+⟩ ⊗ |1⟩",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/tensor-products",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["tensor-product", "ordering-convention"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/tensor-products"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What is $|1\\rangle \\otimes |+\\rangle$, where $|+\\rangle = \\frac{1}{\\sqrt2}(|0\\rangle+|1\\rangle)$?",
    options: [
      { id: "a", text: `$${ketLatex(correct)}$` },
      { id: "b", text: `$${ketLatex(reversedOrder)}$` },
      { id: "c", text: `$${ketLatex(noSuperposition)}$` },
      { id: "d", text: `$${ketLatex(zeroTensorPlus)}$` },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "That's $|+\\rangle\\otimes|1\\rangle$ instead — the factor order is reversed. Qubit 0 must be whichever ket comes first.",
      c: "This has no superposition at all, but |+⟩ is a superposition state, so qubit 1 can't collapse to a single definite value.",
      d: "That's $|0\\rangle\\otimes|+\\rangle$ — the first factor should be $|1\\rangle$, not $|0\\rangle$.",
    },
    defaultIncorrectFeedback: "Tensor $|1\\rangle$ (as qubit 0) with $|+\\rangle$ (as qubit 1): expand $|+\\rangle$'s two terms and prepend the qubit-0 label to each.",
  },
  hints: [
    { text: "|1⟩ becomes qubit 0; |+⟩ becomes qubit 1 — the order they're written in is the order they combine in." },
    { text: "Expand |+⟩ = (|0⟩+|1⟩)/√2 and prepend '1' to each of its basis labels." },
    { text: "Every basis label in the result starts with the same digit, since qubit 0 is definite here. Only qubit 1 varies." },
  ],
  solution: {
    steps: [
      {
        description: "Expand $|+\\rangle$ and tensor with $|1\\rangle$ as the qubit-0 factor.",
        latex: "|1\\rangle\\otimes|+\\rangle = |1\\rangle\\otimes\\frac{|0\\rangle+|1\\rangle}{\\sqrt2} = \\frac{|10\\rangle+|11\\rangle}{\\sqrt2}",
      },
    ],
    finalAnswer: `$${ketLatex(correct)}$`,
  },
  explanation: {
    correctIdea: "Tensor product order matches the order the kets are written in: the first ket becomes qubit 0.",
    whyCorrect: "Distributing |1⟩ over |+⟩'s two terms and concatenating labels gives exactly the |10⟩, |11⟩ superposition.",
    whyWrong: [
      { optionId: "b", text: "This is |+⟩⊗|1⟩, a different state: its nonzero terms are |01⟩ and |11⟩." },
      { optionId: "c", text: "No superposition appears here, but |+⟩ is a superposition, so qubit 1 cannot hold a single definite value." },
      { optionId: "d", text: "This is |0⟩⊗|+⟩. The first factor should be |1⟩." },
    ],
  },
};
