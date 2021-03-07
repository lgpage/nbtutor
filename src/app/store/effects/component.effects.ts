import { noop, Observable } from 'rxjs';
import { first, map, mergeMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanvasComponent, LegendComponent, MainButtonGroupComponent } from '@app/components';
import {
  CellInnerSelector, CellInputAreaSelector, MainButtonGroupId, NotebookMainToolbarContainerId
} from '@app/constants';
import { isCodeCell } from '@app/helpers';
import { CodeCell } from '@app/models';
import { DomService, LoggerService, NotebookService } from '@app/services';
import { CellService } from '@app/services/cell.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ComponentActions, VisualizationActions } from '../actions';

@Injectable()
export class ComponentEffects {
  protected _name = 'ComponentEffects';

  addMainToolbarButtonsToNotebook$ = createEffect(() => this._actions$.pipe(
    ofType(ComponentActions.addMainToolbarButtonsToNotebook),
    tap(() => this.addMainToolbarButtonsToNotebook()),
  ), { dispatch: false });

  addCanvasComponentToCell$ = createEffect(() => this._actions$.pipe(
    ofType(ComponentActions.addCanvasComponentToCell),
    mergeMap(({ cellId }) => this.addCanvasComponentToCodeCell(cellId)),
  ), { dispatch: false });

  toggleCanvasComponentDisplay$ = createEffect(() => this._actions$.pipe(
    ofType(ComponentActions.toggleCanvasComponentDisplay),
    mergeMap(() => this.addCanvasComponentToCodeCell()),
    map((cell) => VisualizationActions.toggleVisualize({ id: cell.cell_id })),
  ));

  constructor(
    protected _actions$: Actions,
    protected _domSvc: DomService,
    protected _notebookSvc: NotebookService,
    protected _loggerSvc: LoggerService,
  ) { }

  protected addMainToolbarButtonsToNotebook(): void {
    this._domSvc.createChildComponent(
      MainButtonGroupComponent,
      `#${MainButtonGroupId}`,
      `#${NotebookMainToolbarContainerId}`
    );
  }

  protected createLegendComponent(cell: CodeCell, cellSvc: CellService): void {
    const cellInner = cell.element.find(CellInnerSelector);
    const legendComponent = this._domSvc.createChildComponent(LegendComponent, null, cellInner).instance;
    legendComponent.setCellService(cellSvc);
  }

  protected createCanvasComponent(cell: CodeCell): void {
    const inputArea = cell.element.find(CellInputAreaSelector);
    const canvasComponent = this._domSvc.createChildComponent(CanvasComponent, null, inputArea).instance;

    if (!!cell.nbtutor) {
      cell.nbtutor.ngOnDestroy();
    }

    cell.nbtutor = canvasComponent;
    cell.nbtutor.cellSvc.setCodeCell(cell);
    this.createLegendComponent(cell, canvasComponent.cellSvc);
  }

  protected addComponentToCodeCell(createComponentFn: (cell: CodeCell) => void, cellId?: string): Observable<CodeCell> {
    const cell$ = !!cellId ? this._notebookSvc.getCellById(cellId) : this._notebookSvc.getSelectedCell();
    return cell$.pipe(
      map((cell) => isCodeCell(cell) ? (cell as CodeCell) : null),
      tap((cell) => (!cell || !!cell.nbtutor) ? noop : createComponentFn(cell)),
      first(),
    );
  }

  protected addCanvasComponentToCodeCell(cellId?: string): Observable<CodeCell> {
    return this.addComponentToCodeCell((cell) => this.createCanvasComponent(cell), cellId);
  }
}
