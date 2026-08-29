import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const evaluatingAWorstCaseNpCompleteClaimMc: MultipleChoiceProblem = {
  meta: {
    slug: "evaluating-a-worst-case-np-complete-claim-mc",
    title: "Evaluating a Worst-Case NP-Complete Speedup Claim",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["complexity-theory", "np", "bqp", "quantum-advantage-claims"],
    prerequisites: ["apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "A press release claims: 'Our quantum computer solved a general, worst-case instance of an NP-complete problem exponentially faster than every known classical algorithm, with no restriction to a special-structure sub-case, and we have a correctness proof.' Which is the most precise complexity-theoretic assessment?",
    options: [
      {
        id: "a",
        text: "If true as stated, this would be direct evidence toward NP ⊆ BQP, an open question widely believed false. That is precisely why the claim needs scrutiny of the instance class, the proof, and what 'every known classical algorithm' covers.",
      },
      {
        id: "b",
        text: "This is unremarkable: Shor's algorithm already put an NP-complete problem in BQP, so NP ⊆ BQP is settled and another demonstration adds nothing new.",
      },
      {
        id: "c",
        text: "This must be a hoax and can be dismissed without examining any details, because BQP ⊆ NP is a proven theorem, and a proven theorem means no problem in NP could ever be solved by a quantum computer.",
      },
      {
        id: "d",
        text: "This can be dismissed immediately as false because BBBV's Omega(sqrt(N)) lower bound already proves NP is not a subset of BQP unconditionally, in the fully general, non-black-box setting.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Shor's algorithm proved factoring is in BQP, not that NP ⊆ BQP. Factoring is not known to be NP-complete (it sits in NP ∩ coNP, believed strictly easier), so it establishes nothing about NP-complete problems in general.",
      c: "BQP ⊆ NP is not a proven theorem -- it is one of the genuinely open questions this lesson identifies. It is also not true that quantum computers can't solve NP problems at all: P ⊆ NP and P ⊆ BQP already guarantee overlap, since every P problem is in both.",
      d: "BBBV's lower bound is specific to unstructured black-box search and is a query-complexity result relative to an oracle. It says nothing unconditional about explicitly-given, structured NP-complete instances in the general (non-black-box) setting, so it cannot be used to dismiss this claim outright.",
    },
    defaultIncorrectFeedback:
      "Recall the lesson's central distinction: NP ⊆ BQP, BQP ⊆ NP, and P = BQP are all open. A worst-case, general, provable exponential quantum speedup on an NP-complete problem would bear directly on the first of these -- which is exactly why such a claim needs to be checked very carefully rather than taken at face value in either direction.",
  },
  hints: [
    { text: "Ask which of this lesson's three open questions a genuine worst-case, general NP-complete speedup would bear on." },
    { text: "Neither 'Shor's algorithm already proved this' nor 'a known theorem already forbids this' is accurate -- check what Shor's algorithm and BBBV actually establish." },
    { text: "The correct answer should treat the claim as extraordinary but not impossible, and prescribe scrutiny rather than automatic acceptance or automatic dismissal." },
  ],
  solution: {
    steps: [
      { description: "A worst-case, fully general, provable exponential quantum speedup on an NP-complete problem would be direct evidence toward NP ⊆ BQP." },
      { description: "NP ⊆ BQP is open and widely believed false (on BBBV/Grover-style black-box evidence), so a genuine result of this shape would be a landmark, field-shaking result." },
      { description: "Because the implication is enormous and the field has failed to find such an algorithm for decades, the claim -- not proven impossible, but astronomically unlikely on current evidence -- calls for very careful scrutiny of exactly what was proven, rather than either dismissal or uncritical acceptance." },
    ],
    finalAnswer: "It would be direct evidence toward NP ⊆ BQP, an open and widely disbelieved question, so the claim warrants scrutiny proportional to that implication.",
  },
  explanation: {
    correctIdea:
      "Precise complexity-theoretic language turns a vague 'quantum advantage' claim into something checkable: this specific claim, if true as stated, would resolve an open, widely-disbelieved question, which is exactly why it warrants intense scrutiny rather than a flat yes-or-no reaction.",
    whyCorrect:
      "Naming the open question at stake (NP ⊆ BQP), stating the current belief (widely disbelieved but not proven false), and prescribing scrutiny proportional to the claim's implications is the habit this lesson's 'why this matters' section names as the payoff of precise complexity theory.",
    whyWrong: [
      { optionId: "b", text: "Misattributes NP ⊆ BQP to Shor's algorithm, which only places factoring (not known to be NP-complete) in BQP." },
      { optionId: "c", text: "Misstates BQP ⊆ NP as proven when it is open, then draws an absurd conclusion from it: P ⊆ NP and P ⊆ BQP already guarantee some overlap regardless." },
      { optionId: "d", text: "Applies BBBV's black-box query lower bound as if it were an unconditional, structure-independent theorem, which the prerequisite lesson's relativization discussion warns against." },
    ],
  },
};
