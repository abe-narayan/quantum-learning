import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section, FullBleed } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, Readouts } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion/Reveal";
import { CourseList } from "@/components/curriculum/CourseList";
import { ControlSignalChainDiagram } from "@/components/visualizations/ControlSignalChainDiagram";
import { HardwarePlatformSchematic } from "@/components/visualizations/HardwarePlatformSchematic";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { BASE_URL, buildBreadcrumbSchema, buildCourseListSchema, pillarUrl } from "@/lib/structuredData";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Hardware",
  description: "How qubits are physically built, controlled, read out, and scaled into real devices.",
  path: "/hardware",
});

const PLATFORMS = [
  { variant: "superconducting" as const, label: "Superconducting" },
  { variant: "trapped-ion" as const, label: "Trapped ion" },
  { variant: "neutral-atom" as const, label: "Neutral atom" },
  { variant: "photonic" as const, label: "Photonic" },
  { variant: "spin-qubit" as const, label: "Spin qubit" },
];

/**
 * Hardware reads as a schematic: heavy technical-voice metadata up top (a
 * real readout strip, not prose pretending to be data), a full-bleed
 * engineering diagram of the actual drive/readout signal chain, and a row
 * of the five competing platform schematics before the curriculum. This is
 * the pillar's own composition language — device-diagram, not editorial —
 * distinct from Mechanics' reading column and Computing's split. See those
 * page files for why the four pillars don't share one template.
 */
export default async function HardwarePage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("quantum-hardware");
  const url = pillarUrl("quantum-hardware");
  const courseListSchema = buildCourseListSchema(courses.map((course) => ({ course, url })));
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Hardware", url },
  ]);

  return (
    <PillarScope pillar="quantum-hardware">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([courseListSchema, breadcrumbSchema]) }}
      />

      <Section width="reading">
        <Reveal>
          <Eyebrow>Quantum Hardware</Eyebrow>
          <SectionTitle level={1} size="xl" className="mt-4">
            Where the math becomes a physical machine
          </SectionTitle>
          <Lede className="mt-5">
            Every abstract qubit from Quantum Computing has to become a physical object
            somewhere — this is that somewhere.
          </Lede>
          <p className="mt-4 max-w-[42rem] text-sm leading-relaxed text-muted-foreground">
            The five competing physical platforms used to build real qubits, then the dilution
            fridges, control electronics, and readout hardware that cool, drive, and measure
            them, and the noise and scaling limits that keep any one platform from winning
            outright. Start with <em>Physical Qubit Platforms</em> — it picks up right after
            Qubits &amp; Quantum States.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <Readouts
            className="mt-8"
            items={[
              { label: "Platforms compared", value: PLATFORMS.length },
              { label: "Coldest stage", value: "~15", unit: "mK" },
              { label: "Cooling stages modeled", value: 3 },
            ]}
          />
        </Reveal>
      </Section>

      <Section width="full" bleed tight className="border-y border-border bg-surface-muted/30">
        <div className="mx-auto flex max-w-4xl justify-center px-4 sm:px-6 lg:px-8">
          <Reveal y={20} className="block w-full">
            <Instrument
              label="Drive / readout signal chain"
              readout={
                <span className="font-tech text-xs text-subtle-foreground">300 K → 15 mK → 300 K</span>
              }
              footnote="Every gate starts as a room-temperature microwave tone, gets attenuated at each cooling stage on the way down to the qubit, and comes back up through a cryogenic amplifier — the physical path Control & Readout derives in full."
              bodyClassName="flex justify-center p-4 sm:p-6"
            >
              <div className="mx-auto w-full max-w-[280px] sm:max-w-xs">
                <ControlSignalChainDiagram ariaLabel="The drive and readout signal chain, from room-temperature electronics down through the dilution refrigerator's cooling stages to the qubit chip, and back." />
              </div>
            </Instrument>
          </Reveal>
        </div>
      </Section>

      <Section width="wide" tight>
        <Reveal>
          <p className="tech-label">Platform comparison</p>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Five platforms, one problem: each encodes a qubit in a different physical degree of
            freedom. The engineering tradeoffs — coherence, gate speed, connectivity, scale — are
            what <em>Physical Qubit Platforms</em> compares directly.
          </p>
        </Reveal>
        <Reveal delay={80} className="mt-6 block">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PLATFORMS.map((platform) => (
              <div key={platform.variant} className="flex flex-col items-center gap-2">
                <HardwarePlatformSchematic
                  variant={platform.variant}
                  ariaLabel={`Schematic of a ${platform.label} qubit`}
                />
                <span className="font-tech text-[0.65rem] uppercase tracking-wide text-subtle-foreground">
                  {platform.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section width="wide" tight aria-labelledby="hardware-curriculum-heading">
        <Reveal>
          <Eyebrow>Curriculum</Eyebrow>
          <SectionTitle level={2} size="lg" id="hardware-curriculum-heading" className="mt-3">
            {courses.length} courses, platform to system
          </SectionTitle>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Physical platforms, then the control and readout engineering, then the noise and
            scaling limits that decide what&rsquo;s actually buildable.
          </p>
        </Reveal>
      </Section>

      <FullBleed>
        <div className="relative border-y border-border">
          <div
            aria-hidden="true"
            data-decorative=""
            className="pointer-events-none absolute inset-0 grid-paper opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          />
          <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <Reveal>
              <CourseList courses={courses} lessons={lessons} />
            </Reveal>
          </div>
        </div>
      </FullBleed>
    </PillarScope>
  );
}
