import { combineLatest, Observable } from 'rxjs';
import {
  distinctUntilChanged, first, map, tap, throttleTime, withLatestFrom
} from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import {
  CodeMirrorGutterId, LineMarkerClassCurrent, LineMarkerClassNext, LineMarkerClassPrevious
} from '@app/constants';
import { HasSubscriptionsDirective, switchMapNodeEvent } from '@app/helpers';
import { filterTruthy } from '@app/helpers/observables';
import { CodeCell, LineMarker, LineMarkerType } from '@app/models';
import { CodeMirrorActions } from '@app/store/actions';
import { NbtutorState } from '@app/store/reducers';
import { Store } from '@ngrx/store';
import { CellDataService } from './cell-data.service';
import { LoggerService } from './logger.service';

declare var $: JQueryStatic;

@Injectable()
export class CodeMirrorService extends HasSubscriptionsDirective implements OnDestroy {
  protected _name = 'CodeMirrorService';

  editor$ = this._dataSvc.cell$.pipe(
    map((cell) => cell.code_mirror),
    filterTruthy(),
  );

  visualization$ = this._dataSvc.visualization$;
  lineMarkers$ = this._dataSvc.traceStep$.pipe(
    map((traceStep) => traceStep.lineMarkers),
  );

  constructor(
    protected _dataSvc: CellDataService,
    protected _store: Store<NbtutorState>,
    protected _loggerSvc: LoggerService,
  ) {
    super();
    this.initObservables();
    this.subscribeToObservables();
  }

  protected getEditorOnEvent(event: string): Observable<CodeMirror.Editor> {
    return this.editor$.pipe(
      switchMapNodeEvent(event),
      tap((editor) => this._loggerSvc.logDebug(`${this._name} >> getEditorOnEvent[${event}]`, { editor })),
    );
  }

  protected getHasLineNumbers(): Observable<boolean> {
    return this.getEditorOnEvent('optionChange').pipe(
      map((editor) => editor.getOption('lineNumbers')),
      distinctUntilChanged(),
    );
  }

  protected getToggleMarkers(hasLineNumbers$: Observable<boolean>): Observable<boolean> {
    const hasMarkers$ = combineLatest([hasLineNumbers$, this.visualization$]).pipe(
      map(([hasLineNumbers, visualization]) => hasLineNumbers && visualization.visualize),
      distinctUntilChanged(),
    );

    return combineLatest([this.editor$, this.lineMarkers$, hasMarkers$]).pipe(
      map(([editor, lineMarkers, hasMarkers]) => this.toggleLineMarkers(hasMarkers, editor, lineMarkers)),
      distinctUntilChanged(),
    );
  }

  protected getCellDataSetter(hasLineNumbers$: Observable<boolean>): Observable<boolean> {
    return hasLineNumbers$.pipe(
      tap((hasLineNumbers) => this._dataSvc.setHasLineNumbers(hasLineNumbers)),
    );
  }

  protected getDispatchCodeChanged(): Observable<CodeCell> {
    return this.getEditorOnEvent('change').pipe(
      throttleTime(1000),
      withLatestFrom(this._dataSvc.cell$),
      map(([_, cell]) => cell),
      tap((cell) => this._store.dispatch(CodeMirrorActions.codeChanged({ id: cell.cell_id }))),
    );
  }

  protected initObservables(): void {
    const hasLineNumbers$ = this.getHasLineNumbers();
    const toggleMarkers$ = this.getToggleMarkers(hasLineNumbers$);
    const setCellData$ = this.getCellDataSetter(hasLineNumbers$);
    const dispatchCodeChanged$ = this.getDispatchCodeChanged();

    const setGutterOptions$ = this.editor$.pipe(
      tap((editor) => this.setGuttersOption(editor)),
      first(),
    );

    this._observables = [toggleMarkers$, setCellData$, dispatchCodeChanged$, setGutterOptions$];
  }

  protected setGuttersOption(editor: CodeMirror.Editor): void {
    const gutters = editor.getOption('gutters');
    this._loggerSvc.logDebug(`${this._name} >> setGuttersOption`, { gutters });
    if (!gutters.find((g) => g === CodeMirrorGutterId)) {
      editor.setOption('lineNumbers', true);
      editor.setOption('gutters', [...gutters, CodeMirrorGutterId]);
    }
  }

  protected toggleLineMarkers(hasMarkers: boolean, editor: CodeMirror.Editor, lineMarkers: LineMarker[]): boolean {
    this._loggerSvc.logDebug(`${this._name} >> addLineMarkers`, { hasMarkers, lineMarkers });
    editor.clearGutter(CodeMirrorGutterId);

    if (hasMarkers && !!lineMarkers) {
      lineMarkers.map((marker) => editor.setGutterMarker(
        marker.lineNumber,
        CodeMirrorGutterId,
        this.createMarkerElement(marker.type)
      ));

      return true;
    }

    return false;
  }

  protected createMarkerElement(type: LineMarkerType): HTMLElement {
    const cssClass = (
      type === 'previous' ? LineMarkerClassPrevious : type === 'current' ? LineMarkerClassCurrent : LineMarkerClassNext
    );

    return $('<i/>').attr('class', 'fa fa-long-arrow-right fa-lg').addClass(cssClass).toArray()[0];
  }

  ngOnDestroy(): void {
    this._loggerSvc.logDebug(`${this._name} >> ngOnDestroy`);
    super.ngOnDestroy();
  }
}
