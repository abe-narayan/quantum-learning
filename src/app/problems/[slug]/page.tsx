import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProblemMeta, getProblem } from "@/lib/problems/registry";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { getCourse, getPillar } from "@/lib/content/curriculum";
import { ProblemLayout } from "@/components/problems/ProblemLayout";
import { ProblemView } from "@/components/problems/ProblemView";
import {
  BASE_URL,
  buildBreadcrumbSchema,
  buildProblemSchema,
  pillarUrl,
} from "@/lib/structuredData";

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

  const description = `Practice problem: ${problem.meta.title}.`;
  const url = `${BASE_URL}/problems/${slug}`;
  const fullTitle = `${problem.meta.title} · QuantumLearn`;

  return {
    title: problem.meta.title,
    description,
    alternates: { canonical: url },
    openGraph: { title: fullTitle, description, url, type: "article" },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();

  // Fetched the same way lesson pages do, so "Builds on" / "Back to lesson"
  // links can resolve full lesson titles regardless of which course they're in.
  const allLessons = await getAllLessonsMeta();

  const course = getCourse(problem.meta.course);
  const pillar = course ? getPillar(course.pillar) : undefined;

  const problemSchema = buildProblemSchema({
    slug,
    title: problem.meta.title,
    description: `Practice problem: ${problem.meta.title}.`,
    difficulty: problem.meta.difficulty,
    courseTitle: course?.title,
    courseUrl: pillar ? pillarUrl(pillar.slug) : undefined,
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Problems", url: `${BASE_URL}/problems` },
    ...(pillar ? [{ name: pillar.title, url: pillarUrl(pillar.slug) }] : []),
    ...(course ? [{ name: course.title, url: pillarUrl(course.pillar) }] : []),
    { name: problem.meta.title, url: `${BASE_URL}/problems/${slug}` },
  ]);

  return (
    <ProblemLayout problem={problem} allLessons={allLessons}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([problemSchema, breadcrumbSchema]) }}
      />
      <ProblemView problem={problem} />
    </ProblemLayout>
  );
}
