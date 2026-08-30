import type { NumericProblem } from "@/lib/problems/types";

export const postulateExpectationValue: NumericProblem = {
  meta: {
    slug: "postulate-expectation-value",
    title: "Expectation Value From the Postulates",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["postulates", "expectation-value"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics"],
  },
  question: {
    type: "numeric",
    prompt:
      "An observable $A$ has eigenvalues $+1$ and $-1$ with eigenstates $|e_+\\rangle$ and $|e_-\\rangle$, and the system is prepared in $|\\psi\\rangle=\\cos(\\pi/3)|e_+\\rangle+\\sin(\\pi/3)|e_-\\rangle$. Compute $\\langle A\\rangle$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: -0.5,
    tolerance: 0.01,
    incorrectFeedback: "⟨A⟩ = (+1)·P(+1) + (-1)·P(-1). You need both probabilities, weighted by their eigenvalues.",
    nearMisses: [
      { value: 0, feedback: "0 is the unweighted average of +1 and −1. The two outcomes are not equally likely here: −1 carries three times the weight." },
      { value: 0.5, feedback: "The sign is inverted. The larger probability, 0.75, sits on the −1 eigenvalue, so the average leans negative." },
      { value: -1, feedback: "−1 would mean the state is the |e₋⟩ eigenstate. A quarter of the weight still sits on +1, which pulls the average up from −1." },
    ],
  },
  hints: [
    { text: "An expectation value is not the average of the eigenvalues. It is the average of the eigenvalues weighted by how likely each one is." },
    { text: "Use the Born rule on the state's two coefficients to get the outcome probabilities, then weight each eigenvalue by its own probability and sum." },
    { text: "Check that your two probabilities add to 1 before combining them. If the larger one sits on the negative eigenvalue, the answer has to come out negative." },
  ],
  solution: {
    steps: [
      { description: "$P(+1)=0.25$, $P(-1)=0.75$." },
      { description: "Weight each eigenvalue by its probability and sum.", latex: "\\langle A\\rangle = (1)(0.25)+(-1)(0.75) = -0.5" },
    ],
    finalAnswer: "$\\langle A\\rangle = -0.5$",
  },
  explanation: {
    correctIdea: "Expectation value is the probability-weighted average of the possible outcomes.",
    whyCorrect: "0.25 - 0.75 = -0.5 directly.",
    whyWrong: ["Averaging the two eigenvalues without weighting by probability (giving 0) ignores that -1 is three times as likely as +1 here."],
  },
};
