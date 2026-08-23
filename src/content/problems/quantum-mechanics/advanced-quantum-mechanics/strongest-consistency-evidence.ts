import type { ConceptualProblem } from "@/lib/problems/types";

export const strongestConsistencyEvidence: ConceptualProblem = {
  meta: {
    slug: "strongest-consistency-evidence",
    title: "The Strongest Evidence for Operator/Path-Integral Consistency in This Course",
    course: "advanced-quantum-mechanics",
    lesson: "quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["capstone", "conceptual"],
    prerequisites: ["quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths"],
  },
  question: {
    type: "conceptual",
    prompt: "Name the one specific numerical result from this course that most directly demonstrates the path-integral and operator formulations are consistent (in the one case this course actually tested).",
    placeholder: "The Chapman-Kolmogorov composition law check, where...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["chapman-kolmogorov", "composition law", "two-slice", "discretized"],
      ["matched", "agreement", "relative error", "machine precision"],
    ],
    incorrectFeedback: "Name the SPECIFIC numerical check (not just 'the path integral lesson') and its result.",
    partialFeedback: "Good — now be specific about the size of the agreement (relative error), not just that it matched.",
  },
  hints: [
    { text: "This is the check from The Path Integral Formulation lesson: splitting τ into two segments and integrating over the intermediate position." },
    { text: "It's called the Chapman-Kolmogorov composition law, or equivalently the Gaussian convolution identity." },
    { text: "The result matched the exact propagator to a relative error of about 10⁻¹⁵." },
  ],
  solution: {
    steps: [
      { description: "The Chapman-Kolmogorov composition law check: splitting the Euclidean propagator's time interval into two halves and numerically integrating over every intermediate position." },
      { description: "This discretized 'sum over two-segment paths' was compared directly against the exact closed-form propagator." },
      { description: "The two matched to a relative error of roughly 10⁻¹⁵ (machine precision) across every tested (xf,xi,τ) — the strongest, most concrete consistency evidence this course produced." },
    ],
    finalAnswer: "The discretized two-slice path sum vs. the exact Euclidean propagator, matching to ~10⁻¹⁵ relative error (Chapman-Kolmogorov composition law).",
  },
  explanation: {
    correctIdea: "This tests whether the reader can identify the course's actual load-bearing numerical evidence, not just its narrative claims.",
    whyCorrect: "Matches The Path Integral Formulation lesson's worked example and this platform's own test suite.",
    whyWrong: ["Citing the decoherence lesson's results, while real, doesn't address consistency between the operator and path-integral formulations specifically — that's the path-integral lesson's contribution."],
  },
};
