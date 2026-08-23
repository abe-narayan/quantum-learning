import type { ConceptualProblem } from "@/lib/problems/types";

export const quantumVsClassicalIndistinguishability: ConceptualProblem = {
  meta: {
    slug: "quantum-vs-classical-indistinguishability",
    title: "Quantum vs. Classical Indistinguishability",
    course: "identical-particles",
    lesson: "quantum-mechanics/identical-particles/indistinguishability",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["indistinguishability", "conceptual"],
    prerequisites: ["quantum-mechanics/identical-particles/indistinguishability"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain the key difference between classical and quantum indistinguishability, focusing on whether a trajectory could in principle be used to tell particles apart.",
    placeholder: "Classically, identical particles could in principle be distinguished by... Quantum mechanically, this is impossible because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["trajectory", "track", "continuous path", "in principle"],
      ["no trajectory", "cannot", "impossible", "no dot to paint"],
    ],
    incorrectFeedback: "Address the specific mechanism classical particles could (in principle) use to stay distinguishable — a trajectory — and why quantum particles have no analogous mechanism.",
    partialFeedback: "Good — make sure both the classical possibility and the quantum impossibility are stated explicitly.",
  },
  hints: [
    { text: "Classical particles follow continuous, well-defined trajectories — you could watch particle A's path the whole time." },
    { text: "Quantum particles don't have continuous trajectories between measurements — the wavefunction doesn't track 'where each one is' individually." },
    { text: "Without a trajectory to follow, there's no way even in principle to know which particle is which after they interact or overlap." },
  ],
  solution: {
    steps: [
      { description: "Classically, even perfectly identical particles could in principle be tracked via their continuous trajectories — you could watch which one started where and follow it the whole time." },
      { description: "Quantum mechanically, particles don't have well-defined continuous trajectories between measurements, so there is no analogous way, even in principle, to track 'which particle is which.'" },
      { description: "This is why quantum indistinguishability is a stronger, structural fact (forcing definite exchange symmetry) rather than just a practical limitation." },
    ],
    finalAnswer: "Classical particles could in principle be tracked via continuous trajectories despite looking identical; quantum particles have no trajectories to track, making indistinguishability fundamental rather than practical.",
  },
  explanation: {
    correctIdea: "This is the conceptual core the lesson's Motivation section opens with — the billiard-ball-with-a-dot thought experiment.",
    whyCorrect: "Matches the lesson's explicit framing of the classical/quantum distinction.",
    whyWrong: ["Saying quantum particles are just 'harder to measure individually' misses that the issue isn't measurement difficulty — it's that no well-defined trajectory-based identity exists to measure in the first place."],
  },
};
