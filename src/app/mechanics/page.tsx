import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section, FullBleed, Marginalia } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, Readouts } from "@/components/ui/Typography";
import { Instrument, FadeRule } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CourseList } from "@/components/curriculum/CourseList";
import { CourseTimeline } from "@/components/curriculum/CourseTimeline";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { getCourseHref } from "@/components/curriculum/courseHref";
import {
  PillarBriefing,
  PillarLessonStrip,
  PillarNext,
  pillarFacts,
  pillarReadoutItems,
} from "@/components/pillar/PillarFraming";
import { TierLadder } from "@/components/pillar/TierLadder";
import { LazyWavefunctionHeroExplorer } from "@/components/simulators/wavefunction-explorer/LazyWavefunctionHeroExplorer";
import { COURSES, getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { pillarVisual } from "@/lib/design/pillars";
import { BASE_URL, buildBreadcrumbSchema, buildCourseListSchema, pillarUrl } from "@/lib/structuredData";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Mechanics",
  description:
    "The mathematical and physical foundation of quantum theory, from the failure of classical physics through the hydrogen atom and beyond.",
  path: "/mechanics",
});

/**
 * Mechanics reads as editorial physics writing: a measured reading column,
 * a real numerical simulation sitting where a textbook would put a worked
 * figure, and the curriculum below laid out as a derivation chain rather
 * than a card grid. This is the pillar's own composition language,
 * Computing, Hardware and Software each get a structurally different one
 * (see their page files), so the four pillars stay visually distinct rather
 * than four retints of one template.
 */
