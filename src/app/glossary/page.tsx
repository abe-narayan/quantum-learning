import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede } from "@/components/ui/Typography";
import { GlossaryFilter } from "@/components/glossary/GlossaryFilter";
import { GLOSSARY_TERMS, getStartHereTerms } from "@/lib/content/glossary";
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
  const startHereTerms = getStartHereTerms();
  const foundationalCount = GLOSSARY_TERMS.filter((term) => term.level === "foundational").length;

  return (
    // No single pillar, the glossary spans all six, alphabetically, so a
    // reader scrolling A to Z gets the calm `atlas` reference environment
    // rather than the homepage's curriculum-order crossfade behind content
    // that has nothing to do with it. See docs/UX_REVIEW.md P1-2.
    <PillarScope regime="atlas">
      <Section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <Eyebrow>Glossary</Eyebrow>
        <SectionTitle level={1} size="xl" className="mt-3">
          Glossary
        </SectionTitle>
        {/* The last sentence used to read "Start with the 15 below, then use
            the A–Z or the filter for anything you meet along the way", which
            described the old order: fifteen reading-order cards, and the
            filter four screens below them on a phone. The controls now come
            first (see GlossaryFilter's note), so the sentence names them
            first. */}
        <Lede className="mt-4">
          {GLOSSARY_TERMS.length} quantum physics and quantum computing terms, each with a precise
          definition and a link to the real lesson that covers it in depth. {foundationalCount} of
          them assume no prior background. Filter or jump by letter to look one up; if you are
          new to the subject, the {startHereTerms.length} under &ldquo;start here&rdquo; are the
          ones to read first, in order.
        </Lede>

        <div className="mt-10">
          <GlossaryFilter
            terms={GLOSSARY_TERMS}
            startHereTerms={startHereTerms}
            lessonTitles={lessonTitles}
          />
        </div>
      </Section>
    </PillarScope>
  );
}
