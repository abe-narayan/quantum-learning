import type { NumericProblem } from "@/lib/problems/types";

const value = Math.sqrt(2 / 3);

export const cgCoefficientValue: NumericProblem = {
  meta: {
    slug: "cg-coefficient-value",
    title: "Reading a Clebsch-Gordan Coefficient Off the l=1⊗s=1/2 Table",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/clebsch-gordan-coefficients-and-the-wigner-eckart-theorem",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["clebsch-gordan", "angular-momentum"],
    prerequisites: [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/clebsch-gordan-coefficients-and-the-wigner-eckart-theorem",
    ],
  },
  question: {
    type: "numeric",
    prompt:
      "From the lesson's l=1⊗s=1/2 table, |3/2,−1/2⟩ = √(2/3)|1,0⟩|1/2,−1/2⟩ + √(1/3)|1,−1⟩|1/2,1/2⟩. What is the numeric value of the Clebsch-Gordan coefficient ⟨1,0;1/2,−1/2|3/2,−1/2⟩?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "Read off the coefficient multiplying the |1,0⟩|1/2,−1/2⟩ term, then evaluate √(2/3) as a decimal. If you entered the smaller √(1/3), you read the neighboring term's coefficient.",
    nearMisses: [
      { value: Math.sqrt(1 / 3), tolerance: 0.002, feedback: "That is the other term's coefficient, multiplying |1,−1⟩|1/2,1/2⟩. The question asks for the |1,0⟩|1/2,−1/2⟩ one." },
      { value: 2 / 3, tolerance: 0.002, feedback: "2/3 is the squared coefficient, the probability weight. The Clebsch-Gordan coefficient itself is its square root." },
    ],
  },
  hints: [
    { text: "The coefficient is stated directly in the table: it's the coefficient multiplying |1,0⟩|1/2,−1/2⟩ in the |3/2,−1/2⟩ expansion." },
    { text: "Evaluate √(2/3) as a decimal. It should come out larger than the other term's coefficient, since 2/3 outweighs 1/3." },
  ],
  solution: {
    steps: [{ description: "⟨1,0;1/2,−1/2|3/2,−1/2⟩ = √(2/3) ≈ 0.8165, read directly from the lesson's derived and verified coupled-state expansion." }],
    finalAnswer: "≈0.8165",
  },
  explanation: {
    correctIdea: "This coefficient was verified two independent ways in the lesson: by the ladder-operator recursion by hand, and by checking the resulting state is an exact J² and Jz eigenstate using the platform's own angular-momentum operators.",
  },
};
