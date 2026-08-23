import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const oneQueryInformationLimit: MultipleChoiceProblem = {
  meta: {
    slug: "one-query-information-limit",
    title: "What One Query on a Superposition Actually Reveals",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["quantum-parallelism", "oracle-model"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model"],
  },
  question: {
    type: "multiple-choice",
    prompt: "You apply U_f once to a uniform superposition over all x, then immediately measure both registers. What do you learn?",
    options: [
      { id: "a", text: "One (x, f(x)) pair, chosen randomly — no more than one classical query would give" },
      { id: "b", text: "The complete truth table of f" },
      { id: "c", text: "Whether f is constant or balanced" },
      { id: "d", text: "Nothing at all — the state carries no information about f" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Measurement collapses the superposition to one branch — the other values of f are lost, not read out.",
      c: "That requires the specific interference circuit built in later lessons (Deutsch-Jozsa), not a single immediate measurement.",
      d: "The measured (x, f(x)) pair genuinely is information about f — just not more than one classical query's worth.",
    },
    defaultIncorrectFeedback: "Think about what measurement does to a superposition, and compare to what one classical query gives.",
  },
  hints: [
    { text: "Measurement of a superposition collapses it to exactly one branch." },
    { text: "That one branch is one specific (x, f(x)) pair." },
    { text: "Compare this to a single classical query at a chosen x." },
  ],
  solution: {
    steps: [{ description: "Immediate measurement collapses the state to one random (x, f(x)) pair — exactly the information one classical query gives, no more." }],
    finalAnswer: "(a) — one (x, f(x)) pair, no more than a single classical query.",
  },
  explanation: {
    correctIdea: "Superposition alone, without a deliberate interference step before measuring, gives no advantage over classical querying.",
    whyCorrect: "This is precisely the point the lesson makes: parallelism requires interference to become useful.",
    whyWrong: ["Options b and c both require additional circuit structure (more gates before measurement) that a single query-then-measure sequence doesn't include."],
  },
};
