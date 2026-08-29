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
      { id: "d", text: "1 - p^N (the chance the circuit does not run clean)" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This is the first-order approximation to p^N, and it is a decent one while N(1-p) stays small. Pushed to large N it goes negative, which no probability can do.",
      c: "This holds only at N=1. Each extra gate is another chance to fail, so overall success strictly falls as N grows.",
      d: "This is the complement: the probability that at least one gate fails. The question asks for the probability they all succeed.",
    },
    defaultIncorrectFeedback: "Independent sequential events combine multiplicatively: overall success requires every gate to succeed, giving p×p×...×p, N times, which is p^N.",
  },
  hints: [
    { text: "Overall success requires ALL N gates to succeed, not just one." },
    { text: "For independent events, the probability all succeed is the PRODUCT of their individual probabilities." },
    { text: "p×p×...×p (N times) = p^N." },
  ],
  solution: {
    steps: [{ description: "Independent sequential successes multiply: P(all N succeed) = p^N." }],
    finalAnswer: "p^N, the product of the N independent per-gate success probabilities.",
  },
  explanation: {
    correctIdea: "Success has to hold at every gate, and independent events that must all hold multiply. That product is what makes circuit fidelity decay exponentially in depth.",
    whyCorrect: "Standard probability theory for independent sequential events.",
    whyWrong: [
      { optionId: "b", text: "Uses the linear approximation to p^N. It tracks the truth while N(1-p) is small and breaks down at large N, which is where the lesson's point bites." },
      { optionId: "c", text: "Ignores depth. Each additional gate multiplies in another factor of p." },
      { optionId: "d", text: "Answers the complementary question, the chance of at least one failure, rather than the chance of none." },
    ],
  },
};
