import { cold, getTestScheduler } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CodeCell, Heap, Hover, TraceStep, VisualizationData } from '@app/models';
import { CellDataService } from './cell-data.service';
import { CellService } from './cell.service';
import { CodeMirrorService } from './code-mirror.service';
import { JsPlumbService } from './js-plumb.service';

@Injectable()
class CellServiceExposed extends CellService {
  _observables: Observable<any>[];

  initObservables(): void {
    return super.initObservables();
  }

  getHandleOutputAction(text?: string): Observable<CodeCell> {
    return super.getHandleOutputAction(text);
  }

  subscribeToObservables(): void { }
}

describe('CellService', () => {
  let service: CellService;
  let exposed: CellServiceExposed;

  let heap: Heap;
  let cell: CodeCell;
  let traceStep: TraceStep;
  let data: VisualizationData;
  let hover: Hover;

  let outputAreaSpy: jasmine.SpyObj<OutputArea>;
  let jsPlumbServiceSpy: jasmine.SpyObj<JsPlumbService>;
  let cellDataServiceSpy: jasmine.SpyObj<CellDataService>;

  beforeEach(() => {
    outputAreaSpy = jasmine.createSpyObj<OutputArea>('OutputArea', ['clear_output', 'handle_output']);
    jsPlumbServiceSpy = jasmine.createSpyObj<JsPlumbService>('JsPlumbService', ['setupJsPlumb']);
    cellDataServiceSpy = jasmine.createSpyObj<CellDataService>(
      'CellDataService',
      ['setCodeCell', 'setHover', 'clearRenderedHeapObject']
    );

    heap = {} as Heap;
    traceStep = { heap, stdout: 'stdout' } as TraceStep;
    data = { cellId: 'id', step: 0, maxSteps: 4, visualize: true, data: [traceStep] };
    cell = { cell_id: 'id', cell_type: 'code', element: null, metadata: { nbtutor: data }, output_area: outputAreaSpy, code_mirror: null };
    hover = { from: { id: 'id' }, to: { id: 'other-id' } };

    cellDataServiceSpy.cell$ = cold('0', [cell]);
    cellDataServiceSpy.hover$ = cold('0', [hover]);
    cellDataServiceSpy.hasLineNumbers$ = cold('0', [false]);
    cellDataServiceSpy.visualization$ = cold('0', [data]);
    cellDataServiceSpy.traceStep$ = cold('0', [traceStep]);
    cellDataServiceSpy.heap$ = cold('0', [heap]);

    TestBed.configureTestingModule({
      providers: [
        CellServiceExposed,
        { provide: CellDataService, useValue: cellDataServiceSpy },
        { provide: JsPlumbService, useValue: jsPlumbServiceSpy },
        { provide: CodeMirrorService, useValue: {} },
      ]
    });

    exposed = TestBed.inject(CellServiceExposed);
    service = exposed;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('property observables', () => {
    it('should emit expected values', () => {
      expect(service.cell$).toBeObservable(cold('0', [cell]));
      expect(service.hover$).toBeObservable(cold('0', [hover]));
      expect(service.hasLineNumber$).toBeObservable(cold('0', [false]));
      expect(service.visualization$).toBeObservable(cold('0', [data]));
      expect(service.traceStep$).toBeObservable(cold('0', [traceStep]));
      expect(service.heap$).toBeObservable(cold('0', [heap]));
    });
  });

  describe('initObservables', () => {
    describe('clearHeapObjectsRendered$', () => {
      it('should call expected methods', () => {
        const clearHeapObjectsRendered$ = exposed._observables[0];

        expect(clearHeapObjectsRendered$).toBeTruthy();
        expect(clearHeapObjectsRendered$).toBeObservable(cold('0', [heap]));
        expect(cellDataServiceSpy.clearRenderedHeapObject).toHaveBeenCalled();
      });
    });

    describe('outputStdOut$', () => {
      it('should call expected methods and emit expected result', () => {
        const outputStdOut$ = exposed._observables[1];
        const handleStdoutSpy = spyOn(service, 'handleStdout');

        expect(outputStdOut$).toBeTruthy();
        getTestScheduler().run(({ expectObservable }) => {
          expectObservable(outputStdOut$).toBe('20ms 0', ['stdout']);
        });
        expect(handleStdoutSpy).toHaveBeenCalledWith('stdout');
      });
    });
  });

  describe('setHover', () => {
    it('should call expected methods', () => {
      service.setHover(hover);
      expect(cellDataServiceSpy.setHover).toHaveBeenCalledWith(hover);
    });
  });

  describe('setCodeCell', () => {
    it('should call expected methods', () => {
      service.setCodeCell({} as CodeCell);
      expect(cellDataServiceSpy.setCodeCell).toHaveBeenCalledWith({} as CodeCell);
    });
  });

  describe('getHandleOutputAction', () => {
    describe('when text is falsy', () => {
      it('should emit the expected result', () => {
        expect(exposed.getHandleOutputAction()).toBeObservable(cold('(0|)', [cell]));
        expect(outputAreaSpy.clear_output).toHaveBeenCalled();
        expect(outputAreaSpy.handle_output).not.toHaveBeenCalled();
      });
    });

    describe('when text is truthy', () => {
      it('should emit the expected result', () => {
        expect(exposed.getHandleOutputAction('text')).toBeObservable(cold('(0|)', [cell]));
        expect(outputAreaSpy.clear_output).toHaveBeenCalled();
        expect(outputAreaSpy.handle_output).toHaveBeenCalledWith({
          header: { msg_type: 'stream' },
          content: { name: 'nbtutor', text: 'text' },
        });
      });
    });
  });

  describe('handleStdout', () => {
    it('should call expected methods', () => {
      const getHandleOutputActionSpy = spyOn(exposed, 'getHandleOutputAction').and.returnValue(cold('0', [null]));

      service.handleStdout('text');
      expect(getHandleOutputActionSpy).toHaveBeenCalled();
    });
  });
});
