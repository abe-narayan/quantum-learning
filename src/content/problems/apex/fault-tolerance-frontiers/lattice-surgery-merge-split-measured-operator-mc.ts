import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const latticeSurgeryMergeSplitMeasuredOperatorMc: MultipleChoiceProblem = {
  meta: {
    slug: "lattice-surgery-merge-split-measured-operator-mc",
    title: "What a Rough-Boundary Merge and Split Measured",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/lattice-surgery",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "multiple-choice",
    tags: ["lattice-surgery", "surface-codes", "logical-measurement", "measurement-back-action"],
    prerequisites: ["apex/fault-tolerance-frontiers/lattice-surgery"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "Patch L1 is prepared in |+⟩_L and patch L2 in |0⟩_L, placed side by side so that L1's right rough edge faces L2's left rough edge. Bridge qubits are added across the gap, the new seam vertex stabilizers they create are measured for d rounds, and then the patches are split apart again. The seam readout comes back as m = -1. Which statement names both the logical operator this merge and split measured and what m = -1 established?",
    options: [
      {
        id: "a",
        text: "The joint operator $Z_{L_1}Z_{L_2}$. Outcome $m=-1$ pins the two patches' $Z$-parity to odd, and the projection takes L1 out of the $X$-definite superposition it started in.",
      },
      {
        id: "b",
        text: "The joint operator $Z_{L_1}Z_{L_2}$. Outcome $m=-1$ pins the two patches' $Z$-parity to odd, and since the seam turned on $Z$-type checks, L1's $X$-definite superposition survives intact.",
      },
      {
        id: "c",
        text: "The two operators $Z_{L_1}$ and $Z_{L_2}$ separately. Outcome $m=-1$ reports that their individual eigenvalues came out opposite, so each patch's own $Z$ value is now on record.",
      },
      {
        id: "d",
        text: "The joint operator $X_{L_1}X_{L_2}$. Outcome $m=-1$ pins the two patches' $X$-parity to odd, because the checks a shared boundary turns on are the face stabilizers of $X$ type.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "The operator is right and the back-action is not. $|+\rangle_L$ is not an eigenstate of $Z_{L_1}Z_{L_2}$, so the merge cannot leave it where it was: the joint state splits into two computational-basis branches and the reported outcome selects one of them. The rule is not 'Z-type checks leave X-type information alone'; it is that a measurement disturbs whatever the state was not already an eigenstate of.",
      c: "This is the reading the lesson warns against by name. The seam generators multiply together into the product of the two patches' logical Z operators, and the product is the only thing whose value the syndrome fixes. Each patch's individual Z eigenvalue is left undetermined, the same way measuring $Z\\otimes Z$ on two bare qubits records a parity without recording either bit.",
      d: "Boundary type decides which logical operator a merge reads, but not in the direction this option assumes. These patches face each other along their rough edges, where the truncated stabilizers are the face ($X$-type) ones and each patch's logical $X$ string terminates. The gap column between two rough edges carries new vertex ($Z$-type) sites, so the generators the merge switches on are $Z$-type and their product is $Z_{L_1}Z_{L_2}$. A smooth-boundary merge is the one that measures the product of the two logical $X$ operators.",
    },
    defaultIncorrectFeedback:
      "Two things have to come out right at once here: which logical operator the seam generators multiply into, which is decided by the boundary type being bridged, and what a projective measurement does to a state that was not already an eigenstate of that operator.",
  },
  hints: [
    { text: "Which stabilizer type the seam turns on depends on which boundary the gap runs along. These patches meet along the edges where each one's logical X string terminates, and the merge measures the logical that runs parallel to the seam, not the one that ends on it." },
    { text: "Write |+⟩_L |0⟩_L out in the two patches' computational basis, then ask which of its terms the operator you just named is an eigenvector of." },
    { text: "Two of the four readings agree on the operator and disagree about what happened to L1. Settle that half by asking what a projective measurement does to a state that is not already an eigenstate of the measured operator." },
  ],
  solution: {
    steps: [
      {
        description:
          "The patches face each other along rough boundaries, where the face ($X$-type) generators are the truncated ones. Growing a patch's own truncated generator across the gap would add no independent generator and so would measure nothing; what the merge actually switches on are the $b+1$ generators at the **new** stabilizer sites in the gap column, and between two rough edges those sites are vertex ($Z$-type) ones. Their product cancels on every bridge qubit and leaves $Z$ on each patch's seam-side column, each a valid logical-$Z$ representative, so the product equals $Z_{L_1}Z_{L_2}$ up to the stabilizer group. Measuring the seam is therefore a projective measurement of $Z_{L_1}Z_{L_2}$, not of either patch's $Z$ alone.",
      },
      {
        description:
          "Expand the input: $|+\\rangle_{L_1}|0\\rangle_{L_2}=\\tfrac{1}{\\sqrt2}\\big(|0\\rangle_{L_1}|0\\rangle_{L_2}+|1\\rangle_{L_1}|0\\rangle_{L_2}\\big)$. The two terms carry $Z_{L_1}Z_{L_2}$ eigenvalues $+1$ and $-1$, so the state is a superposition of both outcomes and each occurs with probability $1/2$.",
      },
      {
        description:
          "Outcome $m=-1$ projects onto the second term, leaving $|1\\rangle_{L_1}|0\\rangle_{L_2}$. The parity is now fixed at odd, and L1 sits in a definite $Z$ eigenstate: the $X_{L_1}$-definite superposition it started in is gone. That is the lesson's Case 2, run with the other outcome.",
      },
      {
        description:
          "The split then reintroduces each patch's own boundary stabilizers. It restores two logical qubits whose $Z$ product is the value the merge fixed; it does not restore the superposition the merge destroyed, and it never reveals either patch's $Z$ value on its own.",
      },
    ],
    finalAnswer:
      "$Z_{L_1}Z_{L_2}$ was measured, and $m=-1$ fixes the two patches' Z-parity to odd. Neither individual Z value is revealed, and L1's X-definite superposition does not survive the projection.",
  },
  explanation: {
    correctIdea:
      "A merge along rough boundaries is a projective measurement of the product of the two patches' logical Z operators, with the ordinary back-action any projective measurement has: the product becomes definite and anything conjugate to it does not survive.",
    whyCorrect:
      "$Z_{L_1}Z_{L_2}$ commutes with every stabilizer of both patches, so measuring it keeps the code space intact, but it anticommutes with $X_{L_1}$, so an $X_{L_1}$-definite state cannot also be a $Z_{L_1}Z_{L_2}$ eigenstate. Something has to give, and it is the superposition: the joint parity becomes known, and L1's own X value stops being defined, exactly as $Z\\otimes Z$ on two bare qubits behaves.",
    whyWrong: [
      "Reading 'the seam checks are Z-type' as 'nothing about X is touched'. Which operators a measurement disturbs is decided by what fails to commute with it, not by which Pauli letter the checks are written in.",
      "Expecting a joint parity measurement to hand back both individual values. The seam generators multiply into the product and only the product; that is what makes the merge a two-qubit logical measurement rather than two single-qubit readouts.",
      "Pairing the wrong boundary with the wrong logical operator. Smooth boundaries terminate the logical Z strings and carry truncated vertex generators; rough boundaries terminate the logical X strings and carry truncated face generators. That much is right, but the merge measures the logical that runs *parallel* to the seam, not the one that terminates on it: a seam along the rough edges is crossed by the X strings and paralleled by the Z strings, so it is $Z_{L_1}Z_{L_2}$ that becomes a stabilizer.",
    ],
  },
};
