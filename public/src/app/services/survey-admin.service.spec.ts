import { TestBed } from '@angular/core/testing';

import { SurveyAdminService } from './survey-admin.service';

describe('SurveyAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SurveyAdminService = TestBed.get(SurveyAdminService);
    expect(service).toBeTruthy();
  });
});
