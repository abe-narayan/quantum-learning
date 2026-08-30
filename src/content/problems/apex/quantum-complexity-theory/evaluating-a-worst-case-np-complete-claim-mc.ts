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
        text: "If true as stated it would be evidence toward NP ⊆ BQP, an open question widely believed false, so the instance class and the proof need scrutiny",
      },
      {
        id: "b",
        text: "Nothing new here: Shor's algorithm already placed an NP-complete problem inside BQP, so NP ⊆ BQP has been settled since 1994 and needs no rechecking",
      },
      {
        id: "c",
        text: "The claim collapses NP into P as a side effect, since anything a quantum computer solves efficiently is efficiently solvable classically too",
      },
      {
        id: "d",
        text: "BBBV's Ω(√N) lower bound already rules it out, since that bound proves NP is not contained in BQP in the general setting for explicit instances",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Shor's algorithm proved factoring is in BQP, not that NP ⊆ BQP. Factoring is not known to be NP-complete (it sits in NP ∩ coNP, believed strictly easier), so it establishes nothing about NP-complete problems in general.",
      c: "Reads 'efficient' as one thing when it is two. BQP is efficiency on a quantum machine and P is efficiency on a classical one, and whether the two coincide is the open P = BQP question. A quantum polynomial-time algorithm for an NP-complete problem would give NP ⊆ BQP; it would collapse NP into P only if P = BQP were also true.",
      d: "BBBV is a query-complexity bound about unstructured black-box search, proved relative to an oracle. It constrains algorithms that can only probe the instance through queries, and says nothing about an algorithm handed an explicit, structured formula to exploit.",
    },
    defaultIncorrectFeedback:
      "Recall the lesson's central distinction: NP ⊆ BQP, BQP ⊆ NP, and P = BQP are all open. A worst-case, general, provable exponential quantum speedup on an NP-complete problem would bear directly on the first of these, which is why such a claim needs careful checking rather than acceptance or dismissal at face value.",
  },
  hints: [
    { text: "Ask which of this lesson's three open questions a genuine worst-case, general NP-complete speedup would bear on." },
    { text: "Neither 'Shor's algorithm already proved this' nor 'a known theorem already forbids this' is accurate. Check what Shor's algorithm and BBBV establish." },
    { text: "The correct answer should treat the claim as extraordinary but not impossible, and prescribe scrutiny rather than automatic acceptance or automatic dismissal." },
  ],
  solution: {
    steps: [
      { description: "A worst-case, fully general, provable exponential quantum speedup on an NP-complete problem would be direct evidence toward NP ⊆ BQP." },
      { description: "NP ⊆ BQP is open and widely believed false (on BBBV/Grover-style black-box evidence), so a genuine result of this shape would be a landmark, field-shaking result." },
      { description: "Because the implication is enormous and the field has failed to find such an algorithm for decades, the claim is not proven impossible but is highly unlikely on current evidence. It calls for careful scrutiny of what was proven, rather than either dismissal or uncritical acceptance." },
    ],
    finalAnswer: "It would be direct evidence toward NP ⊆ BQP, an open and widely disbelieved question, so the claim warrants scrutiny proportional to that implication.",
  },
  explanation: {
    correctIdea:
      "Precise complexity-theoretic language turns a vague 'quantum advantage' claim into something checkable. This claim, if true as stated, would resolve an open and widely disbelieved question, which is why it warrants intense scrutiny rather than a flat yes-or-no reaction.",
    whyCorrect:
      "Naming the open question at stake (NP ⊆ BQP), stating the current belief (widely disbelieved but not proven false), and prescribing scrutiny proportional to the claim's implications is the habit this lesson's 'why this matters' section names as the payoff of precise complexity theory.",
    whyWrong: [
      { optionId: "b", text: "Misattributes NP ⊆ BQP to Shor's algorithm, which only places factoring (not known to be NP-complete) in BQP." },
      { optionId: "c", text: "Treats quantum-efficient and classically-efficient as one notion. NP ⊆ BQP would follow; NP ⊆ P would follow only with P = BQP, which is itself open." },
      { optionId: "d", text: "Applies BBBV's black-box query lower bound as if it were an unconditional, structure-independent theorem, which the prerequisite lesson's relativization discussion warns against." },
    ],
  },
};
