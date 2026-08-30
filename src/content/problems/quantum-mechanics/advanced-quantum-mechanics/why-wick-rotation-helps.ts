import type { ConceptualProblem } from "@/lib/problems/types";

export const whyWickRotationHelps: ConceptualProblem = {
  meta: {
    slug: "why-wick-rotation-helps",
    title: "Why Euclidean Time Makes the Path Sum Numerically Tractable",
    course: "advanced-quantum-mechanics",
    lesson: "quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["path-integral", "conceptual"],
    prerequisites: ["quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain, in terms of the weight e^{iS/ħ} vs. e^{-S_E/ħ}, why real-time path integration resists naive grid integration while the Euclidean version does not.",
    placeholder: "e^{iS/ħ} is a pure phase, which means... while e^{-S_E/ħ} is...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["pure phase", "phase factor", "only a phase", "just a phase", "unit modulus", "modulus 1", "magnitude 1", "oscillat", "does not decay", "never decays", "never decay"],
        missingFeedback:
          "Start with the real-time weight. Say what its size is at each point, and how it behaves as the action grows.",
      },
      {
        phrases: ["real gaussian", "real exponential", "real and positive", "positive real", "real weight", "decays exponentially", "exponentially damped", "damped", "suppress", "falls off", "shrinks with the action", "Gaussian"],
        missingFeedback:
          "You have the real-time weight. Now say what the rotation turns it into, and what that new weight does to paths with large action.",
      },
    ],
    incorrectFeedback: "You said the Euclidean version 'converges better' without saying what the grid is being asked to do in each case. Take the modulus of each weight, and then ask, for each, whether truncating the sum far from the classical path can be justified.",
    partialFeedback: "One weight is described. Do the same for the other, and then say what the difference costs a numerical sum on a finite grid.",
    modelAnswers: [
      "The real-time weight is a pure phase: its magnitude is 1 everywhere and it never decays, so the integral only converges through delicate cancellation between wildly oscillating contributions, which a naive grid cannot capture. The Euclidean weight is a real positive number that decays exponentially, like a Gaussian, so the sum converges easily.",
      "e^{iS/hbar} has unit modulus and just oscillates, so nothing suppresses far-away paths. e^{-S_E/hbar} is real and positive and falls off exponentially with the action, damping those paths so direct numerical integration works.",
    ],
  },
  hints: [
    { text: "Take the modulus of each weight. For one of them the answer does not depend on the path at all; for the other it does." },
    { text: "A finite grid is a truncation. Ask which paths you are allowed to leave out of each sum without changing the answer much." },
    { text: "In one case the far-away contributions are just as big as the ones near the classical path, and the sum only converges through cancellation between neighbours. Say what that costs when the grid is coarse." },
  ],
  solution: {
    steps: [
      { description: "e^{iS/ħ} always has magnitude 1, regardless of how large S is. The integrand never shrinks, so a naive Riemann sum over 'all paths' does not obviously converge; it relies on delicate phase cancellation between nearby paths." },
      { description: "e^{-S_E/ħ} is real and positive, and shrinks rapidly as S_E grows, so a naive Riemann sum converges straightforwardly: the integrand itself decays and distant, high-action paths contribute negligibly." },
      { description: "Wick rotation (τ=it) converts the oscillatory real-time weight into the decaying Euclidean-time weight, trading a numerically delicate oscillatory integral for a numerically easy decaying one, while preserving the same path-sum structure." },
    ],
    finalAnswer: "e^{iS/ħ} never decays in magnitude (pure phase), requiring delicate cancellation to converge; e^{-S_E/ħ} decays like a real Gaussian, converging easily under direct numerical integration.",
  },
  explanation: {
    correctIdea: "This is the precise mathematical reason, not a restatement of 'Euclidean time is easier'. It is the lesson's justification for why this course's worked example is numerically trustworthy.",
    whyCorrect: "A grid sum converges quickly when far-away contributions are small. Under a pure phase they are not small, so convergence relies entirely on neighbouring terms cancelling, and a coarse grid destroys precisely that cancellation. A real decaying weight makes distant paths negligible term by term, so truncation is safe.",
    whyWrong: ["Saying Euclidean time is 'simpler' without identifying the decaying-vs-oscillating distinction misses the actual numerical mechanism."],
  },
};
