import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede } from "@/components/ui/Typography";
import { ProblemsCatalog } from "@/components/problems/ProblemsCatalog";
import { getAllProblemMeta } from "@/lib/problems/registry";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "Problems",
  description: "Practice problems for checking your understanding of quantum computing, graded exactly against the real quantum engine.",
  path: "/problems",
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Problems", url: `${BASE_URL}/problems` },
]);

export default async function ProblemsPage() {
  const problems = getAllProblemMeta();

  // A lean lesson-slug → title lookup, for just the lessons these problems
  // actually reference, built here from the real lesson corpus — never
  // from the problem registry, and never imported into the client
  // component below. `ProblemsCatalog` (client, for its filters and
  // progress-derived recommendation) uses this to show which lesson a
  // problem belongs to without pulling `lib/content/lessons` (the MDX
  // corpus loader) across the client-bundle boundary — see
  // docs/DESIGN_SYSTEM.md §10 and src/lib/design/__tests__/clientBoundary.test.ts.
  const lessons = await getAllLessonsMeta();
  const neededLessonSlugs = new Set(
    problems.map((problem) => problem.lesson).filter((slug): slug is string => Boolean(slug))
  );
  const lessonTitleBySlug: Record<string, string> = {};
  for (const lesson of lessons) {
    if (neededLessonSlugs.has(lesson.slug)) lessonTitleBySlug[lesson.slug] = lesson.title;
  }

  return (
    // No single pillar — the catalog spans all six — so it gets the neutral
    // `atlas` reference environment rather than the homepage's
    // curriculum-order crossfade. An individual `/problems/<slug>` page
    // scopes itself to its own real pillar via `ProblemLayout`, not here.
    // See docs/UX_REVIEW.md P1-2.
    <PillarScope regime="atlas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* A measured reading column for the intro, rather than full page
          width — the specific gap docs/UX_REVIEW.md P2-11 and
          UX_REVIEW_2.md's "Genericness" paragraph both name: a filter strip
          straight into a card grid, with no reading column. Mirrors
          `/learn`'s own hero → wide-section split. */}
      <Section width="reading" className="pt-4 sm:pt-8">
        <Eyebrow>Problems</Eyebrow>
        <SectionTitle level={1} size="xl" className="mt-3">
          Practice what you&rsquo;ve learned
        </SectionTitle>
        <Lede className="mt-4 max-w-2xl">
          {problems.length} practice problems, tied to real lessons. Each is graded exactly, with
          progressive hints and a worked solution if you get stuck.
        </Lede>
      </Section>

      <Section width="wide" tight>
        <ProblemsCatalog problems={problems} lessonTitleBySlug={lessonTitleBySlug} />
      </Section>
    </PillarScope>
  );
}
