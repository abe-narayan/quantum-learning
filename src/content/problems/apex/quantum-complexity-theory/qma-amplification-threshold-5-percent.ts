import type { NumericProblem } from "@/lib/problems/types";

function binomialCoefficient(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result *= (n - i) / (i + 1);
  }
  return result;
}

function exactMajorityFailureProbability(k: number, perCopyErrorProb: number): number {
  const threshold = (k + 1) / 2;
  let sum = 0;
  for (let i = threshold; i <= k; i++) {
    sum += binomialCoefficient(k, i) * perCopyErrorProb ** i * (1 - perCopyErrorProb) ** (k - i);
  }
  return sum;
}

function smallestKBelowThreshold(target: number): number {
  for (let k = 1; k < 200; k += 2) {
    if (exactMajorityFailureProbability(k, 1 / 3) <= target) return k;
  }
  throw new Error("no k found within search range");
}

const answerK = smallestKBelowThreshold(0.05);

export const qmaAmplificationThreshold5Percent: NumericProblem = {
  meta: {
    slug: "qma-amplification-threshold-5-percent",
    title: "Witness Copies Needed for a 5% Failure Bound",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/qma-and-quantum-verification",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["qma", "amplification", "chernoff-bound", "no-cloning"],
    prerequisites: ["apex/quantum-complexity-theory/qma-and-quantum-verification"],
  },
  question: {
    type: "numeric",
    prompt:
      "Merlin sends k independent copies of a witness for a NO instance, each individually accepted with probability 1/3 in the worst case. Arthur runs one verifier per copy and takes a majority vote. What is the smallest odd k for which the exact majority-vote failure probability (the binomial tail itself, not the Hoeffding bound) first drops to 5% or below?",
    inputHint: "an odd positive integer",
  },
  answer: {
    type: "numeric",
    value: answerK,
    tolerance: 0,
    incorrectFeedback:
      "Compute the exact binomial tail probability P(at least (k+1)/2 of k independent trials, each wrong with probability 1/3, are wrong) for increasing odd k, and find the smallest k where it is <= 0.05.",
    nearMisses: [
      {
        value: 21,
        feedback:
          "k=21 is the last odd value still above the bar: its exact tail is about 5.57%, not yet at or below 5%. Step up one more odd value and recompute.",
      },
      {
        value: 55,
        feedback:
          "55 is what the Hoeffding bound exp(-k/18) <= 0.05 demands (k >= 18·ln20 ≈ 53.9). Hoeffding is an upper bound on the failure probability, so it asks for far more copies than the exact binomial tail needs.",
      },
      {
        value: 22,
        feedback:
          "A majority vote needs an odd k, otherwise a tie is possible and there is no majority to read. Take the next odd value.",
      },
    ],
  },
  hints: [
    { text: "The majority vote fails exactly when at least (k+1)/2 of the k copies give the wrong readout." },
    { text: "Each copy is wrong independently with probability 1/3 in the worst case the completeness-side theorem needs to cover, so the count of wrong copies is Binomial(k, 1/3)." },
    { text: "Try increasing odd values of k and compute the exact binomial upper tail P(X >= (k+1)/2) directly, rather than using the looser Hoeffding bound exp(-k/18)." },
  ],
  solution: {
    steps: [
      { description: "The number of wrong copies among k independent trials, each wrong with probability 1/3, is a Binomial(k, 1/3) random variable." },
      { description: "Majority vote fails exactly when this count is at least (k+1)/2, so the exact failure probability is the binomial upper tail sum from i=(k+1)/2 to k of C(k,i) (1/3)^i (2/3)^(k-i)." },
      { description: "Evaluating this tail for increasing odd k, the value drops through 5% between k=21 (about 5.57%) and k=23 (about 4.80%), so k=23 is the first odd value that clears the bar." },
    ],
    finalAnswer: `k = ${answerK}`,
  },
  explanation: {
    correctIdea:
      "The exact binomial tail, not the loose Hoeffding bound, gives the true smallest number of independent witness copies needed.",
    whyCorrect:
      "Because the amplification argument reduces to k independent Bernoulli trials (an honest Merlin sends k literal copies of one fixed witness), the binomial tail formula applies directly and can be evaluated in closed form rather than merely bounded.",
    whyWrong: [
      "Using the Hoeffding bound exp(-k/18) instead of the exact tail overstates how many copies are needed, since that bound is an illustrative upper bound, not a tight calculation.",
    ],
  },
};
