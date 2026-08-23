import type { ConceptualProblem } from "@/lib/problems/types";

export const unitarityBoundsTransitionProbability: ConceptualProblem = {
  meta: {
    slug: "unitarity-bounds-transition-probability",
    title: "Why the Exact Transition Probability Can Never Exceed 1",
    course: "approximation-methods",
    lesson: "quantum-mechanics/approximation-methods/time-dependent-perturbation-theory",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["time-dependent-perturbation-theory", "conceptual"],
    prerequisites: ["quantum-mechanics/approximation-methods/time-dependent-perturbation-theory"],
  },
  question: {
    type: "conceptual",
    prompt: "The exact (Runge-Kutta) two-level transition probability never exceeds 1, no matter how strong V is. Explain why, using the fact that time evolution is unitary.",
    placeholder: "Unitary time evolution preserves...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["unitary", "norm-preserving", "preserves"],
      ["|c_i|", "|c_f|", "sum", "total probability", "= 1"],
    ],
    incorrectFeedback: "Connect unitarity's norm-preservation property to the fact that |c_i(t)|²+|c_f(t)|² must equal 1 at every time t.",
    partialFeedback: "Good — now be explicit that this forces each individual probability, including P_f, to lie between 0 and 1.",
  },
  hints: [
    { text: "Unitary evolution preserves the total norm of the state vector at every instant." },
    { text: "For a 2-level system, this means |c_i(t)|²+|c_f(t)|²=1 for all t." },
    { text: "Since |c_i(t)|²≥0, this forces |c_f(t)|²=P_f(t)≤1 at every t." },
  ],
  solution: {
    steps: [
      { description: "Unitary time evolution preserves the norm of the state vector: |c_i(t)|²+|c_f(t)|²=1 for all t, exactly as at t=0." },
      { description: "Since |c_i(t)|²≥0 always, this forces |c_f(t)|²=P_f(t)≤1 at every instant — probability can never exceed 1, by construction of the exact dynamics." },
      { description: "The first-order perturbative formula has no such built-in constraint — it's an approximation that can (and, at strong coupling, does) produce values that would violate this bound if taken at face value." },
    ],
    finalAnswer: "Unitarity forces |c_i(t)|²+|c_f(t)|²=1 always, so P_f(t)=|c_f(t)|² can never exceed 1 — a constraint the exact RK4 integration respects automatically but the perturbative formula does not.",
  },
  explanation: {
    correctIdea: "This explains structurally why the exact and perturbative answers must eventually diverge at strong coupling: only one of them is built to respect the underlying unitarity constraint.",
    whyCorrect: "Matches the lesson's Common Mistakes point about interpreting an out-of-bounds perturbative estimate.",
    whyWrong: ["Attributing the bound to some property specific to this particular V or t misses that it's a completely general consequence of any unitary two-level evolution."],
  },
};
