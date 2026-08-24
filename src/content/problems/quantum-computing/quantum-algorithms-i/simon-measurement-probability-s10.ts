import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, HADAMARD } from "@/lib/quantum/gates";
import { applySimonOracle } from "@/lib/quantum/oracles";
import type { NumericProblem } from "@/lib/problems/types";

// Reruns the lesson's own circuit (H^n, oracle, H^n, marginalize over the
// input register) independently for s=10, rather than reusing displayed
// numbers from the s=01 worked example or the n=3 sweep.
function simonInputDistribution(n: number, s: number): number[] {
  let state = StateVector.zero(2 * n);
  for (let q = 0; q < n; q++) state = applySingleQubitGate(state, HADAMARD, q);
  state = applySimonOracle(state, n, s);
  for (let q = 0; q < n; q++) state = applySingleQubitGate(state, HADAMARD, q);
  const probs = state.probabilities();
  const dim = 2 ** n;
  return Array.from({ length: dim }, (_, z) => probs.slice(z * dim, z * dim + dim).reduce((a, b) => a + b, 0));
}

const distribution = simonInputDistribution(2, 0b10);
const probabilityOfZ01 = distribution[0b01];

export const simonMeasurementProbabilityS10: NumericProblem = {
  meta: {
    slug: "simon-measurement-probability-s10",
    title: "Measurement Probability of z=01 for Hidden String s=10",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/simons-algorithm",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["simons-algorithm", "interference"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/simons-algorithm"],
  },
  question: {
    type: "numeric",
    prompt:
      "For $n=2$, hidden string $s=10$ (binary): using $z\\cdot s\\equiv0\\pmod2$, determine which of $z\\in\\{00,01,10,11\\}$ should have nonzero measurement probability after running $H^{\\otimes n}$, the oracle, $H^{\\otimes n}$ again. Then give the actual measurement probability of $z=01$.",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: probabilityOfZ01,
    tolerance: 0.01,
    incorrectFeedback:
      "First check whether $z=01$ satisfies $z\\cdot s\\equiv0\\pmod2$ for $s=10$ — if it's orthogonal to $s$, the nonzero probability is spread uniformly over the $2^{n-1}$ orthogonal strings.",
  },
  hints: [
    { text: "$z\\cdot s \\bmod 2$ for $z=01$, $s=10$: the bitwise AND is $00$, so the dot product is $0$ — $z=01$ is orthogonal to $s$." },
    { text: "The orthogonal strings for $s=10$ are exactly $\\{00, 01\\}$ — two of the four possible $z$'s." },
    { text: "Nonzero probability is spread uniformly over $2^{n-1}=2$ strings, so each gets probability $1/2$." },
  ],
  solution: {
    steps: [
      { description: "Strings orthogonal to $s=10$ (i.e. $z\\cdot s\\equiv0\\pmod2$): $z=00$ and $z=01$." },
      { description: "By the boxed result, only these two get nonzero probability, spread uniformly.", latex: "P(z) = \\frac{1}{2^{n-1}} = \\frac12 \\text{ for each orthogonal } z" },
      { description: "Running the actual circuit confirms this exactly.", latex: `P(01) = ${probabilityOfZ01.toFixed(2)}` },
    ],
    finalAnswer: `$P(01) = ${probabilityOfZ01.toFixed(2)}$, matching the general $1/2^{n-1}$ prediction exactly.`,
  },
  explanation: {
    correctIdea: "z=01 is orthogonal to s=10, so it's one of the two strings sharing all the nonzero probability, each getting exactly 1/2.",
    whyCorrect: "Directly computed via the real circuit (H, applySimonOracle, H), not just the general orthogonality argument.",
    whyWrong: ["Guessing a uniform 1/4 across all four z's ignores that two of them (10 and 11) are provably non-orthogonal to s and get exactly zero probability."],
  },
};
