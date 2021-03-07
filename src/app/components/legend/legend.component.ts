import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { showError, showVisualization } from '@app/helpers';
import { VisualizationData } from '@app/models';
import { CellService, LoggerService } from '@app/services';

@Component({
  selector: 'nbtutor-legend',
  templateUrl: './legend.component.html',
})
export class LegendComponent implements OnInit {
  protected _name = 'LegendComponent';
  protected _cellServiceSubject$ = new BehaviorSubject<CellService>(null);

  arrowIcon = 'fa fa-long-arrow-right fa-long-arrow-alt-right fa-lg';

  cellService$ = this._cellServiceSubject$.asObservable();
  visualization$ = this.cellService$.pipe(
    filter((cellSvc) => !!cellSvc),
    switchMap((cellSvc) => cellSvc.visualization$),
  );

  showInfoMessage$ = this.cellService$.pipe(
    filter((cellSvc) => !!cellSvc),
    switchMap((cellSvc) => combineLatest([cellSvc.hasLineNumber$, cellSvc.visualization$])),
    map(([hasLineNumbers, visualization]) => visualization.visualize && !hasLineNumbers),
    distinctUntilChanged(),
    tap((showInfoMessage) => this._loggerSvc.logDebug(`${this._name} >> showInfoMessage$`, { showInfoMessage })),
  );

  constructor(
    protected _loggerSvc: LoggerService,
  ) { }

  ngOnInit(): void {
    this._loggerSvc.logDebug(`${this._name} >> ngOnInit`);
  }

  showVisualization(visualization: VisualizationData): boolean {
    return showVisualization(visualization);
  }

  showError(visualization: VisualizationData): boolean {
    return showError(visualization);
  }

  setCellService(cellSvc: CellService): void {
    this._cellServiceSubject$.next(cellSvc);
  }
}
