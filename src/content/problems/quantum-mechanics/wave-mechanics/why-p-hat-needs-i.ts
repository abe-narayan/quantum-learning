import type { ConceptualProblem } from "@/lib/problems/types";

export const whyPHatNeedsI: ConceptualProblem = {
  meta: {
    slug: "why-p-hat-needs-i",
    title: "Why the Momentum Operator Needs a Factor of i",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/the-position-and-momentum-operators",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["momentum-operator", "hermitian"],
    prerequisites: ["quantum-mechanics/wave-mechanics/the-position-and-momentum-operators"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In one or two sentences, explain why p-hat = -i*hbar*d/dx needs the factor of i, using the Hermiticity requirement from Mathematical Foundations.",
    placeholder: "Explain why the factor of i is required...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // Bare "hermitian" is a substring of the second group's "anti-hermitian",
      // so "d/dx alone is anti-Hermitian" satisfied both groups without ever
      // stating the requirement that observables be Hermitian.
      {
        phrases: ["real eigenvalues", "must be hermitian", "has to be hermitian", "have to be hermitian", "needs to be hermitian", "observable must be hermitian", "observables are hermitian", "hermitian operator", "self-adjoint"],
        missingFeedback:
          "Say what a valid observable has to be, and what property of its measured values that requirement exists to guarantee.",
      },
      {
        phrases: ["plain derivative", "d/dx alone", "anti-hermitian", "not hermitian without i"],
        missingFeedback:
          "You have the requirement. Now test the bare derivative against it: say what it is on its own, and what the extra factor does about that.",
      },
    ],
    incorrectFeedback: "You justified the i by units, or by matching the plane-wave answer e^(ikx). Neither forces it: any real multiple of d/dx carries the same units, and a constant can be absorbed into k. The constraint comes from what a measurement is allowed to hand back.",
    partialFeedback: "You have one half. The other half is a specific calculation: integrate by parts and compare the integral of f* (dg/dx) with the integral of (df/dx)* g. The sign that comes back is what rules the bare derivative out.",
    modelAnswers: [
      "Momentum is an observable, so it must be hermitian in order to have real eigenvalues. The plain derivative is anti-hermitian, not hermitian on its own; multiplying by -i converts it into a hermitian operator, which is why the factor is not optional.",
      "Observables are hermitian, and d/dx alone is not: it is anti-hermitian. The factor of i is exactly what fixes that, so the eigenvalues come out real.",
    ],
  },
  hints: [
    { text: "Momentum is something you measure, and every measured value is a real number. That is already a constraint on the operator before you write it down." },
    { text: "Test the bare d/dx against that constraint: integrate f* (dg/dx) by parts over the whole line, with f and g vanishing at infinity." },
    { text: "The boundary term drops and you are left with the same integral carrying a minus sign in front. Ask what constant factor out front would cancel that minus once it is conjugated." },
  ],
  solution: {
    steps: [
      { description: "Observables must be Hermitian, to guarantee real eigenvalues (measurable outcomes)." },
      { description: "Integration by parts shows $d/dx$ alone is anti-Hermitian; multiplying by $-i$ flips it into the Hermitian condition." },
    ],
    finalAnswer: "The factor of i converts the anti-Hermitian plain derivative into a Hermitian operator, as required for p-hat to be a valid observable.",
  },
  explanation: {
    correctIdea: "Momentum must be a valid observable, which means Hermitian, and only -i*hbar*d/dx (not a bare derivative) satisfies that.",
    whyCorrect: "This is the lesson's integration-by-parts calculation: the boundary term vanishes and the sign flip from d/dx becomes the correct Hermitian match once multiplied by -i.",
    whyWrong: ["Saying 'it's needed to match units' is incomplete: units alone do not force a complex factor. The reason is the Hermiticity requirement for real, measurable eigenvalues."],
  },
};
