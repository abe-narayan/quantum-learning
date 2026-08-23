import type { ConceptualProblem } from "@/lib/problems/types";

export const tensorNetworksNotStrictlyBetter: ConceptualProblem = {
  meta: {
    slug: "tensor-networks-not-strictly-better",
    title: "Why 'More Advanced' Doesn't Mean 'Strictly Better' Here",
    course: "simulating-quantum-systems",
    lesson: "quantum-software/simulating-quantum-systems/tensor-network-methods",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["tensor-networks", "conceptual"],
    prerequisites: ["quantum-software/simulating-quantum-systems/tensor-network-methods"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why state-vector simulation remains the RIGHT choice in many situations, even though tensor networks are a more sophisticated technique.",
    placeholder: "Tensor networks trade generality for efficiency, which means...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["trade generality", "only helps when", "specific structure"],
      ["unknown entanglement", "generic state", "no advantage", "simpler"],
    ],
    incorrectFeedback: "Address why tensor networks' benefit is conditional (on limited entanglement), and what that implies for cases where this condition isn't known to hold.",
    partialFeedback: "Good — now be explicit that state-vector simulation remains preferable specifically when entanglement structure is unknown or high.",
  },
  hints: [
    { text: "Tensor networks only help when the state's entanglement is known (or expected) to be limited." },
    { text: "For a generic state, or one with unknown/high entanglement, tensor networks offer no advantage and add unnecessary complexity." },
    { text: "In that case, plain state-vector simulation is both simpler AND no less efficient." },
  ],
  solution: {
    steps: [
      { description: "Tensor networks trade GENERALITY for efficiency: they only provide an advantage when the state's entanglement is known (or strongly expected) to be limited." },
      { description: "For a generic state, or a circuit designed to generate entanglement (or simply one whose entanglement structure isn't known in advance), tensor networks offer no real efficiency advantage." },
      { description: "In that situation, state-vector simulation is both simpler to implement/reason about AND no less efficient than a tensor network attempt would be — making it the objectively better choice, not just the 'default' one." },
    ],
    finalAnswer: "Tensor networks only help under limited entanglement; for generic or unknown-entanglement states, state-vector simulation is simpler and equally efficient, making it the better choice, not merely 'more basic.'",
  },
  explanation: {
    correctIdea: "This resists the natural but wrong assumption that a more sophisticated tool is always preferable, grounding the choice in the actual conditional nature of tensor networks' advantage.",
    whyCorrect: "Matches the lesson's explicit Common Mistakes section.",
    whyWrong: ["Assuming tensor networks are simply 'the upgrade' from state-vector simulation misses that their advantage is strictly conditional, not universal."],
  },
};
