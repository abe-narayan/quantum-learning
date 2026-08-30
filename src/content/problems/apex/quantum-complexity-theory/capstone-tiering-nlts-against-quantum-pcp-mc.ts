import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const capstoneTieringNltsAgainstQuantumPcpMc: MultipleChoiceProblem = {
  meta: {
    slug: "capstone-tiering-nlts-against-quantum-pcp-mc",
    title: "Tiering NLTS Against the Quantum PCP Conjecture",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/capstone-what-we-know-and-dont",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "multiple-choice",
    tags: ["complexity-theory", "quantum-pcp", "nlts", "claim-evaluation", "proven-vs-conjectured"],
    prerequisites: ["apex/quantum-complexity-theory/capstone-what-we-know-and-dont"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "Before 2022, the quantum PCP conjecture sat in this capstone's open tier, and the NLTS conjecture (that some local Hamiltonian family has no low-energy state reachable by a constant-depth circuit) was an unproven necessary consequence of it. Anshu, Breuckmann and Nirkhe then proved NLTS, for the Hamiltonians built from constant-rate, linear-distance quantum LDPC codes. Where do the two claims sit afterwards?",
    options: [
      {
        id: "a",
        text: "NLTS moves to the proven tier and stays there; quantum PCP stays open, since proving a necessary consequence closes one route to failure without establishing the conjecture.",
      },
      {
        id: "b",
        text: "Both move to the proven tier, since NLTS was the piece of the conjecture nobody could reach, and a conjecture whose hardest known consequence has been proved is proved with it.",
      },
      {
        id: "c",
        text: "NLTS moves to the proven tier and quantum PCP moves to the evidenced tier, since a proved necessary consequence is exactly the specific, namable evidence the middle tier asks for.",
      },
      {
        id: "d",
        text: "NLTS belongs in the evidenced tier and quantum PCP stays open, since NLTS was established only for Hamiltonians built from one code family rather than for every local Hamiltonian.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This reads a necessary consequence as a sufficient one. If quantum PCP is true then NLTS follows; the implication does not run backwards, so proving NLTS leaves every route by which quantum PCP could still be false untouched except the one that ran through NLTS being false.",
      c: "The tempting half is right: the field did learn something specific and namable. The middle tier asks for more than that. It asks that essentially the whole field believe the claim on the strength of that evidence, and quantum PCP has no consensus in either direction, which is what keeps it in the open tier rather than promoting it.",
      d: "Scope is not a tier. A theorem proved for one family of Hamiltonians is a theorem about that family, permanently, and NLTS was stated as an existence claim, so exhibiting one family settles it. Restricting where a proof applies changes what the theorem says, not how well established it is.",
    },
    defaultIncorrectFeedback:
      "Two independent judgments are needed here, and mixing them up is the usual error: whether each claim now has a complete proof, and, for the one that does not, whether the field has a consensus belief backed by namable evidence. A result can move one of those and leave the other exactly where it was.",
  },
  hints: [
    { text: "The two claims are not on the same footing after 2022. Ask of each separately whether a complete proof now exists, before asking anything about confidence." },
    { text: "Write the logical relationship down in one direction: quantum PCP implies NLTS. Then ask what proving the second half of an implication tells you about the first half." },
    { text: "The middle tier has an entry requirement beyond 'there is evidence for it': it also asks what the field collectively believes. Check quantum PCP against that requirement specifically." },
  ],
  solution: {
    steps: [
      {
        description:
          "Fix the logic first. If quantum PCP holds (with $\\mathsf{QMA}\\neq\\mathsf{NP}$), then some local Hamiltonian family must have no low-energy state preparable by a constant-depth circuit, because a classical description of such a circuit would serve as an NP witness for the energy estimate and the hardness would collapse. So quantum PCP implies NLTS, and not the other way round.",
      },
      {
        description:
          "Anshu, Breuckmann and Nirkhe proved NLTS in 2022 by exhibiting such a family, built from constant-rate, linear-distance quantum LDPC codes. NLTS is an existence statement, so one family settles it: NLTS is a proven theorem and will stay one whatever happens to quantum PCP.",
      },
      {
        description:
          "Quantum PCP does not move. Proving a necessary consequence removes one way the conjecture could have died, which is real progress and is not a proof. The capstone's middle tier additionally asks for a claim essentially the whole field believes on namable evidence, and quantum PCP has no consensus either way, so it stays in the open tier rather than being promoted.",
      },
      {
        description:
          "The practical reading the capstone asks for: a headline saying 'major step toward quantum PCP' is accurate, and one saying 'quantum PCP nearly proven' is not. One claim changed tier permanently; the other did not change tier at all.",
      },
    ],
    finalAnswer:
      "NLTS is now a proven theorem and stays one. Quantum PCP stays in the open tier: a proved necessary consequence rules out one way it could have failed, and neither proves it nor creates the consensus belief the middle tier requires.",
  },
  explanation: {
    correctIdea:
      "Tiering is done claim by claim, not headline by headline. A single paper can move one statement from open to proven and leave the statement it was a consequence of exactly where it was.",
    whyCorrect:
      "The implication runs from quantum PCP to NLTS, so establishing NLTS falsifies nothing and verifies nothing about the antecedent; it only eliminates the possibility that quantum PCP dies by NLTS being false. Meanwhile NLTS's own status is settled for good, because a proof of an existence claim is not weakened by the specificity of the object exhibited.",
    whyWrong: [
      "Running an implication backwards. Proving a consequence is compatible with the conjecture being false, which is the whole reason a consequence is a weaker statement than the conjecture that entails it.",
      "Promoting an open question on the strength of a related theorem. The middle tier is defined by near-universal belief supported by evidence, and a question the field has no collective opinion about fails that test however interesting the surrounding progress is.",
      "Demoting a theorem because its hypotheses are specific. Every theorem has hypotheses; naming them describes the theorem's reach and says nothing about how well established it is.",
    ],
  },
};
