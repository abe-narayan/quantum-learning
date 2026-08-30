import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import type { NumericProblem } from "@/lib/problems/types";

const zeroState = StateVector.basis(1, 0);
const plusState = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
const overlap = zeroState.innerProduct(plusState).re; // real-valued here

export const zeroPlusInnerProduct: NumericProblem = {
  meta: {
    slug: "zero-plus-inner-product",
    title: "Computing ⟨0|+⟩",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/dirac-notation",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["dirac-notation", "inner-product", "orthonormality"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/dirac-notation"],
  },
  question: {
    type: "numeric",
    prompt:
      "Compute $\\langle0|{+}\\rangle$, where $|{+}\\rangle = \\frac{1}{\\sqrt2}(|0\\rangle+|1\\rangle)$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: overlap,
    tolerance: 0.01,
    incorrectFeedback: "Expand |+⟩ into its |0⟩ and |1⟩ pieces first, then use orthonormality to see which term survives ⟨0| ... ⟩.",
    nearMisses: [
      { value: 0.5, feedback: "0.5 is |⟨0|+⟩|², the probability. The question asks for the inner product itself, before squaring." },
      { value: 1, feedback: "1 is ⟨0|0⟩. |+⟩ is a superposition, so only part of it overlaps with |0⟩." },
      { value: 0, feedback: "0 is ⟨0|1⟩. |+⟩ carries a nonzero |0⟩ component, so the overlap does not vanish." },
    ],
  },
  hints: [
    { text: "⟨0| = (1, 0), acting on |+⟩'s column vector, is ordinary row-times-column matrix multiplication." },
    { text: "|+⟩ = (1/√2, 1/√2), so ⟨0|+⟩ picks out just the first entry." },
    { text: "Read off that first entry. Note that the result is an amplitude, not yet a probability." },
  ],
  solution: {
    steps: [
      { description: "Write $\\langle0|=(1,0)$ and $|{+}\\rangle=\\begin{pmatrix}1/\\sqrt2\\\\1/\\sqrt2\\end{pmatrix}$." },
      { description: "Matrix-multiply.", latex: "\\langle0|{+}\\rangle = (1)\\left(\\tfrac{1}{\\sqrt2}\\right) + (0)\\left(\\tfrac{1}{\\sqrt2}\\right) = \\tfrac{1}{\\sqrt2}" },
    ],
    finalAnswer: "$\\langle0|{+}\\rangle = \\frac{1}{\\sqrt2} \\approx 0.707$",
  },
  explanation: {
    correctIdea: "Taking an inner product with a basis state ⟨0| just extracts that basis state's coefficient from the ket, thanks to orthonormality.",
    whyCorrect: "⟨0|+⟩ = ⟨0|(1/√2|0⟩+1/√2|1⟩) = 1/√2⟨0|0⟩ + 1/√2⟨0|1⟩ = 1/√2(1) + 1/√2(0) = 1/√2, using ⟨0|0⟩=1 and ⟨0|1⟩=0 directly.",
    whyWrong: [
      "Answering 1 confuses this with ⟨0|0⟩. |+⟩ is a superposition, not |0⟩, so the overlap is partial.",
      "Answering 0 would be right for ⟨0|1⟩. |+⟩ carries a nonzero |0⟩ component.",
    ],
  },
};
