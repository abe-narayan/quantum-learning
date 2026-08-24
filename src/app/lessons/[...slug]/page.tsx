import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllLessonSlugs, getAllLessonsMeta, loadLesson } from "@/lib/content/lessons";
import { getCourse, getPillar } from "@/lib/content/curriculum";
import { LessonLayout } from "@/components/lessons/LessonLayout";
import {
  BASE_URL,
  buildBreadcrumbSchema,
  buildLessonSchema,
  pillarUrl,
} from "@/lib/structuredData";

export async function generateStaticParams() {
  const slugs = await getAllLessonSlugs();
  return slugs.map((slug) => ({ slug: slug.split("/") }));
}

export const dynamicParams = false;

type LessonPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await loadLesson(slug.join("/"));
  if (!lesson) return {};

  const { title, description } = lesson.lessonMeta;
  const url = `${BASE_URL}/lessons/${slug.join("/")}`;
  const fullTitle = `${title} · QuantumLearn`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: fullTitle, description, url, type: "article" },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");
  const lesson = await loadLesson(slug);
  if (!lesson) notFound();

  const course = getCourse(lesson.lessonMeta.course);
  const pillar = course ? getPillar(course.pillar) : undefined;
  // Fetched globally (not per-course) so prerequisites can resolve across
  // course boundaries — see LessonLayout for how course-local nav is
  // derived from this same list.
  const allLessons = await getAllLessonsMeta();
  const LessonBody = lesson.default;

  const lessonSchema = buildLessonSchema({
    slug,
    title: lesson.lessonMeta.title,
    description: lesson.lessonMeta.description,
    difficulty: lesson.lessonMeta.difficulty,
    courseTitle: course?.title ?? lesson.lessonMeta.course,
    courseUrl: pillar ? pillarUrl(pillar.slug) : undefined,
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Learn", url: `${BASE_URL}/learn` },
    ...(pillar ? [{ name: pillar.title, url: pillarUrl(pillar.slug) }] : []),
    ...(course ? [{ name: course.title, url: pillarUrl(course.pillar) }] : []),
    { name: lesson.lessonMeta.title, url: `${BASE_URL}/lessons/${slug}` },
  ]);

  return (
    <LessonLayout meta={lesson.lessonMeta} slug={slug} course={course} allLessons={allLessons}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([lessonSchema, breadcrumbSchema]) }}
      />
      <LessonBody />
    </LessonLayout>
  );
}
