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
    prerequisites: ["apex/fault-tolerance-frontiers/surface-codes-in-depth"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "Two separate surface-code patches sit side by side on a 2D chip, each encoding one logical qubit. Why can't a fault-tolerant two-qubit logical gate simply be applied transversally between them (the same physical two-qubit gate, applied to each corresponding pair of physical qubits across the two patches)?",
    options: [
      {
        id: "a",
        text: "Away from their shared boundary, the two patches' physical qubits have no natural qubit-by-qubit correspondence and are not even physically adjacent, so most physical qubits in one patch have no partner qubit in the other to apply a local two-qubit gate to",
      },
      { id: "b", text: "Transversal gates are impossible for any stabilizer code, including within a single patch" },
      { id: "c", text: "Surface codes have no logical two-qubit gate of any kind, fault-tolerant or otherwise" },
      { id: "d", text: "The two patches would need to use different physical qubit technologies" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Transversal logical operations within a single code block (like a single patch's logical X or Z string) work fine -- the issue here is specifically a two-qubit gate between two separate blocks with no shared index structure or physical adjacency.",
      c: "Surface codes do have a real logical two-qubit gate mechanism -- lattice surgery -- it's just not a transversal one.",
      d: "The problem is geometric/structural (no qubit correspondence, no adjacency), not a hardware-technology mismatch.",
    },
    defaultIncorrectFeedback:
      "Recall the lesson's Motivation section: the issue is that interior data qubits of one patch have no adjacent partner qubit in the other patch at all, only the qubits right at the shared boundary do.",
  },
  hints: [
    { text: "A transversal gate needs a partner qubit, for every qubit, in the other code block." },
    { text: "Only the qubits sitting at the shared boundary between two adjacent patches are physically close to each other." },
    { text: "This is a geometric fact about 2D chip layouts, not a statement that surface codes have no two-qubit gate at all." },
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
      "The lack of a qubit-by-qubit correspondence (and physical adjacency) between two separate 2D patches, not a general impossibility of transversal or two-qubit logical gates, is exactly why lattice surgery -- a boundary-only operation -- is needed instead.",
    whyWrong: [
      { optionId: "b", text: "Confuses this two-patch case with transversal logical operations inside one patch, which do exist." },
      { optionId: "c", text: "States the opposite of the lesson: lattice surgery is a real fault-tolerant logical two-qubit gate for surface codes." },
      { optionId: "d", text: "Misreads a geometric constraint as a hardware-technology mismatch. Both patches are the same technology; the problem is where the qubits sit." },
    ],
  },
};
