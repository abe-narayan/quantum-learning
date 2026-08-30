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
      { id: "a", text: "One (x, f(x)) pair, chosen at random, which is what one classical query gives" },
      { id: "b", text: "The complete truth table of f" },
      { id: "c", text: "Whether f is constant or balanced" },
      { id: "d", text: "A value $f(x)$, but with no way to tell which $x$ produced it" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Measurement collapses the superposition to one branch. The other values of f are lost, not read out.",
      c: "That requires the specific interference circuit built in later lessons (Deutsch-Jozsa), not a single immediate measurement.",
      d: "Both registers are measured, and they collapse together: the two outcomes come from the same surviving branch, so the x you read is the x that produced the f(x) you read. The pair arrives matched.",
    },
    defaultIncorrectFeedback: "Think about what measurement does to a superposition, and compare to what one classical query gives.",
  },
  hints: [
    { text: "Measurement of a superposition collapses it to exactly one branch." },
    { text: "That one branch is one specific (x, f(x)) pair." },
    { text: "Compare this to a single classical query at a chosen x." },
  ],
  solution: {
    steps: [{ description: "Immediate measurement collapses the state to one random (x, f(x)) pair: the information one classical query gives, and no more." }],
    finalAnswer: "One (x, f(x)) pair, no more than a single classical query.",
  },
  explanation: {
    correctIdea: "Superposition alone, without a deliberate interference step before measuring, gives no advantage over classical querying.",
    whyCorrect: "The $2^n$ branches are all there before you measure, but measurement is a projection onto one of them, and its probability is uniform: every $x$ is equally likely and none is yours to choose. Parallelism only pays once amplitudes from many branches are made to meet and cancel, which is what an interference step does and what a bare measurement never does.",
    whyWrong: [
      { optionId: "b", text: "Reading off the whole truth table would need the superposition to survive measurement. It doesn't: collapse keeps one branch and discards the rest." },
      { optionId: "c", text: "Deciding constant versus balanced needs the interference circuit built in later lessons, not a query followed immediately by measurement." },
      { optionId: "d", text: "Treats the two registers as collapsing independently. They collapse to the same branch, so the input and output you read off belong to each other." },
    ],
  },
};
