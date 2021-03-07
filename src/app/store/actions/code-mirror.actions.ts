import { createAction, props } from '@ngrx/store';

export const codeChanged = createAction(
  '[CodeMirror] Code changed',
  props<{ id: string }>(),
);
