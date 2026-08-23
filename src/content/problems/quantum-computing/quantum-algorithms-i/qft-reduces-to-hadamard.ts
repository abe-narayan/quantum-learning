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
      ["e^0", "e^{2\\pi i", "phase", "both terms 1"],
      ["1/√2", "same as h", "matches h|0"],
    ],
    incorrectFeedback: "Plug j=0 and N=2 directly into QFT|j⟩=(1/√N)Σₖ e^{2πijk/N}|k⟩ and simplify each term.",
    partialFeedback: "Good — now explicitly connect the resulting state to H|0⟩'s known form.",
  },
  hints: [
    { text: "QFT|0⟩ = (1/√2)Σₖ e^{2πi(0)k/2}|k⟩ for k=0,1." },
    { text: "Every exponent is 0 when j=0, so every phase factor is e^0=1." },
    { text: "This gives (1/√2)(|0⟩+|1⟩), which is exactly H|0⟩." },
  ],
  solution: {
    steps: [
      { description: "QFT|0⟩ = (1/√2)(e^0|0⟩+e^0|1⟩) = (1/√2)(|0⟩+|1⟩)." },
      { description: "This is exactly H|0⟩ by H's own definition." },
    ],
    finalAnswer: "QFT|0⟩=(1/√2)(|0⟩+|1⟩)=H|0⟩ — identical states.",
  },
  explanation: {
    correctIdea: "With j=0, every phase factor in the QFT sum trivially equals 1, reproducing exactly H's own output.",
    whyCorrect: "This matches the engine's direct output for both QFT and H applied to |0⟩.",
    whyWrong: ["Just asserting 'they're both known to be equal' without doing the substitution skips the actual derivation the question asks for."],
  },
};
