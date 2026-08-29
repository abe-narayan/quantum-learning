import type { NumericProblem } from "@/lib/problems/types";

function groverIterateProb(theta: number, m: number): number {
  return Math.sin((2 * m + 1) * theta) ** 2;
}

const theta = Math.PI / 12;
const m = 2;
const value = groverIterateProb(theta, m);

export const amplitudeEstimationGroverIterateProbability: NumericProblem = {
  meta: {
    slug: "amplitude-estimation-grover-iterate-probability",
    title: "Grover-Iterate Success Probability for θ=π/12, m=2",
    course: "algorithmic-frontiers",
    lesson: "apex/algorithmic-frontiers/amplitude-estimation-without-phase-estimation",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["amplitude-estimation", "grover-iterate", "closed-form"],
    prerequisites: ["apex/algorithmic-frontiers/amplitude-estimation-without-phase-estimation"],
  },
  question: {
    type: "numeric",
    prompt:
      "For an amplitude-estimation state with θ=π/12 (so a=sin²θ), use the closed form P(1|m) = sin²((2m+1)θ) to compute the Grover-iterate success probability after m=2 iterations.",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Compute (2m+1)θ = 5·(π/12) = 75°, then square its sine: sin²(75°).",
    nearMisses: [
      {
        value: Math.sin(theta) ** 2,
        feedback:
          "That is sin²θ, the starting amplitude a before any iterate runs. The (2m+1) factor is what the two iterates buy you: the rotation angle is 5θ, not θ.",
      },
      {
        value: Math.sin((2 * m + 1) * theta),
        tolerance: 0.005,
        feedback: "That is sin(75°) itself. The closed form returns a probability, so the sine still has to be squared.",
      },
    ],
  },
  hints: [
    { text: "θ=π/12=15°, so (2m+1)θ at m=2 is 5θ=75°." },
    { text: "P(1|m=2) = sin²(75°)." },
    { text: "sin(75°) = cos(15°) ≈ 0.9659." },
  ],
  solution: {
    steps: [
      { description: "θ=15°, and at m=2, (2m+1)θ = 5·15° = 75°." },
      { description: "sin(75°) ≈ 0.9659, so P(1|m=2) = sin²(75°) ≈ 0.9330." },
      { description: "This matches this platform's real groverIterateProb(Math.PI/12, 2) output exactly." },
    ],
    finalAnswer: `≈${value.toFixed(4)}`,
  },
  explanation: {
    correctIdea:
      "The amplitude-estimation Grover iterate obeys exactly the same closed-form rotation formula as ordinary Grover amplitude amplification, sin²((2k+1)θ), with θ defined by sin²θ=a instead of sin²θ=1/N.",
    whyCorrect:
      "Two applications of the iterate rotate the state to angle 5θ=75° from its starting axis, already close to the θ=90° point of certainty, illustrating how quickly amplitude amplification concentrates probability even from a fairly small starting amplitude a=sin²(15°)≈0.067.",
    whyWrong: [
      "Using θ itself (15°) as the exponent's angle, forgetting the (2m+1) factor, gives sin²(15°)≈0.067 — the bare starting amplitude, not the post-iteration probability.",
    ],
  },
};
