import type { ConceptualProblem } from "@/lib/problems/types";

export const localityAssumptionNonlocalHv: ConceptualProblem = {
  meta: {
    slug: "locality-assumption-nonlocal-hv",
    title: "Why Nonlocal Hidden-Variable Theories Escape Bell's Theorem",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["bell-theorem", "conceptual"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A friend proposes a hidden-variable model where Bob's outcome function is allowed to depend on Alice's setting a as well as Bob's own setting b. Explain, citing the specific step in the CHSH proof that would break, why this model is not covered by the inequality proven in this lesson.",
    placeholder: "Think about the factoring step in the proof of |S(λ)|=2...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["factor", "factoring", "b(b,\\lambda)", "depend only", "own setting"],
      ["breaks", "no longer", "doesn't hold", "not valid"],
    ],
    incorrectFeedback: "Point to the exact algebraic step where the proof groups terms by A(a,λ) and A(a',λ) — what does it assume about B?",
    partialFeedback: "You're close — be specific that the factoring step assumed B(b,λ) doesn't change depending on which A-setting is paired with it.",
  },
  hints: [
    { text: "The proof factored S(λ) into A(a,λ)[B(b,λ)+B(b',λ)] + A(a',λ)[B(b,λ)-B(b',λ)]." },
    { text: "This factoring implicitly assumes B(b,λ) is the same number whether it's paired with A(a,λ) or A(a',λ)." },
    { text: "If B secretly depends on a too, there would be two different values of 'B(b,λ)' in that expression, and the factoring step is no longer valid." },
  ],
  solution: {
    steps: [
      { description: "The proof's factoring step groups the four terms as A(a,λ)[B(b,λ)+B(b',λ)]+A(a',λ)[B(b,λ)-B(b',λ)]." },
      { description: "This requires B(b,λ) to be the exact same value whether paired with A(a,λ) or A(a',λ) — i.e., independent of Alice's setting." },
      { description: "If Bob's outcome depends on a, there are really two different 'B(b,λ)' values, and the factoring (and hence |S(λ)|=2) breaks down." },
    ],
    finalAnswer: "The factoring step assumes B(b,λ) doesn't depend on a; a nonlocal model violates exactly that assumption, so the proof doesn't apply to it.",
  },
  explanation: {
    correctIdea: "Locality is used at a specific algebraic step, not just as a philosophical label — removing it invalidates that step directly.",
    whyCorrect: "This is precisely why Bohmian mechanics (a real nonlocal hidden-variable theory) isn't ruled out by Bell's theorem.",
    whyWrong: ["Saying 'nonlocal theories are just different' without identifying the specific broken step doesn't show why the proof's conclusion no longer follows."],
  },
};
