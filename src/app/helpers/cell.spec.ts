import { CodeCell } from '@app/models';
import { isCodeCell } from './cell';

describe('Cell Helpers', () => {
  describe('isCodeCell', () => {
    it('should return the expected results', () => {
      const cell = {} as NotebookCell | CodeCell;

      expect(isCodeCell(null)).toBeFalse();
      expect(isCodeCell(cell)).toBeFalse();
      expect(isCodeCell({ ...cell, cell_type: 'code' })).toBeTrue();
    });
  });
});
