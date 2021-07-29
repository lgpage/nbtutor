import { StepType, TraceStep, VisualizationData } from '@app/models';
import { createAction, props } from '@ngrx/store';

export const addData = createAction(
  '[Cell Visualization] Add trace step data',
  props<{ data: VisualizationData }>(),
);

export const updateData = createAction(
  '[Cell Visualization] Update trace step data',
  props<{ id: string, data: TraceStep[] }>(),
);

export const updateStep = createAction(
  '[Cell Visualization] Update step',
  props<{ id: string, step: StepType }>(),
);

export const toggleVisualize = createAction(
  '[Cell Visualization] Toggle visualize',
  props<{ id: string }>(),
);

export const syncData = createAction(
  '[Visualization Data] Sync trace step data'
);

export const removeData = createAction(
  '[Visualization Data] Remove trace step data',
  props<{ ids: string[] }>(),
);
