import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const whichPairCommutes: MultipleChoiceProblem = {
  meta: {
    slug: "which-pair-commutes",
    title: "Which Pair of Operators Commutes?",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["commutators", "pauli-operators"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which of the following pairs of operators commute (share a common eigenbasis)?",
    options: [
      { id: "a", text: "$X$ and $Z$" },
      { id: "b", text: "$Y$ and $Z$" },
      { id: "c", text: "$Z$ and $I$" },
      { id: "d", text: "$X$ and $Y$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "c",
    optionFeedback: {
      a: "X and Z are different Pauli operators along different axes, so they anticommute rather than commute (confirmed by computing [X,Z] elsewhere in this course).",
      b: "Y and Z are different Pauli operators along different axes, so they anticommute too.",
      d: "X and Y are different Pauli operators along different axes, with the same result: they anticommute.",
    },
    defaultIncorrectFeedback: "The identity operator commutes with everything. That is the pair to look for.",
  },
  hints: [
    { text: "Commuting means the two orderings of a product agree, so the test is one multiplication carried out both ways." },
    { text: "Two distinct Pauli operators anticommute: swapping their order flips the sign of the product. Work out how many of the listed pairs that eliminates." },
    { text: "One of the four operators appearing in the list is not a Pauli at all. Check what multiplying by it does to the ordering of any product." },
  ],
  solution: {
    steps: [
      { description: "The identity operator $I$ satisfies $IA=AI=A$ for any $A$, so $[I,A]=0$ always." },
      { description: "$Z$ and $I$ therefore commute trivially, while every pair of distinct Pauli operators anticommutes." },
    ],
    finalAnswer: "$Z$ and $I$",
  },
  explanation: {
    correctIdea: "The identity operator is compatible with every observable, trivially.",
    whyCorrect: "IA = AI for any A is an immediate consequence of what the identity operator does.",
    whyWrong: [
      { optionId: "a", text: "Two distinct Paulis. XZ = −ZX, so the pair anticommutes and shares no eigenbasis." },
      { optionId: "b", text: "Two distinct Paulis again, with the same anticommuting relation." },
      { optionId: "d", text: "Also two distinct Paulis. Any two of X, Y, Z anticommute." },
    ],
  },
};
