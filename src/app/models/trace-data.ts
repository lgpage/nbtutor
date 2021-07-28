import { HasSequence } from './has-sequence';
import { HasUniqueIdentifier } from './has-unique-identifier';

export type HeapObjectRender = 'basic' | 'sequence' | 'kvp';
export type LineMarkerType = 'previous' | 'current' | 'next';

export interface LineMarker {
  type: LineMarkerType;
  lineNumber: number;
}

export interface Connector {
  from: string;
  to: string;
}

export interface TraceStep {
  step: number;
  stack: Stack;
  heap: Heap;
  connectors?: Connector[];
  lineMarkers?: LineMarker[];
  stdout?: string;
  stderr?: string;
}

export interface CommTraceStep extends Pick<TraceStep, 'stack' | 'stdout' | 'stderr'> {
  lineNumbers?: number[];
  heap: { [id: string]: HeapObject };
}

export interface Stack {
  frames: StackFrame[];
}

export interface Heap {
  ids: string[];
  entities: { [id: string]: HeapObject };
}

export type HeapObjectReferences = HasUniqueIdentifier[] | { [key: string]: HasUniqueIdentifier };

export interface RenderOptions {
  concat?: boolean;
}

export interface HeapObject extends Partial<HasSequence>, HasUniqueIdentifier {
  type: string;
  value: string;
  renderType: HeapObjectRender;
  references?: HeapObjectReferences;
  hideReferences?: boolean;
  decimals?: number;
  immutable?: boolean;
  renderOptions?: RenderOptions;
}

export interface BasicHeapObject extends HeapObject {
  references: null;
}

export interface SequenceHeapObject extends HeapObject {
  references: HasUniqueIdentifier[];
}

export interface KeyValuePairHeapObject extends HeapObject {
  references: { [key: string]: HasUniqueIdentifier };
}

export interface StackFrame extends HasUniqueIdentifier {
  name: string;
  event: string;
  variables: Variable[];
}

export interface Variable extends Partial<HasSequence>, HasUniqueIdentifier {
  name: string;
}

export const DefaultRenderOptions: RenderOptions = {
  concat: false,
};
