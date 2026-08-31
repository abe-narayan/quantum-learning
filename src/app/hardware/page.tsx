import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section, FullBleed } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, Readouts } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CourseList } from "@/components/curriculum/CourseList";
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
import { ControlSignalChainDiagram } from "@/components/visualizations/ControlSignalChainDiagram";
import { HardwarePlatformSchematic } from "@/components/visualizations/HardwarePlatformSchematic";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { pillarVisual } from "@/lib/design/pillars";
import { BASE_URL, buildBreadcrumbSchema, buildCourseListSchema, pillarUrl } from "@/lib/structuredData";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Hardware",
  description: "How qubits are physically built, controlled, read out, and scaled into real devices.",
  path: "/hardware",
});

/**
 * `label` is the visible caption under each schematic; `schematicLabel` is the
 * spoken name of the schematic itself. They are stored separately rather than
 * derived, because the obvious template (`Schematic of a ${label} qubit`) reads
 * "Schematic of a Spin qubit qubit" for the one platform whose caption already
 * ends in the word: four of the five captions are adjectives and the fifth is a
 * noun phrase, so no single template covers all of them.
 */
const PLATFORMS = [
  { variant: "superconducting" as const, label: "Superconducting", schematicLabel: "A rectangular chip substrate carrying a loop of superconducting wire, with a Josephson junction drawn as a small cross on the left arm and a capacitor as a gap on the right arm" },
  { variant: "trapped-ion" as const, label: "Trapped ion", schematicLabel: "Two long RF electrodes above and below, a DC endcap electrode at each end, and five ions spaced along the dashed trap axis between them as one chain" },
  { variant: "neutral-atom" as const, label: "Neutral atom", schematicLabel: "A regular grid of optical tweezer sites, some holding an atom and drawn filled, the rest empty" },
  { variant: "photonic" as const, label: "Photonic", schematicLabel: "A photon travelling left to right along a beam line, with its field oscillation shown head-on as two perpendicular axes labelled horizontal for ket zero and vertical for ket one" },
  { variant: "spin-qubit" as const, label: "Spin qubit", schematicLabel: "A semiconductor substrate with gate electrodes on top, and a single electron confined in the well they define beneath them" },
];

