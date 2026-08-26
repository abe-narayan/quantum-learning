import type { NumericProblem } from "@/lib/problems/types";

export const lcuPrepareRegisterSize: NumericProblem = {
  meta: {
    slug: "lcu-prepare-register-size",
    title: "Sizing the PREPARE Ancilla Register",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["lcu", "prepare", "ancilla-overhead"],
    prerequisites: ["apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries"],
  },
  question: {
    type: "numeric",
    prompt:
      "An LCU decomposition writes a target operator as A = sum_{i=0}^{4} alpha_i U_i, a sum of m=5 unitaries with arbitrary positive coefficients. Since a k-qubit ancilla register's computational basis states |0>,...,|2^k-1> index at most 2^k distinct terms, what is the minimum number of ancilla qubits PREPARE must act on so every one of the 5 terms gets its own basis state?",
    inputHint: "a whole number of qubits",
  },
  answer: {
    type: "numeric",
    value: 3,
    tolerance: 0,
    incorrectFeedback:
      "You need the smallest integer k with 2^k >= 5. k=2 gives 2^2=4, only enough for 4 terms -- one short. k=3 gives 2^3=8, which is enough (with 3 basis states simply left at zero amplitude), so k=3.",
  },
  hints: [
    { text: "Count the basis states available to a k-qubit register: 2^k." },
    { text: "You need 2^k >= m = 5." },
    { text: "2^2=4 is too few, but 2^3=8 is enough." },
  ],
  solution: {
    steps: [
      { description: "A $k$-qubit ancilla register has $2^k$ computational basis states, and PREPARE needs one per term, so the requirement is $2^k\\geq m=5$." },
      { description: "$k=2$ gives $2^2=4$, too few. $k=3$ gives $2^3=8\\geq5$, enough (with 3 of PREPARE's basis states simply left at zero amplitude)." },
    ],
    finalAnswer: "3 ancilla qubits (⌈log₂5⌉ = 3).",
  },
  explanation: {
    correctIdea:
      "The ancilla register size in an LCU block encoding is set by ceil(log2 m), the number of qubits needed to index m distinct SELECT branches, exactly as this lesson's PREPARE step requires.",
    whyCorrect:
      "This is exactly the general sizing rule this lesson states for PREPARE: an ancilla of ceil(log2 m) qubits, since a k-qubit register has 2^k, not k, basis states.",
    whyWrong: [
      "Using m itself (5) as the number of qubits massively overcounts -- a k-qubit register already has exponentially many, 2^k, basis states available, so the needed qubit count scales as log2(m), not linearly with m.",
    ],
  },
};
