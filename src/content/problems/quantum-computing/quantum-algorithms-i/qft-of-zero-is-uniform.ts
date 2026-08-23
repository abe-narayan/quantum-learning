import { StateVector } from "@/lib/quantum/state";
import { quantumFourierTransform } from "@/lib/quantum/qft";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const result = quantumFourierTransform(StateVector.basis(3, 0));
const allEqual = result.probabilities().every((p) => Math.abs(p - 1 / 8) < 1e-9);
if (!allEqual) throw new Error("qftOfZeroIsUniform: expected QFT|000> to be the uniform superposition.");

export const qftOfZeroIsUniform: MultipleChoiceProblem = {
  meta: {
    slug: "qft-of-zero-is-uniform",
    title: "QFT of the All-Zero State",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["qft"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What is QFT|000⟩ (n=3)?",
    options: [
      { id: "a", text: "The uniform superposition over all 8 basis states" },
      { id: "b", text: "|000⟩ unchanged" },
      { id: "c", text: "|111⟩" },
      { id: "d", text: "A superposition of only |000⟩ and |111⟩" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The QFT is not the identity — j=0 in the formula still produces a sum over every k, not a single unchanged state.",
      c: "There's no reason for QFT to single out |111⟩ specifically — check the formula with j=0.",
      d: "The QFT formula sums over every k from 0 to N−1, not just two of them.",
    },
    defaultIncorrectFeedback: "Set j=0 in QFT|j⟩=(1/√N)Σₖ e^{2πi(0)k/N}|k⟩ and simplify every phase factor.",
  },
  hints: [
    { text: "With j=0, every phase factor e^{2πi(0)k/N} equals 1, for every k." },
    { text: "The result is (1/√N)Σₖ|k⟩ — an equal-amplitude sum over all N basis states." },
    { text: "This is exactly the uniform superposition, the same object H^⊗n produces." },
  ],
  solution: {
    steps: [{ description: "j=0 makes every phase factor 1, giving (1/√8)Σₖ|k⟩ — the uniform superposition." }],
    finalAnswer: "QFT|000⟩ = the uniform superposition over all 8 basis states.",
  },
  explanation: {
    correctIdea: "j=0 is the QFT's own 'zero frequency' case, which spreads equally over every output.",
    whyCorrect: "Directly confirmed: every one of the 8 output probabilities equals exactly 1/8.",
    whyWrong: ["This is a genuinely different-looking but consistent fact from H^⊗n|0...0⟩ producing the same state via a totally different circuit."],
  },
};
