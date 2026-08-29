import { Complex } from "@/lib/quantum/complex";
import { tensorProduct, exchangeParticles } from "@/lib/quantum/identicalParticles";
import type { NumericProblem } from "@/lib/problems/types";

const e0 = [new Complex(1), new Complex(0), new Complex(0)];
const e1 = [new Complex(0), new Complex(1), new Complex(0)];
const product = tensorProduct(e0, e1);
const swapped = exchangeParticles(product, 3, 3);
const value = Math.sqrt(product.reduce((sum, c, i) => sum + c.sub(swapped[i]).magnitudeSquared(), 0));

export const productStateNotEigenstate: NumericProblem = {
  meta: {
    slug: "product-state-not-eigenstate",
    title: "How Different Is a Product State From Its Own Exchange?",
    course: "identical-particles",
    lesson: "quantum-mechanics/identical-particles/indistinguishability",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["exchange-operator"],
    prerequisites: ["quantum-mechanics/identical-particles/indistinguishability"],
  },
  question: {
    type: "numeric",
    prompt: "For the plain product |0⟩⊗|1⟩ (a 3-state single-particle basis), compute the distance ‖ψ − P₁₂ψ‖ between the state and its own exchange. Is this 0 (an eigenstate) or nonzero?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "P₁₂|0⟩⊗|1⟩ = |1⟩⊗|0⟩, a completely different basis vector from |0⟩⊗|1⟩ — compute the norm of their difference.",
    nearMisses: [
      { value: 0, feedback: "Zero would mean the exchange left the state alone, making it an eigenstate. Swapping the two particles here produces a different basis vector entirely." },
      { value: 2, feedback: "2 is the squared distance. The norm takes the square root of the sum of squared components." },
      { value: 1, feedback: "Each of the two vectors contributes a component of magnitude 1 in a different slot, so the squared distance is 1² + 1², not 1." },
    ],
  },
  hints: [
    { text: "|0⟩⊗|1⟩ has a 1 in the '(particle1=0, particle2=1)' slot; its exchange has a 1 in the '(particle1=1, particle2=0)' slot instead." },
    { text: "These are two different standard basis vectors, orthogonal to each other." },
    { text: "The distance between two orthonormal vectors is √2." },
  ],
  solution: {
    steps: [{ description: "|0⟩⊗|1⟩ and P₁₂(|0⟩⊗|1⟩)=|1⟩⊗|0⟩ are orthogonal unit vectors, so ‖ψ−P₁₂ψ‖=√(1²+1²)=√2≈1.414." }],
    finalAnswer: "√2 ≈ 1.414",
  },
  explanation: {
    correctIdea: "A nonzero distance directly confirms the product state is NOT an exchange eigenstate — exactly the lesson's central claim, checked numerically rather than just asserted.",
    whyCorrect: "Matches exchangeParticles applied to tensorProduct(e0,e1) in the engine.",
    whyWrong: ["A result of 0 here would mean the product state IS an eigenstate, contradicting the lesson's worked example — it would indicate either e0=e1 or a real bug."],
  },
};
