import type { ConceptualProblem } from "@/lib/problems/types";

export const groverPoorFitForTensorNetworks: ConceptualProblem = {
  meta: {
    slug: "grover-poor-fit-for-tensor-networks",
    title: "Why Grover's Algorithm Doesn't Benefit From Tensor Networks",
    course: "simulating-quantum-systems",
    lesson: "quantum-software/simulating-quantum-systems/tensor-network-methods",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["tensor-networks", "conceptual"],
    prerequisites: ["quantum-software/simulating-quantum-systems/tensor-network-methods"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why a tensor network representation offers little to no advantage for simulating Grover's algorithm at scale, connecting to the specific structural property tensor networks exploit.",
    placeholder: "Tensor networks exploit LIMITED entanglement; Grover's algorithm instead...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["limited entanglement", "area law", "bond dimension"],
      ["substantial entanglement", "no reason to expect", "grows toward exponential"],
    ],
    incorrectFeedback: "Address both: what tensor networks specifically require (limited entanglement) and why Grover's algorithm doesn't provide it.",
    partialFeedback: "Good — now be explicit about the consequence: bond dimensions growing back toward exponential.",
  },
  hints: [
    { text: "Tensor networks work well specifically when entanglement is LIMITED (e.g. an 'area law' structure)." },
    { text: "Grover's amplitude amplification process generically builds up substantial entanglement across the whole register as it progresses." },
    { text: "With no limiting structure to exploit, the required bond dimensions grow back toward the same exponential cost tensor networks were meant to avoid." },
  ],
  solution: {
    steps: [
      { description: "Tensor networks work well specifically for states with LIMITED entanglement (e.g. an 'area law' structure common in physical ground states), letting small bond dimensions capture the state efficiently." },
      { description: "Grover's algorithm's amplitude amplification generically builds up substantial entanglement across the full register as the search progresses, with no reason to expect a limiting area-law-like structure." },
      { description: "Without that limiting structure, the bond dimensions needed to represent the state accurately grow back toward the same exponential cost tensor networks exist to avoid — offering little to no practical advantage over ordinary state-vector simulation for this specific algorithm." },
    ],
    finalAnswer: "Tensor networks need limited entanglement to be efficient; Grover's algorithm generically builds substantial entanglement with no limiting structure, so bond dimensions grow back toward exponential — no real advantage.",
  },
  explanation: {
    correctIdea: "This applies the lesson's general tradeoff to a SPECIFIC, previously-covered algorithm, testing genuine understanding rather than memorized definitions.",
    whyCorrect: "Matches the lesson's own Worked Example directly.",
    whyWrong: ["Assuming tensor networks always help 'because they're a more advanced technique' ignores the lesson's explicit warning against this exact overgeneralization."],
  },
};
