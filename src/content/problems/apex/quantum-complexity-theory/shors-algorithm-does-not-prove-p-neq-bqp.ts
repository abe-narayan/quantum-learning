import type { ConceptualProblem } from "@/lib/problems/types";

export const shorsAlgorithmDoesNotProvePNeqBqp: ConceptualProblem = {
  meta: {
    slug: "shors-algorithm-does-not-prove-p-neq-bqp",
    title: "Why Shor's Algorithm Does Not Prove P ≠ BQP",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp",
    difficulty: "advanced",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["complexity-theory", "bqp", "shors-algorithm", "np-completeness"],
    prerequisites: ["apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Shor's algorithm places integer factoring in BQP, and no classical polynomial-time factoring algorithm is known. Explain precisely why this does NOT constitute a proof that P != BQP, identifying the two separate facts such a proof would additionally require.",
    placeholder:
      "Think about what kind of complexity class factoring actually belongs to, and what 'no known classical algorithm' would need to become in order to prove anything unconditional...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      [
        "not np-complete",
        "not known to be np-complete",
        "np intersect conp",
        "np ∩ conp",
        "np and conp",
        "easier than np-complete",
      ],
      [
        "unproven",
        "not proven",
        "conjecture",
        "widely believed but not proven",
        "no proof that factoring is classically hard",
        "assumption",
      ],
      [
        "unconditional",
        "lower bound",
        "prove factoring is not in p",
        "no classical polynomial-time algorithm has been proven impossible",
        "nobody has proven",
      ],
    ],
    incorrectFeedback:
      "A proof of P != BQP from Shor's algorithm would need two separate things nobody has: (1) an unconditional proof that factoring has no classical polynomial-time algorithm (currently just a widely-believed, unproven conjecture -- the RSA security assumption), and (2) even setting that aside, factoring is not known to be NP-complete (it sits in NP intersect coNP, believed strictly easier), so a hardness result about factoring specifically wouldn't generalize to NP-complete problems anyway. All that's unconditionally proven is: factoring is in BQP, and no classical polynomial algorithm for it is currently known.",
    partialFeedback:
      "You have part of the picture -- make sure you name both missing pieces: the unproven classical-hardness assumption AND the fact that factoring isn't known to be NP-complete.",
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
          "A proof of $\\mathsf{P}\\neq\\mathsf{BQP}$ via factoring would need factoring $\\notin\\mathsf{P}$ proven unconditionally. This is not proven -- it is the RSA security conjecture, believed but unproven.",
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
      "Shor's algorithm proves factoring is in BQP, but proving P != BQP would additionally require an unconditional proof that factoring has no classical polynomial-time algorithm (currently just a widely-believed, unproven conjecture), and factoring is not even known to be NP-complete (it's in NP ∩ coNP, believed strictly easier) -- so neither piece needed for an unconditional separation theorem exists.",
  },
  explanation: {
    correctIdea:
      "Shor's algorithm is a real, unconditional theorem about where factoring sits (in BQP), but the popular leap to 'quantum computers are proven more powerful' skips over two separate unproven claims.",
    whyCorrect:
      "Distinguishing 'proven theorem' from 'strong conditional evidence resting on an unproven, widely-believed assumption' is exactly the precision complexity theory is built to provide, and exactly the mistake this lesson's mandated Callout warns against.",
    whyWrong: [
      "Assuming 'no known classical algorithm' is the same as 'no classical algorithm exists' collapses a historical fact (decades of failed attempts) into an unconditional lower bound, which is a categorically different, much stronger kind of statement.",
      "Assuming factoring's hardness would settle P vs. BQP in general: even a proof of factoring's classical hardness would only witness one specific problem separating the classes, and would say nothing about NP-complete problems since factoring isn't known to be NP-complete.",
    ],
  },
};
