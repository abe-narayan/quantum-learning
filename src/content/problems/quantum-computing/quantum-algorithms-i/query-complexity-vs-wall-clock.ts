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
      ["oracle", "build", "construct", "compil", "implement", "synthesize", "efficient circuit", "error correction", "fault toler", "fault-toler", "overhead", "qubit count", "enough qubits"],
      ["real problem", "real function", "real-world", "real world", "actual function", "actual problem", "actual task", "genuine task", "useful problem", "practice", "hardware", "error correction", "fault toler", "fault-toler", "overhead", "qubit count", "wall-clock", "wall clock", "runtime"],
    ],
    incorrectFeedback: "Ask what the query-count theorems quietly assume you already have, and what it takes to get one for a task someone cares about.",
    partialFeedback: "Good. Be specific: name the thing the theorems treat as free, and say why obtaining it is a separate, nontrivial requirement.",
  },
  hints: [
    { text: "What does query complexity count, and what does it deliberately not count?" },
    { text: "For toy functions like parity, the uncounted part is trivial. Is that still true for a function someone cares about outside the classroom?" },
    { text: "Name the artifact you would have to engineer before the first query can even be made." },
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
