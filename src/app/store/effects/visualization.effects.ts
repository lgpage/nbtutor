import { Observable } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoggerService, NotebookService } from '@app/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { VisualizationActions } from '../actions';
import { NbtutorState } from '../reducers';
import { selectVisualizationIds } from '../selectors/visualization.selectors';

@Injectable()
export class VisualizationEffects {
  syncData$ = createEffect(() => this._actions$.pipe(
    ofType(VisualizationActions.syncData),
    mergeMap(() => this.getIdsToRemove()),
    map((ids) => VisualizationActions.removeData({ ids })),
  ));

  constructor(
    protected _actions$: Actions,
    protected _notebookSvc: NotebookService,
    protected _store: Store<NbtutorState>,
    protected _loggerSvc: LoggerService,
  ) { }

  protected getIdsToRemove(): Observable<string[]> {
    return this._notebookSvc.getCells().pipe(
      map((cells) => cells.reduce<{ [id: string]: NotebookCell }>((p, c) => ({ ...p, [c.cell_id]: c }), {})),
      withLatestFrom(this._store.pipe(
        select(selectVisualizationIds),
        map((ids) => ids as string[]),
      )),
      map(([notebookCells, storeCellIds]) => storeCellIds.filter((id) => {
        const cell = notebookCells[id];
        return !cell || cell.cell_type !== 'code';
      })),
    );
  }
}
