import type { Metadata } from "next";
import Link from "next/link";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lede, Readouts, SectionTitle } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { LessonIndex } from "@/components/curriculum/LessonIndex";
import { COURSES, PILLARS } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

/**
 * ============================================================
 * /lessons — every written lesson, in one findable list
 * ============================================================
 * This route used to be a `permanentRedirect` stub to `/learn`. That made
 * `/learn` carry two incompatible jobs at once: "here is the order you should
 * read this in" and "here is everything, find your own way." The second job is
 * the one a beginner needs when the six-pillar progression stops helping and
 * starts overwhelming, and it is the one an advanced reader needs when they
 * want one specific lesson and do not care which course owns it.
 *
 * So `/lessons` is a real page again — a complete, grouped, filterable
 * manifest (see `LessonIndex`) rather than a second curriculum view. `/learn`
 * links here from the "open a lesson right now" strip; nothing that pointed at
 * `/lessons` before is broken by the change, because the redirect's target was
 * never a deep link.
 * (Both follow-ups that used to be flagged here are done: `/lessons` is in
 * `sitemap.ts`'s `STATIC_ROUTES`, and it is no longer excluded in
 * `routes.test.ts`.)
 */

export const metadata: Metadata = buildPageMetadata({
  title: "All lessons",
  description:
    "Every written QuantumLearn lesson in one list — grouped by track and course, filterable by level, searchable by title, description or course.",
  path: "/lessons",
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Learn", url: `${BASE_URL}/learn` },
  { name: "All lessons", url: `${BASE_URL}/lessons` },
]);

export default async function LessonsIndexPage() {
  const lessons = await getAllLessonsMeta();

  const totalMinutes = lessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0);
  const coursesWithContent = new Set(lessons.map((lesson) => lesson.course)).size;

  return (
    <PillarScope regime="atlas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Section width="reading" tight>
        <Reveal>
          <Eyebrow>All lessons</Eyebrow>
          <SectionTitle level={1} size="xl" className="mt-4">
            Everything written so far
          </SectionTitle>
          <Lede className="mt-5 max-w-[46rem]">
            Every lesson on QuantumLearn, grouped by track and course but readable in any order.
            Filter by level, search by name, or just scroll — nothing here is locked.
          </Lede>
        </Reveal>
        <Reveal delay={90}>
          <Readouts
            className="mt-8"
            items={[
              { label: "Lessons", value: lessons.length },
              { label: "Courses with content", value: `${coursesWithContent} of ${COURSES.length}` },
              { label: "Tracks", value: PILLARS.length },
              { label: "Reading time", value: Math.round(totalMinutes / 60), unit: "h" },
            ]}
          />
        </Reveal>
        <p className="mt-6 text-sm text-muted-foreground">
          Looking for the recommended order instead?{" "}
          <Link href="/learn" className="font-medium text-pillar-text underline underline-offset-4">
            The curriculum lays out all six tracks
          </Link>
          .
        </p>
      </Section>

      <Section width="wide" tight>
        <LessonIndex lessons={lessons} />
      </Section>
    </PillarScope>
  );
}
