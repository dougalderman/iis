import { TestBed } from '@angular/core/testing';

import { TakeSurveyService } from './take-survey.service';

describe('TakeSurveyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TakeSurveyService = TestBed.get(TakeSurveyService);
    expect(service).toBeTruthy();
  });
});
