import type { ConceptualProblem } from "@/lib/problems/types";

export const linearSystemsReadoutVsFullVector: ConceptualProblem = {
  meta: {
    slug: "linear-systems-readout-vs-full-vector",
    title: "Why a Small Readout Preserves the Speedup and Full Readout Doesn't",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["quantum-linear-systems", "hhl", "qsvt", "misleading-claims"],
    prerequisites: ["apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems"],
  },
  question: {
    type: "conceptual",
    prompt:
      "This lesson's worked example produced a state with amplitudes (0.7071, 0.7071) for b=(1,1)ᵀ, and showed that ⟨x|X|x⟩=1 is a legitimate quantity extracted from a handful of measurements. Explain precisely why claiming the algorithm 'outputs the solution vector x' is misleading, and what specifically would have to be true about the desired output for a real, unqualified quantum speedup to survive at large N.",
    placeholder: "Think about what it costs, as N grows, to read every amplitude of an N-dimensional state to fixed precision, versus what it costs to read one expectation value...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["small readout", "expectation value", "observable", "few measurements", "O(1) measurements"],
      ["grows with n", "scales with n", "tomography", "cost of full readout", "erases the speedup", "exponential in n"],
    ],
    incorrectFeedback:
      "Focus on the concrete asymmetry: extracting one expectation value like ⟨x|M|x⟩ costs O(1)-scale measurements regardless of N, while reading out all N amplitudes to fixed precision costs resources that grow with N, undoing the log₂N-qubit encoding's advantage.",
    partialFeedback:
      "You're close — be explicit about both halves: name the specific kind of small readout (an expectation value or a few amplitudes) that stays cheap, and name why full amplitude readout's cost growing with N is what destroys the speedup.",
  },
  hints: [
    { text: "The state |x⟩ lives on log₂N qubits; its N amplitudes are what a single measurement collapses down to one bit-string sample of, not a readable list of numbers." },
    { text: "An expectation value ⟨x|M|x⟩ can be estimated to fixed precision with a number of repeated circuit runs that doesn't grow with N." },
    { text: "Reconstructing all N amplitudes to fixed precision is a state-tomography problem, whose cost grows with N — exactly the resource the log₂N-qubit encoding was trying to avoid paying." },
  ],
  solution: {
    steps: [
      { description: "The algorithm's output is a quantum state, not a list of classical numbers; (0.7071, 0.7071) are amplitudes encoded across qubits, inaccessible directly by measurement." },
      { description: "A small readout — an expectation value like ⟨x|X|x⟩=1, or a handful of specific amplitudes — can be estimated with a number of measurements that does not grow with the system size N, preserving the algorithm's log₂N-qubit advantage." },
      { description: "Reconstructing the full N-dimensional vector x to fixed precision is a state-tomography problem whose cost scales with N, which erases the exponential-in-N advantage the algorithm was built to provide; a real, unqualified speedup requires the desired output to be a small readout, not the full vector." },
    ],
    finalAnswer:
      "Claiming the algorithm 'outputs x' is misleading because the output is a quantum state whose amplitudes aren't classically readable without a tomography-scale cost that grows with N; only when the actual goal is a small readout (an expectation value or a few amplitudes) — extractable with O(1)-scale measurements — does the quantum advantage survive.",
  },
  explanation: {
    correctIdea: "The entire quantum-vs-classical comparison hinges on what counts as 'the answer' — a full vector or a small extracted quantity.",
    whyCorrect: "This is exactly the fourth of the lesson's four honesty conditions, and the reason careful treatments of HHL/QSVT-based linear solvers always specify what is actually being read out.",
    whyWrong: ["Saying only 'you need to measure the state' without naming that a small readout specifically (not full tomography) is what preserves the speedup misses the actual mechanism of the caveat."],
  },
};
