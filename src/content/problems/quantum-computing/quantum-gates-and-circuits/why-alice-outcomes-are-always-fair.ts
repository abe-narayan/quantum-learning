import type { ConceptualProblem } from "@/lib/problems/types";

export const whyAliceOutcomesAreAlwaysFair: ConceptualProblem = {
  meta: {
    slug: "why-alice-outcomes-are-always-fair",
    title: "Why Alice's Outcomes Must Be Independent of the Message",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/quantum-teleportation",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["teleportation", "no-signaling"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/quantum-teleportation"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Alice's two measurement outcomes in teleportation are always exactly 50/50 each, no matter what $\\alpha$ and $\\beta$ are. Explain why this has to be true, and why teleportation would break physics (specifically, no-signaling) if it weren't.",
    placeholder: "If Alice's outcome statistics depended on the message...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["50/50", "equal probability", "uniform", "independent of"],
        missingFeedback:
          "Start with Alice's own statistics. Say what her two outcome probabilities are, and what they are conspicuously not a function of.",
      },
      {
        phrases: ["signal", "signaling", "faster than light", "instantaneous", "communicate"],
        missingFeedback:
          "You have Alice's statistics. Now say what would go wrong physically if they did depend on the message: name the principle that would be broken.",
      },
      {
        phrases: ["before", "without", "classical bits", "hasn't received", "hasn't arrived"],
        missingFeedback:
          "You have named the principle. Now pin down when Bob is allowed to learn anything: say what has to reach him first, and what his qubit looks like until it does.",
      },
    ],
    incorrectFeedback:
      "You asserted the outcome statistics are fair rather than deriving them. Read the four-branch expansion and compare the four coefficient magnitudes; then ask what Bob could infer from a skewed distribution, and at what moment he could infer it.",
    partialFeedback: "Connect the statistics you found to what Bob would be able to work out, and how soon he could work it out.",
    modelAnswers: [
      "Alice's marginal is 50/50 whatever alpha and beta are, because her outcome probabilities are independent of the message. If they were not, Bob could look at his own qubit's statistics and learn something about the message before Alice's two classical bits ever arrived, which would be faster than light signaling.",
      "Each of Alice's outcomes has equal probability no matter what state she is teleporting. That has to be so: otherwise Bob's side would carry information about the message without the classical bits, and the protocol could be used to communicate instantaneously.",
    ],
  },
  hints: [
    { text: "Write the four-branch expansion out and compare the magnitudes of the four coefficients. Do $\\alpha$ and $\\beta$ appear in them?" },
    { text: "Suppose instead they did depend on the message. Bob holds his half of the pair; what could he learn by tabulating his own results many times?" },
    { text: "Ask when he would learn it, relative to the arrival of Alice's two-bit message. What principle does that timing violate?" },
  ],
  solution: {
    steps: [
      { description: "The four-branch formula's coefficients (before Bob's correction) all have magnitude $\\frac12$, independent of $\\alpha,\\beta$, so each of Alice's four measurement outcomes has probability $\\frac14$ and each individual bit is 50/50." },
      { description: "If this failed, say if outcome $(0,0)$ became more likely for some messages, Bob could in principle learn something about $\\alpha,\\beta$ just from the statistics of Alice's announced outcomes over many runs, without needing her actual classical bits to arrive." },
      { description: "Since Alice could choose her message the instant before measuring, and Bob is arbitrarily far away, this would let information travel faster than light, violating no-signaling." },
    ],
    finalAnswer:
      "The 50/50 property is required for consistency: it guarantees no information about the message leaks to Bob until Alice's classical bits physically arrive.",
  },
  explanation: {
    correctIdea: "Alice's outcome statistics being message-independent is not a coincidence of this particular message state. It is forced by the protocol's structure, and no-signaling requires it.",
    whyCorrect: "The math (equal-magnitude coefficients in the four-branch expansion) and the physics requirement (no faster-than-light signaling) are two views of the same fact.",
  },
};
