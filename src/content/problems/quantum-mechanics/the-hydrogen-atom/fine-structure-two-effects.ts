import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const fineStructureTwoEffects: MultipleChoiceProblem = {
  meta: {
    slug: "fine-structure-two-effects",
    title: "The Two Physical Effects Behind Fine Structure",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/fine-structure-introduction",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["fine-structure"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/fine-structure-introduction"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which two physical effects combine to produce hydrogen's fine structure?",
    options: [
      { id: "a", text: "Spin-orbit coupling and a relativistic kinetic energy correction" },
      { id: "b", text: "The Pauli exclusion principle and electron-electron repulsion" },
      { id: "c", text: "Nuclear spin and the Zeeman effect from an external magnetic field" },
      { id: "d", text: "Centrifugal barrier and the boundary condition u(0)=0" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Exclusion and electron-electron repulsion require more than one electron — hydrogen has only one, so this isn't relevant to hydrogen's own fine structure.",
      c: "Fine structure doesn't require an external field or nuclear spin — it arises from the electron's own spin coupling to its orbital motion, an effect present with no external field at all.",
      d: "These are both already fully accounted for in this course's non-relativistic treatment — they aren't the extra corrections fine structure adds.",
    },
    defaultIncorrectFeedback: "Fine structure is specifically the combination of spin-orbit coupling and the leading relativistic kinetic-energy correction.",
  },
  hints: [
    { text: "One effect involves the electron's spin interacting with its own orbital motion." },
    { text: "The other comes from replacing p²/2m with the true relativistic kinetic energy expression." },
    { text: "Neither requires more than one electron or an external field." },
  ],
  solution: {
    steps: [{ description: "Fine structure = spin-orbit coupling (L·S) + relativistic kinetic correction, both intrinsic to a single electron in the Coulomb field." }],
    finalAnswer: "(a) Spin-orbit coupling and a relativistic kinetic energy correction",
  },
  explanation: {
    correctIdea: "Both pieces of fine structure are single-electron effects, present even for isolated hydrogen with no external fields.",
    whyCorrect: "Matches the lesson's Conceptual Overview exactly.",
    whyWrong: ["The Zeeman effect (external B-field) and electron-electron repulsion (multi-electron atoms) are real but distinct effects, not part of hydrogen's intrinsic fine structure."],
  },
};
