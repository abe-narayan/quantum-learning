import { PillarScope } from "@/components/field/PillarScope";
import { Hero } from "@/components/home/Hero";
import { EntryChooser } from "@/components/home/EntryChooser";
import { PredictSection } from "@/components/home/PredictSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { SiteContents } from "@/components/home/SiteContents";
import { ActPlate } from "@/components/home/ActPlate";
import { MechanicsSection } from "@/components/home/MechanicsSection";
import { ComputingSection } from "@/components/home/ComputingSection";
import { HardwareSection } from "@/components/home/HardwareSection";
import { SoftwareSection } from "@/components/home/SoftwareSection";
import { MasterySection } from "@/components/home/MasterySection";
import { ApexSection } from "@/components/home/ApexSection";

/**
 * ============================================================
 * The homepage
 * ============================================================
 * An orientation layer, then a descent into a laboratory.
 *
 * The page was a three-act narrative descent and nothing else, and the descent
 * is good: it is what makes this read as a laboratory rather than a product
 * page, and it is kept below. What it could not do was orient anybody. The
 * first screen was measured at both widths this site promises to work at:
 *
 *   1440x900  the only actions on screen were the hero simulator's own preset
 *             buttons. "Start learning" was below the fold everywhere except a
 *             small button in the navbar.
 *   375x812   zero actions on screen. Three paragraphs of prose.
 *
 * So the four questions a first-time visitor actually has (what is this, does
 * it cost anything, where do I begin, what else is in here) were answered
 * either late, quietly, or not at all, on a page that answered every question
 * about the *subject* beautifully. The first four sections below are the fix,
 * and they are ordered as those questions are asked:
 *
 *   What is this   `Hero`            the hook, the price, and the primary
 *                                    action, all inside the first screen at
 *                                    375px and 1440px, with the live solver
 *                                    beside them as support rather than as the
 *                                    whole screen.
 *   Which am I     `EntryChooser`    four self-descriptions, each a link
 *                                    straight to the right page. No account,
 *                                    no modal, no wizard. This is the single
 *                                    highest-value section on the page: it
 *                                    turns "what do I click" into "which of
 *                                    these am I".
 *   Experiment     `PredictSection`  the page asks for something before it
 *                                    gives anything: commit to a number, then
 *                                    go run the simulation that settles it.
 *                                    It stays directly under the chooser
 *                                    because it is about the hero's own panel
 *                                    and refers to it by name. It is also the
 *                                    only honest preview of the product, since
 *                                    `PredictBeforeReveal` is what nearly
 *                                    every lesson does.
 *   What is a      `HowItWorks`      the four beats of a lesson, one real
 *   lesson                           lesson section running live, and the six
 *                                    tracks in curriculum order with the rung
 *                                    each starts at.
 *   What else      `SiteContents`    every major destination in one click,
 *                                    with a derived figure for each. This
 *                                    supersedes `ExploreSection`, which
 *                                    covered five of them from a slot between
 *                                    Act II and Act III.
 *
 * Then the descent, unchanged:
 *
 *   Understand  Act I    Mechanics, then Computing.
 *   Build       Act II   Hardware, then Software.
 *   Research    Act III  Mastery, then Apex, and the closing action.
 *
 * The three `ActPlate`s are what turn six sections into three movements. They
 * also carry the background's caption, once per act at the point the
 * environment actually changes, instead of the six near-identical `Field: ...`
 * lines the track sections used to print.
 *
 * No `pillar` prop here, and `regime="journey"` is explicit rather than relied
 * on as a fallback: `journey` is the homepage's own narrative (see
 * fieldStore.ts and PillarScope's own comment) and would otherwise be exactly
 * the kind of silent default that let it leak onto unrelated routes, see
 * docs/UX_REVIEW.md P1-2.
 *
 * Individual track sections tint themselves via `PillarBand` (a bare
 * `data-pillar` wrapper) rather than nesting another `PillarScope`, which would
 * fight over which regime the canvas field renders. Each band also stamps
 * `data-journey-stop`, which is how the crossfade tracks *this* order rather
 * than the raw fraction of the document scrolled; `measureStops` in
 * `QuantumField` reads those from the DOM, so the orientation sections in front
 * of the first band shift where the stops sit and nothing has to be told about
 * it.
 *
 * Every section here is a Server Component, and the only client code the page
 * adds over a static document is `PredictBeforeReveal`, which imports nothing
 * but React, plus the deferred hero simulator. The registries stay on the
 * server: see `src/lib/design/__tests__/clientBoundary.test.ts` and
 * docs/DEPLOYMENT.md.
 */
export default function Home() {
  return (
    <PillarScope regime="journey">
      <Hero />
      <EntryChooser />
      <PredictSection />
      <HowItWorks />
      <SiteContents />

      <ActPlate
        id="act-understand"
        act="I"
        title="Understand what a quantum state is"
        // "Neither assumes you have already met the other" was false, and
        // falsifiable from the data one click away: two Mechanics courses list
        // a Computing course as a prerequisite (see the notes in
        // curriculum.ts), which /mechanics' own briefing prints and its course
        // rail draws. Either track can still be *started* first, which is the
        // useful half of the old claim and the half that is true.
        premise="Two tracks. The first is the physics on its own terms, the actual mathematics reality obeys; the second turns that mathematics into a machine you can program. Either one can be started first, and each borrows from the other where it genuinely needs it."
        fieldPlain="From here the moving pattern behind the text is the subject, not decoration: a wave packet spreading out, handing over to a single qubit turning as you scroll."
        fieldTechnical="Regimes wave then state: free-particle probability density, crossfading into Bloch-sphere precession."
      />
      <MechanicsSection />
      <ComputingSection />

      <ActPlate
        id="act-build"
        act="II"
        title="Build the machine that has to run it"
        premise="Where the algebra stops being abstract. Every qubit has to become a physical object cold enough to stay coherent, and every circuit has to survive a compiler before it reaches one."
        fieldPlain="The background becomes the shape of a chip: qubits wired into a grid, then gates streaming left to right along the wires."
        fieldTechnical="Regimes lattice then graph: a coupled-qubit array under control pulses, crossfading into an executing circuit."
      />
      <HardwareSection />
      <SoftwareSection />

      <ActPlate
        id="act-research"
        act="III"
        title="Reach the edge of what is known"
        premise="The last two tracks stop introducing things. They assume every track above them and keep going until the answers run out."
        fieldPlain="The background thins: dense structure below the horizon for what has been settled, sparse and barely connected points above it for what has not."
        fieldTechnical="Regimes operator then frontier: the magnitude structure of a unitary, crossfading into the known/open horizon."
      />
      <MasterySection />
      <ApexSection />
    </PillarScope>
  );
}
