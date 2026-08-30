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
      { id: "a", text: "Smaller: raising ω raises the ratio ħω/k_BT, so the exponential in the denominator grows" },
      { id: "b", text: "Larger: a higher-frequency mode carries more energy per photon, so it holds more thermal energy" },
      { id: "c", text: "No effect: n̄ is set by the fridge temperature alone, with ω fixing only the qubit's gate speed" },
      { id: "d", text: "Smaller: n̄ falls because a higher-frequency photon leaks away into the fridge's cold stages faster" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Energy per photon is not occupation. n̄ counts how many photons the bath puts in the mode, and a mode costing more per photon is harder for a fixed k_BT to populate, not easier.",
      c: "n̄ depends on ω and T together, through the single ratio ħω/k_BT. Holding T fixed and moving ω moves n̄.",
      d: "Right direction, wrong mechanism. This is a statement about T1, how fast an already-present excitation leaves. n̄ is the steady-state count the bath maintains, and it is set by ħω/k_BT alone.",
    },
    defaultIncorrectFeedback: "Raising ω raises ħω/k_BT, which makes exp(ħω/k_BT) larger, which makes n̄ = 1/(exp(ħω/k_BT) − 1) smaller.",
  },
  hints: [
    { text: "n̄ = 1/(exp(ħω/k_BT) - 1)." },
    { text: "Increasing ω at fixed T increases the exponent ħω/k_BT." },
    { text: "That exponent sits in the denominator, so watch which way a larger denominator moves the fraction." },
  ],
  solution: {
    steps: [{ description: "Increasing ω at fixed T increases ħω/k_BT, which increases exp(ħω/k_BT) and so decreases n̄ = 1/(exp(ħω/k_BT) − 1). Higher-frequency modes are harder to populate thermally." }],
    finalAnswer: "n̄ gets smaller: raising ω at fixed T grows the exponential in the denominator of n̄ = 1/(exp(ħω/k_BT) − 1).",
  },
  explanation: {
    correctIdea: "Thermal occupation is set by the ratio ħω/k_BT, so at fixed temperature a higher-frequency mode is quieter, not noisier.",
    whyCorrect: "In the Bose-Einstein formula ω appears only inside exp(ħω/k_BT), which sits in the denominator. Raising ω at fixed T therefore drives that denominator up and n̄ down: a higher-frequency mode is one the bath can afford to populate less often.",
    whyWrong: [
      { optionId: "b", text: "Trades occupation for energy per photon. A costlier photon is one the bath supplies less often." },
      { optionId: "c", text: "Drops ω from the formula. It appears there alongside T, in the ratio ħω/k_BT." },
      { optionId: "d", text: "Lands on the right direction through a decay-rate argument. n̄ is a steady-state occupation, not a rate, and the Bose-Einstein formula reaches it with no reference to how fast excitations leave." },
    ],
  },
};
