import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const magicStateEastinKnillTransversalGates: MultipleChoiceProblem = {
  meta: {
    slug: "magic-state-eastin-knill-transversal-gates",
    title: "Which Gates Are Transversal on the Surface Code, and Why Not All of Them?",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/magic-states-and-distillation",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["eastin-knill", "gottesman-knill", "transversal-gates", "magic-states"],
    prerequisites: ["apex/fault-tolerance-frontiers/magic-states-and-distillation"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "On the surface code, every Clifford operation (H, S, CNOT) has a fault-tolerant implementation, and the code's transversal gates are all Clifford. T is the one gate with no fault-tolerant circuit of its own: it has to be injected from a separately prepared magic state. Which statement best explains why that is not just a current engineering limitation?",
    options: [
      {
        id: "a",
        text: "Eastin-Knill shows no code can hold a universal transversal gate set while also correcting arbitrary single-qubit errors",
      },
      {
        id: "b",
        text: "Eastin-Knill rules out a transversal T on the surface code specifically, while other code families have one and give up nothing for it",
      },
      {
        id: "c",
        text: "Adding a transversal T would cut the surface code's distance, so the code's distance excludes it rather than any theorem",
      },
      {
        id: "d",
        text: "T is already transversal on the surface code, and distillation exists only to cut the qubit overhead of injection",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The theorem is not about the surface code in particular; it constrains every code that corrects arbitrary single-qubit errors. Other families do have a transversal T, but they lose transversality of some other gate in exchange, so universality is never free.",
      c: "Transversality is about how a gate acts across a block, not about distance, and a transversal circuit leaves the code's distance untouched. The obstruction is the no-go theorem, which forbids the combination rather than the individual gate.",
      d: "T is the one gate here that is not transversal, and that is precisely why magic-state injection and distillation exist as a separate mechanism rather than as an optimisation.",
    },
    defaultIncorrectFeedback:
      "Name the theorem that constrains which gate sets a code can implement transversally, and state the two properties it says no code can hold at once.",
  },
  hints: [
    { text: "This is a named no-go theorem, not an open engineering problem." },
    { text: "The theorem trades off two properties: a universal transversal gate set, and full single-qubit error correction. A code can't have both." },
    { text: "Ask which of H, S, CNOT, T is the one gate that would make the Clifford group universal if it were added transversally." },
  ],
  solution: {
    steps: [
      {
        description: "Eastin-Knill states: no quantum error-correcting code can have both (i) a universal set of transversal logical gates, and (ii) the ability to correct arbitrary single-qubit errors.",
      },
      {
        description: "The surface code corrects arbitrary single-qubit errors (up to its distance), so by the theorem it cannot also have a universal transversal gate set. Its transversal gates sit inside the Clifford group, and Clifford gates alone are not universal, so the gate that would complete universality, T, is the one the theorem forbids. Fault-tolerant Cliffords still exist on the surface code, but by lattice surgery, patch deformation and twist braiding rather than by qubit-by-qubit transversal circuits.",
      },
    ],
    finalAnswer: "Eastin-Knill makes a universal transversal gate set provably impossible on any code that corrects arbitrary single-qubit errors. On the surface code, whose transversal gates are all Clifford, that is what puts a transversal T permanently out of reach, rather than a circuit nobody has found yet.",
  },
  explanation: {
    correctIdea:
      "Eastin-Knill is a structural no-go result, not an unsolved engineering challenge: any error-correcting code with full single-qubit error correction is barred from also having a universal transversal gate set.",
    whyCorrect:
      "This is why magic-state injection, a different and non-transversal mechanism, exists as the standard workaround, rather than the field waiting for a better transversal T circuit.",
    whyWrong: [
      { optionId: "b", text: "Reads a general theorem as a fact about one code. Codes with a transversal T exist, and they give up transversality elsewhere; the constraint is on the set, not on the gate." },
      { optionId: "c", text: "Blames distance for a constraint on gate sets. A transversal circuit does not change a code's distance, and the obstruction is a proven no-go rather than a parameter." },
      { optionId: "d", text: "Gets the facts backwards. T is the one non-transversal gate here, which is why distillation exists at all." },
    ],
  },
};
