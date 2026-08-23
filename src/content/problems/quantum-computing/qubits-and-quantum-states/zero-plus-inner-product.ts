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
  },
  hints: [
    { text: "⟨0| = (1, 0), acting on |+⟩'s column vector, is ordinary row-times-column matrix multiplication." },
    { text: "|+⟩ = (1/√2, 1/√2), so ⟨0|+⟩ picks out just the first entry." },
    { text: "The first entry of |+⟩'s vector is 1/√2." },
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
      "Answering 1 confuses this with ⟨0|0⟩ — |+⟩ is not |0⟩, it's a superposition, so the overlap is partial.",
      "Answering 0 would be correct for ⟨0|1⟩, not ⟨0|+⟩ — |+⟩ has a nonzero |0⟩ component.",
    ],
  },
};
