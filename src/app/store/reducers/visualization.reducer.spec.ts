import { VisualizationData } from '@app/models';
import { CodeMirrorActions, VisualizationActions } from '../actions';
import { adapter, initialState, reducer } from './visualization.reducer';

describe('Visualization Reducer', () => {
  let noDataError: string;
  let defaultEntity: VisualizationData;

  beforeEach(() => {
    noDataError = 'No visualization data found for this cell';
    defaultEntity = {
      cellId: 'id',
      step: 0,
      maxSteps: 0,
      visualize: true,
    };
  });

  describe(`on ${VisualizationActions.updateStep.type}`, () => {
    describe('when entity is falsy', () => {
      it('should return the current state', () => {
        const result = reducer(initialState, VisualizationActions.updateStep({ id: 'id', step: 'next' }));
        expect(result).toBe(initialState);
      });
    });

    it('should updated the state as expected', () => {
      const data = { cellId: 'id', step: 1, maxSteps: 5 } as VisualizationData;
      const state = adapter.upsertOne(data, initialState);

      const result = reducer(state, VisualizationActions.updateStep({ id: 'id', step: 'next' }));
      expect(result).toEqual({ ids: ['id'], entities: { id: { ...data, step: 2, maxSteps: 5 } } });
    });
  });

  describe(`on ${VisualizationActions.toggleVisualize.type}`, () => {
    describe('when entity is falsy', () => {
      it('should return the current state', () => {
        const expected = adapter.upsertOne({
          cellId: 'id',
          step: 0,
          maxSteps: 0,
          visualize: true,
          error: 'No visualization data found for this cell',
        }, initialState);

        const result = reducer(initialState, VisualizationActions.toggleVisualize({ id: 'id' }));
        expect(result).toEqual(expected);
      });
    });

    it('should updated the state as expected', () => {
      const data = { cellId: 'id', visualize: true } as VisualizationData;
      const state = adapter.upsertOne(data, initialState);

      const result = reducer(state, VisualizationActions.toggleVisualize({ id: 'id' }));
      expect(result).toEqual({ ids: ['id'], entities: { id: { ...data, visualize: false } } });
    });
  });

  describe(`on ${VisualizationActions.updateData.type}`, () => {
    describe('when entity is falsy', () => {
      it('should return the current state', () => {
        const result = reducer(initialState, VisualizationActions.updateData({ id: 'id', data: [] }));
        expect(result).toBe(initialState);
      });
    });

    it('should updated the state as expected', () => {
      const data = { cellId: 'id', data: null } as VisualizationData;
      const state = adapter.upsertOne(data, initialState);

      const result = reducer(state, VisualizationActions.updateData({ id: 'id', data: [] }));
      expect(result).toEqual({ ids: ['id'], entities: { id: { ...data, step: 0, maxSteps: 0, visualize: true, data: [] } } });
    });
  });

  describe(`on ${VisualizationActions.addData.type}`, () => {
    it('should updated the state as expected', () => {
      const data = { cellId: 'id' } as VisualizationData;
      const result = reducer(initialState, VisualizationActions.addData({ data }));
      expect(result).toEqual({ ids: ['id'], entities: { id: data } });
    });

    it('should handle null data', () => {
      const result = reducer(initialState, VisualizationActions.addData({ data: null }));
      expect(result).toBe(initialState);
    });
  });

  describe(`on ${VisualizationActions.removeData.type}`, () => {
    it('should updated the state as expected', () => {
      const data = { cellId: 'id' } as VisualizationData;
      const state = adapter.upsertOne(data, initialState);

      const result = reducer(state, VisualizationActions.removeData({ ids: ['id'] }));
      expect(result).toEqual({ ids: [], entities: {} });
    });

    it('should handle empty ids', () => {
      const result = reducer(initialState, VisualizationActions.removeData({ ids: [] }));
      expect(result).toBe(initialState);
    });
  });

  describe(`on ${CodeMirrorActions.codeChanged.type}`, () => {
    it('should updated the state as expected', () => {
      const data = { cellId: 'id' } as VisualizationData;
      const state = adapter.upsertOne(data, initialState);

      const result = reducer(state, CodeMirrorActions.codeChanged({ id: 'id' }));
      expect(result).toEqual({ ids: ['id'], entities: { id: { ...defaultEntity, cellId: 'id', visualize: false } } });
    });
  });
});
