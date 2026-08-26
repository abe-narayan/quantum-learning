import type { NumericProblem } from "@/lib/problems/types";

export const wStateEntropyAndBondDimension: NumericProblem = {
  meta: {
    slug: "w-state-entropy-and-bond-dimension",
    title: "Entanglement Entropy and Bond Dimension for the W State",
    course: "simulation-and-compilation-frontiers",
    lesson: "apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "numeric",
    tags: ["matrix-product-states", "bond-dimension", "schmidt-rank", "entanglement-entropy"],
    prerequisites: ["apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states"],
  },
  question: {
    type: "numeric",
    prompt:
      "The 3-qubit W state |W> = (|100> + |010> + |001>)/sqrt(3) is reshaped into a matrix across the cut between qubit 1 and qubits {2,3}, exactly as this lesson's GHZ example was. Its reduced density matrix on qubit 1 works out to rho_1 = diag(2/3, 1/3). Compute the entanglement entropy S(rho_1) across this cut, in bits. (Bond dimension here is also exactly 2, same as GHZ at this cut -- the point of this problem is that entropy is not the same number just because the rank is.)",
    inputHint: "bits, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.918296,
    tolerance: 0.001,
    incorrectFeedback:
      "rho_1 is already diagonal with eigenvalues 2/3 and 1/3, so its von Neumann entropy is just the Shannon entropy of those two numbers: S = -(2/3)log2(2/3) - (1/3)log2(1/3), the same formula this lesson applied to GHZ's own (1/2, 1/2) eigenvalues.",
  },
  hints: [
    { text: "rho_1 is already diagonal -- its eigenvalues are just its diagonal entries, 2/3 and 1/3, no further diagonalization needed." },
    { text: "Von Neumann entropy of a diagonal density matrix is the Shannon entropy of its diagonal entries (used throughout this lesson and Entanglement Entropy for Pure Bipartite States)." },
    { text: "S = -(2/3) log2(2/3) - (1/3) log2(1/3) ≈ 0.918296 bits." },
  ],
  solution: {
    steps: [
      { description: "rho_1 = diag(2/3, 1/3), read directly from the reshaped W-state amplitude matrix via rho = M M-dagger, exactly this lesson's own construction applied to a different state." },
      { description: "$S(\\rho_1) = -\\tfrac{2}{3}\\log_2\\tfrac{2}{3} - \\tfrac{1}{3}\\log_2\\tfrac{1}{3}$" },
      { description: "$= \\tfrac{2}{3}(0.584963) + \\tfrac{1}{3}(1.584963) \\approx 0.389975 + 0.528321$" },
    ],
    finalAnswer: "S(rho_1) ≈ 0.918296 bits.",
  },
  explanation: {
    correctIdea: "Bond dimension (Schmidt rank, 2 here, identical to GHZ) counts how many Schmidt terms survive; entanglement entropy weighs how evenly they're weighted. The W state's uneven (2/3, 1/3) split carries less entropy than GHZ's even (1/2, 1/2) split despite the identical rank.",
    whyCorrect: "This is exactly the bond-dimension-versus-entropy distinction this lesson's second Common Mistake callout makes, worked out here for a genuinely different state instead of just asserted.",
    whyWrong: ["Assuming bond dimension 2 automatically means 'the same entanglement as GHZ' ignores that entropy depends on the actual eigenvalue values, not merely how many of them are nonzero."],
  },
};
