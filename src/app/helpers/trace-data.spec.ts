import { HeapObject } from '@app/models';
import {
  basicHeapObjectValue, kvpHeapObjectValue, sequenceHeapObjectValue, sortHeapObject
} from './trace-data';

describe('TraceData Helpers', () => {
  let heapObject: HeapObject;
  beforeEach(() => {
    heapObject = {
      id: 'id',
      type: 'List',
      value: 'List',
      renderType: 'basic',
    };
  });

  describe('basicHeapObjectValue', () => {
    it('should return the expected result', () => {
      expect(basicHeapObjectValue({ ...heapObject, renderType: 'basic' })).toBeTrue();
    });
  });

  describe('sequenceHeapObjectValue', () => {
    it('should return the expected result', () => {
      expect(sequenceHeapObjectValue({ ...heapObject, renderType: 'sequence' })).toBeTrue();
    });
  });

  describe('kvpHeapObjectValue', () => {
    it('should return the expected result', () => {
      expect(kvpHeapObjectValue({ ...heapObject, renderType: 'kvp' })).toBeTrue();
    });
  });

  describe('sortHeapObject', () => {
    it('should return the expected result', () => {
      const base: HeapObject = {} as HeapObject;
      const items: HeapObject[] = [
        {...base, sequence: 3, id: 'd'},
        {...base, sequence: 3, id: 'c'},
        {...base, sequence: 2, id: 'a'},
        {...base, sequence: 1, id: 'b'},
      ];

      const sorted: HeapObject[] = [
        {...base, sequence: 1, id: 'b'},
        {...base, sequence: 2, id: 'a'},
        {...base, sequence: 3, id: 'c'},
        {...base, sequence: 3, id: 'd'},
      ];

      expect(sortHeapObject(items)).toEqual(sorted);
    });
  });
});
