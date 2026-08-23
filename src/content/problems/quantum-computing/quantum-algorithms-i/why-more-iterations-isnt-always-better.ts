import type { ConceptualProblem } from "@/lib/problems/types";

export const whyMoreIterationsIsntAlwaysBetter: ConceptualProblem = {
  meta: {
    slug: "why-more-iterations-isnt-always-better",
    title: "Why Running Extra Grover Iterations Can Hurt, Not Help",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["grovers-algorithm"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification"],
  },
  question: {
    type: "conceptual",
    prompt: "Using the closed-form success probability sin²((2k+1)θ), explain why running significantly more iterations than the optimal count can make Grover's algorithm perform worse, not better.",
    placeholder: "Think about what sin² does as its argument keeps increasing past π/2...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["periodic", "oscillat", "sin", "past \\u03c0/2", "past pi/2"],
      ["decreases", "goes back down", "overshoot"],
    ],
    incorrectFeedback: "Think about what sin²(x) does as x continues increasing past π/2 — does it keep growing?",
    partialFeedback: "Good — now be explicit that this is a periodic oscillation, not a plateau or continued increase.",
  },
  hints: [
    { text: "sin²(x) increases from 0 toward 1 as x goes from 0 to π/2." },
    { text: "Past x=π/2, sin²(x) starts decreasing again, back toward 0 at x=π." },
    { text: "(2k+1)θ keeps growing linearly with k, so it eventually overshoots π/2." },
  ],
  solution: {
    steps: [
      { description: "sin²((2k+1)θ) is a periodic function of k, peaking at 1 when (2k+1)θ≈π/2." },
      { description: "Continuing to increase k pushes the angle past π/2, where sin² decreases back toward 0." },
      { description: "So extra iterations past the optimum move the state past the 'closest to marked' point and back away from it." },
    ],
    finalAnswer: "Because sin² is periodic, not monotonically increasing — past the optimal angle, more iterations rotate the state away from the marked item, not toward it.",
  },
  explanation: {
    correctIdea: "Each Grover iteration is a fixed-angle rotation, and rotations overshoot a target just like in ordinary geometry.",
    whyCorrect: "This directly explains the lesson's 'more iterations isn't always better' warning with the actual mechanism, not just the observation.",
    whyWrong: ["Assuming success probability plateaus at its peak misunderstands that it's a smooth periodic function, actively decreasing past the optimum, not flattening out."],
  },
};
