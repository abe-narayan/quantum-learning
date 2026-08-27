import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede } from "@/components/ui/Typography";
import { LazyConceptMapExplorer } from "@/components/map/LazyConceptMapExplorer";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "Concept Map",
  description: "An interactive map of how QuantumLearn's key concepts depend on each other, from qubits to algorithms to hardware.",
  path: "/map",
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Concept Map", url: `${BASE_URL}/map` },
]);

export default async function MapPage() {
  const lessons = await getAllLessonsMeta();
  const lessonTitles = Object.fromEntries(lessons.map((lesson) => [lesson.slug, lesson.title]));
  // Difficulty per lesson, so the map can show how hard each concept is —
  // the one signal the review found missing from this page entirely. It has
  // to be computed here rather than inside the map: this is the only place
  // in the chain that can read the lesson corpus (a server-only `fs` walk),
  // and shipping it to the client component would mean shipping the corpus.
  // ConceptMapExplorer resolves each concept to the hardest of its linked
  // lessons and renders it through the shared `DifficultyMark` ladder.
  const lessonDifficulty = Object.fromEntries(
    lessons.map((lesson) => [lesson.slug, lesson.difficulty]),
  );

  return (
    // No single pillar — the map spans and connects all six — so it gets
    // the neutral `atlas` reference environment rather than the homepage's
    // curriculum-order crossfade. See docs/UX_REVIEW.md P1-2.
    <PillarScope regime="atlas">
      <Section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <Eyebrow>Map</Eyebrow>
        <SectionTitle level={1} size="xl" className="mt-3">
          The concept map
        </SectionTitle>
        {/* One plain sentence, first. The page used to open with a four-line
            paragraph above a graph of ~90 nodes, which told a newcomer what
            was on the map but not what the picture *was* or where to click.
            The explorer immediately below carries the first actions. */}
        <Lede className="mt-4">
          This is a map of every idea on QuantumLearn and what you need to understand before each
          one.
        </Lede>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
          It spans all six pillars — Quantum Mechanics, Quantum Computing, Quantum Hardware,
          Quantum Software, Quantum Mastery and Apex. Select any concept for its definition, the
          lessons that teach it, the full chain of what comes first, and what it unlocks next.
          Read it as a graph or as a plain list, whichever you prefer.
        </p>

        <div className="mt-10">
          <LazyConceptMapExplorer lessonTitles={lessonTitles} lessonDifficulty={lessonDifficulty} />
        </div>
      </Section>
    </PillarScope>
  );
}
