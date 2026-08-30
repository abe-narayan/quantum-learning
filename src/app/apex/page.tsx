import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede } from "@/components/ui/Typography";
import { ApexHero } from "@/components/apex/ApexHero";
import { ApexOpenProblems } from "@/components/apex/ApexOpenProblems";
import { ApexCourseIndex } from "@/components/apex/ApexCourseIndex";
import Link from "next/link";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { coursesOutsideChain, prerequisiteChain } from "@/components/apex/readiness";
import { COURSES, getCourse, getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { BASE_URL, buildBreadcrumbSchema, buildCourseListSchema, pillarUrl } from "@/lib/structuredData";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Apex",
  description:
    "The summit of StudyQuantum: research-depth algorithms, fault tolerance, complexity theory, large-scale simulation and compilation, and a final course in reading and evaluating real quantum-computing research.",
  path: "/apex",
});

export default async function ApexPage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("apex");
  const url = pillarUrl("apex");
  const courseListSchema = buildCourseListSchema(courses.map((course) => ({ course, url })));
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Apex", url },
  ]);

  // Apex is the last entry in PILLAR_ORDER, so `PillarNext` — the block that
  // keeps the other five track pages off a dead end by naming the track on
  // either side — has nothing to render here. § 03 below is this page's
  // equivalent, and unlike a generic "explore more" it is a real, derived
  // list: the courses Apex neither contains nor requires. See
  // `coursesOutsideChain`.
  const covered = new Set<string>(courses.map((course) => course.slug));
  for (const entry of prerequisiteChain(courses, lessons)) covered.add(entry.slug);
  const remaining = coursesOutsideChain(courses, lessons, COURSES).map((entry) => {
    const full = getCourse(entry.slug);
    return {
      ...entry,
      difficulty: full?.difficulty,
      estimatedHours: full?.estimatedHours,
      // "Ready now" against the only reader this section addresses: one who
      // has finished Apex, and therefore everything Apex requires.
      ready: (full?.prerequisites ?? []).every((slug) => covered.has(slug)),
    };
  });

  return (
    <PillarScope pillar="apex">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([courseListSchema, breadcrumbSchema]) }}
      />

      <ApexHero courses={courses} lessons={lessons} />

      <Section width="wide" aria-labelledby="open-problems-heading">
        <Eyebrow>§ 01 · At the boundary of what&rsquo;s known</Eyebrow>
        <SectionTitle id="open-problems-heading" level={2} size="lg" className="mt-3">
          Open problems at the frontier
        </SectionTitle>
        <Lede className="mt-4">
          Apex&rsquo;s five courses each extend a settled result from earlier in the
          curriculum to the point where it meets a genuine open question or an
          active research boundary. What follows is honest about where each
          one currently stands.
        </Lede>
        <div className="mt-10">
          <ApexOpenProblems courses={courses} lessons={lessons} />
        </div>
      </Section>

      <Section width="wide" aria-labelledby="course-index-heading" tight>
        <Eyebrow>§ 02 · Course index</Eyebrow>
        <SectionTitle id="course-index-heading" level={2} size="lg" className="mt-3">
          The five Apex courses
        </SectionTitle>
        <Lede className="mt-4">
          Algorithmic Frontiers, Fault Tolerance Frontiers, Quantum Complexity
          Theory, and Simulation &amp; Compilation Frontiers each extend a
          different Mastery or Software thread independently; Research
          Methods and Synthesis requires all four, and closes the platform.
        </Lede>
        <div className="mt-10">
          <ApexCourseIndex courses={courses} lessons={lessons} />
        </div>
      </Section>

      {remaining.length > 0 ? (
        <Section width="wide" aria-labelledby="after-apex-heading" tight>
          <Eyebrow>§ 03 · Still open</Eyebrow>
          <SectionTitle id="after-apex-heading" level={2} size="lg" className="mt-3">
            What the summit route leaves out
          </SectionTitle>
          <Lede className="mt-4">
            Apex is the deepest line through the curriculum, not the whole of
            it. {remaining.length} of the {COURSES.length} courses sit outside
            everything the five above require, so finishing Apex is not
            finishing StudyQuantum. None of them is a step down; they are the
            single-particle mechanics the computing route never needs, and the
            Mastery courses no Apex thread happens to draw on.
          </Lede>
          <ul className="mt-8 divide-y divide-border">
            {remaining.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={entry.href}
                  className="group -mx-2 flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-(--radius-tight) px-2 py-3 transition-colors hover:bg-surface-muted"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground group-hover:text-pillar-text">
                      {entry.title}
                    </span>
                    <span className="block tech-label text-subtle-foreground">
                      {entry.pillarLabel}
                      {entry.ready ? " · ready now" : ""}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    {entry.difficulty ? <DifficultyMark difficulty={entry.difficulty} /> : null}
                    {entry.estimatedHours ? (
                      <span className="font-tech text-xs text-subtle-foreground">
                        {entry.estimatedHours}h
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </PillarScope>
  );
}
