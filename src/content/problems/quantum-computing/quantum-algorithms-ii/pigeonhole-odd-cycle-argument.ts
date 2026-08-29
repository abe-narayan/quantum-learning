import type { ConceptualProblem } from "@/lib/problems/types";

export const pigeonholeOddCycleArgument: ConceptualProblem = {
  meta: {
    slug: "pigeonhole-odd-cycle-argument",
    title: "Generalizing the Triangle's Pigeonhole Argument to Any Odd Cycle",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/qaoa-a-worked-max-cut-example",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["qaoa", "graph-theory"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/qaoa-a-worked-max-cut-example"],
  },
  question: {
    type: "conceptual",
    prompt: "Extend the triangle's pigeonhole argument (3 vertices, 2 colors, some edge must match) to explain why no odd cycle can ever have every edge cut.",
    placeholder: "Think about what a 2-coloring of a cycle looks like as you go around it...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["alternat", "go around", "around the cycle", "return to start", "back to the start", "wraps around", "every other"],
      ["odd number", "odd length", "odd cycle", "odd count", "odd n", "parity", "contradict", "mismatch", "two different colors", "both colors", "wrong color", "can't return", "cannot return", "inconsistent"],
    ],
    incorrectFeedback: "Try to two-color the cycle so every edge is cut, working vertex by vertex, and pay attention to the moment the loop closes on itself.",
    partialFeedback: "Good. Now be explicit about the clash at the final vertex and why the cycle's length is what causes it.",
  },
  hints: [
    { text: "To cut an edge, what must be true of its two endpoint colors? Walk vertex by vertex around the cycle imposing that condition." },
    { text: "Track which color you are forced to give vertex k. What determines it?" },
    { text: "The walk eventually arrives back where it began. Compare the color demanded there with the color you gave that vertex at the start." },
  ],
  solution: {
    steps: [
      { description: "Cutting every edge of a cycle requires adjacent vertices to always differ, i.e. colors must strictly alternate around the cycle." },
      { description: "Starting at vertex 0 with color A, alternating gives vertex k color A if k is even, B if k is odd." },
      { description: "For an odd cycle of length n, vertex n (which equals vertex 0) would need color B (since n is odd) — contradicting vertex 0's actual color, A." },
    ],
    finalAnswer: "Alternating colors around an odd cycle forces a contradiction at the point where it closes back on itself — so no odd cycle can have every edge cut.",
  },
  explanation: {
    correctIdea: "This is the standard fact that odd cycles are not bipartite, generalizing the triangle's specific pigeonhole argument to any odd length.",
    whyCorrect: "This directly explains why the triangle result generalizes, rather than being a coincidence of having exactly 3 vertices.",
    whyWrong: ["Restricting the argument to 'small cycles only' misses that the same parity contradiction applies at any odd length, not just 3."],
  },
};
