import type { NumericProblem } from "@/lib/problems/types";

const omega0 = 1;
const theta = Math.PI / 3; // 60°, the course's own worked example
const geometricPhaseMagnitude = Math.PI * (1 - Math.cos(theta)); // = π/2

// dynamical phase magnitude = ω0*T/2; set equal to the fixed geometric phase magnitude and solve for T
const T = (2 * geometricPhaseMagnitude) / omega0;

export const dynamicalEqualsGeometricPhaseDuration: NumericProblem = {
  meta: {
    slug: "dynamical-equals-geometric-phase-duration",
    title: "When Does the Dynamical Phase Catch Up to the Geometric Phase?",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/capstone-symmetry-and-the-classical-limit",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["berry-phase", "adiabatic-theorem", "synthesis"],
    prerequisites: [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/capstone-symmetry-and-the-classical-limit",
    ],
  },
  question: {
    type: "numeric",
    prompt:
      "Using ω₀=1 and the θ=60° example (fixed geometric phase magnitude π/2), find the loop duration T at which the dynamical phase magnitude ω₀T/2 first equals the geometric phase magnitude π/2.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: T,
    tolerance: 0.02,
    incorrectFeedback: "Set ω₀T/2 = π/2 and solve for T (with ω₀=1).",
    nearMisses: [
      { value: Math.PI / 2, tolerance: 0.02, feedback: "π/2 is the geometric phase magnitude itself. The dynamical phase is ω₀T/2, so solving for T undoes the factor of a half." },
      { value: 2 * Math.PI, tolerance: 0.02, feedback: "2π doubles rather than halves. From ω₀T/2 = π/2 with ω₀ = 1, T comes out at π." },
    ],
  },
  hints: [
    { text: "The geometric phase magnitude at θ=60° is π(1−cos60°)=π/2 (the lesson's own worked value)." },
    { text: "Set ω₀T/2 = π/2, i.e. T = π/ω₀." },
  ],
  solution: {
    steps: [{ description: "T = π/ω₀ = π ≈ 3.1416, with ω₀=1." }],
    finalAnswer: "≈3.1416 (T=π)",
  },
  explanation: {
    correctIdea: "Past this duration, the dynamical phase keeps growing without bound as the loop is traversed ever more slowly, while the geometric phase stays fixed at π/2 forever after — the capstone's central contrast, made concrete at this specific crossing point.",
  },
};
