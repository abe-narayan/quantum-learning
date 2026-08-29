import type { ConceptualProblem } from "@/lib/problems/types";

export const superpositionVsMixture: ConceptualProblem = {
  meta: {
    slug: "superposition-vs-mixture",
    title: "Superposition vs. Mixture",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["mixed-states", "superposition", "conceptual"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states"],
  },
  question: {
    type: "conceptual",
    prompt:
      "|+⟩ and a 50/50 classical mixture of |0⟩,|1⟩ give identical probabilities for a computational-basis measurement. Explain how they can nonetheless be shown to be different physical states.",
    placeholder: "Explain using a different measurement basis...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      [
        "different basis",
        "x basis",
        "x-basis",
        "x axis",
        "x-axis",
        "measure in x",
        "measure x",
        "measuring x",
        "another basis",
        "hadamard basis",
        "plus minus basis",
        "different measurement",
        "rotated basis",
      ],
      ["distinguish", "differ", "different result", "different prediction"],
    ],
    incorrectFeedback: "Think about measuring in a basis other than the computational basis — what does each state predict there?",
    partialFeedback: "Good start — be explicit about which basis reveals the difference and what each state predicts in it.",
  },
  hints: [
    { text: "The two states agree in the computational (Z) basis — try the X basis instead." },
    { text: "|+⟩ is an eigenstate of X — what does measuring X on it give, deterministically?" },
    { text: "The maximally mixed state gives 50/50 odds in *every* basis, including X." },
  ],
  solution: {
    steps: [
      { description: "In the computational basis, both states give P(0)=P(1)=0.5 — indistinguishable there." },
      { description: "Measure X instead: |+⟩ is X's +1-eigenstate, giving P(+)=1 deterministically." },
      { description: "The mixture, being I/2, gives P(+)=P(-)=0.5 in the X basis too — no basis makes it deterministic." },
    ],
    finalAnswer: "Measuring in the X basis distinguishes them: |+⟩ gives a deterministic result; the mixture stays 50/50.",
  },
  explanation: {
    correctIdea: "The two states' density matrices differ in their off-diagonal (coherence) terms, which only a different measurement basis reveals.",
    whyCorrect: "|+⟩ has nonzero coherence and gives a deterministic X-basis outcome; I/2 has zero coherence and stays random in every basis.",
    whyWrong: ["Claiming the two states are 'basically the same' ignores that a real, executable measurement (X-basis) tells them apart with certainty."],
  },
};
