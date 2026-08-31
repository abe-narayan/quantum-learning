import type { ConceptualProblem } from "@/lib/problems/types";

export const purityNotStrictlyMonotonic: ConceptualProblem = {
  meta: {
    slug: "purity-not-strictly-monotonic",
    title: "Does Purity Always Strictly Decrease Gate by Gate?",
    course: "simulating-quantum-systems",
    lesson: "quantum-software/simulating-quantum-systems/noise-simulation",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["noise-simulation", "conceptual"],
    prerequisites: ["quantum-software/simulating-quantum-systems/noise-simulation"],
  },
  question: {
    type: "conceptual",
    prompt: "Using the lesson's computed one-gate versus two-gate result, explain why 'purity strictly decreases after every additional noisy gate' is not a safe general assumption.",
    placeholder: "The lesson's own data shows purity after 1 gate and after 2 gates are...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["exactly equal", "the same value", "the same number", "0.82", "not strictly less", "did not drop", "stayed the same", "identical value"],
        missingFeedback:
          "Go back to the lesson's computed numbers. Say what the one-gate and two-gate purities were relative to each other.",
      },
      {
        phrases: ["gate-specific", "depends on", "interaction with the noise"],
        missingFeedback:
          "You have the counterexample. Now say what it implies about what a single step's effect on purity is really governed by.",
      },
    ],
    incorrectFeedback: "The claim is refuted by a number, so quote the number. Look up the lesson's purity after one noisy H and after two noisy H gates, put them side by side, and say what their relationship rules out about the general assumption.",
    partialFeedback: "Good. Now say why it happens: this is a fact about how H interacts with the dephasing channel in particular, and not a rule any noisy simulation must obey.",
    modelAnswers: [
      "The lesson's own numbers show purity after one noisy H gate and after two are exactly equal, about 0.82 in both cases. So it did not drop at the second gate, which contradicts the strict claim. Whether purity falls at a given step is gate-specific and turns on that gate's interaction with the noise.",
      "After 1 gate and after 2 gates the value is the same number, so purity is not strictly less each time. The overall trend is downward, but a single step depends on the particular gate.",
    ],
  },
  hints: [
    { text: "Look up the lesson's reported purity after one noisy H gate, then after two." },
    { text: "Write the two figures next to each other. If purity had to drop at every step, could they look like that?" },
    { text: "The reason is specific to how H sits against the dephasing channel's structure, rather than a law of noisy simulation in general." },
  ],
  solution: {
    steps: [
      { description: "The lesson's computed result shows purity after 1 noisy H gate (about 0.82) equals purity after 2 noisy H gates (also about 0.82), so it does not strictly decrease between these two steps." },
      { description: "That directly falsifies 'purity always strictly decreases with every additional gate' as a general rule." },
      { description: "The actual behavior depends on the particular gate sequence's relationship to the noise channel's structure, here H's interaction with dephasing. Purity trends downward overall, but not necessarily monotonically at every step." },
    ],
    finalAnswer: "Purity after 1 and 2 noisy H gates is equal, about 0.82 in both cases, which shows purity does not strictly decrease every step. The trend is downward overall, but step-by-step behavior depends on the gate and noise specifics.",
  },
  explanation: {
    correctIdea: "This forces engagement with the lesson's actual computed data rather than a plausible-sounding but incorrect general intuition.",
    whyCorrect: "Purity is a property of the whole density matrix, and a gate can rotate weight into a basis the channel happens to leave alone. The second H does exactly that here, so the two purities coincide near 0.82: the overall trend still falls, but 'strictly decreasing' is not a law.",
    whyWrong: ["Assuming monotonic decrease without checking the lesson's own numbers would miss this specific, documented counterexample."],
  },
};
