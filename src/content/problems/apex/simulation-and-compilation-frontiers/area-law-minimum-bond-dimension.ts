import type { NumericProblem } from "@/lib/problems/types";

export const areaLawMinimumBondDimension: NumericProblem = {
  meta: {
    slug: "area-law-minimum-bond-dimension",
    title: "Minimum Bond Dimension From an Area-Law Entropy Bound",
    course: "simulation-and-compilation-frontiers",
    lesson: "apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["area-law", "bond-dimension", "matrix-product-states", "gapped-hamiltonians"],
    prerequisites: ["apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states"],
  },
  question: {
    type: "numeric",
    prompt:
      "A family of gapped, local 1D Hamiltonians has ground states whose entanglement entropy across every spatial cut is bounded by exactly 2 bits, independent of system size n (an area law). An exact MPS representation needs, at each cut, a bond dimension chi large enough that log2(chi) is at least that entropy bound. What is the minimum integer bond dimension chi consistent with a 2-bit bound?",
    inputHint: "a single integer",
  },
  answer: {
    type: "numeric",
    value: 4,
    tolerance: 0.01,
    incorrectFeedback:
      "chi Schmidt coefficients of equal size 1/chi give entropy exactly log2(chi) (this lesson's GHZ example: chi=2 gives exactly log2(2)=1 bit). Requiring log2(chi) >= 2 gives chi >= 2^2 = 4.",
  },
  hints: [
    { text: "A cut with bond dimension chi can carry at most log2(chi) bits of entropy (chi equal Schmidt coefficients of size 1/chi saturate this, exactly like GHZ's chi=2 giving exactly 1 bit in this lesson's worked example)." },
    { text: "2 bits of entropy needs log2(chi) >= 2, i.e. chi >= 2^2." },
    { text: "chi_min = 2^2 = 4, and this bound is n-independent -- it is the same for n=10 and n=10,000, by the area law's own defining property." },
  ],
  solution: {
    steps: [
      { description: "An exact bond dimension chi lets a cut carry at most log2(chi) bits of entropy, saturated when the chi Schmidt coefficients are all equal to 1/chi (the same logic as GHZ's chi=2 giving exactly 1 bit in this lesson's worked example)." },
      { description: "Requiring $\\log_2(\\chi) \\geq 2$ gives $\\chi \\geq 2^2 = 4$, so the minimum integer bond dimension is $\\chi_{\\min}=4$." },
      { description: "This bound is n-independent by construction (the area law's defining property, not an extra assumption), so chi_min = 4 for n=10 and for n=10,000 alike -- exactly why an MPS with bounded bond dimension stays efficient as the system grows." },
    ],
    finalAnswer: "chi_min = 4, unchanged as n grows from 10 to 10,000.",
  },
  explanation: {
    correctIdea: "An area law bounds entanglement entropy by a size-independent constant, and since bond dimension only needs to satisfy chi >= 2^S, a constant entropy bound gives a constant, n-independent minimum bond dimension.",
    whyCorrect: "This is exactly the mechanism this lesson's Physical Interpretation section describes: bounded entropy implies bounded chi implies linear-in-n (not exponential) MPS memory cost, for any n.",
    whyWrong: ["Assuming chi must grow with n by analogy to a generic volume-law state, whose entropy (and hence required chi) does grow with the smaller subsystem's size -- that growth is exactly what an area law rules out."],
  },
};
