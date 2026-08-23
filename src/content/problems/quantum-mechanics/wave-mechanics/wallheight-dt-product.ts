import type { NumericProblem } from "@/lib/problems/types";

export const wallheightDtProduct: NumericProblem = {
  meta: {
    slug: "wallheight-dt-product",
    title: "Checking a Numerical Wall Height Against the Time Step",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["split-operator", "numerical-methods", "infinite-square-well"],
    prerequisites: ["quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states"],
  },
  question: {
    type: "numeric",
    prompt: "The Wavefunction Explorer's infinite-well presets use wallHeight = 200 and dt = 0.0002. Compute the product wallHeight * dt, which should be kept much less than 1 for accurate energy calculations.",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.04,
    tolerance: 0.0005,
    incorrectFeedback: "Just multiply the two given numbers directly: 200 * 0.0002.",
  },
  hints: [{ text: "This is a direct multiplication: 200 * 0.0002." }],
  solution: {
    steps: [{ description: "$200 \\times 0.0002 = 0.04$, comfortably less than 1." }],
    finalAnswer: "$0.04$",
  },
  explanation: {
    correctIdea: "Keeping V*dt small (here, 0.04) is exactly what avoids the energy-blowup numerical artifact documented in the lesson.",
    whyCorrect: "This is the platform's actual chosen values, verified in this lesson to give accurate energy expectation values.",
    whyWrong: ["Using the earlier, uncorrected combination (wallHeight=1e6, dt=0.001, product=1000) is exactly the case the lesson shows produces a badly inaccurate energy calculation, even though the state's shape and norm still looked fine."],
  },
};
