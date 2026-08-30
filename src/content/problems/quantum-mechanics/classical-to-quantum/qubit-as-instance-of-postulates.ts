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
      {
        phrases: ["two-dimensional", "2-dimensional", "two-level", "c^2", "dimension 2"],
        missingFeedback:
          "Say what a qubit is, as a mathematical object, in the vocabulary the postulates themselves use.",
      },
      {
        phrases: ["same postulates", "general framework", "not new physics", "specific instance", "special case", "no new postulates"],
        missingFeedback:
          "You have said what the object is. Now say what the postulates have to be given for it, and answer the question directly: is anything added?",
      },
    ],
    incorrectFeedback:
      "Name both pieces explicitly: what makes a qubit's Hilbert space specific (its dimension), and why the postulates governing it aren't new or different.",
    partialFeedback: "Say something about both the specific dimension and the general postulates applying unchanged.",
    modelAnswers: [
      "A qubit is just a two-dimensional Hilbert space. The four postulates apply to it exactly as they apply to anything else: states are unit vectors in that space, evolution is unitary, measurement follows the Born rule. No new postulates are needed, so it is a special case rather than new physics.",
      "It is the same general framework specialized to dimension 2. Nothing about a two-level system requires separate rules; it is a specific instance of the postulates already built.",
    ],
  },
  hints: [
    { text: "Two things have to be named: something specific to the qubit, and something general that does not change when you narrow to one." },
    { text: "For the specific part, ask how many complex numbers it takes to write a general single-qubit state, and what that count says about the space they live in." },
    { text: "For the general part, walk the four postulates one at a time and ask whether any of them had to be restated for a qubit, or only specialized." },
  ],
  solution: {
    steps: [
      { description: "A qubit's Hilbert space is $\\mathbb{C}^2$, the smallest nontrivial complex Hilbert space." },
      { description: "The same four postulates (state, observable, measurement, dynamics) apply completely unchanged; only the specific Hilbert space and operators are specialized to two dimensions." },
    ],
    finalAnswer:
      "A qubit is a 2-dimensional Hilbert space; the general postulates of quantum mechanics apply to it exactly as they apply to any other quantum system, with no separate rules needed.",
  },
  explanation: {
    correctIdea: "Quantum computing does not introduce new physical postulates; it specializes existing ones to the smallest useful Hilbert space.",
    whyCorrect: "This is the entire content of this lesson's recap table, restated in the student's own words.",
    whyWrong: ["Describing qubits as needing 'their own quantum computing rules' misses that every such rule (superposition, measurement, gates) is a direct instance of a postulate already derived in this course."],
  },
};
