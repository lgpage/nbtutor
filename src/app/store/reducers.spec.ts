import { LoggerService } from '@app/services';
import { Action } from '@ngrx/store';
import { debugFactory, initialState } from './reducers';

describe('reducers', () => {
  describe('debugFactory', () => {
    it('should return the expected result', () => {
      const action = {} as Action;
      const reducerSpy = jasmine.createSpy('reducer').and.returnValue(initialState);
      const loggerSpy = jasmine.createSpyObj<LoggerService>('LoggerService', ['logDebug']);

      const factory = debugFactory(loggerSpy);
      const metaReducer = factory(reducerSpy);
      const state = metaReducer(initialState, action);

      expect(loggerSpy.logDebug).toHaveBeenCalledWith('Store >> Action', action);
      expect(reducerSpy).toHaveBeenCalledWith(initialState, action);
      expect(state).toBe(initialState);
    });
  });
});
