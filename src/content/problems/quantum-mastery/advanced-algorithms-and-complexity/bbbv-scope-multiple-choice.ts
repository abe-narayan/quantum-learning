import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const bbbvScopeMultipleChoice: MultipleChoiceProblem = {
  meta: {
    slug: "bbbv-scope-multiple-choice",
    title: "What the BBBV Bound Does and Doesn't Establish",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["bqp", "grover", "bbbv", "np"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which statement correctly describes what the BBBV Ω(√N) lower bound establishes about Grover's algorithm and NP-complete problems?",
    options: [
      { id: "a", text: "It proves no quantum algorithm can search an unstructured N-item black box faster than Θ(√N); it says nothing about whether structured NP-complete problems admit a faster quantum algorithm" },
      { id: "b", text: "It proves NP ⊄ BQP unconditionally, since any NP-complete problem can be phrased as an unstructured search" },
      { id: "c", text: "It proves Grover's algorithm is merely the best known approach, not a proven optimum" },
      { id: "d", text: "It applies only to Grover's specific circuit, not to any other possible quantum search algorithm" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This overreaches: BBBV's bound is specific to the black-box query model. Concrete NP-complete instances are structured, not black boxes, so the bound doesn't transfer; NP ⊆ BQP remains open, just as widely disbelieved as P=NP.",
      c: "BBBV's bound is a genuine matching lower bound (not just 'best known so far'), proving Grover's algorithm is exactly query-optimal for unstructured search.",
      d: "BBBV's hybrid-method proof bounds every possible quantum algorithm's query count, not just Grover's specific circuit — that's what makes it a lower bound rather than a property of one implementation.",
    },
    defaultIncorrectFeedback: "Recall the lesson's precise distinction between the black-box query model (where BBBV applies) and structured, explicitly-given problems (where it doesn't).",
  },
  hints: [
    { text: "BBBV's proof technique (the hybrid method) only ever assumes black-box oracle access to the marking function." },
    { text: "A concrete NP-complete instance, like a specific 3-SAT formula, is never actually a black box — its clauses are explicit and inspectable." },
    { text: "The bound rules out a specific kind of generic speedup, not every conceivable structure-exploiting algorithm." },
  ],
  solution: {
    steps: [
      { description: "BBBV proves a query lower bound Ω(√N) for any quantum algorithm solving unstructured search via black-box oracle access." },
      { description: "This matches Grover's O(√N) upper bound, proving query-optimality for unstructured search specifically." },
      { description: "It says nothing about structured problems, where the function isn't a black box and other algorithmic techniques may apply." },
    ],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea: "BBBV is a rigorous, but scope-limited, theorem: optimal for black-box search, silent on structured problems.",
    whyCorrect: "This is exactly the distinction the lesson derives and explicitly contrasts with Shor's algorithm, which succeeds precisely because it exploits structure the oracle model hides by construction.",
    whyWrong: ["Options b, c, and d each either overreach the bound's scope or understate its rigor."],
  },
};
