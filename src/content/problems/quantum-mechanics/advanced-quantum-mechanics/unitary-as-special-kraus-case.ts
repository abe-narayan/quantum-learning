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
      {
        phrases: ["K_0 = U", "single operator", "one kraus", "only one kraus operator", "single kraus"],
        missingFeedback:
          "Say how many Kraus operators the special case uses, and what you set that operator to.",
      },
      // Bare "unitary" is in the prompt itself, so every submission matched this
      // group and the problem graded on the first group alone. The phrases below
      // require the trace-preservation reduction the question actually asks for.
      {
        phrases: ["U†U=I", "U†U = I", "U dagger U = I", "unitarity", "trace preservation", "trace-preservation", "trace preserving", "definition of unitary", "defining property of U", "automatically satisfies", "automatically satisfied"],
        missingFeedback:
          "You have the operator. Now check the condition every Kraus channel has to satisfy, and say what it turns into here and why it costs nothing.",
      },
    ],
    incorrectFeedback: "You quoted the general Kraus form and stopped. The exercise is a substitution: put a one-element set into both of the channel's defining equations and simplify each until nothing about channels is left in it.",
    partialFeedback: "You have the substitution into the evolution equation. The second condition is still open: put the same one-element set into the completeness sum and say what familiar equation drops out.",
    modelAnswers: [
      "Take a single Kraus operator K_0 = U. The Kraus sum then has just one term and reads U rho U-dagger, which is ordinary unitary evolution. The trace-preservation condition becomes U-dagger U = I, which is automatically satisfied by the definition of unitary.",
      "With only one Kraus operator, set K_0 = U. The channel is U rho U-dagger, and trace preservation reduces to U dagger U = I, which is U's own unitarity, so nothing extra is required.",
    ],
  },
  hints: [
    { text: "Write the general channel with the index running over exactly one value. How many terms does the sum have?" },
    { text: "Now write the completeness condition the same way. It also collapses to a single term." },
    { text: "Set that one element equal to U in both collapsed expressions. The first becomes the ordinary evolution law; the second becomes an equation you already know by another name." },
  ],
  solution: {
    steps: [
      { description: "With a single Kraus operator K₀=U, the general sum Σ_kK_kρK_k† collapses to just K₀ρK₀†=UρU†, the ordinary unitary evolution rule." },
      { description: "The trace-preservation condition Σ_kK_k†K_k=I collapses to K₀†K₀=U†U." },
      { description: "U†U=I is the defining property of a unitary matrix, so the trace-preservation condition is automatically satisfied whenever U is unitary, with no extra constraint needed." },
    ],
    finalAnswer: "Setting K₀=U reduces the Kraus sum to UρU† and the trace-preservation condition to U†U=I, which is U's own unitarity. Unitary evolution is the one-operator special case.",
  },
  explanation: {
    correctIdea: "This makes precise the lesson's claim that Kraus channels 'generalize, not replace' unitary evolution: every unitary evolution IS a trivial Kraus channel.",
    whyCorrect: "With one Kraus operator the sum has a single term and the completeness condition has a single factor, so both reduce to statements about U alone. Nothing is added or lost: the general formalism collapses exactly onto the special case.",
    whyWrong: ["Claiming unitary evolution and Kraus evolution are unrelated frameworks misses that the former is a special case of the latter, not a separate rule."],
  },
};