export default async function MechanicsPage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("quantum-mechanics");
  const url = pillarUrl("quantum-mechanics");
  const courseListSchema = buildCourseListSchema(courses.map((course) => ({ course, url })));
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Mechanics", url },
  ]);
  const field = pillarVisual("quantum-mechanics");

  // Every figure this page quotes about itself, course/lesson/hour counts,
  // the background it assumes, its difficulty range, and the real first
  // course and lesson, comes from one derivation over the real registries.
  // See `pillarFacts`; the other three track pages call the same function so
  // none of these can drift apart. `getCourseHref` resolves to the
  // `/courses/<slug>` overview (see courseHref.ts), whose own hero has the
  // next click straight to the first lesson.
  const facts = pillarFacts(courses, lessons);
  const { firstCourse, firstLesson } = facts;
  const heroHref = firstCourse ? getCourseHref(firstCourse.slug, firstLesson?.slug) : "/learn";

  // Which of this track's courses another track's course actually declares as
  // a prerequisite. `CourseTimeline` already draws this edge station by
  // station ("Leads to Computing"); the count is derived from the same
  // `Course.prerequisites` field so the margin note beside the rail cannot
  // claim a number the rail does not draw.
  const loadBearing = courses.filter((course) =>
    COURSES.some(
      (other) => other.pillar !== course.pillar && other.prerequisites.includes(course.slug)
    )
  );

  // The other direction, and the one the curriculum paragraph below used to
  // get wrong. It said "each course built directly on the one before it",
  // which the `CourseTimeline` immediately underneath contradicts by drawing
  // two edges out of this track into Computing and one branch that skips a
  // station. Counted from the same `prerequisites` field the rail draws, so
  // the sentence and the diagram cannot disagree again.
  const borrowsFromOtherTracks = courses.filter((course) =>
    course.prerequisites.some((slug) => {
      const prerequisite = COURSES.find((entry) => entry.slug === slug);
      return Boolean(prerequisite) && prerequisite!.pillar !== course.pillar;
    })
  );

  return (
    <PillarScope pillar="quantum-mechanics">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([courseListSchema, breadcrumbSchema]) }}
      />

      <Section width="reading">
        <Reveal>
          <Eyebrow>Quantum Mechanics</Eyebrow>
          <SectionTitle level={1} size="xl" className="mt-4">
            Reality, from first principles
          </SectionTitle>
          {/* Was "not as a computing prerequisite", which read as a claim of
              independence from the Computing track and is contradicted eight
              pixels down by `PillarBriefing`, which derives "Assumes: Quantum
              Gates & Circuits (in Computing) and Entanglement & Measurement
              (in Computing)" from the curriculum's own `prerequisites`. Two
              courses here genuinely need that material (see the notes in
              curriculum.ts), so the copy gave way, not the graph. What is
              still true, and is the point the clause was reaching for, is the
              register: this track is taught for the physics, not as a
              service course. */}
          <Lede className="mt-5">
            Quantum theory on its own terms: the actual mathematics reality obeys, built up
            rigorously enough that its results are derived here rather than asserted.
          </Lede>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-4 max-w-lede text-base leading-relaxed text-muted-foreground">
            Linear algebra and complex numbers first, then state vectors, operators, and the
            Schrödinger equation, built up rigorously through the hydrogen atom and open quantum
            systems. Build intuition with the Wavefunction Explorer (real wave-packet evolution
            and tunneling), the Rabi Explorer (driven two-level systems), and the Density Matrix
            Explorer (mixed states and decoherence).
          </p>
        </Reveal>

        {/* The four-rung ladder, identical on all six pillar pages, above the
            pillar-specific briefing. It is what says "this is the ground
            floor" here and "this is the summit" on /apex, and it has to be
            the same object in the same place on both for that contrast to be
            readable at all. */}
        <Reveal delay={90}>
          <TierLadder pillar="quantum-mechanics" className="mt-8" />
        </Reveal>

        <Reveal delay={100}>
          <PillarBriefing
            className="mt-8"
            facts={facts}
            outcome="Derive the hydrogen atom's energy levels from the Schrödinger equation, and compute a tunneling probability, yourself: not recognise them, derive them."
          />
        </Reveal>

        <Reveal delay={120}>
          <Readouts className="mt-8" items={pillarReadoutItems(facts)} />
        </Reveal>

        {firstCourse ? (
          <Reveal delay={140} className="mt-7 block">
            <Button href={heroHref} size="lg">
              Start: {firstCourse.title} →
            </Button>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle-foreground">
              <span>
                {facts.firstCourseLessonCount} lessons
                {firstLesson ? <> &middot; begins with &ldquo;{firstLesson.title}&rdquo;</> : null}
              </span>
              <DifficultyMark difficulty={firstCourse.difficulty} />
            </p>
          </Reveal>
        ) : null}

        <Marginalia className="mt-8">
          The field behind this page is not decoration: {field.fieldCaption.toLowerCase()}, drawn
          from the real dispersion law σ(t) = σ₀√(1 + (t/τ)²).
        </Marginalia>

        <Reveal y={20} className="mt-10 block">
          <Instrument
            label="Live simulation"
            footnote="A real split-operator time evolution running in your browser, not a canned animation; it is the same engine behind Wave Mechanics' Wavefunction Explorer."
          >
            <LazyWavefunctionHeroExplorer />
          </Instrument>
        </Reveal>
      </Section>

      <Section width="reading" tight aria-labelledby="mechanics-start-heading">
        <Reveal>
          <PillarLessonStrip
            courses={courses}
            lessons={lessons}
            headingId="mechanics-start-heading"
          />
        </Reveal>
      </Section>

      <FullBleed>
        <FadeRule className="mx-auto max-w-6xl" />
      </FullBleed>

      <Section width="reading" tight aria-labelledby="mechanics-curriculum-heading">
        <Reveal>
          <Eyebrow>Curriculum</Eyebrow>
          <SectionTitle level={2} size="lg" id="mechanics-curriculum-heading" className="mt-3">
            {courses.length} courses, one derivation at a time
          </SectionTitle>
          <p className="mt-3 text-muted-foreground">
            Foundational math through open quantum systems, in the order the derivations need.
            {borrowsFromOtherTracks.length > 0 ? (
              <>
                {" "}
                {borrowsFromOtherTracks.length} of them also{" "}
                {borrowsFromOtherTracks.length === 1 ? "draws" : "draw"} on a course from another
                track, and the rail below draws that edge where it happens.
              </>
            ) : null}
          </p>
        </Reveal>

        <Marginalia className="mt-6">
          {loadBearing.length > 0 ? (
            <>
              {loadBearing.length} of these {courses.length} courses{" "}
              {loadBearing.length === 1 ? "is" : "are"} a prerequisite for a course in another
              track. The rail below marks each one with the track that waits on it, so the order it
              draws is the order the rest of the curriculum was built against.
            </>
          ) : (
            <>
              The rail below runs in curriculum order and fills as far as you have read. Each
              station names the courses it requires.
            </>
          )}
        </Marginalia>
      </Section>

      <FullBleed>
        <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6 lg:px-8">
          <Reveal>
            <CourseTimeline courses={courses} lessons={lessons} />
          </Reveal>
        </div>
      </FullBleed>

      {/* The rail above is the whole chain at once; this is the manifest,
          module by module. The label is what tells a reader the width change
          was a change of object rather than the same list drawn twice. */}
      <Section width="reading" tight>
        <Reveal delay={80} className="block">
          <p className="tech-label">Every lesson, course by course</p>
          <div className="mt-4 border-l-2 border-pillar-edge pl-6">
            <CourseList courses={courses} lessons={lessons} />
          </div>
        </Reveal>
      </Section>

      <Section width="reading" tight aria-labelledby="mechanics-next-heading">
        <Reveal>
          <PillarNext pillar="quantum-mechanics" headingId="mechanics-next-heading" />
        </Reveal>
      </Section>
    </PillarScope>
  );
}
