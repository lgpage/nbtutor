import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[dynamicElementContainer]'
})
export class DynamicElementContainerDirective {
  constructor(
    public viewContainerRef: ViewContainerRef,
  ) { }
}
