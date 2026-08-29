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
      "You need the smallest integer k with 2^k >= 5. If you answered 5, you gave the number of terms rather than the qubit count: a k-qubit register indexes exponentially many terms, so the required k scales as a logarithm of m, not linearly.",
    nearMisses: [
      {
        value: 2,
        feedback:
          "You rounded log2(5) down. Two qubits give only 4 basis states, one short of the 5 terms, so the fifth term would have nowhere to live: the rounding has to go up.",
      },
      {
        value: 8,
        feedback: "8 is the number of basis states a 3-qubit register provides. The question asks for the qubit count k, not 2^k.",
      },
      {
        value: 5,
        feedback: "5 is the number of terms m. A k-qubit register indexes 2^k of them, so the qubit count grows like log2(m), not like m.",
      },
    ],
  },
  hints: [
    { text: "The register's job is to give each of the m terms its own basis state, so first count how many basis states a k-qubit register offers." },
    { text: "You need the smallest k with 2^k >= m = 5." },
    { text: "Check successive powers of two until one first reaches or passes 5. The answer is that exponent k, not the number of basis states it provides." },
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
