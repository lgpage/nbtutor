import { MockDirective } from 'ng-mocks';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AnchorToDirective } from '@app/directives';
import { CodeObjectComponent } from './basic-object.component';

describe('BasicObjectComponent', () => {
  let nativeElement: HTMLElement;
  let fixture: ComponentFixture<CodeObjectComponent>;
  let component: CodeObjectComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CodeObjectComponent,
        MockDirective(AnchorToDirective),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeObjectComponent);
    nativeElement = fixture.nativeElement;
    component = fixture.componentInstance;

    component.heap = { ids: [], entities: {} };
    component.heapObject = { id: 'id', uuid: 'uuid', type: 'int', value: '12', renderType: 'basic' };

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
      expect(typeDiv.textContent).toEqual('int');
    });
  });

  describe('valueDiv', () => {
    it('should have the expected value', () => {
      const valueDiv = nativeElement.querySelector('.value');
      expect(valueDiv.textContent).toEqual('12');
    });
  });
});
