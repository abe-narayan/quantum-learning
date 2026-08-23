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
      ["phase", "magnitude 1", "oscillat", "does not decay"],
      ["real", "decaying", "positive", "Gaussian"],
    ],
    incorrectFeedback: "Address both weights explicitly: what kind of number e^{iS/ħ} is (in terms of magnitude), and what kind of number e^{-S_E/ħ} is.",
    partialFeedback: "Good — now be explicit about why a magnitude-1, oscillating integrand is numerically harder to grid-integrate than a decaying real one.",
  },
  hints: [
    { text: "e^{iS/ħ} always has magnitude exactly 1 (it's a pure phase) — it never gets small no matter how far from the classical path." },
    { text: "e^{-S_E/ħ} is a real, positive number that shrinks rapidly for large S_E." },
    { text: "A naive grid sum over a magnitude-1 oscillating integrand needs delicate cancellation between neighboring grid points to converge; a decaying real integrand just... decays, and truncating the grid is safe." },
  ],
  solution: {
    steps: [
      { description: "e^{iS/ħ} always has magnitude 1, regardless of how large S is — the integrand never shrinks, so a naive Riemann sum over 'all paths' doesn't obviously converge; it relies on delicate phase cancellation between nearby paths." },
      { description: "e^{-S_E/ħ} is real and positive, and shrinks rapidly as S_E grows — a naive Riemann sum converges straightforwardly, since the integrand itself decays and distant, high-action paths contribute negligibly." },
      { description: "Wick rotation (τ=it) converts the oscillatory real-time weight into the decaying Euclidean-time weight, trading a numerically delicate oscillatory integral for a numerically easy decaying one, while preserving the same path-sum structure." },
    ],
    finalAnswer: "e^{iS/ħ} never decays in magnitude (pure phase), requiring delicate cancellation to converge; e^{-S_E/ħ} decays like a real Gaussian, converging easily under direct numerical integration.",
  },
  explanation: {
    correctIdea: "This is the precise mathematical reason, not just a restatement of 'Euclidean time is easier' — the lesson's explicit justification for why this course's worked example is numerically trustworthy.",
    whyCorrect: "Matches the lesson's Mathematical Development section's explicit reasoning.",
    whyWrong: ["Saying Euclidean time is 'simpler' without identifying the decaying-vs-oscillating distinction misses the actual numerical mechanism."],
  },
};
