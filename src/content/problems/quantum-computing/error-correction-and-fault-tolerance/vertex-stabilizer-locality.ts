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
    prompt: "Explain why a surface code's vertex stabilizer at an interior vertex touches exactly 4 qubits, regardless of whether the overall grid is 3×3 or 300×300. (Stabilizers on the boundary of a finite patch are smaller; the question is about why the count does not grow with the lattice.)",
    placeholder: "Think about what physically defines a vertex stabilizer's qubits...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["edges meeting", "edges that meet", "edges at the vertex", "adjacent", "neighboring", "neighbors", "neighbours", "touching that vertex", "touch the vertex", "incident", "four edges", "4 edges", "is local", "locality", "locally", "local geometry", "local structure", "local property", "local definition", "local neighborhood", "defined locally"],
        missingFeedback:
          "Say what actually picks out the qubits a vertex stabilizer acts on. The count follows from that definition, not from the size of the lattice.",
      },
      {
        phrases: ["independent of grid size", "independent of the grid", "independent of size", "doesn't grow", "does not grow", "doesn't depend on", "does not depend on", "same at any size", "any grid size", "stays 4", "stays four", "always 4", "always four", "fixed at", "stays fixed", "remains fixed", "never changes", "doesn't change", "does not change", "no matter", "regardless of"],
        missingFeedback:
          "You have the definition. Now state the consequence explicitly: say what happens to that count as the lattice is enlarged, and what does get bigger instead.",
      },
    ],
    incorrectFeedback: "You answered '4 because the lattice is square', which is nearly right but skips the step that matters. Say which geometric objects at a vertex the operator is built from, then check whether their count could ever consult the lattice's overall size.",
    partialFeedback: "Now say why that count stays put as the grid gets bigger.",
    modelAnswers: [
      "A vertex stabilizer is defined by the edges meeting at that one vertex, and four edges meet at every interior vertex of the lattice. That is a local property, so it stays 4 no matter how big the grid gets; only the number of stabilizers grows.",
      "It only looks at its immediate neighbours, the four edges incident on that interior vertex. Nothing in that definition depends on the size of the lattice, so it stays four no matter how big the grid gets, whether 3x3 or 300x300. Boundary vertices have fewer edges, so their stabilizers are smaller, never larger.",
    ],
  },
  hints: [
    { text: "Which qubits does one vertex operator act on? Describe the geometric feature that picks them out, in words that mention only the vertex itself." },
    { text: "Count that feature at one interior vertex of a square lattice. Does the count consult the lattice's overall dimensions at any point?" },
    { text: "When the lattice is enlarged, something multiplies. Say which: the count per operator, or the number of operators." },
  ],
  solution: {
    steps: [
      { description: "A vertex stabilizer is defined purely locally: the qubits on the edges touching that one vertex." },
      { description: "Any interior vertex of a 2D grid has exactly 4 edges meeting it, whether the grid is 3×3 or 300×300." },
      { description: "Growing the grid adds more vertices (each with its own 4-qubit stabilizer), not more qubits within any single stabilizer." },
    ],
    finalAnswer: "Each vertex stabilizer is defined by local geometry (4 edges per interior vertex, fewer at a patch boundary), which doesn't change as the overall grid grows. Only the number of stabilizers grows.",
  },
  explanation: {
    correctIdea: "Locality is a per-stabilizer property, distinct from the total code size. This is exactly what makes the construction scale to arbitrarily large distance without any single measurement becoming harder.",
    whyCorrect: "This is the structural fact underlying the whole lesson's contrast with the Shor code's whole-group stabilizers.",
    whyWrong: ["Assuming stabilizers must grow with the grid confuses the code's overall size (n, growing) with any individual stabilizer's locality (fixed at 4)."],
  },
};
