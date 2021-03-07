import { map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NotebookService } from '@app/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ButtonActions, ComponentActions, VisualizationActions } from '../actions';

@Injectable()
export class ButtonEffects {
  first$ = createEffect(() => this._actions$.pipe(
    ofType(ButtonActions.first),
    mergeMap(() => this._notebookSvc.getSelectedCell()),
    map((cell) => VisualizationActions.updateStep({ id: cell.cell_id, step: 'first' })),
  ));

  previous$ = createEffect(() => this._actions$.pipe(
    ofType(ButtonActions.previous),
    mergeMap(() => this._notebookSvc.getSelectedCell()),
    map((cell) => VisualizationActions.updateStep({ id: cell.cell_id, step: 'previous' })),
  ));

  next$ = createEffect(() => this._actions$.pipe(
    ofType(ButtonActions.next),
    mergeMap(() => this._notebookSvc.getSelectedCell()),
    map((cell) => VisualizationActions.updateStep({ id: cell.cell_id, step: 'next' })),
  ));

  last$ = createEffect(() => this._actions$.pipe(
    ofType(ButtonActions.last),
    mergeMap(() => this._notebookSvc.getSelectedCell()),
    map((cell) => VisualizationActions.updateStep({ id: cell.cell_id, step: 'last' })),
  ));

  toggleVisualize$ = createEffect(() => this._actions$.pipe(
    ofType(ButtonActions.toggleVisualization),
    map(() => ComponentActions.toggleCanvasComponentDisplay()),
  ));

  constructor(
    protected _actions$: Actions,
    protected _notebookSvc: NotebookService,
  ) { }
}
