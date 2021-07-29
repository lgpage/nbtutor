import { BehaviorSubject, noop, Observable, timer } from 'rxjs';
import { debounceTime, map, tap, withLatestFrom } from 'rxjs/operators';
import {
  ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { showError, showVisualization } from '@app/helpers';
import { HasSubscriptionsDirective } from '@app/helpers/has-subscriptions';
import { filterTruthy } from '@app/helpers/observables';
import { Nbtutor } from '@app/models';
import { CodeCell } from '@app/models/cell';
import { VisualizationData } from '@app/models/visualization';
import {
  CellDataService, CellService, CodeMirrorService, JsPlumbService, LoggerService
} from '@app/services';

@Component({
  selector: 'nbtutor-canvas',
  templateUrl: './canvas.component.html',
  providers: [CellDataService, CellService, JsPlumbService, CodeMirrorService],
})
export class CanvasComponent extends HasSubscriptionsDirective implements OnInit, OnDestroy, Nbtutor {
  protected _name = 'CanvasComponent';
  protected _dataPollTime = 5 * 60 * 1000;  // 5 minutes
  protected _changeDetectPollTime = 100;

  protected _canvasElementRefSubject$ = new BehaviorSubject<ElementRef<HTMLElement>>(null);
  protected _canvasElementRef$ = this._canvasElementRefSubject$.asObservable().pipe(filterTruthy());

  cellSvc = this._cellSvc;

  @ViewChild('canvas', { static: false }) set canvasElementRef(elementRef: ElementRef<HTMLElement>) {
    this._loggerSvc.logDebug(`${this._name} >> set canvasElement`, { elementRef });
    this._canvasElementRefSubject$.next(elementRef);
  }

  constructor(
    protected _cellSvc: CellService,
    protected _cellDataSvc: CellDataService,
    protected _jsPlumbSvc: JsPlumbService,
    protected _codeMirrorSvc: CodeMirrorService,
    protected _changeDetector: ChangeDetectorRef,
    protected _loggerSvc: LoggerService,
  ) {
    super();
  }

  protected documentContains(other: Node | null): boolean {
    return document.contains(other);
  }

  protected getElement$(cell$: Observable<CodeCell>): Observable<JQuery<HTMLElement>> {
    return cell$.pipe(
      map((cell) => (cell || { element: null }).element),
    );
  }

  protected getJsPlumbSetupEffect$(): Observable<any> {
    return this._canvasElementRef$.pipe(
      debounceTime(10),
      tap((elementRef) => this._jsPlumbSvc.setupJsPlumb(elementRef.nativeElement)),
    );
  }

  protected getIsOrphanedTimer$(cell$: Observable<CodeCell>): Observable<boolean> {
    return timer(this._dataPollTime, this._dataPollTime).pipe(
      withLatestFrom(this.getElement$(cell$)),
      map(([_, element]) => !!element ? !this.documentContains(element[0]) : true),
      tap((isOrphaned) => this._loggerSvc.logDebug(`${this._name} >> isOrphaned$`, { isOrphaned })),
      tap((isOrphaned) => !!isOrphaned ? this.ngOnDestroy() : noop),
    );
  }

  // TODO: Remove this. Works fine in Chrome w/o this but doesn't in Firefox :(
  protected getDetectChangesTimer$(): Observable<number> {
    return timer(this._changeDetectPollTime, this._changeDetectPollTime).pipe(
      tap(() => this._changeDetector.detectChanges()),
    );
  }

  @HostListener('window:resize')
  onWindowResize() {
    this._jsPlumbSvc.repaintConnectors();
  }

  ngOnInit(): void {
    this._loggerSvc.logDebug(`${this._name} >> ngOnInit`);

    const setupJsPlumb$ = this.getJsPlumbSetupEffect$();
    const isOrphaned$ = this.getIsOrphanedTimer$(this._cellSvc.cell$);
    const detectChanges$ = this.getDetectChangesTimer$();

    this._observables = [setupJsPlumb$, isOrphaned$, detectChanges$];
    this.subscribeToObservables();
  }

  showVisualization(visualization: VisualizationData): boolean {
    return showVisualization(visualization);
  }

  showError(visualization: VisualizationData): boolean {
    return showError(visualization);
  }

  ngOnDestroy(): void {
    this._loggerSvc.logDebug(`${this._name} >> ngOnDestroy`);
    this._cellSvc.setCodeCell(null);

    this._jsPlumbSvc.ngOnDestroy();
    this._codeMirrorSvc.ngOnDestroy();
    this._cellSvc.ngOnDestroy();
    this._cellDataSvc.ngOnDestroy();

    super.ngOnDestroy();
  }
}
