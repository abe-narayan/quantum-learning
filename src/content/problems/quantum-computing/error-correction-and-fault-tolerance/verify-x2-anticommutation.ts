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
      c: "Z₀Z₁ has no operator on qubit 2, so it can't anticommute with X₂ specifically.",
      d: "X and Z anticommute on the same qubit — Z₁Z₂ does have a Z on qubit 2, so it must anticommute with X₂.",
    },
    defaultIncorrectFeedback: "Check which stabilizer actually contains a Z operator on qubit 2 specifically.",
  },
  hints: [
    { text: "X and Z anticommute only when acting on the same qubit." },
    { text: "Z₀Z₁ has Z's on qubits 0,1 — no qubit 2 component." },
    { text: "Z₁Z₂ has a Z on qubit 2 — this is where the anticommutation comes from." },
  ],
  solution: {
    steps: [{ description: "Only Z₁Z₂ contains a Z on qubit 2, so only it anticommutes with X₂." }],
    finalAnswer: "Z₁Z₂ only.",
  },
  explanation: {
    correctIdea: "This reproduces the decode table's qubit-2 entry, syndrome (0,1), from operator structure alone.",
    whyCorrect: "Matches Lesson 2's decode table exactly, now derived rather than just quoted.",
    whyWrong: ["Any answer other than 'Z₁Z₂ only' misidentifies which stabilizer generator actually contains a same-qubit Z operator."],
  },
};
