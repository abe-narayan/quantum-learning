import type { NumericProblem } from "@/lib/problems/types";

export const normalizingAFourOutcomeQubitPovm: NumericProblem = {
  meta: {
    slug: "normalizing-a-four-outcome-qubit-povm",
    title: "Normalizing a Four-Outcome Qubit POVM",
    course: "quantum-shannon-theory",
    lesson: "quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["povm", "completeness-relation"],
    prerequisites: ["quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement"],
  },
  question: {
    type: "numeric",
    prompt:
      "A proposed four-outcome POVM on a qubit is E_i = c|phi_i><phi_i| for i = 1..4, where |phi_1>=|0>, |phi_2>=|1>, |phi_3>=|+> = (|0>+|1>)/sqrt(2), |phi_4>=|-> = (|0>-|1>)/sqrt(2). What value of c makes {E_i} satisfy the completeness relation sum_i E_i = I?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.5,
    tolerance: 0.001,
    incorrectFeedback:
      "|0><0| + |1><1| = I (the computational basis resolves the identity), and separately |+><+| + |-><-| = I (the Hadamard basis also resolves the identity). So the unscaled sum of all four projectors is I + I = 2I, and c must be 1/2 to bring the total back down to I.",
    nearMisses: [
      { value: 1, feedback: "With c = 1 the four projectors sum to 2I, assigning total probability 2 to every state. The completeness relation demands exactly I." },
      { value: 0.25, feedback: "1/4 divides by the outcome count. The right normalization depends on how the projectors overlap: these four form two complete bases, so their unscaled sum is 2I, not 4I." },
    ],
  },
  hints: [
    { text: "Group the four projectors into two orthonormal-basis pairs: {|0>,|1>} and {|+>,|->}." },
    { text: "Each orthonormal basis's projectors already sum to I on their own: |0><0|+|1><1| = I, and |+><+|+|-><-| = I." },
    { text: "So the unscaled sum of all four is 2I; solve c * 2I = I for c." },
  ],
  solution: {
    steps: [
      { description: "$|0\\rangle\\langle0|+|1\\rangle\\langle1|=I$ (computational basis is a resolution of the identity)." },
      { description: "$|+\\rangle\\langle+|+|-\\rangle\\langle-|=I$ (Hadamard basis is also a resolution of the identity)." },
      { description: "So $\\sum_{i=1}^4|\\phi_i\\rangle\\langle\\phi_i| = I+I = 2I$, and the completeness relation $\\sum_iE_i=c\\cdot2I=I$ requires $c=1/2$." },
    ],
    finalAnswer: "c = 0.5.",
  },
  explanation: {
    correctIdea: "Each E_i must be positive semi-definite (automatic here, since c > 0 and each |phi_i><phi_i| is already a projector) and the full set must sum to exactly I, not merely to some positive multiple of I.",
    whyCorrect: "Recognizing {|0>,|1>} and {|+>,|-> } as two separate orthonormal bases, each already summing to I on its own, immediately gives the unscaled total as 2I without needing to expand any matrix entries by hand.",
    whyWrong: [
      "Choosing c=1 (leaving the projectors unscaled) gives sum_i E_i = 2I, not I. That assigns total outcome probability 2 instead of 1 for every state, which is not a valid probability distribution.",
      "Choosing c=1/4 (dividing evenly by the outcome count) is a common but unjustified guess; the correct normalization depends on how the outcomes' projectors actually overlap, not just how many outcomes there are.",
    ],
  },
};
