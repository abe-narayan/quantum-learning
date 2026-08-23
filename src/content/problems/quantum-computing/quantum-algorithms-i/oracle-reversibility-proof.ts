import type { ConceptualProblem } from "@/lib/problems/types";

export const oracleReversibilityProof: ConceptualProblem = {
  meta: {
    slug: "oracle-reversibility-proof",
    title: "Why the Oracle Model Is Reversible for Any f",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["oracle-model", "reversibility"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why U_f|x⟩|y⟩=|x⟩|y⊕f(x)⟩ is reversible for any function f, even ones that aren't reversible as ordinary classical functions (like AND).",
    placeholder: "Think about applying U_f twice in a row...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["xor", "⊕", "twice", "applied twice", "cancel"],
      ["same value", "f(x) twice", "returns", "original"],
    ],
    incorrectFeedback: "Try applying U_f to its own output and see what happens to the y register.",
    partialFeedback: "Good start — be explicit about XOR-ing the same value twice canceling out.",
  },
  hints: [
    { text: "Apply U_f once: y becomes y⊕f(x)." },
    { text: "Apply U_f again to that result: (y⊕f(x))⊕f(x)." },
    { text: "XOR-ing the same bit twice always cancels: a⊕a=0." },
  ],
  solution: {
    steps: [
      { description: "Applying U_f twice gives y⊕f(x)⊕f(x)." },
      { description: "Since f(x)⊕f(x)=0 for any value of f(x), this equals y — the original state." },
    ],
    finalAnswer: "U_f applied twice always returns the original state, for any f, because XOR-ing the same value twice cancels.",
  },
  explanation: {
    correctIdea: "The extra output register makes the map injective (different (x,y) pairs never collide), which is exactly what reversibility requires.",
    whyCorrect: "This works regardless of whether f itself is injective — the XOR trick is what supplies reversibility.",
    whyWrong: ["Claiming f itself must be invertible misses the point of the oracle construction — it works for AND, OR, or any other non-invertible f."],
  },
};
