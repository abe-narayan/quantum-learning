import type { ConceptualProblem } from "@/lib/problems/types";

export const unitaryAsSpecialKrausCase: ConceptualProblem = {
  meta: {
    slug: "unitary-as-special-kraus-case",
    title: "Why Unitary Evolution Is a Special Case of Kraus Channels",
    course: "advanced-quantum-mechanics",
    lesson: "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["open-systems", "conceptual"],
    prerequisites: ["quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators"],
  },
  question: {
    type: "conceptual",
    prompt: "Show that ordinary unitary evolution ρ→UρU† is the special case of the Kraus representation with exactly one Kraus operator, K₀=U.",
    placeholder: "Setting K₀=U, the trace-preservation condition becomes...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["K_0 = U", "K₀=U", "single operator", "one kraus"],
      ["U†U=I", "unitary", "automatically satisfies"],
    ],
    incorrectFeedback: "Substitute K₀=U into the general Kraus sum and trace-preservation condition, and show both reduce to familiar unitary-evolution facts.",
    partialFeedback: "Good — make sure you show the trace-preservation condition reduces to U's own unitarity condition.",
  },
  hints: [
    { text: "With one Kraus operator K₀=U, the sum ΣK_kρK_k† has only one term." },
    { text: "sum K_k†K_k=I becomes just K₀†K₀=U†U." },
    { text: "U†U=I is exactly the definition of U being unitary." },
  ],
  solution: {
    steps: [
      { description: "With a single Kraus operator K₀=U, the general sum Σ_kK_kρK_k† collapses to just K₀ρK₀†=UρU†, the ordinary unitary evolution rule." },
      { description: "The trace-preservation condition Σ_kK_k†K_k=I collapses to K₀†K₀=U†U." },
      { description: "U†U=I is exactly the defining property of a unitary matrix — so the trace-preservation condition is automatically satisfied whenever U is unitary, with no extra constraint needed." },
    ],
    finalAnswer: "Setting K₀=U reduces the Kraus sum to UρU† and the trace-preservation condition to U†U=I — exactly U's own unitarity, showing unitary evolution is the one-operator special case.",
  },
  explanation: {
    correctIdea: "This makes precise the lesson's claim that Kraus channels 'generalize, not replace' unitary evolution — every unitary evolution IS a (trivial) Kraus channel.",
    whyCorrect: "Matches the lesson's Mathematical Development section's explicit statement of this special case.",
    whyWrong: ["Claiming unitary evolution and Kraus evolution are unrelated frameworks misses that the former is literally a special case of the latter, not a separate rule."],
  },
};
