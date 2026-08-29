import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const sameOrbitalOppositeSpinAllowed: MultipleChoiceProblem = {
  meta: {
    slug: "same-orbital-opposite-spin-allowed",
    title: "Which Electron Pairs Violate Exclusion?",
    course: "identical-particles",
    lesson: "quantum-mechanics/identical-particles/the-pauli-exclusion-principle",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["pauli-exclusion"],
    prerequisites: ["quantum-mechanics/identical-particles/the-pauli-exclusion-principle"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which of these two-electron configurations violates the Pauli exclusion principle?",
    options: [
      { id: "a", text: "Both electrons in the 1s orbital, both spin-up" },
      { id: "b", text: "Both electrons in the 1s orbital, one spin-up and one spin-down" },
      { id: "c", text: "One electron in 1s, one electron in 2s (any spins)" },
      { id: "d", text: "One electron in 2s, one electron in 2p (any spins)" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This is allowed — same spatial orbital, but different spin makes these two genuinely different complete single-particle states.",
      c: "Different spatial orbitals (1s vs 2s) already makes these different single-particle states, regardless of spin — always allowed.",
      d: "Different spatial orbitals (2s vs 2p) again makes these different single-particle states — always allowed.",
    },
    defaultIncorrectFeedback: "Exclusion forbids two electrons sharing the EXACT SAME complete single-particle state — same spatial orbital AND same spin.",
  },
  hints: [
    { text: "Exclusion is violated only when both the spatial orbital AND the spin are identical." },
    { text: "One configuration puts both electrons in 1s with both spins up: same orbital, same spin." },
    { text: "Every other option differs in either orbital or spin." },
  ],
  solution: {
    steps: [{ description: "Only the both-in-1s, both-spin-up configuration puts two electrons in the identical complete single-particle state (same orbital, same spin) — this is exactly the a=b case where antisymmetrize throws." }],
    finalAnswer: "Both electrons in 1s, both spin-up",
  },
  explanation: {
    correctIdea: "This directly tests the 'complete single-particle state includes spin' point from the lesson's Common Mistakes section.",
    whyCorrect: "Matches the antisymmetrize(a,a) throw condition — here a is 'the (1s, spin-up) single-particle state' for both electrons.",
    whyWrong: [
      { optionId: "b", text: "Same spatial orbital, but opposite spins make these two different complete single-particle states, so this is allowed." },
      { optionId: "c", text: "Different spatial orbitals (1s versus 2s) already make these different single-particle states, whatever the spins." },
      { optionId: "d", text: "Different spatial orbitals again (2s versus 2p), so this is allowed too." },
    ],
  },
};
