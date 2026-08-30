import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede } from "@/components/ui/Typography";
import { ProblemsCatalog } from "@/components/problems/ProblemsCatalog";
import { getAllProblemMeta } from "@/lib/problems/metaRegistry";
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

  // Counted from the corpus, not authored: `beginner` is the lowest rung of
  // `ProblemDifficulty`, so this figure moves on its own as problems are
  // added. The catalog below derives the same number for its own "New here?"
  // control (and the actual filtering), this is only the reading-column
  // statement of it, which is the one place a beginner will read before they
  // reach any control at all.
  const foundationalCount = problems.filter((problem) => problem.difficulty === "beginner").length;

  // A lean lesson-slug → title lookup, for just the lessons these problems
  // actually reference, built here from the real lesson corpus, never
  // from the problem registry, and never imported into the client
  // component below. `ProblemsCatalog` (client, for its filters and
  // progress-derived recommendation) uses this to show which lesson a
  // problem belongs to without pulling `lib/content/lessons` (the MDX
  // corpus loader) across the client-bundle boundary, see
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
    // No single pillar, the catalog spans all six, so it gets the neutral
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
          width, the specific gap docs/UX_REVIEW.md P2-11 and
          UX_REVIEW_2.md's "Genericness" paragraph both name: a filter strip
          straight into a card grid, with no reading column. Mirrors
          `/learn`'s own hero → wide-section split. */}
      {/* `tight`, not `className="pt-4 sm:pt-8"`: `Section` writes its
          vertical padding as an inline `style`, which always beats a class on
          the same element, so that override compiled fine and applied to
          nothing, the page opened with the full `--rhythm-section` (72px at
          320px, 136px on a wide desktop) where 16px was asked for. `tight` is
          the prop that actually reduces it. Same dead override as /learn's
          hero, error.tsx and not-found.tsx. */}
      <Section width="reading" tight>
        <Eyebrow>Problems</Eyebrow>
        <SectionTitle level={1} size="xl" className="mt-3">
          Practice what you&rsquo;ve learned
        </SectionTitle>
        {/*
          The plain line first, before any count or filter strip: what these
          are and how to use one. A newcomer arriving here sees a catalog of
          graduate-flavoured exercises, and docs/BEGINNER_REVIEW.md's complaint
          was never that they are too hard, it is that nothing on the page
          says what to *do* with them, or that being wrong is free. Both facts
          fit in a sentence, so they get one, in the reading column, above
          everything else.
        */}
        <Lede className="mt-4 max-w-2xl">
          A problem is one short exercise attached to one lesson. Type an answer, submit it, and it is
          graded on the spot against the real quantum engine. Take as many attempts as you like, then
          open a hint or the full worked solution.
        </Lede>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {problems.length} of them, across all six tracks, and{" "}
          <span className="text-foreground">{foundationalCount} need only a first lesson</span>. The
          Foundational filter below shows exactly those. Nothing is locked, nothing is scored, and every
          problem links back to the lesson it came from.
        </p>
      </Section>

      <Section width="wide" tight>
        <ProblemsCatalog problems={problems} lessonTitleBySlug={lessonTitleBySlug} />
      </Section>
    </PillarScope>
  );
}
