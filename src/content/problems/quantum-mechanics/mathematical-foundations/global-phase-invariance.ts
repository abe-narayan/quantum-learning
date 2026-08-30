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
      {
        phrases: ["modulus squared", "magnitude squared", "absolute value squared", "squared magnitude", "squared modulus", "square of the modulus", "square of the magnitude", "amplitude squared", "born rule"],
        missingFeedback:
          "Say what a measurement probability is actually computed from. The answer turns entirely on what operation stands between an amplitude and a probability.",
      },
      {
        phrases: ["modulus 1", "magnitude 1", "modulus of 1", "phase cancels", "cancels out", "doesn't affect the magnitude", "unit modulus"],
        missingFeedback:
          "You have the operation. Now say what size the added factor has, and what that operation does to it.",
      },
    ],
    incorrectFeedback:
      "You said the phase is 'unphysical' or 'a convention', which is the conclusion. Do it in two steps instead: write the formula a probability is computed from, then track what the factor e^{iα} does to each ingredient of that formula.",
    partialFeedback: "One half is there. The other half is a single number: work out what |e^{iα}| equals, and then what happens to it under the operation the formula applies.",
    modelAnswers: [
      "Probabilities come from the modulus squared of an amplitude, and the added factor has modulus 1 for any real alpha. So it cancels out when you take the squared modulus, leaving every probability exactly as it was.",
      "The Born rule uses the squared magnitude, and multiplying by something of unit modulus doesn't affect the magnitude at all. The phase cancels against its own conjugate, so nothing observable changes.",
    ],
  },
  hints: [
    { text: "Write down the formula that turns a state and a measurement outcome into a probability. It is the only such formula in the course." },
    { text: "Substituting e^{iα}|ψ⟩ pulls the same factor out of every inner product in that formula. Do the substitution and see where the factor ends up." },
    { text: "The factor is now sitting inside the operation the formula applies at the end. Evaluate what that operation does to a number of unit length." },
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
    whyCorrect: "The phase factor's own modulus is 1, so it contributes nothing when squared.",
    whyWrong: [
      "Confusing global phase (an overall factor on the whole state) with relative phase (a difference between terms in a superposition). Only the latter is physically meaningful.",
    ],
  },
};
