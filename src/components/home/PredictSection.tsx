import Link from "next/link";
import { Section, Marginalia } from "@/components/ui/Section";
import { Eyebrow, SectionTitle } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { PredictBeforeReveal } from "@/components/mdx/PredictBeforeReveal";
import { getAllLessonsMeta, PREDICTION_LESSON_COUNT } from "@/lib/content/lessons";

/**
 * ============================================================
 * The wager
 * ============================================================
 * The one place on the homepage that asks the reader for something before it
 * gives them anything.
 *
 * The rest of the page can be read. This cannot: the answer does not exist in
 * the DOM until a prediction is committed (see `PredictBeforeReveal`, which
 * compares `correctValue` and never renders it), so a reader who wants to know
 * has to guess first. That is the whole intervention. It is also the honest
 * preview of the product: `PredictBeforeReveal` appears in almost every lesson
 * on the site (`PREDICTION_LESSON_COUNT`, counted from the corpus by the
 * registry generator), so what a visitor does here is what they will spend the
 * course doing, and the homepage was the only page on the site that had never
 * once asked.
 *
 * Placed immediately under the hero, and deliberately about the hero's own
 * simulation rather than about something abstract: the reader has just been
 * told the panel above is a real solver, is told here what it is about to do,
 * commits to a number, and is then sent back up to run it. Curiosity, then
 * experiment. Nothing is unlocked, scored or celebrated, and the reveal is
 * non-punitive by construction, because the point is to make someone notice
 * the gap between their intuition and the arithmetic, not to test them.
 *
 * On the numbers, which have to be right or this section is worse than not
 * shipping it. The hero's `tunneling` preset runs at momentum p = 2, barrier
 * height V0 = 3 and barrier half-width 1 (see the simulator's `presets.ts`),
 * with hbar = m = 1 throughout `lib/quantum`. So E = p^2/2m = 2, the barrier is
 * L = 2 wide, and kappa = sqrt(2m(V0 - E))/hbar = sqrt(2). The rectangular
 * barrier transmission coefficient
 *
 *     T = [1 + V0^2 sinh^2(kappa L) / (4 E (V0 - E))]^-1
 *
 * gives sinh(2.828) = 8.43, and T = 1/(1 + 9 * 71.1 / 8) = 0.0124, i.e. a bit
 * over one percent. Doubling the width to L = 4 gives sinh(5.657) = 143.1 and
 * T = 4.3e-5, smaller by a factor of 285. Both figures are quoted below as
 * "about one in a hundred" and "roughly three hundred times less", which is
 * the precision this formula deserves for a Gaussian packet: the packet is not
 * a plane wave at a single energy, it carries a spread of momenta, and its
 * faster components tunnel disproportionately well, so what the simulator
 * measures sits somewhat above the single-energy figure. The copy says that
 * rather than pretending the two are the same number.
 */
export async function PredictSection() {
  const lessonCount = (await getAllLessonsMeta()).length;

  return (
    <Section width="reading" aria-labelledby="wager-heading">
      <Reveal>
        <Eyebrow>Before you read on</Eyebrow>
        <SectionTitle id="wager-heading" className="mt-3">
          Make a prediction you can lose.
        </SectionTitle>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          The explorer above has a preset called &ldquo;Tunnel through a barrier&rdquo;. It fires
          a particle at a wall it does not have the energy to climb. A ball thrown at a wall
          that tall comes back every single time, with no exceptions and no small print.
        </p>
      </Reveal>

      <PredictBeforeReveal
        question="Fire a quantum particle at a wall it cannot climb. How often does it come out the far side?"
        options={[
          { label: "Never", value: "never" },
          { label: "About 1 time in 100", value: "hundred" },
          { label: "About 1 time in a billion", value: "billion" },
        ]}
        correctValue="hundred"
        explanation="About one time in a hundred, for the barrier in the panel above. Put E = 2 against a barrier of height 3 and width 2 into the rectangular-barrier formula and you get a transmission probability of 0.0124, and the packet in the simulator carries a spread of momenta whose faster components tunnel far better than that, so what you will watch cross is a little more. Not never, and not negligible: this is the effect a scanning tunneling microscope measures, the one that erases a flash memory cell, and the one that lets a nucleus alpha decay. It is also brutally sensitive. Widen that barrier from 2 to 4 and transmission drops by a factor of roughly three hundred, because it decays exponentially with width, not linearly."
      />

      {/* Lessons carrying at least one `PredictBeforeReveal`, over lessons.
          Put that way it answers the question a visitor is actually asking at
          this point, which is whether the wager they just made was a homepage
          gimmick. Both numbers are derived now. The pair was hand-kept until
          2026-08-30, under a comment asking the next person to re-grep when
          the corpus moved. The corpus moved and the sentence did not, so the
          page shipped "213 of the 219" against a real 218: the same failure
          CLAUDE.md records for the hand-typed problem total. The registry
          generator counts it on the pass that already reads every lesson, and
          predictionCount.test.ts fails if the generated figure and a fresh
          scan of the corpus ever disagree again. */}
      <Marginalia className="mt-2">
        Nothing here is graded, and nothing is unlocked. {PREDICTION_LESSON_COUNT} of the{" "}
        {lessonCount} lessons stop and ask you the same way, for the same reason: you remember the
        result you were wrong about.
      </Marginalia>

      <p className="mt-8 text-muted-foreground">
        Now scroll back to the panel and press{" "}
        <span className="font-tech text-foreground">Tunnel through a barrier</span>. Watch the
        packet hit the wall, split, and leave a small piece of itself on the far side. Then read
        the derivation of why the number is what it is, in{" "}
        <Link
          href="/lessons/quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier"
          className="font-medium text-pillar underline-offset-4 hover:underline"
        >
          Tunneling and the finite barrier
        </Link>
        .
      </p>
    </Section>
  );
}
