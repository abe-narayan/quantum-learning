import { blochStateFromAngles, stateToBlochVector } from "@/lib/quantum/bloch";
import type { NumericProblem } from "@/lib/problems/types";

const theta = (2 * Math.PI) / 3;
const phi = Math.PI / 3;
const blochVector = stateToBlochVector(blochStateFromAngles({ theta, phi }));

export const blochXCoordinateCalculation: NumericProblem = {
  meta: {
    slug: "bloch-x-coordinate-calculation",
    title: "Computing a Bloch Sphere x-Coordinate",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/the-bloch-sphere",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["bloch-sphere", "spherical-coordinates"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/the-bloch-sphere"],
  },
  question: {
    type: "numeric",
    prompt:
      "A state has Bloch angles $\\theta = 2\\pi/3$, $\\varphi = \\pi/3$. Using $x=\\sin\\theta\\cos\\varphi$, find $x$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: blochVector.x,
    tolerance: 0.01,
    incorrectFeedback: "Compute sin(2π/3) and cos(π/3) separately first, then multiply them.",
    nearMisses: [
      { value: Math.cos(theta) * Math.cos(phi), tolerance: 0.01, feedback: "You used cos θ where the formula wants sin θ. cos θ is the z-coordinate; x uses sin θ to set the distance from the polar axis." },
      { value: Math.sin(theta), tolerance: 0.01, feedback: "sin θ alone says how far from the polar axis the point sits, but not which direction round the equator. The cos φ factor supplies that." },
      { value: Math.sin(theta) * Math.sin(phi), tolerance: 0.01, feedback: "sin θ sin φ is the y-coordinate. The x-coordinate takes the cosine of φ." },
    ],
  },
  hints: [
    { text: "The formula needs two trig values. In degrees, θ = 120° and φ = 60°." },
    { text: "120° is in the second quadrant, where sine is positive and sin(180° − x) = sin(x). Reduce sin(120°) to a first-quadrant value you know, and do the same for cos(60°)." },
    { text: "Multiply the two factors, then check the sign: cos φ is positive here, so x should land on the positive side." },
  ],
  solution: {
    steps: [
      { description: "Evaluate $\\sin\\theta$.", latex: "\\sin\\!\\left(\\frac{2\\pi}{3}\\right) = \\frac{\\sqrt3}{2}" },
      { description: "Evaluate $\\cos\\varphi$.", latex: "\\cos\\!\\left(\\frac{\\pi}{3}\\right) = \\frac12" },
      { description: "Multiply.", latex: "x = \\frac{\\sqrt3}{2}\\cdot\\frac12 = \\frac{\\sqrt3}{4} \\approx 0.433" },
    ],
    finalAnswer: `$x \\approx ${blochVector.x.toFixed(3)}$`,
  },
  explanation: {
    correctIdea: "The Bloch x-coordinate combines both angles: sin(θ) sets how far from the polar axis the point sits, and cos(φ) projects that onto the x-axis specifically.",
    whyCorrect: `Directly confirmed via this platform's engine: blochStateFromAngles({theta, phi}) followed by stateToBlochVector gives x ≈ ${blochVector.x.toFixed(4)}, matching sin(2π/3)cos(π/3) exactly.`,
    whyWrong: [
      "Using cos(θ) instead of sin(θ) confuses the x-coordinate formula with the z-coordinate formula (z=cos θ).",
      "Forgetting the cos(φ) factor entirely would give sin(θ) alone, ignoring which direction around the equator the point sits.",
    ],
  },
};
