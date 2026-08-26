import { Complex } from "@/lib/quantum/complex";
import { projectorOntoSubspace } from "@/lib/quantum/projectors";
import type { NumericProblem } from "@/lib/problems/types";

// N = diag(1,1,2): P1 projects onto span{|0>,|1>} (eigenvalue 1), P2 onto |2> (eigenvalue 2).
const e0 = [new Complex(1), new Complex(0), new Complex(0)];
const e1 = [new Complex(0), new Complex(1), new Complex(0)];
const p1 = projectorOntoSubspace([e0, e1]);

const norm = 1 / Math.sqrt(3);
const psi = [new Complex(norm), new Complex(norm), new Complex(norm)];
const p1psi = p1.apply(psi);
const probability = p1psi.reduce((sum, c) => sum + c.magnitudeSquared(), 0);

export const pvmOutcomeProbability: NumericProblem = {
  meta: {
    slug: "pvm-outcome-probability",
    title: "P(outcome ≤ 1.5) from the Staircase PVM",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["spectral-theorem", "pvm", "born-rule"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators"],
  },
  question: {
    type: "numeric",
    prompt:
      "For N=diag(1,1,2) and the equal-superposition state |ψ⟩=(1/√3)(|0⟩+|1⟩+|2⟩), compute P(outcome ≤ 1.5) = ⟨ψ|E(1.5)|ψ⟩, using E(1.5)=P₁ (the projector onto the λ=1 eigenspace).",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: probability,
    tolerance: 0.01,
    incorrectFeedback: "E(1.5)=P₁ projects onto span{|0⟩,|1⟩} only — sum the squared amplitudes on just those two basis states.",
  },
  hints: [
    { text: "E(1.5) includes every eigenvalue ≤ 1.5, which for this operator is only λ=1 (λ=2 is excluded)." },
    { text: "So E(1.5)=P₁, the projector onto span{|0⟩,|1⟩}." },
    { text: "⟨ψ|P₁|ψ⟩ = |c₀|² + |c₁|², the squared amplitudes on |0⟩ and |1⟩ only." },
  ],
  solution: {
    steps: [
      { description: "Identify which eigenvalues satisfy λᵢ ≤ 1.5.", latex: "\\lambda=1 \\text{ qualifies}, \\;\\lambda=2 \\text{ does not} \\Rightarrow E(1.5)=P_1" },
      {
        description: "Apply P₁ to |ψ⟩ and take the squared norm.",
        latex: "P_1|\\psi\\rangle = \\tfrac{1}{\\sqrt3}(|0\\rangle+|1\\rangle), \\quad \\|P_1\\psi\\|^2 = \\tfrac13+\\tfrac13=\\tfrac23",
      },
    ],
    finalAnswer: "P(outcome ≤ 1.5) = 2/3 ≈ 0.667",
  },
  explanation: {
    correctIdea:
      "E(1.5) is the staircase PVM evaluated just past the first eigenvalue and before the second, so it equals P₁ exactly — the general P(outcome∈Δ)=⟨ψ|E(Δ)|ψ⟩ formula reduces to summing the squared amplitudes on the eigenspaces with eigenvalue ≤ 1.5.",
    whyCorrect: "Directly verified using this platform's real projectorOntoSubspace-built P₁ applied to the state vector.",
    whyWrong: [
      "Including the λ=2 eigenspace would give P(outcome≤1.5)=1, which is wrong — λ=2 is strictly greater than 1.5, so E(1.5) must exclude P₂.",
    ],
  },
};
