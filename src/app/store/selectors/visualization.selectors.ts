import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NbtutorState, VisualizationReducer } from '../reducers';

type State = VisualizationReducer.State;
const selectors = VisualizationReducer.adapter.getSelectors();

export const selectVisualizationState = createFeatureSelector<NbtutorState, State>(VisualizationReducer.stateKey);

export const selectVisualizationIds = createSelector(selectVisualizationState, selectors.selectIds);
export const selectVisualizationEntities = createSelector(selectVisualizationState, selectors.selectEntities);
