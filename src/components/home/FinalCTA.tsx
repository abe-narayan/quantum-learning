import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="border-t border-border py-20 sm:py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Ready to build real intuition for quantum physics?
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/learn" size="lg">
              Start learning
            </Button>
            <Button href="/simulators" size="lg" variant="secondary">
              Try a simulator first
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
