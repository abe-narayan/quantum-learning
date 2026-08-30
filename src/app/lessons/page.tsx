import type { Metadata } from "next";
import Link from "next/link";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lede, Readouts, SectionTitle, TechLabel } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { LessonIndex } from "@/components/curriculum/LessonIndex";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { COURSES, CURRICULUM_HOURS, PILLARS } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { START_LEARNING_HREF, START_LEARNING_SLUG } from "@/lib/nav";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

/**
 * ============================================================
 * /lessons, every written lesson, in one findable list
 * ============================================================
 * This route used to be a `permanentRedirect` stub to `/learn`. That made
 * `/learn` carry two incompatible jobs at once: "here is the order you should
 * read this in" and "here is everything, find your own way." The second job is
 * the one a beginner needs when the six-pillar progression stops helping and
 * starts overwhelming, and it is the one an advanced reader needs when they
 * want one specific lesson and do not care which course owns it.
 *
 * So `/lessons` is a real page again, a complete, grouped, filterable
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
    "Every written StudyQuantum lesson in one list, grouped by track and course, filterable by level, searchable by title, description or course.",
  path: "/lessons",
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Learn", url: `${BASE_URL}/learn` },
  { name: "All lessons", url: `${BASE_URL}/lessons` },
]);

export default async function LessonsIndexPage() {
  const lessons = await getAllLessonsMeta();

  const coursesWithContent = new Set(lessons.map((lesson) => lesson.course)).size;

  // "Where do I start?", answered with a real lesson rather than a filter
  // hint. Every other catalog on this site already opens with a way in (the
  // glossary's Start here tier, the problem catalog's foundational filter,
  // the concept map's "Start at the beginning" button); a 219-row index only
  // offered "or just scroll", which is the thing a wall says, not a way
  // through it.
  //
  // ------------------------------------------------------------
  // Why this is `START_LEARNING_SLUG` and not a local derivation
  // ------------------------------------------------------------
  // It used to be: "the first course in curriculum order that has a lesson
  // written, and that course's first authored lesson in module order." That is
  // a sound derivation and it was not hand-typed, but it answered a question
  // this page has no business answering. It resolved to Complex Numbers for
  // Physics, while the homepage hero, the navbar's "Start learning" button and
  // /learn's own primary CTA all nominate What Is a Qubit? — so the site gave
  // two answers to "what is the first lesson?", and a reader who happened to
  // land here first got the other one and never knew.
  //
  // Worse, the sentence beside it called that lesson "the curriculum's own
  // opening lesson," which contradicts what /learn states in as many words:
  // the curriculum opens on *two* routes, rigor-first (Mathematical
  // Foundations, whose first lesson this was) and intuition-first, and
  // "neither route is the beginner version of the other." A page cannot crown
  // one of them in passing.
  //
  // So this page stops nominating a winner of its own. It offers the one
  // destination the whole site already agrees on, from the same
  // `START_LEARNING_SLUG` the navbar and the hero use — one contract, and a
  // test in `lib/search/__tests__/index.test.ts` already pins that slug to a
  // real lesson — and points at /learn's fork for the other door. The lesson's
  // title, course, length and difficulty are still read from the corpus, so
  // nothing here is hand-typed either.
  const startLesson = lessons.find((lesson) => lesson.slug === START_LEARNING_SLUG);
  const startCourse = startLesson
    ? COURSES.find((course) => course.slug === startLesson.course)
    : undefined;

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
          <Lede width="reading" className="mt-5">
            Every lesson on StudyQuantum, grouped by track and course but readable in any order.
            Filter by level, search by name, or just scroll. Nothing here is locked.
          </Lede>
        </Reveal>
        <Reveal delay={90}>
          <Readouts
            className="mt-8"
            items={[
              { label: "Lessons", value: lessons.length },
              { label: "Courses with content", value: `${coursesWithContent} of ${COURSES.length}` },
              { label: "Tracks", value: PILLARS.length },
              // "Est. time", and the site's one curriculum-hours constant.
              // This readout said "Reading time 117h" because it summed raw
              // lesson `estimatedMinutes`, while the homepage said "Est. time
              // 118 hrs" and /learn said "Curriculum length 118h", both
              // summing per-course `estimatedHours` (the same minutes, rounded
              // to the nearest half hour per course first). One quantity, three
              // labels, two values. See `CURRICULUM_HOURS` in
              // `lib/content/curriculum.ts` for why the course-hours sum is the
              // one that survives.
              { label: "Est. time", value: CURRICULUM_HOURS, unit: "h" },
            ]}
          />
        </Reveal>
        {startLesson && startCourse ? (
          <Reveal delay={110} className="mt-8 block">
            <div className="border-l-2 border-pillar-edge pl-5">
              <TechLabel className="text-pillar-text">Not sure where to begin?</TechLabel>
              <p className="mt-2 max-w-lede text-sm leading-relaxed text-muted-foreground">
                This page is the complete manifest, not a path, so nothing below is the
                &ldquo;right&rdquo; first row. The curriculum opens on two routes rather than one,
                intuition first or rigor first, and{" "}
                <Link
                  href="/learn#ways-in"
                  className="font-medium text-pillar-text underline underline-offset-4"
                >
                  the curriculum page sets out both
                </Link>
                . If you would rather just start, this is the lesson every &ldquo;Start
                learning&rdquo; button on the site opens, and it assumes nothing before it.
              </p>
              <Button href={START_LEARNING_HREF} size="lg" className="mt-4">
                Start with: {startLesson.title} →
              </Button>
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle-foreground">
                <span>
                  {startCourse.title} &middot; {startLesson.estimatedMinutes} min
                </span>
                <DifficultyMark difficulty={startLesson.difficulty} />
              </p>
            </div>
          </Reveal>
        ) : null}

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
