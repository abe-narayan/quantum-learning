import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProblem } from "@/lib/problems/registry";
// Meta-only source for generateStaticParams: enumerating slugs must not be
// the thing that pulls the full 547-problem graph in, though this page's
// render genuinely needs it via `getProblem` above.
import { getAllProblemMeta } from "@/lib/problems/metaRegistry";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { getCourse, getPillar } from "@/lib/content/curriculum";
import { ProblemLayout, PREREQUISITE_ANCHOR_ID } from "@/components/problems/ProblemLayout";
import { ProblemView } from "@/components/problems/ProblemView";
import {
  BASE_URL,
  buildBreadcrumbSchema,
  buildProblemSchema,
  pillarUrl,
} from "@/lib/structuredData";
import { pageOpenGraph } from "@/lib/pageMetadata";

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
  const fullTitle = `${problem.meta.title} · StudyQuantum`;

  return {
    title: problem.meta.title,
    description,
    alternates: { canonical: url },
    // See the note on the lesson route's `generateMetadata`: declaring
    // `openGraph` here replaces the root layout's object, taking the
    // file-convention social card with it, so all 556 problem pages had no
    // `og:image`. `pageOpenGraph` re-declares the card and `og:site_name`.
    openGraph: pageOpenGraph({ title: fullTitle, description, url, type: "article" }),
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
  const homeLesson = problem.meta.lesson
    ? allLessons.find((lesson) => lesson.slug === problem.meta.lesson)
    : undefined;

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
    // Course crumb points at the course's own page (matching the visible
    // breadcrumb), not the pillar URL the previous crumb already used.
    ...(course ? [{ name: course.title, url: `${BASE_URL}/courses/${course.slug}` }] : []),
    { name: problem.meta.title, url: `${BASE_URL}/problems/${slug}` },
  ]);

  return (
    <ProblemLayout problem={problem} allLessons={allLessons}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([problemSchema, breadcrumbSchema]) }}
      />
      {/* Resolved here, server-side, from the lesson corpus `ProblemLayout`
          already needs, so a wrong answer can offer "re-read the lesson this
          came from" next to the feedback itself, without `ProblemView` (a
          client component) importing anything that reaches the content
          registry. See docs/DESIGN_SYSTEM.md §10. */}
      <ProblemView
        problem={problem}
        lessonSlug={homeLesson?.slug}
        lessonTitle={homeLesson?.title}
        /* Only offered when there is something for the anchor to show: a
           problem with no declared prerequisites renders the readout's "No
           prerequisites, this is a starting point" line, which is not a
           useful destination for a reader who just got the answer wrong. */
        prerequisiteAnchorId={
          (problem.meta.prerequisites?.length ?? 0) > 0 ? PREREQUISITE_ANCHOR_ID : undefined
        }
      />
    </ProblemLayout>
  );
}
