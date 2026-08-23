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
    steps: [{ description: "amplitudeDampingChannel (T1-style decay) and dephasingChannel (T2-style decay) are the two functions the capstone explicitly flags for direct reuse." }],
    finalAnswer: "(a) amplitudeDampingChannel and dephasingChannel",
  },
  explanation: {
    correctIdea: "This tests whether the reader tracked the capstone's explicit 'Where This Goes Next' section, not just the course's internal content.",
    whyCorrect: "Matches the capstone lesson's explicit statement.",
    whyWrong: ["The other options are real functions from other courses, but none were flagged as directly reused for hardware noise modeling specifically."],
  },
};
