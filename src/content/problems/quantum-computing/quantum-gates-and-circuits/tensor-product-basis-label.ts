import { StateVector } from "@/lib/quantum/state";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const combined = StateVector.zero(1).tensor(StateVector.basis(1, 1));
const correctIndex = combined.probabilities().findIndex((p) => p > 0.5);
const correctLabel = combined.basisLabel(correctIndex);

const OPTION_LABELS = ["00", "01", "10", "11"];

export const tensorProductBasisLabel: MultipleChoiceProblem = {
  meta: {
    slug: "tensor-product-basis-label",
    title: "Tensoring Two Basis States",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/tensor-products",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["tensor-product", "basis-states"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/tensor-products"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which two-qubit basis state equals $|0\\rangle \\otimes |1\\rangle$?",
    options: OPTION_LABELS.map((label) => ({ id: label, text: `$|${label}\\rangle$` })),
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: correctLabel,
    optionFeedback: {
      "00": "That would be |0⟩ ⊗ |0⟩ — check which ket becomes qubit 1.",
      "10": "That reverses the order. Qubit 0 is the left label; qubit 1 is the right one.",
      "11": "That would require both input kets to be |1⟩.",
    },
    defaultIncorrectFeedback: "Recall that basis states tensor by concatenating their labels: |i⟩⊗|j⟩ = |ij⟩.",
  },
  hints: [
    { text: "Basis states tensor by concatenating labels: |i⟩⊗|j⟩ = |ij⟩." },
    { text: "Here i = 0 (from the first ket) and j = 1 (from the second)." },
  ],
  solution: {
    steps: [
      {
        description: "Basis states combine by writing their labels side by side.",
        latex: "|i\\rangle \\otimes |j\\rangle = |ij\\rangle",
      },
      { description: "Substitute $i=0$, $j=1$." },
    ],
    finalAnswer: "$|0\\rangle \\otimes |1\\rangle = |01\\rangle$",
  },
  explanation: {
    correctIdea: "The tensor product of two basis states concatenates their labels.",
    whyCorrect:
      "Multiplying out the definition component-by-component shows the result is 1 exactly at the index whose binary label is the two inputs written in order.",
    whyWrong: ["Reversing the order (|10⟩) mixes up which qubit is qubit 0 — order matters for the tensor product."],
  },
};
