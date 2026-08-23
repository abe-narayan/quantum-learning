import type { ConceptualProblem } from "@/lib/problems/types";

export const qubitAsInstanceOfPostulates: ConceptualProblem = {
  meta: {
    slug: "qubit-as-instance-of-postulates",
    title: "Synthesis: A Qubit as an Instance of the Postulates",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/from-postulates-to-quantum-computing",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["synthesis", "postulates", "quantum-computing"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/from-postulates-to-quantum-computing"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In two or three sentences, explain how a qubit is an instance of the four general postulates this course built, rather than requiring separate physics of its own.",
    placeholder: "Explain the relationship between qubits and the general postulates...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["two-dimensional", "2-dimensional", "two-level", "c^2", "dimension 2"],
      ["same postulates", "general framework", "not new physics", "specific instance", "special case", "no new postulates"],
    ],
    incorrectFeedback:
      "Name both pieces explicitly: what makes a qubit's Hilbert space specific (its dimension), and why the postulates governing it aren't new or different.",
    partialFeedback: "You're partway there — say something about both the specific dimension and the general postulates applying unchanged.",
  },
  hints: [
    { text: "What is the dimension of a single qubit's Hilbert space?" },
    { text: "Do the four postulates from this course need to change at all to describe a qubit?" },
  ],
  solution: {
    steps: [
      { description: "A qubit's Hilbert space is $\\mathbb{C}^2$ — the smallest nontrivial complex Hilbert space." },
      { description: "The same four postulates (state, observable, measurement, dynamics) apply completely unchanged; only the specific Hilbert space and operators are specialized to two dimensions." },
    ],
    finalAnswer:
      "A qubit is simply a 2-dimensional Hilbert space; the general postulates of quantum mechanics apply to it exactly as they apply to any other quantum system, with no separate rules needed.",
  },
  explanation: {
    correctIdea: "Quantum computing doesn't introduce new physical postulates — it specializes existing ones to the smallest useful Hilbert space.",
    whyCorrect: "This is the entire content of this lesson's recap table, restated in the student's own words.",
    whyWrong: ["Describing qubits as needing 'their own quantum computing rules' misses that every such rule — superposition, measurement, gates — is a direct instance of a postulate already fully derived in this course."],
  },
};
