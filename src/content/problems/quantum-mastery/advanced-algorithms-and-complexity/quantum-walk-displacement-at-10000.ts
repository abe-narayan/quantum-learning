import type { NumericProblem } from "@/lib/problems/types";

const T = 10000;
const value = T * Math.sqrt(1 - 1 / Math.sqrt(2));

export const quantumWalkDisplacementAt10000: NumericProblem = {
  meta: {
    slug: "quantum-walk-displacement-at-10000",
    title: "Quantum Walk Typical Displacement at T=10000",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/quantum-walks",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["quantum-walks", "ballistic-spreading"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/quantum-walks"],
  },
  question: {
    type: "numeric",
    prompt: "Using the cited asymptotic ⟨x²⟩ = (1−1/√2)T² for the Hadamard quantum walk, what is the typical displacement √⟨x²⟩ after T=10000 steps?",
    inputHint: "as a decimal, in position units",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 5,
    incorrectFeedback: "Compute √(1−1/√2) first (≈0.5412), then multiply by T=10000.",
  },
  hints: [
    { text: "√⟨x²⟩ = T·√(1−1/√2)." },
    { text: "1−1/√2 ≈ 1 − 0.70711 = 0.29289." },
    { text: "√0.29289 ≈ 0.5412, so the answer is about 0.5412 × 10000." },
  ],
  solution: {
    steps: [
      { description: "⟨x²⟩ = (1−1/√2)T², so √⟨x²⟩ = T√(1−1/√2)." },
      { description: "1−1/√2 ≈ 0.292893, and √0.292893 ≈ 0.541197." },
      { description: "At T=10000: typical displacement ≈ 0.541197 × 10000 ≈ 5411.97." },
    ],
    finalAnswer: "≈5412",
  },
  explanation: {
    correctIdea: "The quantum walk's typical displacement grows linearly in T, not as √T.",
    whyCorrect: "This directly uses the lesson's cited asymptotic variance constant, confirmed numerically in the lesson to four decimal places.",
    whyWrong: ["Using the classical formula √T (giving only 100) confuses the two walks' fundamentally different scaling laws — exactly the ballistic-vs-diffusive distinction this lesson derives."],
  },
};
