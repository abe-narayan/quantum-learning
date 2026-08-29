import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const onlyQuantumStep: MultipleChoiceProblem = {
  meta: {
    slug: "only-quantum-step",
    title: "Which Step of the Hybrid Loop Must Run on a Quantum Device?",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["hybrid-workflows"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows"],
  },
  question: {
    type: "multiple-choice",
    prompt: "In the general hybrid loop, which single step must actually run on a quantum device, and why can't classical hardware perform it efficiently instead?",
    options: [
      { id: "a", text: "Preparing the ansatz state and measuring it, because sampling a generic quantum state's distribution is the classically hard step" },
      { id: "b", text: "Proposing the next parameters, because the search space is exponential in the parameter count" },
      { id: "c", text: "Computing the cost from the measurement results, because the expectation value sums over 2ⁿ amplitudes" },
      { id: "d", text: "Checking convergence, because deciding when a noisy estimate has settled needs the device's own shot statistics" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The parameter space is large, but it is a real-valued optimization over a handful of angles, and classical optimizers do exactly this every day. High-dimensional search is not the same as quantum-hard.",
      c: "The device hands back a table of bitstring counts. Turning counts into an expectation value is a weighted average over the outcomes observed, not a sum over 2ⁿ amplitudes. That sum is what the device is doing for you.",
      d: "Convergence checking compares successive cost estimates against a threshold. Shot noise makes the estimates noisy, but the comparison is classical arithmetic.",
    },
    defaultIncorrectFeedback: "Three of the loop's four steps read and manipulate classical numbers. Ask which step involves a quantum state at all.",
  },
  hints: [
    { text: "Walk the loop and ask, at each step, what data is on the wire: a quantum state, or a list of classical numbers." },
    { text: "Three of the four steps only ever touch classical numbers, and classical optimizers handle them routinely." },
    { text: "The remaining step is the one whose cost blows up exponentially when you try to run it on a classical machine." },
  ],
  solution: {
    steps: [{ description: "Preparing the ansatz state and sampling it is the one step that touches a quantum state. It is also the step whose classical emulation costs 2ⁿ amplitudes, which is why a device earns its place here. Parameter proposal, cost evaluation and convergence checking all operate on classical numbers." }],
    finalAnswer: "Preparing and measuring the ansatz state: the only step that touches a quantum state, and the only one with no efficient classical substitute.",
  },
  explanation: {
    correctIdea: "A classical machine can carry out every step of the hybrid loop; it is only the state preparation and sampling step where doing so costs exponential time, which is where a device earns its place.",
    whyCorrect: "Matches the lesson's 'What runs where' section.",
    whyWrong: [
      { optionId: "b", text: "Mistakes a large classical search for a quantum one. Optimizing over a few angles is ordinary numerical optimization." },
      { optionId: "c", text: "Puts the 2ⁿ sum in the wrong place. The device performs it; the classical side averages the counts that come back." },
      { optionId: "d", text: "Treats noisy inputs as a quantum requirement. Comparing two noisy numbers is still classical arithmetic." },
    ],
  },
};
