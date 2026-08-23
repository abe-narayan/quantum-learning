import { PAULI_X, rotationY, rotationZ } from "@/lib/quantum/gates";
import { matricesEqualUpToGlobalPhase } from "@/lib/quantum/gateDecomposition";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const composed = rotationZ(Math.PI).mul(rotationY(Math.PI));
if (!matricesEqualUpToGlobalPhase(composed, PAULI_X)) {
  throw new Error("verify-x-decomposition: expected Rz(pi)Ry(pi) to equal X up to global phase.");
}

export const verifyXDecomposition: MultipleChoiceProblem = {
  meta: {
    slug: "verify-x-decomposition",
    title: "Does Rz(π)Ry(π) Equal X?",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["gate-decomposition"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/gate-decomposition"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Does the composed matrix Rz(π)·Ry(π) equal the X gate, up to global phase?",
    options: [
      { id: "a", text: "Yes — this is exactly the verified decomposition this lesson uses" },
      { id: "b", text: "No — they are unrelated gates" },
      { id: "c", text: "Only for specific input states, not as a general matrix identity" },
      { id: "d", text: "Only if an additional S gate is inserted between them" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The lesson explicitly verifies this identity to machine precision — they are directly related, not unrelated.",
      c: "This is a genuine MATRIX identity (true for the operators themselves), not something that only happens to work for specific states.",
      d: "No extra gate is needed — Rz(π)Ry(π) alone reproduces X exactly, up to global phase.",
    },
    defaultIncorrectFeedback: "This lesson's engine directly verifies Rz(π)·Ry(π) equals X up to global phase, to machine precision.",
  },
  hints: [
    { text: "This is one of the five specific decompositions this lesson verifies directly." },
    { text: "matricesEqualUpToGlobalPhase confirms this identity to machine precision." },
    { text: "It's a genuine matrix identity, true for the full operators, not just specific states." },
  ],
  solution: {
    steps: [{ description: "Yes — this lesson's engine confirms Rz(π)Ry(π) equals X up to global phase, to machine precision." }],
    finalAnswer: "(a) Yes",
  },
  explanation: {
    correctIdea: "This directly tests recall of one of the lesson's key verified identities.",
    whyCorrect: "Matches this platform's own gateDecomposition test suite result.",
    whyWrong: ["Claiming this only works for specific states, or requires an extra gate, misunderstands that this is an exact, general matrix identity."],
  },
};
