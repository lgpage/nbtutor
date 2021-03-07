import { map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { VisualizationData } from '@app/models/visualization';
import { LoggerService, NotebookService, TraceStepService } from '@app/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommActions, ComponentActions, VisualizationActions } from '../actions';

@Injectable()
export class CellDataEffects {
  protected _name = 'CellDataEffects';

  setCellData$ = createEffect(() => this._actions$.pipe(
    ofType(CommActions.setData),
    mergeMap(({ msgId, traceSteps }) => this._notebookSvc.getMsgCell(msgId).pipe(
      map((cell) => {
        if (!cell) { return null; }
        const data: VisualizationData = {
          cellId: cell.cell_id,
          data: this._traceStepSvc.sanitize(traceSteps),
          step: 0,
          maxSteps: 0,
          visualize: true,
        };

        data.maxSteps = data.data.length;
        return data;
      }),
    )),
    mergeMap((data) => [
      VisualizationActions.addData({ data }),
      ComponentActions.addCanvasComponentToCell({ cellId: data.cellId }),
    ]),
  ));

  constructor(
    protected _actions$: Actions,
    protected _traceStepSvc: TraceStepService,
    protected _notebookSvc: NotebookService,
    protected _loggerSvc: LoggerService,
  ) { }
}
