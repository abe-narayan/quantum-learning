import type { ConceptualProblem } from "@/lib/problems/types";

export const whyShorsEvadesWallOne: ConceptualProblem = {
  meta: {
    slug: "why-shors-evades-wall-one",
    title: "Why Shor's Algorithm Evades the Oracle-Separation Wall",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/capstone-what-scale-actually-requires",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["capstone", "synthesis", "shors-algorithm"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/capstone-what-scale-actually-requires"],
  },
  question: {
    type: "conceptual",
    prompt: "Module 1 showed that Deutsch-Jozsa's and Simon's algorithms' speedups are oracle-relative, not unconditional proof of quantum advantage on real problems, and that BBBV's bound only rules out black-box search. Explain precisely why Shor's algorithm is not vulnerable to either critique. What specifically about factoring makes it different from an unstructured black-box promise problem?",
    placeholder: "Think about whether factoring's structure is ever hidden from the algorithm the way an oracle hides f...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["structure", "structured", "not a black box", "explicit", "number-theoretic"],
        missingFeedback:
          "Say what the algorithm is actually given when it factors a number, and whether that is the same kind of access an oracle problem grants.",
      },
      {
        phrases: ["period", "modular", "period-finding", "qft", "fourier"],
        missingFeedback:
          "You have said the input is not opaque. Now say what property of the function the algorithm goes after, and the transform it uses to get at it.",
      },
    ],
    incorrectFeedback: "The wall in question is a statement about algorithms that may only ask a box for values of an unknown function. Ask whether Shor's algorithm is ever in that situation: does it know which function it is evaluating, and does anything in its analysis depend on hiding that knowledge? Name the feature of a^x mod N that the algorithm reads off, and say why a bound proved against an opaque box says nothing about reading it off.",
    partialFeedback: "Half of it is there. Be specific about what the algorithm already knows about a^x mod N before it starts, and about which feature of that function it extracts. Then say why a bound proved against an opaque box cannot reach it.",
    modelAnswers: [
      "Factoring is not a black box. The algorithm is handed the number and knows the explicit number-theoretic structure of modular exponentiation, so it is not treating f as an oracle at all. It exploits that structure by finding the period of a^x mod N with the QFT, which is why neither the relativization critique nor the BBBV search bound touches it.",
      "The oracle critiques apply to algorithms whose proof only ever queries an opaque function. Shor's does not: the modular exponentiation function is explicit and structured, and the speedup comes from Fourier transforming to read off its period.",
    ],
  },
  hints: [
    { text: "Deutsch-Jozsa and Simon's algorithms are analysed assuming zero knowledge of f beyond the ability to query it." },
    { text: "Shor's algorithm, by contrast, knows exactly which function it is evaluating and could write it down on paper." },
    { text: "Ask which feature of that written-down function the transform at the heart of the algorithm is extracting, and whether a bound about opaque boxes can say anything about extracting it." },
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
    whyCorrect: "Module 1 separates 'provably optimal for black-box search' from 'structured problems remain fair game'. Shor's algorithm is the concrete inhabitant of the second category, which is why the first says nothing about it.",
    whyWrong: ["Attributing Shor's speedup to 'quantum parallelism' alone, without naming the specific structural exploitation (period-finding via the QFT), misses the actual reason it evades the oracle-model critique."],
  },
};
