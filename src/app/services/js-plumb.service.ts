import { Defaults, jsPlumb, jsPlumbInstance } from 'jsplumb';
import { noop, Observable } from 'rxjs';
import { debounceTime, first, map, tap } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { HasSubscriptionsDirective } from '@app/helpers';
import { Connector } from '@app/models';
import { CellDataService } from './cell-data.service';
import { LoggerService } from './logger.service';

declare var $: JQueryStatic;

@Injectable()
export class JsPlumbService extends HasSubscriptionsDirective implements OnDestroy {
  protected _name = 'JsPlumbService';
  protected _jsPlumb: jsPlumbInstance;

  constructor(
    protected _dataSvc: CellDataService,
    protected _loggerSvc: LoggerService,
  ) {
    super();
    this.initObservables();
    this.subscribeToObservables();
  }

  protected initObservables(): void {
    const connectObjects$ = this._dataSvc.allHeapObjectsRendered$.pipe(
      debounceTime(60),  // Not ideal, but need to wait for css to be applied (layout change done) before drawing connectors
      tap((rendered) => rendered ? this.drawConnectors() : noop),
    );

    this._observables = [connectObjects$];
  }

  protected getDrawConnectors(): Observable<Connector[]> {
    return this._dataSvc.traceStep$.pipe(
      first(),
      map((visualization) => visualization.connectors),
      tap(() => this.resetJsPlumb()),
      tap((connectors) => {
        if (!!this._jsPlumb) {
          this._loggerSvc.logDebug(`${this._name} >> drawConnectors`, { connectors, jsPlumb: this._jsPlumb });
          for (const connector of connectors) {
            this._jsPlumb.connect({ source: connector.from, target: connector.to }, { cssClass: connector.from });
          }
        }
      }),
    );
  }

  setupJsPlumb(container?: HTMLElement): void {
    this.resetJsPlumb();

    const options: Defaults = {
      Container: container || 'body',
      PaintStyle: { stroke: '#056', strokeWidth: 1, fill: null },
      Endpoint: 'Blank',
      Anchors: ['Right', 'Left'],
      Connector: ['Bezier', { curviness: 80 }],
      ConnectionsDetachable: false,
      ConnectionOverlays: [
        ['Arrow', { length: 8, width: 8, location: 1 }]
      ],
    };

    this._loggerSvc.logDebug(`${this._name} >> setupJsPlumb`, { options });
    this._jsPlumb = jsPlumb.getInstance(options);
  }

  drawConnectors(): void {
    this.getDrawConnectors().subscribe();
  }

  toggleHoverClass(uuid: string): void {
    $(`svg.${uuid}`).toggleClass('jtk-hover');
  }

  repaintConnectors(): void {
    if (!!this._jsPlumb) {
      this._jsPlumb.repaintEverything();
    }
  }

  resetJsPlumb(): void {
    if (!!this._jsPlumb) {
      this._jsPlumb.reset();
    }
  }

  ngOnDestroy(): void {
    this._loggerSvc.logDebug(`${this._name} >> ngOnDestroy`);
    this.resetJsPlumb();
    super.ngOnDestroy();
  }
}
