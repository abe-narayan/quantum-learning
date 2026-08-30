import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const threeWallsClassificationMc: MultipleChoiceProblem = {
  meta: {
    slug: "three-walls-classification-mc",
    title: "Classifying the Course's Three Walls",
    course: "advanced-algorithms-and-complexity",
    lesson: "quantum-mastery/advanced-algorithms-and-complexity/capstone-what-scale-actually-requires",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["capstone", "synthesis"],
    prerequisites: ["quantum-mastery/advanced-algorithms-and-complexity/capstone-what-scale-actually-requires"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Barren plateaus' O(2⁻ⁿ) gradient variance scaling (Module 5) and Trotterization's t²‖[A,B]‖/2n error bound (Module 2) are both 'walls' this capstone names. What do they have in common, as this capstone characterizes them?",
    options: [
      { id: "a", text: "Both are quantitative, derived scaling laws describing a real cost or degradation, not proofs that the underlying task is impossible" },
      { id: "b", text: "Both are asymptotic statements whose constants are unknown, so neither can be turned into a concrete resource estimate for a given circuit" },
      { id: "c", text: "Both are unconditional complexity-theoretic separations between BPP and BQP, established without any further assumption" },
      { id: "d", text: "Neither has been verified numerically anywhere in this course; both are asserted on the authority of the published literature" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Both carry explicit constants. Trotter's bound names t²‖[A,B]‖/2n outright, and the variance law was measured against a real ansatz, so each turns into a number as soon as the parameters are fixed.",
      c: "Neither result concerns BPP vs BQP directly; that's Module 1's separate concern (oracle separations), not what Modules 2 or 5 established.",
      d: "Both were verified numerically in this course: Module 2 against exact matrix exponentiation on a real 2-qubit Hamiltonian, Module 5 against a real multi-qubit ansatz's measured gradient variance.",
    },
    defaultIncorrectFeedback: "Recall the capstone's explicit point that all three walls are quantitative scaling laws with active research pushing against them, not proofs of impossibility.",
  },
  hints: [
    { text: "The capstone explicitly warns against reading any of the three walls as a no-go theorem." },
    { text: "Both were numerically verified directly in their respective lessons, not just cited." },
    { text: "Both describe how a cost (error, or gradient magnitude) scales with a parameter (step count, or qubit count), not whether the task is possible at all." },
  ],
  solution: {
    steps: [
      { description: "Module 2's bound describes how simulation error scales with step count and Hamiltonian structure." },
      { description: "Module 5's result describes how gradient variance scales with qubit count and circuit depth." },
      { description: "Both are derived, numerically verified quantitative scaling laws: real costs to manage, not proofs that the underlying task is impossible." },
    ],
    finalAnswer: "Both are quantitative, derived scaling laws describing a real cost, not proofs that the underlying task is impossible.",
  },
  explanation: {
    correctIdea: "This capstone's central methodological point is the difference between a quantified cost and an impossibility proof.",
    whyCorrect: "Both lessons derived explicit formulas and verified them against real computation, giving actionable numbers rather than qualitative claims.",
    whyWrong: [
      { optionId: "b", text: "Treats both as constant-free asymptotics. Each comes with a stated constant and each was evaluated on a concrete example in its own lesson." },
      { optionId: "c", text: "Neither result concerns BPP versus BQP. That is Module 1's separate topic of oracle separations." },
      { optionId: "d", text: "Both were verified numerically in this course: Module 2 against exact matrix exponentiation, Module 5 against a real ansatz's measured gradient variance." },
    ],
  },
};
