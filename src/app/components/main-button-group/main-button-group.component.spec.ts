import { hot } from 'jasmine-marbles';
import { MockComponent } from 'ng-mocks';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ButtonActions } from '@app/store/actions';
import { NbtutorState } from '@app/store/reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StepButtonGroupComponent } from '../step-button-group/step-button-group.component';
import { MainButtonGroupComponent } from './main-button-group.component';

class MainButtonGroupComponentExposed extends MainButtonGroupComponent {
  get observables() {
    return this._observables;
  }
}

describe('MainButtonGroupComponent', () => {
  let fixture: ComponentFixture<MainButtonGroupComponentExposed>;
  let exposed: MainButtonGroupComponentExposed;
  let component: MainButtonGroupComponent;
  let store: MockStore<NbtutorState>;
  let nativeElement: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainButtonGroupComponentExposed,
        MockComponent(StepButtonGroupComponent),
      ],
      providers: [
        provideMockStore<NbtutorState>(),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(MainButtonGroupComponentExposed);

    exposed = fixture.componentInstance;
    nativeElement = fixture.nativeElement;

    component = exposed;
    component.id = 'id';

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    describe('toggleVisualization$', () => {
      it('should emit expected values and call expected methods', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        const valueThrottledSpy = spyOnProperty(component, 'valueThrottled$');

        valueThrottledSpy.and.returnValue(hot('a-a', { a: 1 }));

        component.ngOnInit();
        expect(exposed.observables[0]).toBeObservable(hot('a-a', { a: 1 }));
        expect(dispatchSpy).toHaveBeenCalledWith(ButtonActions.toggleVisualization());
      });
    });
  });

  describe('toggleVisualization', () => {
    it('should emit event', (done) => {
      const event = {} as MouseEvent;

      component.value$.subscribe(c => {
        expect(c).toBe(event);
        done();
      });

      component.toggleVisualization(event);
    });
  });

  describe('btnGroupDiv button', () => {
    it('should have expected id', () => {
      const div = nativeElement.querySelector('.btn-group');

      expect(div).toBeTruthy();
      expect(div.id).toEqual('id');
    });
  });

  describe('toggleVisualization button', () => {
    let buttonElement: HTMLButtonElement;
    beforeEach(() => {
      buttonElement = nativeElement.querySelector('.nbtutor.btn');
    });

    it('should be created', () => {
      expect(buttonElement).toBeTruthy();
    });

    describe('on click', () => {
      it('should call toggleVisualization', () => {
        const toggleVisualizationSpy = spyOn(component, 'toggleVisualization');

        buttonElement.click();
        fixture.detectChanges();

        expect(toggleVisualizationSpy).toHaveBeenCalled();
      });
    });
  });

  describe('step button group component', () => {
    let stepButtonGroupElement: HTMLElement;
    beforeEach(() => {
      stepButtonGroupElement = nativeElement.querySelector('nbtutor-step-button-group');
    });

    it('should be created', () => {
      expect(stepButtonGroupElement).toBeTruthy();
    });
  });
});
