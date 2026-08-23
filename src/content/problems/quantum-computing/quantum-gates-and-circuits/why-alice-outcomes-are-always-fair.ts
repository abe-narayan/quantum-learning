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
      ["50/50", "equal probability", "uniform", "independent of"],
      ["signal", "signaling", "faster than light", "instantaneous", "communicate"],
      ["before", "without", "classical bits", "hasn't received", "hasn't arrived"],
    ],
    incorrectFeedback:
      "Address both halves: (1) why the four-branch formula forces Alice's marginal outcome probabilities to be exactly 50/50 regardless of $\\alpha,\\beta$, and (2) what Bob could do with that information (before receiving Alice's classical bits) if it weren't.",
    partialFeedback: "Good start — make sure you connect the 50/50 fact specifically to why it prevents faster-than-light signaling to Bob.",
  },
  hints: [
    { text: "Look at the four-branch formula: each of the four terms has the same coefficient magnitude ($\\frac12$), regardless of $\\alpha,\\beta$." },
    { text: "If Alice's outcome distribution changed depending on the message she was sending, Bob could learn something about the message just by knowing that distribution." },
    { text: "Bob would know this before Alice's classical bits (which travel at ordinary speed) reach him — that's exactly what \"no faster-than-light signaling\" forbids." },
  ],
  solution: {
    steps: [
      { description: "The four-branch formula's coefficients (before Bob's correction) all have magnitude $\\frac12$, independent of $\\alpha,\\beta$ — so each of Alice's four measurement outcomes is exactly $\\frac14$, and each individual bit is exactly 50/50." },
      { description: "If this weren't true — if, say, outcome $(0,0)$ became more likely for some messages — Bob could, in principle, learn something about $\\alpha,\\beta$ just from the statistics of Alice's announced outcomes over many runs, without needing her actual classical bits to arrive." },
      { description: "Since Alice could choose her message the instant before measuring, and Bob is arbitrarily far away, this would let information travel faster than light — violating no-signaling." },
    ],
    finalAnswer:
      "The 50/50 property is required for consistency: it guarantees no information about the message leaks to Bob until Alice's classical bits physically arrive.",
  },
  explanation: {
    correctIdea: "Alice's outcome statistics being message-independent is not a coincidence of this particular message state — it's forced by the protocol's structure and is required for no-signaling to hold.",
    whyCorrect: "The math (equal-magnitude coefficients in the four-branch expansion) and the physics requirement (no faster-than-light signaling) are two views of the same fact.",
  },
};
