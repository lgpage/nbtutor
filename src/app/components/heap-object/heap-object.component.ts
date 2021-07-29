import { AfterViewInit, Component, OnInit, Type, ViewChild } from '@angular/core';
import { DynamicElementContainerDirective } from '@app/directives';
import { HeapObjectRender } from '@app/models';
import { CellDataService, DomService, LoggerService } from '@app/services';
import { BaseObjectDirective } from '../base-object-directive';
import { CodeObjectComponent } from '../basic-object/basic-object.component';
import {
  KeyValuePairObjectComponent
} from '../key-value-pair-object/key-value-pair-object.component';
import { SequenceObjectComponent } from '../sequence-object/sequence-object.component';

@Component({
  selector: 'nbtutor-heap-object',
  template: '<ng-template dynamicElementContainer></ng-template>',
})
export class HeapObjectComponent extends BaseObjectDirective implements OnInit, AfterViewInit {
  @ViewChild(DynamicElementContainerDirective, { static: true }) protected _container: DynamicElementContainerDirective;

  protected _name = 'HeapObjectComponent';

  constructor(
    protected _domSvc: DomService,
    protected _dataSvc: CellDataService,
    protected _loggerSvc: LoggerService,
  ) {
    super();
  }

  protected resolveObjectComponent(renderType: HeapObjectRender): Type<BaseObjectDirective> {
    switch (renderType) {
      case 'basic':
        return CodeObjectComponent;

      case 'sequence':
        return SequenceObjectComponent;

      case 'kvp':
        return KeyValuePairObjectComponent;

      default:
        return null;
    }
  }

  ngOnInit() {
    this._loggerSvc.logDebug(`${this._name} >> ngOnInit`);
    if (!!this.heapObject.hideReferences && this.heapObject.renderType === 'basic') {
      return;
    }

    const componentType = this.resolveObjectComponent(this.heapObject.renderType);
    if (!!componentType) {
      const componentRef = this._domSvc.createComponent(componentType, this._container.viewContainerRef);
      const component = componentRef.instance;

      component.heap = this.heap;
      component.heapObject = this.heapObject;
    }
  }

  ngAfterViewInit(): void {
    this._dataSvc.heapObjectRendered(this.heapObject);
  }
}
