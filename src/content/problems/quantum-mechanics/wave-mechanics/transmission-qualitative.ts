import type { ConceptualProblem } from "@/lib/problems/types";

export const transmissionQualitative: ConceptualProblem = {
  meta: {
    slug: "transmission-qualitative",
    title: "How Barrier Width Affects Transmission",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["tunneling", "barrier"],
    prerequisites: ["quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Using the approximate transmission scale e^(-2*kappa*a), explain in one or two sentences what happens to tunneling probability as barrier width a increases, and why this matches the observation that tunneling is negligible for macroscopic barriers.",
    placeholder: "Explain the effect of barrier width on transmission...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["decreases exponentially", "falls off exponentially", "shrinks rapidly"],
      ["macroscopic", "wide barrier", "everyday", "negligible for large a"],
    ],
    incorrectFeedback: "Name both pieces: that transmission falls off exponentially as barrier width a increases, and that this explains why tunneling is negligible for wide, macroscopic barriers.",
    partialFeedback: "You're partway there — connect the exponential falloff explicitly to why macroscopic barriers essentially never show tunneling.",
  },
  hints: [{ text: "How does e^(-2*kappa*a) behave as a grows large, for any fixed positive kappa?" }],
  solution: {
    steps: [
      { description: "As $a$ increases, $e^{-2\\kappa a}$ decreases exponentially (not linearly) toward zero." },
      { description: "For a macroscopic barrier, $a$ is astronomically large compared to atomic length scales, making transmission utterly negligible." },
    ],
    finalAnswer: "Transmission decreases exponentially with barrier width — negligibly small for any macroscopic barrier, but potentially significant for atomic-scale barriers.",
  },
  explanation: {
    correctIdea: "The exponential sensitivity of tunneling to barrier width is exactly why it matters at atomic scales and is unobservable at everyday scales.",
    whyCorrect: "This directly explains real phenomena like alpha decay (tunneling through a nuclear barrier) versus the complete absence of macroscopic wall-tunneling.",
    whyWrong: ["Saying transmission 'decreases slowly' or 'linearly' misses that the exponential falloff is dramatically faster than any linear or polynomial decrease."],
  },
};
