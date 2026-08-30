import type { NumericProblem } from "@/lib/problems/types";

function A(): 1 {
  return 1;
}
function B(setting: "b" | "bPrime"): 1 | -1 {
  return setting === "b" ? 1 : -1;
}

const S = A() * B("b") + A() * B("bPrime") + A() * B("b") - A() * B("bPrime");

export const deterministicLhvChshValue: NumericProblem = {
  meta: {
    slug: "deterministic-lhv-chsh-value",
    title: "S for a Fully Deterministic LHV Model",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["bell-theorem", "chsh", "local-hidden-variables"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables"],
  },
  question: {
    type: "numeric",
    prompt:
      "A deterministic LHV model always gives A(a,λ)=A(a',λ)=+1, and B(b,λ)=+1, B(b',λ)=−1. Compute S=E(a,b)+E(a,b')+E(a',b)−E(a',b').",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value: S,
    tolerance: 0.01,
    incorrectFeedback: "Compute each of the four E terms first (each is just a product of two fixed ±1 outcomes), then combine with the CHSH signs.",
    nearMisses: [
      { value: 4, feedback: "4 adds the four correlators' magnitudes and drops their signs. Two of them are −1 here, and once those signs are carried through the combination the total is capped at 2." },
      { value: 0, feedback: "0 comes from adding all four terms. CHSH subtracts the last one, and subtracting E(a',b') = −1 adds 1 rather than removing it." },
      { value: 2 * Math.SQRT2, tolerance: 0.05, feedback: "2√2 is the Tsirelson bound, the quantum maximum. A deterministic local model cannot reach it; work the four fixed ±1 products through instead." },
    ],
  },
  hints: [
    { text: "E(a,b) = A(a)·B(b) = (+1)(+1) = 1." },
    { text: "E(a,b') = (+1)(-1) = -1. E(a',b) = (+1)(+1) = 1. E(a',b') = (+1)(-1) = -1." },
    { text: "S = E(a,b) + E(a,b') + E(a',b) - E(a',b')." },
  ],
  solution: {
    steps: [
      { description: "E(a,b)=1, E(a,b')=-1, E(a',b)=1, E(a',b')=-1 (each outcome is fixed, no averaging needed)." },
      { description: "$S = 1 + (-1) + 1 - (-1) = 2$" },
    ],
    finalAnswer: "S = 2, right at the classical boundary and not past it.",
  },
  explanation: {
    correctIdea: "Even this simple deterministic model reaches S=2 exactly, confirming the bound is tight: some LHV models do saturate it.",
    whyCorrect: "This is consistent with the theorem: |S|≤2 is not violated, and equality is achievable, unlike |S|>2 which no LHV model can reach.",
    whyWrong: ["Getting S=4 would come from forgetting the minus sign on the last term in the CHSH combination's definition."],
  },
};
