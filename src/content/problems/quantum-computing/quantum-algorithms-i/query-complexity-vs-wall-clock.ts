import type { ConceptualProblem } from "@/lib/problems/types";

export const queryComplexityVsWallClock: ConceptualProblem = {
  meta: {
    slug: "query-complexity-vs-wall-clock",
    title: "Query Complexity Is Not the Same as Real-World Speed",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["quantum-advantage", "capstone"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage"],
  },
  question: {
    type: "conceptual",
    prompt: "Name one additional requirement, beyond a good query-complexity bound, that a real quantum algorithm needs before it can actually outperform a classical computer on a genuine task.",
    placeholder: "Think about what 'one query to U_f' actually costs to build in practice...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["oracle", "build", "construct", "efficient circuit"],
      ["real problem", "actual function", "practice", "hardware"],
    ],
    incorrectFeedback: "Think about what it actually takes to turn a real-world function of interest into a working U_f circuit.",
    partialFeedback: "Good — be specific that building an efficient oracle for a real function is itself a nontrivial, separate requirement.",
  },
  hints: [
    { text: "Query complexity counts calls to U_f, not the cost of building U_f itself." },
    { text: "For a toy function (parity, a marked index), building U_f is easy." },
    { text: "For a genuine real-world function, constructing an efficient reversible U_f can be much harder." },
  ],
  solution: {
    steps: [
      { description: "Query complexity theorems assume U_f is simply given, with its cost not counted." },
      { description: "In practice, building an efficient U_f for a real function of interest is a separate, often substantial engineering problem." },
      { description: "Without an efficient oracle construction, a favorable query count doesn't translate into an actual wall-clock speedup." },
    ],
    finalAnswer: "An efficient way to actually build U_f for the real function of interest — query complexity alone assumes this is free.",
  },
  explanation: {
    correctIdea: "The gap between 'provably fewer oracle queries' and 'actually faster in practice' is exactly where oracle construction cost lives.",
    whyCorrect: "This matches the capstone lesson's explicit caveat about what 'quantum advantage' requires beyond the query-count theorems themselves.",
    whyWrong: ["Other valid answers include error correction overhead or hardware qubit counts — any answer identifying a real cost the query-complexity bound doesn't account for is acceptable."],
  },
};
