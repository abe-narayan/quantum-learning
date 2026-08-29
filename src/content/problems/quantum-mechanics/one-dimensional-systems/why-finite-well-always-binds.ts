import type { ConceptualProblem } from "@/lib/problems/types";

export const whyFiniteWellAlwaysBinds: ConceptualProblem = {
  meta: {
    slug: "why-finite-well-always-binds",
    title: "Why a Finite Well Always Has At Least One Bound State",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["finite-square-well"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Using the graphical picture (tangent curve vs. quarter-circle), explain in one or two sentences why a 1D finite well always has at least one bound state, no matter how shallow.",
    placeholder: "Explain why at least one bound state always exists...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      [
        "starts at the origin",
        "at the origin",
        "the origin",
        "both curves pass through k=0",
        "k=0",
        "k = 0",
        "at zero",
        "through zero",
        "start at zero",
        "both start",
        "both begin",
        "tangent curve begins at zero too",
      ],
      {
        phrases: ["always crosses", "must cross", "must intersect", "always intersect", "no matter how small the quarter-circle", "by continuity", "guaranteed", "at least one crossing", "diverges"],
        missingFeedback:
          "You have set up the two curves at k = 0. The conclusion still needs stating: k·tan(ka) starts below the quarter-circle and diverges to infinity before its first branch ends, so by continuity the two must cross, however shallow the well.",
      },
    ],
    incorrectFeedback: "Name both pieces: that the tangent curve (k*tan(ka)) starts at 0 exactly where k=0, just like the quarter-circle's kappa axis, and that this guarantees a crossing exists for the first branch regardless of how small the quarter-circle's radius is.",
  },
  hints: [{ text: "What does k*tan(ka) equal at k=0? What does the quarter-circle kappa(k) look like near k=0?" }],
  solution: {
    steps: [
      { description: "At $k=0^+$, $k\\tan(ka)\\to0$ while $\\kappa(0)=\\sqrt{2V_0}>0$ — the tangent curve starts below the quarter-circle." },
      { description: "As $k$ increases toward the first tangent divergence, $k\\tan(ka)\\to\\infty$, eventually exceeding any finite quarter-circle value — by continuity, the two curves must cross somewhere in between, however small $V_0$ (and hence the quarter-circle's radius) is." },
    ],
    finalAnswer: "The tangent curve starts below the quarter-circle at k=0 and diverges to infinity before its first branch ends, so it must cross the quarter-circle somewhere in between — guaranteed by continuity, regardless of how shallow the well is.",
  },
  explanation: {
    correctIdea: "This is a genuine, general theorem about 1D finite wells (any depth, any width), not a property of the specific worked example.",
    whyCorrect: "The argument only used continuity and the endpoint behaviors, never a specific numeric value of V0 or a.",
    whyWrong: ["Assuming a shallow enough well might bind nothing at all is a common misconception — this is specifically a feature of 1D quantum mechanics (in higher dimensions, arbitrarily shallow wells generally do NOT guarantee a bound state)."],
  },
};
