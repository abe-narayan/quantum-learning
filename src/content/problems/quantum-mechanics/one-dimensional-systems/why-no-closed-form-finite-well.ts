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
      ["transcendental", "trig function tangled with", "no algebraic isolation"],
      {
        phrases: ["infinite well", "outside region forbidden entirely", "no kappa side", "no kappa", "forbidden", "walls are infinite", "vanishes at the wall", "sin(kl)"],
        missingFeedback:
          "You have said why the finite well's equation resists algebra. The comparison is still open: the infinite well's walls forbid the outside region entirely, so no κ term ever appears and the condition collapses to sin(kL)=0, which does solve in closed form.",
      },
    ],
    incorrectFeedback: "Name both pieces: what makes the finite-well equation transcendental (a trig function and a square root of the same unknown, tangled together), and why the infinite well avoided this (its outside region was forbidden entirely, removing the kappa side of the equation).",
  },
  hints: [{ text: "What extra term does the finite well's equation have that the infinite well's sin(kL)=0 condition didn't need at all?" }],
  solution: {
    steps: [
      { description: "$k\\tan(ka)=\\kappa$ ties a trigonometric function of $k$ to a square-root function of the same $E$ — no algebraic manipulation isolates $E$." },
      { description: "The infinite well's boundary condition never had a $\\kappa$ term at all (the outside region was forbidden entirely), leaving a pure $\\sin(kL)=0$ condition solvable in closed form." },
    ],
    finalAnswer: "The finite well's equation tangles a trig function with a square root of the same unknown energy (transcendental); the infinite well's condition had no such term because its outside region was simply forbidden.",
  },
  explanation: {
    correctIdea: "Transcendental equations are the norm, not the exception, once a potential has finite (not infinite) walls.",
    whyCorrect: "This is exactly the lesson's own derivation, restated.",
    whyWrong: ["Saying the finite well's equation 'is just harder algebra' misses that no amount of algebraic manipulation can isolate E from a transcendental equation — it's not a matter of effort, but of a fundamentally different kind of equation."],
  },
};
