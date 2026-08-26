import { PillarScope } from "@/components/field/PillarScope";
import { Hero } from "@/components/home/Hero";
import { MechanicsSection } from "@/components/home/MechanicsSection";
import { ComputingSection } from "@/components/home/ComputingSection";
import { HardwareSection } from "@/components/home/HardwareSection";
import { SoftwareSection } from "@/components/home/SoftwareSection";
import { MasterySection } from "@/components/home/MasterySection";
import { ApexSection } from "@/components/home/ApexSection";

/**
 * The homepage is a descent through the curriculum, not a stack of marketing
 * sections: a real, manipulable phenomenon first (the hero's live wavefunction
 * simulation), then the six pillars in learning order, each placed where the
 * background field's `journey` crossfade (see src/components/field/regimes.ts)
 * is dominated by that pillar's own environment — wave, then state, then
 * lattice, then graph, then operator, then frontier — so scrolling the page
 * and descending the curriculum are the same motion. Apex, the terminal
 * pillar, carries the page's one closing call to action.
 *
 * No `pillar` prop here, and `regime="journey"` is explicit rather than
 * relied on as a fallback: `journey` is the homepage's own narrative (see
 * fieldStore.ts and PillarScope's own comment) and would otherwise be
 * exactly the kind of silent default that let it leak onto unrelated routes
 * — see docs/UX_REVIEW.md P1-2. Individual sections below tint themselves
 * via `PillarBand` (a bare `data-pillar` wrapper) rather than nesting
 * another PillarScope, which would fight over which regime the canvas field
 * renders — see PillarBand's own comment.
 */
export default function Home() {
  return (
    <PillarScope regime="journey">
      <Hero />
      <MechanicsSection />
      <ComputingSection />
      <HardwareSection />
      <SoftwareSection />
      <MasterySection />
      <ApexSection />
    </PillarScope>
  );
}
