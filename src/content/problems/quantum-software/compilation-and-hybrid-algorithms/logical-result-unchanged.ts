import type { ConceptualProblem } from "@/lib/problems/types";

export const logicalResultUnchanged: ConceptualProblem = {
  meta: {
    slug: "logical-result-unchanged",
    title: "Does Transpilation Change What a Circuit Computes?",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["transpilation", "conceptual"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation"],
  },
  question: {
    type: "conceptual",
    prompt: "Does SWAP-network transpilation change the logical result a circuit computes, or only its physical execution cost? Justify your answer using this platform's own test-suite evidence.",
    placeholder: "This platform's test suite confirms cnotOnLinearChain gives...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["exact", "same result", "identical amplitudes"],
        missingFeedback:
          "Say what the platform's test suite actually found when it compared the two versions, at the level of the numbers that came out.",
      },
      {
        phrases: ["only cost", "only execution path", "not the logical outcome"],
        missingFeedback:
          "You have the evidence. Now say what that leaves transpilation actually changing, and be explicit that it is not the computed answer.",
      },
    ],
    incorrectFeedback: "Point at the evidence rather than reasoning from first principles. The test suite compares the routed version's output amplitudes against the direct one's, and the answer should say what that comparison found. Then separate the two things that could have changed: one of them did, and the other did not.",
    partialFeedback: "Good. Now be explicit about which of the two changed: the route the machine takes and what it costs, while the computed answer is untouched.",
    modelAnswers: [
      "Only the execution cost changes. The test suite compares cnotOnLinearChain against the direct version and gets identical amplitudes, so the outcome is exact and unaffected; what differs is the gate count and the physical execution path.",
      "It gives the same result. The platform's own tests show the transpiled version produces exactly the same state, so only cost changes, not the logical outcome.",
    ],
  },
  hints: [
    { text: "This platform's test suite directly compares cnotOnLinearChain's output to a direct, idealized applyCNOT's output." },
    { text: "The maximum amplitude difference found was effectively 0, to floating-point precision." },
    { text: "So only the physical execution path, and its cost, differs. The logical computation result is identical." },
  ],
  solution: {
    steps: [
      { description: "This platform's test suite confirms cnotOnLinearChain(state, control, target) gives exactly the same final amplitudes (difference below 10⁻⁹, effectively 0) as a direct, idealized applyCNOT(state, control, target)." },
      { description: "So transpilation via SWAP-network insertion does not change what the circuit logically computes." },
      { description: "What changes is only the physical execution. More gates are needed (eight SWAPs in the lesson's own example), at real additional cost in time and accumulated error, but the final logical answer is identical." },
    ],
    finalAnswer: "Only the execution cost changes; the logical result is exactly identical, confirmed directly by this platform's own test-suite comparison.",
  },
  explanation: {
    correctIdea: "This distinguishes 'more expensive' from 'different or wrong', an important distinction for understanding what compilation does and does not affect.",
    whyCorrect: "Inserting SWAPs relabels which physical wire holds which logical qubit and then undoes the relabelling, so the unitary the circuit implements is untouched. The test suite makes that concrete: routed and direct agree to below 10⁻⁹, while the routed version costs more gates.",
    whyWrong: ["Assuming transpilation could subtly alter the computed answer misunderstands that SWAP-network insertion is a provably exact rewriting, not an approximation."],
  },
};
