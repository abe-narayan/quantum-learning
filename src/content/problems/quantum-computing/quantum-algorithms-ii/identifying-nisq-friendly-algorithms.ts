import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const identifyingNisqFriendlyAlgorithms: MultipleChoiceProblem = {
  meta: {
    slug: "identifying-nisq-friendly-algorithms",
    title: "Which Algorithm Is More NISQ-Friendly, and Why",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["nisq", "capstone"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Why is QAOA generally considered more NISQ-friendly than Shor's algorithm?",
    options: [
      { id: "a", text: "QAOA's circuits are shallow and repeated many times, tolerating some noise via the classical optimization loop; Shor's needs one long, precise circuit to succeed" },
      { id: "b", text: "QAOA doesn't use qubits at all" },
      { id: "c", text: "Shor's algorithm has never been implemented on any quantum hardware" },
      { id: "d", text: "QAOA is mathematically proven to be noise-immune" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "QAOA is a genuine quantum circuit, built from Hadamards and rotations acting on qubits — this option is simply false.",
      c: "Small-scale demonstrations of Shor's algorithm (like factoring 15) have been run on real hardware — the issue is scaling to cryptographically relevant sizes, not that it's never been tried at all.",
      d: "No quantum algorithm is noise-immune — QAOA is only more noise-tolerant in a structural, not absolute, sense.",
    },
    defaultIncorrectFeedback: "Recall the capstone's circuit-depth and error-tolerance comparison between the two algorithm families.",
  },
  hints: [
    { text: "Compare circuit depth: how long is each algorithm's circuit, and how many times is it run?" },
    { text: "Shor's period-finding circuit must succeed essentially in one long shot." },
    { text: "QAOA's shallow circuit is run and re-optimized many times." },
  ],
  solution: {
    steps: [{ description: "QAOA's shallow, repeated circuit structure with classical feedback tolerates imperfection better than Shor's single long, must-succeed circuit." }],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea: "NISQ-friendliness is about structural error tolerance, not about one algorithm being 'better' in some absolute sense.",
    whyCorrect: "This is exactly the circuit-depth argument the capstone lesson develops in detail.",
    whyWrong: ["Options b, c, and d each contain a factual error about either QAOA's nature or Shor's algorithm's actual implementation history."],
  },
};
