import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { Callout } from "@/components/mdx/Callout";
import { Term } from "@/components/mdx/Term";
import { DefinitionBox } from "@/components/mdx/DefinitionBox";
import { TheoremBox } from "@/components/mdx/TheoremBox";
import { ExternalFigure } from "@/components/mdx/ExternalFigure";
import { InteractiveSection } from "@/components/mdx/InteractiveSection";
import { PredictBeforeReveal } from "@/components/mdx/PredictBeforeReveal";
import { LessonHook } from "@/components/narrative/LessonHook";
import { InsightBlock } from "@/components/narrative/InsightBlock";
import { DerivationSteps, DerivationStep } from "@/components/narrative/DerivationSteps";
import { EquationReveal } from "@/components/narrative/EquationReveal";
import { ResearchConnection } from "@/components/narrative/ResearchConnection";
import { HistoricalMoment } from "@/components/narrative/HistoricalMoment";
import { ChallengePrompt } from "@/components/narrative/ChallengePrompt";
import { NextDiscovery } from "@/components/narrative/NextDiscovery";
import { BarChart } from "@/components/visualizations/BarChart";
import { BarChartExplorer } from "@/components/visualizations/BarChartExplorer";
import { EnergyLevelDiagram } from "@/components/visualizations/EnergyLevelDiagram";
import { ParametricCurve } from "@/components/visualizations/ParametricCurve";
import { StaticCircuitDiagram } from "@/components/visualizations/StaticCircuitDiagram";
import { PipelineDiagram } from "@/components/visualizations/PipelineDiagram";
import { MatrixGrid } from "@/components/visualizations/MatrixGrid";
import { MatrixGridExplorer } from "@/components/visualizations/MatrixGridExplorer";

// Markdown tables (from remark-gfm) render as plain `<table>` elements with
// no built-in overflow handling — a wide comparison table would otherwise
// force the whole page to scroll horizontally on narrow viewports. Wrap
// every table in its own horizontally-scrollable container instead.
function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  );
}

const components: MDXComponents = {
  // POLICY: this mapping is reserved for components used broadly across the
  // lesson corpus (roughly ≥10 lessons, or universal like the table wrapper).
  // Every component mapped here is eagerly imported into EVERY one of the
  // ~219 compiled lesson MDX modules' graphs — for the many "use client"
  // components that means every lesson page's client bundle carries them,
  // and every static-generation worker pays their build-memory cost, whether
  // the lesson uses them or not. Narrowly-used components are instead
  // imported explicitly (`import { X } from "@/components/..."`) by the few
  // lessons that use them. This is safe to enforce strictly: a JSX tag that
  // is neither mapped here nor imported by its lesson file fails the build
  // loudly, because `loadLesson` (src/lib/content/lessons.ts) deliberately
  // does NOT catch import/evaluation errors for known slugs — an undefined
  // component throws at render instead of silently 404ing. The invariant is
  // guarded by src/lib/design/__tests__/mdxMapping.test.ts.
  table: Table,
  Callout,
  Term,
  DefinitionBox,
  TheoremBox,
  ExternalFigure,
  InteractiveSection,
  PredictBeforeReveal,
  LessonHook,
  InsightBlock,
  DerivationSteps,
  DerivationStep,
  EquationReveal,
  ResearchConnection,
  HistoricalMoment,
  ChallengePrompt,
  NextDiscovery,
  BarChart,
  BarChartExplorer,
  EnergyLevelDiagram,
  ParametricCurve,
  StaticCircuitDiagram,
  PipelineDiagram,
  MatrixGrid,
  MatrixGridExplorer,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
