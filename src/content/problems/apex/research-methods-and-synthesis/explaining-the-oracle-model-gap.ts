import type { ConceptualProblem } from "@/lib/problems/types";

export const explainingTheOracleModelGap: ConceptualProblem = {
  meta: {
    slug: "explaining-the-oracle-model-gap",
    title: "Explaining Why the Speedup Claim Needs Two Caveats",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper",
    difficulty: "master",
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
      {
        phrases: ["oracle", "black box", "black-box", "query access", "query model"],
        missingFeedback:
          "Name the access model Theorem 4.2 assumes. Everything narrow about its scope follows from that one word.",
      },
      {
        phrases: ["explicit", "unconditional", "not proven", "does not extend", "doesn't extend", "different setting"],
        missingFeedback:
          "You have named the model. Now say what the abstract's unqualified phrase would have to cover instead, and whether the theorem reaches that far.",
      },
      {
        phrases: [
          "20 qubit",
          "small scale",
          "small-scale",
          "fixed size",
          "asymptotic",
          "doesn't prove",
          "does not prove",
          "not proof",
          "corroborat",
          "consistent with",
          "only tests",
          "cannot establish",
        ],
        missingFeedback:
          "The restriction on the theorem is covered. The numerics are a separate problem. Runs at n ≤ 20 sit inside the very construction the theorem already covers, and they sample one narrow band of sizes. Say what that means about what they can and cannot carry.",
      },
    ],
    incorrectFeedback:
      "Both halves of the gap have to be named, and each is a different kind of overreach. The theorem is proved under a restriction on how an algorithm is allowed to reach the Hamiltonian; the abstract quietly drops that restriction. The numerics are a second, independent overreach: results gathered at one small range of sizes are being offered as evidence for a claim about every size. Say what the restriction is, and why running the same construction at n ≤ 20 does nothing to lift it.",
    partialFeedback:
      "Part of the gap is named. Both halves are needed: the restriction the theorem carries and the abstract drops, and the separate reason that a run at one small range of sizes cannot carry a claim about every size.",
    modelAnswers: [
      "Theorem 4.2 is an oracle-model separation: it only covers algorithms with black-box sparse access. That is much narrower than the abstract's bare 'exponential speedup', which reads as a claim about the explicit setting, and it does not extend there. The 20-qubit numerics are small-scale corroborating evidence for the same oracle claim, and cannot establish anything asymptotic.",
      "The separation is proven in the query model only. Nothing about the explicit-Hamiltonian case is proven, so the abstract is wider than the theorem. Running instances up to 20 qubits is a fixed size; it is consistent with the claim but it does not prove asymptotic behaviour.",
    ],
  },
  hints: [
    { text: "What does Theorem 4.2 assume about the way an algorithm is permitted to reach H?" },
    { text: "Is 'H handed to you as a written-down operator' the same situation as 'H reachable only by asking a box for values'?" },
    { text: "A run at one size tells you about that size. What would it have to show to be evidence about every size?" },
  ],
  solution: {
    steps: [
      { description: "Theorem 4.2's classical lower bound (Omega(2^n) queries) holds only for classical algorithms restricted to black-box query access to an oracle O_H. It says nothing about classical algorithms that are given H's local terms explicitly." },
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
