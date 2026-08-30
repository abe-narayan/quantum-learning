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
    placeholder: "Tensor networks exploit limited entanglement; Grover's algorithm instead...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["limited entanglement", "area law", "bond dimension"],
        missingFeedback:
          "Say what structural property a tensor network needs in order to be cheaper than a state vector. Name the quantity that stays small when it holds.",
      },
      {
        phrases: ["substantial entanglement", "no reason to expect", "grows toward exponential"],
        missingFeedback:
          "You have the condition. Now say what Grover's algorithm does to that quantity as it runs, and therefore what happens to the saving.",
      },
    ],
    incorrectFeedback: "Two halves have to meet. Say what property a state must have for a tensor network to represent it cheaply, then say what amplitude amplification does to that property as the iterations pile up. If the second answer undoes the first, say what happens to the representation's cost.",
    partialFeedback: "Good. Now say what that costs in practice: with nothing keeping the representation compact, what does its size do as the algorithm runs?",
    modelAnswers: [
      "Tensor networks are efficient only when entanglement is limited, an area law situation where the bond dimension stays small. Grover's algorithm generically builds substantial entanglement across the register with no such structure, so the bond dimension grows toward exponential and you gain nothing.",
      "The whole saving depends on limited entanglement. There is no reason to expect Grover's states to have it, so the representation blows up just as a state vector would.",
    ],
  },
  hints: [
    { text: "Tensor networks work well specifically when entanglement is limited, as in an area-law structure." },
    { text: "Grover's amplitude amplification spreads correlations across the whole register as it proceeds." },
    { text: "With nothing keeping the representation compact, ask where its cost ends up compared with just storing the state outright." },
  ],
  solution: {
    steps: [
      { description: "Tensor networks work well specifically for states with limited entanglement, such as the area-law structure common in physical ground states, letting small bond dimensions capture the state efficiently." },
      { description: "Grover's algorithm's amplitude amplification generically builds up substantial entanglement across the full register as the search progresses, with no reason to expect a limiting area-law-like structure." },
      { description: "Without that limiting structure, the bond dimensions needed to represent the state accurately grow back toward the same exponential cost tensor networks exist to avoid, offering little practical advantage over ordinary state-vector simulation for this algorithm." },
    ],
    finalAnswer: "Tensor networks need limited entanglement to be efficient. Grover's algorithm generically builds substantial entanglement with no limiting structure, so bond dimensions grow back toward exponential and there is no real advantage.",
  },
  explanation: {
    correctIdea: "This applies the lesson's general tradeoff to one specific, previously covered algorithm, testing understanding rather than memorized definitions.",
    whyCorrect: "A tensor network is only compact when the bond dimension across each cut stays small, and bond dimension tracks entanglement entropy. Amplitude amplification spreads correlation across the whole register with nothing bounding it, so the bonds swell back toward 2ⁿ and the representation stops saving anything.",
    whyWrong: ["Assuming tensor networks always help 'because they're a more advanced technique' ignores the lesson's explicit warning against this exact overgeneralization."],
  },
};
