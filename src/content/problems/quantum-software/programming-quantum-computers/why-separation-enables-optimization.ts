import type { ConceptualProblem } from "@/lib/problems/types";

export const whySeparationEnablesOptimization: ConceptualProblem = {
  meta: {
    slug: "why-separation-enables-optimization",
    title: "Why Build-Then-Run Enables Circuit Optimization",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/circuit-representation-in-code",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["circuit-representation", "conceptual"],
    prerequisites: ["quantum-software/programming-quantum-computers/circuit-representation-in-code"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why representing a circuit as a data structure (a list of instructions) makes it possible to optimize the circuit before running it, in a way that immediate gate-by-gate execution would not.",
    placeholder: "Because the circuit is a list of instructions that can be inspected...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["inspect", "list", "before running", "look at all"],
      ["immediate execution", "already happened", "cannot undo", "no list to modify"],
    ],
    incorrectFeedback: "Address both sides: what the data representation allows (inspecting/modifying the whole list before running), and why immediate execution rules this out.",
    partialFeedback: "Good — now be explicit that immediate execution has no equivalent 'list' to inspect or modify before the computation happens.",
  },
  hints: [
    { text: "A list of instructions can be examined and rewritten (e.g. removing a redundant pair of gates) BEFORE any of them actually run." },
    { text: "With immediate execution, each gate's effect happens the instant the code runs — there's no intermediate 'plan' to inspect or change first." },
    { text: "Compilation & Hybrid Algorithms' future transpilation step is exactly this kind of pre-execution circuit rewriting." },
  ],
  solution: {
    steps: [
      { description: "Because a circuit-as-data representation is a complete list of instructions, an optimizer can examine that whole list BEFORE any of it runs — e.g. spotting and removing two adjacent gates that cancel out." },
      { description: "With immediate gate-by-gate execution (Quantum Gates & Circuits' direct approach), each gate's effect on the state happens the instant the code executes it — there's no intermediate representation to inspect or rewrite first." },
      { description: "This is exactly what makes Compilation & Hybrid Algorithms' future transpilation/optimization step possible: it operates on the circuit-as-data representation, before execution." },
    ],
    finalAnswer: "A data representation can be inspected and rewritten as a whole before running; immediate execution has no equivalent intermediate structure to optimize.",
  },
  explanation: {
    correctIdea: "This connects the lesson's software-structure point forward to a concrete future use (compilation/optimization), rather than leaving 'why does this matter' unanswered.",
    whyCorrect: "Matches the lesson's explicit 'Why this separation matters' section.",
    whyWrong: ["Saying data representation is 'more flexible' without identifying the SPECIFIC mechanism (a rewritable list existing before execution) misses the actual reason."],
  },
};
