import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const verifyX2Anticommutation: MultipleChoiceProblem = {
  meta: {
    slug: "verify-x2-anticommutation",
    title: "Which Stabilizer Does X₂ Anticommute With?",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["stabilizer-formalism"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which of the bit-flip code's stabilizers, Z₀Z₁ or Z₁Z₂, does X₂ (an X error on qubit 2) anticommute with?",
    options: [
      { id: "a", text: "Z₁Z₂ only" },
      { id: "b", text: "Z₀Z₁ only" },
      { id: "c", text: "Both" },
      { id: "d", text: "Neither" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Z₀Z₁ doesn't touch qubit 2 at all, so it trivially commutes with anything acting only on qubit 2.",
      c: "Z₀Z₁ has no operator on qubit 2, so it cannot anticommute with X₂.",
      d: "X and Z anticommute when they act on the same qubit, and Z₁Z₂ does carry a Z on qubit 2, so it anticommutes with X₂.",
    },
    defaultIncorrectFeedback: "Check which stabilizer contains a Z operator on qubit 2.",
  },
  hints: [
    { text: "X and Z anticommute only when acting on the same qubit." },
    { text: "Z₀Z₁ has Z's on qubits 0 and 1, and nothing on qubit 2." },
    { text: "Z₁Z₂ does carry a Z on qubit 2. Count how many qubits the two operators disagree on there." },
  ],
  solution: {
    steps: [{ description: "Only Z₁Z₂ contains a Z on qubit 2, so only it anticommutes with X₂." }],
    finalAnswer: "Z₁Z₂ only.",
  },
  explanation: {
    correctIdea: "This reproduces the decode table's qubit-2 entry, syndrome (0,1), from operator structure alone.",
    whyCorrect: "Matches the decode table from Lesson 2, now derived rather than quoted.",
    whyWrong: [
      { optionId: "b", text: "Names the stabilizer that has no operator on qubit 2 at all, so it commutes with X₂ trivially." },
      { optionId: "c", text: "Would need both stabilizers to touch qubit 2, and only one of them does." },
      { optionId: "d", text: "Would mean the error goes undetected. X and Z anticommute on a shared qubit, and Z₁Z₂ shares qubit 2." },
    ],
  },
};
