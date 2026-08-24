import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/Callout";
import { InteractiveSection } from "@/components/mdx/InteractiveSection";
import { BarChart } from "@/components/visualizations/BarChart";
import { BarChartExplorer } from "@/components/visualizations/BarChartExplorer";
import { EnergyLevelDiagram } from "@/components/visualizations/EnergyLevelDiagram";
import { PotentialDiagram } from "@/components/visualizations/PotentialDiagram";
import { ParametricCurve } from "@/components/visualizations/ParametricCurve";
import { StaticCircuitDiagram } from "@/components/visualizations/StaticCircuitDiagram";
import { PipelineDiagram } from "@/components/visualizations/PipelineDiagram";
import { MeasurementTree } from "@/components/visualizations/MeasurementTree";
import { HardwarePlatformSchematic } from "@/components/visualizations/HardwarePlatformSchematic";
import { OrbitalShapePlot } from "@/components/visualizations/OrbitalShapePlot";
import { VectorDiagram } from "@/components/visualizations/VectorDiagram";
import { VectorDiagramExplorer } from "@/components/visualizations/VectorDiagramExplorer";
import { GraphDiagram } from "@/components/visualizations/GraphDiagram";
import { MatrixGrid } from "@/components/visualizations/MatrixGrid";
import { MatrixGridExplorer } from "@/components/visualizations/MatrixGridExplorer";
import { ExchangeDiagram } from "@/components/visualizations/ExchangeDiagram";
import { ExchangeDiagramExplorer } from "@/components/visualizations/ExchangeDiagramExplorer";

const components: MDXComponents = {
  Callout,
  InteractiveSection,
  BarChart,
  BarChartExplorer,
  EnergyLevelDiagram,
  PotentialDiagram,
  ParametricCurve,
  StaticCircuitDiagram,
  PipelineDiagram,
  MeasurementTree,
  HardwarePlatformSchematic,
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
