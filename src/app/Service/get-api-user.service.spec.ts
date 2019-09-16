import { TestBed } from '@angular/core/testing';

import { GetApiUserService } from './get-api-user.service';

describe('GetApiUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetApiUserService = TestBed.get(GetApiUserService);
    expect(service).toBeTruthy();
  });
});
