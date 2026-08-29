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
      ["edges meeting", "edges that meet", "edges at the vertex", "adjacent", "neighboring", "neighbors", "neighbours", "touching that vertex", "touch the vertex", "incident", "four edges", "4 edges", "is local", "locality", "locally", "local geometry", "local structure", "local property", "local definition", "local neighborhood", "defined locally"],
      ["independent of grid size", "independent of the grid", "independent of size", "doesn't grow", "does not grow", "doesn't depend on", "does not depend on", "same at any size", "any grid size", "stays 4", "stays four", "always 4", "always four", "fixed at", "stays fixed", "remains fixed", "never changes", "doesn't change", "does not change", "no matter", "regardless of"],
    ],
    incorrectFeedback: "Ask what geometric feature picks out the qubits a single vertex operator includes: something near that one vertex, or the whole grid?",
    partialFeedback: "Good. Now say explicitly why that count stays put as the grid gets bigger.",
  },
  hints: [
    { text: "Which qubits does one vertex operator act on? Think about what geometric feature picks them out." },
    { text: "How many of those features does a single interior vertex of a 2D square grid have? Does that number know anything about the total grid?" },
    { text: "When the grid grows, what multiplies: the number of stabilizers, or the size of each one?" },
  ],
  solution: {
    steps: [
      { description: "A vertex stabilizer is defined purely locally: the qubits on the edges touching that one vertex." },
      { description: "Any interior vertex of a 2D grid has exactly 4 edges meeting it, whether the grid is 3×3 or 300×300." },
      { description: "Growing the grid adds more vertices (each with its own 4-qubit stabilizer), not more qubits within any single stabilizer." },
    ],
    finalAnswer: "Each vertex stabilizer is defined by local geometry (4 edges per vertex), which doesn't change as the overall grid grows. Only the number of stabilizers grows.",
  },
  explanation: {
    correctIdea: "Locality is a per-stabilizer property, distinct from the total code size. This is exactly what makes the construction scale to arbitrarily large distance without any single measurement becoming harder.",
    whyCorrect: "This is the structural fact underlying the whole lesson's contrast with the Shor code's whole-group stabilizers.",
    whyWrong: ["Assuming stabilizers must grow with the grid confuses the code's overall size (n, growing) with any individual stabilizer's locality (fixed at 4)."],
  },
};
