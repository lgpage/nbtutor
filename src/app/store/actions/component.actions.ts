import { createAction, props } from '@ngrx/store';

export const addMainToolbarButtonsToNotebook = createAction(
  '[DOM] Add the main toolbar buttons to Notebook',
);

export const addCanvasComponentToCell = createAction(
  '[DOM] Add the canvas component to the cell',
  props<{ cellId: string }>(),
);

export const toggleCanvasComponentDisplay = createAction(
  '[DOM] Show / hide the canvas component',
);
