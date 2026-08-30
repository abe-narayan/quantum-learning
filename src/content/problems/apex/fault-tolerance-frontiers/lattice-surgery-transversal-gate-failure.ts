import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const latticeSurgeryTransversalGateFailure: MultipleChoiceProblem = {
  meta: {
    slug: "lattice-surgery-transversal-gate-failure",
    title: "Why No Transversal Gate Between Two Patches?",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/lattice-surgery",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["lattice-surgery", "surface-codes", "fault-tolerance"],
    prerequisites: ["apex/fault-tolerance-frontiers/surface-codes-in-depth", "apex/fault-tolerance-frontiers/lattice-surgery"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "Two separate surface-code patches sit side by side on a 2D chip, each encoding one logical qubit. Why can't a fault-tolerant two-qubit logical gate simply be applied transversally between them (the same physical two-qubit gate, applied to each corresponding pair of physical qubits across the two patches)?",
    options: [
      {
        id: "a",
        text: "Away from the shared boundary, a qubit in one patch has no partner in the other to pair with, so most qubits have nothing to act on",
      },
      { id: "b", text: "Only the qubits along the touching boundary pair up, and acting on just those pairs is already the transversal gate you want" },
      { id: "c", text: "An index-by-index pairing between the two patches does exist on paper; the obstruction is that executing it runs slower than a lattice-surgery merge" },
      { id: "d", text: "A transversal gate between the patches would spread one physical fault into two errors inside a patch, which is what rules it out" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Acting only on the boundary pairs is a real operation, and it is what lattice surgery does, but it is a stabilizer measurement rather than a transversal gate. Transversal means every data qubit acts with a partner of its own, and away from the boundary there is no partner to be had.",
      c: "Speed is not the obstruction. A two-qubit gate on a 2D chip can only act between physically adjacent qubits, so a pairing that exists on paper but not on the lattice cannot be executed at all, however long you are willing to wait.",
      d: "Confining a fault to one qubit per block is what transversality achieves, not what defeats it. The obstruction here is geometric: away from the shared boundary there is no partner qubit to act on.",
    },
    defaultIncorrectFeedback:
      "Ask what a transversal gate demands of every single data qubit, then look at where on the chip the two patches actually touch.",
  },
  hints: [
    { text: "A transversal gate needs a partner qubit, for every qubit, in the other code block." },
    { text: "Only the qubits sitting at the shared boundary between two adjacent patches are physically close to each other." },
    { text: "This is a geometric fact about 2D chip layouts. It is not a statement about how faults propagate, nor about how long the gate would take." },
  ],
  solution: {
    steps: [
      {
        description:
          "A transversal gate requires every physical qubit of one code block to have a corresponding partner qubit in the other block. For two surface-code patches placed side by side on a chip, only the qubits directly on the touching boundary are physically adjacent; every interior qubit of one patch has no nearby partner in the other patch at all.",
      },
    ],
    finalAnswer:
      "Away from the shared boundary, the two patches' physical qubits have no qubit-by-qubit correspondence and no physical adjacency, so most qubits in one patch have no partner in the other to act on.",
  },
  explanation: {
    correctIdea:
      "The lack of a qubit-by-qubit correspondence (and of physical adjacency) between two separate 2D patches, not a general impossibility of transversal or two-qubit logical gates, is why lattice surgery, a boundary-only operation, is needed instead.",
    whyWrong: [
      { optionId: "b", text: "Mistakes a boundary-only stabilizer measurement, which is lattice surgery, for a transversal gate. Transversality is a condition on every qubit, not on the ones that happen to be adjacent." },
      { optionId: "c", text: "Treats an abstract index pairing as executable. On a 2D chip a two-qubit gate acts only between neighbours, so a pairing the lattice does not realise is not slow, it is unavailable." },
      { optionId: "d", text: "Inverts the property. A transversal gate is precisely the kind that does not spread a fault within a block; that is why one would be wanted here if the geometry allowed it." },
    ],
  },
};
