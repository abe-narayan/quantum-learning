import type { NumericProblem } from "@/lib/problems/types";

export const uncertaintyBoundYZ: NumericProblem = {
  meta: {
    slug: "uncertainty-bound-yz",
    title: "The Uncertainty Bound for Y and Z",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["uncertainty", "commutators"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using $[Y,Z]=2iX$, compute the uncertainty-relation bound $\\tfrac12|\\langle[Y,Z]\\rangle|$ in the state $|+\\rangle$ (where $\\langle X\\rangle=1$).",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 1,
    tolerance: 0.01,
    incorrectFeedback: "⟨[Y,Z]⟩ = 2i⟨X⟩. The common slips are forgetting to halve at the end, or mishandling the magnitude of the imaginary unit. The factor of two from the commutator and the half in front of the bound interact simply; track them separately.",
    nearMisses: [
      { value: 2, feedback: "2 is |⟨[Y,Z]⟩| before the bound's factor of 1/2 is applied." },
      { value: 0.5, feedback: "0.5 halves ⟨X⟩ but drops the commutator's own factor of 2. Both factors are in play: [Y,Z] = 2iX, and the bound halves the result." },
      { value: 0, feedback: "A zero bound would allow both Y and Z to be sharp at once. |+⟩ is an eigenstate of X, not of Y or Z, so ⟨X⟩ = 1 makes the bound as large as it can be." },
    ],
  },
  hints: [
    { text: "Everything reduces to substitution once you see the structure: the bound needs the commutator's expectation value, and the commutator is proportional to X, whose expectation in this state the prompt gives you." },
    { text: "⟨[Y,Z]⟩ = 2i⟨X⟩. Substitute the given ⟨X⟩ and take the magnitude; the imaginary unit contributes nothing extra to it." },
    { text: "Halve the magnitude you found, keeping the commutator's factor of two distinct from the half in front of the bound." },
  ],
  solution: {
    steps: [
      { description: "Compute the commutator expectation.", latex: "\\langle[Y,Z]\\rangle = 2i\\langle X\\rangle = 2i" },
      { description: "Take its magnitude and halve it.", latex: "\\tfrac12|2i| = 1" },
    ],
    finalAnswer: "$1$",
  },
  explanation: {
    correctIdea: "Combined with the companion problem (ΔY=1, and ΔZ=1 by the same argument), this bound is exactly saturated: ΔY·ΔZ = 1 = bound.",
    whyCorrect: "This is the expected behavior for |+⟩, a special minimum-uncertainty state for the Y,Z pair.",
    whyWrong: ["Forgetting the ½ factor, or the magnitude of i, are the most common slips."],
  },
};
