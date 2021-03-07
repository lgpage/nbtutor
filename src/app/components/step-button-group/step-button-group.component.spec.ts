import { hot } from 'jasmine-marbles';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ButtonActions } from '@app/store/actions';
import { NbtutorState } from '@app/store/reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StepButtonGroupComponent } from './step-button-group.component';

class StepButtonGroupComponentExposed extends StepButtonGroupComponent {
  get observables() {
    return this._observables;
  }
}

describe('StepButtonGroupComponent', () => {
  let fixture: ComponentFixture<StepButtonGroupComponentExposed>;
  let exposed: StepButtonGroupComponentExposed;
  let component: StepButtonGroupComponent;
  let store: MockStore<NbtutorState>;
  let componentElement: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StepButtonGroupComponentExposed],
      providers: [
        provideMockStore<NbtutorState>(),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(StepButtonGroupComponentExposed);

    exposed = fixture.componentInstance;
    componentElement = fixture.nativeElement;
    component = exposed;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    describe('setStep$', () => {
      it('should emit expected values and call expected methods', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        const valueThrottledSpy = spyOnProperty(component, 'valueThrottled$');

        valueThrottledSpy.and.returnValue(hot('fpnl', { f: 'first', p: 'previous', n: 'next', l: 'last' }));

        component.ngOnInit();

        const setStep$ = exposed.observables[0];
        expect(setStep$).toBeObservable(hot('fpnl', {
          f: ButtonActions.first(),
          p: ButtonActions.previous(),
          n: ButtonActions.next(),
          l: ButtonActions.last()
        }));

        expect(dispatchSpy).toHaveBeenCalledWith(ButtonActions.first());
        expect(dispatchSpy).toHaveBeenCalledWith(ButtonActions.previous());
        expect(dispatchSpy).toHaveBeenCalledWith(ButtonActions.next());
        expect(dispatchSpy).toHaveBeenCalledWith(ButtonActions.last());
      });
    });
  });

  describe('setStep', () => {
    it('should emit event', (done) => {
      component.value$.subscribe(c => {
        expect(c).toEqual('next');
        done();
      });

      component.setStep('next');
    });
  });

  describe('step buttons', () => {
    let buttonElements: NodeListOf<HTMLButtonElement>;

    beforeEach(() => {
      buttonElements = componentElement.querySelectorAll('.nbtutor.btn');
    });

    it('should be created', () => {
      expect(buttonElements).toBeTruthy();
      expect(buttonElements.length).toEqual(4);

      buttonElements.forEach(btnElement => {
        expect(btnElement).toBeTruthy();
      });
    });

    describe('on click', () => {
      it('should call setStep', () => {
        const setStepSpy = spyOn(component, 'setStep');

        buttonElements.forEach((btnElement, i) => {
          btnElement.click();
          fixture.detectChanges();
        });

        expect(setStepSpy).toHaveBeenCalledWith('first');
        expect(setStepSpy).toHaveBeenCalledWith('previous');
        expect(setStepSpy).toHaveBeenCalledWith('next');
        expect(setStepSpy).toHaveBeenCalledWith('last');
      });
    });
  });
});
