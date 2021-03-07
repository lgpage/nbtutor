import { cold } from 'jasmine-marbles';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VisualizationData } from '@app/models';
import { CellService } from '@app/services/cell.service';
import { LegendComponent } from './legend.component';

describe('LegendComponent', () => {
  let fixture: ComponentFixture<LegendComponent>;
  let component: LegendComponent;
  let nativeElement: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LegendComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendComponent);

    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(nativeElement).toBeTruthy();
  });

  describe('visualization$', () => {
    it('should return expected results', () => {
      const data = { visualize: true } as VisualizationData;
      const cellSvc = {
        hasLineNumber$: cold('--0', [false]),
        visualization$: cold('--0', [data]),
      } as unknown as CellService;

      component.setCellService(cellSvc);

      expect(component.visualization$).toBeObservable(cold('--0', [data]));
    });
  });

  describe('showInfoMessage$', () => {
    describe('when hasLineNumbers is false and visualize is true', () => {
      let data: VisualizationData;
      let cellSvc: CellService;
      beforeEach(() => {
        data = { visualize: true } as VisualizationData;
        cellSvc = {
          hasLineNumber$: cold('0', [false]),
          visualization$: cold('0', [data]),
        } as unknown as CellService;

        component.setCellService(cellSvc);
      });

      it('should return expected results', () => {
        expect(component.showInfoMessage$).toBeObservable(cold('0', [true]));
      });
    });

    describe('when hasLineNumbers is true and visualize is true', () => {
      let data: VisualizationData;
      let cellSvc: CellService;
      beforeEach(() => {
        data = { visualize: true } as VisualizationData;
        cellSvc = {
          hasLineNumber$: cold('--0', [true]),
          visualization$: cold('--0', [data]),
        } as unknown as CellService;

        component.setCellService(cellSvc);
      });

      it('should return expected results', () => {
        expect(component.showInfoMessage$).toBeObservable(cold('--0', [false]));
      });
    });
  });
});
