import { cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { CodeCell, Connector, Heap, HeapObject, TraceStep, VisualizationData } from '@app/models';
import { NbtutorState } from '@app/store/reducers';
import { VisualizationSelectors } from '@app/store/selectors';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CellDataService } from './cell-data.service';

describe('CellDataService', () => {
  let service: CellDataService;
  let store: MockStore<NbtutorState>;

  let heap: Heap;
  let connectors: Connector[];
  let traceStep: TraceStep;
  let entity: VisualizationData;
  let cell: CodeCell;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CellDataService,
        provideMockStore<NbtutorState>(),
      ],
    });

    const output_area: OutputArea = { clear_output() { }, handle_output() { } };

    heap = { ids: ['id'], entities: { id: null } };
    connectors = [{ from: 'from', to: 'to' }];
    traceStep = { step: null, stack: null, heap, connectors };
    entity = { cellId: 'id', step: 0, maxSteps: 4, visualize: true, data: [traceStep] };
    cell = { cell_id: 'id', cell_type: 'code', element: null, metadata: { nbtutor: entity }, output_area, code_mirror: null };

    store = TestBed.inject(MockStore);
    store.overrideSelector(VisualizationSelectors.selectVisualizationEntities, { id: entity });

    service = TestBed.inject(CellDataService);
  });

  afterEach(() => store.resetSelectors());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setCodeCell / cell$', () => {
    it('should emit the expected result', () => {
      expect(service.cell$).toBeObservable(cold('-'));

      service.setCodeCell(cell);
      expect(service.cell$).toBeObservable(cold('0', [cell]));
    });
  });

  describe('visualization$', () => {
    it('should emit the expected result', () => {
      expect(service.cell$).toBeObservable(cold('-'));

      service.setCodeCell(cell);
      expect(service.visualization$).toBeObservable(cold('0', [entity]));
    });
  });

  describe('traceStep$', () => {
    describe('when data is truthy', () => {
      it('should emit the expected result', () => {
        expect(service.traceStep$).toBeObservable(cold('-'));

        service.setCodeCell(cell);
        expect(service.traceStep$).toBeObservable(cold('0', [traceStep]));
      });
    });

    describe('when data is falsy', () => {
      it('should emit the expected result', () => {
        store.overrideSelector(VisualizationSelectors.selectVisualizationEntities, { id: { ...entity, data: [] } });
        expect(service.traceStep$).toBeObservable(cold('-'));

        service.setCodeCell(cell);
        expect(service.traceStep$).toBeObservable(cold('-'));
      });
    });
  });

  describe('heap$', () => {
    it('should emit the expected result', () => {
      expect(service.heap$).toBeObservable(cold('-'));

      service.setCodeCell(cell);
      expect(service.heap$).toBeObservable(cold('0', [heap]));
    });
  });

  describe('heapObjectRendered / allHeapObjectsRendered$', () => {
    describe('when heap ids are empty', () => {
      it('should emit the expected result', () => {
        expect(service.allHeapObjectsRendered$).toBeObservable(cold('-'));

        cell.metadata.nbtutor.data[0].heap = { ids: [], entities: {} };
        service.setCodeCell(cell);

        expect(service.allHeapObjectsRendered$).toBeObservable(cold('0', [true]));
      });
    });

    describe('when not all heap objects are rendered', () => {
      it('should emit the expected result', () => {
        expect(service.allHeapObjectsRendered$).toBeObservable(cold('-'));

        service.setCodeCell(cell);
        expect(service.allHeapObjectsRendered$).toBeObservable(cold('0', [false]));
      });
    });

    describe('when all heap objects are rendered', () => {
      it('should emit the expected result', () => {
        expect(service.allHeapObjectsRendered$).toBeObservable(cold('-'));

        service.setCodeCell(cell);
        service.heapObjectRendered({ id: 'id' } as HeapObject);
        expect(service.allHeapObjectsRendered$).toBeObservable(cold('0', [true]));
      });
    });
  });

  describe('setHover / hover$', () => {
    it('should set hover subject', () => {
      expect(service.hover$).toBeObservable(cold('0', [null]));

      service.setHover({ from: { id: 'a' }, to: { id: 'b' } });
      expect(service.hover$).toBeObservable(cold('0', [{ from: { id: 'a' }, to: { id: 'b' } }]));
    });
  });

  describe('setHasLineNumbers / hasLineNumbers$', () => {
    it('should set has line numbers subject', () => {
      expect(service.hasLineNumbers$).toBeObservable(cold('0', [false]));

      service.setHasLineNumbers(true);
      expect(service.hasLineNumbers$).toBeObservable(cold('0', [true]));
    });
  });

  describe('clearRenderedHeapObject / renderedHeapObjects$', () => {
    it('should set has line numbers subject', () => {
      expect(service.renderedHeapObjects$).toBeObservable(cold('0', [{}]));

      service.heapObjectRendered({ id: 'id' } as HeapObject);
      expect(service.renderedHeapObjects$).toBeObservable(cold('0', [{ id: { id: 'id' } }]));

      service.clearRenderedHeapObject();
      expect(service.renderedHeapObjects$).toBeObservable(cold('0', [{}]));
    });
  });
});
