import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const classicalSimulationCliffordVsNonCliffordAdvantageCandidateMc: MultipleChoiceProblem = {
  meta: {
    slug: "classical-simulation-clifford-vs-nonclifford-advantage-candidate-mc",
    title: "Choosing a Quantum-Advantage Candidate Circuit",
    course: "simulation-and-compilation-frontiers",
    lesson: "apex/simulation-and-compilation-frontiers/when-classical-simulation-works",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["gottesman-knill", "quantum-advantage", "tensor-networks", "classical-simulability"],
    prerequisites: ["apex/simulation-and-compilation-frontiers/when-classical-simulation-works"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "A team is choosing between two deep, highly-entangling circuits (both scrambling entanglement across the whole system in a fast, 2D-brickwork pattern) as a candidate for demonstrating quantum advantage. Circuit P uses only random Clifford gates (H, S, CNOT). Circuit Q uses random single-qubit rotations that are not restricted to Clifford angles, plus the same entangling two-qubit gates. Which is the better quantum-advantage candidate, and why?",
    options: [
      {
        id: "a",
        text: "Circuit Q: it is neither a stabilizer circuit nor entanglement-bounded, while Circuit P stays stabilizer and Gottesman-Knill handles it however entangled",
      },
      {
        id: "b",
        text: "Circuit Q, because non-Clifford rotations are what make a state entangled, so Circuit P stays close to a product state throughout",
      },
      {
        id: "c",
        text: "Circuit P, because it generates entanglement faster than Circuit Q does, and how much entanglement a circuit builds is what decides classical simulability",
      },
      {
        id: "d",
        text: "Neither is better: both scramble entanglement across the whole system at the same rate, so both resist classical simulation equally",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The verdict is right and the reason is not. Clifford circuits reach volume-law entanglement quite happily, so Circuit P is nowhere near a product state. What keeps it out of contention is the tableau algorithm, not any shortage of entanglement.",
      c: "Entanglement on its own does not decide simulability. Circuit P can be pushed to maximal entanglement and still be simulated in polynomial time, because Gottesman-Knill's guarantee depends on the gate set and never on how entangled the state becomes.",
      d: "This applies one criterion and skips the other. Circuit P never leaves the stabilizer formalism, so its entanglement growth costs a simulator nothing, while Circuit Q has no such escape hatch.",
    },
    defaultIncorrectFeedback:
      "Apply the two efficient-simulation criteria separately: is the circuit Clifford-only, whatever its entanglement, and does its entanglement stay bounded, whatever its gate set? One of these circuits escapes only one of them.",
  },
  hints: [
    { text: "Classify each circuit against both of the lesson's two independent criteria: gate set (Clifford-only?) and entanglement growth (bounded or volume-law?)." },
    { text: "Circuit P is entangling fast, but check whether Gottesman-Knill actually cares about that." },
    { text: "A genuine quantum-advantage candidate needs to defeat every known efficient classical-simulation method simultaneously, not just one." },
  ],
  solution: {
    steps: [
      { description: "Circuit P: gate set is entirely Clifford, so the gate-set criterion (Gottesman-Knill) applies regardless of how much entanglement the circuit generates. It is efficiently simulable no matter how deep or scrambling it is." },
      { description: "Circuit Q: gate set includes non-Clifford rotations, so the gate-set criterion does not apply; and it generates volume-law entanglement, so the bounded-bond-dimension criterion does not apply either." },
      { description: "Circuit Q is therefore the only one of the two that violates both known efficient classical-simulation criteria at once, making it the actual candidate worth pursuing for a quantum-advantage claim." },
    ],
    finalAnswer: "Circuit Q, because it violates both efficient-simulation criteria at once while Circuit P stays a stabilizer circuit however entangled it gets.",
  },
  explanation: {
    correctIdea:
      "A real quantum-advantage candidate must defeat every known efficient classical-simulation method simultaneously, not just look complicated. Circuit P's entanglement is a red herring: Gottesman-Knill's guarantee never checked how entangled a stabilizer circuit's output is.",
    whyCorrect:
      "Applying both criteria independently to each circuit shows Circuit P failing to escape Gottesman-Knill no matter how entangled it becomes, while Circuit Q escapes both known efficient methods at once. That is why real quantum-advantage experiments use random, non-Clifford, fast-entangling circuits rather than merely 'entangled' ones.",
    whyWrong: [
      { optionId: "b", text: "Lands on the right circuit for a reason that is false. Clifford gates generate plenty of entanglement; what makes Circuit P simulable is that the tableau tracks it regardless." },
      { optionId: "c", text: "Treats entanglement as the only thing deciding simulability, when a heavily entangled stabilizer state is still simulated efficiently by Gottesman-Knill." },
      { optionId: "d", text: "Weighs the two circuits on entanglement growth alone and never checks the gate set, which is the criterion that separates them." },
    ],
  },
};
