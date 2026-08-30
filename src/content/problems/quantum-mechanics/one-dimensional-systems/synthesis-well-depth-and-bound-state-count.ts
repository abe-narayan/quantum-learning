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
      {
        phrases: ["more and more branches", "more branches", "more crossings", "additional crossings", "unboundedly many crossings", "number of bound states grows without bound", "grows without bound", "without limit", "unbounded", "arbitrarily many", "more bound states", "keeps growing"],
        missingFeedback:
          "Say what happens to the quarter-circle as V0 is increased, and what that does to the number of places it meets the fixed branches.",
      },
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
          "You have the growth in count. Now close the loop: name the idealization that V₀ → ∞ turns the well into, and check that its level structure is what an ever-growing count of crossings must reproduce.",
      },
    ],
    incorrectFeedback: "You said the well holds more states when it is deeper, which is the observation, not the argument. Use the graph: one curve's size is set by V0 and the other family is fixed. Say what happens to the count of intersections as the first grows, and what already-known system the endpoint of that process is.",
    modelAnswers: [
      "As V0 grows the quarter-circle's radius grows with it, so it sweeps past more and more branches and picks up additional crossings without limit. The number of bound states grows without bound, which is exactly the infinite well's endless ladder in the limit.",
      "A bigger V0 means a bigger quarter-circle, so there are more crossings and therefore arbitrarily many bound states. In the limit you recover the infinite square well with infinitely many levels.",
    ],
  },
  hints: [
    { text: "Two things are plotted. Which of them changes when you make the well deeper, and which is fixed by the well's width alone?" },
    { text: "The fixed family repeats along the axis forever. Ask how far along that axis the other curve reaches when V0 is enormous." },
    { text: "Each intersection is one state. Count them for a modest V0, then for one a hundred times deeper, and say what the sequence of counts is heading towards." },
  ],
  solution: {
    steps: [
      { description: "As $V_0\\to\\infty$, the quarter-circle's radius $\\sqrt{2V_0}$ grows without bound, eventually sweeping past every tangent and cotangent branch, however far out." },
      { description: "The number of bound states therefore grows without bound too, consistent with the infinite well (the $V_0\\to\\infty$ limit) having infinitely many bound states." },
    ],
    finalAnswer: "As V0 grows, the quarter-circle sweeps past more and more branches, so the number of bound states grows without bound, consistent with the infinite well's endless ladder as the V0 -> infinity limiting case.",
  },
  explanation: {
    correctIdea: "The finite well's bound-state count smoothly interpolates between 'exactly one' (very shallow) and 'infinitely many' (the infinite-well limit).",
    whyCorrect: "This is a genuine consistency check between this course's numerical treatment and Wave Mechanics' closed-form infinite well.",
    whyWrong: ["Assuming the bound-state count saturates at some finite maximum misses that there's no upper bound on V0, and hence no upper bound on how many branches the quarter-circle can eventually cross."],
  },
};
