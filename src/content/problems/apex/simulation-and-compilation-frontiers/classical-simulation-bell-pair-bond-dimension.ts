import type { NumericProblem } from "@/lib/problems/types";

const numberOfPairs = 5;
const bondDimension = 2 ** numberOfPairs;

export const classicalSimulationBellPairBondDimension: NumericProblem = {
  meta: {
    slug: "classical-simulation-bell-pair-bond-dimension",
    title: "Bond Dimension of a Maximally-Entangled Clifford Circuit",
    course: "simulation-and-compilation-frontiers",
    lesson: "apex/simulation-and-compilation-frontiers/when-classical-simulation-works",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["gottesman-knill", "stabilizer-circuits", "bond-dimension", "tensor-networks"],
    prerequisites: ["apex/simulation-and-compilation-frontiers/when-classical-simulation-works"],
  },
  question: {
    type: "numeric",
    prompt:
      "Extend the lesson's Bell-pair-crossing circuit from 6 qubits (3 crossing pairs) to n=10 qubits: apply H to qubits 0-4, then CNOT(i, i+5) for each i=0..4, entangling each of qubits 0-4 with its own independent partner in 5-9. This is Clifford-only, exactly like the lesson's worked example. What is the bond dimension χ needed for an exact matrix-product-state representation across the cut separating {0,...,4} from {5,...,9}?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: bondDimension,
    tolerance: 0.5,
    incorrectFeedback:
      "Each of the 5 independent Bell pairs contributes exactly 1 ebit of entanglement entropy across the cut (the same argument the lesson verified exactly for 3 pairs, reaching 3 ebits). With 5 independent pairs the total entropy is 5 ebits, and bond dimension is χ=2^(entropy in ebits), not the entropy itself and not the qubit count.",
    nearMisses: [
      {
        value: numberOfPairs,
        feedback: "5 is the entropy in ebits. Bond dimension is the Schmidt rank, 2 raised to that entropy, not the entropy itself.",
      },
      {
        value: 10,
        feedback: "10 is the qubit count. Bond dimension is set by the entropy across one cut, which here is 5 ebits.",
      },
      {
        value: 1024,
        feedback: "1024 = 2^10 is the full Hilbert-space dimension of all ten qubits. The bond dimension is capped by one side of the cut, five qubits, so 2^5.",
      },
      {
        value: 8,
        feedback: "8 is the lesson's own 3-pair answer. This circuit has 5 crossing pairs, so the exponent moves from 3 to 5.",
      },
    ],
  },
  hints: [
    { text: "This is the lesson's worked example (3 crossing Bell pairs, entropy reaching the maximum 3 ebits/χ=8 for that 3-vs-3 cut) scaled up from 3 pairs to 5 pairs." },
    { text: "Because the 5 pairs are mutually independent, the reduced state on {0,...,4} is the tensor product of 5 maximally mixed single-qubit states — exactly the I/8 pattern the lesson verified numerically, generalized to I/32." },
    { text: "Entanglement entropy = 5 ebits (one per independent pair). Bond dimension is χ=2^(entropy), not the entropy itself." },
  ],
  solution: {
    steps: [
      { description: "Each CNOT(i, i+5) after H on qubit i creates one Bell pair straddling the {0,...,4}|{5,...,9} cut, exactly as in the lesson's 3-pair worked example." },
      { description: "The 5 pairs are built from 5 disjoint qubit pairs with no gates coupling different pairs, so the reduced state on {0,...,4} factors as a tensor product: ρ_A = (I/2)^⊗5 = I/32 — the maximally mixed state on 5 qubits, by the identical argument the lesson verified numerically for 3 pairs (ρ_A = I/8)." },
      { description: "A maximally mixed state on 2^5=32 levels has entropy log2(32)=5 ebits (flat spectrum, all eigenvalues 1/32), which is also the absolute maximum possible for a 5-vs-5 cut of 10 qubits.", latex: "S = \\log_2(32) = 5 \\text{ ebits}" },
      { description: "Bond dimension for an exact MPS representation equals the Schmidt rank, χ=2^S=2^5=32.", latex: "\\chi = 2^{5} = 32" },
    ],
    finalAnswer: `χ = ${bondDimension}`,
  },
  explanation: {
    correctIdea:
      "A Clifford circuit can push entanglement all the way to the maximum a bipartition allows — Gottesman-Knill doesn't care, since it simulates by tracking the stabilizer group algebraically, never the entanglement structure directly. The same state, viewed through the tensor-network lens, needs the maximum possible bond dimension for that cut.",
    whyCorrect:
      "The 5 independent Bell pairs give a reduced state that is exactly the maximally mixed state on 5 qubits (I/32), whose entropy (5 ebits) is provably the largest any state can have across a 5-vs-5 cut, forcing χ=32.",
    whyWrong: [
      "Answering 5 confuses the entropy (in ebits) with the bond dimension itself — χ is 2 raised to the entropy, not the entropy.",
      "Answering 10 or 1024=2^10 uses the total qubit count or the full Hilbert space dimension rather than the dimension of just one side of the cut.",
    ],
  },
};
