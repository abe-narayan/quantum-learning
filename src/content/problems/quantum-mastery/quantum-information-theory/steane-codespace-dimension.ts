import type { NumericProblem } from "@/lib/problems/types";

export const steaneCodespaceDimension: NumericProblem = {
  meta: {
    slug: "steane-codespace-dimension",
    title: "Steane Code Codespace Dimension from Generator Count",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism",
    difficulty: "master",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["stabilizer-formalism", "css-codes"],
    prerequisites: ["quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism"],
  },
  question: {
    type: "numeric",
    prompt:
      "The Steane code has n=7 physical qubits and 6 independent stabilizer generators. Using the general rule that each independent generator halves the codespace dimension starting from 2^n, what is the codespace dimension 2^k?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: 2,
    tolerance: 0.001,
    incorrectFeedback: "First find k, the count of logical qubits: n minus the number of independent generators. The codespace dimension is then two raised to k, not k itself and not the full ambient dimension.",
    nearMisses: [
      { value: 1, feedback: "1 is k, the number of logical qubits. The codespace dimension is 2^k." },
      { value: 128, feedback: "128 = 2^7 is the full ambient Hilbert space. Each of the 6 generators halves it." },
      { value: 64, feedback: "64 halves the ambient space once. Six independent generators halve it six times." },
    ],
  },
  hints: [
    { text: "k = n - (number of independent stabilizer generators)." },
    { text: "k = 7 - 6 = 1." },
    { text: "The codespace dimension is two raised to the power of the k you found." },
  ],
  solution: {
    steps: [
      { description: "$k = n - (n-k) = 7 - 6 = 1$" },
      { description: "Codespace dimension $= 2^k = 2^1 = 2$." },
    ],
    finalAnswer: "The codespace dimension is 2, i.e. exactly 1 logical qubit -- matching the [[7,1,3]] label.",
  },
  explanation: {
    correctIdea: "Each independent stabilizer generator constraint halves the dimension of the ambient 2^n-dimensional Hilbert space.",
    whyCorrect: "This matches k1-k2 = 4-3 = 1 from the classical CSS construction directly, a consistency check between the two ways of counting logical qubits.",
  },
};
