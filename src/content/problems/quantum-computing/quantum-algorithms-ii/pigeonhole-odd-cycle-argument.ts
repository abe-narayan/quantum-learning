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
      ["alternate", "alternating colors", "go around", "return to start"],
      ["odd", "can't return", "parity", "contradiction"],
    ],
    incorrectFeedback: "Imagine coloring the cycle's vertices one at a time, alternating colors to cut every edge — what happens when you get back to the start on an odd cycle?",
    partialFeedback: "Good — now be explicit about the parity contradiction this creates.",
  },
  hints: [
    { text: "Cutting every edge of a cycle requires strictly alternating colors around it." },
    { text: "After going around an odd number of vertices, alternating colors puts you back at the start with the wrong color." },
    { text: "This is a direct contradiction — the starting vertex can't have two different colors." },
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
