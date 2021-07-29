import { cold } from 'jasmine-marbles';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Heap, HeapObject } from '@app/models';
import { CellService } from '@app/services';
import { HeapObjectComponent } from '../heap-object/heap-object.component';
import { HeapComponent } from './heap.component';

describe('HeapComponent', () => {
  let fixture: ComponentFixture<HeapComponent>;
  let component: HeapComponent;
  let nativeElement: HTMLElement;

  let heap: Heap;
  let heapObject: HeapObject;
  let cellServiceSpy: jasmine.SpyObj<CellService>;

  beforeEach(waitForAsync(() => {
    heapObject = { value: 'value', hideReferences: false } as HeapObject;
    heap = { ids: ['id'], entities: { id: heapObject } };

    cellServiceSpy = jasmine.createSpyObj<CellService>('CellService', ['setCodeCell']);
    cellServiceSpy.heap$ = of(heap);

    TestBed.configureTestingModule({
      declarations: [
        HeapComponent,
        MockComponent(HeapObjectComponent),
      ],
      providers: [
        { provide: CellService, useValue: cellServiceSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeapComponent);
    nativeElement = fixture.nativeElement;
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(nativeElement).toBeTruthy();
  });

  it('should have expected properties', () => {
    expect(component.heap$).toBeObservable(cold('(a|)', { a: heap }));
    expect(component.heapObjects$).toBeObservable(cold('(a|)', { a: [heapObject] }));
  });

  describe('heapObjectElement', () => {
    describe('when hideReferences is false', () => {
      it('show be shown', () => {
        const heapObjectElement = nativeElement.querySelector('.heap-object');
        expect(heapObjectElement).toBeTruthy();
      });
    });
  });
});
