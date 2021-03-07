import { StepType, TraceStep, VisualizationData } from '@app/models';

export function getNextStepNumber(entity: VisualizationData, increment: StepType): number {
  const currentStep = entity.step;
  const lastStep = Math.max(0, entity.maxSteps - 1);
  switch (increment) {
    case 'first':
      return 0;
    case 'previous':
      return Math.max(0, currentStep - 1);
    case 'next':
      return Math.min(lastStep, currentStep + 1);
    case 'last':
      return lastStep;
  }
}

export function patchStep(entity: VisualizationData, step: StepType): VisualizationData {
  return { ...entity, step: getNextStepNumber(entity, step) };
}

export function toggleVisualize(entity: VisualizationData): VisualizationData {
  return { ...entity, visualize: !entity.visualize };
}

export function patchData(entity: VisualizationData, data: TraceStep[]): VisualizationData {
  return { ...entity, data, step: 0, maxSteps: data.length, visualize: true };
}

export function showVisualization(visualization: VisualizationData): boolean {
  return !!visualization && !!visualization.visualize && !!visualization.data && !visualization.error;
}

export function showError(visualization: VisualizationData): boolean {
  return !!visualization && !!visualization.visualize && !!visualization.error;
}