/**
 * Hardware reads as a schematic: heavy technical-voice metadata up top (a
 * real readout strip, not prose pretending to be data), a full-bleed
 * engineering diagram of the actual drive/readout signal chain, and a row
 * of the five competing platform schematics before the curriculum. This is
 * the pillar's own composition language, device-diagram, not editorial,
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
  const field = pillarVisual("quantum-hardware");

  // One derivation over the real registries for every figure this page quotes
  // about itself, and for the primary action (the real first course, in
  // curriculum order), see `pillarFacts`, shared with the other three track
  // pages, and mechanics/page.tsx for why `getCourseHref` (→
  // `/courses/<slug>`) is the right destination.
  const facts = pillarFacts(courses, lessons);
  const { firstCourse, firstLesson } = facts;
  const heroHref = firstCourse ? getCourseHref(firstCourse.slug, firstLesson?.slug) : "/learn";

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
            somewhere. This is that somewhere.
          </Lede>
          <p className="mt-4 max-w-lede text-sm leading-relaxed text-muted-foreground">
            The five competing physical platforms used to build real qubits, then the dilution
            fridges, control electronics, and readout hardware that cool, drive, and measure
            them, and the noise and scaling limits that keep any one platform from winning
            outright.
          </p>
        </Reveal>

        {/* The primary CTA sits here, right after the intro paragraph, ahead
            of the tier ladder and briefing: measured with
            `scripts/audit/orientation.mjs --widths 375`, the only forward
            actions this page offered above the 812px fold were the ladder's
            incidental cross-track links (Software, Mechanics, Computing),
            never the actual "start learning" button. The ladder and briefing
            are still the very next things a reader meets. */}
        {firstCourse ? (
          <Reveal delay={80} className="mt-7 block">
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

        <Reveal delay={100}>
          {/* Same four-rung ladder, same position, as every other pillar
              page: it is the one element that carries the hierarchy between
              them, so it cannot be styled per page. */}
          <TierLadder pillar="quantum-hardware" className="mt-8" />

          <PillarBriefing
            className="mt-8"
            facts={facts}
            outcome="Explain why a superconducting chip and a trapped-ion trap solve the same problem in almost opposite ways, and what each one's coherence, gate speed and wiring budget actually costs."
          />
        </Reveal>

        <Reveal delay={120}>
          <Readouts className="mt-8" items={pillarReadoutItems(facts)} />
          {/* The track's own instrument readouts, kept separate from the
              shared course/lesson/hour row above: these describe the physical
              regime this track lives in, not the size of its curriculum. */}
          <Readouts
            className="mt-6"
            items={[
              { label: "Platforms compared", value: PLATFORMS.length },
              { label: "Coldest stage", value: "~15", unit: "mK" },
              { label: "Cooling stages modeled", value: 3 },
            ]}
          />
        </Reveal>

        <p className="mt-6 max-w-lede border-l-2 border-pillar-edge pl-4 text-xs leading-relaxed text-subtle-foreground">
          The wiring lighting up behind this page is not decoration either: {field.fieldCaption.toLowerCase()},
          the finite delay between &ldquo;signal sent&rdquo; and &ldquo;qubit responds&rdquo; that Control &amp;
          Readout derives in full.
        </p>
      </Section>

      <Section width="full" bleed tight className="border-y border-border bg-surface-muted/30">
        <div className="mx-auto flex max-w-4xl justify-center px-4 sm:px-6 lg:px-8">
          <Reveal y={20} className="block w-full">
            <Instrument
              label="Drive / readout signal chain"
              readout={
                <span className="font-tech text-xs text-subtle-foreground">300 K → 15 mK → 300 K</span>
              }
              footnote="Every gate starts as a room-temperature microwave tone, gets attenuated at each cooling stage on the way down to the qubit, and comes back up through a cryogenic amplifier: the physical path Control & Readout derives in full."
              // Layout only. This used to read `flex justify-center p-4
              // sm:p-6`, and it rendered correctly by luck rather than by
              // design: `cn()` is a plain join with no tailwind-merge, so
              // those paddings landed *beside* the body's own `p-4 sm:p-5`
              // with equal specificity in the same layer, and the winner was
              // whichever the compiled stylesheet emitted last. It happened to
              // be the right one (`.sm\:p-5` at byte 118924, `.sm\:p-6` at
              // 118986) and `p-4` was a no-op against the identical default.
              // The same shape one layer over — `bodyClassName="p-0"` on the
              // two homepage heroes — lost that coin toss and silently did
              // nothing for as long as it existed.
              //
              // So the padding is gone rather than annotated: the 4px it won
              // at `sm` is invisible under a diagram already capped at
              // `max-w-[280px] sm:max-w-xs` and centred twice over, and
              // without it this instrument's body is the same `p-4 sm:p-5` as
              // every other instrument on the site. That leaves no
              // `bodyClassName` in the tree that overlaps the body's own
              // utilities, which is the invariant recorded on the prop in
              // ui/Panel.tsx.
              bodyClassName="flex justify-center"
            >
              <div className="mx-auto w-full max-w-[280px] sm:max-w-xs">
                <ControlSignalChainDiagram ariaLabel="The drive and readout signal chain, from room-temperature electronics down through the dilution refrigerator's cooling stages to the qubit chip, and back." />
              </div>
            </Instrument>
          </Reveal>
        </div>
      </Section>

      <Section width="wide" tight aria-labelledby="hardware-platforms-heading">
        <Reveal>
          <Eyebrow>Platform comparison</Eyebrow>
          <SectionTitle level={2} size="sm" id="hardware-platforms-heading" className="mt-3">
            Five ways to build a qubit
          </SectionTitle>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Five platforms, one problem: each encodes a qubit in a different physical degree of
            freedom. The engineering tradeoffs (coherence, gate speed, connectivity, scale) are
            what <em>Physical Qubit Platforms</em> compares directly.
          </p>
        </Reveal>
        <Reveal delay={80} className="mt-6 block">
          {/* `grid-cols-1` is not the no-op it looks like, and the `minmax(0,
              1fr)` inside it is the whole point. With no base `grid-cols-*`
              this grid falls back to a single *implicit* column sized `auto`,
              and an `auto` track is sized by its max-content: each cell holds
              a `HardwarePlatformSchematic`, a 320px intrinsic SVG inside a
              `p-4` bordered frame, so the track measured 354px inside a 288px
              container at a 320px viewport. Nothing scrolled sideways to
              reveal it, because `body { overflow-x: clip }` (globals.css)
              swallowed the 66px overhang, and the schematic's own
              `overflow-x-auto` frame never engaged either: the frame grew
              rather than its content overflowing it. So a fifth of every
              platform diagram was silently unreachable on a phone. Tailwind's
              `grid-cols-1` is `repeat(1, minmax(0, 1fr))`, and that `0`
              minimum is what lets the track be capped by the container instead
              of by max-content; the frame then overflows properly and its
              horizontal scroll works.

              `lg:grid-cols-3`, not `-5`. Five columns is what the section
              wants to say ("Five ways to build a qubit") and it does not fit:
              inside `max-w-6xl` less `lg:px-8`, five tracks are 205px each,
              against a frame that needs 346px. Measured at both 1280 and
              1512, every one of the five diagrams was showing 203px of 352
              and hiding 149px, so a reader comparing platforms saw five
              half-diagrams with the distinguishing labels cut off. The frames
              did scroll, but asking someone to scroll five separate boxes to
              read one comparison is not a comparison. Three tracks give 352px
              and the figure fits with room, which is also why the schematic's
              frame padding went from `p-4` to `p-3`. Two rows of a five-item
              set is the cost, and it is the cheaper one.

              `xl:`, not `lg:`. Three tracks need 344px and the container is
              `max-w-6xl`, so the third column only pays for itself once the
              viewport clears roughly 1130px: at exactly 1024, `lg:grid-cols-3`
              gives 309px tracks and clips 37px again. Between 1024 and 1280 two
              columns at ~472px is both correct and roomier. Re-measure with
              `scripts/audit/responsive.mjs` if the container width or the
              schematic's intrinsic 320px ever changes; the three numbers that
              have to stay in order are track width, 320 + 2*padding + border,
              and nothing else. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {PLATFORMS.map((platform) => (
              <div key={platform.variant} className="flex min-w-0 flex-col items-center gap-2">
                {/* Second half of the same clip, and it has to be here rather
                    than in the component. `items-center` on this column gives
                    every child `align-self: center`, which resolves a block
                    child's `width: auto` to fit-content, so the schematic's
                    own `overflow-x-auto` frame sized itself to its 320px SVG
                    plus 32px of `p-4` (352px) instead of to the 288px cell,
                    and overflowed *without* scrolling: the frame grew, so its
                    content never exceeded it. `w-full` on a wrapper resolves
                    against the flex container's content box instead, which
                    puts the frame back at the cell width and lets the SVG
                    overflow it properly, which is what makes the frame's
                    horizontal scroll engage. `min-w-0` on the column is what
                    keeps that cell from being floored at its own max-content
                    in the first place. */}
                <div className="w-full min-w-0">
                  <HardwarePlatformSchematic
                    variant={platform.variant}
                    ariaLabel={platform.schematicLabel}
                  />
                </div>
                <span className="tech-label text-subtle-foreground">
                  {platform.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section width="reading" tight aria-labelledby="hardware-start-heading">
        <Reveal>
          <PillarLessonStrip
            courses={courses}
            lessons={lessons}
            headingId="hardware-start-heading"
          />
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

      <Section width="reading" tight aria-labelledby="hardware-next-heading">
        <Reveal>
          <PillarNext pillar="quantum-hardware" headingId="hardware-next-heading" />
        </Reveal>
      </Section>
    </PillarScope>
  );
}
