import type { NumericProblem } from "@/lib/problems/types";

export const groupVelocityCalculation: NumericProblem = {
  meta: {
    slug: "group-velocity-calculation",
    title: "Group Velocity of a Wave Packet",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/free-particle-wave-packets",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["wave-packet", "group-velocity"],
    prerequisites: ["quantum-mechanics/wave-mechanics/free-particle-wave-packets"],
  },
  question: {
    type: "numeric",
    prompt: "A free-particle wave packet has average momentum p0 = 4 and mass m = 2. Find its group velocity v_g = p0/m.",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 2,
    tolerance: 0.01,
    incorrectFeedback: "v_g = p0/m directly.",
    nearMisses: [
      { value: 8, feedback: "8 multiplies p₀ by m. A velocity comes from dividing momentum by mass." },
      { value: 0.5, feedback: "0.5 is m/p₀, the ratio inverted." },
    ],
  },
  hints: [{ text: "Use v_g = p0/m directly — no other formula is needed." }],
  solution: {
    steps: [{ description: "$v_g = p_0/m = 4/2 = 2$." }],
    finalAnswer: "$v_g = 2$",
  },
  explanation: {
    correctIdea: "The group velocity of a free-particle wave packet equals the classical velocity p0/m.",
    whyCorrect: "This follows directly from the free-particle dispersion relation E(k)=hbar^2k^2/(2m).",
    whyWrong: ["Using p0*m instead of p0/m inverts the relationship."],
  },
};
