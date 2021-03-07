import {
  BasicHeapObject, HeapObject, KeyValuePairHeapObject, SequenceHeapObject
} from '@app/models';

export function basicHeapObjectValue(obj: HeapObject): obj is BasicHeapObject {
  return obj.renderType === 'basic';
}

export function sequenceHeapObjectValue(obj: HeapObject): obj is SequenceHeapObject {
  return obj.renderType === 'sequence';
}

export function kvpHeapObjectValue(obj: HeapObject): obj is KeyValuePairHeapObject {
  return obj.renderType === 'kvp';
}

export function sortHeapObject(items: HeapObject[]): HeapObject[] {
  return [...items].sort((a, b) => {
    if (a.sequence < b.sequence) { return -1; }
    if (a.sequence > b.sequence) { return 1; }
    return a.id < b.id ? -1 : 1;
  });
}
