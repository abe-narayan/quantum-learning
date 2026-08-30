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
      "A friend argues: \"A cloning device only needs to copy |0⟩ and |1⟩ correctly, since those are the only 'real' classical states, so testing it on those two is enough to call it a working cloner.\" Explain what is wrong with this reasoning, addressing why handing the device an unknown qubit, rather than |0⟩ or |1⟩ alone, is what the no-cloning theorem's proof exploits.",
    placeholder: "A cloning device has to work on ANY input state, since...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["unknown", "arbitrary", "any state", "superposition"],
        missingFeedback:
          "Say what a cloning device is actually being asked to do. The friend's two test cases are not the job description.",
      },
      {
        phrases: ["linear", "linearity"],
        missingFeedback:
          "You have said the device must handle inputs nobody named in advance. Now name the property of quantum operations that removes any freedom to behave differently there.",
      },
      {
        phrases: ["forced", "determined", "contradiction", "fails", "breaks down"],
        missingFeedback:
          "You have named the property. Now finish it: say what that property does to the device's behaviour on a superposition, once its behaviour on the two basis states is pinned.",
      },
    ],
    incorrectFeedback:
      "You replied that a cloner 'should be tested on more states', which is true and stops short of the argument. Two moves finish it: say what a cloner is for, given that its input is not announced in advance, and then use the one property every quantum device has to show that its behaviour on the two basis inputs already settles everything else.",
    partialFeedback:
      "You're partway there. Join the two halves explicitly: the fact that the device is not told what it is copying, and the mathematical property every quantum operation has. Then say what the combination leaves the device free to do on a mixed input, and whether that is enough.",
    modelAnswers: [
      "A cloner's actual job is to copy an unknown, arbitrary state, not just the two basis states. Because the operation has to be linear, fixing its behaviour on |0> and |1> already determines what it does to any superposition, and what it is forced to do there is not a copy. That is exactly the contradiction the no-cloning proof exploits.",
      "Testing |0> and |1> tests nothing about the hard case. Linearity means the device's action on any state is already determined by its action on the basis states, so a superposition input makes it fail.",
    ],
  },
  hints: [
    { text: "A cloner is used precisely when nobody has told the device what state it is holding. Write down what that requires of the device." },
    { text: "Every physical quantum operation is a unitary. Name the mathematical property that gives it, in one word." },
    { text: "Fix the device's behaviour on the two basis inputs. That property now dictates its behaviour on every combination of them. Check whether the dictated behaviour is the copy you wanted." },
  ],
  solution: {
    steps: [
      { description: "A cloner's whole purpose is to work on a state that isn't known in advance; a device only tested on |0⟩ and |1⟩ hasn't been tested on the actual use case." },
      { description: "Because every physical quantum operation is linear, fixing a device's output on |0⟩ and |1⟩ already fixes, with no remaining freedom, its output on every superposition of them." },
      { description: "That forced output (an entangled state, as the earlier problems in this set compute directly) never matches what correct cloning of the superposition would require, so the device fails exactly where it matters." },
    ],
    finalAnswer:
      "Testing only |0⟩ and |1⟩ checks nothing about the device's real job (cloning an unknown, arbitrary state); linearity means that behavior is already enough to guarantee failure on superpositions, which is precisely what the proof demonstrates.",
  },
  explanation: {
    correctIdea:
      "A device's job is to clone states nobody has told it in advance, and linearity removes any freedom to \"patch\" its behavior on superpositions after fixing its behavior on the basis states.",
    whyCorrect:
      "The no-cloning proof's entire force comes from combining \"must work for an arbitrary unknown input\" with \"must be linear\". Drop either requirement and cloning becomes possible: a device that measures a known classical bit and republishes it is not bound by this argument.",
    whyWrong: [
      "\"Classical states are the only real ones\" begs the question: a cloner is useful only because quantum states can be genuinely unknown superpositions, not classical bits in disguise.",
    ],
  },
};
