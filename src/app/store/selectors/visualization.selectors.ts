import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VisualizationReducer } from '../reducers';

type State = VisualizationReducer.State;
const selectors = VisualizationReducer.adapter.getSelectors();

export const selectVisualizationState = createFeatureSelector< State>(VisualizationReducer.stateKey);

export const selectVisualizationIds = createSelector(selectVisualizationState, selectors.selectIds);
export const selectVisualizationEntities = createSelector(selectVisualizationState, selectors.selectEntities);
