import { Dictionary } from '@app/models/objects';
import { deepClone, isEmpty, keys, values } from './objects';

describe('objects', () => {
  describe('isEmpty', () => {
    it('should return expected results', () => {
      expect(isEmpty(null)).toBeTrue();
      expect(isEmpty(undefined)).toBeTrue();
      expect(isEmpty({})).toBeTrue();
      expect(isEmpty({ a: 'foo' })).toBeFalse();
    });
  });

  describe('keys', () => {
    it('should return expected results', () => {
      const items: Dictionary<{ id: number }> = { a: { id: 2 } };

      expect(keys({})).toEqual([]);
      expect(keys(items)).toEqual(['a']);
    });
  });

  describe('values', () => {
    it('should return expected results', () => {
      const items: Dictionary<{ id: number }> = { a: { id: 2 } };

      expect(values({})).toEqual([]);
      expect(values(items)).toEqual([{ id: 2 }]);
      expect(values(items, x => x.id)).toEqual([2]);
    });
  });

  describe('deepClone', () => {
    it('should return expected results', () => {
      const obj = { arr: [{}], val: 12, obj: {} };

      const result = deepClone(obj);

      expect(result).not.toBe(obj);
      expect(result.obj).not.toBe(obj.obj);
      expect(result.arr).not.toBe(obj.arr);
      expect(result.arr[0]).not.toBe(obj.arr[0]);

      expect(result.val).toEqual(12);
      expect(result.obj).toEqual({});
      expect(result.arr).toEqual([{}]);
    });
  });
});
