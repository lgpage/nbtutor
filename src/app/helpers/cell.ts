import { CodeCell } from '@app/models';

export function isCodeCell(cell: NotebookCell): cell is CodeCell {
  return !!cell && cell.cell_type === 'code';
}
