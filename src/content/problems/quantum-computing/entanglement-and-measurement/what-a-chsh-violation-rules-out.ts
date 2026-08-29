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
      ["local hidden variable", "local hidden-variable", "local hidden var", "lhv", "every local", "all local", "any local", "local theor", "local model", "local realis", "locally realistic"],
      {
        phrases: [
          "nonlocal",
          "non-local",
          "bohm",
          "de broglie",
          "pilot wave",
          "pilot-wave",
          "not ruled out",
          "untouched",
          "unaffected",
          "says nothing about",
          "still allowed",
          "still viable",
          "doesn't rule out",
          "does not rule out",
          "cannot rule out",
          "left standing",
          "survive",
        ],
        missingFeedback:
          "You have named what the violation excludes. The question also asks what escapes: theories that drop the locality assumption, such as Bohmian mechanics, were never covered by the proof, so a measured |S|>2 leaves them standing.",
      },
    ],
    incorrectFeedback: "Recall what the CHSH inequality proof assumed: a class of theories defined by one specific property, not 'classical physics' in general.",
    partialFeedback: "Good start. Name both halves explicitly: which category is excluded, and which specific kind of alternative escapes.",
  },
  hints: [
    { text: "What defining assumption did the CHSH derivation make about how each side's outcome may depend on the measurement settings? The proof covers every theory sharing that assumption." },
    { text: "A measured |S|>2 therefore condemns an entire category of models at once. Which category, defined by which property?" },
    { text: "Now think of hidden-variable theories that reject that assumption. Did the derivation ever constrain them?" },
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
