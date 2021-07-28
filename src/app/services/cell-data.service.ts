import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, first, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { filterTruthy, isEmpty } from '@app/helpers';
import { CodeCell, HeapObject, ICellDataService } from '@app/models';
import { Hover } from '@app/models/runtime';
import { NbtutorState } from '@app/store/reducers';
import { VisualizationSelectors } from '@app/store/selectors';
import { select, Store } from '@ngrx/store';
import { LoggerService } from './logger.service';

@Injectable()
export class CellDataService implements OnDestroy, ICellDataService {
  protected _name = 'CellDataService';
  protected _cellSubject$ = new BehaviorSubject<CodeCell>(null);
  protected _hoverSubject$ = new BehaviorSubject<Hover>(null);
  protected _hasLineNumbersSubject$ = new BehaviorSubject<boolean>(false);
  protected _renderedHeapObjectsSubject$ = new BehaviorSubject<{ [id: string]: HeapObject }>({});

  cell$ = this._cellSubject$.asObservable().pipe(filterTruthy());
  hover$ = this._hoverSubject$.asObservable();
  hasLineNumbers$ = this._hasLineNumbersSubject$.asObservable().pipe(distinctUntilChanged());
  renderedHeapObjects$ = this._renderedHeapObjectsSubject$.asObservable();

  visualization$ = this.cell$.pipe(
    switchMap((cell) => this._store.pipe(
      select(VisualizationSelectors.selectVisualizationEntities),
      map((entities) => entities[cell.cell_id])
    )),
    filterTruthy(),
    tap(data => this._loggerSvc.logDebug(`${this._name} >> visualization$`, { data })),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  traceStep$ = this.visualization$.pipe(
    map(state => (state.data || [])[state.step]),
    filterTruthy(),
    tap(data => this._loggerSvc.logDebug(`${this._name} >> traceStep$`, { data })),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  heap$ = this.traceStep$.pipe(
    map(ts => ts.heap),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  allHeapObjectsRendered$ = combineLatest([this.heap$, this.renderedHeapObjects$]).pipe(
    map(([heap, rendered]) => isEmpty(heap.ids) || heap.ids.every((id) => !!rendered[id])),
    tap((rendered) => this._loggerSvc.logDebug(`${this._name} >> allHeapObjectsRendered`, { rendered })),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  constructor(
    protected _store: Store<NbtutorState>,
    protected _loggerSvc: LoggerService,
  ) { }

  setHover(hover: Hover) {
    this._hoverSubject$.next(hover);
  }

  setHasLineNumbers(value: boolean): void {
    this._hasLineNumbersSubject$.next(value);
  }

  setCodeCell(cell: CodeCell): void {
    this._cellSubject$.next(cell);
    this._loggerSvc.logDebug(`${this._name} >> setCodeCell`, { cell });
  }

  heapObjectRendered(heapObject: HeapObject): void {
    this.renderedHeapObjects$.pipe(
      first(),
      map((rendered) => this._renderedHeapObjectsSubject$.next({ ...rendered, [heapObject.id]: heapObject })),
    ).subscribe();
  }

  clearRenderedHeapObject(): void {
    this._renderedHeapObjectsSubject$.next({});
  }

  ngOnDestroy(): void {
    this._loggerSvc.logDebug(`${this._name} >> ngOnDestroy`);
  }
}
