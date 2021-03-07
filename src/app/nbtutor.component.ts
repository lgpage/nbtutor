import { environment } from 'environments/environment';
import { Component } from '@angular/core';
import { NbtutorService } from './services/nbtutor.service';
import { MockNotebookNamespace } from './testing/mock-notebook-namespace';

@Component({
  selector: 'nbtutor-root',
  template: '',
})
export class NbtutorComponent {
  constructor(
    public nbtutorSvc: NbtutorService,
  ) {
    if (!environment.production) {
      const jupyter = new MockNotebookNamespace();
      nbtutorSvc.initForNotebook(jupyter, null);
    }
  }
}
