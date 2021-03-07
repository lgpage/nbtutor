import { CommTraceStep } from '@app/models';
import { createAction, props } from '@ngrx/store';

export const setData = createAction(
  '[Nbtutor Comm] Set Cell Visualization Data',
  props<{ msgId: string, traceSteps: CommTraceStep[] }>(),
);
