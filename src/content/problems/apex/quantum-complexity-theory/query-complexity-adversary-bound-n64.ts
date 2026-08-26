import type { NumericProblem } from "@/lib/problems/types";

const N = 64;
const gammaNorm = Math.sqrt(N);
const perBitNorm = 1;
const advBound = gammaNorm / perBitNorm;

export const queryComplexityAdversaryBoundN64: NumericProblem = {
  meta: {
    slug: "query-complexity-adversary-bound-n64",
    title: "Computing the Adversary Bound for N=64",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/query-complexity-and-lower-bounds",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["adversary-method", "query-complexity", "ambainis", "grover"],
    prerequisites: ["apex/quantum-complexity-theory/query-complexity-and-lower-bounds"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using the lesson's Gamma/D_i recipe for OR_N (Gamma is the 1xN all-ones matrix relating the single all-zero NO instance to the N single-marked YES instances; D_i is the 0/1 matrix marking the one YES instance that differs from all-zero at position i), compute ADV(OR_N) = ||Gamma|| / max_i ||Gamma ∘ D_i|| for N=64.",
    inputHint: "a positive integer",
  },
  answer: {
    type: "numeric",
    value: advBound,
    tolerance: 0,
    incorrectFeedback:
      "First compute ||Gamma||: Gamma is a 1x64 row vector of all ones, so its spectral (= Euclidean) norm is sqrt(64). Then compute max_i ||Gamma ∘ D_i||: each D_i picks out exactly one entry of Gamma, so Gamma ∘ D_i has a single 1 and spectral norm 1 for every i. Divide the two.",
  },
  hints: [
    { text: "Gamma is a 1x64 all-ones matrix, since the single NO instance (all-zero) is related to every one of the 64 YES instances (each with a different single marked position)." },
    { text: "The spectral norm of a row vector is just its Euclidean (L2) norm: for N ones, that is sqrt(N)." },
    { text: "For each position i, Gamma ∘ D_i keeps only the entry where the YES instance differs from all-zero at bit i -- exactly one entry, equal to 1 -- so its spectral norm is 1 for every i, giving max_i ||Gamma ∘ D_i|| = 1." },
  ],
  solution: {
    steps: [
      { description: "Gamma is the 1x64 all-ones matrix (one NO instance, 64 YES instances, all related since OR differs on every pair)." },
      { description: "||Gamma|| is the spectral norm of a 1x64 all-ones row vector, which equals its Euclidean norm: sqrt(64) = 8.", latex: "\\lVert\\Gamma\\rVert=\\sqrt{64}=8" },
      { description: "For each bit position i, Gamma ∘ D_i has exactly one nonzero entry (equal to 1), since exactly one YES instance (marked at position i) differs from the all-zero NO instance at bit i. A matrix with one entry equal to 1 has spectral norm 1, so max_i ||Gamma ∘ D_i|| = 1." },
      { description: "ADV(OR_64) = ||Gamma|| / max_i ||Gamma ∘ D_i|| = 8 / 1 = 8, matching sqrt(64) exactly, as the general formula ADV(OR_N) = sqrt(N) predicts." },
    ],
    finalAnswer: `ADV(OR_64) = ${advBound}`,
  },
  explanation: {
    correctIdea:
      "ADV(OR_N) = sqrt(N) for every N, computed directly from the spectral-norm ratio of the all-ones relation matrix Gamma and the per-bit difference matrices D_i.",
    whyCorrect:
      "The construction relates the single all-zero NO instance to all N single-marked YES instances with equal weight 1, giving ||Gamma|| = sqrt(N); each input bit's difference matrix D_i isolates exactly one related pair, giving max_i ||Gamma ∘ D_i|| = 1 regardless of N. The ratio is sqrt(N) for every N, including N=64.",
    whyWrong: [
      "Computing ||Gamma|| as N (rather than sqrt(N)) confuses the sum of entries with the spectral norm of a vector -- the spectral norm of a 1xN all-ones row vector is its Euclidean norm, sqrt(N), not N.",
      "Assuming max_i ||Gamma ∘ D_i|| grows with N misses that each D_i isolates exactly one entry no matter how large N is, so that quantity is always 1 for this construction.",
    ],
  },
};
