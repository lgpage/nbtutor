import {
  ApplicationRef, ChangeDetectorRef, Component, ComponentFactory, ComponentFactoryResolver,
  ComponentRef, Injectable, ViewContainerRef
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomService } from './dom.service';

@Injectable()
class DomServiceExposed extends DomService {
  get name(): string {
    return this._name;
  }

  getJQueryElement(selector: string | HTMLElement): JQuery<HTMLElement> {
    return super.getJQueryElement(selector);
  }

  getComponentElement<T>(componentRef: ComponentRef<T>) {
    return super.getComponentElement<T>(componentRef);
  }
}

describe('DomService', () => {
  let exposed: DomServiceExposed;
  let service: DomService;
  let applicationRef: ApplicationRef;
  let componentFactoryResolver: ComponentFactoryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DomServiceExposed]
    });

    applicationRef = TestBed.inject(ApplicationRef);
    componentFactoryResolver = TestBed.inject(ComponentFactoryResolver);

    exposed = TestBed.inject(DomServiceExposed);
    service = exposed;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have the correct name', () => {
    expect(`${exposed.name}Exposed`).toEqual(service.constructor.name);
  });

  let componentRefSpy: jasmine.SpyObj<ComponentRef<any>>;
  let componentFactorySpy: jasmine.SpyObj<ComponentFactory<any>>;
  let changeDetectorSpy: jasmine.SpyObj<ChangeDetectorRef>;
  let viewContainerRefSpy: jasmine.SpyObj<ViewContainerRef>;
  let resolveComponentFactorySpy: jasmine.Spy;

  beforeEach(() => {
    resolveComponentFactorySpy = spyOn(componentFactoryResolver, 'resolveComponentFactory');
    componentFactorySpy = jasmine.createSpyObj<ComponentFactory<any>>('ComponentFactory', ['create']);
    changeDetectorSpy = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['detectChanges']);
    viewContainerRefSpy = jasmine.createSpyObj<ViewContainerRef>('ViewContainerRef', ['clear', 'createComponent']);
    componentRefSpy = jasmine.createSpyObj<ComponentRef<any>>('ComponentRef', [], { 'changeDetectorRef': changeDetectorSpy });

    resolveComponentFactorySpy.and.returnValue(componentFactorySpy);
    componentFactorySpy.create.and.returnValue(componentRefSpy);
    viewContainerRefSpy.createComponent.and.returnValue(componentRefSpy);
  });

  describe('createChildComponent', () => {
    it('should call expected methods and return expected result', () => {
      const componentType = Component;
      const getJQueryElementSpy = spyOn(exposed, 'getJQueryElement');
      const getComponentElementSpy = spyOn(exposed, 'getComponentElement');
      const appendSpy = jasmine.createSpy('append');
      const attachViewSpy = spyOn(applicationRef, 'attachView');

      getJQueryElementSpy.and.returnValue({ length: 0, append: appendSpy as any } as JQuery<HTMLElement>);

      // ACT
      const result = service.createChildComponent(componentType, 'element-id', 'parent-id');

      expect(getJQueryElementSpy).toHaveBeenCalledWith('element-id');
      expect(getJQueryElementSpy).toHaveBeenCalledWith('parent-id');
      expect(resolveComponentFactorySpy).toHaveBeenCalledWith(componentType);
      expect(componentFactorySpy.create).toHaveBeenCalled();
      expect(attachViewSpy).toHaveBeenCalledWith(componentRefSpy.hostView);
      expect(getComponentElementSpy).toHaveBeenCalledWith(componentRefSpy);
      expect(changeDetectorSpy.detectChanges).toHaveBeenCalled();
      expect(appendSpy).toHaveBeenCalled();
      expect(result).toBe(componentRefSpy);
    });
  });

  describe('createComponent', () => {
    it('should call expected methods and return expected result', () => {
      const componentType = Component;

      const result = service.createComponent(componentType, viewContainerRefSpy);

      expect(viewContainerRefSpy.clear).toHaveBeenCalled();
      expect(resolveComponentFactorySpy).toHaveBeenCalledWith(componentType);
      expect(viewContainerRefSpy.createComponent).toHaveBeenCalledWith(componentFactorySpy);
      expect(result).toBe(componentRefSpy);
    });
  });
});
