import type { NumericProblem } from "@/lib/problems/types";

export const surfaceCodeGeneratorCountAtDistance5: NumericProblem = {
  meta: {
    slug: "surface-code-generator-count-at-distance-5",
    title: "Independent Stabilizer Generators at Distance 5",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/surface-codes-in-depth",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["surface-codes", "css-codes", "stabilizer-formalism"],
    prerequisites: ["apex/fault-tolerance-frontiers/surface-codes-in-depth"],
  },
  question: {
    type: "numeric",
    prompt:
      "This lesson's distance-3 unrotated surface code patch has n=13 data qubits and 12 independent stabilizer generators (6 X-type, 6 Z-type), one less than n since it encodes exactly 1 logical qubit. Using the same convention (n = 2d^2 - 2d + 1 data qubits, d(d-1) X-stabilizers, d(d-1) Z-stabilizers), compute the total number of independent stabilizer generators for a distance-5 patch.",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: 40,
    tolerance: 0,
    incorrectFeedback:
      "Total stabilizers = X-type plus Z-type, each d(d-1), so 2d(d-1) at d=5. Cross-check against n-1 with n = 2d^2-2d+1: the two routes must agree, since exactly 1 logical qubit is encoded at every distance.",
    nearMisses: [
      {
        value: 41,
        feedback:
          "41 is n, the data-qubit count at d=5. One qubit's worth of freedom is left unconstrained to hold the logical qubit, so the independent generator count is n-1.",
      },
      {
        value: 20,
        feedback: "20 is d(d-1), the count of one stabilizer type. The question asks for X-type and Z-type together.",
      },
      {
        value: 24,
        feedback:
          "24 = d^2 - 1 uses the rotated code's n = d^2. This problem fixes the unrotated convention, n = 2d^2 - 2d + 1; the two are not interchangeable.",
      },
    ],
  },
  hints: [
    { text: "The lesson showed the general d-dependence: n = 2d^2-2d+1 data qubits, and X-stabilizers and Z-stabilizers each number d(d-1)." },
    { text: "Since exactly 1 logical qubit is encoded for any d, independent generators must equal n-1." },
    { text: "Compute either n-1 directly, or 2*d*(d-1) directly -- both routes must agree." },
  ],
  solution: {
    steps: [
      { description: "$n = 2d^2-2d+1$ at $d=5$: $n = 2(25)-10+1 = 50-10+1 = 41$." },
      { description: "Independent generators $= n-1 = 40$ (1 logical qubit encoded, same arithmetic pattern verified explicitly at $d=3$: $13-1=12$)." },
      { description: "Cross-check via the other formula: X-stabilizers $=$ Z-stabilizers $= d(d-1) = 5\\cdot4=20$ each, total $=2\\cdot20=40$. Matches." },
    ],
    finalAnswer: "40 independent stabilizer generators (20 X-type + 20 Z-type) at distance 5.",
  },
  explanation: {
    correctIdea: "Both counting routes -- (data qubits minus 1) and (2 times the per-type stabilizer count) -- must agree for any d, because the surface code always encodes exactly 1 logical qubit regardless of its distance.",
    whyCorrect: "This is the same n-1 arithmetic the lesson verified explicitly at d=3 (13 qubits, 12 generators), just carried to a larger, still fully computable, patch size.",
    whyWrong: ["Using n = d^2 (the rotated-code qubit count) instead of n = 2d^2-2d+1 (this lesson's chosen unrotated convention) gives a different, inconsistent answer -- the two conventions are not interchangeable."],
  },
};
