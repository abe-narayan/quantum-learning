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
      ["periodic", "oscillat", "sine", "sin(", "sin²", "sin^2", "sin squared", "past π/2", "past pi/2", "beyond π/2", "beyond pi/2", "past 90"],
      ["decreas", "goes back down", "go back down", "comes back down", "back toward", "overshoot", "gets worse", "drops", "falls", "shrinks", "rotates past", "rotate past", "moves away", "away from the marked"],
    ],
    incorrectFeedback: "The closed form is a familiar trig function of the iteration count. Ask what that function does when its argument keeps growing, instead of assuming it climbs forever.",
    partialFeedback: "Good. Now be explicit about the shape of the curve: does it flatten out at the top, or come down the other side?",
  },
  hints: [
    { text: "Sketch the success probability as a function of the total rotation angle. What shape does the curve have?" },
    { text: "Where on that curve does the optimal iteration count land you? What lies just past that point?" },
    { text: "Each extra iteration adds the same fixed angle. What happens to the success probability once the total angle passes the peak?" },
  ],
  solution: {
    steps: [
      { description: "sin²((2k+1)θ) is a periodic function of k, peaking at 1 when (2k+1)θ≈π/2." },
      { description: "Continuing to increase k pushes the angle past π/2, where sin² decreases back toward 0." },
      { description: "So extra iterations past the optimum move the state past the 'closest to marked' point and back away from it." },
    ],
    finalAnswer: "Because sin² is periodic, not monotonically increasing. Past the optimal angle, more iterations rotate the state away from the marked item, not toward it.",
  },
  explanation: {
    correctIdea: "Each Grover iteration is a fixed-angle rotation, and rotations overshoot a target just like in ordinary geometry.",
    whyCorrect: "This directly explains the lesson's 'more iterations isn't always better' warning with the actual mechanism, not just the observation.",
    whyWrong: ["Assuming success probability plateaus at its peak misunderstands that it's a smooth periodic function, actively decreasing past the optimum, not flattening out."],
  },
};
