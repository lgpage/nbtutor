import { cold, getTestScheduler } from 'jasmine-marbles';
import { jsPlumb, jsPlumbInstance } from 'jsplumb';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Connector, TraceStep } from '@app/models';
import { CellDataService } from './cell-data.service';
import { JsPlumbService } from './js-plumb.service';

@Injectable()
class JsPlumbServiceExposed extends JsPlumbService {
  _observables: Observable<any>[];

  setJsPlumb(instance: jsPlumbInstance): void {
    this._jsPlumb = instance;
  }

  initObservables(): void {
    return super.initObservables();
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
        const resetJsPlumbSpy = spyOn(service, 'resetJsPlumb');

        expect(exposed.getDrawConnectors()).toBeObservable(cold('(0|)', [[{ from: 'from', to: 'to' }]]));
        expect(resetJsPlumbSpy).toHaveBeenCalled();
      });
    });

    describe('when jsPlumb instance is truthy', () => {
      it('should call expected methods and emit expected result', () => {
        const jsPlumbSpy = jasmine.createSpyObj<jsPlumbInstance>('jsPlumbInstance', ['connect']);
        const resetJsPlumbSpy = spyOn(service, 'resetJsPlumb');
        exposed.setJsPlumb(jsPlumbSpy);

        expect(exposed.getDrawConnectors()).toBeObservable(cold('(0|)', [[{ from: 'from', to: 'to' }]]));

        expect(resetJsPlumbSpy).toHaveBeenCalled();
        expect(jsPlumbSpy.connect).toHaveBeenCalledWith({ source: 'from', target: 'to' }, { cssClass: 'from' });
      });
    });
  });

  describe('setupJsPlumb', () => {
    it('should call expected methods', () => {
      const getInstanceSpy = spyOn(jsPlumb, 'getInstance');

      service.setupJsPlumb({} as HTMLElement);

      expect(getInstanceSpy).toHaveBeenCalledWith({
        Container: {},
        PaintStyle: { stroke: '#056', strokeWidth: 1, fill: null },
        Endpoint: 'Blank',
        Anchors: ['Right', 'Left'],
        Connector: ['Bezier', { 'curviness': 80 }],
        ConnectionsDetachable: false,
        ConnectionOverlays: [
          ['Arrow', { length: 8, width: 8, location: 1 }]
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
      const jsPlumbSpy = jasmine.createSpyObj<jsPlumbInstance>('jsPlumbInstance', ['repaintEverything']);
      exposed.setJsPlumb(jsPlumbSpy);

      service.repaintConnectors();
      expect(jsPlumbSpy.repaintEverything).toHaveBeenCalled();
    });
  });

  describe('resetJsPlumb', () => {
    it('should call expected methods', () => {
      const jsPlumbSpy = jasmine.createSpyObj<jsPlumbInstance>('jsPlumbInstance', ['reset']);
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
