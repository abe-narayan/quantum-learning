import type { ConceptualProblem } from "@/lib/problems/types";

export const shorsAlgorithmDoesNotProvePNeqBqp: ConceptualProblem = {
  meta: {
    slug: "shors-algorithm-does-not-prove-p-neq-bqp",
    title: "Why Shor's Algorithm Does Not Prove P ≠ BQP",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["complexity-theory", "bqp", "shors-algorithm", "np-completeness"],
    prerequisites: ["apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Shor's algorithm places integer factoring in BQP, and no classical polynomial-time factoring algorithm is known. Explain precisely why this does not constitute a proof that P != BQP, identifying the two separate facts such a proof would additionally require.",
    placeholder:
      "Think about what kind of complexity class factoring actually belongs to, and what 'no known classical algorithm' would need to become in order to prove anything unconditional...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: [
          "not np-complete",
          "not known to be np-complete",
          "np intersect conp",
          "np ∩ conp",
          "np and conp",
          "easier than np-complete",
          "np-intermediate",
          "believed easier",
        ],
        missingFeedback:
          "The missing mathematical claim is covered. The second gap is about placement: even a full account of factoring's classical difficulty would only be an account of factoring. Say where that problem sits relative to the hardest problems in NP, and why that placement blocks the generalisation.",
      },
      {
        phrases: ["unproven", "not proven", "conjecture", "widely believed", "assumption", "believed hard", "assumed hard"],
        missingFeedback:
          "You have located factoring in the class landscape. Now be honest about the other leg: what is the actual status of 'nobody has found a fast classical method', as a claim?",
      },
      {
        phrases: ["unconditional", "lower bound", "circuit lower bound", "prove factoring is not in p", "no classical polynomial-time algorithm", "rule out a classical polynomial-time algorithm", "open problem"],
        missingFeedback:
          "You have said which parts rest on belief. Say what kind of result would have to replace them, and note that nobody has it.",
      },
    ],
    incorrectFeedback:
      "Two separate gaps get skipped here, and both are easy to miss because the algorithm really is a landmark. The first confuses 'nobody has found a fast classical method' with 'no fast classical method exists'. One is a fact about the last fifty years of effort; the other is a mathematical claim that has never been established. The second gap is about placement: factoring is widely thought to be easier than the hardest problems in NP, so even closing the first gap would say nothing about those.",
    partialFeedback:
      "Half of it is there. There are two separate gaps, not one: the missing mathematical claim about classical difficulty, and the question of where factoring sits relative to the hardest problems in NP. Name both.",
    modelAnswers: [
      "Shor puts factoring in BQP, but 'no known classical algorithm' is not a proof. That factoring is classically hard is a widely believed conjecture, not a theorem, and you would need an unconditional lower bound ruling out any classical polynomial-time algorithm to close it. Factoring also is not known to be NP-complete; it sits in NP intersect coNP and is believed easier.",
      "Two things are missing. First, factoring is not NP-complete, it lives in NP and coNP, so it is believed easier than the hard cases. Second, the claim that it has no classical polynomial-time algorithm is unproven; proving P != BQP would need an unconditional circuit lower bound, which is an open problem.",
    ],
  },
  hints: [
    {
      text: "A separation theorem P != BQP would require an unconditional lower bound: a proof that NO classical polynomial-time algorithm can solve some problem in BQP. Has that been proven for factoring?",
    },
    {
      text: "Separately, ask what class factoring actually belongs to among classical complexity classes. Is it known to be NP-complete, or something believed strictly easier?",
    },
    {
      text: "\"No known classical algorithm\" (a historical fact about what's been tried) and \"no classical algorithm exists\" (an unconditional lower bound) are different claims. Which one does Shor's algorithm's significance rest on?",
    },
  ],
  solution: {
    steps: [
      {
        description:
          "Shor's algorithm unconditionally proves factoring is in BQP (a polynomial-size quantum circuit family solves it with bounded error).",
      },
      {
        description:
          "A proof of $\\mathsf{P}\\neq\\mathsf{BQP}$ via factoring would need factoring $\\notin\\mathsf{P}$ proven unconditionally. That has not been proven; it is the RSA security conjecture, believed but open.",
      },
      {
        description:
          "Even setting that aside, factoring is not known to be $\\mathsf{NP}$-complete: it sits in $\\mathsf{NP}\\cap\\mathsf{coNP}$, a class widely believed to be strictly easier than the $\\mathsf{NP}$-complete problems (since an $\\mathsf{NP}$-complete problem in $\\mathsf{coNP}$ would imply $\\mathsf{NP}=\\mathsf{coNP}$, itself believed false).",
      },
      {
        description:
          "So Shor's algorithm gives strong conditional evidence for $\\mathsf{P}\\neq\\mathsf{BQP}$, conditional on an unproven assumption, and says nothing directly about $\\mathsf{NP}$-complete problems at all.",
      },
    ],
    finalAnswer:
      "Shor's algorithm proves factoring is in BQP, but proving P != BQP would additionally require an unconditional proof that factoring has no classical polynomial-time algorithm (currently a widely believed, unproven conjecture). Factoring is also not known to be NP-complete; it sits in NP ∩ coNP, believed strictly easier. Neither piece needed for an unconditional separation theorem exists.",
  },
  explanation: {
    correctIdea:
      "Shor's algorithm is a real, unconditional theorem about where factoring sits (in BQP), but the popular leap to 'quantum computers are proven more powerful' skips over two separate unproven claims.",
    whyCorrect:
      "Distinguishing 'proven theorem' from 'strong conditional evidence resting on an unproven, widely believed assumption' is the precision complexity theory is built to provide, and collapsing the two is the mistake this lesson warns against.",
    whyWrong: [
      "Assuming 'no known classical algorithm' is the same as 'no classical algorithm exists' collapses a historical fact (decades of failed attempts) into an unconditional lower bound, which is a categorically different, much stronger kind of statement.",
      "Assuming factoring's hardness would settle P vs. BQP in general: even a proof of factoring's classical hardness would only witness one specific problem separating the classes, and would say nothing about NP-complete problems since factoring isn't known to be NP-complete.",
    ],
  },
};
