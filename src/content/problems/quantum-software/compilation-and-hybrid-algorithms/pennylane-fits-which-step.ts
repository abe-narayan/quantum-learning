import type { ConceptualProblem } from "@/lib/problems/types";

export const pennylaneFitsWhichStep: ConceptualProblem = {
  meta: {
    slug: "pennylane-fits-which-step",
    title: "Which Step of the Loop Does PennyLane's Design Target?",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["hybrid-workflows", "conceptual"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows"],
  },
  question: {
    type: "conceptual",
    prompt: "Connecting to Quantum SDKs Overview, explain which specific step of the general hybrid loop PennyLane's differentiable-programming design is built to make ergonomic, and why.",
    placeholder: "PennyLane's design targets the step where...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["step 3", "deciding the next", "computing the cost", "gradient"],
      ["differentiable", "gradient computation", "ergonomic"],
    ],
    incorrectFeedback: "Identify the SPECIFIC step number/description from this lesson's four-step loop, and connect it to PennyLane's gradient-computation strength.",
    partialFeedback: "Good — now be explicit about WHY gradients matter specifically for that step (deciding the next parameters).",
  },
  hints: [
    { text: "The loop's step 3 is: compute the cost function, then decide the next parameters to try." },
    { text: "Gradient-based optimization (deciding parameters efficiently) needs the derivative of the cost function with respect to each parameter." },
    { text: "PennyLane's differentiable-programming design makes computing this gradient ergonomic." },
  ],
  solution: {
    steps: [
      { description: "The general loop's step 3 is: compute the cost function from measurement results, then decide the next parameters to try (often via gradient-based optimization)." },
      { description: "Gradient-based optimization needs the derivative of the cost function with respect to each ansatz parameter — a genuinely nontrivial computation for a quantum circuit's output." },
      { description: "PennyLane's differentiable-programming design is specifically built to make this gradient computation ergonomic, which is exactly why Quantum SDKs Overview highlighted it for VQE-style algorithms." },
    ],
    finalAnswer: "PennyLane targets step 3 (deciding the next parameters) specifically by making gradient computation of the cost function ergonomic.",
  },
  explanation: {
    correctIdea: "This connects two separate lessons (Quantum SDKs Overview's PennyLane discussion and this lesson's four-step loop) into one precise, specific claim rather than a vague 'PennyLane is good for VQE.'",
    whyCorrect: "Matches both lessons' explicit content directly.",
    whyWrong: ["A vague answer ('PennyLane helps with VQE') without identifying the SPECIFIC step and mechanism (gradients for parameter updates) misses the precision this question asks for."],
  },
};
