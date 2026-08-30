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
      {
        phrases: ["decreases exponentially", "falls off exponentially", "shrinks rapidly"],
        missingFeedback:
          "Say how the transmission behaves as the width grows, and be specific about the functional form rather than just saying it gets smaller.",
      },
      {
        phrases: ["macroscopic", "wide barrier", "everyday", "negligible for large a"],
        missingFeedback:
          "You have the trend. Now connect it to experience: say what that trend implies for a barrier of ordinary size, and why the effect is only ever seen at tiny scales.",
      },
    ],
    incorrectFeedback: "You described what tunneling is rather than how it scales with a. Reason about the exponent -2*kappa*a itself: doubling a does not halve the transmission, it squares it. Then ask what that does over an a of one millimetre.",
    partialFeedback: "One half. The other half is the payoff: put a real number in for a and say what the result means for objects you can actually see.",
    modelAnswers: [
      "Transmission decreases exponentially with barrier width. Doubling the width squares the suppression, so for anything macroscopic the exponent is enormous and the probability is negligible; only at atomic scales is a barrier thin enough for it to matter.",
      "It falls off exponentially as a grows. For an everyday, wide barrier the number is unimaginably small, which is why you never see tunneling at human scales.",
    ],
  },
  hints: [
    { text: "Fix kappa and treat e^(-2*kappa*a) as a function of a alone. Is a inside the exponent or outside it?" },
    { text: "Compare two thicknesses differing by a factor of ten and take the ratio of the two transmissions. It is not ten." },
    { text: "Now put physical numbers in: kappa for an electron facing a few-eV wall is a few inverse angstroms. Evaluate the exponent for a wall one centimetre thick." },
  ],
  solution: {
    steps: [
      { description: "As $a$ increases, $e^{-2\\kappa a}$ decreases exponentially (not linearly) toward zero." },
      { description: "For a macroscopic barrier, $a$ is astronomically large compared to atomic length scales, making transmission utterly negligible." },
    ],
    finalAnswer: "Transmission decreases exponentially with barrier width: negligibly small for any macroscopic barrier, but appreciable for atomic-scale ones.",
  },
  explanation: {
    correctIdea: "The exponential sensitivity of tunneling to barrier width is why it matters at atomic scales and is unobservable at everyday scales.",
    whyCorrect: "This directly explains real phenomena like alpha decay (tunneling through a nuclear barrier) versus the complete absence of macroscopic wall-tunneling.",
    whyWrong: ["Saying transmission 'decreases slowly' or 'linearly' misses that the exponential falloff is dramatically faster than any linear or polynomial decrease."],
  },
};
