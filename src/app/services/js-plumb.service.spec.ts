/* eslint-disable @typescript-eslint/no-empty-function */
import { cold, getTestScheduler } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Connector, TraceStep } from '@app/models';
import { BrowserJsPlumbDefaults, BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { CellDataService } from './cell-data.service';
import { JsPlumbService } from './js-plumb.service';

@Injectable()
class JsPlumbServiceExposed extends JsPlumbService {
  _observables: Observable<any>[];

  createJsPlumbInstance(options: BrowserJsPlumbDefaults): void {
    return super.createJsPlumbInstance(options);
  }

  setJsPlumb(instance: BrowserJsPlumbInstance): void {
    this._jsPlumb = instance;
  }

  initObservables(): void {
    return super.initObservables();
  }

  getElementById(id: string): HTMLElement {
    return super.getElementById(id);
  }

  getDrawConnectors(): Observable<Connector[]> {
    return super.getDrawConnectors();
  }

  subscribeToObservables(): void { }
}

describe('JsPlumbService', () => {
  let exposed: JsPlumbServiceExposed;
  let service: JsPlumbService;

  let connectors: Connector[];
  let traceStep: TraceStep;

  let cellDataServiceSpy: jasmine.SpyObj<CellDataService>;

  beforeEach(() => {
    connectors = [{ from: 'from', to: 'to' }];
    traceStep = { step: null, stack: null, heap: null, connectors };

    cellDataServiceSpy = jasmine.createSpyObj<CellDataService>('CellDataService', ['setCodeCell']);
    cellDataServiceSpy.traceStep$ = cold('0', [traceStep]);
    cellDataServiceSpy.allHeapObjectsRendered$ = cold('0', [true]);

    TestBed.configureTestingModule({
      providers: [
        JsPlumbServiceExposed,
        { provide: CellDataService, useValue: cellDataServiceSpy },
      ]
    });

    exposed = TestBed.inject(JsPlumbServiceExposed);
    service = exposed;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initObservables', () => {
    beforeEach(() => {
      exposed.initObservables();
    });

    describe('connectObjects$', () => {
      it('should emit the expected result', () => {
        const drawConnectorsSpy = spyOn(service, 'drawConnectors');

        getTestScheduler().run(({ expectObservable }) => {
          expectObservable(exposed._observables[0]).toBe('60ms 0', [true]);
        });

        expect(drawConnectorsSpy).toHaveBeenCalled();
      });
    });
  });

  describe('getDrawConnectors', () => {
    describe('when jsPlumb instance is truthy', () => {
      it('should call expected methods and emit expected result', () => {
        const from = {} as HTMLElement;
        const to = {} as HTMLElement;

        const jsPlumbSpy = jasmine.createSpyObj<BrowserJsPlumbInstance>('BrowserJsPlumbInstance', ['connect']);
        const resetJsPlumbSpy = spyOn(service, 'resetJsPlumb');
        const getElementByIdSpy = spyOn(exposed, 'getElementById')
          .withArgs('from').and.returnValue(from)
          .withArgs('to').and.returnValue(to);

        // Act
        exposed.setJsPlumb(jsPlumbSpy);

        expect(exposed.getDrawConnectors()).toBeObservable(cold('(0|)', [[{ from: 'from', to: 'to' }]]));

        expect(resetJsPlumbSpy).toHaveBeenCalled();
        expect(getElementByIdSpy).toHaveBeenCalledWith('from');
        expect(getElementByIdSpy).toHaveBeenCalledWith('to');
        expect(jsPlumbSpy.connect).toHaveBeenCalledWith({ source: from, target: to }, { cssClass: 'from' });
      });
    });
  });

  describe('setupJsPlumb', () => {
    it('should call expected methods', () => {
      const container = {} as HTMLElement;
      const getInstanceSpy = spyOn(exposed, 'createJsPlumbInstance');
      const resetJsPlumbSpy = spyOn(exposed, 'resetJsPlumb');

      service.setupJsPlumb(container);

      expect(resetJsPlumbSpy).toHaveBeenCalled();
      expect(getInstanceSpy).toHaveBeenCalledWith({
        container: container,
        paintStyle: { stroke: '#056', strokeWidth: 1, fill: null },
        endpoint: 'Blank',
        anchors: ['Right', 'Left'],
        connector: { type: 'Bezier', options: { curviness: 80 } },
        connectionsDetachable: false,
        connectionOverlays: [
          { type: 'Arrow', options: { length: 8, width: 8, location: 1 } }
        ],
      });
    });
  });

  describe('drawConnectors', () => {
    it('should call expected methods', () => {
      const getDrawConnectorsSpy = spyOn(exposed, 'getDrawConnectors').and.returnValue(cold('0', [true]));

      service.drawConnectors();
      expect(getDrawConnectorsSpy).toHaveBeenCalled();
    });
  });

  describe('repaintConnectors', () => {
    it('should call expected methods', () => {
      const jsPlumbSpy = jasmine.createSpyObj<BrowserJsPlumbInstance>('BrowserJsPlumbInstance', ['repaintEverything']);
      exposed.setJsPlumb(jsPlumbSpy);

      service.repaintConnectors();
      expect(jsPlumbSpy.repaintEverything).toHaveBeenCalled();
    });
  });

  describe('resetJsPlumb', () => {
    it('should call expected methods', () => {
      const jsPlumbSpy = jasmine.createSpyObj<BrowserJsPlumbInstance>('BrowserJsPlumbInstance', ['reset']);
      exposed.setJsPlumb(jsPlumbSpy);

      service.resetJsPlumb();
      expect(jsPlumbSpy.reset).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call expected methods', () => {
      const resetJsPlumbSpy = spyOn(service, 'resetJsPlumb');

      service.ngOnDestroy();
      expect(resetJsPlumbSpy).toHaveBeenCalled();
    });
  });
});
