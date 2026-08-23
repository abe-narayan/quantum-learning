import type { ConceptualProblem } from "@/lib/problems/types";

export const whyOddOrderFails: ConceptualProblem = {
  meta: {
    slug: "why-odd-order-fails",
    title: "Why an Odd Order Gives the Reduction Nothing to Work With",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["shors-algorithm"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain, using the difference-of-squares identity the reduction relies on, why an odd order r gives the algorithm nothing to work with.",
    placeholder: "Think about what a^(r/2) even means if r is odd...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["not an integer", "r/2", "no integer", "fraction"],
      ["difference of squares", "identity requires", "can't apply"],
    ],
    incorrectFeedback: "Consider what r/2 actually equals when r is odd — is it a whole number?",
    partialFeedback: "Good — now connect this directly to why the difference-of-squares identity can't be applied at all.",
  },
  hints: [
    { text: "The reduction needs a^(r/2) to be a well-defined integer exponent." },
    { text: "If r is odd, r/2 is not an integer." },
    { text: "Without a^(r/2), the identity (a^(r/2)-1)(a^(r/2)+1)≡0 has no meaning to apply." },
  ],
  solution: {
    steps: [
      { description: "The reduction's identity is (a^(r/2))²≡1, factored as (a^(r/2)-1)(a^(r/2)+1)≡0." },
      { description: "This requires r/2 to be an integer exponent, which only happens when r is even." },
      { description: "For odd r, there's no well-defined a^(r/2) to plug into the identity at all — the reduction simply doesn't apply, not that it applies and fails." },
    ],
    finalAnswer: "For odd r, a^(r/2) isn't an integer power, so the difference-of-squares identity has nothing to factor — the reduction is undefined, not merely unsuccessful.",
  },
  explanation: {
    correctIdea: "The reduction's applicability, not just its success, depends on r's parity.",
    whyCorrect: "This is exactly why the algorithm's random-restart strategy checks r's parity before attempting the gcd step at all.",
    whyWrong: ["Saying 'it just doesn't work as well' understates the issue — the reduction has no defined quantity to compute for odd r, not merely a worse one."],
  },
};
