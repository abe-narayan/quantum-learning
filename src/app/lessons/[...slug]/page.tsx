import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllLessonSlugs, loadLesson } from "@/lib/content/lessons";
import { getCourse } from "@/lib/content/curriculum";
import { LessonLayout } from "@/components/lessons/LessonLayout";

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

  return {
    title: lesson.lessonMeta.title,
    description: lesson.lessonMeta.description,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = await loadLesson(slug.join("/"));
  if (!lesson) notFound();

  const course = getCourse(lesson.lessonMeta.course);
  const LessonBody = lesson.default;

  return (
    <LessonLayout meta={lesson.lessonMeta} course={course}>
      <LessonBody />
    </LessonLayout>
  );
}
