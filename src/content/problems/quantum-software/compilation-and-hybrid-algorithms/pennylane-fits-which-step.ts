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
      {
        phrases: ["step 3", "step three", "deciding the next", "choosing the next parameters", "computing the cost", "the optimizer step"],
        missingFeedback:
          "The hybrid loop has four steps. Name the one this library's design is aimed at, and say what happens in it.",
      },
      {
        phrases: ["differentiable", "gradient computation", "ergonomic"],
        missingFeedback:
          "You have the step. Now say what the library provides that makes that step easier, and why that particular capability is what the step needs.",
      },
    ],
    incorrectFeedback: "Name the stage of the lesson's four-part loop that the library is aimed at, by number or by description, then say what makes it the right target. The library's selling point is a derivative, so the answer has to say whose derivative, with respect to what, and why that stage is the one that wants it.",
    partialFeedback: "Good. Now say why a derivative matters at that stage in particular: what is being chosen there, and what would you do without one?",
    modelAnswers: [
      "It targets step 3 of the hybrid loop, deciding the next parameters. That step needs the gradient of the cost function, and PennyLane's differentiable programming design makes gradient computation ergonomic rather than something you hand-roll.",
      "The optimizer step is the one it makes easy, choosing the next parameters, because it treats the circuit as differentiable so the gradient comes for free.",
    ],
  },
  hints: [
    { text: "The loop's third stage is: evaluate the cost function, then choose the next parameters to try." },
    { text: "Choosing the next parameters efficiently needs the derivative of the cost with respect to each one." },
    { text: "Ask what PennyLane's design is built around, and which stage of the loop that serves." },
  ],
  solution: {
    steps: [
      { description: "The general loop's step 3 is: compute the cost function from measurement results, then decide the next parameters to try (often via gradient-based optimization)." },
      { description: "Gradient-based optimization needs the derivative of the cost function with respect to each ansatz parameter, a nontrivial computation for a quantum circuit's output." },
      { description: "PennyLane's differentiable-programming design is built to make this gradient computation ergonomic, which is why Quantum SDKs Overview highlighted it for VQE-style algorithms." },
    ],
    finalAnswer: "PennyLane targets step 3 (deciding the next parameters) specifically by making gradient computation of the cost function ergonomic.",
  },
  explanation: {
    correctIdea: "This connects two lessons, Quantum SDKs Overview's PennyLane discussion and this lesson's four-step loop, into one specific claim rather than a vague 'PennyLane is good for VQE'.",
    whyCorrect: "The loop's third step chooses the next parameters, and choosing them well means differentiating the cost with respect to each one. Treating a circuit as a differentiable function makes that derivative fall out of the same machinery that evaluates it, rather than out of hand-written finite differences.",
    whyWrong: ["A vague answer such as 'PennyLane helps with VQE', without identifying the specific step and the mechanism of gradients for parameter updates, misses the precision this question asks for."],
  },
};
