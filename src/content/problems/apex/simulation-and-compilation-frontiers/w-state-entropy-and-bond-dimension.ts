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
      "The 3-qubit W state |W> = (|100> + |010> + |001>)/sqrt(3) is reshaped into a matrix across the cut between qubit 1 and qubits {2,3}, as this lesson's GHZ example was. Its reduced density matrix on qubit 1 works out to rho_1 = diag(2/3, 1/3). Compute the entanglement entropy S(rho_1) across this cut, in bits. (Bond dimension here is also 2, the same as GHZ at this cut. The point of the problem is that entropy is not the same number just because the rank is.)",
    inputHint: "bits, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.918296,
    tolerance: 0.001,
    incorrectFeedback:
      "Three checks. The entropy must use log base 2 to come out in bits. Both eigenvalues contribute a term, each with a minus sign in front. And if you got exactly 1 bit, you used GHZ's even eigenvalues instead of the W state's uneven pair; the uneven split is the whole point of the comparison.",
    nearMisses: [
      {
        value: 0.636514,
        feedback: "That is the same entropy in nats. Bits require log base 2; dividing by ln 2 converts your answer.",
      },
      {
        value: 1,
        feedback:
          "1 bit is GHZ's answer, from an even (1/2, 1/2) split. The W state's split is (2/3, 1/3), and an uneven spectrum always carries strictly less entropy at the same rank.",
      },
      {
        value: 2,
        feedback: "2 is the Schmidt rank (the bond dimension), not the entropy. Rank counts the surviving terms; entropy weighs how evenly they are weighted.",
      },
    ],
  },
  hints: [
    { text: "The prompt already hands you rho_1 in diagonal form, so no diagonalization is needed. The remaining question is which formula turns a density matrix's eigenvalues into an entanglement entropy measured in bits." },
    { text: "For a diagonal density matrix, the von Neumann entropy is the Shannon entropy of the diagonal entries: S = -Σ λ log2(λ), the same formula this lesson applied to GHZ's (1/2, 1/2) eigenvalues." },
    { text: "Evaluate S = -(2/3) log2(2/3) - (1/3) log2(1/3). Because the split is uneven, expect strictly less than the 1 bit that GHZ's even split gives." },
  ],
  solution: {
    steps: [
      { description: "rho_1 = diag(2/3, 1/3), read directly from the reshaped W-state amplitude matrix via rho = M M-dagger, this lesson's own construction applied to a different state." },
      { description: "$S(\\rho_1) = -\\tfrac{2}{3}\\log_2\\tfrac{2}{3} - \\tfrac{1}{3}\\log_2\\tfrac{1}{3}$" },
      { description: "$= \\tfrac{2}{3}(0.584963) + \\tfrac{1}{3}(1.584963) \\approx 0.389975 + 0.528321 = 0.918296$" },
    ],
    finalAnswer: "S(rho_1) ≈ 0.918296 bits.",
  },
  explanation: {
    correctIdea: "Bond dimension (Schmidt rank, 2 here, identical to GHZ) counts how many Schmidt terms survive; entanglement entropy weighs how evenly they're weighted. The W state's uneven (2/3, 1/3) split carries less entropy than GHZ's even (1/2, 1/2) split despite the identical rank.",
    whyCorrect: "Bond dimension counts the nonzero Schmidt coefficients; entropy weighs them. The W state and the GHZ state have the same rank at this cut and different entropies, which is why neither number can be read off the other.",
    whyWrong: ["Assuming bond dimension 2 automatically means 'the same entanglement as GHZ' ignores that entropy depends on the actual eigenvalue values, not merely how many of them are nonzero."],
  },
};
