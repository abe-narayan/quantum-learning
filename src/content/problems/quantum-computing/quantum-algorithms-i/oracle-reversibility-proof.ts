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
      {
        phrases: ["xor", "⊕", "twice", "cancel", "self-inverse", "self inverse", "own inverse", "undoes itself", "involution"],
        missingFeedback:
          "Reversibility has a concrete test. Try running the operation a second time and say what the target register's bit does under that repeat.",
        anchors: {
          "⊕": "The XOR symbol strips to nothing, so it is matched raw. It is here for the student who writes the operation in symbols instead of naming it.",
        },
      },
      {
        phrases: ["same value", "returns", "original", "back to", "back where", "recover", "restores", "identity"],
        missingFeedback:
          "You have described the operation being repeated. Now say what state you are left with at the end, compared with the one you started from.",
      },
    ],
    incorrectFeedback: "You argued that AND cannot be undone, which is true of AND alone and not of this map. Apply U_f to its own output and look at what the second register holds after the second application.",
    partialFeedback: "Say what the second application does to the target register, and why nothing of f survives there.",
    modelAnswers: [
      "Apply U_f twice and you get |x>|y XOR f(x) XOR f(x)> = |x>|y>, because XOR-ing the same value twice cancels. So U_f is its own inverse and you always get back to the original state, whatever f is.",
      "U_f is self-inverse: running it a second time undoes it, since y XOR f(x) XOR f(x) returns y. That works for any f at all, even AND, because the extra register keeps the input around.",
    ],
  },
  hints: [
    { text: "Apply U_f once and write down what the second register holds." },
    { text: "Now apply the very same operator to that output. Write down what the second register holds this time, without simplifying." },
    { text: "Simplify that expression using the one algebraic fact about combining a bit with itself. What is left?" },
  ],
  solution: {
    steps: [
      { description: "Applying U_f twice gives y⊕f(x)⊕f(x)." },
      { description: "Since f(x)⊕f(x)=0 for any value of f(x), this equals y, the original state." },
    ],
    finalAnswer: "U_f applied twice always returns the original state, for any f, because XOR-ing the same value twice cancels.",
  },
  explanation: {
    correctIdea: "The extra output register makes the map injective (different (x,y) pairs never collide), which is exactly what reversibility requires.",
    whyCorrect: "This works regardless of whether f itself is injective. The XOR trick is what supplies reversibility.",
    whyWrong: ["Claiming f itself must be invertible misses the point of the oracle construction: it works for AND, OR, or any other non-invertible f."],
  },
};
