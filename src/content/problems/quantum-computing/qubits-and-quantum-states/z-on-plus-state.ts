import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { PAULI_Z, applySingleQubitGate } from "@/lib/quantum/gates";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const plusState = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
const result = applySingleQubitGate(plusState, PAULI_Z, 0);

function ketLatex(state: StateVector): string {
  const terms = state.amplitudes
    .map((amplitude, index) => ({ amplitude, label: state.basisLabel(index) }))
    .filter(({ amplitude }) => amplitude.magnitudeSquared() > 1e-9);
  return terms.map(({ amplitude, label }) => `(${formatAmplitudeLatex(amplitude)})|${label}\\rangle`).join(" + ");
}

export const zOnPlusState: MultipleChoiceProblem = {
  meta: {
    slug: "z-on-plus-state",
    title: "Z Applied to |+⟩",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/quantum-gates",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["gates", "pauli-z", "bloch-sphere"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/quantum-gates"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Compute $Z|+\\rangle$ by matrix multiplication. What state is this?",
    options: [
      { id: "a", text: `$${ketLatex(result)}$` },
      { id: "b", text: "$(1.00)|0\\rangle$" },
      { id: "c", text: "$(0.71)|0\\rangle + (0.71i)|1\\rangle$" },
      { id: "d", text: `$${ketLatex(plusState)}$` },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Z leaves |0⟩ alone but |+⟩ is a superposition of |0⟩ and |1⟩ — Z acts on the |1⟩ term too, flipping its sign.",
      c: "|+i⟩ comes from applying S, not Z. Z multiplies the |1⟩ coefficient by −1 (a real number), not by i.",
      d: "This is |+⟩ itself, unchanged — but Z does act nontrivially here, since Z only fixes |0⟩ and |1⟩, and |+⟩ is neither.",
    },
    defaultIncorrectFeedback: "Write |+⟩ as a column vector and multiply by Z's matrix directly: Z flips the sign of the second entry only.",
  },
  hints: [
    { text: "Z = diag(1, −1): it leaves the |0⟩ coefficient alone and multiplies the |1⟩ coefficient by −1." },
    { text: "|+⟩ = (1/√2)|0⟩ + (1/√2)|1⟩, so only the second term's sign flips." },
    { text: "Once you have the resulting column vector, check it against the six named states from earlier lessons." },
  ],
  solution: {
    steps: [
      { description: "Write $|+\\rangle$ as a column vector and apply $Z=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$.", latex: "Z|+\\rangle = \\frac{1}{\\sqrt2}\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}\\begin{pmatrix}1\\\\1\\end{pmatrix} = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\-1\\end{pmatrix}" },
      { description: "This is exactly the state $|-\\rangle$." },
    ],
    finalAnswer: `$${ketLatex(result)} = |-\\rangle$`,
  },
  explanation: {
    correctIdea: "Z rotates the Bloch vector by π about the z-axis, which fixes the poles but flips the sign of anything on the equator's real axis, sending |+⟩ to |−⟩.",
    whyCorrect: "Direct matrix multiplication confirms the sign flip only touches the |1⟩ coefficient, turning + into −.",
    whyWrong: [
      { optionId: "b", text: "Keeps only the |0⟩ term. Z leaves that coefficient alone but still acts on the |1⟩ term rather than deleting it." },
      { optionId: "c", text: "Applies a factor of i to the |1⟩ coefficient, which is what S does. Z applies −1." },
      { optionId: "d", text: "Leaves |+⟩ untouched, generalizing from Z fixing the poles. |+⟩ is neither pole." },
    ],
  },
};
