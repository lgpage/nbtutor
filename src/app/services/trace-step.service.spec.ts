import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  CommTraceStep, Connector, HasUniqueIdentifier, Heap, HeapObject, StackFrame, TraceStep
} from '@app/models';
import { ExistingIds, TraceStepService } from './trace-step.service';

@Injectable()
class TraceStepServiceExposed extends TraceStepService {
  get name(): string {
    return this._name;
  }

  setId(item: HasUniqueIdentifier, existingIds: ExistingIds, prefix: string): void {
    return super.setId(item, existingIds, prefix);
  }

  setArrayIds(collection: HasUniqueIdentifier[], existingIds: ExistingIds, prefix: string): void {
    return super.setArrayIds(collection, existingIds, prefix);
  }

  setHeapObjectIds(heap: Heap, existingIds: ExistingIds, prefix: string): void {
    return super.setHeapObjectIds(heap, existingIds, prefix);
  }

  resolveFrameVariableConnectors(frame: StackFrame, heap: Heap): Connector[] {
    return super.resolveFrameVariableConnectors(frame, heap);
  }

  updateHeapObject(data: TraceStep[], updateFn: (heapObject: HeapObject) => void): TraceStep[] {
    return super.updateHeapObject(data, updateFn);
  }
}

describe('TraceStepService', () => {
  let exposed: TraceStepServiceExposed;
  let service: TraceStepService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TraceStepServiceExposed,
      ]
    });

    exposed = TestBed.inject(TraceStepServiceExposed);
    service = exposed;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  let item: HasUniqueIdentifier;
  let existingIds: ExistingIds;

  let heap: Heap;
  let frame: StackFrame;
  let traceSteps: TraceStep[];
  let commTraceSteps: CommTraceStep[];

  beforeEach(() => {
    item = { id: 'id' };
    existingIds = { id: 'uuid' };
    heap = {
      ids: ['vA', 'vB', 'vC'],
      entities: {
        vA: { id: 'vA', uuid: 'hUA', type: 'int', value: '10', renderType: 'basic' },
        vB: { id: 'vB', uuid: 'hUB', type: 'int', value: '20', renderType: 'basic' },
        vC: {
          id: 'vC', uuid: 'hUC', type: 'list', value: 'List', renderType: 'sequence', references: [
            { id: 'vA', uuid: 'rUA' },
            { id: 'vB', uuid: 'rUB' },
          ]
        },
      }
    };
    frame = {
      id: 'fA', name: 'name', event: null, variables: [
        { name: 'foo', id: 'vA', uuid: 'vUA' },
        { name: 'bar', id: 'vB', uuid: 'vUB' },
        { name: 'egg', id: 'vC', uuid: 'vUC' },
      ]
    };
    traceSteps = [{ heap, stack: { frames: [frame] }, step: 2 }];
    commTraceSteps = [{ heap: heap.entities, stack: { frames: [frame] } }];
  });

  describe('setId', () => {
    describe('with existing ids', () => {
      it('should set ids as expected', () => {
        exposed.setId(item, existingIds, 'pre');
        expect(item.uuid).toEqual('uuid');
      });
    });

    describe('without existing ids', () => {
      it('should set ids as expected', () => {
        exposed.setId(item, null, 'pre');
        expect(item.uuid).toBeTruthy();
      });
    });
  });

  describe('setArrayIds', () => {
    it('should call the expected method', () => {
      const setIdSpy = spyOn(exposed, 'setId');

      exposed.setArrayIds([item], existingIds, 'pre');
      expect(setIdSpy).toHaveBeenCalledWith(item, existingIds, 'pre');
    });
  });

  describe('setHeapObjectIds', () => {
    it('should call the expected method', () => {
      const setIdSpy = spyOn(exposed, 'setId');
      const setArrayIdsSpy = spyOn(exposed, 'setArrayIds');

      exposed.setHeapObjectIds(heap, existingIds, 'pre');
      for (const id of heap.ids) {
        expect(setIdSpy).toHaveBeenCalledWith(heap.entities[id], existingIds, 'pre');
      }
      expect(setArrayIdsSpy).toHaveBeenCalledWith([{ id: 'vA', uuid: 'rUA' }, { id: 'vB', uuid: 'rUB' }], null, 'r');
    });
  });

  describe('resolveFrameVariableConnectors', () => {
    it('should return the expected result', () => {
      const result = exposed.resolveFrameVariableConnectors(frame, heap);

      expect(result).toEqual([
        { from: 'vUA', to: 'hUA' },
        { from: 'vUB', to: 'hUB' },
        { from: 'vUC', to: 'hUC' },
        { from: 'rUA', to: 'hUA' },
        { from: 'rUB', to: 'hUB' },
      ]);
    });
  });

  describe('sanitize', () => {
    it('should call methods and set values as expected', () => {
      const setHeapObjectIdsSpy = spyOn(exposed, 'setHeapObjectIds');
      const setArrayIdsSpy = spyOn(exposed, 'setArrayIds');
      const resolveFrameVariableConnectorsSpy = spyOn(exposed, 'resolveFrameVariableConnectors').and.returnValue([]);

      const result = service.sanitize(commTraceSteps);

      expect(setHeapObjectIdsSpy).toHaveBeenCalledWith(heap, {}, 'h');
      expect(setArrayIdsSpy).toHaveBeenCalledWith([frame], {}, 'f');
      expect(setArrayIdsSpy).toHaveBeenCalledWith(frame.variables, null, 'v');
      expect(resolveFrameVariableConnectorsSpy).toHaveBeenCalledWith(frame, heap);

      expect(result[0].step).toEqual(0);
      expect(result[0].connectors).toEqual([]);
    });
  });

  describe('updateHeapObject', () => {
    let updateHeapObjectSpy: jasmine.Spy;
    beforeEach(() => {
      updateHeapObjectSpy = spyOn(exposed, 'updateHeapObject').and.returnValue(traceSteps);
    });

    it('should set values as expected', () => {
      const updateFnSpy = jasmine.createSpy('updateFn');
      updateHeapObjectSpy.and.callThrough();

      const result = exposed.updateHeapObject(traceSteps, updateFnSpy);
      expect(result).toEqual(traceSteps);
      for (const id of heap.ids) {
        expect(updateFnSpy).toHaveBeenCalledWith(heap.entities[id]);
      }
    });

    describe('hideBasicHeapObjectReferences', () => {
      it('should call the expected method', () => {
        expect(service.hideBasicHeapObjectReferences([])).toBe(traceSteps);
        expect(updateHeapObjectSpy).toHaveBeenCalledWith([], jasmine.any(Function));

        const updateFn = updateHeapObjectSpy.calls.mostRecent().args[1];

        let heapObject = { renderType: 'basic' } as HeapObject;
        expect(updateFn(heapObject));
        expect(heapObject.hideReferences).toBeTrue();

        heapObject = { renderType: 'sequence' } as HeapObject;
        expect(updateFn(heapObject));
        expect(heapObject.hideReferences).toBeFalse();
      });
    });

    describe('hideObjectReferences', () => {
      it('should call the expected method', () => {
        expect(service.hideObjectReferences([])).toBe(traceSteps);
        expect(updateHeapObjectSpy).toHaveBeenCalledWith([], jasmine.any(Function));

        const updateFn = updateHeapObjectSpy.calls.mostRecent().args[1];

        const heapObject = {} as HeapObject;
        expect(updateFn(heapObject));
        expect(heapObject.hideReferences).toBeTrue();
      });
    });

    describe('formatDecimalValues', () => {
      let heapObject: HeapObject;
      beforeEach(() => {
        heapObject = { type: 'float', value: '2.12345' } as HeapObject;
      });

      it('should call the expected method', () => {
        expect(service.formatDecimalValues([], { float: 2 })).toBe(traceSteps);
        expect(updateHeapObjectSpy).toHaveBeenCalledWith([], jasmine.any(Function));

        const updateFn = updateHeapObjectSpy.calls.mostRecent().args[1];

        expect(updateFn(heapObject));
        expect(heapObject.value).toEqual('2.12');
      });

      describe('when decimals not specified', () => {
        it('should do nothing', () => {
          expect(service.formatDecimalValues([], {})).toBe(traceSteps);
          expect(updateHeapObjectSpy).toHaveBeenCalledWith([], jasmine.any(Function));

          const updateFn = updateHeapObjectSpy.calls.mostRecent().args[1];

          expect(updateFn(heapObject));
          expect(heapObject.value).toEqual('2.12345');
        });
      });
    });
  });
});
