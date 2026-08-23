import type { ConceptualProblem } from "@/lib/problems/types";

export const ghzCorrelationWithoutSignaling: ConceptualProblem = {
  meta: {
    slug: "ghz-correlation-without-signaling",
    title: "Why GHZ Correlation Isn't a Faster-Than-Light Signal",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["ghz", "entanglement", "no-signaling"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/building-quantum-circuits"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Measuring any one qubit of the GHZ state instantly determines the definite outcome of the other two, even if they're far apart. Explain why this doesn't let the three qubit-holders send a signal to each other faster than light.",
    placeholder: "Whoever holds one of the other qubits, on their own...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["random", "50/50", "cannot tell", "no way to know"],
      ["locally", "on its own", "alone", "by itself"],
      ["compare", "classical channel", "afterward", "communicate the result"],
    ],
    incorrectFeedback:
      "Focus on what someone holding just ONE of the qubits sees on their own, before comparing notes with anyone else — that's the key to why no signal is transmitted.",
    partialFeedback: "You're on the right track — make sure you explain both that local statistics look random and that only comparing results later (classically) reveals the correlation.",
  },
  hints: [
    { text: "Whoever holds qubit 1 (or 2) alone, without knowing what happened to qubit 0, sees only a 50/50 random result when they measure their own qubit." },
    { text: "The correlation (that all three qubits agree) is only visible once someone compares notes across all three measurement results." },
    { text: "Comparing notes requires an ordinary classical channel, which is limited by the speed of light." },
  ],
  solution: {
    steps: [
      { description: "A qubit holder measuring only their own qubit of the GHZ state, with no other information, always sees a uniformly random 50/50 outcome — there is no way to tell locally whether anyone else has measured yet, or what they got." },
      { description: "The perfect correlation (all three outcomes always agreeing) only becomes visible once the three separate results are compared against each other." },
      { description: "That comparison requires sending the actual measurement outcomes over an ordinary classical channel, which cannot exceed the speed of light — so no genuine signal is transmitted faster than light." },
    ],
    finalAnswer:
      "Each qubit's local measurement statistics are always random on their own; the correlation is only visible after classically comparing results, so no information is transmitted instantaneously.",
  },
  explanation: {
    correctIdea: "Entanglement produces correlations, not communication — the correlation is only detectable by comparing results after the fact, through ordinary means.",
    whyCorrect: "This is the same general principle established for the Bell state two courses ago, extended here to three parties: the physics guarantees local randomness for each observer individually.",
  },
};
