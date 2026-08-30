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
    incorrectFeedback: "The two presets have to be combined into the single dimensionless number the prompt names. Check whether you combined them with the wrong operation, or lost track of a decimal place on the way through.",
    nearMisses: [
      { value: 0.4, tolerance: 0.005, feedback: "A decimal place slipped. $0.0002$ is two ten-thousandths, not two thousandths." },
      { value: 0.004, tolerance: 0.00005, feedback: "A decimal place slipped the other way. $0.0002$ is two ten-thousandths, not two hundred-thousandths." },
      { value: 200.0002, tolerance: 0.001, feedback: "That is the sum of the two presets. The quantity that governs stability is their product: a potential and a step length multiply to give a phase." },
    ],
  },
  hints: [
    { text: "What destabilizes a split-step evolver is the phase the potential imparts within a single step, which is why the lesson quotes wallHeight and dt together rather than either alone." },
    { text: "Take the two preset values as given and form the single product the prompt names. No unit conversion and no additional factor enters." },
    { text: "$0.0002$ carries four decimal places. Track them through the multiplication rather than estimating the magnitude by eye." },
  ],
  solution: {
    steps: [{ description: "$200 \\times 0.0002 = 0.04$, comfortably less than 1." }],
    finalAnswer: "$0.04$",
  },
  explanation: {
    correctIdea: "Keeping V*dt small (here, 0.04) is what avoids the energy-blowup numerical artifact documented in the lesson.",
    whyCorrect: "This is the platform's actual chosen values, verified in this lesson to give accurate energy expectation values.",
    whyWrong: ["Using the earlier, uncorrected combination (wallHeight=1e6, dt=0.001, product=1000) is the case the lesson shows produces a badly inaccurate energy calculation, even though the state's shape and norm still looked fine."],
  },
};
