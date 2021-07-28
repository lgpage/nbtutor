import { TraceStep } from './trace-data';

export type StepType = 'first' | 'previous' | 'next' | 'last';

export interface VisualizationData {
  cellId: string;
  step: number;
  maxSteps: number;
  visualize: boolean;
  data?: TraceStep[];
  error?: string;
}

export interface CellMetadata {
  [key: string]: any;
  nbtutor?: VisualizationData;
}
