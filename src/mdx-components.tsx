import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/Callout";
import { InteractiveSection } from "@/components/mdx/InteractiveSection";
import { BarChart } from "@/components/visualizations/BarChart";
import { EnergyLevelDiagram } from "@/components/visualizations/EnergyLevelDiagram";
import { PotentialDiagram } from "@/components/visualizations/PotentialDiagram";
import { ParametricCurve } from "@/components/visualizations/ParametricCurve";
import { StaticCircuitDiagram } from "@/components/visualizations/StaticCircuitDiagram";
import { PipelineDiagram } from "@/components/visualizations/PipelineDiagram";
import { MeasurementTree } from "@/components/visualizations/MeasurementTree";
import { HardwarePlatformSchematic } from "@/components/visualizations/HardwarePlatformSchematic";
import { OrbitalShapePlot } from "@/components/visualizations/OrbitalShapePlot";
import { VectorDiagram } from "@/components/visualizations/VectorDiagram";
import { GraphDiagram } from "@/components/visualizations/GraphDiagram";

const components: MDXComponents = {
  Callout,
  InteractiveSection,
  BarChart,
  EnergyLevelDiagram,
  PotentialDiagram,
  ParametricCurve,
  StaticCircuitDiagram,
  PipelineDiagram,
  MeasurementTree,
  HardwarePlatformSchematic,
  OrbitalShapePlot,
  VectorDiagram,
  GraphDiagram,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
