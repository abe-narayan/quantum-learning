import type { ConceptualProblem } from "@/lib/problems/types";

export const whyNormIsPreserved: ConceptualProblem = {
  meta: {
    slug: "why-norm-is-preserved",
    title: "Why Time Evolution Preserves Normalization",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/probability-density-and-normalization",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["normalization", "unitarity", "time-evolution"],
    prerequisites: ["quantum-mechanics/wave-mechanics/probability-density-and-normalization"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In one or two sentences, explain why a normalized wavefunction stays exactly normalized under Schrodinger time evolution, using the property U^dagger*U = I.",
    placeholder: "Start from what U satisfies, then follow it into the inner product...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["unitary", "unitarity", "evolution operator is unitary"],
        missingFeedback:
          "Name the property of the evolution operator the question hands you, and say what equation expresses it.",
      },
      {
        phrases: ["inner product preserv", "preserves the inner product", "preserves inner products", "norm preserv", "preserves the norm", "norm is unchanged", "norm does not change", "same inner product", "equals the initial", "unchanged for all t", "daggers cancel", "daggered factors meet"],
        missingFeedback:
          "You have the property. Now follow it into the pairing of the state with itself, and say what that quantity does as time passes.",
      },
    ],
    incorrectFeedback: "You asserted that probability must be conserved, which is the thing being explained rather than the explanation. Work with the operator instead: write <psi(t)|psi(t)> with |psi(t)> = U(t)|psi(0)>, and look at what the two copies of U do to each other.",
    partialFeedback: "You have one half. The missing half is the algebra: name the identity the evolution operator satisfies, then show it is exactly what collapses the middle of the bracket to the identity.",
    modelAnswers: [
      "The evolution operator is unitary, so inside the inner product the two daggered factors meet and give the identity. That leaves the initial inner product, unchanged for all t, so a state that started normalized stays normalized.",
      "Unitarity means U preserves the inner product. The norm is just the inner product of the state with itself, so the norm does not change and normalization survives the evolution.",
    ],
  },
  hints: [
    { text: "Everything turns on one substitution. Replace |psi(t)> inside the bracket by what the evolution operator produces from |psi(0)>." },
    { text: "Moving that operator across to the bra side turns it into its adjoint. Write the bracket out with both operators sitting next to each other in the middle." },
    { text: "Those two adjacent operators form the defining product of the class U belongs to. State what that product equals and the bracket collapses." },
  ],
  solution: {
    steps: [
      { description: "$\\langle\\psi(t)|\\psi(t)\\rangle = \\langle\\psi(0)|U^\\dagger U|\\psi(0)\\rangle = \\langle\\psi(0)|\\psi(0)\\rangle$, using $U^\\dagger U=I$." },
      { description: "So the norm at time $t$ exactly equals the norm at $t=0$, for every $t$." },
    ],
    finalAnswer: "Because U is unitary, its two daggered factors meet as U-dagger U = I inside the inner product, so <psi(t)|psi(t)> equals <psi(0)|psi(0)> for every t. The norm is unchanged, so a state that started normalized stays normalized.",
  },
  explanation: {
    correctIdea: "Unitary evolution preserves inner products exactly, which is what norm preservation requires.",
    whyCorrect: "This is a direct algebraic identity, not an approximation. It holds for every t, not just on average.",
    whyWrong: ["Saying norm is preserved 'because probability must be conserved' restates the conclusion rather than explaining the mechanism. The mechanism is the algebraic property U^dagger U=I."],
  },
};
