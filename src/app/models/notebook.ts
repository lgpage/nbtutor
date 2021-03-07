import { CellUpdateAction } from './cell';

export interface UpdateEvent {
  action: CellUpdateAction;
  cell: NotebookCell;
}
