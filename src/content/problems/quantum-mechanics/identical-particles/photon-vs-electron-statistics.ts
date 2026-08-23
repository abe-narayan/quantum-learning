import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const photonVsElectronStatistics: MultipleChoiceProblem = {
  meta: {
    slug: "photon-vs-electron-statistics",
    title: "Spin-Statistics: Photons vs. Electrons",
    course: "identical-particles",
    lesson: "quantum-mechanics/identical-particles/bosons-and-fermions",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["spin-statistics"],
    prerequisites: ["quantum-mechanics/identical-particles/bosons-and-fermions"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Photons have spin 1; electrons have spin 1/2. Per the spin-statistics connection, which symmetrization applies to each?",
    options: [
      { id: "a", text: "Photons: symmetric (bosons). Electrons: antisymmetric (fermions)." },
      { id: "b", text: "Photons: antisymmetric (fermions). Electrons: symmetric (bosons)." },
      { id: "c", text: "Both are symmetric (bosons), since both are elementary particles." },
      { id: "d", text: "It depends on the specific experiment, not on the particle's spin." },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This reverses the spin-statistics connection: integer spin (photons) is bosonic, half-integer spin (electrons) is fermionic — not the other way around.",
      c: "Being 'elementary' has nothing to do with statistics — the deciding factor is specifically integer vs. half-integer spin.",
      d: "Spin-statistics is a fixed property of the particle species, not something that varies by experimental setup.",
    },
    defaultIncorrectFeedback: "Integer spin (like the photon's spin 1) means bosonic (symmetric); half-integer spin (like the electron's spin 1/2) means fermionic (antisymmetric).",
  },
  hints: [
    { text: "Integer spin (0, 1, 2, ...) → bosons → symmetric wavefunctions." },
    { text: "Half-integer spin (1/2, 3/2, ...) → fermions → antisymmetric wavefunctions." },
    { text: "Photon spin=1 (integer); electron spin=1/2 (half-integer)." },
  ],
  solution: {
    steps: [{ description: "Photons (spin 1, integer) are bosons, symmetric. Electrons (spin 1/2, half-integer) are fermions, antisymmetric." }],
    finalAnswer: "(a) Photons: symmetric (bosons). Electrons: antisymmetric (fermions).",
  },
  explanation: {
    correctIdea: "This is a direct, memorizable application of the spin-statistics connection this course states as an experimental fact.",
    whyCorrect: "Matches the standard, well-established assignment for these two specific particles.",
    whyWrong: ["Electron exclusion (fermion behavior) is exactly why atomic shell structure exists (Multi-Electron Atoms) — if electrons were bosons, this entire course's shell-filling logic would collapse."],
  },
};
