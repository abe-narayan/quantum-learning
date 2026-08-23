import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const multiplicativeNotAdditiveError: MultipleChoiceProblem = {
  meta: {
    slug: "multiplicative-not-additive-error",
    title: "Does Error Compound Additively or Multiplicatively?",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["scaling"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/scaling-challenges"],
  },
  question: {
    type: "multiple-choice",
    prompt: "For N independent sequential gates each with success probability p, what is the correct overall success probability formula?",
    options: [
      { id: "a", text: "p^N (multiplicative)" },
      { id: "b", text: "1 - N(1-p) (additive/linear)" },
      { id: "c", text: "p (unchanged regardless of N)" },
      { id: "d", text: "p/N" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This linear approximation can even go negative for large N (an impossible probability) — it's not the correct formula, though it can approximate p^N reasonably for SMALL N(1-p).",
      c: "This would only be true for a single gate (N=1) — more gates strictly reduce overall success probability.",
      d: "This isn't a valid probability formula at all — dividing fidelity by gate count has no probabilistic justification.",
    },
    defaultIncorrectFeedback: "Independent sequential events combine multiplicatively: overall success requires EVERY gate to succeed, giving p×p×...×p (N times) = p^N.",
  },
  hints: [
    { text: "Overall success requires ALL N gates to succeed, not just one." },
    { text: "For independent events, the probability all succeed is the PRODUCT of their individual probabilities." },
    { text: "p×p×...×p (N times) = p^N." },
  ],
  solution: {
    steps: [{ description: "Independent sequential successes multiply: P(all N succeed) = p^N." }],
    finalAnswer: "(a) p^N",
  },
  explanation: {
    correctIdea: "This is the specific mathematical structure behind the lesson's entire compounding-error table — confirming the reader understands WHY it's exponential decay, not just that it happens to be.",
    whyCorrect: "Standard probability theory for independent sequential events.",
    whyWrong: ["The additive approximation (b) is a common simplification that breaks down badly for large N, exactly where this lesson's point matters most."],
  },
};
