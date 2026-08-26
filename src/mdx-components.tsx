import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { Callout } from "@/components/mdx/Callout";
import { DefinitionBox } from "@/components/mdx/DefinitionBox";
import { TheoremBox } from "@/components/mdx/TheoremBox";
import { ExternalFigure } from "@/components/mdx/ExternalFigure";
import { InteractiveSection } from "@/components/mdx/InteractiveSection";
import { PredictBeforeReveal } from "@/components/mdx/PredictBeforeReveal";
import { LessonHook } from "@/components/narrative/LessonHook";
import { Question } from "@/components/narrative/Question";
import { InsightBlock } from "@/components/narrative/InsightBlock";
import { DerivationSteps, DerivationStep } from "@/components/narrative/DerivationSteps";
import { EquationReveal } from "@/components/narrative/EquationReveal";
import { AnnotatedFigure } from "@/components/narrative/AnnotatedFigure";
import { ResearchConnection } from "@/components/narrative/ResearchConnection";
import { HistoricalMoment } from "@/components/narrative/HistoricalMoment";
import { ChallengePrompt } from "@/components/narrative/ChallengePrompt";
import { NextDiscovery } from "@/components/narrative/NextDiscovery";
import { ObservePredictExplain } from "@/components/narrative/ObservePredictExplain";
import { BarChart } from "@/components/visualizations/BarChart";
import { BarChartExplorer } from "@/components/visualizations/BarChartExplorer";
import { EnergyLevelDiagram } from "@/components/visualizations/EnergyLevelDiagram";
import { LevelSplittingDiagram } from "@/components/visualizations/LevelSplittingDiagram";
import { PotentialDiagram } from "@/components/visualizations/PotentialDiagram";
import { ScatteringStandingWave } from "@/components/visualizations/ScatteringStandingWave";
import { ParametricCurve } from "@/components/visualizations/ParametricCurve";
import { PathPhasorSum } from "@/components/visualizations/PathPhasorSum";
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
import { PhaseWindingCircle } from "@/components/visualizations/PhaseWindingCircle";
import { OrbitalDensityCloud } from "@/components/visualizations/OrbitalDensityCloud";
import { VectorDiagram } from "@/components/visualizations/VectorDiagram";
import { VectorDiagramExplorer } from "@/components/visualizations/VectorDiagramExplorer";
import { GraphDiagram } from "@/components/visualizations/GraphDiagram";
import { MatrixGrid } from "@/components/visualizations/MatrixGrid";
import { MatrixGridExplorer } from "@/components/visualizations/MatrixGridExplorer";
import { ExchangeDiagram } from "@/components/visualizations/ExchangeDiagram";
import { ExchangeDiagramExplorer } from "@/components/visualizations/ExchangeDiagramExplorer";
import { ReadoutScatter } from "@/components/visualizations/ReadoutScatter";
import { BB84RoundTable } from "@/components/visualizations/BB84RoundTable";
import { ComplexityClassDiagram } from "@/components/visualizations/ComplexityClassDiagram";
import { ClassicalSimulabilityMap } from "@/components/visualizations/ClassicalSimulabilityMap";
import { CircuitStateStepper } from "@/components/visualizations/CircuitStateStepper";
import { DecoherenceBlochDecay } from "@/components/visualizations/DecoherenceBlochDecay";
import { GroverAmplitudeSweep } from "@/components/visualizations/GroverAmplitudeSweep";
import { SpinAxisMeasurement } from "@/components/visualizations/SpinAxisMeasurement";
import { ErrorCorrectionCycle } from "@/components/visualizations/ErrorCorrectionCycle";
import { TensorNetworkDiagram } from "@/components/visualizations/TensorNetworkDiagram";
import { SurfaceCodePatchExplorer } from "@/components/visualizations/SurfaceCodePatchExplorer";
import { StabilizerTable } from "@/components/visualizations/StabilizerTable";
import { CircuitDiagramExplorer } from "@/components/visualizations/CircuitDiagramExplorer";
import { CostLandscapeHeatmap } from "@/components/visualizations/CostLandscapeHeatmap";
import { PhaseSpacePanel } from "@/components/visualizations/PhaseSpacePanel";
import { ExpectationTrace } from "@/components/visualizations/ExpectationTrace";
import { PartialTraceHighlight } from "@/components/visualizations/PartialTraceHighlight";
import { UncertaintyEllipse } from "@/components/visualizations/UncertaintyEllipse";
import { LinewidthDiagram } from "@/components/visualizations/LinewidthDiagram";
import { LossVsDecoherence } from "@/components/visualizations/LossVsDecoherence";

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
  DefinitionBox,
  TheoremBox,
  ExternalFigure,
  InteractiveSection,
  PredictBeforeReveal,
  LessonHook,
  Question,
  InsightBlock,
  DerivationSteps,
  DerivationStep,
  EquationReveal,
  AnnotatedFigure,
  ResearchConnection,
  HistoricalMoment,
  ChallengePrompt,
  NextDiscovery,
  ObservePredictExplain,
  BarChart,
  BarChartExplorer,
  EnergyLevelDiagram,
  LevelSplittingDiagram,
  PotentialDiagram,
  ScatteringStandingWave,
  ParametricCurve,
  PathPhasorSum,
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
  PhaseWindingCircle,
  OrbitalDensityCloud,
  VectorDiagram,
  VectorDiagramExplorer,
  GraphDiagram,
  MatrixGrid,
  MatrixGridExplorer,
  ExchangeDiagram,
  ExchangeDiagramExplorer,
  ReadoutScatter,
  BB84RoundTable,
  ComplexityClassDiagram,
  ClassicalSimulabilityMap,
  CircuitStateStepper,
  DecoherenceBlochDecay,
  GroverAmplitudeSweep,
  SpinAxisMeasurement,
  ErrorCorrectionCycle,
  TensorNetworkDiagram,
  SurfaceCodePatchExplorer,
  StabilizerTable,
  CircuitDiagramExplorer,
  CostLandscapeHeatmap,
  PhaseSpacePanel,
  ExpectationTrace,
  PartialTraceHighlight,
  UncertaintyEllipse,
  LinewidthDiagram,
  LossVsDecoherence,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
