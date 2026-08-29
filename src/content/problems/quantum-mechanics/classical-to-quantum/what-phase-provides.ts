import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const whatPhaseProvides: MultipleChoiceProblem = {
  meta: {
    slug: "what-phase-provides",
    title: "What a Complex Phase Provides",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/why-complex-amplitudes",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["complex-amplitudes"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/why-complex-amplitudes"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What does a complex phase provide for interference that a real signed amplitude's sign (±) cannot?",
    options: [
      { id: "a", text: "A continuum of values continuously tuning interference strength" },
      { id: "b", text: "A way to make probabilities negative" },
      { id: "c", text: "A way to avoid the normalization condition" },
      { id: "d", text: "A second discrete two-valued choice, like the sign itself" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Probabilities are still always |amplitude|² ≥ 0 — phase never makes a probability negative.",
      c: "Phase and normalization are unrelated; |z| (not the phase) is what normalization constrains.",
      d: "A sign already provides a two-valued choice — the point of phase is that it's a *continuum*, not another binary option.",
    },
    defaultIncorrectFeedback: "Think about how many distinct interference outcomes a sign bit can produce, versus a continuously adjustable angle.",
  },
  hints: [
    { text: "Count the distinct values a sign can take, then count the distinct values a phase angle can take." },
    { text: "Interference between two amplitudes shows up in a cross term that depends on their relative phase." },
    { text: "A real fringe pattern varies smoothly across the screen. Ask how many settings the interference term needs to reproduce that." },
  ],
  solution: {
    steps: [
      { description: "A real sign is a 2-valued choice — full constructive or full destructive interference only." },
      { description: "A complex phase θ∈[0,2π) is continuously adjustable, and the interference cross term depends on cos(θ), sweeping smoothly through every intermediate value." },
    ],
    finalAnswer: "A continuum of interference strengths, which a two-valued sign cannot supply.",
  },
  explanation: {
    correctIdea: "The smooth fringe pattern seen in experiment needs an interference term that varies continuously, and a sign offers only two settings.",
    whyCorrect: "Matches the lesson's central derivation: the cross term carries cos(θ), which sweeps every value between −1 and 1 as θ turns.",
    whyWrong: [
      { optionId: "b", text: "Probabilities stay |amplitude|² and so stay non-negative, whatever the phase." },
      { optionId: "c", text: "Normalization constrains the magnitude |z|, which a phase leaves untouched." },
      { optionId: "d", text: "Adds a second binary choice, which would give four settings rather than a continuum." },
    ],
  },
};
