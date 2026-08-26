import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section, FullBleed, Marginalia } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede } from "@/components/ui/Typography";
import { Instrument, FadeRule } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion/Reveal";
import { CourseList } from "@/components/curriculum/CourseList";
import { CourseTimeline } from "@/components/curriculum/CourseTimeline";
import { LazyWavefunctionHeroExplorer } from "@/components/simulators/wavefunction-explorer/LazyWavefunctionHeroExplorer";
import { getCoursesByPillar } from "@/lib/content/curriculum";
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
 * than a card grid. This is the pillar's own composition language —
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
          <Lede className="mt-5">
            This is quantum theory on its own terms, not a computing prerequisite: the actual
            mathematics reality obeys.
          </Lede>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-4 max-w-[42rem] text-base leading-relaxed text-muted-foreground">
            Linear algebra and complex numbers first, then state vectors, operators, and the
            Schrödinger equation, built up rigorously through the hydrogen atom and open quantum
            systems. Start with <em>Mathematical Foundations for Quantum Mechanics</em> if that
            math isn&rsquo;t second nature yet. Build intuition with the Wavefunction Explorer
            (real wave-packet evolution and tunneling), the Rabi Explorer (driven two-level
            systems), and the Density Matrix Explorer (mixed states and decoherence).
          </p>
        </Reveal>

        <Marginalia className="mt-8">
          The field behind this page is not decoration: {field.fieldCaption.toLowerCase()}, drawn
          from the real dispersion law σ(t) = σ₀√(1 + (t/τ)²).
        </Marginalia>

        <Reveal y={20} className="mt-10 block">
          <Instrument
            label="Live simulation"
            footnote="A real split-operator time evolution running in your browser, not a canned animation — the same engine behind Wave Mechanics' Wavefunction Explorer."
          >
            <LazyWavefunctionHeroExplorer />
          </Instrument>
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
            Foundational math through open quantum systems, each course built directly on the one
            before it.
          </p>
        </Reveal>

        <Marginalia className="mt-6">
          The rail below spans the full width deliberately — a derivation chain, not a card grid,
          reads left to right the way the courses themselves build on each other.
        </Marginalia>
      </Section>

      <FullBleed>
        <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6 lg:px-8">
          <Reveal>
            <CourseTimeline courses={courses} lessons={lessons} />
          </Reveal>
        </div>
      </FullBleed>

      <Section width="reading" tight>
        <Reveal delay={80} className="block">
          <div className="mt-2 border-l-2 border-pillar-edge pl-6">
            <CourseList courses={courses} lessons={lessons} />
          </div>
        </Reveal>
      </Section>
    </PillarScope>
  );
}
