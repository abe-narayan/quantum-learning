import { PillarScope } from "@/components/field/PillarScope";
import { Hero } from "@/components/home/Hero";
import { PredictSection } from "@/components/home/PredictSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ActPlate } from "@/components/home/ActPlate";
import { MechanicsSection } from "@/components/home/MechanicsSection";
import { ComputingSection } from "@/components/home/ComputingSection";
import { HardwareSection } from "@/components/home/HardwareSection";
import { SoftwareSection } from "@/components/home/SoftwareSection";
import { ExploreSection } from "@/components/home/ExploreSection";
import { MasterySection } from "@/components/home/MasterySection";
import { ApexSection } from "@/components/home/ApexSection";

/**
 * ============================================================
 * The homepage
 * ============================================================
 * A descent into a laboratory, not a table of contents.
 *
 * The page used to be the hero plus the six tracks, in order, each announcing
 * itself the same way. Everything in it was true and specific, and it still
 * read as a list, because a reader arriving cold was given six equally-weighted
 * subjects and no reason why one followed another. The arc below replaces the
 * list with a sequence that has somewhere to go:
 *
 *   Curiosity   `Hero`           a real solver, running, beside a claim about
 *                                what this site is and who is allowed to use it.
 *   Experiment  `PredictSection` the page asks for something before it gives
 *                                anything: commit to a number, then go run the
 *                                simulation that settles it. This is also the
 *                                only honest preview of the product, since
 *                                `PredictBeforeReveal` is what nearly every
 *                                lesson does (`PREDICTION_LESSON_COUNT`).
 *                                The literal "213" that stood here was the
 *                                same stale figure PredictSection.tsx records
 *                                having shipped on the page itself; a count
 *                                is no safer to hand-type in a comment.
 *   Orientation `HowItWorks`     what is actually behind a link, which door is
 *                                yours, and in what order the six tracks come.
 *   Understand  Act I            Mechanics, then Computing.
 *   Build       Act II           Hardware, then Software.
 *   Explore     `ExploreSection` the one section that is not a step: the order
 *                                is a recommendation, and here is how to leave it.
 *   Research    Act III          Mastery, then Apex, and the closing action.
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
 * `data-journey-stop`, which is how the crossfade now tracks *this* order
 * rather than the raw fraction of the document scrolled: with three sections
 * ahead of the first track and a detour in the middle, those two stopped being
 * the same thing. See PillarBand and `measureStops` in QuantumField.
 *
 * Every section here is a Server Component, and the only client code the page
 * adds over the previous version is `PredictBeforeReveal`, which imports
 * nothing but React. The registries stay on the server: see
 * `src/lib/design/__tests__/clientBoundary.test.ts` and docs/DEPLOYMENT.md.
 */
export default function Home() {
  return (
    <PillarScope regime="journey">
      <Hero />
      <PredictSection />
      <HowItWorks />

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

      <ExploreSection />

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
