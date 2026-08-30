import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllLessonSlugs, getAllLessonsMeta, getLessonMeta, loadLesson } from "@/lib/content/lessons";
import { getCourse, getPillar } from "@/lib/content/curriculum";
import { LessonLayout } from "@/components/lessons/LessonLayout";
import {
  BASE_URL,
  buildBreadcrumbSchema,
  buildLessonSchema,
  pillarUrl,
} from "@/lib/structuredData";
import { pageOpenGraph } from "@/lib/pageMetadata";

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
  // Registry lookup, not loadLesson(): metadata needs only title/description,
  // so the metadata pass never has to import the compiled MDX module.
  const meta = getLessonMeta(slug.join("/"));
  if (!meta) return {};

  const { title, description } = meta;
  const url = `${BASE_URL}/lessons/${slug.join("/")}`;
  const fullTitle = `${title} · StudyQuantum`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // `pageOpenGraph`, not an object literal: this route's own `openGraph`
    // replaces the root layout's, which is where the file-convention social
    // card was attached — so every one of the 219 lesson pages was shipping
    // with no `og:image`. The helper carries the card and `og:site_name` for
    // all four metadata families. `twitter.images` is filled from
    // `openGraph.images` automatically.
    openGraph: pageOpenGraph({ title: fullTitle, description, url, type: "article" }),
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
  // course boundaries, see LessonLayout for how course-local nav is
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
    // The course crumb must point at the course's own page, the same URL the
    // visible breadcrumb links to via getCourseHref, not the pillar URL
    // (which the previous crumb already used; duplicating it produced two
    // BreadcrumbList items with different names but the same URL).
    ...(course ? [{ name: course.title, url: `${BASE_URL}/courses/${course.slug}` }] : []),
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
