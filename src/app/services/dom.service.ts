import {
  ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector,
  Type, ViewContainerRef
} from '@angular/core';
import { LoggerService } from './logger.service';

declare var $: JQueryStatic;

export type ElementSelector = string | HTMLElement | JQuery<HTMLElement>;

@Injectable({
  providedIn: 'root'
})
export class DomService {
  protected _name = 'DomService';

  constructor(
    protected _componentFactoryResolver: ComponentFactoryResolver,
    protected _applicationRef: ApplicationRef,
    protected _injector: Injector,
    protected _loggerSvc: LoggerService,
  ) { }

  protected getJQueryElement(selector: ElementSelector): JQuery<HTMLElement> {
    return typeof selector === 'string' ? $(selector) : $(selector);
  }

  protected getComponentElement<T>(componentRef: ComponentRef<T>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }

  protected addComponent<T>(
    componentType: Type<T>,
    elementExists: () => boolean,
    getParentElement: () => JQuery<HTMLElement>,
  ): ComponentRef<T> {
    if (elementExists()) { return; }

    const factory = this._componentFactoryResolver.resolveComponentFactory(componentType);
    const componentRef = factory.create(this._injector);

    this._applicationRef.attachView(componentRef.hostView);

    const parentElement = getParentElement();
    const childElement = this.getComponentElement(componentRef);
    parentElement.append(childElement);

    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }

  createChildComponent<T>(
    componentType: Type<T>,
    componentSelector: string,
    parent: ElementSelector
  ): ComponentRef<T> {
    return this.addComponent(
      componentType,
      () => !!(this.getJQueryElement(componentSelector).length),
      () => this.getJQueryElement(parent),
    );
  }

  createComponent<T>(componentType: Type<T>, viewContainerRef: ViewContainerRef): ComponentRef<T> {
    if (!!componentType && !!viewContainerRef) {
      viewContainerRef.clear();

      const factory = this._componentFactoryResolver.resolveComponentFactory(componentType);
      const componentRef = viewContainerRef.createComponent(factory);
      return componentRef;
    }
  }
}
