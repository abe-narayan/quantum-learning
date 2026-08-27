import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede } from "@/components/ui/Typography";
import { ApexHero } from "@/components/apex/ApexHero";
import { ApexOpenProblems } from "@/components/apex/ApexOpenProblems";
import { ApexCourseIndex } from "@/components/apex/ApexCourseIndex";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { BASE_URL, buildBreadcrumbSchema, buildCourseListSchema, pillarUrl } from "@/lib/structuredData";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Apex",
  description:
    "The summit of QuantumLearn: research-depth algorithms, fault tolerance, complexity theory, large-scale simulation and compilation, and a final course in reading and evaluating real quantum-computing research.",
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

  return (
    <PillarScope pillar="apex">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([courseListSchema, breadcrumbSchema]) }}
      />

      <ApexHero courses={courses} lessons={lessons} />

      <Section width="wide" aria-labelledby="open-problems-heading">
        <Eyebrow>§ 01 — At the boundary of what&rsquo;s known</Eyebrow>
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
        <Eyebrow>§ 02 — Course index</Eyebrow>
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
    </PillarScope>
  );
}
