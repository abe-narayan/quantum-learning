import type { NumericProblem } from "@/lib/problems/types";

export const j1j1TopMultipletSize: NumericProblem = {
  meta: {
    slug: "j1-j1-top-multiplet-size",
    title: "Selection Rules Inside the Top Multiplet of j=1 ⊗ j=1",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/clebsch-gordan-coefficients-and-the-wigner-eckart-theorem",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["clebsch-gordan", "wigner-eckart", "selection-rules", "angular-momentum"],
    prerequisites: [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/clebsch-gordan-coefficients-and-the-wigner-eckart-theorem",
    ],
  },
  question: {
    type: "numeric",
    prompt:
      "Two j=1 systems are coupled, and attention is restricted to the top multiplet, j = j₁+j₂ = 2. A rank-1 spherical tensor operator T⁽¹⁾_q acts within it. Consider the 15 combinations of an initial m ∈ {2,1,0,−1,−2} with a component q ∈ {1,0,−1}. For how many of those 15 does the Wigner-Eckart Δm = q rule leave a possibly non-zero matrix element ⟨2 m′|T⁽¹⁾_q|2 m⟩, that is, for how many does the required final state m′ exist inside the multiplet?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: 13,
    tolerance: 0,
    incorrectFeedback:
      "The rule fixes m′ = m + q, so each of the 15 combinations determines exactly one final state. The only question is whether that state is in the multiplet. Work out the multiplet's range of m′ first, then count how many of the 15 land outside it.",
    nearMisses: [
      {
        value: 15,
        feedback:
          "That counts every combination, which is what the answer would be if the multiplet ran over all integers. It does not: raising the top rung or lowering the bottom one leaves the multiplet, and those combinations are exactly the ones that vanish.",
      },
      {
        value: 5,
        feedback:
          "That is the q = 0 column on its own. Δm = q also permits q = ±1, which shifts m by one rung and is perfectly allowed away from the two ends.",
      },
      {
        value: 9,
        feedback:
          "That is the count of (m, q) pairs whose m′ is strictly inside the multiplet, with the two edge rungs m′ = ±2 excluded. Those edge states are ordinary members of the multiplet and the transitions reaching them count.",
      },
      {
        value: 25,
        feedback:
          "That counts (m, m′) pairs, all 5×5 of them. Wigner-Eckart is indexed by q rather than by m′, and once m and q are fixed, m′ is not free.",
      },
    ],
  },
  hints: [
    {
      text: "Wigner-Eckart makes ⟨2 m′|T⁽¹⁾_q|2 m⟩ proportional to a Clebsch-Gordan coefficient ⟨2 m; 1 q | 2 m′⟩, and such a coefficient vanishes identically unless the two m labels on the left add to the one on the right.",
    },
    {
      text: "So m′ is determined, not chosen. Tabulate m down the side and q across the top, fill in m + q, and mark which entries you are allowed to keep.",
    },
    {
      text: "A multiplet of total angular momentum j carries a fixed, finite ladder of m values. Write that ladder's endpoints down and strike out every table entry that falls off either end.",
    },
  ],
  solution: {
    steps: [
      {
        description:
          "Wigner-Eckart sends the whole matrix element into one Clebsch-Gordan coefficient times a reduced element that carries no m dependence, and the coefficient vanishes unless the magnetic quantum numbers balance.",
        latex: "\\langle 2\\,m'|T^{(1)}_q|2\\,m\\rangle \\propto \\langle 2\\,m;\\,1\\,q\\,|\\,2\\,m'\\rangle,\\qquad m' = m+q",
      },
      {
        description:
          "The j=2 multiplet has 2j+1 = 5 rungs, m′ ∈ {2,1,0,−1,−2}. Of the 15 (m,q) combinations, m+q escapes that range only twice: (m=2, q=1) needs m′=3, and (m=−2, q=−1) needs m′=−3. Neither exists.",
      },
      {
        description:
          "That leaves 15 − 2 = 13. The triangle rule is satisfied separately, since |2−2| ≤ 1 ≤ 2+2, so the reduced element itself is not forced to zero and the surviving 13 are genuinely permitted.",
      },
    ],
    finalAnswer: "13",
  },
  explanation: {
    correctIdea:
      "Both of Wigner-Eckart's selection rules are visible in one count. Δm = q removes nothing on its own, since it only fixes m′; what removes anything is the multiplet being finite, so the two combinations that would climb off its ends have nowhere to land.",
    whyCorrect:
      "Fixing m and q fixes m′ = m+q, so the 15 combinations map onto 15 requested final states. Thirteen of those lie inside the five-rung ladder and two do not, and the triangle rule |j−j| ≤ 1 ≤ j+j holds, so the reduced element is free to be non-zero. Thirteen survive.",
    whyWrong: [
      "Answering 15 treats m′ as unconstrained by the multiplet, which is the same error as expecting a raising operator to act on the top state and return something.",
      "Answering 5 keeps only q=0, confusing the rule Δm = q with the much stronger Δm = 0 that a scalar operator would obey.",
    ],
  },
};
