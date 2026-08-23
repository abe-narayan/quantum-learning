import type { ConceptualProblem } from "@/lib/problems/types";

export const why4kInsufficient: ConceptualProblem = {
  meta: {
    slug: "why-4k-insufficient",
    title: "Why 4K Alone Isn't Cold Enough",
    course: "control-and-readout",
    lesson: "quantum-hardware/control-and-readout/cryogenic-systems",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["cryogenics"],
    prerequisites: ["quantum-hardware/control-and-readout/cryogenic-systems"],
  },
  question: {
    type: "conceptual",
    prompt: "Using the lesson's computed table, explain why 4K — despite being extremely cold by everyday standards — is still insufficient for reliable qubit operation.",
    placeholder: "At 4K, the thermal occupation n̄ is approximately..., which means...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["16", "greater than 1", "above 1", "n̄ > 1", "n-bar"],
      ["thermally populated", "randomized", "not reliably ground state"],
    ],
    incorrectFeedback: "Cite the specific n̄ value at 4K from the lesson's table, and explain what n̄>1 means physically for the qubit's starting state.",
    partialFeedback: "Good — now be explicit about what n̄≈16 implies for whether the qubit reliably starts in its ground state.",
  },
  hints: [
    { text: "The lesson's table gives n̄≈16.2 at 4K for a 5 GHz qubit." },
    { text: "n̄≫1 means many thermal photons occupy the mode on average." },
    { text: "This means the qubit's state is effectively randomized by thermal noise BEFORE any computation begins — not reliably starting in |0⟩." },
  ],
  solution: {
    steps: [
      { description: "At 4K, n̄≈16.2 for a 5 GHz qubit — well above 1." },
      { description: "n̄≫1 means the mode is significantly thermally populated: on average, many thermal photons occupy it, rather than the qubit reliably sitting in its ground state." },
      { description: "This means computation would start from an effectively randomized, thermally-mixed state rather than a well-defined |0⟩ — unusable for reliable quantum computation, despite 4K being 'very cold' in everyday terms." },
    ],
    finalAnswer: "n̄≈16 at 4K means the qubit mode is significantly thermally populated, not reliably in its ground state — 4K is 'cold' but still far too warm by this specific physical standard.",
  },
  explanation: {
    correctIdea: "This forces the reader to use the SPECIFIC numerical threshold (n̄ crossing 1) rather than a vague 'colder is better' intuition.",
    whyCorrect: "Matches the lesson's explicit Physical Interpretation section and its computed table.",
    whyWrong: ["Saying '4K just isn't quite cold enough' without citing the specific n̄≈16 value or its implication for ground-state reliability misses the lesson's quantitative point."],
  },
};
