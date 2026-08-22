import { Hero } from "@/components/home/Hero";
import { LearningJourney } from "@/components/home/LearningJourney";
import { Philosophy } from "@/components/home/Philosophy";
import { SimulatorsPreview } from "@/components/home/SimulatorsPreview";
import { ProblemsPreview } from "@/components/home/ProblemsPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <LearningJourney />
      <Philosophy />
      <SimulatorsPreview />
      <ProblemsPreview />
    </>
  );
}
