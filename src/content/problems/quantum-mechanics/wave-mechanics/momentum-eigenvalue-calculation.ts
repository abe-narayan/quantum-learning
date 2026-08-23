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
    incorrectFeedback: "Differentiate e^(4ix) once: d/dx e^(4ix) = 4i*e^(4ix). Then apply the -i prefactor from p-hat.",
  },
  hints: [
    { text: "Differentiate phi(x)=e^(4ix) once with respect to x." },
    { text: "Multiply the result by -i (the p-hat prefactor) and compare to p*phi(x)." },
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
