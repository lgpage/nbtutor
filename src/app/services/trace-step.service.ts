import * as uuid from 'uuid';
import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { deepClone, isEmpty, keys, values } from '@app/helpers';
import {
  CommTraceStep, Connector, HasUniqueIdentifier, Heap, HeapObject, HeapObjectReferences, LineMarker,
  LineMarkerType, StackFrame, TraceStep
} from '@app/models';
import { LoggerService } from './logger.service';

export type ExistingIds = { [id: string]: string; } | null;

export interface Connectors {
  [hash: string]: Connector;
}

export function hashConnector(conn: Connector): string {
  return `${conn.from}-${conn.to}`;
}

@Injectable({
  providedIn: 'root'
})
export class TraceStepService {
  protected _name = 'TraceStepService';

  constructor(
    protected _loggerSvc: LoggerService,
  ) { }

  protected setId(item: HasUniqueIdentifier, existingIds: ExistingIds, prefix: string): void {
    item.uuid = `${prefix}-${uuid.v4()}`;
    if (!!existingIds) {
      item.uuid = existingIds[item.id] || item.uuid;
      existingIds[item.id] = item.uuid;
    }
  }

  protected setArrayIds(collection: HasUniqueIdentifier[], existingIds: ExistingIds, prefix: string): void {
    for (const item of collection) {
      this.setId(item, existingIds, prefix);
    }
  }

  protected setHeapObjectIds(heap: Heap, existingIds: ExistingIds, prefix: string): void {
    for (const id of heap.ids) {
      const heapObject = heap.entities[id];
      this.setId(heapObject, existingIds, prefix);
      if (!!heapObject.references) {
        this.setArrayIds(this.getReferencesArray(heapObject.references), null, 'r');
      }
    }
  }

  protected getReferencesArray(references: HeapObjectReferences): HasUniqueIdentifier[] {
    return Array.isArray(references) ? references : values(references);
  }

  protected createHeapObjectConnector(ref: HasUniqueIdentifier, heap: Heap): Connector {
    return { from: ref.uuid, to: heap.entities[ref.id].uuid };
  }

  protected populateHeapObjectConnectors(references: HeapObjectReferences, heap: Heap, connectors: Connectors): void {
    for (const ref of this.getReferencesArray(references)) {
      const connector = this.createHeapObjectConnector(ref, heap);
      const hash = hashConnector(connector);
      if (!connectors[hash]) {
        connectors[hash] = connector;

        const heapObject = (heap.entities[ref.id] || { references: null });
        if (!!heapObject.references) {
          this.populateHeapObjectConnectors(heapObject.references, heap, connectors);
        }
      }
    }
  }

  protected resolveFrameVariableConnectors(frame: StackFrame, heap: Heap): Connector[] {
    const connectors: Connectors = {};
    this.populateHeapObjectConnectors(frame.variables, heap, connectors);
    return values(connectors);
  }

  protected updateHeapObject(data: TraceStep[], updateFn: (heapObject: HeapObject) => void): TraceStep[] {
    data = deepClone(data);
    for (const traceStep of data) {
      for (const id of traceStep.heap.ids) {
        updateFn(traceStep.heap.entities[id]);
      }
    }

    return data;
  }

  protected mapToLineMarker(lineNumbers: number[], type: LineMarkerType): LineMarker[] {
    return (lineNumbers || []).map((n) => ({ lineNumber: n, type }));
  }

  sanitize(data: CommTraceStep[]): TraceStep[] {
    const objectIds: { [id: string]: string } = {};
    const traceSteps: TraceStep[] = [];

    if (!data || isEmpty(data)) {
      return traceSteps;
    }

    let step = 0;
    for (const commTraceStep of data) {
      const heap: Heap = { ids: keys(commTraceStep.heap), entities: deepClone(commTraceStep.heap) };
      const frames: StackFrame[] = deepClone(commTraceStep.stack.frames);
      const connectors: Connector[] = [];
      const connectorHashes = new Set<string>();
      const lineMarkers: LineMarker[] = [
        ...this.mapToLineMarker((data[step - 1] || {}).lineNumbers, 'previous'),
        ...this.mapToLineMarker((data[step + 1] || {}).lineNumbers, 'next'),
        ...this.mapToLineMarker(commTraceStep.lineNumbers, 'current'),
      ];

      this.setHeapObjectIds(heap, objectIds, 'h');
      this.setArrayIds(frames, {}, 'f');

      for (const frame of frames) {
        this.setArrayIds(frame.variables, null, 'v');
        for (const conn of this.resolveFrameVariableConnectors(frame, heap)) {
          const hash = `${conn.from}-${conn.to}`;
          if (!connectorHashes.has(hash)) {
            connectors.push(conn);
            connectorHashes.add(hash);
          }
        }
      }

      traceSteps.push({ ...commTraceStep, heap, stack: { frames }, connectors, lineMarkers, step });
      step++;
    }

    // TODO: Optimize update into update methods array passed to update heap object
    return this.formatDecimalValues(traceSteps, { float: 2 });
  }

  hideBasicHeapObjectReferences(data: TraceStep[]): TraceStep[] {
    return this.updateHeapObject(data, (heapObject) => heapObject.hideReferences = heapObject.renderType === 'basic');
  }

  hideObjectReferences(data: TraceStep[]): TraceStep[] {
    return this.updateHeapObject(data, (heapObject) => heapObject.hideReferences = true);
  }

  formatDecimalValues(data: TraceStep[], decimalsPerType: { [type: string]: number }): TraceStep[] {
    return this.updateHeapObject(data, (heapObject) => {
      const decimals = decimalsPerType[heapObject.type];
      if (!decimals) { return; }
      try {
        heapObject.value = new DecimalPipe('en-US').transform(heapObject.value, `1.0-${decimals}`);
      } catch {
        // Gulp
      }
    });
  }
}
