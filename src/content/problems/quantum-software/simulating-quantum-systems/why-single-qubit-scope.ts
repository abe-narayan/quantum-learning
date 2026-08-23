import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const whySingleQubitScope: MultipleChoiceProblem = {
  meta: {
    slug: "why-single-qubit-scope",
    title: "Why runNoisyCircuit Is Scoped to a Single Qubit",
    course: "simulating-quantum-systems",
    lesson: "quantum-software/simulating-quantum-systems/noise-simulation",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["noise-simulation"],
    prerequisites: ["quantum-software/simulating-quantum-systems/noise-simulation"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Why is this platform's runNoisyCircuit scoped to single-qubit circuits, per the lesson's explicit explanation?",
    options: [
      { id: "a", text: "Extending to multiple qubits requires expanding each gate to a full 2ⁿ×2ⁿ unitary via tensor products — real, well-understood, but unneeded machinery for this course's lessons" },
      { id: "b", text: "Multi-qubit noise simulation is theoretically impossible" },
      { id: "c", text: "Kraus channels only apply to single qubits in general" },
      { id: "d", text: "Density matrices cannot represent multi-qubit states" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "It's not impossible at all — the lesson explicitly describes what it would take (tensor-product gate expansion), just not something this course's lessons need to build.",
      c: "Kraus channels apply generally to systems of any size — Advanced Topics in Quantum Mechanics' framework isn't restricted to single qubits.",
      d: "Density matrices can represent systems of any size — this platform's densityMatrix.ts functions aren't restricted to single qubits either.",
    },
    defaultIncorrectFeedback: "The scope limitation is a deliberate 'smallest correct implementation' choice — extending to multiple qubits is real, understood machinery, just not needed by anything in this course.",
  },
  hints: [
    { text: "This is explicitly framed as a SCOPE CHOICE, not a fundamental limitation." },
    { text: "The lesson names exactly what a multi-qubit version would require: tensor-product gate expansion." },
    { text: "This matches this platform's general 'smallest correct implementation' philosophy." },
  ],
  solution: {
    steps: [{ description: "The single-qubit scope is a deliberate choice — extending to multiple qubits is real, well-understood (tensor-product gate expansion), but unneeded by this course's specific lessons." }],
    finalAnswer: "(a) Extending requires tensor-product gate expansion — real but unneeded machinery here",
  },
  explanation: {
    correctIdea: "This tests whether the reader distinguishes a deliberate scope decision from a genuine theoretical or implementation limitation.",
    whyCorrect: "Matches the lesson's explicit 'An honest scope limitation' section.",
    whyWrong: ["The other options each invent a false theoretical impossibility that doesn't actually exist — Kraus channels, density matrices, and noise simulation all generalize fine to multiple qubits, given the right (unbuilt-here) machinery."],
  },
};
