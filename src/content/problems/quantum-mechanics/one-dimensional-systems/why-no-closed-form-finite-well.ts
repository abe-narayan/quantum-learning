import type { ConceptualProblem } from "@/lib/problems/types";

export const whyNoClosedFormFiniteWell: ConceptualProblem = {
  meta: {
    slug: "why-no-closed-form-finite-well",
    title: "Why the Finite Well Has No Closed-Form Solution",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/the-finite-square-well-setting-up-the-equation",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["finite-square-well", "transcendental-equation"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/the-finite-square-well-setting-up-the-equation"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In one or two sentences, explain why k*tan(k*a) = kappa has no algebraic solution for E, while the infinite well's boundary condition did.",
    placeholder: "Explain why one equation is solvable and the other isn't...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["transcendental", "trig function tangled with", "no algebraic isolation"],
        missingFeedback:
          "Name the kind of equation you are stuck with. Say what two things it puts on either side, and why E cannot be pulled out of them.",
      },
      {
        phrases: ["infinite well", "outside region forbidden entirely", "no kappa side", "no kappa", "forbidden", "walls are infinite", "vanishes at the wall", "sin(kl)"],
        missingFeedback:
          "You have said why this equation resists algebra. The comparison is still open: in the idealized case there was no exterior region to match onto at all, so one whole side of the equation never appeared. Say what the matching condition collapsed to there, and why that one does solve.",
      },
    ],
    incorrectFeedback: "You said the equation is 'harder' or 'needs numerics', which describes the symptom. Look at its ingredients: the same unknown appears inside a trigonometric function on one side and under a square root on the other, and no rearrangement gets it by itself. Then say what was different about the boundary condition in the idealized case.",
    modelAnswers: [
      "The finite well's condition is transcendental: it puts a trig function of the unknown on one side and a square root of the same unknown on the other, tangled together so there is no algebraic isolation of E. The infinite well's condition was just sin(kl)=0, which you can solve outright.",
      "You cannot algebraically separate E because it appears both inside a tangent and inside a square root, which makes the equation transcendental. The infinite well had no kappa side at all, because the outside region was forbidden entirely.",
    ],
  },
  hints: [
    { text: "Write the two matching conditions one above the other: the one from the idealized case and the one here. Which symbols appear in the second that are absent from the first?" },
    { text: "Try to solve the second for E. Take logs, take roots, substitute; each move you make leaves the unknown on both sides in incompatible forms." },
    { text: "Equations in which a polynomial and a trigonometric function of the same unknown are set equal have a name, and a theorem about them. Give the name, then say which feature of the idealized case removed one of the two." },
  ],
  solution: {
    steps: [
      { description: "$k\\tan(ka)=\\kappa$ ties a trigonometric function of $k$ to a square-root function of the same $E$, and no algebraic manipulation isolates $E$." },
      { description: "The infinite well's boundary condition never had a $\\kappa$ term at all (the outside region was forbidden entirely), leaving a pure $\\sin(kL)=0$ condition solvable in closed form." },
    ],
    finalAnswer: "The finite well's equation tangles a trig function with a square root of the same unknown energy (transcendental); the infinite well's condition had no such term because its outside region was forbidden outright.",
  },
  explanation: {
    correctIdea: "Transcendental equations are the norm, not the exception, once a potential has finite (not infinite) walls.",
    whyCorrect: "This is the lesson's own derivation, restated.",
    whyWrong: ["Saying the finite well's equation 'is just harder algebra' misses that no amount of algebraic manipulation can isolate E from a transcendental equation. It is not a matter of effort, but a different kind of equation."],
  },
};
