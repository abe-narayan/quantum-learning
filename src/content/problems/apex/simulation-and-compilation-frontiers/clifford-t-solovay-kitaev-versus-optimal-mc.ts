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
      "A colleague says: 'The Solovay-Kitaev theorem already proves that any single-qubit unitary can be synthesized efficiently to precision ε from Clifford+T. So for compiling an Rz(θ) rotation, any correct Solovay-Kitaev-based compiler should already get close to the minimum possible T-count, and there is no real reason to reach for a specialized algorithm like Ross-Selinger instead.' What is wrong with this reasoning?",
    options: [
      {
        id: "a",
        text: "Solovay-Kitaev's polylogarithmic bound is generic and target-agnostic, while for the structured Rz(θ) family a number-theoretic method reaches a near-optimal T-count",
      },
      {
        id: "b",
        text: "Solovay-Kitaev's exponent c is not known in closed form, so its T-count cannot be compared against Ross-Selinger's at any fixed precision without measuring both compilers",
      },
      {
        id: "c",
        text: "Solovay-Kitaev's guarantee holds only in the limit as ε goes to zero, so it says nothing at the precisions a compiler actually targets in practice",
      },
      {
        id: "d",
        text: "Ross-Selinger's advantage lies in classical compile time rather than in T-count, so the two produce circuits that cost the same to run on hardware",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The exponent is not what decides this. Even taking the best known value of c, the generic construction's count grows as a higher power of log(1/ε) than Ross-Selinger's near-linear-in-log(1/ε) count, and the lesson's numbers at ε=10⁻¹⁰ show the resulting gap directly.",
      c: "The bound is asymptotic but it is not vacuous at usable precisions; real compilers do reach polylogarithmic counts. What it does not promise is that the count is anywhere near the minimum for one particular gate family.",
      d: "The advantage shows up in the circuit, not in the compiler. At ε=10⁻¹⁰ the lesson's comparison puts the two methods orders of magnitude apart in T gates for the identical target.",
    },
    defaultIncorrectFeedback:
      "Separate two claims that sound alike: 'an efficient synthesis exists and can be found' and 'the synthesis found is close to the smallest possible'. Solovay-Kitaev delivers the first for every target, and the second for none in particular.",
  },
  hints: [
    { text: "Ask what the O(log^c(1/ε)) bound promises: existence-and-efficiency, or optimality for a specific gate?" },
    { text: "Rz(θ) is a structured gate family, the kind of case a number-theoretic algorithm can specialize for." },
    { text: "The lesson's worked numerical comparison at ε=10⁻¹⁰ is direct evidence for how large the resulting gap can be." },
  ],
  solution: {
    steps: [
      { description: "Solovay-Kitaev's guarantee is that some O(log^c(1/ε))-length sequence exists and can be found efficiently, for any single-qubit target. That is a generic, worst-case-style bound, not a claim about matching the shortest possible sequence for a specific target." },
      { description: "Ross-Selinger instead exploits the specific number-theoretic structure of the ring Z[1/√2, i] that Rz(θ)-compiled Clifford+T circuits live in, to search directly for a near-optimal, Θ(log2(1/ε))-length sequence for that family." },
      { description: "These are different claims (efficiency vs. optimality), and the lesson's comparison at ε=10⁻¹⁰ shows the practical gap between them can span several orders of magnitude in T-count." },
    ],
    finalAnswer: "Solovay-Kitaev gives a generic, target-agnostic efficiency bound, not target-specific T-count optimality; Ross-Selinger specializes for Rz(θ) and gets far closer to optimal.",
  },
  explanation: {
    correctIdea:
      "Efficient synthesis (Solovay-Kitaev) and near-optimal synthesis for a specific structured gate family (Ross-Selinger) are two different real guarantees. The first does not imply the second.",
    whyCorrect:
      "Solovay-Kitaev establishes that an efficient synthesis always exists, with a polylogarithmic gate count. That is an existence result about the problem, not a promise that whatever routine you happen to run reaches near-optimal T-count on the circuits you actually compile.",
    whyWrong: [
      { optionId: "b", text: "Rests on the exponent being unknown, when the comparison does not depend on pinning it down: the two methods differ in the power of log(1/ε) they pay, and the lesson's worked numbers make the gap concrete." },
      { optionId: "c", text: "Dismisses an asymptotic bound as empty. Polylogarithmic synthesis really is achieved at working precisions; the gap is about optimality, not about whether the theorem bites." },
      { optionId: "d", text: "Relocates the difference to compile time. The lesson's comparison is a count of T gates in the output circuit, which is a run-time cost paid on every execution." },
    ],
  },
};
