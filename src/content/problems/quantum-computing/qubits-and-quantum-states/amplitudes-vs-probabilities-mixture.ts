import type { ConceptualProblem } from "@/lib/problems/types";

export const amplitudesVsProbabilitiesMixture: ConceptualProblem = {
  meta: {
    slug: "amplitudes-vs-probabilities-mixture",
    title: "Amplitudes vs. Classical Mixture Probabilities",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["interference", "amplitudes", "classical-probability"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A classical probabilistic bit is 0 with probability p and 1 with probability 1-p — also a kind of 'partly 0, partly 1.' Explain what's fundamentally different between this classical mixture and quantum superposition.",
    placeholder: "In a classical mixture, probabilities...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["amplitude", "amplitudes"],
      ["interference", "cancel", "cancellation", "constructive", "destructive"],
    ],
    incorrectFeedback:
      "Focus on what actually combines in each case: in the classical mixture, do probabilities add directly, or do amplitudes add first? What does that make possible in the quantum case?",
    partialFeedback: "Good start — now connect it to interference: what does adding amplitudes (instead of probabilities) make possible that classical mixtures can't do?",
  },
  hints: [
    { text: "In a classical mixture, probabilities themselves add: P(0 or 1) = p + (1-p) = 1, end of story." },
    { text: "In a quantum superposition, amplitudes add first, and only afterward do you square to get a probability." },
    { text: "Because squaring a sum isn't the same as summing squares, this can produce interference." },
  ],
  solution: {
    steps: [
      {
        description:
          "A classical mixture combines probabilities directly: they simply add up to 1, with no room for cancellation or reinforcement.",
      },
      {
        description:
          "A quantum superposition combines amplitudes, which are added together (possibly with different signs or complex phases) before being squared into probabilities.",
      },
      {
        description:
          "Because $|\\alpha+\\beta|^2 \\neq |\\alpha|^2+|\\beta|^2$ in general, this amplitude-then-square process allows constructive interference (probabilities larger than either part) and destructive interference (probabilities exactly zero even though both parts are individually nonzero) — neither of which a classical probability mixture can produce.",
      },
    ],
    finalAnswer:
      "Classical mixtures add probabilities directly (no interference possible); quantum superpositions add amplitudes first, and squaring that sum allows genuine interference.",
  },
  explanation: {
    correctIdea: "The order of operations, add-then-square (quantum) versus just add (classical), is the entire source of interference.",
    whyCorrect: "This is precisely the gap the lesson identifies as the origin of every quantum algorithmic advantage explored later in the curriculum.",
    whyWrong: [
      "Saying quantum states are 'more random' than classical mixtures misses the actual mathematical distinction — both involve genuine randomness at measurement, but only one involves amplitudes that can interfere before that point.",
    ],
  },
};
