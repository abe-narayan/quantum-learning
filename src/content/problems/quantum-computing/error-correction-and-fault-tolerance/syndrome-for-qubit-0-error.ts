import { Complex } from "@/lib/quantum/complex";
import { encodeBitFlipCode, runBitFlipCorrectionCycle, applyBitFlipError } from "@/lib/quantum/errorCorrection";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const encoded = encodeBitFlipCode(new Complex(0.6), new Complex(0.8));
const corrupted = applyBitFlipError(encoded, 0);
const result = runBitFlipCorrectionCycle(corrupted, [0.1, 0.1]);

export const syndromeForQubit0Error: MultipleChoiceProblem = {
  meta: {
    slug: "syndrome-for-qubit-0-error",
    title: "Syndrome for an X Error on Qubit 0",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["quantum-error-correction", "bit-flip-code"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code"],
  },
  question: {
    type: "multiple-choice",
    prompt: "For an X error on qubit 0 of the encoded state α|000⟩+β|111⟩, what syndrome (s₁,s₂) results?",
    options: [
      { id: "a", text: "(1,0)" },
      { id: "b", text: "(0,0)" },
      { id: "c", text: "(1,1)" },
      { id: "d", text: "(0,1)" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "(0,0) means no error was detected, but an X error was applied to qubit 0 here.",
      c: "(1,1) is the qubit-1 error signature, not qubit 0's.",
      d: "(0,1) is the qubit-2 error signature, not qubit 0's.",
    },
    defaultIncorrectFeedback: "After the error, check whether qubits 0,1 agree (s₁) and whether qubits 1,2 agree (s₂).",
  },
  hints: [
    { text: "After X on qubit 0: |000⟩→|100⟩, |111⟩→|011⟩." },
    { text: "s₁ checks qubits 0,1 agreement: they now disagree in both terms." },
    { text: "s₂ checks qubits 1,2 agreement: they still agree in both terms." },
  ],
  solution: {
    steps: [{ description: "Qubits 0,1 now disagree (s₁=1); qubits 1,2 still agree (s₂=0), giving syndrome (1,0)." }],
    finalAnswer: `(${result.syndrome[0]},${result.syndrome[1]})`,
  },
  explanation: {
    correctIdea: "The syndrome directly encodes which parities the error disturbed.",
    whyCorrect: "Matches the syndrome the engine's extraction routine returns for this error.",
    whyWrong: [
      { optionId: "b", text: "Reports no error at all, but qubits 0 and 1 no longer agree." },
      { optionId: "c", text: "The signature of an error on qubit 1, which sits in both parity checks and so trips both." },
      { optionId: "d", text: "The signature of an error on qubit 2, which trips only the second check." },
    ],
  },
};
