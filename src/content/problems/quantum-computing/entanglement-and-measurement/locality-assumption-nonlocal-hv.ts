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
      {
        phrases: ["factor", "factoring", "b(b,lambda)", "b(b,λ)", "depend only", "depends only", "independent of a", "independent of alice", "single value", "same value", "one value"],
        missingFeedback:
          "You have said the proof breaks. Point at the line: which algebraic move in the derivation of |S(lambda)|=2 quietly needs Bob's outcome to be one fixed thing?",
      },
      {
        phrases: ["no longer", "doesn't hold", "does not hold", "not valid", "invalid", "fails", "falls apart", "cannot group", "can't group", "can not group", "doesn't apply", "does not apply", "cannot be pulled out", "the step is invalid"],
        missingFeedback:
          "You have located the step. Now say what actually happens to it once Bob's function is allowed to see Alice's setting, and therefore what the inequality does or does not cover.",
      },
    ],
    incorrectFeedback: "You appealed to relativity or to a no faster-than-light signalling principle, which is a motivation for the assumption rather than the place it is used. The derivation makes one algebraic move that silently needs the far side's outcome to stand for the same number in two different terms; find that move.",
    partialFeedback: "You have identified the right step. Now say what it assumed about B, and what goes wrong with that assumption in your friend's model.",
    modelAnswers: [
      "The proof factors B out of the CHSH sum, and that step only works if B(b,lambda) is the same value whatever Alice picked. If Bob's outcome depends on a you cannot group the terms that way, so the factoring step is invalid and the bound never gets proved.",
      "Locality enters at the factoring step: it assumes B depends only on b and lambda, independent of Alice's setting. A nonlocal model breaks exactly that, so the derivation of |S|=2 no longer holds for it.",
    ],
  },
  hints: [
    { text: "Write out the four-term combination S(λ) and try to pull Alice's two outcome values out in front of pairs of terms. What does that regrouping quietly require of the far side's outcome?" },
    { text: "In the regrouped expression, the far side's outcome for one setting appears twice, once next to each of Alice's. What must hold for the two appearances to stand for the very same number?" },
    { text: "Suppose that outcome could also see Alice's setting. Are the two appearances still interchangeable, and what does that do to the regrouping?" },
  ],
  solution: {
    steps: [
      { description: "The proof's factoring step groups the four terms as A(a,λ)[B(b,λ)+B(b',λ)]+A(a',λ)[B(b,λ)-B(b',λ)]." },
      { description: "This requires B(b,λ) to be the exact same value whether paired with A(a,λ) or A(a',λ). In other words, B must be independent of Alice's setting." },
      { description: "If Bob's outcome depends on a, there are two different 'B(b,λ)' values, and the factoring (and hence |S(λ)|=2) breaks down." },
    ],
    finalAnswer: "The factoring step assumes B(b,λ) doesn't depend on a; a nonlocal model violates exactly that assumption, so the proof doesn't apply to it.",
  },
  explanation: {
    correctIdea: "Locality is used at a specific algebraic step, not just as a philosophical label. Removing it invalidates that step directly.",
    whyCorrect: "This is precisely why Bohmian mechanics (a real nonlocal hidden-variable theory) isn't ruled out by Bell's theorem.",
    whyWrong: ["Saying 'nonlocal theories are just different' without identifying the specific broken step doesn't show why the proof's conclusion no longer follows."],
  },
};
