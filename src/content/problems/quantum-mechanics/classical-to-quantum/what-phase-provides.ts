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
    { text: "A sign has exactly two values; interference varies smoothly as position changes." },
  ],
  solution: {
    steps: [
      { description: "A real sign is a 2-valued choice — full constructive or full destructive interference only." },
      { description: "A complex phase θ∈[0,2π) is continuously adjustable, and the interference cross term depends on cos(θ), sweeping smoothly through every intermediate value." },
    ],
    finalAnswer: "A complex phase supplies a continuum of interference strengths; a sign bit cannot.",
  },
  explanation: {
    correctIdea: "The experimentally observed smooth fringe pattern requires a continuously-adjustable parameter.",
    whyCorrect: "This is exactly the lesson's central derivation, restated as a multiple-choice check.",
    whyWrong: ["The other options describe things phase does NOT do — it never breaks normalization or makes |z|² negative."],
  },
};
