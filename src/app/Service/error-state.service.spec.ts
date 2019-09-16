import { TestBed } from '@angular/core/testing';

import { ErrorStateService } from './error-state.service';

describe('ErrorStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErrorStateService = TestBed.get(ErrorStateService);
    expect(service).toBeTruthy();
  });
});
