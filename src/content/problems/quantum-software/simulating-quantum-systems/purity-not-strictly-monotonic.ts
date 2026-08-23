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
    prompt: "Using the lesson's own computed 1-vs-2-gate result, explain why 'purity strictly decreases after every additional noisy gate' is NOT a safe general assumption.",
    placeholder: "The lesson's own data shows purity after 1 gate and after 2 gates are...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["equal", "same", "0.82", "not strictly less"],
      ["gate-specific", "depends on", "interaction with the noise"],
    ],
    incorrectFeedback: "Cite the specific numerical fact (equal purity at 1 and 2 gates) and explain what it implies about the general assumption.",
    partialFeedback: "Good — now be explicit that this depends on the SPECIFIC gate sequence's relationship to the noise channel, not a universal law.",
  },
  hints: [
    { text: "The lesson's worked example reports purity after 1 noisy H gate ≈0.82, and after 2 noisy H gates ALSO ≈0.82." },
    { text: "If purity strictly decreased every step, these two numbers could not be equal." },
    { text: "This specific gate sequence's interaction with the dephasing channel's structure is why — a detail specific to H and dephasing, not a universal noise-simulation law." },
  ],
  solution: {
    steps: [
      { description: "The lesson's own computed result shows purity after 1 noisy H gate (≈0.82) equals purity after 2 noisy H gates (also ≈0.82) — NOT strictly decreasing between these two steps." },
      { description: "This directly falsifies 'purity always strictly decreases with every additional gate' as a general rule." },
      { description: "The actual behavior depends on the SPECIFIC gate sequence's relationship to the noise channel's structure (here, H's particular interaction with dephasing) — purity trends downward overall, but not necessarily monotonically at every single step." },
    ],
    finalAnswer: "Purity after 1 and 2 noisy H gates is equal (≈0.82 both), directly showing purity doesn't strictly decrease every step — the trend is downward overall, but step-by-step behavior depends on gate/noise specifics.",
  },
  explanation: {
    correctIdea: "This forces engagement with the lesson's actual computed data rather than a plausible-sounding but incorrect general intuition.",
    whyCorrect: "Matches the lesson's explicit Worked Example and Common Mistakes sections precisely.",
    whyWrong: ["Assuming monotonic decrease without checking the lesson's own numbers would miss this specific, documented counterexample."],
  },
};
