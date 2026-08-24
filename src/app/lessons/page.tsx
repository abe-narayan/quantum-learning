import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CourseList } from "@/components/curriculum/CourseList";
import { LessonSearch } from "@/components/curriculum/LessonSearch";
import { COURSES, PILLARS, getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "Lessons",
  description: "The full QuantumLearn lesson catalog, across every course and every track.",
  path: "/lessons",
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Lessons", url: `${BASE_URL}/lessons` },
]);

export default async function LessonsPage() {
  const lessons = await getAllLessonsMeta();

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        eyebrow="Lessons"
        title="Lesson catalog"
        description={`Every course across all four tracks, in one place — ${COURSES.length} courses and ${lessons.length} lessons, fully written and ready to work through.`}
      />

      <div className="mt-10">
        <LessonSearch lessons={lessons}>
          <div className="space-y-16">
            {PILLARS.map((pillar) => (
              <section key={pillar.slug}>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">{pillar.title}</h2>
                <div className="mt-4">
                  <CourseList courses={getCoursesByPillar(pillar.slug)} lessons={lessons} />
                </div>
              </section>
            ))}
          </div>
        </LessonSearch>
      </div>
    </Container>
  );
}
