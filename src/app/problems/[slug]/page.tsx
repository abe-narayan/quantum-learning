import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProblemMeta, getProblem } from "@/lib/problems/registry";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { ProblemLayout } from "@/components/problems/ProblemLayout";
import { ProblemView } from "@/components/problems/ProblemView";

export function generateStaticParams() {
  return getAllProblemMeta().map((meta) => ({ slug: meta.slug }));
}

export const dynamicParams = false;

type ProblemPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProblemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) return {};

  return {
    title: problem.meta.title,
    description: `Practice problem: ${problem.meta.title}.`,
  };
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();

  // Fetched the same way lesson pages do, so "Builds on" / "Back to lesson"
  // links can resolve full lesson titles regardless of which course they're in.
  const allLessons = await getAllLessonsMeta();

  return (
    <ProblemLayout problem={problem} allLessons={allLessons}>
      <ProblemView problem={problem} />
    </ProblemLayout>
  );
}
