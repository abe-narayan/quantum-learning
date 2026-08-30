import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const surfaceCodeDistanceScaling: MultipleChoiceProblem = {
  meta: {
    slug: "surface-code-distance-scaling",
    title: "How Does Reaching a Larger Distance Change the Construction?",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["surface-codes"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction"],
  },
  question: {
    type: "multiple-choice",
    prompt: "A surface code's checks are the same two local stabilizer types, the plaquette and vertex operators, whatever the size of the lattice: weight 4 in the bulk, and smaller where a finite patch's boundary truncates them. What does an engineer moving from distance 3 to distance 5 have to build, compared with someone doing the same for the Shor-code family?",
    options: [
      { id: "a", text: "Surface code: a larger grid of the same repeated stabilizer pattern; Shor-style: a new hand-designed construction" },
      { id: "b", text: "Both codes: a new hand-designed construction at each distance, with no reusable pattern" },
      { id: "c", text: "Both codes: a larger block built by repeating the same local stabilizer pattern" },
      { id: "d", text: "Surface code: a fresh stabilizer design at each distance; Shor-style: a bigger block of the same repeated pattern" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This misses the surface code's structural advantage: a larger grid reuses the identical local stabilizer pattern.",
      c: "The Shor-code family has no simple 'bigger version'. Reaching higher distance there needs new code design.",
      d: "The two families are the right way round in (a). Concatenating Shor's code does build bigger blocks, but each level is a new construction wrapped around the last; the surface code's plaquette and vertex checks are the identical local operators at distance 3, 5 and 21, weight 4 in the bulk and smaller at the patch's boundary, with no dependence on the distance either way.",
    },
    defaultIncorrectFeedback: "Ask, for each family, whether the stabilizer operators themselves change when the distance goes up, or only how many of them there are.",
  },
  hints: [
    { text: "A surface code's stabilizer pattern is identical at every grid size; only the grid grows." },
    { text: "The Shor code's 9-qubit structure doesn't have an obvious 'bigger version' at the same design." },
    { text: "Ask which family lets an engineer reach distance 5 by repeating work already done, and which requires a fresh design." },
  ],
  solution: {
    steps: [{ description: "Surface codes scale by repeating an identical local pattern on a bigger grid; Shor-style codes need a new, larger hand-designed construction for higher distance." }],
    finalAnswer: "The surface code needs only a bigger grid of the same stabilizer pattern; Shor-style codes need a new hand-designed construction.",
  },
  explanation: {
    correctIdea: "This scaling difference, not raw qubit count at any one distance, is the surface code's real structural advantage.",
    whyCorrect: "The plaquette and vertex checks are the same local operators at distance 3 and at distance 21, weight 4 in the bulk and weight 3 or 2 where a finite patch's boundary truncates them; only how many of them there are changes. What matters is that the weight is bounded by a constant that does not grow with the distance. A Shor-style code has no such repeating unit, so each new distance is a fresh design problem rather than more of the same tiling.",
    whyWrong: [
      { optionId: "b", text: "Misses the surface code's structural advantage: a bigger grid reuses the identical local stabilizer pattern." },
      { optionId: "c", text: "Credits the Shor-code family with a 'bigger version' it does not have. Higher distance there needs new code design." },
      { optionId: "d", text: "Swaps the two families. It is the surface code whose stabilizers are the same local checks at every distance, with a weight fixed by the tile rather than by the code size." },
    ],
  },
};
