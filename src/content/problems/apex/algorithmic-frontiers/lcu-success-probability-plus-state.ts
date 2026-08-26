import type { NumericProblem } from "@/lib/problems/types";

export const lcuSuccessProbabilityPlusState: NumericProblem = {
  meta: {
    slug: "lcu-success-probability-plus-state",
    title: "Block-Encoding Success Probability for |+⟩",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "numeric",
    tags: ["block-encoding", "lcu", "post-selection"],
    prerequisites: ["apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries"],
  },
  question: {
    type: "numeric",
    prompt:
      "This lesson's worked example block-encodes A = (X+Z)/2 via PREPARE (a Hadamard on the ancilla), SELECT (X on the system in the ancilla=0 branch via an X-conjugated CNOT, Z on the system in the ancilla=1 branch via CZ), and PREPARE-dagger (another Hadamard). If the system qubit starts in |+> = (|0>+|1>)/sqrt(2) instead of the lesson's own example state, what is the probability of measuring the ancilla in |0> after running the circuit?",
    inputHint: "a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: 0.5,
    tolerance: 0.01,
    incorrectFeedback:
      "Use the eigenstate relations X|+>=|+> and Z|+>=|-> to get A|+> = (X+Z)/2 |+> = (|+>+|->)/2. Expand |+> and |-> in the computational basis, simplify (the |1> components cancel), then take the squared norm of the result -- that norm-squared IS the success probability, exactly as this lesson derived (||alpha||_1 = 1 here, so there's no extra rescaling).",
  },
  hints: [
    { text: "The success probability of post-selecting the ancilla on |0> is exactly |A|psi>|^2 whenever ||alpha||_1 = 1, as here (alpha_0=alpha_1=1/2 sum to 1) -- this lesson derived that fact directly, not just asserted it." },
    { text: "X and Z each have |+> and |-> as eigenstates: X|+>=|+>, Z|+>=|->." },
    { text: "A|+> = (|+>+|->)/2. Writing both in the computational basis, the |1> components cancel and only a |0> component survives." },
  ],
  solution: {
    steps: [
      { description: "Use the eigenstate relations $X|+\\rangle=|+\\rangle$ and $Z|+\\rangle=|-\\rangle$, so $A|+\\rangle=\\frac{X|+\\rangle+Z|+\\rangle}{2}=\\frac{|+\\rangle+|-\\rangle}{2}$." },
      { description: "Expand in the computational basis: $|+\\rangle=\\frac{|0\\rangle+|1\\rangle}{\\sqrt2}$ and $|-\\rangle=\\frac{|0\\rangle-|1\\rangle}{\\sqrt2}$, so $|+\\rangle+|-\\rangle=\\sqrt2|0\\rangle$, giving $A|+\\rangle=\\frac{1}{\\sqrt2}|0\\rangle$." },
      { description: "The success probability is $\\|A|+\\rangle\\|^2=\\left(\\frac{1}{\\sqrt2}\\right)^2=\\frac12$." },
    ],
    finalAnswer: "0.5",
  },
  explanation: {
    correctIdea:
      "The ancilla-|0> success probability of a normalized (||alpha||_1=1) block encoding is exactly |A|psi>|^2, computed directly from A's action on the input state -- no need to re-simulate the whole circuit.",
    whyCorrect:
      "This is exactly the general formula this lesson derives via the PREPARE/SELECT/PREPARE-dagger sandwich, specialized to this lesson's own A and ||alpha||_1=1.",
    whyWrong: [
      "Assuming the success probability is always the same 1/2 seen in the lesson's own worked example for every operator A would be wrong in general -- it happens to be a constant 1/2 here for every input specifically because A^2=I/2 for this particular A (since X and Z anticommute), not as a general property of block encodings.",
    ],
  },
};
