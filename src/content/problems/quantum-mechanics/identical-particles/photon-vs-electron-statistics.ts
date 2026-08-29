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
    { text: "The spin-statistics connection sorts particles by one thing only: whether their spin is an integer or a half-integer." },
    { text: "Sort the two particles into those categories first, using the spins the prompt gives you." },
    { text: "Integer spin goes with symmetric wavefunctions, half-integer with antisymmetric. Now read off each particle." },
  ],
  solution: {
    steps: [{ description: "Photons have spin 1, an integer, so they are bosons and their joint wavefunction is symmetric under exchange. Electrons have spin 1/2, a half-integer, so they are fermions and their joint wavefunction is antisymmetric." }],
    finalAnswer: "Photons are bosons with a symmetric wavefunction; electrons are fermions with an antisymmetric one.",
  },
  explanation: {
    correctIdea: "The spin-statistics connection keys entirely on integer versus half-integer spin, so the two spins given in the prompt settle the answer on their own.",
    whyCorrect: "Matches the standard assignment for these two particles, and it is why electron exclusion produces atomic shell structure.",
    whyWrong: [
      { optionId: "b", text: "Runs the connection backwards. Integer spin is bosonic and half-integer is fermionic, not the reverse." },
      { optionId: "c", text: "Sorts by elementary versus composite. Elementarity does not enter; spin does, and the two spins here differ." },
      { optionId: "d", text: "Makes statistics contextual. It is fixed by the particle species, which is why electron exclusion holds in every atom." },
    ],
  },
};
