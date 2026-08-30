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
      {
        phrases: ["e^0", "e^{0}", "exponent is 0", "exponent is zero", "zero exponent", "phase factor", "every phase", "each phase", "phases are", "phases all", "phase is 1", "phase equals 1", "no phase", "both terms 1", "all terms equal"],
        missingFeedback:
          "Substitute the values in and look at the exponent. Say what number each term of the sum gets multiplied by when j=0.",
      },
      {
        phrases: ["1/√2", "1/sqrt(2)", "1/sqrt2", "1/root 2", "equal superposition", "plus state", "|+>", "|+⟩", "h|0", "hadamard on |0", "same state as", "identical to h", "matches h"],
        missingFeedback:
          "You have simplified the sum. Now write out the state it leaves and name the familiar single-qubit state it equals.",
        anchors: {
          "|+>": "Ket notation strips to nothing, so it is matched raw. This is the ASCII form a student types without a special keyboard.",
          "|+⟩": "The same ket in the notation the lesson prints.",
        },
      },
    ],
    incorrectFeedback: "Put j = 0 and N = 2 into the defining sum yourself rather than citing the lesson's statement about the one-qubit case. Evaluate the two exponentials that result, and compare the vector you get with what a Hadamard does to the zero state.",
    partialFeedback: "You have one half. Now write the other side out in full: what vector does the Hadamard send the zero state to? Then set the two vectors beside each other.",
    modelAnswers: [
      "Put j=0 and N=2 into the QFT sum. Every exponent is 0, so every phase factor is 1, and you are left with (1/sqrt(2))(|0>+|1>). That is exactly H|0>, the plus state.",
      "With j=0 the exponent is zero for both terms, so all terms equal 1 and the sum is (1/sqrt(2))(|0>+|1>). That is an equal superposition, identical to H acting on |0>.",
    ],
  },
  hints: [
    { text: "Write the defining sum for QFT|j⟩ with N = 2, leaving j general. Count its terms." },
    { text: "Now set j = 0 and look at what each exponential's argument becomes." },
    { text: "Evaluate the two exponentials and write the resulting two-component vector. Then write the vector the Hadamard produces from the zero state and compare." },
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
