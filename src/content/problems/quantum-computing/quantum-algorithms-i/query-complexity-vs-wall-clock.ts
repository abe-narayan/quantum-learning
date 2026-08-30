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
      // Five phrases ("error correction", "fault toler", "fault-toler",
      // "overhead", "qubit count") appeared verbatim in both groups, so any
      // answer containing one of them satisfied both and this two-idea problem
      // graded on one idea. They belong to the practical-cost group only.
      {
        phrases: ["oracle", "build", "construct", "compil", "implement", "synthesize", "efficient circuit"],
        missingFeedback:
          "A query bound counts calls to something. Name that something, and say what still has to happen before you can make even one such call on a real machine.",
      },
      {
        phrases: ["real problem", "real function", "real-world", "real world", "actual function", "actual problem", "actual task", "genuine task", "useful problem", "function of interest", "separate requirement", "separate problem", "engineering problem", "assumed to be free", "assumes it is free", "treated as free", "practice", "hardware", "error correction", "fault toler", "fault-toler", "overhead", "qubit count", "enough qubits", "wall-clock", "wall clock", "runtime"],
        missingFeedback:
          "You have named the missing piece. Now anchor it: say for what kind of task it has to be provided, or what else about a physical device the query count leaves out.",
      },
    ],
    incorrectFeedback: "Ask what the query-count theorems quietly assume you already have, and what it takes to get one for a task someone cares about.",
    partialFeedback: "Name the thing the theorems hand you for nothing, and say why obtaining it is a whole engineering job of its own.",
    modelAnswers: [
      "You still need an efficient way to actually build the oracle circuit for the real function you care about. Query complexity treats one call to U_f as free, but in practice you have to compile it, and that cost can swamp the saving.",
      "Somebody has to construct U_f for the actual problem, on real hardware, with error correction and enough qubits. That is a separate engineering problem the query model assumes away.",
    ],
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
    finalAnswer: "An efficient way to build U_f for the function of interest. Query complexity alone assumes that construction is free.",
  },
  explanation: {
    correctIdea: "The gap between 'provably fewer oracle queries' and 'actually faster in practice' is exactly where oracle construction cost lives.",
    whyCorrect: "This matches the capstone lesson's explicit caveat about what 'quantum advantage' requires beyond the query-count theorems themselves.",
    whyWrong: ["Other valid answers include error-correction overhead or hardware qubit counts. Any answer naming a real cost the query-complexity bound does not account for is acceptable."],
  },
};
