import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { pureStateDensityMatrix } from "@/lib/quantum/densityMatrix";
import { spinObservableInXZPlane, chshValue } from "@/lib/quantum/chsh";
import type { NumericProblem } from "@/lib/problems/types";

const bellPhiPlus = new StateVector([new Complex(Math.SQRT1_2), Complex.ZERO, Complex.ZERO, new Complex(Math.SQRT1_2)]);
const rho = pureStateDensityMatrix(bellPhiPlus);
const value = chshValue(rho, {
  a: spinObservableInXZPlane(0),
  aPrime: spinObservableInXZPlane(Math.PI / 2),
  b: spinObservableInXZPlane(0),
  bPrime: spinObservableInXZPlane(Math.PI / 2),
});

export const sameSettingsChshValue: NumericProblem = {
  meta: {
    slug: "same-settings-chsh-value",
    title: "CHSH Value When Bob Reuses Alice's Settings",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/the-chsh-inequality",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["chsh", "bell-states"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/the-chsh-inequality"],
  },
  question: {
    type: "numeric",
    prompt:
      "For $|\\Phi^+\\rangle$, using $E(a,b)=\\cos(\\theta_a-\\theta_b)$, compute $S$ when Bob uses the exact same two settings as Alice: $\\theta_a=0,\\theta_{a'}=\\pi/2,\\theta_b=0,\\theta_{b'}=\\pi/2$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Compute each of the four cosines individually before summing: two of them vanish and two do not. The most common slip is treating E(a',b') as one of the vanishing ones even though its two angles are equal, and then forgetting it enters S with a minus sign.",
    nearMisses: [
      {
        value: 1,
        feedback:
          "You treated E(a',b') as vanishing. Its two angles are both π/2, so their difference is 0 and the correlator is 1, which the minus sign then cancels against E(a,b).",
      },
      { value: 2, feedback: "2 comes from adding all four correlators. CHSH subtracts the fourth, and here that subtraction removes the only other nonzero term." },
      { value: 2 * Math.SQRT2, tolerance: 0.05, feedback: "2√2 is what the optimal setting angles give. These settings are not optimal: reusing Alice's two axes for Bob throws the violation away." },
    ],
  },
  hints: [
    { text: "Four correlators go into S, and with Bob copying Alice's settings each one is the cosine of an angle difference that repeats. Tabulate all four differences before combining anything." },
    { text: "Watch E(a',b') especially: its two angles are equal, so like E(a,b) it is the cosine of a vanishing difference. The two cross terms involve a quarter-turn difference instead." },
    { text: "Combine using the CHSH signs: S = E(a,b) + E(a,b') + E(a',b) - E(a',b'). Notice which equal terms enter with opposite signs." },
  ],
  solution: {
    steps: [
      { description: "$E(a,b)=1,\\ E(a,b')=0,\\ E(a',b)=0,\\ E(a',b')=\\cos(\\pi/2-\\pi/2)=\\cos(0)=1$." },
      { description: "$S = 1+0+0-1 = 0$" },
    ],
    finalAnswer: "S = 0, well within the classical bound: no violation at all.",
  },
  explanation: {
    correctIdea: "Reusing the same two settings for both parties wastes the four-setting structure CHSH needs to reach a violation.",
    whyCorrect: "S=0 shows entanglement alone isn't enough: the measurement configuration must be chosen deliberately, as done in the standard 2√2 example.",
    whyWrong: [
      "Expecting a violation here just because the state is maximally entangled ignores that the angle choice matters just as much as the state.",
      "Answering S=1 forgets that E(a',b') also equals cos(0)=1 here, since θ_a'=θ_b'=π/2 makes their difference 0 too. That term needs to be subtracted, canceling E(a,b)'s +1.",
    ],
  },
};
