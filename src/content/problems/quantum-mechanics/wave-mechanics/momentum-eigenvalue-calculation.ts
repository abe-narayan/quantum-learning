import type { NumericProblem } from "@/lib/problems/types";

export const momentumEigenvalueCalculation: NumericProblem = {
  meta: {
    slug: "momentum-eigenvalue-calculation",
    title: "Momentum Eigenvalue of a Plane Wave",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/the-position-and-momentum-operators",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["momentum-operator", "eigenvalue"],
    prerequisites: ["quantum-mechanics/wave-mechanics/the-position-and-momentum-operators"],
  },
  question: {
    type: "numeric",
    prompt: "Using p-hat = -i*d/dx (natural units, hbar = 1), find the eigenvalue of p-hat acting on phi(x) = e^(4ix).",
    inputHint: "a number",
  },
  answer: {
    type: "numeric",
    value: 4,
    tolerance: 0.001,
    nearMisses: [
      { value: -4, feedback: "The sign is inverted. The derivative supplies one factor of i and the operator supplies a factor of -i; their product is +1, not -1." },
      { value: 16, feedback: "16 is what p-hat squared returns on this state, which is twice the energy in these units. The prompt asks for the momentum itself." },
    ],
    incorrectFeedback: "Differentiating the exponential brings down i times the exponent's coefficient, and the -i prefactor then turns that into a real number. If your answer came out imaginary or negative, the two factors of i were not combined.",
  },
  hints: [
    { text: "An eigenvalue problem asks whether applying the operator returns the same function times a constant. Differentiate the given plane wave once and see what comes down in front." },
    { text: "Multiply that derivative by the operator's own prefactor, then compare the result against the original function times an unknown p." },
    { text: "Two factors of i meet in that product: one from the derivative, one from the operator. Multiply them out rather than cancelling them by eye, since their product decides the sign." },
  ],
  solution: {
    steps: [
      { description: "$\\hat p\\,\\phi(x) = -i\\dfrac{d}{dx}e^{4ix} = -i(4i)e^{4ix} = 4\\,e^{4ix}$." },
      { description: "Comparing to $p\\,\\phi(x)$, the eigenvalue is $p=4$." },
    ],
    finalAnswer: "$p = 4$",
  },
  explanation: {
    correctIdea: "A plane wave e^(ikx) is a p-hat eigenfunction with eigenvalue k (in units where hbar=1).",
    whyCorrect: "Differentiating brings down exactly the exponent's coefficient times i, which the -i prefactor converts to a real eigenvalue equal to that coefficient.",
    whyWrong: ["Forgetting the factor of i from differentiating e^(4ix) (getting 4 instead of 4i before applying the -i prefactor) leads to a sign or factor error."],
  },
};
