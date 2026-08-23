import type { ConceptualProblem } from "@/lib/problems/types";

export const whichStepWasQuantum: ConceptualProblem = {
  meta: {
    slug: "which-step-was-quantum",
    title: "Identifying the One Quantum Step in the Factor-15 Pipeline",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/worked-example-factoring-15",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["shors-algorithm", "conceptual"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/worked-example-factoring-15"],
  },
  question: {
    type: "conceptual",
    prompt: "List every step in the factor-15 worked example, and identify which single one genuinely required quantum interference rather than ordinary classical computation.",
    placeholder: "List: choosing a, checking gcd, the period-finding circuit, reading the peak, computing a^(r/2), the final gcd's...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["period-finding", "quantum circuit", "qft", "interference"],
      ["classical", "gcd", "everything else"],
    ],
    incorrectFeedback: "Go through each step and ask: could a laptop with no quantum hardware do this instantly?",
    partialFeedback: "Good — be explicit that every other step is ordinary classical arithmetic, not just that one step is quantum.",
  },
  hints: [
    { text: "Choosing a and checking gcd(a,N)=1: ordinary arithmetic." },
    { text: "Computing a^(r/2) mod N and the final two gcd's: also ordinary arithmetic." },
    { text: "Only producing the period-finding measurement distribution's interference pattern needs a quantum computer." },
  ],
  solution: {
    steps: [
      { description: "Choosing a, checking gcd(a,N)=1, computing a^(r/2) mod N, and the two final gcd computations are all ordinary classical arithmetic." },
      { description: "Only the period-finding circuit's QFT-based interference step — producing the sharp probability peaks — requires a quantum computer." },
    ],
    finalAnswer: "Every step is classical except producing the period-finding measurement distribution itself, via quantum interference.",
  },
  explanation: {
    correctIdea: "Shor's algorithm's quantum speedup is concentrated in exactly one narrow subroutine, not spread across the whole pipeline.",
    whyCorrect: "This matches the lesson's own explicit breakdown of the worked example step by step.",
    whyWrong: ["Claiming multiple steps are quantum overstates the algorithm's actual reliance on quantum hardware — precision about scope matters here."],
  },
};
