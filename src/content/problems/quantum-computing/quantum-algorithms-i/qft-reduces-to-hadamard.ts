import type { ConceptualProblem } from "@/lib/problems/types";

export const qftReducesToHadamard: ConceptualProblem = {
  meta: {
    slug: "qft-reduces-to-hadamard",
    title: "Why QFT Equals H for a Single Qubit",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["qft"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform"],
  },
  question: {
    type: "conceptual",
    prompt: "Using QFT's defining formula directly (not just citing the lesson), show why QFT|0⟩ equals H|0⟩ for n=1.",
    placeholder: "Plug j=0, N=2 into the QFT formula...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["e^0", "e^{0}", "exponent is 0", "exponent is zero", "zero exponent", "phase factor", "every phase", "each phase", "phases are", "phases all", "phase is 1", "phase equals 1", "no phase", "both terms 1", "all terms equal"],
      ["1/√2", "1/sqrt(2)", "1/sqrt2", "1/root 2", "equal superposition", "plus state", "|+>", "|+⟩", "h|0", "hadamard on |0", "same state as", "identical to h", "matches h"],
    ],
    incorrectFeedback: "Plug j=0 and N=2 directly into QFT|j⟩=(1/√N)Σₖ e^{2πijk/N}|k⟩ and simplify each term.",
    partialFeedback: "Good start. Now connect the resulting state to what the Hadamard produces from |0⟩, written out explicitly.",
  },
  hints: [
    { text: "Write out the defining sum for QFT|j⟩ with N=2, then set j=0. What happens inside each exponential?" },
    { text: "Evaluate the two exponentials. What number does each one become?" },
    { text: "Compare the two-term state you get with what the Hadamard sends |0⟩ to. Are they the same vector?" },
  ],
  solution: {
    steps: [
      { description: "QFT|0⟩ = (1/√2)(e^0|0⟩+e^0|1⟩) = (1/√2)(|0⟩+|1⟩)." },
      { description: "This is exactly H|0⟩ by H's own definition." },
    ],
    finalAnswer: "QFT|0⟩=(1/√2)(|0⟩+|1⟩)=H|0⟩. The two states are identical.",
  },
  explanation: {
    correctIdea: "With j=0, every phase factor in the QFT sum trivially equals 1, reproducing exactly H's own output.",
    whyCorrect: "This matches the engine's direct output for both QFT and H applied to |0⟩.",
    whyWrong: ["Just asserting 'they're both known to be equal' without doing the substitution skips the actual derivation the question asks for."],
  },
};
