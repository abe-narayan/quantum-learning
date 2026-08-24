import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CourseList } from "@/components/curriculum/CourseList";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";

export const metadata: Metadata = {
  title: "Hardware",
  description: "How qubits are physically built, controlled, read out, and scaled into real devices.",
};

export default async function HardwarePage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("quantum-hardware");

  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Quantum Hardware"
        title="How qubits become real devices"
        description="The five competing physical platforms used to build real qubits, then the cryogenics, control electronics, and readout that drive and measure them, and the noise and scaling limits that keep any one platform from winning outright. Start with Physical Qubit Platforms — it picks up right after Qubits & Quantum States. Drive real qubit dynamics yourself in the Rabi Explorer (the same driven two-level system behind superconducting, trapped-ion, neutral-atom, and spin-qubit gates), see a photonic qubit's state on the Bloch Sphere Explorer, and watch decoherence itself in the Noise & Decoherence Explorer."
      />

      <div className="mt-12">
        <CourseList courses={courses} lessons={lessons} />
      </div>
    </Container>
  );
}
