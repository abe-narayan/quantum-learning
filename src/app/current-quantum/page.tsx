import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, Readouts } from "@/components/ui/Typography";
import { CurrentQuantumCatalog } from "@/components/currentQuantum/CurrentQuantumCatalog";
import { formatEntryDate, entryYear } from "@/components/currentQuantum/dateUtils";
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

  const mostRecent = entries[0];
  const oldest = entries[entries.length - 1];

  return (
    // Bare <PillarScope> (no `pillar` prop): declares a real, deliberate
    // field regime for this page instead of silently inheriting the
    // homepage's `journey` crossfade (see docs/UX_REVIEW.md P1-2, which
    // names this exact line as the pattern six other cross-cutting pages
    // are missing) and restores the atmosphere layer every other page gets.
    // docs/UX_REVIEW.md P1-12 separately flags that Simulators and Problems
    // — the other two catalog-style pages — don't wrap in PillarScope at
    // all, so a reader moving between the three sees one of them get an
    // atmosphere/regime and two don't, and asks whether Current Quantum
    // should drop it for consistency. Per P1-2 this is the convention the
    // *other* two pages are missing, not an extra this one should shed —
    // dropping it would trade one inconsistency (three templates) for a
    // worse one (this page silently reinheriting `journey`, P1-2's bug).
    // Kept as-is; Simulators and Problems (owned by other agents) should
    // each adopt a bare <PillarScope> the same way.
    <PillarScope regime="atlas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <Section tight>
        <Eyebrow>Current Quantum</Eyebrow>
        <SectionTitle level={1} size="xl" className="mt-4 max-w-3xl">
          The real research behind the curriculum
        </SectionTitle>
        <Lede className="mt-5 max-w-[46rem]">
          {entries.length} real, verified results in quantum computing and physics, from Bell&rsquo;s 1964
          inequality to this decade&rsquo;s hardware, listed reverse-chronological and each linked back to the
          QuantumLearn lesson that explains the concept behind it.
        </Lede>

        {mostRecent && oldest ? (
          // No "N weeks/months ago" readout here — see docs/UX_REVIEW.md
          // P0-2. This page is statically generated with no `export const
          // revalidate`, so `new Date()` would be evaluated once at build
          // time and any "that was N ago" string baked from it would drift
          // further from true every day the build stays live, with nothing
          // to notice it — the opposite of what a currency-focused page
          // should claim. `formatEntryDate` below is an absolute date, not
          // computed against "now", so it stays true indefinitely with no
          // rebuild or revalidation schedule required. (The alternative —
          // `export const revalidate = 86400` plus keeping the relative
          // string — was considered and rejected: it only refreshes on the
          // next request after the window elapses, so correctness would
          // depend on traffic and on the host actually running background
          // ISR regeneration, which isn't guaranteed for every deployment
          // target this pure-SSG app might run under. Dropping the moving
          // part is the fix that's true unconditionally.)
          <Readouts
            className="mt-8"
            items={[
              { label: "Entries", value: entries.length },
              { label: "Span", value: `${entryYear(oldest.date)}–${entryYear(mostRecent.date)}` },
              { label: "Most recent", value: formatEntryDate(mostRecent.date) },
            ]}
          />
        ) : null}

        <div className="mt-14">
          <CurrentQuantumCatalog entries={entries} lessonTitles={lessonTitles} />
        </div>
      </Section>
    </PillarScope>
  );
}
