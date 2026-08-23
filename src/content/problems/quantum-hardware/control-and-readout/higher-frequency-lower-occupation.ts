import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const higherFrequencyLowerOccupation: MultipleChoiceProblem = {
  meta: {
    slug: "higher-frequency-lower-occupation",
    title: "Does Higher Qubit Frequency Help or Hurt Thermal Noise?",
    course: "control-and-readout",
    lesson: "quantum-hardware/control-and-readout/cryogenic-systems",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["cryogenics"],
    prerequisites: ["quantum-hardware/control-and-readout/cryogenic-systems"],
  },
  question: {
    type: "multiple-choice",
    prompt: "At a FIXED temperature, does increasing the qubit's transition frequency ω make thermal photon occupation n̄ larger or smaller?",
    options: [
      { id: "a", text: "Smaller — higher ω increases ħω/k_BT, making the exponential in the denominator larger" },
      { id: "b", text: "Larger — higher frequency means more thermal energy available" },
      { id: "c", text: "No effect — n̄ depends only on temperature, not frequency" },
      { id: "d", text: "It depends on the specific qubit platform" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This has the physics backwards — higher frequency modes are HARDER to thermally excite at a given temperature, not easier.",
      c: "n̄'s formula explicitly depends on both ω and T together, via the ratio ħω/k_BT — frequency matters.",
      d: "The Bose-Einstein formula is universal for any harmonic-ish mode — it doesn't depend on which specific hardware platform realizes the qubit.",
    },
    defaultIncorrectFeedback: "Higher ω increases ħω/(k_BT), which makes exp(ħω/k_BT) larger, which makes n̄=1/(exp(ħω/k_BT)-1) SMALLER.",
  },
  hints: [
    { text: "n̄ = 1/(exp(ħω/k_BT) - 1)." },
    { text: "Increasing ω at fixed T increases the exponent ħω/k_BT." },
    { text: "A larger exponent means a larger denominator, hence a SMALLER n̄." },
  ],
  solution: {
    steps: [{ description: "Increasing ω at fixed T increases ħω/k_BT, increasing exp(ħω/k_BT), which decreases n̄=1/(exp(ħω/k_BT)-1) — higher frequency modes are harder to thermally populate." }],
    finalAnswer: "(a) Smaller",
  },
  explanation: {
    correctIdea: "This is exactly the Common Mistakes point from the Cryogenic Systems lesson, tested directly as a quantitative reasoning question.",
    whyCorrect: "Follows directly from the formula's mathematical structure.",
    whyWrong: ["This counterintuitive-sounding result (higher frequency = SAFER from thermal noise) is exactly why the lesson calls it out as a common point of confusion."],
  },
};
