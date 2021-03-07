import { TraceStep, VisualizationData } from '@app/models';
import { getNextStepNumber, patchData, patchStep, toggleVisualize } from './visualization-data';

describe('Visualization Data Helpers', () => {
  let entity: VisualizationData;
  beforeEach(() => {
    entity = { cellId: 'id', visualize: true, step: 1, maxSteps: 5, data: [] };
  });

  describe('getNextStepNumber', () => {
    beforeEach(() => {
      entity = { cellId: 'id', visualize: false, step: 2, maxSteps: 10, data: [] };
    });

    it('should return expected result', () => {
      expect(getNextStepNumber(entity, 'first')).toEqual(0);
      expect(getNextStepNumber(entity, 'previous')).toEqual(1);
      expect(getNextStepNumber(entity, 'next')).toEqual(3);
      expect(getNextStepNumber(entity, 'last')).toEqual(9);
    });

    it('should not be less than 0', () => {
      expect(getNextStepNumber({ ...entity, step: 0 }, 'previous')).toEqual(0);
      expect(getNextStepNumber({ ...entity, step: 0, maxSteps: 0 }, 'previous')).toEqual(0);
    });

    it('should not be greater than maxSteps - 1', () => {
      expect(getNextStepNumber({ ...entity, step: 9 }, 'next')).toEqual(9);
      expect(getNextStepNumber({ ...entity, step: 0, maxSteps: 0 }, 'next')).toEqual(0);
      expect(getNextStepNumber({ ...entity, step: 0, maxSteps: 0 }, 'last')).toEqual(0);
    });
  });

  describe('patchStep', () => {
    it('should return expected result', () => {
      const result = patchStep(entity, 'next');
      expect(result.step).toBe(2);
    });
  });

  describe('patchData', () => {
    it('should return expected result', () => {
      const data: TraceStep[] = [];

      const result = patchData(entity, data);
      expect(result.data).toBe(data);
    });
  });

  describe('toggleVisualize', () => {
    it('should return expected result', () => {
      const result = toggleVisualize(entity);
      expect(result.visualize).toBeFalse();
    });
  });
});
