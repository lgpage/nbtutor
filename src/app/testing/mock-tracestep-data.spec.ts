import { TestBed } from '@angular/core/testing';
import { MockTraceStepData } from './mock-tracestep-data';

describe('MockTraceStepData', () => {
  let service: MockTraceStepData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockTraceStepData]
    });

    service = TestBed.inject(MockTraceStepData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.traceStepdata).toBeTruthy();
    expect(service.traceStepdata.length).toBeGreaterThan(0);
  });
});
