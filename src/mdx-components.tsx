import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { Callout } from "@/components/mdx/Callout";
import { KatexHtml } from "@/components/mdx/KatexHtml";
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
// `tabIndex={0}` for the same reason SolutionPanel's display-math container
// documents: a scroll container is focusable-by-default only in Firefox, so
// without it a keyboard-only reader can see the left edge of a wide table
// and has no way to reach the rest.
//
// `role="group"`, not `role="region"`. A region IS a landmark, and this
// wrapper is applied to every markdown table in the corpus with one fixed
// label, so a lesson with several tables put several identically-named
// entries in the reader's landmark list: `quantum-signal-processing` showed
// five "Scrollable table" landmarks, `surface-codes-in-depth` three, five
// other lessons two each. A landmark list whose entries cannot be told apart
// is worse than one entry short — it is the document outline, and these are
// not sections of the document. `group` is not a landmark, so the list goes
// back to naming real page structure, while the focus stop and its
// announcement are unchanged: `aria-label` is honoured on `group` exactly as
// on `region`. That last point is the whole reason this is `group` rather
// than a role-less div — ARIA prohibits naming a `generic` element, so
// dropping the role would silently drop the label too, the trap this codebase
// has already hit on the glossary pillar chip and the mobile A-Z strip.
// It also matches the `role="group"` wrappers the diagram components use.
//
// The label stays generic rather than naming the table. Markdown tables here
// carry no caption and no heading of their own, so the only text available to
// name one is its first header cell, which is routinely "Term", "Gate" or
// "Step" — a name that says less than "Scrollable table" and is wrong more
// often than it is right. A wrong name is worse than a generic one.
function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div
      role="group"
      aria-label="Scrollable table"
      tabIndex={0}
      className="overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
    >
      <table {...props} />
    </div>
  );
}

// `th` was not mapped at all, so remark-gfm's bare `<th>` shipped on all 32
// lesson pages that contain a markdown table — 134 of the corpus's 139 header
// cells with no `scope`. Without it a screen reader moving cell to cell has
// nothing tying a cell to its column, so every data cell is announced as a
// bare value; the worst pages are `quantum-signal-processing` (14 headers),
// `surface-codes-in-depth` (11) and `state-vector-simulation` (7).
//
// `scope="col"` unconditionally, which is safe because of where these come
// from: GFM table syntax has exactly one header row and no row-header
// concept, so remark-gfm can only ever emit column headers. A lesson that
// hand-writes an HTML `<table>` in MDX bypasses this mapping entirely and is
// free to set its own scope.
//
// Props are spread *after* the default so an author-supplied `scope` wins
// rather than being silently overwritten.
//
// Costs nothing against the ≤30-component budget in
// src/lib/design/__tests__/mdxMapping.test.ts: that budget counts *imported*
// names (27 today), and this, like `Table`, is defined in this file.
function TableHeaderCell(props: ComponentPropsWithoutRef<"th">) {
  return <th scope="col" {...props} />;
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
  th: TableHeaderCell,
  // Not used in any authored lesson — injected into every compiled lesson by
  // src/lib/mdx/rehypeKatexHtml.mjs (one per equation), so it MUST stay
  // mapped or every math-bearing lesson fails to render.
  KatexHtml,
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
