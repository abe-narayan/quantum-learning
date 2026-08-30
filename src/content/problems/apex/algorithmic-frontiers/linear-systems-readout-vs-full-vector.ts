import type { ConceptualProblem } from "@/lib/problems/types";

export const linearSystemsReadoutVsFullVector: ConceptualProblem = {
  meta: {
    slug: "linear-systems-readout-vs-full-vector",
    title: "Why a Small Readout Preserves the Speedup and Full Readout Doesn't",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems",
    difficulty: "master",
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
      {
        phrases: ["small readout", "expectation value", "observable", "few measurements", "O(1) measurements"],
        missingFeedback:
          "You have said what full readout costs. Now say what kind of output would be cheap enough to leave the advantage standing, and roughly how much of the state you would have to touch to get it.",
      },
      {
        phrases: [
          "grows with n",
          "scales with n",
          "grows with the dimension",
          "scales with the dimension",
          "grows with the size",
          "tomography",
          "cost of full readout",
          "erases the speedup",
          "destroys the speedup",
          "kills the speedup",
          "exponential in n",
          "every amplitude",
          "all n amplitudes",
        ],
        missingFeedback:
          "You have named the cheap side but not the expensive one. Rebuilding the entire solution vector to fixed precision is a measurement job in its own right, and its price is what cancels the advantage of holding N numbers on log₂N qubits.",
      },
    ],
    incorrectFeedback:
      "The mistake is picturing the algorithm as handing back the solution vector the way a classical solver does. What it hands back is a register, and each number you want out of that register has to be paid for separately. Whether anything was saved is decided by that second bill, not the first.",
    partialFeedback:
      "You named one side of the ledger. The answer needs both: the kind of question about x whose price is the same whether the system is tiny or huge, and the kind whose price climbs fast enough to swallow the whole advantage.",
    modelAnswers: [
      "Saying it 'outputs x' is misleading because you get a quantum state, not a list of numbers. Reading every amplitude means tomography, and that cost grows with the dimension until it erases the speedup. It only survives if what you actually want is a small readout like an expectation value you can get from a few measurements.",
      "The algorithm hands you the state, not the vector. To get all N amplitudes you would need tomography that scales with the dimension and kills the speedup. If instead you only need one observable, a few measurements are enough and the advantage is real.",
      "You never get to see every amplitude. Extracting all of them is a cost that grows with the size of the problem and destroys the speedup. The claim is only honest when the desired output is one expectation value, which O(1) measurements give you.",
    ],
  },
  hints: [
    { text: "The register holding x sits on log₂N qubits. A single shot does not hand those N numbers back; it returns one bitstring sampled from them." },
    { text: "Some questions about x can be answered to fixed precision with a number of repeated runs that does not depend on how large the system is. Ask which ones." },
    { text: "Rebuilding the entire vector to fixed precision is a different and much larger measurement job. Ask what that job costs, and compare it against what the encoding saved." },
  ],
  solution: {
    steps: [
      { description: "The algorithm's output is a quantum state, not a list of classical numbers; (0.7071, 0.7071) are amplitudes encoded across qubits, inaccessible directly by measurement." },
      { description: "A small readout (an expectation value like ⟨x|X|x⟩=1, or a handful of specific amplitudes) can be estimated with a number of measurements that does not grow with the system size N, preserving the algorithm's log₂N-qubit advantage." },
      { description: "Reconstructing the full N-dimensional vector x to fixed precision is a state-tomography problem whose cost scales with N, which erases the exponential-in-N advantage the algorithm was built to provide; a real, unqualified speedup requires the desired output to be a small readout, not the full vector." },
    ],
    finalAnswer:
      "Claiming the algorithm 'outputs x' is misleading because the output is a quantum state whose amplitudes aren't classically readable without a tomography-scale cost that grows with N. Only when the actual goal is a small readout (an expectation value or a few amplitudes), extractable with O(1)-scale measurements, does the quantum advantage survive.",
  },
  explanation: {
    correctIdea: "The entire quantum-versus-classical comparison hinges on what counts as 'the answer': a full vector, or a small extracted quantity.",
    whyCorrect: "This is the fourth of the lesson's four honesty conditions, and the reason careful treatments of HHL/QSVT-based linear solvers always specify what is being read out.",
    whyWrong: ["Saying only 'you need to measure the state' without naming that a small readout specifically (not full tomography) is what preserves the speedup misses the actual mechanism of the caveat."],
  },
};
