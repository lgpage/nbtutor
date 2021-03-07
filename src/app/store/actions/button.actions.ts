import { createAction } from '@ngrx/store';

export const toggleVisualization = createAction(
  '[Button] Toggle visualization'
);

export const first = createAction(
  '[Button] First line number'
);

export const next = createAction(
  '[Button] Increment line number'
);

export const previous = createAction(
  '[Button] Decrement line number'
);

export const last = createAction(
  '[Button] Last line number'
);
