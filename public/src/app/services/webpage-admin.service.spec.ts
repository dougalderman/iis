import { TestBed } from '@angular/core/testing';

import { WebpageAdminService } from './webpage-admin.service';

describe('WebpageAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebpageAdminService = TestBed.get(WebpageAdminService);
    expect(service).toBeTruthy();
  });
});
