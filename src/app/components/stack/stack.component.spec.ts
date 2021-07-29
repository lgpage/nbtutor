import { cold } from 'jasmine-marbles';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StackFrame, TraceStep } from '@app/models';
import { CellService } from '@app/services';
import { FrameComponent } from '../frame/frame.component';
import { StackComponent } from './stack.component';

describe('StackComponent', () => {
  let component: StackComponent;
  let fixture: ComponentFixture<StackComponent>;
  let nativeElement: HTMLElement;

  let frames: StackFrame[];
  let traceStep: TraceStep;
  let cellServiceSpy: jasmine.SpyObj<CellService>;

  beforeEach(waitForAsync(() => {
    frames = [{} as StackFrame];
    traceStep = { stack: { frames } } as TraceStep;

    cellServiceSpy = jasmine.createSpyObj<CellService>('CellService', ['setCodeCell']);
    cellServiceSpy.traceStep$ = of(traceStep);

    TestBed.configureTestingModule({
      declarations: [
        StackComponent,
        MockComponent(FrameComponent),
      ],
      providers: [
        { provide: CellService, useValue: cellServiceSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackComponent);
    nativeElement = fixture.nativeElement;

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(nativeElement).toBeTruthy();
  });

  it('should have the expected properties', () => {
    expect(component.traceStep$).toBeObservable(cold('(a|)', { a: traceStep }));
    expect(component.frames$).toBeObservable(cold('(a|)', { a: frames }));
  });

  describe('frameElement', () => {
    it('should be created', () => {
      const frameElement = nativeElement.querySelectorAll('.frame');

      expect(frameElement).toBeTruthy();
      expect(frameElement.length).toEqual(1);
      expect(frameElement[0]).toBeTruthy();
    });
  });
});
