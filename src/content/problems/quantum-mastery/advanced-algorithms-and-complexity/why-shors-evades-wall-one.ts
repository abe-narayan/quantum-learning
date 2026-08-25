import type { ConceptualProblem } from "@/lib/problems/types";

export const whyShorsEvadesWallOne: ConceptualProblem = {
  meta: {
    slug: "why-shors-evades-wall-one",
    title: "Why Shor's Algorithm Evades the Oracle-Separation Wall",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/capstone-what-scale-actually-requires",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["capstone", "synthesis", "shors-algorithm"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/capstone-what-scale-actually-requires"],
  },
  question: {
    type: "conceptual",
    prompt: "Module 1 showed that Deutsch-Jozsa's and Simon's algorithms' speedups are oracle-relative, not unconditional proof of quantum advantage on real problems, and that BBBV's bound only rules out black-box search. Explain precisely why Shor's algorithm is not vulnerable to either critique — what specifically about factoring makes it different from an unstructured black-box promise problem?",
    placeholder: "Think about whether factoring's structure is ever hidden from the algorithm the way an oracle hides f...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["structure", "structured", "not a black box", "explicit", "number-theoretic"],
      ["period", "modular", "period-finding", "qft", "fourier"],
    ],
    incorrectFeedback: "Focus on whether Shor's algorithm ever treats the number N or the modular-exponentiation function as an opaque black box, versus exploiting its explicit mathematical structure.",
    partialFeedback: "You're close — be specific that Shor's algorithm exploits the explicit, known structure of modular exponentiation (finding its period via the QFT), not a black-box promise the way Deutsch-Jozsa's or Simon's oracle is.",
  },
  hints: [
    { text: "Deutsch-Jozsa and Simon's algorithms are analyzed assuming zero knowledge of f beyond query access — a genuine black box." },
    { text: "Shor's algorithm, by contrast, knows exactly what function it's evaluating: a^x mod N, an explicit, structured modular-exponentiation function." },
    { text: "The speedup comes from applying the QFT to expose that function's period — a structural property, not from any oracle-hiding argument at all." },
  ],
  solution: {
    steps: [
      { description: "Deutsch-Jozsa's and Simon's separations are proven in a model that only ever grants query access to an unknown f; the classical lower bounds rely entirely on the algorithm being unable to inspect f's internals." },
      { description: "Shor's algorithm never treats its function as a black box: a^x mod N is fully explicit and known, and the algorithm's entire speedup comes from applying the QFT to exploit that function's known periodic structure." },
      { description: "Because Shor's algorithm doesn't rely on any query-complexity black-box argument, it isn't subject to the relativization barrier or to BBBV's black-box-search-specific bound at all." },
    ],
    finalAnswer: "Shor's algorithm exploits the explicit, known algebraic structure of modular exponentiation (finding its period via the QFT) rather than treating its function as an opaque black box, so neither the oracle-relativization critique nor BBBV's black-box search bound applies to it.",
  },
  explanation: {
    correctIdea: "The oracle-model critique specifically targets algorithms whose entire proof relies on treating a function as a black box; Shor's algorithm's proof never does that.",
    whyCorrect: "This is exactly the distinction Module 1 draws between 'provably optimal for black-box search' and 'structured problems remain fair game' — Shor's algorithm is the concrete example living in that second category.",
    whyWrong: ["Attributing Shor's speedup to 'quantum parallelism' alone, without naming the specific structural exploitation (period-finding via the QFT), misses the actual reason it evades the oracle-model critique."],
  },
};
