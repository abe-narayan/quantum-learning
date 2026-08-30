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
      { id: "a", text: "QAOA runs shallow circuits many times, so its classical optimization loop absorbs some of the noise" },
      { id: "b", text: "QAOA needs far fewer qubits than Shor's algorithm on an input of the same size, so it fits on current chips" },
      { id: "c", text: "QAOA carries a proven approximation-ratio guarantee, which bounds how far a noisy run's answer can fall" },
      { id: "d", text: "A QAOA answer is a cut you can score classically, so a run spoiled by noise is discarded and retried" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Width is not the axis that separates them. A QAOA instance wants one qubit per graph vertex and can be as wide as you like; what makes it NISQ-friendly is that each individual circuit is shallow, so no single run has to stay coherent for long.",
      c: "The depth-1 ratio of about 0.6924 on 3-regular graphs is a statement about the ideal circuit. It bounds the ideal answer's distance from optimal, and says nothing about what noise does to the sampled one.",
      d: "Scoring a returned cut is indeed cheap, but noise does not hand you obviously-spoiled runs to throw away: it tilts the distribution you are sampling, so the optimizer is steered by the tilted landscape rather than fed junk it can filter.",
    },
    defaultIncorrectFeedback: "Recall the capstone's circuit-depth and error-tolerance comparison between the two algorithm families.",
  },
  hints: [
    { text: "Compare circuit depth: how long is each algorithm's circuit, and how many times is it run?" },
    { text: "Shor's period-finding circuit must succeed in one long shot." },
    { text: "QAOA's shallow circuit is run and re-optimized many times." },
  ],
  solution: {
    steps: [{ description: "QAOA's shallow, repeated circuit structure with classical feedback tolerates imperfection better than Shor's single long, must-succeed circuit." }],
    finalAnswer: "QAOA's shallow circuit is repeated under a classical optimization loop; Shor's needs one long, precise circuit to succeed.",
  },
  explanation: {
    correctIdea: "NISQ-friendliness is about structural error tolerance, not about one algorithm being 'better' in some absolute sense.",
    whyCorrect: "Depth is what a decoherence time budgets. A shallow circuit run ten thousand times spends its coherence in short bursts, and the classical optimizer only needs the average of each burst to be roughly right; Shor's period-finding circuit has to hold phase coherently from the first modular multiplication to the final QFT, so one decoherence event anywhere in it costs the whole run.",
    whyWrong: [
      { optionId: "b", text: "Counts qubits rather than gate depth. QAOA can want one qubit per vertex; the depth of each run, not the width, is what noise punishes." },
      { optionId: "c", text: "Borrows a guarantee about the ideal circuit and applies it to a noisy one. The approximation ratio bounds the ideal answer, not the sampled one." },
      { optionId: "d", text: "Assumes noise announces itself. It biases the sampled distribution instead, so there is no spoiled run to identify and discard." },
    ],
  },
};
