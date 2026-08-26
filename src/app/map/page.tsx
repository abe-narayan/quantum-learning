import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { LazyConceptMapExplorer } from "@/components/map/LazyConceptMapExplorer";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "Concept Map",
  description: "An interactive map of how QuantumLearn's key concepts depend on each other, from qubits to algorithms to hardware.",
  path: "/map",
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Concept Map", url: `${BASE_URL}/map` },
]);

export default async function MapPage() {
  const lessons = await getAllLessonsMeta();
  const lessonTitles = Object.fromEntries(lessons.map((lesson) => [lesson.slug, lesson.title]));

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        eyebrow="Map"
        title="The concept map"
        description="Every key idea across all six pillars — Quantum Mechanics, Quantum Computing, Quantum Hardware, Quantum Software, Quantum Mastery, and Apex — and how they build on each other. Click a concept for its definition, the real lessons that cover it, and its prerequisites."
      />

      <div className="mt-12">
        <LazyConceptMapExplorer lessonTitles={lessonTitles} />
      </div>
    </Container>
  );
}
