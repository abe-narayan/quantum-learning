import { Hero } from "@/components/home/Hero";
import { PhenomenaPreview } from "@/components/home/PhenomenaPreview";
import { PillarsOverview } from "@/components/home/PillarsOverview";
import { LazyWavefunctionHeroExplorer } from "@/components/simulators/wavefunction-explorer/LazyWavefunctionHeroExplorer";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LearningJourney } from "@/components/home/LearningJourney";
import { SimulatorsPreview } from "@/components/home/SimulatorsPreview";
import { ProblemsPreview } from "@/components/home/ProblemsPreview";
import { DailyPuzzle } from "@/components/home/DailyPuzzle";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Container } from "@/components/ui/Container";

export default function Home() {
  return (
    <>
      <Hero />
      <PhenomenaPreview />
      <PillarsOverview />
      <section className="py-20 sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Try it live</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Not a diagram — a real simulation
            </h2>
          </div>
          <div className="mt-10">
            <LazyWavefunctionHeroExplorer />
          </div>
        </Container>
      </section>
      <HowItWorks />
      <LearningJourney />
      <SimulatorsPreview />
      <ProblemsPreview />
      <DailyPuzzle />
      <FinalCTA />
    </>
  );
}
