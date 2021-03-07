import { InjectionToken, Provider } from '@angular/core';
import { LoggerService } from '@app/services/logger.service';
import { ActionReducer, ActionReducerMap, META_REDUCERS, MetaReducer } from '@ngrx/store';
import * as VisualizationReducer from './reducers/visualization.reducer';

export {
  VisualizationReducer,
};

export interface NbtutorState {
  [VisualizationReducer.stateKey]: VisualizationReducer.State;
}

export const initialState: NbtutorState = {
  [VisualizationReducer.stateKey]: VisualizationReducer.initialState,
};

export const reducers: ActionReducerMap<NbtutorState> = {
  [VisualizationReducer.stateKey]: VisualizationReducer.reducer,
};

export function debugFactory(logger: LoggerService): MetaReducer<NbtutorState> {
  return (reducer: ActionReducer<NbtutorState>): ActionReducer<NbtutorState> => {
    return (state, action) => {
      logger.logDebug('Store >> Action', action);
      return reducer(state, action);
    };
  };
}

export const REDUCERS = new InjectionToken<ActionReducerMap<NbtutorState>>('Reducers');

export const reducersProvider: Provider = { provide: REDUCERS, useValue: reducers };

export const metaReducersProvider: Provider[]  = [
  { provide: META_REDUCERS, deps: [LoggerService], useFactory: debugFactory, multi: true },
];
