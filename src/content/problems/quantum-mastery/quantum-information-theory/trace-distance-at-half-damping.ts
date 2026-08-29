import type { NumericProblem } from "@/lib/problems/types";

export const traceDistanceAtHalfDamping: NumericProblem = {
  meta: {
    slug: "trace-distance-at-half-damping",
    title: "Trace Distance for Amplitude Damping at gamma=0.5",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/trace-distance-and-fidelity",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["trace-distance", "amplitude-damping"],
    prerequisites: ["quantum-mastery/quantum-information-theory/trace-distance-and-fidelity"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using the derived closed form D(gamma) = 0.5*sqrt(gamma^2 + (1-sqrt(1-gamma))^2) for amplitude damping applied to |+>, compute D at gamma=0.5.",
    inputHint: "to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.289735,
    tolerance: 0.001,
    incorrectFeedback:
      "Substitute gamma=0.5 directly: sqrt(1-0.5)=sqrt(0.5)≈0.707107, then (1-0.707107)^2≈0.085786, plus gamma^2=0.25, square root, times 0.5.",
    nearMisses: [
      { value: 0.579471, tolerance: 0.002, feedback: "That is the square root before the factor of 1/2. Trace distance carries that half in front." },
      { value: 0.25, feedback: "0.25 is gamma/2, ignoring the second term under the root. The coherence loss contributes as well." },
    ],
  },
  hints: [
    { text: "sqrt(1-gamma) at gamma=0.5 is sqrt(0.5) ≈ 0.707107." },
    { text: "(1 - 0.707107)^2 ≈ 0.085786; gamma^2 = 0.25." },
    { text: "D = 0.5 * sqrt(0.25 + 0.085786)." },
  ],
  solution: {
    steps: [
      { description: "$\\sqrt{1-0.5}=\\sqrt{0.5}\\approx0.707107$" },
      { description: "$(1-0.707107)^2\\approx0.085786$, and $\\gamma^2=0.25$" },
      { description: "$D(0.5)=0.5\\sqrt{0.25+0.085786}=0.5\\sqrt{0.335786}\\approx0.5\\times0.579471$" },
    ],
    finalAnswer: "D(0.5) ≈ 0.2897.",
  },
  explanation: {
    correctIdea: "The closed-form D(gamma) derived directly from amplitude damping's Kraus operators applied to |+><+| lets trace distance be computed at any gamma without rebuilding the density matrix from scratch.",
    whyCorrect: "This is the exact eigenvalue-based trace distance formula, verified against the platform's engine at gamma=0.3 in the lesson; evaluating it at a different gamma is the same formula, different input.",
  },
};
