import type { ConceptualProblem } from "@/lib/problems/types";

export const synthesisWellDepthAndBoundStateCount: ConceptualProblem = {
  meta: {
    slug: "synthesis-well-depth-and-bound-state-count",
    title: "Synthesis: Well Depth and Bound-State Count",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["synthesis", "finite-square-well"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Using the graphical picture (growing quarter-circle vs. fixed tangent/cotangent branches), explain in one or two sentences what happens to a finite well's number of bound states as V0 -> infinity, and connect this to the infinite well.",
    placeholder: "Explain what happens as V0 grows without bound...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      [
        "more and more branches",
        "more branches",
        "more crossings",
        "additional crossings",
        "unboundedly many crossings",
        "number of bound states grows without bound",
        "grows without bound",
        "without limit",
        "unbounded",
        "arbitrarily many",
        "more bound states",
        "keeps growing",
      ],
      {
        phrases: [
          "approaches the infinite well",
          "recovers the infinite ladder",
          "infinite well",
          "infinite square well",
          "infinite ladder",
          "endless spectrum",
          "infinitely many levels",
          "in the limit",
          "recovers",
          "matches the infinite",
        ],
        missingFeedback:
          "You have the growth in bound-state count. Close the loop with the limiting case: V₀ → ∞ is the infinite square well, whose endless ladder of levels is exactly what an unbounded number of crossings has to reproduce.",
      },
    ],
    incorrectFeedback: "Name both pieces: that the number of bound states grows without bound as V0 grows (the quarter-circle sweeps past ever more tangent/cotangent branches), and that this is exactly consistent with the infinite well's endless ladder of states.",
  },
  hints: [{ text: "What happens to the quarter-circle's radius as V0 grows, and how many branches can it eventually cross?" }],
  solution: {
    steps: [
      { description: "As $V_0\\to\\infty$, the quarter-circle's radius $\\sqrt{2V_0}$ grows without bound, eventually sweeping past every tangent and cotangent branch, however far out." },
      { description: "The number of bound states therefore grows without bound too — consistent with the infinite well (the $V_0\\to\\infty$ limit) having infinitely many bound states." },
    ],
    finalAnswer: "As V0 grows, the quarter-circle sweeps past more and more branches, so the number of bound states grows without bound — consistent with the infinite well's endless ladder as the V0 -> infinity limiting case.",
  },
  explanation: {
    correctIdea: "The finite well's bound-state count smoothly interpolates between 'exactly one' (very shallow) and 'infinitely many' (the infinite-well limit).",
    whyCorrect: "This is a genuine consistency check between this course's numerical treatment and Wave Mechanics' closed-form infinite well.",
    whyWrong: ["Assuming the bound-state count saturates at some finite maximum misses that there's no upper bound on V0, and hence no upper bound on how many branches the quarter-circle can eventually cross."],
  },
};
