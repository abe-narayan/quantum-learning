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
      { id: "a", text: "It proves Θ(√N) is optimal for unstructured black-box search, and leaves the structured NP-complete case an open question" },
      { id: "b", text: "It proves NP ⊄ BQP unconditionally, since any NP-complete problem can be phrased as an unstructured search over its solution space" },
      { id: "c", text: "It bounds every algorithm that queries the oracle, so it also bounds one that first builds an oracle from a 3-SAT formula" },
      { id: "d", text: "It applies to Grover's circuit rather than to every possible quantum search algorithm, so another circuit could still beat it" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This overreaches: BBBV's bound is specific to the black-box query model. Concrete NP-complete instances are structured, not black boxes, so the bound doesn't transfer; NP ⊆ BQP remains open, just as widely disbelieved as P=NP.",
      c: "Building an oracle out of a formula and then querying it is one strategy, and the bound does constrain that strategy. It says nothing about an algorithm that reads the clauses directly instead of hiding them behind a query interface, which is what makes the structured case open.",
      d: "BBBV's hybrid-method proof bounds the query count of every quantum algorithm, not of one circuit. That is what makes it a lower bound rather than a property of a particular implementation.",
    },
    defaultIncorrectFeedback: "Recall the lesson's precise distinction between the black-box query model (where BBBV applies) and structured, explicitly-given problems (where it doesn't).",
  },
  hints: [
    { text: "BBBV's proof technique (the hybrid method) only ever assumes black-box oracle access to the marking function." },
    { text: "A concrete NP-complete instance, like a specific 3-SAT formula, is never a black box: its clauses are explicit and inspectable." },
    { text: "The bound rules out a specific kind of generic speedup, not every conceivable structure-exploiting algorithm." },
  ],
  solution: {
    steps: [
      { description: "BBBV proves a query lower bound Ω(√N) for any quantum algorithm solving unstructured search via black-box oracle access." },
      { description: "This matches Grover's O(√N) upper bound, proving query-optimality for unstructured search specifically." },
      { description: "It says nothing about structured problems, where the function isn't a black box and other algorithmic techniques may apply." },
    ],
    finalAnswer: "It proves Θ(√N) optimality for unstructured black-box search, and says nothing about structured NP-complete problems.",
  },
  explanation: {
    correctIdea: "BBBV is a rigorous, but scope-limited, theorem: optimal for black-box search, silent on structured problems.",
    whyCorrect: "BBBV bounds what an algorithm can do when querying is all it may do. Shor's algorithm sits outside that setting entirely, since it exploits structure the oracle model hides by construction, so no tension arises between the two results.",
    whyWrong: [
      { optionId: "b", text: "Overreaches the bound's scope. Concrete NP-complete instances are structured, not black boxes, so the bound doesn't transfer and NP ⊆ BQP stays open." },
      { optionId: "c", text: "Assumes the only route to a 3-SAT instance is through an oracle. An algorithm that inspects the clauses is outside the model the bound constrains." },
      { optionId: "d", text: "Narrows the bound to one circuit. The hybrid-method proof constrains every possible quantum algorithm's query count." },
    ],
  },
};
