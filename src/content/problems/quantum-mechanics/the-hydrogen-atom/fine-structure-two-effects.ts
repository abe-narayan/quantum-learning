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
      b: "Exclusion and electron-electron repulsion require more than one electron. Hydrogen has only one, so neither bears on hydrogen's own fine structure.",
      c: "Fine structure needs no external field and no nuclear spin. It arises from the electron's own spin coupling to its orbital motion, and is present with no external field at all.",
      d: "Both of these are already accounted for in this course's non-relativistic treatment, so neither is one of the corrections fine structure adds.",
    },
    defaultIncorrectFeedback: "Fine structure is specifically the combination of spin-orbit coupling and the leading relativistic kinetic-energy correction.",
  },
  hints: [
    { text: "One effect involves the electron's spin interacting with its own orbital motion." },
    { text: "The other comes from replacing p²/2m with the true relativistic kinetic energy expression." },
    { text: "Neither requires more than one electron or an external field." },
  ],
  solution: {
    steps: [{ description: "Fine structure is the sum of spin-orbit coupling, the L·S term, and the leading relativistic correction to the kinetic energy. Both are intrinsic to a single electron moving in the Coulomb field." }],
    finalAnswer: "Spin-orbit coupling and the leading relativistic kinetic energy correction.",
  },
  explanation: {
    correctIdea: "Both pieces of fine structure are single-electron effects, present in isolated hydrogen with no external field and no second electron.",
    whyCorrect: "Both corrections come from taking the electron's own relativity seriously: one from the momentum expansion of the relativistic kinetic energy, the other from the field the electron sees in its own rest frame coupling to its spin. Neither needs a second electron or an applied field.",
    whyWrong: [
      { optionId: "b", text: "Needs more than one electron. Hydrogen has one, so neither effect has anything to act on." },
      { optionId: "c", text: "Needs an external field. Fine structure is there with the field switched off; the Zeeman effect is a separate, applied-field splitting." },
      { optionId: "d", text: "Names two ingredients the non-relativistic treatment already includes, so neither is a correction to it." },
    ],
  },
};
