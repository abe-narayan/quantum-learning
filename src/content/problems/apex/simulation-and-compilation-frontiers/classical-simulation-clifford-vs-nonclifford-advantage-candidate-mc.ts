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
      "A team is choosing between two deep, highly-entangling circuits (both scrambling entanglement across the whole system in a fast, 2D-brickwork pattern) as a candidate for demonstrating quantum advantage. Circuit P uses only random Clifford gates (H, S, CNOT). Circuit Q uses random single-qubit rotations that are NOT restricted to Clifford angles, plus the same entangling two-qubit gates. Which is the better quantum-advantage candidate, and why?",
    options: [
      {
        id: "a",
        text: "Circuit Q is the better candidate: it violates both known efficient-classical-simulation criteria at once (it isn't a stabilizer circuit, and it generates volume-law entanglement), whereas Circuit P, however entangled, remains a stabilizer circuit and is therefore simulable in polynomial time by the Gottesman-Knill tableau algorithm regardless of how much entanglement it generates.",
      },
      {
        id: "b",
        text: "Circuit P is the better candidate, because it generates more entanglement than Circuit Q, and entanglement alone determines classical simulability.",
      },
      {
        id: "c",
        text: "Neither is a meaningfully better candidate: since both circuits scramble entanglement across the whole system equally fast, both are equally hard to simulate classically.",
      },
      {
        id: "d",
        text: "Circuit P is the better candidate, because Clifford circuits use more distinct gate types (H, S, and CNOT) than Circuit Q's single rotation-plus-entangler pattern, and using more distinct gates always makes a circuit harder to simulate.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Entanglement alone does not determine classical simulability. Circuit P can be pushed to maximal entanglement and remain trivially easy to simulate via Gottesman-Knill, since that theorem's efficiency guarantee depends only on the gate set (Clifford + Pauli measurement), never on how entangled the resulting state is.",
      c: "This ignores the gate-set criterion entirely. Circuit P's entanglement is irrelevant to its simulability, because it never leaves the stabilizer formalism: the tableau algorithm tracks its stabilizer generators in polynomial time no matter how volume-law its entanglement gets. Circuit Q has no such escape hatch.",
      d: "The number of distinct gate *types* used has nothing to do with classical simulability. What matters is whether every gate belongs to the Clifford group (H, S, CNOT, and products thereof) -- Circuit P qualifies regardless of using three different named gates, and a single non-Clifford gate in Circuit Q is enough to remove Gottesman-Knill's guarantee entirely.",
    },
    defaultIncorrectFeedback:
      "Apply both classical-simulability criteria independently: is the circuit Clifford-only (regardless of entanglement), and/or does its entanglement stay bounded (regardless of gate set)? Circuit P fails to violate the first; Circuit Q violates both.",
  },
  hints: [
    { text: "Classify each circuit against both of the lesson's two independent criteria: gate set (Clifford-only?) and entanglement growth (bounded or volume-law?)." },
    { text: "Circuit P is entangling fast, but check whether Gottesman-Knill actually cares about that." },
    { text: "A genuine quantum-advantage candidate needs to defeat every known efficient classical-simulation method simultaneously, not just one." },
  ],
  solution: {
    steps: [
      { description: "Circuit P: gate set is entirely Clifford, so the gate-set criterion (Gottesman-Knill) applies regardless of how much entanglement the circuit generates -- it is efficiently simulable no matter how deep or scrambling it is." },
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
      { optionId: "b", text: "Treats entanglement as the sole determinant of simulability, the Common Mistake this lesson warns against." },
      { optionId: "c", text: "Ignores that Circuit P never leaves the efficiently-simulable stabilizer formalism, regardless of its entanglement." },
      { optionId: "d", text: "Invents a 'more gate types is harder' rule with no basis in the theorem. Membership in the Clifford group, not gate-type variety, is what matters." },
    ],
  },
};
