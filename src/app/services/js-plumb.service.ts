import { noop, Observable } from 'rxjs';
import { debounceTime, first, map, tap } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { HasSubscriptionsDirective } from '@app/helpers';
import { Connector } from '@app/models';
import { BrowserJsPlumbDefaults, BrowserJsPlumbInstance, newInstance } from '@jsplumb/browser-ui';
import { BezierConnector } from '@jsplumb/connector-bezier';
import { CellDataService } from './cell-data.service';
import { LoggerService } from './logger.service';

declare let $: JQueryStatic;

@Injectable()
export class JsPlumbService extends HasSubscriptionsDirective implements OnDestroy {
  protected _name = 'JsPlumbService';
  protected _jsPlumb: BrowserJsPlumbInstance;

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

  protected createJsPlumbInstance(options: BrowserJsPlumbDefaults): void {
    this._jsPlumb = newInstance(options);
  }

  protected getElementById(id: string): HTMLElement {
    return document.getElementById(id);
  }

  protected getDrawConnectors(): Observable<Connector[]> {
    return this._dataSvc.traceStep$.pipe(
      first(),
      map((visualization) => visualization.connectors),
      tap(() => this.resetJsPlumb()),
      tap((connectors) => {
        if (this._jsPlumb) {
          this._loggerSvc.logDebug(`${this._name} >> drawConnectors`, { connectors, jsPlumb: this._jsPlumb });
          for (const connector of connectors) {
            const source = this.getElementById(connector.from);
            const target = this.getElementById(connector.to);
            this._jsPlumb.connect({ source, target }, { cssClass: connector.from });
          }
        }
      }),
    );
  }

  setupJsPlumb(container: HTMLElement): void {
    this.resetJsPlumb();
    const options: BrowserJsPlumbDefaults = {
      container: container,
      paintStyle: { stroke: '#056', strokeWidth: 1, fill: null },
      endpoint: 'Blank',
      anchors: ['Right', 'Left'],
      connector: { type: BezierConnector.type, options: { curviness: 80 } },
      connectionsDetachable: false,
      connectionOverlays: [
        { type: 'Arrow', options: { length: 8, width: 8, location: 1 } }
      ],
    };

    this._loggerSvc.logDebug(`${this._name} >> setupJsPlumb`, { options });
    this.createJsPlumbInstance(options);
  }

  drawConnectors(): void {
    this.getDrawConnectors().subscribe();
  }

  toggleHoverClass(uuid: string): void {
    $(`svg.${uuid}`).toggleClass('jtk-hover');
  }

  repaintConnectors(): void {
    if (this._jsPlumb) {
      this._jsPlumb.repaintEverything();
    }
  }

  resetJsPlumb(): void {
    if (this._jsPlumb) {
      this._jsPlumb.reset();
    }
  }

  ngOnDestroy(): void {
    this._loggerSvc.logDebug(`${this._name} >> ngOnDestroy`);
    this.resetJsPlumb();
    super.ngOnDestroy();
  }
}
