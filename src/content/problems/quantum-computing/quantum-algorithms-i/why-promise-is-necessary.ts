import type { ConceptualProblem } from "@/lib/problems/types";

export const whyPromiseIsNecessary: ConceptualProblem = {
  meta: {
    slug: "why-promise-is-necessary",
    title: "Why Deutsch-Jozsa Needs the Constant-or-Balanced Promise",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["deutsch-jozsa", "conceptual"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why Deutsch-Jozsa's single-query certainty depends on the promise that f is either constant or balanced — what would go wrong for a function that's neither?",
    placeholder: "Think about the amplitude formula (1/2^n)Σₓ(−1)^f(x) for a function with, say, 3 zeros and 5 ones out of 8...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["between", "intermediate", "neither 0 nor", "not exactly"],
      ["ambiguous", "can't distinguish", "no longer certain", "unreliable"],
    ],
    incorrectFeedback: "Compute what the amplitude sum looks like for an unbalanced-but-not-constant split, like 3 zeros and 5 ones.",
    partialFeedback: "Good — now be explicit that this intermediate amplitude makes the single-query answer unreliable, not just 'different.'",
  },
  hints: [
    { text: "Try a function with 3 inputs giving f(x)=0 and 5 giving f(x)=1, out of 8 total." },
    { text: "The amplitude sum becomes (1/8)(3−5) = −2/8 = −0.25, not 0 or ±1." },
    { text: "A probability of 0.0625 (0.25²) is neither the constant nor balanced signature." },
  ],
  solution: {
    steps: [
      { description: "Without the promise, f could have any split of 0s and 1s, e.g. 3 and 5 out of 8." },
      { description: "The amplitude sum (1/8)(3(+1)+5(−1)) = −2/8 = −0.25 — neither ±1 (constant) nor exactly 0 (balanced)." },
      { description: "This intermediate probability doesn't reliably indicate anything about f without the promise ruling out this case." },
    ],
    finalAnswer: "Without the promise, the amplitude can land anywhere between −1 and 1, giving no reliable single-query answer.",
  },
  explanation: {
    correctIdea: "The promise is what guarantees the amplitude sum lands at exactly one of two distinguishable extremes.",
    whyCorrect: "This is exactly why the derivation's 'exactly ±1 or exactly 0' conclusion required the promise as an assumption.",
    whyWrong: ["Saying 'the algorithm still runs' is true but misses the actual question — it runs, but its single-query output is no longer a reliable indicator of anything without the promise."],
  },
};
