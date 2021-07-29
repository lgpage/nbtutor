import { MockDirective } from 'ng-mocks';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AnchorFromDirective, AnchorToDirective } from '@app/directives';
import { DefaultRenderOptions, HeapObject, KeyValuePairHeapObject } from '@app/models';
import { KeyValuePairObjectComponent } from './key-value-pair-object.component';

describe('KeyValuePairObjectComponent', () => {
  let nativeElement: HTMLElement;
  let component: KeyValuePairObjectComponent;
  let fixture: ComponentFixture<KeyValuePairObjectComponent>;

  let getObjectValueSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        KeyValuePairObjectComponent,
        MockDirective(AnchorFromDirective),
        MockDirective(AnchorToDirective),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValuePairObjectComponent);
    nativeElement = fixture.nativeElement;

    component = fixture.componentInstance;
    component.heapObject = {
      uuid: 'uuid',
      type: 'dict',
      references: { a: { id: '11', uuid: 'var-uuid' } }
    } as any as KeyValuePairHeapObject;

    getObjectValueSpy = spyOn(component, 'getObjectValue').and.returnValue('var-value');
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
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
      expect(typeDiv.textContent).toEqual('dict');
    });
  });

  describe('tableElement', () => {
    it('should be created', () => {
      const tableElement = nativeElement.querySelectorAll('.key-value');
      expect(tableElement).toBeTruthy();
    });
  });

  describe('keyElements', () => {
    it('should have the expected keys', () => {
      const keyElements = nativeElement.querySelectorAll('.key');
      expect(keyElements.length).toEqual(1);
      expect(keyElements[0].textContent).toEqual('a');
    });
  });

  describe('valueElements', () => {
    it('should have the expected variable values', () => {
      const valueElements = nativeElement.querySelectorAll('.anchor-from > div');

      expect(valueElements.length).toEqual(1);
      expect(valueElements[0].id).toEqual('var-uuid');
      expect(valueElements[0].textContent).toEqual('var-value');

      expect(getObjectValueSpy).toHaveBeenCalledWith('a');
    });
  });

  describe('concatElements', () => {
    describe('when concat is false', () => {
      it('should be hidden', () => {
        component.renderOptions = { concat: false };

        fixture.detectChanges();
        const keyElements = nativeElement.querySelectorAll('.key');
        const valueElements = nativeElement.querySelectorAll('.anchor-from');
        const len = keyElements.length;

        expect(keyElements[len - 1]).toBeTruthy();
        expect(valueElements[len - 1]).toBeTruthy();

        expect(keyElements[len - 1].textContent).toEqual('a');
        expect(valueElements[len - 1].textContent).toEqual('var-value');
      });
    });

    describe('when concat is true', () => {
      it('should be shown with children ', () => {
        component.renderOptions = { concat: true };

        fixture.detectChanges();
        const keyElements = nativeElement.querySelectorAll('.key');
        const valueElements = nativeElement.querySelectorAll('.anchor-from');
        const len = keyElements.length;

        expect(keyElements[len - 1]).toBeTruthy();
        expect(valueElements[len - 1]).toBeTruthy();

        expect(keyElements[len - 1].textContent).toEqual('');
        expect(valueElements[len - 1].textContent).toEqual('...');
      });
    });
  });

  describe('ngOnInit', () => {
    it('should set values as expected', () => {
      component.heapObject = {
        references: { key: { id: '11' } },
        renderOptions: { concat: true }
      } as unknown as KeyValuePairHeapObject;

      component.ngOnInit();

      expect(component.keys).toEqual(['key']);
      expect(component.references).toBe(component.heapObject.references);
      expect(component.renderOptions).toEqual({ ...DefaultRenderOptions, concat: true });
    });
  });

  describe('getObjectValue', () => {
    it('getObjectValue', () => {
      getObjectValueSpy.and.callThrough();
      component.references = { key: { id: '11' } };

      component.heap = { ids: [], entities: {} };
      expect(component.getObjectValue('key')).toBeNull();

      component.heap = { ids: ['11'], entities: { '11': {} as HeapObject } };
      expect(component.getObjectValue('key')).toBeNull();

      component.heap = { ids: ['11'], entities: { '11': { hideReferences: true, value: 'value' } as HeapObject } };
      expect(component.getObjectValue('key')).toEqual('value');
    });
  });
});
