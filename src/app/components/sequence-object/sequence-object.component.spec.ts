import { MockDirective } from 'ng-mocks';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AnchorFromDirective, AnchorToDirective } from '@app/directives';
import { DefaultRenderOptions, HeapObject, SequenceHeapObject } from '@app/models';
import { SequenceObjectComponent } from './sequence-object.component';

describe('SequenceObjectComponent', () => {
  let nativeElement: HTMLElement;
  let component: SequenceObjectComponent;
  let fixture: ComponentFixture<SequenceObjectComponent>;

  let getObjectValueSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SequenceObjectComponent,
        MockDirective(AnchorFromDirective),
        MockDirective(AnchorToDirective),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceObjectComponent);
    nativeElement = fixture.nativeElement;

    component = fixture.componentInstance;
    component.heapObject = {
      uuid: 'uuid',
      type: 'list',
      references: [{ id: '11', uuid: 'var-uuid' }]
    } as any as SequenceHeapObject;

    getObjectValueSpy = spyOn(component, 'getObjectValue').and.returnValue('var-value');
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(nativeElement).toBeTruthy();
  });

  describe('codeObjectDiv', () => {
    it('should have the expected id', () => {
      const codeObjectDiv = nativeElement.querySelector('.code-object');
      expect(codeObjectDiv.id).toEqual('uuid');
    });
  });

  describe('typeDiv', () => {
    it('should have the expected type', () => {
      const typeDiv = nativeElement.querySelector('.type');
      expect(typeDiv.textContent).toEqual('list');
    });
  });

  describe('indexElements', () => {
    it('should have the expected keys', () => {
      const indexElements = nativeElement.querySelectorAll('.index');
      expect(indexElements.length).toEqual(1);
      expect(indexElements[0].textContent).toEqual('0');
    });
  });

  describe('valueElements', () => {
    it('should have the expected variable values', () => {
      const valueElements = nativeElement.querySelectorAll('.anchor-from > div');

      expect(valueElements.length).toEqual(1);
      expect(valueElements[0].id).toEqual('var-uuid');
      expect(valueElements[0].textContent).toEqual('var-value');

      expect(getObjectValueSpy).toHaveBeenCalledWith({ id: '11', uuid: 'var-uuid' });
    });
  });

  describe('concatElements', () => {
    describe('when concat is false', () => {
      it('should be hidden', () => {
        component.renderOptions = { concat: false };

        fixture.detectChanges();
        const indexElements = nativeElement.querySelectorAll('.index');
        const valueElements = nativeElement.querySelectorAll('.anchor-from > div');
        const len = indexElements.length;

        expect(indexElements[len - 1]).toBeTruthy();
        expect(valueElements[len - 1]).toBeTruthy();

        expect(indexElements[len - 1].textContent).toEqual('0');
        expect(valueElements[len - 1].textContent).toEqual('var-value');
      });
    });

    describe('when concat is true', () => {
      it('should be shown', () => {
        component.renderOptions = { concat: true };

        fixture.detectChanges();
        const indexElements = nativeElement.querySelectorAll('.index');
        const valueElements = nativeElement.querySelectorAll('.anchor-from > div');
        const len = indexElements.length;

        expect(indexElements[len - 1]).toBeTruthy();
        expect(valueElements[len - 1]).toBeTruthy();

        expect(indexElements[len - 1].textContent).toEqual('');
        expect(valueElements[len - 1].textContent).toEqual('...');
      });
    });
  });

  describe('ngOnInit', () => {
    it('should set values as expected', () => {
      component.heapObject = {
        references: [{ id: '11' }],
        renderOptions: { concat: true }
      } as unknown as SequenceHeapObject;

      component.ngOnInit();

      expect(component.indexes).toEqual([0]);
      expect(component.references).toBe(component.heapObject.references);
      expect(component.renderOptions).toEqual({ ...DefaultRenderOptions, concat: true });
    });
  });

  describe('getObjectValue', () => {
    it('getObjectValue', () => {
      getObjectValueSpy.and.callThrough();
      component.references = [{ id: '11' }];

      component.heap = { ids: [], entities: {} };
      expect(component.getObjectValue({ id: '11' })).toBeNull();

      component.heap = { ids: ['11'], entities: { '11': {} as HeapObject } };
      expect(component.getObjectValue({ id: '11' })).toBeNull();

      component.heap = { ids: ['11'], entities: { '11': { value: 'value', hideReferences: true } as HeapObject } };
      expect(component.getObjectValue({ id: '11' })).toEqual('value');
    });
  });
});
