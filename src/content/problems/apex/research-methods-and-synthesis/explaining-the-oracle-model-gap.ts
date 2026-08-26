import type { ConceptualProblem } from "@/lib/problems/types";

export const explainingTheOracleModelGap: ConceptualProblem = {
  meta: {
    slug: "explaining-the-oracle-model-gap",
    title: "Explaining Why the Speedup Claim Needs Two Caveats",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper",
    difficulty: "advanced",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["paper-reading", "oracle-separation", "numerical-vs-proven", "claim-evaluation"],
    prerequisites: ["apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper"],
  },
  question: {
    type: "conceptual",
    prompt:
      "This lesson's worked example paper claims an 'exponential speedup' in its abstract, backed by Theorem 4.2 (an exponential separation for algorithms with only black-box sparse-access to the Hamiltonian) and numerical experiments on instances up to 20 qubits. In your own words, explain (a) what kind of separation Theorem 4.2 actually establishes and why that is narrower than the abstract's unqualified phrase suggests, and (b) why the 20-qubit numerical experiments do not, by themselves, provide evidence that the speedup extends beyond the oracle-model setting the theorem covers.",
    placeholder:
      "Explain what 'black-box' or 'oracle' access means for Theorem 4.2's scope, and separately explain why small-scale numerics are a different, weaker kind of evidence than the theorem itself.",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["oracle", "black box", "black-box", "query access", "query model"],
      ["explicit", "unconditional", "not proven", "does not extend", "doesn't extend", "narrower", "different setting"],
      ["20 qubit", "small scale", "small-scale", "asymptotic", "doesn't prove", "does not prove", "not proof", "corroborat", "consistent with"],
    ],
    incorrectFeedback:
      "Address both halves explicitly: name the specific restriction (black-box/oracle query access) that Theorem 4.2's classical lower bound depends on, and separately explain why numerics at a fixed small size (n<=20) can't by themselves establish an asymptotic or broader-setting claim.",
    partialFeedback:
      "You've captured part of the gap. Make sure you explicitly connect the oracle-model restriction to why it's narrower than an unqualified 'exponential speedup,' and separately explain why the small-scale numerical experiments don't extend the theorem's proven scope.",
  },
  hints: [
    { text: "What does Theorem 4.2 assume about how algorithms are allowed to access the Hamiltonian H?" },
    { text: "Is 'explicitly-given Hamiltonian' the same setting as 'black-box oracle access to H'?" },
    { text: "A numerical experiment at one fixed size tells you about that size -- what would it need to show to be evidence about all n?" },
  ],
  solution: {
    steps: [
      { description: "Theorem 4.2's classical lower bound (Omega(2^n) queries) holds only for classical algorithms restricted to black-box query access to an oracle O_H -- it says nothing about classical algorithms that are given H's local terms explicitly." },
      { description: "The abstract's unqualified 'exponential speedup' does not mention this restriction, so a reader who stops at the abstract could easily (and incorrectly) read the claim as applying to the explicitly-given-Hamiltonian setting, where the problem is QMA-complete and no such unconditional statement is proven." },
      { description: "The numerical experiments at n<=20 test the same oracle-access construction the theorem already covers, at one specific, small range of sizes; they corroborate the proven theorem there but cannot, by themselves, establish anything about scaling to large n or about the different (explicit) setting the theorem never addresses." },
    ],
    finalAnswer:
      "Theorem 4.2 is a black-box/oracle-model separation, narrower than the abstract's unqualified 'exponential speedup' since it says nothing about the explicit-Hamiltonian (QMA-complete) setting; the n<=20 numerics are small-scale corroborating evidence for that same oracle-model claim, not independent proof that the speedup holds asymptotically or in the explicit setting.",
  },
  explanation: {
    correctIdea:
      "Two separate gaps stack in this example: an abstract's phrasing wider than its theorem's proven scope, and small-scale numerics standing in for (rather than merely supporting) a proven asymptotic claim.",
    whyCorrect:
      "Naming the oracle-model restriction explicitly, and separately naming why n<=20 numerics don't establish a broader or asymptotic claim, matches the two distinct anatomy lessons this worked example is built to teach: abstract-vs-theorem, and numerical-vs-proven.",
    whyWrong: [
      "Treating the abstract's wording as simply correct ignores that it omits the oracle-model restriction entirely.",
      "Treating the numerics as proof the speedup is unconditional ignores that they were run inside the same oracle-access construction the theorem already covers, at a fixed small size.",
    ],
  },
};
