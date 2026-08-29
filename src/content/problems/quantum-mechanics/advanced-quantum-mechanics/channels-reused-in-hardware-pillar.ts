import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const channelsReusedInHardwarePillar: MultipleChoiceProblem = {
  meta: {
    slug: "channels-reused-in-hardware-pillar",
    title: "Which Engine Functions Get Reused in Noise, Decoherence & Scaling?",
    course: "advanced-quantum-mechanics",
    lesson: "quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["capstone"],
    prerequisites: ["quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Per this course's capstone, which two engine functions are built generally enough to be reused directly in the future Quantum Computing 'Noise, Decoherence & Scaling' course?",
    options: [
      { id: "a", text: "amplitudeDampingChannel and dephasingChannel" },
      { id: "b", text: "euclideanFreePropagator and discretizedTwoSlicePropagator" },
      { id: "c", text: "symmetrize and antisymmetrize" },
      { id: "d", text: "firstOrderEnergyCorrection and secondOrderEnergyCorrection" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "These are the path-integral functions — useful conceptually, but not the ones flagged for direct hardware-noise reuse.",
      c: "These are from Identical Particles & Many-Body Systems, unrelated to noise/decoherence modeling.",
      d: "These are from Approximation Methods' perturbation theory, unrelated to noise/decoherence modeling.",
    },
    defaultIncorrectFeedback: "The capstone specifically names the two decoherence-channel functions (T1/T2-style decay) as directly reusable for hardware noise modeling.",
  },
  hints: [
    { text: "Think about which functions directly model T1 (energy relaxation) and T2 (dephasing) — the exact quantities hardware noise courses discuss." },
    { text: "amplitudeDampingChannel models energy relaxation; dephasingChannel models pure dephasing." },
    { text: "These map directly onto T1 and T2 decay times." },
  ],
  solution: {
    steps: [{ description: "amplitudeDampingChannel models T1-style energy relaxation and dephasingChannel models T2-style phase loss. Those are the two quantities a hardware noise course works in, so those are the two functions the capstone flags for direct reuse." }],
    finalAnswer: "amplitudeDampingChannel and dephasingChannel, the T1 and T2 decay models.",
  },
  explanation: {
    correctIdea: "The two Kraus channels are written against T1 and T2, the same two numbers a hardware noise course is built around, which is what makes them portable across pillars.",
    whyCorrect: "Matches the capstone lesson's 'Where This Goes Next' section.",
    whyWrong: [
      { optionId: "b", text: "Names the path-integral functions. They carry the course's conceptual weight and model no decoherence." },
      { optionId: "c", text: "Names the exchange-symmetry functions from Identical Particles, which have no noise content." },
      { optionId: "d", text: "Names Approximation Methods' perturbation corrections, which compute energy shifts rather than decay." },
    ],
  },
};
