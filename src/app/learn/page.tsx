import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CourseList } from "@/components/curriculum/CourseList";
import { PILLARS, getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "The QuantumLearn curriculum — Quantum Mechanics, Quantum Computing, Quantum Hardware, and Quantum Software, from strong high-school math through advanced undergraduate material.",
};

export default async function LearnPage() {
  const lessons = await getAllLessonsMeta();

  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Learn"
        title="The QuantumLearn curriculum"
        description="Four tracks, each building on strong high-school math and physics toward advanced undergraduate quantum mechanics and computing."
      />

      <div className="mt-14 space-y-16">
        {PILLARS.map((pillar) => (
          <section key={pillar.slug} id={pillar.slug} className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{pillar.title}</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">{pillar.description}</p>
            <div className="mt-6">
              <CourseList courses={getCoursesByPillar(pillar.slug)} lessons={lessons} />
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
