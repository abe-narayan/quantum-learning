import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About",
  description: "What QuantumLearn is, and who it's built for.",
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="About"
        title="About QuantumLearn"
        description="QuantumLearn is a platform for teaching real quantum computing to advanced high-school and early-college students."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold text-foreground">Our approach</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We treat quantum computing as a serious subject, not a novelty.
            Lessons build the underlying math and physics before introducing
            algorithms, and every concept is paired with an interactive
            simulator so intuition comes from direct experimentation, not
            just reading.
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-foreground">Who it&rsquo;s for</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Students with a solid grounding in algebra and an interest in
            physics or computer science — no prior quantum mechanics or
            linear algebra required, though it helps.
          </p>
        </Card>
      </div>
    </Container>
  );
}
