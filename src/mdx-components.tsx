import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { Callout } from "@/components/mdx/Callout";
import { ExternalFigure } from "@/components/mdx/ExternalFigure";
import { InteractiveSection } from "@/components/mdx/InteractiveSection";
import { PredictBeforeReveal } from "@/components/mdx/PredictBeforeReveal";
import { BarChart } from "@/components/visualizations/BarChart";
import { BarChartExplorer } from "@/components/visualizations/BarChartExplorer";
import { EnergyLevelDiagram } from "@/components/visualizations/EnergyLevelDiagram";
import { PotentialDiagram } from "@/components/visualizations/PotentialDiagram";
import { ParametricCurve } from "@/components/visualizations/ParametricCurve";
import { StaticCircuitDiagram } from "@/components/visualizations/StaticCircuitDiagram";
import { PipelineDiagram } from "@/components/visualizations/PipelineDiagram";
import { MeasurementTree } from "@/components/visualizations/MeasurementTree";
import { HardwarePlatformSchematic } from "@/components/visualizations/HardwarePlatformSchematic";
import { DilutionRefrigeratorDiagram } from "@/components/visualizations/DilutionRefrigeratorDiagram";
import { ControlSignalChainDiagram } from "@/components/visualizations/ControlSignalChainDiagram";
import { DispersiveReadoutDiagram } from "@/components/visualizations/DispersiveReadoutDiagram";
import { RydbergBlockadeDiagram } from "@/components/visualizations/RydbergBlockadeDiagram";
import { LogicalQubitPatchDiagram } from "@/components/visualizations/LogicalQubitPatchDiagram";
import { CrosstalkDiagram } from "@/components/visualizations/CrosstalkDiagram";
import { OrbitalShapePlot } from "@/components/visualizations/OrbitalShapePlot";
import { VectorDiagram } from "@/components/visualizations/VectorDiagram";
import { VectorDiagramExplorer } from "@/components/visualizations/VectorDiagramExplorer";
import { GraphDiagram } from "@/components/visualizations/GraphDiagram";
import { MatrixGrid } from "@/components/visualizations/MatrixGrid";
import { MatrixGridExplorer } from "@/components/visualizations/MatrixGridExplorer";
import { ExchangeDiagram } from "@/components/visualizations/ExchangeDiagram";
import { ExchangeDiagramExplorer } from "@/components/visualizations/ExchangeDiagramExplorer";

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
  table: Table,
  Callout,
  ExternalFigure,
  InteractiveSection,
  PredictBeforeReveal,
  BarChart,
  BarChartExplorer,
  EnergyLevelDiagram,
  PotentialDiagram,
  ParametricCurve,
  StaticCircuitDiagram,
  PipelineDiagram,
  MeasurementTree,
  HardwarePlatformSchematic,
  DilutionRefrigeratorDiagram,
  ControlSignalChainDiagram,
  DispersiveReadoutDiagram,
  RydbergBlockadeDiagram,
  LogicalQubitPatchDiagram,
  CrosstalkDiagram,
  OrbitalShapePlot,
  VectorDiagram,
  VectorDiagramExplorer,
  GraphDiagram,
  MatrixGrid,
  MatrixGridExplorer,
  ExchangeDiagram,
  ExchangeDiagramExplorer,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
