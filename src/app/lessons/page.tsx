import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";

export const metadata: Metadata = {
  title: "Lessons",
  description: "The full QuantumLearn lesson library, organized by topic and difficulty.",
};

const LESSON_TOPICS = [
  {
    title: "Complex numbers & vector spaces",
    description: "The mathematical toolkit underlying every quantum state.",
    tag: "Foundations",
  },
  {
    title: "The qubit",
    description: "Superposition, the Bloch sphere, and measurement.",
    tag: "Foundations",
  },
  {
    title: "Single-qubit gates",
    description: "Pauli, Hadamard, and phase gates, and how they act on state vectors.",
    tag: "Core",
  },
  {
    title: "Entanglement",
    description: "Multi-qubit states, Bell pairs, and why entanglement isn't just correlation.",
    tag: "Core",
  },
  {
    title: "Quantum circuits",
    description: "Reading and building circuit diagrams from gates and qubits.",
    tag: "Core",
  },
  {
    title: "Grover's algorithm",
    description: "Amplitude amplification and quadratic speedups for search.",
    tag: "Algorithms",
  },
];

export default function LessonsPage() {
  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Lessons"
        title="Lesson library"
        description="Browse lessons by topic. Content is still being written — this is a preview of what's coming."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LESSON_TOPICS.map((lesson) => (
          <PlaceholderCard
            key={lesson.title}
            title={lesson.title}
            description={lesson.description}
            tag={lesson.tag}
          />
        ))}
      </div>
    </Container>
  );
}
