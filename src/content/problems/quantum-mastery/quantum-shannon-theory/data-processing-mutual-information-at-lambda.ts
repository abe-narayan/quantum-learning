import type { NumericProblem } from "@/lib/problems/types";

export const dataProcessingMutualInformationAtLambda: NumericProblem = {
  meta: {
    slug: "data-processing-mutual-information-at-lambda",
    title: "Mutual Information After Dephasing at lambda=0.6",
    course: "quantum-shannon-theory",
    lesson: "quantum-mastery/quantum-shannon-theory/the-data-processing-inequality",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["data-processing-inequality", "mutual-information", "dephasing-channel"],
    prerequisites: ["quantum-mastery/quantum-shannon-theory/the-data-processing-inequality"],
  },
  question: {
    type: "numeric",
    prompt:
      "The lesson derived I(A:B') = 2 - S(AB')(lambda) for a Bell pair with qubit B dephased at strength lambda, where S(AB')(lambda) is the binary entropy of lambda/2: S(AB') = -(1-lambda/2)log2(1-lambda/2) - (lambda/2)log2(lambda/2). Compute I(A:B') at lambda=0.6, in bits.",
    inputHint: "bits, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 1.118709,
    tolerance: 0.002,
    incorrectFeedback:
      "First compute S(AB') as the binary entropy of p=lambda/2=0.3: -0.7*log2(0.7) - 0.3*log2(0.3). Then subtract that from 2.",
  },
  hints: [
    { text: "At lambda=0.6, the outer block's eigenvalues are 1-lambda/2=0.7 and lambda/2=0.3 (the two zero eigenvalues from the empty middle block contribute nothing)." },
    { text: "S(AB') is exactly the binary entropy h(0.3) = -0.7 log2(0.7) - 0.3 log2(0.3)." },
    { text: "I(A:B') = 2 - h(0.3), and both marginals stay maximally mixed (S_A=S_B=1 bit) for every lambda, so the '2' never changes." },
  ],
  solution: {
    steps: [
      { description: "The dephased Bell state's joint spectrum is {1-lambda/2, lambda/2, 0, 0} = {0.7, 0.3, 0, 0} at lambda=0.6." },
      { description: "$S(AB') = -0.7\\log_2(0.7) - 0.3\\log_2(0.3) \\approx 0.360265 + 0.521089$" },
      { description: "$S(AB') \\approx 0.881291$ bits, so $I(A:B') = S_A+S_B-S(AB') = 1+1-0.881291$" },
    ],
    finalAnswer: "I(A:B') ≈ 1.118709 bits.",
  },
  explanation: {
    correctIdea:
      "Once S(AB') is known from the two nonzero eigenvalues of the outer block, mutual information is immediate: I(A:B')=S_A+S_B-S(AB'), and dephasing never touches either single-qubit marginal, so S_A=S_B=1 bit stays fixed at every lambda.",
    whyCorrect:
      "This matches the lesson's fully worked closed form I(A:B')=2-h(lambda/2), and the resulting value (~1.119 bits) sits strictly between the lesson's printed lambda=0.4 (1.278 bits) and lambda=0.8 (1.029 bits) table entries, confirming the monotonic decrease the data-processing inequality demands.",
    whyWrong: [
      "Using the diagonal entries (0.5, 0.5) as if they were the joint state's eigenvalues instead of diagonalizing the outer block gives S(AB')=1 for every lambda, which is only correct in the fully-dephased limit lambda=1, not at lambda=0.6.",
    ],
  },
};
