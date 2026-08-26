import type { NumericProblem } from "@/lib/problems/types";

export const capacityEntanglementBreakingThreshold: NumericProblem = {
  meta: {
    slug: "capacity-entanglement-breaking-threshold",
    title: "Where the Depolarizing Channel's Quantum Capacity Provably Hits Zero",
    course: "quantum-shannon-theory",
    lesson: "quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["quantum-capacity", "entanglement-breaking", "depolarizing-channel"],
    prerequisites: ["quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise"],
  },
  question: {
    type: "numeric",
    prompt:
      "Sending half of a maximally entangled pair through the depolarizing channel N_p(rho) = (1-p)rho + p*I/2 produces the Choi-like state (1-p)|Phi+><Phi+| + p*I_4/4. Its partial transpose (over the channel's output qubit) has eigenvalues 1/2 - p/4 (three-fold, symmetric subspace) and 3p/4 - 1/2 (the antisymmetric singlet direction). The channel becomes entanglement-breaking, hence exactly quantum-capacity zero, exactly when the singlet eigenvalue first reaches 0. Solve 3p/4 - 1/2 = 0 for p.",
    inputHint: "as a decimal, 4 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.6667,
    tolerance: 0.001,
    incorrectFeedback: "Solve 3p/4 = 1/2 for p: p = (1/2)*(4/3) = 2/3.",
  },
  hints: [
    { text: "The Peres-Horodecki criterion says a two-qubit state is entangled exactly when its partial transpose has a negative eigenvalue." },
    { text: "Only the singlet-direction eigenvalue, 3p/4 - 1/2, can go negative for p in [0,1]; the three-fold symmetric eigenvalue 1/2 - p/4 stays non-negative throughout." },
    { text: "Set 3p/4 - 1/2 = 0 and solve for p." },
  ],
  solution: {
    steps: [
      { description: "The Peres-Horodecki criterion (exact for two qubits) says the state is separable exactly when every partial-transpose eigenvalue is non-negative." },
      { description: "The only eigenvalue that can go negative is the singlet one, $\\tfrac{3p}{4}-\\tfrac12$; setting it to $0$: $\\tfrac{3p}{4}=\\tfrac12$." },
      { description: "$p = \\tfrac12\\cdot\\tfrac43 = \\tfrac23 \\approx 0.6667$." },
    ],
    finalAnswer: "p = 2/3 ≈ 0.6667.",
  },
  explanation: {
    correctIdea:
      "The depolarizing channel becomes entanglement-breaking (every state it helps produce via one shared half is separable) exactly at p=2/3, and every entanglement-breaking channel has quantum capacity exactly zero, since no entanglement -- hence no quantum information -- can survive it even in principle.",
    whyCorrect:
      "This matches the capstone's own numerically verified computation: the singlet eigenvalue, computed directly from this platform's real convexCombination and partial-transpose machinery, comes out negative at p=0.5 and lands at exactly 0 (to numerical precision) at p=2/3, exactly where the closed-form solution above says it must.",
    whyWrong: [
      "Solving 1/2 - p/4 = 0 instead gives p=2, outside the physical range [0,1] -- that eigenvalue never causes a problem for any valid depolarizing parameter, only the singlet direction does.",
      "This threshold (p=2/3, exact and rigorous) is a different, larger number than the hashing bound's zero-crossing (p≈0.2524, only a lower-bound certification failing, not a proof the true capacity is already zero there) -- confusing the two conflates a rigorous zero with a merely uncertified region.",
    ],
  },
};
