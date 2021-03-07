import { noop, Observable } from 'rxjs';
import { debounceTime, first, map, tap } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { HasSubscriptionsDirective } from '@app/helpers';
import { CodeCell, Hover, ICellService } from '@app/models';
import { CellDataService } from './cell-data.service';
import { CodeMirrorService } from './code-mirror.service';
import { JsPlumbService } from './js-plumb.service';
import { LoggerService } from './logger.service';

@Injectable()
export class CellService extends HasSubscriptionsDirective implements OnDestroy, ICellService {
  protected _name = 'CellService';

  cell$ = this._dataSvc.cell$;
  hover$ = this._dataSvc.hover$;
  hasLineNumber$ = this._dataSvc.hasLineNumbers$;
  visualization$ = this._dataSvc.visualization$;
  traceStep$ = this._dataSvc.traceStep$;
  heap$ = this._dataSvc.heap$;

  constructor(
    protected _dataSvc: CellDataService,
    protected _jsPlumbSvc: JsPlumbService,
    protected _codeMirrorSvc: CodeMirrorService,
    protected _loggerSvc: LoggerService,
  ) {
    super();
    this.initObservables();
    this.subscribeToObservables();
  }

  protected initObservables(): void {
    const clearHeapObjectsRendered$ = this.heap$.pipe(
      tap(() => this._dataSvc.clearRenderedHeapObject()),
    );

    const outputStdOut$ = this.traceStep$.pipe(
      debounceTime(20),
      map((traceStep) => traceStep.stdout),
      tap((text) => this.handleStdout(text)),
    );

    this._observables = [clearHeapObjectsRendered$, outputStdOut$];
  }

  protected getHandleOutputAction(text?: string): Observable<CodeCell> {
    return this.cell$.pipe(
      tap((cell) => this._loggerSvc.logDebug(`${this._name} >> handleStdout`, { text, cell })),
      tap((cell) => cell.output_area.clear_output()),
      tap((cell) => !text ? noop : cell.output_area.handle_output({
        header: { msg_type: 'stream' },
        content: { name: 'nbtutor', text },
      })),
      first(),
    );
  }

  setHover(hover: Hover): void {
    this._dataSvc.setHover(hover);
  }

  setCodeCell(cell: CodeCell): void {
    this._dataSvc.setCodeCell(cell);
  }

  handleStdout(text?: string): void {
    this.getHandleOutputAction(text).subscribe();
  }

  ngOnDestroy(): void {
    this._loggerSvc.logDebug(`${this._name} >> ngOnDestroy`);
    super.ngOnDestroy();
  }
}
