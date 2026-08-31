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
      {
        phrases: ["not an integer", "r/2", "no integer", "fraction"],
        missingFeedback:
          "Write down the quantity the reduction needs, a raised to half the order, and say what happens to that exponent when the order is odd.",
      },
      {
        phrases: ["difference of squares", "identity requires", "can't apply"],
        missingFeedback:
          "You have said what goes wrong with the exponent. Now name the specific algebraic identity the reduction is built on, and say what it has left to work with once that quantity is gone.",
      },
    ],
    incorrectFeedback: "You answered that odd orders are 'rare' or 'unlucky', which is about frequency rather than mechanism. Halve the order and ask whether the result can be used as an exponent at all, then check what the reduction needs that exponent for.",
    partialFeedback: "You have the half-integer exponent. Now connect it to the algebraic identity the reduction leans on: what does that identity need, and which ingredient is missing?",
    modelAnswers: [
      "If r is odd then r/2 is not an integer, so a^(r/2) is not an integer power at all. The difference of squares identity requires that quantity to exist, so there is nothing to factor and the reduction is undefined rather than merely unsuccessful.",
      "a^(r/2) only makes sense for even r. With odd r the exponent is a fraction, so you can't apply the difference of squares identity the whole reduction is built on.",
    ],
  },
  hints: [
    { text: "Write down the algebraic identity the reduction uses, and note which exponent it needs." },
    { text: "Halve an odd order and look at the result. Can it serve as an exponent in that identity?" },
    { text: "With that exponent unavailable, say what is left of the identity and what the algorithm can still do with it." },
  ],
  solution: {
    steps: [
      { description: "The reduction's identity is (a^(r/2))²≡1, factored as (a^(r/2)-1)(a^(r/2)+1)≡0." },
      { description: "This requires r/2 to be an integer exponent, which only happens when r is even." },
      { description: "For odd r there is no integer a^(r/2) to substitute into the identity, so the reduction does not apply at all rather than applying and failing." },
    ],
    finalAnswer: "For odd r, a^(r/2) isn't an integer power, so the difference-of-squares identity has nothing to factor. The reduction is undefined, not merely unsuccessful.",
  },
  explanation: {
    correctIdea: "The reduction's applicability, not just its success, depends on r's parity.",
    whyCorrect: "This is why the algorithm's random-restart strategy checks r's parity before attempting the gcd step at all.",
    whyWrong: ["Saying 'it doesn't work as well' understates the issue: for odd r the reduction has no defined quantity to compute, not merely a worse one."],
  },
};
