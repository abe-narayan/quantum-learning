import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CourseList } from "@/components/curriculum/CourseList";
import { PILLARS, getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";

export const metadata: Metadata = {
  title: "Lessons",
  description: "The full QuantumLearn lesson catalog, across every course and every track.",
};

export default async function LessonsPage() {
  const lessons = await getAllLessonsMeta();

  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Lessons"
        title="Lesson catalog"
        description="Every course across all four tracks, in one place — seven courses fully written so far (marked complete below), the rest mapped out as what's coming next."
      />

      <div className="mt-14 space-y-16">
        {PILLARS.map((pillar) => (
          <section key={pillar.slug}>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{pillar.title}</h2>
            <div className="mt-4">
              <CourseList courses={getCoursesByPillar(pillar.slug)} lessons={lessons} />
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
