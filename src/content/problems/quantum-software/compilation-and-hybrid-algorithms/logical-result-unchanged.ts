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
    prompt: "Does SWAP-network transpilation change the logical RESULT a circuit computes, or only its physical execution cost? Justify using this platform's own test-suite evidence.",
    placeholder: "This platform's test suite confirms cnotOnLinearChain gives...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["exact", "same result", "identical amplitudes"],
      ["only cost", "only execution path", "not the logical outcome"],
    ],
    incorrectFeedback: "Cite the specific test-suite evidence (exact amplitude agreement) and be explicit about what changes (cost) vs. what doesn't (logical result).",
    partialFeedback: "Good — now be explicit that only the execution PATH/COST differs, not the computed answer.",
  },
  hints: [
    { text: "This platform's test suite directly compares cnotOnLinearChain's output to a direct (idealized) applyCNOT's output." },
    { text: "The maximum amplitude difference found was effectively 0 (to floating-point precision)." },
    { text: "This means only the PHYSICAL EXECUTION PATH (and its cost) differs — the logical computation result is identical." },
  ],
  solution: {
    steps: [
      { description: "This platform's test suite confirms cnotOnLinearChain(state, control, target) gives EXACTLY the same final amplitudes (difference <10⁻⁹, effectively 0) as a direct, idealized applyCNOT(state, control, target)." },
      { description: "This means transpilation via SWAP-network insertion does NOT change what the circuit logically computes." },
      { description: "What changes is only the PHYSICAL EXECUTION — more gates are needed (Common Mistakes' 8-SWAP example), at real additional cost (time, error accumulation) — but the final logical answer is identical." },
    ],
    finalAnswer: "Only the execution cost changes; the logical result is exactly identical, confirmed directly by this platform's own test-suite comparison.",
  },
  explanation: {
    correctIdea: "This distinguishes 'more expensive' from 'different/wrong,' a genuinely important distinction for understanding what compilation does and doesn't affect.",
    whyCorrect: "Matches the lesson's explicit Common Mistakes section and its underlying test-suite verification.",
    whyWrong: ["Assuming transpilation could subtly alter the computed answer misunderstands that SWAP-network insertion is a provably exact rewriting, not an approximation."],
  },
};
