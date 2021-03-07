import { Directive, Input } from '@angular/core';
import { Heap, HeapObject } from '@app/models/trace-data';

@Directive()
export abstract class BaseObjectDirective {
  protected abstract _name: string;

  @Input() heap: Heap;
  @Input() heapObject: HeapObject;
}
