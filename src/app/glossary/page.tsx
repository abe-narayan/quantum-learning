import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlossaryFilter } from "@/components/glossary/GlossaryFilter";
import { GLOSSARY_TERMS } from "@/lib/content/glossary";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "Glossary",
  description:
    "An alphabetical reference of quantum physics and quantum computing terms, each with a precise definition and a link to the real lesson that covers it.",
  path: "/glossary",
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Glossary", url: `${BASE_URL}/glossary` },
]);

export default async function GlossaryPage() {
  const lessons = await getAllLessonsMeta();
  const lessonTitles = Object.fromEntries(lessons.map((lesson) => [lesson.slug, lesson.title]));

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        eyebrow="Glossary"
        title="Glossary"
        description={`${GLOSSARY_TERMS.length} quantum physics and quantum computing terms, alphabetically, each with a precise definition and a link to the real lesson that covers it in depth.`}
      />

      <div className="mt-12 max-w-3xl">
        <GlossaryFilter terms={GLOSSARY_TERMS} lessonTitles={lessonTitles} />
      </div>
    </Container>
  );
}
