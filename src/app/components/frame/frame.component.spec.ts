import { MockDirective } from 'ng-mocks';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AnchorFromDirective } from '@app/directives';
import { StackFrame, TraceStep } from '@app/models';
import { CellService } from '@app/services';
import { FrameComponent } from './frame.component';

describe('FrameComponent', () => {
  let nativeElement: HTMLElement;
  let component: FrameComponent;
  let fixture: ComponentFixture<FrameComponent>;

  let frame: StackFrame;

  let getObjectValueSpy: jasmine.Spy;
  let cellServiceSpy: jasmine.SpyObj<CellService>;

  beforeEach(waitForAsync(() => {
    frame = {
      id: 'id',
      uuid: 'uuid',
      name: 'name',
      variables: [{ id: 'var-id', uuid: 'var-uuid', name: 'var-name' }],
      event: 'event'
    };

    cellServiceSpy = jasmine.createSpyObj<CellService>('CellService', ['setCodeCell']);

    TestBed.configureTestingModule({
      declarations: [
        FrameComponent,
        MockDirective(AnchorFromDirective),
      ],
      providers: [
        { provide: CellService, useValue: cellServiceSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameComponent);
    nativeElement = fixture.nativeElement;
    component = fixture.componentInstance;

    component.frame = frame;
    component.traceStep = {} as TraceStep;

    getObjectValueSpy = spyOn(component, 'getObjectValue').and.returnValue('var-value');

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(nativeElement).toBeTruthy();
  });

  describe('tableElement', () => {
    it('should have the expected id', () => {
      const tableElement = nativeElement.querySelector('table');
      expect(tableElement.id).toEqual('uuid');
    });
  });

  describe('tableHeaderElement', () => {
    it('should have the expected name', () => {
      const tableHeaderElements = nativeElement.querySelectorAll('th');

      expect(tableHeaderElements.length).toEqual(1);
      expect(tableHeaderElements[0].textContent).toEqual('name');
    });
  });

  describe('varNameElements', () => {
    it('should have the expected variable names', () => {
      const varNameElements = nativeElement.querySelectorAll('.var-name');

      expect(varNameElements.length).toEqual(1);
      expect(varNameElements[0].textContent).toEqual('var-name');
    });
  });

  describe('varValueElements', () => {
    it('should have the expected variable values', () => {
      const varValueElements = nativeElement.querySelectorAll('.anchor-from > div');

      expect(varValueElements.length).toEqual(1);
      expect(varValueElements[0].id).toEqual('var-uuid');
      expect(varValueElements[0].textContent).toEqual('var-value');

      expect(getObjectValueSpy).toHaveBeenCalledWith(component.frame.variables[0]);
    });
  });

  describe('getObjectValue', () => {
    it('should return expected results', () => {
      const variable = component.frame.variables[0];
      const traceStep = { heap: { ids: [variable.id], entities: { [variable.id]: { value: 'value' } } } } as TraceStep;

      getObjectValueSpy.and.callThrough();

      component.traceStep = { heap: { ids: [], entities: {} } } as TraceStep;
      expect(component.getObjectValue(variable)).toBeNull();

      component.traceStep = traceStep;
      expect(component.getObjectValue(variable)).toBeNull();

      component.traceStep.heap.entities[variable.id].hideReferences = true;
      expect(component.getObjectValue(variable)).toEqual('value');
    });
  });
});
