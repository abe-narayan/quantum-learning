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
      {
        phrases: ["starts at the origin", "at the origin", "the origin", "both curves pass through k=0", "k=0", "k = 0", "at zero", "through zero", "start at zero", "both start", "both begin", "tangent curve begins at zero too"],
        missingFeedback:
          "Compare the two curves right at the left-hand end of the first branch. Say where each of them begins, and which one is above the other there.",
      },
      {
        phrases: ["always crosses", "must cross", "must intersect", "always intersect", "no matter how small the quarter-circle", "by continuity", "guaranteed", "at least one crossing", "diverges"],
        missingFeedback:
          "You have the two curves lined up at the left edge. The conclusion is still missing: follow the tangent branch to the right and say what it does before the branch ends, and what that forces about the two curves.",
      },
    ],
    incorrectFeedback: "You appealed to the well being deep enough, or to the first state 'always existing'. Neither is an argument. Put the two curves on the same axes and look only at the far-left edge, where both are small, and then at the right-hand end of the first tangent branch.",
    modelAnswers: [
      "Both curves pass through k=0: the tangent branch starts at the origin, below the quarter-circle. The tangent then diverges to infinity before its first branch ends, so by continuity the two must cross somewhere in between, however shallow the well is.",
      "At zero the tangent curve begins at zero too, underneath the quarter-circle, and it shoots up to infinity within the first branch. Something continuous going from below to above is guaranteed to cross, so there is always at least one crossing.",
    ],
  },
  hints: [
    { text: "Both curves are functions of k on the same axes. Evaluate each of them at the left-hand edge of the domain and compare the two values." },
    { text: "Now walk k to the right along the first tangent branch, stopping just short of where the tangent blows up. What is happening to the left-hand side there, and to the quarter-circle?" },
    { text: "One curve sits below the other at the left edge and above it at the right, and neither has a break in between. Say what that forces, and notice that the well's depth was never used." },
  ],
  solution: {
    steps: [
      { description: "At $k=0^+$, $k\\tan(ka)\\to0$ while $\\kappa(0)=\\sqrt{2V_0}>0$, so the tangent curve starts below the quarter-circle." },
      { description: "As $k$ increases toward the first tangent divergence, $k\\tan(ka)\\to\\infty$, eventually exceeding any finite quarter-circle value. By continuity, the two curves must cross somewhere in between, however small $V_0$ (and hence the quarter-circle's radius) is." },
    ],
    finalAnswer: "The tangent curve starts below the quarter-circle at k=0 and diverges to infinity before its first branch ends, so continuity forces a crossing in between, regardless of how shallow the well is.",
  },
  explanation: {
    correctIdea: "This is a genuine, general theorem about 1D finite wells (any depth, any width), not a property of the specific worked example.",
    whyCorrect: "The argument used only continuity and the endpoint behaviors, never a specific numeric value of V0 or a.",
    whyWrong: ["Assuming a shallow enough well might bind nothing at all is a common misconception. The guarantee is specific to 1D: in higher dimensions, arbitrarily shallow wells generally do NOT bind."],
  },
};
