import type { ConceptualProblem } from "@/lib/problems/types";

export const whyTestingBasisStatesIsntEnough: ConceptualProblem = {
  meta: {
    slug: "why-testing-basis-states-isnt-enough",
    title: "Why a Device That Clones |0⟩ and |1⟩ Still Isn't a Cloner",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["no-cloning", "linearity", "unknown-state"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A friend argues: \"A cloning device only really needs to copy |0⟩ and |1⟩ correctly — those are the only 'real' classical states, so testing it on those two is enough to call it a working cloner.\" Explain what's wrong with this reasoning, specifically addressing why an unknown qubit being handed to the device (not just |0⟩ or |1⟩ on their own) is exactly what the no-cloning theorem's proof exploits.",
    placeholder: "A cloning device has to work on ANY input state, since...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["unknown", "arbitrary", "any state", "superposition"],
      ["linear", "linearity"],
      ["forced", "determined", "contradiction", "fails", "breaks down"],
    ],
    incorrectFeedback:
      "Focus on what a cloner is supposed to do with a state it doesn't know in advance, and why fixing the device's behavior on |0⟩ and |1⟩ already determines (via linearity) what it must do on every superposition — leaving it no freedom to also succeed there.",
    partialFeedback:
      "You're partway there. Make sure you explicitly connect the requirement of handling an *unknown, arbitrary* state to the *linearity* of any quantum device, and explain why that combination is what forces a contradiction.",
  },
  hints: [
    { text: "A real cloning device would be used precisely when the input state is NOT known in advance — if you already knew it, you wouldn't need a cloner." },
    { text: "Any physical quantum device is a unitary, and unitaries are linear operators." },
    { text: "Once a device's action on |0⟩ and |1⟩ is fixed, linearity completely determines — with no further freedom — what it does to every superposition of them, including states the device was never separately checked against." },
  ],
  solution: {
    steps: [
      { description: "A cloner's whole purpose is to work on a state that isn't known in advance; a device only tested on |0⟩ and |1⟩ hasn't been tested on the actual use case." },
      { description: "Because every physical quantum operation is linear, fixing a device's output on |0⟩ and |1⟩ already fixes — with zero remaining freedom — its output on every superposition of them." },
      { description: "That forced output (an entangled state, as the earlier problems in this set compute directly) never matches what correct cloning of the superposition would require, so the device fails exactly where it matters." },
    ],
    finalAnswer:
      "Testing only |0⟩ and |1⟩ checks nothing about the device's real job (cloning an unknown, arbitrary state); linearity means that behavior is already enough to guarantee failure on superpositions, which is precisely what the proof demonstrates.",
  },
  explanation: {
    correctIdea:
      "A device's job is to clone states nobody has told it in advance, and linearity removes any freedom to \"patch\" its behavior on superpositions after fixing its behavior on the basis states.",
    whyCorrect:
      "The no-cloning proof's entire force comes from combining \"must work for an arbitrary unknown input\" with \"must be linear\" — drop either requirement and cloning becomes possible (e.g., a device that first measures a known classical bit and republishes it isn't bound by this argument).",
    whyWrong: [
      "\"Classical states are the only real ones\" begs the question: a cloner is only useful precisely because quantum states can be genuinely unknown superpositions, not classical bits in disguise.",
    ],
  },
};
