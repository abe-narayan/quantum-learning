import type { ConceptualProblem } from "@/lib/problems/types";

export const globalPhaseInvariance: ConceptualProblem = {
  meta: {
    slug: "global-phase-invariance",
    title: "Why Global Phase Doesn't Affect Probabilities",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/probability-and-quantum-states",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["born-rule", "global-phase"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/probability-and-quantum-states"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Explain why multiplying a quantum state $|\\psi\\rangle$ by an overall phase $e^{i\\alpha}$ does not change any measurement probability.",
    placeholder: "Explain in a sentence or two...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["modulus squared", "|amplitude|", "magnitude squared", "absolute value squared", "squared magnitude", "modulus-squared"],
      ["modulus 1", "magnitude 1", "phase cancels", "cancels out", "doesn't affect the magnitude", "|e^{i", "unit modulus"],
    ],
    incorrectFeedback:
      "Think about the Born rule's formula P = |⟨e|ψ⟩|² — what happens to that squared magnitude when every amplitude picks up the same phase factor?",
    partialFeedback: "You're on the right track — be explicit about both pieces: probabilities depend on squared magnitudes, and a phase factor has magnitude 1.",
  },
  hints: [
    { text: "The Born rule says P(λ) = |⟨e|ψ⟩|² — a squared magnitude." },
    { text: "Multiplying ψ by e^{iα} multiplies every ⟨e|ψ⟩ by e^{iα} too." },
    { text: "What is |e^{iα}|, and what happens when you square it?" },
  ],
  solution: {
    steps: [
      {
        description: "Every overlap picks up the same phase factor.",
        latex: "\\langle e_i|e^{i\\alpha}\\psi\\rangle = e^{i\\alpha}\\langle e_i|\\psi\\rangle",
      },
      {
        description: "Squaring the magnitude removes the phase entirely, since $|e^{i\\alpha}|=1$.",
        latex: "P(\\lambda_i) = |e^{i\\alpha}\\langle e_i|\\psi\\rangle|^2 = |e^{i\\alpha}|^2|\\langle e_i|\\psi\\rangle|^2 = |\\langle e_i|\\psi\\rangle|^2",
      },
    ],
    finalAnswer: "Every probability is unchanged, because $|e^{i\\alpha}|=1$ for any real $\\alpha$.",
  },
  explanation: {
    correctIdea: "Global phase is invisible to the Born rule because probabilities depend only on squared magnitudes.",
    whyCorrect: "The phase factor's own modulus is exactly 1, so it contributes nothing when squared.",
    whyWrong: [
      "Confusing global phase (an overall factor on the whole state) with relative phase (a difference between terms in a superposition) — only the latter is physically meaningful.",
    ],
  },
};
