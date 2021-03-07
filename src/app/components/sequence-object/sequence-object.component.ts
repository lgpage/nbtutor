import { Component, Input, OnInit } from '@angular/core';
import {
  DefaultRenderOptions, HasUniqueIdentifier, RenderOptions, SequenceHeapObject
} from '@app/models';
import { BaseObjectDirective } from '../base-object-directive';

@Component({
  selector: 'nbtutor-sequence-object',
  templateUrl: './sequence-object.component.html',
})
export class SequenceObjectComponent extends BaseObjectDirective implements OnInit {
  protected _name = 'SequenceObjectComponent';

  @Input() heapObject: SequenceHeapObject;

  indexes: number[];
  references: HasUniqueIdentifier[];
  renderOptions: RenderOptions;

  ngOnInit(): void {
    this.indexes = this.heapObject.references.map((_, i) => i);
    this.references = this.heapObject.references;
    this.renderOptions = { ...DefaultRenderOptions, ...this.heapObject.renderOptions };
  }

  getObjectValue(reference: HasUniqueIdentifier): string {
    const heapObject = this.heap.entities[reference.id];
    if (!!heapObject && !!heapObject.hideReferences) {
      return !!heapObject ? heapObject.value : null;
    }

    return null;
  }
}
