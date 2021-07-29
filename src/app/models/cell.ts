import { Observable } from 'rxjs';
import { Hover } from './runtime';
import { TraceStep } from './trace-data';
import { CellMetadata, VisualizationData } from './visualization';

export type CellUpdateAction = 'toggleVisualization' | 'updateStep' | 'saveData';

export interface ICellDataService {
  cell$: Observable<CodeCell>;
  visualization$: Observable<VisualizationData>;
  traceStep$: Observable<TraceStep>;

  setCodeCell(cell: CodeCell): void;
}

export interface ICellService {
  cell$: Observable<CodeCell>;
  traceStep$: Observable<TraceStep>;

  setHover(hover: Hover): void;
  setCodeCell(cell: CodeCell): void;
  handleStdout(text?: string): void;
}

export interface Nbtutor {
  cellSvc: ICellService;
  ngOnDestroy(): void;
}

export interface CodeCell extends NotebookCodeCell {
  metadata: CellMetadata;
  nbtutor?: Nbtutor;
}
