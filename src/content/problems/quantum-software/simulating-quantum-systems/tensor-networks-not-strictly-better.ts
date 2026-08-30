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
    prompt: "Explain why state-vector simulation remains the right choice in many situations, even though tensor networks are a more sophisticated technique.",
    placeholder: "Tensor networks trade generality for efficiency, which means...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["trade generality", "only helps when", "only help", "only helps", "only under", "conditional", "specific structure"],
        missingFeedback:
          "Say what tensor networks give up in exchange for their speed. Their advantage is not unconditional, so name what it hangs on.",
      },
      {
        phrases: ["unknown entanglement", "generic state", "no advantage", "simpler"],
        missingFeedback:
          "You have the condition. Now say what happens when it fails, and why the plainer method wins there.",
      },
    ],
    incorrectFeedback: "The claim treats a specialised tool as a general upgrade. Say what condition a tensor network needs before it pays off, then ask what happens when you cannot establish that condition in advance. The answer should end with a recommendation about which method to reach for in that situation, and why.",
    partialFeedback: "Good. Now be explicit that state-vector simulation remains preferable when the entanglement structure is unknown or high.",
    modelAnswers: [
      "Tensor networks trade generality for efficiency: they only help when the state has limited entanglement. If the entanglement is unknown, or the state is generic, there is no advantage at all, and state-vector simulation is simpler and just as efficient, which makes it the better choice rather than the more basic one.",
      "Their advantage is conditional, not universal. For a generic state you get no advantage, and the state vector is simpler to reason about and to implement.",
    ],
  },
  hints: [
    { text: "Tensor networks only help when the state's entanglement is known, or expected, to be limited." },
    { text: "For a state whose entanglement you cannot bound in advance, ask what the machinery buys you, and what it costs in complexity." },
    { text: "Then say which method you would reach for, and why 'more advanced' is not the same thing as 'better here'." },
  ],
  solution: {
    steps: [
      { description: "Tensor networks trade generality for efficiency. They only provide an advantage when the state's entanglement is known, or strongly expected, to be limited." },
      { description: "For a generic state, a circuit designed to generate entanglement, or one whose entanglement structure is not known in advance, tensor networks offer no real efficiency advantage." },
      { description: "In that situation, state-vector simulation is both simpler to implement and reason about, and no less efficient than a tensor-network attempt would be, which makes it the better choice rather than merely the default one." },
    ],
    finalAnswer: "Tensor networks only help under limited entanglement. For generic or unknown-entanglement states, state-vector simulation is simpler and equally efficient, which makes it the better choice, not merely the more basic one.",
  },
  explanation: {
    correctIdea: "This resists the natural but wrong assumption that a more sophisticated tool is always preferable, grounding the choice in the actual conditional nature of tensor networks' advantage.",
    whyCorrect: "The compression is conditional on bounded entanglement, so on a state with no such guarantee the tensor network pays for machinery it cannot use. Where the condition fails, a plain state vector is easier to reason about and no more expensive, which makes it the right tool rather than the fallback.",
    whyWrong: ["Assuming tensor networks are simply 'the upgrade' from state-vector simulation misses that their advantage is strictly conditional, not universal."],
  },
};
