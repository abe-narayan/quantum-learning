import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProblemsCatalog } from "@/components/problems/ProblemsCatalog";
import { getAllProblemMeta } from "@/lib/problems/registry";

export const metadata: Metadata = {
  title: "Problems & Quizzes",
  description: "Practice problems for checking your understanding of quantum computing, graded exactly against the real quantum engine.",
};

export default function ProblemsPage() {
  const problems = getAllProblemMeta();

  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Problems"
        title="Practice what you've learned"
        description="Real practice problems, tied to real lessons. Each is graded exactly, with progressive hints and a worked solution if you get stuck."
      />
      <div className="mt-12">
        <ProblemsCatalog problems={problems} />
      </div>
    </Container>
  );
}
