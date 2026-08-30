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
      {
        phrases: ["chapman-kolmogorov", "composition law", "two-slice", "discretized"],
        missingFeedback:
          "Name the specific check. There is only one place in this course where the two formulations were actually put side by side numerically.",
      },
      {
        phrases: ["matched", "agreement", "relative error", "machine precision"],
        missingFeedback:
          "You have named the check. Now say what its result was, quantitatively enough for it to count as evidence.",
      },
    ],
    incorrectFeedback: "You named a lesson rather than a check. The answer is a computation that was actually run: which identity was verified, and what number came out of the comparison.",
    partialFeedback: "You have named the check. Now quantify how well it came out: give the number, not an adjective.",
    modelAnswers: [
      "The Chapman-Kolmogorov composition law check: the discretized two-slice path sum against the exact Euclidean propagator, which matched to about 10^-15 relative error, essentially machine precision.",
      "The two-slice discretized path integral reproducing the exact propagator, with agreement at the level of machine precision. That is the composition law test.",
    ],
  },
  hints: [
    { text: "The check you want is one where a single quantity was computed two different ways and the results compared numerically. Which lesson ran that comparison?" },
    { text: "The comparison split one propagation into two shorter ones with an integral over the midpoint. Name the identity that says the two routes must agree." },
    { text: "Quote the number the comparison produced, not a word for it." },
  ],
  solution: {
    steps: [
      { description: "The Chapman-Kolmogorov composition law check: splitting the Euclidean propagator's time interval into two halves and numerically integrating over every intermediate position." },
      { description: "This discretized 'sum over two-segment paths' was compared directly against the exact closed-form propagator." },
      { description: "The two matched to a relative error of roughly 10⁻¹⁵ (machine precision) across every tested (xf,xi,τ), the most concrete consistency evidence this course produced." },
    ],
    finalAnswer: "The discretized two-slice path sum vs. the exact Euclidean propagator, matching to ~10⁻¹⁵ relative error (Chapman-Kolmogorov composition law).",
  },
  explanation: {
    correctIdea: "This tests whether the reader can identify the course's actual load-bearing numerical evidence, not just its narrative claims.",
    whyCorrect: "Matches The Path Integral Formulation lesson's worked example and this platform's own test suite.",
    whyWrong: ["Citing the decoherence lesson's results, real as they are, does not address consistency between the operator and path-integral formulations. That is the path-integral lesson's contribution."],
  },
};
