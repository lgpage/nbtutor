import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { JupyterService } from './jupyter.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class NotebookService {
  protected _name = 'NotebookService';

  constructor(
    protected _jupyterSvc: JupyterService,
    protected _loggerSvc: LoggerService,
  ) { }

  getCommManager(): Observable<CommManager> {
    return this._jupyterSvc.notebook$.pipe(
      map(notebook => notebook.kernel.comm_manager),
      first(),
    );
  }

  getCells(): Observable<NotebookCell[]> {
    return this._jupyterSvc.notebook$.pipe(
      map(notebook => notebook.get_cells()),
      first(),
    );
  }

  getSelectedCell(): Observable<NotebookCell> {
    return this._jupyterSvc.notebook$.pipe(
      map(notebook => notebook.get_selected_cell()),
      first(),
    );
  }

  getCellById(id: string): Observable<NotebookCell> {
    return this.getCells().pipe(
      map((cells) => cells.find((c) => c.cell_id === id) || null),
      first(),
    );
  }

  getMsgCell(msgId: string): Observable<NotebookCell> {
    return this._jupyterSvc.notebook$.pipe(
      map(notebook => notebook.get_msg_cell(msgId)),
      first(),
    );
  }
}
