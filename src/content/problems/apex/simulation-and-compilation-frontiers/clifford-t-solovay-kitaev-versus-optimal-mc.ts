import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const cliffordTSolovayKitaevVersusOptimalMc: MultipleChoiceProblem = {
  meta: {
    slug: "clifford-t-solovay-kitaev-versus-optimal-mc",
    title: "Does Solovay-Kitaev Already Give You the Best T-Count?",
    course: "simulation-and-compilation-frontiers",
    lesson: "apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["clifford-t", "solovay-kitaev", "ross-selinger", "t-count"],
    prerequisites: ["apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "A colleague says: 'The Solovay-Kitaev theorem already proves that any single-qubit unitary can be synthesized efficiently to precision ε from Clifford+T. So for compiling an Rz(θ) rotation, any correct Solovay-Kitaev-based compiler should already get close to the minimum possible T-count — there's no real reason to reach for a specialized algorithm like Ross-Selinger instead.' What is wrong with this reasoning?",
    options: [
      {
        id: "a",
        text: "Solovay-Kitaev's O(log^c(1/ε)) guarantee is a generic, target-agnostic efficiency bound (polylogarithmic scaling with some constant c), not a target-specific optimality guarantee; for the structured Rz(θ) family, a number-theoretic algorithm like Ross-Selinger can achieve a much smaller, near-optimal Θ(log2(1/ε)) T-count that generic Solovay-Kitaev search has no reason to match",
      },
      {
        id: "b",
        text: "Solovay-Kitaev only applies to Clifford gates, not to Rz(θ) rotations, so it cannot be used to compile Rz at all",
      },
      {
        id: "c",
        text: "Ross-Selinger and Solovay-Kitaev always produce exactly the same T-count for any target and precision, so the choice between them is purely a matter of runtime, not circuit cost",
      },
      {
        id: "d",
        text: "Solovay-Kitaev is only a classical existence proof with no efficient constructive algorithm, so it cannot be used to actually compile a circuit at all",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Solovay-Kitaev applies to any single-qubit unitary from a fixed universal gate set, including Rz(θ) rotations; the issue isn't applicability, it's that the guarantee it gives is generic rather than target-optimal.",
      c: "The lesson's own numerical comparison at ε=10⁻¹⁰ shows these are not remotely the same: an illustrative generic Solovay-Kitaev-style estimate needs several orders of magnitude more T gates than Ross-Selinger-style synthesis for the identical target and precision.",
      d: "The theorem's constructive half is exactly what makes it useful: a classical algorithm finds the approximating sequence in time polynomial in log(1/ε). The limitation is about T-count optimality, not about whether an algorithm exists at all.",
    },
    defaultIncorrectFeedback:
      "Recall the lesson's central distinction: Solovay-Kitaev guarantees efficient (polylogarithmic) synthesis exists and can be found, generically, for any target; it does not guarantee that synthesis is near-optimal in T-count for any particular target family.",
  },
  hints: [
    { text: "Ask what exactly the O(log^c(1/ε)) bound promises: is it about existence-and-efficiency, or about optimality for a specific gate?" },
    { text: "Rz(θ) is a specific, structured gate family, exactly the kind of case a number-theoretic algorithm can specialize for." },
    { text: "The lesson's worked numerical comparison at ε=10⁻¹⁰ is direct evidence for how large the resulting gap can be." },
  ],
  solution: {
    steps: [
      { description: "Solovay-Kitaev's guarantee is that some O(log^c(1/ε))-length sequence exists and can be found efficiently, for any single-qubit target — a generic, worst-case-style bound, not a claim about matching the shortest possible sequence for a specific target." },
      { description: "Ross-Selinger instead exploits the specific number-theoretic structure of the ring Z[1/√2, i] that Rz(θ)-compiled Clifford+T circuits live in, to search directly for a near-optimal, Θ(log2(1/ε))-length sequence for that family." },
      { description: "These are different claims (efficiency vs. optimality), and the lesson's comparison at ε=10⁻¹⁰ shows the practical gap between them can span several orders of magnitude in T-count." },
    ],
    finalAnswer: "(a)",
  },
  explanation: {
    correctIdea:
      "Efficient synthesis (Solovay-Kitaev) and near-optimal synthesis for a specific structured gate family (Ross-Selinger) are different, both real, guarantees — the first does not imply the second.",
    whyCorrect:
      "This is precisely the lesson's 'Common Mistake' callout: Solovay-Kitaev proves efficient synthesis is always possible, but that is not the same claim as every synthesis method achieving near-optimal T-count in practice.",
    whyWrong: [
      "Option b incorrectly restricts Solovay-Kitaev's applicability.",
      "Option c contradicts the lesson's own computed numerical comparison.",
      "Option d mischaracterizes Solovay-Kitaev as non-constructive, when its efficient classical search algorithm is one of its two core guarantees.",
    ],
  },
};
