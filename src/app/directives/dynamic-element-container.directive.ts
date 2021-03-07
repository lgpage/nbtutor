import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[dynamicElementContainer]'
})
export class DynamicElementContainerDirective {
  constructor(
    public viewContainerRef: ViewContainerRef,
  ) { }
}
