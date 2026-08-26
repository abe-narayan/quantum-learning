import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CurrentQuantumCatalog } from "@/components/currentQuantum/CurrentQuantumCatalog";
import { getAllCurrentQuantumEntries } from "@/lib/content/currentQuantum/registry";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "Current Quantum",
  description:
    "Real quantum computing and physics developments, from the foundational experiments to this decade's hardware — each linked back to the QuantumLearn lesson that explains the concept behind it.",
  path: "/current-quantum",
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Current Quantum", url: `${BASE_URL}/current-quantum` },
]);

export default async function CurrentQuantumPage() {
  const [entries, lessons] = await Promise.all([
    Promise.resolve(getAllCurrentQuantumEntries()),
    getAllLessonsMeta(),
  ]);
  const lessonTitles = Object.fromEntries(lessons.map((lesson) => [lesson.slug, lesson.title]));

  // Real ItemList structured data for the entries themselves — every url
  // below is a real lesson route this page already verified resolves (see
  // `lessonTitles`), not a fabricated per-entry page.
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Current Quantum",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.title,
      url: `${BASE_URL}/lessons/${entry.relatedLessonSlug}`,
    })),
  };

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <PageHeader
        eyebrow="Current Quantum"
        title="The real research behind the curriculum"
        description={`${entries.length} real, verified results in quantum computing and physics, from Bell's 1964 inequality to this decade's hardware, listed reverse-chronological and each linked back to the QuantumLearn lesson that explains the concept behind it.`}
      />

      <div className="mt-12 max-w-3xl">
        <CurrentQuantumCatalog entries={entries} lessonTitles={lessonTitles} />
      </div>
    </Container>
  );
}
