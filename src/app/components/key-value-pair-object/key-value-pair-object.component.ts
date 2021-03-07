import { Component, Input, OnInit } from '@angular/core';
import { keys } from '@app/helpers';
import {
  DefaultRenderOptions, HasUniqueIdentifier, KeyValuePairHeapObject, RenderOptions
} from '@app/models';
import { BaseObjectDirective } from '../base-object-directive';

@Component({
  selector: 'nbtutor-key-value-pair-object',
  templateUrl: './key-value-pair-object.component.html',
})
export class KeyValuePairObjectComponent extends BaseObjectDirective implements OnInit {
  protected _name = 'KeyValuePairObjectComponent';

  @Input() heapObject: KeyValuePairHeapObject;

  keys: string[];
  references: { [key: string]: HasUniqueIdentifier };
  renderOptions: RenderOptions;

  ngOnInit(): void {
    this.keys = keys(this.heapObject.references);
    this.references = this.heapObject.references;
    this.renderOptions = { ...DefaultRenderOptions, ...this.heapObject.renderOptions };
  }

  getObjectValue(key: string): string {
    const heapObject = this.heap.entities[this.references[key].id];
    if (!!heapObject && !!heapObject.hideReferences) {
      return !!heapObject ? heapObject.value : null;
    }

    return null;
  }
}
