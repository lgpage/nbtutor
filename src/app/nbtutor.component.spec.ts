import { TestBed, waitForAsync } from '@angular/core/testing';
import { NbtutorComponent } from './nbtutor.component';
import { NbtutorService } from './services/nbtutor.service';
import { MockNotebookNamespace } from './testing/mock-notebook-namespace';

class MockNbtutorService {
  initForNotebook(jupyter: NotebookNamespace, events: NotebookEvents): void { }
}

describe('NbtutorComponent', () => {
  let service: NbtutorService;
  let initForNotebookSpy: jasmine.Spy<any>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NbtutorComponent],
      providers: [
        { provide: NbtutorService, useClass: MockNbtutorService }
      ]
    }).compileComponents();

    service = TestBed.inject(NbtutorService);
    initForNotebookSpy = spyOn(service, 'initForNotebook');
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(NbtutorComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('when environment is development', () => {
    it('should initialize for Notebook', () => {
      TestBed.createComponent(NbtutorComponent);
      expect(initForNotebookSpy).toHaveBeenCalledWith(new MockNotebookNamespace(), null);
    });
  });
});
