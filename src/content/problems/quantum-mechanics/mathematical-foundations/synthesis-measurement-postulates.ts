import type { ConceptualProblem } from "@/lib/problems/types";

export const synthesisMeasurementPostulates: ConceptualProblem = {
  meta: {
    slug: "synthesis-measurement-postulates",
    title: "Synthesis: How the Postulates Fit Together",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/mathematical-foundations-challenge",
    difficulty: "advanced",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["synthesis", "born-rule", "hermitian-operators"],
    prerequisites: [
      "quantum-mechanics/mathematical-foundations/hermitian-operators",
      "quantum-mechanics/mathematical-foundations/probability-and-quantum-states",
    ],
  },
  question: {
    type: "conceptual",
    prompt:
      "In two or three sentences, explain how four ideas (unit vectors, Hermitian operators, eigenvalues, and the Born rule) fit together to predict the outcome of a quantum measurement.",
    placeholder: "Explain how these four pieces connect...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // Each group now asks for a *relation* between the four named ideas. The
      // prompt lists all four by name, so groups that merely named them back
      // meant the question graded itself.
      {
        phrases: ["probabilities sum to 1", "probabilities add to 1", "sum to 1", "add to 1", "total probability is 1", "normalization guarantees", "unit length guarantees", "norm 1 ensures", "normalized so that"],
        missingFeedback:
          "One of the four ideas is what lets these numbers behave like probabilities at all. Say what unit length buys you about the numbers you end up with.",
      },
      {
        phrases: ["eigenvalues are the possible outcomes", "possible outcomes are the eigenvalues", "possible results are the eigenvalues", "real eigenvalues", "eigenvalues are real", "hermitian guarantees real", "measured value is an eigenvalue", "outcome is one of the eigenvalues", "outcomes are its eigenvalues"],
        missingFeedback:
          "You have said why the numbers behave like probabilities. Now say what they are attached to: what set of values can a measurement actually return, and what makes them real?",
      },
      {
        phrases: ["amplitude squared", "squared overlap", "overlap squared", "modulus squared", "squared magnitude", "magnitude squared", "square of the overlap", "squaring the overlap", "inner product squared", "squared inner product", "squared overlaps"],
        missingFeedback:
          "You have the possible results and you have said the total comes to one. Now supply the rule that assigns a number to each result: say exactly what you compute from the state and the eigenvector.",
      },
    ],
    incorrectFeedback:
      "You described one link of the chain, or told the story in words without naming the objects. Four things have to appear and be connected: what kind of vector a state is, what kind of operator an observable is, what that operator's spectrum supplies, and the arithmetic that turns an overlap into a number between 0 and 1.",
    partialFeedback: "At least one link is still missing. Check each in turn: the condition on the state vector's length, the property of the operator that makes its spectrum physically meaningful, and the arithmetic that converts an overlap into a probability.",
    modelAnswers: [
      "The state is a unit vector, so its squared overlaps with an orthonormal basis add to 1 and can be read as probabilities. The observable is Hermitian, so its eigenvalues are real and the possible outcomes are the eigenvalues. The Born rule ties the two together: the probability of each outcome is the squared overlap of the state with that eigenvector.",
      "Normalization guarantees the probabilities sum to 1. Hermiticity guarantees the measured value is an eigenvalue and that the eigenvalues are real. The Born rule then says how likely each one is, by taking the squared inner product with the corresponding eigenvector.",
    ],
  },
  hints: [
    { text: "Start with the object: what kind of mathematical thing is a state, and what one condition does it have to satisfy?" },
    { text: "Now the observable. What kind of operator is it, and why does that kind guarantee its measurable values are real numbers?" },
    { text: "Finish with the arithmetic: given the state and one of the operator's eigenvectors, what do you compute, and what does the answer mean?" },
  ],
  solution: {
    steps: [
      { description: "A physical state is a normalized (unit-norm) vector $|\\psi\\rangle$ in a Hilbert space." },
      { description: "An observable is a Hermitian operator $A$; its eigenvalues (guaranteed real) are the only possible measurement outcomes, and its eigenvectors are the corresponding definite states." },
      { description: "The Born rule gives the probability of each outcome as the squared overlap between the state and that outcome's eigenvector.", latex: "P(\\lambda_i) = |\\langle e_i|\\psi\\rangle|^2" },
    ],
    finalAnswer:
      "The state is a unit vector, so its squared overlaps add to 1 and can serve as probabilities. The observable is Hermitian, so its eigenvalues are real and are exactly the possible outcomes. The Born rule pairs the two up: the squared overlap with each eigenvector is the probability of measuring that eigenvalue.",
  },
  explanation: {
    correctIdea: "The whole predictive machinery of quantum mechanics is this one chain: state, observable's eigenbasis, overlaps, squared, probabilities.",
    whyCorrect: "Every piece was derived, not just asserted, across the ten lessons this capstone reviews.",
    whyWrong: ["Leaving out normalization, real eigenvalues, or the squaring step each break a link in the chain that makes the whole prediction self-consistent."],
  },
};
