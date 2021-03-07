import { ComponentRef, Type, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Heap, HeapObject, HeapObjectRender } from '@app/models';
import { CellDataService, DomService } from '@app/services';
import { BaseObjectDirective } from '../base-object-directive';
import { CodeObjectComponent } from '../basic-object/basic-object.component';
import {
  KeyValuePairObjectComponent
} from '../key-value-pair-object/key-value-pair-object.component';
import { SequenceObjectComponent } from '../sequence-object/sequence-object.component';
import { HeapObjectComponent } from './heap-object.component';

class HeapObjectComponentExposed extends HeapObjectComponent {
  setContainer(container: { viewContainerRef: ViewContainerRef }): void {
    this._container = container;
  }

  resolveObjectComponent(renderType: HeapObjectRender): Type<BaseObjectDirective> {
    return super.resolveObjectComponent(renderType);
  }
}

describe('HeapObjectComponent', () => {
  let exposed: HeapObjectComponentExposed;
  let component: HeapObjectComponent;
  let fixture: ComponentFixture<HeapObjectComponentExposed>;

  let domServiceSpy: jasmine.SpyObj<DomService>;
  let cellDataServiceSpy: jasmine.SpyObj<CellDataService>;

  beforeEach(waitForAsync(() => {
    domServiceSpy = jasmine.createSpyObj<DomService>('DomService', ['createComponent']);
    cellDataServiceSpy = jasmine.createSpyObj<CellDataService>('CellDataService', ['heapObjectRendered']);

    TestBed.configureTestingModule({
      declarations: [HeapObjectComponentExposed],
      providers: [
        { provide: DomService, useValue: domServiceSpy },
        { provide: CellDataService, useValue: cellDataServiceSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeapObjectComponentExposed);
    exposed = fixture.componentInstance;

    component = exposed;
    component.heapObject = {} as HeapObject;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('resolveObjectComponent', () => {
    it('should return expected results', () => {
      expect(exposed.resolveObjectComponent(null)).toEqual(null);
      expect(exposed.resolveObjectComponent('basic')).toEqual(CodeObjectComponent);
      expect(exposed.resolveObjectComponent('sequence')).toEqual(SequenceObjectComponent);
      expect(exposed.resolveObjectComponent('kvp')).toEqual(KeyValuePairObjectComponent);
    });
  });

  describe('ngOnInit', () => {
    let resolveObjectComponentSpy: jasmine.Spy;
    beforeEach(() => {
      resolveObjectComponentSpy = spyOn(exposed, 'resolveObjectComponent');
    });

    it('should return expected results', () => {
      const instanceSpy = jasmine.createSpyObj<CodeObjectComponent>('Component', [], { 'heap': null, 'heapObject': null });
      const componentRefSpy = jasmine.createSpyObj<ComponentRef<any>>('ComponentRef', [], { 'instance': instanceSpy });
      const viewContainerRefSpy = jasmine.createSpyObj<ViewContainerRef>('ViewContainerRef', ['clear', 'createComponent']);

      component.heap = {} as Heap;
      component.heapObject = { renderType: 'basic' } as HeapObject;
      domServiceSpy.createComponent.and.returnValue(componentRefSpy);
      resolveObjectComponentSpy.and.returnValue(CodeObjectComponent);
      exposed.setContainer({ viewContainerRef: viewContainerRefSpy });

      // ACT
      component.ngOnInit();

      expect(resolveObjectComponentSpy).toHaveBeenCalledWith('basic');
      expect(domServiceSpy.createComponent).toHaveBeenCalled();
    });
  });
});
