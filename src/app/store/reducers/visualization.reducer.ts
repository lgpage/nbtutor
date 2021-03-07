import { isEmpty, patchData, patchStep, toggleVisualize } from '@app/helpers';
import { StepType, TraceStep, VisualizationData } from '@app/models';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { CodeMirrorActions, VisualizationActions } from '../actions';

const noDataError = 'No visualization data found for this cell';
const defaultEntity: VisualizationData = {
  cellId: 'id',
  step: 0,
  maxSteps: 0,
  visualize: true,
};

// State

export const stateKey = 'visualizationData';
export interface State extends EntityState<VisualizationData> { }
export const adapter: EntityAdapter<VisualizationData> = createEntityAdapter<VisualizationData>({
  selectId: (d) => d.cellId,
});
export const initialState: State = adapter.getInitialState();

// Reducer Helpers

function setErrorEntity(state: State, id: string): State {
  return adapter.setOne({ ...defaultEntity, cellId: id, error: noDataError }, state);
}

function setData(state: State, data: VisualizationData): State {
  return !!data ? adapter.setOne(data, state) : state;
}

function updateData(state: State, id: string, data: TraceStep[]): State {
  const entity = state.entities[id];
  return !!entity ? adapter.upsertOne(patchData(entity, data), state) : state;
}

function clearData(state: State, id: string): State {
  return adapter.setOne({ ...defaultEntity, cellId: id, visualize: false }, state);
}

function removeData(state: State, ids: string[]): State {
  const idsToRemove = ids.filter((id) => !!state.entities[id]);
  return !isEmpty(idsToRemove) ? adapter.removeMany(ids, state) : state;
}

function updateStep(state: State, id: string, step: StepType): State {
  const entity = state.entities[id];
  return !!entity ? adapter.upsertOne(patchStep(entity, step), state) : state;
}

function updateVisualize(state: State, id: string): State {
  const entity = state.entities[id];
  return !!entity ? adapter.upsertOne(toggleVisualize(entity), state) : setErrorEntity(state, id);
}

// Reducer

const visualizationReducer = createReducer(initialState,
  on(VisualizationActions.addData, (state, { data }) => setData(state, data)),
  on(VisualizationActions.updateData, (state, { id, data }) => updateData(state, id, data)),
  on(VisualizationActions.removeData, (state, { ids }) => removeData(state, ids)),
  on(VisualizationActions.updateStep, (state, { id, step }) => updateStep(state, id, step)),
  on(VisualizationActions.toggleVisualize, (state, { id }) => updateVisualize(state, id)),
  on(CodeMirrorActions.codeChanged, (state, { id }) => clearData(state, id)),
);

export function reducer(state: State, action: Action): State {
  return visualizationReducer(state, action);
}
