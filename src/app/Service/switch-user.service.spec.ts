import { TestBed } from '@angular/core/testing';

import { SwitchUserService } from './switch-user.service';

describe('SwitchUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SwitchUserService = TestBed.get(SwitchUserService);
    expect(service).toBeTruthy();
  });
});
