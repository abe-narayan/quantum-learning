import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const provablyOptimalVsBestKnown: MultipleChoiceProblem = {
  meta: {
    slug: "provably-optimal-vs-best-known",
    title: "Grover's Optimality vs. Deutsch-Jozsa's Separation",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["quantum-advantage", "capstone"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which statement correctly distinguishes Grover's optimality result from Deutsch-Jozsa's exponential separation?",
    options: [
      { id: "a", text: "Grover's Ω(√N) lower bound is proven for any quantum algorithm; Deutsch-Jozsa's speedup only holds for its specific engineered promise problem" },
      { id: "b", text: "Deutsch-Jozsa's speedup is proven optimal; Grover's is merely the best known so far" },
      { id: "c", text: "Both are proven optimal for their respective problems" },
      { id: "d", text: "Neither result has been proven — both are experimentally observed only" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This reverses the two results — it's Grover's bound that's proven optimal, not Deutsch-Jozsa's.",
      c: "Deutsch-Jozsa's exponential gap is real but specific to its promise structure, not a proven lower bound against every possible classical or quantum approach to a broader problem class.",
      d: "Both results are mathematical theorems, derived and (in Grover's case) proven optimal — not experimental observations.",
    },
    defaultIncorrectFeedback: "Recall which of the two lessons mentioned a proven Ω(√N) lower bound for unstructured search specifically.",
  },
  hints: [
    { text: "The capstone lesson specifically credits a proven lower bound to unstructured search." },
    { text: "That lower bound applies to Grover's problem, not Deutsch-Jozsa's." },
    { text: "Deutsch-Jozsa's advantage instead depends on its promise being satisfied." },
  ],
  solution: {
    steps: [{ description: "Grover's Ω(√N) bound is a proven fact about unstructured search generally; Deutsch-Jozsa's speedup is specific to its promise problem." }],
    finalAnswer: "Grover's Ω(√N) lower bound is proven against any quantum algorithm; Deutsch-Jozsa's separation is tied to its engineered promise.",
  },
  explanation: {
    correctIdea: "Optimality (proven best possible) and separation (a specific algorithm beating a specific classical bound) are different strengths of claim.",
    whyCorrect: "This distinction is exactly what the capstone lesson's 'why Grover's speedup is optimal' section establishes.",
    whyWrong: [
      { optionId: "b", text: "Reverses the two results. Grover's bound is the one proven optimal." },
      { optionId: "c", text: "Deutsch-Jozsa's exponential gap is real but specific to its promise structure, not a proven lower bound over a broader problem class." },
      { optionId: "d", text: "Both results are mathematical theorems, not experimental observations." },
    ],
  },
};
