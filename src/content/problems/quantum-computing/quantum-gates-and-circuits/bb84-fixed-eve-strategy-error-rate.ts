import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const bb84FixedEveStrategyErrorRate: MultipleChoiceProblem = {
  meta: {
    slug: "bb84-fixed-eve-strategy-error-rate",
    title: "Eve Always Guessing the Z Basis",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["bb84", "quantum-key-distribution", "eavesdropping"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "Suppose Eve always guesses the Z basis (never randomizes), while Alice still picks her own basis uniformly at random for every qubit. Compared to Eve guessing randomly, what happens to the average error rate on the sifted key?",
    options: [
      { id: "a", text: "It drops to $0\\%$, since Eve now measures correctly whenever Alice happens to use Z." },
      { id: "b", text: "It rises above $25\\%$, since a fixed strategy is more disruptive than a random one." },
      { id: "c", text: "It stays at $25\\%$, since Alice picks her basis independently of Eve's fixed guess." },
      { id: "d", text: "It stops being a single percentage, since Eve's strategy is now deterministic." },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "c",
    optionFeedback: {
      a: "Eve does guess correctly whenever Alice uses Z, which is half the time. On the other half, when Alice uses X, Eve is certain to be wrong. Averaged over both, the error rate is not 0.",
      b: "Eve's strategy being fixed rather than random doesn't matter to Alice, who does not know Eve's strategy and picks her own basis independently of it. The disturbance mechanism is unaffected.",
      d: "The error rate is still a well-defined average over the two cases (Alice picks Z, or Alice picks X), each with fixed probability 1/2.",
    },
    defaultIncorrectFeedback:
      "Compute Eve's probability of guessing correctly (matching Alice's actual basis) under this fixed strategy, and compare it to the random-guessing case.",
  },
  hints: [
    { text: "Eve's basis guess is correct exactly when Alice picks Z, which has probability $1/2$ because Alice chooses independently of Eve's fixed strategy." },
    { text: "That's the exact same $1/2$ probability of a correct guess a uniformly random strategy would give." },
    { text: "The $25\\%$ derivation used only $P(\\text{Eve guesses wrong})=1/2$. It never assumed Eve's guesses were themselves random, only that they are uncorrelated with Alice's basis." },
  ],
  solution: {
    steps: [
      { description: "Eve's guess (always Z) matches Alice's actual basis exactly when Alice happens to choose Z, which happens with probability $1/2$, independent of Eve's strategy." },
      { description: "This is identical to the probability a uniformly random guess would match: $1/2$." },
      { description: "The $25\\%$ sifted-key error rate derivation depends only on $P(\\text{Eve's basis is wrong}) = 1/2$, not on how Eve chose her wrong guesses, so it is unchanged." },
    ],
    finalAnswer: "The sifted-key error rate stays exactly $25\\%$.",
  },
  explanation: {
    correctIdea: "A fixed eavesdropping strategy is exactly as detectable as a random one, as long as it is uncorrelated with Alice's basis choice, and it is, since Eve cannot know Alice's random pick in advance.",
    whyCorrect: "The error-rate derivation only ever used the marginal probability that Eve's basis disagrees with Alice's, and that marginal probability is $1/2$ regardless of whether Eve's guesses are fixed or randomized.",
    whyWrong: [
      { optionId: "a", text: "Counts only the half of the qubits where Eve happens to be right. On the other half she is guaranteed wrong, and the average is what the sifted-key error rate reports." },
      { optionId: "b", text: "Treats determinism as extra disturbance. Alice does not know Eve's strategy and picks independently of it, so the mismatch probability is unmoved." },
      { optionId: "d", text: "Reads Eve's determinism as removing the randomness. Alice's basis choice supplies all the randomness the average needs." },
    ],
  },
};
