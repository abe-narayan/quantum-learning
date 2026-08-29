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
      ["factor", "factoring", "b(b,lambda)", "b(b,λ)", "depend only", "depends only", "own setting", "independent of a", "independent of alice", "single value", "same value", "one value"],
      ["break", "no longer", "doesn't hold", "does not hold", "not valid", "invalid", "fails", "falls apart", "cannot group", "can't group"],
    ],
    incorrectFeedback: "Walk through the CHSH derivation line by line and find the one algebraic move that quietly makes an assumption about what Bob's outcome can see.",
    partialFeedback: "You have identified the right step. Now say what it assumed about B, and what goes wrong with that assumption in your friend's model.",
  },
  hints: [
    { text: "Write out the four-term combination S(λ) and try to pull A(a,λ) and A(a',λ) out in front of pairs of terms. What does that regrouping quietly require of B?" },
    { text: "In the regrouped expression, the symbol B(b,λ) appears twice: once next to A(a,λ) and once next to A(a',λ). What must be true for both appearances to stand for one and the same number?" },
    { text: "Suppose Bob's outcome could also see Alice's setting a. Are the two appearances of B(b,λ) still interchangeable?" },
  ],
  solution: {
    steps: [
      { description: "The proof's factoring step groups the four terms as A(a,λ)[B(b,λ)+B(b',λ)]+A(a',λ)[B(b,λ)-B(b',λ)]." },
      { description: "This requires B(b,λ) to be the exact same value whether paired with A(a,λ) or A(a',λ). In other words, B must be independent of Alice's setting." },
      { description: "If Bob's outcome depends on a, there are really two different 'B(b,λ)' values, and the factoring (and hence |S(λ)|=2) breaks down." },
    ],
    finalAnswer: "The factoring step assumes B(b,λ) doesn't depend on a; a nonlocal model violates exactly that assumption, so the proof doesn't apply to it.",
  },
  explanation: {
    correctIdea: "Locality is used at a specific algebraic step, not just as a philosophical label. Removing it invalidates that step directly.",
    whyCorrect: "This is precisely why Bohmian mechanics (a real nonlocal hidden-variable theory) isn't ruled out by Bell's theorem.",
    whyWrong: ["Saying 'nonlocal theories are just different' without identifying the specific broken step doesn't show why the proof's conclusion no longer follows."],
  },
};
