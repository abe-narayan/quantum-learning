import type { ConceptualProblem } from "@/lib/problems/types";

export const vertexStabilizerLocality: ConceptualProblem = {
  meta: {
    slug: "vertex-stabilizer-locality",
    title: "Why Vertex Stabilizers Stay 4-Local at Any Grid Size",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["surface-codes"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why a surface code's vertex stabilizer always touches exactly 4 qubits, regardless of whether the overall grid is 3×3 or 300×300.",
    placeholder: "Think about what physically defines a vertex stabilizer's qubits...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["edges meeting", "adjacent", "touching that vertex", "local"],
      ["independent of grid size", "doesn't grow", "regardless of"],
    ],
    incorrectFeedback: "Think about what physically defines which qubits a vertex stabilizer includes — the vertex's immediate neighbors, or the whole grid?",
    partialFeedback: "Good — now state explicitly why this count is independent of overall grid size.",
  },
  hints: [
    { text: "A vertex stabilizer is defined by the qubits on the edges meeting at that one vertex." },
    { text: "A 2D grid vertex has exactly 4 edges meeting it, regardless of the grid's overall size." },
    { text: "Growing the grid adds more vertices (each with their own local stabilizer), not more qubits per stabilizer." },
  ],
  solution: {
    steps: [
      { description: "A vertex stabilizer is defined purely locally: the qubits on the edges touching that one vertex." },
      { description: "Any interior vertex of a 2D grid has exactly 4 edges meeting it, whether the grid is 3×3 or 300×300." },
      { description: "Growing the grid adds more vertices (each with its own 4-qubit stabilizer), not more qubits within any single stabilizer." },
    ],
    finalAnswer: "Each vertex stabilizer is defined by local geometry (4 edges per vertex), which doesn't change as the overall grid grows — only the number of stabilizers grows.",
  },
  explanation: {
    correctIdea: "Locality is a per-stabilizer property, distinct from the total code size — this is exactly what makes the construction scale to arbitrarily large distance without any single measurement becoming harder.",
    whyCorrect: "This is the structural fact underlying the whole lesson's contrast with the Shor code's whole-group stabilizers.",
    whyWrong: ["Assuming stabilizers must grow with the grid confuses the code's overall size (n, growing) with any individual stabilizer's locality (fixed at 4)."],
  },
};
