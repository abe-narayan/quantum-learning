import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";

export const metadata: Metadata = {
  title: "Problems & Quizzes",
  description: "Practice problems and quizzes for checking your understanding of quantum computing.",
};

const PROBLEM_SETS = [
  {
    title: "Foundations check",
    description: "Complex numbers, vector spaces, and inner products.",
    tag: "Quiz",
  },
  {
    title: "Single-qubit gates",
    description: "Predict the resulting state after applying a sequence of gates.",
    tag: "Practice set",
  },
  {
    title: "Entanglement & measurement",
    description: "Work through Bell states and conditional measurement outcomes.",
    tag: "Practice set",
  },
  {
    title: "Algorithm design",
    description: "Trace through Deutsch–Jozsa and Grover's algorithm by hand.",
    tag: "Challenge",
  },
];

export default function ProblemsPage() {
  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Problems & Quizzes"
        title="Practice what you've learned"
        description="Problem sets and quizzes for each stage of the learning path. Content is still being written."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROBLEM_SETS.map((set) => (
          <PlaceholderCard
            key={set.title}
            title={set.title}
            description={set.description}
            tag={set.tag}
          />
        ))}
      </div>
    </Container>
  );
}
