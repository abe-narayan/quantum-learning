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
    prompt: "Explain why Deutsch-Jozsa's single-query certainty depends on the promise that f is either constant or balanced. What would go wrong for a function that's neither?",
    placeholder: "Think about the amplitude formula (1/2^n)Σₓ(−1)^f(x) for a function with, say, 3 zeros and 5 ones out of 8...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["between", "intermediate", "middle", "neither 0 nor", "neither zero nor", "not exactly", "-0.25", "−0.25", "0.0625", "partial interference", "incomplete cancellation"],
        missingFeedback:
          "Evaluate the amplitude formula for a function with, say, three zeros and five ones out of eight. Say where the number lands relative to the two values the promise guarantees.",
      },
      {
        phrases: ["ambiguous", "inconclusive", "can't distinguish", "cannot distinguish", "can't tell", "cannot tell", "not certain", "uncertain", "no longer certain", "no longer deterministic", "not deterministic", "probabilistic", "unreliable", "wrong answer sometimes"],
        missingFeedback:
          "You have the amplitude's value. Now say what a single measurement tells you when it lands there, and what happens to the algorithm's guarantee.",
      },
    ],
    incorrectFeedback: "Compute what the amplitude sum looks like for an unbalanced-but-not-constant split, like 3 zeros and 5 ones.",
    partialFeedback: "Now say what such a value does to the one-shot conclusion the algorithm normally draws.",
    modelAnswers: [
      "Without the promise the amplitude sum can land anywhere in between the two extremes, say -0.25 for a function with three zeros and five ones, because the cancellation is only partial. Then the single measurement is ambiguous and you cannot tell constant from balanced with certainty.",
      "The promise is what forces the amplitude to one of two extremes. For a function that is neither, the interference is incomplete and the amplitude sits somewhere intermediate, so the result is no longer deterministic and one query is inconclusive.",
    ],
  },
  hints: [
    { text: "Try a function with 3 inputs giving f(x)=0 and 5 giving f(x)=1, out of 8 total." },
    { text: "Work out the amplitude sum for that split. Compare its size with what a constant function and a balanced function each produce." },
    { text: "The number you get is neither of the two signatures the algorithm reads. Say what a single run then licenses you to conclude." },
  ],
  solution: {
    steps: [
      { description: "Without the promise, f could have any split of 0s and 1s, e.g. 3 and 5 out of 8." },
      { description: "The amplitude sum (1/8)(3(+1)+5(−1)) = −2/8 = −0.25, which is neither ±1 (constant) nor exactly 0 (balanced)." },
      { description: "This intermediate value is the signature of neither case, so a single query is inconclusive: it cannot tell you which kind of function you have." },
    ],
    finalAnswer: "Without the promise, the amplitude can land anywhere between −1 and 1, giving no reliable single-query answer.",
  },
  explanation: {
    correctIdea: "The promise is what guarantees the amplitude sum lands at exactly one of two distinguishable extremes.",
    whyCorrect: "This is why the derivation's 'exactly ±1 or exactly 0' conclusion required the promise as an assumption.",
    whyWrong: ["Saying 'the algorithm still runs' is true but misses the actual question. It runs, but its single-query output is no longer a reliable indicator of anything without the promise."],
  },
};
