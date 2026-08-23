import type { ConceptualProblem } from "@/lib/problems/types";

export const whatAChshViolationRulesOut: ConceptualProblem = {
  meta: {
    slug: "what-a-chsh-violation-rules-out",
    title: "What a Measured CHSH Violation Actually Rules Out",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/the-chsh-inequality",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["chsh", "bell-theorem", "conceptual"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/the-chsh-inequality"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A real laboratory experiment measures |S|>2. Explain why this is a stronger conclusion than 'quantum mechanics is confirmed' — what specific class of alternative theories does it rule out, and which class does it leave untouched?",
    placeholder: "Think about what the CHSH inequality was actually proven to bound...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["local hidden variable", "local hidden-variable", "lhv", "local", "every local"],
      ["nonlocal", "bohmian", "not ruled out", "untouched"],
    ],
    incorrectFeedback: "Recall exactly what the CHSH inequality proof assumed — a class of theories defined by a specific property, not 'classical physics' in general.",
    partialFeedback: "Good start — name both halves explicitly: which category is excluded, and which specific alternative survives.",
  },
  hints: [
    { text: "The CHSH inequality was proven for the entire category of local hidden-variable (LHV) models, not one specific model." },
    { text: "A measured |S|>2 therefore rules out every theory in that category at once, without needing to check each one individually." },
    { text: "Nonlocal hidden-variable theories, like Bohmian mechanics, were never covered by the proof, so they're untouched." },
  ],
  solution: {
    steps: [
      { description: "The CHSH inequality's proof covers every possible local hidden-variable (LHV) model, not just one specific classical guess." },
      { description: "A measured |S|>2 therefore rules out the entire category of LHV theories simultaneously, not merely 'a' classical explanation." },
      { description: "Nonlocal hidden-variable theories (e.g. Bohmian mechanics) were never covered by the proof's locality assumption, so a CHSH violation says nothing about them." },
    ],
    finalAnswer: "It rules out every local hidden-variable theory at once, but says nothing about nonlocal hidden-variable theories.",
  },
  explanation: {
    correctIdea: "Bell's theorem's power comes from covering an entire category of theories with one proof, not from testing one specific alternative.",
    whyCorrect: "This is precisely why physicists treat CHSH violations as ruling out local realism in general, rather than just disproving one particular classical model.",
    whyWrong: ["Saying it 'proves quantum mechanics is correct' overstates the result — it specifically rules out local hidden-variable theories, not every conceivable alternative."],
  },
};
